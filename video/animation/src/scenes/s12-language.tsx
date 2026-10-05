import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear } from '../engine/scene';
import { gsap } from '../engine/gsap';
import { makeStack } from '../parts/Stack';
import { Frame, Graph, GRAPH_NODES, Heading, Svg } from '../parts/ui';
import { BANDS, C, F } from '../theme';

// Scene 12. The invariants come from the knowledge graph; invariants plus business rules make a
// domain-specific language; the multi-tenancy line moves down to sit on the invariants.
const SX = 640, SY = 290, SW = 760, LABEL = 300;
const stack = makeStack({ key: 'st', x: SX, y: SY, width: SW, labelW: LABEL, tenants: 6, lineAt: 6, fontScale: 0.92, labels: { 3: 'Domain invariants' } });
const INV_Y = stack.bandTop(3) + 35;
const RULES_TOP = stack.bandTop(4);

// Each flow leaves a graph node just after its label, runs right, turns up and enters the
// invariants band from the left. Lower nodes take lower entry slots and turn further right, so no
// two flows cross.
type Pt = { x: number; y: number };
const SLOT = GRAPH_NODES.map((nd) => GRAPH_NODES.filter((o) => o.y < nd.y).length);
const flow = (k: number) => {
  const nd = GRAPH_NODES[k], s = SLOT[k], r = 10;
  const a: Pt = { x: nd.x + 26 + nd.id.length * 9.6, y: nd.y };
  const d: Pt = { x: SX - 2, y: INV_Y - 21 + s * 14 };
  const x = 556 + s * 18;
  return { a, path: `M ${a.x} ${a.y} L ${x - r} ${a.y} Q ${x} ${a.y} ${x} ${a.y - r} L ${x} ${d.y + r} Q ${x} ${d.y} ${x + r} ${d.y} L ${d.x} ${d.y}` };
};

const EQ = [
  { t: 'Domain invariants', c: C.invariantEdge, target: 'term.invariants' },
  { t: '+', c: C.muted },
  { t: 'Business rules', c: C.tenant[3], target: 'term.rules' },
  { t: '=', c: C.muted },
  { t: 'Domain-specific language', c: C.text, target: 'term.dsl' },
];
const GRAMMAR = ['which parts may vary', 'what values they admit', 'which combinations are legal'];

export const scene12: SceneDef = {
  n: 12,
  id: 'language',
  View: () => (
    <Frame act="Act 3" scene="Scene 12 · A domain-specific language">
      <div style={{ position: 'absolute', left: 64, top: 100, fontFamily: F.display, fontWeight: 700, fontSize: 46, letterSpacing: -0.5, display: 'flex', gap: 18 }}>
        {EQ.map((e, i) => <span key={i} className={`pre eq eq-${i}`} data-target={e.target} style={{ color: e.c }}>{e.t}</span>)}
      </div>
      <Svg>
        <g className="kg-wrap">
          <Graph className="kg" />
          {GRAPH_NODES.map((_, k) => (
            <g key={k}>
              <path className={`pre flow flow-${k}`} d={flow(k).path} fill="none" stroke={C.invariantEdge} strokeWidth={1.8} opacity={0.6} />
              <circle className={`pre token token-${k}`} cx={flow(k).a.x} cy={flow(k).a.y} r={7} fill={C.invariantEdge} />
            </g>
          ))}
        </g>
        <stack.View />
        <g className="cards">
          {Array.from({ length: 6 }).map((_, t) => {
            const p = stack.col(t, 6);
            return (
              <g key={t} className={`pre card card-${t}`} data-target={`card.tenant.${t}`}>
                <rect x={p.x + 7} y={RULES_TOP + 9} width={p.w - 14} height={52} rx={5} fill="#0a1a1a" stroke={C.tenantText} strokeWidth={1.5} opacity={0.9} />
                <rect x={p.x + 7} y={RULES_TOP + 9} width={p.w - 14} height={11} rx={4} fill={C.tenantText} opacity={0.5} />
                <text className={`pre qm qm-${t}`} x={p.c} y={RULES_TOP + 55} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={28} fill={C.text}>?</text>
              </g>
            );
          })}
        </g>
      </Svg>
      <div className="pre grammar" data-target="grammar.panel" style={{ position: 'absolute', left: 1450, top: 300, width: 380, background: C.canvasRaised, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.8, color: C.muted }}>THE GRAMMAR SAYS</div>
        {GRAMMAR.map((l, i) => <div key={l} className={`pre gram gram-${i}`} style={{ fontSize: 23, fontWeight: 500, marginTop: 10 }}>{l}</div>)}
      </div>
      <Heading className="pre who" x={1450} y={300} w={420} size={40} target="question.who">Who writes the business rules?</Heading>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const band = (i: number) => q(`.st-band-${i}`);
    tl.set(q('.st-glow'), { opacity: 1 }, 0);

    // The invariants, drawn from the knowledge graph: tokens run along the flows into the band.
    const inv = cue('invariants', 's1');
    appear(ctx, '.eq-0', inv);
    GRAPH_NODES.forEach((_, k) => {
      const at = inv + 0.8 + k * 0.6, dur = 1.6;
      tl.set(q(`.flow-${k}, .token-${k}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.flow-${k}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'power1.inOut' }, at);
      // The token rides the flow path as it draws. Rendering seeks with callbacks suppressed, so
      // the path is sampled into plain attribute tweens instead of an onUpdate.
      const path = q(`.flow-${k}`)[0] as SVGPathElement | undefined;
      if (path) {
        const len = path.getTotalLength(), ease = gsap.parseEase('power1.inOut'), N = 24;
        for (let i = 1; i <= N; i++) {
          const pt = path.getPointAtLength(ease(i / N) * len);
          tl.to(q(`.token-${k}`), { attr: { cx: pt.x, cy: pt.y }, duration: dur / N, ease: 'none' }, at + ((i - 1) / N) * dur);
        }
      }
      tl.to(q(`.token-${k}`), { autoAlpha: 0, duration: 0.3 }, at + dur);
    });
    const arrive = inv + 0.8 + 3 * 0.6 + 1.6;
    tl.to(q('.st-lit-3'), { opacity: 1, duration: 0.3 }, arrive).to(q('.st-lit-3'), { opacity: 0, duration: 0.6 }, arrive + 0.6);

    // The business rules, which differ for each customer.
    const rules = cue('rules', 's2');
    tl.to(q('.kg-wrap'), { opacity: 0.5, duration: 0.5 }, rules);
    appear(ctx, '.eq-1', rules);
    appear(ctx, '.eq-2', rules + 0.3);
    stack.lit(ctx, 4, rules + 0.3);
    stack.lit(ctx, null, cue('dsl', 's3'));
    appear(ctx, '.eq-3', cue('dsl', 's3'));
    appear(ctx, '.eq-4', cue('dsl', 's3') + 0.3);

    // The grammar: three things it says, in the order the narration names them.
    const grammar = cue('grammar', 's4');
    appear(ctx, '.grammar', grammar + 3.5);
    GRAMMAR.forEach((_, i) => appear(ctx, `.gram-${i}`, grammar + 7.2 + i * 1.5, { duration: 0.4 }));

    // Slide the line: it comes to rest on the invariants and the tint floods the bands above.
    const move = cue('line', 's5+0.6');
    tl.to(q('.eq, .grammar'), { opacity: 0.4, duration: 0.5 }, move - 0.4);
    stack.line(ctx, 4, move, 2.4);

    // Below the line, shared; above it, per customer, each tenant's rules on its own card.
    const below = cue('below', 's6'), above = cue('above', 's7'), cost = cue('cost', 's8');
    BANDS.forEach((_, i) => tl.to(band(i), { opacity: i > 3 ? 0.35 : 1, duration: 0.5 }, below));
    BANDS.forEach((_, i) => tl.to(band(i), { opacity: i > 3 ? 1 : 0.35, duration: 0.5 }, above));
    for (let t = 0; t < 6; t++) appear(ctx, `.card-${t}`, above + 4.5 + t * 0.15, { y: 0, duration: 0.4 });
    BANDS.forEach((_, i) => tl.to(band(i), { opacity: 1, duration: 0.5 }, cost));

    // One question left: a question mark settles on every empty card.
    const who = cue('who', 's10');
    tl.to(q('.grammar'), { autoAlpha: 0, duration: 0.4 }, cue('one', 's9'));
    appear(ctx, '.who', who);
    for (let t = 0; t < 6; t++) appear(ctx, `.qm-${t}`, who + 0.3 + t * 0.12, { duration: 0.4 });
  },
};
