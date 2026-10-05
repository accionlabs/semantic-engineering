import React from 'react';
import { Arrow, Card, Figure, Label, Tag, drawArrow, type Build } from './kit';

const W = 680, TOP = 96, H = 92, GAP = 16;
const bandY = (row: number) => TOP + row * (H + GAP);
const BOTTOM = bandY(2) + H;

type Step = { n: number; lines: string[]; fill: string; stroke: string; text: string; tag: string; dashed?: boolean };

// Greenfield is drawn bottom to top: step 1 sits lowest.
const GREEN: Step[] = [
  { n: 1, lines: ['Execution layer', 'and data model'], fill: 'var(--shared)', stroke: 'var(--shared)', text: 'var(--shared-text)', tag: 'var(--shared-text)' },
  { n: 2, lines: ['Capability grammar'], fill: 'var(--shared)', stroke: 'var(--shared)', text: 'var(--shared-text)', tag: 'var(--shared-text)' },
  { n: 3, lines: ['Generated surface'], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)', tag: 'var(--tenant-text)' },
];
const BROWN: Step[] = [
  { n: 1, lines: ['Onboarding and', 'configuration'], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)', tag: 'var(--tenant-text)' },
  { n: 2, lines: ['User experience'], fill: 'var(--tenant)', stroke: 'var(--tenant)', text: 'var(--tenant-text)', tag: 'var(--tenant-text)' },
  { n: 3, lines: ['Business rules,', 'later or never'], fill: 'var(--surface)', stroke: 'var(--muted)', text: 'var(--fg)', tag: 'var(--muted)', dashed: true },
];

const GX = 64, BX = 396, BW = 260;

const StepBand: React.FC<{ s: Step; x: number; y: number; cls: string }> = ({ s, x, y, cls }) => (
  <g className={cls}>
    <Card x={x} y={y} w={BW} h={H} fill={s.fill} stroke={s.stroke} strokeWidth={s.dashed ? 2 : 1.5} dashed={s.dashed} />
    <Tag x={x + 18} y={y + 26} text={`STEP ${s.n}`} color={s.tag} />
    <Label x={x + 18} y={y + (s.lines.length > 1 ? 60 : 58)} lines={s.lines} size={18} weight={600} color={s.text} leading={1.2} />
  </g>
);

// Greenfield rises first, band by band from the bottom. Only when it is finished does
// brownfield start, descending from the top.
const build: Build = (tl, q) => {
  tl.from(q('.g-head'), { opacity: 0, duration: 0.4 }, 0);
  drawArrow(tl, q, '.g-arrow', 0.2, 1.4);
  [0, 1, 2].forEach((i) => tl.from(q(`.g-${i}`), { opacity: 0, y: 24, duration: 0.5 }, 0.3 + i * 0.45));
  const b = 2.4;
  tl.from(q('.b-head'), { opacity: 0, duration: 0.4 }, b);
  drawArrow(tl, q, '.b-arrow', b + 0.2, 1.4);
  [0, 1, 2].forEach((i) => tl.from(q(`.b-${i}`), { opacity: 0, y: -24, duration: 0.5 }, b + 0.3 + i * 0.45));
};

export const D4: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${BOTTOM + 24}`}
    title="Two directions of travel"
    desc="Greenfield work goes upward: step 1 is the execution layer and data model, step 2 the capability grammar, step 3 the generated surface. An existing product works downward: step 1 is onboarding and configuration, step 2 user experience, step 3 business rules, later or never."
    build={build}
  >
    <g className="g-head">
      <Label x={GX - 44} y={34} lines={['Greenfield']} size={24} weight={700} family="display" />
      <Tag x={GX - 44} y={68} text="WORK UPWARD" />
    </g>
    <Arrow className="g-arrow" pts={[[GX - 26, BOTTOM], [GX - 26, TOP]]} width={3} color="var(--muted)" head={11} />
    {GREEN.map((s, i) => <StepBand key={i} s={s} x={GX} y={bandY(2 - i)} cls={`g-${i}`} />)}

    <g className="b-head">
      <Label x={BX - 44} y={34} lines={['Existing product']} size={24} weight={700} family="display" />
      <Tag x={BX - 44} y={68} text="WORK DOWNWARD" />
    </g>
    <Arrow className="b-arrow" pts={[[BX - 26, TOP], [BX - 26, BOTTOM]]} width={3} color="var(--muted)" head={11} />
    {BROWN.map((s, i) => <StepBand key={i} s={s} x={BX} y={bandY(i)} cls={`b-${i}`} />)}
  </Figure>
);
