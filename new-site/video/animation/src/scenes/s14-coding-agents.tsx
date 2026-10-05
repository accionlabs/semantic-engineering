import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER } from '../parts/Act3';
import { item } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 14. How do coding agents use the graph? Through the MCP server; the impact report in the prompt;
// the agent cannot ignore it, and the specification says what to build; rules checked on the developer's
// machine; the code varies in detail only, so review moves to the details.
const LIT: [ 'design' | 'architecture' | 'code', number][] = [['design', 4], ['architecture', 4], ['code', 3]];

export const scene14: SceneDef = {
  n: 14,
  id: 'coding-agents',
  View: () => (
    <Frame act="Act 3" scene="Scene 14 · How do coding agents use the graph?">
      <Svg>
        <Base />
        <g className="pre tools">
          {['Claude Code', 'Cursor'].map((t, i) => (
            <g key={t}><rect x={AGENT.x - 150 + i * 160} y={LOWER.y + 4} width={150} height={36} rx={8} fill={C.canvasRaised} stroke={C.text} /><text x={AGENT.x - 75 + i * 160} y={LOWER.y + 28} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>{t}</text></g>
          ))}
        </g>
        <g className="pre mcp">
          <line x1={AGENT.x} y1={AGENT.y - 20} x2={AGENT.x} y2={item('code', 2).y + 10} stroke={C.text} strokeWidth={3} />
          <rect x={AGENT.x + 14} y={GAP_Y + 20} width={130} height={30} rx={6} fill={C.canvas} stroke={C.text} />
          <text x={AGENT.x + 79} y={GAP_Y + 40} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>MCP server</text>
        </g>
        <Card className="pre report" x={AGENT.x + 160} y={GAP_Y + 10} w={170} h={44} label="impact report" tone={C.text} />
        {LIT.map(([k, i], n) => <line key={n} className={`pre lit lit-${n}`} x1={item(k, i).x} y1={item(k, i).y} x2={AGENT.x + 20} y2={AGENT.y - 18} stroke={C.layer[k]} strokeWidth={2} />)}
        <g className="pre spec"><Card className="spec-card" x={STATIONS[0].x - 75} y={GAP_Y + 10} w={150} h={44} lines={3} /><text x={STATIONS[0].x} y={GAP_Y + 74} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>what to build</text></g>
        <g className="pre guard">
          <circle cx={AGENT.x - 150} cy={LOWER.y + 90} r={12} fill="none" stroke={C.layer.functional} strokeWidth={2.5} strokeDasharray="4 3" />
          <path d={`M${AGENT.x - 158} ${LOWER.y + 82} l16 16 M${AGENT.x - 142} ${LOWER.y + 82} l-16 16`} stroke={C.warn} strokeWidth={3} />
          <text x={AGENT.x - 128} y={LOWER.y + 96} fontFamily={F.mono} fontSize={14} fill={C.muted}>rule broken: stopped before it reaches the graph</text>
        </g>
        {[0, 1].map((n) => (
          <g key={n} className={`pre code code-${n}`}>
            <rect x={1080 + n * 330} y={LOWER.y} width={300} height={130} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
            <text x={1096 + n * 330} y={LOWER.y + 24} fontFamily={F.mono} fontSize={13} fill={C.muted}>alerts/service.ts · run {n + 1}</text>
            {[0, 1, 2, 3].map((r) => <rect key={r} className={r === (n ? 1 : 2) ? 'diff' : ''} x={1096 + n * 330} y={LOWER.y + 40 + r * 20} width={[220, 160, 200, 120][(r + n) % 4]} height={9} rx={3} fill={r === (n ? 1 : 2) ? C.warn : C.layer.code} />)}
          </g>
        ))}
        <rect className="pre same" x={1070} y={LOWER.y - 10} width={650} height={150} rx={12} fill="none" stroke={C.pass} strokeWidth={2} strokeDasharray="8 6" />
        <g className="pre question">
          <rect x={STATIONS[2].x - 110} y={Y.flow + 46} width={220} height={40} rx={8} fill={C.canvasRaised} stroke={C.text} />
          <text className="qtext" x={STATIONS[2].x} y={Y.flow + 72} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.text}>right files?</text>
        </g>
      </Svg>
      <Callout className="pre co-ignore" x={1180} y={GAP_Y - 8} w={480} kind="The coding agent" text="Cannot ignore the impact report" tone={C.text} target="agent.cannot-ignore" />
      <Callout className="pre co-detail" x={1180} y={GAP_Y - 8} w={520} kind="The impact report fixes the structure" text="The runs differ in detail only" tone={C.pass} target="variance.bounded" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: the coding agents developers already use.
    const s1 = cue('tools', 's0');
    appear(ctx, '.tools', s1 + 0.3);
    // s2: connected through the MCP server.
    const s2 = cue('mcp', 's1');
    appear(ctx, '.mcp', s2 + 0.2, { y: 0 });
    // s3: the impact report in the prompt.
    const s3 = cue('report', 's2');
    appear(ctx, '.report', s3 + 0.2);
    // s4: which services, components and tables to touch.
    const s4 = cue('lit', 's3');
    LIT.forEach((_, n) => appear(ctx, `.lit-${n}`, s4 + 0.2 + n * 0.3, { y: 0 }));
    // s5: it cannot ignore the report; the specification says what to build.
    const s5 = cue('ignore', 's4');
    vanish(ctx, '.lit', s5 + 2.5);
    appear(ctx, '.spec', s5 + 0.2);
    appear(ctx, '.co-ignore', s5 + 0.5);
    // s6: rules checked on the developer's machine.
    const s6 = cue('guard', 's5');
    vanish(ctx, '.co-ignore, .tools', s6);
    appear(ctx, '.guard', s6 + 0.2);
    // s7 and s8: two runs differ in detail; the structure is the same.
    const s7 = cue('variance', 's6');
    vanish(ctx, '.guard', s7);
    appear(ctx, '.code-0', s7 + 0.2);
    appear(ctx, '.code-1', s7 + 0.6);
    const s8 = cue('structure', 's7');
    appear(ctx, '.same', s8 + 0.2, { y: 0 });
    appear(ctx, '.co-detail', s8 + 0.4);
    // s9: review moves to the details.
    const s9 = cue('review', 's8');
    vanish(ctx, '.co-detail', s9);
    appear(ctx, '.question', s9 + 0.2);
    tl.set(q('.qtext'), { text: 'right details?' }, s9 + 1.6);
    tl.to(q('.question rect'), { attr: { stroke: C.pass }, duration: 0.3 }, s9 + 1.6);
  },
};
