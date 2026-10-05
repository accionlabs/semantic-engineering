import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, LOWER } from '../parts/Act3';
import { item } from '../parts/Graph';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 11. Where is the state of the work kept? Three records, each answering one question; the ticket
// carries each change, collecting the impact report and results, whoever does the work.
const RECORDS = [
  { id: 'spec', name: 'Specification', q: 'what one change should do', tone: C.card },
  { id: 'ticket', name: 'Ticket system', q: 'who is doing what, how far it has got', tone: C.text },
  { id: 'graph', name: 'Knowledge graph', q: 'what the application does today', tone: C.layer.architecture },
];
const TICKET_Y = Y.flow - 120;
const STATUS = ['To do', 'In progress', 'In review', 'Done'];

export const scene11: SceneDef = {
  n: 11,
  id: 'state-of-the-work',
  View: () => (
    <Frame act="Act 3" scene="Scene 11 · Where is the state of the work kept?">
      <Svg>
        <Base />
        {RECORDS.map((r, i) => (
          <g key={r.id} className={`pre rec rec-${r.id}`}>
            <rect x={150 + i * 550} y={LOWER.y + 10} width={520} height={74} rx={10} fill={C.canvasRaised} stroke={r.tone} strokeWidth={2} />
            <text x={172 + i * 550} y={LOWER.y + 40} fontFamily={F.sans} fontSize={22} fontWeight={600} fill={C.text}>{r.name}</text>
            <text x={172 + i * 550} y={LOWER.y + 68} fontFamily={F.sans} fontSize={19} fill={C.muted}>{r.q}</text>
          </g>
        ))}
        <g className="pre ticket">
          <rect x={STATIONS[0].x - 80} y={TICKET_Y} width={160} height={58} rx={8} fill={C.canvasRaised} stroke={C.text} strokeWidth={2} />
          <text x={STATIONS[0].x - 66} y={TICKET_Y + 22} fontFamily={F.mono} fontSize={13} fill={C.muted}>TICKET</text>
          <text className="status" x={STATIONS[0].x - 66} y={TICKET_Y + 44} fontFamily={F.sans} fontSize={17} fill={C.text}>To do</text>
          <g className="att att-report" opacity={0}><rect x={STATIONS[0].x + 86} y={TICKET_Y} width={24} height={30} rx={3} fill={C.text} /></g>
          <g className="att att-tests" opacity={0}><rect x={STATIONS[0].x + 114} y={TICKET_Y} width={24} height={30} rx={3} fill={C.pass} /></g>
          <g className="att att-second" opacity={0}><rect x={STATIONS[0].x + 142} y={TICKET_Y} width={24} height={30} rx={3} fill={C.text} /></g>
        </g>
        <line className="pre hook" x1={STATIONS[0].x} y1={TICKET_Y} x2={item('architecture', 2).x} y2={item('architecture', 2).y} stroke={C.text} strokeWidth={3} />
        <g className="pre final"><Card className="final-card" x={STATIONS[3].x - 85} y={TICKET_Y - 46} w={170} h={36} label="final analysis" tone={C.text} /></g>
        <g className="pre who-dev"><Person x={STATIONS[1].x - 150} y={Y.flow - 12} r={13} colour={C.people} /></g>
      </Svg>
      <Callout className="pre co-hook" x={1180} y={GAP_Y - 8} w={480} kind="A hook in the ticket system" text="Runs impact analysis and attaches the report" tone={C.text} target="ticket.hook" />
      <Callout className="pre co-design" x={1180} y={GAP_Y - 8} w={480} kind="People, agents or both" text="Each team designs the workflow" tone={C.text} target="ticket.workflow" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1 to s4: three records, three questions.
    const s1 = cue('records', 's0');
    tl.to(q('.g, .tie'), { opacity: 0.35, duration: 0.4 }, s1);
    RECORDS.forEach((r, i) => {
      const at = cue(r.id, `s${i + 1}`);
      appear(ctx, `.rec-${r.id}`, i === 0 ? Math.min(at, s1 + 0.5) : at);
    });
    tl.to(q('.g, .tie'), { opacity: 1, duration: 0.4 }, cue('graph', 's3'));
    // s5: the ticket carries each change.
    const s5 = cue('ticket', 's4');
    tl.to(q('.rec'), { opacity: 0.35, duration: 0.3 }, s5);
    appear(ctx, '.ticket', s5 + 0.2);
    // s6: a hook runs impact analysis and attaches the report.
    const s6 = cue('hook', 's5');
    tl.fromTo(q('.hook'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s6 + 0.2);
    tl.to(q('.att-report'), { opacity: 1, duration: 0.3 }, s6 + 1.2);
    vanish(ctx, '.hook', s6 + 2.2);
    appear(ctx, '.co-hook', s6 + 0.6);
    // s7: each step updates the status and attaches results.
    const s7 = cue('steps', 's6');
    vanish(ctx, '.co-hook', s7);
    [1, 2].forEach((k, i) => {
      const at = s7 + 0.3 + i * 1.6;
      tl.to(q('.ticket'), { x: STATIONS[k].x - STATIONS[0].x, duration: 1, ease: 'power1.inOut' }, at);
      tl.set(q('.status'), { text: STATUS[k] }, at + 1);
    });
    tl.to(q('.att-tests'), { opacity: 1, duration: 0.3 }, s7 + 2.0);
    tl.to(q('.att-second'), { opacity: 1, duration: 0.3 }, s7 + 3.4);
    // s8: the final analysis uses the whole history.
    const s8 = cue('final', 's7');
    tl.to(q('.ticket'), { x: STATIONS[3].x - STATIONS[0].x, duration: 1, ease: 'power1.inOut' }, s8 + 0.2);
    tl.set(q('.status'), { text: STATUS[3] }, s8 + 1.2);
    appear(ctx, '.final', s8 + 1.2);
    // s9: the same, whether people or agents do the work.
    const s9 = cue('either', 's8');
    vanish(ctx, '.final', s9);
    tl.set(q('.status'), { text: STATUS[0] }, s9 + 0.1);
    tl.to(q('.ticket'), { x: 0, duration: 0.6 }, s9 + 0.1);
    appear(ctx, '.who-dev', s9 + 0.4);
    tl.to(q('.ticket'), { x: STATIONS[3].x - STATIONS[0].x, duration: 2.2, ease: 'power1.inOut' }, s9 + 0.8);
    [1, 2, 3].forEach((k, i) => tl.set(q('.status'), { text: STATUS[k] }, s9 + 1.4 + i * 0.6));
    // s10: each team designs the workflow between the steps.
    const s10 = cue('design', 's9');
    vanish(ctx, '.who-dev', s10);
    tl.to(q('.rec'), { opacity: 1, duration: 0.3 }, s10);
    appear(ctx, '.co-design', s10 + 0.3);
  },
};
