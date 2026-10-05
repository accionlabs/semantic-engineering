import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { Y } from '../parts/Landscape';
import { Base, GAP_Y, LOWER } from '../parts/Act3';
import { GRAPH_BOTTOM } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 18. What happens across many products? One graph per product, shared by its teams; one product
// at a time; enterprise-wide knowledge defined once and read under access rights; links where products
// integrate; a quarterly look for duplicated and unused capability.
const PROD = ['A', 'B', 'C', 'D'];
const BOX = (i: number) => ({ x: 360 + i * 360, y: LOWER.y + 62, w: 300, h: 76 });
const ENTERPRISE = ['compliance', 'security', 'infrastructure', 'deployment pipelines', 'design system'];

const MiniProduct: React.FC<{ i: number }> = ({ i }) => {
  const b = BOX(i);
  return (
    <g className={`pre prod prod-${i}`}>
      <rect className="pbox" x={b.x} y={b.y} width={b.w} height={b.h} rx={10} fill={C.canvasRaised} stroke={C.muted} strokeWidth={2} strokeDasharray={i ? '7 5' : '0'} />
      {KINDS.map((k, r) => <rect key={k.id} className="pband" x={b.x + 50} y={b.y + 10 + r * 15} width={b.w - 64} height={10} rx={3} fill="none" stroke={C.layer[k.id]} strokeWidth={1.2} opacity={i ? 0.35 : 1} />)}
      <text x={b.x + 14} y={b.y + 44} fontFamily={F.mono} fontSize={16} fill={C.text}>{PROD[i]}</text>
    </g>
  );
};

export const scene18: SceneDef = {
  n: 18,
  id: 'many-products',
  View: () => (
    <Frame act="Act 3" scene="Scene 18 · What happens across many products?">
      <Svg>
        <Base />
        <g className="pre teams">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line x1={240 + i * 40} y1={Y.flow - 40} x2={240 + i * 40} y2={GRAPH_BOTTOM} stroke={C.text} strokeWidth={2} />
              <text x={240 + i * 40} y={Y.flow - 46} textAnchor="middle" fontFamily={F.mono} fontSize={12} fill={C.muted}>T{i + 1}</text>
            </g>
          ))}
          <text x={180} y={Y.flow + 64} fontFamily={F.mono} fontSize={14} fill={C.text}>three teams, one product graph</text>
        </g>
        {PROD.map((_, i) => <MiniProduct key={i} i={i} />)}
        <g className="pre quarter">{[0, 1, 2].map((i) => <rect key={i} className={`qt qt-${i}`} x={BOX(0).x + i * 40} y={LOWER.y + 150} width={34} height={8} rx={2} fill={C.text} />)}<text x={BOX(0).x + 130} y={LOWER.y + 158} fontFamily={F.mono} fontSize={12} fill={C.muted}>a few months</text></g>
        <g className="pre enterprise">
          <rect x={360} y={LOWER.y - 2} width={1380} height={40} rx={10} fill="rgba(238,241,247,0.05)" stroke={C.text} strokeWidth={1.5} />
          <text x={378} y={LOWER.y + 24} fontFamily={F.mono} fontSize={13} letterSpacing={1.5} fill={C.text}>ENTERPRISE</text>
          {ENTERPRISE.map((t, i) => <text key={t} x={540 + i * 240} y={LOWER.y + 24} fontFamily={F.sans} fontSize={17} fill={C.text}>{t}</text>)}
        </g>
        <g className="pre keys">{PROD.map((_, i) => <g key={i}><line x1={BOX(i).x + 150} y1={LOWER.y + 38} x2={BOX(i).x + 150} y2={BOX(i).y} stroke={C.text} strokeWidth={1.5} strokeDasharray="3 3" /><circle cx={BOX(i).x + 150} cy={LOWER.y + 50} r={5} fill={C.warn} /></g>)}</g>
        <g className="pre bridge">
          <line x1={BOX(0).x + BOX(0).w} y1={BOX(0).y + 38} x2={BOX(1).x} y2={BOX(1).y + 38} stroke={C.text} strokeWidth={3} />
          <circle cx={(BOX(0).x + BOX(0).w + BOX(1).x) / 2} cy={BOX(0).y + 38} r={8} fill={C.text} />
        </g>
        <g className="pre sweep">
          {[[0, 1], [2, 0]].map(([p, r], n) => <rect key={n} x={BOX(p).x + 50 + 80 * n} y={BOX(p).y + 8 + r * 15} width={40} height={14} rx={3} fill="none" stroke={C.warn} strokeWidth={2.5} />)}
          <rect x={BOX(3).x + 120} y={BOX(3).y + 38} width={40} height={14} rx={3} fill="none" stroke={C.muted} strokeWidth={2.5} strokeDasharray="3 3" />
        </g>
      </Svg>
      <Callout className="pre co-cost" x={1180} y={GAP_Y - 8} w={520} kind="One graph per product" text="The cost of a query grows with the size of the graph" tone={C.text} target="graph.per-product" />
      <Callout className="pre co-keys" x={1180} y={GAP_Y - 8} w={480} kind="Defined once" text="Read by every product's agents, under access rights" tone={C.text} target="graph.enterprise-shared" />
      <Callout className="pre co-bridge" x={1180} y={GAP_Y - 8} w={480} kind="Where products integrate" text="Impact analysis follows the integration points" tone={C.text} target="agent.cross-product" />
      <Callout className="pre co-sweep" x={1180} y={GAP_Y - 8} w={480} kind="Every quarter" text="Duplicated and unused capability" tone={C.warn} target="agent.portfolio-rationalization" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: one graph, shared by every team on the product.
    const s1 = cue('teams', 's0');
    appear(ctx, '.teams', s1 + 0.3, { y: 0 });
    // s2: kept to one product.
    const s2 = cue('cost', 's1');
    appear(ctx, '.co-cost', s2 + 0.3);
    // s3: one product at a time.
    const s3 = cue('portfolio', 's2');
    vanish(ctx, '.co-cost, .teams', s3);
    PROD.forEach((_, i) => appear(ctx, `.prod-${i}`, s3 + 0.2 + i * 0.25));
    // s4: the first product builds its graph and process; the next follows.
    const s4 = cue('rollout', 's3');
    appear(ctx, '.quarter', s4 + 0.3);
    tl.to(q('.prod-0 .pbox'), { attr: { stroke: C.text }, duration: 0.3 }, s4 + 0.2);
    tl.to(q('.prod-1 .pbox'), { attr: { stroke: C.text, 'stroke-dasharray': '0' }, duration: 0.3 }, s4 + 2.4);
    tl.to(q('.prod-1 .pband'), { opacity: 1, duration: 0.4 }, s4 + 2.4);
    // s5 and s6: enterprise knowledge, defined once, read under access rights.
    const s5 = cue('enterprise', 's4');
    vanish(ctx, '.quarter', s5);
    appear(ctx, '.enterprise', s5 + 0.2);
    const s6 = cue('keys', 's5');
    appear(ctx, '.keys', s6 + 0.2, { y: 0 });
    appear(ctx, '.co-keys', s6 + 0.4);
    // s7: links where products integrate.
    const s7 = cue('bridge', 's6');
    vanish(ctx, '.co-keys, .keys', s7);
    appear(ctx, '.bridge', s7 + 0.2, { y: 0 });
    appear(ctx, '.co-bridge', s7 + 0.5);
    // s8: a quarterly sweep.
    const s8 = cue('sweep', 's7');
    vanish(ctx, '.co-bridge', s8);
    appear(ctx, '.sweep', s8 + 0.3, { y: 0 });
    appear(ctx, '.co-sweep', s8 + 0.6);
  },
};
