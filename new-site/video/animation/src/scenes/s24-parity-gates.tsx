import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT_X, BAR, COLS, EXIT_X, GATES, LOW_Y, P, Pipeline, ROW, rowY, srcY, STAGES, Tick, TGT_H, tgtY } from '../parts/Pipeline';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 24. The parity contract and the four gates. The two graphs and the specification form the
// contract, fixed for the project; migration agents write each module; four gates, each run by its own
// agent; a failure returns with evidence until all four pass; nine agents over five stages; people check
// at two points; ASIMOV runs the five stages.
const CO = { x: 1130, y: LOW_Y + 40, w: 640 };
const MID = BAR.y + BAR.h / 2;
const START = AGENT_X + 190; // where a module waits, clear of the migration agents' label
// What each gate checks against: a Target-state band, or for the functional gate, the recorded statements.
const CHECK = [
  { x: COLS.target.x + 40, y: tgtY(0) + TGT_H / 2 },
  { x: COLS.target.x + 40, y: tgtY(3) + TGT_H / 2 },
  { x: COLS.target.x + 40, y: tgtY(2) + TGT_H / 2 },
  { x: COLS.source.x + COLS.source.w - 20, y: srcY(3) },
];
const Lock: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g><rect x={x - 9} y={y - 4} width={18} height={14} rx={3} fill={C.text} /><path d={`M${x - 5} ${y - 4} v-5 a5 5 0 0 1 10 0 v5`} fill="none" stroke={C.text} strokeWidth={2.5} /></g>
);

export const scene24: SceneDef = {
  n: 24,
  id: 'parity-contract-and-gates',
  View: () => (
    <Frame act="Act 4" scene="Scene 24 · The parity contract and the four gates">
      <Svg>
        <Pipeline show={['frame', 'source', 'spec', 'tags', 'target']} />
        <rect className="pre bracket" x={BAR.x - 16} y={P.y0 - 14} width={BAR.w + 32} height={BAR.y + BAR.h - P.y0 + 30} rx={18} fill="none" stroke={C.text} strokeWidth={2} strokeDasharray="10 8" />
        <g className="pre locks"><Lock x={COLS.source.x + COLS.source.w - 30} y={P.y0 + 26} /><Lock x={COLS.target.x + COLS.target.w - 30} y={P.y0 + 26} /></g>
        {GATES.map((g, i) => <line key={i} className={`pre chk chk-${i}`} x1={g.x} y1={BAR.y - 8} x2={CHECK[i].x} y2={CHECK[i].y} stroke={i === 3 ? C.layer.code : C.layer.architecture} strokeWidth={2.5} />)}
        {GATES.map((g, i) => <Tick key={i} className={`pre gt gt-${i}`} x={g.x} y={BAR.y - 26} />)}
        <Tick className="pre gfail" x={GATES[3].x} y={BAR.y - 26} ok={false} />
        <g className="pre reason">
          <rect x={GATES[3].x - 130} y={BAR.y + BAR.h + 42} width={260} height={34} rx={8} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
          <text x={GATES[3].x} y={BAR.y + BAR.h + 65} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.warn}>business rule deviates</text>
        </g>
        <g className="pre tokg">
          <rect className="tok" x={ROW.x + ROW.w / 2 - 18} y={rowY(0) + 18} width={36} height={18} rx={4} fill={C.text} />
          <rect className="ev" x={ROW.x + ROW.w / 2 + 22} y={rowY(0) + 16} width={22} height={22} rx={3} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} opacity={0} />
        </g>
        <g className="pre humans">
          <line x1={COLS.spec.x + 120} y1={LOW_Y + 20} x2={COLS.spec.x + 120} y2={BAR.y + BAR.h + 4} stroke={C.text} strokeWidth={1.5} strokeDasharray="3 4" />
          <Person x={COLS.spec.x + 120} y={LOW_Y + 40} r={15} />
          <text x={COLS.spec.x + 146} y={LOW_Y + 52} fontFamily={F.sans} fontSize={17} fill={C.text}>decisions in the specification</text>
          <line x1={EXIT_X} y1={LOW_Y + 20} x2={EXIT_X} y2={BAR.y + BAR.h + 4} stroke={C.text} strokeWidth={1.5} strokeDasharray="3 4" />
          <Person x={EXIT_X} y={LOW_Y + 40} r={15} />
          <text x={EXIT_X - 26} y={LOW_Y + 52} textAnchor="end" fontFamily={F.sans} fontSize={17} fill={C.text}>Modernization Expert</text>
        </g>
      </Svg>
      <Callout className="pre co co-contract" {...CO} kind="Parity contract" text="How the new system must behave; the agents must follow it" tone={C.text} target="contract.parity" />
      <Callout className="pre co co-fixed" {...CO} kind="Fixed for the project" text="Recorded legacy behavior and target architecture" tone={C.text} target="contract.parity" />
      <Callout className="pre co co-migrate" {...CO} kind="Migration agents" text="One module at a time, from the specification and the Target-state graph" tone={C.text} target="agent.migration" />
      <Callout className="pre co co-gates" {...CO} kind="Four validation gates" text="Each run by its own agent" tone={C.text} target="loop.migration-validation" />
      <Callout className="pre co co-loop" {...CO} kind="A failure returns with evidence" text="Until all four gates pass" tone={C.pass} target="loop.migration-validation" />
      <Callout className="pre co co-fleet" {...CO} kind="Nine named agents" text="Five stages" tone={C.text} target="fleet.nine-agents" />
      <Callout className="pre co co-asimov" {...CO} kind="ASIMOV" text="The platform that runs the five stages" tone={C.warn} target="pillar.agie" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const tok = q('.tok'), ev = q('.ev');
    // s1: the parity contract.
    const s1 = cue('contract', 's0');
    tl.set(q('.pp-bar'), { autoAlpha: 1 }, s1 + 0.2);
    tl.fromTo(q('.pp-bar'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, s1 + 0.2);
    appear(ctx, '.bracket', s1 + 0.6, { y: 0 });
    appear(ctx, '.co-contract', s1 + 0.9);
    // s2: neither graph changes during the project.
    const s2 = cue('fixed', 's1');
    vanish(ctx, '.co-contract, .bracket', s2);
    appear(ctx, '.locks', s2 + 0.3, { y: 0 });
    appear(ctx, '.co-fixed', s2 + 0.5);
    // s3: migration agents write each module.
    const s3 = cue('migrate', 's2');
    vanish(ctx, '.co-fixed', s3);
    appear(ctx, '.tokg', s3 + 0.2, { y: 0 });
    tl.to(tok, { attr: { x: START, y: MID - 9 }, duration: 1.6, ease: 'power1.inOut' }, s3 + 0.5);
    tl.to(ev, { attr: { x: START + 60, y: MID - 11 }, duration: 1.6, ease: 'power1.inOut' }, s3 + 0.5);
    tl.to(tok, { attr: { width: 54 }, duration: 0.3 }, s3 + 2.2);
    appear(ctx, '.co-migrate', s3 + 0.6);
    // s4: four gates.
    const s4 = cue('gates', 's3');
    vanish(ctx, '.co-migrate', s4);
    GATES.forEach((_, i) => tl.fromTo(q(`.pgate-${i}`), { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s4 + 0.3 + i * 0.25));
    tl.set(q('.pp-gates'), { autoAlpha: 1 }, s4 + 0.3);
    appear(ctx, '.co-gates', s4 + 0.6);
    // s5 to s8: one gate at a time; the functional gate stops it the first time.
    const k = ['arch', 'design', 'standards', 'functional'];
    GATES.forEach((g, i) => {
      const t = cue(`gate-${k[i]}`, `s${4 + i}`);
      if (i === 0) vanish(ctx, '.co-gates', t);
      tl.to(tok, { attr: { x: g.x - 64 }, duration: 0.9 }, t + 0.2);
      tl.to(ev, { attr: { x: g.x - 64 + 60 }, duration: 0.9 }, t + 0.2);
      tl.fromTo(q(`.chk-${i}`), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7 }, t + 1.1);
      if (i < 3) {
        appear(ctx, `.gt-${i}`, t + 1.9, { y: 0 });
        vanish(ctx, `.chk-${i}`, t + 2.8);
      } else {
        appear(ctx, '.gfail', t + 1.9, { y: 0 });
        appear(ctx, '.reason', t + 2.1);
      }
    });
    // s9: back with evidence, then through all four.
    const s9 = cue('loop', 's8');
    vanish(ctx, '.chk-3', s9);
    tl.to(ev, { opacity: 1, duration: 0.2 }, s9 + 0.2);
    tl.to(tok, { attr: { x: START }, duration: 1.0 }, s9 + 0.4);
    tl.to(ev, { attr: { x: START + 60 }, duration: 1.0 }, s9 + 0.4);
    vanish(ctx, '.gfail, .reason, .gt', s9 + 0.6);
    tl.to(ev, { opacity: 0, duration: 0.3 }, s9 + 1.6);
    tl.to(tok, { attr: { x: EXIT_X - 27 }, duration: 3.0, ease: 'none' }, s9 + 1.8);
    GATES.forEach((g, i) => appear(ctx, `.gt-${i}`, s9 + 1.8 + (3.0 * (g.x - START)) / (EXIT_X - 27 - START), { y: 0 }));
    appear(ctx, '.co-loop', s9 + 2.2);
    // s10: nine agents over five stages.
    const s10 = cue('fleet', 's9');
    vanish(ctx, '.co-loop', s10);
    tl.set(q('.pp-stages'), { autoAlpha: 1 }, s10 + 0.2);
    STAGES.forEach((_, i) => tl.fromTo(q(`.stage-${i}`), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s10 + 0.2 + i * 0.3));
    appear(ctx, '.co-fleet', s10 + 0.6);
    // s11: people check at two points.
    const s11 = cue('humans', 's10');
    vanish(ctx, '.co-fleet', s11);
    appear(ctx, '.humans', s11 + 0.3);
    // s12: ASIMOV runs the five stages.
    const s12 = cue('asimov', 's11');
    tl.set(q('.pp-pillars'), { autoAlpha: 1 }, s12 + 0.2);
    STAGES.forEach((_, i) => tl.fromTo(q(`.pillar-${i}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, s12 + 0.2 + i * 0.2));
    vanish(ctx, '.humans', s12 + 0.2);
    appear(ctx, '.co-asimov', s12 + 0.6);
  },
};
