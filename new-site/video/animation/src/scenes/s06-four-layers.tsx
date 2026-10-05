import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { AGENT, AgentIcon, Custodians, Defs, Flow, KindLabels, STATIONS, Y } from '../parts/Landscape';
import { Bands, GY, Ties, TraversePath, item, traversePoints } from '../parts/Graph';
import { Callout, Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 6. The four layers. Each layer is an ontology; each holds its own kinds of item and is kept by
// its custodian. Links across the layers let one search follow a user action to the code behind it,
// before any code is written. Every item cites where it came from.
const OWNERS: Record<string, string> = {
  functional: 'kept by the Product Owner',
  design: 'kept by the UX Designer and the design system owner',
  architecture: 'kept by the Architect and the tech lead',
  code: 'kept by the Engineering Team',
};
const CITED: [typeof KINDS[number]['id'], number, string][] = [['functional', 1, 'document'], ['design', 2, 'design frame'], ['architecture', 3, 'ticket'], ['code', 0, 'code file']];

export const scene06: SceneDef = {
  n: 6,
  id: 'four-layers',
  View: () => (
    <Frame act="Act 2" scene="Scene 6 · The four layers">
      <Svg>
        <Defs />
        <g className="top"><KindLabels /><Custodians /></g>
        <Bands className="g" />
        <Ties />
        <g className="bottom"><Flow agent /><AgentIcon x={AGENT.x} y={AGENT.y} /></g>
        {KINDS.map((k) => (
          <text key={k.id} className={`pre onto onto-${k.id}`} x={960} y={606} textAnchor="middle" fontFamily={F.sans} fontSize={27} fontWeight={500} fill={C.layer[k.id]}>{k.label} Ontology, {OWNERS[k.id]}</text>
        ))}
        <TraversePath className="pre path" />
        {traversePoints().map((p, i) => <circle key={i} className={`pre hop hop-${i}`} cx={p.x} cy={p.y} r={13} fill="none" stroke={C.text} strokeWidth={3} />)}
        <g className="pre before">
          <rect x={STATIONS[1].x - 120} y={Y.flow - 38} width={240} height={76} rx={10} fill="none" stroke={C.warn} strokeWidth={2} strokeDasharray="6 6" />
          <text x={STATIONS[1].x} y={Y.flow + 64} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.warn}>no code yet</text>
        </g>
        {CITED.map(([k, i, label]) => {
          const p = item(k, i);
          return (
            <g key={k} className={`pre cite cite-${k}`}>
              <line x1={p.x} y1={p.y} x2={p.x + 56} y2={p.y - 34} stroke={C.cardText} strokeWidth={1.5} />
              <path d={`M${p.x + 56} ${p.y - 52} h22 l8 8 v22 h-30 z`} fill={C.canvasRaised} stroke={C.cardText} strokeWidth={1.5} />
              <text x={p.x + 92} y={p.y - 34} fontFamily={F.mono} fontSize={13} fill={C.cardText}>{label}</text>
            </g>
          );
        })}
      </Svg>
      <Callout className="pre co-onto" x={560} y={572} w={800} kind="Each layer is an ontology" text="A structured description of one kind of knowledge" tone={C.text} target="graph.ontology" />
      <Callout className="pre chip-found" x={1080} y={568} w={680} kind="One user story about email alerts" text="14 architecture parts · 15 code changes · 5 repositories" tone={C.text} target="fig.traversal-email-alerts" />
      <Callout className="pre co-cite" x={1180} y={572} w={500} kind="Every item" text="Cites the source it came from" tone={C.cardText} target="graph.citations" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    tl.set(q('.g .nlabel'), { autoAlpha: 0 }, 0);
    tl.set(q('.bottom'), { opacity: 0.4 }, 0);
    // s1: four layers, each an ontology.
    const s1 = cue('ontology', 's0');
    tl.fromTo(q('.g.band'), { opacity: 0.6 }, { opacity: 1, duration: 0.4 }, s1);
    appear(ctx, '.co-onto', s1 + 0.6);
    // s2 to s5: one layer at a time, its items and its owner.
    KINDS.forEach((k, i) => {
      const at = cue(k.id, `s${i + 1}`);
      if (i === 0) vanish(ctx, '.co-onto', at);
      tl.to(q('.g.band, .g.xlink, .tie, .top .lbl, .top .cus'), { opacity: 0.2, duration: 0.3 }, at);
      tl.to(q(`.band-${k.id}, .tie-${k.id}, .top .lbl-${k.id}, .top .cus-${k.id}`), { opacity: 1, duration: 0.3 }, at);
      tl.to(q(`.band-${k.id} .nlabel`), { autoAlpha: 1, duration: 0.4 }, at + 0.3);
      appear(ctx, `.onto-${k.id}`, at + 0.3);
      if (i > 0) vanish(ctx, `.onto-${KINDS[i - 1].id}`, at);
    });
    // s6: one search follows a user action down to the code behind it.
    const s6 = cue('traverse', 's5');
    vanish(ctx, '.onto-code', s6);
    tl.to(q('.g.band, .tie, .top .lbl, .top .cus'), { opacity: 1, duration: 0.3 }, s6);
    tl.to(q('.g.xlink'), { opacity: 0.55, duration: 0.3 }, s6);
    tl.fromTo(q('.path'), { autoAlpha: 1, drawSVG: '0%' }, { drawSVG: '100%', duration: 2.2, ease: 'none' }, s6 + 0.3);
    [0, 1, 2, 3].forEach((i) => appear(ctx, `.hop-${i}`, s6 + 0.3 + i * 0.7, { y: 0 }));
    // s7: what one search found on one user story.
    const s7 = cue('found', 's6');
    appear(ctx, '.chip-found', s7);
    // s8: before any code is written.
    const s8 = cue('before', 's7');
    vanish(ctx, '.chip-found', s8);
    tl.to(q('.bottom'), { opacity: 1, duration: 0.3 }, s8);
    appear(ctx, '.before', s8 + 0.2, { y: 0 });
    // s9: every item cites its source.
    const s9 = cue('cite', 's8');
    vanish(ctx, '.before, .path, .hop', s9);
    tl.to(q('.bottom'), { opacity: 0.4, duration: 0.3 }, s9);
    CITED.forEach(([k], i) => appear(ctx, `.cite-${k}`, s9 + 0.2 + i * 0.35));
    appear(ctx, '.co-cite', s9 + 1.2);
  },
};
