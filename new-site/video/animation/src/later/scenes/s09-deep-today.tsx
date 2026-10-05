import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, FigureChip, Frame, Heading, Pill, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

// Scene 9. The deep layers today: every customer stands on them, custom fields ride on metadata,
// and risk grows with depth.
const rail = makeRail('rail', { lit: 1, label: 'deep layers' });
const L = 500, R = 1300;
const DEEP = ['Data model', 'Database', 'Infrastructure'];
const bandY = (i: number) => 300 + i * 110;
const TENANTS = 10;
const PILL_TEXT = 'custom field · as metadata', PILL_W = PILL_TEXT.length * 9.6 + 30, PILL_X = 900;
const GX = 890, GY = 820, GR = 190, RISK = 0.85;

export const scene09: SceneDef = {
  n: 9,
  id: 'deep-today',
  View: () => (
    <Frame act="Act 2" scene="Scene 9 · The deep layers today">
      <Svg>
        <rail.View />
        {[0, 2].map((b) => (
          <rect key={b} x={60} y={rail.stack.bandTop(b) - 4} width={308} height={48} rx={8} fill="none" stroke={C.text} strokeWidth={2} />
        ))}
        <g className="r-bands">
          {Array.from({ length: TENANTS }).map((_, t) => (
            <line key={t} className={`pre stand stand-${t}`} x1={L + 40 + t * 85} x2={L + 40 + t * 85} y1={200} y2={290} stroke={tenantColour(t)} strokeWidth={3} data-target={`tenant.${t}`} />
          ))}
          {DEEP.map((b, i) => (
            <g key={b} data-target={`layer.deep.${i}`}>
              <rect className={`deep deep-${i}`} x={L} y={bandY(i)} width={R - L} height={96} rx={10} fill={C.shared} stroke={C.text} strokeWidth={0} />
              <text x={L + 24} y={bandY(i) + 56} fontFamily={F.sans} fontWeight={600} fontSize={24} fill={C.text}>{b}</text>
            </g>
          ))}
        </g>
        <g className="r-field">
          <g className="pre field" data-target="field.custom">
            <Pill x={PILL_X} y={bandY(0) + 31} text={PILL_TEXT} colour={C.tenant[3]} w={PILL_W} />
          </g>
        </g>
        <g className="r-gauge" data-target="gauge.risk">
          <g className="pre gauge">
            <path d={`M ${GX - GR} ${GY} A ${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`} fill="none" stroke={C.hairline} strokeWidth={22} strokeLinecap="round" />
            <path className="gauge-fill" d={`M ${GX - GR} ${GY} A ${GR} ${GR} 0 0 1 ${GX + GR} ${GY}`} fill="none" stroke={C.warn} strokeWidth={22} strokeLinecap="round" />
            <line className="needle" x1={GX} y1={GY} x2={GX - 150} y2={GY} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
            <circle cx={GX} cy={GY} r={9} fill={C.text} />
            <text x={GX} y={GY + 50} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.warn}>risk grows with depth</text>
          </g>
        </g>
      </Svg>
      <Heading x={470} y={120} size={44}>The deep layers today</Heading>
      <Callout className="pre c-customer" x={1360} y={220} w={500} kind="Customer" text="Every customer stands on these layers" tone={C.tenant[3]}
        anchor={{ x: L + 40 + (TENANTS - 1) * 85, y: 245 }} target="lens.deep.customer" />
      <Callout className="pre c-arch" x={1360} y={300} w={500} kind="Architecture" text="Custom fields ride on metadata; the shared schema stays as it is" tone={C.sharedEdge}
        anchor={{ x: PILL_X + PILL_W, y: bandY(0) + 48 }} target="lens.deep.architecture" />
      <FigureChip className="pre fig-sf" x={1360} y={460} w={456} target="fig.salesforce-metadata"
        label="The platform “does not create an actual table”; it stores metadata" source="Salesforce Architects, Platform Multitenant Architecture" />
      <FigureChip className="pre fig-aulbach" x={1360} y={640} w={456} target="fig.aulbach"
        label="Tenant extensions mapped onto shared universal and pivot tables" source="Aulbach et al., ACM SIGMOD 2008" />
      <Callout className="pre c-edge" x={1360} y={300} w={500} kind="In our experience" text="Custom fields often hold data at the edge of the domain" tone={C.tenant[3]}
        anchor={{ x: PILL_X + PILL_W, y: bandY(0) + 48 }} target="note.edge-of-domain" />
      <Callout className="pre c-provider" x={1360} y={640} w={500} kind="Provider" text="Hard to see, compare or reverse, so changed last, if at all" tone={C.warn}
        anchor={{ x: GX + GR, y: GY - 20 }} target="lens.deep.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    [0, 2].forEach((b) => tl.set(q(`.rail-band-${b}`), { opacity: 1 }, 0));
    const stand = cue('stand', 's0'), fields = cue('fields', 's2'), edge = cue('edge', 's3'), risk = cue('risk', 's4');
    focusBeats(ctx, [
      { id: 'stand', at: stand, regions: ['.r-bands'] },
      { id: 'customer', at: cue('customer', 's1'), regions: ['.r-bands'], callout: '.c-customer' },
      { id: 'fields', at: fields, regions: ['.r-bands', '.r-field'], callout: '.c-arch' },
      { id: 'edge', at: edge, regions: ['.r-field'], callout: '.c-edge' },
      { id: 'risk', at: risk, regions: ['.r-bands', '.r-gauge'], callout: '.c-provider' },
    ]);

    // Every customer stands on the deep layers: one line per tenant comes down onto them.
    const lines = cue('stand-lines', 's1');
    for (let t = 0; t < TENANTS; t++) {
      tl.set(q(`.stand-${t}`), { autoAlpha: 1 }, lines + t * 0.12);
      tl.fromTo(q(`.stand-${t}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power1.in' }, lines + t * 0.12);
    }

    // A custom field slides into the data model as metadata; the band's outline does not change.
    const slide = fields + 0.8;
    tl.to(q('.deep-0'), { attr: { 'stroke-width': 2 }, duration: 0.4 }, fields);
    tl.set(q('.field'), { autoAlpha: 1 }, slide);
    tl.fromTo(q('.field'), { x: R + 40 - PILL_X }, { x: 0, duration: 1.4, ease: 'power2.out' }, slide);
    tl.to(q('.deep-0'), { attr: { 'stroke-width': 0 }, duration: 0.4 }, risk);
    appear(ctx, '.fig-sf', fields + 2.4);
    appear(ctx, '.fig-aulbach', fields + 5.5);
    tl.to(q('.fig-sf, .fig-aulbach'), { autoAlpha: 0, duration: 0.35 }, edge - 0.2);

    // Risk grows with depth: the gauge fills and the needle rises.
    appear(ctx, '.gauge', risk + 0.1, { y: 0 });
    tl.fromTo(q('.gauge-fill'), { drawSVG: '0%' }, { drawSVG: `${RISK * 100}%`, duration: 3, ease: 'power1.inOut' }, risk + 0.5);
    tl.fromTo(q('.needle'), { rotation: 0, svgOrigin: `${GX} ${GY}` }, { rotation: RISK * 180, svgOrigin: `${GX} ${GY}`, duration: 3, ease: 'power1.inOut' }, risk + 0.5);
  },
};
