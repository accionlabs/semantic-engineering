import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, GATE_X, LOWER, Mark } from '../parts/Act3';
import { GY, item } from '../parts/Graph';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';
import { GraphSync, syncMerge, syncUpdate } from '../parts/Sync';

// Scene 15. How is each change checked, and how does the graph stay current? The PR Validation Agent
// compares the change with the impact report and the four layers; test scenarios come from the
// functional layer; the graph is updated before the pull request merges.
const REASONS: [typeof KINDS[number]['id'], string][] = [['functional', 'misses a required outcome'], ['design', 'duplicates a component'], ['architecture', 'crosses a service boundary'], ['code', 'breaks a dependent']];
const PR = STATIONS[2];

export const scene15: SceneDef = {
  n: 15,
  id: 'checked-and-current',
  View: () => (
    <Frame act="Act 3" scene="Scene 15 · How is each change checked, and how does the graph stay current?">
      <Svg>
        <Base />
        <text className="pre gate-label" x={GATE_X} y={Y.flow + 72} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>PR Validation Agent</text>
        <rect className="pre tok" x={PR.x - 18} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
        <g className="pre compare">
          <Card className="cmp-r" x={GATE_X - 330} y={GAP_Y + 6} w={150} h={40} label="impact report" tone={C.text} />
          <Card className="cmp-c" x={GATE_X - 170} y={GAP_Y + 6} w={150} h={40} label="the change" tone={C.text} />
          {KINDS.map((k, i) => <line key={k.id} x1={GATE_X} y1={Y.flow - 52} x2={GATE_X - 60 + i * 40} y2={GY[k.id] + 27} stroke={C.layer[k.id]} strokeWidth={2} />)}
        </g>
        {REASONS.map(([k, t]) => (
          <g key={k} className={`pre reason reason-${k}`}>
            <rect x={150} y={LOWER.y + 4} width={430} height={40} rx={8} fill={C.canvasRaised} stroke={C.layer[k]} strokeWidth={2} />
            <text x={170} y={LOWER.y + 30} fontFamily={F.sans} fontSize={19} fill={C.text}>{t}</text>
          </g>
        ))}
        <g className="pre failcard">
          <rect x={620} y={LOWER.y + 4} width={430} height={40} rx={8} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
          <text x={640} y={LOWER.y + 30} fontFamily={F.mono} fontSize={15} fill={C.warn}>violation · graph item · how to fix</text>
          <Person x={1100} y={LOWER.y + 14} r={12} colour={C.people} />
        </g>
        <g className="pre pipeline">
          <rect x={1250} y={LOWER.y + 4} width={460} height={40} rx={8} fill="none" stroke={C.muted} strokeDasharray="6 5" />
          <text x={1480} y={LOWER.y + 30} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.muted}>style · lint · unit tests: existing pipeline</text>
        </g>
        <g className="pre scenarios">
          {[0, 1, 2].map((i) => (
            <g key={i}><rect x={150 + i * 300} y={LOWER.y + 60} width={280} height={56} rx={6} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={1.5} />
              <text x={166 + i * 300} y={LOWER.y + 84} fontFamily={F.mono} fontSize={13} fill={C.layer.functional}>given · when · then</text>
              <text x={166 + i * 300} y={LOWER.y + 104} fontFamily={F.sans} fontSize={15} fill={C.text}>{['weekly users get one email', 'off means no email', 'daily stays daily'][i]}</text></g>
          ))}
          <line x1={item('functional', 2).x} y1={item('functional', 2).y} x2={300} y2={LOWER.y + 60} stroke={C.layer.functional} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>
        <GraphSync />
        <Mark className="pre pass" x={GATE_X} y={Y.flow + 100} />
      </Svg>
      <Callout className="pre co-gate" x={1180} y={GAP_Y - 8} w={480} kind="Every pull request" text="Checked before it can merge" tone={C.text} target="agent.pr-validation" />
      <Callout className="pre co-sync" x={150} y={GAP_Y - 8} w={720} kind="KG Sync Agent" text="Updates the graph before the pull request merges" tone={C.layer.code} target="agent.kg-sync" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: every pull request goes through the PR Validation Agent.
    const s1 = cue('pr', 's0');
    appear(ctx, '.tok', s1);
    tl.to(q('.tok'), { attr: { x: GATE_X - 50 }, duration: 1.0 }, s1 + 0.3);
    appear(ctx, '.gate-label', s1 + 0.6);
    appear(ctx, '.co-gate', s1 + 1.0);
    // s2: compared with the impact report and the four layers.
    const s2 = cue('compare', 's1');
    vanish(ctx, '.co-gate', s2);
    appear(ctx, '.compare', s2 + 0.2, { y: 0 });
    // s3: why a check fails.
    const s3 = cue('reasons', 's2');
    vanish(ctx, '.compare', s3 + 0.2);
    REASONS.forEach(([k], i) => {
      const at = s3 + 0.3 + i * 1.3;
      appear(ctx, `.reason-${k}`, at);
      tl.to(q('.g.band'), { opacity: 0.3, duration: 0.2 }, at);
      tl.to(q(`.band-${k}`), { opacity: 1, duration: 0.2 }, at);
      if (i < 3) vanish(ctx, `.reason-${k}`, at + 1.2);
    });
    // s4: a failure names the violation; a mismatch goes to a person.
    const s4 = cue('failure', 's3');
    tl.to(q('.g.band'), { opacity: 1, duration: 0.3 }, s4);
    appear(ctx, '.failcard', s4 + 0.2);
    // s5: style and unit tests stay in the existing pipeline.
    const s5 = cue('pipeline', 's4');
    appear(ctx, '.pipeline', s5 + 0.2);
    // s6: test scenarios from the functional layer.
    const s6 = cue('scenarios', 's5');
    vanish(ctx, '.reason, .failcard, .pipeline', s6);
    appear(ctx, '.scenarios', s6 + 0.2);
    // s7: the graph is updated before the pull request merges.
    const s7 = cue('sync', 's6');
    vanish(ctx, '.scenarios', s7);
    tl.to(q('.tok'), { attr: { x: PR.x - 18 }, duration: 0.6 }, s7);
    vanish(ctx, '.tok', s7 + 0.6, { duration: 0.1 });
    syncUpdate(ctx, s7 + 0.6);
    appear(ctx, '.co-sync', s7 + 0.8);
    // s8: the change merges; the graph matches the main branch.
    const s8 = cue('merge', 's7');
    vanish(ctx, '.co-sync', s8);
    syncMerge(ctx, s8 + 0.2);
    appear(ctx, '.pass', s8 + 0.6, { y: 0 });
  },
};
