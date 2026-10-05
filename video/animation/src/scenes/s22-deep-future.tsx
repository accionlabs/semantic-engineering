import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, Frame, Heading, Pill, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

// Scene 22. The deep layers stay where they are: shared, unchanged, and out of the agent's reach.
// Nothing moves here, by design; the line comes to rest above these bands.
const rail = makeRail('rail', { lit: 1, lineAt: 4, label: 'deep layers', glow: true });
const L = 520, R = 1300, LINE_Y = 300, BAND_Y = 330, BAND_H = 96, BAND_GAP = 14;
const BANDS = ['Data model', 'Database', 'Infrastructure'];
const bandY = (i: number) => BAND_Y + i * (BAND_H + BAND_GAP);
const MAX = 14, N0 = 6, tickX = (t: number) => L + 30 + t * ((R - L - 60) / (MAX - 1));
const G = { cx: 700, cy: 850, r: 110 };
const arc = `M ${G.cx - G.r} ${G.cy} A ${G.r} ${G.r} 0 0 1 ${G.cx + G.r} ${G.cy}`;
const AGENT = { x: 880, w: 150, y: 252 };
const CASE = { x: 1010, y: 720, w: 290, h: 56 };
const OUT = { x: L - 8, y: BAND_Y - 8, w: R - L + 16, h: 3 * BAND_H + 2 * BAND_GAP + 16 };

export const scene22: SceneDef = {
  n: 22,
  id: 'deep-future',
  View: () => (
    <Frame act="Act 5 · optional" scene="Scene 22 · The deep layers">
      <Svg>
        <rail.View />
        <g className="r-tenants">
          {Array.from({ length: MAX }).map((_, t) => (
            <line key={t} className={`tick tick-${t}`} x1={tickX(t)} x2={tickX(t)} y1={200} y2={244} stroke={tenantColour(t)} strokeWidth={4} strokeLinecap="round" opacity={t < N0 ? 1 : 0} />
          ))}
        </g>
        <g className="r-bands" data-target="drill.deep">
          {BANDS.map((b, i) => (
            <g key={b} data-target={`layer.deep.${i}`}>
              <rect x={L} y={bandY(i)} width={R - L} height={BAND_H} rx={10} fill={C.shared} />
              <text x={L + 24} y={bandY(i) + 56} fontFamily={F.sans} fontWeight={600} fontSize={24} fill={C.text}>{b}</text>
            </g>
          ))}
          <g className="field" data-target="field.custom"><Pill x={900} y={bandY(0) + 31} text="custom field · as metadata" colour={C.tenant[3]} /></g>
          <path className="mt-line" d={`M${L - 20} ${LINE_Y} H${R + 20}`} stroke={C.line} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.line})` }} data-target="line.mt" />
        </g>

        <g className="r-risk" data-target="gauge.risk">
          <path d={arc} fill="none" stroke={C.hairline} strokeWidth={20} strokeLinecap="round" />
          <path className="gauge-fill" d={arc} fill="none" stroke={C.warn} strokeWidth={20} strokeLinecap="round" />
          <line className="needle" x1={G.cx} y1={G.cy} x2={G.cx - G.r + 22} y2={G.cy} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
          <text x={G.cx} y={G.cy + 36} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.warn}>risk grows with depth</text>
          {[0, 1].map((k) => <circle key={k} className={`pre need need-${k}`} cx={L + 200 + k * 380} cy={180} r={11} fill={C.warn} />)}
        </g>

        <g className="r-reach" data-target="boundary.agent">
          <g className="pre agent">
            <rect x={AGENT.x} y={AGENT.y} width={AGENT.w} height={42} rx={21} fill={C.canvasRaised} stroke={C.tenant[3]} strokeWidth={2} />
            <text x={AGENT.x + AGENT.w / 2} y={AGENT.y + 27} textAnchor="middle" fontFamily={F.mono} fontSize={16} fill={C.tenantText}>agent</text>
          </g>
          <g className="pre refuse">
            <rect x={AGENT.x + AGENT.w + 14} y={AGENT.y + 6} width={216} height={30} rx={6} fill={C.canvas} />
            <text x={AGENT.x + AGENT.w + 24} y={AGENT.y + 27} fontFamily={F.mono} fontSize={15} fill={C.warn}>cannot pass the line</text>
          </g>
        </g>

        <g className="r-case" data-target="needs.case-by-case">
          <g className="pre case">
            <rect x={CASE.x} y={CASE.y} width={CASE.w} height={CASE.h} rx={10} fill={C.canvasRaised} stroke={C.muted} strokeWidth={2} strokeDasharray="6 6" />
            <text x={CASE.x + CASE.w / 2} y={CASE.y + 34} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.text}>case by case · on the site</text>
          </g>
          <circle className="pre case-need" cx={R + 30} cy={LINE_Y - 40} r={11} fill={C.warn} />
        </g>

        <g className="r-rebuild" data-target="rec.rearchitecture">
          <path className="outline" d={`M${OUT.x + 14} ${OUT.y} H${OUT.x + OUT.w - 14} Q${OUT.x + OUT.w} ${OUT.y} ${OUT.x + OUT.w} ${OUT.y + 14} V${OUT.y + OUT.h - 14} Q${OUT.x + OUT.w} ${OUT.y + OUT.h} ${OUT.x + OUT.w - 14} ${OUT.y + OUT.h} H${OUT.x + 14} Q${OUT.x} ${OUT.y + OUT.h} ${OUT.x} ${OUT.y + OUT.h - 14} V${OUT.y + 14} Q${OUT.x} ${OUT.y} ${OUT.x + 14} ${OUT.y} Z`}
            fill="none" stroke={C.sharedEdge} strokeWidth={3} />
          <text className="pre outline-label" x={L} y={OUT.y + OUT.h + 34} fontFamily={F.mono} fontSize={16} fill={C.sharedEdge}>a planned rebuild: where the greenfield path begins</text>
        </g>
      </Svg>

      <Heading x={470} y={120} size={40}>The deep layers stay where they are</Heading>
      <Counter className="pre counter" x={1380} y={128} start={N0} />
      <Callout className="pre c-stay" x={1340} y={330} w={500} kind="Architecture" text="Shared, and unchanged as tenants are added above the line." tone={C.sharedEdge}
        anchor={{ x: R, y: bandY(0) + 48 }} target="lens.deep-future.stay" />
      <Callout className="pre c-risk" x={1340} y={720} w={500} kind="Customer" text="Few needs reach this far, and those carry the most risk." tone={C.tenant[3]}
        anchor={{ x: G.cx + G.r + 16, y: G.cy - 20 }} target="lens.deep-future.customer" />
      <Callout className="pre c-reach" x={1340} y={170} w={500} kind="Architecture" text="Out of reach of an agent working in the language." tone={C.sharedEdge}
        anchor={{ x: AGENT.x + AGENT.w + 230, y: AGENT.y + 21 }} target="lens.deep-future.architecture" />
      <Callout className="pre c-case" x={1340} y={690} w={500} kind="Deeper needs" text="Handled case by case. The site sets out how." tone={C.muted}
        anchor={{ x: CASE.x + CASE.w, y: CASE.y + 28 }} target="lens.deep-future.case" />
      <Callout className="pre c-rebuild" x={1340} y={520} w={500} kind="Provider" text="Where a rebuild is already planned, design the lower line into it." tone={C.warn}
        anchor={{ x: OUT.x + OUT.w, y: OUT.y + OUT.h - 60 }} target="lens.deep-future.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const stay = cue('stay', 0), risk = cue('risk', 's1'), reach = cue('reach', 's2'), kase = cue('case', 's3'), rebuild = cue('rebuild', 's4');
    focusBeats(ctx, [
      { id: 'stay', at: stay, regions: ['.r-tenants', '.r-bands'], callout: '.c-stay' },
      { id: 'risk', at: risk, regions: ['.r-bands', '.r-risk'], callout: '.c-risk' },
      { id: 'reach', at: reach, regions: ['.r-bands', '.r-reach'], callout: '.c-reach' },
      { id: 'case', at: kase, regions: ['.r-bands', '.r-case'], callout: '.c-case' },
      { id: 'rebuild', at: rebuild, regions: ['.r-bands', '.r-rebuild'], callout: '.c-rebuild' },
    ]);

    // Stay: the line comes to rest above these bands, then tenants are added above it. The bands do not change.
    tl.set(q('.outline'), { drawSVG: '0%' }, 0);
    tl.fromTo(q('.mt-line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, stay + 0.4);
    const grow = stay + 1.6, span = Math.max(2.5, risk - grow - 0.3);
    appear(ctx, '.counter', grow - 0.3);
    tl.to(q('.counter .counter-value'), { innerText: MAX, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);
    for (let t = N0; t < MAX; t++) tl.to(q(`.tick-${t}`), { opacity: 1, duration: 0.3 }, grow + ((t - N0) / (MAX - N0)) * span);
    vanish(ctx, '.counter', risk);

    // Risk: the gauge from Act 2 rises; the few needs that come this far drop toward the bands.
    tl.fromTo(q('.gauge-fill'), { drawSVG: '0%' }, { drawSVG: '85%', duration: 1.6 }, risk + 0.3);
    tl.fromTo(q('.needle'), { rotation: 0, svgOrigin: `${G.cx} ${G.cy}` }, { rotation: 0.85 * 180, svgOrigin: `${G.cx} ${G.cy}`, duration: 1.6 }, risk + 0.3);
    [0, 1].forEach((k) => {
      const at = risk + 0.8 + k * 0.7;
      tl.set(q(`.need-${k}`), { autoAlpha: 1, attr: { cy: 180 } }, at);
      tl.to(q(`.need-${k}`), { attr: { cy: LINE_Y - 16 }, duration: 0.8, ease: 'power2.in' }, at);
      tl.to(q(`.need-${k}`), { autoAlpha: 0, duration: 0.4 }, reach - 0.3);
    });

    // Reach: an agent working in the language presses on the line and stops there.
    appear(ctx, '.agent', reach + 0.2, { y: -20 });
    for (let k = 0; k < 3; k++) {
      const at = reach + 1 + k * 1.1;
      tl.to(q('.agent'), { y: 4, duration: 0.25, ease: 'power2.in' }, at).to(q('.agent'), { y: -12, duration: 0.45, ease: 'power2.out' }, at + 0.25);
    }
    appear(ctx, '.refuse', reach + 1.3, { y: 0 });

    // Case by case: a need that reaches this far goes to a case-by-case path, set out on the site.
    appear(ctx, '.case', kase + 0.2, { y: 0 });
    tl.set(q('.case-need'), { autoAlpha: 1 }, kase + 0.8);
    tl.fromTo(q('.case-need'), { attr: { cx: R + 30, cy: LINE_Y - 40 } }, { attr: { cx: CASE.x + CASE.w / 2, cy: CASE.y - 16 }, duration: 1.6, ease: 'power1.inOut' }, kase + 0.8);

    // Rebuild: a dashed outline where a planned rebuild would design the lower line in.
    tl.to(q('.outline'), { drawSVG: '100%', duration: 1.4 }, rebuild + 0.2);
    tl.set(q('.outline'), { strokeDasharray: '12 9', strokeDashoffset: 0 }, rebuild + 1.65);
    appear(ctx, '.outline-label', rebuild + 1.2, { y: 0 });
  },
};
