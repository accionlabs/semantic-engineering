import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER } from '../parts/Act3';
import { TraversePath, traversePoints } from '../parts/Graph';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { AgentIcon } from '../parts/Landscape';
import { C, F } from '../theme';

// Scene 13. What does impact analysis tell you, and when does it run? It follows the links from a
// specification to what it touches; a readable report for people, item IDs for agents; it runs at three
// points; the saved-search example and its findings.
const HOPS = ['outcome', 'component', 'service', 'function'];
const WHEN = [
  { label: 'specification written', x: STATIONS[0].x },
  { label: 'code written', x: STATIONS[1].x },
  { label: 'pull request, whole history', x: STATIONS[2].x + 105 },
];

export const scene13: SceneDef = {
  n: 13,
  id: 'impact-analysis',
  View: () => (
    <Frame act="Act 3" scene="Scene 13 · What does impact analysis tell you, and when does it run?">
      <Svg>
        <Base named />
        <TraversePath className="pre path" />
        {traversePoints().map((p, i) => (
          <g key={i} className={`pre hop hop-${i}`}>
            <circle cx={p.x} cy={p.y} r={13} fill="none" stroke={C.text} strokeWidth={3} />
            <text x={p.x + 22} y={p.y + 6} fontFamily={F.mono} fontSize={14} fill={C.text}>{HOPS[i]}</text>
          </g>
        ))}
        <g className="pre for-people">
          <Person x={420} y={LOWER.y + 30} r={13} colour={C.people} />
          <Card className="rep" x={460} y={LOWER.y + 4} w={300} h={70} lines={4} tone={C.text} />
          <text x={610} y={LOWER.y + 98} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>readable report, for people</text>
        </g>
        <g className="pre for-agents">
          <AgentIcon x={1060} y={LOWER.y + 40} />
          <rect x={1100} y={LOWER.y + 4} width={300} height={70} rx={6} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.8} />
          {['F-0412', 'D-1180', 'A-0077', 'C-5521'].map((t, i) => <text key={t} x={1116 + (i % 2) * 140} y={LOWER.y + 32 + Math.floor(i / 2) * 26} fontFamily={F.mono} fontSize={15} fill={C.text}>{t}</text>)}
          <text x={1250} y={LOWER.y + 98} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>item IDs, for agents</text>
        </g>
        <g className="pre when">
          {WHEN.map((w, i) => (
            <g key={w.label} className={`w w-${i}`}>
              <circle cx={w.x} cy={Y.flow + 64} r={9} fill={C.text} />
              <text x={w.x} y={Y.flow + 92} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>{w.label}</text>
            </g>
          ))}
        </g>
        <g className="pre feature">
          <rect x={150} y={LOWER.y + 4} width={560} height={46} rx={8} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={2} />
          <text x={170} y={LOWER.y + 34} fontFamily={F.sans} fontSize={20} fill={C.text}>Choose alert frequency: daily, weekly or off</text>
          <text x={170} y={LOWER.y + 76} fontFamily={F.mono} fontSize={14} fill={C.muted}>1.6 million line application</text>
        </g>
        {[0, 1, 2].map((i) => <rect key={i} className={`pre slot slot-${i}`} x={760 + i * 340} y={LOWER.y + 4} width={320} height={70} rx={8} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 5" />)}
        <g className="pre f-0"><text x={780} y={LOWER.y + 36} fontFamily={F.sans} fontSize={18} fill={C.text}>column already exists</text><text x={780} y={LOWER.y + 60} fontFamily={F.sans} fontSize={16} fill={C.pass}>no database change</text></g>
        <g className="pre f-1"><text x={1120} y={LOWER.y + 36} fontFamily={F.sans} fontSize={18} fill={C.text}>weekly also gets daily</text><text x={1120} y={LOWER.y + 60} fontFamily={F.sans} fontSize={16} fill={C.warn}>likely, serious: add a filter</text></g>
        <g className="pre f-2"><text x={1460} y={LOWER.y + 36} fontFamily={F.sans} fontSize={18} fill={C.text}>deploy order</text><text x={1460} y={LOWER.y + 60} fontFamily={F.mono} fontSize={16} fill={C.text}>repo 1 → 2 → 3</text></g>
      </Svg>
      <Callout className="pre co-continue" x={1180} y={GAP_Y - 8} w={480} kind="When an agent owns the work" text="It reads the IDs and continues" tone={C.text} target="impact.outputs" />
      <Callout className="pre chip-days" x={1080} y={GAP_Y - 8} w={640} kind="A comparable analysis by hand" text="3 to 5 working days for a senior engineer" tone={C.text} target="fig.senior-days" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.g .nlabel'), { opacity: 0.35 }, 0);
    // s1: follow the links from a specification to everything it touches.
    const s1 = cue('traverse', 's0');
    tl.fromTo(q('.path'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 2.4, ease: 'none' }, s1 + 0.3);
    [0, 1, 2, 3].forEach((i) => appear(ctx, `.hop-${i}`, s1 + 0.3 + i * 0.75, { y: 0 }));
    // s2 and s3: two forms of output.
    const s2 = cue('people', 's1');
    appear(ctx, '.for-people', s2 + 0.2);
    const s3 = cue('agents', 's2');
    appear(ctx, '.for-agents', s3 + 0.2);
    // s4: an agent continues without waiting.
    const s4 = cue('continue', 's3');
    tl.to(q('.for-people'), { opacity: 0.3, duration: 0.3 }, s4);
    appear(ctx, '.co-continue', s4 + 0.3);
    // s5: when it runs.
    const s5 = cue('when', 's4');
    vanish(ctx, '.co-continue, .for-people, .for-agents, .path, .hop', s5);
    tl.set(q('.when'), { autoAlpha: 1 }, s5 + 0.2);
    WHEN.forEach((_, i) => tl.fromTo(q(`.w-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.4 }, s5 + 0.3 + i * 1.0));
    // s6 to s10: the saved-search example and its three findings.
    const s6 = cue('example', 's5');
    vanish(ctx, '.when', s6);
    appear(ctx, '.feature', s6 + 0.2);
    const s7 = cue('three', 's6');
    vanish(ctx, '.feature', s7 + 3.0);
    [0, 1, 2].forEach((i) => appear(ctx, `.slot-${i}`, s7 + 0.3 + i * 0.3, { y: 0 }));
    appear(ctx, '.f-0', cue('db', 's7') + 0.2);
    appear(ctx, '.f-1', cue('risk', 's8') + 0.2);
    appear(ctx, '.f-2', cue('order', 's9') + 0.2);
    // s11: a senior engineer would need days.
    const s11 = cue('days', 's10');
    appear(ctx, '.chip-days', s11 + 0.2);
  },
};
