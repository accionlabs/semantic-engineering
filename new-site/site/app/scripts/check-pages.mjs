// Screenshots every page at desktop and phone widths, in both themes, and records page errors.
//   node scripts/check-pages.mjs [baseUrl]
import { chromium } from '../../../video/animation/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] ?? 'http://localhost:4173';
const paper = JSON.parse(fs.readFileSync(path.join(here, '../src/content/paper.json'), 'utf8'));
const pages = ['/', '/sections', '/summary', '/glossary', '/references', '/about', '/graph', '/explain', '/connect', '/privacy', '/watch/layer-onboarding', ...paper.sections.map((s) => `/sections/${s.slug}`)];
const out = path.resolve(here, '../../checks'); fs.mkdirSync(out, { recursive: true });
const only = process.argv[3] ? process.argv[3].split(',') : null;
const browser = await chromium.launch({ channel: 'chrome' });
const problems = [];
for (const [dev, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: theme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    for (const p of pages) {
      if (only && !only.some((o) => p === o || p.includes(o))) continue;
      const page = await ctx.newPage();
      page.on('pageerror', (e) => problems.push(`${p} [${dev} ${theme}] page error: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') problems.push(`${p} [${dev} ${theme}] console: ${m.text()}`); });
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 1) problems.push(`${p} [${dev} ${theme}] horizontal overflow ${over}px`);
      const name = `${dev}-${theme}-${p === '/' ? 'home' : p.slice(1).replace(/\//g, '_')}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(out, 'problems.txt'), problems.join('\n') || 'none');
console.log(problems.length ? problems.join('\n') : 'no problems found', '\nscreenshots in', out);
