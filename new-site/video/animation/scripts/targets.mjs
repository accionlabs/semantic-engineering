// Lists every clickable element in the film: its id, its scene, and its text, for naming and checking.
//   node scripts/targets.mjs > targets.json
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(pathToFileURL(path.resolve(here, '../dist/index.html')).href + '?scenes=0-30&notitle');
await p.evaluate(() => window.__ready);
const out = await p.evaluate(() => {
  const keyToN = Object.fromEntries(window.__film.chapters.filter((c) => c.n !== undefined).map((c) => [c.key, c.n]));
  const rows = [];
  document.querySelectorAll('.item').forEach((item) => {
    const key = [...item.classList].find((c) => c.startsWith('item-'))?.slice(5);
    const n = keyToN[key];
    if (n === undefined) return;
    item.querySelectorAll('[data-target]').forEach((el) => rows.push({ n, id: el.getAttribute('data-target'), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140) }));
  });
  return rows;
});
console.log(JSON.stringify(out));
await b.close();
