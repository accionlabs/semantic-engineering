import React from 'react';
import { AGENT, AgentIcon, COL, Custodians, Defs, Flow, Head, KindLabels, STATIONS, Y } from './Landscape';
import { Bands, GY, Ties } from './Graph';
import { Person } from './ui';
import { C, F } from '../theme';
import { GATE_X, Gate } from '../scenes/s05-principles';

// Shared picture for Act 3: the custodians, the four-layer graph, the flow with the coding agent and the
// gate. Act 3 adds a strip below the flow (LOWER) for lanes, boards and ladders, and the band between
// the graph and the flow (GAP) for callouts.
export const LOWER = { y: 800, h: 150 };
export const GAP_Y = 568;

export const Base: React.FC<{ named?: boolean; gate?: boolean }> = ({ named = false, gate = true }) => (
  <g>
    <Defs />
    <g className="top"><KindLabels /><Custodians /></g>
    <Bands className="g" named={named} />
    <Ties />
    <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
    {gate && <Gate className="gate-wrap" />}
  </g>
);

/** A small card, used for specifications, tickets and reports. */
export const Card: React.FC<{ className: string; x: number; y: number; w?: number; h?: number; label?: string; tone?: string; lines?: number }> = ({ className, x, y, w = 150, h = 40, label, tone = C.card, lines = 0 }) => (
  <g className={className}>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={C.canvasRaised} stroke={tone} strokeWidth={1.8} />
    {Array.from({ length: lines }, (_, r) => <rect key={r} x={x + 12} y={y + 10 + r * 10} width={(w - 24) * (r === lines - 1 ? 0.6 : 1)} height={4} rx={2} fill={tone} />)}
    {label && <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>{label}</text>}
  </g>
);

/** A tick or a stop mark. */
export const Mark: React.FC<{ className: string; x: number; y: number; ok?: boolean }> = ({ className, x, y, ok = true }) => (
  <g className={className}>
    <circle cx={x} cy={y} r={12} fill={ok ? C.pass : C.warn} />
    {ok ? <path d={`M${x - 6} ${y} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /> : <path d={`M${x - 5} ${y - 5} l10 10 M${x + 5} ${y - 5} l-10 10`} stroke={C.canvas} strokeWidth={3} />}
  </g>
);

/** A second flow, below the first: the spec sprint lane. */
export const SPEC_STATIONS = [
  { id: 'requests', label: 'Requests', x: COL.functional - 120 },
  { id: 'draft', label: 'Draft spec', x: COL.design - 120 },
  { id: 'impact', label: 'Impact analysis', x: COL.architecture - 120 },
  { id: 'review', label: 'Custodian review', x: COL.code - 120 },
];
export const SpecLane: React.FC<{ className: string }> = ({ className }) => (
  <g className={className}>
    <text x={150} y={LOWER.y + 6} fontFamily={F.mono} fontSize={15} letterSpacing={2} fill={C.layer.functional}>SPEC SPRINT · A STEP AHEAD</text>
    {SPEC_STATIONS.map((s, i) => (
      <g key={s.id} className={`ss ss-${s.id}`}>
        <rect x={s.x - 100} y={LOWER.y + 22} width={200} height={50} rx={9} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={1.5} />
        <text x={s.x} y={LOWER.y + 53} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.text}>{s.label}</text>
        {i < 3 && <><line x1={s.x + 100} y1={LOWER.y + 47} x2={SPEC_STATIONS[i + 1].x - 110} y2={LOWER.y + 47} stroke={C.muted} strokeWidth={2} /><Head x={SPEC_STATIONS[i + 1].x - 102} y={LOWER.y + 47} from={{ x: s.x, y: LOWER.y + 47 }} colour={C.muted} /></>}
      </g>
    ))}
  </g>
);

/** Small agent icons at the three agent stations of Act 3, with an owner above each. */
export const AGENT_SPOTS = [
  { id: 'impact', label: 'Impact Analysis', x: STATIONS[0].x + 150 },
  { id: 'coding', label: 'Coding agent', x: AGENT.x },
  { id: 'pr', label: 'PR Validation', x: GATE_X },
];
export const Owners: React.FC<{ className: string }> = ({ className }) => (
  <g className={className}>
    {AGENT_SPOTS.map((a) => (
      <g key={a.id} className={`owner owner-${a.id}`}>
        <Person x={a.x} y={GAP_Y + 22} r={11} colour={C.people} />
        <line x1={a.x} y1={GAP_Y + 48} x2={a.x} y2={Y.flow - 44} stroke={C.text} strokeWidth={1.5} strokeDasharray="3 4" />
        <text x={a.x + 18} y={GAP_Y + 30} fontFamily={F.mono} fontSize={12} fill={C.muted}>owner</text>
      </g>
    ))}
  </g>
);

export { GY, GATE_X };
