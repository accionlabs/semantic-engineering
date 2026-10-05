import React from 'react';
import { Arrow, Card, Diamond, Figure, Label, Tag, drawArrow, rise, type Build, type Pt } from './kit';

const W = 720;
const L = { x: 90, w: 290 }, R = { x: 440, w: 260 };
const lc = L.x + L.w / 2, rc = R.x + R.w / 2;
const A = { y: 40, h: 80 }, B = { y: 170, h: 80 }, C = { cy: 350, w: 250, h: 100 }, D = { y: 450, h: 70 };
const G = { y: 40, h: 80 }, F = { y: 250, h: 80 }, E = { y: 450, h: 70 };

type Station = { cls: string; x: number; y: number; w: number; h: number; lines: string[]; fill: string; stroke: string; text: string };
const STATIONS: Station[] = [
  { cls: 's-a', x: L.x, y: A.y, w: L.w, h: A.h, lines: ['Domain expert states intent', 'in natural language'], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)' },
  { cls: 's-b', x: L.x, y: B.y, w: L.w, h: B.h, lines: ['Agent authors the document', 'in the domain grammar'], fill: 'var(--raised)', stroke: 'var(--hairline)', text: 'var(--fg)' },
  { cls: 's-d', x: L.x, y: D.y, w: L.w, h: D.h, lines: ['Functional tests'], fill: 'var(--surface)', stroke: 'var(--invariant)', text: 'var(--fg)' },
  { cls: 's-e', x: R.x, y: E.y, w: R.w, h: E.h, lines: ['Compiler'], fill: 'var(--shared)', stroke: 'var(--shared)', text: 'var(--shared-text)' },
  { cls: 's-f', x: R.x, y: F.y, w: R.w, h: F.h, lines: ['Product configuration,', 'interface, API calls'], fill: 'var(--surface)', stroke: 'var(--muted)', text: 'var(--fg)' },
  { cls: 's-g', x: R.x, y: G.y, w: R.w, h: G.h, lines: ['Result shown back', 'to the domain expert'], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)' },
];

const edges: Record<string, Pt[]> = {
  ab: [[lc, A.y + A.h], [lc, B.y]],
  bc: [[lc, B.y + B.h], [lc, C.cy - C.h / 2]],
  cd: [[lc, C.cy + C.h / 2], [lc, D.y]],
  invalid: [[lc - C.w / 2, C.cy], [58, C.cy], [58, B.y + 56], [L.x, B.y + 56]],
  fail: [[L.x, D.y + D.h / 2], [30, D.y + D.h / 2], [30, B.y + 24], [L.x, B.y + 24]],
  de: [[L.x + L.w, D.y + D.h / 2], [R.x, E.y + E.h / 2]],
  ef: [[rc, E.y], [rc, F.y + F.h]],
  fg: [[rc, F.y], [rc, G.y + G.h]],
  ga: [[R.x, G.y + G.h / 2], [L.x + L.w, A.y + A.h / 2]],
};

// The loop closes station by station. The two retry paths flash in warning colour as the
// validator and the tests come online, and the final arrow back to the expert closes it.
const build: Build = (tl, q) => {
  const step = 0.5;
  let t = 0;
  const next = (sel: string, arrow?: string) => {
    if (arrow) { drawArrow(tl, q, arrow, t, 0.3); t += 0.3; }
    rise(tl, q, sel, t, 10, 0.4);
    t += step;
  };
  next('.s-a');
  next('.s-b', '.e-ab');
  next('.s-c', '.e-bc');
  drawArrow(tl, q, '.e-invalid', t - 0.1, 0.5);
  tl.from(q('.l-invalid'), { opacity: 0, duration: 0.3 }, t + 0.2);
  t += 0.5;
  tl.from(q('.l-valid'), { opacity: 0, duration: 0.3 }, t);
  next('.s-d', '.e-cd');
  drawArrow(tl, q, '.e-fail', t - 0.1, 0.5);
  tl.from(q('.l-fail'), { opacity: 0, duration: 0.3 }, t + 0.2);
  t += 0.5;
  tl.from(q('.l-pass'), { opacity: 0, duration: 0.3 }, t);
  next('.s-e', '.e-de');
  next('.s-f', '.e-ef');
  next('.s-g', '.e-fg');
  drawArrow(tl, q, '.e-ga', t, 0.6);
  tl.fromTo(q('.pulse'), { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.08, transformOrigin: '50% 50%', duration: 0.9, ease: 'power2.out' }, t + 0.6);
};

export const D6: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${D.y + D.h + 20}`}
    title="The loop from intent to result"
    desc="A domain expert states intent in natural language. An agent authors the document in the domain grammar. A parser and validator checks it: invalid goes back to the agent, valid goes on to functional tests. A failing test goes back to the agent; passing goes to the compiler, which produces product configuration, interface and API calls. The result is shown back to the domain expert, closing the loop."
    build={build}
  >
    {Object.entries(edges).map(([k, pts]) => (
      <Arrow key={k} className={`e-${k}`} pts={pts} color={k === 'invalid' || k === 'fail' ? 'var(--warn)' : 'var(--muted)'} width={k === 'ga' ? 2.5 : 2} />
    ))}
    {STATIONS.map((s) => (
      <g key={s.cls} className={s.cls}>
        <Card x={s.x} y={s.y} w={s.w} h={s.h} fill={s.fill} stroke={s.stroke} strokeWidth={s.stroke === s.fill ? 1.5 : 2} />
        <Label x={s.x + s.w / 2} y={s.y + s.h / 2} lines={s.lines} size={18} weight={600} anchor="middle" color={s.text} />
      </g>
    ))}
    <g className="s-c">
      <Diamond cx={lc} cy={C.cy} w={C.w} h={C.h} />
      <Label x={lc} y={C.cy} lines={['Parser and', 'validator']} size={18} weight={600} anchor="middle" />
    </g>
    <Tag className="l-invalid" x={64} y={B.y + B.h + 30} text="invalid" color="var(--warn)" />
    <Tag className="l-fail" x={36} y={D.y - 12} text="fail" color="var(--warn)" />
    <Tag className="l-valid" x={lc + 10} y={C.cy + C.h / 2 + 30} text="valid" />
    <Tag className="l-pass" x={(L.x + L.w + R.x) / 2} y={D.y + D.h / 2 - 10} text="pass" anchor="middle" />
    <rect className="pulse" x={L.x - 4} y={A.y - 4} width={L.w + 8} height={A.h + 8} rx={11} opacity={0} style={{ fill: 'none', stroke: 'var(--tenant)', strokeWidth: 3 }} />
  </Figure>
);
