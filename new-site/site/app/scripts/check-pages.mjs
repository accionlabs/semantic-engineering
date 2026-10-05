// Opens every page at desktop and phone widths, in both themes, and records page errors, console errors,
// horizontal overflow, diagrams that failed to render, and a full-page screenshot of each.
//   node scripts/check-pages.mjs [baseUrl] [only,these,paths]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] ?? 'http://localhost:4174';
const site = JSON.parse(fs.readFileSync(path.join(here, '../src/content/site.json'), 'utf8'));
const only = process.argv[3] ? process.argv[3].split(',') : null;
const pages = [...site.pages.map((p) => p.url), '/no-such-page/'].filter((p) => !only || only.some((o) => p.includes(o)));
const out = path.resolve(here, '../../checks'); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const problems = [];
for (const [dev, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: theme, deviceScaleFactor: 1 });
    for (const p of pages) {
      const page = await ctx.newPage();
      const where = `${p} [${dev} ${theme}]`;
      page.on('pageerror', (e) => problems.push(`${where} page error: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text()) || /hydrat/i.test(m.text())) problems.push(`${where} console: ${m.text()}`); });
      const res = await page.goto(base + p, { waitUntil: 'networkidle' });
      if (p !== '/no-such-page/' && res?.status() !== 200) problems.push(`${where} status ${res?.status()}`);
      await page.waitForTimeout(300);
      const r = await page.evaluate(() => ({
        over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        empty: [...document.querySelectorAll('.se-diagram svg')].filter((s) => s.getBoundingClientRect().height < 20).length,
        h1: document.querySelector('h1')?.textContent ?? '',
      }));
      if (r.over > 1) problems.push(`${where} horizontal overflow ${r.over}px`);
      if (r.empty) problems.push(`${where} ${r.empty} diagram(s) render with no height`);
      if (!r.h1) problems.push(`${where} no heading`);
      const name = `${dev}-${theme}-${p === '/' ? 'home' : p.slice(1, -1).replace(/\//g, '_')}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage: dev === 'phone' ? false : true });
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
console.log(problems.length ? problems.join('\n') : `check-pages: ${pages.length} pages × 4 views, no problems`);
process.exit(problems.length ? 1 : 0);
