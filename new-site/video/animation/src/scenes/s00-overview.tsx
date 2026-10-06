import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Cards, COL, Custodians, DEV, Defs, Flow, KindLabels, STATIONS, TaxArrow, Token, translate, Y } from '../parts/Landscape';
import { Bands, GY, Ties, TraversePath } from '../parts/Graph';
import { GAP_Y, LOWER, Mark, Owners } from '../parts/Act3';
import { GraphSync, syncClear, syncMerge, syncUpdate } from '../parts/Sync';
import { Gate, GATE_X } from './s05-principles';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// The overview: the whole story in one scene. What Semantic Engineering is for; why AI coding agents
// fail on large applications; the four kinds of knowledge and their holders; the Manual Translation Tax;
// the knowledge graph and how it governs each change; how much of the method a team needs; Breeze.AI's
// agents and their owners; the three use cases and two platforms; the four principles.
const CO = { x: 1180, y: GAP_Y - 8, w: 540 };
const ROW = (i: number, n = 3) => ({ x: 150 + i * (1620 / n), w: 1620 / n - 24 });
const LEVELS = [
  { who: 'One developer, a prototype', what: 'chat with an AI tool' },
  { who: 'One team, one product', what: 'a written specification per change' },
  { who: 'Several teams, a large existing system', what: 'the knowledge graph' },
];
const USES = ['building new applications', 'changing existing ones', 'replacing legacy systems'];
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
        <g className="intro">
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
        <Strip cls="lv" items={LEVELS.map((l) => ({ a: l.who, b: l.what }))} />
        <g className="pre spots">
          {SPOTS.map((s) => (
            <g key={s.label}>
              <AgentIcon x={s.x} y={GAP_Y + 40} s={30} />
              <text x={s.x} y={GAP_Y + 78} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>{s.label}</text>
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
        <Strip cls="pr" items={PRINCIPLES.map((p) => ({ a: p }))} />
      </Svg>
      <Callout className="pre co co-know" {...CO} kind="The knowledge it needs" text="Written down nowhere an agent can read" tone={C.warn} target="problem.knowledge" />
      <Callout className="pre co co-fast" {...CO} kind="AI writes code faster" text="Delivery still waits while the team pays the tax" tone={C.tax} target="tax.ai" />
      <Callout className="pre co co-graph" {...CO} kind="Recorded once" text="A knowledge graph of what other parts depend on" tone={C.text} target="graph" />
      <Callout className="pre co co-owner" {...CO} kind="Each layer" text="Owned by the role that holds that knowledge" tone={C.text} target="custodians" />
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
    // s0: what it is for.
    const s0 = cue('title', 's0');
    tl.fromTo(q('.intro'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, s0);
    // s1: fast on small tasks.
    const s1 = cue('small', 's1');
    vanish(ctx, '.intro', s1);
    appear(ctx, '.small', s1 + 0.3);
    tl.fromTo(q('.small-tick'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, s1 + 1.2);
    // s2: mistakes on a large application.
    const s2 = cue('large', 's2');
    tl.to(q('.small'), { opacity: 0.35, duration: 0.4 }, s2);
    appear(ctx, '.large', s2 + 0.3);
    tl.set(q('.miss'), { autoAlpha: 0 }, 0);
    [0, 1, 2, 3].forEach((i) => tl.to(q(`.miss-${i}`), { autoAlpha: 1, duration: 0.2 }, s2 + 1.4 + i * 0.4));
    appear(ctx, '.co-know', s2 + 2.6);
    // s3: four kinds of knowledge.
    const s3 = cue('kinds', 's3');
    vanish(ctx, '.small, .large, .co-know', s3);
    tl.set(q('.top'), { autoAlpha: 1 }, s3 + 0.3);
    tl.set(q('.top .cus'), { autoAlpha: 0 }, s3 + 0.3);
    KINDS.forEach((k, i) => tl.fromTo(q(`.top .lbl-${k.id}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, s3 + 0.4 + i * 0.4));
    // s4: who holds each.
    const s4 = cue('holders', 's4');
    KINDS.forEach((k, i) => tl.to(q(`.top .cus-${k.id}`), { autoAlpha: 1, duration: 0.4 }, s4 + 0.3 + i * 1.6));
    // s5: by hand, losing a little at each handoff.
    const s5 = cue('handoff', 's5');
    appear(ctx, '.cards', s5 + 0.2);
    appear(ctx, '.bottom', s5 + 0.4, { y: 0 });
    KINDS.forEach((k, i) => {
      appear(ctx, `.tax-${k.id}`, s5 + 1.0 + i * 0.3, { y: 0 });
      translate(ctx, `.tk-${k.id}`, { x: COL[k.id], y: Y.card + Y.cardH }, s5 + 1.4 + i * 0.4, 1.6, DEV);
    });
    // s6: the Manual Translation Tax.
    const s6 = cue('tax', 's6');
    vanish(ctx, '.tk', s6);
    appear(ctx, '.taxband, .taxlabel', s6 + 0.2, { y: 0 });
    // s7: faster code, no faster delivery.
    const s7 = cue('ai', 's7');
    [0, 1, 2, 3, 4, 5].forEach((i) => tl.fromTo(q(`.bt-${i}`), { attr: { x: AGENT.x + 50 } }, { attr: { x: STATIONS[2].x - 220 + i * 6 }, duration: 0.5, immediateRender: false }, s7 + 0.4 + i * 0.25));
    tl.set(q('.burst'), { autoAlpha: 1 }, s7 + 0.4);
    appear(ctx, '.co-fast', s7 + 1.4);
    // s8: recorded once, in a knowledge graph.
    const s8 = cue('graph', 's8');
    vanish(ctx, '.co-fast, .burst, .tax, .taxband, .taxlabel', s8);
    tl.to(q('.cards'), { y: 40, autoAlpha: 0, duration: 0.8 }, s8 + 0.2);
    appear(ctx, '.graph', s8 + 0.8, { y: 0 });
    appear(ctx, '.co-graph', s8 + 1.2);
    // s9: four layers.
    const s9 = cue('layers', 's9');
    vanish(ctx, '.co-graph', s9);
    KINDS.forEach((k, i) => tl.fromTo(q(`.band-${k.id} .band-rect`), { attr: { 'stroke-width': 1.8 } }, { attr: { 'stroke-width': 5 }, duration: 0.3, repeat: 1, yoyo: true, immediateRender: false }, s9 + 0.5 + i * 0.5));
    // s10: each layer has an owner.
    const s10 = cue('owners', 's10');
    tl.fromTo(q('.tie line'), { attr: { 'stroke-width': 2 } }, { attr: { 'stroke-width': 4 }, duration: 0.4, immediateRender: false }, s10 + 0.3);
    appear(ctx, '.co-owner', s10 + 0.4);
    // s11: impact analysis before coding.
    const s11 = cue('impact', 's11');
    vanish(ctx, '.co-owner', s11);
    tl.to(q('.tie line'), { attr: { 'stroke-width': 2 }, duration: 0.3 }, s11);
    tl.fromTo(q('.trav'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, immediateRender: false }, s11 + 0.3);
    appear(ctx, '.co-impact', s11 + 0.6);
    // s12: the specification still describes the change.
    const s12 = cue('spec', 's12');
    vanish(ctx, '.co-impact, .trav', s12);
    appear(ctx, '.spec', s12 + 0.3);
    appear(ctx, '.co-spec', s12 + 0.5);
    // s13: every change checked before it merges.
    const s13 = cue('check', 's13');
    vanish(ctx, '.co-spec, .spec', s13);
    appear(ctx, '.gatew', s13 + 0.3, { y: 0 });
    appear(ctx, '.check', s13 + 1.0, { y: 0 });
    appear(ctx, '.co-check', s13 + 1.2);
    // s14: the graph is updated before the change merges.
    const s14 = cue('sync', 's14');
    vanish(ctx, '.co-check, .check', s14);
    syncMerge(ctx, syncUpdate(ctx, s14 + 0.3) + 0.4);
    // s15 to s18: how much of the method a team needs.
    const s15 = cue('levels', 's15');
    syncClear(ctx, s15);
    showStrip('lv', 3, s15 + 0.3);
    [0, 1, 2].forEach((i) => pick('lv', i, cue(`level-${i}`, `s${16 + i}`) + 0.1));
    // s19: Breeze.AI's agents carry each change.
    const s19 = cue('breeze', 's19');
    vanish(ctx, '.lv', s19);
    appear(ctx, '.spots', s19 + 0.3);
    appear(ctx, '.co-breeze', s19 + 0.6);
    // s20: people decide; every agent has an owner.
    const s20 = cue('people', 's20');
    vanish(ctx, '.co-breeze, .spots', s20);
    appear(ctx, '.owners', s20 + 0.3);
    appear(ctx, '.co-people', s20 + 0.6);
    // s21: three use cases.
    const s21 = cue('uses', 's21');
    vanish(ctx, '.co-people, .owners', s21);
    showStrip('use', 3, s21 + 0.3);
    // s22: legacy modernization has its own graphs.
    const s22 = cue('legacy', 's22');
    pick('use', 2, s22 + 0.1);
    appear(ctx, '.mini', s22 + 0.5);
    // s23: two platforms.
    const s23 = cue('platforms', 's23');
    vanish(ctx, '.use, .mini', s23);
    showStrip('plat', 2, s23 + 0.3);
    // s24: four principles.
    const s24 = cue('principles', 's24');
    vanish(ctx, '.plat', s24);
    showStrip('pr', 4, s24 + 0.3);
  },
};
