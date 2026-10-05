import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { FigureChip, Frame, Heading, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 15. Greenfield builds from the bottom first while brownfield waits; then brownfield works
// from the top down, along the customer's path. Only one of them moves at a time.
const common = { width: 640, bandH: 56, gap: 7, labelW: 250, lineLabel: false, labels: { 3: 'Domain invariants' }, fontScale: 0.85 };
const green = makeStack({ key: 'g', x: 200, y: 260, tenants: 0, lineAt: 4, markers: false, buildable: true, ...common });
const brown = makeStack({ key: 'b', x: 1060, y: 260, tenants: 6, lineAt: 6, ...common, width: 620 });
const TOP = green.bandTop(6), BOT = green.bandTop(0) + 56;
const AX = 1720; // brownfield arrow
const stepY = [TOP - 10, brown.bandTop(6) + 56, brown.bandTop(5) + 56, brown.bandTop(4) + 56];

const Head: React.FC<{ className: string; x: number; y: number; rot: number }> = ({ className, x, y, rot }) => (
  <g className={className}><path d="M-9 -8 L7 0 L-9 8 z" fill={C.text} transform={`translate(${x} ${y}) rotate(${rot})`} /></g>
);

export const scene15: SceneDef = {
  n: 15,
  id: 'green-brown',
  View: () => (
    <Frame act="Act 4" scene="Scene 15 · Greenfield and brownfield">
      <div className="r-green-h"><Heading className="h-green" x={200} y={130} size={36} target="path.greenfield">Greenfield: build from the bottom</Heading></div>
      <div className="r-brown-h"><Heading className="h-brown" x={1060} y={130} size={36} target="path.brownfield">Brownfield: work from the top</Heading></div>
      <Svg>
        <g className="r-green">
          <green.View />
          <line className="pre g-arrow" x1={150} y1={BOT} x2={150} y2={TOP + 2} stroke={C.text} strokeWidth={4} />
          <Head className="pre g-head" x={150} y={TOP} rot={-90} />
        </g>
        <g className="r-brown">
          <brown.View />
          {[0, 1].map((k) => <line key={k} className={`pre b-arrow-${k}`} x1={AX} y1={stepY[k]} x2={AX} y2={stepY[k + 1] - 2} stroke={C.text} strokeWidth={4} />)}
          <Head className="pre b-head" x={AX} y={stepY[1]} rot={90} />
          <line className="pre b-later" x1={AX} y1={stepY[2] + 10} x2={AX} y2={stepY[3]} stroke={C.muted} strokeWidth={3} strokeDasharray="5 7" />
          <text className="pre b-later-label" x={AX + 18} y={stepY[3] - 30} fontFamily={F.mono} fontSize={15} fill={C.muted}>
            <tspan x={AX + 18}>business rules:</tspan>
            <tspan x={AX + 18} dy={20}>later, or</tspan>
            <tspan x={AX + 18} dy={20}>not at all</tspan>
          </text>
        </g>
      </Svg>
      <FigureChip className="pre fig" x={1060} y={760} w={620} target="fig.strangler"
        label="Strangler fig: grow a new system around the edges of the old one, with reduced risk the main reason to prefer it over a rewrite"
        source="Fowler, 2004; Azure Architecture Center, 2026" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const g = cue('greenfield', 's2'), b = cue('brownfield', 's3'), steps = cue('steps', 's4');
    focusBeats(ctx, [
      { id: 'greenfield', at: g, regions: ['.r-green', '.r-green-h'] },
      { id: 'brownfield', at: b, regions: ['.r-brown', '.r-brown-h'] },
    ], 0.35);
    // Brownfield waits, dimmed, from the start; the greenfield line appears once it is built.
    tl.set(q('.r-brown, .r-brown-h'), { opacity: 0.35 }, 0);
    tl.set(q(green.sel('line')), { autoAlpha: 0 }, 0);

    // Greenfield: the bands turn solid from the bottom while its arrow rises.
    const dur = 6.5, start = g + 0.6;
    green.buildUp(ctx, start, dur);
    tl.set(q('.g-arrow'), { autoAlpha: 1 }, start);
    tl.fromTo(q('.g-arrow'), { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'none' }, start);
    tl.set(q('.g-head'), { autoAlpha: 1 }, start);
    tl.fromTo(q('.g-head'), { y: BOT - TOP }, { y: 0, duration: dur, ease: 'none' }, start);
    green.glow(ctx, true, start + (4 / 7) * dur);
    tl.to(q(green.sel('line')), { autoAlpha: 1, duration: 0.5 }, start + (4 / 7) * dur);

    // Brownfield: the arrow descends from the top along the customer's path.
    const drawStep = (k: number, at: number) => {
      tl.set(q(`.b-arrow-${k}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.b-arrow-${k}`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'none' }, at);
      tl.to(q('.b-head'), { y: stepY[k + 1] - stepY[1], duration: 1.2, ease: 'none' }, at);
    };
    const descend = b + 1;
    tl.set(q('.b-head'), { autoAlpha: 1, y: stepY[0] - stepY[1] }, descend);
    drawStep(0, descend);
    brown.lit(ctx, 6, descend + 1);
    appear(ctx, '.fig', cue('strangler', 's3+6'));

    // Onboarding first, then the interface (the line steps down past it), then business rules later.
    brown.lit(ctx, 6, steps, 0.6);
    const iface = cue('interface', 's4+1.8');
    drawStep(1, iface);
    brown.line(ctx, 5, iface + 0.4, 1.2);
    brown.lit(ctx, 5, iface + 0.4, 0.6);
    const later = cue('later', 's4+3.8');
    appear(ctx, '.b-later', later, { y: 0 });
    appear(ctx, '.b-later-label', later + 0.3);
    brown.lit(ctx, null, later + 1.5);
  },
};
