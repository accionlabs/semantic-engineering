// Colour roles for the video. Each role means one thing for the whole film.
export const C = {
  canvas: '#0d1220',
  canvasRaised: '#141b2d',
  hairline: '#26304a',
  shared: '#2f4a78',
  sharedEdge: '#44639a',
  sharedText: '#c9d6ee',
  tenant: ['#1f8a7a', '#2a9d8c', '#1b7a6d', '#35ad9b', '#177063', '#3fbba8'],
  tenantText: '#d8f3ee',
  line: '#ff5a6e',
  warn: '#f0a93b',
  warnSoft: '#5a3f17',
  invariantEdge: '#9fc2ff',
  text: '#eef1f7',
  muted: '#8f9ab1',
};

export const F = {
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  display: "'Bricolage Grotesque Variable', 'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// The seven bands, bottom to top, as the viewer meets them in Act 2.
export const BANDS = [
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'database', label: 'Database' },
  { id: 'data-model', label: 'Data model' },
  { id: 'primitives', label: 'Domain primitives' },
  { id: 'rules', label: 'Business rules' },
  { id: 'interface', label: 'Interface and APIs' },
  { id: 'onboarding', label: 'Onboarding and configuration' },
] as const;

export const tenantColour = (i: number) => C.tenant[i % C.tenant.length];
export const tenantName = (i: number) => `Tenant ${String.fromCharCode(65 + (i % 26))}`;
