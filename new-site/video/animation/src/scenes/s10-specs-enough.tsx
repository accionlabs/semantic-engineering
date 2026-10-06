import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER, Mark } from '../parts/Act3';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 10. When are specifications not enough? Fine for small tasks, and for a small application with a
// spec per change; as the application grows complex, four limits appear; the graph sits alongside the specification and supplies the rest.
const SPEC = STATIONS[0];

export const scene10: SceneDef = {
  n: 10,
  id: 'when-specs-are-not-enough',
  View: () => (
    <Frame act="Act 3" scene="Scene 10 · When are specifications not enough?">
      <Svg>
        <Base gate={false} />
        {[0, 1, 2].map((i) => <rect key={i} className={`pre task task-${i}`} x={STATIONS[1].x - 14} y={Y.flow + 50} width={28} height={14} rx={3} fill={C.text} />)}
        {[0, 1, 2].map((i) => <Mark key={i} className={`pre tick tick-${i}`} x={STATIONS[3].x - 40 + i * 40} y={Y.flow + 58} />)}
        <Card className="pre spec" x={SPEC.x - 75} y={Y.flow - 104} w={150} h={50} lines={3} />
        <g className="pre lanes">
          {['a large existing system', 'a legacy code base', 'work across team boundaries'].map((t, i) => (
            <g key={t} className={`cx cx-${i}`}>
              <rect x={150 + i * 548} y={LOWER.y + 10} width={524} height={56} rx={10} fill={C.canvasRaised} stroke={C.warn} strokeWidth={1.8} />
              <text x={412 + i * 548} y={LOWER.y + 46} textAnchor="middle" fontFamily={F.sans} fontSize={21} fill={C.text}>{t}</text>
            </g>
          ))}
        </g>
        <circle className="pre local" cx={SPEC.x} cy={Y.flow - 79} r={95} fill="none" stroke={C.warn} strokeWidth={2} strokeDasharray="6 6" />
        <g className="pre drift">
          <Card className="drift-card" x={STATIONS[3].x - 75} y={Y.flow - 104} w={150} h={50} lines={3} tone={C.warn} />
        </g>
        <g className="pre onelayer">
          <rect x={SPEC.x - 50} y={Y.flow - 132} width={100} height={22} rx={5} fill={C.layer.functional} />
          <text x={SPEC.x} y={Y.flow - 116} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.canvas}>FUNCTIONAL</text>
        </g>
        <g className="pre queue">
          {[0, 1, 2, 3].map((i) => <Card key={i} className={`q q-${i}`} x={SPEC.x - 240 - i * 18} y={Y.flow - 100 + i * 8} w={110} h={40} lines={2} tone={C.warn} />)}
        </g>
        <text className="pre lab-change" x={SPEC.x} y={Y.flow - 116} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>the change</text>
        <text className="pre lab-app" x={960} y={GAP_Y + 50} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.text}>the application the change lands in</text>
      </Svg>
      <Callout className="pre co-team" x={1180} y={GAP_Y} w={420} kind="A small application" text="A written specification for each change" tone={C.text} target="spec.one-team" />
      <Callout className="pre co-local" x={1180} y={GAP_Y} w={420} kind="Limit 1" text="Local context" tone={C.warn} target="limit.local-context" />
      <Callout className="pre co-drift" x={1180} y={GAP_Y} w={420} kind="Limit 2" text="Drift from the code" tone={C.warn} target="limit.drift" />
      <Callout className="pre co-one" x={1180} y={GAP_Y} w={420} kind="Limit 3" text="One layer only" tone={C.warn} target="limit.one-layer" />
      <Callout className="pre co-queue" x={1180} y={GAP_Y} w={420} kind="Limit 4" text="Writing specifications is the bottleneck" tone={C.warn} target="limit.bottleneck" />
      <Callout className="pre co-graph" x={1180} y={GAP_Y} w={560} kind="Alongside the specification" text="Design, architecture and code knowledge" tone={C.text} target="graph.alongside-spec" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.g, .tie, .top'), { opacity: 0.15 }, 0);
    tl.set(q('.cx'), { autoAlpha: 0 }, 0);
    // s1: small tasks pass quickly.
    const s1 = cue('small', 's0');
    [0, 1, 2].forEach((i) => {
      tl.set(q(`.task-${i}`), { autoAlpha: 1 }, s1 + i * 0.8);
      tl.fromTo(q(`.task-${i}`), { attr: { x: STATIONS[1].x - 14 } }, { attr: { x: STATIONS[3].x - 54 + i * 40 }, duration: 1, ease: 'power1.inOut' }, s1 + i * 0.8);
      appear(ctx, `.tick-${i}`, s1 + 1 + i * 0.8, { y: 0 });
    });
    // s2: a small application, a specification per change.
    const s2 = cue('spec', 's1');
    vanish(ctx, '.task, .tick', s2);
    appear(ctx, '.spec', s2 + 0.2);
    appear(ctx, '.co-team', s2 + 0.6);
    // s3: the application grows complex: a large existing system, legacy code, work across teams.
    const s3 = cue('teams', 's2');
    vanish(ctx, '.co-team', s3);
    tl.set(q('.lanes'), { autoAlpha: 1 }, s3 + 0.2);
    [0, 1, 2].forEach((i) => tl.fromTo(q(`.cx-${i}`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, s3 + 0.3 + i * 1.2));
    // s4 to s7: the four limits.
    const s4 = cue('local', 's3');
    appear(ctx, '.local', s4, { y: 0 });
    appear(ctx, '.co-local', s4 + 0.3);
    const s5 = cue('drift', 's4');
    vanish(ctx, '.co-local, .local', s5);
    appear(ctx, '.drift', s5);
    tl.to(q('.drift-card'), { opacity: 0.3, duration: 1.4 }, s5 + 0.6);
    appear(ctx, '.co-drift', s5 + 0.3);
    const s6 = cue('one', 's5');
    vanish(ctx, '.co-drift, .drift', s6);
    appear(ctx, '.onelayer', s6);
    tl.to(q('.top .lbl-functional'), { opacity: 1, duration: 0.3 }, s6 + 0.3);
    appear(ctx, '.co-one', s6 + 0.3);
    const s7 = cue('queue', 's6');
    vanish(ctx, '.co-one, .onelayer', s7);
    tl.to(q('.top .lbl-functional'), { opacity: 0.15, duration: 0.3 }, s7);
    appear(ctx, '.queue', s7, { y: 0 });
    appear(ctx, '.co-queue', s7 + 0.3);
    // s8: the graph alongside the specification.
    const s8 = cue('graph', 's7');
    vanish(ctx, '.co-queue, .queue, .lanes', s8);
    tl.to(q('.g, .tie, .top, .top .lbl'), { opacity: 1, duration: 0.8 }, s8 + 0.2);
    appear(ctx, '.co-graph', s8 + 0.6);
    // s9: the change, and the application it lands in.
    const s9 = cue('labels', 's8');
    vanish(ctx, '.co-graph', s9);
    appear(ctx, '.lab-change', s9 + 0.2);
    appear(ctx, '.lab-app', s9 + 0.6);
  },
};
