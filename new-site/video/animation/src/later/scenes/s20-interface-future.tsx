import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, FigureChip, Frame, Heading, ScreenIcon, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';
import { DocCard, rectPath } from './s19-onboarding-future';

// Scene 20. The interface after the line moves: identical screen copies become variants of one document.
const rail = makeRail('rail', { lit: 5, lineAt: 4, label: 'interface and APIs', glow: true });
const L = 580, R = 1300;
const SCR_W = 104, SCR_H = 80, SCR_Y = 232, SW = (R - L) / 6;
const scrX = (i: number) => L + i * SW + (SW - SCR_W) / 2;
const CARD = { x: L, y: 230, w: 340, h: 152 };
const GRID = 30, gridPos = (k: number) => ({ x: L + (k % 10) * 72, y: 392 + Math.floor(k / 10) * 62 });
const TILES = 15, N0 = 6, TW = 88, TH = 50;
const tilePos = (i: number) => ({ x: 1012 + (i % 3) * 100, y: 230 + Math.floor(i / 3) * 62 });
const SPINE_X = 975, rowMid = (i: number) => tilePos(i).y + TH / 2;
// Every variant hangs off one spine from the document: row by row, tile to tile, nothing crossing.
const fanPath = (i: number) => {
  const p = tilePos(i);
  return i % 3 === 0 ? `M${SPINE_X} ${rowMid(i)} H${p.x}` : `M${p.x - 12} ${rowMid(i)} H${p.x}`;
};
const BUILD_Y = 580, BUILD = { x: L, w: 300 }, RUN = { x: 960, w: 340 };
const BARS = 12, BAR_BASE = 870, barH = (i: number) => (i === 0 ? 140 : Math.max(22, 92 * Math.pow(0.8, i - 1)));
const barX = (i: number) => L + i * 44;
const LINES = ['screen pay_run', '  shows employee, pay_element', '  order name, amount', '  check amount >= 0'];

export const scene20: SceneDef = {
  n: 20,
  id: 'interface-future',
  View: () => (
    <Frame act="Act 5 · optional" scene="Scene 20 · The interface, after the line moves">
      <Svg>
        <rail.View />
        {/* Today: the same screen copied into every tenant, and a grid reviewed one screen at a time. */}
        <g className="today">
          <text className="today-label" x={L} y={214} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>THE SAME SCREENS FOR EVERY TENANT</text>
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} className={`scr scr-${i}`} data-target={`screen.tenant.${i}`}>
              <path className={`scr-shape scr-shape-${i}`} d={rectPath(scrX(i), SCR_Y, SCR_W, SCR_H, 6)} fill={C.canvasRaised} stroke={tenantColour(i)} strokeWidth={2} />
              <g className="scr-deco">
                <rect x={scrX(i)} y={SCR_Y} width={SCR_W} height={13} rx={6} fill={tenantColour(i)} opacity={0.8} />
                <rect x={scrX(i) + 9} y={SCR_Y + 24} width={86} height={10} rx={3} fill={C.hairline} />
                <rect x={scrX(i) + 9} y={SCR_Y + 40} width={86} height={10} rx={3} fill={C.hairline} />
                <rect x={scrX(i) + 9} y={SCR_Y + 56} width={52} height={10} rx={3} fill={C.hairline} />
                <text x={scrX(i) + SCR_W / 2} y={SCR_Y + SCR_H + 22} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.muted}>Tenant {String.fromCharCode(65 + i)}</text>
              </g>
            </g>
          ))}
          <g className="grid">
            {Array.from({ length: GRID }).map((_, k) => {
              const p = gridPos(k);
              return (
                <g key={k} className={`pre gs gs-${k}`}>
                  <rect className="gs-rect" x={p.x} y={p.y} width={62} height={46} rx={5} fill={C.canvasRaised} stroke={C.sharedEdge} strokeWidth={1.5} />
                  <rect x={p.x} y={p.y} width={62} height={8} rx={4} fill={C.sharedEdge} opacity={0.7} />
                </g>
              );
            })}
            <rect className="pre cursor" x={gridPos(0).x - 4} y={gridPos(0).y - 4} width={70} height={54} rx={7} fill="none" stroke={C.warn} strokeWidth={3} />
          </g>
        </g>

        <g className="r-var" data-target="variants">
          <text className="pre var-label" x={1012} y={214} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>VARIANTS · TENANT AND USER</text>
          <path className="spine" d={`M${CARD.x + CARD.w} ${CARD.y + 40} H${SPINE_X}`} fill="none" stroke={C.tenant[3]} strokeWidth={2} />
          <path className="spine" d={`M${SPINE_X} ${rowMid(0)} V${rowMid(TILES - 1)}`} fill="none" stroke={C.tenant[3]} strokeWidth={2} />
          {Array.from({ length: TILES }).map((_, i) => {
            const p = tilePos(i);
            return (
              <g key={i}>
                <path className={`fan fan-${i}`} d={fanPath(i)} fill="none" stroke={C.tenant[3]} strokeWidth={2} />
                <g className={`pre tile tile-${i}`}><ScreenIcon x={p.x} y={p.y} w={TW} h={TH} colour={tenantColour(i)} variant={i % 2} /></g>
              </g>
            );
          })}
        </g>

        <g className="r-build" data-target="build.pipeline">
          <g className="pre build">
            <path className="build-link" d={`M${CARD.x + 150} ${CARD.y + CARD.h + 4} L${CARD.x + 150} ${BUILD_Y - 6}`} stroke={C.tenant[3]} strokeWidth={2.5} />
            <rect x={BUILD.x} y={BUILD_Y} width={BUILD.w} height={56} rx={10} fill={C.canvasRaised} stroke={C.tenant[3]} strokeWidth={2} />
            <text x={BUILD.x + BUILD.w / 2} y={BUILD_Y + 35} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.tenantText}>build · review · deploy</text>
            <text x={BUILD.x + BUILD.w / 2} y={BUILD_Y + 82} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>source code, normal pipeline</text>
          </g>
        </g>
        <g className="r-run" data-target="path.runtime">
          <g className="pre run">
            <line x1={BUILD.x + BUILD.w + 10} y1={BUILD_Y + 28} x2={RUN.x - 10} y2={BUILD_Y + 28} stroke={C.muted} strokeWidth={2} strokeDasharray="8 8" />
            <rect x={RUN.x} y={BUILD_Y} width={RUN.w} height={56} rx={10} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="8 8" />
            <text x={RUN.x + RUN.w / 2} y={BUILD_Y + 35} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.muted}>run time · desired-state platform</text>
            <text x={RUN.x + RUN.w / 2} y={BUILD_Y + 82} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.muted}>per user · new platform work</text>
          </g>
        </g>

        <g className="r-cost" data-target="cost.per-screen">
          <g className="pre cost">
            <text x={L} y={712} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>COST PER SCREEN · ILLUSTRATIVE</text>
            <line x1={L - 4} x2={barX(BARS - 1) + 40} y1={BAR_BASE} y2={BAR_BASE} stroke={C.hairline} strokeWidth={2} />
            <text x={L} y={BAR_BASE + 24} fontFamily={F.mono} fontSize={13} fill={C.muted}>grammar and compiler</text>
            <text x={barX(1)} y={BAR_BASE - barH(1) - 30} fontFamily={F.mono} fontSize={13} fill={C.warn}>close review</text>
          </g>
          {Array.from({ length: BARS }).map((_, i) => (
            <rect key={i} className={`bar bar-${i}`} x={barX(i)} y={BAR_BASE - barH(i)} width={32} height={barH(i)} rx={4}
              fill={i === 0 ? C.sharedEdge : C.tenant[1]} stroke={i >= 1 && i <= 3 ? C.warn : 'none'} strokeWidth={2} />
          ))}
        </g>

        <g className="r-agent" data-target="agent.language">
          <g className="pre agent">
            <path d={`M835 222 L835 ${CARD.y - 2}`} stroke={C.tenant[3]} strokeWidth={2} strokeDasharray="3 4" />
            <rect x={740} y={182} width={190} height={40} rx={20} fill={C.canvasRaised} stroke={C.tenant[3]} strokeWidth={2} />
            <text x={835} y={208} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.tenantText}>customer's agent</text>
          </g>
        </g>
      </Svg>

      <div className="r-doc">
        <DocCard className="pre card" lineKey="sc" x={CARD.x} y={CARD.y} w={CARD.w} head="screen · pay run" colour={C.tenant[2]} lines={LINES} size={16} target="doc.screen" />
      </div>

      <Heading x={470} y={120} size={40}>The interface, after the line moves</Heading>
      <Counter className="pre counter" x={1380} y={128} start={N0} />
      <Callout className="pre c-today" x={1340} y={300} w={500} kind="Today" text="The same screens for every tenant, built and reviewed one at a time." tone={C.muted}
        anchor={{ x: R, y: 440 }} target="lens.interface-future.today" />
      <Callout className="pre c-doc" x={1340} y={230} w={500} kind="Architecture" text="A screen becomes a document, checked against the domain's rules." tone={C.invariantEdge}
        anchor={{ x: CARD.x + CARD.w, y: CARD.y + 30 }} target="lens.interface-future.doc" />
      <Callout className="pre c-var" x={1340} y={380} w={500} kind="Customer" text="A tenant's layout, or one user's, is a variation the agent can write." tone={C.tenant[3]}
        anchor={{ x: tilePos(14).x + TW, y: tilePos(14).y + 10 }} target="lens.interface-future.customer" />
      <Callout className="pre c-build" x={1340} y={574} w={500} kind="Brownfield" text="Each variation is a build, reviewed and deployed as usual." tone={C.tenant[3]}
        anchor={{ x: BUILD.x + BUILD.w, y: BUILD_Y + 28 }} target="lens.interface-future.build" />
      <Callout className="pre c-run" x={1340} y={574} w={500} kind="Run time" text="Composing the interface per user at run time needs new platform work." tone={C.muted}
        anchor={{ x: RUN.x + RUN.w, y: BUILD_Y + 28 }} target="lens.interface-future.runtime" />
      <Callout className="pre c-provider" x={1340} y={640} w={500} kind="Provider" text="A fixed cost, then a falling cost per screen, with close review of the first ones." tone={C.warn}
        anchor={{ x: barX(BARS - 1) + 36, y: BAR_BASE - 30 }} target="lens.interface-future.provider" />
      <FigureChip className="pre fig-ms" x={1340} y={560} w={500} target="fig.microsoft-dsl" figure="<20% → 85%"
        label="Coding agents on bespoke domain languages, up to 85% with seed examples, explicit rules, compiler checks and schema exposure. Not enough for unattended conversion"
        source="Microsoft vendor blog" />
      <Callout className="pre c-agent" x={1340} y={120} w={500} kind="Agents" text="The same language is what the customer's own agent needs." tone={C.tenant[3]}
        anchor={{ x: 930, y: 202 }} target="lens.interface-future.agent" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const today = cue('today', 0), doc = cue('doc', 's1'), variants = cue('variants', 's2'), build = cue('build', 's3');
    const run = cue('runtime', 's4'), provider = cue('provider', 's5'), evidence = cue('evidence', 's6'), agent = cue('agent', 's7');
    focusBeats(ctx, [
      { id: 'today', at: today, regions: [], callout: '.c-today' },
      { id: 'doc', at: doc, regions: ['.r-doc'], callout: '.c-doc' },
      { id: 'variants', at: variants, regions: ['.r-doc', '.r-var'], callout: '.c-var' },
      { id: 'build', at: build, regions: ['.r-doc', '.r-build'], callout: '.c-build' },
      { id: 'runtime', at: run, regions: ['.r-build', '.r-run'], callout: '.c-run' },
      { id: 'provider', at: provider, regions: ['.r-cost'], callout: '.c-provider' },
      { id: 'evidence', at: evidence, regions: ['.r-cost'], callout: '.fig-ms' },
      { id: 'agent', at: agent, regions: ['.r-doc', '.r-agent'], callout: '.c-agent' },
    ]);

    // Today: Tenant C wishes for a screen of its own, which fades; then the grid of screens grows
    // faster than the one review cursor can step across it.
    const wish = today + 1.4;
    tl.to(q('.scr-2 .scr-shape'), { attr: { stroke: C.warn }, duration: 0.3 }, wish).to(q('.scr-2 .scr-shape'), { attr: { stroke: tenantColour(2) }, duration: 0.4 }, wish + 1.2);
    for (let k = 0; k < GRID; k++) appear(ctx, `.gs-${k}`, today + 2.6 + k * 0.2, { y: 0, duration: 0.2 });
    tl.set(q('.cursor'), { autoAlpha: 1 }, today + 2.8);
    for (let k = 1; k < 9; k++) {
      const t = today + 2.8 + k * 0.7, p = gridPos(k);
      tl.set(q('.cursor'), { attr: { x: p.x - 4, y: p.y - 4 } }, t);
      tl.to(q(`.gs-${k - 1} .gs-rect`), { attr: { stroke: C.tenant[3] }, duration: 0.2 }, t);
    }

    // Doc: the six copies fold into one screen document.
    tl.to(q('.grid'), { autoAlpha: 0, duration: 0.4 }, doc - 0.3);
    tl.to(q('.scr-deco, .today-label'), { autoAlpha: 0, duration: 0.4 }, doc);
    for (let i = 0; i < 6; i++) {
      tl.to(q(`.scr-shape-${i}`), { morphSVG: rectPath(CARD.x, CARD.y, CARD.w, CARD.h, 10), attr: { fill: '#0a1a1a', stroke: C.tenant[2] }, duration: 1.5, ease: 'power2.inOut' }, doc + 0.2 + i * 0.08);
    }
    appear(ctx, '.card', doc + 2, { y: 0, duration: 0.4 });
    tl.to(q('.scr'), { autoAlpha: 0, duration: 0.3 }, doc + 2.3);
    tl.set(q('.sc-line'), { autoAlpha: 0 }, 0);
    LINES.forEach((_, i) => tl.to(q(`.sc-line-${i}`), { autoAlpha: 1, duration: 0.3 }, doc + 2.8 + i * 1.4));

    // Variants: tenant and user variants fan out from the one document; more tenants add more variants.
    tl.set(q('.fan'), { drawSVG: '0%' }, 0);
    tl.fromTo(q('.spine'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.4 }, variants);
    appear(ctx, '.var-label', variants, { y: 0 });
    const reveal = (i: number, at: number) => {
      tl.to(q(`.fan-${i}`), { drawSVG: '100%', duration: 0.5 }, at);
      appear(ctx, `.tile-${i}`, at + 0.35, { y: 0, duration: 0.3 });
    };
    for (let i = 0; i < N0; i++) reveal(i, variants + 1 + i * 0.15);
    const grow = variants + 2, span = Math.max(3, build - grow - 0.5);
    appear(ctx, '.counter', grow - 0.4);
    tl.to(q('.counter .counter-value'), { innerText: TILES, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);
    for (let i = N0; i < TILES; i++) reveal(i, grow + ((i - N0) / (TILES - N0)) * span);
    vanish(ctx, '.counter', build);

    // Build and run time.
    appear(ctx, '.build', build + 0.2, { y: 0 });
    tl.fromTo(q('.build-link'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6 }, build + 0.3);
    appear(ctx, '.run', run + 0.2, { y: 0 });

    // Provider: one fixed cost, then a cost per screen that falls; the first ones get close review.
    appear(ctx, '.cost', provider, { y: 0 });
    for (let i = 0; i < BARS; i++) {
      tl.fromTo(q(`.bar-${i}`), { attr: { y: BAR_BASE, height: 0 } }, { attr: { y: BAR_BASE - barH(i), height: barH(i) }, duration: 0.5, ease: 'power2.out' }, provider + 0.6 + i * 0.5);
    }

    // Agent: the customer's own agent reads the same document.
    appear(ctx, '.agent', agent + 0.2, { y: 0 });
  },
};
