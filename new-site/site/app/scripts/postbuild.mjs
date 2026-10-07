// Prerenders every page into dist/<path>/index.html with its own title, description, social cards and
// structured data, so the site reads fully without JavaScript and search engines see each page as before.
// Then writes the 404 page and the caching headers.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(app, 'dist');
const SITE_URL = 'https://semantic-engineering.ai';
const GA = 'G-9F9DMLMBBN';
const { render, SITE } = await import(pathToFileURL(path.join(app, 'dist-ssr/entry-server.js')).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const pages = new Map(SITE.pages.map((p) => [p.key, p]));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
const ogImage = `${SITE_URL}/og-image.png`;
const publisher = { '@type': 'Organization', name: 'Accion Labs', url: 'https://www.accionlabs.com', logo: { '@type': 'ImageObject', url: ogImage } };
// Google Analytics runs on the live address only, so test deployments and local previews are not counted.
const analytics = `<script>if(location.hostname==='semantic-engineering.ai'){var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=${GA}';document.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA}')}</script>`;

const head = (p) => {
  const url = SITE_URL + p.url;
  const title = `${p.title} · Semantic Engineering`;
  const ancestors = [];
  for (let k = p.parent; k; k = pages.get(k)?.parent) ancestors.unshift(pages.get(k));
  const data = [];
  if (!p.isSection) data.push({ '@context': 'https://schema.org', '@type': 'TechArticle', headline: p.title, description: p.description, url, mainEntityOfPage: url, inLanguage: 'en', image: ogImage, datePublished: p.date, dateModified: p.lastmod, author: { '@type': 'Person', name: 'Ashutosh Bijoor', url: 'https://orcid.org/0009-0003-5402-3873' }, publisher });
  if (ancestors.length) data.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [...ancestors, p].map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, item: SITE_URL + a.url })) });
  if (p.faqs?.length) data.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.text } })) });
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    p.draft ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:type" content="${p.isSection && p.key !== 'home' ? 'website' : 'article'}" />`,
    `<meta property="og:site_name" content="Semantic Engineering" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    ...data.map(ld),
    analytics,
  ].filter(Boolean).join('\n    ');
};

let n = 0;
for (const p of SITE.pages) {
  const faqs = JSON.parse(fs.readFileSync(path.join(app, 'src/content/pages', `${p.key.replace(/\//g, '__')}.json`), 'utf8')).faqs;
  const html = template.replace('<!--head-->', head({ ...p, faqs })).replace('<!--app-->', render(p.url));
  const dir = path.join(dist, p.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  n++;
}
// The watch pages: the full video, the overview, each part and each scene, each prerendered with the
// player's placeholder so the address works when opened directly.
const paths = await import(pathToFileURL(path.join(app, 'dist-ssr/entry-server.js')).href);
const narration = JSON.parse(fs.readFileSync(path.join(app, '../../video/animation/src/narration.json'), 'utf8'));
const label = (a) => narration.labels?.[String(a)] ?? `Act ${a}`;
const appendix = Object.keys(narration.acts).map(Number).find((a) => label(a) === 'Appendix');
const home = SITE.pages.find((p) => p.key === 'home');
const watch = [
  { url: '/', title: 'Semantic Engineering', description: home.description, website: true },
  { url: '/watch/', title: 'The full video', description: 'The Semantic Engineering explainer, played live and clickable, one part at a time.' },
  { url: '/watch/overview/', title: 'The overview', description: narration.scenes.find((s) => s.n === 0).sentences.slice(0, 2).join(' ') },
  ...Object.keys(narration.acts).map(Number).filter((a) => a > 0).map((a) => ({
    url: a === appendix ? '/watch/appendix/' : `/watch/act-${a}/`, title: `${label(a)}: ${narration.acts[String(a)]}`,
    description: narration.scenes.filter((s) => s.act === a).map((s) => s.title).join(' · '),
  })),
  ...narration.scenes.filter((s) => s.n > 0).map((s) => ({ url: `/watch/scene-${s.n}/`, title: `Scene ${s.n}: ${s.title}`, description: s.sentences.slice(0, 2).join(' ') })),
  ...paths.ROLES.map((r) => ({ url: `/watch/role-${r.slug}/`, title: `${r.name}: the scenes for your role`, description: r.note })),
  ...paths.SITUATIONS.map((r) => ({ url: `/watch/use-${r.slug}/`, title: `${r.name}: the scenes for your situation`, description: r.note })),
  { url: '/graph/', title: 'The knowledge graph of Semantic Engineering', description: 'Every concept and link of the method, each tied to the film and the pages that support it.' },
  { url: '/explain/', title: 'Explanations', description: 'Semantic Engineering explained for your own situation by your agent, played as a short film.' },
  { url: '/explain/saved/', title: 'Your explanation', description: 'An explanation saved in this browser.', noindex: true },
  { url: '/connect/', title: 'The Semantic Engineering connector', description: 'An MCP server that helps an agent explain how Semantic Engineering applies to a person\'s own software work.' },
  { url: '/insights/', title: 'Insights', description: 'What people use the explanations for, in aggregate.', noindex: true },
  { url: '/privacy/', title: 'Privacy policy', description: 'What semantic-engineering.ai and its MCP connector collect.' },
];
for (const w of watch) {
  const url = SITE_URL + w.url;
  const headHtml = [
    w.noindex ? '<meta name="robots" content="noindex" />' : '',
    w.website ? '<title>Semantic Engineering</title>' : `<title>${esc(w.title)} · Semantic Engineering</title>`,
    `<meta name="description" content="${esc(w.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(w.title)}" />`, `<meta property="og:description" content="${esc(w.description)}" />`,
    `<meta property="og:url" content="${url}" />`, `<meta property="og:image" content="${ogImage}" />`,
    w.website ? ld({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Semantic Engineering', alternateName: 'Semantic Engineering Methodology', url: `${SITE_URL}/`, inLanguage: 'en', publisher }) : '',
    analytics,
  ].filter(Boolean).join('\n    ');
  const html = template.replace('<!--head-->', headHtml).replace('<!--app-->', render(w.url.replace(/\/$/, '') || '/'));
  const dir = path.join(dist, w.url);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  n++;
}
const notFound = template.replace('<!--head-->', `<title>Page not found · Semantic Engineering</title>\n    <meta name="robots" content="noindex" />\n    ${analytics}`).replace('<!--app-->', render('/404-not-found/'));
fs.writeFileSync(path.join(dist, '404.html'), notFound);
fs.writeFileSync(path.join(dist, '_headers'), '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n/diagrams/*\n  Cache-Control: public, max-age=3600\n');
console.log(`postbuild: ${n} pages prerendered, 404 page and _headers written`);
