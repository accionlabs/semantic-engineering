import React from 'react';
import { Arrow, Card, Diamond, Dot, Figure, Label, Tag, drawArrow, rise, travel, type Build, type Pt } from './kit';

const W = 720;
const LX = 20, RX = 400, CW = 300;
const lc = LX + CW / 2, rc = RX + CW / 2;
const A = { x: 210, y: 16, w: 300, h: 64 };
const B = { cx: 360, cy: 176, w: 300, h: 116 };
const C = { y: 290, h: 96 }, D = { y: 290, h: 96 };
const E = { cx: rc, cy: 490, w: 300, h: 120 };
const F = { y: 596, h: 80 }, H = { y: 596, h: 96 }, G = { y: 716, h: 84 };

const edges: Record<string, Pt[]> = {
  ab: [[360, A.y + A.h], [360, B.cy - B.h / 2]],
  bc: [[B.cx - B.w / 2, B.cy], [lc, B.cy], [lc, C.y]],
  bd: [[B.cx + B.w / 2, B.cy], [rc, B.cy], [rc, D.y]],
  de: [[rc, D.y + D.h], [rc, E.cy - E.h / 2]],
  ef: [[E.cx - E.w / 2, E.cy], [lc, E.cy], [lc, F.y]],
  eh: [[rc, E.cy + E.h / 2], [rc, H.y]],
  fg: [[lc, F.y + F.h], [lc, G.y]],
};

type Node = { cls: string; x: number; y: number; h: number; lines: string[]; fill: string; stroke: string; text: string; dashed?: boolean };
const NODES: Node[] = [
  { cls: 'n-c', x: LX, y: C.y, h: C.h, lines: ['Change in that', "customer's document"], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)' },
  { cls: 'n-d', x: RX, y: D.y, h: D.h, lines: ['Plugin scoped to that', 'customer, engineer', 'reviewed'], fill: 'var(--warn-soft)', stroke: 'var(--warn)', text: 'var(--fg)' },
  { cls: 'n-f', x: LX, y: F.y, h: F.h, lines: ['New primitive or', 'grammar change'], fill: 'var(--shared)', stroke: 'var(--shared)', text: 'var(--shared-text)' },
  { cls: 'n-h', x: RX, y: H.y, h: H.h, lines: ['Plugin stays local,', 'reviewed for promotion', 'or retirement'], fill: 'var(--warn-soft)', stroke: 'var(--warn)', text: 'var(--fg)', dashed: true },
  { cls: 'n-g', x: LX, y: G.y, h: G.h, lines: ['Customers move from plugin', 'to the language construct'], fill: 'var(--raised)', stroke: 'var(--muted)', text: 'var(--fg)' },
];

// A change arrives and is routed: first into the customer's document, then a second
// change that the language cannot express goes to a plugin, and a need that recurs
// becomes a new primitive that customers move onto.
const build: Build = (tl, q) => {
  rise(tl, q, '.n-a', 0);
  drawArrow(tl, q, '.e-ab', 0.4, 0.3);
  rise(tl, q, '.n-b', 0.6);
  // First change: expressible.
  travel(tl, q, '.dot-1', '.e-ab', 1.1, 0.4);
  drawArrow(tl, q, '.e-bc', 1.5, 0.45);
  tl.from(q('.l-yes'), { opacity: 0, duration: 0.3 }, 1.5);
  travel(tl, q, '.dot-1b', '.e-bc', 1.6, 0.5);
  rise(tl, q, '.n-c', 2.0);
  // Second change: not expressible.
  travel(tl, q, '.dot-2', '.e-ab', 2.6, 0.4);
  drawArrow(tl, q, '.e-bd', 3.0, 0.45);
  tl.from(q('.l-no'), { opacity: 0, duration: 0.3 }, 3.0);
  travel(tl, q, '.dot-2b', '.e-bd', 3.1, 0.5);
  rise(tl, q, '.n-d', 3.5);
  drawArrow(tl, q, '.e-de', 4.0, 0.3);
  rise(tl, q, '.n-e', 4.2);
  drawArrow(tl, q, '.e-ef', 4.8, 0.5);
  tl.from(q('.l-shape'), { opacity: 0, duration: 0.3 }, 4.9);
  travel(tl, q, '.dot-3', '.e-ef', 4.9, 0.6);
  rise(tl, q, '.n-f', 5.4);
  drawArrow(tl, q, '.e-fg', 5.9, 0.3);
  rise(tl, q, '.n-g', 6.1);
  drawArrow(tl, q, '.e-eh', 6.6, 0.3);
  tl.from(q('.l-notyet'), { opacity: 0, duration: 0.3 }, 6.6);
  rise(tl, q, '.n-h', 6.8);
};

export const D8: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${G.y + G.h + 16}`}
    title="A customer's change path into the language"
    desc="A customer requests a change. If it is expressible in the language, it becomes a change in that customer's document. If not, it becomes a plugin scoped to that customer and reviewed by an engineer. If the same need recurs across customers and its shape is understood, it becomes a new primitive or grammar change, and customers move from the plugin to the language construct. If not yet, the plugin stays local and is reviewed for promotion or retirement."
    build={build}
  >
    {Object.entries(edges).map(([k, pts]) => <Arrow key={k} className={`e-${k}`} pts={pts} />)}
    <g className="n-a">
      <Card x={A.x} y={A.y} w={A.w} h={A.h} fill="var(--tenant)" stroke="var(--tenant)" />
      <Label x={360} y={A.y + A.h / 2} lines={['Customer requests a change']} size={18} weight={600} anchor="middle" color="var(--tenant-text)" />
    </g>
    <g className="n-b">
      <Diamond cx={B.cx} cy={B.cy} w={B.w} h={B.h} />
      <Label x={B.cx} y={B.cy} lines={['Expressible in', 'the language?']} size={18} weight={600} anchor="middle" />
    </g>
    <g className="n-e">
      <Diamond cx={E.cx} cy={E.cy} w={E.w} h={E.h} />
      <Label x={E.cx} y={E.cy} lines={['Same need recurs', 'across customers?']} size={18} weight={600} anchor="middle" />
    </g>
    {NODES.map((n) => (
      <g key={n.cls} className={n.cls}>
        <Card x={n.x} y={n.y} w={CW} h={n.h} fill={n.fill} stroke={n.stroke} strokeWidth={n.fill === n.stroke ? 1.5 : 2} dashed={n.dashed} />
        <Label x={n.x + CW / 2} y={n.y + n.h / 2} lines={n.lines} size={18} weight={600} anchor="middle" color={n.text} leading={1.2} />
      </g>
    ))}
    <Tag className="l-yes" x={B.cx - B.w / 2 - 12} y={B.cy - 12} text="yes" anchor="end" />
    <Tag className="l-no" x={B.cx + B.w / 2 + 12} y={B.cy - 12} text="no" />
    <Tag className="l-shape" x={(lc + E.cx - E.w / 2) / 2 - 8} y={E.cy - 12} text="yes, shape understood" anchor="middle" />
    <Tag className="l-notyet" x={rc + 12} y={H.y - 22} text="not yet" />
    <Dot className="dot-1" />
    <Dot className="dot-1b" />
    <Dot className="dot-2" />
    <Dot className="dot-2b" />
    <Dot className="dot-3" color="var(--shared)" />
  </Figure>
);
