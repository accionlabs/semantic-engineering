import React from 'react';
import { Label, Tag } from './kit';

/** Geometry for the six-band stack used by d1 and d2. */
export const W = 640;
const X = 20, LABEL_W = 352, COL_X = 380, COL_W = 240, TENANTS = 4;
const TOP = 96, H = 62, GAP = 10, LINE_EXTRA = 40;

export type Band = { lines: string[] };

export const stackGeometry = (count: number, above: number) => {
  const bandY = (i: number) => TOP + i * (H + GAP) + (i >= above ? LINE_EXTRA : 0);
  const lineY = bandY(above - 1) + H + 32;
  const bottom = bandY(count - 1) + H;
  return { bandY, lineY, bottom, H, GAP, LINE_EXTRA };
};

const colRect = (t: number) => {
  const cw = COL_W / TENANTS;
  return { x: COL_X + t * cw + 1.5, w: cw - 3, c: COL_X + t * cw + cw / 2 };
};

/**
 * The stack in the video's language: a label box on the left and a colour column on the
 * right. Shared bands are one solid shared block; per-customer bands split into one
 * column per customer in the tenant colour. Bands listed in `flood` carry a shared base
 * under their tenant columns so the tint can flood in during motion.
 */
export const StackView: React.FC<{
  bands: Band[];
  above: number;
  headAbove: string;
  headBelow: string;
  flood?: number[];
}> = ({ bands, above, headAbove, headBelow, flood = [] }) => {
  const g = stackGeometry(bands.length, above);
  return (
    <g>
      <Tag className="head-above" x={X} y={22} text={headAbove} />
      <g className="markers">
        {Array.from({ length: TENANTS }).map((_, t) => {
          const p = colRect(t);
          return (
            <g key={t} className={`marker marker-${t}`}>
              <rect x={p.c - 20} y={48} width={40} height={26} rx={13} style={{ fill: 'var(--tenant)' }} />
              <text x={p.c} y={66} textAnchor="middle" style={{ fill: 'var(--tenant-text)', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 500 }}>
                {String.fromCharCode(65 + t)}
              </text>
            </g>
          );
        })}
      </g>
      {bands.map((b, i) => {
        const y = g.bandY(i), tenant = i < above, floods = flood.includes(i);
        return (
          <g key={i} className={`band band-${i}`}>
            <rect x={X} y={y} width={LABEL_W} height={H} rx={7} style={{ fill: 'var(--raised)', stroke: 'var(--hairline)', strokeWidth: 1 }} />
            {(!tenant || floods) && <rect className="accent-shared" x={X} y={y} width={7} height={H} rx={3.5} opacity={floods ? 0 : 1} style={{ fill: 'var(--shared)' }} />}
            {tenant && <rect className="accent-tenant" x={X} y={y} width={7} height={H} rx={3.5} style={{ fill: 'var(--tenant)' }} />}
            <Label x={X + 22} y={y + H / 2} lines={b.lines} size={17} />
            {(!tenant || floods) && (
              <g className="shared-col" opacity={floods ? 0 : 1}>
                <rect x={COL_X} y={y} width={COL_W} height={H} rx={7} style={{ fill: 'var(--shared)' }} />
                {Array.from({ length: TENANTS - 1 }).map((_, t) => {
                  const p = colRect(t);
                  const gx = p.x + p.w + 1.5;
                  return (
                    <line key={t} x1={gx} x2={gx} y1={y + 10} y2={y + H - 10}
                      style={{ stroke: 'var(--shared-text)', strokeOpacity: 0.35, strokeWidth: 1, strokeDasharray: '2 5' }} />
                  );
                })}
              </g>
            )}
            {tenant && (
              <g className="tenant-cols">
                {Array.from({ length: TENANTS }).map((_, t) => {
                  const p = colRect(t);
                  return <rect key={t} className={`col col-${t}`} x={p.x} y={y} width={p.w} height={H} rx={6} style={{ fill: 'var(--tenant)' }} />;
                })}
              </g>
            )}
          </g>
        );
      })}
      <g className="mt-line">
        <line className="mt-stroke" x1={6} x2={W - 6} y1={g.lineY} y2={g.lineY} style={{ stroke: 'var(--line)', strokeWidth: 4, strokeLinecap: 'round' }} />
        <Tag className="mt-label" x={X} y={g.lineY - 11} text="MULTI-TENANCY LINE" color="var(--line)" />
      </g>
      <Tag className="head-below" x={X} y={g.bottom + 30} text={headBelow} />
    </g>
  );
};
