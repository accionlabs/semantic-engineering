# The new site (work in progress on branch `site-model`)

Everything for the new site lives in this folder. The app in `site/app/` replaces the Hugo site at the switch. Until then the Hugo build on `main` is unchanged, and the repository's `content/` (`../content` from here) stays the source of truth for both.

Copied on 5 October 2026 from `~/Code/dialect-engineering` at commit `7f90f10`, to be adapted phase by phase: `site/app/` (Vite, React, TypeScript, the reel language, the Worker), `video/animation/` (the GSAP engine, parts and render scripts), `video/audio/` (voice and assembly) and `script/`. Requirements and decisions: `~/Documents/Documentation System/content/shared/accion-2.0/semantic-engineering-site-media/REQUIREMENTS.md`.
