import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { COL, Cards, Custodians, DEV, Defs, Flow, KindLabels, SprintFrame, TaxArrow, Token, Y, translate } from '../parts/Landscape';
import { Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 2. One feature in one sprint. A developer in a conventional Scrum sprint needs each kind of
// knowledge and gets each from a person; every exchange loses something, and nothing is recorded.
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
        <Flow className="pre" />
        <g className="pre feature">
          <rect x={COL.functional - 112} y={Y.flow - 82} width={224} height={30} rx={6} fill={C.canvasRaised} stroke={C.layer.functional} />
          <text x={COL.functional} y={Y.flow - 62} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.layer.functional}>alert frequency feature</text>
        </g>
        <g className="pre questions">
          {[0, 1, 2].map((i) => <text key={i} x={DEV.x - 40 + i * 40} y={DEV.y - 14} textAnchor="middle" fontFamily={F.display} fontSize={30} fontWeight={700} fill={C.layer.functional}>?</text>)}
        </g>
        <g className="pre controls">
          {[0, 1, 2, 3].map((i) => <rect key={i} className={`ctl ctl-${i}`} x={COL.design + 122} y={Y.card + 4 + i * 23} width={40} height={17} rx={4} fill="none" stroke={C.layer.design} strokeWidth={1.5} />)}
        </g>
        {KEYS.map((k) => <TaxArrow key={k} className={`pre arrow arrow-${k}`} x={FROM[k].x} y={FROM[k].y} />)}
        {KEYS.map((k) => <Token key={k} className={`pre token token-${k}`} x={FROM[k].x} y={FROM[k].y} colour={colourOf(k)} />)}
        <g className="pre partial">
          <circle cx={DEV.x - 70} cy={DEV.y + 54} r={9} fill="none" stroke={C.layer.functional} strokeWidth={3} strokeDasharray="20 40" />
          <circle cx={DEV.x + 70} cy={DEV.y + 54} r={9} fill="none" stroke={C.layer.architecture} strokeWidth={3} strokeDasharray="20 40" />
          <circle cx={DEV.x + 96} cy={DEV.y + 54} r={9} fill={C.warn} />
        </g>
        <g className="pre change">
          <rect className="chg" x={DEV.x - 18} y={Y.flow + 44} width={36} height={22} rx={5} fill={C.text} />
        </g>
        <g className="pre caught-review"><circle cx={COL.architecture} cy={Y.flow + 56} r={13} fill={C.pass} /><path d={`M${COL.architecture - 6} ${Y.flow + 56} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /></g>
        <g className="pre caught-integration"><circle cx={COL.code - 40} cy={Y.flow + 56} r={13} fill={C.pass} /><path d={`M${COL.code - 46} ${Y.flow + 56} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" />
          <text x={COL.code - 40} y={Y.flow + 92} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>integration testing</text></g>
        <g className="pre defect"><circle cx={COL.code + 40} cy={Y.flow + 56} r={13} fill={C.warn} /></g>
        <g className="pre taxband">
          <rect x={150} y={Y.tax - 22} width={1620} height={Y.taxH + 44} rx={14} fill="rgba(255,106,61,0.07)" stroke={C.tax} strokeWidth={2.5} strokeDasharray="12 8" />
          <text x={180} y={Y.tax + 8} fontFamily={F.mono} fontSize={20} letterSpacing={3} fill={C.tax}>MANUAL TRANSLATION TAX</text>
          <text x={180} y={Y.tax + 44} fontFamily={F.sans} fontSize={20} fill={C.text}>Messages · meetings · memory</text>
        </g>
      </Svg>
      <FigureChip className="pre chip-30s" x={COL.design + 180} y={Y.card - 6} w={210} figure="30 s" label="to name the right control" source="sdlc/translation-tax.md" target="fig.design-30s" />
      <FigureChip className="pre chip-wiki" x={COL.architecture + 128} y={Y.card - 6} w={230} figure="9 months" label="since the wiki was updated" source="sdlc/translation-tax.md" target="fig.wiki-9-months" />
      <Callout className="pre co-away" x={1500} y={Y.flow - 180} w={300} kind="Code" text="One colleague is away until Monday" tone={C.layer.code} anchor={{ x: COL.code + 40, y: START + 10 }} target="example.colleague-away" />
      <FigureChip className="pre chip-cost" x={1340} y={Y.tax - 64} w={420} figure="~30 min" label="for each message, for the person asking; 10 to 15 minutes to answer it" source="sdlc/translation-tax.md#what-this-looks-like-on-a-sprint" target="fig.ping-cost" />
      <Callout className="pre co-contradicts" x={1260} y={Y.tax - 40} w={420} kind="Architecture" text="One answer contradicts the wiki" tone={C.warn} anchor={{ x: DEV.x + 96, y: DEV.y + 54 }} target="example.contradiction" />
      <Callout className="pre co-prod" x={1300} y={Y.tax - 40} w={420} kind="Defect" text="Surfaces in production six weeks later" tone={C.warn} anchor={{ x: COL.code + 40, y: Y.flow + 44 }} target="example.production-defect" />
      <Callout className="pre co-unrecorded" x={1250} y={Y.tax - 40} w={480} kind="Every exchange" text="Between two people, and not recorded" tone={C.tax} target="tax.unrecorded" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const dimTop = (keep: string[], at: number) => {
      tl.to(q('.top .lbl, .top .cus, .top .card'), { opacity: 0.3, duration: 0.4 }, at);
      if (keep.length) tl.to(q(keep.join(', ')), { opacity: 1, duration: 0.4 }, at);
    };
    // s1: a conventional Scrum sprint; the flow; the feature.
    const s1 = cue('sprint', 's0');
    dimTop([], s1);
    appear(ctx, '.sprint', s1 + 0.2);
    appear(ctx, '.flow', s1 + 0.8);
    appear(ctx, '.feature', s1 + 1.6);
    // s2 to s5: one kind of knowledge at a time, each fetched from a person.
    const step = (kind: string, keys: Key[], at: number) => {
      dimTop([`.top .lbl-${kind}`, `.top .cus-${kind}`, `.top .card-${kind}`], at);
      keys.forEach((k, i) => {
        tl.to(q(`.arrow-${k}`), { autoAlpha: 1, duration: 0.4 }, at + 0.3 + i * 0.4);
        translate(ctx, `.token-${k}`, FROM[k], at + 0.7 + i * 0.4);
      });
    };
    const s2 = cue('functional', 's1');
    step('functional', ['functional'], s2);
    appear(ctx, '.questions', s2 + 0.2);
    const s3 = cue('design', 's2');
    vanish(ctx, '.questions', s3);
    step('design', ['design'], s3);
    appear(ctx, '.controls', s3 + 0.2);
    tl.to(q('.ctl-0'), { attr: { fill: C.layer.design }, duration: 0.3 }, s3 + 1.2);
    appear(ctx, '.chip-30s', s3 + 1.0);
    const s4 = cue('architecture', 's3');
    vanish(ctx, '.chip-30s, .controls', s4);
    step('architecture', ['architecture'], s4);
    appear(ctx, '.chip-wiki', s4 + 0.4);
    const s5 = cue('code', 's4');
    vanish(ctx, '.chip-wiki', s5);
    step('code', ['code0', 'code1'], s5);
    appear(ctx, '.co-away', s5 + 1.2);
    // s6: what each exchange costs.
    const s6 = cue('cost', 's5');
    vanish(ctx, '.co-away', s6);
    dimTop([], s6);
    tl.to(q('.arrow'), { opacity: 0.25, duration: 0.4 }, s6);
    appear(ctx, '.chip-cost', s6 + 0.2);
    // s7: the answers arrive partial; one contradicts the wiki.
    const s7 = cue('partial', 's6');
    vanish(ctx, '.chip-cost', s7);
    appear(ctx, '.partial', s7 + 0.2);
    tl.to(q('.top .card-architecture'), { opacity: 1, duration: 0.3 }, s7 + 0.6);
    appear(ctx, '.co-contradicts', s7 + 0.6);
    // s8: the change moves on; review and testing catch two issues; the third reaches production.
    const s8 = cue('defects', 's7');
    vanish(ctx, '.co-contradicts', s8);
    tl.to(q('.top .card-architecture'), { opacity: 0.3, duration: 0.3 }, s8);
    appear(ctx, '.change', s8);
    tl.to(q('.chg'), { attr: { x: COL.architecture - 18 }, duration: 1.2, ease: 'power1.inOut' }, s8 + 0.3);
    appear(ctx, '.caught-review', s8 + 1.5);
    tl.to(q('.chg'), { attr: { x: COL.code - 18 }, duration: 1.2, ease: 'power1.inOut' }, s8 + 2.0);
    appear(ctx, '.caught-integration', s8 + 3.2);
    appear(ctx, '.defect', s8 + 3.8);
    appear(ctx, '.co-prod', s8 + 4.1);
    // s9: every exchange is between two people, and none is recorded.
    const s9 = cue('unrecorded', 's8');
    vanish(ctx, '.co-prod', s9);
    tl.to(q('.arrow'), { opacity: 1, duration: 0.3 }, s9);
    appear(ctx, '.co-unrecorded', s9 + 0.3);
    tl.to(q('.arrow'), { opacity: 0.15, duration: 1.2 }, s9 + 1.8);
    // s10: the exchanges are the Manual Translation Tax.
    const s10 = cue('tax', 's9');
    vanish(ctx, '.co-unrecorded', s10);
    tl.to(q('.arrow'), { opacity: 0.6, duration: 0.4 }, s10);
    appear(ctx, '.taxband', s10 + 0.4, { y: 0 });
    tl.to(q('.top .lbl, .top .cus, .top .card'), { opacity: 1, duration: 0.6 }, s10 + 0.8);
  },
};
