import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, COL, Cards, Custodians, DEV, Defs, Flow, KindLabels, SprintFrame, Y } from '../parts/Landscape';
import { Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 3. The Manual Translation Tax: what it is, why faster code generation leaves it in place,
// its three components with one example each, and why more documentation does not remove it.
// The tax band carries the three strands; the upper area, dimmed, is the stage for each example.
const BAND = { x: 150, y: Y.tax - 22, w: 1620, h: Y.taxH + 44 };
const STRAND_Y = [BAND.y + 26, BAND.y + 54, BAND.y + 82];
const STRANDS = [
  { id: 'amb', name: 'AMBIGUITY', def: 'the same words mean different things' },
  { id: 'per', name: 'NON-PERSISTENCE', def: 'unwritten knowledge leaves with people' },
  { id: 'tra', name: 'NON-TRACEABILITY', def: 'no record of what depends on what' },
];
const READS = [
  { x: 520, label: 'browser', who: 'frontend' },
  { x: 960, label: 'database', who: 'backend' },
  { x: 1400, label: 'confirmation message', who: 'QA' },
];

export const scene03: SceneDef = {
  n: 3,
  id: 'manual-translation-tax',
  View: () => (
    <Frame act="Act 1" scene="Scene 3 · The Manual Translation Tax">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /><Cards /></g>
        <g className="bottom"><SprintFrame /><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        {/* The band, its title, and what flows through it. */}
        <g className="band">
          <rect className="band-rect" x={BAND.x} y={BAND.y} width={BAND.w} height={BAND.h} rx={14} fill="rgba(255,106,61,0.07)" stroke={C.tax} strokeWidth={2.5} strokeDasharray="12 8" />
          <text className="band-title" x={960} y={BAND.y + 50} textAnchor="middle" fontFamily={F.mono} fontSize={30} letterSpacing={4} fill={C.tax}>MANUAL TRANSLATION TAX</text>
        </g>
        <g className="pre ends">
          <text x={BAND.x + 24} y={BAND.y + 86} fontFamily={F.sans} fontSize={20} fill={C.cardText}>documents · messages · memory</text>
          <text x={BAND.x + BAND.w - 24} y={BAND.y + 86} textAnchor="end" fontFamily={F.sans} fontSize={20} fill={C.cardText}>decision · code · review comment</text>
        </g>
        <g className="pre crosser"><circle className="cr" cx={BAND.x + 60} cy={BAND.y + 54} r={11} fill={C.cardText} /><circle className="cr-frag" cx={960} cy={BAND.y + 54} r={5} fill={C.cardText} opacity={0} /></g>
        <g className="pre clock">
          <circle cx={960} cy={BAND.y - 34} r={20} fill={C.canvasRaised} stroke={C.text} strokeWidth={2} />
          <line className="hand" x1={960} y1={BAND.y - 34} x2={960} y2={BAND.y - 48} stroke={C.text} strokeWidth={2.5} strokeLinecap="round" style={{ transformOrigin: `960px ${BAND.y - 34}px` }} />
        </g>
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} className={`pre code-bit code-bit-${i}`} x={AGENT.x + 52} y={Y.flow - 30 + i * 11} width={40 + (i % 3) * 18} height={6} rx={3} fill={C.layer.code} />)}
        {/* The three strands. */}
        {STRANDS.map((s, i) => (
          <g key={s.id} className={`pre strand strand-${s.id}`}>
            <line x1={BAND.x + 20} y1={STRAND_Y[i]} x2={BAND.x + BAND.w - 20} y2={STRAND_Y[i]} stroke={C.tax} strokeWidth={3} strokeDasharray="10 8" />
            <g className={`pre sname sname-${s.id}`}>
              <rect x={BAND.x + 24} y={STRAND_Y[i] - 13} width={250} height={26} rx={5} fill={C.canvas} />
              <text x={BAND.x + 34} y={STRAND_Y[i] + 7} fontFamily={F.mono} fontSize={17} letterSpacing={2} fill={C.tax}>{s.name}</text>
              <rect x={BAND.x + 290} y={STRAND_Y[i] - 13} width={430} height={26} rx={5} fill={C.canvas} />
              <text x={BAND.x + 300} y={STRAND_Y[i] + 7} fontFamily={F.sans} fontSize={19} fill={C.text}>{s.def}</text>
            </g>
          </g>
        ))}
        {/* Ambiguity: one phrase, three readings. */}
        <g className="pre phrase">
          <rect x={560} y={118} width={800} height={52} rx={10} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={2} />
          <text x={960} y={152} textAnchor="middle" fontFamily={F.sans} fontSize={23} fill={C.text}>"let users save their search so they can return to it later"</text>
        </g>
        {READS.map((r, i) => (
          <g key={i} className={`pre read read-${i}`}>
            <path d={`M960 172 Q${(960 + r.x) / 2} 230 ${r.x} 286`} fill="none" stroke={C.layer.functional} strokeWidth={2} />
            <rect x={r.x - 130} y={290} width={260} height={64} rx={10} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
            <text x={r.x} y={318} textAnchor="middle" fontFamily={F.sans} fontSize={21} fill={C.text}>{r.label}</text>
            <text x={r.x} y={342} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>{r.who}</text>
          </g>
        ))}
        <g className="pre meet">
          {READS.map((r, i) => <path key={i} d={`M${r.x} 356 Q${(r.x + COL.architecture) / 2} 520 ${COL.architecture} ${Y.flow - Y.stationH / 2 - 4}`} fill="none" stroke={C.warn} strokeWidth={2} strokeDasharray="6 6" />)}
          <circle cx={COL.architecture + 100} cy={Y.flow - 26} r={12} fill={C.warn} />
        </g>
        {/* Non-persistence: a calendar of rediscovery, and an agent session that starts empty. */}
        <g className="pre calendar">
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <rect x={440 + i * 70} y={190} width={60} height={60} rx={6} fill={C.canvasRaised} stroke={C.hairline} />
              {[2, 5, 6, 9, 11].includes(i) && <circle className="cal-mark" cx={470 + i * 70} cy={220} r={10} fill={C.warn} />}
            </g>
          ))}
        </g>
        <g className="pre session">
          <rect x={DEV.x - 160} y={Y.flow + 50} width={150} height={30} rx={6} fill={C.canvasRaised} stroke={C.muted} />
          <text className="session-text" x={DEV.x - 85} y={Y.flow + 70} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>new session</text>
        </g>
        {/* Non-traceability: a feature, a worker in another repository, and no link between them. */}
        <g className="pre feat">
          <rect x={COL.functional - 120} y={160} width={240} height={56} rx={10} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={2} />
          <text x={COL.functional} y={195} textAnchor="middle" fontFamily={F.sans} fontSize={21} fill={C.text}>alert frequency</text>
        </g>
        <g className="pre worker">
          <rect x={COL.code - 150} y={160} width={300} height={56} rx={10} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2} />
          <text x={COL.code} y={185} textAnchor="middle" fontFamily={F.sans} fontSize={20} fill={C.text}>daily worker</text>
          <text x={COL.code} y={206} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.muted}>another repository</text>
        </g>
        <g className="pre emails">
          {[0, 1].map((i) => (
            <g key={i} className={`mail mail-${i}`}>
              <rect x={900 + i * 70} y={300} width={50} height={34} rx={4} fill="none" stroke={i ? C.warn : C.text} strokeWidth={2} />
              <path d={`M${900 + i * 70} 300 l25 18 l25 -18`} fill="none" stroke={i ? C.warn : C.text} strokeWidth={2} />
            </g>
          ))}
          <text x={960} y={370} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.muted}>one customer, daily and weekly</text>
        </g>
        <line className="pre noline" x1={COL.functional + 122} y1={188} x2={COL.code - 152} y2={188} stroke={C.warn} strokeWidth={2.5} strokeDasharray="8 8" />
        {/* More documentation. */}
        <g className="pre moredoc">
          <rect x={COL.architecture - 96} y={Y.card - 14} width={220} height={Y.cardH} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
          <text x={COL.architecture + 14} y={Y.card + 40} textAnchor="middle" fontFamily={F.sans} fontSize={19} fill={C.cardText}>more documentation</text>
        </g>
      </Svg>
      <Callout className="pre co-loss" x={1240} y={Y.tax - 190} w={420} kind="Every translation" text="Time lost · information lost" tone={C.tax} target="tax.definition" />
      <div className="pre meters" style={{ position: 'absolute', left: 1430, top: 120, width: 360, display: 'flex', gap: 30, alignItems: 'flex-end', height: 270, padding: '0 20px' }}>
        {[['code generation', 'up', C.pass], ['team delivery', 'flat', C.tax]].map(([k, d, c]) => (
          <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ height: 210, width: 56, background: C.canvasRaised, border: `1px solid ${C.hairline}`, borderRadius: 8, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
              <div className={`meter meter-${d}`} style={{ width: '100%', height: '18%', background: c }} />
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 15, color: C.text, textAlign: 'center' }}>{k}</div>
          </div>
        ))}
      </div>
      <FigureChip className="pre chip-redo" x={COL.architecture + 150} y={Y.tax - 190} w={300} figure="2 weeks" label="of work partly redone" source="sdlc/translation-tax.md" target="example.ambiguity" />
      <Callout className="pre co-months" x={1260} y={290} w={400} kind="Non-persistence" text="Months of rediscovery" tone={C.warn} target="example.non-persistence" />
      <Callout className="pre co-session" x={180} y={Y.flow + 100} w={380} kind="Coding agent" text="Each session starts empty" tone={C.text} anchor={{ x: DEV.x - 85, y: Y.flow + 50 }} target="example.agent-session" />
      <FigureChip className="pre chip-2days" x={1260} y={250} w={330} figure="2 days" label="to find the cause" source="sdlc/translation-tax.md" target="example.non-traceability" />
      <FigureChip className="pre chip-40" x={1330} y={130} w={430} figure="~40%" label="of sampled architecture pages materially out of date by year end, on one platform team" source="sdlc/translation-tax.md#why-documentation-does-not-fix-it" target="fig.docs-40-percent" />
      <Callout className="pre co-decay" x={760} y={Y.tax - 190} w={360} kind="More documentation" text="More text, same decay" tone={C.warn} target="decay.documentation" />
      <Callout className="pre co-change" x={680} y={Y.tax - 34} w={560} kind="Next" text="Change how the knowledge is recorded" tone={C.text} target="need.change-medium" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const top = '.top .lbl, .top .cus, .top .card';
    tl.set(q(top), { opacity: 0.3 }, 0);
    tl.set(q('.bottom'), { opacity: 0.45 }, 0);
    // s1: what the tax is.
    const s1 = cue('definition', 's0');
    tl.fromTo(q('.band-title'), { scale: 0.8, transformOrigin: '960px 0px' }, { scale: 1, duration: 0.6 }, s1);
    appear(ctx, '.ends', s1 + 0.6);
    // s2: every translation loses time and information.
    const s2 = cue('loss', 's1');
    appear(ctx, '.crosser', s2);
    tl.to(q('.cr'), { attr: { cx: BAND.x + BAND.w - 60, r: 6 }, duration: 2.4, ease: 'none' }, s2 + 0.2);
    tl.fromTo(q('.cr-frag'), { opacity: 0.9, attr: { cy: BAND.y + 54 } }, { opacity: 0, attr: { cy: BAND.y + 120 }, duration: 0.8 }, s2 + 1.4);
    appear(ctx, '.co-loss', s2 + 0.6);
    // s3: the agent writes code fast; knowledge still crawls across the band; the clock runs.
    const s3 = cue('faster', 's2');
    vanish(ctx, '.co-loss, .ends', s3);
    tl.to(q('.bottom'), { opacity: 1, duration: 0.4 }, s3);
    [0, 1, 2, 3, 4, 5].forEach((i) => tl.fromTo(q(`.code-bit-${i}`), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.2 }, s3 + 0.2 + i * 0.1));
    tl.fromTo(q('.cr'), { attr: { cx: BAND.x + 60, r: 11 } }, { attr: { cx: 760 }, duration: 5, ease: 'none' }, s3 + 0.2);
    appear(ctx, '.clock', s3 + 0.3);
    tl.fromTo(q('.hand'), { rotation: 0 }, { rotation: 720, duration: 5, ease: 'none' }, s3 + 0.3);
    // s4: code generation rises; team delivery stays flat.
    const s4 = cue('meters', 's3');
    tl.to(q(top), { opacity: 0.06, duration: 0.3 }, s4);
    appear(ctx, '.meters', s4);
    tl.to(q('.meter-up'), { height: '92%', duration: 1.4, ease: 'power2.out' }, s4 + 0.4);
    // s5: three components.
    const s5 = cue('components', 's4');
    vanish(ctx, '.meters, .clock, .crosser, .code-bit', s5);
    tl.to(q('.bottom'), { opacity: 0.45, duration: 0.4 }, s5);
    tl.to(q(top), { opacity: 0.3, duration: 0.4 }, s5);
    tl.to(q('.band-title'), { autoAlpha: 0, duration: 0.3 }, s5);
    STRANDS.forEach((s, i) => appear(ctx, `.strand-${s.id}`, s5 + 0.3 + i * 0.3, { y: 0 }));
    // Each component in turn: its strand labels itself; the others dim; the top dims further.
    const focus = (id: string, at: number) => {
      tl.to(q('.strand'), { opacity: 0.25, duration: 0.3 }, at);
      tl.to(q(`.strand-${id}`), { opacity: 1, duration: 0.3 }, at);
      tl.to(q(top), { opacity: 0.12, duration: 0.3 }, at);
      appear(ctx, `.sname-${id}`, at + 0.2, { y: 0 });
    };
    // s6 to s9: ambiguity.
    const s6 = cue('ambiguity', 's5');
    focus('amb', s6);
    const s7 = cue('phrase', 's6');
    appear(ctx, '.phrase', s7);
    const s8 = cue('reads', 's7');
    READS.forEach((_, i) => appear(ctx, `.read-${i}`, s8 + i * 0.5));
    const s9 = cue('redo', 's8');
    tl.to(q('.bottom'), { opacity: 1, duration: 0.3 }, s9);
    appear(ctx, '.meet', s9, { y: 0 });
    appear(ctx, '.chip-redo', s9 + 0.8);
    // s10 to s12: non-persistence.
    const s10 = cue('persistence', 's9');
    vanish(ctx, '.phrase, .read, .meet, .chip-redo', s10);
    tl.to(q('.bottom'), { opacity: 0.45, duration: 0.3 }, s10);
    focus('per', s10);
    const s11 = cue('leaves', 's10');
    tl.to(q('.top .cus-code'), { opacity: 1, duration: 0.3 }, s11);
    tl.to(q('.top .cus-code .dev-2'), { x: 260, autoAlpha: 0, duration: 1.6, ease: 'power1.in' }, s11 + 0.3);
    appear(ctx, '.calendar', s11 + 1.0);
    appear(ctx, '.co-months', s11 + 1.6);
    const s12 = cue('session', 's11');
    vanish(ctx, '.calendar, .co-months', s12);
    tl.to(q('.top .cus-code'), { opacity: 0.12, duration: 0.3 }, s12);
    tl.to(q('.bottom'), { opacity: 1, duration: 0.3 }, s12);
    appear(ctx, '.session', s12 + 0.2);
    tl.to(q('.session'), { opacity: 0.2, duration: 0.4, repeat: 3, yoyo: true }, s12 + 1.0);
    appear(ctx, '.co-session', s12 + 0.5);
    // s13 to s15: non-traceability.
    const s13 = cue('traceability', 's12');
    vanish(ctx, '.session, .co-session', s13);
    tl.to(q('.bottom'), { opacity: 0.45, duration: 0.3 }, s13);
    focus('tra', s13);
    const s14 = cue('worker', 's13');
    appear(ctx, '.feat', s14);
    appear(ctx, '.worker', s14 + 0.6);
    appear(ctx, '.emails', s14 + 1.4);
    const s15 = cue('nolink', 's14');
    tl.fromTo(q('.noline'), { autoAlpha: 1, attr: { x2: COL.functional + 122 } }, { attr: { x2: 960 }, duration: 1.2 }, s15);
    appear(ctx, '.chip-2days', s15 + 1.0);
    // s16 to s18: more documentation, and its decay.
    const s16 = cue('moredocs', 's15');
    vanish(ctx, '.feat, .worker, .emails, .noline, .chip-2days', s16);
    tl.to(q('.strand'), { opacity: 0.3, duration: 0.4 }, s16);
    tl.to(q(top), { opacity: 1, duration: 0.4 }, s16);
    appear(ctx, '.moredoc', s16 + 0.4);
    const s17 = cue('forty', 's16');
    tl.to(q(top), { opacity: 0.12, duration: 0.3 }, s17);
    tl.to(q('.top .card-architecture, .top .lbl-architecture, .top .cus-architecture'), { opacity: 1, duration: 0.3 }, s17);
    appear(ctx, '.chip-40', s17);
    const s18 = cue('decay', 's17');
    vanish(ctx, '.chip-40', s18);
    tl.to(q(top), { opacity: 1, duration: 0.3 }, s18);
    tl.to(q('.top .card, .moredoc'), { opacity: 0.22, duration: 1.6 }, s18 + 0.4);
    appear(ctx, '.co-decay', s18 + 0.4);
    // s19: change how the knowledge is recorded.
    const s19 = cue('change', 's18');
    vanish(ctx, '.co-decay, .moredoc', s19);
    tl.to(q('.top .lbl, .top .cus'), { opacity: 0.3, duration: 0.4 }, s19);
    tl.to(q('.top .card'), { opacity: 1, duration: 0.6 }, s19 + 0.3);
    tl.to(q('.strand'), { opacity: 0.1, duration: 0.4 }, s19);
    appear(ctx, '.co-change', s19 + 0.5);
  },
};
