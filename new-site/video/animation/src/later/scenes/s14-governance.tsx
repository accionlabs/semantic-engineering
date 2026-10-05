import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Frame, Heading, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 14. Below the line, semantic engineering governs change to the domain invariants through
// a four-layer knowledge graph. It closes on the two disciplines, one on each side of the line.
const rail = makeRail('rail', { lit: 3, lineAt: 4, label: 'invariants', glow: true });
const L = 500, R = 1320, TOP = 310, ROW = 146;
const LAYERS = [
  { name: 'Functional', custodian: 'Product owner', nodes: ['Persona', 'Outcome', 'Scenario', 'Step'] },
  { name: 'Design', custodian: 'UX designer', nodes: ['Atom', 'Molecule', 'Organism', 'Page'] },
  { name: 'Architecture', custodian: 'Architect', nodes: ['Gateway', 'Service', 'Event', 'Data'] },
  { name: 'Code', custodian: 'Engineering team', nodes: ['File', 'Class', 'Function', 'Endpoint'] },
];
// Nodes the change touches, in the order the traversal reaches them: [layer, node].
const TOUCHED: [number, number][] = [[0, 2], [0, 3], [1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]];
const nx = (j: number) => L + 200 + ((R - L - 220) / 4) * (j + 0.5);
const ny = (i: number) => TOP + 40 + i * ROW;
const REPORT = ['Functional    2 scenarios, steps', 'Design        1 organism, 1 page', 'Architecture  2 services', 'Code          2 classes, functions'];
const PULSE = { x: L - 14, y: ny(0) - 50, w: R - L + 28, h: ny(3) - ny(0) + 100 };
const SPLIT_Y = 500; // the multi-tenancy line in the closing pair

const Box: React.FC<{ tone: string; children: React.ReactNode }> = ({ tone, children }) => (
  <div style={{ fontFamily: F.mono, fontSize: 16, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${tone}`, color: C.text, background: C.canvasRaised }}>{children}</div>
);

export const scene14: SceneDef = {
  n: 14,
  id: 'governance',
  View: () => (
    <Frame act="Act 3" scene="Scene 14 · Governing the invariants">
      <Svg>
        <rail.View />
        <g className="r-graph" data-target="graph.four-layer">
          <g className="graph-inner">
            {LAYERS.slice(0, 3).map((_, i) => (
              <g key={i} className={`pre links links-${i}`}>
                {LAYERS[i].nodes.map((__, j) => (
                  <line key={j} x1={nx(j)} y1={ny(i) + 22} x2={nx(j)} y2={ny(i + 1) - 22} stroke={C.invariantEdge} strokeWidth={1.2} strokeDasharray="3 6" opacity={0.5} />
                ))}
              </g>
            ))}
            {LAYERS.map((layer, i) => (
              <g key={layer.name} className={`pre layer layer-${i}`} data-target={`ontology.${layer.name.toLowerCase()}`}>
                <rect x={L - 10} y={ny(i) - 46} width={R - L + 20} height={92} rx={12} fill={C.canvasRaised} stroke={C.hairline} />
                <text x={L + 10} y={ny(i) - 8} fontFamily={F.sans} fontWeight={600} fontSize={21} fill={C.text}>{layer.name}</text>
                <g className={`pre cust cust-${i}`} data-target={`custodian.${i}`}>
                  <rect x={L + 10} y={ny(i) + 6} width={160} height={26} rx={13} fill="none" stroke={C.invariantEdge} strokeWidth={1.5} />
                  <text x={L + 90} y={ny(i) + 24} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.invariantEdge}>{layer.custodian}</text>
                </g>
                {layer.nodes.map((nd, j) => (
                  <g key={nd}>
                    {j < 3 && <line x1={nx(j) + 22} y1={ny(i)} x2={nx(j + 1) - 22} y2={ny(i)} stroke={C.sharedEdge} strokeWidth={2} />}
                    <circle className={`pre hit hit-${i}-${j}`} cx={nx(j)} cy={ny(i)} r={28} fill={C.warn} fillOpacity={0.2} />
                    <circle className={`nd nd-${i}-${j}`} cx={nx(j)} cy={ny(i)} r={20} fill={C.canvas} stroke={C.invariantEdge} strokeWidth={2.5} />
                    <text x={nx(j)} y={ny(i) + 42} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>{nd}</text>
                  </g>
                ))}
              </g>
            ))}
            <g className="pre change" data-target="change.invariant">
              <rect x={nx(2) - 150} y={TOP - 92} width={300} height={40} rx={20} fill={C.warnSoft} stroke={C.warn} strokeWidth={1.5} />
              <text x={nx(2)} y={TOP - 66} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.warn}>change to an invariant</text>
              <line x1={nx(2)} y1={TOP - 52} x2={nx(2)} y2={ny(0) - 22} stroke={C.warn} strokeWidth={2} strokeDasharray="4 4" />
            </g>
            <rect className="pre pulse" x={PULSE.x} y={PULSE.y} width={PULSE.w} height={PULSE.h} rx={14} fill="none" stroke={C.tenant[3]} strokeWidth={3} />
          </g>
        </g>
        <g className="r-split">
          <g className="pre split">
            <line className="split-line" x1={520} x2={1860} y1={SPLIT_Y} y2={SPLIT_Y} stroke={C.line} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.line})` }} />
            <text x={1860} y={SPLIT_Y - 14} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.line}>multi-tenancy line</text>
          </g>
        </g>
      </Svg>

      <Heading className="pre head" x={500} y={110} size={40}>Below the line, the graph governs change</Heading>
      <div className="pre tag" style={{ position: 'absolute', left: 502, top: 168, fontFamily: F.mono, fontSize: 15, letterSpacing: 2, color: C.invariantEdge }}>SEMANTIC ENGINEERING</div>

      <Callout className="pre c-layers" x={1360} y={250} w={480} kind="Four layers, named custodians" text="What it does, how it looks, how it is organised, how it is built."
        tone={C.invariantEdge} anchor={{ x: R + 10, y: ny(0) }} target="callout.layers" />
      <Callout className="pre c-impact" x={1360} y={250} w={480} kind="Impact first" text="Agents trace everything the change touches, across every layer."
        tone={C.warn} anchor={{ x: R + 10, y: ny(2) }} target="callout.impact" />

      <div className="r-report">
        <div className="pre report" data-target="report.impact" style={{ position: 'absolute', left: 1360, top: 440, width: 480, background: C.canvasRaised, border: `1.5px solid ${C.warn}`, borderRadius: 12, padding: '14px 18px', fontFamily: F.mono }}>
          <div style={{ fontSize: 13, letterSpacing: 1.8, color: C.warn }}>IMPACT REPORT · BEFORE ANY CODE</div>
          {REPORT.map((l) => <div key={l} style={{ fontSize: 17, marginTop: 8, color: C.text, whiteSpace: 'pre' }}>{l}</div>)}
          <div style={{ fontSize: 12, marginTop: 10, color: C.muted, letterSpacing: 1 }}>ILLUSTRATIVE</div>
        </div>
      </div>
      <div className="r-gate">
        <div data-target="gate.validation" style={{ position: 'absolute', left: 1360, top: 330, width: 520, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="pre gen"><Box tone={C.tenant[3]}>generation agent · works only against the graph</Box></div>
          <div className="pre gate"><Box tone={C.invariantEdge}>validation gate · <span className="gate-state">checking against the graph</span></Box></div>
          <div className="pre merged" style={{ fontFamily: F.mono, fontSize: 16, padding: '4px 14px', color: C.tenant[3] }}>graph updated on merge</div>
        </div>
      </div>

      {/* the closing pair: one statement and one discipline on each side of the line */}
      <div className="r-above">
        <Heading className="pre above" x={540} y={300} w={800} size={42} colour={C.tenant[3]}>Above the line, the language bounds what each customer can change.</Heading>
        <Callout className="pre d-dialect" x={1360} y={296} w={480} kind="Dialect engineering · above the line" text="Governs each customer's language" tone={C.tenant[3]} target="discipline.dialect" />
      </div>
      <div className="r-below">
        <Heading className="pre below" x={540} y={548} w={800} size={42} colour={C.invariantEdge}>Below it, the graph governs what the product can change.</Heading>
        <Callout className="pre d-semantic" x={1360} y={544} w={480} kind="Semantic engineering · below the line" text="Governs the invariants" tone={C.invariantEdge} target="discipline.semantic" />
        <div className="pre link" data-target="link.semantic-engineering" style={{ position: 'absolute', left: 1378, top: 650, fontFamily: F.mono, fontSize: 18, color: C.invariantEdge }}>semantic-engineering.ai</div>
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    appear(ctx, '.head', cue('heading', 's0+0.3'));
    appear(ctx, '.tag', cue('semantic', 's1+0.2'));

    const layers = cue('layers', 's2'), impact = cue('impact', 's4'), gate = cue('gate', 's5');
    const above = cue('above', 's7'), below = cue('below', 's8'), semantic = cue('semantic-name', 's9'), dialect = cue('dialect-name', 's10');
    focusBeats(ctx, [
      { id: 'layers', at: layers, regions: ['.r-graph'], callout: '.c-layers' },
      { id: 'impact', at: impact, regions: ['.r-graph', '.r-report'], callout: '.c-impact' },
      { id: 'gate', at: gate, regions: ['.r-graph', '.r-gate'] },
      { id: 'above', at: above, regions: ['.r-above', '.r-split'] },
      { id: 'below', at: below, regions: ['.r-below', '.r-split'] },
      { id: 'semantic', at: semantic, regions: ['.r-below', '.r-split'] },
      { id: 'dialect', at: dialect, regions: ['.r-above', '.r-split'] },
    ], 0.25);

    // Layers: four layers build one at a time, then each custodian is named.
    LAYERS.forEach((_, i) => {
      appear(ctx, `.layer-${i}`, layers + 0.3 + i * 2.2);
      if (i > 0) appear(ctx, `.links-${i - 1}`, layers + 0.5 + i * 2.2, { y: 0 });
      appear(ctx, `.cust-${i}`, cue('custodians', 's3') + i * 0.7, { y: 0 });
    });

    // Impact: a change arrives from above and the traversal lights every node it touches.
    appear(ctx, '.change', impact + 0.3);
    TOUCHED.forEach(([i, j], k) => {
      const at = impact + 1.6 + k * 0.7;
      tl.to(q(`.nd-${i}-${j}`), { attr: { stroke: C.warn, 'stroke-width': 3.5 }, duration: 0.3 }, at);
      appear(ctx, `.hit-${i}-${j}`, at, { y: 0, duration: 0.3 });
    });
    appear(ctx, '.report', impact + 7.6);
    vanish(ctx, '.report', gate - 0.3);

    // Gate: generation against the graph, the validation gate passes, merge, the graph updates.
    appear(ctx, '.gen', gate + 0.4);
    appear(ctx, '.gate', cue('validate', 's5+4'));
    const pass = cue('pass', 's5+8');
    tl.to(q('.gate-state'), { text: 'pass, merge', duration: 0.5, ease: 'none' }, pass);
    tl.to(q('.gate > div'), { borderColor: C.tenant[3], duration: 0.4 }, pass);
    const sync = cue('sync', 's6');
    appear(ctx, '.merged', sync);
    tl.set(q('.pulse'), { autoAlpha: 1 }, sync + 0.3);
    tl.fromTo(q('.pulse'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'power1.inOut' }, sync + 0.3);
    tl.to(q('.pulse'), { autoAlpha: 0, duration: 0.6 }, sync + 2.2);
    TOUCHED.forEach(([i, j]) => {
      tl.to(q(`.nd-${i}-${j}`), { attr: { stroke: C.invariantEdge, 'stroke-width': 2.5 }, duration: 0.5 }, sync + 1.2);
      tl.to(q(`.hit-${i}-${j}`), { autoAlpha: 0, duration: 0.5 }, sync + 1.2);
    });
    vanish(ctx, '.gen, .gate, .merged', above - 0.4);

    // Summary: the graph and heading clear; one statement on each side of the line.
    vanish(ctx, '.graph-inner, .head, .tag', above - 0.4, { duration: 0.5 });
    tl.set(q('.split'), { autoAlpha: 1 }, above);
    tl.fromTo(q('.split-line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, above);
    appear(ctx, '.above', above + 0.3);
    appear(ctx, '.below', below + 0.1);
    // The two disciplines, each named as it is spoken.
    appear(ctx, '.d-semantic', semantic + 0.2);
    appear(ctx, '.link', semantic + 0.8);
    appear(ctx, '.d-dialect', dialect + 0.2);
  },
};
