import React from 'react';
import type { Ctx } from '../engine/scene';
import { BANDS, C, F, tenantColour } from '../theme';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export type StackOpts = {
  /** Class prefix, unique within the scene. */
  key: string;
  x: number; y: number; width: number;
  bandH?: number; gap?: number; labelW?: number;
  /** Tenants drawn at the start, and the most this stack will ever show. */
  tenants?: number; maxTenants?: number;
  /** Bands below the multi-tenancy line at the start (6 = only onboarding above). */
  lineAt?: number;
  labels?: Partial<Record<number, string>>;
  fontScale?: number;
  markers?: boolean; lineLabel?: boolean;
  /** Band that can hold special-case marks, and how many rows of them. */
  shardBand?: number; maxShards?: number;
  heat?: boolean;
  /** Draw bands as dashed outlines that build solid from the bottom (greenfield). */
  buildable?: boolean;
  /** Label shown beside a lit band on a rail (labelW 0). */
  railLabel?: string;
};

/**
 * The stack of layers with the multi-tenancy line, drawn once and moved by GSAP.
 * makeStack returns the markup and the operations a scene can schedule on its timeline.
 */
export const makeStack = (o: StackOpts) => {
  const k = o.key, bandH = o.bandH ?? 70, gap = o.gap ?? 8, labelW = o.labelW ?? 300, fs = o.fontScale ?? 1;
  const n0 = o.tenants ?? 6, max = Math.max(o.maxTenants ?? n0, n0), line0 = o.lineAt ?? 6;
  const colX = o.x + labelW, colW = o.width - labelW;
  const bandTop = (i: number) => o.y + (BANDS.length - 1 - i) * (bandH + gap);
  const boundary = (kk: number) => {
    const yb = (j: number) => (j <= 0 ? bandTop(0) + bandH + gap / 2 : bandTop(j - 1) - gap / 2);
    const f = Math.floor(kk), t = kk - f;
    return yb(f) * (1 - t) + yb(f + 1) * t;
  };
  const col = (t: number, n: number) => {
    const cw = colW / Math.max(1, n);
    return t < n ? { x: colX + t * cw + 1.5, w: cw - 3, c: colX + t * cw + cw / 2, cw } : { x: colX + colW, w: 0, c: colX + colW, cw };
  };
  const above = (i: number, lineAt: number) => clamp(i + 1 - lineAt);
  const markerY = bandTop(BANDS.length - 1) - 44;
  const cls = (s: string) => `${k}-${s}`;
  const shardRows = o.maxShards ?? 0;

  const View: React.FC = () => (
    <g className={cls('root')}>
      {(o.markers ?? true) && Array.from({ length: max }).map((_, t) => {
        const p = col(t, n0);
        return (
          <g key={t} className={`${cls('marker')} ${cls(`marker-${t}`)}`} opacity={t < n0 ? 1 : 0} data-target={`tenant.${t}`}>
            <rect className={cls('marker-pill')} x={p.c - Math.min(26, p.cw / 2 - 2)} y={markerY} width={Math.max(0, Math.min(52, p.cw - 4))} height={26} rx={13} fill={tenantColour(t)} />
            <text className={cls('marker-text')} x={p.c} y={markerY + 18} textAnchor="middle" fontFamily={F.mono} fontSize={13 * fs} fill={C.tenantText}>{String.fromCharCode(65 + (t % 26))}</text>
          </g>
        );
      })}
      {BANDS.map((b, i) => {
        const top = bandTop(i), a = above(i, line0);
        return (
          <g key={b.id} className={`${cls('band')} ${cls(`band-${i}`)}`} data-target={`layer.${b.id}`}>
            {o.buildable && (
              <g className={cls(`outline-${i}`)}>
                {labelW > 0 && <rect x={o.x} y={top} width={labelW - 6} height={bandH} rx={6} fill="none" stroke={C.hairline} strokeWidth={1.5} strokeDasharray="6 6" />}
                <rect x={colX} y={top} width={colW} height={bandH} rx={6} fill="none" stroke={C.hairline} strokeWidth={1.5} strokeDasharray="6 6" />
              </g>
            )}
            <g className={cls(`solid-${i}`)} opacity={o.buildable ? 0 : 1}>
              {labelW > 0 && <rect className={cls(`labelbg-${i}`)} x={o.x} y={top} width={labelW - 6} height={bandH} rx={6} fill={a > 0.5 ? '#123a36' : '#1b2a45'} />}
              {labelW > 0 && <text className={cls(`label-${i}`)} x={o.x + 18} y={top + bandH / 2 + 7 * fs} fontFamily={F.sans} fontWeight={500} fontSize={19 * fs} fill={C.text}>{o.labels?.[i] ?? b.label}</text>}
              <rect className={cls(`shared-${i}`)} x={colX} y={top} width={colW} height={bandH} rx={6} fill={C.shared} opacity={1 - a} />
              {Array.from({ length: max - 1 }).map((_, t) => {
                const p = col(t, n0);
                return <line key={`g${t}`} className={`${cls(`guide-${i}`)} ${cls(`guide-${i}-${t}`)}`} x1={p.x + p.w + 1.5} x2={p.x + p.w + 1.5} y1={top + 8} y2={top + bandH - 8}
                  stroke={C.sharedEdge} strokeWidth={1} strokeDasharray="2 5" opacity={t < n0 - 1 ? (1 - a) * 0.8 : 0} />;
              })}
              {Array.from({ length: max }).map((_, t) => {
                const p = col(t, n0);
                return <rect key={`c${t}`} className={`${cls(`col-${i}`)} ${cls(`col-${i}-${t}`)}`} x={p.x} y={top} width={p.w} height={bandH} rx={5} fill={tenantColour(t)} opacity={t < n0 ? a : 0} />;
              })}
            </g>
            <rect className={cls(`lit-${i}`)} x={o.x - 4} y={top - 4} width={o.width + 8} height={bandH + 8} rx={8} fill="none" stroke={C.text} strokeWidth={2} opacity={0} />
            {i === 3 && <rect className={cls('glow')} x={o.x - 3} y={top - 3} width={o.width + 6} height={bandH + 6} rx={9} fill="none" stroke={C.invariantEdge} strokeWidth={3} opacity={0}
              style={{ filter: `drop-shadow(0 0 14px ${C.invariantEdge})` }} data-target="layer.invariants" />}
            {o.heat && <rect className={cls(`heat-${i}`)} x={o.x + o.width + 24} y={top + bandH / 2 - 9} width={0} height={18} rx={9} fill={C.warn} opacity={0.85} data-target="heat.bars" />}
          </g>
        );
      })}
      {o.shardBand !== undefined && Array.from({ length: shardRows }).map((_, j) => (
        <g key={`sr${j}`} className={`${cls('shardrow')} ${cls(`shardrow-${j}`)}`} opacity={0} data-target="shard.special-case">
          <line x1={colX + 6} x2={colX + colW - 6} y1={bandTop(o.shardBand!) + 19 + (j % 3) * 18} y2={bandTop(o.shardBand!) + 19 + (j % 3) * 18} stroke={C.warn} strokeWidth={1.5} opacity={0.45} />
          {Array.from({ length: max }).map((_, t) => {
            const p = col(t, n0), yy = bandTop(o.shardBand!) + 14 + (j % 3) * 18;
            return <rect key={t} className={`${cls('shard')} ${cls(`shard-${t}`)}`} x={p.c - 5} y={yy} width={10} height={10} fill={C.warn}
              transform={`rotate(45 ${p.c} ${yy + 5})`} opacity={t < n0 ? 1 : 0} />;
          })}
        </g>
      ))}
      <rect className={cls('defect')} x={0} y={0} width={0} height={bandH + 4} rx={6} fill="none" stroke={C.warn} strokeWidth={4} opacity={0}
        style={{ filter: `drop-shadow(0 0 12px ${C.warn})` }} data-target="defect.cross-tenant" />
      <g className={cls('line')} transform={`translate(0 ${boundary(line0)})`} data-target="line.mt">
        <line x1={o.x - 20} x2={o.x + o.width + 20} y1={0} y2={0} stroke={C.line} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.line})` }} />
        {(o.lineLabel ?? true) && labelW > 0 && <text x={o.x - 28} y={6} textAnchor="end" fontFamily={F.mono} fontSize={15 * fs} fill={C.line}>multi-tenancy line</text>}
      </g>
      {o.railLabel && null}
    </g>
  );

  let tenantsNow = n0, lineNow = line0;
  const api = {
    View, bandTop, boundary, col, colX, colW, key: k,
    sel: (s: string) => `.${cls(s)}`,
    /** Tenants grow or shrink to n: columns, markers, guides and special-case marks re-lay out. */
    tenants(ctx: Ctx, n: number, at: number, dur = 1.6) {
      const { tl, q } = ctx;
      for (let t = 0; t < max; t++) {
        const p = col(t, n), on = t < n ? 1 : 0;
        tl.to(q(`.${cls(`marker-${t}`)}`), { opacity: on, duration: dur }, at);
        tl.to(q(`.${cls(`marker-${t}`)} .${cls('marker-pill')}`), { attr: { x: p.c - Math.min(26, p.cw / 2 - 2), width: Math.max(0, Math.min(52, p.cw - 4)) }, duration: dur }, at);
        tl.to(q(`.${cls(`marker-${t}`)} .${cls('marker-text')}`), { attr: { x: p.c }, opacity: p.cw > 40 ? 1 : 0, duration: dur }, at);
        for (let i = 0; i < BANDS.length; i++) {
          tl.to(q(`.${cls(`col-${i}-${t}`)}`), { attr: { x: p.x, width: p.w }, opacity: on * above(i, lineNow), duration: dur }, at);
          if (t < max - 1) tl.to(q(`.${cls(`guide-${i}-${t}`)}`), { attr: { x1: p.x + p.w + 1.5, x2: p.x + p.w + 1.5 }, opacity: t < n - 1 ? (1 - above(i, lineNow)) * 0.8 : 0, duration: dur }, at);
        }
        q(`.${cls(`shard-${t}`)}`).forEach((el) => {
          const yy = Number(el.getAttribute('y'));
          tl.to(el, { attr: { x: p.c - 5, transform: `rotate(45 ${p.c} ${yy + 5})` }, opacity: on, duration: dur }, at);
        });
      }
      tenantsNow = n;
    },
    /** The multi-tenancy line slides so that `lineAt` bands sit below it; tenant tint follows. */
    line(ctx: Ctx, lineAt: number, at: number, dur = 1.6) {
      const { tl, q } = ctx;
      tl.to(q(`.${cls('line')}`), { attr: { transform: `translate(0 ${boundary(lineAt)})` }, duration: dur }, at);
      for (let i = 0; i < BANDS.length; i++) {
        const a = above(i, lineAt);
        tl.to(q(`.${cls(`shared-${i}`)}`), { opacity: 1 - a, duration: dur }, at);
        tl.to(q(`.${cls(`labelbg-${i}`)}`), { attr: { fill: a > 0.5 ? '#123a36' : '#1b2a45' }, duration: dur }, at);
        for (let t = 0; t < max; t++) {
          tl.to(q(`.${cls(`col-${i}-${t}`)}`), { opacity: (t < tenantsNow ? 1 : 0) * a, duration: dur }, at);
          if (t < max - 1) tl.to(q(`.${cls(`guide-${i}-${t}`)}`), { opacity: t < tenantsNow - 1 ? (1 - a) * 0.8 : 0, duration: dur }, at);
        }
      }
      lineNow = lineAt;
    },
    /** Outlines one band; null clears. Other bands dim to `dim`. */
    lit(ctx: Ctx, band: number | null, at: number, dim = 1) {
      const { tl, q } = ctx;
      for (let i = 0; i < BANDS.length; i++) {
        tl.to(q(`.${cls(`lit-${i}`)}`), { opacity: band === i ? 1 : 0, duration: 0.4 }, at);
        tl.to(q(`.${cls(`band-${i}`)}`), { opacity: band === null || band === i ? 1 : dim, duration: 0.4 }, at);
      }
    },
    relabel(ctx: Ctx, band: number, text: string, at: number) {
      ctx.tl.to(ctx.q(`.${cls(`label-${band}`)}`), { text, duration: 0.5, ease: 'none' }, at);
    },
    /** Reveals special-case rows one by one; each spans every tenant column. */
    shards(ctx: Ctx, rows: number, at: number, each = 0.9) {
      for (let j = 0; j < rows; j++) ctx.tl.to(ctx.q(`.${cls(`shardrow-${j}`)}`), { opacity: 1, duration: 0.4 }, at + j * each);
    },
    heat(ctx: Ctx, values: number[], at: number, stagger = 0.25) {
      values.forEach((v, i) => ctx.tl.to(ctx.q(`.${cls(`heat-${i}`)}`), { attr: { width: 180 * v }, duration: 0.8 }, at + (BANDS.length - 1 - i) * stagger));
    },
    glow(ctx: Ctx, on: boolean, at: number) {
      ctx.tl.to(ctx.q(`.${cls('glow')}`), { opacity: on ? 1 : 0, duration: 0.6 }, at);
    },
    /** Greenfield: the bands turn solid from the bottom up. */
    buildUp(ctx: Ctx, at: number, dur = 3) {
      for (let i = 0; i < BANDS.length; i++) ctx.tl.to(ctx.q(`.${cls(`solid-${i}`)}`), { opacity: 1, duration: 0.5 }, at + (i / BANDS.length) * dur);
    },
    /** A pulsing outline on one tenant's column in one band, from `at` until `until`. */
    defect(ctx: Ctx, tenant: number, band: number, at: number, until: number) {
      const { tl, q } = ctx;
      const p = col(tenant, tenantsNow);
      const el = q(`.${cls('defect')}`);
      tl.set(el, { attr: { x: p.x - 1, y: bandTop(band) - 2, width: p.w + 2 } }, at);
      for (let t = at; t < until; t += 0.8) tl.to(el, { opacity: 1, duration: 0.4, ease: 'sine.inOut' }, t).to(el, { opacity: 0.35, duration: 0.4, ease: 'sine.inOut' }, t + 0.4);
    },
  };
  return api;
};
export type Stack = ReturnType<typeof makeStack>;

/** The narrow stack on the left that shows which layer is in view. */
export const makeRail = (key: string, opts: { lit: number; lineAt?: number; label: string; glow?: boolean }) => {
  const s = makeStack({ key, x: 64, y: 200, width: 300, bandH: 40, gap: 6, labelW: 0, lineAt: opts.lineAt ?? 6, tenants: 6, markers: false, lineLabel: false });
  const View: React.FC = () => (
    <g className={`${key}-rail`}>
      <text x={64} y={180} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>THE STACK</text>
      <s.View />
      <rect x={60} y={s.bandTop(opts.lit) - 4} width={308} height={48} rx={8} fill="none" stroke={C.text} strokeWidth={2} />
      <text x={374} y={s.bandTop(opts.lit) + 26} fontFamily={F.sans} fontSize={16} fill={C.text}>◀ {opts.label}</text>
    </g>
  );
  const setup = (ctx: Ctx) => {
    for (let i = 0; i < 7; i++) if (i !== opts.lit) ctx.tl.set(ctx.q(`.${key}-band-${i}`), { opacity: 0.5 }, 0);
    if (opts.glow) ctx.tl.set(ctx.q(`.${key}-glow`), { opacity: 1 }, 0);
  };
  return { View, setup, stack: s };
};
