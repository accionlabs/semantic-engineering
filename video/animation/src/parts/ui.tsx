import React from 'react';
import { C, F, H, W, tenantColour } from '../theme';

// Static parts. Each takes a className so the scene's timeline can find and move it.
// Anything that should start hidden carries the class "pre" (set to hidden at time 0 by the scene).

export const Frame: React.FC<{ act: string; scene: string; children: React.ReactNode }> = ({ act, scene, children }) => (
  <div style={{ position: 'absolute', inset: 0, background: C.canvas, fontFamily: F.sans, color: C.text, overflow: 'hidden' }}>
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
          <stop offset="60%" stopColor={C.canvas} stopOpacity={0} />
          <stop offset="100%" stopColor="#05080f" stopOpacity={0.8} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#vignette)" />
    </svg>
    {children}
    {act && (
      <div style={{ position: 'absolute', left: 64, top: 44, fontFamily: F.mono, fontSize: 16, letterSpacing: 2, color: C.muted, textTransform: 'uppercase' }}>
        {act} <span style={{ color: C.hairline }}>/</span> {scene}
      </div>
    )}
    <CaptionLayer />
  </div>
);

/** Where the narration shows as text until the voice is recorded. */
export const CaptionLayer: React.FC = () => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
    <div className="caption-box" style={{ maxWidth: 1500, padding: '12px 26px', borderRadius: 10, background: 'rgba(5,8,15,0.82)', border: `1px solid ${C.hairline}`, visibility: 'hidden' }}>
      <span className="caption-text" style={{ fontFamily: F.sans, fontWeight: 500, fontSize: 31, lineHeight: 1.3, color: C.text }} />
    </div>
  </div>
);

/** A full-frame SVG layer. */
export const Svg: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg className={className} width={W} height={H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>{children}</svg>
);

export const Heading: React.FC<{ className?: string; x: number; y: number; w?: number; size?: number; colour?: string; children: React.ReactNode; target?: string }> = ({ className, x, y, w, size = 42, colour = C.text, children, target }) => (
  <div className={className} data-target={target} style={{ position: 'absolute', left: x, top: y, width: w, fontFamily: F.display, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: colour, letterSpacing: -0.5 }}>{children}</div>
);

export const Body: React.FC<{ className?: string; x: number; y: number; w: number; size?: number; colour?: string; children: React.ReactNode }> = ({ className, x, y, w, size = 22, colour = C.muted, children }) => (
  <div className={className} style={{ position: 'absolute', left: x, top: y, width: w, fontSize: size, lineHeight: 1.4, color: colour }}>{children}</div>
);

export const FigureChip: React.FC<{ className?: string; x: number; y: number; w?: number; figure?: string; label: string; source: string; target: string; tag?: string }> = ({ className, x, y, w = 420, figure, label, source, target, tag }) => (
  <div className={className} data-target={target} style={{ position: 'absolute', left: x, top: y, width: w, background: C.canvasRaised, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: '18px 22px' }}>
    {tag && <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.5, color: C.warn, textTransform: 'uppercase', marginBottom: 6 }}>{tag}</div>}
    {figure && <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 54, lineHeight: 1, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>{figure}</div>}
    <div style={{ fontSize: 21, lineHeight: 1.3, fontWeight: 500 }}>{label}</div>
    <div style={{ fontFamily: F.mono, fontSize: 13.5, lineHeight: 1.4, color: C.muted, marginTop: 10 }}>{source}</div>
  </div>
);

/** A lens or statement attached by a leader line to the thing it describes. */
export const Callout: React.FC<{ className: string; x: number; y: number; w?: number; kind: string; text: string; tone?: string; anchor?: { x: number; y: number }; target: string }> = ({ className, x, y, w = 480, kind, text, tone = C.text, anchor, target }) => (
  <div className={className} data-target={target} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    {anchor && (
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={anchor.x} y1={anchor.y} x2={x} y2={y + 34} stroke={tone} strokeWidth={1.5} strokeDasharray="4 5" />
        <circle cx={anchor.x} cy={anchor.y} r={5} fill={tone} />
      </svg>
    )}
    <div style={{ position: 'absolute', left: x, top: y, width: w, background: C.canvasRaised, border: `1.5px solid ${tone}`, borderRadius: 12, padding: '14px 18px', pointerEvents: 'auto' }}>
      <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', color: tone }}>{kind}</div>
      <div style={{ fontSize: 25, fontWeight: 500, lineHeight: 1.25, marginTop: 4 }}>{text}</div>
    </div>
  </div>
);

/** A number the timeline can count up; tween its `.counter-value` innerText with snap. */
export const Counter: React.FC<{ className: string; x: number; y: number; start: number; label?: string }> = ({ className, x, y, start, label = 'tenants' }) => (
  <div className={className} data-target="counter.tenants" style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'baseline', gap: 12 }}>
    <span className="counter-value" style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44, fontVariantNumeric: 'tabular-nums' }}>{start}</span>
    <span style={{ fontFamily: F.sans, fontSize: 19, color: C.muted }}>{label} <span style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1 }}>ILLUSTRATIVE</span></span>
  </div>
);

export const LanguageCard: React.FC<{ className: string; x: number; y: number; w?: number; tenant: string; colour: string; lines: string[]; compact?: boolean; target: string; header?: string }> = ({ className, x, y, w = 460, tenant, colour, lines, compact, target, header }) => {
  // Line classes come from the last class name, so a card marked "pre card" does not hide its own lines.
  const lineKey = className.trim().split(/\s+/).pop();
  return (
  <div className={className} data-target={target} style={{ position: 'absolute', left: x, top: y, width: w, background: '#0a1a1a', border: `1.5px solid ${colour}`, borderRadius: 10, overflow: 'hidden' }}>
    <div style={{ background: colour, color: C.tenantText, fontFamily: F.mono, fontSize: compact ? 12 : 14, padding: compact ? '4px 12px' : '6px 14px', letterSpacing: 1 }}>{header ?? (compact ? tenant : `${tenant} · business rules`)}</div>
    <pre style={{ margin: 0, padding: compact ? '8px 12px' : '12px 16px', fontFamily: F.mono, fontSize: compact ? 13 : 17, lineHeight: 1.55, color: C.text, whiteSpace: 'pre' }}>
      {lines.map((l, i) => <div key={i} className={`${lineKey}-line ${lineKey}-line-${i}`} style={{ whiteSpace: 'pre' }}>{l || ' '}</div>)}
    </pre>
  </div>
  );
};

export const Pill: React.FC<{ className?: string; x: number; y: number; text: string; colour: string; w?: number; fill?: string }> = ({ className, x, y, text, colour, w, fill }) => {
  const width = w ?? text.length * 9.6 + 30;
  return (
    <g className={className}>
      <rect x={x} y={y} width={width} height={34} rx={17} fill={fill ?? C.canvasRaised} stroke={colour} strokeWidth={1.8} />
      <text x={x + width / 2} y={y + 23} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={colour}>{text}</text>
    </g>
  );
};

export const Person: React.FC<{ className?: string; x: number; y: number; r?: number; colour?: string }> = ({ className, x, y, r = 16, colour = C.tenant[3] }) => (
  <g className={className}>
    <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke={colour} strokeWidth={3} />
    <path d={`M${x - r} ${y + r * 1.9} q${r} ${-r * 1.9} ${2 * r} 0`} fill="none" stroke={colour} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const ScreenIcon: React.FC<{ className?: string; x: number; y: number; w: number; h: number; colour: string; variant?: number }> = ({ className, x, y, w, h, colour, variant = 0 }) => (
  <g className={className}>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={C.canvasRaised} stroke={colour} strokeWidth={2} />
    <rect x={x} y={y} width={w} height={h * 0.16} rx={6} fill={colour} opacity={0.8} />
    {variant === 0 ? (
      <>
        <rect x={x + w * 0.08} y={y + h * 0.28} width={w * 0.84} height={h * 0.12} rx={3} fill={C.hairline} />
        <rect x={x + w * 0.08} y={y + h * 0.48} width={w * 0.84} height={h * 0.12} rx={3} fill={C.hairline} />
        <rect x={x + w * 0.08} y={y + h * 0.68} width={w * 0.5} height={h * 0.12} rx={3} fill={C.hairline} />
      </>
    ) : (
      <>
        <rect x={x + w * 0.08} y={y + h * 0.28} width={w * 0.38} height={h * 0.52} rx={3} fill={colour} opacity={0.5} />
        <rect x={x + w * 0.54} y={y + h * 0.28} width={w * 0.38} height={h * 0.22} rx={3} fill={C.hairline} />
        <rect x={x + w * 0.54} y={y + h * 0.58} width={w * 0.38} height={h * 0.22} rx={3} fill={C.hairline} />
      </>
    )}
  </g>
);

export const DocIcon: React.FC<{ className?: string; x: number; y: number; label: string; colour?: string; glyph?: string }> = ({ className, x, y, label, colour = C.sharedEdge, glyph = '' }) => (
  <g className={className}>
    <path d={`M${x} ${y} h56 l18 18 v72 h-74 z`} fill={C.canvasRaised} stroke={colour} strokeWidth={2} />
    <text x={x + 37} y={y + 58} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={colour}>{glyph}</text>
    <text x={x + 37} y={y + 116} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>{label}</text>
  </g>
);

/** The knowledge graph of the domain primitives. Nodes carry class `${key}-node-<i>`. */
export const GRAPH_NODES = [
  { id: 'Employee', x: 150, y: 690 }, { id: 'Pay element', x: 390, y: 640 },
  { id: 'Statutory deduction', x: 330, y: 800 }, { id: 'Calculation', x: 120, y: 850 },
];
const EDGES = [[0, 1], [1, 2], [1, 3], [0, 3], [2, 3]];
export const Graph: React.FC<{ className: string; dx?: number; dy?: number; scale?: number }> = ({ className, dx = 0, dy = 0, scale = 1 }) => (
  <g className={className} transform={`translate(${dx} ${dy}) scale(${scale})`} data-target="graph.knowledge">
    {EDGES.map(([a, b], k) => <line key={k} className={`${className}-edge`} x1={GRAPH_NODES[a].x} y1={GRAPH_NODES[a].y} x2={GRAPH_NODES[b].x} y2={GRAPH_NODES[b].y} stroke={C.invariantEdge} strokeWidth={2} opacity={0.6} />)}
    {GRAPH_NODES.map((nd, i) => (
      <g key={nd.id} className={`${className}-node ${className}-node-${i}`}>
        <circle cx={nd.x} cy={nd.y} r={11} fill={C.canvas} stroke={C.invariantEdge} strokeWidth={3} />
        <text x={nd.x + 18} y={nd.y + 6} fontFamily={F.sans} fontSize={18} fill={C.text}>{nd.id}</text>
      </g>
    ))}
    <text x={80} y={600} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>KNOWLEDGE GRAPH</text>
  </g>
);

export { tenantColour };
