import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Custodians, Defs, Flow, Head, KindLabels, Y } from '../parts/Landscape';
import { Bands, Ties } from '../parts/Graph';
import { FigureChip, Frame, Person, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 9. Two kinds of graph. New and existing applications keep changing, so they share the
// four-layer graph; a legacy modernization has a fixed end state, so its graph has a graph of the old
// system, a graph of the new one, and a specification between them. The same custodians govern both.
const L = { x: 260, w: 600 };
const R = { x: 1080, w: 620 };
const MINI_Y = 330;
const TAGS = [
  { id: 'green', text: 'Greenfield: build new', from: 360, to: 400 },
  { id: 'brown', text: 'Brownfield: change existing', from: 960, to: 760 },
  { id: 'legacy', text: 'Legacy modernization: replace', from: 1560, to: 1390 },
];
const COLS = [
  { label: 'graph of the old system', colour: C.layer.code },
  { label: 'specification', colour: C.card },
  { label: 'graph of the new system', colour: C.layer.architecture },
];

const MiniLayers: React.FC<{ className: string; x: number; w: number }> = ({ className, x, w }) => (
  <g className={className}>
    {KINDS.map((k, i) => (
      <g key={k.id}>
        <rect x={x} y={MINI_Y + i * 44} width={w} height={34} rx={8} fill={C.canvasRaised} stroke={C.layer[k.id]} strokeWidth={1.8} />
        <text x={x + 12} y={MINI_Y + i * 44 + 22} fontFamily={F.mono} fontSize={12} letterSpacing={1.2} fill={C.layer[k.id]}>{k.label.toUpperCase()}</text>
      </g>
    ))}
  </g>
);

export const scene09: SceneDef = {
  n: 9,
  id: 'two-kinds-of-graph',
  View: () => (
    <Frame act="Act 2" scene="Scene 9 · Two kinds of graph">
      <Svg>
        <Defs />
        <g className="land">
          <g className="top"><KindLabels /><Custodians /></g>
          <Bands className="g" named={false} />
        <Ties />
          <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        </g>
        {TAGS.map((t) => (
          <g key={t.id} className={`pre tag tag-${t.id}`}>
            <rect x={t.from - 160} y={124} width={320} height={40} rx={20} fill={C.canvasRaised} stroke={C.text} />
            <text x={t.from} y={150} textAnchor="middle" fontFamily={F.sans} fontSize={19} fontWeight={500} fill={C.text}>{t.text}</text>
          </g>
        ))}
        <g className="pre heads">
          <text x={L.x + L.w / 2} y={214} textAnchor="middle" fontFamily={F.mono} fontSize={17} letterSpacing={2} fill={C.text}>END STATE KEEPS CHANGING</text>
          <text className="head-r" x={R.x + R.w / 2} y={214} textAnchor="middle" fontFamily={F.mono} fontSize={17} letterSpacing={2} fill={C.text}>END STATE FIXED IN ADVANCE</text>
          <line x1={960} y1={120} x2={960} y2={600} stroke={C.hairline} strokeWidth={2} />
        </g>
        <g className="pre owners">
          {[0, 1, 2, 3].map((i) => <Person key={`l${i}`} x={L.x + 180 + i * 80} y={262} r={11} colour={C.people} />)}
          {[0, 1, 2, 3].map((i) => <Person key={`r${i}`} x={R.x + 190 + i * 80} y={262} r={11} colour={C.people} />)}
        </g>
        <MiniLayers className="pre mini-l" x={L.x} w={L.w} />
        <g className="pre grow">
          {Array.from({ length: 10 }, (_, i) => <circle key={i} className={`gdot gdot-${i}`} cx={L.x + 120 + (i % 5) * 50} cy={MINI_Y + 17 + Math.floor(i / 5) * 44 + (i % 2) * 88} r={6} fill={C.text} />)}
        </g>
        <g className="pre extract">
          <rect x={L.x + 340} y={540} width={220} height={50} rx={8} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={1.8} />
          <text x={L.x + 450} y={571} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.layer.code}>existing code</text>
          <line x1={L.x + 450} y1={538} x2={L.x + 450} y2={MINI_Y + 3 * 44 + 48} stroke={C.text} strokeWidth={2} />
          <Head x={L.x + 450} y={MINI_Y + 3 * 44 + 38} from={{ x: L.x + 450, y: 538 }} colour={C.text} />
        </g>
        <g className="pre pin"><circle cx={R.x + R.w - 10} cy={206} r={10} fill={C.warn} /><line x1={R.x + R.w - 10} y1={216} x2={R.x + R.w - 10} y2={232} stroke={C.warn} strokeWidth={3} /></g>
        <g className="pre cols">
          {COLS.map((c, i) => (
            <g key={c.label} className={`colm colm-${i}`}>
              <rect x={R.x + i * 214} y={MINI_Y} width={190} height={170} rx={10} fill={C.canvasRaised} stroke={c.colour} strokeWidth={2} />
              {[0, 1, 2, 3].map((r) => <rect key={r} x={R.x + i * 214 + 22} y={MINI_Y + 24 + r * 30} width={i === 1 ? 146 : 110 + (r % 2) * 30} height={8} rx={4} fill={c.colour} opacity={0.7} />)}
              <text x={R.x + i * 214 + 95} y={MINI_Y + 196} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.text}>{c.label}</text>
            </g>
          ))}
        </g>
        <MiniLayers className="pre mini-r" x={R.x} w={R.w} />
        <text className="pre after" x={R.x + R.w / 2} y={MINI_Y + 200} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.muted}>after the modernization completes</text>
        <g className="pre axis">
          <line x1={330} y1={Y.flow + 92} x2={1580} y2={Y.flow + 92} stroke={C.text} strokeWidth={2} />
          <Head x={1592} y={Y.flow + 92} from={{ x: 330, y: Y.flow + 92 }} colour={C.text} />
          {['one developer', 'one team', 'several teams'].map((t, i) => <text key={t} x={420 + i * 520} y={Y.flow + 122} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.text}>{t}</text>)}
          <text x={330} y={Y.flow + 150} fontFamily={F.mono} fontSize={13} fill={C.muted}>complexity of the work</text>
        </g>
      </Svg>
      <FigureChip className="pre chip-extract" x={L.x + 590} y={510} w={300} figure="2 to 3 weeks" label="to extract the graph of 2M+ lines, typically" source="_index.md#numbers-from-real-engagements" target="fig.extraction" />
      <div className="pre co-same" style={{ position: 'absolute', left: 760, top: 170, width: 400, textAlign: 'center', fontFamily: F.mono, fontSize: 15, letterSpacing: 1.5, color: C.text }}>THE SAME FOUR CUSTODIAN ROLES</div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: three kinds of work.
    const s1 = cue('kinds', 's0');
    tl.to(q('.land'), { opacity: 0.07, duration: 0.6 }, s1);
    TAGS.forEach((t, i) => appear(ctx, `.tag-${t.id}`, s1 + 0.4 + i * 0.5));
    // s2: two shapes of graph, by whether the end state keeps changing.
    const s2 = cue('two', 's1');
    TAGS.forEach((t) => tl.to(q(`.tag-${t.id}`), { x: t.to - t.from, duration: 0.8 }, s2 + 0.3));
    appear(ctx, '.heads', s2 + 0.8);
    // s3: new and existing applications share the four-layer graph.
    const s3 = cue('share', 's2');
    tl.to(q('.tag-legacy, .head-r'), { opacity: 0.3, duration: 0.3 }, s3);
    appear(ctx, '.mini-l', s3 + 0.3);
    // s4: greenfield grows its graph; brownfield extracts it.
    const s4 = cue('grow', 's3');
    tl.set(q('.grow'), { autoAlpha: 1 }, s4);
    Array.from({ length: 10 }, (_, i) => tl.fromTo(q(`.gdot-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.2 }, s4 + 0.2 + i * 0.18));
    appear(ctx, '.extract', s4 + 2.4);
    // s5: two to three weeks.
    const s5 = cue('weeks', 's4');
    appear(ctx, '.chip-extract', s5 + 0.2);
    // s6: legacy modernization: a fixed end state.
    const s6 = cue('fixed', 's5');
    vanish(ctx, '.chip-extract', s6);
    tl.to(q('.mini-l, .grow, .extract, .tag-green, .tag-brown'), { opacity: 0.3, duration: 0.3 }, s6);
    tl.to(q('.tag-legacy, .head-r'), { opacity: 1, duration: 0.3 }, s6);
    appear(ctx, '.pin', s6 + 0.4);
    // s7: its three parts.
    const s7 = cue('three', 's6');
    tl.set(q('.cols'), { autoAlpha: 1 }, s7);
    COLS.forEach((_, i) => tl.fromTo(q(`.colm-${i}`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, s7 + 0.3 + i * 0.7));
    // s8: the same four custodian roles govern both.
    const s8 = cue('same', 's7');
    tl.to(q('.mini-l, .grow, .extract, .tag-green, .tag-brown'), { opacity: 1, duration: 0.3 }, s8);
    appear(ctx, '.owners', s8 + 0.2);
    appear(ctx, '.co-same', s8 + 0.5);
    // s9: when a modernization completes, its graph becomes a four-layer graph.
    const s9 = cue('converts', 's8');
    vanish(ctx, '.cols, .pin', s9 + 0.2);
    appear(ctx, '.mini-r', s9 + 0.8);
    appear(ctx, '.after', s9 + 1.2);
    // s10: the right process for continuous work depends on the complexity of the work.
    const s10 = cue('complexity', 's9');
    vanish(ctx, '.tag, .heads, .owners, .co-same, .mini-l, .grow, .extract, .mini-r, .after', s10);
    tl.to(q('.land'), { opacity: 1, duration: 0.8 }, s10 + 0.3);
    appear(ctx, '.axis', s10 + 0.9, { y: 0 });
  },
};
