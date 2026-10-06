import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { STATIONS, Y } from '../parts/Landscape';
import { Base, GAP_Y, LOWER } from '../parts/Act3';
import { GY, item, TraversePath } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 28. Three engagements, anonymized. A brownfield code base: the graph extracted in two to three
// weeks, impact analysis replacing days of investigation. A new user-interface workstream: the design
// layer first, 53% reuse in the first sprint. A mature spec-driven practice: very large pull requests and
// long reviews. In each, structure was added where the specification alone was not enough.
const ARCH = [
  { name: 'Brownfield', sub: 'live code base, 2M+ lines', start: 'all four layers' },
  { name: 'Greenfield, growing in complexity', sub: 'new user-interface workstream', start: 'design layer first' },
  { name: 'Spec-driven, at its ceiling', sub: 'mature spec-driven practice', start: 'graph not yet introduced' },
];
const ax = (i: number) => 150 + i * 552;
const CO = { x: 1180, y: GAP_Y - 8, w: 540 };

export const scene28: SceneDef = {
  n: 28,
  id: 'three-engagements',
  View: () => (
    <Frame act="Act 5" scene="Scene 28 · Three engagements">
      <Svg>
        <g className="land"><Base /></g>
        <TraversePath className="pre trav" />
        {ARCH.map((a, i) => (
          <g key={a.name} className={`pre ar ar-${i}`} data-target={`archetype.${['brownfield', 'greenfield', 'sdd-ceiling'][i]}`}>
            <rect className="ar-box" x={ax(i)} y={LOWER.y} width={516} height={124} rx={12} fill={C.canvasRaised} stroke={C.muted} strokeWidth={1.5} />
            <text x={ax(i) + 18} y={LOWER.y + 34} fontFamily={F.sans} fontSize={22} fontWeight={600} fill={C.text}>{a.name}</text>
            <text x={ax(i) + 498} y={LOWER.y + 32} textAnchor="end" fontFamily={F.mono} fontSize={12} letterSpacing={1.5} fill={C.muted}>ANONYMIZED</text>
            <text x={ax(i) + 18} y={LOWER.y + 62} fontFamily={F.sans} fontSize={17} fill={C.cardText}>{a.sub}</text>
            <text className="ar-start" x={ax(i) + 18} y={LOWER.y + 104} fontFamily={F.mono} fontSize={15} fill={i === 2 ? C.warn : C.pass} opacity={0}>{a.start}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((n) => <circle key={n} className={`pre dtok dtok-${n}`} cx={STATIONS[1].x + 40} cy={Y.flow - 60} r={8} fill={C.layer.design} />)}
        <rect className="pre bigtok" x={STATIONS[0].x + 130} y={Y.flow + 44} width={90} height={22} rx={4} fill={C.text} />
        <g className="pre ceiling">
          <rect x={STATIONS[2].x - 150} y={GAP_Y + 10} width={300} height={40} rx={8} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
          <text x={STATIONS[2].x} y={GAP_Y + 36} textAnchor="middle" fontFamily={F.sans} fontSize={16} fill={C.warn}>300 to 400 files · 2+ weeks per review</text>
        </g>
      </Svg>
      <Callout className="pre co co-b1" {...CO} kind="Brownfield" text="2M+ lines · five to six scrum teams" tone={C.text} target="archetype.brownfield" />
      <Callout className="pre co co-b2" {...CO} kind="Extracted from the code" text="All four layers in two to three weeks" tone={C.pass} target="fig.brownfield-extraction" />
      <Callout className="pre co co-b3" {...CO} kind="Impact analysis on the graph" text="Replaced three to five days of investigation" tone={C.pass} target="fig.brownfield-impact" />
      <Callout className="pre co co-g1" {...CO} kind="Greenfield" text="Started with the design layer" tone={C.layer.design} target="archetype.greenfield" />
      <Callout className="pre co co-g2" {...CO} kind="First sprint" text="53% of components reused from the design system" tone={C.pass} target="fig.greenfield-reuse" />
      <Callout className="pre co co-s1" {...CO} kind="Spec-driven" text="1M+ lines rewritten in five to six months" tone={C.text} target="archetype.sdd-ceiling" />
      <Callout className="pre co co-all" {...CO} kind="In all three" text="Structure added where the specification alone was not enough" tone={C.text} target="archetype.pattern" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const pick = (i: number, at: number) => {
      tl.to(q('.ar'), { opacity: 0.35, duration: 0.3 }, at);
      tl.to(q(`.ar-${i}`), { opacity: 1, duration: 0.3 }, at);
      tl.to(q('.ar-box'), { attr: { stroke: C.muted, 'stroke-width': 1.5 }, duration: 0.3 }, at);
      tl.to(q(`.ar-${i} .ar-box`), { attr: { stroke: C.text, 'stroke-width': 3 }, duration: 0.3 }, at);
    };
    // s1: three engagements.
    const s1 = cue('three', 's0');
    ARCH.forEach((_, i) => appear(ctx, `.ar-${i}`, s1 + 0.3 + i * 0.35));
    // s2: brownfield.
    const s2 = cue('brownfield', 's1');
    pick(0, s2 + 0.1);
    appear(ctx, '.co-b1', s2 + 0.3);
    // s3: the graph extracted from the code, layer by layer from the bottom.
    const s3 = cue('extract', 's2');
    vanish(ctx, '.co-b1', s3);
    tl.to(q('.g.band, .g.xlink, .tie'), { autoAlpha: 0, duration: 0.3 }, s3 + 0.1);
    KINDS.slice().reverse().forEach((k, i) => tl.fromTo(q(`.band-${k.id}`), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, s3 + 0.5 + i * 0.35));
    tl.to(q('.g.xlink, .tie'), { autoAlpha: 1, duration: 0.4 }, s3 + 2.0);
    appear(ctx, '.co-b2', s3 + 0.6);
    // s4: impact analysis on the graph.
    const s4 = cue('impact', 's3');
    vanish(ctx, '.co-b2', s4);
    tl.fromTo(q('.trav'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2 }, s4 + 0.3);
    appear(ctx, '.co-b3', s4 + 0.6);
    // s5: greenfield, design layer first.
    const s5 = cue('greenfield', 's4');
    vanish(ctx, '.co-b3, .trav', s5);
    pick(1, s5 + 0.1);
    tl.to(q('.g.band, .g.xlink, .tie'), { opacity: 0.15, duration: 0.4 }, s5 + 0.3);
    tl.to(q('.band-design, .tie-design'), { opacity: 1, duration: 0.4 }, s5 + 0.3);
    appear(ctx, '.co-g1', s5 + 0.5);
    // s6: half the new components land on existing ones.
    const s6 = cue('reuse', 's5');
    vanish(ctx, '.co-g1', s6);
    [0, 1, 2, 3].forEach((n) => {
      const target = n % 2 === 0 ? item('design', n + 1) : { x: item('design', n).x + 110, y: GY.design + 40 };
      appear(ctx, `.dtok-${n}`, s6 + 0.3 + n * 0.4, { y: 0 });
      tl.to(q(`.dtok-${n}`), { attr: { cx: target.x, cy: target.y }, duration: 0.9 }, s6 + 0.5 + n * 0.4);
      if (n % 2 === 0) tl.to(q(`.dtok-${n}`), { attr: { fill: C.pass, r: 11 }, duration: 0.3 }, s6 + 1.4 + n * 0.4);
    });
    appear(ctx, '.co-g2', s6 + 2.4);
    // s7: a spec-driven practice, no graph.
    const s7 = cue('sdd', 's6');
    vanish(ctx, '.co-g2, .dtok', s7);
    pick(2, s7 + 0.1);
    tl.to(q('.g.band, .g.xlink, .tie'), { opacity: 0.1, duration: 0.4 }, s7 + 0.3);
    appear(ctx, '.co-s1', s7 + 0.5);
    // s8: huge pull requests, long reviews.
    const s8 = cue('ceiling', 's7');
    vanish(ctx, '.co-s1', s8);
    appear(ctx, '.bigtok', s8 + 0.2, { y: 0 });
    tl.to(q('.bigtok'), { attr: { x: STATIONS[2].x - 45 }, duration: 1.6, ease: 'power2.out' }, s8 + 0.4);
    appear(ctx, '.ceiling', s8 + 2.0);
    // s9: the pattern across the three.
    const s9 = cue('pattern', 's8');
    vanish(ctx, '.ceiling, .bigtok', s9);
    tl.to(q('.g.band, .g.xlink, .tie'), { opacity: 1, duration: 0.5 }, s9);
    tl.to(q('.ar'), { opacity: 1, duration: 0.3 }, s9);
    tl.to(q('.ar-box'), { attr: { stroke: C.muted, 'stroke-width': 1.5 }, duration: 0.3 }, s9);
    tl.to(q('.ar-start'), { opacity: 1, duration: 0.4, stagger: 0.3 }, s9 + 0.4);
    appear(ctx, '.co-all', s9 + 1.4);
  },
};
