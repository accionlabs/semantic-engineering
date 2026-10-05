import React, { useLayoutEffect, useRef } from 'react';
import { gsap, TL } from './gsap';
import { ACT_NAMES, SCENES, sceneDuration } from './cues';
import { SceneDef, buildCaptions, makeCtx } from './scene';
import { Frame } from '../parts/ui';
import { C, F, H, W } from '../theme';

export const CARD = 2.6;
export const TITLE = 4;

type Item = { key: string; n?: number; duration: number; View: React.FC; build: (root: Element) => TL };

const titleItem = (): Item => ({
  key: 'title', duration: TITLE,
  View: () => (
    <Frame act="" scene="">
      <div className="t" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 92, letterSpacing: -1 }}>SaaS architecture when code is cheap</div>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: C.warn, marginTop: 30, letterSpacing: 2 }}>REVIEW CUT · TEXT IN PLACE OF VOICE · NO AUDIO</div>
      </div>
    </Frame>
  ),
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const t = root.querySelector('.t');
    tl.fromTo(t, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 0).to(t, { autoAlpha: 0, duration: 0.5 }, TITLE - 0.5);
    return tl;
  },
});

const cardItem = (act: number): Item => ({
  key: `card-${act}`, duration: CARD,
  View: () => (
    <Frame act="" scene="">
      <div className="t" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: 4, color: C.line, textTransform: 'uppercase' }}>{act === 5 ? 'Act 5 · optional' : `Act ${act}`}</div>
        <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 76, marginTop: 18, textAlign: 'center', maxWidth: 1500 }}>{ACT_NAMES[String(act)]}</div>
        {act === 5 && <div style={{ fontSize: 26, color: C.muted, marginTop: 22 }}>Also offered on the site as drill-down chapters.</div>}
      </div>
    </Frame>
  ),
  build: (root) => {
    const tl = gsap.timeline({ paused: true });
    const t = root.querySelector('.t');
    tl.fromTo(t, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0).to(t, { autoAlpha: 0, duration: 0.4 }, CARD - 0.4);
    return tl;
  },
});

const sceneItem = (def: SceneDef): Item => ({
  key: def.id, n: def.n, duration: sceneDuration(def.n), View: def.View,
  build: (root) => {
    const ctx = makeCtx(def.n, root);
    ctx.tl.set(ctx.q('.pre'), { autoAlpha: 0 }, 0);
    def.build(ctx);
    buildCaptions(ctx);
    ctx.tl.set({}, {}, ctx.duration); // the scene lasts its full length even if motion ends early
    return ctx.tl;
  },
});

/** The running order: title, then each act's card before its scenes. */
export const itemsFor = (defs: SceneDef[], from: number, to: number, title = true): Item[] => {
  const items: Item[] = title && from === 1 ? [titleItem()] : [];
  let act = 0;
  SCENES.filter((s) => s.n >= from && s.n <= to).forEach((s) => {
    const def = defs.find((d) => d.n === s.n);
    if (!def) return;
    if (s.act !== act) { act = s.act; items.push(cardItem(act)); }
    items.push(sceneItem(def));
  });
  return items;
};

export type Film = { master: TL; duration: number; chapters: { key: string; n?: number; start: number; duration: number }[] };

/** Mounts every item once and places each item's timeline on one paused master timeline. */
export const FilmView: React.FC<{ items: Item[]; onReady: (f: Film) => void }> = ({ items, onReady }) => {
  const roots = useRef<(HTMLDivElement | null)[]>([]);
  useLayoutEffect(() => {
    const master = gsap.timeline({ paused: true });
    const chapters: Film['chapters'] = [];
    let start = 0;
    items.forEach((it, i) => {
      const root = roots.current[i]!;
      gsap.set(root, { autoAlpha: 0 });
      const tl = it.build(root);
      tl.paused(false);
      master.set(root, { autoAlpha: 1 }, start);
      master.add(tl, start);
      master.set(root, { autoAlpha: 0 }, start + it.duration);
      chapters.push({ key: it.key, n: it.n, start, duration: it.duration });
      start += it.duration;
    });
    master.set({}, {}, start);
    master.seek(0);
    onReady({ master, duration: start, chapters });
  }, []);
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: C.canvas }}>
      {items.map((it, i) => (
        <div key={it.key} ref={(el) => { roots.current[i] = el; }} className={`item item-${it.key}`} style={{ position: 'absolute', inset: 0, visibility: 'hidden' }}>
          <it.View />
        </div>
      ))}
    </div>
  );
};
