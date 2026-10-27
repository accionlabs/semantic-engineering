import { sceneInfo } from './film';

// Paths through the video: scenes played in order, one at a time, each with its own address.
export type Path = { slug: string; name: string; note: string; scenes: number[] };

/** Pick your role: /watch/role-<slug>. */
export const ROLES: Path[] = [
  { slug: 'cto', name: 'CTO and VP Engineering', note: 'Why AI coding alone does not raise delivery, how the method governs agents, and what teams have seen.', scenes: [3, 4, 5, 14, 17, 19, 20, 22, 29] },
  { slug: 'cio', name: 'CIO', note: 'The cost of passing knowledge by hand, visibility of people and agents, many products, and modernization results.', scenes: [3, 5, 18, 19, 20, 28, 29, 30] },
  { slug: 'architect', name: 'Architect', note: 'The four layers, what enters the graph, how it stays accurate, and how changes and modernizations are checked.', scenes: [6, 7, 8, 9, 14, 15, 16, 19, 20, 25, 26] },
  { slug: 'product-owner', name: 'Product owner', note: 'Who holds which knowledge, the spec sprint, and how a change is prepared and tracked.', scenes: [1, 2, 6, 11, 12, 13, 21] },
  { slug: 'tech-lead', name: 'Tech lead', note: 'Why agents make mistakes, impact analysis, how coding agents use the graph, and how each change is checked.', scenes: [4, 11, 14, 15, 16, 17, 20] },
  { slug: 'cfo', name: 'CFO and procurement', note: 'The cost of the tax, results, modernization modes and stages, and how an engagement runs.', scenes: [3, 22, 27, 28, 29, 30] },
];

/** Pick your situation: /watch/use-<slug>. */
export const SITUATIONS: Path[] = [
  { slug: 'new-application', name: 'A new application', note: 'The graph grows with the code from the first merge.', scenes: [6, 8, 11, 13, 14, 15, 16] },
  { slug: 'existing-application', name: 'An existing application', note: 'The graph is extracted from the code, then governs every change.', scenes: [4, 6, 14, 16, 19, 20, 22] },
  { slug: 'legacy-modernization', name: 'Legacy modernization', note: 'A graph of the old system, a graph of the new one, and a specification between them.', scenes: [24, 25, 26, 27, 28] },
];

/** Ask a question: the questions Act 3 answers, one scene each. */
export const QUESTIONS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export const roleBySlug = (s: string) => ROLES.find((r) => r.slug === s);
export const situationBySlug = (s: string) => SITUATIONS.find((r) => r.slug === s);
export const pathMinutes = (p: Path) => p.scenes.length;
export const sceneTitle = (n: number) => sceneInfo(n)?.title ?? '';
