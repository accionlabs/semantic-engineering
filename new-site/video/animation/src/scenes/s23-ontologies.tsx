import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { BAR, COLS, LOW_Y, P, Pipeline, ROW, rowY, SPEC_ROWS, SRC_TIERS, srcNode, Tick, TGT, tgtY } from '../parts/Pipeline';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 23. Graphs of the old and new systems. Three records fixed for the project: the Source-state
// graph from the legacy code, keeping the code statements as evidence; the Target-state graph from the
// target blueprint; the specification between them, with its four outputs. The Product Owner and the
// Architect give every module one of four decisions; a module without one cannot be migrated.
const CO = { x: 1130, y: LOW_Y + 10, w: 640 };
const EXTRACT = ['requirements document', 'test scenarios', 'end-to-end test scripts', 'code chatbot'];
const LIB = { x: 1560, y: P.y1 - 40, w: 190, h: 30 };

export const scene23: SceneDef = {
  n: 23,
  id: 'source-and-target-graphs',
  View: () => (
    <Frame act="Act 4" scene="Scene 23 · Graphs of the old and new systems">
      <Svg>
        <Pipeline show={['frame']} />
        <g className="legacy">
          <rect x={180} y={250} width={320} height={300} rx={10} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
          <text x={198} y={284} fontFamily={F.mono} fontSize={16} fill={C.cardText}>Legacy code</text>
        </g>
        <g className="pre snippets">
          {[0, 1, 2, 3, 4].map((j) => {
            const p = srcNode(3, j);
            return <g key={j}><rect x={p.x - 13} y={p.y + 12} width={26} height={18} rx={3} fill={C.canvasRaised} stroke={C.layer.code} /><rect x={p.x - 8} y={p.y + 17} width={16} height={3} fill={C.layer.code} /><rect x={p.x - 8} y={p.y + 23} width={10} height={3} fill={C.layer.code} /></g>;
          })}
        </g>
        <g className="pre blueprint">
          <rect x={COLS.target.x + 60} y={260} width={340} height={260} rx={10} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
          <text x={COLS.target.x + 80} y={294} fontFamily={F.mono} fontSize={16} fill={C.cardText}>Target blueprint</text>
          {[0, 1, 2, 3, 4, 5].map((r) => <rect key={r} x={COLS.target.x + 80} y={316 + r * 30} width={[260, 200, 280, 180, 240, 150][r]} height={7} rx={3} fill={C.card} />)}
        </g>
        <g className="pre links">
          {SPEC_ROWS.map((_, i) => (
            <g key={i}>
              <line x1={COLS.source.x + COLS.source.w - 4} y1={srcNode(Math.min(i, 4), 0).y} x2={ROW.x} y2={rowY(i) + ROW.h / 2} stroke={C.layer.code} strokeWidth={1.2} opacity={0.5} />
              <line x1={ROW.x + ROW.w} y1={rowY(i) + ROW.h / 2} x2={COLS.target.x + 20} y2={tgtY(Math.min(i, 3)) + 34} stroke={C.layer.architecture} strokeWidth={1.2} opacity={0.5} />
            </g>
          ))}
        </g>
        <g className="pre extract">
          {EXTRACT.map((t, i) => (
            <g key={t} className={`ex ex-${i}`}>
              <rect x={150 + i * 230} y={LOW_Y + 12} width={210} height={44} rx={8} fill={C.canvasRaised} stroke={C.card} strokeWidth={1.5} />
              <text x={255 + i * 230} y={LOW_Y + 40} textAnchor="middle" fontFamily={F.sans} fontSize={16} fill={C.text}>{t}</text>
            </g>
          ))}
          <text x={150} y={LOW_Y + 86} fontFamily={F.mono} fontSize={14} fill={C.muted}>produced from the specification</text>
        </g>
        <g className="pre owners">
          <Person x={COLS.spec.x + 120} y={124} r={14} />
          <text x={COLS.spec.x + 146} y={136} fontFamily={F.sans} fontSize={17} fill={C.text}>Product Owner</text>
          <Person x={COLS.spec.x + 330} y={124} r={14} />
          <text x={COLS.spec.x + 356} y={136} fontFamily={F.sans} fontSize={17} fill={C.text}>Architect</text>
        </g>
        <g className="pre lib">
          <line x1={ROW.x + ROW.w} y1={rowY(2) + ROW.h / 2} x2={LIB.x} y2={LIB.y + LIB.h / 2} stroke={C.text} strokeWidth={2} />
          <rect x={LIB.x} y={LIB.y} width={LIB.w} height={LIB.h} rx={6} fill={C.canvasRaised} stroke={C.text} />
          <text x={LIB.x + LIB.w / 2} y={LIB.y + 21} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.text}>modern library</text>
        </g>
        <rect className="pre utok" x={ROW.x + ROW.w / 2 - 18} y={rowY(4) + ROW.h + 6} width={36} height={18} rx={4} fill={C.text} />
        <rect className="pre ubar" x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={12} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="8 7" />
        <Tick className="pre ustop" x={ROW.x + ROW.w / 2 + 34} y={BAR.y - 12} ok={false} />
      </Svg>
      <Callout className="pre co co-three" {...CO} kind="Three structured records" text="Each fixed for the length of the project" tone={C.text} target="ontologies.three" />
      <Callout className="pre co co-src" {...CO} kind="Source-state ontology" text="A graph of the old system, built by agents from the legacy code" tone={C.layer.code} target="graph.source-state" />
      <Callout className="pre co co-stmt" {...CO} kind="Code statements kept" text="Evidence of the behavior the new system must reproduce" tone={C.layer.code} target="node.statement-body" />
      <Callout className="pre co co-tgt" {...CO} kind="Target-state ontology" text="A graph of the new system, built from the target blueprint" tone={C.layer.architecture} target="graph.target-state" />
      <Callout className="pre co co-annot" {...CO} kind="Product Owner and Architect" text="One decision for every module" tone={C.text} target="annotate.required" />
      <Callout className="pre co co-retain" {...CO} kind="Retain" text="Behavior kept; structure changes" tone={C.text} target="annotate.retain" />
      <Callout className="pre co co-modify" {...CO} kind="Modify" text="Behavior changed in defined ways, recorded by the Product Owner" tone={C.text} target="annotate.modify" />
      <Callout className="pre co co-replace" {...CO} kind="Replace" text="A different solution, such as a modern library" tone={C.text} target="annotate.replace" />
      <Callout className="pre co co-retire" {...CO} kind="Retire" text="Removed; the retired items stay documented" tone={C.text} target="annotate.retire" />
      <Callout className="pre co co-none" {...CO} kind="No decision" text="The module cannot be migrated" tone={C.warn} target="annotate.required" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: three records, fixed for the project.
    const s1 = cue('three', 's0');
    tl.fromTo(q('.col-rect'), { attr: { stroke: C.hairline } }, { attr: { stroke: C.muted }, duration: 0.6, stagger: 0.2 }, s1 + 0.2);
    appear(ctx, '.co-three', s1 + 0.5);
    // s2: the Source-state graph, tier by tier, from the legacy code.
    const s2 = cue('source', 's1');
    vanish(ctx, '.co-three', s2);
    vanish(ctx, '.legacy', s2 + 0.3, { duration: 0.6 });
    tl.set(q('.pp-source'), { autoAlpha: 1 }, s2 + 0.3);
    SRC_TIERS.forEach((_, i) => tl.fromTo(q(`.src-tier-${i}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, s2 + 0.5 + i * 0.45));
    appear(ctx, '.co-src', s2 + 0.6);
    // s3: the statements, kept as evidence.
    const s3 = cue('statements', 's2');
    vanish(ctx, '.co-src', s3);
    tl.to(q('.src-tier'), { opacity: 0.3, duration: 0.3 }, s3 + 0.2);
    tl.to(q('.src-tier-3'), { opacity: 1, duration: 0.3 }, s3 + 0.2);
    appear(ctx, '.snippets', s3 + 0.5);
    appear(ctx, '.co-stmt', s3 + 0.6);
    // s4: the Target-state graph from the blueprint.
    const s4 = cue('target', 's3');
    vanish(ctx, '.co-stmt', s4);
    tl.to(q('.src-tier'), { opacity: 1, duration: 0.3 }, s4);
    appear(ctx, '.blueprint', s4 + 0.2);
    vanish(ctx, '.blueprint', s4 + 1.6, { duration: 0.5 });
    tl.set(q('.pp-target'), { autoAlpha: 1 }, s4 + 1.6);
    TGT.forEach((_, i) => tl.fromTo(q(`.tgt-band-${i}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, s4 + 1.8 + i * 0.4));
    appear(ctx, '.co-tgt', s4 + 0.6);
    // s5: the specification connects them, and produces four outputs.
    const s5 = cue('spec', 's4');
    vanish(ctx, '.co-tgt', s5);
    tl.set(q('.pp-spec'), { autoAlpha: 1 }, s5 + 0.2);
    SPEC_ROWS.forEach((_, i) => tl.fromTo(q(`.spec-row-${i}`), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, s5 + 0.2 + i * 0.2));
    appear(ctx, '.links', s5 + 1.3, { y: 0 });
    EXTRACT.forEach((_, i) => appear(ctx, `.ex-${i}`, s5 + 2.4 + i * 0.6));
    tl.set(q('.extract'), { autoAlpha: 1 }, s5 + 2.4);
    // s6: a decision for every module.
    const s6 = cue('annotate', 's5');
    vanish(ctx, '.extract', s6);
    appear(ctx, '.owners', s6 + 0.2);
    appear(ctx, '.co-annot', s6 + 0.4);
    // s7 to s10: the four decisions.
    tl.set(q('.pp-tags'), { autoAlpha: 1 }, 0);
    tl.set(q('.tag'), { autoAlpha: 0 }, 0);
    (['retain', 'modify', 'replace', 'retire'] as const).forEach((k, i) => {
      const t = cue(k, `s${6 + i}`);
      vanish(ctx, '.co', t);
      tl.fromTo(q(`.tag-${i}`), { autoAlpha: 0, scale: 1.6, svgOrigin: `${ROW.x + ROW.w - 59} ${rowY(i) + 27}` }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t + 0.3);
      appear(ctx, `.co-${k}`, t + 0.5);
    });
    const s9 = cue('replace-lib', 's8');
    appear(ctx, '.lib', s9 + 1.2, { y: 0 });
    const s10 = cue('retire-grey', 's9');
    tl.to(q('.src-3-4, .src-4-2'), { opacity: 0.25, duration: 0.6 }, s10 + 0.8);
    tl.to(q('.spec-row-3'), { opacity: 0.6, duration: 0.6 }, s10 + 0.8);
    // s11: no decision, no migration.
    const s11 = cue('none', 's10');
    vanish(ctx, '.co', s11);
    appear(ctx, '.ubar', s11 + 0.2, { y: 0 });
    appear(ctx, '.utok', s11 + 0.3, { y: 0 });
    tl.to(q('.utok'), { attr: { y: BAR.y - 22 }, duration: 0.8 }, s11 + 0.5);
    appear(ctx, '.ustop', s11 + 1.3, { y: 0 });
    tl.to(q('.spec-row-4 rect'), { attr: { stroke: C.warn }, duration: 0.3 }, s11 + 1.3);
    appear(ctx, '.co-none', s11 + 1.5);
  },
};
