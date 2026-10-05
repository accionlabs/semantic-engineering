// Colour roles for the video. Each role means one thing for the whole film (storyboard section 1.4).
export const C = {
  canvas: '#0d1220',
  canvasRaised: '#141b2d',
  hairline: '#26304a',
  text: '#eef1f7',
  muted: '#8f9ab1',
  people: '#e6e9f0',
  card: '#3a4560', // knowledge held by hand: documents and specifications as text
  cardText: '#c3cad8',
  tax: '#ff6a3d', // the Manual Translation Tax, and nothing else (Accion red, lifted for a dark canvas)
  pass: '#34d399',
  warn: '#f0a93b',
  // One hue per kind of knowledge, and per graph layer, in layer order.
  layer: { functional: '#5b9cf6', design: '#a77bf3', architecture: '#2cc5b4', code: '#9fb4d8' },
};

export const F = {
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  display: "'Bricolage Grotesque Variable', 'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Kind = keyof typeof C.layer;
/** The four kinds of knowledge, in layer order, with the custodian who holds each. */
export const KINDS: { id: Kind; label: string; custodian: string }[] = [
  { id: 'functional', label: 'Functional', custodian: 'Product Owner' },
  { id: 'design', label: 'Design', custodian: 'UX Designer' },
  { id: 'architecture', label: 'Architecture', custodian: 'Architect' },
  { id: 'code', label: 'Code', custodian: 'Engineering Team' },
];
