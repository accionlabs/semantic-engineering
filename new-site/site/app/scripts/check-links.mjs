// Fetches every citation in the paper and reports any that do not resolve.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const paper = JSON.parse(fs.readFileSync(path.join(here, '../src/content/paper.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36';
const check = async (url) => {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,application/pdf,*/*' }, signal: AbortSignal.timeout(20000) });
      if (r.ok) return { url, status: r.status, ok: true };
      if (method === 'GET') return { url, status: r.status, ok: false };
    } catch (e) { if (method === 'GET') return { url, status: String(e.cause?.code ?? e.name), ok: false }; }
  }
};
const results = [];
const urls = paper.citations.map((c) => c.url);
for (let i = 0; i < urls.length; i += 8) results.push(...(await Promise.all(urls.slice(i, i + 8).map(check))));
const bad = results.filter((r) => !r.ok);
const lines = [`# Citation link check`, ``, `${results.length} links checked, ${results.length - bad.length} resolved, ${bad.length} did not.`, ``, `| Status | Link |`, `|---|---|`, ...bad.map((r) => `| ${r.status} | ${r.url} |`)];
fs.writeFileSync(path.resolve(here, '../../checks/links.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
