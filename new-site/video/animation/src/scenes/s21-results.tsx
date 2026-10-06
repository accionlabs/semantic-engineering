import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear } from '../engine/scene';
import { Base } from '../parts/Act3';
import { FigureChip, Frame, Heading, Svg } from '../parts/ui';

// Scene 21. What results have teams seen? Each figure with its context, as the home page states it;
// the delivery metrics of one multi-product engagement first; the cost figure is marked as modeled.
const CHIPS = [
  { t: 'fig.deploys-36', f: '19 → 36', l: 'deployments a month across three products, over a 14-week pilot', s: 'engagement result, measured' },
  { t: 'fig.lead-time', f: '1.42 days', l: 'lead time for changes, down from 2.0 days, on the same engagement', s: 'engagement result, measured' },
  { t: 'fig.extraction', f: '2 to 3 weeks', l: 'to extract the graph of a codebase of more than two million lines', s: 'engagement result' },
  { t: 'fig.impact-replaces-investigation', f: '3 to 5 days', l: 'of senior-engineer investigation replaced by impact analysis, on one brownfield application', s: 'engagement result' },
  { t: 'fig.reuse-53', f: '53%', l: 'design component reuse in the first sprint of a new user-interface workstream', s: 'engagement result' },
  { t: 'fig.defects-23', f: '23%', l: 'fewer defects, same team, same codebase, before and after', s: 'engagement result' },
  { t: 'fig.coverage-93', f: '93.4%', l: 'test coverage, with scenarios generated from the functional layer', s: 'engagement result' },
  { t: 'fig.tco-81', f: '81%', l: 'lower five-year cost with the AI run on the client’s own infrastructure', s: 'a cost model; not measured on an engagement', tag: 'modeled' },
];

export const scene21: SceneDef = {
  n: 21,
  id: 'results',
  View: () => (
    <Frame act="Act 3" scene="Scene 21 · What results have teams seen?">
      <Svg><g className="land"><Base /></g></Svg>
      <Heading className="pre title" x={150} y={110} size={44}>Results, each with its context</Heading>
      {CHIPS.map((c, i) => (
        <FigureChip key={i} className={`pre chip chip-${i}`} x={150 + (i % 4) * 410} y={200 + Math.floor(i / 4) * 330} w={346} figure={c.f} label={c.l} source={c.s} tag={c.tag} target={c.t} />
      ))}
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.land'), { opacity: 0.08 }, 0);
    appear(ctx, '.title', cue('title', 's0') + 0.2);
    CHIPS.forEach((_, i) => appear(ctx, `.chip-${i}`, cue(`chip-${i}`, `s${i + 1}`) + 0.2));
  },
};
