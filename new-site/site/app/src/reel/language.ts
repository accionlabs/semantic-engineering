// What the explanation language compiles to, and the helpers it reads with. A plan is a list of segments
// the player runs: the guide's lines (spoken by the browser), clips of the recorded film, and quotes from
// the site's pages. No browser APIs, so the MCP server shares it.
import { GAP, placeOf, placeText, sceneByN } from './vocab';

export type Problem = { line: number; message: string; severity: 'error' | 'warning' };
/** Why a segment is in the plan: the move and the graph concept or link that put it there. */
export type Trace = { move?: string; node?: string; reason?: string };
export type Segment = (
  | { kind: 'host'; role: 'intro' | 'bridge' | 'close'; text: string; line: number; seconds: number }
  | { kind: 'clip'; scene: number; from: number; to: number; sentences: [number, number]; quotes: string[]; line: number; seconds: number }
  | { kind: 'quote'; quotes: string[]; line: number; seconds: number }
  | { kind: 'sample'; concept: string; title: string; lines: string[]; notes: { line: number; text: string }[]; reject?: { text: string; reason: string }; line: number; seconds: number }
) & { trace?: Trace };
/** A deep dive: a section the viewer chooses after the short explanation. */
export type Branch = { label: string; line: number; segments: Segment[]; read: string[]; seconds: number };
/** The short explanation is the trunk (segments, read, seconds); the deep dives are its branches. */
export type Plan = { question: string; audience?: string; context?: string; layers: string[]; unowned: string[]; segments: Segment[]; read: string[]; seconds: number; branches: Branch[] };
export type Result = { ok: boolean; problems: Problem[]; plan?: Plan };

/** The short explanation runs at most two minutes and each deep dive at most three, so a viewer never
 *  watches more than three minutes without choosing where to go next. */
export const LIMITS = { question: 180, audience: 80, text: 240, label: 60, lines: 120, clips: 12, trunkSeconds: 120, branchSeconds: 180, branches: 4, sampleWidth: 56, sampleTitle: 60, sampleLines: 10, sampleNotes: 3 };
const WORDS_PER_SECOND = 2.6;
/** How long a guide's line takes to speak, used when the browser cannot tell us. */
export const speakingTime = (text: string) => text.split(/\s+/).filter(Boolean).length / WORDS_PER_SECOND + 0.8;
/** How long it takes to read a line on screen. */
export const readingTime = (text: string) => text.split(/\s+/).filter(Boolean).length / 3.5 + 1;
const STOP = new Set('about after also because been before being could does from have here into just like more most much only other over some such than that their them then there these they this those very what when where which while will with would your yours ours'.split(' '));
const contentWords = (t: string) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)).map((w) => w.replace(/(ing|ed|es|s)$/, '')));
/** The share of the opening's words that are new: not in the question. The opening speaks about the question
 *  in a short clause of the guide's own, then says something the question does not. */
/** The share of the question's content words a line repeats. */
export const echoes = (question: string, line: string) => {
  const q = contentWords(question), o = contentWords(line);
  if (q.size < 3) return 0;
  return [...q].filter((w) => o.has(w)).length / q.size;
};
export const novelty = (question: string, opening: string) => {
  const q = contentWords(question), o = contentWords(opening);
  if (o.size < 4) return 1;
  return [...o].filter((w) => !q.has(w)).length / o.size;
};

export const distance = (a: string, b: string) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};
export const closest = (word: string, options: string[]) => {
  const best = options.map((o) => [o, distance(word, o)] as const).sort((x, y) => x[1] - y[1])[0];
  return best && best[1] <= Math.max(2, Math.floor(word.length / 3)) ? best[0] : undefined;
};

/** The guide's lines appear on the site, so they follow the site's writing rules. */
export const textProblems = (text: string, line: number, max: number, what: string): Problem[] => {
  const out: Problem[] = [];
  const err = (message: string) => out.push({ line, message, severity: 'error' });
  const warn = (message: string) => out.push({ line, message, severity: 'warning' });
  if (!text.trim()) err(`the ${what} is empty.`);
  if (text.length > max) err(`the ${what} is ${text.length} characters; the limit is ${max}.`);
  if (/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|org|net|io)\b/i.test(text)) err(`the ${what} contains a web address. The guide's lines are plain text; use "read" under answer to point at a page.`);
  if (/[<>{}]/.test(text)) err(`the ${what} contains markup characters (< > { }). The guide's lines are plain text.`);
  if (/[–—]/.test(text)) err(`the ${what} contains a dash (– or —). The site's writing rules use a comma, colon or full stop instead.`);
  if (/\bnot\b[^.!?]{0,60}\bbut\b|\bisn't\b[^.!?]{0,40}\bit's\b|\brather than\b|\binstead of\b/i.test(text)) warn(`the ${what} reads as a contrast ("not this, but that", "rather than", "instead of"), which the site's writing rules avoid. Say what is true directly.`);
  if (/\b(revolutionary|game-changing|cutting-edge|seamless|unlock|transformative|world-class|honestly|honest)\b/i.test(text)) warn(`the ${what} uses sales language the site avoids.`);
  return out;
};

/** A line of a sample: plain text that fits the card, with no web address, markup, dash or tab. */
export const sampleLineProblems = (text: string, line: number, what: string): Problem[] => {
  const out: Problem[] = [];
  const err = (message: string) => out.push({ line, message, severity: 'error' });
  if (text.length > LIMITS.sampleWidth) err(`the ${what} is ${text.length} characters; a sample line holds at most ${LIMITS.sampleWidth}.`);
  if (/https?:\/\/|www\./i.test(text)) err(`the ${what} contains a web address. A sample is an illustration, not a link.`);
  if (/[<>]/.test(text)) err(`the ${what} contains < or >. Write the sample as plain text.`);
  if (/[–—]/.test(text)) err(`the ${what} contains a dash (– or —). The site's writing rules use a comma, colon or full stop instead.`);
  if (/\t/.test(text)) err(`the ${what} contains a tab. Indent with spaces inside the quotes.`);
  return out;
};

export type Line = { n: number; indent: number; word: string; rest: string; raw: string };
export const readLines = (code: string): Line[] =>
  code.split(/\r?\n/).map((raw, i) => {
    // A comment starts at a "#" after a space; a page reference's "#" follows the page name directly.
    const noComment = raw.replace(/(^|\s)#.*$/, '').replace(/\s+$/, '');
    const indent = noComment.match(/^\s*/)![0].replace(/\t/g, '  ').length;
    const body = noComment.trim();
    const word = body.split(/\s+/)[0] ?? '';
    return { n: i + 1, indent, word: word.toLowerCase(), rest: body.slice(word.length).trim(), raw };
  }).filter((l) => l.word);

/** A double-quoted string, with nothing after it. */
export const quoted = (rest: string): string | undefined => { const m = rest.match(/^"((?:[^"\\]|\\.)*)"$/); return m ? m[1].replace(/\\"/g, '"') : undefined; };

/** A clip of scene n from sentence a to b, cut in the middle of the silence on either side. */
export const clipFor = (n: number, a: number, b: number, line: number): Segment & { kind: 'clip' } => {
  const s = sceneByN(n)!, S = s.sentences;
  const from = a <= 1 ? 0 : Math.max(0, S[a - 1].start - GAP / 2);
  const to = b >= S.length ? s.duration : Math.min(s.duration, S[b - 1].start + S[b - 1].duration + GAP / 2);
  return { kind: 'clip', scene: n, from, to, sentences: [a, b], quotes: [], line, seconds: to - from };
};

/** What a quote shows: the page's own words, with where they come from. */
export const quoteFor = (ref: string) => {
  const p = placeOf(ref);
  if (!p) return undefined;
  return { ref, page: p.page.title, section: p.anchor ? p.section.title : '', url: p.url, text: placeText(p) };
};
