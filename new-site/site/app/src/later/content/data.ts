import paper from './paper.json';
import summariesRaw from './summaries.json';

export type Block = { type: 'html'; html: string } | { type: 'diagram'; id: string; source: string };
export type Section = { n: number; title: string; slug: string; subsections: { id: string; number: string; title: string }[]; blocks: Block[] };
export type Citation = { url: string; title: string; sections: string[] };
export const PAPER = paper as unknown as {
  title: string; subtitle: string; status: string; summary: { title: string; blocks: Block[] }; sections: Section[];
  appendixA: { title: string; blocks: Block[] } | null; glossary: { term: string; slug: string; html: string; sections: number[] }[]; citations: Citation[];
};
export const SUMMARIES = summariesRaw as Record<string, string>;

// Products the paper names get a link to their own site, at their first mention in the section that presents them.
// Added here so the paper itself carries citations only.
const PRODUCT_LINKS: { section: number; term: string; url: string }[] = [{ section: 13, term: 'On2Go', url: 'https://on2go.ai' }];
PRODUCT_LINKS.forEach(({ section, term, url }) => {
  const b = PAPER.sections.find((s) => s.n === section)?.blocks.find((x) => x.type === 'html' && x.html.includes(term)) as { html: string } | undefined;
  if (b) b.html = b.html.replace(new RegExp(`(^|[^\\w>/-])${term}(?![^<]*</a>)`), `$1<a href="${url}" target="_blank" rel="noopener">${term}</a>`);
});
export const sectionByN = (n: number) => PAPER.sections.find((s) => s.n === n);
export const sectionHref = (n: number, anchor?: string) => `/sections/${sectionByN(n)?.slug ?? n}${anchor ? '#' + anchor : ''}`;

/** Which scenes of the video each section embeds, and the scene its card thumbnail comes from. */
export const SECTION_SCENES: Record<number, { from: number; to: number; thumb: number }> = {
  1: { from: 1, to: 4, thumb: 1 }, 2: { from: 12, to: 12, thumb: 12 }, 3: { from: 4, to: 6, thumb: 4 }, 4: { from: 10, to: 10, thumb: 10 },
  5: { from: 15, to: 15, thumb: 15 }, 6: { from: 5, to: 5, thumb: 5 }, 7: { from: 6, to: 6, thumb: 6 }, 8: { from: 11, to: 11, thumb: 11 },
  9: { from: 12, to: 13, thumb: 13 }, 10: { from: 5, to: 5, thumb: 5 }, 11: { from: 13, to: 13, thumb: 13 }, 12: { from: 13, to: 13, thumb: 13 },
  13: { from: 18, to: 18, thumb: 18 }, 14: { from: 16, to: 16, thumb: 16 }, 15: { from: 21, to: 21, thumb: 21 }, 16: { from: 17, to: 17, thumb: 17 },
};
/** The main paper section for each scene, used by chapter markers and panels. */
export const SCENE_SECTION: Record<number, number> = { 1: 1, 2: 1, 3: 1, 4: 3, 5: 6, 6: 7, 7: 2, 8: 2, 9: 5, 10: 4, 11: 8, 12: 9, 13: 9, 14: 8, 15: 5, 16: 14, 17: 16, 18: 13, 19: 6, 20: 7, 21: 15, 22: 5, 23: 4, 30: 1 };

/** Layer by layer: each layer's scene today, then its scene after the line moves. Top of the stack first. */
export const LAYERS: { slug: string; name: string; short: string; before: number; after: number; shared?: boolean }[] = [
  { slug: 'onboarding', name: 'Onboarding and configuration', short: 'onboarding', before: 5, after: 19 },
  { slug: 'interface', name: 'Interface and APIs', short: 'the interface', before: 6, after: 20 },
  { slug: 'business-rules', name: 'Business rules', short: 'the business rules', before: 7, after: 21 },
  { slug: 'domain-invariants', name: 'Domain primitives, the invariants', short: 'the domain invariants', before: 8, after: 11, shared: true },
  { slug: 'deep-layers', name: 'Data model, database and infrastructure', short: 'the deep layers', before: 9, after: 22, shared: true },
  { slug: 'bill', name: 'The bill', short: 'the bill', before: 10, after: 23 },
];
export const layerBySlug = (slug: string) => LAYERS.find((l) => l.slug === slug);
