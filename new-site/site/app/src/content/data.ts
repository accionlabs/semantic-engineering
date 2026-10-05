// The site's content, as scripts/build-content.mjs writes it from content/**/*.md.
// Page metadata and navigation load with the app; each page's blocks load when the page is opened.
import site from './site.json';

export type Heading = { level: number; id: string; text: string };
export type Block =
  | { k: 'h'; level: number; id: string; text: string; html: string }
  | { k: 'p' | 'list' | 'table' | 'quote' | 'code' | 'html' | 'diagram' | 'faq'; sec: string; sub: string; n: number; html: string; text?: string; diagram?: string };
export type Faq = { question: string; html: string; text: string };
export type PageMeta = {
  key: string; url: string; file: string; isSection: boolean; title: string; linkTitle?: string; description: string;
  weight: number; date?: string; lastmod?: string; draft: boolean; audience: string[]; parent: string | null; headings: Heading[]; hasFaq: boolean;
};
export type PageData = { key: string; blocks: Block[]; faqs: Faq[] };
export type NavNode = { key: string; children: NavNode[] };

export const SITE = site as unknown as { pages: PageMeta[]; nav: NavNode[]; order: string[]; diagrams: { file: string; title: string; pages: string[] }[] };
export const PAGES = new Map(SITE.pages.map((p) => [p.key, p]));
export const pageByUrl = (pathname: string) => {
  const url = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return SITE.pages.find((p) => p.url === url);
};
export const navTitle = (p: PageMeta) => (p.key === 'home' ? 'Home' : p.linkTitle ?? p.title);
/** The pages above this one, home first. */
export const ancestors = (p: PageMeta) => {
  const out: PageMeta[] = [];
  for (let k = p.parent; k; k = PAGES.get(k)?.parent ?? null) { const a = PAGES.get(k); if (a) out.unshift(a); }
  return out;
};
/** The address of a block, for the reader, the graph and agents: "sdlc/methodology#aperture p3". */
export const blockAddress = (key: string, b: { sec: string; n: number }) => `${key}#${b.sec} p${b.n}`;

// ---------- page data, loaded on demand and cached ----------

const loaders = import.meta.glob<PageData>('./pages/*.json', { import: 'default' });
const cache = new Map<string, PageData>();
const fileOf = (key: string) => `./pages/${key.replace(/\//g, '__')}.json`;
export const cachedPage = (key: string) => cache.get(key);
export const loadPage = async (key: string) => {
  const hit = cache.get(key);
  if (hit) return hit;
  const load = loaders[fileOf(key)];
  if (!load) throw new Error(`no page ${key}`);
  const data = await load();
  cache.set(key, data);
  return data;
};
/** The server renderer fills the cache up front, so every page renders synchronously. */
export const primePages = (all: Record<string, PageData>) => Object.values(all).forEach((d) => cache.set(d.key, d));
