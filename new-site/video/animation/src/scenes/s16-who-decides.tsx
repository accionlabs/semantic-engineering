import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { Base, GAP_Y, LOWER, Owners } from '../parts/Act3';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 16. Who decides which work agents do? A human owner for every agent; people triage work in
// sprint planning; repeatable work goes to agents with a record; new scope stays with people; autonomy
// is earned over five levels, recorded, and withdrawn when results fall.
const PATTERNS = ['support request', 'customization', 'workflow change', 'form change', 'new field', 'custom report'];
const LEVELS = ['Suggest', 'Assist', 'Execute under approval', 'Execute with audit', 'Execute autonomously'];
const LAD = { x: 1240, y: LOWER.y + 128 };

export const scene16: SceneDef = {
  n: 16,
  id: 'who-decides',
  View: () => (
    <Frame act="Act 3" scene="Scene 16 · Who decides which work agents do?">
      <Svg>
        <Base />
        <Owners className="pre owners" />
        <g className="pre board">
          <text x={150} y={LOWER.y} fontFamily={F.mono} fontSize={14} letterSpacing={2} fill={C.muted}>SPRINT PLANNING</text>
          <text x={150} y={LOWER.y + 26} fontFamily={F.mono} fontSize={14} fill={C.text}>PEOPLE</text>
          <text x={560} y={LOWER.y + 26} fontFamily={F.mono} fontSize={14} fill={C.text}>AGENTS</text>
          <line x1={540} y1={LOWER.y + 10} x2={540} y2={LOWER.y + 140} stroke={C.hairline} strokeWidth={2} />
        </g>
        {PATTERNS.map((p, i) => (
          <g key={p} className={`pre pat pat-${i}`}>
            <rect x={560 + (i % 2) * 230} y={LOWER.y + 38 + Math.floor(i / 2) * 36} width={220} height={30} rx={6} fill={C.canvasRaised} stroke={C.text} />
            <text x={572 + (i % 2) * 230} y={LOWER.y + 58 + Math.floor(i / 2) * 36} fontFamily={F.sans} fontSize={16} fill={C.text}>{p}</text>
          </g>
        ))}
        <g className="pre record">{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1040 + i * 18} cy={LOWER.y + 53} r={6} fill={C.pass} />)}</g>
        <g className="pre newfeature">
          <rect x={150} y={LOWER.y + 38} width={260} height={30} rx={6} fill={C.canvasRaised} stroke={C.layer.functional} />
          <text x={162} y={LOWER.y + 58} fontFamily={F.sans} fontSize={16} fill={C.text}>new feature</text>
        </g>
        <g className="pre ladder">
          {LEVELS.map((l, i) => (
            <g key={l} className={`step step-${i}`}>
              <rect x={LAD.x + i * 96} y={LAD.y - 24 - i * 22} width={92} height={22 + i * 22} rx={4} fill={C.canvasRaised} stroke={C.muted} />
              <text x={LAD.x + i * 96 + 46} y={LAD.y - 30 - i * 22} textAnchor="middle" fontFamily={F.mono} fontSize={11} fill={C.muted}>{i + 1}</text>
            </g>
          ))}
          <text className="lvlname" x={LAD.x} y={LAD.y + 20} fontFamily={F.mono} fontSize={13} fill={C.text}>{LEVELS[0]} → {LEVELS[4]}</text>
          <circle className="climber" cx={LAD.x + 46} cy={LAD.y - 36} r={9} fill={C.text} />
        </g>
        <g className="pre agreement">
          <rect x={LAD.x - 250} y={LOWER.y + 10} width={220} height={112} rx={8} fill={C.canvasRaised} stroke={C.text} />
          {['evidence', 'threshold', 'approved by', 'step back if'].map((t, i) => <text key={t} x={LAD.x - 234} y={LOWER.y + 38 + i * 24} fontFamily={F.mono} fontSize={14} fill={C.text}>{t}</text>)}
        </g>
      </Svg>
      <Callout className="pre co-owner" x={1180} y={GAP_Y - 8} w={480} kind="Every agent" text="Has a named human owner" tone={C.text} target="agents.owner" />
      <Callout className="pre co-l4" x={1180} y={GAP_Y - 8} w={520} kind="Impact Analysis, PR Validation" text="Level 4: people review on a schedule" tone={C.text} target="autonomy.levels" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const stepX = (i: number) => LAD.x + i * 96 + 46;
    const stepY = (i: number) => LAD.y - 36 - i * 22;
    // s1: a human owner for every agent.
    const s1 = cue('owner', 's0');
    appear(ctx, '.owners', s1 + 0.2);
    appear(ctx, '.co-owner', s1 + 0.6);
    // s2: people decide, in sprint planning.
    const s2 = cue('triage', 's1');
    vanish(ctx, '.co-owner', s2);
    appear(ctx, '.board', s2 + 0.2);
    // s3: repeatable work suits an agent.
    const s3 = cue('patterns', 's2');
    PATTERNS.forEach((_, i) => appear(ctx, `.pat-${i}`, s3 + 0.2 + i * 0.3));
    // s4: once it has a record of reliable results.
    const s4 = cue('record', 's3');
    appear(ctx, '.record', s4 + 0.2);
    // s5: new scope stays with people.
    const s5 = cue('newscope', 's4');
    appear(ctx, '.newfeature', s5 + 0.2);
    tl.to(q('.top .cus-functional, .top .cus-design, .top .cus-architecture'), { opacity: 1, duration: 0.2 }, s5 + 0.4);
    // s6: five levels of autonomy.
    const s6 = cue('levels', 's5');
    vanish(ctx, '.board, .pat, .record, .newfeature', s6);
    appear(ctx, '.ladder', s6 + 0.2);
    // s7: each step up recorded in a written agreement.
    const s7 = cue('agreement', 's6');
    tl.to(q('.climber'), { attr: { cx: stepX(1), cy: stepY(1) }, duration: 0.6 }, s7 + 0.3);
    appear(ctx, '.agreement', s7 + 0.6);
    // s8: results fall: step back down.
    const s8 = cue('demote', 's7');
    tl.to(q('.climber'), { attr: { cx: stepX(2), cy: stepY(2) }, duration: 0.5 }, s8 + 0.1);
    tl.to(q('.climber'), { attr: { fill: C.warn }, duration: 0.2 }, s8 + 0.9);
    tl.to(q('.climber'), { attr: { cx: stepX(1), cy: stepY(1) }, duration: 0.5 }, s8 + 1.2);
    // s9: the analysis and check agents at level 4.
    const s9 = cue('four', 's8');
    vanish(ctx, '.agreement', s9);
    tl.to(q('.climber'), { attr: { cx: stepX(3), cy: stepY(3), fill: C.text }, duration: 0.8 }, s9 + 0.2);
    appear(ctx, '.co-l4', s9 + 0.6);
  },
};
