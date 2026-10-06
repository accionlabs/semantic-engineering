import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { COL, Custodians, Defs, Flow, KindLabels, AgentIcon, AGENT, Y } from '../parts/Landscape';
import { Bands, GY, Ties } from '../parts/Graph';
import { GAP_Y, LOWER, Mark } from '../parts/Act3';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 29. Where it came from. 2017, Breeze: what product owners, UX designers and architects produce,
// kept by hand and dropped under pressure. 2022: a knowledge graph kept a model's hallucinations under
// control. 2023: KAPS. 2024: the Breeze guidelines become the four layers, in Breeze.AI. 2025: the name.
// Public and free to apply; Breeze.AI and ASIMOV run it; a two-day workshop to start.
const CARD = (k: 'functional' | 'design' | 'architecture') => ({ x: COL[k] - 110, y: Y.card + 40, w: 220, h: 120 });
const CL = { x: 1590, y: 420 };
const CLUSTER = [[-70, -40], [0, -60], [70, -30], [-50, 30], [30, 20], [90, 50]];
const CO = { x: 1180, y: GAP_Y - 8, w: 540 };

export const scene29: SceneDef = {
  n: 29,
  id: 'where-it-came-from',
  View: () => (
    <Frame act="Act 6" scene="Scene 29 · Where it came from">
      <Svg>
        <Defs />
        <g className="intro">
          <text x={960} y={380} textAnchor="middle" fontFamily={F.display} fontSize={72} fontWeight={700} fill={C.text}>Where it came from</text>
          <line className="tline" x1={260} y1={520} x2={1660} y2={520} stroke={C.text} strokeWidth={2} />
          {[2017, 2019, 2021, 2023, 2025].map((y, i) => (
            <g key={y} className={`tick tick-${i}`}>
              <line x1={260 + i * 350} y1={506} x2={260 + i * 350} y2={534} stroke={C.text} strokeWidth={2} />
              <text x={260 + i * 350} y={572} textAnchor="middle" fontFamily={F.mono} fontSize={22} fill={C.cardText}>{y}</text>
            </g>
          ))}
          <text x={960} y={650} textAnchor="middle" fontFamily={F.sans} fontSize={26} fill={C.cardText}>eight years of client work at Accion Labs</text>
        </g>
        <g className="top"><KindLabels /><Custodians /></g>
        {(['functional', 'design', 'architecture'] as const).map((k) => {
          const c = CARD(k);
          return (
            <g key={k} className={`hcard hcard-${k}`}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
              {[0, 1, 2, 3, 4].map((r) => <rect key={r} x={c.x + 16} y={c.y + 18 + r * 19} width={[170, 130, 180, 110, 150][r]} height={6} rx={3} fill={C.card} />)}
            </g>
          );
        })}
        <g className="pre cluster">
          {CLUSTER.map(([dx, dy], i) => i > 0 && <line key={`l${i}`} x1={CL.x + CLUSTER[i - 1][0]} y1={CL.y + CLUSTER[i - 1][1]} x2={CL.x + dx} y2={CL.y + dy} stroke={C.layer.functional} strokeWidth={1.5} opacity={0.6} />)}
          {CLUSTER.map(([dx, dy], i) => <circle key={i} cx={CL.x + dx} cy={CL.y + dy} r={7} fill={C.layer.functional} />)}
        </g>
        <rect className="pre mtok" x={CL.x - 18} y={CL.y + 120} width={36} height={18} rx={4} fill={C.text} />
        <Mark className="pre mtick" x={CL.x + 40} y={CL.y + 129} />
        <rect className="pre kaps" x={CL.x - 130} y={CL.y - 90} width={260} height={170} rx={14} fill="none" stroke={C.layer.functional} strokeWidth={2.5} />
        <g className="pre graph"><Bands className="g" named={false} /><Ties /></g>
        <g className="pre flow"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        <text className="pre year year-0" x={150} y={LOWER.y + 56} fontFamily={F.display} fontSize={64} fontWeight={700} fill={C.text}>2017</text>
        {['2022', '2023', '2024', '2025'].map((y, i) => <text key={y} className={`pre year year-${i + 1}`} x={150} y={LOWER.y + 56} fontFamily={F.display} fontSize={64} fontWeight={700} fill={C.text}>{y}</text>)}
        <text className="pre title" x={960} y={LOWER.y + 50} textAnchor="middle" fontFamily={F.display} fontSize={56} fontWeight={700} fill={C.text}>Semantic Engineering</text>
        <g className="pre platforms">
          {[{ t: 'Breeze.AI', s: 'new and existing applications' }, { t: 'ASIMOV', s: 'legacy modernization' }].map((p, i) => (
            <g key={p.t}>
              <rect x={420 + i * 560} y={LOWER.y + 86} width={520} height={50} rx={25} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
              <text x={444 + i * 560} y={LOWER.y + 118} fontFamily={F.sans} fontSize={21} fontWeight={600} fill={C.text}>{p.t}</text>
              <text x={590 + i * 560} y={LOWER.y + 118} fontFamily={F.sans} fontSize={18} fill={C.cardText}>{p.s}</text>
            </g>
          ))}
        </g>
      </Svg>
      <Callout className="pre co co-breeze" {...CO} kind="Breeze, at Accion Labs" text="What each role needs to produce" tone={C.text} target="origin.breeze" />
      <Callout className="pre co co-hand" {...CO} kind="Maintained by hand" text="Dropped under deadline pressure" tone={C.tax} target="origin.breeze" />
      <Callout className="pre co co-drug" {...CO} kind="Drug discovery" text="A knowledge graph kept the model's hallucinations under control" tone={C.layer.functional} target="origin.drug-discovery" />
      <Callout className="pre co co-kaps" {...CO} kind="KAPS" text="The knowledge-graph approach as a commercial platform" tone={C.layer.functional} target="origin.kaps" />
      <Callout className="pre co co-bai" {...CO} kind="Breeze.AI" text="The Breeze guidelines become the four layers, with agents" tone={C.text} target="origin.breeze-ai" />
      <Callout className="pre co co-public" {...CO} kind="The framework and concepts" text="Public and free to apply" tone={C.pass} target="next.public" />
      <Callout className="pre co co-workshop" {...CO} kind="To start" text="A two-day workshop with Accion Labs" tone={C.text} target="next.contact" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const year = (i: number, at: number) => {
      if (i > 0) vanish(ctx, `.year-${i - 1}`, at, { duration: 0.3 });
      appear(ctx, `.year-${i}`, at + 0.2);
    };
    tl.set(q('.cus-code, .lbl-code'), { autoAlpha: 0 }, 0);
    // s1: eight years, 2017 to 2025.
    tl.set(q('.top, .hcard'), { autoAlpha: 0 }, 0);
    const s0 = cue('intro', 's0');
    tl.fromTo(q('.intro > text:first-child'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false }, s0 + 0.2);
    tl.fromTo(q('.tline'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'none' }, s0 + 0.6);
    [0, 1, 2, 3, 4].forEach((i) => tl.fromTo(q(`.tick-${i}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, s0 + 0.6 + i * 0.4));
    tl.fromTo(q('.intro > text:last-child'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, s0 + 2.6);
    const s0b = cue('intro-end', 's1');
    vanish(ctx, '.intro', s0b, { duration: 0.5 });
    tl.to(q('.top, .hcard'), { autoAlpha: 1, duration: 0.6 }, s0b + 0.3);
    tl.set(q('.cus-code, .lbl-code'), { autoAlpha: 0 }, s0b + 0.3);
    // s1: 2017, Breeze.
    const s1 = cue('2017', 's1');
    year(0, s1);
    appear(ctx, '.co-breeze', s1 + 0.4);
    // s2: kept by hand, dropped under pressure.
    const s2 = cue('decay', 's2');
    vanish(ctx, '.co-breeze', s2);
    tl.to(q('.hcard'), { opacity: 0.25, duration: 1.6 }, s2 + 0.3);
    appear(ctx, '.co-hand', s2 + 0.4);
    // s3: 2022, a graph keeps the model's answers in check.
    const s3 = cue('2022', 's3');
    vanish(ctx, '.co-hand', s3);
    year(1, s3);
    appear(ctx, '.cluster', s3 + 0.4, { y: 0 });
    appear(ctx, '.mtok', s3 + 1.0, { y: 0 });
    tl.to(q('.mtok'), { attr: { y: CL.y + 40 }, duration: 0.8 }, s3 + 1.2);
    appear(ctx, '.mtick', s3 + 2.0, { y: 0 });
    appear(ctx, '.co-drug', s3 + 0.6);
    // s4: 2023, KAPS.
    const s4 = cue('2023', 's4');
    vanish(ctx, '.co-drug, .mtok, .mtick', s4);
    year(2, s4);
    appear(ctx, '.kaps', s4 + 0.3, { y: 0 });
    appear(ctx, '.co-kaps', s4 + 0.5);
    // s5: 2024, the guidelines become the four layers.
    const s5 = cue('2024', 's5');
    vanish(ctx, '.co-kaps', s5);
    year(3, s5);
    tl.to(q('.hcard'), { y: 60, autoAlpha: 0, duration: 0.9 }, s5 + 0.3);
    vanish(ctx, '.cluster, .kaps', s5 + 0.3);
    tl.to(q('.cus-code, .lbl-code'), { autoAlpha: 1, duration: 0.5 }, s5 + 0.5);
    appear(ctx, '.graph', s5 + 0.8, { y: 0 });
    appear(ctx, '.co-bai', s5 + 1.0);
    // s6: 2025, the name.
    const s6 = cue('2025', 's6');
    vanish(ctx, '.co-bai', s6);
    year(4, s6);
    appear(ctx, '.flow', s6 + 0.3, { y: 0 });
    appear(ctx, '.title', s6 + 0.6);
    // s7: public and free to apply.
    const s7 = cue('public', 's7');
    appear(ctx, '.co-public', s7 + 0.3);
    // s8: the two platforms.
    const s8 = cue('platforms', 's8');
    vanish(ctx, '.co-public', s8);
    appear(ctx, '.platforms', s8 + 0.3);
    // s9: a two-day workshop.
    const s9 = cue('workshop', 's9');
    appear(ctx, '.co-workshop', s9 + 0.3);
  },
};
