import React from 'react';
import type { Ctx } from '../engine/scene';
import { C, F, KINDS, Kind } from '../theme';
import { Person } from './ui';

// The landscape: one picture for Acts 1 to 3 (storyboard section 1.1). Four columns, one per kind of
// knowledge, in layer order. Top to bottom: the kind's label, its custodian, the document that holds
// that knowledge today, the band where the Manual Translation Tax is paid, and the flow of a change.
// Every piece carries a class so a scene's timeline can find it; scenes reuse the same geometry.

export const COL: Record<Kind, number> = { functional: 330, design: 750, architecture: 1170, code: 1590 };
export const Y = { label: 128, person: 214, name: 268, card: 306, cardH: 92, tax: 466, taxH: 64, flow: 704, stationH: 76 };
export const STATIONS = [
  { id: 'spec', label: 'Specification', x: COL.functional },
  { id: 'dev', label: 'Developer', x: COL.design },
  { id: 'review', label: 'Review', x: COL.architecture },
  { id: 'merge', label: 'Merge', x: COL.code },
] as const;
export const DEV = { x: COL.design, y: Y.flow - Y.stationH / 2 };

const CARDS: Record<Exclude<Kind, 'code'>, string> = { functional: 'Prose specs', design: 'Figma handoffs', architecture: 'Architecture wiki' };

export const KindLabels: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g>
    {KINDS.map((k) => (
      <g key={k.id} className={`${className} lbl lbl-${k.id}`} data-target={`knowledge.${k.id}`}>
        <text x={COL[k.id]} y={Y.label} textAnchor="middle" fontFamily={F.mono} fontSize={22} letterSpacing={4} fill={C.layer[k.id]}>{k.label.toUpperCase()}</text>
        <rect x={COL[k.id] - 120} y={Y.label + 14} width={240} height={3} rx={1.5} fill={C.layer[k.id]} />
      </g>
    ))}
  </g>
);

/** The engineering team is drawn as a cluster of three; each member holds a slice of the code. */
export const DEVS = [-56, 0, 56];

export const Custodians: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g>
    {KINDS.map((k) => (
      <g key={k.id} className={`${className} cus cus-${k.id}`} data-target={`custodian.${k.id}`}>
        {k.id === 'code' ? (
          DEVS.map((dx, i) => (
            <g key={i} className={`dev dev-${i}`}>
              <Person x={COL.code + dx} y={Y.person + 4} r={13} colour={C.people} />
              <rect className={`slice slice-${i}`} x={COL.code + dx - 9} y={Y.person - 34} width={18} height={10} rx={2} fill={C.layer.code} opacity={0} />
            </g>
          ))
        ) : (
          <Person x={COL[k.id]} y={Y.person} r={17} colour={C.people} />
        )}
        <text x={COL[k.id]} y={Y.name} textAnchor="middle" fontFamily={F.sans} fontSize={22} fontWeight={500} fill={C.text}>{k.custodian}</text>
      </g>
    ))}
  </g>
);

export const Cards: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g>
    {(Object.keys(CARDS) as (keyof typeof CARDS)[]).map((id) => (
      <g key={id} className={`${className} card card-${id}`} data-target={`artifact.${id}`}>
        <rect className="card-face" x={COL[id] - 110} y={Y.card} width={220} height={Y.cardH} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
        {[0, 1, 2].map((r) => <rect key={r} x={COL[id] - 86} y={Y.card + 22 + r * 14} width={r === 2 ? 90 : 150} height={6} rx={3} fill={C.card} />)}
        <text x={COL[id]} y={Y.card + Y.cardH - 12} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.cardText}>{CARDS[id]}</text>
      </g>
    ))}
    <g className={`${className} card card-code`} data-target="artifact.code">
      <rect x={COL.code - 110} y={Y.card} width={220} height={Y.cardH} rx={8} fill="none" stroke={C.card} strokeWidth={2} strokeDasharray="6 6" />
      <text x={COL.code} y={Y.card + 40} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.cardText}>Codebase knowledge</text>
      <text x={COL.code} y={Y.card + 66} textAnchor="middle" fontFamily={F.sans} fontSize={16} fill={C.muted}>in people's heads</text>
    </g>
  </g>
);

export const SprintFrame: React.FC<{ className?: string }> = ({ className = '' }) => (
  <g className={`${className} sprint`} data-target="sprint.conventional">
    <rect x={120} y={606} width={1680} height={176} rx={14} fill="none" stroke={C.hairline} strokeWidth={2} />
    <text x={146} y={766} fontFamily={F.mono} fontSize={16} letterSpacing={2.5} fill={C.muted}>CONVENTIONAL SCRUM SPRINT</text>
    {['Backlog', 'In progress', 'Review', 'Done'].map((t, i) => (
      <g key={t}>
        <rect x={1252 + i * 130} y={618} width={120} height={26} rx={5} fill={C.canvasRaised} stroke={C.hairline} />
        <text x={1312 + i * 130} y={636} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.muted}>{t}</text>
      </g>
    ))}
  </g>
);

export const Flow: React.FC<{ className?: string; agent?: boolean }> = ({ className = '', agent = false }) => (
  <g className={`${className} flow`}>
    {STATIONS.slice(0, -1).map((s, i) => (
      <line key={s.id} className={`link link-${i}`} x1={s.x + 120} y1={Y.flow} x2={STATIONS[i + 1].x - 128} y2={Y.flow} stroke={C.muted} strokeWidth={2} markerEnd="url(#arrow)" />
    ))}
    {STATIONS.map((s) => (
      <g key={s.id} className={`st st-${s.id}`} data-target={`flow.${s.id}`}>
        <rect x={s.x - 120} y={Y.flow - Y.stationH / 2} width={240} height={Y.stationH} rx={10} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
        <text x={agent && s.id === 'dev' ? s.x - 34 : s.x} y={Y.flow + 8} textAnchor="middle" fontFamily={F.sans} fontSize={23} fontWeight={500} fill={C.text}>{s.label}</text>
      </g>
    ))}
  </g>
);

/** The coding agent: a rounded square with two eyes, drawn distinct from the people. */
export const AgentIcon: React.FC<{ className?: string; x: number; y: number; s?: number }> = ({ className = '', x, y, s = 30 }) => (
  <g className={className} data-target="flow.coding-agent">
    <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.28} fill="none" stroke={C.text} strokeWidth={2.5} />
    <circle cx={x - s * 0.18} cy={y - s * 0.04} r={s * 0.07} fill={C.text} />
    <circle cx={x + s * 0.18} cy={y - s * 0.04} r={s * 0.07} fill={C.text} />
    <line x1={x} y1={y - s / 2} x2={x} y2={y - s / 2 - 7} stroke={C.text} strokeWidth={2} />
  </g>
);
/** Where the coding agent sits on the Developer station. */
export const AGENT = { x: COL.design + 78, y: Y.flow };

export const Defs: React.FC = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill={C.muted} />
    </marker>
    <marker id="arrow-tax" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill={C.tax} />
    </marker>
  </defs>
);

/** A dashed red translation arrow from a point to the developer. */
export const TaxArrow: React.FC<{ className: string; x: number; y: number; to?: { x: number; y: number } }> = ({ className, x, y, to = DEV }) => {
  const mx = (x + to.x) / 2, my = Math.min(y, to.y) + Math.abs(to.y - y) * 0.55;
  return <path className={className} d={`M${x} ${y} Q${mx} ${my} ${to.x} ${to.y - 6}`} fill="none" stroke={C.tax} strokeWidth={3} strokeDasharray="10 8" markerEnd="url(#arrow-tax)" />;
};

/** A knowledge token and three fragments, placed at a translation arrow's start. */
export const Token: React.FC<{ className: string; x: number; y: number; colour: string }> = ({ className, x, y, colour }) => (
  <g className={className}>
    <circle className="tok" cx={x} cy={y} r={11} fill={colour} />
    {[0, 1, 2].map((i) => <circle key={i} className={`frag frag-${i}`} cx={x} cy={y} r={4} fill={colour} opacity={0} />)}
  </g>
);

/**
 * Translate (storyboard 1.6): the token travels from (x, y) to the developer and arrives smaller;
 * fragments fall away on the way. Expressed as attribute tweens so seeking renders any frame.
 */
export const translate = (ctx: Ctx, sel: string, from: { x: number; y: number }, at: number, dur = 1.6, to = DEV) => {
  const { tl, q } = ctx;
  const tok = q(`${sel} .tok`);
  tl.set(q(sel), { autoAlpha: 1 }, at);
  tl.fromTo(tok, { attr: { cx: from.x, cy: from.y, r: 11 } }, { attr: { cx: to.x, cy: to.y - 4, r: 6 }, duration: dur, ease: 'power1.inOut' }, at);
  [0, 1, 2].forEach((i) => {
    const f = q(`${sel} .frag-${i}`);
    const t = at + dur * (0.25 + i * 0.22);
    const px = from.x + (to.x - from.x) * (0.25 + i * 0.22), py = from.y + (to.y - from.y) * (0.25 + i * 0.22);
    tl.set(f, { attr: { cx: px, cy: py }, opacity: 0.9 }, t);
    tl.to(f, { attr: { cx: px + (i - 1) * 18, cy: py + 70 }, opacity: 0, duration: 0.9, ease: 'power1.in' }, t);
  });
};
