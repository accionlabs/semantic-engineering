#!/usr/bin/env python3
"""
fix-svg.py — Repair Semantic Engineering site diagrams after an SVG editor
              round-trip (Affinity Designer, Illustrator, Inkscape, etc.).

What it fixes
-------------
1. Restores `var(--se-*, fallback)` color references that the editor collapsed
   into literal `rgb(...)` or `#hex` values.
2. Re-adds `class="se-svg"` to the root `<svg>` when the editor stripped it.
3. Adds a `viewBox` attribute when missing (derived from width/height) so
   the diagram scales responsively to its column.
4. Converts hardcoded white fills (`fill="white"`, `fill="#ffffff"`,
   `fill:#ffffff` inside style attributes, etc.) to
   `fill:var(--se-box-fill,#ffffff)` so dark mode flips them too.
5. Collapses accidentally-nested `var(--se-X, var(--se-X, #hex))` artifacts
   that earlier passes can produce.

Usage
-----
    # Fix every SVG in static/diagrams/
    python3 scripts/fix-svg.py

    # Fix one file
    python3 scripts/fix-svg.py static/diagrams/foo.svg

    # Fix several files
    python3 scripts/fix-svg.py static/diagrams/foo.svg static/diagrams/bar.svg

    # Dry-run (report what would change, write nothing)
    python3 scripts/fix-svg.py --dry-run

    # Quieter output
    python3 scripts/fix-svg.py --quiet

Exit status: 0 on success, 1 if any file could not be processed.
"""
from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from pathlib import Path

# --------------------------------------------------------------------------
# Canonical token table.
# Maps each literal color value (in every form an editor might export) to
# the CSS variable reference it should become. Variables match the names
# defined in static/css/se-diagrams.css.
# --------------------------------------------------------------------------

# (literal_form, replacement).
# Notes:
#   * Only full 6-character hex codes are included. 3-char shorthand like
#     `#111` would be a substring prefix of `#111111` and corrupt existing
#     content via `str.replace`.
#   * Every substitution is wrapped to skip inside existing var(...) blocks,
#     so running the script repeatedly is a true no-op.
COLOR_MAP: list[tuple[str, str]] = [
    # text
    ('rgb(17,17,17)',                'var(--se-text,#111111)'),
    ('rgb(17, 17, 17)',              'var(--se-text,#111111)'),
    ('#111111',                      'var(--se-text,#111111)'),
    # secondary text / arrows / box stroke (all share this slate)
    ('rgb(75,85,99)',                'var(--se-text-secondary,#4b5563)'),
    ('rgb(75, 85, 99)',              'var(--se-text-secondary,#4b5563)'),
    ('#4b5563',                      'var(--se-text-secondary,#4b5563)'),
    ('#4B5563',                      'var(--se-text-secondary,#4b5563)'),
    # accent (orange)
    ('rgb(233,78,27)',               'var(--se-accent,#E94E1B)'),
    ('rgb(233, 78, 27)',             'var(--se-accent,#E94E1B)'),
    ('#E94E1B',                      'var(--se-accent,#E94E1B)'),
    ('#e94e1b',                      'var(--se-accent,#E94E1B)'),
    # accent fill (light orange)
    ('rgb(253,232,221)',             'var(--se-accent-fill,#FDE8DD)'),
    ('rgb(253, 232, 221)',           'var(--se-accent-fill,#FDE8DD)'),
    ('#FDE8DD',                      'var(--se-accent-fill,#FDE8DD)'),
    ('#fde8dd',                      'var(--se-accent-fill,#FDE8DD)'),
    # panel fill (light gray)
    ('rgb(245,245,245)',             'var(--se-panel-fill,#f5f5f5)'),
    ('rgb(245, 245, 245)',           'var(--se-panel-fill,#f5f5f5)'),
    ('#f5f5f5',                      'var(--se-panel-fill,#f5f5f5)'),
    ('#F5F5F5',                      'var(--se-panel-fill,#f5f5f5)'),
    # panel-fill-alt
    ('rgb(250,250,250)',             'var(--se-panel-fill-alt,#fafafa)'),
    ('rgb(250, 250, 250)',           'var(--se-panel-fill-alt,#fafafa)'),
    ('#fafafa',                      'var(--se-panel-fill-alt,#fafafa)'),
    ('#FAFAFA',                      'var(--se-panel-fill-alt,#fafafa)'),
    # panel stroke
    ('rgb(156,163,175)',             'var(--se-panel-stroke,#9ca3af)'),
    ('rgb(156, 163, 175)',           'var(--se-panel-stroke,#9ca3af)'),
    ('#9ca3af',                      'var(--se-panel-stroke,#9ca3af)'),
    ('#9CA3AF',                      'var(--se-panel-stroke,#9ca3af)'),
    # grid (lighter gray, used for subtle separators)
    ('rgb(209,213,219)',             'var(--se-grid,#d1d5db)'),
    ('rgb(209, 213, 219)',           'var(--se-grid,#d1d5db)'),
    ('#d1d5db',                      'var(--se-grid,#d1d5db)'),
    ('#D1D5DB',                      'var(--se-grid,#d1d5db)'),
]

# White fill substitutions. Whites are special: every form must go to
# `var(--se-box-fill,#ffffff)` so dark mode flips the box background.
WHITE_MAP: list[tuple[str, str]] = [
    # Style-attribute (inside style="...") forms
    ('fill:#ffffff',                 'fill:var(--se-box-fill,#ffffff)'),
    ('fill:#FFFFFF',                 'fill:var(--se-box-fill,#ffffff)'),
    ('fill:#fff',                    'fill:var(--se-box-fill,#ffffff)'),
    ('fill:#FFF',                    'fill:var(--se-box-fill,#ffffff)'),
    ('fill:white',                   'fill:var(--se-box-fill,#ffffff)'),
    ('fill: white',                  'fill:var(--se-box-fill,#ffffff)'),
    ('fill:rgb(255,255,255)',        'fill:var(--se-box-fill,#ffffff)'),
    ('fill:rgb(255, 255, 255)',      'fill:var(--se-box-fill,#ffffff)'),
    # Attribute-form forms. We rewrite them into a style="..." replacement so
    # that var() resolves at render time. The merge_double_style pass below
    # then collapses any resulting double style="" attributes.
    ('fill="#ffffff"',               'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="#FFFFFF"',               'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="#fff"',                  'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="#FFF"',                  'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="white"',                 'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="rgb(255,255,255)"',      'style="fill:var(--se-box-fill,#ffffff)"'),
    ('fill="rgb(255, 255, 255)"',    'style="fill:var(--se-box-fill,#ffffff)"'),
]

# --------------------------------------------------------------------------
# Transform passes
# --------------------------------------------------------------------------

NESTED_VAR_PAT = re.compile(
    r'var\(--se-([\w-]+),\s*var\(--se-\1,\s*(#?[0-9a-fA-Fxa-z\(,\s\)]+?)\s*\)\s*\)'
)
SVG_OPEN_PAT = re.compile(r'<svg\b([^>]*)>', re.DOTALL)
ATTR_W_PAT = re.compile(r'\bwidth\s*=\s*"(\d+(?:\.\d+)?)(?:px)?"')
ATTR_H_PAT = re.compile(r'\bheight\s*=\s*"(\d+(?:\.\d+)?)(?:px)?"')
HAS_VIEWBOX_PAT = re.compile(r'\bviewBox\s*=')
HAS_CLASS_PAT = re.compile(r'\bclass\s*=')


_VAR_BLOCK_PAT = re.compile(r'var\([^()]*\)')


def replace_colors(text: str) -> tuple[str, int]:
    """Substitute literal colors with var() references.

    Idempotent: existing var(...) blocks are protected with placeholders during
    substitution so that the color inside a var() fallback (e.g. #111111 inside
    `var(--se-text,#111111)`) is not re-wrapped. The placeholders are restored
    after substitution.

    Returns (text, count) where count is the number of literal colors replaced.
    """
    # 1. Pull existing var(...) blocks out of the way.
    saved: list[str] = []

    def _stash(m: re.Match) -> str:
        saved.append(m.group(0))
        return f'\x00VAR{len(saved) - 1}\x00'

    text = _VAR_BLOCK_PAT.sub(_stash, text)

    # 2. Substitute literals on the bare text. Order longest-first so that no
    # entry is a prefix of another (rgb(...) variants are already disjoint;
    # 6-char hex codes never overlap each other).
    count = 0
    for old, new in COLOR_MAP + WHITE_MAP:
        c = text.count(old)
        if c:
            text = text.replace(old, new)
            count += c

    # 3. Restore the saved var() blocks in original order.
    def _unstash(m: re.Match) -> str:
        return saved[int(m.group(1))]

    text = re.sub(r'\x00VAR(\d+)\x00', _unstash, text)
    return text, count


def collapse_nested_vars(text: str) -> tuple[str, int]:
    """Collapse `var(--se-X, var(--se-X, #hex))` into `var(--se-X, #hex)`."""
    count = 0
    while True:
        new_text, n = NESTED_VAR_PAT.subn(r'var(--se-\1,\2)', text)
        if n == 0:
            break
        count += n
        text = new_text
    return text, count


_TEXT_TAG_PAT = re.compile(r'<text\b([^>]*)>', re.DOTALL)


def ensure_text_fill(text: str) -> tuple[str, int]:
    """Affinity occasionally exports a <text> element without any fill (typically
    when the source class set the fill and the class wrapper got stripped). The
    element then renders with the browser default (black), which is invisible
    in dark mode. This pass adds `fill:var(--se-text,#111111)` to any <text>
    that has a style attribute but no fill in its style or attribute set.

    Skip cases:
      * the element has a fill attribute or fill inside style already
      * the element has a class attribute (its fill probably comes from CSS)
      * the only style-shaped attribute is `font-style` (not `style`)
    """
    fixed = 0
    out: list[str] = []
    last = 0
    # Match `style=` only when preceded by whitespace, '>' or a tag start —
    # NOT when preceded by a word char, which would catch `font-style=`.
    style_attr_pat = re.compile(r'(?:^|(?<=[\s>]))style\s*=\s*"([^"]*)"')
    for m in _TEXT_TAG_PAT.finditer(text):
        attrs = m.group(1)
        # Skip if a fill attribute or class is set on the element
        if re.search(r'\bfill\s*=', attrs):
            continue
        if re.search(r'\bclass\s*=', attrs):
            continue
        style_m = style_attr_pat.search(attrs)
        if not style_m:
            continue
        style_val = style_m.group(1)
        if re.search(r'(?:^|[;\s])fill\s*:', style_val):
            continue
        # Inject the canonical text fill into the existing style attribute.
        new_style = style_val.rstrip().rstrip(';') + ';fill:var(--se-text,#111111)'
        new_attrs = attrs[:style_m.start(1)] + new_style + attrs[style_m.end(1):]
        out.append(text[last:m.start()])
        out.append('<text' + new_attrs + '>')
        last = m.end()
        fixed += 1
    out.append(text[last:])
    return ''.join(out), fixed


def merge_double_style_attrs(text: str) -> tuple[str, int]:
    """If an element ends up with two `style="..."` attributes after the white
    substitution, merge them into one semicolon-joined attribute."""
    count = 0
    out: list[str] = []
    i = 0
    while i < len(text):
        if text[i] == '<':
            j = text.find('>', i)
            if j == -1:
                out.append(text[i:])
                break
            tag = text[i:j + 1]
            styles = re.findall(r'\bstyle="([^"]*)"', tag)
            if len(styles) > 1:
                combined = ';'.join(s.strip().rstrip(';') for s in styles if s.strip())
                tag_clean = re.sub(r'\s*\bstyle="[^"]*"', '', tag)
                if tag_clean.endswith('/>'):
                    tag = tag_clean[:-2] + f' style="{combined}"' + '/>'
                else:
                    tag = tag_clean[:-1] + f' style="{combined}"' + '>'
                count += 1
            out.append(tag)
            i = j + 1
        else:
            out.append(text[i])
            i += 1
    return ''.join(out), count


def ensure_root_class(text: str) -> tuple[str, bool]:
    """Add `class="se-svg"` to the root <svg> if missing. Returns (text, added)."""
    m = SVG_OPEN_PAT.search(text)
    if not m:
        return text, False
    attrs = m.group(1)
    if HAS_CLASS_PAT.search(attrs):
        return text, False
    new_open = '<svg' + attrs + ' class="se-svg">'
    return text[:m.start()] + new_open + text[m.end():], True


def ensure_viewbox(text: str) -> tuple[str, bool]:
    """Add `viewBox="0 0 W H"` (and `preserveAspectRatio`) to the root <svg>
    if missing and a width/height pair is present."""
    m = SVG_OPEN_PAT.search(text)
    if not m:
        return text, False
    attrs = m.group(1)
    if HAS_VIEWBOX_PAT.search(attrs):
        return text, False
    w = ATTR_W_PAT.search(attrs)
    h = ATTR_H_PAT.search(attrs)
    if not (w and h):
        return text, False
    inject = f' viewBox="0 0 {w.group(1)} {h.group(1)}" preserveAspectRatio="xMidYMid meet"'
    new_open = '<svg' + inject + attrs + '>'
    return text[:m.start()] + new_open + text[m.end():], True


# --------------------------------------------------------------------------
# Per-file driver
# --------------------------------------------------------------------------

def process_file(path: Path, dry_run: bool = False) -> dict | None:
    """Apply all repair passes to a single file.

    Returns a stats dict, or None if the file could not be read.
    """
    try:
        text = path.read_text()
    except (OSError, UnicodeDecodeError) as exc:
        print(f"  ERROR reading {path}: {exc}", file=sys.stderr)
        return None
    original = text

    text, n_colors = replace_colors(text)
    text, n_collapsed = collapse_nested_vars(text)
    text, n_merged = merge_double_style_attrs(text)
    text, n_text_fills = ensure_text_fill(text)
    text, class_added = ensure_root_class(text)
    text, viewbox_added = ensure_viewbox(text)

    changed = text != original
    if changed and not dry_run:
        path.write_text(text)

    return {
        'path': path,
        'changed': changed,
        'colors_replaced': n_colors,
        'nested_vars_collapsed': n_collapsed,
        'double_styles_merged': n_merged,
        'text_fills_added': n_text_fills,
        'class_added': class_added,
        'viewbox_added': viewbox_added,
    }


def find_default_files() -> list[Path]:
    """Default: every *.svg under static/diagrams/, relative to the cwd."""
    return sorted(Path('static/diagrams').glob('*.svg'))


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        prog='fix-svg.py',
        description='Restore Semantic Engineering theming variables, '
                    'classes, and viewBox on SVG diagrams after an editor round-trip.',
    )
    p.add_argument(
        'files', nargs='*', type=Path,
        help='SVG file(s) to fix. Defaults to all SVGs in static/diagrams/.',
    )
    p.add_argument(
        '--dry-run', action='store_true',
        help='Report what would change but do not write any files.',
    )
    p.add_argument(
        '--quiet', '-q', action='store_true',
        help='Only print files that changed.',
    )
    args = p.parse_args(argv)

    files = args.files if args.files else find_default_files()
    if not files:
        print('No SVG files found.', file=sys.stderr)
        return 1

    # Resolve any globs the user might pass (some shells leave them literal)
    resolved: list[Path] = []
    for f in files:
        s = str(f)
        if any(ch in s for ch in '*?['):
            resolved.extend(Path(p) for p in glob.glob(s))
        else:
            resolved.append(f)
    files = resolved

    totals = {
        'files_scanned':  0,
        'files_changed':  0,
        'colors_replaced':       0,
        'nested_vars_collapsed': 0,
        'double_styles_merged':  0,
        'text_fills_added':      0,
        'classes_added':         0,
        'viewboxes_added':       0,
        'errors':                0,
    }

    for fp in files:
        if not fp.exists():
            print(f"  ERROR {fp}: does not exist", file=sys.stderr)
            totals['errors'] += 1
            continue
        stats = process_file(fp, dry_run=args.dry_run)
        if stats is None:
            totals['errors'] += 1
            continue
        totals['files_scanned'] += 1
        if stats['changed']:
            totals['files_changed'] += 1
        totals['colors_replaced']       += stats['colors_replaced']
        totals['nested_vars_collapsed'] += stats['nested_vars_collapsed']
        totals['double_styles_merged']  += stats['double_styles_merged']
        totals['text_fills_added']      += stats['text_fills_added']
        totals['classes_added']         += int(stats['class_added'])
        totals['viewboxes_added']       += int(stats['viewbox_added'])

        if stats['changed']:
            tags = []
            if stats['colors_replaced']:
                tags.append(f"{stats['colors_replaced']} colors")
            if stats['class_added']:
                tags.append('+class')
            if stats['viewbox_added']:
                tags.append('+viewBox')
            if stats['nested_vars_collapsed']:
                tags.append(f"{stats['nested_vars_collapsed']} nested")
            if stats['double_styles_merged']:
                tags.append(f"{stats['double_styles_merged']} merged-style")
            if stats['text_fills_added']:
                tags.append(f"{stats['text_fills_added']} +text-fill")
            note = '(dry-run)' if args.dry_run else ''
            print(f"  fixed {stats['path']}  [{', '.join(tags)}] {note}")
        elif not args.quiet:
            print(f"  ok    {stats['path']}")

    print()
    print('=== Summary ===')
    print(f"  files scanned:           {totals['files_scanned']}")
    print(f"  files changed:           {totals['files_changed']}"
          + ('  (dry-run, nothing written)' if args.dry_run else ''))
    print(f"  color tokens replaced:   {totals['colors_replaced']}")
    print(f"  nested var() collapsed:  {totals['nested_vars_collapsed']}")
    print(f"  double style= merged:    {totals['double_styles_merged']}")
    print(f"  text fills added:        {totals['text_fills_added']}")
    print(f"  class=\"se-svg\" added:    {totals['classes_added']}")
    print(f"  viewBox added:           {totals['viewboxes_added']}")
    if totals['errors']:
        print(f"  errors:                  {totals['errors']}")
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
