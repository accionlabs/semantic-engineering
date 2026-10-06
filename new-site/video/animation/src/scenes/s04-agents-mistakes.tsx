import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, COL, Cards, Custodians, DEV, Defs, Flow, KindLabels, SprintFrame, TaxArrow, Y } from '../parts/Landscape';
import { Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 4. Why AI coding agents make mistakes. The agent reads only the code, the ticket and a stale
// wiki; everything the custodians know is out of its sight. The evidence from two teams; why more text
// does not help; and what the agent needs instead.
const SEE = [
  { id: 'code', x: COL.code, y: Y.flow - Y.stationH / 2, label: 'codebase' },
  { id: 'ticket', x: COL.functional + 100, y: Y.flow - 70, label: 'ticket' },
  { id: 'wiki', x: COL.architecture, y: Y.card + Y.cardH, label: 'wiki' },
];
const ASKS = [COL.functional, COL.design + 40, COL.architecture, COL.code];

export const scene04: SceneDef = {
  n: 4,
  id: 'why-agents-make-mistakes',
  View: () => (
    <Frame act="Act 1" scene="Scene 4 · Why AI coding agents make mistakes">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /><Cards /></g>
        <g className="bottom">
          <SprintFrame />
          <Flow agent />
          <g className="feature">
            <rect x={COL.functional - 112} y={Y.flow - 82} width={224} height={30} rx={6} fill={C.canvasRaised} stroke={C.layer.functional} />
            <text x={COL.functional} y={Y.flow - 62} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.layer.functional}>alert frequency feature</text>
          </g>
        </g>
        <g className="band">
          <rect x={150} y={Y.tax - 22} width={1620} height={Y.taxH + 44} rx={14} fill="rgba(255,106,61,0.07)" stroke={C.tax} strokeWidth={2.5} strokeDasharray="12 8" />
          <text x={180} y={Y.tax + 8} fontFamily={F.mono} fontSize={20} letterSpacing={3} fill={C.tax}>MANUAL TRANSLATION TAX</text>
        </g>
        <AgentIcon className="agent" x={AGENT.x} y={AGENT.y} />
        <text className="pre agent-label" x={AGENT.x} y={Y.flow + 64} textAnchor="middle" fontFamily={F.mono} fontSize={15} letterSpacing={1.5} fill={C.text}>CODING AGENT</text>
        {SEE.map((s) => <line key={s.id} className={`pre see see-${s.id}`} x1={AGENT.x} y1={AGENT.y - 18} x2={s.x} y2={s.y} stroke={C.text} strokeWidth={2} />)}
        {ASKS.map((x, i) => <TaxArrow key={i} className={`pre ask ask-${i}`} x={x} y={Y.card + Y.cardH + 8} />)}
        <text className="pre agent-q" x={AGENT.x + 34} y={AGENT.y - 26} fontFamily={F.display} fontSize={34} fontWeight={700} fill={C.warn}>?</text>
        <rect className="pre veil" x={100} y={90} width={1720} height={340} rx={16} fill={C.canvas} opacity={0.75} />
        <g className="pre bad">
          <rect className="bad-tok" x={AGENT.x + 40} y={Y.flow + 50} width={36} height={18} rx={4} fill={C.text} />
          <circle className="bad-mark" cx={COL.code} cy={Y.flow + 58} r={12} fill={C.warn} opacity={0} />
        </g>
        <g className="pre small">
          <rect className="small-tok" x={DEV.x - 10} y={Y.flow + 52} width={20} height={14} rx={3} fill={C.text} />
          <g className="small-tick" opacity={0}><circle cx={COL.code} cy={Y.flow + 58} r={12} fill={C.pass} /><path d={`M${COL.code - 6} ${Y.flow + 58} l4 5 l8 -10`} stroke={C.canvas} strokeWidth={3} fill="none" /></g>
        </g>
        <g className="pre big">
          <rect x={DEV.x - 50} y={Y.flow + 46} width={64} height={30} rx={5} fill={C.text} />
          {[COL.functional, COL.design, COL.architecture, COL.code].map((x, i) => <line key={i} x1={DEV.x - 18} y1={Y.flow + 46} x2={x} y2={Y.card + Y.cardH} stroke={C.card} strokeWidth={1.5} />)}
          <rect x={DEV.x + 24} y={Y.flow + 50} width={8} height={24} rx={2} fill={C.warn} />
        </g>
        <g className="pre pages">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i} className={`page page-${i}`}>
              <rect x={AGENT.x + 60 + i * 7} y={Y.flow - 120 - i * 14} width={90} height={110} rx={4} fill={C.canvasRaised} stroke={C.card} strokeWidth={1.5} />
              {[0, 1, 2, 3].map((r) => <rect key={r} x={AGENT.x + 72 + i * 7} y={Y.flow - 104 - i * 14 + r * 18} width={60} height={5} rx={2} fill={C.card} />)}
            </g>
          ))}
        </g>
        <g className="pre kinds">
          {['Greenfield', 'Brownfield', 'Legacy modernization'].map((t, i) => (
            <g key={t}>
              <rect x={170} y={812 + i * 36} width={250} height={28} rx={6} fill={C.canvasRaised} stroke={C.muted} />
              <text x={295} y={831 + i * 36} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.text}>{t}</text>
              <line x1={420} y1={826 + i * 36} x2={540} y2={826 + i * 36} stroke={C.muted} strokeWidth={1.5} />
            </g>
          ))}
          <line x1={545} y1={804} x2={545} y2={920} stroke={C.warn} strokeWidth={4} />
        </g>
        <rect className="pre row-frame" x={200} y={Y.card - 12} width={1520} height={Y.cardH + 24} rx={14} fill="none" stroke={C.text} strokeWidth={1.5} strokeDasharray="6 6" />
      </Svg>
      <Callout className="pre co-see" x={1240} y={Y.tax - 200} w={460} kind="What the agent can read" text="Codebase · ticket · wiki (often stale)" tone={C.text} target="agent.context-limit" />
      <Callout className="pre co-ask" x={760} y={Y.flow + 100} w={360} kind="The agent" text="Cannot ask" tone={C.warn} target="agent.cannot-ask" />
      <Callout className="pre co-invisible" x={760} y={190} w={460} kind="The custodians' knowledge" text="Invisible to the agent" tone={C.warn} target="agent.invisible" />
      <Callout className="pre co-removed" x={1230} y={Y.tax - 200} w={520} kind="In one example" text="Calls a function removed three sprints ago" tone={C.warn} anchor={{ x: COL.code, y: Y.flow + 46 }} target="example.removed-function" />
      <Callout className="pre co-small" x={1080} y={Y.flow + 96} w={280} kind="Small, contained" text="Done well" tone={C.pass} target="agent.small-tasks" />
      <Callout className="pre co-big" x={250} y={Y.flow + 96} w={400} kind="Enterprise complexity" text="Mistakes" tone={C.warn} target="agent.enterprise" />
      <FigureChip className="pre chip-2m" x={1180} y={Y.tax - 230} w={580} figure="2M+ lines" label="AI coding tools produced isolated prototypes, and no overall gain in productivity" source="sdlc/case-archetypes.md#brownfield-enterprise-modernization" target="fig.no-global-gain" />
      <FigureChip className="pre chip-neg" x={1180} y={Y.tax - 230} w={580} figure="Negative" label="the AI gain on one change, once the back-and-forth was counted" source="sdlc/translation-tax.md#why-documentation-does-not-fix-it" target="fig.negative-gain" />
      <Callout className="pre co-text" x={1240} y={Y.tax - 200} w={420} kind="Bigger context windows" text="More text, same shape" tone={C.warn} target="agent.context-windows" />
      <Callout className="pre co-gap" x={600} y={820} w={420} kind="Every kind of work" text="The same gap" tone={C.warn} target="usecase.same-gap" />
      <Callout className="pre co-need" x={600} y={Y.tax - 40} w={720} kind="What the agent needs" text="The custodians' knowledge, structured, so the agent can search it" tone={C.text} target="need.structured-context" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const top = '.top .lbl, .top .cus, .top .card';
    tl.set(q(top), { opacity: 0.35 }, 0);
    tl.set(q('.bottom, .band'), { opacity: 0.45 }, 0);
    // s1: the coding agent faces the same gaps.
    const s1 = cue('agent', 's0');
    tl.fromTo(q('.agent'), { scale: 1, svgOrigin: `${AGENT.x} ${AGENT.y}` }, { scale: 1.35, svgOrigin: `${AGENT.x} ${AGENT.y}`, duration: 0.5 }, s1);
    appear(ctx, '.agent-label', s1 + 0.3);
    // s2: what it can read.
    const s2 = cue('reads', 's1');
    tl.to(q('.top .card-architecture, .bottom'), { opacity: 1, duration: 0.3 }, s2);
    SEE.forEach((s, i) => appear(ctx, `.see-${s.id}`, s2 + 0.3 + i * 0.4, { y: 0 }));
    appear(ctx, '.co-see', s2 + 1.2);
    // s3: it cannot see the messages, or ask.
    const s3 = cue('ask', 's2');
    vanish(ctx, '.co-see', s3);
    ASKS.forEach((_, i) => tl.to(q(`.ask-${i}`), { autoAlpha: 1, duration: 0.3 }, s3 + 0.2 + i * 0.2));
    appear(ctx, '.agent-q', s3 + 0.9);
    appear(ctx, '.co-ask', s3 + 1.1);
    // s4: everything the custodians know is out of its sight.
    const s4 = cue('invisible', 's3');
    vanish(ctx, '.co-ask, .ask, .see', s4);
    appear(ctx, '.veil', s4, { y: 0 });
    appear(ctx, '.co-invisible', s4 + 0.4);
    // s5: the removed function.
    const s5 = cue('removed', 's4');
    vanish(ctx, '.co-invisible, .agent-q', s5);
    appear(ctx, '.bad', s5);
    tl.to(q('.bad-tok'), { attr: { x: COL.code - 18 }, duration: 1.6, ease: 'power1.inOut' }, s5 + 0.2);
    tl.to(q('.bad-mark'), { opacity: 1, duration: 0.3 }, s5 + 1.8);
    appear(ctx, '.co-removed', s5 + 1.8);
    // s6: small tasks go well; enterprise complexity does not.
    const s6 = cue('complexity', 's5');
    vanish(ctx, '.co-removed, .bad', s6);
    appear(ctx, '.small', s6);
    tl.to(q('.small-tok'), { attr: { x: COL.code - 10 }, duration: 1.4, ease: 'power1.inOut' }, s6 + 0.2);
    tl.to(q('.small-tick'), { opacity: 1, duration: 0.3 }, s6 + 1.6);
    appear(ctx, '.co-small', s6 + 1.6);
    appear(ctx, '.big', s6 + 2.0);
    appear(ctx, '.co-big', s6 + 2.4);
    // s7 and s8: two teams' results.
    const s7 = cue('nogain', 's6');
    vanish(ctx, '.small, .co-small, .big, .co-big', s7);
    appear(ctx, '.chip-2m', s7 + 0.2);
    const s8 = cue('negative', 's7');
    vanish(ctx, '.chip-2m', s8);
    appear(ctx, '.chip-neg', s8 + 0.2);
    // s9: more text gives the agent nothing to check against.
    const s9 = cue('context', 's8');
    vanish(ctx, '.chip-neg', s9);
    appear(ctx, '.pages', s9);
    [0, 1, 2, 3, 4, 5, 6].forEach((i) => tl.fromTo(q(`.page-${i}`), { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, s9 + 0.2 + i * 0.25));
    appear(ctx, '.co-text', s9 + 1.4);
    // s10: every kind of work faces the same gap.
    const s10 = cue('gap', 's9');
    vanish(ctx, '.pages, .co-text', s10);
    appear(ctx, '.kinds', s10);
    appear(ctx, '.co-gap', s10 + 0.8);
    // s11: the agent needs the custodians' knowledge in a structured form.
    const s11 = cue('need', 's10');
    vanish(ctx, '.kinds, .co-gap, .agent-label', s11);
    tl.to(q('.veil'), { autoAlpha: 0, duration: 0.6 }, s11);
    tl.to(q('.bottom, .band, .top .lbl, .top .cus'), { opacity: 0.25, duration: 0.6 }, s11);
    tl.to(q('.top .card'), { opacity: 1, duration: 0.6 }, s11 + 0.3);
    appear(ctx, '.row-frame', s11 + 0.6, { y: 0 });
    appear(ctx, '.co-need', s11 + 0.9);
  },
};
