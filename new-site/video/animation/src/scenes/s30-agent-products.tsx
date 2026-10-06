import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AgentIcon } from '../parts/Landscape';
import { Base, Mark } from '../parts/Act3';
import { GY, item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 30. Products that agents use. Customers' own agents reach a product through MCP servers; hundreds
// of tools leave the agent guessing; the graph holds the domain invariants; an interface for agents is
// built from the graph; the graph governs which agent may use which capability; a grammar above the graph
// lets an agent write and test what a customer needs: dialect engineering, at dialect-engineering.ai.
const K = 0.68, OX = 32, OY = 22; // the landscape, scaled into the left of the frame
const sx = (x: number) => K * x + OX, sy = (y: number) => K * y + OY;
const PANEL = { x: 1310, y: 110, w: 330, h: 380 };
const AGENTS = [190, 310, 430];
const AX = 1800;
const CAPS = ['capability', 'workflow', 'entity', 'contract', 'capability'];
const CO = { x: 150, y: 580, w: 640 };

export const scene30: SceneDef = {
  n: 30,
  id: 'products-agents-use',
  View: () => (
    <Frame act="Act 6" scene="Scene 30 · Products that agents use">
      <Svg>
        <g className="land" transform={`matrix(${K},0,0,${K},${OX},${OY})`}><Base /></g>
        <g className="pre boundary">
          <rect x={110} y={84} width={1150} height={470} rx={18} fill="none" stroke={C.text} strokeWidth={2} strokeDasharray="10 8" />
          <text x={130} y={540} fontFamily={F.mono} fontSize={15} letterSpacing={2} fill={C.text}>THE PRODUCT</text>
        </g>
        <g className="pre agents">
          {AGENTS.map((y, i) => <AgentIcon key={i} x={AX} y={y} s={42} />)}
          <text x={AX} y={500} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.text}>customers'</text>
          <text x={AX} y={522} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.text}>own agents</text>
        </g>
        <g className="pre mcp">
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={12} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
          <text x={PANEL.x + 16} y={PANEL.y - 12} fontFamily={F.mono} fontSize={15} fill={C.muted}>MCP server · hundreds of tools</text>
          {Array.from({ length: 60 }, (_, i) => <rect key={i} x={PANEL.x + 14 + (i % 6) * 52} y={PANEL.y + 14 + Math.floor(i / 6) * 36} width={44} height={26} rx={4} fill="none" stroke={C.muted} strokeWidth={1.2} />)}
        </g>
        <g className="pre lost">{AGENTS.map((y, i) => <text key={i} x={AX - 52} y={y + 10} textAnchor="end" fontFamily={F.display} fontSize={34} fontWeight={700} fill={C.warn}>?</text>)}</g>
        <g className="pre panel" data-target="next.agent-interfaces">
          <rect x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={12} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={2.5} />
          <text x={PANEL.x + 16} y={PANEL.y - 12} fontFamily={F.mono} fontSize={15} fill={C.layer.functional}>interface for agents</text>
          {CAPS.map((c, i) => (
            <g key={i} className={`cap cap-${i}`}>
              <rect x={PANEL.x + 20} y={PANEL.y + 22 + i * 70} width={PANEL.w - 40} height={52} rx={8} fill="none" stroke={C.layer.functional} strokeWidth={1.5} />
              <text x={PANEL.x + 36} y={PANEL.y + 54 + i * 70} fontFamily={F.sans} fontSize={18} fill={C.text}>{c}</text>
              <line x1={sx(item('functional', i).x)} y1={sy(item('functional', i).y)} x2={PANEL.x + 20} y2={PANEL.y + 48 + i * 70} stroke={C.layer.functional} strokeWidth={1.2} opacity={0.45} />
            </g>
          ))}
        </g>
        <g className="pre keys">
          {AGENTS.map((y, i) => (
            <g key={i}>
              <line x1={PANEL.x + PANEL.w} y1={y} x2={AX - 30} y2={y} stroke={i === 2 ? C.warn : C.pass} strokeWidth={2} strokeDasharray="5 5" />
              <Mark className="" x={1720} y={y} ok={i !== 2} />
            </g>
          ))}
        </g>
        <g className="pre grammar">
          <rect x={sx(150)} y={sy(196)} width={sx(1770) - sx(150)} height={sy(286) - sy(196)} rx={10} fill={C.canvasRaised} stroke={C.text} strokeWidth={2} />
          <text x={sx(150) + 16} y={sy(196) + 24} fontFamily={F.mono} fontSize={14} letterSpacing={2} fill={C.text}>GRAMMAR · ABOVE THE GRAPH</text>
          <g className="doc">
            <rect x={sx(150) + 360} y={sy(196) + 10} width={150} height={44} rx={5} fill="none" stroke={C.text} strokeWidth={1.5} />
            {[0, 1, 2].map((r) => <rect key={r} x={sx(150) + 372} y={sy(196) + 20 + r * 10} width={[110, 80, 120][r]} height={4} rx={2} fill={C.text} />)}
          </g>
          {[0, 1, 2, 3, 4].map((i) => <Mark key={i} className={`gtick gtick-${i}`} x={sx(150) + 560 + i * 36} y={sy(196) + 32} />)}
        </g>
        <g className="pre de">
          <text x={150} y={730} fontFamily={F.display} fontSize={64} fontWeight={700} fill={C.text}>Dialect engineering</text>
          <text className="url" x={150} y={790} fontFamily={F.mono} fontSize={30} fill={C.layer.functional}>dialect-engineering.ai</text>
        </g>
      </Svg>
      <Callout className="pre co co-agents" {...CO} kind="Customers' own agents" text="Reaching the product through MCP servers" tone={C.text} target="next.agent-interfaces" />
      <Callout className="pre co co-tools" {...CO} kind="Hundreds of tools" text="Which tools, in what order, under which rules?" tone={C.warn} target="next.agent-interfaces" />
      <Callout className="pre co co-inv" {...CO} kind="Domain invariants" text="Capabilities, workflows, entities and contracts every customer shares" tone={C.layer.functional} target="next.agent-interfaces" />
      <Callout className="pre co co-gov" {...CO} kind="Governed by the graph" text="Which external agent may use which capability" tone={C.text} target="next.agent-interfaces" />
      <Callout className="pre co co-gram" {...CO} kind="A formal grammar" text="Rules a schema cannot express; checked by running tests" tone={C.text} target="next.dialect-engineering" />
      <Callout className="pre co co-vary" x={1180} y={640} w={560} kind="Per customer" text="More of the product can vary; the domain invariants stay shared" tone={C.text} target="next.dialect-engineering" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: customers' own agents reach the product.
    const s1 = cue('agents', 's0');
    appear(ctx, '.boundary', s1 + 0.2, { y: 0 });
    tl.fromTo(q('.agents'), { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.8 }, s1 + 0.6);
    appear(ctx, '.co-agents', s1 + 0.8);
    // s2: hundreds of tools leave the agent guessing.
    const s2 = cue('tools', 's1');
    vanish(ctx, '.co-agents', s2);
    tl.set(q('.mcp'), { autoAlpha: 1 }, s2 + 0.2);
    tl.fromTo(q('.mcp rect'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, stagger: 0.02 }, s2 + 0.2);
    appear(ctx, '.lost', s2 + 1.8, { y: 0 });
    appear(ctx, '.co-tools', s2 + 1.6);
    // s3: the graph already records the domain invariants.
    const s3 = cue('invariants', 's2');
    vanish(ctx, '.co-tools', s3);
    tl.to(q('.land .top, .land .bottom, .land .gate-wrap'), { opacity: 0.25, duration: 0.4 }, s3 + 0.2);
    tl.fromTo(q('.land .band-rect'), { attr: { 'stroke-width': 1.8 } }, { attr: { 'stroke-width': 4 }, duration: 0.4, repeat: 1, yoyo: true }, s3 + 0.5);
    appear(ctx, '.co-inv', s3 + 0.4);
    // s4: an interface for agents, built from the graph.
    const s4 = cue('interface', 's3');
    vanish(ctx, '.co-inv, .mcp, .lost', s4);
    tl.set(q('.panel'), { autoAlpha: 1 }, s4 + 0.3);
    tl.fromTo(q('.panel > rect, .panel > text'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, s4 + 0.3);
    CAPS.forEach((_, i) => tl.fromTo(q(`.cap-${i}`), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, s4 + 0.6 + i * 0.3));
    // s5: which agent may use which capability.
    const s5 = cue('govern', 's4');
    appear(ctx, '.keys', s5 + 0.3, { y: 0 });
    appear(ctx, '.co-gov', s5 + 0.5);
    // s6: a grammar above the graph; the agent writes and tests.
    const s6 = cue('grammar', 's5');
    vanish(ctx, '.co-gov', s6);
    appear(ctx, '.grammar', s6 + 0.3, { y: 0 });
    tl.fromTo(q('.grammar .doc'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, s6 + 1.0);
    [0, 1, 2, 3, 4].forEach((i) => tl.fromTo(q(`.gtick-${i}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, s6 + 1.8 + i * 0.3));
    appear(ctx, '.co-gram', s6 + 0.6);
    // s7: dialect engineering.
    const s7 = cue('dialect', 's6');
    vanish(ctx, '.co-gram', s7);
    tl.set(q('.de'), { autoAlpha: 1 }, s7 + 0.3);
    tl.set(q('.de .url'), { autoAlpha: 0 }, s7 + 0.3);
    tl.fromTo(q('.de > text:first-child'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, s7 + 0.3);
    appear(ctx, '.co-vary', s7 + 0.9);
    // s8: where it is set out.
    const s8 = cue('url', 's7');
    tl.fromTo(q('.de .url'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, s8 + 0.3);
  },
};
