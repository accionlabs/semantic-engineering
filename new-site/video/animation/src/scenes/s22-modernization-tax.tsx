import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, vanish } from '../engine/scene';
import { Head } from '../parts/Landscape';
import { BAR, COLS, LOW_Y, P, Pipeline, Tick } from '../parts/Pipeline';
import { Callout, Frame, Person, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 22. The modernization tax. A team replaces an old stack and keeps the behavior; the people who
// knew the system are leaving; the legacy code is the only record; four components of the tax; the
// first three compound; with no executable contract, the migration cannot be shown complete, and stalls.
const CARD = { x: 180, y: 250, w: 320, h: 300 };
const TAX = [
  { y: 290, label: 'Reverse-engineering' },
  { y: 370, label: 'Lost context' },
  { y: 450, label: 'Validation vacuum' },
  { y: 530, label: 'Knowledge disappearance' },
];
const AX0 = COLS.source.x + COLS.source.w + 10, AX1 = COLS.target.x - 14;
const CO = { x: 1130, y: LOW_Y + 10, w: 640 };

export const scene22: SceneDef = {
  n: 22,
  id: 'modernization-tax',
  View: () => (
    <Frame act="Act 4" scene="Scene 22 · The modernization tax">
      <Svg>
        <Pipeline show={['frame']} />
        <g className="legacy" data-target="card.legacy-code">
          <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={10} fill={C.canvasRaised} stroke={C.card} strokeWidth={2} />
          <text x={CARD.x + 18} y={CARD.y + 34} fontFamily={F.mono} fontSize={16} fill={C.cardText}>Legacy code</text>
          {Array.from({ length: 12 }, (_, r) => <rect key={r} x={CARD.x + 18 + (r % 3) * 14} y={CARD.y + 56 + r * 19} width={[230, 180, 140, 250, 200, 120, 220, 160, 240, 130, 190, 210][r]} height={7} rx={3} fill={C.card} />)}
        </g>
        <g className="pre modern">
          <rect x={COLS.target.x + 20} y={P.y0 + 60} width={COLS.target.w - 40} height={P.y1 - P.y0 - 80} rx={12} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="8 7" />
          <text x={COLS.target.x + COLS.target.w / 2} y={(P.y0 + P.y1) / 2 + 20} textAnchor="middle" fontFamily={F.sans} fontSize={26} fill={C.muted}>Modern stack</text>
        </g>
        <g className="sme" data-target="figure.sme"><Person x={555} y={320} r={18} /><text x={555} y={378} textAnchor="middle" fontFamily={F.sans} fontSize={17} fill={C.text}>SME</text></g>
        <g className="pre senior"><Person x={555} y={470} r={16} colour={C.tax} /><text x={555} y={522} textAnchor="middle" fontFamily={F.mono} fontSize={13} fill={C.tax}>senior engineer</text></g>
        {TAX.map((t, i) => (
          <g key={i} className={`pre tax tax-${i}`} data-target={`tax.${['reverse-engineering', 'lost-context', 'validation-vacuum', 'knowledge-disappearance'][i]}`}>
            <line className="tax-line" x1={AX0} y1={t.y} x2={AX1 - 8} y2={t.y} stroke={C.tax} strokeWidth={2.5} strokeDasharray="10 8" />
            <Head x={AX1} y={t.y} from={{ x: AX0, y: t.y }} colour={C.tax} />
            <text className={`tax-label tax-label-${i}`} x={(AX0 + AX1) / 2} y={t.y - 14} textAnchor="middle" fontFamily={F.sans} fontSize={21} fontWeight={600} fill={C.tax}>{t.label}</text>
          </g>
        ))}
        {['edge case', 'workaround'].map((t, i) => (
          <g key={t} className={`pre frag frag-${i}`}>
            <rect x={820 + i * 170} y={384} width={140} height={30} rx={15} fill={C.canvasRaised} stroke={C.card} />
            <text x={890 + i * 170} y={404} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.cardText}>{t}</text>
          </g>
        ))}
        <g className="pre vacuum">
          <rect className="vac-bar" x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={12} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="8 7" />
          <text x={BAR.x + 20} y={BAR.y + 40} fontFamily={F.mono} fontSize={15} fill={C.muted}>nothing to test against</text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className={`hand hand-${i}`}>
              <rect x={1330 + i * 105} y={BAR.y + 14} width={80} height={36} rx={6} fill={C.canvasRaised} stroke={C.muted} />
              <path className="hand-tick" d={`M${1352 + i * 105} ${BAR.y + 32} q6 10 10 10 q8 -14 20 -22`} fill="none" stroke={C.text} strokeWidth={2.5} strokeLinecap="round" />
            </g>
          ))}
        </g>
        <g className="pre leavers">{[0, 1].map((i) => <Person key={i} x={1820} y={500 + i * 70} r={14} />)}</g>
        <g className="pre kcard"><rect x={1790} y={430} width={60} height={40} rx={6} fill={C.canvasRaised} stroke={C.card} /><rect x={1800} y={442} width={40} height={5} rx={2} fill={C.card} /><rect x={1800} y={454} width={28} height={5} rx={2} fill={C.card} /></g>
        <rect className="pre tok" x={AX0 - 30} y={606} width={36} height={18} rx={4} fill={C.text} />
        <Tick className="pre stall" x={1230} y={615} ok={false} />
      </Svg>
      <Callout className="pre co co-keep" {...CO} kind="Legacy modernization" text="A new stack, with the behavior built up over years kept" tone={C.text} target="pipeline.frame" />
      <Callout className="pre co co-gone" {...CO} kind="The people who knew it" text="Retiring, scarce or already gone" tone={C.text} target="figure.sme" />
      <Callout className="pre co co-record" {...CO} kind="Legacy code" text="The only authoritative record of what the system does" tone={C.text} target="card.legacy-code" />
      <Callout className="pre co co-mtt" {...CO} kind="Done by hand" text="The Modernization Translation Tax" tone={C.tax} target="tax.modernization" />
      <Callout className="pre co co-compound" {...CO} kind="The first three" text="Each makes the others worse" tone={C.tax} target="tax.compound" />
      <Callout className="pre co co-proof" {...CO} kind="No executable contract" text="No proof the new system behaves like the old one" tone={C.warn} target="tax.compound" />
      <Callout className="pre co co-stall" {...CO} kind="Cannot be proven complete" text="Stalls before it can deploy" tone={C.warn} target="token.stalled" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    // s1: a new stack, the behavior kept.
    const s1 = cue('modern', 's0');
    appear(ctx, '.modern', s1 + 0.3);
    appear(ctx, '.co-keep', s1 + 0.8);
    // s2: the people who knew the system are leaving.
    const s2 = cue('sme', 's1');
    vanish(ctx, '.co-keep', s2);
    tl.to(q('.sme'), { x: -40, autoAlpha: 0.15, duration: 1.4 }, s2 + 0.4);
    appear(ctx, '.co-gone', s2 + 0.4);
    // s3: the legacy code is the only record.
    const s3 = cue('record', 's2');
    vanish(ctx, '.co-gone', s3);
    tl.fromTo(q('.legacy rect')[0], { attr: { 'stroke-width': 2 } }, { attr: { 'stroke-width': 5 }, duration: 0.4, repeat: 1, yoyo: true }, s3 + 0.3);
    appear(ctx, '.co-record', s3 + 0.3);
    // s4: the tax, four components.
    const s4 = cue('tax', 's3');
    vanish(ctx, '.co-record', s4);
    [0, 1, 2, 3].forEach((i) => {
      tl.set(q(`.tax-label-${i}`), { autoAlpha: 0 }, 0);
      tl.fromTo(q(`.tax-${i}`), { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.6 }, s4 + 0.3 + i * 0.3);
    });
    appear(ctx, '.co-mtt', s4 + 0.6);
    // s5 to s8: one component at a time.
    const s5 = cue('reverse', 's4');
    vanish(ctx, '.co-mtt', s5);
    appear(ctx, '.tax-label-0', s5 + 0.2, { y: 0 });
    appear(ctx, '.senior', s5 + 0.5);
    const s6 = cue('context', 's5');
    appear(ctx, '.tax-label-1', s6 + 0.2, { y: 0 });
    [0, 1].forEach((i) => {
      appear(ctx, `.frag-${i}`, s6 + 0.6 + i * 0.3, { y: 0 });
      tl.to(q(`.frag-${i}`), { y: 90, autoAlpha: 0, duration: 1.4, ease: 'power2.in' }, s6 + 2.2 + i * 0.3);
    });
    const s7 = cue('vacuum', 's6');
    appear(ctx, '.tax-label-2', s7 + 0.2, { y: 0 });
    appear(ctx, '.vacuum', s7 + 0.5);
    [0, 1, 2, 3].forEach((i) => tl.fromTo(q(`.hand-${i} .hand-tick`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6 }, s7 + 1.4 + i * 0.7));
    const s8 = cue('disappear', 's7');
    appear(ctx, '.tax-label-3', s8 + 0.2, { y: 0 });
    tl.to(q('.tax-3'), { opacity: 0.45, duration: 0.4 }, s8 + 0.2);
    appear(ctx, '.kcard, .leavers', s8 + 0.5, { y: 0 });
    tl.to(q('.leavers'), { x: 80, autoAlpha: 0, duration: 1.4 }, s8 + 2.0);
    tl.to(q('.kcard'), { opacity: 0.2, duration: 1.4 }, s8 + 2.2);
    // s9: the first three compound.
    const s9 = cue('compound', 's8');
    [0, 1, 2].forEach((i) => tl.to(q(`.tax-${i} .tax-line`), { attr: { 'stroke-width': 6 }, duration: 0.5 }, s9 + 0.3 + i * 0.15));
    appear(ctx, '.co-compound', s9 + 0.5);
    // s10: no executable contract.
    const s10 = cue('proof', 's9');
    vanish(ctx, '.co-compound', s10);
    tl.fromTo(q('.vac-bar'), { attr: { 'stroke-width': 2 } }, { attr: { 'stroke-width': 5 }, duration: 0.4, repeat: 3, yoyo: true }, s10 + 0.3);
    appear(ctx, '.co-proof', s10 + 0.4);
    // s11: it stalls before it can deploy.
    const s11 = cue('stall', 's10');
    vanish(ctx, '.co-proof', s11);
    appear(ctx, '.tok', s11 + 0.2, { y: 0 });
    tl.to(q('.tok'), { attr: { x: 1190 }, duration: 1.6, ease: 'power2.out' }, s11 + 0.3);
    appear(ctx, '.stall', s11 + 1.9, { y: 0 });
    appear(ctx, '.co-stall', s11 + 2.1);
  },
};
