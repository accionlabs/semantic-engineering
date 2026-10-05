import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { FigureChip, Frame, Graph, Heading, LanguageCard, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 13. An agent writes the business rules in the language, the grammar splits the long leap
// into two short steps, the agent checks its own work in a loop, and the language bounds it.
const rail = makeRail('rail', { lit: 4, lineAt: 4, label: 'business rules', glow: true });
const LINE_Y = rail.stack.boundary(4);
const X0 = 520; // centre column
const CX = 1470; // right column
const FUNNEL = [
  { label: 'Plain language', w: 560, y: 210 },
  { label: 'Grammar', w: 340, y: 320 },
  { label: 'Configuration schema', w: 250, y: 430 },
];
const STATIONS = ['Intent', 'Agent', 'Validator', 'Tests', 'Compiler', 'Result'];
const LX = 1470, LY = 740, RAD = 108;
const pos = (k: number) => {
  const a = -Math.PI / 2 + (k / STATIONS.length) * Math.PI * 2;
  return { x: LX + RAD * Math.cos(a), y: LY + RAD * Math.sin(a) };
};
const RING = `M ${LX} ${LY - RAD} A ${RAD} ${RAD} 0 1 1 ${LX} ${LY + RAD} A ${RAD} ${RAD} 0 1 1 ${LX} ${LY - RAD}`;
const TOOLS = ['grammar', 'worked examples', 'validator', 'test runner'];
const TOOL_IDS = ['tool.grammar', 'tool.examples', 'tool.validator', 'tool.tests'];
const NB = '\u00a0\u00a0';
const LINES = ['rule overtime', `${NB}when hours.week > 40`, `${NB}pay${NB}pay_element.overtime × 1.5`];
const FIXED = `${NB}when hours.weekly > 40`;
const pct = (k: number) => `0% ${((k / STATIONS.length) * 100).toFixed(3)}%`;

const Arrowhead: React.FC<{ className: string; x: number; y: number; colour: string; rot?: number }> = ({ className, x, y, colour, rot = 90 }) => (
  <g className={className}><path d="M-7 -6 L5 0 L-7 6 z" fill={colour} transform={`translate(${x} ${y}) rotate(${rot})`} /></g>
);

export const scene13: SceneDef = {
  n: 13,
  id: 'agents',
  View: () => (
    <Frame act="Act 3" scene="Scene 13 · AI agents write the language">
      <Svg>
        <g className="r-rail">
          <rail.View />
          <g className="pre bump" data-target="boundary.agent">
            <rect x={200} y={LINE_Y - 31} width={28} height={28} rx={8} fill={C.canvas} stroke={C.tenant[3]} strokeWidth={2.5} />
            <circle cx={209} cy={LINE_Y - 19} r={2.5} fill={C.tenant[3]} />
            <circle cx={219} cy={LINE_Y - 19} r={2.5} fill={C.tenant[3]} />
          </g>
          <text className="pre stops" x={64} y={545} fontFamily={F.mono} fontSize={14} fill={C.warn}>agent stops at the line</text>
        </g>
        <g className="graph-wrap">
          <Graph className="kg" dx={-30} dy={44} scale={0.92} />
          <text className="pre later" x={64} y={872} fontFamily={F.mono} fontSize={14} fill={C.invariantEdge}>later: agents may help derive</text>
          <text className="pre later" x={64} y={894} fontFamily={F.mono} fontSize={14} fill={C.invariantEdge}>the grammar from the graph</text>
        </g>

        {/* degrees of freedom: one long leap, then two short steps through the grammar */}
        <g className="r-funnel" data-target="funnel.freedom">
          <g className="pre funnel">
            {FUNNEL.map((b) => (
              <g key={b.label}>
                <rect x={CX - b.w / 2} y={b.y - 26} width={b.w} height={52} rx={26} fill={C.canvasRaised} stroke={C.hairline} strokeWidth={1.5} />
                <text x={CX} y={b.y + 7} textAnchor="middle" fontFamily={F.sans} fontWeight={500} fontSize={21} fill={C.text}>{b.label}</text>
              </g>
            ))}
          </g>
          <g className="leap">
            <path className="pre leap-path" d={`M ${CX - 250} ${236} C ${CX - 330} ${330}, ${CX - 240} ${410}, ${CX - 126} ${430}`} fill="none" stroke={C.warn} strokeWidth={2.5} opacity={0.7} />
            <Arrowhead className="pre leap-head" x={CX - 128} y={430} colour={C.warn} rot={8} />
            <text className="pre leap-label" x={CX} y={500} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.warn}>one long leap, unseen</text>
          </g>
          <line className="pre step-0" x1={CX} y1={238} x2={CX} y2={286} stroke={C.tenant[3]} strokeWidth={4} />
          <Arrowhead className="pre head-0" x={CX} y={288} colour={C.tenant[3]} />
          <line className="pre step-1" x1={CX} y1={348} x2={CX} y2={396} stroke={C.tenant[3]} strokeWidth={4} />
          <Arrowhead className="pre head-1" x={CX} y={398} colour={C.tenant[3]} />
          <text className="pre step-label" x={CX} y={500} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.tenant[3]}>two short steps, a readable document between</text>
        </g>

        {/* the loop */}
        <g className="r-loop">
          <g className="pre loop">
            <circle cx={LX} cy={LY} r={RAD} fill="none" stroke={C.hairline} strokeWidth={3} />
            <path className="ring" d={RING} fill="none" stroke={C.tenant[3]} strokeWidth={4} strokeLinecap="round" />
            <path className="pre retry" d={`M ${pos(2).x - 14} ${pos(2).y - 18} Q ${LX + 30} ${LY} ${pos(1).x - 18} ${pos(1).y + 12}`} fill="none" stroke={C.warn} strokeWidth={2.5} />
            <Arrowhead className="pre retry-head" x={pos(1).x - 18} y={pos(1).y + 12} colour={C.warn} rot={-115} />
            {STATIONS.map((s, k) => {
              const p = pos(k), right = p.x >= LX - 1;
              return (
                <g key={s} className={`st st-${k}`} data-target={`loop.${s.toLowerCase()}`}>
                  <circle className="st-dot" cx={p.x} cy={p.y} r={22} fill={C.canvasRaised} stroke={C.hairline} strokeWidth={2.5} />
                  <text className="st-label" x={p.x + (right ? 32 : -32)} y={p.y + 6} textAnchor={right ? 'start' : 'end'} fontFamily={F.sans} fontWeight={500} fontSize={18} fill={C.muted}>{s}</text>
                </g>
              );
            })}
          </g>
          <g className="pre refusal" data-target="refusal">
            <line x1={1690} x2={1690} y1={742} y2={798} stroke={C.warn} strokeWidth={3} />
            <circle className="refuse-dot" cx={1712} cy={770} r={11} fill={C.warn} />
          </g>
        </g>
      </Svg>

      <div className="r-request">
        <div className="pre request" data-target="request.expert" style={{ position: 'absolute', left: X0, top: 150, width: 600, background: C.canvasRaised, border: `1px solid ${C.hairline}`, borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: 1.6, color: C.muted }}>DOMAIN EXPERT · PLAIN LANGUAGE · ILLUSTRATIVE</div>
          <div style={{ fontSize: 26, fontWeight: 500, marginTop: 6 }}>“Pay overtime at time and a half after 40 hours a week.”</div>
        </div>
      </div>
      <div className="r-card">
        <div className="pre agent" data-target="agent" style={{ position: 'absolute', left: X0, top: 292, display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width={44} height={44}><rect x={4} y={4} width={36} height={36} rx={10} fill="none" stroke={C.tenant[3]} strokeWidth={3} /><circle cx={16} cy={20} r={3} fill={C.tenant[3]} /><circle cx={28} cy={20} r={3} fill={C.tenant[3]} /><path d="M14 30 H30" stroke={C.tenant[3]} strokeWidth={3} strokeLinecap="round" /></svg>
          <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 30 }}>AI agent writes the business rules</span>
        </div>
        <div className="pre card-wrap"><LanguageCard className="card" x={X0} y={352} w={640} tenant="Tenant C" colour={C.tenant[2]} target="card.language" lines={['', '', '']} /></div>
        <div className="pre val-error" style={{ position: 'absolute', left: X0, top: 506, fontFamily: F.mono, fontSize: 15, color: C.warn }}>validator · line 2: unknown field hours.week</div>
      </div>
      <div className="r-tools">
        <div style={{ position: 'absolute', left: X0, top: 548, display: 'flex', gap: 10, width: 780, flexWrap: 'wrap' }}>
          {TOOLS.map((t, i) => (
            <div key={t} className={`pre tool tool-${i}`} data-target={TOOL_IDS[i]} style={{ fontFamily: F.mono, fontSize: 15, padding: '6px 12px', borderRadius: 999, border: `1.5px solid ${C.tenant[3]}`, color: C.tenantText }}>{t}</div>
          ))}
          <div className="pre tool-via" style={{ fontFamily: F.mono, fontSize: 15, padding: '6px 4px', color: C.muted }}>through LSP and MCP</div>
        </div>
        <FigureChip className="pre fig-ms" x={X0} y={612} w={640} target="fig.microsoft-dsl" figure="<20% → 85%"
          label="Coding agents on bespoke domain languages, with seed examples, explicit rules, compiler-in-the-loop validation and schema exposure. 85% does not permit unattended conversion"
          source="Microsoft vendor blog" />
      </div>
      <div className="r-funnel-chip">
        <FigureChip className="pre fig-gp" x={1180} y={540} w={620} target="fig.grammar-prompting" figure="63.3% → 90.8%"
          label="Out-of-distribution accuracy, with a grammar in the model's context"
          source="Grammar Prompting for DSL Generation, NeurIPS 2023" />
      </div>
      <div className="r-bounds">
        <div className="pre refuse-text" style={{ position: 'absolute', left: 1600, top: 812, width: 290, fontFamily: F.mono, fontSize: 15, lineHeight: 1.35, color: C.warn }}>Refused: no construction for this request</div>
        <FigureChip className="pre fig-sob" x={X0} y={612} w={640} target="fig.structured-output" figure="83.0%"
          label="Best value accuracy across 21 models, while JSON pass rates ran from 84.5% to 99.97%"
          source="The Structured Output Benchmark, arXiv preprint, 2026" />
        <Heading className="pre cannot" x={X0} y={660} w={780} size={34} colour={C.warn} target="boundary.agent">Cannot add an API, a table or a code path</Heading>
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const write = cue('write', 's0'), crossing = cue('crossing', 's4'), check = cue('check', 's7'), bounds = cue('bounds', 's10');
    focusBeats(ctx, [
      { id: 'write', at: write, regions: ['.r-request', '.r-card', '.r-rail'] },
      { id: 'crossing', at: crossing, regions: ['.r-funnel', '.r-funnel-chip'] },
      { id: 'check', at: check, regions: ['.r-card', '.r-tools', '.r-loop'] },
      { id: 'bounds', at: bounds, regions: ['.r-loop', '.r-bounds'] },
    ]);
    // The knowledge graph stays in view as context, half strength.
    tl.set(q('.graph-wrap'), { opacity: 0.5 }, 0);

    // Write: the expert's request, then the agent types the rule into the tenant's card.
    appear(ctx, '.request', write + 0.2);
    const typing = cue('typing', 's2+0.4');
    appear(ctx, '.agent', typing);
    appear(ctx, '.card-wrap', typing + 0.5);
    LINES.forEach((l, i) => tl.to(q(`.card-line-${i}`), { text: l, duration: l.length * 0.06, ease: 'none' }, typing + 1.2 + i * 2));

    // Crossing: the funnel, the long leap, then two short steps through the grammar.
    appear(ctx, '.funnel', crossing + 0.2);
    const leap = cue('leap', 's5');
    tl.set(q('.leap-path'), { autoAlpha: 1 }, leap);
    tl.fromTo(q('.leap-path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'power1.inOut' }, leap);
    appear(ctx, '.leap-head', leap + 1.7, { y: 0, duration: 0.2 });
    appear(ctx, '.leap-label', leap + 1.2);
    const split = cue('split', 's6');
    tl.to(q('.leap'), { opacity: 0.15, duration: 0.6 }, split);
    vanish(ctx, '.leap-label', split);
    [0, 1].forEach((k) => {
      const at = split + 0.3 + k * 1.1;
      tl.set(q(`.step-${k}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.step-${k}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, at);
      appear(ctx, `.head-${k}`, at + 0.7, { y: 0, duration: 0.2 });
    });
    appear(ctx, '.step-label', split + 2.4);
    appear(ctx, '.fig-gp', cue('grammar-figure', 's6+3.2'));
    vanish(ctx, '.fig-gp', check - 0.3);

    // Check: the tools dock, then the loop runs once, with a rejection and a retry.
    TOOLS.forEach((_, i) => appear(ctx, `.tool-${i}`, check + 0.8 + i * 1.3));
    appear(ctx, '.tool-via', cue('lsp', 's7+6'));
    appear(ctx, '.fig-ms', cue('microsoft-figure', 's7+5'));
    vanish(ctx, '.fig-ms', cue('loop', 's8+0.2') - 0.2);
    appear(ctx, '.loop', check + 0.4);
    tl.set(q('.ring'), { drawSVG: '0% 0%' }, 0);
    const litStation = (k: number, at: number, tone = C.tenant[3]) => {
      tl.to(q(`.st-${k} .st-dot`), { attr: { fill: tone === C.warn ? C.warnSoft : '#123a36', stroke: tone }, duration: 0.3 }, at);
      tl.to(q(`.st-${k} .st-label`), { attr: { fill: C.text }, duration: 0.3 }, at);
    };
    const run = cue('loop', 's8+0.2');
    litStation(0, run);
    tl.to(q('.ring'), { drawSVG: pct(1), duration: 1, ease: 'none' }, run + 0.3);
    litStation(1, run + 1.3);
    tl.to(q('.ring'), { drawSVG: pct(2), duration: 1, ease: 'none' }, run + 1.6);
    const reject = run + 2.6;
    litStation(2, reject, C.warn);
    tl.to(q('.card-line-1'), { color: C.warn, duration: 0.3 }, reject);
    appear(ctx, '.val-error', reject + 0.1);
    tl.set(q('.retry'), { autoAlpha: 1 }, reject + 0.8);
    tl.fromTo(q('.retry'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.7 }, reject + 0.8);
    appear(ctx, '.retry-head', reject + 1.4, { y: 0, duration: 0.2 });
    tl.to(q('.card-line-1'), { text: FIXED, duration: 0.8, ease: 'none' }, reject + 2);
    tl.to(q('.card-line-1'), { color: C.text, duration: 0.3 }, reject + 2.9);
    vanish(ctx, '.val-error', reject + 3);
    vanish(ctx, '.retry, .retry-head', reject + 3.2);
    litStation(2, reject + 3.3);
    const pass = cue('tests', 's9+0.3');
    for (let k = 3; k <= 6; k++) {
      tl.to(q('.ring'), { drawSVG: pct(k), duration: 1, ease: 'none' }, pass + (k - 3) * 1.4);
      if (k < 6) litStation(k, pass + (k - 3) * 1.4 + 1);
    }
    tl.to(q('.st-0 .st-dot'), { attr: { r: 27 }, duration: 0.25, yoyo: true, repeat: 1 }, pass + 5.6);

    // Bounds: a request with no construction stops at the boundary; a value error is caught at
    // Tests; the agent cannot pass the line.
    const refuse = cue('refuse', 's10+0.3');
    tl.set(q('.refusal'), { autoAlpha: 1 }, refuse);
    tl.fromTo(q('.refuse-dot'), { attr: { cx: 1880 } }, { attr: { cx: 1703 }, duration: 1, ease: 'power2.in' }, refuse);
    tl.to(q('.refuse-dot'), { attr: { cx: 1712 }, duration: 0.25, ease: 'power1.out' }, refuse + 1);
    appear(ctx, '.refuse-text', refuse + 1.1);
    const wrong = cue('wrong', 's11');
    tl.to(q('.st-3 .st-dot'), { attr: { stroke: C.warn, fill: C.warnSoft }, duration: 0.3 }, wrong + 0.3)
      .to(q('.st-3 .st-dot'), { attr: { stroke: C.tenant[3], fill: '#123a36' }, duration: 0.4 }, wrong + 2.4);
    appear(ctx, '.fig-sob', wrong + 0.8);
    const limit = cue('limit', 's12');
    vanish(ctx, '.fig-sob', limit - 0.3);
    tl.to(q('.r-loop'), { opacity: 0.2, duration: 0.5 }, limit);
    tl.to(q('.r-rail'), { opacity: 1, duration: 0.5 }, limit);
    tl.set(q('.bump'), { autoAlpha: 1 }, limit);
    tl.fromTo(q('.bump'), { y: -36 }, { y: 0, duration: 0.8, ease: 'power2.in' }, limit)
      .to(q('.bump'), { y: -10, duration: 0.25, ease: 'power1.out' }, limit + 0.8)
      .to(q('.bump'), { y: 0, duration: 0.3, ease: 'power2.in' }, limit + 1.05)
      .to(q('.bump'), { y: -8, duration: 0.25, ease: 'power1.out' }, limit + 1.35);
    appear(ctx, '.stops', limit + 1);
    appear(ctx, '.cannot', limit + 1.2);

    // Last: the grammar itself may later come from the knowledge graph.
    const graph = cue('graph', 's13');
    tl.to(q('.r-rail, .r-bounds'), { opacity: 0.35, duration: 0.5 }, graph);
    tl.to(q('.graph-wrap'), { opacity: 1, duration: 0.6 }, graph);
    appear(ctx, '.later', graph + 0.4);
  },
};
