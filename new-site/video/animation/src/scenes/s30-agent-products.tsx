import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AgentIcon } from '../parts/Landscape';
import { Mark } from '../parts/Act3';
import { Bands, GX, GY, BAND_H } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 29. Below and above the water. Semantic Engineering works below the water; some products must also
// change above it, per customer; Dialect Engineering does that, starting from the graph. The graph holds the
// canonical model, read from the code and the data model; a language over it lets an agent write one
// customer's onboarding mapping and test it, and gives customers' own agents the product in its domain's
// terms, governed by the graph. Which a product needs; dialect-engineering.ai.
const K = 0.62, OX = 40, OY = 416; // the graph, scaled under the waterline
const sx = (x: number) => K * x + OX, sy = (y: number) => K * y + OY;
const WL = 540; // the waterline
const G = { x0: sx(GX.x0), x1: sx(GX.x1), top: sy(GY.functional), bottom: sy(GY.code + BAND_H) };
const TEN = [210, 470, 730]; // customer variants, above the water
const TY = 330;
const LANG = { y: 448, h: 64 };
const SRC = { y: 800, h: 56 };
const AG = [1290, 1440, 1590];
const AGY = 380;
const CO = { x: 1240, y: 600, w: 600 };

export const scene30: SceneDef = {
  n: 29,
  id: 'below-above-water',
  View: () => (
    <Frame act="Act 6" scene="Scene 29 · Below and above the water">
      <Svg>
        <g className="pre water">
          <rect x={0} y={WL} width={1920} height={1080 - WL} fill="rgba(44,197,180,0.07)" />
          <line x1={0} y1={WL} x2={1920} y2={WL} stroke={C.layer.architecture} strokeWidth={2} strokeDasharray="14 10" opacity={0.7} />
          <text x={G.x0} y={G.top - 22} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.text}>SEMANTIC ENGINEERING · BELOW THE WATER</text>
        </g>
        <g className="pre graph"><g className="g-bands" transform={`matrix(${K},0,0,${K},${OX},${OY})`}><Bands named /></g></g>
        <g className="pre tenants">
          <text x={TEN[0]} y={TY - 26} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.warn}>ABOVE THE WATER · EACH CUSTOMER</text>
          {TEN.map((x, i) => (
            <g key={i} className={`tenant tenant-${i}`}>
              <rect x={x} y={TY} width={200} height={84} rx={10} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
              {[0, 1, 2].map((r) => <rect key={r} x={x + 18} y={TY + 18 + r * 18} width={[[150, 110, 130], [120, 150, 90], [140, 100, 150]][i][r]} height={6} rx={3} fill={C.warn} opacity={0.8} />)}
            </g>
          ))}
        </g>
        <g className="pre roots">
          {/* Each root breaks around the "below the water" label. */}
          {TEN.map((x, i) => [[TY + 84, G.top - 46], [G.top - 12, G.top]].map(([a, b], j) => <line key={`${i}-${j}`} x1={x + 100} y1={a} x2={x + 100} y2={b} stroke={C.warn} strokeWidth={1.5} strokeDasharray="4 5" />))}
        </g>
        <g className="pre de">
          <text x={TEN[0]} y={200} fontFamily={F.display} fontSize={60} fontWeight={700} fill={C.text}>Dialect Engineering</text>
          <text className="url" x={TEN[0]} y={252} fontFamily={F.mono} fontSize={28} fill={C.layer.functional}>dialect-engineering.ai</text>
        </g>
        <g className="pre source">
          <rect x={G.x0} y={SRC.y} width={G.x1 - G.x0} height={SRC.h} rx={10} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 6" />
          <text x={(G.x0 + G.x1) / 2} y={SRC.y + 35} textAnchor="middle" fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.cardText}>THE CODE · THE DATA MODEL</text>
          {[0.2, 0.5, 0.8].map((f, i) => {
            const x = G.x0 + f * (G.x1 - G.x0);
            return <g key={i} className="up"><line x1={x} y1={SRC.y - 6} x2={x} y2={G.bottom + 10} stroke={C.text} strokeWidth={2} /><path d={`M${x - 7} ${G.bottom + 20} L${x} ${G.bottom + 8} L${x + 7} ${G.bottom + 20}`} fill="none" stroke={C.text} strokeWidth={2} /></g>;
          })}
        </g>
        <g className="pre lang">
          <rect x={TEN[0] - 20} y={LANG.y} width={TEN[2] + 220 - TEN[0]} height={LANG.h} rx={10} fill={C.canvasRaised} stroke={C.text} strokeWidth={2} />
          <text x={TEN[0]} y={LANG.y + 26} fontFamily={F.mono} fontSize={14} letterSpacing={2} fill={C.text}>A LANGUAGE OVER THE GRAPH</text>
          <g className="map">
            <text x={TEN[0]} y={LANG.y + 50} fontFamily={F.mono} fontSize={15} fill={C.cardText}>their data  →  canonical model</text>
          </g>
          {[0, 1, 2, 3, 4].map((i) => <Mark key={i} className={`tick tick-${i}`} x={TEN[2] + 30 + i * 32} y={LANG.y + 38} />)}
        </g>
        <g className="pre agents">
          {AG.map((x, i) => <AgentIcon key={i} x={x} y={AGY} s={38} />)}
          <text x={AG[1]} y={AGY - 60} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>customers' own agents</text>
          {AG.map((x, i) => (
            <g key={i} className="key">
              <path d={`M${G.x1 - 40 + i * 16} ${G.top} C ${G.x1 + 40} ${G.top - 80}, ${x} ${AGY + 120}, ${x} ${AGY + 40}`} fill="none" stroke={i === 2 ? C.warn : C.pass} strokeWidth={2} strokeDasharray="5 5" />
              <Mark className="" x={x} y={AGY + 70} ok={i !== 2} />
            </g>
          ))}
        </g>
        <g className="pre which">
          <rect x={CO.x} y={CO.y - 10} width={CO.w} height={190} rx={12} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
          <text x={CO.x + 20} y={CO.y + 24} fontFamily={F.mono} fontSize={13} letterSpacing={1.8} fill={C.text}>WHICH A PRODUCT NEEDS</text>
          <text x={CO.x + 20} y={CO.y + 72} fontFamily={F.sans} fontSize={22} fill={C.cardText}>stays as it is</text>
          <text x={CO.x + 250} y={CO.y + 72} fontFamily={F.sans} fontSize={22} fontWeight={600} fill={C.text}>Semantic Engineering</text>
          <text x={CO.x + 20} y={CO.y + 124} fontFamily={F.sans} fontSize={22} fill={C.cardText}>varies per customer</text>
          <text x={CO.x + 250} y={CO.y + 124} fontFamily={F.sans} fontSize={22} fontWeight={600} fill={C.text}>both, graph first</text>
        </g>
      </Svg>
      <Callout className="pre co co-below" {...CO} kind="Below the water" text="The product stays as it is; the graph governs how it is built and changed" tone={C.layer.architecture} target="next.agent-interfaces" />
      <Callout className="pre co co-above" {...CO} kind="Above the water" text="More of each customer's needs can vary, without special cases in shared code" tone={C.warn} target="next.dialect-engineering" />
      <Callout className="pre co co-start" {...CO} kind="Dialect Engineering" text="Starts from the graph Semantic Engineering has already built" tone={C.text} target="next.dialect-engineering" />
      <Callout className="pre co co-canon" {...CO} kind="The canonical model" text="Entities, workflows, rules and contracts every customer shares" tone={C.layer.functional} target="next.agent-interfaces" />
      <Callout className="pre co co-read" {...CO} kind="Read from the product" text="Extracted from the code and the data model, without designing it from scratch" tone={C.text} target="next.agent-interfaces" />
      <Callout className="pre co co-onboard" {...CO} kind="Onboarding one customer" text="An agent writes how their data maps onto the canonical model, and runs tests" tone={C.text} target="next.dialect-engineering" />
      <Callout className="pre co co-agents" x={CO.x} y={CO.y + 40} w={CO.w} kind="Governed by the graph" text="Which customer's agent may use which capability" tone={C.text} target="next.agent-interfaces" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: below the water: the graph governs how the product is built and changed.
    const s1 = cue('below', 's0');
    appear(ctx, '.water', s1 + 0.2, { y: 0 });
    appear(ctx, '.graph', s1 + 0.5, { y: 0 });
    appear(ctx, '.co-below', s1 + 0.9);
    // s2: some products also change above the water, per customer.
    const s2 = cue('above', 's1');
    vanish(ctx, '.co-below', s2);
    tl.set(q('.tenants'), { autoAlpha: 1 }, s2 + 0.2);
    tl.fromTo(q('.tenants > text'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, s2 + 0.2);
    TEN.forEach((_, i) => tl.fromTo(q(`.tenant-${i}`), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, s2 + 0.5 + i * 0.35));
    appear(ctx, '.co-above', s2 + 1.2);
    // s3: Dialect Engineering, starting from the graph.
    const s3 = cue('start', 's2');
    vanish(ctx, '.co-above', s3);
    tl.set(q('.de'), { autoAlpha: 1 }, s3 + 0.2);
    tl.set(q('.de .url'), { autoAlpha: 0 }, s3 + 0.2);
    tl.fromTo(q('.de > text:first-child'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, s3 + 0.2);
    appear(ctx, '.roots', s3 + 0.8, { y: 0 });
    appear(ctx, '.co-start', s3 + 1.0);
    // s4: the graph holds the canonical model.
    const s4 = cue('canonical', 's3');
    vanish(ctx, '.co-start', s4);
    tl.fromTo(q('.g-bands .band-rect'), { attr: { 'stroke-width': 1.8 } }, { attr: { 'stroke-width': 4.5 }, duration: 0.4, repeat: 1, yoyo: true, immediateRender: false }, s4 + 0.4);
    appear(ctx, '.co-canon', s4 + 0.4);
    // s5: read from the code and the data model.
    const s5 = cue('read', 's4');
    vanish(ctx, '.co-canon', s5);
    appear(ctx, '.source', s5 + 0.3, { y: 0 });
    tl.fromTo(q('.source .up'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.25, immediateRender: false }, s5 + 0.9);
    appear(ctx, '.co-read', s5 + 0.6);
    // s6: a language over the graph: one customer's onboarding mapping, checked by tests.
    const s6 = cue('language', 's5');
    vanish(ctx, '.co-read', s6);
    tl.to(q('.roots'), { autoAlpha: 0.3, duration: 0.4 }, s6 + 0.2);
    appear(ctx, '.lang', s6 + 0.3, { y: 0 });
    tl.fromTo(q('.lang .map'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, s6 + 1.2);
    [0, 1, 2, 3, 4].forEach((i) => tl.fromTo(q(`.tick-${i}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, s6 + 2.2 + i * 0.3));
    appear(ctx, '.co-onboard', s6 + 0.6);
    // s7: customers' own agents use the product in its domain's terms, governed by the graph.
    const s7 = cue('agents', 's6');
    vanish(ctx, '.co-onboard', s7);
    tl.set(q('.agents'), { autoAlpha: 1 }, s7 + 0.2);
    tl.fromTo(q('.agents > g:not(.key), .agents > text'), { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.6, immediateRender: false }, s7 + 0.2);
    tl.fromTo(q('.agents .key'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.3, immediateRender: false }, s7 + 1.2);
    appear(ctx, '.co-agents', s7 + 0.8);
    // s8: which a product needs.
    const s8 = cue('which', 's7');
    vanish(ctx, '.co-agents', s8);
    appear(ctx, '.which', s8 + 0.3, { y: 0 });
    // s9: where Dialect Engineering is set out.
    const s9 = cue('url', 's8');
    tl.fromTo(q('.de .url'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, s9 + 0.3);
  },
};
