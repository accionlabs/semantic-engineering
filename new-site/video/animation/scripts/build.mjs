// Bundles the scenes into a single static page: dist/index.html, app.js, app.css and font files.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flag = process.argv.indexOf('--outdir');
const dist = path.join(root, flag > 0 ? process.argv[flag + 1] : 'dist');
fs.mkdirSync(dist, { recursive: true });
await build({
  entryPoints: [path.join(root, 'src/entry.tsx')], bundle: true, outfile: path.join(dist, 'app.js'),
  format: 'iife', jsx: 'automatic', minify: true, loader: { '.woff2': 'file', '.woff': 'file' },
  define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'warning',
});
fs.writeFileSync(path.join(dist, 'index.html'), `<!doctype html><html><head><meta charset="utf-8"><title>SaaS architecture when code is cheap</title>
<link rel="stylesheet" href="app.css"><style>html,body{margin:0;background:#0d1220}</style></head><body><div id="root"></div><script src="app.js"></script></body></html>`);
console.log('built', dist);
