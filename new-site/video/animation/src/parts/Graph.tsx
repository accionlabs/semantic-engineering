import React from 'react';
import { C, F, KINDS, Kind } from '../theme';
import { COL, Y } from './Landscape';

// The knowledge graph (storyboard section 1.2): four horizontal layers in layer order, each a band of
// items and the links between them, with links across layers and a tie up to each layer's custodian.
// It sits where the four documents were, between the custodians and the flow.

export const GX = { x0: 160, x1: 1760 };
export const GY: Record<Kind, number> = { functional: 296, design: 362, architecture: 428, code: 494 };
export const BAND_H = 54;
export const GRAPH_BOTTOM = GY.code + BAND_H;

/** Five named items per layer, in the order they appear left to right. */
export const ITEMS: Record<Kind, string[]> = {
  functional: ['persona', 'outcome', 'scenario', 'step', 'action'],
  design: ['building block', 'template', 'user flow', 'screen', 'component'],
  architecture: ['boundary', 'dependency', 'data store', 'integration', 'service'],
  code: ['module', 'class', 'endpoint', 'schema', 'function'],
};
const BASE: Record<Kind, number> = { functional: 330, design: 370, architecture: 410, code: 450 };
/** Position of named item i of a layer. */
export const item = (k: Kind, i: number) => ({ x: BASE[k] + i * 220, y: GY[k] + 19 });
/** Smaller, unnamed items that fill out each layer. */
const EXTRA = [1440, 1530, 1620, 1700];
export const extra = (k: Kind, i: number) => ({ x: EXTRA[i] + (k === 'design' || k === 'code' ? 30 : 0), y: GY[k] + 27 });

const ORDER = KINDS.map((k) => k.id);
/** Links between layers: [from layer, item, to layer, item]. */
const CROSS: [Kind, number, Kind, number][] = [
  ['functional', 0, 'design', 0], ['functional', 1, 'design', 2], ['functional', 2, 'design', 3], ['functional', 4, 'design', 4],
  ['design', 1, 'architecture', 1], ['design', 3, 'architecture', 2], ['design', 4, 'architecture', 4],
  ['architecture', 0, 'code', 0], ['architecture', 2, 'code', 3], ['architecture', 3, 'code', 2], ['architecture', 4, 'code', 4],
];
/** The path one search follows: from a user action down to the code function behind it. */
export const TRAVERSE: [Kind, number][] = [['functional', 4], ['design', 4], ['architecture', 4], ['code', 4]];

export const Bands: React.FC<{ className?: string; named?: boolean }> = ({ className = '', named = true }) => (
  <g>
    {CROSS.map(([a, i, b, j], n) => {
      const p = item(a, i), q = item(b, j);
      return <line key={n} className={`${className} xlink`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.muted} strokeWidth={1.2} opacity={0.55} />;
    })}
    {ORDER.map((k) => (
      <g key={k} className={`${className} band band-${k}`} data-target={`graph.layer.${k}`}>
        <rect className="band-rect" x={GX.x0} y={GY[k]} width={GX.x1 - GX.x0} height={BAND_H} rx={10} fill={C.canvasRaised} stroke={C.layer[k]} strokeWidth={1.8} />
        <text className="band-label" x={GX.x0 + 14} y={GY[k] + 32} fontFamily={F.mono} fontSize={13} letterSpacing={1.5} fill={C.layer[k]}>{k.toUpperCase()}</text>
        {[0, 1, 2, 3].map((i) => <line key={i} x1={item(k, i).x} y1={item(k, i).y} x2={item(k, i + 1).x} y2={item(k, i + 1).y} stroke={C.layer[k]} strokeWidth={1.2} opacity={0.5} />)}
        <line x1={item(k, 4).x} y1={item(k, 4).y} x2={extra(k, 0).x} y2={extra(k, 0).y} stroke={C.layer[k]} strokeWidth={1.2} opacity={0.5} />
        {[0, 1, 2].map((i) => <line key={`e${i}`} x1={extra(k, i).x} y1={extra(k, i).y} x2={extra(k, i + 1).x} y2={extra(k, i + 1).y} stroke={C.layer[k]} strokeWidth={1.2} opacity={0.5} />)}
        {ITEMS[k].map((name, i) => (
          <g key={name} className={`node node-${k}-${i}`}>
            <circle cx={item(k, i).x} cy={item(k, i).y} r={7} fill={C.layer[k]} />
            {named && <text className="nlabel" x={item(k, i).x} y={item(k, i).y + 24} textAnchor="middle" fontFamily={F.sans} fontSize={14} fill={C.cardText}>{name}</text>}
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => <circle key={`x${i}`} className={`node xnode xnode-${k}-${i}`} cx={extra(k, i).x} cy={extra(k, i).y} r={5} fill={C.layer[k]} opacity={0.7} />)}
      </g>
    ))}
  </g>
);

/** A tie from each custodian down to the layer it owns. */
export const Ties: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g>
    {ORDER.map((k) => (
      <g key={k} className={`${className} tie tie-${k}`}>
        <line x1={COL[k]} y1={Y.name + 8} x2={COL[k]} y2={GY[k]} stroke={C.layer[k]} strokeWidth={2} strokeDasharray="3 4" />
        <circle cx={COL[k]} cy={GY[k]} r={4} fill={C.layer[k]} />
      </g>
    ))}
  </g>
);

/** The search path through the layers, drawn as one polyline that a timeline can reveal. */
export const traversePoints = () => TRAVERSE.map(([k, i]) => item(k, i));
export const TraversePath: React.FC<{ className: string }> = ({ className }) => (
  <polyline className={className} points={traversePoints().map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke={C.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
);
