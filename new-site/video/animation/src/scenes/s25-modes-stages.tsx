import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT_X, BAR, COLS, EXIT_X, GATES, LOW_Y, Pipeline, srcNode, Tick } from '../parts/Pipeline';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 25. Five engagement modes and five delivery stages. Modes are sized to what the client commits
// to; each lights a wider part of the pipeline; each addresses a defined part of the tax (the page's
// table); a client may stop at any mode. Full Modernization runs in five stages, and while the first
// module is migrated, subject-matter experts tune the agents.
const MODES = [
  { name: 'Documentation Only', dur: '2 to 6 weeks' },
  { name: 'Discovery and Documentation', dur: '4 to 10 weeks' },
  { name: 'Migration Readiness', dur: '6 to 12 weeks' },
  { name: 'Full Modernization', dur: 'quarters to years' },
  { name: 'Maintain, Operate and Convergence', dur: 'continuous after Mode 4' },
];
const STAGE5 = [
  { name: 'Discovery and analysis', dur: 'two to four weeks' },
  { name: 'Building the graphs', dur: 'one to three weeks' },
  { name: 'First module (MVP)', dur: 'six to twelve weeks' },
  { name: 'Scaled migration', dur: 'quarters per module group' },
  { name: 'Acceptance testing and deployment', dur: 'per release wave' },
];
const GRID: [string, string[]][] = [
  ['Reverse-engineering', ['Closed', 'Closed', 'Closed', 'Closed', 'Closed']],
  ['Lost context', ['Partial', 'Substantial', 'Closed', 'Closed', 'Closed']],
  ['Validation vacuum', ['Not addressed', 'Not addressed', 'Partial', 'Closed', 'Sustained']],
  ['Knowledge disappearance', ['Partial', 'Partial', 'Not addressed', 'Partial', 'Closed']],
];
const tone = (v: string) => (v === 'Closed' || v === 'Sustained' ? C.pass : v === 'Not addressed' ? C.muted : C.warn);
const BOX = (i: number) => ({ x: 150 + i * 326, y: LOW_Y + 6, w: 306, h: 112 });
const PARTS = ['.col-source, .pp-source', '.col-spec, .pp-spec, .pp-tags', '.col-target, .pp-target', '.pp-bar, .pp-gates'];
const MID = BAR.y + BAR.h / 2;
const START = AGENT_X + 190;
const gx = (i: number) => 470 + i * 270; // coverage grid columns

const Strip: React.FC<{ cls: string; items: { name: string; dur: string }[]; numbered?: boolean }> = ({ cls, items, numbered }) => (
  <g className={`pre ${cls}`}>
    {items.map((m, i) => {
      const b = BOX(i);
      return (
        <g key={m.name} className={`${cls}-i ${cls}-${i}`}>
          <rect className="bx" x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
          {numbered && <text x={b.x + 16} y={b.y + 34} fontFamily={F.display} fontSize={28} fontWeight={700} fill={C.text}>{i + 1}</text>}
          <foreignObject x={b.x + (numbered ? 48 : 16)} y={b.y + 10} width={b.w - (numbered ? 60 : 28)} height={60}>
            <div style={{ fontFamily: F.sans, fontSize: 19, fontWeight: 600, lineHeight: 1.2, color: C.text }}>{m.name}</div>
          </foreignObject>
          <text x={b.x + 16} y={b.y + b.h - 16} fontFamily={F.mono} fontSize={15} fill={C.muted}>{m.dur}</text>
        </g>
      );
    })}
  </g>
);

export const scene25: SceneDef = {
  n: 25,
  id: 'modes-and-stages',
  View: () => (
    <Frame act="Act 4" scene="Scene 25 · Five engagement modes and five delivery stages">
      <Svg>
        <Pipeline show={['frame', 'source', 'spec', 'tags', 'target', 'bar', 'gates']} />
        <g className="pre deps">
          {[[0, 0, 2, 3], [1, 2, 3, 0], [2, 1, 4, 2], [1, 0, 2, 3]].map(([a, i, b, j], n) => {
            const p = srcNode(a, i), r = srcNode(b, j);
            return <path key={n} d={`M${p.x} ${p.y} Q${(p.x + r.x) / 2 + 60} ${(p.y + r.y) / 2} ${r.x} ${r.y}`} fill="none" stroke={C.text} strokeWidth={1.5} strokeDasharray="4 4" />;
          })}
        </g>
        <rect className="pre tok" x={START} y={MID - 9} width={36} height={18} rx={4} fill={C.text} />
        {GATES.map((g, i) => <Tick key={i} className={`pre gt gt-${i}`} x={g.x} y={BAR.y - 26} />)}
        <Strip cls="modes" items={MODES} numbered />
        <g className="pre grid">
          {[1, 2, 3, 4, 5].map((m, i) => <text key={m} x={gx(i)} y={LOW_Y + 14} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>Mode {m}</text>)}
          {GRID.map(([row, vals], r) => (
            <g key={row}>
              <text x={150} y={LOW_Y + 46 + r * 32} fontFamily={F.sans} fontSize={16} fill={C.text}>{row}</text>
              {vals.map((v, i) => <text key={i} x={gx(i)} y={LOW_Y + 46 + r * 32} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={tone(v)}>{v}</text>)}
            </g>
          ))}
        </g>
        <Strip cls="stg" items={STAGE5} />
        <g className="pre loops">
          <ellipse className="mv-loop" cx={(GATES[0].x + GATES[3].x) / 2} cy={MID} rx={(GATES[3].x - GATES[0].x) / 2 + 60} ry={52} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 5" opacity={0.6} />
          <text x={GATES[3].x + 90} y={BAR.y - 18} fontFamily={F.mono} fontSize={13} fill={C.muted} opacity={0.8}>migration and validation: minutes to hours</text>
          <path className="sme-loop" d={`M${AGENT_X - 20} ${BAR.y} C ${AGENT_X - 40} 400, ${AGENT_X - 60} 330, ${AGENT_X + 40} 330 S ${AGENT_X + 120} 480, ${AGENT_X + 20} ${BAR.y}`} fill="none" stroke={C.people} strokeWidth={2.5} />
          <Person x={AGENT_X + 40} y={290} r={16} />
          <text x={AGENT_X + 72} y={284} fontFamily={F.sans} fontSize={19} fontWeight={600} fill={C.text}>subject-matter experts</text>
          <text x={AGENT_X + 72} y={308} fontFamily={F.sans} fontSize={19} fill={C.text}>tune the agents</text>
          <text x={AGENT_X + 72} y={332} fontFamily={F.mono} fontSize={15} fill={C.muted}>typically weeks</text>
        </g>
      </Svg>
      <Callout className="pre co co-commit" x={COLS.spec.x} y={92} w={460} kind="Five engagement modes" text="Sized to the work the client commits to" tone={C.text} target="modes.why" />
      <Callout className="pre co co-stop" x={COLS.spec.x} y={92} w={460} kind="Each mode addresses part of the tax" text="A client may stop at any mode" tone={C.text} target="modes.stopping-points" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const spot = (at: number, lit: number[], dim = 0.12) => PARTS.forEach((sel, i) => tl.to(q(sel), { opacity: lit.includes(i) ? 1 : dim, duration: 0.4 }, at));
    // s1: five modes.
    const s1 = cue('modes', 's0');
    tl.set(q('.modes'), { autoAlpha: 1 }, s1 + 0.2);
    MODES.forEach((_, i) => tl.fromTo(q(`.modes-${i}`), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s1 + 0.2 + i * 0.25));
    // s2: sized to commitment.
    const s2 = cue('commit', 's1');
    spot(s2, [0, 1, 2, 3], 0.35);
    appear(ctx, '.co-commit', s2 + 0.3);
    // s3 to s7: each mode lights its part of the pipeline.
    const lit = [[0], [0], [0, 1, 2], [0, 1, 2, 3], [2]];
    MODES.forEach((_, i) => {
      const t = cue(`mode-${i + 1}`, `s${2 + i}`);
      if (i === 0) vanish(ctx, '.co-commit', t);
      spot(t + 0.1, lit[i]);
      tl.to(q('.modes .bx'), { attr: { stroke: C.muted, 'stroke-width': 1.5 }, duration: 0.3 }, t + 0.1);
      tl.to(q(`.modes-${i} .bx`), { attr: { stroke: C.text, 'stroke-width': 3 }, duration: 0.3 }, t + 0.1);
      if (i === 1) appear(ctx, '.deps', t + 0.5, { y: 0 });
      if (i === 2) { vanish(ctx, '.deps', t + 0.1); tl.to(q('.pp-bar, .pp-gates'), { opacity: 0.4, duration: 0.4 }, t + 0.5); }
      if (i === 3) {
        appear(ctx, '.tok', t + 0.4, { y: 0 });
        tl.to(q('.tok'), { attr: { x: EXIT_X - 18 }, duration: 3.0, ease: 'none' }, t + 0.6);
        GATES.forEach((g, n) => appear(ctx, `.gt-${n}`, t + 0.6 + (3.0 * (g.x - START)) / (EXIT_X - 18 - START), { y: 0 }));
      }
      if (i === 4) {
        vanish(ctx, '.tok, .gt', t + 0.1);
        tl.fromTo(q('.col-target .col-rect'), { attr: { stroke: C.muted } }, { attr: { stroke: C.layer.architecture, 'stroke-width': 3 }, duration: 0.5 }, t + 0.4);
      }
    });
    // s8: the coverage table; a client may stop at any mode.
    const s8 = cue('grid', 's7');
    vanish(ctx, '.modes', s8);
    spot(s8, [0, 1, 2, 3], 0.2);
    tl.to(q('.col-target .col-rect'), { attr: { stroke: C.hairline, 'stroke-width': 1.5 }, duration: 0.3 }, s8);
    appear(ctx, '.grid', s8 + 0.4);
    appear(ctx, '.co-stop', s8 + 0.8);
    // s9: Full Modernization in five stages.
    const s9 = cue('stages', 's8');
    vanish(ctx, '.grid, .co-stop', s9);
    spot(s9, [0, 1, 2, 3], 0.5);
    tl.set(q('.stg'), { autoAlpha: 1 }, s9 + 0.3);
    STAGE5.forEach((_, i) => {
      tl.fromTo(q(`.stg-${i}`), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, s9 + 0.3 + i * 0.9);
      tl.to(q(`.stg-${i} .bx`), { attr: { stroke: C.text }, duration: 0.2, repeat: 1, yoyo: true }, s9 + 0.5 + i * 0.9);
    });
    // s10: the first module; experts tune the agents.
    const s10 = cue('tuning', 's9');
    tl.to(q('.stg-i'), { opacity: 0.35, duration: 0.3 }, s10);
    tl.to(q('.stg-2'), { opacity: 1, duration: 0.3 }, s10);
    tl.to(q('.stg-2 .bx'), { attr: { stroke: C.text, 'stroke-width': 3 }, duration: 0.3 }, s10);
    tl.to(q('.pp-source, .pp-target, .col-source, .col-target'), { opacity: 0.2, duration: 0.4 }, s10);
    tl.set(q('.loops'), { autoAlpha: 1 }, s10 + 0.3);
    tl.fromTo(q('.mv-loop'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, s10 + 0.3);
    tl.fromTo(q('.sme-loop'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6 }, s10 + 0.8);
  },
};
