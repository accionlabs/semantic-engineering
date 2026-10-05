import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, Frame, Heading, LanguageCard, Svg } from '../parts/ui';
import { C, F, tenantColour, tenantName } from '../theme';
import { rectPath } from './s19-onboarding-future';

// Scene 21. Business rules after the line moves: the special cases in shared code become each
// tenant's own rules, written over the invariants. The shared code stays as it is.
const rail = makeRail('rail', { lit: 4, lineAt: 4, label: 'business rules', glow: true });
const L = 520, R = 1320, INV_Y = 640, API_Y = 704, CODE_Y = 768, CODE_H = 132;
const TOKENS = ['Employee', 'Pay element', 'Statutory deduction', 'Calculation'];
const SNIPS = [
  ['rule overtime', '  hours > 40', '  pay × 1.5'],
  ['rule leave', '  1.75 days/mo', '  cap 30 days'],
  ['rule bonus', '  above 5000', '  finance signs'],
  ['rule night shift', '  premium × 1.2', '  from 22:00'],
];
const COLS = 5, CW = (R - L) / COLS, CARD_W = CW - 12, CARD_H = 104, MAX = 14, N0 = 6;
const cardPos = (i: number) => ({ x: L + (i % COLS) * CW + 6, y: 205 + Math.floor(i / COLS) * 128 });
const tokX = (j: number) => L + ((R - L) / TOKENS.length) * j + 8, TOK_W = (R - L) / TOKENS.length - 16;
// Today: tenant lanes wired to special cases in the shared code.
const laneX = (i: number) => L + ((R - L) / N0) * (i + 0.5);
const condPos = (k: number) => ({ x: L + 12 + (k % 4) * 198, y: CODE_Y + 36 + Math.floor(k / 4) * 46 });
const wire = (k: number, i: number) => {
  const { x, y } = condPos(k), lx = laneX(i);
  return `M${x + 85} ${y} C ${x + 85} ${y - 70} ${lx} ${CODE_Y - 80} ${lx} ${CODE_Y - 12}`;
};
const CONDS = 6, WHO = ['C', 'E', 'A', 'F', 'B', 'D'];
const CAND = { x: cardPos(14).x, y: cardPos(14).y + 4, w: CARD_W, h: 50 };

export const scene21: SceneDef = {
  n: 21,
  id: 'rules-future',
  View: () => (
    <Frame act="Act 5 · optional" scene="Scene 21 · Business rules and invariants">
      <Svg>
        <rail.View />
        <g className="today">
          {Array.from({ length: N0 }).map((_, i) => (
            <g key={i} className="lane">
              <rect x={laneX(i) - 20} y={205} width={40} height={22} rx={11} fill={tenantColour(i)} />
              <line x1={laneX(i)} x2={laneX(i)} y1={227} y2={CODE_Y - 10} stroke={tenantColour(i)} strokeWidth={2} opacity={0.5} />
            </g>
          ))}
          {Array.from({ length: CONDS }).map((_, k) => (
            <g key={k} className={`wires wires-${k}`} opacity={k < 3 ? 1 : 0}>
              {Array.from({ length: N0 }).map((_, i) => <path key={i} d={wire(k, i)} fill="none" stroke={C.warn} strokeWidth={1.2} opacity={0.4} />)}
            </g>
          ))}
        </g>
        <g className="r-code" data-target="code.shared">
          <rect className="code-bg" x={L - 20} y={CODE_Y} width={R - L + 40} height={CODE_H} rx={10} fill={C.shared} stroke={C.hairline} />
          <text className="code-label" x={L} y={CODE_Y + 24} fontFamily={F.mono} fontSize={14} fill={C.sharedText} letterSpacing={1.5}>SHARED CODE · EVERY TENANT RUNS THIS</text>
          <text className="pre code-note" x={L} y={CODE_Y + 72} fontFamily={F.sans} fontSize={20} fill={C.muted}>No tenant conditionals</text>
        </g>
        {/* The special cases: each morphs into its tenant's own rules document. */}
        {Array.from({ length: CONDS }).map((_, k) => {
          const { x, y } = condPos(k);
          return (
            <g key={k} className={`cond cond-${k}`} opacity={k < 3 ? 1 : 0} data-target="shard.special-case">
              <path className={`cond-shape cond-shape-${k}`} d={rectPath(x, y, 178, 38, 6)} fill={C.warnSoft} stroke={C.warn} strokeWidth={1.5} />
              <text className="cond-text" x={x + 12} y={y + 25} fontFamily={F.mono} fontSize={16} fill={C.warn}>if tenant == {WHO[k]}</text>
            </g>
          );
        })}

        <g className="r-inv" data-target="token.invariant">
          <g className="pre inv">
            {TOKENS.map((t, j) => (
              <g key={t} className={`tok tok-${j}`}>
                <rect className="tok-rect" x={tokX(j)} y={INV_Y} width={TOK_W} height={54} rx={10} fill={C.shared} stroke={C.invariantEdge} strokeWidth={2.5} />
                <text x={tokX(j) + TOK_W / 2} y={INV_Y + 34} textAnchor="middle" fontFamily={F.sans} fontWeight={500} fontSize={19} fill={C.text}>{t}</text>
              </g>
            ))}
            <text x={L - 30} y={INV_Y + 32} textAnchor="end" fontFamily={F.mono} fontSize={14} fill={C.invariantEdge}>invariants</text>
          </g>
          <path className="mt-line" d={`M${L - 30} ${INV_Y - 14} H${R + 30}`} stroke={C.line} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${C.line})` }} data-target="line.mt" />
        </g>

        <g className="r-api" data-target="api.existing">
          <g className="pre api">
            {TOKENS.map((t, j) => (
              <rect key={t} x={tokX(j)} y={API_Y} width={TOK_W} height={36} rx={8} fill={C.canvasRaised}
                stroke={j === 2 ? C.warn : C.sharedEdge} strokeWidth={2} strokeDasharray={j === 2 ? '6 5' : undefined} />
            ))}
            <text x={tokX(0) + 14} y={API_Y + 24} fontFamily={F.mono} fontSize={14} fill={C.sharedText}>existing APIs</text>
            <text x={tokX(2) + 14} y={API_Y + 24} fontFamily={F.mono} fontSize={14} fill={C.warn}>granularity?</text>
          </g>
        </g>

        <g className="r-judge" data-target="judgement.invariant">
          <g className="pre cand">
            <rect x={CAND.x} y={CAND.y} width={CAND.w} height={CAND.h} rx={10} fill="none" stroke={C.invariantEdge} strokeWidth={2} strokeDasharray="6 5" />
            <text x={CAND.x + CAND.w / 2} y={CAND.y + 31} textAnchor="middle" fontFamily={F.sans} fontSize={18} fill={C.invariantEdge}>Leave balance ?</text>
          </g>
        </g>
      </Svg>

      <div className="r-cards">
        {Array.from({ length: MAX }).map((_, i) => {
          const p = cardPos(i);
          return (
            <div key={i} className={`pre card card-${i}`}>
              <LanguageCard className={`lc${i}`} x={p.x} y={p.y} w={CARD_W} tenant={tenantName(i)} colour={tenantColour(i)}
                lines={SNIPS[i % SNIPS.length]} target={`card.tenant.${i}`} compact />
            </div>
          );
        })}
      </div>

      <Heading x={470} y={120} size={40}>Business rules, after the line moves</Heading>
      <Counter className="pre counter" x={1380} y={124} start={N0} />
      <Callout className="pre c-today" x={1380} y={700} w={480} kind="Today" text="Special cases in shared code, wired to every tenant." tone={C.warn}
        anchor={{ x: R + 20, y: CODE_Y + 30 }} target="lens.rules-future.today" />
      <Callout className="pre c-lang" x={1380} y={560} w={480} kind="Architecture" text="Rules in the domain's own terms, over the invariants." tone={C.invariantEdge}
        anchor={{ x: R, y: INV_Y + 27 }} target="lens.rules-future.architecture" />
      <Callout className="pre c-customer" x={1380} y={230} w={480} kind="Customer" text="A variation becomes our own rules, checked against the invariants." tone={C.tenant[3]}
        anchor={{ x: R - 6, y: 260 }} target="lens.rules-future.customer" />
      <Callout className="pre c-provider" x={1380} y={400} w={480} kind="Provider" text="Each new tenant adds a document. The shared code stays as it is." tone={C.warn}
        anchor={{ x: R - 6, y: 460 }} target="lens.rules-future.provider" />
      <Callout className="pre c-api" x={1380} y={660} w={480} kind="Existing APIs" text="They cover a large part of the domain. Some lack the granularity the language needs." tone={C.sharedEdge}
        anchor={{ x: R, y: API_Y + 18 }} target="lens.rules-future.apis" />
      <Callout className="pre c-judge" x={1380} y={430} w={480} kind="Judgement" text="Deciding what becomes an invariant is architectural judgement." tone={C.invariantEdge}
        anchor={{ x: CAND.x + CAND.w, y: CAND.y + 25 }} target="drill.rules" />
      <div className="pre note" style={{ position: 'absolute', left: 1380, top: 190, fontFamily: F.mono, fontSize: 13, color: C.muted, letterSpacing: 1 }}>RULE TEXT ILLUSTRATIVE</div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const today = cue('today', 0), lang = cue('language', 's1'), customer = cue('customer', 's2');
    const provider = cue('provider', 's2+4'), api = cue('apis', 's3'), judge = cue('judgement', 's4');
    focusBeats(ctx, [
      { id: 'today', at: today, regions: ['.r-code'], callout: '.c-today' },
      { id: 'language', at: lang, regions: ['.r-cards', '.r-inv'], callout: '.c-lang' },
      { id: 'customer', at: customer, regions: ['.r-cards', '.r-inv', '.r-code'], callout: '.c-customer' },
      { id: 'provider', at: provider, regions: ['.r-cards', '.r-code'], callout: '.c-provider' },
      { id: 'apis', at: api, regions: ['.r-inv', '.r-api'], callout: '.c-api' },
      { id: 'judgement', at: judge, regions: ['.r-inv', '.r-judge'], callout: '.c-judge' },
    ]);

    // Today: more special cases pile into the shared code, each wired to every tenant.
    for (let k = 3; k < CONDS; k++) {
      const at = today + 1 + (k - 3) * 1.1;
      tl.fromTo(q(`.cond-${k}`), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.5 }, at);
      tl.to(q(`.wires-${k}`), { opacity: 1, duration: 0.5 }, at + 0.3);
    }

    // Language: the line is drawn with the invariants on it; each special case becomes its tenant's document.
    tl.set(q('.mt-line'), { drawSVG: '0%' }, 0);
    tl.to(q('.today'), { autoAlpha: 0, duration: 0.6 }, lang);
    tl.to(q('.cond-text'), { autoAlpha: 0, duration: 0.3 }, lang);
    tl.to(q('.mt-line'), { drawSVG: '100%', duration: 0.9 }, lang + 0.3);
    appear(ctx, '.inv', lang + 0.6, { y: 0 });
    for (let k = 0; k < CONDS; k++) {
      const p = cardPos(k);
      tl.to(q(`.cond-shape-${k}`), { morphSVG: rectPath(p.x, p.y, CARD_W, CARD_H, 10), attr: { fill: '#0a1a1a', stroke: tenantColour(k) }, duration: 1.4, ease: 'power2.inOut' }, lang + 0.8 + k * 0.12);
      appear(ctx, `.card-${k}`, lang + 2.2 + k * 0.12, { y: 0, duration: 0.4 });
    }
    tl.to(q('.cond'), { autoAlpha: 0, duration: 0.3 }, lang + 3.2);
    appear(ctx, '.note', lang + 2.6, { y: 0 });
    // The shared code goes quiet: unlit, and without tenant conditionals.
    tl.to(q('.code-bg'), { attr: { fill: '#1a2438' }, duration: 0.8 }, lang + 1);
    tl.to(q('.code-label'), { text: 'SHARED CODE · UNCHANGED', attr: { fill: C.muted }, duration: 0.6, ease: 'none' }, lang + 1.2);
    appear(ctx, '.code-note', lang + 1.8, { y: 0 });

    // Customer: a card's rules are checked against the invariants.
    TOKENS.forEach((_, j) => tl.to(q(`.tok-${j} .tok-rect`), { attr: { 'stroke-width': 5 }, duration: 0.25 }, customer + 1 + j * 0.2).to(q(`.tok-${j} .tok-rect`), { attr: { 'stroke-width': 2.5 }, duration: 0.4 }, customer + 1.25 + j * 0.2));

    // Provider: new tenants each add a card above the line; the shared code band stays clean.
    const grow = provider + 0.4, span = Math.max(3, api - grow - 0.3);
    appear(ctx, '.counter', grow - 0.3);
    tl.to(q('.counter .counter-value'), { innerText: MAX, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);
    for (let i = N0; i < MAX; i++) tl.fromTo(q(`.card-${i}`), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, grow + ((i - N0) / (MAX - N0)) * span);
    vanish(ctx, '.counter', api);

    // APIs, then the open question of what becomes an invariant.
    appear(ctx, '.api', api + 0.2, { y: 0 });
    appear(ctx, '.cand', judge + 0.1, { y: 0 });
    tl.to(q('.cand'), { y: 40, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: 1 }, judge + 0.8);
  },
};
