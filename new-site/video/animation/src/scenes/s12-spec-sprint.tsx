import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER, SPEC_STATIONS, SpecLane } from '../parts/Act3';
import { item, GY } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 12. Who prepares a change before coding starts? The spec sprint runs a step ahead: the
// custodians draft, analyze and review each specification, each for their own layer.
const LANE_Y = LOWER.y + 47;

export const scene12: SceneDef = {
  n: 12,
  id: 'spec-sprint',
  View: () => (
    <Frame act="Act 3" scene="Scene 12 · Who prepares a change before coding starts?">
      <Svg>
        <Base />
        <text className="pre impl-label" x={150} y={Y.flow - 50} fontFamily={F.mono} fontSize={15} letterSpacing={2} fill={C.muted}>IMPLEMENTATION SPRINT</text>
        <g className="pre waiting">{[0, 1, 2].map((i) => <Card key={i} className={`w w-${i}`} x={STATIONS[0].x - 210 - i * 14} y={Y.flow - 30 + i * 8} w={90} h={34} lines={2} tone={C.warn} />)}</g>
        <SpecLane className="pre lane" />
        <Card className="pre draft" x={SPEC_STATIONS[1].x - 60} y={LOWER.y - 30} w={120} h={40} lines={2} />
        <line className="pre ia" x1={SPEC_STATIONS[2].x} y1={LOWER.y + 22} x2={item('code', 2).x} y2={item('code', 2).y} stroke={C.text} strokeWidth={3} />
        {KINDS.map((k) => <circle key={k.id} className={`pre newnode newnode-${k.id}`} cx={item(k.id, 2).x + 70} cy={GY[k.id] + 19} r={8} fill={C.text} />)}
        <Card className="pre ready" x={SPEC_STATIONS[3].x - 60} y={LOWER.y - 30} w={120} h={40} label="spec + report" tone={C.text} />
        <rect className="pre runner" x={STATIONS[0].x - 14} y={Y.flow + 46} width={28} height={16} rx={4} fill={C.text} />
        <rect className="pre back" x={STATIONS[1].x - 14} y={Y.flow + 46} width={28} height={16} rx={4} fill={C.warn} />
      </Svg>
      <Callout className="pre co-days" x={1180} y={GAP_Y - 8} w={480} kind="The custodians" text="One or two days, several requests together" tone={C.text} target="sprint.spec" />
      <Callout className="pre co-known" x={1180} y={GAP_Y - 8} w={480} kind="Implementation sprint" text="Works from specifications whose risks are known" tone={C.pass} target="sprint.implementation" />
      <Callout className="pre co-back" x={1180} y={GAP_Y - 8} w={480} kind="Missing context" text="Back to the spec sprint" tone={C.warn} target="sprint.push-back" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: coding is fast; preparing specifications is the slowest step.
    const s1 = cue('slowest', 's0');
    appear(ctx, '.impl-label', s1);
    appear(ctx, '.waiting', s1 + 0.4);
    // s2: the spec sprint, a step ahead.
    const s2 = cue('lane', 's1');
    appear(ctx, '.lane', s2 + 0.2);
    // s3: the custodians meet.
    const s3 = cue('meet', 's2');
    vanish(ctx, '.waiting', s3);
    tl.fromTo(q('.top .cus'), { opacity: 1 }, { opacity: 1, duration: 0.1 }, s3);
    appear(ctx, '.co-days', s3 + 0.3);
    // s4: the product owner drafts the specification.
    const s4 = cue('draft', 's3');
    vanish(ctx, '.co-days', s4);
    tl.to(q('.top .cus'), { opacity: 0.3, duration: 0.3 }, s4);
    tl.to(q('.top .cus-functional'), { opacity: 1, duration: 0.3 }, s4);
    appear(ctx, '.draft', s4 + 0.3);
    // s5: impact analysis reports what it will touch.
    const s5 = cue('impact', 's4');
    tl.fromTo(q('.ia'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9 }, s5 + 0.2);
    // s6: each custodian reviews their own layer.
    const s6 = cue('review', 's5');
    vanish(ctx, '.ia', s6);
    KINDS.forEach((k, i) => {
      const at = s6 + 0.2 + i * 1.1;
      tl.to(q('.top .cus, .g.band'), { opacity: 0.3, duration: 0.2 }, at);
      tl.to(q(`.top .cus-${k.id}, .band-${k.id}`), { opacity: 1, duration: 0.2 }, at);
    });
    // s7: new items added to the layers.
    const s7 = cue('add', 's6');
    tl.to(q('.top .cus, .g.band'), { opacity: 1, duration: 0.3 }, s7);
    KINDS.forEach((k, i) => appear(ctx, `.newnode-${k.id}`, s7 + 0.3 + i * 0.3, { y: 0 }));
    // s8: the finished specification goes into the implementation backlog.
    const s8 = cue('backlog', 's7');
    vanish(ctx, '.draft', s8);
    appear(ctx, '.ready', s8 + 0.1);
    tl.to(q('.ready'), { x: STATIONS[0].x + 140 - SPEC_STATIONS[3].x, y: Y.flow - 104 - (LOWER.y - 30), duration: 1.4 }, s8 + 0.6);
    // s9: implementation works from known risks.
    const s9 = cue('known', 's8');
    vanish(ctx, '.ready', s9);
    appear(ctx, '.runner', s9 + 0.1);
    tl.to(q('.runner'), { attr: { x: STATIONS[3].x - 14 }, duration: 2.4, ease: 'power1.inOut' }, s9 + 0.3);
    appear(ctx, '.co-known', s9 + 0.8);
    // s10: missing context goes back.
    const s10 = cue('back', 's9');
    vanish(ctx, '.co-known, .runner', s10);
    appear(ctx, '.back', s10 + 0.1);
    tl.to(q('.back'), { attr: { y: LANE_Y - 8, x: SPEC_STATIONS[1].x - 14 }, duration: 1.4 }, s10 + 0.5);
    appear(ctx, '.co-back', s10 + 0.6);
  },
};
