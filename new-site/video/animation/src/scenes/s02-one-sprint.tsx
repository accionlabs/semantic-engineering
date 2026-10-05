import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, COL, Cards, Custodians, DEV, Defs, Flow, KindLabels, SprintFrame, TaxArrow, Token, Y, translate } from '../parts/Landscape';
import { Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 2. One feature in one sprint. A developer in a conventional Scrum sprint works with an AI
// coding agent. The agent writes code in seconds, but it needs four kinds of knowledge, and each comes
// from a person. The agent saves minutes; the feature still waits on people.
const START = Y.card + Y.cardH + 8;
const FROM = {
  functional: { x: COL.functional, y: START },
  design: { x: COL.design + 40, y: START },
  architecture: { x: COL.architecture, y: START },
  code0: { x: COL.code - 40, y: START },
  code1: { x: COL.code + 40, y: START },
};
type Key = keyof typeof FROM;
const KEYS = Object.keys(FROM) as Key[];
const colourOf = (k: Key) => C.layer[k.startsWith('code') ? 'code' : (k as 'functional' | 'design' | 'architecture')];
// The agent's four knowledge sockets, in layer order, below the Developer station.
const SOCK_Y = Y.flow + 58;
const sockX = (i: number) => DEV.x - 66 + i * 44;

export const scene02: SceneDef = {
  n: 2,
  id: 'one-feature-one-sprint',
  View: () => (
    <Frame act="Act 1" scene="Scene 2 · One feature in one sprint">
      <Svg>
        <Defs />
        <g className="top">
          <KindLabels />
          <Custodians />
          <Cards />
        </g>
        <SprintFrame className="pre" />
        <Flow className="pre" agent />
        <AgentIcon className="pre agent" x={AGENT.x} y={AGENT.y} />
        <g className="pre feature">
          <rect x={COL.functional - 112} y={Y.flow - 82} width={224} height={30} rx={6} fill={C.canvasRaised} stroke={C.layer.functional} />
          <text x={COL.functional} y={Y.flow - 62} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.layer.functional}>alert frequency feature</text>
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className={`pre code-bit code-bit-${i}`} x={AGENT.x + 52} y={Y.flow - 30 + i * 11} width={40 + (i % 3) * 18} height={6} rx={3} fill={C.layer.code} />)}
        <g className="pre sockets">
          {KINDS.map((k, i) => (
            <g key={k.id}>
              <circle cx={sockX(i)} cy={SOCK_Y} r={11} fill="none" stroke={C.layer[k.id]} strokeWidth={2.5} strokeDasharray="4 4" />
              <circle className={`fill fill-${k.id}`} cx={sockX(i)} cy={SOCK_Y} r={11} fill="none" stroke={i === 2 ? C.warn : C.layer[k.id]} strokeWidth={5} strokeDasharray="22 60" opacity={0} />
            </g>
          ))}
        </g>
        <g className="pre questions">
          {[0, 1, 2].map((i) => <text key={i} x={DEV.x - 40 + i * 40} y={DEV.y - 14} textAnchor="middle" fontFamily={F.display} fontSize={30} fontWeight={700} fill={C.layer.functional}>?</text>)}
        </g>
        <g className="pre controls">
          {[0, 1, 2, 3].map((i) => <rect key={i} className={`ctl ctl-${i}`} x={COL.design + 122} y={Y.card + 4 + i * 23} width={40} height={17} rx={4} fill="none" stroke={C.layer.design} strokeWidth={1.5} />)}
        </g>
        {KEYS.map((k) => <TaxArrow key={k} className={`pre arrow arrow-${k}`} x={FROM[k].x} y={FROM[k].y} />)}
        {KEYS.map((k) => <Token key={k} className={`pre token token-${k}`} x={FROM[k].x} y={FROM[k].y} colour={colourOf(k)} />)}
        <g className="pre change"><rect className="chg" x={DEV.x - 18} y={Y.flow + 86} width={36} height={18} rx={4} fill={C.text} /></g>
        <g className="pre caught-review"><circle cx={COL.architecture} cy={Y.flow + 58} r={13} fill={C.pass} /><path d={`M${COL.architecture - 6} ${Y.flow + 58} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /></g>
        <g className="pre caught-integration"><circle cx={COL.code - 40} cy={Y.flow + 58} r={13} fill={C.pass} /><path d={`M${COL.code - 46} ${Y.flow + 58} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" />
          <text x={COL.code - 40} y={Y.flow + 92} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>integration testing</text></g>
        <g className="pre defect"><circle cx={COL.code + 40} cy={Y.flow + 58} r={13} fill={C.warn} /></g>
        <g className="pre taxband">
          <rect x={150} y={Y.tax - 22} width={1620} height={Y.taxH + 44} rx={14} fill="rgba(255,106,61,0.07)" stroke={C.tax} strokeWidth={2.5} strokeDasharray="12 8" />
          <text x={180} y={Y.tax + 8} fontFamily={F.mono} fontSize={20} letterSpacing={3} fill={C.tax}>MANUAL TRANSLATION TAX</text>
          <text x={180} y={Y.tax + 44} fontFamily={F.sans} fontSize={20} fill={C.text}>Messages · meetings · memory</text>
        </g>
      </Svg>
      <FigureChip className="pre chip-speed" x={COL.architecture - 110} y={Y.tax - 64} w={400} figure="20 min → 90 s" label="typing becomes reading and editing, in one example" source="sdlc/zones/zone-1-manual-vibe-coding.md" target="fig.typing-to-reading" />
      <Callout className="pre co-needs" x={COL.architecture - 110} y={Y.tax - 40} w={430} kind="Before the right code" text="Four kinds of knowledge, each from a person" tone={C.text} anchor={{ x: DEV.x + 66, y: SOCK_Y }} target="need.four-kinds" />
      <FigureChip className="pre chip-30s" x={COL.design + 180} y={Y.card - 6} w={210} figure="30 s" label="to name the right control" source="sdlc/translation-tax.md" target="fig.design-30s" />
      <FigureChip className="pre chip-wiki" x={COL.architecture + 128} y={Y.card - 6} w={230} figure="9 months" label="since the wiki was updated" source="sdlc/translation-tax.md" target="fig.wiki-9-months" />
      <Callout className="pre co-away" x={1500} y={Y.flow - 180} w={300} kind="Code" text="One colleague is away until Monday" tone={C.layer.code} anchor={{ x: COL.code + 40, y: START + 10 }} target="example.colleague-away" />
      <FigureChip className="pre chip-cost" x={1340} y={Y.tax - 64} w={420} figure="~30 min" label="for each message, for the person asking; 10 to 15 minutes to answer it" source="sdlc/translation-tax.md#what-this-looks-like-on-a-sprint" target="fig.ping-cost" />
      <Callout className="pre co-contradicts" x={1260} y={Y.tax - 40} w={420} kind="Architecture" text="One answer contradicts the wiki" tone={C.warn} anchor={{ x: sockX(2), y: SOCK_Y }} target="example.contradiction" />
      <Callout className="pre co-prod" x={1300} y={Y.tax - 40} w={420} kind="Defect" text="Surfaces in production six weeks later" tone={C.warn} anchor={{ x: COL.code + 40, y: Y.flow + 46 }} target="example.production-defect" />
      <div className="pre split" style={{ position: 'absolute', left: 1100, top: Y.tax - 56, display: 'flex', gap: 16 }}>
        {[['Coding agent', 'minutes of typing saved', C.pass], ['Feature', 'still waited on people', C.tax]].map(([k, t, c]) => (
          <div key={k} style={{ width: 300, background: C.canvasRaised, border: `1.5px solid ${c}`, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', color: c }}>{k}</div>
            <div style={{ fontSize: 25, fontWeight: 500, lineHeight: 1.25, marginTop: 4, color: C.text }}>{t}</div>
          </div>
        ))}
      </div>
      <Callout className="pre co-unrecorded" x={1250} y={Y.tax - 40} w={480} kind="Every exchange" text="Between two people, and not recorded" tone={C.tax} target="tax.unrecorded" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const dimTop = (keep: string[], at: number) => {
      tl.to(q('.top .lbl, .top .cus, .top .card'), { opacity: 0.3, duration: 0.4 }, at);
      if (keep.length) tl.to(q(keep.join(', ')), { opacity: 1, duration: 0.4 }, at);
    };
    // s1: a conventional Scrum sprint, with an AI coding agent beside the developer.
    const s1 = cue('sprint', 's0');
    dimTop([], s1);
    appear(ctx, '.sprint', s1 + 0.2);
    appear(ctx, '.flow', s1 + 0.8);
    appear(ctx, '.agent', s1 + 1.8);
    appear(ctx, '.feature', s1 + 2.4);
    // s2: the agent writes code in seconds.
    const s2 = cue('speed', 's1');
    [0, 1, 2, 3, 4, 5].forEach((i) => {
      tl.fromTo(q(`.code-bit-${i}`), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.25 }, s2 + 0.2 + i * 0.12);
    });
    appear(ctx, '.chip-speed', s2 + 0.8);
    // s3: before it can write the right code, it needs four kinds of knowledge.
    const s3 = cue('needs', 's2');
    vanish(ctx, '.chip-speed, .code-bit', s3);
    appear(ctx, '.sockets', s3 + 0.2);
    appear(ctx, '.co-needs', s3 + 0.5);
    // s4 to s7: one kind at a time, each fetched from a person.
    const step = (kind: string, keys: Key[], at: number) => {
      dimTop([`.top .lbl-${kind}`, `.top .cus-${kind}`, `.top .card-${kind}`], at);
      keys.forEach((k, i) => {
        tl.to(q(`.arrow-${k}`), { autoAlpha: 1, duration: 0.4 }, at + 0.3 + i * 0.4);
        translate(ctx, `.token-${k}`, FROM[k], at + 0.7 + i * 0.4);
      });
      tl.to(q(`.fill-${kind}`), { opacity: 1, duration: 0.4 }, at + 2.4);
    };
    const s4 = cue('functional', 's3');
    vanish(ctx, '.co-needs', s4);
    step('functional', ['functional'], s4);
    appear(ctx, '.questions', s4 + 0.2);
    const s5 = cue('design', 's4');
    vanish(ctx, '.questions', s5);
    step('design', ['design'], s5);
    appear(ctx, '.controls', s5 + 0.2);
    tl.to(q('.ctl-0'), { attr: { fill: C.layer.design }, duration: 0.3 }, s5 + 1.2);
    appear(ctx, '.chip-30s', s5 + 1.0);
    const s6 = cue('architecture', 's5');
    vanish(ctx, '.chip-30s, .controls', s6);
    step('architecture', ['architecture'], s6);
    appear(ctx, '.chip-wiki', s6 + 0.4);
    const s7 = cue('code', 's6');
    vanish(ctx, '.chip-wiki', s7);
    step('code', ['code0', 'code1'], s7);
    appear(ctx, '.co-away', s7 + 1.2);
    // s8: what each exchange costs.
    const s8 = cue('cost', 's7');
    vanish(ctx, '.co-away', s8);
    dimTop([], s8);
    tl.to(q('.arrow'), { opacity: 0.25, duration: 0.4 }, s8);
    appear(ctx, '.chip-cost', s8 + 0.2);
    // s9: the answers arrive partial; one contradicts the wiki.
    const s9 = cue('partial', 's8');
    vanish(ctx, '.chip-cost', s9);
    tl.to(q('.top .card-architecture'), { opacity: 1, duration: 0.3 }, s9 + 0.4);
    appear(ctx, '.co-contradicts', s9 + 0.4);
    // s10: the change moves on; review and testing catch two issues; the third reaches production.
    const s10 = cue('defects', 's9');
    vanish(ctx, '.co-contradicts', s10);
    tl.to(q('.top .card-architecture'), { opacity: 0.3, duration: 0.3 }, s10);
    appear(ctx, '.change', s10);
    tl.to(q('.chg'), { attr: { x: COL.architecture - 18 }, duration: 1.2, ease: 'power1.inOut' }, s10 + 0.3);
    appear(ctx, '.caught-review', s10 + 1.5);
    tl.to(q('.chg'), { attr: { x: COL.code - 18 }, duration: 1.2, ease: 'power1.inOut' }, s10 + 2.0);
    appear(ctx, '.caught-integration', s10 + 3.2);
    vanish(ctx, '.change', s10 + 3.2);
    appear(ctx, '.defect', s10 + 3.8);
    appear(ctx, '.co-prod', s10 + 4.1);
    // s11: minutes saved by the agent; the feature still waited on people.
    const s11 = cue('waited', 's10');
    vanish(ctx, '.co-prod', s11);
    tl.to(q('.arrow'), { opacity: 0.7, duration: 0.4 }, s11);
    appear(ctx, '.split', s11 + 0.3);
    // s12: every exchange is between two people, and none is recorded.
    const s12 = cue('unrecorded', 's11');
    vanish(ctx, '.split', s12);
    tl.to(q('.arrow'), { opacity: 1, duration: 0.3 }, s12);
    appear(ctx, '.co-unrecorded', s12 + 0.3);
    tl.to(q('.arrow'), { opacity: 0.15, duration: 1.2 }, s12 + 1.8);
    // s13: the exchanges are the Manual Translation Tax.
    const s13 = cue('tax', 's12');
    vanish(ctx, '.co-unrecorded', s13);
    tl.to(q('.arrow'), { opacity: 0.6, duration: 0.4 }, s13);
    appear(ctx, '.taxband', s13 + 0.4, { y: 0 });
    tl.to(q('.top .lbl, .top .cus, .top .card'), { opacity: 1, duration: 0.6 }, s13 + 0.8);
  },
};
