// Plain keyword search over the narration and the paper, returning addresses a reel can use:
// "scene 12 sentence 6" and "4.1 para 2". No browser APIs, so the MCP server shares it.
import { PLACES, SCENES } from './vocab';

export type Hit = { kind: 'sentence'; scene: number; sentence: number; title: string; text: string; score: number } | { kind: 'paragraph'; key: string; para: number; title: string; text: string; score: number };

const STOP = new Set('a an and are as at be by can do does for from has have how i in is it its of on or our so that the their them then there these they this to us was we what when where which who why will with would you your'.split(' '));
const stem = (w: string) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '').replace(/e$/, '') : w);
const terms = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

type Doc = { hit: Omit<Hit, 'score'>; words: string[] };
const DOCS: Doc[] = [
  ...SCENES.flatMap((s) => s.sentences.map((x) => ({ hit: { kind: 'sentence' as const, scene: s.n, sentence: x.k, title: s.title, text: x.text }, words: terms(`${x.text} ${s.title}`) }))),
  ...Object.values(PLACES).flatMap((p) => p.paras.map((x, i) => ({ hit: { kind: 'paragraph' as const, key: p.key, para: i + 1, title: `${p.number}. ${p.title}`, text: x.text }, words: terms(`${x.text} ${p.title}`) }))),
];
const df = new Map<string, number>();
DOCS.forEach((d) => new Set(d.words).forEach((w) => df.set(w, (df.get(w) ?? 0) + 1)));

export const search = (query: string, limit = 12): Hit[] => {
  void limit;
  const q = [...new Set(terms(query))];
  if (!q.length) return [];
  return DOCS.map((d) => {
    let score = 0;
    for (const w of q) { const tf = d.words.filter((x) => x === w).length; if (tf) score += (1 + Math.log(tf)) * Math.log(DOCS.length / (df.get(w) ?? 1)); }
    return { ...d.hit, score: Math.round((score / Math.sqrt(d.words.length + 4)) * 100) / 100 } as Hit;
  }).filter((h) => h.score > 0).sort((a, b) => b.score - a.score);
};
/** The best matches of each kind: narration sentences to play, and paragraphs to quote. */
export const searchBoth = (query: string, each = 6) => {
  const all = search(query, 1000);
  return { sentences: all.filter((h) => h.kind === 'sentence').slice(0, each), paragraphs: all.filter((h) => h.kind === 'paragraph').slice(0, each) };
};
