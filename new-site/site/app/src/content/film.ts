import narration from '@film/narration.json';
import { SITE, type PageMeta } from './data';
import { TARGETS } from './targets';

// The film's scenes and acts, and the site's pages each scene draws on (from the script's Sources lines)
// and each clickable element points to (from the storyboards' Targets rows), as script/assemble.py writes them.
export type SceneInfo = { n: number; act: number; title: string; sentences: string[]; sources: string[]; targets: Record<string, string> };
export const SCENES = narration.scenes as unknown as SceneInfo[];
export const ACT_NAMES = narration.acts as Record<string, string>;
export const ACT_LABELS = (narration as { labels?: Record<string, string> }).labels ?? {};
export const ACTS = Object.keys(ACT_NAMES).map(Number).filter((a) => a > 0);
export const APPENDIX = ACTS.find((a) => ACT_LABELS[String(a)] === 'Appendix');
export const actLabel = (a: number) => ACT_LABELS[String(a)] ?? `Act ${a}`;
export const sceneInfo = (n: number) => SCENES.find((s) => s.n === n);
export const actOf = (n?: number) => (n === undefined ? undefined : sceneInfo(n)?.act);
export const scenesOf = (act: number) => SCENES.filter((s) => s.act === act);
/** The address of an act on the watch pages. */
export const actPath = (a: number) => (a === APPENDIX ? '/watch/appendix' : `/watch/act-${a}`);

export type Loc = { page: PageMeta; anchor?: string; url: string; heading?: string };
const byFile = new Map(SITE.pages.map((p) => [p.file, p]));
/** A page location written as in the script ('sdlc/agents.md#the-kg-sync-agent'), resolved to the site's page. */
export const resolveLoc = (loc: string): Loc | undefined => {
  const [file, anchor] = loc.split('#');
  const page = byFile.get(file);
  if (!page) return undefined;
  return { page, anchor, url: page.url + (anchor ? `#${anchor}` : ''), heading: anchor ? page.headings.find((h) => h.id === anchor)?.text : undefined };
};
const uniq = (xs: (Loc | undefined)[]) => {
  const seen = new Set<string>(); const out: Loc[] = [];
  xs.forEach((x) => { if (x && !seen.has(x.url)) { seen.add(x.url); out.push(x); } });
  return out;
};
/** The pages a scene draws on, its main page first. */
export const sceneSources = (n: number) => uniq((sceneInfo(n)?.sources ?? []).map(resolveLoc));
/** The pages an act draws on: each scene's main page, then the rest. */
export const actSources = (act: number) => uniq([...scenesOf(act).map((s) => s.sources[0]), ...scenesOf(act).flatMap((s) => s.sources.slice(1))].map((l) => (l ? resolveLoc(l) : undefined)));
/** Where a clickable element points: the targets table, else the storyboard, else its scene's main page. */
export const targetLoc = (id: string, scene: number) => {
  const own = TARGETS[id]?.[1];
  if (own?.startsWith('http')) return undefined;
  return resolveLoc(own ?? sceneInfo(scene)?.targets[id] ?? SCENES.find((s) => s.targets[id])?.targets[id] ?? sceneInfo(scene)?.sources[0] ?? '_index.md');
};
/** An element that stands for another site links straight to it. */
export const targetUrl = (id: string) => (TARGETS[id]?.[1]?.startsWith('http') ? TARGETS[id][1] : undefined);
/** An element's name, from the targets table. */
export const targetName = (id: string) => TARGETS[id]?.[0];
/** A short name for a location: the heading, else the page title. */
export const locName = (l: Loc) => l.heading ?? l.page.title;

/** The scenes that draw on a page (its file), in film order, with the sections of the page each cites. */
export const scenesForPage = (file: string) => {
  const out: { n: number; title: string; anchors: string[]; main: boolean }[] = [];
  SCENES.filter((s) => s.n > 0).forEach((s) => {
    const locs = [...s.sources, ...Object.values(s.targets)].filter((l) => l.split('#')[0] === file);
    if (!locs.length) return;
    out.push({ n: s.n, title: s.title, anchors: [...new Set(locs.map((l) => l.split('#')[1]).filter(Boolean))], main: s.sources[0]?.split('#')[0] === file });
  });
  return out;
};
/** The scenes that cite one section of a page. */
export const scenesForSection = (file: string, anchor: string) => scenesForPage(file).filter((s) => s.anchors.includes(anchor));
export const sceneTitleOf = (n: number) => sceneInfo(n)?.title ?? '';
