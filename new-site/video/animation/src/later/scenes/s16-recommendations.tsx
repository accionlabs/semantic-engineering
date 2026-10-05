import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { Callout, Frame, Heading, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 16. Four recommendations, each placed on the brownfield stack where it acts.
const stack = makeStack({ key: 'st', x: 160, y: 250, width: 900, lineAt: 6, tenants: 6, labelW: 300, lineLabel: false, labels: { 3: 'Domain invariants' } });
const MX = 1110;
const MARKS = [
  { band: 5, text: 'Fix only the screens losing deals', tone: C.tenant[3], target: 'rec.screens' },
  { band: 4, text: 'Invest in the grammar and the compiler, the durable assets', tone: C.invariantEdge, target: 'rec.grammar' },
  { band: 6, text: 'Onboarding first: no product code, value in cycle time', tone: C.tenant[3], target: 'rec.onboarding' },
  { band: 1, text: 'Design the lower line into a planned re-architecture', tone: C.sharedEdge, target: 'rec.rearchitecture' },
];
const cy = (band: number) => stack.bandTop(band) + 35;

export const scene16: SceneDef = {
  n: 16,
  id: 'recommendations',
  View: () => (
    <Frame act="Act 4" scene="Scene 16 · Four recommendations">
      <Heading className="pre head" x={160} y={120} size={42}>For a brownfield product</Heading>
      <Svg>
        <stack.View />
        <rect className="pre rearch" x={156} y={stack.bandTop(2) - 4} width={908} height={stack.bandTop(0) + 70 - stack.bandTop(2) + 8} rx={10}
          fill="none" stroke={C.sharedEdge} strokeWidth={3} strokeDasharray="10 8" data-target="rec.rearchitecture" />
        {MARKS.map((m, i) => (
          <g key={i} className={`r-m${i}`}>
            <g className={`pre mark mark-${i}`} data-target={m.target}>
              <circle cx={MX} cy={cy(m.band)} r={24} fill={C.canvas} stroke={m.tone} strokeWidth={3} />
              <text x={MX} y={cy(m.band) + 9} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={24} fill={m.tone}>{i + 1}</text>
            </g>
          </g>
        ))}
      </Svg>
      {MARKS.map((m, i) => (
        <Callout key={i} className={`pre c-${i}`} x={1200} y={cy(m.band) - 34} w={640} kind={`Recommendation ${i + 1}`} text={m.text} tone={m.tone}
          anchor={{ x: MX + 24, y: cy(m.band) }} target={`callout.${m.target}`} />
      ))}
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    appear(ctx, '.head', cue('heading', 's0+0.2'));
    const at = [cue('screens', 's1'), cue('grammar', 's2'), cue('onboarding', 's3'), cue('rearchitecture', 's4')];
    focusBeats(ctx, MARKS.map((_, i) => ({ id: `r${i}`, at: at[i], regions: [`.r-m${i}`], callout: `.c-${i}` })), 0.35);
    MARKS.forEach((m, i) => {
      appear(ctx, `.mark-${i}`, at[i], { y: 0 });
      if (i < 3) stack.lit(ctx, m.band, at[i], 0.45);
    });
    // The planned re-architecture spans the lower bands: outline them together.
    stack.lit(ctx, null, at[3], 0.45);
    [3, 4, 5, 6].forEach((b) => tl.to(q(stack.sel(`band-${b}`)), { opacity: 0.45, duration: 0.4 }, at[3]));
    tl.set(q('.rearch'), { autoAlpha: 1 }, at[3]);
    tl.fromTo(q('.rearch'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, at[3]);
  },
};
