import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AgentIcon, Cards, COL, STATIONS, Y } from '../parts/Landscape';
import { Base, Card, GAP_Y, GATE_X, LOWER, Mark } from '../parts/Act3';
import { GY, GRAPH_BOTTOM, item, TraversePath } from '../parts/Graph';
import { Body, Callout, FigureChip, Frame, Heading, Person, Pill, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 10. What Breeze.AI is and how it works: the platform film that opens Act 3. The landscape and its
// problem, the graph built from the code and reviewed by its owners, impact analysis on the ticket, the
// coding assistant, the check on each pull request, generated code and tests, the code layer updated when
// the change merges, the three ways in, where it runs and what it is built on, the tools it connects to,
// people and owners, results, and the pilot.
const SOURCES = ['code', 'database schemas', 'documents', 'frontend'];
const SOURCE_HUES = [C.layer.code, C.layer.architecture, C.layer.functional, C.layer.design];
const ENTRY = [
  { label: 'Web application', who: 'product owners, architects, designers' },
  { label: 'Claude Code plugin', who: 'engineers' },
  { label: 'API', who: 'other tools' },
];
const STACK = ['Neo4j graph store', 'PostgreSQL', 'Single sign-on (SSO)', 'Agent activity logged'];
const LINKS = ['GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Jira', 'Confluence', 'Figma'];
const RING = { x: 960, y: 480, r: 330 };
const CITED = [2, 3, 4];
const SPEC = STATIONS[0], MERGE = STATIONS[3];
const CHIPS = [
  { f: '19 → 36', l: 'deployments a month, three products, 14-week pilot', s: 'Breeze.AI Executive Leadership Report, Q3 2026', t: 'fig.deploys-36' },
  { f: '2.0 → 1.62 days', l: 'lead time for changes, same engagement', s: 'Breeze.AI Executive Leadership Report, Q3 2026', t: 'fig.lead-time' },
  { f: '23% fewer', l: 'defects, same codebase and team, before and after', s: 'SDLC case archetypes', t: 'fig.defects-23' },
  { f: '93.4%', l: 'test coverage from tests generated from the functional layer', s: 'SDLC case archetypes', t: 'fig.coverage-93' },
];
const CHIP_POS = [{ x: 200, y: 220 }, { x: 1000, y: 220 }, { x: 200, y: 520 }, { x: 1000, y: 520 }];

export const scene10: SceneDef = {
  n: 10,
  id: 'breeze-ai-platform',
  View: () => (
    <Frame act="Act 3" scene="Scene 10 · What Breeze.AI is and how it works">
      <Svg className="land">
        <g className="base-top"><Base gate /></g>
        <Cards className="art" />
        <rect className="pre tok-small" x={SPEC.x - 14} y={Y.flow + 44} width={28} height={16} rx={4} fill={C.text} />
        <g className="pre tok-big">
          <rect x={SPEC.x - 30} y={Y.flow + 44} width={60} height={22} rx={5} fill={C.text} />
          <circle className="defect" cx={SPEC.x + 34} cy={Y.flow + 44} r={9} fill={C.warn} />
        </g>
        {SOURCES.map((s, i) => <Pill key={s} className={`pre src src-${i}`} x={180 + i * 260} y={LOWER.y + 20} text={s} colour={SOURCE_HUES[i]} w={230} />)}
        {KINDS.map((k) => <Mark key={k.id} className={`pre ok ok-${k.id}`} x={COL[k.id] + 120} y={Y.person} />)}
        <g className="pre cited">
          {CITED.map((i) => <circle key={i} cx={item('functional', i).x} cy={item('functional', i).y} r={15} fill="none" stroke={C.text} strokeWidth={2} />)}
        </g>
        <Card className="pre ticket" x={SPEC.x - 80} y={GAP_Y + 10} w={160} h={40} label="Jira ticket" tone={C.layer.functional} />
        <TraversePath className="pre trav" />
        <Card className="pre report" x={SPEC.x + 100} y={GAP_Y + 10} w={170} h={40} label="scope report" tone={C.text} />
        <rect className="pre tok-pr" x={STATIONS[1].x - 18} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
        <Card className="pre findings" x={GATE_X - 300} y={GAP_Y + 10} w={260} h={40} label="findings on the pull request" tone={C.text} />
        <Pill className="pre canblock" x={GATE_X - 165} y={Y.flow + 72} text="blocks a merge outside the scope" colour={C.muted} w={330} />
        <g className="pre gen">
          <Card className="gen-code" x={item('functional', 1).x - 80} y={LOWER.y + 20} w={160} h={44} label="code" tone={C.layer.code} />
          <Card className="gen-tests" x={item('functional', 1).x + 110} y={LOWER.y + 20} w={160} h={44} label="test cases" tone={C.layer.functional} />
          <line x1={item('functional', 1).x} y1={item('functional', 1).y} x2={item('functional', 1).x + 30} y2={LOWER.y + 20} stroke={C.layer.functional} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>
        <rect className="pre tok-merge" x={GATE_X + 30} y={Y.flow + 44} width={36} height={18} rx={4} fill={C.text} />
        <line className="pre pulse" x1={MERGE.x} y1={Y.flow - 40} x2={MERGE.x} y2={GY.code + 27} stroke={C.pass} strokeWidth={3} strokeDasharray="6 5" />
        <g className="pre synced">
          <rect x={MERGE.x - 220} y={GRAPH_BOTTOM + 8} width={300} height={38} rx={19} fill={C.canvasRaised} stroke={C.pass} strokeWidth={1.5} />
          <text x={MERGE.x - 70} y={GRAPH_BOTTOM + 33} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.pass}>graph = main branch</text>
        </g>
        <g className="pre entry" data-target="breeze.interfaces">
          {ENTRY.map((e, i) => (
            <g key={e.label} className={`entry-${i}`}>
              <rect x={180 + i * 540} y={LOWER.y + 10} width={500} height={80} rx={12} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
              <text x={204 + i * 540} y={LOWER.y + 44} fontFamily={F.sans} fontSize={24} fontWeight={600} fill={C.text}>{e.label}</text>
              <text x={204 + i * 540} y={LOWER.y + 72} fontFamily={F.sans} fontSize={18} fill={C.muted}>{e.who}</text>
            </g>
          ))}
        </g>
      </Svg>
      <Heading className="pre title" x={160} y={380} size={120} target="platform.breeze-ai">Breeze.AI</Heading>
      <Body className="pre subtitle" x={166} y={520} w={1200} size={32} colour={C.text}>One knowledge graph of the application, for people and agents.</Body>
      <FigureChip className="pre chip-extract" x={1150} y={LOWER.y - 30} w={600} figure="2 to 3 weeks" label="to build the graph of more than two million lines of code" source="brownfield extraction" target="fig.extraction" />
      <Callout className="pre co co-cited" x={1150} y={GAP_Y - 6} w={600} kind="Functional layer" text="Each scenario, step and action cites its source" tone={C.layer.functional} target="breeze.citations" />
      <Callout className="pre co co-impact" x={1150} y={GAP_Y - 6} w={600} kind="Scope Analysis Agent" text="Everything the change affects, before any code is written" tone={C.text} target="agent.impact-analysis" />
      <Callout className="pre co co-agent" x={1150} y={GAP_Y - 6} w={600} kind="The coding assistant you use" text="Gets the impact report and the graph's tools" tone={C.text} target="flow.coding-agent" />
      <Callout className="pre co co-pr" x={150} y={LOWER.y} w={640} kind="Merge Validation Agent" text="Checks each pull request stays within its ticket's scope" tone={C.text} target="agent.pr-validation" />
      <Callout className="pre co co-sync" x={150} y={LOWER.y} w={640} kind="KG Sync Agent" text="Updates the graph when the change merges" tone={C.pass} target="agent.kg-sync" />

      {/* s13 to s16: where it runs, what it is built on, what it connects to, who decides */}
      <div className="pre deploy" data-target="breeze.deployment" style={{ position: 'absolute', left: 200, top: 260, display: 'flex', gap: 40 }}>
        {[['Hosted by Accion Labs', "on Accion Labs' managed infrastructure"], ["In the client's environment", 'with its own address and sign-in']].map(([h, t]) => (
          <div key={h} style={{ width: 700, height: 300, background: C.canvasRaised, border: `1.5px solid ${C.layer.architecture}`, borderRadius: 16, padding: '36px 40px' }}>
            <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 44 }}>{h}</div>
            <div style={{ fontSize: 26, color: C.muted, marginTop: 14 }}>{t}</div>
          </div>
        ))}
      </div>
      <div className="pre stack" data-target="breeze.stack" style={{ position: 'absolute', left: 200, top: 640, display: 'flex', gap: 20 }}>
        {STACK.map((s) => <div key={s} style={{ background: C.canvas, border: `1.5px solid ${C.text}`, borderRadius: 26, padding: '12px 24px', fontFamily: F.mono, fontSize: 20 }}>{s}</div>)}
      </div>
      <Svg className="pre ring">
        <g data-target="breeze.integrations">
          {LINKS.map((l, i) => {
            const a = -Math.PI / 2 + (i * 2 * Math.PI) / LINKS.length, x = RING.x + RING.r * Math.cos(a), y = RING.y + RING.r * Math.sin(a);
            return (
              <g key={l} className={`link-${i}`}>
                <line x1={RING.x} y1={RING.y} x2={x} y2={y} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 5" />
                <rect x={x - 100} y={y - 28} width={200} height={56} rx={28} fill={C.canvasRaised} stroke={C.text} strokeWidth={1.5} />
                <text x={x} y={y + 8} textAnchor="middle" fontFamily={F.sans} fontSize={23} fontWeight={600} fill={C.text}>{l}</text>
              </g>
            );
          })}
          <circle cx={RING.x} cy={RING.y} r={92} fill={C.canvasRaised} stroke={C.layer.functional} strokeWidth={2.5} />
          <text x={RING.x} y={RING.y + 10} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={32} fill={C.text}>Breeze.AI</text>
        </g>
      </Svg>
      <Svg className="pre owners">
        <g data-target="agents.owner">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Person x={560 + i * 400} y={380} r={24} />
              <line x1={560 + i * 400} y1={440} x2={560 + i * 400} y2={540} stroke={C.text} strokeWidth={1.5} strokeDasharray="4 5" />
              <AgentIcon x={560 + i * 400} y={590} s={56} />
              <text x={560 + i * 400 + 40} y={500} fontFamily={F.mono} fontSize={18} fill={C.muted}>owner</text>
            </g>
          ))}
        </g>
      </Svg>
      <Body className="pre owners-note" x={420} y={680} w={1100} size={30} colour={C.text}>People decide which work goes to agents.</Body>

      {/* s17 to s19: results and the pilot */}
      {CHIPS.map((c, i) => <FigureChip key={c.t} className={`pre chip chip-${i}`} x={CHIP_POS[i].x} y={CHIP_POS[i].y} w={700} figure={c.f} label={c.l} source={c.s} target={c.t} />)}
      <FigureChip className="pre pilot" x={200} y={360} w={900} figure="System Model Pilot" label="One application in the graph in two to three weeks, and impact analysis on a real item from the backlog" source="the usual way to start" target="breeze.start" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: small changes pass; a change across the system lands with a defect.
    const s1 = cue('problem', 's0');
    tl.set(q('.base-top .g, .base-top .tie, .base-top .gate-wrap'), { autoAlpha: 0 }, 0);
    appear(ctx, '.tok-small', s1 + 0.2, { y: 0 });
    tl.to(q('.tok-small'), { attr: { x: MERGE.x - 14 }, duration: 2.2, ease: 'power1.inOut' }, s1 + 0.6);
    vanish(ctx, '.tok-small', s1 + 3);
    appear(ctx, '.tok-big', s1 + 3.2, { y: 0 });
    tl.to(q('.tok-big'), { x: MERGE.x - SPEC.x, duration: 2.4, ease: 'power1.inOut' }, s1 + 3.4);
    tl.fromTo(q('.defect'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, s1 + 5.9);
    // s2: the knowledge sits with four people and in documents that go out of date.
    const s2 = cue('holders', 's1');
    KINDS.forEach((k, i) => tl.fromTo(q(`.base-top .cus-${k.id}`), { opacity: 0.3 }, { opacity: 1, duration: 0.4 }, s2 + 0.3 + i * 0.6));
    tl.to(q('.art'), { opacity: 0.25, duration: 2 }, s2 + 3);
    // s3: the platform.
    const s3 = cue('title', 's2');
    vanish(ctx, '.land', s3, { duration: 0.5 });
    appear(ctx, '.title', s3 + 0.4);
    appear(ctx, '.subtitle', s3 + 1.4);
    // s4: the graph is built from the code, schemas, documents and frontend.
    const s4 = cue('extract', 's3');
    vanish(ctx, '.title, .subtitle', s4);
    tl.to(q('.land'), { autoAlpha: 1, duration: 0.5 }, s4 + 0.2);
    vanish(ctx, '.art, .tok-big', s4 + 0.2);
    SOURCES.forEach((_, i) => appear(ctx, `.src-${i}`, s4 + 0.6 + i * 0.5));
    tl.set(q('.base-top .g, .base-top .tie'), { visibility: 'visible', opacity: 0 }, s4 + 2.4);
    (['code', 'architecture', 'design', 'functional'] as const).forEach((k, i) => tl.to(q(`.base-top .band-${k}`), { opacity: 1, duration: 0.6 }, s4 + 2.6 + i * 0.6));
    tl.to(q('.base-top .xlink'), { opacity: 0.55, duration: 0.6 }, s4 + 5);
    // s5: two to three weeks; each owner reviews their layer.
    const s5 = cue('review', 's4');
    vanish(ctx, '.src', s5);
    tl.to(q('.base-top .tie'), { opacity: 1, duration: 0.6 }, s5 + 0.3);
    KINDS.forEach((k, i) => appear(ctx, `.ok-${k.id}`, s5 + 1 + i * 0.5, { y: 0 }));
    appear(ctx, '.chip-extract', s5 + 2.4);
    // s6: citations on the functional layer.
    const s6 = cue('cited', 's5');
    vanish(ctx, '.chip-extract, .ok', s6);
    appear(ctx, '.cited', s6 + 0.3, { y: 0 });
    appear(ctx, '.co-cited', s6 + 0.6);
    // s7: impact analysis from the Jira ticket.
    const s7 = cue('impact', 's6');
    vanish(ctx, '.cited, .co-cited', s7);
    appear(ctx, '.ticket', s7 + 0.3, { y: 0 });
    tl.fromTo(q('.trav'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6 }, s7 + 1.2);
    appear(ctx, '.report', s7 + 3, { y: 0 });
    appear(ctx, '.co-impact', s7 + 3.3);
    // s8: the coding assistant gets the report and the tools.
    const s8 = cue('assistant', 's7');
    vanish(ctx, '.co-impact, .trav', s8);
    tl.to(q('.report'), { x: STATIONS[1].x - SPEC.x - 100, duration: 1.2, ease: 'power2.inOut' }, s8 + 0.3);
    appear(ctx, '.co-agent', s8 + 0.8);
    // s9: each pull request is checked; findings posted; the check can block a merge.
    const s9 = cue('pr', 's8');
    vanish(ctx, '.co-agent, .report, .ticket', s9);
    tl.set(q('.base-top .gate-wrap'), { autoAlpha: 1 }, s9);
    appear(ctx, '.tok-pr', s9 + 0.2, { y: 0 });
    tl.to(q('.tok-pr'), { attr: { x: GATE_X - 50 }, duration: 1.4, ease: 'power1.inOut' }, s9 + 0.5);
    appear(ctx, '.findings', s9 + 2, { y: 0 });
    appear(ctx, '.co-pr', s9 + 2.3);
    appear(ctx, '.canblock', s9 + 3.6, { y: 0 });
    // s10: code and test cases from the graphs.
    const s10 = cue('generate', 's9');
    vanish(ctx, '.co-pr, .findings, .canblock', s10);
    appear(ctx, '.gen', s10 + 0.3);
    // s11: the change merges; the code layer is updated.
    const s11 = cue('sync', 's10');
    vanish(ctx, '.gen, .tok-pr', s11);
    appear(ctx, '.tok-merge', s11 + 0.2, { y: 0 });
    tl.to(q('.tok-merge'), { attr: { x: MERGE.x - 18 }, duration: 1, ease: 'power1.inOut' }, s11 + 0.4);
    tl.fromTo(q('.pulse'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, s11 + 1.6);
    tl.fromTo(q('.base-top .band .band-rect'), { attr: { 'stroke-width': 1.8 } }, { attr: { 'stroke-width': 5 }, duration: 0.4, yoyo: true, repeat: 1 }, s11 + 2.4);
    appear(ctx, '.co-sync', s11 + 2);
    appear(ctx, '.synced', s11 + 3.2, { y: 0 });
    // s12: three ways in, on the same graph.
    const s12 = cue('ways-in', 's11');
    vanish(ctx, '.co-sync, .synced, .pulse, .tok-merge', s12);
    appear(ctx, '.entry', s12 + 0.3);
    // s13: where it runs.
    const s13 = cue('deploy', 's12');
    vanish(ctx, '.land', s13, { duration: 0.5 });
    appear(ctx, '.deploy', s13 + 0.4);
    // s14: what it is built on.
    const s14 = cue('stack', 's13');
    tl.to(q('.deploy'), { opacity: 0.4, duration: 0.4 }, s14);
    appear(ctx, '.stack', s14 + 0.3);
    // s15: what it connects to.
    const s15 = cue('integrations', 's14');
    vanish(ctx, '.deploy, .stack', s15);
    appear(ctx, '.ring', s15 + 0.3, { y: 0 });
    // s16: people decide; every agent has an owner.
    const s16 = cue('owners', 's15');
    vanish(ctx, '.ring', s16);
    appear(ctx, '.owners', s16 + 0.3, { y: 0 });
    appear(ctx, '.owners-note', s16 + 1.2);
    // s17 and s18: results.
    const s17 = cue('fig-delivery', 's16');
    vanish(ctx, '.owners, .owners-note', s17);
    appear(ctx, '.chip-0', s17 + 0.4);
    appear(ctx, '.chip-1', s17 + 3.5);
    const s18 = cue('fig-quality', 's17');
    appear(ctx, '.chip-2', s18 + 0.3);
    appear(ctx, '.chip-3', s18 + 2.2);
    // s19: the pilot.
    const s19 = cue('pilot', 's18');
    vanish(ctx, '.chip', s19);
    appear(ctx, '.pilot', s19 + 0.4);
  },
};
