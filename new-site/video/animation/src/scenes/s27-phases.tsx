import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, STATIONS, Y } from '../parts/Landscape';
import { Base, GAP_Y, GATE_X, LOWER } from '../parts/Act3';
import { GX, GY } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 27. Engagement phases. Advise, Launch, Scale and Optimize, each with its duration and work; the
// client's custodians own the graph in every phase; Accion Labs customizes the platform, sets up the
// first graph and supports in one of three tiers; four commitments for the end of an engagement.
const PHASES = [
  { name: 'Advise', dur: '2 to 4 weeks', what: 'assessment · roadmap · platform' },
  { name: 'Launch', dur: 'about 12 weeks', what: 'first product graph · gate on every pull request' },
  { name: 'Scale', dur: 'quarters to years', what: 'across the portfolio · more agent autonomy' },
  { name: 'Optimize', dur: 'continuous', what: 'quarterly audits · graph clean-up' },
];
const px = (i: number) => 150 + i * 412;
const TIERS = ['Light Governance', 'Medium Curation', 'Deep Operations'];
const COMMIT = [
  { t: 'graph exportable', x: GX.x1 - 220, y: GY.code + 70 },
  { t: 'agents reproducible', x: AGENT.x - 110, y: Y.flow + 50 },
  { t: 'governance documented', x: GATE_X - 110, y: Y.flow + 64 },
  { t: 'roles handed to client staff', x: 1240, y: GAP_Y + 10 },
];
const CO = { x: 1180, y: GAP_Y - 8, w: 540 };

export const scene27: SceneDef = {
  n: 27,
  id: 'engagement-phases',
  View: () => (
    <Frame act="Act 5" scene="Scene 27 · Engagement phases">
      <Svg>
        <g className="land"><Base /></g>
        {PHASES.map((p, i) => (
          <g key={p.name} className={`pre ph ph-${i}`} data-target={`phase.${p.name.toLowerCase()}`}>
            <rect className="ph-box" x={px(i)} y={LOWER.y} width={392} height={124} rx={12} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
            <text x={px(i) + 18} y={LOWER.y + 36} fontFamily={F.display} fontSize={28} fontWeight={700} fill={C.text}>{p.name}</text>
            <text x={px(i) + 374} y={LOWER.y + 34} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.muted}>{p.dur}</text>
            <text className="ph-what" x={px(i) + 18} y={LOWER.y + 84} fontFamily={F.sans} fontSize={17} fill={C.cardText}>{p.what}</text>
          </g>
        ))}
        <g className="pre ghosts">
          {[1, 2].map((n) => <rect key={n} x={GX.x0 + n * 14} y={GY.functional - n * 14} width={GX.x1 - GX.x0} height={GY.code + 54 - GY.functional} rx={12} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7 - n * 0.2} />)}
        </g>
        <line className="pre pulse" x1={STATIONS[2].x} y1={Y.flow - 38} x2={STATIONS[2].x} y2={GY.code + 27} stroke={C.layer.code} strokeWidth={4} />
        <g className="pre accion">
          <rect x={150} y={GAP_Y + 4} width={200} height={40} rx={20} fill={C.canvasRaised} stroke={C.warn} strokeWidth={1.5} />
          <text x={250} y={GAP_Y + 30} textAnchor="middle" fontFamily={F.sans} fontSize={18} fontWeight={600} fill={C.warn}>Accion Labs</text>
          {TIERS.map((t, i) => (
            <g key={t} className={`tier tier-${i}`}>
              <rect x={380 + i * 250} y={GAP_Y + 6} width={230} height={36} rx={18} fill="none" stroke={C.muted} strokeWidth={1.5} />
              <text x={495 + i * 250} y={GAP_Y + 30} textAnchor="middle" fontFamily={F.sans} fontSize={16} fill={C.text}>{t}</text>
            </g>
          ))}
        </g>
        {COMMIT.map((c, i) => (
          <g key={c.t} className={`pre cm cm-${i}`}>
            <rect x={c.x} y={c.y} width={220} height={32} rx={16} fill={C.canvasRaised} stroke={C.pass} strokeWidth={1.5} />
            <text x={c.x + 110} y={c.y + 21} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.pass}>{c.t}</text>
          </g>
        ))}
      </Svg>
      <Callout className="pre co co-own" {...CO} kind="In every phase" text="The client's four custodians own the four layers" tone={C.text} target="partnership.ownership" />
      <Callout className="pre co co-commit" {...CO} kind="Four commitments" text="For the end of an engagement" tone={C.pass} target="offboarding.graph" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const light = (i: number, at: number) => {
      tl.to(q('.ph'), { opacity: 0.35, duration: 0.3 }, at);
      tl.to(q(`.ph-${i}`), { opacity: 1, duration: 0.3 }, at);
      tl.to(q('.ph-box'), { attr: { stroke: C.muted, 'stroke-width': 1.5 }, duration: 0.3 }, at);
      tl.to(q(`.ph-${i} .ph-box`), { attr: { stroke: C.text, 'stroke-width': 3 }, duration: 0.3 }, at);
    };
    // s1: four phases.
    const s1 = cue('phases', 's0');
    tl.to(q('.land'), { opacity: 0.35, duration: 0.5 }, s1);
    PHASES.forEach((_, i) => appear(ctx, `.ph-${i}`, s1 + 0.3 + i * 0.35));
    // s2: Advise.
    const s2 = cue('advise', 's1');
    light(0, s2 + 0.1);
    // s3: Launch builds the first graph and the gate.
    const s3 = cue('launch', 's2');
    light(1, s3 + 0.1);
    tl.to(q('.land'), { opacity: 1, duration: 0.5 }, s3 + 0.3);
    tl.fromTo(q('.gate-wrap rect'), { attr: { width: 16 } }, { attr: { width: 26 }, duration: 0.3, repeat: 3, yoyo: true }, s3 + 1.2);
    // s4: Scale across the portfolio.
    const s4 = cue('scale', 's3');
    light(2, s4 + 0.1);
    appear(ctx, '.ghosts', s4 + 0.4, { y: 0 });
    // s5: Optimize, continuous.
    const s5 = cue('optimize', 's4');
    light(3, s5 + 0.1);
    vanish(ctx, '.ghosts', s5);
    tl.fromTo(q('.pulse'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, repeat: 1, repeatDelay: 0.6 }, s5 + 0.5);
    vanish(ctx, '.pulse', s5 + 3.0);
    // s6: the client's custodians own the graph.
    const s6 = cue('own', 's5');
    tl.to(q('.ph'), { opacity: 0.3, duration: 0.4 }, s6);
    tl.to(q('.land .bottom, .gate-wrap'), { opacity: 0.25, duration: 0.4 }, s6);
    tl.fromTo(q('.land .tie line'), { attr: { 'stroke-width': 2 } }, { attr: { 'stroke-width': 4 }, duration: 0.4 }, s6 + 0.3);
    appear(ctx, '.co-own', s6 + 0.4);
    // s7: Accion Labs and the three tiers.
    const s7 = cue('accion', 's6');
    vanish(ctx, '.co-own', s7);
    tl.to(q('.land .tie line'), { attr: { 'stroke-width': 2 }, duration: 0.3 }, s7);
    tl.to(q('.land .bottom, .gate-wrap'), { opacity: 1, duration: 0.4 }, s7);
    appear(ctx, '.accion', s7 + 0.3);
    TIERS.forEach((_, i) => tl.fromTo(q(`.tier-${i}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, s7 + 0.6 + i * 0.3));
    // s8 and s9: four commitments.
    const s8 = cue('commit', 's7');
    tl.to(q('.tier'), { opacity: 0.3, duration: 0.3 }, s8);
    appear(ctx, '.co-commit', s8 + 0.3);
    const s9 = cue('commit-list', 's8');
    vanish(ctx, '.co-commit', s9);
    COMMIT.forEach((_, i) => appear(ctx, `.cm-${i}`, s9 + 0.3 + i * 1.4, { y: 0 }));
  },
};
