// Preview of the eight diagrams: bundles a page with esbuild, then screenshots each
// diagram in light and dark at desktop and phone widths with reduced motion (final state).
// Usage: node scripts/diagram-preview.mjs [--motion]   (--motion also saves mid-animation frames)
import { build } from '/Users/ashutoshbijoor/Code/dialect-engineering/video/animation/node_modules/esbuild/lib/main.js';
import { chromium } from '/Users/ashutoshbijoor/Code/dialect-engineering/video/animation/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(tmpdir(), 'dialect-diagram-preview');
const shots = join(app, '..', 'wireframes', 'diagrams');
mkdirSync(out, { recursive: true });
mkdirSync(shots, { recursive: true });

const entry = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource-variable/bricolage-grotesque';
import './src/theme.css';
import { DIAGRAMS } from './src/diagrams';
const App = () => (
  <main>
    {Object.entries(DIAGRAMS).map(([id, D]) => (
      <figure key={id} id={id}><figcaption>{id}</figcaption><D /></figure>
    ))}
  </main>
);
createRoot(document.getElementById('root')).render(<App />);
`;

await build({
  stdin: { contents: entry, resolveDir: app, loader: 'tsx', sourcefile: 'preview.tsx' },
  bundle: true,
  outdir: out,
  entryNames: 'preview',
  assetNames: '[name]',
  loader: { '.woff2': 'file', '.woff': 'file' },
  jsx: 'automatic',
  format: 'iife',
  logLevel: 'warning',
});

writeFileSync(join(out, 'index.html'), `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.setAttribute('data-theme', location.hash.slice(1) || 'light')</script>
<link rel="stylesheet" href="preview.css">
<style>
  body { margin: 0; background: var(--bg); color: var(--fg); font-family: var(--sans); }
  main { max-width: 760px; margin: 0 auto; padding: 24px 16px; }
  figure { margin: 0 0 40px; background: var(--surface); border: 1px solid var(--hairline); border-radius: 12px; padding: 16px; }
  figcaption { font-family: var(--mono); font-size: 12px; color: var(--muted); margin-bottom: 8px; }
</style></head><body><div id="root"></div><script src="preview.js"></script></body></html>`);

const motion = process.argv.includes('--motion');
const browser = await chromium.launch({ channel: 'chrome' });
for (const [label, width, scale] of [['desktop', 1200, 1], ['phone', 390, 2]]) {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: scale });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(pathToFileURL(join(out, 'index.html')).href + '#' + theme);
    await page.waitForSelector('figure svg');
    await page.evaluate(() => document.fonts.ready);
    for (const id of ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']) {
      await page.locator(`#${id}`).screenshot({ path: join(shots, `${label}-${theme}-${id}.png`) });
    }
    if (errors.length) console.log(label, theme, 'errors:', errors);
    await page.close();
  }
}
if (motion) {
  // Mid-animation frames, to check the motion arrives at the final state.
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(pathToFileURL(join(out, 'index.html')).href + '#light');
  await page.waitForSelector('figure svg');
  for (const id of ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    for (const t of [800, 8000]) {
      await page.waitForTimeout(t === 800 ? 800 : 7200);
      await page.locator(`#${id}`).screenshot({ path: join(shots, `motion-${id}-${t}.png`) });
    }
  }
  await page.close();
}
await browser.close();
console.log('screenshots in', shots);
