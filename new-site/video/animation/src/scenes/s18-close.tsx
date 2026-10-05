import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { Frame, Heading, Pill, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 18. Close: Wadi illustrates the greenfield direction, On2Go the brownfield one, then the site.
const common = { y: 300, width: 700, bandH: 50, gap: 6, labelW: 250, markers: false, lineLabel: false, labels: { 3: 'Domain invariants' }, fontScale: 0.8 };
const green = makeStack({ key: 'g', x: 160, tenants: 0, lineAt: 4, buildable: true, ...common });
const brown = makeStack({ key: 'b', x: 1060, tenants: 6, lineAt: 6, ...common });
const PY = green.bandTop(0) + 50 + 20;
const HX = green.colX + green.colW / 2; // the house sits on the greenfield stack
const CARD = { x: brown.colX + brown.colW / 2 - 150, y: brown.bandTop(6) - 64, w: 300, h: 54 };

export const scene18: SceneDef = {
  n: 18,
  id: 'close',
  View: () => (
    <Frame act="Act 4" scene="Scene 18 · Close">
      <Heading className="pre head" x={160} y={100} w={1600} size={40}>Two illustrations, one for each direction of travel</Heading>
      <Svg>
        <g className="r-green">
          <g className="green" data-target="example.wadi">
            <green.View />
            <path className="pre house" d={`M ${HX - 60} ${green.bandTop(6) - 8} v -52 l 60 -48 l 60 48 v 52 z`} fill="none" stroke={C.tenant[3]} strokeWidth={4} strokeLinejoin="round" />
            <Pill className="pre g-p0" x={160} y={PY} text="Wadi · greenfield" colour={C.tenant[3]} />
            <Pill className="pre g-p1" x={160} y={PY + 50} text="controls generated from the document" colour={C.muted} />
            <Pill className="pre g-p2" x={160} y={PY + 100} text="case corpus not built yet" colour={C.warn} />
          </g>
        </g>
        <g className="r-brown">
          <g className="brown" data-target="example.on2go">
            <brown.View />
            <g className="pre card">
              <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={10} fill="#0a1a1a" stroke={C.tenant[2]} strokeWidth={2} />
              <text x={CARD.x + CARD.w / 2} y={CARD.y + 34} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.tenantText}>onboarding language</text>
            </g>
            <Pill className="pre b-p0" x={1060} y={PY} text="On2Go · brownfield" colour={C.tenant[3]} />
            <Pill className="pre b-p1" x={1060} y={PY + 50} text="compiles to inputs the product accepts" colour={C.muted} />
            <Pill className="pre b-p2" x={1060} y={PY + 100} text="shown so far on test data" colour={C.warn} />
            <text className="pre b-url" data-target="link.on2go" x={1062} y={PY + 170} fontFamily={F.mono} fontSize={20} fill={C.invariantEdge}>on2go.ai</text>
          </g>
        </g>
      </Svg>
      <div className="r-site">
        <div className="pre site" data-target="site.link" style={{ position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 64 }}>The full argument, with every source</div>
          <div style={{ fontFamily: F.mono, fontSize: 34, color: C.invariantEdge, marginTop: 28 }}>dialect-engineering.ai</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 56, marginTop: 40, fontSize: 24, color: C.muted }}>
            <span data-target="link.semantic-engineering">Semantic engineering <span style={{ fontFamily: F.mono, color: C.text }}>semantic-engineering.ai</span></span>
            <span data-target="link.on2go">On2Go <span style={{ fontFamily: F.mono, color: C.text }}>on2go.ai</span></span>
          </div>
        </div>
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // The greenfield stack is already built, with its line on the invariants.
    for (let i = 0; i < 7; i++) tl.set(q(green.sel(`solid-${i}`)), { opacity: 1 }, 0);
    tl.set(q(green.sel('glow')), { opacity: 1 }, 0);
    appear(ctx, '.head', cue('heading', 's0'));

    const wadi = cue('wadi', 's1'), corpus = cue('corpus', 's2'), on2go = cue('on2go', 's3'), site = cue('site', 's4');
    focusBeats(ctx, [
      { id: 'wadi', at: wadi, regions: ['.r-green'] },
      { id: 'on2go', at: on2go, regions: ['.r-brown'] },
      { id: 'site', at: site, regions: ['.r-site'] },
    ], 0.3);

    // Wadi: the house docks onto the greenfield stack; its controls come from the document.
    tl.set(q('.house'), { autoAlpha: 1 }, wadi + 0.3);
    tl.fromTo(q('.house'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4 }, wadi + 0.3);
    appear(ctx, '.g-p0', wadi + 0.6);
    appear(ctx, '.g-p1', cue('controls', 's1+5'));
    appear(ctx, '.g-p2', corpus + 0.2);

    // On2Go: the onboarding language docks onto the top band of the brownfield stack.
    tl.set(q('.card'), { autoAlpha: 1 }, on2go + 0.3);
    tl.fromTo(q('.card'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, on2go + 0.3);
    brown.lit(ctx, 6, on2go + 1);
    appear(ctx, '.b-p0', on2go + 0.6);
    appear(ctx, '.b-p1', cue('compiles', 's3+4'));
    appear(ctx, '.b-p2', cue('test-data', 's3+8'));
    appear(ctx, '.b-url', cue('on2go-url', 's3+1.2'));

    // The site.
    vanish(ctx, '.green, .brown, .head', site - 0.2, { duration: 0.5 });
    appear(ctx, '.site', site + 0.3, { duration: 0.7 });
  },
};
