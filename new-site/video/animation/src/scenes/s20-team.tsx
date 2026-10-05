import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, COL, Y } from '../parts/Landscape';
import { Base, GAP_Y, LOWER, Mark, SpecLane } from '../parts/Act3';
import { GY, item } from '../parts/Graph';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 20. What changes for the team? The sprint, the ticket system and code review stay; a spec sprint
// is added; three layers; forward-deployed engineers; specialists across workstreams; the custodians stay
// human, because what they know comes from people; agents draft, custodians approve.
const LAYERS = ['custodians', 'implementation teams', 'enablement (Accion Labs)'];
const INPUTS = ['customer calls', 'user research', 'vendor contracts', 'compliance decisions'];

export const scene20: SceneDef = {
  n: 20,
  id: 'the-team',
  View: () => (
    <Frame act="Act 3" scene="Scene 20 · What changes for the team?">
      <Svg>
        <Base />
        <g className="pre kept">
          {['sprint', 'ticket system', 'code review'].map((t, i) => <g key={t}><Mark className="" x={170 + i * 260} y={LOWER.y + 30} /><text x={192 + i * 260} y={LOWER.y + 36} fontFamily={F.sans} fontSize={19} fill={C.text}>{t}</text></g>)}
          <text x={950} y={LOWER.y + 36} fontFamily={F.mono} fontSize={14} fill={C.muted}>unchanged</text>
        </g>
        <SpecLane className="pre lane" />
        <g className="pre layers">
          {LAYERS.map((l, i) => (
            <g key={l}><rect x={150} y={LOWER.y + 4 + i * 46} width={1580} height={38} rx={8} fill={C.canvasRaised} stroke={[C.text, C.muted, C.warn][i]} strokeWidth={1.5} />
              <text x={170} y={LOWER.y + 29 + i * 46} fontFamily={F.sans} fontSize={18} fill={C.text}>{l}</text></g>
          ))}
        </g>
        <g className="pre fde">
          <circle cx={COL.architecture} cy={Y.person} r={30} fill="none" stroke={C.warn} strokeWidth={2} strokeDasharray="5 4" />
          <text x={COL.architecture + 40} y={Y.person - 12} fontFamily={F.mono} fontSize={13} fill={C.warn}>forward-deployed engineer</text>
        </g>
        <g className="pre fractional">
          {[0, 1, 2].map((i) => <g key={i}><line x1={COL.architecture} y1={Y.name + 10} x2={500 + i * 420} y2={LOWER.y + 4} stroke={C.layer.architecture} strokeWidth={1.5} strokeDasharray="4 4" /><rect x={420 + i * 420} y={LOWER.y + 4} width={160} height={30} rx={6} fill={C.canvasRaised} stroke={C.layer.architecture} /><text x={500 + i * 420} y={LOWER.y + 24} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>workstream {i + 1}</text></g>)}
        </g>
        {INPUTS.map((t, i) => (
          <g key={t} className={`pre input input-${i}`}>
            <rect x={COL[KINDS[i].id] - 110} y={GAP_Y + 6} width={220} height={36} rx={18} fill={C.canvasRaised} stroke={C.text} />
            <text x={COL[KINDS[i].id]} y={GAP_Y + 30} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>{t}</text>
          </g>
        ))}
        <circle className="pre draft" cx={AGENT.x} cy={AGENT.y - 30} r={9} fill="none" stroke={C.layer.design} strokeWidth={2.5} strokeDasharray="4 3" />
        <Mark className="pre approve" x={COL.design + 34} y={Y.person - 30} />
        <Person className="pre fdefig" x={COL.architecture} y={Y.person} r={17} colour={C.warn} />
      </Svg>
      <Callout className="pre co-human" x={1180} y={GAP_Y - 8} w={480} kind="The custodians" text="Stay human" tone={C.text} target="custodians.human" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: what stays.
    const s1 = cue('kept', 's0');
    appear(ctx, '.kept', s1 + 0.2);
    // s2: a spec sprint is added.
    const s2 = cue('spec', 's1');
    vanish(ctx, '.kept', s2);
    appear(ctx, '.lane', s2 + 0.2);
    // s3: three layers.
    const s3 = cue('layers', 's2');
    vanish(ctx, '.lane', s3);
    appear(ctx, '.layers', s3 + 0.2);
    // s4: forward-deployed engineers fill custodian roles.
    const s4 = cue('fde', 's3');
    vanish(ctx, '.layers', s4 + 2.5);
    tl.to(q('.top .cus-architecture'), { opacity: 0.15, duration: 0.4 }, s4 + 0.2);
    appear(ctx, '.fde', s4 + 0.4, { y: 0 });
    appear(ctx, '.fdefig', s4 + 1.2, { y: 0 });
    // s5: specialists across workstreams.
    const s5 = cue('fractional', 's4');
    vanish(ctx, '.fde, .fdefig', s5);
    tl.to(q('.top .cus-architecture'), { opacity: 1, duration: 0.3 }, s5);
    appear(ctx, '.fractional', s5 + 0.3, { y: 0 });
    // s6: the custodians stay human.
    const s6 = cue('human', 's5');
    vanish(ctx, '.fractional', s6);
    tl.to(q('.g, .tie, .bottom'), { opacity: 0.25, duration: 0.4 }, s6);
    appear(ctx, '.co-human', s6 + 0.3);
    // s7: what they know comes from people.
    const s7 = cue('inputs', 's6');
    vanish(ctx, '.co-human', s7);
    INPUTS.forEach((_, i) => appear(ctx, `.input-${i}`, s7 + 0.2 + i * 0.3));
    // s8: agents draft; custodians approve.
    const s8 = cue('draft', 's7');
    vanish(ctx, '.input', s8);
    tl.to(q('.g, .tie, .bottom'), { opacity: 1, duration: 0.4 }, s8);
    appear(ctx, '.draft', s8 + 0.3, { y: 0 });
    tl.to(q('.draft'), { attr: { cx: item('design', 2).x + 60, cy: GY.design + 19 }, duration: 1.2 }, s8 + 0.5);
    appear(ctx, '.approve', s8 + 1.9, { y: 0 });
    tl.to(q('.draft'), { attr: { fill: C.layer.design, 'stroke-dasharray': '0' }, duration: 0.3 }, s8 + 2.2);
  },
};
