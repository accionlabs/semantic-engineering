// Checks every clickable element in the film against src/content/targets.ts and the site's pages:
// every element has a name, every name belongs to an element, every location is a real page and heading.
//   node scripts/check-targets.mjs        (builds nothing; run after the film is built: video/animation, node scripts/build.mjs)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const anim = path.resolve(app, '../../video/animation');
const rows = JSON.parse(execFileSync('node', ['scripts/targets.mjs'], { cwd: anim, maxBuffer: 1 << 26 }).toString());
const ids = new Set(rows.map((r) => r.id));
const src = fs.readFileSync(path.join(app, 'src/content/targets.ts'), 'utf8');
const table = new Map([...src.matchAll(/'([^']+)':\s*\['([^']*)'(?:,\s*'([^']*)')?\]/g)].map((m) => [m[1], m[3]]));
const site = JSON.parse(fs.readFileSync(path.join(app, 'src/content/site.json'), 'utf8'));
const pages = new Map(site.pages.map((p) => [p.file, p]));
const narration = JSON.parse(fs.readFileSync(path.join(anim, 'src/narration.json'), 'utf8'));
const story = {}; narration.scenes.forEach((s) => Object.entries(s.targets).forEach(([k, v]) => { story[k] ??= v; }));
const problems = [];
ids.forEach((id) => { if (!table.has(id)) problems.push(`unnamed element: ${id}`); });
table.forEach((loc, id) => {
  if (!ids.has(id)) problems.push(`named but not in the film: ${id}`);
  const l = loc || story[id];
  if (!l) { problems.push(`no location: ${id}`); return; }
  if (l.startsWith('http')) return;
  const [file, anchor] = l.split('#'); const p = pages.get(file);
  if (!p) problems.push(`no page for ${id}: ${l}`);
  else if (anchor && !p.headings.some((h) => h.id === anchor)) problems.push(`no heading for ${id}: ${l}`);
});
console.log(`check-targets: ${rows.length} elements, ${ids.size} distinct, ${problems.length ? problems.length + ' problems' : 'no problems'}`);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
