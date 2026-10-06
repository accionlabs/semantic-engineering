"""Assembles the per-act drafts into the script and the storyboard, and checks the narration.

Reads   MEDIA/video/drafts/overview.md and act-1.md … act-6.md
Writes  MEDIA/video/script.md                (scene list, then the narration act by act)
        MEDIA/video/storyboard.md section 2  (the scene treatments, after the visual system)
Checks  every narration sentence against the writing rules and the rule that a clip can start at any
        sentence, and prints the problems.

    python3 new-site/script/assemble.py
"""
import pathlib
import re
import sys

MEDIA = pathlib.Path.home() / 'Documents/Documentation System/content/shared/accion-2.0/semantic-engineering-site-media/video'
PARTS = [('overview', 'Overview'), ('act-1', 'Act 1. The shared problem'), ('act-2', 'Act 2. The methodology'),
         ('act-3', 'Act 3. Knowledge graphs and agents in the AI-driven SDLC, with Breeze.AI'),
         ('act-4', 'Act 4. Legacy modernization, with ASIMOV'), ('act-5', 'Act 5. Working together')]
WPS = 2.6
OPENERS = r'(They|It|That|This|These|Those|And|So|Here|But|Further down|Its|Their|Then|Also)\b'
RULES = [
    (r'[—–]', 'dash'),
    (r'\bhonest', '"honest"'),
    (r'\w, not (a|an|the|just|only|merely|\w+)\b', 'contrast "X, not Y"'),
    (r"\bnot\b[^.]{0,80}\. (It|This|That|They) (is|are)\b", 'contrast "not X. It is Y"'),
    (r"\b(is|are)(n't| not)\b[^.]{0,60}[;,] (it|they) (is|are)\b", 'contrast "is not X, it is Y"'),
    (r'\b(the site|this site|on the site|the page|this page|\w+ page)\b', 'refers to where the video is hosted'),
    (r'\b(video|act \d|this act|each act|next act|the comparison|this scene|the next scene)\b', 'refers to the video itself'),
    (r'\b(revolutionary|game-changing|cutting-edge|seamless|unlock|world-class|best-in-class)\b', 'sales language'),
]

problems, scenes, boards = [], [], []
for slug, title in PARTS:
    path = MEDIA / 'drafts' / f'{slug}.md'
    if not path.exists():
        problems.append(f'{slug}: no draft yet')
        continue
    text = path.read_text()
    notes = text.split('### Notes for the author', 1)
    body = notes[0]  # the drafters' notes stay in drafts/ for the author
    # Split into scenes at "### Scene" or "## Overview".
    chunks = re.split(r'^(?=### Scene \d+|## Overview)', body, flags=re.M)
    for c in chunks:
        m = re.match(r'(?:### Scene (\d+):?\s*(.*)|## Overview)', c)
        if not m:
            continue
        n = int(m.group(1)) if m.group(1) else 0
        name = (m.group(2) or 'Overview').strip()
        c = re.sub(r'^(>.*)$', lambda m: re.sub(r'\s*\(s\d+\)\s*', ' ', m.group(1)).replace('  ', ' ').rstrip(), c, flags=re.M)  # sentence markers some drafts add
        pieces = re.split(r'^#{3,4} Storyboard[^\n]*\n', c, maxsplit=1, flags=re.M)
        script, board = pieces[0], (pieces[1] if len(pieces) > 1 else '')
        narration = ' '.join(l[1:].strip() for l in script.splitlines() if l.startswith('>'))
        words = len(narration.split())
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"])', narration)
        for i, s in enumerate(sentences, 1):
            if re.match(OPENERS, s):
                problems.append(f'scene {n} s{i}: opens with "{s.split()[0]}": {s[:70]}')
            for pat, what in RULES:
                if re.search(pat, s, re.I if what != 'dash' else 0):
                    problems.append(f'scene {n} s{i}: {what}: {s[:90]}')
            if len(s.split()) > 34:
                problems.append(f'scene {n} s{i}: {len(s.split())} words, long for a voice')
        cited = [int(x) for x in re.findall(r'\(s(\d+)', board)] + [int(x) for x in re.findall(r'\bs(\d+)\b', board)]
        if cited and max(cited) != len(sentences):
            problems.append(f'scene {n}: storyboard beats run to s{max(cited)}, narration has {len(sentences)} sentences')
        scenes.append({'n': n, 'name': name, 'part': title, 'words': words, 'sentences': len(sentences), 'script': script.strip(), 'board': board.strip()})

# ---------- script.md ----------
total = sum(s['words'] for s in scenes)
out = ['# Narration script: Semantic Engineering', '',
       '**Status:** first pass, assembled from the per-act drafts, for the author to refine. No voice is generated until the author has approved the script and the animations.', '',
       f'**Length:** {total} words, about {total / WPS / 60:.0f} minutes at {WPS} words per second, plus the 0.7 second gaps between sentences.', '',
       '**Companion documents:** `storyline.md`, `storyboard.md`. Per-act drafts with the drafters\' notes: `drafts/`.', '',
       '## Scene list', '', '| Scene | Part | Title | Words | Seconds |', '|---|---|---|---|---|']
for s in scenes:
    out.append(f"| {s['n'] or 'Overview'} | {s['part'].split('.')[0]} | {s['name']} | {s['words']} | {s['words'] / WPS:.0f} |")
part = None
for s in scenes:
    if s['part'] != part:
        part = s['part']
        out += ['', f'## {part}', '']
    out += [s['script'], '']
(MEDIA / 'script.md').write_text('\n'.join(out) + '\n')

# ---------- storyboard.md section 2 ----------
sb = (MEDIA / 'storyboard.md').read_text()
head = sb.split('## 2. Scene by scene', 1)[0]
sec = ['## 2. Scene by scene', '',
       'Each scene gives the picture at the start, the beats in order (each tied to sentences of the narration: s1, s2 …), the site diagram it builds on, the text on screen, and the targets a viewer can click on the site.', '']
part = None
for s in scenes:
    if s['part'] != part:
        part = s['part']
        sec += [f'### {part}', '']
    sec += [f"#### {'Overview' if not s['n'] else 'Scene ' + str(s['n']) + '. ' + s['name']}", '', re.sub(r'^#{3,4} Storyboard[^\n]*\n', '', s['board']).strip(), '']
(MEDIA / 'storyboard.md').write_text(head + '\n'.join(sec) + '\n')

# ---------- narration.json for the animation engine ----------
ACTS = {str(i): t.split('. ', 1)[-1] for i, (_, t) in enumerate(PARTS)}
nar = {'acts': ACTS, 'scenes': []}
for sc in scenes:
    body = ' '.join(l[1:].strip() for l in sc['script'].splitlines() if l.startswith('>'))
    sents = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"])', body)
    act = next(i for i, (_, t) in enumerate(PARTS) if t == sc['part'])
    nar['scenes'].append({'act': act, 'n': sc['n'], 'title': sc['name'], 'text': body, 'words': len(body.split()), 'sentences': sents})
ANIM = pathlib.Path(__file__).resolve().parent.parent / 'video/animation/src/narration.json'
import json
ANIM.write_text(json.dumps(nar, indent=1))

print(f'{len(scenes)} scenes, {total} words, about {total / WPS / 60:.1f} minutes')
print('\n'.join(problems) if problems else 'narration checks: no problems')
