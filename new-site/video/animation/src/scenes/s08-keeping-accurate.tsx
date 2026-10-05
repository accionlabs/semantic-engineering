import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, COL, Custodians, Defs, Flow, KindLabels, STATIONS, Y } from '../parts/Landscape';
import { Bands, GY, Ties, item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';
import { GATE_X, Gate } from './s05-principles';

// Scene 8. Keeping the graph accurate. A gate checks every pull request against the four layers; an
// agent updates the graph after every merge; the graph's own health is measured. The custodians stay
// human, because what they know comes from conversations no agent can read.
const REASONS: [typeof KINDS[number]['id'], string][] = [['functional', 'misses a required outcome'], ['design', 'duplicates a design component'], ['architecture', 'crosses a service boundary'], ['code', 'breaks what depends on it']];
const INPUTS = ['customer calls', 'user research', 'vendor contracts', 'compliance decisions'];
const PR = STATIONS[2]; // the pull request is reviewed here, before the gate

export const scene08: SceneDef = {
  n: 8,
  id: 'keeping-the-graph-accurate',
  View: () => (
    <Frame act="Act 2" scene="Scene 8 · Keeping the graph accurate">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /></g>
        <Bands className="g" named={false} />
        <Ties />
        <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        <Gate />
        {KINDS.map((k) => <line key={k.id} className={`pre check check-${k.id}`} x1={GATE_X} y1={Y.flow - 52} x2={GATE_X - 60 + KINDS.indexOf(k) * 40} y2={GY[k.id] + 27} stroke={C.layer[k.id]} strokeWidth={2} />)}
        <g className="pre tok-ok"><rect className="ok" x={AGENT.x + 40} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} /></g>
        <g className="pre tick"><circle cx={GATE_X} cy={Y.flow + 74} r={13} fill={C.pass} /><path d={`M${GATE_X - 6} ${Y.flow + 74} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /></g>
        <g className="pre tok-bad"><rect x={GATE_X - 60} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} /><circle cx={GATE_X - 18} cy={Y.flow + 53} r={8} fill={C.warn} /></g>
        {REASONS.map(([k, t], i) => (
          <g key={k} className={`pre reason reason-${k}`}>
            <rect x={GATE_X + 30} y={Y.flow + 56} width={360} height={34} rx={6} fill={C.canvasRaised} stroke={C.layer[k]} />
            <text x={GATE_X + 46} y={Y.flow + 79} fontFamily={F.sans} fontSize={18} fill={C.text}>{t}</text>
          </g>
        ))}
        <line className="pre sync" x1={PR.x} y1={Y.flow - 38} x2={PR.x} y2={GY.code + 27} stroke={C.layer.code} strokeWidth={4} />
        <g className="pre blocked">
          <rect x={GATE_X - 30} y={Y.flow - 60} width={60} height={120} rx={8} fill="none" stroke={C.warn} strokeWidth={3} />
          <text x={GATE_X} y={Y.flow + 86} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.warn}>blocked</text>
        </g>
        {INPUTS.map((t, i) => (
          <g key={t} className={`pre input input-${i}`}>
            <rect x={COL[KINDS[i].id] - 110} y={572} width={220} height={36} rx={18} fill={C.canvasRaised} stroke={C.text} />
            <text x={COL[KINDS[i].id]} y={596} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>{t}</text>
            <line className="in-line" x1={COL[KINDS[i].id]} y1={572} x2={COL[KINDS[i].id]} y2={Y.name + 10} stroke={C.text} strokeWidth={2} strokeDasharray="4 4" />
          </g>
        ))}
        <g className="pre noreach">
          <line x1={AGENT.x} y1={AGENT.y - 22} x2={AGENT.x} y2={628} stroke={C.warn} strokeWidth={2} strokeDasharray="4 4" />
          <path d={`M${AGENT.x - 10} 616 l20 20 M${AGENT.x + 10} 616 l-20 20`} stroke={C.warn} strokeWidth={3} />
        </g>
        <g className="pre draft">
          <circle className="draft-node" cx={AGENT.x} cy={AGENT.y - 30} r={9} fill="none" stroke={C.layer.design} strokeWidth={2.5} strokeDasharray="4 3" />
        </g>
        <g className="pre approve"><circle cx={COL.design + 34} cy={Y.person - 30} r={12} fill={C.pass} /><path d={`M${COL.design + 28} ${Y.person - 30} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /></g>
      </Svg>
      <Callout className="pre co-gate" x={150} y={570} w={520} kind="PR Validation Agent" text="Checks every pull request before it merges" tone={C.text} anchor={{ x: GATE_X - 10, y: Y.flow }} target="agent.pr-validation" />
      <Callout className="pre co-sync" x={1180} y={570} w={500} kind="KG Sync Agent" text="Updates the graph before the pull request merges" tone={C.layer.code} target="agent.kg-sync" />
      <Callout className="pre chip-health" x={1080} y={568} w={600} kind="The health of the graph" text="29 metrics · 14 verification checks" tone={C.text} target="fig.health" />
      <Callout className="pre co-blocked" x={1180} y={570} w={520} kind="Most critical checks" text="A failure blocks the merge until it is fixed" tone={C.warn} target="governance.p0" />
      <Callout className="pre co-human" x={680} y={572} w={560} kind="The four custodians" text="Stay human" tone={C.text} target="custodians.human" />
      <Callout className="pre co-noreach" x={1180} y={640} w={480} kind="No system an agent can read" text="Contains that information" tone={C.warn} target="custodians.inputs" />
      <Callout className="pre co-draft" x={1180} y={570} w={520} kind="Agents draft, custodians approve" text="Agents enforce the graph when code merges" tone={C.pass} target="custodians.approve" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1 and s2: every pull request is checked against the four layers.
    const s1 = cue('check', 's0');
    appear(ctx, '.tok-ok', s1);
    tl.to(q('.ok'), { attr: { x: GATE_X - 18 }, duration: 1.2, ease: 'power1.inOut' }, s1 + 0.2);
    KINDS.forEach((k, i) => appear(ctx, `.check-${k.id}`, s1 + 1.4 + i * 0.2, { y: 0 }));
    appear(ctx, '.tick', s1 + 2.4);
    const s2 = cue('pr', 's1');
    appear(ctx, '.co-gate', s2 + 0.2);
    // s3: the four reasons a change fails.
    const s3 = cue('reasons', 's2');
    vanish(ctx, '.co-gate, .tok-ok, .tick', s3);
    appear(ctx, '.tok-bad', s3);
    REASONS.forEach(([k], i) => {
      const at = s3 + 0.4 + i * 1.3;
      tl.to(q('.g.band'), { opacity: 0.3, duration: 0.2 }, at);
      tl.to(q(`.band-${k}`), { opacity: 1, duration: 0.2 }, at);
      appear(ctx, `.reason-${k}`, at);
      if (i < 3) vanish(ctx, `.reason-${k}`, at + 1.2);
    });
    // s4: the graph is updated on every merge.
    const s4 = cue('sync', 's3');
    vanish(ctx, '.tok-bad, .reason, .check', s4);
    tl.to(q('.g.band'), { opacity: 1, duration: 0.3 }, s4);
    tl.fromTo(q('.sync'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s4 + 0.3);
    tl.fromTo(q('.band-code .band-rect'), { attr: { 'stroke-width': 1.8 } }, { attr: { 'stroke-width': 5 }, duration: 0.3, repeat: 1, yoyo: true }, s4 + 1.1);
    appear(ctx, '.co-sync', s4 + 0.5);
    // s5: the graph's own health is measured.
    const s5 = cue('health', 's4');
    vanish(ctx, '.co-sync, .sync', s5);
    appear(ctx, '.chip-health', s5 + 0.2);
    // s6: a failed critical check blocks the merge.
    const s6 = cue('blocked', 's5');
    vanish(ctx, '.chip-health', s6);
    appear(ctx, '.blocked', s6 + 0.2, { y: 0 });
    appear(ctx, '.co-blocked', s6 + 0.4);
    // s7: the custodians stay human.
    const s7 = cue('human', 's6');
    vanish(ctx, '.co-blocked, .blocked', s7);
    tl.to(q('.g, .tie, .bottom'), { opacity: 0.2, duration: 0.4 }, s7);
    tl.fromTo(q('.top .cus'), { opacity: 0.6 }, { opacity: 1, duration: 0.4 }, s7);
    appear(ctx, '.co-human', s7 + 0.3);
    // s8: what the custodians work with comes from conversations between people.
    const s8 = cue('inputs', 's7');
    vanish(ctx, '.co-human', s8);
    INPUTS.forEach((_, i) => appear(ctx, `.input-${i}`, s8 + 0.2 + i * 0.4));
    // s9: no agent can read it.
    const s9 = cue('noreach', 's8');
    tl.to(q('.bottom'), { opacity: 1, duration: 0.3 }, s9);
    appear(ctx, '.noreach', s9 + 0.2, { y: 0 });
    appear(ctx, '.co-noreach', s9 + 0.5);
    // s10: agents draft; custodians approve; agents enforce at merge.
    const s10 = cue('draft', 's9');
    vanish(ctx, '.input, .noreach, .co-noreach', s10);
    tl.to(q('.g, .tie'), { opacity: 1, duration: 0.4 }, s10);
    appear(ctx, '.draft', s10 + 0.3, { y: 0 });
    tl.to(q('.draft-node'), { attr: { cx: item('design', 2).x + 60, cy: GY.design + 19 }, duration: 1.2 }, s10 + 0.5);
    appear(ctx, '.approve', s10 + 1.9);
    tl.to(q('.draft-node'), { attr: { fill: C.layer.design, 'stroke-dasharray': '0' }, duration: 0.3 }, s10 + 2.2);
    appear(ctx, '.co-draft', s10 + 2.4);
  },
};
