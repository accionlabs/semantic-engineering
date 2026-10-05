import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, COL, Cards, Custodians, Defs, Flow, KindLabels, Y } from '../parts/Landscape';
import { Bands, GY, Ties, item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 5. Four principles. The four documents fold into the four layers of a knowledge graph; the
// agent asks the graph for what it needs and builds only what it describes; each layer has an owner;
// a gate checks every change and records the result.
export const GATE_X = 1380;
const SLOTS = ['Knowledge graph', 'Impact analysis on every change', 'Named ownership', 'Validation gates'];
const SLOT_Y = 806;
const QUERY: [typeof KINDS[number]['id'], number][] = [['functional', 2], ['design', 3], ['architecture', 2], ['code', 1]];

export const Gate: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g className={`${className} gate`} data-target="gate.validation">
    <rect x={GATE_X - 8} y={Y.flow - 52} width={16} height={104} rx={5} fill={C.text} />
    <text x={GATE_X} y={Y.flow - 62} textAnchor="middle" fontFamily={F.mono} fontSize={13} letterSpacing={1.5} fill={C.text}>GATE</text>
  </g>
);

export const scene05: SceneDef = {
  n: 5,
  id: 'four-principles',
  View: () => (
    <Frame act="Act 2" scene="Scene 5 · Four principles">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /></g>
        <Cards className="cards" />
        <Bands className="pre g" />
        <Ties className="pre" />
        <g className="band-tax">
          <rect x={150} y={Y.tax - 22} width={1620} height={Y.taxH + 44} rx={14} fill="rgba(255,106,61,0.07)" stroke={C.tax} strokeWidth={2.5} strokeDasharray="12 8" />
        </g>
        <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        <line className="pre query" x1={AGENT.x} y1={AGENT.y - 20} x2={item('code', 1).x} y2={item('code', 1).y} stroke={C.text} strokeWidth={3} />
        <g className="pre report">
          <rect x={AGENT.x + 40} y={Y.flow - 110} width={150} height={40} rx={6} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
          <text x={AGENT.x + 115} y={Y.flow - 84} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>impact report</text>
          <line x1={AGENT.x + 60} y1={Y.flow - 70} x2={AGENT.x + 12} y2={AGENT.y - 18} stroke={C.text} strokeWidth={1.5} />
        </g>
        <g className="pre spec">
          <rect x={150} y={572} width={300} height={70} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
          {[0, 1, 2].map((r) => <rect key={r} x={168} y={588 + r * 14} width={r === 2 ? 120 : 200} height={6} rx={3} fill={C.card} />)}
          <text x={470} y={600} fontFamily={F.sans} fontSize={20} fill={C.text}>Specification: what to build, with every detail</text>
          <text x={470} y={630} fontFamily={F.sans} fontSize={20} fill={C.muted}>Knowledge graph: how the change fits the application</text>
        </g>
        <Gate className="pre" />
        <g className="pre change"><rect className="chg" x={AGENT.x + 40} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} /></g>
        <g className="pre pass">
          <circle cx={GATE_X} cy={Y.flow + 72} r={13} fill={C.pass} />
          <path d={`M${GATE_X - 6} ${Y.flow + 72} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" />
          <rect x={GATE_X + 24} y={Y.flow + 60} width={86} height={26} rx={4} fill={C.canvasRaised} stroke={C.pass} />
          <text x={GATE_X + 67} y={Y.flow + 78} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.pass}>evidence</text>
        </g>
      </Svg>
      <div className="pre title-chip" style={{ position: 'absolute', left: 150, top: SLOT_Y - 6, fontFamily: F.mono, fontSize: 15, letterSpacing: 2, color: C.muted }}>FOUR PRINCIPLES</div>
      {SLOTS.map((t, i) => (
        <div key={t} className={`pre slot slot-${i}`} style={{ position: 'absolute', left: 150 + i * 410, top: SLOT_Y + 22, width: 390, height: 64, border: `1.5px solid ${C.hairline}`, borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px', boxSizing: 'border-box' }}>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 26, color: C.muted, marginRight: 12 }}>{i + 1}</span>
          <span className="slot-text" style={{ fontSize: 21, fontWeight: 500, color: C.text, opacity: 0 }}>{t}</span>
        </div>
      ))}
      <Callout className="pre co-part" x={1230} y={570} w={420} kind="Each agent asks for" text="Only the part its task needs" tone={C.text} target="principle.structured" />
      <Callout className="pre co-owner" x={1230} y={570} w={480} kind="Out of date" text="The owner of that part is responsible" tone={C.layer.design} target="principle.ownership" />
      <Callout className="pre co-audit" x={1230} y={570} w={420} kind="Every check" text="Pass or fail, recorded for audit" tone={C.pass} target="gate.evidence" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const fill = (i: number, at: number) => {
      tl.to(q(`.slot-${i}`), { borderColor: C.text, duration: 0.3 }, at);
      tl.to(q(`.slot-${i} .slot-text`), { opacity: 1, duration: 0.4 }, at);
    };
    tl.set(q('.top'), { opacity: 0.6 }, 0);
    tl.set(q('.band-tax'), { opacity: 0.45 }, 0);
    // s1: four principles.
    const s1 = cue('title', 's0');
    appear(ctx, '.title-chip', s1);
    [0, 1, 2, 3].forEach((i) => appear(ctx, `.slot-${i}`, s1 + 0.3 + i * 0.25));
    // s2: the Fold. The documents become the four layers of a knowledge graph; the tax band thins.
    const s2 = cue('fold', 's1');
    KINDS.forEach((k, i) => {
      const at = s2 + 0.4 + i * 0.35;
      tl.to(q(`.cards .card-${k.id}`), { y: GY[k.id] - Y.card, autoAlpha: 0, duration: 0.9 }, at);
      tl.set(q(`.band-${k.id}`), { autoAlpha: 1 }, at + 0.3);
      tl.fromTo(q(`.band-${k.id}`), { scaleX: 0.14, svgOrigin: `${COL[k.id]} ${GY[k.id] + 27}` }, { scaleX: 1, svgOrigin: `${COL[k.id]} ${GY[k.id] + 27}`, duration: 0.9 }, at + 0.3);
    });
    tl.set(q('.g.xlink'), { autoAlpha: 1 }, s2 + 2);
    tl.fromTo(q('.g.xlink'), { opacity: 0 }, { opacity: 0.55, duration: 0.6 }, s2 + 2);
    tl.to(q('.band-tax'), { autoAlpha: 0, duration: 1.2 }, s2 + 0.6);
    fill(0, s2 + 1.8);
    // s3: the agent asks the graph for the part its task needs.
    const s3 = cue('query', 's2');
    tl.fromTo(q('.query'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s3 + 0.2);
    QUERY.forEach(([k, i], n) => tl.to(q(`.node-${k}-${i} circle`), { attr: { r: 12 }, duration: 0.3 }, s3 + 0.9 + n * 0.2));
    appear(ctx, '.co-part', s3 + 1.0);
    // s4: every change is analyzed against the graph, and the agent cannot ignore what it finds.
    const s4 = cue('analysis', 's3');
    vanish(ctx, '.co-part, .query', s4);
    QUERY.forEach(([k, i]) => tl.to(q(`.node-${k}-${i} circle`), { attr: { r: 7 }, duration: 0.3 }, s4 + 1.6));
    appear(ctx, '.report', s4 + 0.4);
    fill(1, s4 + 0.8);
    // s5: the specification still describes what to build; the graph governs how it fits.
    const s5spec = cue('specification', 's4');
    vanish(ctx, '.report', s5spec);
    appear(ctx, '.spec', s5spec + 0.2);
    // s5: each layer is tied to its custodian.
    const s5 = cue('ownership', 's5');
    vanish(ctx, '.spec', s5);
    tl.to(q('.top'), { opacity: 1, duration: 0.4 }, s5);
    KINDS.forEach((k, i) => appear(ctx, `.tie-${k.id}`, s5 + 0.2 + i * 0.3, { y: 0 }));
    fill(2, s5 + 0.8);
    // s6: a layer falls out of date; its owner brings it back.
    const s6 = cue('decay', 's6');
    tl.to(q('.band-design .band-rect'), { attr: { stroke: C.card }, duration: 0.5 }, s6 + 0.2);
    tl.to(q('.band-design .node'), { opacity: 0.3, duration: 0.5 }, s6 + 0.2);
    tl.to(q('.tie-design line'), { attr: { 'stroke-width': 5 }, duration: 0.4 }, s6 + 1.4);
    tl.to(q('.band-design .band-rect'), { attr: { stroke: C.layer.design }, duration: 0.5 }, s6 + 1.8);
    tl.to(q('.band-design .node'), { opacity: 1, duration: 0.5 }, s6 + 1.8);
    tl.to(q('.tie-design line'), { attr: { 'stroke-width': 2 }, duration: 0.4 }, s6 + 3.0);
    appear(ctx, '.co-owner', s6 + 0.6);
    // s7: a validation gate on the flow.
    const s7 = cue('gate', 's7');
    vanish(ctx, '.co-owner', s7);
    appear(ctx, '.gate', s7 + 0.2);
    fill(3, s7 + 0.6);
    // s8: a change passes the gate and leaves evidence.
    const s8 = cue('evidence', 's8');
    appear(ctx, '.change', s8);
    tl.to(q('.chg'), { attr: { x: GATE_X - 18 }, duration: 1.2, ease: 'power1.inOut' }, s8 + 0.2);
    appear(ctx, '.pass', s8 + 1.4);
    appear(ctx, '.co-audit', s8 + 1.6);
  },
};
