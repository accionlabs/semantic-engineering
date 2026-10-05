import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Custodians, Defs, Flow, KindLabels } from '../parts/Landscape';
import { BAND_H, Bands, GX, GY, Ties } from '../parts/Graph';
import { COLS, LOW_Y, P, Pipeline, ROW, rowY, TGT_H, tgtY } from '../parts/Pipeline';
import { Body, Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C } from '../theme';

// Scene 26. Results, and the handover. The ASIMOV figures, each with its context; outcomes vary. When
// the client wants ongoing governance, the graph is carried over: the Source-state graph seeds the code
// layer, the Retain and Modify decisions the functional layer, the target blueprint the architecture and
// design layers; the same custodians continue, and the work moves to regular sprints.
const CHIPS = [
  { f: '15M+ lines', l: 'of legacy code modernized across more than ten programs', s: 'ASIMOV engagements', t: 'fig.asimov-15m-loc' },
  { f: 'Up to 4×', l: 'faster than manual modernization', s: 'indicative, on a one-million-line standalone codebase', t: 'fig.up-to-4x' },
  { f: 'Up to 70%', l: 'less migration time', s: 'indicative, on a one-million-line standalone codebase', t: 'fig.up-to-70pct' },
  { f: '2.1M lines', l: 'Java 8 to Java 21 in about three and a half months', s: 'inventory and warehouse platform', t: 'fig.java-21-upgrade' },
  { f: '3M lines', l: 'Delphi to cloud-native .NET 8, with about 60% less effort than manual', s: 'European education-technology provider', t: 'fig.delphi-net8' },
];
const POS = [{ x: 150, y: 170 }, { x: 700, y: 170 }, { x: 1250, y: 170 }, { x: 150, y: 450 }, { x: 700, y: 450 }];
// Each handover moves a part of the pipeline into one layer of the four-layer graph.
const BAND = (k: keyof typeof GY) => ({ x: GX.x0, y: GY[k], w: GX.x1 - GX.x0, h: BAND_H });
const MOVES = [
  { cls: 'hv-code', from: { x: COLS.source.x, y: P.y0, w: COLS.source.w, h: P.y1 - P.y0 }, to: BAND('code'), hue: C.layer.code },
  { cls: 'hv-functional', from: { x: ROW.x, y: rowY(0), w: ROW.w, h: rowY(1) + ROW.h - rowY(0) }, to: BAND('functional'), hue: C.layer.functional },
  { cls: 'hv-architecture', from: { x: COLS.target.x + 20, y: tgtY(0), w: COLS.target.w - 40, h: tgtY(2) + TGT_H - tgtY(0) }, to: BAND('architecture'), hue: C.layer.architecture },
  { cls: 'hv-design', from: { x: COLS.target.x + 20, y: tgtY(3), w: COLS.target.w - 40, h: TGT_H }, to: BAND('design'), hue: C.layer.design },
];

export const scene26: SceneDef = {
  n: 26,
  id: 'results-and-handover',
  View: () => (
    <Frame act="Act 4" scene="Scene 26 · Results, and the handover">
      <Svg>
        <g className="pipe"><Pipeline show={['frame', 'source', 'spec', 'tags', 'target', 'bar', 'gates']} /></g>
        {MOVES.map((m) => <rect key={m.cls} className={`pre hv ${m.cls}`} x={m.from.x} y={m.from.y} width={m.from.w} height={m.from.h} rx={10} fill="rgba(20,27,45,0.7)" stroke={m.hue} strokeWidth={4} />)}
        <g className="pre land">
          <Defs />
          <g className="top"><KindLabels /><Custodians /></g>
          <Bands className="g" named={false} />
          <Ties />
          <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        </g>
      </Svg>
      {CHIPS.map((c, i) => <FigureChip key={i} className={`pre chip chip-${i}`} x={POS[i].x} y={POS[i].y} w={500} figure={c.f} label={c.l} source={c.s} target={c.t} />)}
      <Body className="pre vary" x={1250} y={480} w={520} size={24} colour={C.text}>Actual outcomes vary by engagement scope, target stack and the modules selected.</Body>
      <Callout className="pre co co-travel" x={1130} y={LOW_Y + 10} w={640} kind="When the client wants ongoing governance" text="The graph is carried over to the new system" tone={C.text} target="handover.graph" />
      <Callout className="pre co co-sprints" x={1130} y={LOW_Y + 10} w={640} kind="The same four custodians" text="Project stages give way to regular sprints" tone={C.text} target="handover.custodians" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1 to s4: the figures, each with its context.
    const s1 = cue('fig-15m', 's0');
    tl.to(q('.pipe'), { opacity: 0.12, duration: 0.5 }, s1);
    appear(ctx, '.chip-0', s1 + 0.3);
    const s2 = cue('fig-indicative', 's1');
    appear(ctx, '.chip-1', s2 + 0.3);
    appear(ctx, '.chip-2', s2 + 0.8);
    appear(ctx, '.chip-3', cue('fig-java', 's2') + 0.3);
    appear(ctx, '.chip-4', cue('fig-delphi', 's3') + 0.3);
    // s5: outcomes vary.
    const s5 = cue('vary', 's4');
    tl.to(q('.chip'), { opacity: 0.45, duration: 0.4 }, s5 + 0.2);
    appear(ctx, '.vary', s5 + 0.3);
    // s6: the graph is carried over.
    const s6 = cue('travel', 's5');
    vanish(ctx, '.chip, .vary', s6);
    tl.to(q('.pipe'), { opacity: 1, duration: 0.6 }, s6 + 0.3);
    appear(ctx, '.co-travel', s6 + 0.6);
    // s7 to s9: each part moves into its layer.
    const move = (i: number, at: number) => {
      const m = MOVES[i];
      tl.set(q(`.${m.cls}`), { autoAlpha: 1 }, at);
      tl.to(q(`.${m.cls}`), { attr: { x: m.to.x, y: m.to.y, width: m.to.w, height: m.to.h }, duration: 1.6, ease: 'power2.inOut' }, at);
    };
    const s7 = cue('to-code', 's6');
    vanish(ctx, '.co-travel', s7);
    tl.to(q('.pp-bar, .pp-gates'), { opacity: 0, duration: 0.4 }, s7);
    tl.to(q('.pp-source, .col-source'), { opacity: 0.15, duration: 0.6 }, s7 + 0.3);
    move(0, s7 + 0.3);
    const s8 = cue('to-functional', 's7');
    tl.to(q('.spec-row-2, .spec-row-3, .spec-row-4, .tag-2, .tag-3'), { opacity: 0.1, duration: 0.5 }, s8 + 0.2);
    tl.to(q('.spec-row-0, .spec-row-1, .tag-0, .tag-1, .col-spec'), { opacity: 0.15, duration: 0.6 }, s8 + 1.0);
    move(1, s8 + 0.9);
    const s9 = cue('to-arch-design', 's8');
    tl.to(q('.pp-target, .col-target'), { opacity: 0.15, duration: 0.6 }, s9 + 0.3);
    move(2, s9 + 0.3);
    move(3, s9 + 0.7);
    // s10: the four layers settle under the same custodians; sprints resume.
    const s10 = cue('settle', 's9');
    vanish(ctx, '.pipe', s10, { duration: 0.6 });
    appear(ctx, '.land', s10 + 0.3, { y: 0, duration: 0.8 });
    vanish(ctx, '.hv', s10 + 1.0, { duration: 0.6 });
    appear(ctx, '.co-sprints', s10 + 1.2);
  },
};
