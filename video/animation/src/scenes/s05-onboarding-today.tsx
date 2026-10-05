import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, DocIcon, FigureChip, Frame, Heading, Person, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

// Scene 5. Onboarding today, in three beats: customer (months before first use),
// architecture (fields checked, combinations unchecked), provider (a few specialists,
// and a queue of onboardings that lengthens with every new tenant).
const rail = makeRail('rail', { lit: 6, label: 'onboarding' });
const L = 520, R = 1300, N0 = 6, QUEUE = 9;
const STEPS = ['Requirements', 'Mapping', 'Customising', 'Migration', 'Training'];
const ARTS: [string, string][] = [['spreadsheet', '▦'], ['setup screens', '▭'], ['JSON · YAML', '{ }'], ['scripts', '>_'], ['slides', '▶']];
const FIELDS = ['pay_group', 'overtime_rate', 'region', 'approval'];
const sw = (R - L) / STEPS.length;
const FX = (i: number) => L + i * 195, FW = 172, FY = 580;
const QX = (k: number) => L + 290 + k * 54, QY = 752;

export const scene05: SceneDef = {
  n: 5,
  id: 'onboarding-today',
  View: () => (
    <Frame act="Act 2" scene="Scene 5 · Onboarding and configuration today">
      <Svg>
        <rail.View />
        <g className="r-steps" data-target="layer.onboarding">
          {STEPS.map((s, i) => (
            <g key={s} className={`pre step step-${i}`} data-target={`step.${i}`}>
              <rect x={L + i * sw + 6} y={220} width={sw - 12} height={56} rx={10} fill="#123a36" stroke={C.tenant[1]} strokeWidth={2} />
              <text x={L + i * sw + sw / 2} y={255} textAnchor="middle" fontFamily={F.sans} fontWeight={500} fontSize={19} fill={C.tenantText}>{s}</text>
            </g>
          ))}
        </g>
        <g className="r-months">
          <rect className="pre months" x={L + 6} y={296} width={R - L - 12} height={10} rx={5} fill={C.warn} />
          <text className="pre months-label" x={L + 6} y={332} fontFamily={F.mono} fontSize={14} fill={C.warn}>months before first use</text>
        </g>
        <g className="r-arch">
          {ARTS.map(([label, glyph], i) => (
            <g key={label} className={`pre art art-${i}`} data-target={`artefact.${i}`}>
              <DocIcon x={L + i * sw + sw / 2 - 37} y={370} label={label} glyph={glyph} />
            </g>
          ))}
          <text className="pre schema-title" x={L} y={560} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>SCHEMA</text>
          {FIELDS.map((fld, i) => (
            <g key={fld} className={`pre field field-${i}`} data-target="schema.field">
              <rect className="field-box" x={FX(i)} y={FY} width={FW} height={48} rx={8} fill={C.canvasRaised} stroke={C.sharedEdge} strokeWidth={2} />
              <text x={FX(i) + 14} y={FY + 30} fontFamily={F.mono} fontSize={16} fill={C.text}>{fld} ✓</text>
            </g>
          ))}
          {FIELDS.slice(0, -1).map((_, i) => (
            <g key={i} className={`pre link link-${i}`} data-target="schema.combination">
              <line x1={FX(i) + FW} y1={FY + 24} x2={FX(i + 1)} y2={FY + 24} stroke={C.warn} strokeWidth={2} strokeDasharray="3 5" />
              <text x={FX(i) + FW + 11.5} y={FY + 16} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={20} fill={C.warn}>?</text>
            </g>
          ))}
          <g className="pre flag" data-target="error.after-go-live">
            <line x1={R - 6} y1={FY - 34} x2={R - 6} y2={FY + 4} stroke={C.warn} strokeWidth={2.5} />
            <path d={`M${R - 6} ${FY - 34} l22 7 l-22 7 z`} fill={C.warn} />
          </g>
          <text className="pre unchecked" x={L} y={662} fontFamily={F.mono} fontSize={15} fill={C.warn}>types checked · combinations unchecked · errors after go-live</text>
        </g>
        <g className="r-provider">
          <g className="pre few">
            {[0, 1, 2].map((i) => <Person key={i} x={L + 40 + i * 70} y={QY + 6} r={18} colour={C.warn} />)}
            <text x={L} y={QY + 90} fontFamily={F.mono} fontSize={14} fill={C.muted}>the few who know the configuration</text>
          </g>
          {Array.from({ length: QUEUE }).map((_, k) => (
            <g key={k} className={`pre qi qi-${k}`} data-target="queue.onboarding">
              {STEPS.map((_, j) => <rect key={j} x={QX(k) + j * 9.5} y={QY} width={8} height={40} rx={2} fill={tenantColour(N0 + k)} opacity={0.55 + j * 0.09} />)}
            </g>
          ))}
          <text className="pre queue-label" x={QX(0)} y={QY + 70} fontFamily={F.mono} fontSize={14} fill={C.muted}>onboardings waiting, one per new tenant</text>
        </g>
      </Svg>
      <Heading x={L} y={120} size={42}>Onboarding and configuration today</Heading>
      <Counter className="pre counter" x={1380} y={128} start={N0} />
      <div className="pre phases" data-target="fig.microsoft-success" style={{ position: 'absolute', left: L, top: 350, width: R - L, fontFamily: F.mono, fontSize: 14, lineHeight: 1.5, color: C.muted }}>
        Implementation phases: Discover, Initiate, Implement, Prepare, Operate. Microsoft, Success by Design, 2026
      </div>
      <Callout className="pre c-customer" x={1360} y={220} w={480} kind="Customer" text="Months before first use" tone={C.tenant[3]}
        anchor={{ x: R - 6, y: 301 }} target="lens.onboarding.customer" />
      <FigureChip className="pre fig-panorama" x={1360} y={360} w={456} target="fig.panorama-2026" figure="9 months"
        label="median ERP project timeline; almost a quarter of organisations over schedule" source="The 2026 ERP Report, Panorama Consulting Group" />
      <FigureChip className="pre fig-regret" x={1360} y={610} w={456} target="fig.gartner-regret" figure="32%"
        label="cite slow or complex implementation as a reason for purchase regret, the second most cited" source="Gartner Digital Markets via TechRepublic, 2023, 3,484 buyers" />
      <Callout className="pre c-arch" x={1360} y={570} w={480} kind="Architecture" text="Fields checked, combinations unchecked" tone={C.sharedEdge}
        anchor={{ x: FX(3) + FW, y: FY + 24 }} target="lens.onboarding.architecture" />
      <Callout className="pre c-provider" x={1360} y={730} w={480} kind="Provider" text="Knowledge with a few people, and it repeats whenever a law, a policy or the organisation changes" tone={C.warn}
        anchor={{ x: QX(QUEUE - 1) + 50, y: QY + 20 }} target="lens.onboarding.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const customer = cue('customer', 's0'), architecture = cue('architecture', 's2'), provider = cue('provider', 's4');
    focusBeats(ctx, [
      { id: 'customer', at: customer, regions: ['.r-steps', '.r-months'], callout: '.c-customer' },
      { id: 'artefacts', at: architecture, regions: ['.r-arch'] },
      { id: 'schema', at: cue('schema', 's3'), regions: ['.r-arch'], callout: '.c-arch' },
      { id: 'provider', at: provider, regions: ['.r-provider'], callout: '.c-provider' },
    ]);

    // Customer: the five steps arrive as they are named; the months bar runs along them.
    STEPS.forEach((_, i) => appear(ctx, `.step-${i}`, customer + 0.8 + i * 1.5));
    appear(ctx, '.phases', cue('phases', 's0+7.5'));
    tl.to(q('.phases'), { autoAlpha: 0, duration: 0.3 }, architecture - 0.2);
    const months = cue('months', 's1');
    tl.set(q('.months'), { autoAlpha: 1 }, months);
    tl.fromTo(q('.months'), { attr: { width: 0 } }, { attr: { width: R - L - 12 }, duration: 5, ease: 'none' }, months);
    appear(ctx, '.months-label', months + 0.6);
    appear(ctx, '.fig-panorama', months + 1.2);
    appear(ctx, '.fig-regret', months + 3.2);
    ['.fig-panorama', '.fig-regret'].forEach((s) => tl.to(q(s), { autoAlpha: 0, duration: 0.3 }, architecture - 0.2));

    // Architecture: the configuration lives in separate artefacts; the schema checks each field,
    // and the links between fields stay unchecked, so errors surface after go-live.
    ARTS.forEach((_, i) => appear(ctx, `.art-${i}`, architecture + 0.4 + i * 0.35));
    const schema = cue('schema', 's3');
    appear(ctx, '.schema-title', schema);
    FIELDS.forEach((_, i) => appear(ctx, `.field-${i}`, schema + 0.3 + i * 0.3));
    FIELDS.forEach((_, i) => tl.to(q(`.field-${i} .field-box`), { attr: { stroke: C.text }, duration: 0.3, yoyo: true, repeat: 1 }, schema + 2 + i * 0.25));
    FIELDS.slice(0, -1).forEach((_, i) => appear(ctx, `.link-${i}`, schema + 4 + i * 0.4, { y: 0 }));
    const golive = cue('go-live', 's3+8');
    appear(ctx, '.flag', golive, { y: 0 });
    appear(ctx, '.unchecked', golive + 0.4);

    // Provider: the few specialists, and a queue of onboardings that grows with every new tenant.
    appear(ctx, '.few', provider + 0.3);
    appear(ctx, '.counter', provider + 0.8);
    const grow = provider + 1.4, span = Math.max(4, ctx.duration - grow - 2);
    appear(ctx, '.queue-label', grow);
    for (let k = 0; k < QUEUE; k++) {
      const t = grow + (k / QUEUE) * span;
      appear(ctx, `.qi-${k}`, t, { duration: 0.4 });
      tl.set(q('.counter .counter-value'), { innerText: N0 + k + 1 }, t);
    }
  },
};
