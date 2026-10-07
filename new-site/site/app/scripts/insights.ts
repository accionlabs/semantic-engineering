// What people use the explanations and the connector for, in aggregate. Run with: npm run insights
//   1. Stored explanations (Cloudflare KV, kept 90 days): questions, kinds of work, audiences, concepts,
//      deep dives, by week. Read through wrangler, so it uses wrangler's login.
//   2. Connector usage counts (Workers Analytics Engine): tools called, outcomes, common checker errors,
//      clients and countries. The SQL API needs an API token with "Account Analytics: Read" in
//      CLOUDFLARE_API_TOKEN, and the account id in CLOUDFLARE_ACCOUNT_ID (or from wrangler whoami).
// Nothing here identifies a person: the store keeps no record of who made an explanation.
import { execFileSync } from 'node:child_process';
import { checkExplain } from '../src/reel/explain';
import { nodeById } from '../src/reel/graph';

const NAMESPACE = '851e5f06e3d946e9b53063b1c382f2de';
const DATASET = 'semantic_engineering_usage';
const DAYS = Number(process.argv.find((a) => a.startsWith('--days='))?.slice(7) ?? 30);
const wrangler = (...args: string[]) => execFileSync('npx', ['wrangler', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 });
const top = (m: Map<string, number>, n = 10) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const bump = (m: Map<string, number>, k: string, by = 1) => m.set(k, (m.get(k) ?? 0) + by);
const show = (title: string, m: Map<string, number>, n = 10) => { console.log(`\n${title}`); if (!m.size) console.log('  (none)'); top(m, n).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}`)); };

// ---------- 1. stored explanations ----------
const keys = JSON.parse(wrangler('kv', 'key', 'list', '--namespace-id', NAMESPACE, '--remote', '--prefix', 'e:')) as { name: string; metadata?: { context?: string; created?: string } }[];
const since = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const recent = keys.filter((k) => !k.metadata?.created || k.metadata.created >= since);
console.log(`# Explanations stored in the last ${DAYS} days: ${recent.length} (of ${keys.length} kept)`);
const contexts = new Map<string, number>(), audiences = new Map<string, number>(), concepts = new Map<string, number>(), dives = new Map<string, number>(), weeks = new Map<string, number>(), questions: string[] = [], sources = new Map<string, number>();
for (const k of recent) {
  const code = wrangler('kv', 'key', 'get', k.name, '--namespace-id', NAMESPACE, '--remote', '--text');
  // The header is read directly, so explanations made under earlier rules still count.
  const plan = checkExplain(code).plan;
  bump(contexts, code.match(/^\s+context\s+(\S+)/m)?.[1] ?? 'unknown');
  bump(audiences, code.match(/^\s+for\s+"([^"]*)"/m)?.[1] ?? '(not given)');
  bump(sources, code.includes('Here is the problem you see, as the method describes it.') ? 'built on the site' : 'written by an agent');
  bump(sources, plan ? 'passes the current rules' : 'fails the current rules');
  questions.push(code.match(/^explain\s+"([^"]*)"/m)?.[1] ?? '(no question)');
  if (!plan) continue;
  plan.branches.forEach((b) => bump(dives, b.label));
  new Set([...plan.segments, ...plan.branches.flatMap((b) => b.segments)].map((x) => x.trace?.node).filter((x): x is string => !!x && !x.includes(' '))).forEach((id) => bump(concepts, nodeById(id)?.label ?? id));
  if (k.metadata?.created) { const d = new Date(k.metadata.created); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); bump(weeks, d.toISOString().slice(0, 10)); }
}
show('Kinds of work', contexts);
show('Made by, and against the current rules', sources);
show('Who they were for', audiences);
show('Concepts used most', concepts, 15);
show('Deep dives offered', dives);
show('Explanations per week (week starting)', weeks, 20);
console.log('\nQuestions (most recent first, up to 25)');
questions.slice(-25).reverse().forEach((q) => console.log(`  - ${q}`));

// ---------- 2. connector usage counts ----------
const token = process.env.CLOUDFLARE_API_TOKEN;
let account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!account) { try { account = wrangler('whoami').match(/[0-9a-f]{32}/)?.[0]; } catch { /* no account id */ } }
if (!token || !account) {
  console.log('\n# Connector usage: skipped. Set CLOUDFLARE_API_TOKEN (Account Analytics: Read) and, if needed, CLOUDFLARE_ACCOUNT_ID.');
} else {
  const sql = async (q: string) => {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: q });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    return ((await r.json()) as { data: Record<string, string | number>[] }).data;
  };
  const where = `WHERE timestamp > NOW() - INTERVAL '${DAYS}' DAY`;
  const rows = async (title: string, q: string) => { const m = new Map<string, number>(); (await sql(q)).forEach((r) => bump(m, String(r.k), Number(r.n))); show(title, m, 15); };
  console.log(`\n# Connector usage in the last ${DAYS} days`);
  await rows('Requests by kind and tool', `SELECT concat(blob1, ' ', blob2) AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob1 != 'initialize' GROUP BY k ORDER BY n DESC`);
  await rows('Outcomes of checks and explanations', `SELECT concat(blob2, ': ', blob3) AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob2 IN ('check_explanation', 'make_explanation', 'build_explanation', 'page') GROUP BY k ORDER BY n DESC`);
  await rows('Most common checker errors', `SELECT blob4 AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob4 != '' GROUP BY k ORDER BY n DESC LIMIT 15`);
  await rows('Clients that connected', `SELECT blob2 AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob1 = 'initialize' GROUP BY k ORDER BY n DESC`);
  await rows('Kinds of work asked about', `SELECT blob7 AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob7 != '' GROUP BY k ORDER BY n DESC`);
  await rows('Countries', `SELECT blob6 AS k, SUM(_sample_interval) AS n FROM ${DATASET} ${where} AND blob6 != '' GROUP BY k ORDER BY n DESC LIMIT 15`);
}
