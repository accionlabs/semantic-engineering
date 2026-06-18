# Semantic Engineering Site

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20745234.svg)](https://doi.org/10.5281/zenodo.20745234)

The public site documenting **Accion Labs' Semantic Engineering** approach to AI-led
software delivery: the methodology, the platform (Breeze.AI / ASIMOV), and the
operating model we run engagements under.

- **Live site:** https://semantic-engineering.ai/
- **Built with:** [Hugo](https://gohugo.io/) (static site generator) + the
  [Hextra](https://imfing.github.io/hextra/) theme
- **Source of truth:** the Markdown in `content/` and the SVGs in `static/diagrams/`
- **Publishing:** every push to `main` triggers a GitHub Actions build that pushes
  the output to the `gh-pages` branch, which is served at the custom domain
  (`semantic-engineering.ai`) by a separate deployment pipeline.

Content is plain Markdown, so you can edit it in any editor (VS Code, Obsidian,
Cowork, etc.). You do **not** need to be a developer to update copy, see
[Making content changes](#making-content-changes).

---

## Contents

- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Run the site locally](#run-the-site-locally)
- [Making content changes](#making-content-changes)
- [Editing diagrams](#editing-diagrams) ← **read this before touching any SVG**
- [Committing and publishing](#committing-and-publishing)
- [How it deploys](#how-it-deploys)
- [Citation and license](#citation-and-license)
- [Troubleshooting](#troubleshooting)

---

## Repository layout

```
semantic-engineering-site/
├── content/                  Markdown pages (the actual site content)
│   ├── _index.md             Home page
│   ├── sdlc/                 "Smarter SDLC" track (Breeze.AI)
│   │   ├── _index.md
│   │   ├── methodology.md  agents.md  case-archetypes.md  ...
│   │   ├── zones/           the maturity zones
│   │   └── process/         spec sprint, implementation sprint, team, ...
│   ├── modernization/        "Legacy Modernization" track (ASIMOV)
│   │   ├── _index.md
│   │   ├── engagement-modes/  process/  ...
│   ├── practitioner/         Breeze.AI, ASIMOV, contact
│   ├── resources/            glossary, etc.
│   └── about/                origins, copyright
├── static/
│   ├── diagrams/             All site SVG diagrams (referenced from Markdown)
│   ├── images/               logo.svg, logo-dark.svg
│   ├── css/se-diagrams.css   Theming variables for inline SVG diagrams
│   └── favicon.*             Favicon set
├── layouts/                  Project-specific theme overrides (render hooks, etc.)
├── scripts/fix-svg.py        Post-export repair for SVG diagrams (see below)
├── hugo.yaml                 Site configuration
├── serve.sh                  Start the local dev server
├── commit.sh                 Stage + commit + push helper
└── .github/workflows/        The deploy workflow
```

---

## Prerequisites

You need two tools installed (one-time setup). On macOS with
[Homebrew](https://brew.sh/):

```bash
brew install hugo go
```

- **Hugo (extended)**: `hugo version` should report `extended` and `>= 0.128`.
  (CI uses 0.148.1.)
- **Go**: required because the Hextra theme is pulled in as a Hugo Module.
- **Python 3**: only needed if you edit diagrams (for `fix-svg.py`); it ships
  with macOS.

You also need **git** and access to the `accionlabs/semantic-engineering` repo.
Clone it once:

```bash
git clone https://github.com/accionlabs/semantic-engineering.git
cd semantic-engineering
```

---

## Run the site locally

From the repo root:

```bash
./serve.sh
```

Then open **http://localhost:1313/** in your browser.

`serve.sh` stops any previous server, clears the build cache, and starts Hugo's
dev server with live-reload. **Leave it running** while you edit, the browser
refreshes automatically when you change content, diagrams, or styles. Press
**Ctrl-C** to stop it.

---

## Making content changes

1. Start the local server (`./serve.sh`).
2. Edit the relevant `.md` file under `content/`. Each page begins with a small
   frontmatter block:

   ```yaml
   ---
   title: "The Methodology"
   weight: 20          # controls order in the left sidebar (lower = higher)
   ---

   Body text in Markdown...
   ```

   - **Don't** start the body with an `# H1` that repeats the title, because the theme
     renders the `title:` as the page heading automatically.
   - **`weight`** sets the left-sidebar order within a section.
3. Watch the change in the browser, then [commit and publish](#committing-and-publishing).

Internal links between pages use normal relative Markdown links, e.g.
`[The Agents](agents.md)` or `[Origins](about/origins.md#some-heading)`; the build
resolves them to the right URLs.

---

## Editing diagrams

Diagrams are **SVG files** in `static/diagrams/`, referenced from Markdown like:

```markdown
![Semantic Engineering at a Glance](/diagrams/hero-semantic-engineering-at-a-glance.svg)
```

They're authored in a vector editor (Affinity Designer / Illustrator / Inkscape).
The site themes diagrams with CSS variables (so they adapt to light/dark mode and
the site font). **A vector editor strips that theming on export**: it bakes colors
to literal values, drops the styling class, and adds per-letter kerning that breaks
under the site's font.

### ⚠️ Always run `fix-svg.py` after editing any SVG

After you export/overwrite an SVG in `static/diagrams/`, run:

```bash
# Repair every diagram (safe to run repeatedly; it's a no-op on already-fixed files)
python3 scripts/fix-svg.py

# ...or just the one you changed
python3 scripts/fix-svg.py static/diagrams/breeze-vs-asimov.svg

# Preview what it would change without writing
python3 scripts/fix-svg.py --dry-run
```

This restores the theming variables, re-adds the `se-svg` class, ensures a
`viewBox` (so the diagram scales), flips hardcoded white fills for dark mode, and
flattens the kerning spans so text renders correctly. **If you skip this step, the
diagram will look wrong (off colors, broken dark mode, or garbled text).**

### Diagram editing checklist

1. Edit the artwork in your vector tool.
2. **Export/overwrite** the `.svg` directly into `static/diagrams/` (in Affinity,
   that's **File → Export → SVG**, *not* just ⌘S; a plain Save updates the native
   `.afdesign`, not the SVG).
3. Run `python3 scripts/fix-svg.py`.
4. Check it in the local site (`./serve.sh`), in **both light and dark mode**.
   Click the diagram; it should zoom.
5. [Commit and publish](#committing-and-publishing).

> Tip: browsers cache SVGs aggressively. If a diagram looks unchanged after editing,
> hard-refresh (**⌘⇧R**), or open DevTools → Network → **Disable cache** while iterating.

---

## Committing and publishing

When you're happy with your changes, run:

```bash
./commit.sh "short description of what changed"
```

**Who can publish:** the site is publish-protected. Only the **maintainer**
(`@bijoor`) can update the live site directly; `main` is branch-protected so all
other changes must go through a pull request the maintainer approves. `commit.sh`
handles this automatically based on who you are:

- **Maintainer** → commits straight to `main`, which triggers the deploy. Changes
  are live in a minute or two.
- **Everyone else** → the script creates a branch, pushes it, and opens a **pull
  request** addressed to the maintainer. Your changes go live only after the
  maintainer approves and merges it. (You'll get the PR link in the output.)
  For your next edit, switch back to `main` first: `git switch main && git pull`.

`commit.sh` needs the [GitHub CLI](https://cli.github.com/) (`gh`) installed and
authenticated (`gh auth login`) so it can identify you and open PRs.

If you'd rather do it by hand:

```bash
# Maintainer (direct):
git add -A && git commit -m "message" && git pull --rebase origin main && git push origin main

# Contributor (pull request):
git switch -c my-change && git add -A && git commit -m "message"
git push -u origin my-change
gh pr create --base main --reviewer bijoor
```

---

## How it deploys

- Pushing to **`main`** runs `.github/workflows/hugo.yml`.
- The workflow builds the site with Hugo (using `hugo.yaml`'s
  `https://semantic-engineering.ai/` baseURL) and pushes the output to the
  **`gh-pages`** branch.
- A separate deployment pipeline serves the `gh-pages` branch at
  **`semantic-engineering.ai`**. (GitHub Pages' own serving is disabled; the
  `gh-pages` branch is still produced on every push and must be retained.)
- No manual step is needed; just push to `main`.
- You can watch builds under the repo's **Actions** tab.

> The workflow publishes by pushing the built site to `gh-pages` (rather than the
> default GitHub-Pages OIDC deploy) because of org security policy. Don't switch
> the workflow to the `actions/deploy-pages` approach; it fails with a 401 in
> this org.

---

## Citation and license

This work is archived on Zenodo with a citable DOI:

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20745234.svg)](https://doi.org/10.5281/zenodo.20745234)

The **concept DOI** [10.5281/zenodo.20745234](https://doi.org/10.5281/zenodo.20745234)
always resolves to the latest version. GitHub also shows a **"Cite this repository"**
button, driven by [`CITATION.cff`](CITATION.cff); the deposit metadata is in
[`.zenodo.json`](.zenodo.json).

**Licensing:**
- **Content** (text, diagrams, structural arrangement): [CC-BY-4.0](LICENSE).
  Reuse and adapt with attribution to Accion Labs.
- **Code** (Hugo config, layouts, scripts): [MIT](LICENSE-CODE).
- **Trademarks:** "Semantic Engineering" and "Manual Translation Tax" are reserved
  marks of Accion Labs; the licenses above do not grant trademark rights. See the
  site's *About > Copyright and Trademark* for the full posture.

## Troubleshooting

- **Page is unstyled / CSS missing locally**: usually happens after editing
  `hugo.yaml` while the server is running. Restart it: `./serve.sh`.
- **A diagram looks wrong (colors, dark mode, garbled text)**: you forgot to run
  `python3 scripts/fix-svg.py` after editing the SVG.
- **A diagram or favicon won't update in the browser**: it's cached. Hard-refresh
  (**⌘⇧R**).
- **Search shows old titles locally**: the search index is cached in your browser;
  hard-refresh. (It's always correct on the deployed site.)
- **Broken internal links**: the build prints `render-link unresolved` warnings in
  the server log for `.md` links that point to moved/removed pages. Fix the link
  target in the Markdown.
- **`./commit.sh` push rejected / merge conflict**: someone (or a web edit) changed
  the remote. The script rebases automatically; if it reports a conflict, resolve the
  flagged file, then `git rebase --continue` and `git push`.
