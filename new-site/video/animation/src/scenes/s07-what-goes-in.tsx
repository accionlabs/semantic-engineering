import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Custodians, Defs, Flow, KindLabels, STATIONS, Y } from '../parts/Landscape';
import { Bands, GRAPH_BOTTOM, GX, GY, Ties, item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 7. What goes into the graph. Putting everything in makes the graph impossible to keep up; the
// aperture admits what has a wide blast radius, leaves the rest in the code, and widens over time.
// One graph per product, linked where products integrate.
// Scattered, deterministically, across the four layers.
const rnd = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
const CROWD = Array.from({ length: 46 }, (_, i) => ({ x: 200 + rnd(i, 1) * 1520, y: 306 + rnd(i, 2) * 230 }));
const CAND_Y = 196;
const CANDS = [
  { id: 'persona', label: 'persona definition', x: 360, to: item('functional', 0), wide: true },
  { id: 'boundary', label: 'service boundary', x: 700, to: item('architecture', 0), wide: true },
  { id: 'contract', label: 'shared API contract', x: 1040, to: item('architecture', 3), wide: true },
  { id: 'button', label: 'wording on one button', x: 1380, to: { x: STATIONS[1].x, y: Y.flow }, wide: false },
];
const CENTRE = { x: 960, y: (GY.functional + GRAPH_BOTTOM) / 2 };

export const scene07: SceneDef = {
  n: 7,
  id: 'what-goes-in',
  View: () => (
    <Frame act="Act 2" scene="Scene 7 · What goes into the graph">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /></g>
        <Bands className="g" named={false} />
        <Ties />
        <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        <g className="pre crowd">{CROWD.map((p, i) => <circle key={i} className={`dot dot-${i}`} cx={p.x} cy={p.y} r={5} fill={C.muted} />)}</g>
        <ellipse className="pre aperture" cx={CENTRE.x} cy={CENTRE.y} rx={260} ry={150} fill="rgba(238,241,247,0.04)" stroke={C.text} strokeWidth={2.5} strokeDasharray="10 7" />
        <g className="pre demo">
          <circle className="ring ring-0" cx={960} cy={CAND_Y} r={20} fill="none" stroke={C.warn} strokeWidth={2} />
          <circle className="ring ring-1" cx={960} cy={CAND_Y} r={20} fill="none" stroke={C.warn} strokeWidth={2} />
          <circle cx={960} cy={CAND_Y} r={10} fill={C.text} />
          <text x={960} y={CAND_Y - 28} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>a decision</text>
        </g>
        {CANDS.map((c) => (
          <g key={c.id} className={`pre cand cand-${c.id}`}>
            <circle className="cring" cx={c.x} cy={CAND_Y} r={c.wide ? 70 : 18} fill="none" stroke={c.wide ? C.warn : C.muted} strokeWidth={2} strokeDasharray="6 5" />
            <circle className="cdot" cx={c.x} cy={CAND_Y} r={10} fill={C.text} />
            <text className="clabel" x={c.x} y={CAND_Y - (c.wide ? 80 : 28)} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.text}>{c.label}</text>
          </g>
        ))}
        <g className="pre unsure">
          <circle cx={1660} cy={CAND_Y} r={18} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="4 4" />
          <text x={1660} y={CAND_Y + 7} textAnchor="middle" fontFamily={F.display} fontSize={22} fontWeight={700} fill={C.muted}>?</text>
          <text x={1660} y={CAND_Y - 30} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.muted}>unclear</text>
        </g>
        <g className="pre sprints">
          {['sprint 1', 'sprint 4', 'sprint 12'].map((t, i) => (
            <text key={t} className={`sp sp-${i}`} x={700 + i * 260} y={GRAPH_BOTTOM + 44} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.text}>{t}</text>
          ))}
        </g>
        <text className="pre prodA" x={GX.x0 + 10} y={GY.functional - 12} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.text}>PRODUCT A</text>
        {['B', 'C'].map((p, i) => (
          <g key={p} className={`pre ghost ghost-${p}`}>
            <rect x={1080 + i * 360} y={110} width={320} height={150} rx={12} fill={C.canvas} stroke={C.muted} strokeWidth={2} strokeDasharray="8 6" />
            {[0, 1, 2, 3].map((r) => <rect key={r} x={1100 + i * 360} y={128 + r * 30} width={280} height={20} rx={5} fill="none" stroke={Object.values(C.layer)[r]} strokeWidth={1.2} opacity={0.6} />)}
            <text x={1240 + i * 360} y={102} textAnchor="middle" fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.muted}>PRODUCT {p}</text>
          </g>
        ))}
        <g className="pre bridges">
          <line x1={item('architecture', 3).x} y1={item('architecture', 3).y} x2={1240} y2={260} stroke={C.text} strokeWidth={2} strokeDasharray="5 5" />
          <line x1={extraX()} y1={GY.code + 27} x2={1600} y2={260} stroke={C.text} strokeWidth={2} strokeDasharray="5 5" />
          <circle cx={1240} cy={260} r={6} fill={C.text} /><circle cx={1600} cy={260} r={6} fill={C.text} />
        </g>
      </Svg>
      <Callout className="pre co-burden" x={1180} y={570} w={500} kind="Everything in the graph" text="The maintenance burden overwhelms the team" tone={C.warn} target="aperture.burden" />
      <Callout className="pre co-aperture" x={1240} y={570} w={480} kind="The aperture" text="The rule for what enters the graph" tone={C.text} target="aperture" />
      <Callout className="pre co-blast" x={560} y={570} w={800} kind="Blast radius" text="What else has to change when this decision changes" tone={C.warn} target="aperture.blast-radius" />
      <Callout className="pre co-in" x={1240} y={570} w={420} kind="Wide blast radius" text="Belongs in the graph" tone={C.pass} target="aperture.include" />
      <Callout className="pre co-out" x={1240} y={570} w={420} kind="Affects nothing else" text="Stays in the code" tone={C.muted} target="aperture.exclude" />
      <Callout className="pre co-unsure" x={1240} y={570} w={420} kind="Unclear" text="Stays out until the team is sure" tone={C.muted} target="aperture.default-exclude" />
      <Callout className="pre co-wider" x={150} y={570} w={420} kind="Over time" text="The aperture widens as confidence grows" tone={C.text} target="aperture.matures" />
      <Callout className="pre chip-8min" x={1080} y={568} w={680} kind="One impact analysis query, 1.6 million line application" text="About eight minutes" tone={C.text} target="fig.impact-8-min" />
      <Callout className="pre co-bridge" x={150} y={570} w={480} kind="Where products integrate" text="Links connect their graphs" tone={C.text} target="graph.integration-points" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.bottom'), { opacity: 0.3 }, 0);
    // s1 and s2: everything poured in; the burden overwhelms the team.
    const s1 = cue('crowd', 's0');
    appear(ctx, '.crowd', s1, { y: 0 });
    CROWD.forEach((_, i) => tl.fromTo(q(`.dot-${i}`), { attr: { cy: 120 }, opacity: 0 }, { attr: { cy: CROWD[i].y }, opacity: 1, duration: 0.6, ease: 'power1.in' }, s1 + 0.2 + (i % 23) * 0.12));
    const s2 = cue('burden', 's1');
    tl.to(q('.tie line'), { attr: { stroke: C.warn }, duration: 0.2, repeat: 5, yoyo: true }, s2 + 0.2);
    appear(ctx, '.co-burden', s2 + 0.3);
    // s3: the aperture.
    const s3 = cue('aperture', 's2');
    vanish(ctx, '.crowd, .co-burden', s3);
    tl.to(q('.top'), { opacity: 0.1, duration: 0.4 }, s3);
    appear(ctx, '.aperture', s3 + 0.3, { y: 0 });
    appear(ctx, '.co-aperture', s3 + 0.6);
    // s4: a decision's blast radius.
    const s4 = cue('blast', 's3');
    vanish(ctx, '.co-aperture', s4);
    appear(ctx, '.demo', s4, { y: 0 });
    tl.fromTo(q('.ring-0'), { attr: { r: 20 }, opacity: 1 }, { attr: { r: 150 }, opacity: 0, duration: 1.8, repeat: 2, ease: 'power1.out' }, s4 + 0.3);
    tl.fromTo(q('.ring-1'), { attr: { r: 20 }, opacity: 1 }, { attr: { r: 150 }, opacity: 0, duration: 1.8, repeat: 2, ease: 'power1.out' }, s4 + 1.2);
    appear(ctx, '.co-blast', s4 + 0.5);
    // s5: wide blast radius: into the graph.
    const s5 = cue('include', 's4');
    vanish(ctx, '.demo, .co-blast', s5);
    CANDS.forEach((c) => appear(ctx, `.cand-${c.id}`, s5 + 0.1, { y: 0 }));
    CANDS.filter((c) => c.wide).forEach((c, i) => {
      const at = s5 + 1.2 + i * 0.5;
      tl.to(q(`.cand-${c.id} .cring, .cand-${c.id} .clabel`), { opacity: 0, duration: 0.3 }, at);
      tl.to(q(`.cand-${c.id} .cdot`), { attr: { cx: c.to.x, cy: c.to.y }, duration: 0.8 }, at);
    });
    appear(ctx, '.co-in', s5 + 1.0);
    // s6: affects nothing else: stays in the code.
    const s6 = cue('exclude', 's5');
    vanish(ctx, '.co-in', s6);
    tl.to(q('.bottom'), { opacity: 1, duration: 0.3 }, s6);
    tl.to(q('.cand-button .cring, .cand-button .clabel'), { opacity: 0, duration: 0.3 }, s6 + 0.8);
    tl.to(q('.cand-button .cdot'), { attr: { cx: STATIONS[1].x - 60, cy: Y.flow + 50 }, duration: 1.0 }, s6 + 0.8);
    appear(ctx, '.co-out', s6 + 0.4);
    // s7: unclear: stays out for now.
    const s7 = cue('unsure', 's6');
    vanish(ctx, '.co-out', s7);
    tl.to(q('.bottom'), { opacity: 0.3, duration: 0.3 }, s7);
    appear(ctx, '.unsure', s7 + 0.2, { y: 0 });
    appear(ctx, '.co-unsure', s7 + 0.5);
    // s8: the aperture widens over the sprints.
    const s8 = cue('widens', 's7');
    vanish(ctx, '.co-unsure, .unsure, .cand', s8);
    appear(ctx, '.sprints', s8);
    tl.to(q('.aperture'), { attr: { rx: 420, ry: 170 }, duration: 1.0 }, s8 + 0.5);
    tl.to(q('.aperture'), { attr: { rx: 820, ry: 180 }, duration: 1.2 }, s8 + 1.8);
    appear(ctx, '.co-wider', s8 + 0.6);
    // s9: one graph per product.
    const s9 = cue('partition', 's8');
    vanish(ctx, '.sprints, .co-wider, .aperture', s9);
    appear(ctx, '.prodA', s9 + 0.2);
    appear(ctx, '.ghost-B', s9 + 0.6);
    appear(ctx, '.ghost-C', s9 + 0.9);
    // s10: why: query time grows with the graph.
    const s10 = cue('eight', 's9');
    appear(ctx, '.chip-8min', s10 + 0.2);
    // s11: links where products integrate.
    const s11 = cue('bridges', 's10');
    vanish(ctx, '.chip-8min', s11);
    appear(ctx, '.bridges', s11 + 0.2, { y: 0 });
    appear(ctx, '.co-bridge', s11 + 0.6);
  },
};

function extraX() { return 1620; }
