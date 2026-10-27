import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { BAR, COLS, GATES, LOW_Y, Pipeline, ROW, rowY, Tick } from '../parts/Pipeline';
import { Body, Callout, DocIcon, FigureChip, Heading, Person, Pill, Svg, Frame } from '../parts/ui';
import { C, F } from '../theme';

// Scene 23. What ASIMOV is and how it works: the platform film that opens Act 4. A legacy system under
// pressure, why translating it fails, then the pipeline: source and target graphs, the specification and the
// client's decisions, module-by-module migration through the four gates, expert review and tests, where it
// runs and what the client keeps, results, and the ways to start.
const STACKS = ['COBOL', 'Delphi', 'VB.NET', 'Java', 'ASP.NET'];
const PRESSURE = ['Scarce skills', 'Rising running costs', 'End of support'];
const LEG = { x: 300, y: 300, w: 560, h: 380 };
const COPY = { x: 1120, y: 300, w: 560, h: 380 };
const OUTPUTS = ['Business requirements', 'Test scenarios', 'Code chat'];
const TESTS = ['Running interfaces compared', 'Unit tests', 'End-to-end workflows'];
const KEEP = [
  { label: 'Code', glyph: '</>' },
  { label: 'Tests', glyph: '✓' },
  { label: 'Documentation', glyph: '¶' },
  { label: 'Evidence', glyph: '§' },
];
const CHIPS = [
  { f: '15M+ lines', l: 'of legacy code modernized, in more than ten programs', s: 'ASIMOV engagements', t: 'fig.asimov-15m-loc' },
  { f: '2.1M lines', l: 'Java 8 to Java 21 in about three and a half months', s: 'inventory and warehouse platform', t: 'fig.java-21-upgrade' },
  { f: '~60% less effort', l: 'Delphi to .NET 8, about 3 million lines, against manual work', s: 'education-technology platform', t: 'fig.delphi-net8' },
  { f: '600K lines', l: 'COBOL on AS/400 to .NET 8 services', s: 'group insurance platform', t: 'fig.cobol-net8' },
];
const CHIP_POS = [{ x: 200, y: 200 }, { x: 1000, y: 200 }, { x: 200, y: 520 }, { x: 1000, y: 520 }];
const PHASES = [
  { label: 'Discovery', time: '2 to 4 weeks', w: 360 },
  { label: 'First module', time: '6 to 12 weeks', w: 520 },
  { label: 'The rest, in waves', time: 'quarters', w: 640 },
];
// The module tokens that travel from the specification to the target column through the gates.
const TOKEN_Y = BAR.y + BAR.h / 2;
const EXPERT = { x: COLS.source.x + 60, y: LOW_Y };
const Token: React.FC<{ className: string }> = ({ className }) => (
  <g className={className}>
    <rect x={-46} y={-17} width={92} height={34} rx={8} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.8} />
    <text x={0} y={6} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.text}>module</text>
  </g>
);

export const scene23: SceneDef = {
  n: 23,
  id: 'asimov-platform',
  View: () => (
    <Frame act="Act 4" scene="Scene 23 · What ASIMOV is and how it works">
      {/* s1 to s4: the legacy system, its pressures, and the copy that misses behaviour */}
      <Svg className="legacy">
        <g className="pre leg" data-target="legacy.system">
          <rect x={LEG.x} y={LEG.y} width={LEG.w} height={LEG.h} rx={16} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2.5} />
          <text x={LEG.x + 24} y={LEG.y + 40} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.layer.code}>LEGACY SYSTEM</text>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${LEG.x + 40 + (i % 3) * 170} ${LEG.y + 110 + Math.floor(i / 3) * 80} q60 -30 120 0 t60 30`} fill="none" stroke={C.layer.code} strokeWidth={1.5} opacity={0.45} />
          ))}
        </g>
        {STACKS.map((s, i) => <Pill key={s} className={`pre stack stack-${i}`} x={LEG.x + 24 + i * 104} y={LEG.y + LEG.h - 56} text={s} colour={C.layer.code} w={96} />)}
        <g className="pre rules" data-target="legacy.rules">
          {[0, 1, 2, 3].map((i) => <circle key={i} className={`rule rule-${i}`} cx={LEG.x + 110 + i * 120} cy={LEG.y + 200 + (i % 2) * 70} r={7} fill={C.warn} opacity={0.35} />)}
        </g>
        <g className="pre docs">
          <DocIcon x={LEG.x + LEG.w + 40} y={LEG.y + 30} label="specification" colour={C.card} glyph="?" />
          <DocIcon x={LEG.x + LEG.w + 40} y={LEG.y + 190} label="design notes" colour={C.card} glyph="?" />
        </g>
        <g className="pre copy" data-target="legacy.translation">
          <path d={`M${LEG.x + LEG.w + 20} ${LEG.y + LEG.h / 2} H${COPY.x - 20}`} stroke={C.muted} strokeWidth={2.5} markerEnd="" />
          <path d={`M${COPY.x - 34} ${LEG.y + LEG.h / 2 - 10} l14 10 l-14 10`} fill="none" stroke={C.muted} strokeWidth={2.5} />
          <rect x={COPY.x} y={COPY.y} width={COPY.w} height={COPY.h} rx={16} fill={C.canvasRaised} stroke={C.muted} strokeWidth={2} strokeDasharray="8 6" />
          <text x={COPY.x + 24} y={COPY.y + 40} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.muted}>NEW LANGUAGE, SAME SHAPE</text>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${COPY.x + 40 + (i % 3) * 170} ${COPY.y + 110 + Math.floor(i / 3) * 80} q60 -30 120 0 t60 30`} fill="none" stroke={C.muted} strokeWidth={1.5} opacity={0.45} />
          ))}
          {[0, 2].map((i) => <circle key={i} cx={COPY.x + 110 + i * 120} cy={COPY.y + 200 + (i % 2) * 70} r={13} fill="none" stroke={C.warn} strokeWidth={2.5} strokeDasharray="4 4" />)}
        </g>
      </Svg>
      {PRESSURE.map((p, i) => <Callout key={p} className={`pre pressure pressure-${i}`} x={LEG.x + LEG.w + 60 + (i % 2) * 40} y={260 + i * 150} w={420} kind="Pressure" text={p} tone={C.warn} target="legacy.pressure" />)}
      <Body className="pre copy-note" x={COPY.x} y={COPY.y + COPY.h + 24} w={COPY.w} size={22} colour={C.warn}>Behaviour that was never written down is lost.</Body>

      {/* s5: the platform */}
      <Heading className="pre title" x={160} y={380} size={120} target="platform.asimov">ASIMOV</Heading>
      <Body className="pre subtitle" x={166} y={520} w={1100} size={32} colour={C.text}>First, reconstruct what the old system does.</Body>

      {/* s6 to s12: the pipeline */}
      <Svg className="pre pipe">
        <Pipeline show={['frame']} />
        <g className="pre outs">
          {OUTPUTS.map((o, i) => <Pill key={o} className={`out out-${i}`} x={COLS.spec.x + 10 + i * 150} y={LOW_Y} text={o} colour={C.cardText} w={140} />)}
        </g>
        <g className="pre reviewers">
          <Person x={COLS.spec.x + 60} y={LOW_Y + 6} r={18} />
          <Person x={COLS.spec.x + 130} y={LOW_Y + 6} r={18} />
          <text x={COLS.spec.x + 170} y={LOW_Y + 34} fontFamily={F.sans} fontSize={20} fill={C.text}>product owner and architect decide</text>
        </g>
        <g className="pre move-a"><g className="tok-a" transform={`translate(${ROW.x + ROW.w / 2} ${rowY(0) + 27})`}><Token className="tok" /></g></g>
        <g className="pre move-b"><g className="tok-b" transform={`translate(${COLS.spec.x + 120} ${TOKEN_Y})`}><Token className="tok" /></g></g>
        {GATES.map((g, i) => <Tick key={g.id} className={`pre ok-a ok-a-${i}`} x={g.x} y={BAR.y - 26} />)}
        <Tick className="pre stop-b" x={GATES[3].x} y={BAR.y - 26} ok={false} />
        <g className="pre expert">
          <Person x={EXPERT.x} y={EXPERT.y} r={20} />
          <text x={EXPERT.x + 34} y={EXPERT.y + 30} fontFamily={F.sans} fontSize={20} fill={C.text}>expert review</text>
        </g>
        <g className="pre tests" data-target="asimov.tests">
          {TESTS.map((t, i) => <Pill key={t} className={`test test-${i}`} x={720 + i * 330} y={LOW_Y + 10} text={t} colour={C.pass} w={280} />)}
        </g>
      </Svg>
      <Callout className="pre co co-graphs" x={COLS.spec.x} y={LOW_Y - 10} w={600} kind="Two graphs" text="What the old system does, and the approved target" tone={C.layer.architecture} target="graph.source-state" />
      <Callout className="pre co co-loop" x={COLS.source.x} y={LOW_Y - 10} w={640} kind="A gate fails" text="Back to the agents with the evidence, until every gate passes" tone={C.warn} target="contract.parity" />

      {/* s13 and s14: where it runs and what the client keeps */}
      <Svg className="pre runs">
        <rect x={140} y={170} width={1060} height={560} rx={22} fill="none" stroke={C.text} strokeWidth={2} strokeDasharray="10 8" />
        <text x={170} y={210} fontFamily={F.mono} fontSize={16} letterSpacing={2} fill={C.text}>THE CLIENT'S ENVIRONMENT</text>
        <rect x={260} y={300} width={420} height={260} rx={16} fill={C.canvasRaised} stroke={C.layer.code} strokeWidth={2} />
        <text x={470} y={440} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={44} fill={C.text}>ASIMOV</text>
        <rect className="newsys" x={1340} y={300} width={420} height={260} rx={16} fill={C.canvasRaised} stroke={C.layer.architecture} strokeWidth={2.5} />
        <text x={1550} y={440} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={30} fill={C.text}>The new system</text>
      </Svg>
      <Body className="pre runs-note" x={1340} y={590} w={440} size={22} colour={C.text}>No dependency on ASIMOV or on any cloud provider.</Body>
      <Svg className="pre keep">
        {KEEP.map((k, i) => <DocIcon key={k.label} className={`keep-${i}`} x={1300 + i * 120} y={760} label={k.label} colour={C.pass} glyph={k.glyph} />)}
      </Svg>

      {/* s15 to s17: results */}
      {CHIPS.map((c, i) => <FigureChip key={c.t} className={`pre chip chip-${i}`} x={CHIP_POS[i].x} y={CHIP_POS[i].y} w={700} figure={c.f} label={c.l} source={c.s} target={c.t} />)}

      {/* s18 and s19: how a program runs, and the smaller start */}
      <div className="pre phases" data-target="asimov.phases" style={{ position: 'absolute', left: 200, top: 360, display: 'flex', gap: 16 }}>
        {PHASES.map((p, i) => (
          <div key={p.label} className={`phase phase-${i}`} style={{ width: p.w, background: C.canvasRaised, border: `1.5px solid ${C.layer.architecture}`, borderRadius: 12, padding: '18px 22px' }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{p.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: 18, color: C.muted, marginTop: 6 }}>{p.time}</div>
          </div>
        ))}
      </div>
      <FigureChip className="pre doc-only" x={200} y={600} w={760} figure="2 to 6 weeks" label="Documentation Only: what a system that keeps running does, written down" source="the smallest way to start" target="asimov.documentation-only" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: the legacy system and its stacks.
    const s1 = cue('legacy', 's0');
    appear(ctx, '.leg', s1 + 0.2, { y: 0 });
    STACKS.forEach((_, i) => appear(ctx, `.stack-${i}`, s1 + 1 + i * 0.5));
    // s2: the pressures.
    const s2 = cue('pressure', 's1');
    PRESSURE.forEach((_, i) => appear(ctx, `.pressure-${i}`, s2 + 0.3 + i * 0.9));
    // s3: rules buried in the code, documents missing.
    const s3 = cue('buried', 's2');
    vanish(ctx, '.pressure', s3);
    appear(ctx, '.rules', s3 + 0.4, { y: 0 });
    appear(ctx, '.docs', s3 + 1.4);
    tl.to(q('.docs'), { opacity: 0.35, duration: 1.2 }, s3 + 3);
    // s4: a translation copies the shape and loses what was never written down.
    const s4 = cue('copy', 's3');
    vanish(ctx, '.docs', s4);
    appear(ctx, '.copy', s4 + 0.3, { y: 0, duration: 0.8 });
    appear(ctx, '.copy-note', s4 + 2);
    // s5: the platform.
    const s5 = cue('title', 's4');
    vanish(ctx, '.legacy, .stack, .copy-note', s5, { duration: 0.6 });
    appear(ctx, '.title', s5 + 0.5);
    appear(ctx, '.subtitle', s5 + 1.6);
    // s6: the two graphs.
    const s6 = cue('graphs', 's5');
    vanish(ctx, '.title, .subtitle', s6);
    appear(ctx, '.pipe', s6 + 0.2, { y: 0 });
    appear(ctx, '.pp-source', s6 + 0.6, { y: 0, duration: 0.8 });
    appear(ctx, '.pp-target', s6 + 2.4, { y: 0, duration: 0.8 });
    appear(ctx, '.co-graphs', s6 + 1.2);
    // s7: the specification and what it produces.
    const s7 = cue('spec', 's6');
    vanish(ctx, '.co-graphs', s7);
    appear(ctx, '.pp-spec', s7 + 0.3, { y: 0 });
    appear(ctx, '.outs', s7 + 1.6);
    // s8: the client's decisions on every module.
    const s8 = cue('decide', 's7');
    vanish(ctx, '.outs', s8);
    appear(ctx, '.reviewers', s8 + 0.2);
    appear(ctx, '.pp-tags', s8 + 1.2, { y: 0, stagger: 0.4 });
    // s9: agents build one module at a time.
    const s9 = cue('build', 's8');
    vanish(ctx, '.reviewers', s9);
    appear(ctx, '.pp-bar', s9 + 0.2, { y: 0 });
    appear(ctx, '.move-a', s9 + 0.8, { y: 0 });
    tl.to(q('.tok-a'), { attr: { transform: `translate(${COLS.spec.x + 120} ${TOKEN_Y})` }, duration: 1.4, ease: 'power2.inOut' }, s9 + 1.2);
    // s10: four gates; the module passes each.
    const s10 = cue('gates', 's9');
    appear(ctx, '.pp-gates', s10 + 0.2, { y: 0 });
    GATES.forEach((g, i) => {
      tl.to(q('.tok-a'), { attr: { transform: `translate(${g.x - 60} ${TOKEN_Y})` }, duration: 0.9, ease: 'power1.inOut' }, s10 + 1.2 + i * 1.3);
      appear(ctx, `.ok-a-${i}`, s10 + 2 + i * 1.3, { y: 0, duration: 0.3 });
    });
    tl.to(q('.tok-a'), { attr: { transform: `translate(${COLS.target.x + 300} ${rowY(2)})` }, duration: 1, ease: 'power2.inOut' }, s10 + 7);
    // s11: a second module fails the functional gate, goes back with the evidence, then passes.
    const s11 = cue('loop', 's10');
    vanish(ctx, '.ok-a', s11);
    appear(ctx, '.move-b', s11 + 0.2, { y: 0 });
    tl.to(q('.tok-b'), { attr: { transform: `translate(${GATES[3].x - 60} ${TOKEN_Y})` }, duration: 1.4, ease: 'power1.inOut' }, s11 + 0.5);
    appear(ctx, '.stop-b', s11 + 1.9, { y: 0, duration: 0.3 });
    appear(ctx, '.co-loop', s11 + 2.2);
    tl.to(q('.tok-b'), { attr: { transform: `translate(${COLS.spec.x + 120} ${TOKEN_Y})` }, duration: 1.2, ease: 'power1.inOut' }, s11 + 3);
    vanish(ctx, '.stop-b', s11 + 3.6);
    tl.to(q('.tok-b'), { attr: { transform: `translate(${COLS.target.x + 300} ${rowY(3)})` }, duration: 2, ease: 'power1.inOut' }, s11 + 4.8);
    // s12: expert review and the tests that compare the two systems.
    const s12 = cue('tests', 's11');
    vanish(ctx, '.co-loop', s12);
    appear(ctx, '.expert', s12 + 0.2);
    appear(ctx, '.tests', s12 + 1.4, { y: 0 });
    // s13: where it runs; the new system stands on its own.
    const s13 = cue('runs', 's12');
    vanish(ctx, '.pipe', s13, { duration: 0.6 });
    appear(ctx, '.runs', s13 + 0.4, { y: 0, duration: 0.8 });
    appear(ctx, '.runs-note', s13 + 2);
    // s14: what the client receives.
    const s14 = cue('keep', 's13');
    appear(ctx, '.keep', s14 + 0.3, { y: 0 });
    // s15 to s17: results.
    const s15 = cue('fig-15m', 's14');
    vanish(ctx, '.runs, .runs-note, .keep', s15, { duration: 0.5 });
    appear(ctx, '.chip-0', s15 + 0.4);
    appear(ctx, '.chip-1', cue('fig-java', 's15') + 0.3);
    const s17 = cue('fig-delphi-cobol', 's16');
    appear(ctx, '.chip-2', s17 + 0.3);
    appear(ctx, '.chip-3', s17 + 3.5);
    // s18: a full modernization, phase by phase.
    const s18 = cue('phases', 's17');
    vanish(ctx, '.chip', s18, { duration: 0.5 });
    appear(ctx, '.phases', s18 + 0.4);
    // s19: or start smaller.
    const s19 = cue('start', 's18');
    tl.to(q('.phases'), { opacity: 0.35, duration: 0.5 }, s19);
    appear(ctx, '.doc-only', s19 + 0.4);
  },
};

