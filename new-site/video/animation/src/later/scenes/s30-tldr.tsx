import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { Body, Frame, Graph, GRAPH_NODES, Heading, LanguageCard, Pill, Svg } from '../parts/ui';
import { C, F } from '../theme';

// The overview, played first on the site. One stack carries the whole argument: the line drawn
// high, special cases in shared code, the invariants from the knowledge graph, a language on them,
// the line moving down, an agent writing each customer's rules, and onboarding first.
const SX = 640, SY = 285, SW = 760;
const stack = makeStack({ key: 'st', x: SX, y: SY, width: SW, labelW: 300, tenants: 6, maxTenants: 10, lineAt: 6, shardBand: 4, maxShards: 2, fontScale: 0.92 });
const RX = 1450; // the right-hand column
const NB = ' ';

// One heading per beat, in the order the narration reaches them.
const HEADS: { t: string; cue: string; at: string; target?: string }[] = [
  { t: 'Code was the expensive part', cue: 'premise', at: 's0' },
  { t: 'Special cases in shared code', cue: 'special', at: 's2', target: 'shard.special-case' },
  { t: 'Coding agents build whole applications', cue: 'agents', at: 's3' },
  { t: 'What customers want', cue: 'wants', at: 's5' },
  { t: 'The domain invariants', cue: 'invariants', at: 's6', target: 'term.invariants' },
  { t: 'A language on the invariants', cue: 'language', at: 's8', target: 'term.dsl' },
  { t: "An agent writes each customer's rules", cue: 'write', at: 's11', target: 'agent' },
  { t: 'Existing products start at the top', cue: 'brownfield', at: 's12', target: 'path.brownfield' },
  { t: 'Dialect engineering', cue: 'close', at: 's13' },
];
const WANTS = ['no months-long project', 'easy change after go-live', 'personal to each user', 'operable by their agents'];
const CHECKS = ['validator', 'tests', 'compiler'];
const LINES = ['rule overtime', `${NB}${NB}when hours.week > 40`, `${NB}${NB}pay${NB}pay_element.overtime × 1.5`];
const REQUESTS = [2, 4, 1];

// The flow from the knowledge graph into the invariants band.
const INV_Y = stack.bandTop(3) + 35;
const nd = GRAPH_NODES[1];
const FLOW = `M ${nd.x + 130} ${nd.y} L 590 ${nd.y} Q 600 ${nd.y} 600 ${nd.y - 10} L 600 ${INV_Y + 10} Q 600 ${INV_Y} 610 ${INV_Y} L ${SX - 2} ${INV_Y}`;

export const scene30: SceneDef = {
  n: 30,
  id: 'tldr',
  View: () => (
    <Frame act="Overview" scene="SaaS architecture when code is cheap">
      {HEADS.map((h, i) => <Heading key={i} className={`pre head head-${i}`} x={64} y={130} w={520} size={44} target={h.target}>{h.t}</Heading>)}
      <Body className="pre close-sub" x={64} y={200} w={520} size={28} colour={C.text}>One shared product, and a language for each customer.</Body>
      <div className="pre close-urls" style={{ position: 'absolute', left: 64, top: 320, fontSize: 20, color: C.muted, lineHeight: 1.9 }}>
        <div data-target="site.link"><span style={{ fontFamily: F.mono, fontSize: 26, color: C.invariantEdge }}>dialect-engineering.ai</span></div>
        <div data-target="link.semantic-engineering">with <span style={{ fontFamily: F.mono, color: C.text }}>semantic-engineering.ai</span></div>
        <div data-target="link.on2go">and <span style={{ fontFamily: F.mono, color: C.text }}>on2go.ai</span></div>
      </div>
      <Svg>
        <g className="pre kg-wrap"><Graph className="kg" /><text x={80} y={886} fontFamily={F.mono} fontSize={17} fill={C.invariantEdge} data-target="link.semantic-engineering">semantic-engineering.ai</text></g>
        <path className="pre flow" d={FLOW} fill="none" stroke={C.invariantEdge} strokeWidth={2} opacity={0.7} />
        <stack.View />
        {REQUESTS.map((t, k) => {
          const c = stack.col(t, 6).c;
          return <circle key={k} className={`pre req req-${k}`} data-target="request.misfit" cx={c} cy={stack.bandTop(6) - 30} r={13} fill={C.warn} />;
        })}
        <g className="wants">
          {WANTS.map((w, i) => <g key={w} className={`pre want want-${i}`} data-target="need.customer"><Pill x={RX} y={stack.bandTop(6) + 4 + i * 46} text={w} colour={C.tenant[i % 2 ? 3 : 0]} /></g>)}
        </g>
        <g className="checks">
          {CHECKS.map((c, i) => <g key={c} className={`pre check check-${i}`} data-target="loop.check"><Pill x={RX} y={470 + i * 46} w={200} text={`${c} ✓`} colour={C.invariantEdge} /></g>)}
        </g>
        <g className="pre start" data-target="path.brownfield">
          <path d={`M ${RX} ${stack.bandTop(6) + 35} L ${SX + SW + 12} ${stack.bandTop(6) + 35}`} stroke={C.tenant[0]} strokeWidth={2.5} />
          <path d={`M ${SX + SW + 12} ${stack.bandTop(6) + 35} l 12 -7 v 14 z`} fill={C.tenant[0]} />
          <Pill x={RX} y={stack.bandTop(6) + 18} text="start here: onboarding" colour={C.tenant[0]} />
          <text x={RX + 4} y={stack.bandTop(6) + 86} fontFamily={F.sans} fontSize={19} fill={C.muted} data-target="link.on2go">for example, On2Go <tspan fontFamily={F.mono} fill={C.text}>on2go.ai</tspan></text>
        </g>
      </Svg>
      <div className="pre grammar" data-target="grammar.panel" style={{ position: 'absolute', left: RX, top: 300, width: 400, background: C.canvasRaised, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.8, color: C.muted }}>THE LANGUAGE</div>
        <div className="pre gram gram-0" style={{ fontSize: 23, fontWeight: 500, marginTop: 10 }}>vocabulary: the invariants</div>
        <div className="pre gram gram-1" style={{ fontSize: 23, fontWeight: 500, marginTop: 10 }}>grammar: how rules combine them</div>
      </div>
      <div className="pre by-agent" style={{ position: 'absolute', left: RX, top: 250, fontFamily: F.mono, fontSize: 13, letterSpacing: 1.8, color: C.muted }}>WRITTEN BY AN AGENT</div>
      <div className="pre card-wrap"><LanguageCard className="card" x={RX} y={278} w={430} tenant="Tenant C" colour={C.tenant[2]} target="card.language" lines={['', '', '']} /></div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const heads = HEADS.map((h) => cue(h.cue, h.at));
    heads.forEach((at, i) => {
      appear(ctx, `.head-${i}`, at + 0.1);
      if (i < heads.length - 1) vanish(ctx, `.head-${i}`, heads[i + 1] - 0.3, { duration: 0.3 });
    });

    // The premise: the line drawn high, only onboarding above it.
    const high = cue('high', 's1+1');
    tl.to(q(stack.sel('line')), { opacity: 0.35, duration: 0.3, yoyo: true, repeat: 3 }, high);

    // Requests the configuration did not anticipate land in shared code; tenants grow and carry them.
    const special = heads[1];
    const fall = stack.bandTop(4) + 35 - (stack.bandTop(6) - 30);
    REQUESTS.forEach((_, k) => {
      const at = special + 0.6 + k * 1.2;
      tl.set(q(`.req-${k}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.req-${k}`), { y: 0 }, { y: fall, duration: 0.9, ease: 'power2.in' }, at);
      tl.to(q(`.req-${k}`), { autoAlpha: 0, duration: 0.2 }, at + 0.9);
    });
    stack.shards(ctx, 2, special + 1.5, 1.2);
    stack.tenants(ctx, 10, special + 4.4, 2);

    // The premise shifts: the line can move.
    const move = cue('canmove', 's4');
    tl.to(q(stack.sel('line')), { opacity: 0.3, duration: 0.35, yoyo: true, repeat: 5 }, move);

    // What customers want, on the upper layers.
    const wants = heads[3];
    stack.lit(ctx, 6, wants, 0.4);
    WANTS.forEach((_, i) => appear(ctx, `.want-${i}`, wants + 0.8 + i * 2.1, { y: 0 }));

    // The invariants, recorded in the knowledge graph.
    const inv = heads[4];
    WANTS.forEach((_, i) => vanish(ctx, `.want-${i}`, inv - 0.3));
    stack.lit(ctx, 3, inv, 0.4);
    stack.relabel(ctx, 3, 'Domain invariants', inv + 1);
    const graph = cue('graph', 's7');
    appear(ctx, '.kg-wrap', graph - 0.2);
    tl.set(q('.flow'), { autoAlpha: 1 }, graph + 0.4);
    tl.fromTo(q('.flow'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'power1.inOut' }, graph + 0.4);

    // A language on them: its vocabulary and grammar.
    const lang = heads[5];
    tl.to(q('.kg-wrap, .flow'), { opacity: 0.35, duration: 0.5 }, lang);
    appear(ctx, '.grammar', lang + 0.2);
    appear(ctx, '.gram-0', cue('vocab', 's9') + 0.3, { duration: 0.4 });
    appear(ctx, '.gram-1', cue('vocab', 's9') + 2.6, { duration: 0.4 });

    // The line moves down to sit on the invariants; the special cases go with the old placement.
    const down = cue('down', 's10');
    stack.lit(ctx, null, down - 0.2);
    tl.to(q(`${stack.sel('shardrow-0')}, ${stack.sel('shardrow-1')}`), { opacity: 0, duration: 0.8 }, down);
    stack.line(ctx, 4, down, 2.4);

    // An agent writes one customer's rules; the checks pass in turn.
    const write = heads[6];
    vanish(ctx, '.grammar', write - 0.3);
    tl.to(q('.kg-wrap, .flow'), { opacity: 0, duration: 0.5 }, write);
    appear(ctx, '.by-agent', write + 0.1);
    appear(ctx, '.card-wrap', write + 0.1);
    LINES.forEach((l, i) => tl.to(q(`.card-line-${i}`), { text: l, duration: l.length * 0.04, ease: 'none' }, write + 0.8 + i * 1.3));
    CHECKS.forEach((_, i) => appear(ctx, `.check-${i}`, write + 5.6 + i * 1.1, { y: 0 }));

    // Existing products start at the top, with onboarding.
    const brown = heads[7];
    vanish(ctx, '.by-agent, .card-wrap, .check', brown - 0.3);
    stack.lit(ctx, 6, brown + 0.2, 0.4);
    appear(ctx, '.start', brown + 0.6, { y: 0 });

    // Dialect engineering: one shared product, and a language for each customer.
    const close = heads[8];
    vanish(ctx, '.start', close - 0.2);
    stack.lit(ctx, null, close);
    appear(ctx, '.close-sub', close + 1.2);
    appear(ctx, '.close-urls', close + 3);
  },
};
