import React from 'react';
import { Arrow, Card, Figure, Label, Tag, drawArrow, type Build } from './kit';

const W = 720;
const CARD_W = 196, CARD_Y = 88, CARD_H = 112;
const cardX = [20, 262, 504];
const SCREENS = [
  { title: 'Screen 1', sub: ['wireframe,', 'build, review'] },
  { title: 'Screen 2', sub: ['wireframe,', 'build, review'] },
  { title: 'Screen n', sub: [] as string[] },
];

const V0 = 268;
const GR = { y: V0 + 64, h: 64 };
const AG = { y: GR.y + GR.h + 36, h: 104 };
const CO = { y: AG.y + AG.h + 36, h: 64 };
const THUMB = { w: 38, h: 28, gap: 9, cols: 6, rows: 2 };
const thumbX0 = 700 - 20 - (THUMB.cols * THUMB.w + (THUMB.cols - 1) * THUMB.gap);
const thumbY0 = AG.y + (AG.h - (THUMB.rows * THUMB.h + THUMB.gap)) / 2;
const thumbs = Array.from({ length: THUMB.cols * THUMB.rows }, (_, k) => ({
  x: thumbX0 + (k % THUMB.cols) * (THUMB.w + THUMB.gap),
  y: thumbY0 + Math.floor(k / THUMB.cols) * (THUMB.h + THUMB.gap),
}));

// Horizontal: each screen is its own round of work, arriving one at a time.
// Vertical: one grammar is defined, then every screen arrives at once.
const build: Build = (tl, q) => {
  tl.from(q('.h-head'), { opacity: 0, duration: 0.4 }, 0);
  SCREENS.forEach((_, i) => {
    const at = 0.3 + i * 1.0;
    if (i > 0) drawArrow(tl, q, `.h-arrow-${i}`, at - 0.35, 0.3);
    tl.from(q(`.h-card-${i}`), { opacity: 0, y: 16, duration: 0.45 }, at);
    tl.from(q(`.h-card-${i} .h-step`), { opacity: 0, duration: 0.25, stagger: 0.15 }, at + 0.25);
  });
  const v = 3.4;
  tl.from(q('.v-head'), { opacity: 0, duration: 0.4 }, v);
  tl.from(q('.v-grammar'), { opacity: 0, scaleX: 0.2, transformOrigin: '0% 50%', duration: 0.7, ease: 'power3.out' }, v + 0.3);
  drawArrow(tl, q, '.v-arrow-1', v + 1.0, 0.3);
  tl.from(q('.v-agent'), { opacity: 0, y: 12, duration: 0.4 }, v + 1.3);
  tl.from(q('.thumb'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.02, ease: 'back.out(2)' }, v + 1.6);
  drawArrow(tl, q, '.v-arrow-2', v + 2.1, 0.3);
  tl.from(q('.v-compiler'), { opacity: 0, y: 12, duration: 0.4 }, v + 2.4);
};

export const D5: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${CO.y + CO.h + 16}`}
    title="Horizontal and vertical modernisation"
    desc="Horizontal modernisation has cost linear in screen count: screen 1 is wireframed, built and reviewed, then screen 2, and so on to screen n. Vertical modernisation has a fixed cost, then falling cost per screen: define the grammar of what a screen can be, an agent authors every screen in that grammar, and the compiler emits the implementation."
    build={build}
  >
    <g className="h-head">
      <Label x={20} y={30} lines={['Horizontal']} size={24} weight={700} family="display" />
      <Tag x={20} y={66} text="COST LINEAR IN SCREEN COUNT" color="var(--warn)" />
    </g>
    {SCREENS.map((s, i) => (
      <g key={i} className={`h-card-${i}`}>
        <Card x={cardX[i]} y={CARD_Y} w={CARD_W} h={CARD_H} fill="var(--warn-soft)" stroke="var(--warn)" />
        <rect x={cardX[i]} y={CARD_Y} width={CARD_W} height={10} rx={5} style={{ fill: 'var(--warn)' }} />
        <Label x={cardX[i] + 18} y={CARD_Y + 40} lines={[s.title]} size={18} weight={600} />
        {s.sub.map((l, k) => (
          <Label key={k} className="h-step" x={cardX[i] + 18} y={CARD_Y + 70 + k * 21} lines={[l]} size={16} color="var(--muted)" weight={400} />
        ))}
      </g>
    ))}
    {[1, 2].map((i) => (
      <Arrow key={i} className={`h-arrow-${i}`} pts={[[cardX[i - 1] + CARD_W + 6, CARD_Y + CARD_H / 2], [cardX[i] - 6, CARD_Y + CARD_H / 2]]} />
    ))}

    <line x1={20} x2={700} y1={V0 - 26} y2={V0 - 26} style={{ stroke: 'var(--hairline)', strokeWidth: 1 }} />

    <g className="v-head">
      <Label x={20} y={V0 + 10} lines={['Vertical']} size={24} weight={700} family="display" />
      <Tag x={20} y={V0 + 46} text="FIXED COST, THEN FALLING COST PER SCREEN" color="var(--invariant)" />
    </g>
    <g className="v-grammar">
      <Card x={20} y={GR.y} w={680} h={GR.h} fill="var(--shared)" stroke="var(--invariant)" strokeWidth={2} />
      <Label x={40} y={GR.y + GR.h / 2} lines={['Define the grammar of what a screen can be']} size={18} weight={600} color="var(--shared-text)" />
    </g>
    <Arrow className="v-arrow-1" pts={[[360, GR.y + GR.h + 4], [360, AG.y - 4]]} />
    <g className="v-agent">
      <Card x={20} y={AG.y} w={680} h={AG.h} fill="var(--raised)" />
      <Label x={40} y={AG.y + AG.h / 2} lines={['Agent authors every', 'screen in that grammar']} size={18} weight={600} />
    </g>
    {thumbs.map((t, k) => (
      <g key={k} className="thumb">
        <rect x={t.x} y={t.y} width={THUMB.w} height={THUMB.h} rx={4} style={{ fill: 'var(--surface)', stroke: 'var(--muted)', strokeWidth: 1.5 }} />
        <rect x={t.x} y={t.y} width={THUMB.w} height={7} rx={3} style={{ fill: 'var(--muted)' }} />
      </g>
    ))}
    <Arrow className="v-arrow-2" pts={[[360, AG.y + AG.h + 4], [360, CO.y - 4]]} />
    <g className="v-compiler">
      <Card x={20} y={CO.y} w={680} h={CO.h} fill="var(--shared)" stroke="var(--shared)" />
      <Label x={40} y={CO.y + CO.h / 2} lines={['Compiler emits the implementation']} size={18} weight={600} color="var(--shared-text)" />
    </g>
  </Figure>
);
