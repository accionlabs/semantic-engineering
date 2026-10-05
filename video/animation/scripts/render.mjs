// Renders the film frame by frame: headless Chrome seeks the GSAP timeline to each frame,
// captures it, and pipes the frames to ffmpeg. Workers render separate stretches in parallel,
// then the stretches are joined without re-encoding.
//
//   node scripts/render.mjs --scenes 1-23 --out ../renders/review-cut.mp4 [--workers 6]
//   node scripts/render.mjs --scenes 7 --stills 0.2,0.5,0.9 --outdir ../style-frames/gsap
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, arr) => (x.startsWith('--') ? [...a, [x.slice(2), arr[i + 1]?.startsWith('--') ? 'true' : arr[i + 1] ?? 'true']] : a), []));
const FPS = 30;
const scenes = args.scenes ?? '1-23';
const page0 = pathToFileURL(path.resolve(here, '..', args.dist ?? 'dist', 'index.html')).href + `?scenes=${scenes}${args.notitle ? '&notitle' : ''}`;
const workers = Number(args.workers ?? Math.max(2, Math.min(8, os.cpus().length - 2)));
const scale = Number(args.scale ?? 1);

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--force-color-profile=srgb'] });
const openPage = async () => {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  p.on('pageerror', (e) => console.error('page error:', e.message));
  await p.goto(page0);
  await p.evaluate(() => window.__ready);
  return p;
};
const shot = (p, t) => p.evaluate((s) => { window.__seek(s); return null; }, t).then(() => p.screenshot({ type: 'jpeg', quality: 92 }));

const probe = await openPage();
const { duration, chapters } = await probe.evaluate(() => window.__film);
const frames = Math.round(duration * FPS);
console.log(`scenes ${scenes}: ${duration.toFixed(1)} s, ${frames} frames`);

if (args.stills) {
  const outdir = path.resolve(args.outdir ?? path.resolve(here, '../../renders/stills'));
  fs.mkdirSync(outdir, { recursive: true });
  for (const x of String(args.stills).split(',')) {
    const t = Number(x) <= 1 ? Number(x) * duration : Number(x);
    const file = path.join(outdir, `${args.name ?? 'scenes-' + scenes}-${x}.jpg`);
    fs.writeFileSync(file, await shot(probe, t));
    console.log('still', file);
  }
  await browser.close();
  process.exit(0);
}

const out = path.resolve(args.out ?? path.resolve(here, `../../renders/scenes-${scenes}.mp4`));
fs.mkdirSync(path.dirname(out), { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'film-'));
const per = Math.ceil(frames / workers);
let done = 0, lastPct = -1;
const renderStretch = async (w) => {
  const a = w * per, b = Math.min(frames, a + per);
  if (a >= b) return null;
  const p = w === 0 ? probe : await openPage();
  const file = path.join(tmp, `part-${String(w).padStart(2, '0')}.mp4`);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    const buf = await shot(p, f / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    done++;
    const pct = Math.floor((done / frames) * 20) * 5;
    if (pct !== lastPct) { lastPct = pct; console.log(`${pct}%`); }
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  return file;
};
const parts = (await Promise.all(Array.from({ length: workers }, (_, w) => renderStretch(w)))).filter(Boolean);
fs.writeFileSync(path.join(tmp, 'list.txt'), parts.map((f) => `file '${f}'`).join('\n'));
await new Promise((r) => spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', r));
fs.writeFileSync(out.replace(/\.mp4$/, '.chapters.json'), JSON.stringify(chapters, null, 1));
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
console.log('wrote', out);
