import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER } from '../parts/Act3';
import { GY, item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 19. What about existing systems and technical debt? Agents extract the graph from the code and
// the custodians review it; extraction shows duplicated and tangled parts; a target the enterprise has
// decided on lives in the specifications until the change reaches the code, because the graph keeps
// parity with the code; legacy modernization is the exception, with a graph for the target.
const CODE = { x: 150, y: LOWER.y + 10, w: 560, h: 120 };

export const scene19: SceneDef = {
  n: 19,
  id: 'existing-systems-tech-debt',
  View: () => (
    <Frame act="Act 3" scene="Scene 19 · What about existing systems and technical debt?">
      <Svg>
        <Base />
        <g className="pre codebase">
          <rect x={CODE.x} y={CODE.y} width={CODE.w} height={CODE.h} rx={10} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2} />
          {Array.from({ length: 6 }, (_, r) => <rect key={r} x={CODE.x + 20} y={CODE.y + 18 + r * 16} width={[420, 300, 380, 240, 460, 200][r]} height={7} rx={3} fill={C.layer.code} opacity={0.6} />)}
          <text x={CODE.x + CODE.w - 14} y={CODE.y + CODE.h - 12} textAnchor="end" fontFamily={F.mono} fontSize={14} fill={C.text}>existing code</text>
          {[0, 1, 2].map((i) => <AgentIcon key={i} x={CODE.x + CODE.w + 40 + i * 44} y={CODE.y + 40} s={24} />)}
        </g>
        <g className="pre ticks">{KINDS.map((k) => <circle key={k.id} cx={item(k.id, 0).x - 40} cy={GY[k.id] + 27} r={8} fill={C.pass} />)}</g>
        <g className="pre amber">
          <rect x={item('design', 1).x - 20} y={GY.design + 4} width={160} height={40} rx={8} fill="none" stroke={C.warn} strokeWidth={2.5} />
          <rect x={item('architecture', 2).x - 20} y={GY.architecture + 4} width={260} height={40} rx={8} fill="none" stroke={C.warn} strokeWidth={2.5} />
        </g>
        <g className="pre stream">{[0, 1, 2, 3, 4].map((i) => <rect key={i} className={`st st-${i}`} x={AGENT.x + 40 + i * 30} y={Y.flow + 50} width={22} height={12} rx={3} fill={i % 2 ? C.warn : C.text} />)}</g>
        <g className="pre target">
          <Card className="tgt" x={780} y={LOWER.y + 10} w={360} h={50} lines={0} tone={C.card} />
          <text x={800} y={LOWER.y + 42} fontFamily={F.sans} fontSize={18} fill={C.text}>target: new authorization service</text>
          <text x={800} y={LOWER.y + 86} fontFamily={F.mono} fontSize={14} fill={C.muted}>in the specifications</text>
        </g>
        <g className="pre notyet">
          {['Product B', 'Product C'].map((p, i) => <g key={p}><rect x={1200 + i * 270} y={LOWER.y + 10} width={250} height={50} rx={8} fill="none" stroke={C.muted} strokeDasharray="6 5" /><text x={1214 + i * 270} y={LOWER.y + 32} fontFamily={F.mono} fontSize={14} fill={C.text}>{p}</text><text x={1214 + i * 270} y={LOWER.y + 52} fontFamily={F.sans} fontSize={15} fill={C.warn}>not adopted yet</text></g>)}
        </g>
        <text className="pre parity" x={1760} y={GY.code + 76} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.text}>graph: parity with the code</text>
        <line className="pre ia" x1={STATIONS[0].x} y1={Y.flow - 40} x2={item('architecture', 4).x} y2={item('architecture', 4).y} stroke={C.text} strokeWidth={3} />
        <line className="pre sync" x1={STATIONS[2].x} y1={Y.flow - 38} x2={STATIONS[2].x} y2={GY.code + 27} stroke={C.layer.code} strokeWidth={4} />
        <g className="pre modern">
          {[0, 1, 2].map((i) => <rect key={i} x={1200 + i * 90} y={LOWER.y + 76} width={80} height={56} rx={6} fill={C.canvasRaised} stroke={[C.layer.code, C.card, C.layer.architecture][i]} strokeWidth={i === 2 ? 3 : 1.5} />)}
          <text x={1480} y={LOWER.y + 110} fontFamily={F.sans} fontSize={16} fill={C.text}>legacy modernization:</text>
          <text x={1480} y={LOWER.y + 130} fontFamily={F.sans} fontSize={16} fill={C.text}>a graph for the target</text>
        </g>
      </Svg>
      <Callout className="pre co-weeks" x={1180} y={GAP_Y - 8} w={520} kind="2M+ lines, typically" text="Extracted in two to three weeks" tone={C.text} target="fig.extraction" />
      <Callout className="pre co-tangled" x={1180} y={GAP_Y - 8} w={520} kind="Extraction shows the application as it is" text="Duplicated and tangled parts" tone={C.warn} target="extraction.patterns" />
      <Callout className="pre co-debt" x={1180} y={GAP_Y - 8} w={520} kind="Fast agents" text="Can add technical debt fast" tone={C.warn} target="debt.risk" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.g.band, .g.xlink, .tie'), { autoAlpha: 0 }, 0);
    // s1: agents extract the graph; the custodians review it.
    const s1 = cue('extract', 's0');
    appear(ctx, '.codebase', s1 + 0.2);
    KINDS.slice().reverse().forEach((k, i) => tl.fromTo(q(`.band-${k.id}`), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, s1 + 1.0 + i * 0.4));
    tl.to(q('.g.xlink, .tie'), { autoAlpha: 1, duration: 0.5 }, s1 + 2.8);
    appear(ctx, '.ticks', s1 + 3.2);
    // s2: two to three weeks.
    const s2 = cue('weeks', 's1');
    appear(ctx, '.co-weeks', s2 + 0.2);
    // s3: duplicated and tangled parts.
    const s3 = cue('tangled', 's2');
    vanish(ctx, '.co-weeks, .ticks', s3);
    appear(ctx, '.amber', s3 + 0.2, { y: 0 });
    appear(ctx, '.co-tangled', s3 + 0.4);
    // s4: fast agents can add debt fast.
    const s4 = cue('debt', 's3');
    vanish(ctx, '.co-tangled, .amber, .codebase', s4);
    [0, 1, 2, 3, 4].forEach((i) => tl.fromTo(q(`.st-${i}`), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.2 }, s4 + 0.2 + i * 0.15));
    tl.set(q('.stream'), { autoAlpha: 1 }, s4 + 0.2);
    appear(ctx, '.co-debt', s4 + 0.6);
    // s5 and s6: a target some products have not reached.
    const s5 = cue('target', 's4');
    vanish(ctx, '.co-debt, .stream', s5);
    appear(ctx, '.target', s5 + 0.2);
    const s6 = cue('notyet', 's5');
    appear(ctx, '.notyet', s6 + 0.2);
    // s7: the target lives in the specifications; the graph keeps parity with the code.
    const s7 = cue('parity', 's6');
    appear(ctx, '.parity', s7 + 0.3);
    // s8: impact analysis shows what the change touches; the code moves toward the target; the graph follows.
    const s8 = cue('move', 's7');
    tl.fromTo(q('.ia'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s8 + 0.3);
    tl.to(q(`.node-architecture-4 circle`), { attr: { r: 12 }, duration: 0.3 }, s8 + 1.1);
    vanish(ctx, '.ia', s8 + 2.2);
    tl.fromTo(q('.sync'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s8 + 2.6);
    vanish(ctx, '.sync', s8 + 4.0);
    // s9: legacy modernization keeps a graph for the target.
    const s9 = cue('modern', 's8');
    vanish(ctx, '.notyet', s9);
    appear(ctx, '.modern', s9 + 0.3);
  },
};
