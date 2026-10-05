import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { COL, Cards, Custodians, Defs, KindLabels, Y } from '../parts/Landscape';
import { Frame, Svg } from '../parts/ui';
import { C, F, KINDS } from '../theme';

// Scene 1. Who holds the knowledge. The four kinds of knowledge are named first, each custodian
// arrives under its kind, then the documents that hold part of that knowledge today.
const LISTS: Record<string, string[]> = {
  functional: ['personas · outcomes', 'scenarios', 'rejected proposals'],
  design: ['components', 'interaction patterns', 'state handling'],
  architecture: ['service boundaries', 'source-of-truth databases', 'integration contracts'],
  code: ['live functions', 'retry policies · feature flags', 'unused utilities'],
};

export const scene01: SceneDef = {
  n: 1,
  id: 'who-holds-the-knowledge',
  View: () => (
    <Frame act="Act 1" scene="Scene 1 · Who holds the knowledge">
      <Svg>
        <Defs />
        <KindLabels className="pre" />
        <Custodians className="pre" />
        {KINDS.map((k) => (
          <g key={k.id} className={`pre list list-${k.id}`}>
            {LISTS[k.id].map((t, i) => (
              <text key={i} x={COL[k.id]} y={Y.card + 26 + i * 30} textAnchor="middle" fontFamily={F.sans} fontSize={20} fill={C.layer[k.id]}>{t}</text>
            ))}
          </g>
        ))}
        <Cards className="pre" />
        <rect className="pre whole" x={140} y={92} width={1640} height={336} rx={18} fill="none" stroke={C.warn} strokeWidth={3} strokeDasharray="14 10" />
        <text className="pre whole-label" x={960} y={500} textAnchor="middle" fontFamily={F.sans} fontSize={30} fontWeight={500} fill={C.warn}>No single person and no document holds all four</text>
        <text className="pre custodians-label" x={960} y={520} textAnchor="middle" fontFamily={F.display} fontSize={56} fontWeight={700} fill={C.text}>The four custodians</text>
      </Svg>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: the four kinds of knowledge, named in layer order.
    const named = cue('kinds', 's0+0.2');
    KINDS.forEach((k, i) => appear(ctx, `.lbl-${k.id}`, named + i * 0.5));
    // s2 to s5: each custodian arrives under its kind, with what that knowledge contains.
    KINDS.forEach((k, i) => {
      const at = cue(`custodian-${k.id}`, `s${i + 1}`);
      appear(ctx, `.cus-${k.id}`, at);
      appear(ctx, `.list-${k.id}`, at + 0.3);
      if (i > 0) tl.to(q(`.cus-${KINDS[i - 1].id}, .list-${KINDS[i - 1].id}`), { opacity: 0.35, duration: 0.4 }, at);
    });
    // s6: the lists give way to the documents three of the custodians write.
    const docs = cue('documents', 's5');
    tl.to(q('.cus'), { opacity: 1, duration: 0.4 }, docs);
    vanish(ctx, '.list', docs);
    ['functional', 'design', 'architecture'].forEach((id, i) => tl.fromTo(q(`.card-${id}`), { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, docs + 0.3 + i * 0.6));
    // s7: code knowledge stays in heads, a slice in each developer.
    const heads = cue('heads', 's6');
    appear(ctx, '.card-code', heads);
    [0, 1, 2].forEach((i) => tl.to(q(`.slice-${i}`), { opacity: 1, duration: 0.3 }, heads + 0.5 + i * 0.3));
    // s8: no single person and no document holds all four.
    const whole = cue('whole', 's7');
    appear(ctx, '.whole', whole, { y: 0 });
    tl.to(q('.whole'), { opacity: 0.25, duration: 0.25, repeat: 3, yoyo: true }, whole + 0.8);
    appear(ctx, '.whole-label', whole + 0.4);
    // s9: the four roles are the custodians.
    const named2 = cue('custodians', 's8');
    vanish(ctx, '.whole, .whole-label', named2);
    appear(ctx, '.custodians-label', named2 + 0.3);
  },
};
