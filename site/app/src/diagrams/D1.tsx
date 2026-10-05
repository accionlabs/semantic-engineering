import React from 'react';
import { Figure, type Build } from './kit';
import { StackView, stackGeometry, W } from './stack';

const BANDS = [
  { lines: ['Onboarding and', 'configuration values'] },
  { lines: ['User experience'] },
  { lines: ['Business rules and APIs'] },
  { lines: ['Data model'] },
  { lines: ['Database'] },
  { lines: ['Infrastructure and deployment'] },
];
const ABOVE = 1;
const g = stackGeometry(BANDS.length, ABOVE);

// The stack builds from the bottom, then the multi-tenancy line draws high,
// leaving only onboarding in the tenant colour.
const build: Build = (tl, q) => {
  for (let i = BANDS.length - 1; i >= 0; i--) {
    tl.from(q(`.band-${i}`), { opacity: 0, y: 16, duration: 0.45 }, (BANDS.length - 1 - i) * 0.12);
  }
  tl.from(q('.head-below'), { opacity: 0, duration: 0.4 }, 0.3);
  tl.from(q('.mt-stroke'), { drawSVG: '0%', duration: 1.1, ease: 'power2.inOut' }, '+=0.2');
  tl.from(q('.mt-label'), { opacity: 0, duration: 0.4 }, '<0.5');
  tl.from(q('.band-0 .col'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.08, duration: 0.45 }, '>-0.1');
  tl.from(q('.band-0 .accent-tenant'), { opacity: 0, duration: 0.4 }, '<');
  tl.from(q('.marker'), { opacity: 0, y: 8, stagger: 0.08, duration: 0.35 }, '<0.1');
  tl.from(q('.head-above'), { opacity: 0, duration: 0.4 }, '<');
};

export const D1: React.FC = () => (
  <Figure
    viewBox={`0 0 ${W} ${g.bottom + 44}`}
    title="The conventional stack"
    desc="Six layers from onboarding and configuration values at the top down to infrastructure and deployment. The multi-tenancy line sits high, just under onboarding: only onboarding and configuration values are per customer, and user experience, business rules and APIs, data model, database, and infrastructure are shared across tenants."
    build={build}
  >
    <StackView bands={BANDS} above={ABOVE} headAbove="PER CUSTOMER" headBelow="SHARED ACROSS TENANTS" />
  </Figure>
);
