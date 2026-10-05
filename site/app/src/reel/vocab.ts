// The reel language's vocabulary: every content primitive a reel can name. It is built from the same
// files the site renders, so the language can only refer to what exists. No browser APIs here, so the
// remote MCP server can use it too.
import paper from '../content/paper.json';
import moments from '../content/moments.json';
import summaries from '../content/summaries.json';
import narration from '../../../../video/animation/src/narration.json';
import { LAYERS } from '../content/data';

export type Sentence = { k: number; start: number; duration: number; text: string; visible: string[] };
export type Scene = { n: number; title: string; act: number; duration: number; targets: string[]; sentences: Sentence[]; paper: string };
export type Para = { html: string; text: string };
export type Place = { key: string; section: number; number: string; title: string; anchor?: string; paras: Para[] };

const M = moments as unknown as { lead: number; gap: number; labels: Record<string, string>; scenes: Record<string, Omit<Scene, 'n' | 'paper'>> };
/** The silence between recorded sentences. Clips are cut in the middle of it. */
export const GAP = M.gap;
const N = narration as unknown as { acts: Record<string, string>; scenes: { n: number; paper?: string }[] };
const P = paper as unknown as { sections: { n: number; title: string; subsections: { id: string; number: string; title: string }[]; blocks: { type: string; html?: string }[] }[] };

export const SCENES: Scene[] = Object.entries(M.scenes).map(([n, s]) => ({ ...s, n: Number(n), paper: N.scenes.find((x) => x.n === Number(n))?.paper ?? '' })).sort((a, b) => a.n - b.n);
export const sceneByN = (n: number) => SCENES.find((s) => s.n === n);
export const ACTS: Record<number, string> = Object.fromEntries(Object.entries(N.acts).filter(([k]) => Number(k) > 0).map(([k, v]) => [Number(k), v]));
export const actScenes = (a: number) => SCENES.filter((s) => s.act === a).map((s) => s.n);
export const ELEMENT_LABELS = M.labels;
export { LAYERS };

const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

/** Every section and subsection, keyed "4" and "4.1", with its paragraphs in reading order. */
export const PLACES: Record<string, Place> = {};
for (const s of P.sections) {
  PLACES[String(s.n)] = { key: String(s.n), section: s.n, number: String(s.n), title: s.title, paras: [] };
  let cur = PLACES[String(s.n)];
  for (const b of s.blocks) {
    if (b.type !== 'html' || !b.html) continue;
    const re = /<h3 id="(s\d+-\d+)"[^>]*>|<p>([\s\S]*?)<\/p>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(b.html))) {
      if (m[1]) {
        const sub = s.subsections.find((x) => x.id === m![1]);
        if (sub) cur = PLACES[sub.number] = { key: sub.number, section: s.n, number: sub.number, title: sub.title, anchor: sub.id, paras: [] };
      } else if (m[2] !== undefined) {
        const text = strip(m[2]);
        if (text) cur.paras.push({ html: m[2], text });
      }
    }
  }
}
export const SUMMARY = summaries as Record<string, string>;
