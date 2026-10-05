import React from 'react';
import { AgentIcon } from './Landscape';
import { C, F } from '../theme';

// The modernization pipeline (storyboard section 1.3), used through Act 4. Three columns: the
// Source-state graph of the old system, the specification with a decision on every module, and the
// Target-state graph of the new system. The parity bar runs beneath them with the four validation gates.
// Below the bar is a free strip (LOW_Y) for modes, stages, extraction cards and callouts.
export const COLS = { source: { x: 150, w: 460 }, spec: { x: 730, w: 460 }, target: { x: 1310, w: 460 } };
export const P = { y0: 180, y1: 610 };
export const BAR = { x: 150, w: 1620, y: 650, h: 64 };
export const LOW_Y = 770;
export const AGENT_X = 330;
export const GATES = [
  { id: 'architecture', label: 'Architecture', x: 880 },
  { id: 'design', label: 'Design', x: 1080 },
  { id: 'standards', label: 'Standards', x: 1280 },
  { id: 'functional', label: 'Functional', x: 1480 },
];
export const EXIT_X = 1680;

/** Source-state ontology: five tiers of the old system. */
export const SRC_TIERS = ['File', 'Class', 'Function', 'Statement', 'API'];
const SRC_N = [2, 3, 4, 5, 3];
export const srcY = (t: number) => 252 + t * 76;
export const srcNode = (t: number, j: number) => {
  const n = SRC_N[t], x0 = 300, x1 = 580;
  return { x: n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * j) / (n - 1), y: srcY(t) };
};

/** Specification rows: one module each, with its decision. */
export const SPEC_ROWS: { name: string; tag: string | null }[] = [
  { name: 'card-holder-ID validation', tag: 'Retain' },
  { name: 'module 2', tag: 'Modify' },
  { name: 'duplicate check', tag: 'Replace' },
  { name: 'statement printing', tag: 'Retire' },
  { name: 'module 5', tag: null },
];
export const rowY = (i: number) => 236 + i * 72;
export const ROW = { x: 750, w: 420, h: 54 };

/** Target-state ontology: four bands from the target blueprint. */
export const TGT: { label: string; hue: string }[] = [
  { label: 'Architecture', hue: C.layer.architecture },
  { label: 'Language and runtime', hue: C.layer.architecture },
  { label: 'Coding and security standards', hue: C.layer.architecture },
  { label: 'Design system', hue: C.layer.design },
];
export const tgtY = (i: number) => 236 + i * 88;
export const TGT_H = 68;

export const STAGES = [
  { label: 'Discover', pillar: 'AGIE' },
  { label: 'Document', pillar: 'ASF' },
  { label: 'Migrate', pillar: 'AMM' },
  { label: 'Validate', pillar: 'AVF' },
  { label: 'Maintain', pillar: 'Maintain' },
];
export const stageX = (i: number) => 270 + i * 345;

export type Part = 'frame' | 'source' | 'spec' | 'tags' | 'target' | 'bar' | 'gates' | 'stages' | 'pillars';

const Column: React.FC<{ x: number; w: number; title: string; hue: string }> = ({ x, w, title, hue }) => (
  <g>
    <rect className="col-rect" x={x} y={P.y0} width={w} height={P.y1 - P.y0} rx={14} fill="rgba(20,27,45,0.55)" stroke={C.hairline} strokeWidth={1.5} />
    <text x={x + 20} y={P.y0 + 32} fontFamily={F.mono} fontSize={15} letterSpacing={2} fill={hue}>{title.toUpperCase()}</text>
  </g>
);

export const Pipeline: React.FC<{ show?: Part[] }> = ({ show = [] }) => {
  const cls = (p: Part, extra = '') => `pp pp-${p} ${extra} ${show.includes(p) ? '' : 'pre'}`;
  return (
    <g>
      <g className={cls('frame')}>
        <g className="col col-source"><Column {...COLS.source} title="Source-state graph" hue={C.layer.code} /></g>
        <g className="col col-spec"><Column {...COLS.spec} title="Specification" hue={C.cardText} /></g>
        <g className="col col-target"><Column {...COLS.target} title="Target-state graph" hue={C.layer.architecture} /></g>
      </g>
      <g className={cls('source')} data-target="graph.source-state">
        {SRC_TIERS.map((t, i) => (
          <g key={t} className={`src-tier src-tier-${i}`}>
            <text x={COLS.source.x + 20} y={srcY(i) + 5} fontFamily={F.mono} fontSize={14} fill={C.muted}>{t}</text>
            {i < SRC_TIERS.length - 1 && Array.from({ length: SRC_N[i + 1] }, (_, j) => {
              const a = srcNode(i, Math.min(SRC_N[i] - 1, Math.floor((j * SRC_N[i]) / SRC_N[i + 1]))), b = srcNode(i + 1, j);
              return <line key={j} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.layer.code} strokeWidth={1.2} opacity={0.45} />;
            })}
            {Array.from({ length: SRC_N[i] }, (_, j) => <circle key={j} className={`src-node src-${i}-${j}`} cx={srcNode(i, j).x} cy={srcNode(i, j).y} r={7} fill={C.layer.code} />)}
          </g>
        ))}
      </g>
      <g className={cls('spec')} data-target="spec.format">
        {SPEC_ROWS.map((r, i) => (
          <g key={i} className={`spec-row spec-row-${i}`}>
            <rect x={ROW.x} y={rowY(i)} width={ROW.w} height={ROW.h} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={1.8} />
            <text x={ROW.x + 16} y={rowY(i) + 33} fontFamily={F.sans} fontSize={18} fill={C.text}>{r.name}</text>
          </g>
        ))}
      </g>
      <g className={cls('tags')}>
        {SPEC_ROWS.map((r, i) => r.tag && (
          <g key={i} className={`tag tag-${i}`}>
            <rect x={ROW.x + ROW.w - 104} y={rowY(i) + 12} width={90} height={30} rx={15} fill={r.tag === 'Retire' ? 'none' : C.text} stroke={C.text} strokeWidth={1.5} />
            <text x={ROW.x + ROW.w - 59} y={rowY(i) + 33} textAnchor="middle" fontFamily={F.mono} fontSize={15} fontWeight={600} fill={r.tag === 'Retire' ? C.text : C.canvas}>{r.tag}</text>
          </g>
        ))}
      </g>
      <g className={cls('target')} data-target="graph.target-state">
        {TGT.map((b, i) => (
          <g key={b.label} className={`tgt-band tgt-band-${i}`}>
            <rect x={COLS.target.x + 20} y={tgtY(i)} width={COLS.target.w - 40} height={TGT_H} rx={10} fill={C.canvasRaised} stroke={b.hue} strokeWidth={1.8} />
            <text x={COLS.target.x + 36} y={tgtY(i) + 26} fontFamily={F.mono} fontSize={13} letterSpacing={1} fill={b.hue}>{b.label.toUpperCase()}</text>
            {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={COLS.target.x + 70 + j * 78} cy={tgtY(i) + 48} r={6} fill={b.hue} />)}
            <line x1={COLS.target.x + 70} y1={tgtY(i) + 48} x2={COLS.target.x + 382} y2={tgtY(i) + 48} stroke={b.hue} strokeWidth={1.2} opacity={0.5} />
          </g>
        ))}
      </g>
      <g className={cls('bar')} data-target="contract.parity">
        <rect className="bar-rect" x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={12} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
        <text x={BAR.x + 20} y={BAR.y - 10} fontFamily={F.mono} fontSize={14} letterSpacing={2} fill={C.text}>PARITY CONTRACT</text>
        <AgentIcon x={AGENT_X} y={BAR.y + BAR.h / 2} s={32} />
        <text x={AGENT_X + 28} y={BAR.y + BAR.h / 2 + 6} fontFamily={F.mono} fontSize={14} fill={C.muted}>migration agents</text>
      </g>
      <g className={cls('gates')}>
        {GATES.map((g, i) => (
          <g key={g.id} className={`pgate pgate-${i}`} data-target={`gate.${g.id}`}>
            <rect x={g.x - 7} y={BAR.y - 8} width={14} height={BAR.h + 16} rx={4} fill={C.text} />
            <text x={g.x} y={BAR.y + BAR.h + 30} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>{g.label}</text>
          </g>
        ))}
      </g>
      <g className={cls('stages')}>
        {STAGES.map((s, i) => (
          <g key={s.label} className={`stage stage-${i}`} data-target={`stage.${s.label.toLowerCase()}`}>
            <rect x={stageX(i) - 140} y={106} width={280} height={34} rx={17} fill={C.canvasRaised} stroke={C.muted} />
            <text x={stageX(i)} y={129} textAnchor="middle" fontFamily={F.sans} fontSize={18} fontWeight={600} fill={C.text}>{s.label}</text>
          </g>
        ))}
      </g>
      <g className={cls('pillars')}>
        {STAGES.map((s, i) => <text key={s.label} className={`pillar pillar-${i}`} x={stageX(i)} y={162} textAnchor="middle" fontFamily={F.mono} fontSize={15} letterSpacing={1.5} fill={C.warn}>{s.pillar}</text>)}
      </g>
    </g>
  );
};

/** A module token, with a small tick mark that can be shown when it passes. */
export const Tick: React.FC<{ className: string; x: number; y: number; ok?: boolean }> = ({ className, x, y, ok = true }) => (
  <g className={className}>
    <circle cx={x} cy={y} r={12} fill={ok ? C.pass : C.warn} />
    {ok ? <path d={`M${x - 6} ${y} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /> : <path d={`M${x - 5} ${y - 5} l10 10 M${x + 5} ${y - 5} l-10 10`} stroke={C.canvas} strokeWidth={3} />}
  </g>
);
