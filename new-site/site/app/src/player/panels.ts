import { targetLoc, type Loc } from '../content/film';

export type PanelContent = { id: string; title: string; loc?: Loc; figure?: string; time: number };

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const humanise = (id: string) => clean(id.replace(/^[a-z]+\./, '').replace(/[.-]/g, ' ')).replace(/^\w/, (c) => c.toUpperCase());

/** A name for a clickable element: its own text when short, else its id made readable. */
export const labelFor = (id: string, el: Element) => {
  const text = clean((el as HTMLElement).innerText ?? el.textContent ?? '');
  if (/^fig\./.test(id) && text) return text.split(/\n/)[0].slice(0, 90);
  if (text && text.length <= 70) return text;
  if (text) return text.slice(0, 68) + '…';
  return humanise(id);
};

/** What a clicked element opens: its name, and the passage of the site it stands for. */
export const panelFor = (id: string, el: Element, scene: number, time: number): PanelContent => ({
  id, time, title: labelFor(id, el), loc: targetLoc(id, scene),
  figure: /^fig\./.test(id) ? clean((el as HTMLElement).innerText ?? '') : undefined,
});
