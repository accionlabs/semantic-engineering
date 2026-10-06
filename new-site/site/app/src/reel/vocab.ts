// What the knowledge graph and the explanation language can name: the film's scenes with their
// sentences and timings, and every addressed passage of the site's pages. Built from the same files the
// site renders, so a reference can only point at what exists. No browser APIs and no path aliases, so
// the MCP server in worker.ts bundles it too.
import narration from '../../../../video/animation/src/narration.json';
import { GAP, sceneDuration, sentenceLengths, sentenceStarts } from '../../../../video/animation/src/engine/cues';
import passages from '../content/passages.json';

export type Sentence = { k: number; start: number; duration: number; text: string };
export type Scene = { n: number; act: number; title: string; duration: number; sentences: Sentence[]; sources: string[] };
export type Para = { n: number; k: string; text: string };
export type Section = { title: string; in?: string; paras: Para[] };
export type Page = { title: string; url: string; file: string; sections: Record<string, Section> };

/** The silence between recorded sentences. Clips are cut in the middle of it. */
export { GAP };

const N = narration as unknown as { acts: Record<string, string>; labels?: Record<string, string>; scenes: { n: number; act: number; title: string; sentences: string[]; sources?: string[] }[] };

/** Scenes 1 onwards: the film the narration track carries. The overview (scene 0) has its own track. */
export const SCENES: Scene[] = N.scenes.filter((s) => s.n > 0).map((s) => {
  const starts = sentenceStarts(s.n), lens = sentenceLengths(s.n);
  return {
    n: s.n, act: s.act, title: s.title, duration: sceneDuration(s.n), sources: s.sources ?? [],
    sentences: s.sentences.map((text, i) => ({ k: i + 1, start: starts[i], duration: lens[i], text })),
  };
});
export const sceneByN = (n: number) => SCENES.find((s) => s.n === n);
export const ACTS: Record<number, string> = Object.fromEntries(Object.entries(N.acts).filter(([k]) => Number(k) > 0).map(([k, v]) => [Number(k), v]));
export const actLabel = (a: number) => N.labels?.[String(a)] ?? `Act ${a}`;
export const actScenes = (a: number) => SCENES.filter((s) => s.act === a).map((s) => s.n);

/** Every page, by key ("sdlc/methodology"), with its sections by anchor ("" is the text before the first heading). */
export const PAGES = passages as unknown as Record<string, Page>;

/** A page passage: "sdlc/methodology#aperture p3", "sdlc/methodology#aperture", or "sdlc/methodology p1". */
export type Place = { key: string; anchor: string; para?: number; page: Page; section: Section; url: string };
export const placeOf = (ref: string): Place | undefined => {
  const m = ref.match(/^([a-z0-9/_-]+)(?:#([a-z0-9-]+))?(?: p(\d+))?$/);
  if (!m) return;
  const page = PAGES[m[1]];
  const anchor = m[2] ?? '';
  const section = page?.sections[anchor];
  if (!page || !section) return;
  const para = m[3] ? Number(m[3]) : undefined;
  return { key: m[1], anchor, para, page, section, url: page.url + (anchor ? `#${anchor}` : '') };
};
/** The text a page reference stands for: one block, or the section's opening blocks. */
export const placeText = (p: Place) => {
  if (p.para !== undefined) return p.section.paras.find((x) => x.n === p.para)?.text ?? '';
  return p.section.paras.filter((x) => x.k === 'p').slice(0, 1).map((x) => x.text).join(' ');
};
/** Problems with a page reference, for the checks: unknown page, section or block. */
export const placeProblem = (ref: string): string | undefined => {
  const m = ref.match(/^([a-z0-9/_-]+)(?:#([a-z0-9-]+))?(?: p(\d+))?$/);
  if (!m) return `"${ref}" is not a page reference such as "sdlc/methodology#aperture p3"`;
  const page = PAGES[m[1]];
  if (!page) return `there is no page "${m[1]}"`;
  const section = page.sections[m[2] ?? ''];
  if (!section) return `page "${m[1]}" has no section "${m[2]}"`;
  if (m[3] && !section.paras.some((x) => x.n === Number(m[3]))) return `section "${m[1]}#${m[2] ?? ''}" has no block ${m[3]}`;
};
export const pageTitle = (key: string) => PAGES[key]?.title ?? key;
