// What people use the explanations and the connector for, in aggregate. Shared by the /insights page (through
// the Worker) and scripts/insights.ts. No browser APIs. Nothing here identifies a person.
import { checkExplain } from './explain';
import { nodeById } from './graph';

export type Count = [string, number];
export type StoredSummary = {
  total: number; kinds: Count[]; madeBy: Count[]; audiences: Count[]; concepts: Count[]; deepDives: Count[]; weeks: Count[];
  questions: { question: string; context: string; created?: string; passes: boolean }[];
};
export type UsageSummary = { requests: Count[]; outcomes: Count[]; errors: Count[]; clients: Count[]; kinds: Count[]; countries: Count[] };
export type ContactRow = { created: string; name: string; email: string; company: string; request: string; message: string; link?: string; context?: string; role?: string; question?: string };
export type Insights = { days: number; generated: string; stored: StoredSummary; usage?: UsageSummary; usageNote?: string; contacts?: ContactRow[] };

const tally = () => {
  const m = new Map<string, number>();
  return { add: (k: string, by = 1) => m.set(k, (m.get(k) ?? 0) + by), top: (n = 15): Count[] => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n) };
};

/** Summarizes stored explanations. The header is read directly, so explanations made under earlier rules still count. */
export const summarizeStored = (items: { code: string; created?: string }[]): StoredSummary => {
  const kinds = tally(), madeBy = tally(), audiences = tally(), concepts = tally(), dives = tally(), weeks = tally();
  const questions: StoredSummary['questions'] = [];
  for (const { code, created } of items) {
    // Counted as written; "passes" is against the current rules.
    const plan = checkExplain(code, { lenient: true }).plan;
    const passes = checkExplain(code).ok;
    const context = code.match(/^\s+context\s+(\S+)/m)?.[1] ?? 'unknown';
    kinds.add(context);
    audiences.add(code.match(/^\s+for\s+"([^"]*)"/m)?.[1] ?? '(not given)');
    madeBy.add(code.includes('Here is the problem you see, as the method describes it.') ? 'built on the site' : 'written by an agent');
    madeBy.add(passes ? 'passes the current rules' : 'fails the current rules');
    questions.push({ question: code.match(/^explain\s+"([^"]*)"/m)?.[1] ?? '(no question)', context, created, passes });
    if (created) { const d = new Date(created); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); weeks.add(d.toISOString().slice(0, 10)); }
    if (!plan) continue;
    plan.branches.forEach((b) => dives.add(b.label));
    new Set([...plan.segments, ...plan.branches.flatMap((b) => b.segments)].map((x) => x.trace?.node).filter((x): x is string => !!x && !x.includes(' ')))
      .forEach((id) => concepts.add(nodeById(id)?.label ?? id));
  }
  questions.sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''));
  return { total: items.length, kinds: kinds.top(), madeBy: madeBy.top(), audiences: audiences.top(), concepts: concepts.top(20), deepDives: dives.top(), weeks: weeks.top(30).sort((a, b) => a[0].localeCompare(b[0])), questions: questions.slice(0, 50) };
};

/** The Analytics Engine queries behind the usage summary, for a dataset and a number of days. */
export const usageQueries = (dataset: string, days: number): Record<keyof UsageSummary, string> => {
  const where = `WHERE timestamp > NOW() - INTERVAL '${Math.max(1, Math.min(365, Math.floor(days)))}' DAY`;
  return {
    requests: `SELECT concat(blob1, ' ', blob2) AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob1 != 'initialize' GROUP BY k ORDER BY n DESC LIMIT 20`,
    outcomes: `SELECT concat(blob2, ': ', blob3) AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob2 IN ('check_explanation', 'make_explanation', 'build_explanation', 'page') GROUP BY k ORDER BY n DESC LIMIT 20`,
    errors: `SELECT blob4 AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob4 != '' GROUP BY k ORDER BY n DESC LIMIT 15`,
    clients: `SELECT blob2 AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob1 = 'initialize' GROUP BY k ORDER BY n DESC LIMIT 15`,
    kinds: `SELECT blob7 AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob7 != '' GROUP BY k ORDER BY n DESC LIMIT 10`,
    countries: `SELECT blob6 AS k, SUM(_sample_interval) AS n FROM ${dataset} ${where} AND blob6 != '' GROUP BY k ORDER BY n DESC LIMIT 15`,
  };
};

/** Runs the usage queries through the Analytics Engine SQL API. */
export const fetchUsage = async (account: string, token: string, dataset: string, days: number): Promise<UsageSummary> => {
  const out = {} as UsageSummary;
  for (const [key, q] of Object.entries(usageQueries(dataset, days)) as [keyof UsageSummary, string][]) {
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: q });
    if (!r.ok) throw new Error(`usage query failed: ${r.status}`);
    out[key] = ((await r.json()) as { data: { k: string; n: number | string }[] }).data.map((x) => [String(x.k), Number(x.n)]);
  }
  return out;
};
