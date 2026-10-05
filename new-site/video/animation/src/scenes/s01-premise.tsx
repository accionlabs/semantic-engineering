import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats, vanish } from '../engine/scene';
import { makeStack } from '../parts/Stack';
import { Callout, FigureChip, Frame, Svg } from '../parts/ui';
import { C, F } from '../theme';

// Scene 1. The premise, the four rules that follow from it, and the stack they build,
// with the multi-tenancy line drawn high.
const SX = 620, SY = 250;
const stack = makeStack({ key: 'st', x: SX, y: SY, width: 1060, tenants: 6, lineAt: 6 });
const RULES = [
  { t: 'Write the code once', id: 'rule.write-once' },
  { t: 'Share every layer that can be shared', id: 'rule.share' },
  { t: 'Express customer difference as configuration', id: 'rule.configuration' },
  { t: 'Write custom code only where configuration runs out', id: 'rule.custom-code' },
];

export const scene01: SceneDef = {
  n: 1,
  id: 'premise',
  View: () => (
    <Frame act="Act 1" scene="Scene 1 · The premise and the line">
      <div className="pre premise" style={{ position: 'absolute', left: 160, top: 200, width: 1600, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 64, lineHeight: 1.1, letterSpacing: -0.5 }}>
        The premise: <span style={{ color: C.warn }}>writing the code is the expensive part</span>
      </div>
      {RULES.map((r, i) => (
        <div key={r.id} className={`r-rule-${i}`} style={{ position: 'absolute', left: 160 + i * 410, top: 380, width: 380, height: 190 }}>
          <div className={`pre rule rule-${i}`} data-target={r.id} style={{ position: 'absolute', inset: 0, background: C.canvasRaised, border: `1.5px solid ${C.sharedEdge}`, borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ fontFamily: F.mono, fontSize: 14, color: C.muted, letterSpacing: 1.5 }}>RULE {i + 1}</div>
            <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.2, marginTop: 10 }}>{r.t}</div>
          </div>
        </div>
      ))}
      <Svg>
        <stack.View />
      </Svg>
      <Callout className="pre c-below" x={64} y={560} w={480} kind="Below the line" text="Shared by every tenant" tone={C.sharedEdge}
        anchor={{ x: SX, y: stack.bandTop(2) + 35 }} target="callout.shared" />
      <Callout className="pre c-above" x={64} y={130} w={480} kind="Above the line" text="Only each customer's configuration values" tone={C.tenant[3]}
        anchor={{ x: SX, y: stack.bandTop(6) + 35 }} target="callout.config" />
      <FigureChip className="pre fig-ms" x={64} y={400} w={480} target="fig.microsoft-maturity" tag="SaaS maturity model"
        label="A single instance “with configurable metadata providing a unique user experience and feature set for each one”"
        source="Chong and Carraro, Microsoft, 2006" />
      <div className="pre fixed" data-target="line.mt" style={{ position: 'absolute', left: 64, top: 430, width: 480, fontFamily: F.display, fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: C.line }}>
        Flexibility fixed at design time
      </div>
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;

    // The premise, then it moves up to make room for the rules.
    appear(ctx, '.premise', cue('premise', 's0'));
    tl.to(q('.premise'), { top: 120, fontSize: 46, duration: 0.8 }, cue('rules', 's1'));

    // Each rule arrives as it is spoken; the one being spoken is the focus.
    const ruleAt = [cue('rule1', 's2'), cue('rule2', 's3'), cue('rule3', 's4'), cue('rule4', 's5')];
    ruleAt.forEach((at, i) => appear(ctx, `.rule-${i}`, at));
    focusBeats(ctx, ruleAt.map((at, i) => ({ id: `rule${i}`, at, regions: [`.r-rule-${i}`] })), 0.35);

    // The rules become the stack: cards leave, bands assemble from the bottom, the line is drawn.
    const build = cue('stack', 's6');
    vanish(ctx, '.premise', build);
    RULES.forEach((_, i) => vanish(ctx, `.rule-${i}`, build + i * 0.08));
    tl.set(q('.st-col-6'), { opacity: 0 }, 0);
    tl.set(q('.st-marker'), { opacity: 0 }, 0);
    for (let i = 0; i < 7; i++) {
      tl.fromTo(q(`.st-band-${i}`), { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, build + 0.4 + i * 0.35);
    }
    const draw = cue('line', 's6+3.4');
    tl.fromTo(q('.st-line line'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'power1.inOut' }, draw);
    tl.fromTo(q('.st-line text'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, draw + 1.2);

    // Below the line: every band there is shared.
    const below = cue('below', 's7');
    tl.to(q('.st-band-6'), { opacity: 0.25, duration: 0.5 }, below);
    appear(ctx, '.c-below', below + 0.2);
    vanish(ctx, '.c-below', cue('above', 's8') - 0.2);

    // Above the line: only each tenant's configuration values.
    const above = cue('above', 's8');
    tl.to(q('.st-band-6'), { opacity: 1, duration: 0.5 }, above);
    for (let i = 0; i < 6; i++) tl.to(q(`.st-band-${i}`), { opacity: 0.25, duration: 0.5 }, above);
    q('.st-marker').forEach((el, t) => tl.to(el, { opacity: 1, duration: 0.4 }, above + 0.3 + t * 0.15));
    q('.st-col-6').forEach((el, t) => tl.to(el, { opacity: 1, duration: 0.4 }, above + 0.3 + t * 0.15));
    appear(ctx, '.c-above', above + 0.2);
    appear(ctx, '.fig-ms', above + 1.2);

    // The line pushed high: flexibility is fixed at design time.
    const fixed = cue('fixed', 's9');
    vanish(ctx, '.c-above', fixed - 0.2);
    vanish(ctx, '.fig-ms', fixed - 0.2);
    for (let i = 0; i < 6; i++) tl.to(q(`.st-band-${i}`), { opacity: 1, duration: 0.5 }, fixed);
    tl.fromTo(q('.st-line line'), { attr: { 'stroke-width': 4 } }, { attr: { 'stroke-width': 7 }, duration: 0.5, yoyo: true, repeat: 1 }, fixed + 0.3);
    appear(ctx, '.fixed', cue('fixed-text', 's9+2'));
  },
};
