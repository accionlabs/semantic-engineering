import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { Frame, Heading } from '../parts/ui';
import { C, F } from '../theme';

// Scene 17. What would show this wrong: three failure conditions, each a gauge with its threshold.
const ITEMS = [
  { text: 'Grammar coverage stalls', threshold: 'threshold', target: 'falsifier.coverage' },
  { text: 'Semantic errors survive validation, over 10%', threshold: '10%', target: 'falsifier.semantic',
    source: 'More than 10% of validator-passing documents semantically wrong in production. Paper, section 16' },
  { text: 'The case corpus proves impractical', threshold: 'threshold', target: 'falsifier.corpus' },
];
const GW = 440, TX = 300;

export const scene17: SceneDef = {
  n: 17,
  id: 'falsifiers',
  View: () => (
    <Frame act="Act 4" scene="Scene 17 · What would show this wrong">
      <Heading className="pre head" x={160} y={140} size={52}>What would show this wrong</Heading>
      {ITEMS.map((it, i) => (
        <div key={i} className={`r-f${i}`}>
          <div className={`pre card card-${i}`} data-target={it.target} style={{ position: 'absolute', left: 160 + i * 540, top: 340, width: 500, boxSizing: 'border-box',
            background: C.canvasRaised, border: `2px solid ${C.warn}`, borderRadius: 16, padding: '28px 30px' }}>
            <svg width={GW} height={90}>
              <rect x={0} y={34} width={GW} height={20} rx={10} fill={C.hairline} />
              <rect className="fill" x={0} y={34} width={0} height={20} rx={10} fill={C.sharedEdge} />
              <line x1={TX} x2={TX} y1={20} y2={70} stroke={C.warn} strokeWidth={3} />
              <text x={TX + 6} y={16} fontFamily={F.mono} fontSize={13} fill={C.warn}>{it.threshold}</text>
            </svg>
            <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.2, marginTop: 10 }}>{it.text}</div>
            {it.source && <div style={{ fontFamily: F.mono, fontSize: 13.5, lineHeight: 1.4, color: C.muted, marginTop: 12 }}>{it.source}</div>}
          </div>
        </div>
      ))}
      <div className="r-site">
        <Heading className="pre site" x={160} y={720} size={36} target="site.link">The site sets out each one</Heading>
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    appear(ctx, '.head', cue('heading', 's0'));
    const first = cue('conditions', 's0+0.8'), site = cue('site', 's1');
    const step = (site - first) / 3;
    focusBeats(ctx, [
      ...ITEMS.map((_, i) => ({ id: `f${i}`, at: first + i * step, regions: [`.r-f${i}`] })),
      { id: 'site', at: site, regions: ['.r-site'] },
    ], 0.35);
    ITEMS.forEach((_, i) => {
      const at = first + i * step;
      appear(ctx, `.card-${i}`, at);
      tl.to(q(`.card-${i} .fill`), { attr: { width: GW * 0.55 }, duration: 1.6, ease: 'power1.out' }, at + 0.3);
    });
    appear(ctx, '.site', site + 0.1);
  },
};
