import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { FigureChip, Frame, Heading, Person, Svg } from '../parts/ui';
import { C } from '../theme';

// Scene 4. The customer at the centre, four expectations around them, then the customer
// steps onto the top of the stack to begin the journey down.
const SX = 1000, SY = 250;
const stack = makeStack({ key: 'st4', x: SX, y: SY, width: 820, labelW: 260, lineAt: 6, tenants: 6, fontScale: 0.9, lineLabel: false });
const CX = 480, CY = 540;
const NEEDS = [
  { t: 'Use it straight away', id: 'need.immediate' },
  { t: 'Small, contained change', id: 'need.change' },
  { t: 'Personalised to each user', id: 'need.personal' },
  { t: 'Operated by our own agents', id: 'need.agents' },
];
const needPos = (i: number) => {
  const a = -Math.PI / 4 + (i / 4) * Math.PI * 2;
  return { x: CX + Math.cos(a) * 340 - 190, y: CY + 20 + Math.sin(a) * 220 - 30 };
};
// Tenant C's marker: where the customer lands on the stack.
const markC = stack.col(2, 6).c;
const markY = stack.bandTop(6) - 44;

export const scene04: SceneDef = {
  n: 4,
  id: 'wants',
  View: () => (
    <Frame act="Act 1" scene="Scene 4 · What customers want">
      <Svg>
        <g className="pre stackwrap"><stack.View /></g>
        <g className="r-person">
          <g className="pre person" transform={`translate(${CX} ${CY - 20}) scale(1)`} data-target="customer">
            <Person x={0} y={0} r={42} />
          </g>
        </g>
      </Svg>
      {NEEDS.map((nd, i) => {
        const p = needPos(i);
        return (
          <div key={nd.id} className={`r-need-${i}`} style={{ position: 'absolute', left: p.x, top: p.y, width: 380 }}>
            <div className={`pre need need-${i}`} data-target={nd.id} style={{ textAlign: 'center', padding: '14px 18px', borderRadius: 999, border: `2px solid ${C.tenant[3]}`,
              background: C.canvasRaised, fontSize: 24, fontWeight: 600, whiteSpace: 'nowrap' }}>{nd.t}</div>
          </div>
        );
      })}
      <FigureChip className="pre fig" x={1020} y={520} w={760} target="fig.gartner-agentic" figure="33% by 2028"
        label="of enterprise software applications will include agentic AI, up from less than 1% in 2024. Over 40% of agentic AI projects will be cancelled by the end of 2027"
        source="Gartner, June 2025" />
      <Heading className="pre head-a" x={64} y={120} size={48}>Start with the customer</Heading>
      <Heading className="pre head-b" x={64} y={120} size={48}>Follow one customer down the stack</Heading>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const start = cue('customer', 's0');
    appear(ctx, '.head-a', start);
    tl.fromTo(q('.person'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, start + 0.4);

    // Each expectation lights as it is spoken; the earlier ones stay, dimmed.
    const at = [cue('immediate', 's1'), cue('change', 's2'), cue('personal', 's3'), cue('agents', 's4')];
    at.forEach((t, i) => appear(ctx, `.need-${i}`, t));
    focusBeats(ctx, at.map((t, i) => ({ id: `need${i}`, at: t, regions: [`.r-need-${i}`] })), 0.35);
    appear(ctx, '.fig', at[3] + 1.2);

    // The customer steps onto the stack, at Tenant C's column.
    const go = cue('descend', 's5');
    vanish(ctx, '.head-a', go);
    NEEDS.forEach((_, i) => vanish(ctx, `.need-${i}`, go + i * 0.08));
    vanish(ctx, '.fig', go);
    appear(ctx, '.stackwrap', go + 0.3, { y: 0, duration: 1 });
    tl.to(q('.person'), { attr: { transform: `translate(${markC} ${markY - 62}) scale(0.5)` }, duration: 1.8, ease: 'power2.inOut' }, go + 0.6);
    tl.to(q('.st4-marker-2 .st4-marker-pill'), { attr: { stroke: C.text, 'stroke-width': 2.5 }, duration: 0.4 }, go + 2.3);
    appear(ctx, '.head-b', go + 0.8);
  },
};
