# The new site (work in progress on branch `site-model`)

Everything for the new site lives in this folder. The app in `site/app/` replaces the Hugo site at the switch. Until then the Hugo build on `main` is unchanged, and the repository's `content/` (`../content` from here) stays the source of truth for both.

Copied on 5 October 2026 from `~/Code/dialect-engineering` at commit `7f90f10`, to be adapted phase by phase: `site/app/` (Vite, React, TypeScript, the reel language, the Worker), `video/animation/` (the GSAP engine, parts and render scripts), `video/audio/` (voice and assembly) and `script/`. Requirements and decisions: `~/Documents/Documentation System/content/shared/accion-2.0/semantic-engineering-site-media/REQUIREMENTS.md`.

## Running it

```bash
cd new-site/site/app
npm install
npm run build      # content, type check, client and server builds, prerender every page
npm run preview    # http://localhost:4173
```

`npm run dev` serves the app with live reload; run `npm run content` again after editing Markdown.

Checks:

- `node scripts/check-parity.mjs` builds the Hugo site and compares every page's words, headings, diagrams, tables and links with the new build.
- `node scripts/check-pages.mjs` opens every page at desktop and phone widths in both themes (needs `npm run preview` running) and reports errors, overflow and unrendered diagrams, with screenshots in `new-site/site/checks/`.

Draft pages (`draft: true`) are built with a "Draft for review" note and `noindex`; `DRAFTS=off npm run build` leaves them out. Pages for review and their source maps are in `review/`.
