// The same analysis as the /insights page, from the command line. Run with: npm run insights [-- --days=30]
// Stored explanations are read through wrangler (its login). Usage counts need CLOUDFLARE_API_TOKEN with
// "Account Analytics: Read"; the account id is read from wrangler.jsonc.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fetchUsage, summarizeStored, type Count } from '../src/reel/insights';

const NAMESPACE = '851e5f06e3d946e9b53063b1c382f2de';
const DAYS = Number(process.argv.find((a) => a.startsWith('--days='))?.slice(7) ?? 30);
const ACCOUNT = fs.readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8').match(/"ACCOUNT_ID":\s*"([0-9a-f]{32})"/)?.[1];
const wrangler = (...args: string[]) => execFileSync('npx', ['wrangler', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
const show = (title: string, rows: Count[]) => { console.log(`\n${title}`); if (!rows.length) console.log('  (none)'); rows.forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`)); };

const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const keys = (JSON.parse(wrangler('kv', 'key', 'list', '--namespace-id', NAMESPACE, '--remote', '--prefix', 'e:')) as { name: string; metadata?: { created?: string } }[])
  .filter((k) => !k.metadata?.created || k.metadata.created >= since);
const s = summarizeStored(keys.map((k) => ({ code: wrangler('kv', 'key', 'get', k.name, '--namespace-id', NAMESPACE, '--remote', '--text'), created: k.metadata?.created })));
console.log(`# Explanations stored in the last ${DAYS} days: ${s.total}`);
show('Kinds of work', s.kinds); show('Made by, and against the current rules', s.madeBy); show('Who they were for', s.audiences);
show('Concepts used most', s.concepts); show('Deep dives offered', s.deepDives); show('Explanations per week (week starting)', s.weeks);
console.log('\nQuestions (most recent first)'); s.questions.slice(0, 25).forEach((q) => console.log(`  - ${q.question} (${q.context}${q.passes ? '' : ', fails the current rules'})`));

const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token || !ACCOUNT) console.log('\n# Connector usage: skipped. Set CLOUDFLARE_API_TOKEN (Account Analytics: Read).');
else {
  const u = await fetchUsage(ACCOUNT, token, 'semantic_engineering_usage', DAYS);
  console.log(`\n# Connector usage in the last ${DAYS} days`);
  show('Requests by kind and tool', u.requests); show('Outcomes', u.outcomes); show('Most common checker errors', u.errors);
  show('Clients that connected', u.clients); show('Kinds of work asked about', u.kinds); show('Countries', u.countries);
}
