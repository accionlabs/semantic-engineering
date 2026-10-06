// Plain keyword search over the film's narration and the site's pages, returning addresses an
// explanation and the evidence tool use: "scene 13 sentence 8" and "sdlc/agents#the-kg-sync-agent p3".
// No browser APIs, so the MCP server shares it.
import { PAGES, SCENES } from './vocab';
import { SITE } from './prompt';

export type Hit =
  | { kind: 'sentence'; scene: number; sentence: number; ref: string; title: string; url: string; text: string; score: number }
  | { kind: 'passage'; ref: string; page: string; section: string; url: string; text: string; score: number };

const STOP = new Set('a an and are as at be by can do does for from has have how i in is it its of on or our so that the their them then there these they this to us was we what when where which who why will with would you your'.split(' '));
const stem = (w: string) => (w.length > 4 ? w.replace(/(ing|ed|es|s)$/, '').replace(/e$/, '') : w);
const terms = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

type Doc = { hit: Omit<Hit, 'score'>; words: string[] };
const DOCS: Doc[] = [
  ...SCENES.flatMap((s) => s.sentences.map((x) => ({ hit: { kind: 'sentence' as const, scene: s.n, sentence: x.k, ref: `${s.n}.${x.k}`, title: s.title, url: `${SITE}/watch/scene-${s.n}`, text: x.text }, words: terms(`${x.text} ${s.title}`) }))),
  // Top-level sections only: a subsection's blocks are already in its section, numbered there.
  ...Object.entries(PAGES).flatMap(([key, p]) => Object.entries(p.sections).filter(([, sec]) => !sec.in).flatMap(([anchor, sec]) => sec.paras.filter((x) => x.text && x.k !== 'diagram').map((x) => ({
    hit: { kind: 'passage' as const, ref: `${key}${anchor ? `#${anchor}` : ''} p${x.n}`, page: p.title, section: anchor ? sec.title : '', url: SITE + p.url + (anchor ? `#${anchor}` : ''), text: x.text.length > 600 ? `${x.text.slice(0, 600)}…` : x.text },
    words: terms(`${x.text} ${sec.title} ${p.title}`),
  })))),
];
const df = new Map<string, number>();
DOCS.forEach((d) => new Set(d.words).forEach((w) => df.set(w, (df.get(w) ?? 0) + 1)));

export const search = (query: string): Hit[] => {
  const q = [...new Set(terms(query))];
  if (!q.length) return [];
  return DOCS.map((d) => {
    let score = 0;
    for (const w of q) { const tf = d.words.filter((x) => x === w).length; if (tf) score += (1 + Math.log(tf)) * Math.log(DOCS.length / (df.get(w) ?? 1)); }
    return { ...d.hit, score: Math.round((score / Math.sqrt(d.words.length + 4)) * 100) / 100 } as Hit;
  }).filter((h) => h.score > 0).sort((a, b) => b.score - a.score);
};
/** The best matches of each kind: narration sentences to play, and page passages to quote. */
export const searchBoth = (query: string, each = 6) => {
  const all = search(query);
  return { sentences: all.filter((h) => h.kind === 'sentence').slice(0, each), passages: all.filter((h) => h.kind === 'passage').slice(0, each) };
};
