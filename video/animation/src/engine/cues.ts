import narration from '../narration.json';
import overrides from '../cues.json';
import voice from '../voice-timing.json';

export type SceneText = { act: number; n: number; title: string; text: string; words: number; sentences: string[] };
export const SCENES = narration.scenes as SceneText[];
export const ACT_NAMES = narration.acts as Record<string, string>;
export const sceneText = (n: number) => SCENES.find((s) => s.n === n)!;

// Timing comes from the recorded voice when there is one: each sentence's measured length,
// with a short gap between sentences. Without a recording, speech is estimated at a steady pace.
export const WPM = 140;
type Voice = { lead: number; gap: number; tail: number; scenes: Record<string, number[]> };
const V = voice as Voice;
export const LEAD = V.lead ?? 0.6;
export const GAP = V.gap ?? 0.35;
export const TAIL = V.tail ?? 1.2;
const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

/** Length in seconds of each sentence of scene n: measured if recorded, else estimated. */
export const sentenceLengths = (n: number) => {
  const measured = V.scenes?.[String(n)];
  const s = sceneText(n);
  if (measured && measured.length === s.sentences.length) return measured;
  return s.sentences.map((x) => (words(x) / WPM) * 60);
};
export const hasVoice = (n: number) => (V.scenes?.[String(n)]?.length ?? -1) === sceneText(n).sentences.length;
export const sentenceStarts = (n: number) => {
  const gap = hasVoice(n) ? GAP : 0;
  let t = LEAD;
  return sentenceLengths(n).map((d) => { const at = t; t += d + gap; return at; });
};
export const sceneDuration = (n: number) => {
  const lens = sentenceLengths(n), gap = hasVoice(n) ? GAP : 0;
  return LEAD + lens.reduce((a, b) => a + b, 0) + gap * Math.max(0, lens.length - 1) + TAIL;
};

/** Resolves a position such as "s3", "s3+0.4", "end-1" or 2.5 to seconds from the scene start. */
export const resolve = (n: number, pos: string | number): number => {
  if (typeof pos === 'number') return pos;
  const m = pos.match(/^(s(\d+)|end)\s*([+-]\s*[\d.]+)?$/);
  if (!m) throw new Error(`Scene ${n}: cannot read cue position "${pos}"`);
  const starts = sentenceStarts(n);
  const base = m[1] === 'end' ? sceneDuration(n) : starts[Math.min(Number(m[2]), starts.length - 1)] ?? sceneDuration(n);
  return base + (m[3] ? Number(m[3].replace(/\s/g, '')) : 0);
};

const table = (overrides as { scenes: Record<string, Record<string, string | number>> }).scenes;
/** A named cue for scene n: the override in cues.json if there is one, else the scene's own default. */
export const cueFor = (n: number) => (name: string, fallback: string | number) => resolve(n, table[String(n)]?.[name] ?? fallback);
