import React from 'react';
import { Arrow, Card, Dot, Figure, Label, Tag, drawArrow, rise, travel, type Build } from './kit';

const W = 720, BOX_Y = 196, BOX_H = 104, BOX_W = 212;
const DOC = { x: 220, y: 24, w: 280, h: 96 };
const PRICE = { x: 250, y: 384, w: 220, h: 76 };
const cols = [20, 254, 488].map((x) => ({ x, c: x + BOX_W / 2 }));

const parts = [
  { cls: 'sku', lines: ['Capability SKUs', 'used'], tag: 'MATERIAL', fill: 'var(--shared)', stroke: 'var(--shared)', text: 'var(--shared-text)', tagColor: 'var(--shared-text)', dashed: false },
  { cls: 'asm', lines: ['Assembly work'], tag: 'CONVERSION', fill: 'var(--raised)', stroke: 'var(--hairline)', text: 'var(--fg)', tagColor: 'var(--muted)', dashed: false },
  { cls: 'plg', lines: ['Customer-scoped', 'plugins'], tag: 'MADE TO ORDER', fill: 'var(--surface)', stroke: 'var(--tenant)', text: 'var(--fg)', tagColor: 'var(--muted)', dashed: true },
];

const docBottom = DOC.y + DOC.h;
const downs = cols.map((c, i) => [[DOC.x + 70 + i * 70, docBottom], [DOC.x + 70 + i * 70, 156], [c.c, 156], [c.c, BOX_Y]] as [number, number][]);
const ups = cols.map((c, i) => [[c.c, BOX_Y + BOX_H], [c.c, 342], [PRICE.x + 60 + i * 50, 342], [PRICE.x + 60 + i * 50, PRICE.y]] as [number, number][]);

// The document fans out into what it uses, then each part flows into the price.
const build: Build = (tl, q) => {
  rise(tl, q, '.doc', 0);
  parts.forEach((p, i) => {
    drawArrow(tl, q, `.down-${i}`, 0.5 + i * 0.35, 0.45);
    rise(tl, q, `.${p.cls}`, 0.8 + i * 0.35);
  });
  const t = 2.3;
  parts.forEach((_, i) => {
    drawArrow(tl, q, `.up-${i}`, t, 0.55);
    travel(tl, q, `.dot-${i}`, `.up-${i}`, t + 0.6, 0.7);
  });
  tl.from(q('.price'), { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(1.6)' }, t + 1.2);
};

export const D3: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} 480`}
    title="From a domain document to a price"
    desc="A customer's domain document leads to three things: the capability SKUs it uses, which are the material; the assembly work, which is the conversion; and customer-scoped plugins, which are made to order. All three flow into the price."
    build={build}
  >
    <g className="doc">
      <path
        d={`M ${DOC.x + 8} ${DOC.y} H ${DOC.x + DOC.w - 26} L ${DOC.x + DOC.w} ${DOC.y + 26} V ${DOC.y + DOC.h - 8} Q ${DOC.x + DOC.w} ${DOC.y + DOC.h} ${DOC.x + DOC.w - 8} ${DOC.y + DOC.h} H ${DOC.x + 8} Q ${DOC.x} ${DOC.y + DOC.h} ${DOC.x} ${DOC.y + DOC.h - 8} V ${DOC.y + 8} Q ${DOC.x} ${DOC.y} ${DOC.x + 8} ${DOC.y} Z`}
        style={{ fill: 'var(--tenant)' }}
      />
      <path d={`M ${DOC.x + DOC.w - 26} ${DOC.y} V ${DOC.y + 26} H ${DOC.x + DOC.w}`} style={{ fill: 'none', stroke: 'var(--tenant-text)', strokeOpacity: 0.6, strokeWidth: 1.5 }} />
      <Label x={DOC.x + DOC.w / 2} y={DOC.y + DOC.h / 2} lines={["Customer's", 'domain document']} size={19} weight={600} anchor="middle" color="var(--tenant-text)" />
    </g>
    {downs.map((pts, i) => <Arrow key={i} className={`down-${i}`} pts={pts} />)}
    {parts.map((p, i) => (
      <g key={p.cls} className={p.cls}>
        <Card x={cols[i].x} y={BOX_Y} w={BOX_W} h={BOX_H} fill={p.fill} stroke={p.stroke} strokeWidth={p.dashed ? 2 : 1.5} dashed={p.dashed} />
        <Label x={cols[i].c} y={BOX_Y + (p.lines.length > 1 ? 40 : 44)} lines={p.lines} size={18} weight={600} anchor="middle" color={p.text} />
        <Tag x={cols[i].c} y={BOX_Y + 86} text={p.tag} anchor="middle" color={p.tagColor} />
      </g>
    ))}
    {ups.map((pts, i) => <Arrow key={i} className={`up-${i}`} pts={pts} />)}
    <g className="price">
      <Card x={PRICE.x} y={PRICE.y} w={PRICE.w} h={PRICE.h} r={38} fill="var(--surface)" stroke="var(--invariant)" strokeWidth={2.5} />
      <Label x={PRICE.x + PRICE.w / 2} y={PRICE.y + PRICE.h / 2} lines={['Price']} size={30} weight={700} family="display" anchor="middle" />
    </g>
    {parts.map((_, i) => <Dot key={i} className={`dot-${i}`} color={i === 0 ? 'var(--shared)' : i === 1 ? 'var(--muted)' : 'var(--tenant)'} />)}
  </Figure>
);
