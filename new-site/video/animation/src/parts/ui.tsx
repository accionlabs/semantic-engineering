import React from 'react';
import { C, F, H, W } from '../theme';

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
export const Pill: React.FC<{ className?: string; x: number; y: number; text: string; colour: string; w?: number; fill?: string }> = ({ className, x, y, text, colour, w, fill }) => {
  const width = w ?? text.length * 9.6 + 30;
  return (
    <g className={className}>
      <rect x={x} y={y} width={width} height={34} rx={17} fill={fill ?? C.canvasRaised} stroke={colour} strokeWidth={1.8} />
      <text x={x + width / 2} y={y + 23} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={colour}>{text}</text>
    </g>
  );
};

export const Person: React.FC<{ className?: string; x: number; y: number; r?: number; colour?: string }> = ({ className, x, y, r = 16, colour = C.people }) => (
  <g className={className}>
    <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke={colour} strokeWidth={3} />
    <path d={`M${x - r} ${y + r * 1.9} q${r} ${-r * 1.9} ${2 * r} 0`} fill="none" stroke={colour} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const DocIcon: React.FC<{ className?: string; x: number; y: number; label: string; colour?: string; glyph?: string }> = ({ className, x, y, label, colour = C.card, glyph = '' }) => (
  <g className={className}>
    <path d={`M${x} ${y} h56 l18 18 v72 h-74 z`} fill={C.canvasRaised} stroke={colour} strokeWidth={2} />
    <text x={x + 37} y={y + 58} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={colour}>{glyph}</text>
    <text x={x + 37} y={y + 116} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>{label}</text>
  </g>
);

/** The knowledge graph of the domain primitives. Nodes carry class `${key}-node-<i>`. */
