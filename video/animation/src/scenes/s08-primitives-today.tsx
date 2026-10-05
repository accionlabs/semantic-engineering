import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Frame, Heading, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 8. Domain primitives today: shared meaning, rarely changed, already exposed through the APIs.
const rail = makeRail('rail', { lit: 3, label: 'domain primitives' });
const L = 470, R = 1300, API_Y = 660;
const TOK = [
  { t: 'Employee', x: 560, y: 420, id: 'token.employee' },
  { t: 'Pay element', x: 860, y: 360, id: 'token.pay-element' },
  { t: 'Statutory deduction', x: 1120, y: 470, id: 'token.statutory-deduction' },
  { t: 'Calculation', x: 760, y: 560, id: 'token.calculation' },
];
const EDGES = [[0, 1], [1, 2], [1, 3], [0, 3], [2, 3]];
const API_X = [560, 910, 1120, 760]; // each link drops clear of the other tokens
const POLICIES = [
  { x: 520, tone: C.tenant[0], who: 'Tenant A', rule: 'overtime after 40 h' },
  { x: 1000, tone: C.tenant[3], who: 'Tenant D', rule: 'overtime after 38 h' },
];
const PAY = TOK[1];
// Each policy arrow ends on the top edge of the Pay element token.
const arrowEnd = (k: number) => ({ x: PAY.x + (k === 0 ? -40 : 40), y: PAY.y - 30 });
const arrowHead = (k: number) => {
  const p = POLICIES[k], sx = p.x + 150, sy = 270, e = arrowEnd(k);
  const a = Math.atan2(e.y - sy, e.x - sx), s = 12;
  const pt = (d: number) => `${e.x - s * Math.cos(a + d)} ${e.y - s * Math.sin(a + d)}`;
  return `M${e.x} ${e.y} L${pt(0.45)} L${pt(-0.45)} Z`;
};

export const scene08: SceneDef = {
  n: 8,
  id: 'primitives-today',
  View: () => (
    <Frame act="Act 2" scene="Scene 8 · Domain primitives today">
      <Svg>
        <rail.View />
        <g className="r-api" data-target="api.primitives">
          {TOK.map((t, i) => (
            <line key={t.t} className={`api-link api-link-${i}`} x1={API_X[i]} y1={t.y + 28} x2={API_X[i]} y2={API_Y} stroke={C.sharedEdge} strokeWidth={1.5} strokeDasharray="4 5" opacity={0} />
          ))}
          <g className="pre api-bar">
            <rect x={L} y={API_Y} width={R - L} height={70} rx={10} fill={C.canvasRaised} stroke={C.sharedEdge} strokeWidth={2} />
            <text x={L + 20} y={API_Y + 43} fontFamily={F.sans} fontWeight={600} fontSize={21} fill={C.text}>APIs · already cover a large part of the domain</text>
          </g>
        </g>
        <g className="r-tokens" data-target="layer.primitives">
          {EDGES.map(([a, b], k) => (
            <line key={k} className={`pre edge edge-${k}`} x1={TOK[a].x} y1={TOK[a].y} x2={TOK[b].x} y2={TOK[b].y} stroke={C.sharedEdge} strokeWidth={2.5} />
          ))}
          {TOK.map((t, i) => (
            <g key={t.t} className={`pre tok tok-${i}`} data-target={t.id}>
              <rect className="tok-box" x={t.x - 110} y={t.y - 28} width={220} height={56} rx={12} fill={C.shared} stroke={C.sharedEdge} strokeWidth={2.5} />
              <text x={t.x} y={t.y + 7} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={20} fill={C.text}>{t.t}</text>
            </g>
          ))}
        </g>
        <g className="r-policies">
          {POLICIES.map((p, k) => (
            <g key={p.who} data-target={`policy.${p.who === 'Tenant A' ? 'a' : 'd'}`}>
              <g className={`pre policy policy-${k}`}>
                <rect x={p.x} y={200} width={300} height={70} rx={10} fill={C.canvasRaised} stroke={p.tone} strokeWidth={2} />
                <text x={p.x + 16} y={228} fontFamily={F.mono} fontSize={14} fill={p.tone}>{p.who} · pay policy</text>
                <text x={p.x + 16} y={254} fontFamily={F.sans} fontSize={19} fill={C.text}>{p.rule}</text>
              </g>
              <line className={`pre arrow arrow-${k}`} x1={p.x + 150} y1={270} x2={arrowEnd(k).x} y2={arrowEnd(k).y} stroke={p.tone} strokeWidth={2.5} />
              <path className={`pre head head-${k}`} d={arrowHead(k)} fill={p.tone} />
            </g>
          ))}
        </g>
      </Svg>
      <Heading x={470} y={120} size={44}>Domain primitives today</Heading>
      <Callout className="pre c-provider" x={1360} y={300} w={500} kind="Provider" text="Changed far less often than the layers above" tone={C.warn}
        anchor={{ x: 1230, y: 470 }} target="lens.primitives.provider" />
      <Callout className="pre c-customer" x={1360} y={300} w={500} kind="Customer" text="Different policies, the same definition of a pay element" tone={C.tenant[3]}
        anchor={{ x: PAY.x + 110, y: PAY.y }} target="lens.primitives.customer" />
      <Callout className="pre c-arch" x={1360} y={640} w={500} kind="Architecture" text="Exposed through the APIs" tone={C.sharedEdge}
        anchor={{ x: R, y: API_Y + 35 }} target="lens.primitives.architecture" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const tokens = cue('tokens', 's0'), provider = cue('provider', 's2'), customer = cue('customer', 's3'), apis = cue('apis', 's4');
    focusBeats(ctx, [
      { id: 'tokens', at: tokens, regions: ['.r-tokens'] },
      { id: 'provider', at: provider, regions: ['.r-tokens'], callout: '.c-provider' },
      { id: 'customer', at: customer, regions: ['.r-tokens', '.r-policies'], callout: '.c-customer' },
      { id: 'apis', at: apis, regions: ['.r-api'], callout: '.c-arch' },
    ]);

    // The primitives arrive as the narration names them, then the links between them draw.
    const named = cue('named', 's1+1.2');
    TOK.forEach((_, i) => appear(ctx, `.tok-${i}`, named + i * 0.9, { duration: 0.45 }));
    EDGES.forEach((_, k) => {
      tl.set(q(`.edge-${k}`), { autoAlpha: 1 }, named + 3.6 + k * 0.25);
      tl.fromTo(q(`.edge-${k}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power1.out' }, named + 3.6 + k * 0.25);
    });

    // Two tenants' policies both land on the one Pay element token.
    POLICIES.forEach((_, k) => {
      const at = customer + 0.4 + k * 0.9;
      appear(ctx, `.policy-${k}`, at);
      tl.set(q(`.arrow-${k}`), { autoAlpha: 1 }, at + 0.5);
      tl.fromTo(q(`.arrow-${k}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7, ease: 'power1.in' }, at + 0.5);
      tl.to(q(`.head-${k}`), { autoAlpha: 1, duration: 0.15 }, at + 1.15);
    });
    tl.to(q('.tok-1 .tok-box'), { attr: { stroke: C.text }, duration: 0.4 }, customer + 2.4);
    tl.to(q('.tok-1 .tok-box'), { attr: { stroke: C.sharedEdge }, duration: 0.4 }, apis);

    // The APIs: one bar reached from every primitive.
    appear(ctx, '.api-bar', apis + 0.2, { y: 0 });
    TOK.forEach((_, i) => tl.fromTo(q(`.api-link-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.6 }, apis + 0.6 + i * 0.2));
  },
};
