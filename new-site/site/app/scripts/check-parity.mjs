// Compares every prerendered page in dist/ with the same page built by Hugo: the words, headings, diagrams,
// tables and internal links in the page body. Used while the new site replaces the Hugo one.
//   node scripts/check-parity.mjs            builds the Hugo site into a temporary folder first
//   HUGO_DIR=/path node scripts/check-parity.mjs   compares with an existing Hugo build
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(app, '../../..');
let hugo = process.env.HUGO_DIR;
if (!hugo) {
  hugo = fs.mkdtempSync(path.join(os.tmpdir(), 'hugo-parity-'));
  execFileSync('hugo', ['--quiet', '--source', repo, '--destination', hugo], { stdio: 'inherit' });
}
const site = JSON.parse(fs.readFileSync(path.join(app, 'src/content/site.json'), 'utf8'));

const between = (html, start, ends) => {
  const i = html.indexOf(start);
  if (i < 0) return '';
  const rest = html.slice(i + start.length);
  const j = Math.min(...ends.map((e) => { const k = rest.indexOf(e); return k < 0 ? Infinity : k; }));
  return rest.slice(0, j);
};
const decode = (s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;|&#34;/g, '"').replace(/&#39;|&rsquo;|&lsquo;|&#x27;|&#8217;|&#8216;/g, "'").replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;|&#8230;/g, '…').replace(/&rarr;/g, '→').replace(/&times;/g, '×');
// Code samples are compared without quotes: Hugo splits highlighted code into spans around them.
const words = (html) => decode(html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<a class="anchor"[^>]*>#<\/a>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\.\.\./g, '…').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/"/g, ' " ').split(/\s+/).filter(Boolean);
const count = (html, re) => (html.match(re) ?? []).length;
const hrefs = (html) => new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => decode(m[1]).replace(/^https:\/\/semantic-engineering\.ai/, '')).filter((h) => h.startsWith('/') && !h.startsWith('/#')));
const diff = (a, b) => { const m = new Map(); a.forEach((w) => m.set(w, (m.get(w) ?? 0) + 1)); b.forEach((w) => m.set(w, (m.get(w) ?? 0) - 1)); return [...m].filter(([, n]) => n > 0).map(([w, n]) => (n > 1 ? `${w}×${n}` : w)); };

let failed = 0;
for (const p of site.pages) {
  const ours = fs.readFileSync(path.join(app, 'dist', p.url, 'index.html'), 'utf8');
  const hugoFile = path.join(hugo, p.url, 'index.html');
  if (!fs.existsSync(hugoFile)) { if (!p.draft) { failed++; console.log(`${p.url}: not in the Hugo build`); } continue; }
  const theirs = fs.readFileSync(hugoFile, 'utf8');
  const a = between(theirs, '<div class="content">', ['<div class="hx:mt-16"', '<nav class="hx:flex hx:flex-row', '</main>']);
  const b = (ours.match(/<h1>[\s\S]*?<\/h1>/)?.[0] ?? '') + between(ours, '<div class="prose">', ['<nav class="pager"']);
  const problems = [];
  const wa = words(a), wb = words(b);
  const missing = diff(wa, wb), extra = diff(wb, wa);
  if (missing.length) problems.push(`words missing: ${missing.slice(0, 12).join(' ')}${missing.length > 12 ? ` (+${missing.length - 12})` : ''}`);
  if (extra.length) problems.push(`words added: ${extra.slice(0, 12).join(' ')}${extra.length > 12 ? ` (+${extra.length - 12})` : ''}`);
  for (const [what, re] of [['diagrams', /<figure class="se-diagram"/g], ['tables', /<table/g], ['h2', /<h2[\s>]/g], ['h3', /<h3[\s>]/g], ['list items', /<li[\s>]/g], ['details', /<details/g]]) {
    const x = count(a, re), y = count(b, re);
    if (x !== y) problems.push(`${what}: Hugo ${x}, new ${y}`);
  }
  const ha = hrefs(a), hb = hrefs(b);
  const lost = [...ha].filter((h) => !hb.has(h) && !hb.has(h.replace(/\/$/, ''))), gained = [...hb].filter((h) => !ha.has(h));
  if (lost.length || gained.length) problems.push(`links differ: Hugo only ${lost.join(', ') || 'none'}; new only ${gained.join(', ') || 'none'}`);
  if (!ours.includes(`<meta name="description" content="`)) problems.push('no description');
  console.log(`${problems.length ? '✗' : '✓'} ${p.url} (${wb.length} words)`);
  problems.forEach((x) => console.log(`    ${x}`));
  if (problems.length) failed++;
}
console.log(failed ? `\n${failed} page(s) differ from the Hugo build` : `\nall ${site.pages.length} pages match the Hugo build`);
process.exit(failed ? 1 : 0);
