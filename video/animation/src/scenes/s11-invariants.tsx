import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { FigureChip, Frame, Graph, Heading, Svg } from '../parts/ui';
import { BANDS, C, F } from '../theme';

// Scene 11. The deeper the layer, the fewer customers change it. The domain primitives become the
// domain invariants, and the knowledge graph that records them rises beside the stack.
const SX = 600, SY = 250, SW = 920;
const stack = makeStack({ key: 'st', x: SX, y: SY, width: SW, tenants: 8, lineAt: 6, heat: true, lineLabel: false });
const HEAT = [0.06, 0.06, 0.12, 0.1, 0.42, 0.68, 1];
const INV_Y = stack.bandTop(3) + 35;
const LINK = `M 522 640 C 560 640, 560 ${INV_Y}, ${SX - 10} ${INV_Y}`;

export const scene11: SceneDef = {
  n: 11,
  id: 'invariants',
  View: () => (
    <Frame act="Act 3" scene="Scene 11 · The domain invariants">
      <Svg>
        <stack.View />
        <text className="pre heat-head" x={SX + SW + 24} y={SY - 16} fontFamily={F.mono} fontSize={14} fill={C.warn} letterSpacing={1.2}>CUSTOMERS WHO CHANGE IT</text>
        <text className="pre core" x={stack.colX + stack.colW / 2} y={INV_Y + 7} textAnchor="middle" fontFamily={F.mono} fontSize={18} letterSpacing={2} fill={C.invariantEdge}>CORE VALUE</text>
        <g className="pre kg-wrap">
          <path className="kg-link" d={LINK} fill="none" stroke={C.invariantEdge} strokeWidth={2} strokeDasharray="5 6" opacity={0.7} />
          <Graph className="kg" />
        </g>
      </Svg>
      <Heading className="head-0" x={SX} y={120} size={42}>The deeper the layer, the fewer customers change it</Heading>
      <Heading className="pre head-1" x={SX} y={120} size={42} colour={C.invariantEdge}>The domain invariants</Heading>
      <FigureChip className="pre fig-panorama" x={64} y={170} w={470} target="fig.panorama-2015" figure="7%"
        label="of organisations customised nothing in their ERP; 12% went to extreme or complete customisation"
        source="Panorama Consulting, 2015 ERP Report, 562 respondents. ERP in general, not SaaS only, not by layer" />
      <FigureChip className="pre fig-mckinsey" x={64} y={170} w={470} target="fig.mckinsey"
        label="Faster development “will mean competitors and upstarts can rapidly replicate offerings at a lower cost”" source="McKinsey, 2024" />
      <FigureChip className="pre fig-bain" x={64} y={390} w={470} target="fig.bain"
        label="Proprietary data, domain-specific content and deep domain knowledge named among the defences that hold" source="Bain, 2025" />
      <div className="pre link" data-target="link.semantic-engineering" style={{ position: 'absolute', left: 80, top: 884, fontFamily: F.mono, fontSize: 18, color: C.invariantEdge }}>
        semantic-engineering.ai
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const band = (i: number) => q(`.st-band-${i}`);

    // Heat: one bar per band, growing from the top of the stack down.
    const heat = cue('heat', 's1');
    appear(ctx, '.heat-head', heat);
    stack.heat(ctx, HEAT, heat + 0.3, 0.45);
    appear(ctx, '.fig-panorama', cue('panorama', 's2+0.4'));

    // The domain primitives band brightens, gains its bright edge and is renamed.
    const inv = cue('primitives', 's4');
    tl.to(q('.fig-panorama'), { opacity: 0.3, duration: 0.5 }, inv);
    BANDS.forEach((_, i) => { if (i !== 3) tl.to(band(i), { opacity: 0.3, duration: 0.5 }, inv); });
    stack.glow(ctx, true, inv + 0.4);
    const name = cue('name', 's5');
    stack.relabel(ctx, 3, 'Domain invariants', name);
    vanish(ctx, '.head-0', name);
    appear(ctx, '.head-1', name + 0.3);

    // Why they matter: correctness and revenue sit here; the quotes on defensible value.
    const value = cue('value', 's6');
    vanish(ctx, '.fig-panorama', value - 0.3);
    appear(ctx, '.fig-mckinsey', value + 0.4);
    appear(ctx, '.fig-bain', cue('core', 's7') + 0.3);
    appear(ctx, '.core', cue('core', 's7'), { y: 0 });

    // A layer that holds the invariants, with everything that varies on top of it.
    const layer = cue('layer', 's8');
    vanish(ctx, '.fig-mckinsey, .fig-bain', layer);
    BANDS.forEach((_, i) => { if (i > 3) tl.to(band(i), { opacity: 1, duration: 0.6 }, layer + 2.5); });

    // The knowledge graph that already records them rises beside the stack and stays.
    const graph = cue('graph', 's9');
    BANDS.forEach((_, i) => { if (i > 3) tl.to(band(i), { opacity: 0.3, duration: 0.6 }, graph); });
    tl.fromTo(q('.kg-wrap'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1 }, graph);
    tl.fromTo(q('.kg-link'), { opacity: 0 }, { opacity: 0.7, duration: 0.8 }, graph + 1);
    appear(ctx, '.link', cue('link', 's10'));
  },
};
