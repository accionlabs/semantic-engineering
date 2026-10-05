import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { Body, Counter, FigureChip, Frame, Heading, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 2. Requests that the configuration did not anticipate become special cases in a shared
// layer; as tenants are added, every tenant carries every one of them.
const stack = makeStack({ key: 'st', x: 640, y: 250, width: 1060, tenants: 6, maxTenants: 16, lineAt: 6, shardBand: 4, maxShards: 3 });
const REQUESTS = [2, 4, 1]; // tenants C, E and B ask

export const scene02: SceneDef = {
  n: 2,
  id: 'accumulation',
  View: () => (
    <Frame act="Act 1" scene="Scene 2 · Special cases accumulate">
      <Heading className="pre head" x={64} y={120} w={520} size={48} target="shard.special-case">Special case in shared code</Heading>
      <Body className="pre sub" x={64} y={240} w={480} size={24}>A request outside the configuration lands in code every tenant runs on.</Body>
      <Counter className="pre counter" x={64} y={420} start={6} />
      <FigureChip className="pre fig" x={64} y={780} w={520} target="fig.insightd"
        label="Time pressure: the most cited cause of technical debt"
        source="InsighTD family of surveys, 653 practitioners in six countries. Ramač et al., Journal of Systems and Software, 2022" />
      <Svg>
        <stack.View />
        {REQUESTS.map((t, k) => {
          const c = stack.col(t, 6).c;
          return (
            <g key={k} className={`pre req req-${k}`} data-target="request">
              <circle cx={c} cy={stack.bandTop(6) - 30} r={13} fill={C.warn} />
              <path d={`M${c} ${stack.bandTop(6) - 36} L${c} ${stack.bandTop(6) - 30} L${c + 5} ${stack.bandTop(6) - 27}`} stroke={C.canvas} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
        <text className="pre defect-label" x={0} y={stack.bandTop(4) - 12} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.warn}>defect in another tenant</text>
      </Svg>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const drop = cue('requests', 's0+0.4');
    const fall = stack.bandTop(4) + 35 - (stack.bandTop(6) - 30);
    REQUESTS.forEach((_, k) => {
      const at = drop + k * 1.6;
      tl.set(q(`.req-${k}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.req-${k}`), { y: 0 }, { y: fall, duration: 1.1, ease: 'power2.in' }, at);
      tl.to(q(`.req-${k}`), { autoAlpha: 0, duration: 0.2 }, at + 1.1);
    });
    stack.shards(ctx, 3, drop + 1.1, 1.6);
    appear(ctx, '.head', cue('heading', 's0+3'));
    appear(ctx, '.sub', cue('heading', 's0+3') + 0.4);
    appear(ctx, '.fig', cue('figure', 's1'));

    const grow = cue('growth', 's2');
    appear(ctx, '.counter', grow - 0.3);
    tl.to(q('.counter .counter-value'), { innerText: 16, snap: { innerText: 1 }, duration: 3.6, ease: 'none' }, grow);
    stack.tenants(ctx, 16, grow, 3.6);

    const hit = grow + 3.8;
    const p = stack.col(4, 16);
    tl.set(q('.defect-label'), { attr: { x: p.c } }, hit);
    appear(ctx, '.defect-label', hit);
    stack.defect(ctx, 4, 4, hit, ctx.duration);
  },
};
