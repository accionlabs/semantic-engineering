// Collects, for every scene, the clickable elements (data-target) and which of them are visible a
// second into each narration sentence. The site's reel language checks `hold … on <element>` against
// it, and the list doubles as the video's interactions deliverable.
//   node scripts/harvest.mjs [--dist dist-main]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const flag = process.argv.indexOf('--dist');
const dist = path.resolve(here, '..', flag > 0 ? process.argv[flag + 1] : 'dist');
const narration = JSON.parse(fs.readFileSync(path.resolve(here, '../src/narration.json'), 'utf8'));
const timing = JSON.parse(fs.readFileSync(path.resolve(here, '../src/voice-timing.json'), 'utf8'));

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.join(dist, 'index.html')).href + '?scenes=1-23&notitle');
await page.evaluate(() => window.__ready);
const chapters = await page.evaluate(() => window.__film.chapters);

// Visible means shown, not faded out, and at least a few pixels in size.
const visibleAt = (t, key) => page.evaluate(({ t, key }) => {
  window.__seek(t);
  const root = document.querySelector(`.item-${CSS.escape(key)}`);
  if (!root) return [];
  const out = new Map();
  root.querySelectorAll('[data-target]').forEach((el) => {
    let op = 1;
    for (let e = el; e && e !== root.parentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      op *= Number(cs.opacity || 1);
    }
    const r = el.getBoundingClientRect();
    if (op < 0.3 || r.width < 6 || r.height < 6) return;
    out.set(el.getAttribute('data-target'), true);
  });
  return [...out.keys()];
}, { t, key });

const labels = await page.evaluate(() => {
  const m = {};
  document.querySelectorAll('[data-target]').forEach((el) => {
    const id = el.getAttribute('data-target');
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!m[id] && text && text.length < 70) m[id] = text;
  });
  return m;
});

const scenes = {};
for (const c of chapters.filter((x) => x.n !== undefined)) {
  const s = narration.scenes.find((x) => x.n === c.n);
  const lens = timing.scenes[String(c.n)];
  let t = timing.lead;
  const sentences = [];
  const all = new Set();
  for (let k = 0; k < lens.length; k++) {
    const ids = await visibleAt(c.start + t + Math.min(1, lens[k] * 0.5), c.key);
    ids.forEach((i) => all.add(i));
    sentences.push({ k: k + 1, start: +t.toFixed(3), duration: lens[k], text: s.sentences[k], visible: ids.sort() });
    t += lens[k] + timing.gap;
  }
  scenes[c.n] = { title: s.title, act: s.act, start: +c.start.toFixed(3), duration: +c.duration.toFixed(3), targets: [...all].sort(), sentences };
}
await browser.close();

const out = { generated: new Date().toISOString().slice(0, 10), lead: timing.lead, gap: timing.gap, labels, scenes };
fs.writeFileSync(path.resolve(here, '../../../site/app/src/content/moments.json'), JSON.stringify(out));
fs.writeFileSync(path.resolve(here, '../../interactions.json'), JSON.stringify({ generated: out.generated, labels, scenes: Object.fromEntries(Object.entries(scenes).map(([n, s]) => [n, { title: s.title, targets: s.targets }])) }, null, 1));
console.log('scenes', Object.keys(scenes).length, 'sentences', Object.values(scenes).reduce((a, s) => a + s.sentences.length, 0), 'targets', new Set(Object.values(scenes).flatMap((s) => s.targets)).size);
