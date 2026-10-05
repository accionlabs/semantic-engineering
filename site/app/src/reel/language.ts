// The reel language. An agent writes a reel to answer one person's question: its own short lines as the
// host, the video's recorded scenes as the expert, and passages of the paper beside them. This file
// reads a reel, checks it against the vocabulary, and compiles it into a plan the reel player runs.
// Every problem is reported with its line and a reason. No browser APIs, so the MCP server shares it.
import { ACTS, ELEMENT_LABELS, GAP, LAYERS, PLACES, SCENES, actScenes, sceneByN } from './vocab';

export type Problem = { line: number; message: string; severity: 'error' | 'warning' };
export type Highlight = { key: string; para?: number; line: number };
/** Why a segment is in the reel: the statement and graph concept or link that put it there. */
export type Trace = { move?: string; node?: string; reason?: string };
export type Segment = (
  | { kind: 'host'; role: 'intro' | 'bridge' | 'close'; text: string; line: number; seconds: number }
  | { kind: 'clip'; scene: number; from: number; to: number; sentences: [number, number]; highlights: Highlight[]; line: number; seconds: number }
  | { kind: 'hold'; scene: number; sentence: number; at: number; element?: string; say?: string; highlights: Highlight[]; line: number; seconds: number }
  | { kind: 'quote'; highlights: Highlight[]; line: number; seconds: number }
) & { trace?: Trace };
export type Plan = { question: string; audience?: string; context?: string; layers?: string[]; segments: Segment[]; read?: Highlight[]; seconds: number };
export type Result = { ok: boolean; problems: Problem[]; plan?: Plan };

export const LIMITS = { question: 180, audience: 80, text: 240, statements: 40, clips: 20, seconds: 15 * 60, hold: 12 };
const WORDS_PER_SECOND = 2.6;
/** How long a host line takes to speak, used when the browser cannot tell us. */
export const speakingTime = (text: string) => text.split(/\s+/).filter(Boolean).length / WORDS_PER_SECOND + 0.8;

const STATEMENTS = ['reel', 'for', 'intro', 'play', 'hold', 'say', 'highlight', 'bridge', 'close', 'read'];

// ---------- helpers ----------

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
export const didYouMean = (word: string, options: string[]) => { const c = closest(word, options); return c ? ` Did you mean "${c}"?` : ''; };

/** The host's lines appear on our site in the host's voice, so they follow the site's writing rules. */
export const textProblems = (text: string, line: number, max: number, what: string): Problem[] => {
  const out: Problem[] = [];
  const err = (message: string) => out.push({ line, message, severity: 'error' });
  const warn = (message: string) => out.push({ line, message, severity: 'warning' });
  if (!text.trim()) err(`the ${what} is empty.`);
  if (text.length > max) err(`the ${what} is ${text.length} characters; the limit is ${max}.`);
  if (/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|ai|org|net|io)\b/i.test(text)) err(`the ${what} contains a web address. Host lines are plain text; use "read" or "highlight" to point at the paper.`);
  if (/[<>{}]/.test(text)) err(`the ${what} contains markup characters (< > { }). Host lines are plain text.`);
  if (/[–—]/.test(text)) err(`the ${what} contains a dash (– or —). The site's writing rules use a comma, colon or full stop instead.`);
  if (/\bnot\b[^.!?]{0,60}\bbut\b|\bisn't\b[^.!?]{0,40}\bit's\b/i.test(text)) warn(`the ${what} reads as a "not this, but that" contrast, which the site's writing rules avoid. Say what is true directly.`);
  if (/\b(revolutionary|game-changing|cutting-edge|seamless|unlock|honestly|honest)\b/i.test(text)) warn(`the ${what} uses sales language the site avoids.`);
  return out;
};

// ---------- reading ----------

export type Line = { n: number; indent: number; word: string; rest: string; raw: string };
export const readLines = (code: string): Line[] =>
  code.split(/\r?\n/).map((raw, i) => {
    const noComment = raw.replace(/(^|\s)#.*$/, '').replace(/\s+$/, '');
    const indent = noComment.match(/^\s*/)![0].replace(/\t/g, '  ').length;
    const body = noComment.trim();
    const [word = '', ...rest] = body.split(/\s+/);
    return { n: i + 1, indent, word: word.toLowerCase(), rest: body.slice(word.length).trim(), raw };
  }).filter((l) => l.word);

/** A double-quoted string, with nothing after it. */
export const quoted = (rest: string): string | undefined => { const m = rest.match(/^"((?:[^"\\]|\\.)*)"$/); return m ? m[1].replace(/\\"/g, '"') : undefined; };

// ---------- checking and compiling ----------

export const checkReel = (code: string): Result => {
  const problems: Problem[] = [];
  const err = (line: number, message: string) => problems.push({ line, message, severity: 'error' });
  const lines = readLines(code);
  const plan: Plan = { question: '', segments: [], seconds: 0 };
  let parent: Segment | undefined;       // the play or hold that highlight and say belong to
  let sawIntro = false, sawClose = false, closeLine = 0;

  if (!lines.length) return { ok: false, problems: [{ line: 1, message: 'the reel is empty. Start with: reel "<the question>"', severity: 'error' }] };
  if (lines.length > LIMITS.statements) err(lines[LIMITS.statements].n, `a reel has at most ${LIMITS.statements} statements.`);

  lines.forEach((l, i) => {
    const child = l.indent > 0;
    if (i === 0 && l.word !== 'reel') { err(l.n, `a reel starts with: reel "<the question>". Found "${l.word}".`); }
    if (sawClose && !child) err(l.n, `"close" ends the reel; "${l.word}" comes after it.`);

    switch (l.word) {
      case 'reel': {
        if (i !== 0) { err(l.n, '"reel" appears once, on the first line.'); break; }
        const q = quoted(l.rest);
        if (q === undefined) { err(l.n, 'write the question in double quotes: reel "How would pricing change for us?"'); break; }
        problems.push(...textProblems(q, l.n, LIMITS.question, 'question'));
        plan.question = q;
        break;
      }
      case 'for': {
        if (i !== 1 || !child) { err(l.n, '"for" goes on the line after "reel", indented, to say who the reel is for.'); break; }
        const a = quoted(l.rest);
        if (a === undefined) { err(l.n, 'write who it is for in double quotes: for "a CFO at a payroll SaaS company"'); break; }
        problems.push(...textProblems(a, l.n, LIMITS.audience, 'audience'));
        plan.audience = a;
        break;
      }
      case 'intro': case 'bridge': case 'close': {
        if (child) { err(l.n, `"${l.word}" is a statement of its own; remove the indent.`); break; }
        if (l.word === 'intro' && (sawIntro || plan.segments.length)) err(l.n, '"intro" comes once, before the first scene.');
        if (l.word === 'close' && sawClose) err(l.n, '"close" comes once, at the end.');
        const t = quoted(l.rest);
        if (t === undefined) { err(l.n, `write the host's line in double quotes: ${l.word} "…"`); break; }
        problems.push(...textProblems(t, l.n, LIMITS.text, `${l.word} line`));
        const seg: Segment = { kind: 'host', role: l.word, text: t, line: l.n, seconds: speakingTime(t) };
        plan.segments.push(seg);
        parent = seg;
        if (l.word === 'intro') sawIntro = true;
        if (l.word === 'close') { sawClose = true; closeLine = l.n; }
        break;
      }
      case 'play': {
        if (child) { err(l.n, '"play" is a statement of its own; remove the indent.'); break; }
        const segs = readPlay(l, err);
        segs.forEach((s) => plan.segments.push(s));
        parent = segs[segs.length - 1];
        break;
      }
      case 'hold': {
        if (child) { err(l.n, '"hold" is a statement of its own; remove the indent.'); break; }
        const s = readHold(l, err);
        if (s) plan.segments.push(s);
        parent = s;
        break;
      }
      case 'say': {
        if (!child || parent?.kind !== 'hold') { err(l.n, '"say" goes indented under a "hold", as the host\'s caption for that frame.'); break; }
        const t = quoted(l.rest);
        if (t === undefined) { err(l.n, 'write the caption in double quotes: say "…"'); break; }
        if (parent.say) err(l.n, 'a "hold" has one "say".');
        problems.push(...textProblems(t, l.n, LIMITS.text, 'caption'));
        parent.say = t;
        parent.seconds = Math.max(parent.seconds, speakingTime(t) + 0.6);
        break;
      }
      case 'highlight': {
        if (!child || !parent || parent.kind === 'host') { err(l.n, '"highlight" goes indented under a "play" or "hold", to quote the paper beside that clip.'); break; }
        const h = readPlace(l.rest, l.n, err, 'highlight');
        if (h) parent.highlights.push(h);
        break;
      }
      case 'read': {
        if (!child || parent?.kind !== 'host' || parent.role !== 'close') { err(l.n, '"read" goes indented under "close", to open the paper at the end.'); break; }
        const h = readPlace(l.rest, l.n, err, 'read');
        if (h?.para) err(l.n, '"read" opens a section or subsection; leave out "para".');
        if (h) plan.read = [...(plan.read ?? []), h];
        break;
      }
      default: {
        const hint = closest(l.word, STATEMENTS);
        err(l.n, hint ? `unknown statement "${l.word}". Did you mean "${hint}"?`
          : `the reel language cannot express "${l.word}". It can: play scenes, acts or layers, hold on a frame, quote the paper with highlight, and add the host's intro, bridge, say and close lines. Anything else is out of scope.`);
      }
    }
  });

  const clips = plan.segments.filter((s) => s.kind !== 'host');
  if (!clips.length) problems.push({ line: lines[lines.length - 1].n, message: 'the reel plays no scenes. Add at least one "play" or "hold".', severity: 'error' });
  if (clips.length > LIMITS.clips) err(clips[LIMITS.clips].line, `a reel plays at most ${LIMITS.clips} clips.`);
  plan.seconds = plan.segments.reduce((a, s) => a + s.seconds, 0);
  if (plan.seconds > LIMITS.seconds) err(1, `the reel runs about ${Math.round(plan.seconds / 60)} minutes; the limit is ${LIMITS.seconds / 60}. Use "sentences" to play parts of scenes.`);
  if (!sawClose && plan.segments.length) problems.push({ line: lines[lines.length - 1].n, message: 'the reel has no "close". A closing host line that answers the question works well.', severity: 'warning' });
  void closeLine;
  const ok = !problems.some((p) => p.severity === 'error');
  return { ok, problems: problems.sort((a, b) => a.line - b.line), plan: ok ? plan : undefined };
};

type Err = (line: number, message: string) => void;

const readScene = (word: string | undefined, line: number, err: Err) => {
  const n = Number(word);
  if (!word || !Number.isInteger(n)) { err(line, `expected a scene number from 1 to ${SCENES.length}.`); return; }
  const s = sceneByN(n);
  if (!s) err(line, `there is no scene ${n}; scenes run from 1 to ${SCENES.length}.`);
  return s;
};

export const clipFor = (n: number, a: number, b: number, line: number): Segment & { kind: 'clip' } => {
  const s = sceneByN(n)!, S = s.sentences;
  // Cut in the middle of the silence before the first sentence and after the last, so no clip carries
  // the edge of a neighbouring sentence. The player fades the narration at each cut.
  const from = a <= 1 ? 0 : Math.max(0, S[a - 1].start - GAP / 2);
  const to = b >= S.length ? s.duration : Math.min(s.duration, S[b - 1].start + S[b - 1].duration + GAP / 2);
  return { kind: 'clip', scene: n, from, to, sentences: [a, b], highlights: [], line, seconds: to - from };
};

/** play scene N [sentences A[-B]] | play act N | play layer <slug> */
const readPlay = (l: Line, err: Err): Segment[] => {
  const w = l.rest.split(/\s+/);
  if (w[0] === 'scene') {
    const s = readScene(w[1], l.n, err);
    if (!s) return [];
    if (w.length === 2) return [clipFor(s.n, 1, s.sentences.length, l.n)];
    if (w[2] !== 'sentences' && w[2] !== 'sentence') { err(l.n, `after the scene number, write "sentences 2-5" or nothing. Found "${w.slice(2).join(' ')}".`); return []; }
    const m = (w[3] ?? '').match(/^(\d+)(?:-(\d+))?$/);
    if (!m || w.length > 4) { err(l.n, 'write sentences as one number or a range: "sentences 3" or "sentences 2-5".'); return []; }
    const a = Number(m[1]), b = Number(m[2] ?? m[1]), max = s.sentences.length;
    if (a < 1 || b > max || a > b) { err(l.n, `scene ${s.n} has ${max} sentences; "sentences ${w[3]}" ${b > max ? 'runs past the end' : 'is not a valid range'}.`); return []; }
    return [clipFor(s.n, a, b, l.n)];
  }
  if (w[0] === 'act') {
    const n = Number(w[1]);
    if (!ACTS[n] || w.length > 2) { err(l.n, `there is no act "${w.slice(1).join(' ')}"; acts run from 1 to ${Object.keys(ACTS).length}.`); return []; }
    return actScenes(n).map((sn) => clipFor(sn, 1, sceneByN(sn)!.sentences.length, l.n));
  }
  if (w[0] === 'layer') {
    const slug = w[1] ?? '';
    const layer = LAYERS.find((x) => x.slug === slug);
    if (!layer || w.length > 2) { err(l.n, `there is no layer "${slug}".${didYouMean(slug, LAYERS.map((x) => x.slug))} Layers: ${LAYERS.map((x) => x.slug).join(', ')}.`); return []; }
    return [layer.before, layer.after].map((sn) => clipFor(sn, 1, sceneByN(sn)!.sentences.length, l.n));
  }
  err(l.n, `play what? Write "play scene 7", "play scene 7 sentences 2-4", "play act 2" or "play layer onboarding". Found "${l.rest}".`);
  return [];
};

/** hold scene N at sentence S [on <element>] [for Ns] */
const readHold = (l: Line, err: Err): Segment | undefined => {
  const m = l.rest.match(/^scene\s+(\S+)\s+at\s+sentence\s+(\S+)(?:\s+on\s+(\S+))?(?:\s+for\s+(\S+))?$/);
  if (!m) { err(l.n, 'write a hold as: hold scene 12 at sentence 6 on line.mt for 4s ("on" and "for" are optional).'); return; }
  const s = readScene(m[1], l.n, err);
  if (!s) return;
  const k = Number(m[2]);
  if (!Number.isInteger(k) || k < 1 || k > s.sentences.length) { err(l.n, `scene ${s.n} has ${s.sentences.length} sentences; "sentence ${m[2]}" is outside it.`); return; }
  const sent = s.sentences[k - 1];
  let element: string | undefined;
  if (m[3]) {
    if (!sent.visible.includes(m[3])) {
      const inScene = s.targets.includes(m[3]);
      err(l.n, inScene
        ? `"${m[3]}" is in scene ${s.n} but not on screen at sentence ${k}. On screen then: ${sent.visible.join(', ') || 'nothing clickable'}.`
        : `scene ${s.n} has no element "${m[3]}".${didYouMean(m[3], s.targets)} Elements on screen at sentence ${k}: ${sent.visible.join(', ') || 'none'}.`);
    } else element = m[3];
  }
  let seconds = 4;
  if (m[4]) {
    const sm = m[4].match(/^(\d+(?:\.\d+)?)s$/);
    if (!sm) err(l.n, `write the length in seconds, for example "for 4s". Found "${m[4]}".`);
    else if (Number(sm[1]) < 1 || Number(sm[1]) > LIMITS.hold) err(l.n, `a hold lasts from 1 to ${LIMITS.hold} seconds.`);
    else seconds = Number(sm[1]);
  }
  const at = Math.min(s.duration - 0.1, sent.start + Math.min(1.2, sent.duration * 0.6));
  return { kind: 'hold', scene: s.n, sentence: k, at, element, highlights: [], line: l.n, seconds };
};

/** 4 | 4.1 | 4 para 2 | 4.1 para 2 */
const readPlace = (rest: string, line: number, err: Err, what: string): Highlight | undefined => {
  const m = rest.match(/^(\d+(?:\.\d+)?)(?:\s+para(?:graph)?\s+(\d+))?$/);
  if (!m) { err(line, `write ${what} as a section, a subsection, or one paragraph: "${what} 4", "${what} 4.1", "${what} 4.1 para 2".`); return; }
  const place = PLACES[m[1]];
  if (!place) { err(line, `the paper has no section ${m[1]}.${didYouMean(m[1], Object.keys(PLACES))}`); return; }
  const para = m[2] ? Number(m[2]) : undefined;
  if (para !== undefined && (para < 1 || para > place.paras.length)) { err(line, `section ${m[1]} has ${place.paras.length} paragraph${place.paras.length === 1 ? '' : 's'}; there is no paragraph ${para}.`); return; }
  return { key: m[1], para, line };
};

/** What a highlight shows: the paper's own words. */
export const quoteFor = (h: Highlight) => {
  const p = PLACES[h.key];
  const paras = h.para ? [p.paras[h.para - 1]] : p.paras.slice(0, 1);
  return { title: `${p.number}. ${p.title}`, section: p.section, anchor: p.anchor, paras, whole: !h.para };
};

export const elementLabel = (id: string) => ELEMENT_LABELS[id] ?? id;
