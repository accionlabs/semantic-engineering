import React from 'react';
import { gsap, TL } from './gsap';
import { cueFor, sceneDuration, sentenceLengths, sentenceStarts, sceneText } from './cues';

export type Ctx = {
  n: number;
  tl: TL;
  /** Scoped selector: q('.x') finds elements inside this scene only. */
  q: (sel: string) => Element[];
  /** A named cue, with the scene's default position. */
  cue: (name: string, fallback: string | number) => number;
  duration: number;
};

export type SceneDef = {
  n: number;
  id: string;
  /** Static markup. Drawn once; GSAP does all the moving. */
  View: React.FC;
  /** Adds this scene's motion to its timeline, positioned in seconds from the scene start. */
  build: (ctx: Ctx) => void;
};

export const makeCtx = (n: number, root: Element): Ctx => ({
  n,
  tl: gsap.timeline({ paused: true }),
  q: gsap.utils.selector(root) as unknown as (s: string) => Element[],
  cue: cueFor(n),
  duration: sceneDuration(n),
});

export type Beat = { id: string; at: number; regions: string[]; callout?: string };

/**
 * One focus at a time. From each beat's start, its regions go to full strength and every other
 * region dims; its callout appears and leaves when the next beat starts.
 */
export const focusBeats = (ctx: Ctx, beats: Beat[], dim = 0.2) => {
  const { tl, q, duration } = ctx;
  const all = Array.from(new Set(beats.flatMap((b) => b.regions)));
  beats.forEach((b, i) => {
    const next = beats[i + 1]?.at ?? duration;
    const off = all.filter((r) => !b.regions.includes(r));
    if (off.length) tl.to(off.flatMap((r) => q(r)), { opacity: dim, duration: 0.5 }, b.at);
    tl.to(b.regions.flatMap((r) => q(r)), { opacity: 1, duration: 0.5 }, b.at);
    if (b.callout) {
      tl.fromTo(q(b.callout), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, b.at + 0.15);
      if (i < beats.length - 1) tl.to(q(b.callout), { autoAlpha: 0, duration: 0.35 }, next - 0.2);
    }
  });
};

/** Fades an element (or selector) in, rising slightly. */
export const appear = (ctx: Ctx, sel: string, at: number, opts: gsap.TweenVars = {}) =>
  ctx.tl.fromTo(ctx.q(sel), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ...opts }, at);
export const vanish = (ctx: Ctx, sel: string, at: number, opts: gsap.TweenVars = {}) =>
  ctx.tl.to(ctx.q(sel), { autoAlpha: 0, duration: 0.4, ...opts }, at);

// Captions: the narration as a text overlay, one short line at a time, standing in for the voice.
export const chunk = (sentence: string, max = 13) => {
  const w = sentence.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur: string[] = [];
  w.forEach((x, i) => {
    cur.push(x);
    const soft = /[,:;]$/.test(x) && cur.length >= 6 && w.length - i - 1 >= 4;
    if (cur.length >= max || soft) { out.push(cur.join(' ')); cur = []; }
  });
  if (cur.length) { if (cur.length < 4 && out.length) out[out.length - 1] += ' ' + cur.join(' '); else out.push(cur.join(' ')); }
  return out;
};
export const captionCues = (n: number) => {
  const starts = sentenceStarts(n), lens = sentenceLengths(n);
  const list: { at: number; end: number; text: string }[] = [];
  sceneText(n).sentences.forEach((s, k) => {
    // Each line of a sentence gets a share of the sentence's spoken length, by word count.
    const parts = chunk(s), total = parts.reduce((a, c) => a + c.split(/\s+/).length, 0);
    let t = starts[k];
    parts.forEach((c) => { const len = (c.split(/\s+/).length / total) * lens[k]; list.push({ at: t, end: t + len, text: c }); t += len; });
  });
  return list;
};
export const buildCaptions = (ctx: Ctx) => {
  const [box] = ctx.q('.caption-box');
  const [txt] = ctx.q('.caption-text');
  if (!box || !txt) return;
  ctx.tl.set(box, { autoAlpha: 0 }, 0);
  captionCues(ctx.n).forEach((c, i, arr) => {
    ctx.tl.set(txt, { text: c.text }, c.at);
    ctx.tl.set(box, { autoAlpha: 1 }, c.at);
    const gap = (arr[i + 1]?.at ?? Infinity) - c.end;
    if (gap > 0.35) ctx.tl.set(box, { autoAlpha: 0 }, c.end + 0.2);
  });
};
