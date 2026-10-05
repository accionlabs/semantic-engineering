import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, Frame, Heading, Person, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

/** A rounded rectangle as path data, so shapes can morph into it. */
export const rectPath = (x: number, y: number, w: number, h: number, r = 10) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

/** A document written in the language: a header strip and a few lines of mono text. Lines carry `${lineKey}-line-<i>`. */
export const DocCard: React.FC<{ className: string; lineKey: string; x: number; y: number; w: number; head: string; colour: string; lines: string[]; size?: number; target: string }> = ({ className, lineKey, x, y, w, head, colour, lines, size = 18, target }) => (
  <div className={className} data-target={target} style={{ position: 'absolute', left: x, top: y, width: w, boxSizing: 'border-box', background: '#0a1a1a', border: `1.5px solid ${colour}`, borderRadius: 10, overflow: 'hidden' }}>
    <div style={{ background: colour, color: C.tenantText, fontFamily: F.mono, fontSize: 14, padding: '6px 14px', letterSpacing: 1 }}>{head}</div>
    <div style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: size, lineHeight: 1.5, color: C.text, whiteSpace: 'pre' }}>
      {lines.map((l, i) => <div key={i} className={`${lineKey}-line ${lineKey}-line-${i}`}>{l || ' '}</div>)}
    </div>
  </div>
);

// Scene 19. Onboarding after the line moves: the five artefacts fold into one validated document.
const rail = makeRail('rail', { lit: 6, lineAt: 4, label: 'onboarding', glow: true });
const L = 520, R = 1300, SW = (R - L) / 5, STEP_Y = 236;
const CARD = { x: 650, y: 336, w: 470, h: 166 };
const VAL_Y = 550, PROD_Y = 800, MIG = 3;
const STEPS = ['Requirements', 'Mapping', 'Customising', 'Migration', 'Training'];
const ARTS: [string, string][] = [['spreadsheet', '▦'], ['setup screens', '▭'], ['JSON · YAML', '{ }'], ['scripts', '>_'], ['slides', '▶']];
const LINES = ['onboard Tenant C', '  pay_groups from payroll.xlsx', '  overtime rule overtime.standard', '  migrate employees from legacy.csv'];
const stepC = (i: number) => L + i * SW + SW / 2;
const docPath = (x: number, y: number) => `M${x} ${y} h56 l18 18 v72 h-74 z`;
const RECS = 8, REJECT = [2, 5];
const QUEUE = 8;
const MINI = 14, N0 = 6, MW = 100, MH = 70;
const miniPos = (i: number) => ({ x: L + (i % 7) * ((R - L) / 7) + 6, y: 346 + Math.floor(i / 7) * 88 });
const FILE = { x: 1180, y: 626 };

export const scene19: SceneDef = {
  n: 19,
  id: 'onboarding-future',
  View: () => (
    <Frame act="Act 5 · optional" scene="Scene 19 · Onboarding, after the line moves">
      <Svg>
        <rail.View />
        {STEPS.map((s, i) => {
          const cx = stepC(i), tx = Math.min(Math.max(cx, CARD.x + 24), CARD.x + CARD.w - 24);
          return (
            <g key={s} className={`r-step-${i}`} data-target={i === MIG ? 'step.migration' : `step.${i}`}>
              <rect x={L + i * SW + 6} y={STEP_Y} width={SW - 12} height={56} rx={10} fill="#123a36" stroke={i === MIG ? C.warn : C.tenant[1]} strokeWidth={2} />
              <text x={cx} y={STEP_Y + 35} textAnchor="middle" fontFamily={F.sans} fontWeight={500} fontSize={19} fill={C.tenantText}>{s}</text>
              <path className={`conn conn-${i}`} d={`M${cx} ${STEP_Y + 56} L${tx} ${CARD.y - 2}`} fill="none" stroke={C.tenant[3]} strokeWidth={2.5} />
            </g>
          );
        })}
        {/* Today: one artefact per step. These shapes morph into the one document. */}
        {ARTS.map(([label, glyph], i) => {
          const x = stepC(i) - 37, y = 332;
          return (
            <g key={label} className={`art art-${i}`}>
              <path className={`art-shape art-shape-${i}`} d={docPath(x, y)} fill={C.canvasRaised} stroke={C.sharedEdge} strokeWidth={2} />
              <g className="art-text">
                <text x={x + 37} y={y + 58} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.sharedEdge}>{glyph}</text>
                <text x={x + 37} y={y + 116} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>{label}</text>
              </g>
            </g>
          );
        })}
        <g className="queue">
          {[0, 1, 2].map((i) => <Person key={i} x={L + 40 + i * 64} y={640} r={17} colour={C.warn} />)}
          {Array.from({ length: QUEUE }).map((_, k) => (
            <rect key={k} className={`pre qb qb-${k}`} x={L + 250 + k * 62} y={636} width={52} height={40} rx={6} fill={tenantColour(k)} />
          ))}
          <text className="pre q-label" x={L + 250} y={712} fontFamily={F.mono} fontSize={15} fill={C.muted}>onboardings waiting on the few who know the configuration</text>
        </g>

        <g className="r-valid" data-target="validator">
          <g className="pre valid">
            <path className="val-link" d={`M${CARD.x + CARD.w / 2} ${CARD.y + CARD.h + 2} L${CARD.x + CARD.w / 2} ${VAL_Y - 2}`} stroke={C.invariantEdge} strokeWidth={2} />
            <rect className="val-rect" x={CARD.x} y={VAL_Y} width={CARD.w} height={46} rx={23} fill={C.canvasRaised} stroke={C.invariantEdge} strokeWidth={2} />
            <text x={CARD.x + CARD.w / 2} y={VAL_Y + 29} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.invariantEdge}>validator · the domain's rules</text>
            <text className="pre val-tick" x={CARD.x + CARD.w - 30} y={VAL_Y + 31} textAnchor="middle" fontFamily={F.sans} fontWeight={700} fontSize={24} fill={C.tenant[5]}>✓</text>
          </g>
        </g>

        <g className="r-migr">
          <g className="pre tag">
            <rect x={stepC(MIG) - 165} y={STEP_Y - 50} width={330} height={36} rx={18} fill={C.warnSoft} stroke={C.warn} strokeWidth={1.5} />
            <text x={stepC(MIG)} y={STEP_Y - 26} textAnchor="middle" fontFamily={F.mono} fontSize={14} fill={C.warn}>demonstrated: migration, test data</text>
          </g>
          {Array.from({ length: RECS }).map((_, k) => (
            <rect key={k} className={`pre rec rec-${k}`} x={CARD.x + CARD.w / 2 - 7} y={VAL_Y + 52} width={14} height={18} rx={2}
              fill={REJECT.includes(k) ? C.warn : C.tenant[3]} />
          ))}
          <g className="pre file" data-target="records.rejected">
            <path d={docPath(FILE.x, FILE.y)} fill={C.canvasRaised} stroke={C.warn} strokeWidth={2} />
            <text x={FILE.x + 37} y={FILE.y + 58} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.warn}>✕ 2</text>
            <text x={FILE.x + 37} y={FILE.y + 114} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>rejected records</text>
            <text x={FILE.x + 37} y={FILE.y + 134} textAnchor="middle" fontFamily={F.sans} fontSize={15} fill={C.muted}>back to the customer</text>
          </g>
        </g>

        <g className="r-product">
          <path className="compile" d={`M${CARD.x + CARD.w / 2} ${VAL_Y + 48} L${CARD.x + CARD.w / 2} ${PROD_Y - 6}`} stroke={C.sharedEdge} strokeWidth={2.5} />
          <text className="pre compile-label" x={CARD.x + CARD.w / 2 + 16} y={(VAL_Y + PROD_Y) / 2 + 14} fontFamily={F.mono} fontSize={15} fill={C.sharedText}>compiles to product inputs</text>
          <g className="pre product" data-target="product.untouched">
            <rect x={L} y={PROD_Y} width={R - L} height={60} rx={10} fill={C.shared} />
            <text x={L + 20} y={PROD_Y + 38} fontFamily={F.sans} fontWeight={600} fontSize={20} fill={C.sharedText}>The product · untouched · accepts the compiled inputs</text>
          </g>
        </g>

        <g className="r-growth">
          {Array.from({ length: MINI }).map((_, i) => {
            const p = miniPos(i);
            return (
              <g key={i} className={`pre mini mini-${i}`} data-target={`card.tenant.${i}`}>
                <rect x={p.x} y={p.y} width={MW} height={MH} rx={8} fill="#0a1a1a" stroke={tenantColour(i)} strokeWidth={2} />
                <rect x={p.x} y={p.y} width={MW} height={20} rx={8} fill={tenantColour(i)} />
                <text x={p.x + 10} y={p.y + 15} fontFamily={F.mono} fontSize={12} fill={C.tenantText}>Tenant {String.fromCharCode(65 + i)}</text>
                <rect x={p.x + 10} y={p.y + 32} width={70} height={7} rx={3} fill={C.hairline} />
                <rect x={p.x + 10} y={p.y + 48} width={50} height={7} rx={3} fill={C.hairline} />
              </g>
            );
          })}
        </g>
      </Svg>

      <div className="r-card">
        <DocCard className="pre card" lineKey="lc" x={CARD.x} y={CARD.y} w={CARD.w} head="Tenant C · onboarding document" colour={C.tenant[2]} lines={LINES} target="card.language" />
      </div>

      <Heading x={470} y={120} size={40}>Onboarding, after the line moves</Heading>
      <Counter className="pre counter" x={1380} y={128} start={N0} />
      <Callout className="pre c-today" x={1340} y={400} w={500} kind="Today" text="An artefact for every step, and a queue for the few who know them." tone={C.muted}
        anchor={{ x: stepC(4) + 37, y: 400 }} target="lens.onboarding-future.today" />
      <Callout className="pre c-morph" x={1340} y={380} w={500} kind="Architecture" text="One description of the domain, shared by every step." tone={C.invariantEdge}
        anchor={{ x: CARD.x + CARD.w, y: CARD.y + 60 }} target="lens.onboarding-future.customer" />
      <Callout className="pre c-write" x={1340} y={380} w={500} kind="Customer" text="Requirements in the domain's vocabulary, written by the agent as a document." tone={C.tenant[3]}
        anchor={{ x: CARD.x + CARD.w, y: CARD.y + 60 }} target="lens.onboarding-future.requirements" />
      <Callout className="pre c-check" x={1340} y={520} w={500} kind="Architecture" text="Checked against the domain's rules before anything is applied." tone={C.invariantEdge}
        anchor={{ x: CARD.x + CARD.w, y: VAL_Y + 23 }} target="lens.onboarding-future.architecture" />
      <Callout className="pre c-share" x={1340} y={330} w={500} kind="Customer" text="Customising and training draw on the same definitions." tone={C.tenant[3]}
        anchor={{ x: R - 6, y: STEP_Y + 28 }} target="lens.onboarding-future.share" />
      <Callout className="pre c-migr" x={1340} y={520} w={500} kind="Customer" text="Each failure cites the record and the rule that rejected it." tone={C.warn}
        anchor={{ x: FILE.x + 74, y: FILE.y + 40 }} target="lens.onboarding-future.migrate" />
      <Callout className="pre c-product" x={1340} y={700} w={500} kind="Architecture" text="The document compiles to inputs the product already accepts." tone={C.sharedEdge}
        anchor={{ x: R, y: PROD_Y + 30 }} target="lens.onboarding-future.product" />
      <Callout className="pre c-provider" x={1340} y={330} w={500} kind="Provider" text="The specialists' knowledge is in the grammar. Review moves toward judging outputs." tone={C.warn}
        anchor={{ x: R - 10, y: 400 }} target="lens.onboarding-future.provider" />
      <Callout className="pre c-qualify" x={1340} y={150} w={500} kind="So far" text="Only the migration step has been demonstrated, on test data." tone={C.warn}
        anchor={{ x: stepC(MIG) + 165, y: STEP_Y - 32 }} target="drill.onboarding" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const steps = (ids: number[]) => ids.map((i) => `.r-step-${i}`);
    const today = cue('today', 0), morph = cue('morph', 's1'), write = cue('write', 's2'), check = cue('check', 's3');
    const share = cue('share', 's4'), migrate = cue('migrate', 's5'), product = cue('product', 's6');
    const provider = cue('provider', 's7'), qualify = cue('qualify', 's8');
    focusBeats(ctx, [
      { id: 'today', at: today, regions: steps([0, 1, 2, 3, 4]), callout: '.c-today' },
      { id: 'morph', at: morph, regions: [...steps([0, 1, 2, 3, 4]), '.r-card'], callout: '.c-morph' },
      { id: 'write', at: write, regions: [...steps([0]), '.r-card'], callout: '.c-write' },
      { id: 'check', at: check, regions: ['.r-card', '.r-valid'], callout: '.c-check' },
      { id: 'share', at: share, regions: [...steps([2, 4]), '.r-card'], callout: '.c-share' },
      { id: 'migrate', at: migrate, regions: [...steps([MIG]), '.r-card', '.r-valid', '.r-migr'], callout: '.c-migr' },
      { id: 'product', at: product, regions: ['.r-card', '.r-valid', '.r-product'], callout: '.c-product' },
      { id: 'provider', at: provider, regions: ['.r-growth', '.r-valid'], callout: '.c-provider' },
      { id: 'qualify', at: qualify, regions: [...steps([MIG]), '.r-migr'], callout: '.c-qualify' },
    ]);

    // Today: the connectors are not drawn yet; the queue of onboardings lengthens.
    tl.set(q('.conn'), { drawSVG: '0%' }, 0);
    for (let k = 0; k < QUEUE; k++) appear(ctx, `.qb-${k}`, 0.8 + k * 0.42, { y: 0, duration: 0.3 });
    appear(ctx, '.q-label', 1.2);

    // Morph: the five artefacts fold into one document; every step connects to it.
    vanish(ctx, '.queue', morph - 0.2);
    tl.to(q('.art-text'), { autoAlpha: 0, duration: 0.4 }, morph);
    ARTS.forEach((_, i) => {
      tl.to(q(`.art-shape-${i}`), { morphSVG: rectPath(CARD.x, CARD.y, CARD.w, CARD.h, 10), attr: { fill: '#0a1a1a', stroke: C.tenant[2] }, duration: 1.5, ease: 'power2.inOut' }, morph + 0.2 + i * 0.08);
    });
    const folded = morph + 2;
    appear(ctx, '.card', folded, { y: 0, duration: 0.4 });
    tl.to(q('.art'), { autoAlpha: 0, duration: 0.3 }, folded + 0.3);
    tl.set(q('.lc-line'), { autoAlpha: 0 }, 0);
    ARTS.forEach((_, i) => tl.to(q(`.conn-${i}`), { drawSVG: '100%', duration: 0.6 }, folded + 0.3 + i * 0.12));

    // Write: the agent writes requirements into the document, line by line.
    LINES.forEach((_, i) => tl.to(q(`.lc-line-${i}`), { autoAlpha: 1, duration: 0.3 }, write + 0.4 + i * 0.9));

    // Check: the validator sits between the document and anything applied.
    appear(ctx, '.valid', check, { y: 0 });
    tl.fromTo(q('.val-link'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, check + 0.2);
    tl.to(q('.val-rect'), { attr: { 'stroke-width': 5 }, duration: 0.3 }, check + 1.2).to(q('.val-rect'), { attr: { 'stroke-width': 2 }, duration: 0.5 }, check + 1.5);
    appear(ctx, '.val-tick', check + 1.4, { y: 0 });

    // Migrate: records pass through to the product; rejected ones drop out to a file.
    appear(ctx, '.tag', migrate, { y: 0 });
    appear(ctx, '.product', migrate + 0.2, { y: 0 });
    appear(ctx, '.file', migrate + 0.4, { y: 0 });
    for (let k = 0; k < RECS; k++) {
      const at = migrate + 0.8 + k * 0.6, off = (k % 3 - 1) * 26;
      tl.set(q(`.rec-${k}`), { autoAlpha: 1, attr: { x: CARD.x + CARD.w / 2 - 7 + off, y: VAL_Y + 52 } }, at);
      if (REJECT.includes(k)) tl.to(q(`.rec-${k}`), { attr: { x: FILE.x + 30, y: FILE.y + 36 }, duration: 1, ease: 'power1.inOut' }, at);
      else tl.to(q(`.rec-${k}`), { attr: { y: PROD_Y - 4 }, duration: 0.9, ease: 'power1.in' }, at);
      tl.to(q(`.rec-${k}`), { autoAlpha: 0, duration: 0.2 }, at + 0.95);
    }

    tl.fromTo(q('.compile'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8 }, product + 0.3);
    appear(ctx, '.compile-label', product + 0.8);
    vanish(ctx, '.compile-label', provider);

    // Provider: each new tenant adds one document, checked the same way as the last.
    vanish(ctx, '.card', provider - 0.1, { duration: 0.35 });
    vanish(ctx, '.val-tick', provider);
    for (let i = 0; i < N0; i++) appear(ctx, `.mini-${i}`, provider + 0.2 + i * 0.08, { y: 0, duration: 0.35 });
    const grow = provider + 1.2, span = Math.max(3, qualify - grow - 0.6);
    appear(ctx, '.counter', grow - 0.4);
    tl.to(q('.counter .counter-value'), { innerText: MINI, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);
    for (let i = N0; i < MINI; i++) {
      const at = grow + ((i - N0 + 0.5) / (MINI - N0)) * span;
      appear(ctx, `.mini-${i}`, at, { y: 0, duration: 0.3 });
      tl.to(q('.val-rect'), { attr: { 'stroke-width': 5 }, duration: 0.12 }, at + 0.15).to(q('.val-rect'), { attr: { 'stroke-width': 2 }, duration: 0.25 }, at + 0.27);
    }
    vanish(ctx, '.counter', qualify);
  },
};
