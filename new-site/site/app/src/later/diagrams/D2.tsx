import React from 'react';
import { Figure, type Build } from './kit';
import { StackView, stackGeometry, W } from './stack';

const BANDS = [
  { lines: ['Onboarding'] },
  { lines: ['User experience'] },
  { lines: ['Domain document: how this', "customer's rules compose the primitives"] },
  { lines: ['Language compiler or interpreter', "over the product's primitives"] },
  { lines: ['Data platform'] },
  { lines: ['Infrastructure and deployment'] },
];
const ABOVE = 3;
const g = stackGeometry(BANDS.length, ABOVE);
const STEP = g.H + g.GAP;

// Starts where d1 ended (line under onboarding), then the line slides down two bands.
// As it passes each band, the per-customer tint floods that band.
const build: Build = (tl, q) => {
  const slide = 1.8, start = 0.9;
  tl.from(q('.mt-line'), { y: -2 * STEP, duration: slide, ease: 'power2.inOut' }, start);
  tl.from(q('.band-1, .band-2'), { y: g.LINE_EXTRA, duration: slide, ease: 'power2.inOut' }, start);
  [1, 2].forEach((i, k) => {
    const at = start + slide * (k === 0 ? 0.45 : 0.9);
    tl.from(q(`.band-${i} .col`), { opacity: 0, scaleY: 0, transformOrigin: '50% 0%', stagger: 0.06, duration: 0.5 }, at);
    tl.from(q(`.band-${i} .accent-tenant`), { opacity: 0, duration: 0.4 }, at);
    // The shared base is hidden in the final state; it shows only until the tint arrives.
    tl.fromTo(q(`.band-${i} .shared-col, .band-${i} .accent-shared`), { opacity: 1 }, { opacity: 0, duration: 0.3 }, at + 0.45);
  });
  tl.from(q('.head-above'), { opacity: 0, duration: 0.5 }, '>-0.2');
};

export const D2: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${g.bottom + 44}`}
    title="The stack after the line moves"
    desc="The same stack with the multi-tenancy line moved down. Onboarding, user experience, and the domain document that says how this customer's rules compose the primitives are per customer, and per user where needed. The language compiler or interpreter over the product's primitives, the data platform, and infrastructure and deployment stay shared across tenants."
    build={build}
  >
    <StackView bands={BANDS} above={ABOVE} flood={[1, 2]} headAbove="PER CUSTOMER, AND PER USER WHERE NEEDED" headBelow="SHARED ACROSS TENANTS" />
  </Figure>
);
