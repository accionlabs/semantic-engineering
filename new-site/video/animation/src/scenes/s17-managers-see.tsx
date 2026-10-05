import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AgentIcon } from '../parts/Landscape';
import { Base, GAP_Y, LOWER } from '../parts/Act3';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 17. How do managers see what people and agents are doing? In the ticket system; high-volume
// support can move to an agent workbench with triage agents; metrics per product, graph and agent feed
// the organization's own reporting.
const COLS = ['To do', 'In progress', 'In review', 'Done'];

export const scene17: SceneDef = {
  n: 17,
  id: 'managers-see',
  View: () => (
    <Frame act="Act 3" scene="Scene 17 · How do managers see what people and agents are doing?">
      <Svg>
        <Base />
        <g className="pre board">
          {COLS.map((c, i) => (
            <g key={c}>
              <text x={170 + i * 230} y={LOWER.y} fontFamily={F.mono} fontSize={14} fill={C.muted}>{c.toUpperCase()}</text>
              <line x1={160 + i * 230} y1={LOWER.y + 10} x2={160 + i * 230} y2={LOWER.y + 140} stroke={C.hairline} />
            </g>
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} className={`tk tk-${i}`}>
              <rect x={170 + (i % 4) * 230} y={LOWER.y + 14 + Math.floor(i / 4) * 44} width={200} height={34} rx={6} fill={C.canvasRaised} stroke={C.text} />
              {i % 2 ? <AgentIcon x={190 + (i % 4) * 230} y={LOWER.y + 31 + Math.floor(i / 4) * 44} s={18} /> : <Person x={190 + (i % 4) * 230} y={LOWER.y + 24 + Math.floor(i / 4) * 44} r={8} colour={C.people} />}
            </g>
          ))}
          <g className="mover">
            <rect className="mv" x={170} y={LOWER.y + 102} width={200} height={34} rx={6} fill={C.canvasRaised} stroke={C.pass} />
            <AgentIcon className="mv-icon" x={190} y={LOWER.y + 119} s={18} />
          </g>
        </g>
        <Person className="pre manager" x={1080} y={LOWER.y + 50} r={16} colour={C.people} />
        <g className="pre flood">{Array.from({ length: 18 }, (_, i) => <rect key={i} className={`fl fl-${i}`} x={1180 + (i % 6) * 34} y={LOWER.y + 10 + Math.floor(i / 6) * 26} width={28} height={18} rx={3} fill={C.card} />)}</g>
        <g className="pre workbench">
          <rect x={1170} y={LOWER.y - 4} width={560} height={150} rx={12} fill="none" stroke={C.text} strokeWidth={2} />
          <text x={1190} y={LOWER.y + 22} fontFamily={F.mono} fontSize={14} letterSpacing={2} fill={C.text}>AGENT WORKBENCH</text>
          {[0, 1, 2].map((i) => <AgentIcon key={i} x={1210 + i * 50} y={LOWER.y + 70} s={24} />)}
          <text x={1350} y={LOWER.y + 76} fontFamily={F.sans} fontSize={17} fill={C.text}>triage · priorities · route</text>
          <text x={1350} y={LOWER.y + 110} fontFamily={F.mono} fontSize={14} fill={C.muted}>to a person, or to an agent</text>
        </g>
        <g className="pre metrics">
          {['product', 'graph', 'agent'].map((t, i) => (
            <g key={t}>{[0, 1, 2].map((b) => <rect key={b} x={180 + i * 200 + b * 22} y={LOWER.y + 110 - (20 + ((i + b) % 3) * 18)} width={16} height={20 + ((i + b) % 3) * 18} fill={C.layer.architecture} />)}
              <text x={180 + i * 200} y={LOWER.y + 132} fontFamily={F.mono} fontSize={13} fill={C.muted}>per {t}</text></g>
          ))}
          <line x1={780} y1={LOWER.y + 70} x2={900} y2={LOWER.y + 70} stroke={C.text} strokeWidth={2} />
          <rect x={910} y={LOWER.y + 40} width={220} height={60} rx={8} fill={C.canvasRaised} stroke={C.text} />
          <text x={1020} y={LOWER.y + 76} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.text}>your reporting</text>
        </g>
      </Svg>
      <Callout className="pre co-nocontext" x={1180} y={GAP_Y - 8} w={480} kind="A general ticket system" text="Holds no knowledge of the application" tone={C.warn} target="workbench.why" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: managers look at the ticket system they already use.
    const s1 = cue('board', 's0');
    appear(ctx, '.board', s1 + 0.2);
    appear(ctx, '.manager', s1 + 0.6);
    // s2: every step updates the ticket, person or agent.
    const s2 = cue('updates', 's1');
    [1, 2, 3].forEach((k, i) => tl.to(q('.mover'), { x: k * 230, duration: 0.7 }, s2 + 0.3 + i * 0.9));
    // s3: high-volume support overwhelms a ticket system.
    const s3 = cue('flood', 's2');
    vanish(ctx, '.manager', s3);
    tl.set(q('.flood'), { autoAlpha: 1 }, s3 + 0.1);
    Array.from({ length: 18 }, (_, i) => tl.fromTo(q(`.fl-${i}`), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.2 }, s3 + 0.2 + i * 0.08));
    appear(ctx, '.co-nocontext', s3 + 1.0);
    // s4 and s5: the agent workbench and its triage agents.
    const s4 = cue('workbench', 's3');
    vanish(ctx, '.co-nocontext, .flood', s4);
    appear(ctx, '.workbench', s4 + 0.2);
    // s6 and s7: metrics, into the organization's own reporting.
    const s6 = cue('metrics', 's5');
    vanish(ctx, '.board', s6);
    appear(ctx, '.metrics', s6 + 0.3);
  },
};
