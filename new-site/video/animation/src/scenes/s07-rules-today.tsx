import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { makeRail } from '../parts/Stack';
import { Callout, Counter, Frame, Heading, Svg } from '../parts/ui';
import { C, F, tenantColour } from '../theme';

// Scene 7. Business rules today, in three beats: customer, architecture, provider.
const rail = makeRail('rail', { lit: 4, label: 'business rules' });
const L = 470, R = 1260, TOP = 250, NODE_Y = 470, CODE_Y = 700, MAX = 14, N0 = 6;
const NODES = ['approval', 'pay rule', 'accrual', 'routing'];
const laneX = (i: number, n: number) => (i < n ? L + ((R - L) / n) * (i + 0.5) : R);
const nodeX = (j: number) => L + ((R - L) / NODES.length) * (j + 0.5);
const condPos = (k: number) => ({ x: L + 10 + (k % 4) * 200, y: CODE_Y + 22 + Math.floor(k / 4) * 58 });
const wire = (k: number, i: number, n: number) => {
  const { x, y } = condPos(k), lx = laneX(i, n);
  return `M${x + 85} ${y} C ${x + 85} ${y - 60} ${lx} ${CODE_Y - 70} ${lx} ${CODE_Y - 12}`;
};
const CONDS = 7, MISFIT = 2, DEFECT = 4;

export const scene07: SceneDef = {
  n: 7,
  id: 'rules-today',
  View: () => (
    <Frame act="Act 2" scene="Scene 7 · Business rules today">
      <Svg>
        <rail.View />
        <g className="r-lanes">
          {Array.from({ length: MAX }).map((_, i) => (
            <g key={i} className={`lane lane-${i}`} opacity={i < N0 ? 1 : 0} data-target={`tenant.${i}`}>
              <rect className="lane-pill" x={laneX(i, N0) - 20} y={TOP} width={40} height={22} rx={11} fill={tenantColour(i)} />
              <line className="lane-line" x1={laneX(i, N0)} x2={laneX(i, N0)} y1={TOP + 22} y2={CODE_Y - 10} stroke={tenantColour(i)} strokeWidth={2} opacity={0.5} />
            </g>
          ))}
          <text className="pre defect-label" x={laneX(DEFECT, MAX)} y={TOP - 14} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.warn}>defect</text>
        </g>
        <g className="r-nodes">
          <text x={L} y={NODE_Y - 52} fontFamily={F.mono} fontSize={14} fill={C.muted} letterSpacing={1.5}>CONFIGURABLE WORKFLOWS</text>
          {NODES.map((name, j) => (
            <g key={name} className={`node node-${j}`} data-target="workflow.node">
              <rect x={nodeX(j) - 84} y={NODE_Y - 30} width={168} height={60} rx={12} fill="#123a36" stroke={C.tenant[1]} strokeWidth={2} />
              <text x={nodeX(j)} y={NODE_Y + 7} textAnchor="middle" fontFamily={F.sans} fontWeight={500} fontSize={20} fill={C.tenantText}>{name}</text>
            </g>
          ))}
          {Array.from({ length: N0 }).map((_, i) => i !== MISFIT && (
            <circle key={i} className={`pre fit fit-${i}`} cx={laneX(i, N0)} cy={TOP + 30} r={9} fill={tenantColour(i)} stroke={C.text} strokeWidth={1.5} />
          ))}
        </g>
        <g className="r-code">
          <rect x={L - 20} y={CODE_Y} width={R - L + 40} height={180} rx={10} fill={C.shared} data-target="code.shared" />
          <text x={L} y={CODE_Y + 166} fontFamily={F.mono} fontSize={14} fill={C.sharedText} letterSpacing={1.5}>SHARED CODE · EVERY TENANT RUNS THIS</text>
          {Array.from({ length: CONDS }).map((_, k) => {
            const { x, y } = condPos(k), who = String.fromCharCode(65 + ((k * 3 + 2) % 14));
            return (
              <g key={k} className={`pre cond cond-${k}`} data-target="shard.special-case">
                {Array.from({ length: MAX }).map((_, i) => (
                  <path key={i} className={`wire wire-${k}-${i}`} d={wire(k, i, N0)} fill="none" stroke={C.warn} strokeWidth={1.2} opacity={i < N0 ? 0.4 : 0} />
                ))}
                <rect x={x} y={y} width={178} height={42} rx={6} fill={C.warnSoft} stroke={C.warn} strokeWidth={1.5} />
                <text x={x + 12} y={y + 27} fontFamily={F.mono} fontSize={16} fill={C.warn}>if tenant == {k === 0 ? 'C' : who}</text>
              </g>
            );
          })}
        </g>
        <circle className="pre misfit" cx={laneX(MISFIT, N0)} cy={TOP + 40} r={12} fill={C.warn} stroke={C.text} strokeWidth={1.5} data-target="request.misfit" />
      </Svg>
      <Heading x={470} y={120} size={44}>Business rules today</Heading>
      <Counter className="pre counter" x={1000} y={128} start={N0} />
      <Callout className="pre c-customer" x={1340} y={380} w={500} kind="Customer" text="Most requests fit a workflow. One that does not has no middle option." tone={C.tenant[3]}
        anchor={{ x: nodeX(3) + 84, y: NODE_Y }} target="lens.rules.customer" />
      <div className="pre fig-flow" data-target="fig.salesforce-flow" style={{ position: 'absolute', left: 1340, top: 530, width: 500, fontFamily: F.mono, fontSize: 14.5, lineHeight: 1.5, color: C.muted }}>
        “Most common automation scenarios can be built in flows.” Salesforce Trailhead, Flow Basics
      </div>
      <Callout className="pre c-arch" x={1340} y={700} w={500} kind="Architecture" text="The special case lands in shared code, wired to every tenant." tone={C.sharedEdge}
        anchor={{ x: R + 20, y: CODE_Y + 60 }} target="lens.rules.architecture" />
      <Callout className="pre c-provider" x={1340} y={210} w={500} kind="Provider" text="Every new tenant adds more. One change becomes another tenant's defect." tone={C.warn}
        anchor={{ x: laneX(DEFECT, MAX), y: TOP + 11 }} target="lens.rules.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    rail.setup(ctx);
    const customer = cue('customer', 's0'), architecture = cue('architecture', 's2'), provider = cue('provider', 's4');
    focusBeats(ctx, [
      { id: 'customer', at: customer, regions: ['.r-lanes', '.r-nodes'], callout: '.c-customer' },
      { id: 'architecture', at: architecture, regions: ['.r-code'], callout: '.c-arch' },
      { id: 'provider', at: provider, regions: ['.r-lanes', '.r-code'], callout: '.c-provider' },
    ]);
    appear(ctx, '.fig-flow', cue('flows', 's1+1.5'));
    tl.to(q('.fig-flow'), { autoAlpha: 0, duration: 0.3 }, architecture - 0.2);

    // Requests that fit a workflow flow down their own lane and stop at the workflows.
    Array.from({ length: N0 }).forEach((_, i) => {
      if (i === MISFIT) return;
      const at = cue('flows', 's1') + i * 0.35;
      tl.set(q(`.fit-${i}`), { autoAlpha: 1 }, at);
      tl.fromTo(q(`.fit-${i}`), { attr: { cy: TOP + 30 } }, { attr: { cy: NODE_Y - 42 }, duration: 1.2, ease: 'power1.in' }, at);
      tl.to(q(`.fit-${i}`), { autoAlpha: 0, duration: 0.3 }, at + 1.2);
    });
    // The one that fits nothing stops above the workflows, then drops into shared code.
    const misfitAt = cue('misfit', 's2+0.2');
    tl.set(q('.misfit'), { autoAlpha: 1 }, misfitAt);
    tl.fromTo(q('.misfit'), { attr: { cy: TOP + 40 } }, { attr: { cy: NODE_Y - 70 }, duration: 1, ease: 'power1.out' }, misfitAt);
    const land = cue('lands', 's3');
    tl.to(q('.misfit'), { attr: { cy: CODE_Y + 40 }, duration: 1.1, ease: 'power2.in' }, land);
    tl.to(q('.misfit'), { autoAlpha: 0, duration: 0.2 }, land + 1.1);
    appear(ctx, '.cond-0', land + 1.05, { y: 0 });

    // Provider beat: tenants are added, conditionals pile up and wire into every lane.
    const grow = provider + 0.4, span = Math.max(3, ctx.duration - grow - 3);
    appear(ctx, '.counter', grow - 0.3);
    tl.to(q('.counter .counter-value'), { innerText: MAX, snap: { innerText: 1 }, duration: span, ease: 'none' }, grow);
    for (let i = 0; i < MAX; i++) {
      tl.to(q(`.lane-${i}`), { opacity: 1, duration: span }, grow);
      tl.to(q(`.lane-${i} .lane-pill`), { attr: { x: laneX(i, MAX) - 20 }, duration: span, ease: 'none' }, grow);
      tl.to(q(`.lane-${i} .lane-line`), { attr: { x1: laneX(i, MAX), x2: laneX(i, MAX) }, duration: span, ease: 'none' }, grow);
      for (let k = 0; k < CONDS; k++) tl.to(q(`.wire-${k}-${i}`), { attr: { d: wire(k, i, MAX) }, opacity: 0.4, duration: span, ease: 'none' }, grow);
    }
    for (let k = 1; k < CONDS; k++) appear(ctx, `.cond-${k}`, grow + (k / CONDS) * span, { y: 0, duration: 0.4 });
    const hit = grow + span * 0.8;
    appear(ctx, '.defect-label', hit);
    q(`.lane-${DEFECT} .lane-line`).forEach((el) => {
      for (let t = hit; t < ctx.duration; t += 0.8) tl.to(el, { attr: { stroke: C.warn, 'stroke-width': 5 }, opacity: 1, duration: 0.4 }, t).to(el, { opacity: 0.55, duration: 0.4 }, t + 0.4);
    });
  },
};
