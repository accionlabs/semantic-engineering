// Reads the site's Markdown (content/**/*.md, with front matter) and writes:
//   src/content/site.json         every page's metadata, the navigation tree and reading order, the diagrams
//   src/content/pages/<key>.json  each page's blocks, every block with a stable address
//   public/                       the repository's static/ files, plus search.json, llms.txt, robots.txt, sitemap.xml
// content/ stays the source of truth: editors change the Markdown and the next build picks it up.
// Addresses: a page key ("sdlc/methodology"), a section anchor (the ## heading's id, "" before the first
// heading) and a block number within that section: "sdlc/methodology#aperture p3".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import YAML from 'yaml';
import { markedSmartypants } from 'marked-smartypants';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, '..');
const repo = path.resolve(app, '../../..');
const CONTENT = process.env.CONTENT_DIR ?? path.join(repo, 'content');
const STATIC = process.env.STATIC_DIR ?? path.join(repo, 'static');
const SITE_URL = 'https://semantic-engineering.ai';
// Draft pages are built for review (the test address) and left out of the live site.
const DRAFTS = process.env.DRAFTS !== 'off';

const problems = [];
const warn = (m) => problems.push(m);

// ---------- files and addresses ----------

const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(path.relative(CONTENT, p));
  }
};
walk(CONTENT);
files.sort();

/** content-relative file → URL path, as Hugo publishes it: sdlc/_index.md → /sdlc/, sdlc/agents.md → /sdlc/agents/ */
const urlOf = (rel) => {
  const noExt = rel.replace(/\\/g, '/').replace(/\.md$/, '');
  // The home page's content is the introduction; the site's home is the video (src/pages/WatchPage.tsx).
  const p = noExt === '_index' ? 'introduction' : noExt.endsWith('/_index') ? noExt.slice(0, -'/_index'.length) : noExt;
  return p ? `/${p}/` : '/';
};
const keyOf = (url) => (url === '/introduction/' ? 'home' : url.slice(1, -1));

// Heading ids follow Hugo's (goldmark, "github" style), so links to the live site's anchors keep working.
const headingId = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const plain = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// ---------- diagrams ----------

const diagrams = new Map(); // file name → { file, title, pages: [] }
const svgCache = new Map();
const readSvg = (name) => {
  if (!svgCache.has(name)) {
    const p = path.join(STATIC, 'diagrams', name);
    svgCache.set(name, fs.existsSync(p) ? fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*\?>/, '').replace(/<!DOCTYPE[^>]*>/i, '').trim() : null);
  }
  return svgCache.get(name);
};

// ---------- Markdown to HTML ----------

let current = null; // the page being rendered: { file, key, ids: Map }

const resolveLink = (href) => {
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const [p, frag] = href.split('#');
  if (p.startsWith('/')) return href; // site-absolute: /diagrams/x.svg, /sdlc/...
  if (!p.endsWith('.md')) return href;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(current.file), p));
  if (!files.includes(target)) { warn(`${current.file}: link to "${href}" does not resolve to a page`); return href; }
  links.push({ from: current.key, to: keyOf(urlOf(target)), anchor: frag ?? '', href });
  return urlOf(target) + (frag ? `#${frag}` : '');
};
const links = [];

// Typographic quotes and ellipses, as Hugo's typographer renders them.
const md = new Marked({ gfm: true });
md.use(markedSmartypants());
md.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      let id = headingId(plain(inner));
      const seen = current.ids.get(id) ?? 0;
      current.ids.set(id, seen + 1);
      if (seen) id = `${id}-${seen}`;
      current.lastHeading = { id, depth, text: plain(inner), html: inner };
      return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const external = /^https?:/.test(href ?? '');
      return `<a href="${escapeAttr(resolveLink(href))}"${title ? ` title="${escapeAttr(title)}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>`;
    },
    image({ href, title, text }) {
      const m = (href ?? '').match(/^\/?diagrams\/([^/?#]+\.svg)$/i);
      if (m) {
        const svg = readSvg(m[1]);
        if (!svg) { warn(`${current.file}: diagram "${href}" not found in static/diagrams`); }
        else {
          const d = diagrams.get(m[1]) ?? { file: m[1], title: text, pages: [] };
          if (!d.pages.includes(current.key)) d.pages.push(current.key);
          diagrams.set(m[1], d);
          current.diagram = m[1];
          return `<figure class="se-diagram" role="img" aria-label="${escapeAttr(text)}" data-diagram="${escapeAttr(m[1])}">${svg}${title ? `<figcaption>${title}</figcaption>` : ''}</figure>`;
        }
      }
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}"${title ? ` title="${escapeAttr(title)}"` : ''} loading="lazy" />`;
    },
    table(token) {
      return `<div class="table-wrap">${md.Renderer.prototype.table.call(this, token)}</div>`;
    },
  },
});

const KIND = { paragraph: 'p', list: 'list', table: 'table', blockquote: 'quote', code: 'code', html: 'html' };

const toBlocks = (body, page) => {
  const blocks = [];
  let sec = '', sub = '', n = 0;
  const tokens = md.lexer(body);
  for (const t of tokens) {
    if (t.type === 'space' || t.type === 'hr' || t.type === 'def') continue;
    if (t.type === 'heading') {
      const html = md.parser([t]);
      const h = current.lastHeading;
      if (t.depth <= 2) { sec = h.id; sub = ''; n = 0; } else if (t.depth === 3) sub = h.id;
      blocks.push({ k: 'h', level: t.depth, id: h.id, text: h.text, html });
      continue;
    }
    if (t.type === 'paragraph' && /^\{\{[<%]\s*faq\s*[%>]\}\}$/.test(t.text.trim())) {
      blocks.push({ k: 'faq', sec, sub, n: ++n, html: '' });
      continue;
    }
    if (/^\{\{[<%]/.test(t.raw.trim())) warn(`${current.file}: shortcode not supported: ${t.raw.trim().slice(0, 60)}`);
    current.diagram = null;
    const html = md.parser([t]);
    const onlyImage = t.type === 'paragraph' && t.tokens?.length === 1 && t.tokens[0].type === 'image';
    const k = onlyImage && current.diagram ? 'diagram' : KIND[t.type] ?? t.type;
    const block = { k, sec, sub, n: ++n, html: k === 'diagram' ? html.replace(/^<p>|<\/p>\s*$/g, '') : html };
    if (k === 'diagram') { block.diagram = current.diagram; block.text = t.tokens[0].text; } else block.text = plain(html);
    blocks.push(block);
  }
  return blocks;
};

// ---------- pages ----------

const pages = [];
for (const file of files) {
  const raw = fs.readFileSync(path.join(CONTENT, file), 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = fm ? YAML.parse(fm[1]) ?? {} : {};
  const body = fm ? raw.slice(fm[0].length) : raw;
  if (meta.draft && !DRAFTS) continue;
  const url = urlOf(file);
  const key = keyOf(url);
  current = { file: file.replace(/\\/g, '/'), key, ids: new Map() };
  const blocks = toBlocks(body, key);
  const faqs = (meta.faqs ?? []).map((f) => ({ question: f.question, html: md.parse(String(f.answer ?? '')), text: plain(md.parse(String(f.answer ?? ''))) }));
  if (blocks.some((b) => b.k === 'faq') && !faqs.length) warn(`${file}: faq shortcode with no faqs in front matter`);
  const isSection = path.basename(file) === '_index.md';
  const fmt = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d ? String(d).slice(0, 10) : undefined);
  pages.push({
    key, url, file: current.file, isSection,
    title: String(meta.title ?? key), linkTitle: meta.linkTitle ? String(meta.linkTitle) : undefined,
    description: meta.description ? String(meta.description) : '',
    weight: Number(meta.weight ?? 0), date: fmt(meta.date), lastmod: fmt(meta.lastmod ?? meta.date),
    draft: Boolean(meta.draft), audience: meta.audience ?? [], sidebarExclude: Boolean(meta.sidebar?.exclude),
    headings: blocks.filter((b) => b.k === 'h' && b.level >= 2 && b.level <= 3).map(({ level, id, text }) => ({ level, id, text })),
    blocks, faqs,
  });
}

// ---------- navigation: Hugo's tree, ByWeight at each level (weight, then date, then title) ----------

const byKey = new Map(pages.map((p) => [p.key, p]));
const parentOf = (p) => {
  if (p.key === 'home') return null;
  const parts = p.key.split('/');
  for (let i = parts.length - 1; i >= 0; i--) { const k = i === 0 ? 'home' : parts.slice(0, i).join('/'); if (byKey.has(k) && (k === 'home' || byKey.get(k).isSection)) return k; }
  return 'home';
};
const byWeight = (a, b) => (a.weight || Infinity) - (b.weight || Infinity) || String(a.date ?? '').localeCompare(String(b.date ?? '')) || a.title.localeCompare(b.title);
const childrenOf = (k) => pages.filter((p) => parentOf(p) === k && !p.sidebarExclude).sort(byWeight);
const tree = (k) => ({ key: k, children: byKey.get(k)?.isSection ? childrenOf(k).map((c) => tree(c.key)) : [] });
const nav = childrenOf('home').map((c) => tree(c.key));
const order = ['home'];
const flatten = (nodes) => nodes.forEach((n) => { order.push(n.key); flatten(n.children); });
flatten(nav);
for (const p of pages) p.parent = parentOf(p);

// Every in-content link to an anchor must land on a heading that exists.
for (const l of links) {
  const t = byKey.get(l.to);
  if (l.anchor && t && !t.blocks.some((b) => b.k === 'h' && b.id === l.anchor)) warn(`${byKey.get(l.from)?.file}: link "${l.href}" points at #${l.anchor}, which is not a heading on ${t.file}`);
}

// ---------- write ----------

const out = path.join(app, 'src/content');
fs.rmSync(path.join(out, 'pages'), { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'pages'), { recursive: true });
const fileKey = (k) => k.replace(/\//g, '__');
for (const p of pages) fs.writeFileSync(path.join(out, 'pages', `${fileKey(p.key)}.json`), JSON.stringify({ key: p.key, blocks: p.blocks, faqs: p.faqs }));
const meta = pages.map(({ blocks, faqs, ...m }) => ({ ...m, hasFaq: faqs.length > 0 }));
const unused = fs.readdirSync(path.join(STATIC, 'diagrams')).filter((f) => f.endsWith('.svg') && !diagrams.has(f));
fs.writeFileSync(path.join(out, 'site.json'), JSON.stringify({ pages: meta, nav, order, diagrams: [...diagrams.values()], unusedDiagrams: unused }, null, 1));

// public/: the static files, then the generated ones.
const pub = path.join(app, 'public');
fs.cpSync(STATIC, pub, { recursive: true, filter: (s) => !s.endsWith('.DS_Store') });
const search = pages.flatMap((p) => {
  const secs = new Map([['', { heading: '', text: [] }]]);
  for (const b of p.blocks) {
    if (b.k === 'h' && b.level <= 2) secs.set(b.id, { heading: b.text, text: [] });
    else if (b.k !== 'h') secs.get(b.sec ?? '')?.text.push(b.text);
    else secs.get([...secs.keys()].pop()).text.push(b.text);
  }
  return [...secs].filter(([id, s]) => id === '' || s.text.length).map(([id, s]) => ({ url: p.url + (id ? `#${id}` : ''), page: p.title, heading: s.heading, text: s.text.join(' ').slice(0, 4000) }));
});
fs.writeFileSync(path.join(pub, 'search.json'), JSON.stringify(search));

const live = pages.filter((p) => !p.draft);
const home = byKey.get('home');
const section = (k) => byKey.get(k);
const llms = [
  `# Semantic Engineering: An AI-led SDLC Methodology`, '',
  `> ${home.description}`, '',
  `Semantic Engineering is the methodology Accion Labs developed for agentic software engineering and legacy modernization. It models an enterprise application as a four-layer knowledge graph (functional, design, architecture, and code) that AI agents query for precise, governed context, addressing the "Manual Translation Tax" of feeding tacit enterprise knowledge to AI coding agents. Canonical site: ${SITE_URL}/`,
  ...nav.filter((n) => section(n.key).isSection).flatMap((n) => {
    const s = section(n.key);
    const under = order.filter((k) => k !== n.key && k.startsWith(n.key + '/')).map(section).filter((p) => p && !p.draft);
    return ['', `## ${s.title}`, '', s.description, '', ...under.map((p) => `- [${p.title}](${SITE_URL}${p.url})${p.description ? `: ${p.description}` : ''}`)];
  }),
  '', '## Reference',
  `- [Home](${SITE_URL}/): ${home.description}`,
  '- Archived release (DOI): https://doi.org/10.5281/zenodo.20745234',
  '- Source repository: https://github.com/accionlabs/semantic-engineering',
  '- License: content CC-BY-4.0, code MIT. "Semantic Engineering" and "Manual Translation Tax" are trademarks of Accion Labs.', '',
].join('\n');
fs.writeFileSync(path.join(pub, 'llms.txt'), llms);
const bots = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
fs.writeFileSync(path.join(pub, 'robots.txt'), `${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE_URL}/sitemap.xml\nLlms: ${SITE_URL}/llms.txt\n`);
fs.writeFileSync(path.join(pub, 'sitemap.xml'), `<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${order.map(section).filter((p) => p && !p.draft).map((p) => `  <url><loc>${SITE_URL}${p.url}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);

const blockCount = pages.reduce((s, p) => s + p.blocks.filter((b) => b.k !== 'h').length, 0);
console.log(`content: ${pages.length} pages (${pages.filter((p) => p.draft).length} drafts), ${blockCount} addressed blocks, ${diagrams.size} diagrams used, ${unused.length} unused, ${links.length} internal links, ${search.length} search entries`);
if (unused.length) console.log(`  unused diagrams: ${unused.join(', ')}`);
if (problems.length) { console.log(`  ${problems.length} problem(s):`); problems.forEach((p) => console.log(`  - ${p}`)); if (process.env.STRICT) process.exit(1); }
