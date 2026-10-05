import React, { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

export { gsap };
export type Q = (selector: string) => Element[];
export type Build = (tl: gsap.core.Timeline, q: Q) => void;

/**
 * Shared motion contract for every diagram. The markup is the final state. When the
 * diagram first scrolls into view, a paused timeline of from / fromTo tweens plays once
 * and arrives at that markup. Reduced motion skips the timeline entirely.
 */
export const useDiagramMotion = (build: Build) => {
  const ref = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;
    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.6 } });
      build(tl, gsap.utils.selector(el) as Q);
    }, el);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          tl?.play();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
    // The build function is fixed per diagram.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
};

/** The outer svg with title and desc wired for assistive technology. */
export const Figure: React.FC<{
  viewBox: string;
  title: string;
  desc: string;
  build: Build;
  children: React.ReactNode;
}> = ({ viewBox, title, desc, build, children }) => {
  const ref = useDiagramMotion(build);
  const id = useId().replace(/:/g, '');
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      width="100%"
      role="img"
      aria-labelledby={`${id}-t ${id}-d`}
      style={{ display: 'block', height: 'auto', overflow: 'visible' }}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {children}
    </svg>
  );
};

type Family = 'sans' | 'mono' | 'display';

/** Multi-line text, vertically centred on y. */
export const Label: React.FC<{
  x: number;
  y: number;
  lines: string[];
  size?: number;
  color?: string;
  family?: Family;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  leading?: number;
  spacing?: number;
  className?: string;
}> = ({ x, y, lines, size = 17, color = 'var(--fg)', family = 'sans', weight = 500, anchor = 'start', leading = 1.25, spacing, className }) => {
  const lh = size * leading;
  const first = y - ((lines.length - 1) * lh) / 2 + size * 0.35;
  return (
    <text
      className={className}
      x={x}
      y={first}
      textAnchor={anchor}
      style={{ fill: color, fontFamily: `var(--${family})`, fontSize: size, fontWeight: weight, letterSpacing: spacing }}
    >
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
};

/** Small uppercase tag in the mono face. */
export const Tag: React.FC<{ x: number; y: number; text: string; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number; className?: string }> = ({
  x,
  y,
  text,
  color = 'var(--muted)',
  anchor = 'start',
  size = 15,
  className,
}) => (
  <text
    className={className}
    x={x}
    y={y}
    textAnchor={anchor}
    style={{ fill: color, fontFamily: 'var(--mono)', fontSize: size, letterSpacing: 1.2, fontWeight: 500 }}
  >
    {text}
  </text>
);

export type Pt = [number, number];

/** Polyline with softly rounded corners. */
export const pathOf = (raw: Pt[], r = 10) => {
  const pts = raw.filter((p, i) => i === 0 || Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]) > 0.01);
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr, ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr, by = cy + ((ny - cy) / l2) * rr;
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L ${lx} ${ly}`;
};

/** Arrow: a line with an arrowhead at its end. The head is a separate element so it can arrive after the line draws. */
export const Arrow: React.FC<{
  pts: Pt[];
  color?: string;
  width?: number;
  dashed?: boolean;
  className?: string;
  head?: number;
}> = ({ pts, color = 'var(--muted)', width = 2, dashed, className, head = 9 }) => {
  const [ex, ey] = pts[pts.length - 1];
  const [sx, sy] = pts[pts.length - 2];
  const a = Math.atan2(ey - sy, ex - sx);
  const hx = ex - Math.cos(a) * head * 0.9, hy = ey - Math.sin(a) * head * 0.9;
  const trimmed: Pt[] = [...pts.slice(0, -1), [hx, hy]];
  const p1: Pt = [ex - Math.cos(a) * head * 1.3 + Math.cos(a + Math.PI / 2) * head * 0.62, ey - Math.sin(a) * head * 1.3 + Math.sin(a + Math.PI / 2) * head * 0.62];
  const p2: Pt = [ex - Math.cos(a) * head * 1.3 - Math.cos(a + Math.PI / 2) * head * 0.62, ey - Math.sin(a) * head * 1.3 - Math.sin(a + Math.PI / 2) * head * 0.62];
  return (
    <g className={className}>
      <path
        className="arrow-line"
        d={pathOf(trimmed)}
        style={{ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round', strokeDasharray: dashed ? '6 6' : undefined }}
      />
      <path className="arrow-head" d={`M ${ex} ${ey} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} style={{ fill: color }} />
    </g>
  );
};

/** Draws an arrow built with <Arrow>: the line draws, then the head appears. */
export const drawArrow = (tl: gsap.core.Timeline, q: Q, sel: string, at: gsap.Position, duration = 0.5) => {
  tl.from(q(`${sel} .arrow-line`), { drawSVG: '0%', duration, ease: 'power1.inOut' }, at);
  tl.from(q(`${sel} .arrow-head`), { opacity: 0, duration: 0.15, ease: 'none' }, '>-0.05');
};

/** Fades and lifts a group into place. */
export const rise = (tl: gsap.core.Timeline, q: Q, sel: string, at: gsap.Position, y = 14, duration = 0.5) => {
  tl.from(q(sel), { opacity: 0, y, duration, ease: 'power2.out' }, at);
};

/** A rounded card with a filled body. Styles use only theme variables. */
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
  r?: number;
  className?: string;
}> = ({ x, y, w, h, fill = 'var(--surface)', stroke = 'var(--hairline)', strokeWidth = 1.5, dashed, r = 8, className }) => (
  <rect
    className={className}
    x={x}
    y={y}
    width={w}
    height={h}
    rx={r}
    style={{ fill, stroke, strokeWidth, strokeDasharray: dashed ? '7 6' : undefined }}
  />
);

/** A decision diamond. */
export const Diamond: React.FC<{ cx: number; cy: number; w: number; h: number; className?: string; stroke?: string }> = ({ cx, cy, w, h, className, stroke = 'var(--invariant)' }) => (
  <path
    className={className}
    d={`M ${cx} ${cy - h / 2} L ${cx + w / 2} ${cy} L ${cx} ${cy + h / 2} L ${cx - w / 2} ${cy} Z`}
    style={{ fill: 'var(--raised)', stroke, strokeWidth: 2, strokeLinejoin: 'round' }}
  />
);

/** A small dot that rides along an arrow's line, then fades. Hidden in the final state. */
export const Dot: React.FC<{ className: string; color?: string; r?: number }> = ({ className, color = 'var(--tenant)', r = 7 }) => (
  <circle className={className} cx={0} cy={0} r={r} opacity={0} style={{ fill: color, stroke: 'var(--surface)', strokeWidth: 2 }} />
);

export const travel = (tl: gsap.core.Timeline, q: Q, dotSel: string, arrowSel: string, at: gsap.Position, duration = 0.6) => {
  const path = q(`${arrowSel} .arrow-line`)[0];
  const dot = q(dotSel);
  if (!path || !dot.length) return;
  tl.fromTo(dot, { opacity: 1 }, {
    opacity: 1,
    duration,
    ease: 'power1.inOut',
    immediateRender: false,
    motionPath: { path: path as SVGPathElement, align: path as SVGPathElement, alignOrigin: [0.5, 0.5] },
  }, at);
  tl.to(dot, { opacity: 0, duration: 0.2 }, '>');
};
