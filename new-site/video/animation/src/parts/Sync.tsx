import React from 'react';
import type { Ctx } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AgentIcon, STATIONS, Y } from './Landscape';
import { GRAPH_BOTTOM, GX, GY, item } from './Graph';
import { C, F } from '../theme';

// The graph kept in step with the code (scenes 8, 15 and 19). The pull request waits at Review, not yet
// merged; the KG Sync Agent updates the items the change touched and adds the new one; the graph shows
// as updated; only then does the change merge, and the graph matches the main branch.
const PR = STATIONS[2];
const MERGE = STATIONS[3];
const SYNC = { x: PR.x, y: GRAPH_BOTTOM + 56 };
const TOUCHED = [item('code', 2), item('architecture', 3)];
const NEW = { x: item('code', 2).x + 110, y: GY.code + 40 };

export const GraphSync: React.FC = () => (
  <g>
    <g className="pre gs gs-pr">
      <rect x={PR.x - 18} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
      <text x={PR.x} y={Y.flow + 84} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.warn}>pull request · not merged</text>
    </g>
    <rect className="pre gs gs-tok" x={PR.x - 18} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
    <g className="pre gs gs-agent">
      <AgentIcon x={SYNC.x} y={SYNC.y} s={36} />
      <text x={SYNC.x - 32} y={SYNC.y + 7} textAnchor="end" fontFamily={F.mono} fontSize={19} fill={C.layer.code}>KG Sync Agent</text>
    </g>
    {[...TOUCHED, NEW].map((p, n) => <line key={n} className={`pre gs gs-line gs-line-${n}`} x1={SYNC.x} y1={SYNC.y - 18} x2={p.x} y2={p.y} stroke={C.layer.code} strokeWidth={2.5} strokeDasharray="0" />)}
    {TOUCHED.map((p, n) => <circle key={n} className="pre gs gs-ring" cx={p.x} cy={p.y} r={14} fill="none" stroke={C.pass} strokeWidth={3} />)}
    {TOUCHED.map((p, n) => <text key={n} className="pre gs gs-tag" x={p.x + 20} y={p.y - 6} fontFamily={F.mono} fontSize={15} fill={C.pass}>updated</text>)}
    <text className="pre gs gs-tag gs-newtag" x={NEW.x + 14} y={NEW.y + 6} fontFamily={F.mono} fontSize={15} fill={C.pass}>new</text>
    <line className="pre gs gs-newlink" x1={item('code', 2).x} y1={item('code', 2).y} x2={NEW.x} y2={NEW.y} stroke={C.layer.code} strokeWidth={1.5} />
    <circle className="pre gs gs-new" cx={NEW.x} cy={NEW.y} r={0} fill={C.pass} />
    <g className="pre gs gs-done">
      <circle cx={SYNC.x + 44} cy={SYNC.y} r={13} fill={C.pass} />
      <path d={`M${SYNC.x + 38} ${SYNC.y} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" />
      <text x={SYNC.x + 66} y={SYNC.y + 8} fontFamily={F.sans} fontSize={23} fontWeight={600} fill={C.pass}>graph updated</text>
    </g>
    <g className="pre gs gs-main">
      <line x1={MERGE.x} y1={Y.flow - 38} x2={MERGE.x} y2={GRAPH_BOTTOM} stroke={C.pass} strokeWidth={2} strokeDasharray="5 5" />
      <rect x={GX.x1 - 290} y={GRAPH_BOTTOM + 8} width={290} height={38} rx={19} fill={C.canvasRaised} stroke={C.pass} strokeWidth={1.5} />
      <text x={GX.x1 - 145} y={GRAPH_BOTTOM + 33} textAnchor="middle" fontFamily={F.mono} fontSize={18} fill={C.pass}>graph = main branch</text>
    </g>
  </g>
);

/** The pull request waits; the KG Sync Agent updates the graph. Returns the time it finishes. */
export const syncUpdate = (ctx: Ctx, at: number) => {
  const { tl, q } = ctx;
  appear(ctx, '.gs-pr', at, { y: 0 });
  appear(ctx, '.gs-agent', at + 0.5);
  [0, 1, 2].forEach((n) => tl.fromTo(q(`.gs-line-${n}`), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6 }, at + 1.0 + n * 0.25));
  appear(ctx, '.gs-ring', at + 1.8, { y: 0 });
  appear(ctx, '.gs-tag', at + 2.0, { y: 0 });
  tl.to(q('.gs-newtag'), { autoAlpha: 0, duration: 0 }, at + 2.0);
  appear(ctx, '.gs-newtag', at + 2.6, { y: 0 });
  TOUCHED.forEach((_, n) => tl.fromTo(q('.gs-ring')[n], { attr: { r: 22 } }, { attr: { r: 14 }, duration: 0.5 }, at + 1.8));
  tl.fromTo(q('.gs-newlink'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4 }, at + 2.1);
  tl.fromTo(q('.gs-new'), { autoAlpha: 1, attr: { r: 0 } }, { attr: { r: 8 }, duration: 0.4, ease: 'back.out(2)' }, at + 2.4);
  vanish(ctx, '.gs-line', at + 3.0);
  appear(ctx, '.gs-done', at + 3.0, { y: 0 });
  return at + 3.6;
};

/** Only after the update does the change merge; the graph matches the main branch. Returns the end time. */
export const syncMerge = (ctx: Ctx, at: number) => {
  const { tl, q } = ctx;
  tl.set(q('.gs-tok'), { autoAlpha: 1 }, at);
  vanish(ctx, '.gs-pr', at, { duration: 0.2 });
  tl.to(q('.gs-tok'), { attr: { x: MERGE.x - 18 }, duration: 1.2 }, at + 0.1);
  tl.to(q('.gs-new'), { attr: { fill: C.layer.code }, duration: 0.4 }, at + 1.3);
  vanish(ctx, '.gs-ring, .gs-tag', at + 1.3);
  appear(ctx, '.gs-main', at + 1.4, { y: 0 });
  return at + 2.0;
};

/** Clear the sequence before the next beat. */
export const syncClear = (ctx: Ctx, at: number) => vanish(ctx, '.gs', at);
