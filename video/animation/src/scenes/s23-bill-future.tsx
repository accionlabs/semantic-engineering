import React from 'react';
import type { SceneDef } from '../engine/scene';
import { appear, focusBeats } from '../engine/scene';
import { Callout, Frame, Heading, Person, Pill, Svg } from '../parts/ui';
import { C, F } from '../theme';
import { rectPath } from './s19-onboarding-future';

// Scene 23. The bill after the line moves: the tier from scene 10 re-sorts into a bill of materials.
const TILES = 20, USED = [2, 7, 11, 16];
const SKUS = ['Pay calculation', 'Statutory deductions', 'Leave accrual', 'Approvals'];
const tileXY = (k: number) => ({ x: 190 + (k % 5) * 130, y: 290 + Math.floor(k / 5) * 115 });
const ROW = { x: 184, w: 592, h: 72 }, rowY = (u: number) => 282 + u * 86;
const ASM_Y = rowY(4) + 6;
const TIER = rectPath(160, 220, 700, 540, 16), BOM = rectPath(160, 220, 640, 510, 16);
const PACK = { x: 850, y: 282, w: 430, h: 140 };
const DOC = { x: 860, y: 500, w: 200, h: 130 };
const QUOTE = { x: 1110, y: 478 }, IMPL = { x: 1110, y: 598 };

export const scene23: SceneDef = {
  n: 23,
  id: 'bill-future',
  View: () => (
    <Frame act="Act 5 · optional" scene="Scene 23 · The bill, after the line moves">
      <Svg>
        <g className="r-tier" data-target="drill.bill">
          <path className="box" d={TIER} fill={C.canvasRaised} stroke={C.hairline} strokeWidth={1.5} />
          <text className="box-label" x={190} y={264} fontFamily={F.mono} fontSize={16} fill={C.muted} letterSpacing={1.5}>TIER · PRICED PER SEAT</text>
          {Array.from({ length: TILES }).map((_, k) => {
            const { x, y } = tileXY(k), u = USED.indexOf(k);
            return u < 0
              ? <rect key={k} className="grey" x={x} y={y} width={112} height={95} rx={10} fill={C.shared} />
              : <path key={k} className={`used used-${u}`} d={rectPath(x, y, 112, 95, 10)} fill={C.tenant[1]} data-target="bill.sku" />;
          })}
          {SKUS.map((s, u) => (
            <g key={s} className={`pre sku sku-${u}`}>
              <text x={ROW.x + 22} y={rowY(u) + 45} fontFamily={F.sans} fontWeight={600} fontSize={22} fill={C.tenantText}>{s}</text>
              <text className="sku-tag" x={ROW.x + ROW.w - 22} y={rowY(u) + 45} textAnchor="end" fontFamily={F.mono} fontSize={17} fill={C.tenantText}>capability</text>
            </g>
          ))}
        </g>
        <g className="r-seat">
          <g className="seat"><Person x={1040} y={330} r={34} colour={C.muted} /></g>
          <text className="seat-label" x={1040} y={440} textAnchor="middle" fontFamily={F.mono} fontSize={15} fill={C.muted}>the seat</text>
        </g>
        <g className="r-asm" data-target="bill.assembly">
          <g className="pre asm">
            <rect x={ROW.x} y={ASM_Y} width={ROW.w} height={ROW.h} rx={10} fill="none" stroke={C.tenant[3]} strokeWidth={2} strokeDasharray="8 6" />
            <text x={ROW.x + 22} y={ASM_Y + 45} fontFamily={F.sans} fontWeight={600} fontSize={22} fill={C.text}>Assembly for this customer</text>
            <text className="asm-tag" x={ROW.x + ROW.w - 22} y={ASM_Y + 45} textAnchor="end" fontFamily={F.mono} fontSize={17} fill={C.tenantText}>priced</text>
          </g>
        </g>
        <g className="r-pack" data-target="bill.package">
          <g className="pre pack">
            <rect x={PACK.x} y={PACK.y} width={PACK.w} height={PACK.h} rx={12} fill={C.canvasRaised} stroke={C.invariantEdge} strokeWidth={2} />
            <text x={PACK.x + 22} y={PACK.y + 34} fontFamily={F.mono} fontSize={14} fill={C.invariantEdge} letterSpacing={1.5}>PACKAGE</text>
            <text x={PACK.x + 22} y={PACK.y + 74} fontFamily={F.sans} fontWeight={600} fontSize={22} fill={C.text}>A common scenario</text>
            <text x={PACK.x + 22} y={PACK.y + 108} fontFamily={F.sans} fontSize={19} fill={C.muted}>priced on its value</text>
          </g>
        </g>
        <g className="r-drift" data-target="bill.drift">
          <g className="pre drift">
            <rect x={DOC.x} y={DOC.y} width={DOC.w} height={DOC.h} rx={12} fill="#0a1a1a" stroke={C.tenant[2]} strokeWidth={2} />
            <text x={DOC.x + DOC.w / 2} y={DOC.y + 60} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.tenantText}>domain</text>
            <text x={DOC.x + DOC.w / 2} y={DOC.y + 84} textAnchor="middle" fontFamily={F.mono} fontSize={17} fill={C.tenantText}>document</text>
            <path className="arrow-q" d={`M${DOC.x + DOC.w} ${DOC.y + 40} L${QUOTE.x - 6} ${QUOTE.y + 17}`} stroke={C.text} strokeWidth={2} />
            <path className="arrow-i" d={`M${DOC.x + DOC.w} ${DOC.y + 90} L${IMPL.x - 6} ${IMPL.y + 17}`} stroke={C.text} strokeWidth={2} />
            <Pill x={QUOTE.x} y={QUOTE.y} text="quote" colour={C.text} w={170} />
            <Pill x={IMPL.x} y={IMPL.y} text="implementation" colour={C.text} w={200} />
            <text x={QUOTE.x} y={QUOTE.y + 58} fontFamily={F.mono} fontSize={13} fill={C.muted}>priced from it</text>
            <text x={IMPL.x} y={IMPL.y + 58} fontFamily={F.mono} fontSize={13} fill={C.muted}>compiled and validated from it</text>
          </g>
        </g>
      </Svg>

      <Heading x={160} y={120} size={40}>The bill, after the line moves</Heading>
      <Callout className="pre c-today" x={1340} y={470} w={500} kind="Today" text="A tier bundles capabilities, whether this customer uses them or not." tone={C.muted}
        anchor={{ x: 860, y: 520 }} target="lens.bill.today" />
      <Callout className="pre c-bom" x={1340} y={240} w={500} kind="Bill of materials" text="The capabilities this implementation uses, and how they are put together." tone={C.tenant[3]}
        anchor={{ x: ROW.x + ROW.w, y: rowY(0) + 36 }} target="lens.bill.bom" />
      <Callout className="pre c-price" x={1340} y={640} w={500} kind="Price" text="A price for each capability used, plus the work of assembly." tone={C.invariantEdge}
        anchor={{ x: ROW.x + ROW.w, y: ASM_Y + 36 }} target="lens.bill.price" />
      <Callout className="pre c-pack" x={1340} y={300} w={500} kind="Packages" text="Common scenarios, priced on their value, beside the components." tone={C.invariantEdge}
        anchor={{ x: PACK.x + PACK.w, y: PACK.y + 60 }} target="lens.bill.package" />
      <Callout className="pre c-drift" x={1340} y={470} w={500} kind="One document" text="The quote and the implementation come from the same document, so they cannot drift apart." tone={C.tenant[3]}
        anchor={{ x: IMPL.x + 200, y: IMPL.y + 17 }} target="lens.bill.drift" />
      <Callout className="pre c-asm" x={1340} y={700} w={500} kind="Provider" text="Assembly becomes a visible, priced service." tone={C.warn}
        anchor={{ x: ROW.x + ROW.w, y: ASM_Y + 50 }} target="lens.bill.provider" />
    </Frame>
  ),
  build: (ctx) => {
    const { tl, q, cue } = ctx;
    const today = cue('today', 0), bom = cue('bom', 's1'), price = cue('price', 's2'), pack = cue('packages', 's3');
    const drift = cue('drift', 's4'), asm = cue('assembly', 's5');
    focusBeats(ctx, [
      { id: 'today', at: today, regions: ['.r-tier', '.r-seat'], callout: '.c-today' },
      { id: 'bom', at: bom, regions: ['.r-tier'], callout: '.c-bom' },
      { id: 'price', at: price, regions: ['.r-tier', '.r-asm'], callout: '.c-price' },
      { id: 'packages', at: pack, regions: ['.r-tier', '.r-asm', '.r-pack'], callout: '.c-pack' },
      { id: 'drift', at: drift, regions: ['.r-drift'], callout: '.c-drift' },
      { id: 'assembly', at: asm, regions: ['.r-asm'], callout: '.c-asm' },
    ]);

    // Today: most of the tier greys out, as in scene 10.
    tl.to(q('.grey'), { opacity: 0.25, duration: 1.2, stagger: 0.03 }, today + 0.6);

    // Bill of materials: the unused tiles drop away, the used ones re-sort into capability rows.
    tl.to(q('.seat, .seat-label'), { autoAlpha: 0, duration: 0.5 }, bom);
    tl.to(q('.grey'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.02 }, bom + 0.1);
    tl.to(q('.box'), { morphSVG: BOM, duration: 1.4 }, bom + 0.4);
    tl.to(q('.box-label'), { text: 'BILL OF MATERIALS · TENANT C', duration: 0.6, ease: 'none' }, bom + 0.6);
    USED.forEach((_, u) => tl.to(q(`.used-${u}`), { morphSVG: rectPath(ROW.x, rowY(u), ROW.w, ROW.h, 10), duration: 1.5, ease: 'power2.inOut' }, bom + 0.5 + u * 0.12));
    SKUS.forEach((_, u) => appear(ctx, `.sku-${u}`, bom + 2 + u * 0.15, { y: 0 }));

    // Price: each capability used carries a price, plus the work of assembly.
    appear(ctx, '.asm', price + 0.2, { y: 0 });
    SKUS.forEach((_, u) => tl.to(q(`.sku-${u} .sku-tag`), { text: 'priced', duration: 0.4, ease: 'none' }, price + 1.2 + u * 0.3));

    // Packages sit beside the components.
    appear(ctx, '.pack', pack + 0.2, { y: 0 });

    // One document: the quote and the implementation both come from it.
    appear(ctx, '.drift', drift + 0.1, { y: 0 });
    tl.fromTo(q('.arrow-q, .arrow-i'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.3 }, drift + 0.5);
  },
};
