import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { FigureChip, Frame, Heading, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 10. The bill: a tier of capabilities the customer mostly does not use, pricing under
// pressure, and a pull back to the whole stack where the two questions return.
const stack = makeStack({ key: 'st', x: 620, y: 280, width: 900, bandH: 64, gap: 7, labelW: 280, fontScale: 0.92, tenants: 6, lineAt: 6 });
const USED = [2, 7, 11, 16]; // 4 of 20 tiles used, matching the 80% figure
const tileX = (k: number) => 190 + (k % 5) * 130, tileY = (k: number) => 290 + Math.floor(k / 5) * 115;
const SEAT = { x: 1040, y: 330 };
const QX = 1548, Q1Y = stack.boundary(6), Q2Y = stack.bandTop(3) + 32;

export const scene10: SceneDef = {
  n: 10,
  id: 'bill',
  View: () => (
    <Frame act="Act 2" scene="Scene 10 · The bill">
      <Svg>
        <g className="r-tier" data-target="bill.tier">
          <rect x={160} y={220} width={700} height={560} rx={16} fill={C.canvasRaised} stroke={C.hairline} />
          <text x={190} y={264} fontFamily={F.mono} fontSize={16} fill={C.muted} letterSpacing={1.5}>TIER · PRICED PER SEAT</text>
          {Array.from({ length: 20 }).map((_, k) => {
            const used = USED.includes(k);
            return <rect key={k} className={`tile ${used ? 'tile-used' : 'tile-unused'}`} x={tileX(k)} y={tileY(k)} width={112} height={95} rx={10} fill={used ? C.tenant[1] : C.shared} />;
          })}
          <text className="pre tier-note" x={190} y={760} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1}>TEAL · WHAT THIS CUSTOMER USES</text>
        </g>
        <g className="pre r-seat" data-target="bill.seat">
          <g className="seat">
            <Person x={SEAT.x} y={SEAT.y} r={34} colour={C.muted} />
          </g>
          <text x={SEAT.x} y={SEAT.y + 110} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.muted}>the seat</text>
        </g>
        <g className="pre r-stack">
          <stack.View />
        </g>
        <g className="pre q-mark q-mark-0" data-target="question.shared">
          <text x={QX} y={Q1Y + 16} fontFamily={F.display} fontWeight={700} fontSize={46} fill={C.text}>?</text>
        </g>
        <g className="pre q-mark q-mark-1" data-target="question.value">
          <text x={QX} y={Q2Y + 16} fontFamily={F.display} fontWeight={700} fontSize={46} fill={C.invariantEdge}>?</text>
        </g>
      </Svg>
      <Heading className="head" x={160} y={120} size={44}>The bill</Heading>
      <FigureChip className="pre fig-pendo" x={960} y={220} w={520} target="fig.pendo" figure="80%"
        label="of features in the average software product rarely or never used" source="Pendo, The 2019 Feature Adoption Report, 615 products" />
      <FigureChip className="pre fig-zylo" x={960} y={480} w={520} target="fig.zylo" figure="36%"
        label="of SaaS licences unused on average" source="Zylo, 2026 SaaS Management Index" />
      <FigureChip className="pre fig-poyar" x={1200} y={220} w={620} target="fig.poyar" figure="21% → 15%"
        label="share of B2B software companies with seat-based pricing as their primary model, in one year; hybrid rose from 27% to 41%" source="Poyar, The State of B2B Monetization in 2025" />
      <FigureChip className="pre fig-gartner" x={1200} y={530} w={620} target="fig.gartner-revenue"
        label="Agents “break the link between user growth and revenue growth for many enterprise software vendors”" source="Gartner, July 2026" />
      <Heading className="pre q-text q-text-0" x={QX + 48} y={Q1Y - 34} w={300} size={28}>What should stay shared?</Heading>
      <Heading className="pre q-text q-text-1" x={QX + 48} y={Q2Y - 34} w={300} size={28} colour={C.invariantEdge}>What is the product really selling?</Heading>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const tier = cue('tier', 's1'), provider = cue('provider', 's2'), line = cue('line', 's3'), question = cue('question', 's4'), ask = cue('ask', 's5');

    // The tier: most capabilities grey out, then the two usage figures.
    tl.to(q('.tile-unused'), { opacity: 0.25, duration: 1.8, stagger: 0.06, ease: 'power1.inOut' }, tier + 1.5);
    appear(ctx, '.tier-note', tier + 3);
    appear(ctx, '.fig-pendo', tier + 2.5);
    appear(ctx, '.fig-zylo', tier + 5);

    // The provider: the seat shrinks as pricing moves away from it.
    vanish(ctx, '.fig-pendo, .fig-zylo', provider - 0.3, { duration: 0.35 });
    tl.to(q('.r-tier'), { opacity: 0.2, duration: 0.5 }, provider);
    appear(ctx, '.r-seat', provider + 0.1);
    tl.fromTo(q('.seat'), { scale: 1 }, { scale: 0.5, svgOrigin: `${SEAT.x} ${SEAT.y + 20}`, duration: 3, ease: 'power1.inOut' }, provider + 1);
    appear(ctx, '.fig-poyar', provider + 0.8);
    appear(ctx, '.fig-gartner', provider + 5);

    // Pull back to the whole stack: every pressure traces back to the line.
    vanish(ctx, '.r-tier, .r-seat, .fig-poyar, .fig-gartner, .head', line - 0.2, { duration: 0.5 });
    appear(ctx, '.r-stack', line + 0.3, { y: 0, duration: 0.8 });
    for (let k = 0; k < 2; k++) {
      tl.to(q('.st-line'), { opacity: 0.35, duration: 0.35, ease: 'sine.inOut' }, line + 2 + k * 0.8)
        .to(q('.st-line'), { opacity: 1, duration: 0.35, ease: 'sine.inOut' }, line + 2.4 + k * 0.8);
    }

    // The two questions come back, one at the line and one at the domain primitives.
    appear(ctx, '.q-mark-0', question + 0.2, { y: 0 });
    appear(ctx, '.q-mark-1', question + 0.6, { y: 0 });
    appear(ctx, '.q-text-0', ask);
    appear(ctx, '.q-text-1', ask + 1.8);
    tl.to(q('.st-band-3 .st-lit-3'), { opacity: 0.8, duration: 0.5 }, ask + 1.8);
  },
};
