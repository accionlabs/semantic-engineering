import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Cards, COL, Custodians, DEV, Defs, Flow, KindLabels, STATIONS, TaxArrow, Token, translate, Y } from '../parts/Landscape';
import { Bands, GRAPH_BOTTOM, GY, item, Ties, TraversePath } from '../parts/Graph';
import { GAP_Y, LOWER, Mark, Owners } from '../parts/Act3';
import { GraphSync, syncClear, syncMerge, syncUpdate } from '../parts/Sync';
import { Gate, GATE_X } from './s05-principles';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// The overview: the whole story in one scene. The shared opening with Dialect Engineering.ai: a product
// can change below the water (Semantic Engineering) and above it (Dialect Engineering), on one knowledge
// graph. Then what Semantic Engineering is for; why AI coding agents
// fail on large applications; the four kinds of knowledge and their holders; the Manual Translation Tax;
// the knowledge graph and how it governs each change; how much of the method a team needs; Breeze.AI's
// agents and their owners; the three use cases and two platforms; the four principles.
const CO = { x: 1180, y: GAP_Y - 8, w: 540 };
const ROW = (i: number, n = 3) => ({ x: 150 + i * (1620 / n), w: 1620 / n - 24 });
const LEVELS = [
  { who: 'A prototype or small tool', what: 'chat with an AI tool' },
  { who: 'A small application', what: 'a written specification per change' },
  { who: 'A large, complex or legacy application', what: 'the knowledge graph, with one team or several' },
];
const USES = ['building new applications', 'changing existing ones', 'replacing legacy systems'];
const HOW: Record<string, string> = { functional: 'traced from the screens', design: 'from the running application', architecture: 'inferred from its structure', code: 'parsed from the code' };
const SOURCES: [string, number, string][] = [['functional', 1, 'ticket'], ['design', 3, 'design frame'], ['architecture', 2, 'document'], ['code', 1, 'code file']];
const OUTCOMES = [
  { f: '19 → 36', l: 'deployments a month across three products; lead time from 2.0 to 1.42 days' },
  { f: '3 to 5 days', l: 'of senior-engineer investigation replaced by impact analysis, on one brownfield application' },
  { f: '53%', l: 'design component reuse in the first sprint of a new user-interface workstream' },
  { f: '23%', l: 'fewer defects, same team, same codebase' },
  { f: '15M+ lines', l: 'of legacy code modernized with ASIMOV, across 10+ programs' },
];
const PRINCIPLES = ['one structured graph', 'agents bound by it', 'a named owner for each part', 'a check on every change'];
const SPOTS = [
  { label: 'impact analysis', x: STATIONS[0].x + 150 },
  { label: 'coding', x: AGENT.x },
  { label: 'graph update', x: STATIONS[2].x },
  { label: 'check', x: GATE_X },
];
const Strip: React.FC<{ cls: string; items: { a: string; b?: string }[] }> = ({ cls, items }) => (
  <g className={`pre ${cls}`}>
    {items.map((it, i) => {
      const r = ROW(i, items.length);
      return (
        <g key={i} className={`${cls}-i ${cls}-${i}`}>
          <rect className="bx" x={r.x} y={LOWER.y} width={r.w} height={it.b ? 104 : 64} rx={12} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
          <text x={r.x + 18} y={LOWER.y + (it.b ? 38 : 40)} fontFamily={F.sans} fontSize={21} fontWeight={600} fill={C.text}>{it.a}</text>
          {it.b && <text x={r.x + 18} y={LOWER.y + 76} fontFamily={F.sans} fontSize={18} fill={C.cardText}>{it.b}</text>}
        </g>
      );
    })}
  </g>
);

export const scene00: SceneDef = {
  n: 0,
  id: 'overview',
  View: () => (
    <Frame act="Overview" scene="Semantic Engineering">
      <Svg>
        <Defs />
        {/* The shared opening: a product on a waterline; below, the graph and the flow; above, customer variants. */}
        <g className="pre water">
          <rect x={0} y={560} width={1920} height={520} fill="rgba(44,197,180,0.07)" />
          <line x1={0} y1={560} x2={1920} y2={560} stroke={C.layer.architecture} strokeWidth={2} strokeDasharray="14 10" opacity={0.7} />
          <text x={150} y={548} fontFamily={F.mono} fontSize={18} letterSpacing={3} fill={C.layer.architecture} opacity={0.8}>THE WATERLINE</text>
          <g className="w-product">
            <rect x={760} y={380} width={400} height={330} rx={16} fill={C.canvasRaised} stroke={C.text} strokeWidth={2.5} />
            <text x={960} y={430} textAnchor="middle" fontFamily={F.display} fontSize={34} fontWeight={700} fill={C.text}>a software product</text>
          </g>
          <g className="pre w-below">
            {KINDS.map((k, i) => <rect key={k.id} x={790} y={590 + i * 26} width={340} height={16} rx={5} fill="none" stroke={C.layer[k.id]} strokeWidth={2} />)}
            <text x={960} y={772} textAnchor="middle" fontFamily={F.mono} fontSize={20} letterSpacing={2} fill={C.text}>SEMANTIC ENGINEERING · BELOW THE WATER</text>
            <text x={960} y={804} textAnchor="middle" fontFamily={F.sans} fontSize={22} fill={C.cardText}>the product stays as it is; building and changing it gets faster and safer</text>
          </g>
          <g className="pre w-above">
            {[0, 1, 2].map((i) => (
              <g key={i} className={`w-tenant w-tenant-${i}`}>
                <rect x={760 + i * 140} y={210} width={120} height={84} rx={10} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
                {[0, 1, 2].map((r) => <rect key={r} x={776 + i * 140} y={228 + r * 16} width={[80, 60, 70][r]} height={6} rx={3} fill={C.warn} opacity={0.8} />)}
                <line x1={820 + i * 140} y1={294} x2={820 + i * 140} y2={380} stroke={C.warn} strokeWidth={1.5} strokeDasharray="4 5" />
              </g>
            ))}
            <text x={960} y={152} textAnchor="middle" fontFamily={F.mono} fontSize={20} letterSpacing={2} fill={C.warn}>DIALECT ENGINEERING · ABOVE THE WATER</text>
            <text x={960} y={184} textAnchor="middle" fontFamily={F.sans} fontSize={22} fill={C.cardText}>each customer's needs, written in a language over what every customer shares</text>
          </g>
          <g className="pre w-graph">
            <rect x={300} y={846} width={1320} height={60} rx={14} fill="rgba(238,241,247,0.05)" stroke={C.text} strokeWidth={2} />
            <line x1={360} y1={876} x2={1556} y2={876} stroke={C.muted} strokeWidth={1.2} />
            {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={360 + i * 92} cy={876} r={7} fill={C.layer[KINDS[i % 4].id]} />)}
            <text x={960} y={944} textAnchor="middle" fontFamily={F.mono} fontSize={20} letterSpacing={2} fill={C.text}>ONE FOUNDATION: THE KNOWLEDGE GRAPH</text>
          </g>
        </g>
        <g className="pre intro">
          <text x={960} y={430} textAnchor="middle" fontFamily={F.display} fontSize={84} fontWeight={700} fill={C.text}>Semantic Engineering</text>
          <text x={960} y={500} textAnchor="middle" fontFamily={F.sans} fontSize={30} fill={C.cardText}>making AI coding agents work reliably on large enterprise software</text>
        </g>
        <g className="pre small">
          <rect x={300} y={330} width={240} height={150} rx={10} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2} />
          {[0, 1, 2, 3].map((r) => <rect key={r} x={320} y={356 + r * 22} width={[180, 130, 160, 100][r]} height={7} rx={3} fill={C.layer.code} />)}
          <AgentIcon x={420} y={290} s={36} />
          <Mark className="small-tick" x={560} y={340} />
          <text x={420} y={520} textAnchor="middle" fontFamily={F.sans} fontSize={20} fill={C.text}>a small, contained task</text>
        </g>
        <g className="pre large">
          {Array.from({ length: 48 }, (_, i) => <rect key={i} x={860 + (i % 12) * 74} y={290 + Math.floor(i / 12) * 54} width={62} height={42} rx={5} fill={C.canvasRaised} stroke={C.card} strokeWidth={1.2} />)}
          <AgentIcon x={1300} y={250} s={36} />
          {[[960, 360], [1250, 420], [1520, 330], [1110, 470]].map(([x, y], i) => <Mark key={i} className={`miss miss-${i}`} x={x} y={y} ok={false} />)}
          <text x={1300} y={540} textAnchor="middle" fontFamily={F.sans} fontSize={20} fill={C.text}>a large enterprise application</text>
        </g>
        <g className="pre top"><KindLabels /><Custodians /></g>
        <g className="pre cards"><Cards /></g>
        <rect className="pre taxband" x={150} y={Y.tax} width={1620} height={Y.taxH} rx={10} fill="rgba(255,106,61,0.08)" stroke={C.tax} strokeWidth={1.5} />
        <text className="pre taxlabel" x={960} y={Y.tax + 40} textAnchor="middle" fontFamily={F.mono} fontSize={20} letterSpacing={3} fill={C.tax}>MANUAL TRANSLATION TAX</text>
        {KINDS.map((k) => <TaxArrow key={k.id} className={`pre tax tax-${k.id}`} x={COL[k.id]} y={Y.card + Y.cardH} />)}
        {KINDS.map((k) => <Token key={k.id} className={`pre tk tk-${k.id}`} x={COL[k.id]} y={Y.card + Y.cardH} colour={C.layer[k.id]} />)}
        <g className="pre graph"><Bands className="g" named={false} /><Ties /></g>
        <TraversePath className="pre trav" />
        <g className="pre bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        <g className="pre burst">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className={`bt bt-${i}`} x={AGENT.x + 50} y={Y.flow + 44} width={30} height={14} rx={3} fill={C.text} />)}</g>
        <g className="pre spec">
          <rect x={STATIONS[0].x - 90} y={Y.flow + 50} width={180} height={34} rx={6} fill={C.canvasRaised} stroke={C.card} strokeWidth={1.8} />
          <text x={STATIONS[0].x} y={Y.flow + 72} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.cardText}>the change, in full</text>
        </g>
        <Gate className="pre gatew" />
        <g className="pre check">
          <Mark className="" x={GATE_X} y={Y.flow + 72} />
          <rect x={GATE_X + 24} y={Y.flow + 60} width={86} height={26} rx={4} fill={C.canvasRaised} stroke={C.pass} />
          <text x={GATE_X + 67} y={Y.flow + 78} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.pass}>evidence</text>
        </g>
        <GraphSync />
        <g className="pre xcode">
          <rect x={560} y={LOWER.y} width={800} height={110} rx={10} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2} />
          {[0, 1, 2, 3].map((r) => <rect key={r} x={584} y={LOWER.y + 20 + r * 18} width={[520, 380, 460, 300][r]} height={7} rx={3} fill={C.layer.code} opacity={0.6} />)}
          <text x={1340} y={LOWER.y + 96} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.text}>existing application</text>
          {[0, 1, 2].map((i) => <AgentIcon key={i} x={1410 + i * 46} y={LOWER.y + 40} s={28} />)}
        </g>
        {KINDS.map((k) => (
          <g key={k.id} className={`pre how how-${k.id}`}>
            <rect x={COL[k.id] - 140} y={GRAPH_BOTTOM + 24} width={280} height={32} rx={16} fill={C.canvasRaised} stroke={C.layer[k.id]} strokeWidth={1.5} />
            <text x={COL[k.id]} y={GRAPH_BOTTOM + 45} textAnchor="middle" fontFamily={F.sans} fontSize={16} fill={C.text}>{HOW[k.id]}</text>
          </g>
        ))}
        <g className="pre xticks">{KINDS.map((k) => <Mark key={k.id} className="" x={COL[k.id] + 52} y={Y.person - 18} />)}</g>
        <g className="pre grow">
          <rect className="gtok" x={STATIONS[3].x - 18} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
          <line className="gline" x1={STATIONS[3].x} y1={Y.flow - 38} x2={STATIONS[3].x - 120} y2={GY.code + 40} stroke={C.layer.code} strokeWidth={2.5} />
          {(['functional', 'design', 'architecture', 'code'] as const).map((k, i) => <circle key={k} className={`gnew gnew-${i}`} cx={1380 + i * 40} cy={GY[k] + 40} r={0} fill={C.pass} />)}
        </g>
        {SOURCES.map(([k, i, t]) => {
          const n = item(k as 'code', i);
          return (
            <g key={t} className={`pre src src-${k}`}>
              <line x1={n.x} y1={n.y} x2={n.x + 26} y2={n.y - 10} stroke={C.text} strokeWidth={1.2} />
              <rect x={n.x + 26} y={n.y - 22} width={t.length * 8 + 16} height={22} rx={11} fill={C.canvas} stroke={C.text} strokeWidth={1.2} />
              <text x={n.x + 34} y={n.y - 7} fontFamily={F.mono} fontSize={13} fill={C.text}>{t}</text>
            </g>
          );
        })}
        <Strip cls="lv" items={LEVELS.map((l) => ({ a: l.who, b: l.what }))} />
        <g className="pre spots">
          {SPOTS.map((s) => (
            <g key={s.label}>
              <AgentIcon x={s.x} y={GAP_Y + 18} s={30} />
              <text x={s.x} y={GAP_Y + 52} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>{s.label}</text>
            </g>
          ))}
        </g>
        <Owners className="pre owners" />
        <Strip cls="use" items={USES.map((u) => ({ a: u }))} />
        <g className="pre mini">
          {['old system graph', 'specification', 'new system graph'].map((t, i) => (
            <g key={t}>
              <rect x={ROW(2).x + 10 + i * 175} y={LOWER.y + 78} width={160} height={40} rx={6} fill={C.canvasRaised} stroke={[C.layer.code, C.card, C.layer.architecture][i]} strokeWidth={1.8} />
              <text x={ROW(2).x + 90 + i * 175} y={LOWER.y + 103} textAnchor="middle" fontFamily={F.mono} fontSize={12} fill={C.text}>{t}</text>
            </g>
          ))}
        </g>
        <Strip cls="plat" items={[{ a: 'Breeze.AI', b: 'new and existing applications' }, { a: 'ASIMOV', b: 'legacy modernization' }]} />
        <g className="pre out">
          {OUTCOMES.map((o, i) => (
            <g key={o.f} className={`out-i out-${i}`}>
              <rect x={150 + i * 326} y={LOWER.y - 6} width={306} height={124} rx={12} fill={C.canvasRaised} stroke={C.hairline} strokeWidth={1.5} />
              <text x={168 + i * 326} y={LOWER.y + 34} fontFamily={F.display} fontSize={32} fontWeight={700} fill={C.text}>{o.f}</text>
              <foreignObject x={168 + i * 326} y={LOWER.y + 46} width={274} height={66}>
                <div style={{ fontFamily: F.sans, fontSize: 16, lineHeight: 1.25, color: C.cardText }}>{o.l}</div>
              </foreignObject>
            </g>
          ))}
        </g>
        <Strip cls="pr" items={PRINCIPLES.map((p) => ({ a: p }))} />
      </Svg>
      <Callout className="pre co co-know" {...CO} kind="The knowledge it needs" text="Written down nowhere an agent can read" tone={C.warn} target="problem.knowledge" />
      <Callout className="pre co co-fast" {...CO} kind="AI writes code faster" text="Delivery still waits while the team pays the tax" tone={C.tax} target="tax.ai" />
      <Callout className="pre co co-graph" {...CO} kind="Recorded once" text="A knowledge graph of what other parts depend on" tone={C.text} target="graph" />
      <Callout className="pre co co-owner" {...CO} kind="Each layer" text="Owned by the role that holds that knowledge" tone={C.text} target="custodians" />
      <Callout className="pre co co-extract" {...CO} kind="Built by Breeze.AI's agents" text="From the existing application itself" tone={C.text} target="extraction.brownfield" />
      <Callout className="pre co co-weeks" {...CO} kind="Reviewed by the custodians" text="2 to 3 weeks for 2M+ lines, typically" tone={C.pass} target="fig.extraction" />
      <Callout className="pre co co-grow" {...CO} kind="A new application" text="The graph grows as the code merges" tone={C.pass} target="graph.main-branch" />
      <Callout className="pre co co-src" {...CO} kind="Every item" text="Points back to its source" tone={C.text} target="graph.citations" />
      <Callout className="pre co co-impact" {...CO} kind="Impact analysis" text="Before any code is written; agents cannot ignore it" tone={C.text} target="agent.impact-analysis" />
      <Callout className="pre co co-spec" {...CO} kind="The specification" text="Describes each change; the graph governs how it fits" tone={C.text} target="spec.and-graph" />
      <Callout className="pre co co-check" x={150} y={GAP_Y - 8} w={560} kind="Every change" text="Checked against the graph before it merges, with evidence" tone={C.pass} target="gate.validation" />
      <Callout className="pre co co-breeze" x={150} y={LOWER.y} w={720} kind="Breeze.AI" text="Agents carry each change, from impact analysis to the check before merge" tone={C.text} target="platform.breeze-ai" />
      <Callout className="pre co co-people" x={150} y={LOWER.y} w={720} kind="People decide" text="Which work the agents take on; every agent has a named owner" tone={C.text} target="agent.owners" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const pick = (cls: string, i: number, at: number) => {
      tl.to(q(`.${cls}-i`), { opacity: 0.35, duration: 0.3 }, at);
      tl.to(q(`.${cls}-${i}`), { opacity: 1, duration: 0.3 }, at);
      tl.to(q(`.${cls} .bx`), { attr: { stroke: C.muted, 'stroke-width': 1.5 }, duration: 0.3 }, at);
      tl.to(q(`.${cls}-${i} .bx`), { attr: { stroke: C.text, 'stroke-width': 3 }, duration: 0.3 }, at);
    };
    const showStrip = (cls: string, n: number, at: number) => {
      tl.set(q(`.${cls}`), { autoAlpha: 1 }, at);
      for (let i = 0; i < n; i++) tl.fromTo(q(`.${cls}-${i}`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, at + i * 0.3);
    };
    tl.set(q('.lv-i, .use-i, .plat-i, .pr-i, .top .lbl'), { autoAlpha: 0 }, 0);
    // The shared opening. w1: a product on the waterline.
    const w1 = cue('waterline', 's0');
    appear(ctx, '.water', w1 + 0.2, { y: 0 });
    // w2: below the water, Semantic Engineering.
    const w2 = cue('below', 's1');
    appear(ctx, '.w-below', w2 + 0.3);
    // w3: above the water, Dialect Engineering: the product splits into customer variants.
    const w3 = cue('above', 's2');
    tl.to(q('.w-below'), { opacity: 0.4, duration: 0.4 }, w3);
    appear(ctx, '.w-above', w3 + 0.2, { y: 0 });
    [0, 1, 2].forEach((i) => tl.fromTo(q(`.w-tenant-${i}`), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, w3 + 0.6 + i * 0.35));
    // w4: one foundation, the knowledge graph under both.
    const w4 = cue('foundation', 's3');
    tl.to(q('.w-below'), { opacity: 1, duration: 0.4 }, w4);
    appear(ctx, '.w-graph', w4 + 0.3, { y: 0 });
    tl.fromTo(q('.w-graph rect'), { attr: { 'stroke-width': 2 } }, { attr: { 'stroke-width': 4 }, duration: 0.5, repeat: 3, yoyo: true, immediateRender: false }, w4 + 1.0);
    // s4: what Semantic Engineering is for.
    const s0 = cue('title', 's4');
    vanish(ctx, '.water', s0);
    tl.fromTo(q('.intro'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, s0 + 0.3);
    // s5: mistakes on a large application.
    const s2 = cue('large', 's5');
    vanish(ctx, '.intro', s2);
    appear(ctx, '.large', s2 + 0.3);
    tl.set(q('.miss'), { autoAlpha: 0 }, 0);
    [0, 1, 2, 3].forEach((i) => tl.to(q(`.miss-${i}`), { autoAlpha: 1, duration: 0.2 }, s2 + 1.4 + i * 0.4));
    appear(ctx, '.co-know', s2 + 2.6);
    // s6: four kinds of knowledge.
    const s3 = cue('kinds', 's6');
    vanish(ctx, '.large, .co-know', s3);
    tl.set(q('.top'), { autoAlpha: 1 }, s3 + 0.3);
    tl.set(q('.top .cus'), { autoAlpha: 0 }, s3 + 0.3);
    KINDS.forEach((k, i) => tl.fromTo(q(`.top .lbl-${k.id}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, s3 + 0.4 + i * 0.4));
    // s7: by hand, losing a little at each handoff; the people who hold each kind appear.
    const s5 = cue('handoff', 's7');
    KINDS.forEach((k, i) => tl.to(q(`.top .cus-${k.id}`), { autoAlpha: 1, duration: 0.4 }, s5 + 0.1 + i * 0.2));
    appear(ctx, '.cards', s5 + 0.6);
    appear(ctx, '.bottom', s5 + 0.8, { y: 0 });
    KINDS.forEach((k, i) => {
      appear(ctx, `.tax-${k.id}`, s5 + 1.4 + i * 0.3, { y: 0 });
      translate(ctx, `.tk-${k.id}`, { x: COL[k.id], y: Y.card + Y.cardH }, s5 + 1.8 + i * 0.4, 1.6, DEV);
    });
    // s8: the Manual Translation Tax.
    const s6 = cue('tax', 's8');
    vanish(ctx, '.tk', s6);
    appear(ctx, '.taxband, .taxlabel', s6 + 0.2, { y: 0 });
    // s9: recorded once, in a knowledge graph.
    const s8 = cue('graph', 's9');
    vanish(ctx, '.tax, .taxband, .taxlabel', s8);
    tl.to(q('.cards'), { y: 40, autoAlpha: 0, duration: 0.8 }, s8 + 0.2);
    appear(ctx, '.graph', s8 + 0.8, { y: 0 });
    appear(ctx, '.co-graph', s8 + 1.2);
    // s10 to s12: for an existing application, agents build the graph from the application; custodians review it.
    const x1 = cue('extract', 's10');
    vanish(ctx, '.co-graph', x1);
    tl.to(q('.g.band, .g.xlink, .tie'), { autoAlpha: 0, duration: 0.4 }, x1 + 0.2);
    appear(ctx, '.xcode', x1 + 0.5);
    appear(ctx, '.co-extract', x1 + 0.8);
    const x2 = cue('derive', 's11');
    vanish(ctx, '.co-extract', x2);
    KINDS.slice().reverse().forEach((k, i) => {
      tl.fromTo(q(`.band-${k.id}`), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false }, x2 + 0.3 + i * 1.6);
      appear(ctx, `.how-${k.id}`, x2 + 0.5 + i * 1.6, { y: 0 });
    });
    tl.to(q('.g.xlink, .tie'), { autoAlpha: 1, duration: 0.5 }, x2 + 6.8);
    const x3 = cue('review', 's12');
    vanish(ctx, '.how', x3);
    appear(ctx, '.xticks', x3 + 0.3, { y: 0 });
    appear(ctx, '.co-weeks', x3 + 0.6);
    // s13: impact analysis before coding.
    const s11 = cue('impact', 's13');
    vanish(ctx, '.co-weeks, .xticks, .xcode', s11);
    tl.fromTo(q('.trav'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, immediateRender: false }, s11 + 0.3);
    appear(ctx, '.co-impact', s11 + 0.6);
    // s14: every change checked before it merges.
    const s13 = cue('check', 's14');
    vanish(ctx, '.co-impact, .trav', s13);
    appear(ctx, '.gatew', s13 + 0.3, { y: 0 });
    appear(ctx, '.check', s13 + 1.0, { y: 0 });
    appear(ctx, '.co-check', s13 + 1.2);
    // s15: the graph is updated before the change merges.
    const s14 = cue('sync', 's15');
    vanish(ctx, '.co-check, .check', s14);
    syncMerge(ctx, syncUpdate(ctx, s14 + 0.3) + 0.4);
    // s16: two platforms.
    const s23 = cue('platforms', 's16');
    syncClear(ctx, s23);
    showStrip('plat', 2, s23 + 0.3);
    // s17: an outcome, with its context.
    const o0 = cue('outcome-0', 's17');
    vanish(ctx, '.plat', o0);
    tl.set(q('.out'), { autoAlpha: 1 }, o0 + 0.2);
    tl.set(q('.out-i'), { autoAlpha: 0 }, 0);
    tl.fromTo(q('.out-0'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, o0 + 0.3);
    // s18: four principles.
    const s24 = cue('principles', 's18');
    vanish(ctx, '.out', s24);
    showStrip('pr', 4, s24 + 0.3);
  },
};
