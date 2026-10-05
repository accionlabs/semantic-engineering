import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, FigureChip, Frame, Heading, ScreenIcon, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

// Scene 6. The interface and APIs today, in three beats: customer (the same screens for every
// tenant), APIs (an agent at the port still has to learn the rules elsewhere), provider (a grid
// of screens that grows with tenants while one build-and-review cursor steps across it).
const rail = makeRail('rail', { lit: 5, label: 'interface and APIs' });
const L = 560, R = 1300, N0 = 6, NMAX = 20;
const sw = (R - L) / 6;
const API_Y = 420;
const COLS = 10, CELLS0 = 8, CELLS = 40, STEPS = 12;
const cellX = (k: number) => L + (k % COLS) * 72, cellY = (k: number) => 592 + Math.floor(k / COLS) * 56;

export const scene06: SceneDef = {
  n: 6,
  id: 'interface-today',
  View: () => (
    <Frame act="Act 2" scene="Scene 6 · The interface and APIs today">
      <Svg>
        <rail.View />
        <g className="r-screens" data-target="layer.interface">
          <text className="lbl-same" x={L} y={206} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>THE SAME SCREENS FOR EVERY TENANT</text>
          <text className="pre lbl-wish" x={L} y={206} fontFamily={F.mono} fontSize={14} fill={C.tenant[3]} letterSpacing={1.5}>WHAT TENANT C WANTS</text>
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i} className={`pre screen screen-${i}`} data-target={`screen.tenant.${i}`}>
              <ScreenIcon x={L + i * sw + 8} y={230} w={sw - 16} h={110} colour={tenantColour(i)} />
              <text x={L + i * sw + sw / 2} y={366} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.muted}>Tenant {String.fromCharCode(65 + i)}</text>
            </g>
          ))}
          <g className="pre wish" data-target="screen.wish">
            <ScreenIcon x={L + 2 * sw + 8} y={230} w={sw - 16} h={110} colour={C.tenant[3]} variant={1} />
          </g>
        </g>
        <g className="r-api">
          <g className="pre api" data-target="api.port">
            <rect x={L} y={API_Y} width={R - L} height={90} rx={10} fill={C.shared} />
            <text x={L + 20} y={API_Y + 52} fontFamily={F.sans} fontWeight={600} fontSize={22} fill={C.sharedText}>API · same service as the screens</text>
          </g>
          <g className="pre agent" data-target="agent.api">
            <rect x={R - 180} y={API_Y + 20} width={150} height={50} rx={25} fill={C.canvasRaised} stroke={C.tenant[3]} strokeWidth={2} />
            <text x={R - 105} y={API_Y + 52} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.tenantText}>agent</text>
          </g>
          <text className="pre which" x={R - 105} y={API_Y - 12} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={28} fill={C.warn}>which rules?</text>
        </g>
        <g className="r-grid" data-target="grid.screens">
          {Array.from({ length: CELLS }).map((_, k) => (
            <g key={k} className={`pre cell cell-${k}`}>
              <ScreenIcon x={cellX(k)} y={cellY(k)} w={62} h={44} colour={C.sharedEdge} />
              <rect className={`done done-${k}`} x={cellX(k)} y={cellY(k)} width={62} height={44} rx={6} fill="none" stroke={C.tenant[3]} strokeWidth={2.5} opacity={0} />
            </g>
          ))}
          <rect className="pre cursor" x={cellX(0) - 5} y={cellY(0) - 5} width={72} height={54} rx={8} fill="none" stroke={C.warn} strokeWidth={3} data-target="cursor.review" />
          <text className="pre grid-label" x={L} y={cellY(0) - 18} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>SCREENS · BUILT AND REVIEWED ONE AT A TIME</text>
        </g>
      </Svg>
      <Heading x={L} y={120} size={42}>The interface and APIs today</Heading>
      <Counter className="pre counter" x={1380} y={128} start={N0} />
      <Callout className="pre c-customer" x={1360} y={220} w={480} kind="Customer" text="Every customer sees the same screens, whatever each user needs" tone={C.tenant[3]}
        anchor={{ x: R, y: 285 }} target="lens.interface.customer" />
      <FigureChip className="pre fig-sat" x={1360} y={410} w={456} target="fig.gartner-satisfaction" figure="23%"
        label="of digital workers completely satisfied with their work applications in 2024" source="Gartner, March 2025" />
      <Callout className="pre c-api" x={1360} y={420} w={480} kind="Agents at the API" text="An agent can bypass the screens, and still has to learn the rules somewhere else" tone={C.tenant[3]}
        anchor={{ x: R, y: API_Y + 45 }} target="lens.interface.api" />
      <div className="pre dataverse" data-target="fig.dataverse-api" style={{ position: 'absolute', left: L, top: API_Y + 104, width: R - L, fontFamily: F.mono, fontSize: 14, lineHeight: 1.5, color: C.muted }}>
        API operations go through the same service the application uses. Microsoft Learn, Use the Microsoft Dataverse Web API, 2026
      </div>
      <FigureChip className="pre fig-fe" x={1360} y={600} w={456} target="fig.gartner-agentic-fe" figure="1 in 3"
        label="user experiences to shift from native applications to agentic front ends by 2028" source="Gartner, August 2025" />
      <Callout className="pre c-provider" x={1360} y={580} w={480} kind="Provider" text="Wireframe, build and review, one screen at a time. Cost grows with every screen" tone={C.warn}
        anchor={{ x: cellX(COLS - 1) + 66, y: cellY(0) + 22 }} target="lens.interface.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue, duration } = ctx;
    rail.setup(ctx);
    const customer = cue('customer', 's0'), apis = cue('apis', 's3'), provider = cue('provider', 's5');
    focusBeats(ctx, [
      { id: 'customer', at: customer, regions: ['.r-screens'], callout: '.c-customer' },
      { id: 'apis', at: apis, regions: ['.r-api'], callout: '.c-api' },
      { id: 'provider', at: provider, regions: ['.r-grid'], callout: '.c-provider' },
    ]);

    // Customer: one screen design, copied into every tenant.
    for (let i = 0; i < 6; i++) appear(ctx, `.screen-${i}`, customer + 0.4 + i * 0.25);
    // The wish for a personalised screen flickers over Tenant C's column, then fades.
    const wish = cue('wish', 's1+2');
    tl.to(q('.lbl-same'), { autoAlpha: 0, duration: 0.3 }, wish);
    appear(ctx, '.lbl-wish', wish, { y: 0 });
    tl.fromTo(q('.wish'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, wish);
    tl.to(q('.wish'), { opacity: 0.35, duration: 0.18, yoyo: true, repeat: 3, ease: 'none' }, wish + 1.6);
    const same = cue('same', 's2');
    tl.to(q('.wish'), { autoAlpha: 0, duration: 0.8 }, same);
    tl.to(q('.lbl-wish'), { autoAlpha: 0, duration: 0.3 }, same);
    tl.to(q('.lbl-same'), { autoAlpha: 1, duration: 0.3 }, same + 0.3);
    appear(ctx, '.fig-sat', same + 1);
    tl.to(q('.fig-sat'), { autoAlpha: 0, duration: 0.3 }, apis - 0.2);

    // APIs: the port sits on the same service; an agent arrives at it and still asks which rules apply.
    appear(ctx, '.api', apis + 0.2);
    tl.fromTo(q('.agent'), { autoAlpha: 0, x: 160 }, { autoAlpha: 1, x: 0, duration: 1, ease: 'power2.out' }, apis + 1.4);
    appear(ctx, '.dataverse', apis + 3.5);
    appear(ctx, '.which', cue('which', 's3+8.5'));
    appear(ctx, '.fig-fe', cue('agentic-fe', 's4+1'));
    ['.fig-fe', '.dataverse'].forEach((s) => tl.to(q(s), { autoAlpha: 0, duration: 0.3 }, provider - 0.2));

    // Provider: screens multiply as tenants are added; one cursor builds and reviews them in turn.
    const grow = provider + 0.6, span = Math.max(4, duration - grow - 1.5);
    appear(ctx, '.grid-label', grow - 0.4);
    for (let k = 0; k < CELLS0; k++) appear(ctx, `.cell-${k}`, grow + k * 0.1, { duration: 0.3 });
    for (let k = CELLS0; k < CELLS; k++) appear(ctx, `.cell-${k}`, grow + ((k - CELLS0) / (CELLS - CELLS0)) * span, { duration: 0.3 });
    appear(ctx, '.counter', grow - 0.3);
    tl.to(q('.counter .counter-value'), { innerText: NMAX, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);

    const review = cue('review', 's6');
    tl.set(q('.cursor'), { autoAlpha: 1 }, review);
    const each = Math.max(0.6, (duration - review - 0.5) / STEPS);
    for (let s = 0; s < STEPS; s++) {
      const t = review + s * each;
      tl.to(q(`.done-${s}`), { opacity: 1, duration: 0.3 }, t + each * 0.7);
      if (s < STEPS - 1) tl.to(q('.cursor'), { attr: { x: cellX(s + 1) - 5, y: cellY(s + 1) - 5 }, duration: 0.25, ease: 'power1.inOut' }, t + each * 0.85);
    }
  },
};
