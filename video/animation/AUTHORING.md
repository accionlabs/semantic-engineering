# Authoring a scene

The video is one GSAP timeline. Each scene is a `SceneDef` in `src/scenes/`: React draws the scene once, standing still, and the scene's `build` function places every movement on the scene's own timeline, in seconds from the scene start. The film places the scenes one after another on a paused master timeline. The renderer seeks that timeline frame by frame; the website will play the same timeline live.

Read these before writing a scene:

- The storyboard (`video/storyboard.md` in the project documents, see the repository README): the visual system (section 1) and each scene's treatment (section 2). Follow the treatment for your scene.
- The script (`video/script.md` in the project documents): the approved narration. The on-screen figures and their sources for each scene are listed under "On screen, with source". Use only those figures.
- `src/narration.json`: the narration split into sentences. Sentence k of scene n is cue position `s<k>`.
- `src/scenes/s02-accumulation.tsx` and `src/scenes/s07-rules-today.tsx`: the two reference scenes. Copy their structure.

## The SceneDef

```tsx
export const sceneNN: SceneDef = {
  n: NN,                 // script scene number
  id: 'stable-slug',
  View: () => (<Frame act="Act 2" scene="Scene NN · Title"> ... </Frame>),
  build: (ctx) => { const { tl, q, cue } = ctx; ... },
};
```

- `View` is static markup. Give every element you will move a class. Class names are scoped to the scene by `q()`, but keep them descriptive.
- Anything that should start hidden gets the class `pre`. The film hides every `.pre` at time 0.
- `build(ctx)` schedules motion: `tl.to / tl.fromTo / tl.set`, positioned with numbers in seconds. Get positions from `cue(name, default)`, never from hard-coded seconds alone: `const at = cue('growth', 's2+0.3')`. Names let the author retime a beat in `src/cues.json` without touching code.
- Scene length is fixed by its narration (`ctx.duration`). Motion must fit inside it.

## Engine helpers (`src/engine/scene.tsx`)

- `appear(ctx, selector, at, vars?)`: fade in with a small rise. `vanish(ctx, selector, at, vars?)`: fade out.
- `focusBeats(ctx, beats, dim?)`: the one-focus rule. Each beat: `{ id, at, regions: ['.selector', ...], callout?: '.selector' }`. From `at`, that beat's regions go to full strength, every other region dims to 0.2, and its callout appears; the callout leaves when the next beat starts. Wrap each area of your diagram in a `<g className="r-...">` region.
- Captions are automatic. Do not draw your own narration text. Keep the bottom 150 px of the frame clear of important content.

## Parts (`src/parts/`)

- `makeStack(opts)`: the stack of layers with the multi-tenancy line. Render `<stack.View />` inside an `<Svg>`. Operations, each scheduled at a time: `tenants(ctx, n, at, dur)`, `line(ctx, lineAt, at, dur)`, `lit(ctx, band|null, at, dim)`, `relabel(ctx, band, text, at)`, `shards(ctx, rows, at, each)`, `heat(ctx, values, at)`, `glow(ctx, on, at)`, `buildUp(ctx, at, dur)`, `defect(ctx, tenant, band, at, until)`. Geometry: `bandTop(i)`, `boundary(lineAt)`, `col(t, n)`. **Call `tenants` and `line` in time order**, because each remembers the state it leaves.
- Bands, bottom to top: 0 Infrastructure, 1 Database, 2 Data model, 3 Domain primitives (the domain invariants), 4 Business rules, 5 Interface and APIs, 6 Onboarding and configuration. `lineAt` is the number of bands below the line: 6 today, 4 after the line moves.
- `makeRail(key, { lit, lineAt?, label, glow? })`: the small stack on the left for layer deep dives. Render `<rail.View />` and call `rail.setup(ctx)` first in `build`.
- `ui.tsx`: `Frame`, `Svg`, `Heading`, `Body`, `FigureChip`, `Callout` (with leader line `anchor`), `Counter` (tween `.counter-value` with `{ innerText: n, snap: { innerText: 1 } }`), `LanguageCard`, `Pill`, `Person`, `ScreenIcon`, `DocIcon`, `Graph`.
- GSAP plugins registered: DrawSVG (`drawSVG: '0%' → '100%'` for lines that draw themselves), MorphSVG (`morphSVG: '#target'` for shape morphs), Text (`text: '...'`).

## Constraints worth knowing

- The renderer and the site player seek the timeline, and seeking does not fire GSAP callbacks (`onUpdate`, `call`). Everything must be expressed as tweens and sets that GSAP can render at any time. To move along a curve, sample it into attribute tweens.
- DrawSVG draws a line by rewriting its dash pattern, so a dashed line cannot also draw itself; fade dashed lines in.
- `Callout` and `FigureChip` add padding outside `w`. At x = 1360, keep `w` at 480 or less so the box stays inside the frame.
- `LanguageCard` takes its line classes from its last class name, and accepts `header` for documents that are not business rules.

## Visual rules

- **One focus at a time.** Every scene with more than one idea runs in beats with `focusBeats`. Only the element the narration is describing is at full strength.
- **Text on screen** is short labels, callouts attached to what they describe, and figure chips with their source. No bullet lists. No paragraphs.
- **Colour roles** (`src/theme.ts`): shared `C.shared`, per customer `C.tenant[...]`, the multi-tenancy line `C.line` (the only use of that colour), special cases and errors `C.warn`, invariants `C.invariantEdge`. Keep them consistent.
- **Tenant growth** in current-state scenes shows the architecture degrading as tenants are added; label counts "illustrative" (the `Counter` part does).
- **Motion carries meaning.** No decorative movement. Ease with the defaults unless a move needs a different feel.
- **Stable interaction ids.** Put `data-target="..."` on each element a viewer might click, using the ids in the storyboard's Targets row.

## Writing rules for any text you add

No em dashes or en dashes. No contrast constructions of the form "This is X. This is not Y" or "It is not P, it is Q". No sales language. Do not use "honest". Figures only from `script.md` for your scene, each with its source.

## Checking your work

Build into your own folder and render stills, so parallel work does not collide:

```bash
node scripts/build.mjs --outdir dist-<group>
node scripts/render.mjs --dist dist-<group> --scenes <n> --notitle --stills 0.15,0.4,0.65,0.95 --name s<n> --outdir ../renders/stills
```

Look at every still. Fix overlaps, clipped text, anything unreadable, and any beat where two things compete for attention. `npx tsc --noEmit` must pass.
