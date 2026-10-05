import React from 'react';
import { Arrow, Card, Figure, Label, Tag, drawArrow, type Build, type Pt } from './kit';

const W = 720, MX = 20, MW = 404, H = 80, GAP = 26;
const rowY = (i: number) => 20 + i * (H + GAP);
const mc = MX + MW / 2;
const FX = 464, FW = 236, FY = rowY(2) - 6, FH = 128;
const GY = rowY(5), GW = 680;

const STEPS = [
  { title: ['Knowledge graph'], tag: 'HIGH-APERTURE INVENTORY' },
  { title: ['Grammar for one feature', 'or one onboarding surface'] },
  { title: ['Compiler to current configuration'] },
  { title: ['Case corpus and functional tests'] },
  { title: ['Extend grammar coverage', 'feature by feature'] },
];

const informs: Pt[] = [[MX + MW, rowY(1) + H / 2], [FX + FW / 2, rowY(1) + H / 2], [FX + FW / 2, FY]];
const joinF: Pt[] = [[FX + FW / 2, FY + FH], [FX + FW / 2, GY]];

const Chip: React.FC<{ x: number; y: number; n: number; fill: string; text: string }> = ({ x, y, n, fill, text }) => (
  <g>
    <circle cx={x} cy={y} r={15} style={{ fill }} />
    <text x={x} y={y + 5} textAnchor="middle" style={{ fill: text, fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 500 }}>{n}</text>
  </g>
);

// Steps light in order. After step 2 the re-architecture branch starts, informed by the
// grammar, and runs beside steps 3 to 5 until both paths join at the generated surface.
const build: Build = (tl, q) => {
  const light = (sel: string, at: number) => {
    tl.from(q(`${sel} .body`), { opacity: 0.25, duration: 0.45, ease: 'power1.out' }, at);
    tl.from(q(`${sel} .chip`), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'back.out(2)' }, at);
  };
  tl.from(q('.step'), { opacity: 0, duration: 0.4 }, 0);
  STEPS.forEach((_, i) => {
    const at = 0.4 + i * 0.7;
    if (i > 0) drawArrow(tl, q, `.a-${i}`, at - 0.3, 0.3);
    light(`.step-${i}`, at);
  });
  tl.from(q('.informs'), { opacity: 0, duration: 0.6 }, 1.4);
  tl.from(q('.l-informs'), { opacity: 0, duration: 0.4 }, 1.6);
  tl.from(q('.branch'), { opacity: 0, x: 20, duration: 0.6 }, 1.8);
  const end = 0.4 + STEPS.length * 0.7;
  drawArrow(tl, q, '.a-5', end - 0.3, 0.3);
  drawArrow(tl, q, '.a-join', end - 0.3, 0.5);
  tl.from(q('.step-g'), { opacity: 0, y: 12, duration: 0.5 }, end + 0.2);
};

export const D7: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${GY + H + 20}`}
    title="The roadmap"
    desc="Step 1, a knowledge graph as a high-aperture inventory. Step 2, a grammar for one feature or one onboarding surface. Step 3, a compiler to the current configuration. Step 4, a case corpus and functional tests. Step 5, extend grammar coverage feature by feature. The grammar also informs a platform re-architecture designed to accept a desired-state document. Both paths lead to a surface generated from the document."
    build={build}
  >
    {STEPS.map((s, i) => (
      <g key={i} className={`step step-${i}`}>
        <g className="body">
          <Card x={MX} y={rowY(i)} w={MW} h={H} fill="var(--raised)" />
          <Label x={MX + 58} y={rowY(i) + H / 2 + (s.tag ? -11 : 0)} lines={s.title} size={18} weight={600} />
          {s.tag && <Tag x={MX + 58} y={rowY(i) + H / 2 + 22} text={s.tag} />}
        </g>
        <g className="chip"><Chip x={MX + 30} y={rowY(i) + H / 2} n={i + 1} fill="var(--shared)" text="var(--shared-text)" /></g>
      </g>
    ))}
    {[1, 2, 3, 4, 5].map((i) => (
      <Arrow key={i} className={`a-${i}`} pts={[[mc, rowY(i - 1) + H + 2], [mc, rowY(i) - 2]]} />
    ))}
    <Arrow className="informs" pts={informs} dashed />
    <Tag className="l-informs" x={(MX + MW + FX + FW / 2) / 2 + 6} y={rowY(1) + H / 2 - 12} text="informs" anchor="middle" />
    <g className="branch">
      <Card x={FX} y={FY} w={FW} h={FH} fill="var(--shared)" stroke="var(--shared)" />
      <Label x={FX + 18} y={FY + 38} lines={['Platform', 're-architecture']} size={18} weight={600} color="var(--shared-text)" />
      <Label x={FX + 18} y={FY + 94} lines={['designed to accept a', 'desired-state document']} size={16} weight={400} color="var(--shared-text)" />
    </g>
    <Arrow className="a-join" pts={joinF} />
    <g className="step-g">
      <Card x={MX} y={GY} w={GW} h={H} fill="var(--tenant)" stroke="var(--tenant)" />
      <Label x={MX + GW / 2} y={GY + H / 2} lines={['Surface generated from the document']} size={19} weight={600} anchor="middle" color="var(--tenant-text)" />
    </g>
  </Figure>
);
