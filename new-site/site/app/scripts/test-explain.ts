// The explanation language's case corpus: the domain rules, each with a known outcome.
// Run with: npx tsx scripts/test-explain.ts
import { checkExplain } from '../src/reel/explain';
import { EXPLAIN_EXAMPLES } from '../src/reel/explain-examples';

type Case = { name: string; code: string; ok: boolean; expect?: { line: number; includes: string; severity?: 'error' | 'warning' }[]; traces?: string[] };
const X = (body: string, context = 'brownfield', layers = ['onboarding']) =>
  ['explain "A question"', `  context ${context}`, ...layers.map((l) => `  layer ${l}`), body, 'answer "That is the answer."'].join('\n');
const L = (layers: string[]) => 3 + layers.length; // the line the body starts on

const CASES: Case[] = [
  ...EXPLAIN_EXAMPLES.map((e) => ({ name: `example: ${e.title}`, code: e.code, ok: true })),
  { name: 'dry run: a dealer ERP, written from the reference alone', code: "explain \"Onboarding a new dealer takes about six months, errors show up after go-live, and special requests end up as custom code.\"\n  for \"the product lead at a dealer-management ERP company\"\n  context brownfield\n  layer onboarding\n  layer business-rules\n  say \"You described three problems: six months to onboard a dealer, errors after go-live, and special requests that turn into custom code. The paper sees all three.\"\n\nshow months-to-go-live\n  say \"Start with the six months. The paper sees the same across enterprise software.\"\n\nshow errors-after-go-live\n  say \"The errors after go-live have a specific cause.\"\n\nshow special-cases-in-shared-code\n  say \"And the custom code for one dealer has a cost every other dealer carries.\"\n\nshow line-moves-down\n  say \"All three trace back to one design choice: where the line between what every dealer shares and what each dealer gets sits.\"\n\nshow onboarding-as-document\n  say \"For onboarding, the paper's answer is one checked document for each dealer.\"\n\nshow on2go\n  say \"This has been tried on a dealer-management ERP like yours, on test data so far.\"\n\nconnect special-cases-in-shared-code to rules-over-invariants\n  say \"Special requests get their own place too: each dealer's rules, written over what every dealer shares.\"\n\nrecommend onboarding-first\n  say \"For a product with dealers already on it, the paper says where to begin.\"\n\ncaveat errors-inside-language\n\nanswer \"Take onboarding first: describe each dealer's setup as a checked document, so errors are caught before go-live. Later, move special requests into each dealer's own rules.\"\n  read 6\n", ok: true, expect: [{ line: 20, includes: 'builds on 4 principles', severity: 'warning' }] },
  { name: 'starts with explain', code: 'show months-to-go-live', ok: false, expect: [{ line: 1, includes: 'starts with: explain' }] },
  { name: 'context is required', code: 'explain "Q"\nshow months-to-go-live\nanswer "A."', ok: false, expect: [{ line: 1, includes: 'context brownfield' }] },
  { name: 'unknown concept, near miss', code: X('show months-to-golive'), ok: false, expect: [{ line: L(['onboarding']), includes: 'Did you mean "months-to-go-live"' }] },
  { name: 'wrong kind for the move', code: X('show onboarding-first'), ok: false, expect: [{ line: L(['onboarding']), includes: 'Use "recommend onboarding-first"' }] },
  { name: 'symptom outside the problem area', code: X('show cross-tenant-defects'), ok: false, expect: [{ line: L(['onboarding']), includes: 'not in this problem area' }] },
  { name: 'no problem area means any layer', code: X('show cross-tenant-defects\nshow rules-over-invariants', 'brownfield', []), ok: true },
  { name: 'connect needs a link in the graph', code: X('show months-to-go-live\nconnect months-to-go-live to screen-grammar'), ok: false, expect: [{ line: L(['onboarding']) + 1, includes: 'does not link' }] },
  { name: 'connect along a link', code: X('show months-to-go-live\nconnect months-to-go-live to onboarding-as-document'), ok: true },
  { name: 'greenfield cannot take onboarding-first', code: X('recommend onboarding-first', 'greenfield', []), ok: false, expect: [{ line: 3, includes: 'not the paper\'s advice for a greenfield product' }] },
  { name: 'brownfield cannot take bottom-up', code: X('recommend bottom-up'), ok: false, expect: [{ line: L(['onboarding']), includes: 'it recommends: top-down' }] },
  { name: 'a brownfield principle in greenfield', code: X('show deep-layers-stay', 'greenfield', []), ok: false, expect: [{ line: 3, includes: 'principle for brownfield products' }] },
  { name: 'the other direction\'s case is a warning', code: X('show wadi\nshow agents-write'), ok: true, expect: [{ line: L(['onboarding']), includes: 'greenfield case', severity: 'warning' }] },
  { name: 'unaddressed symptom is a warning', code: X('show months-to-go-live'), ok: true, expect: [{ line: L(['onboarding']), includes: 'nothing in this explanation addresses it', severity: 'warning' }] },
  { name: 'compare before the line moves is a warning', code: X('compare onboarding today with after'), ok: true, expect: [{ line: L(['onboarding']), includes: 'Show "line-moves-down" first', severity: 'warning' }] },
  { name: 'required principles come from the graph', code: X('show agents-write', 'brownfield', []), ok: true, traces: ['requires A language over the invariants', 'requires The knowledge graph as the inventory', 'requires The invariants are the core value'] },
  { name: 'out of scope is refused', code: X('animate the pricing'), ok: false, expect: [{ line: L(['onboarding']), includes: 'cannot express "animate"' }] },
  { name: 'near-miss move', code: X('shwo months-to-go-live'), ok: false, expect: [{ line: L(['onboarding']), includes: 'Did you mean "show"' }] },
  { name: 'nothing after the answer', code: 'explain "Q"\n  context brownfield\nshow months-to-go-live\nanswer "A."\nshow errors-after-go-live', ok: false, expect: [{ line: 5, includes: 'ends the explanation' }] },
  { name: 'guide lines follow the writing rules', code: X('show months-to-go-live\n  say "It takes months — every time."'), ok: false, expect: [{ line: L(['onboarding']) + 1, includes: 'dash' }] },
  { name: 'say belongs under a move', code: 'explain "Q"\n  context brownfield\nsay "Hello."\nshow months-to-go-live\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'lead-in', severity: 'error' }] },
  { name: 'show nothing from the video', code: 'explain "Q"\n  context brownfield\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'shows nothing from the video' }] },
];

let failed = 0;
for (const c of CASES) {
  const r = checkExplain(c.code);
  const why: string[] = [];
  if (r.ok !== c.ok) why.push(`expected ok=${c.ok}, got ok=${r.ok}: ${r.problems.map((p) => `${p.line} ${p.severity}: ${p.message}`).join(' | ')}`);
  for (const e of c.expect ?? []) if (!r.problems.some((p) => p.line === e.line && p.message.includes(e.includes) && (!e.severity || p.severity === e.severity))) why.push(`missing ${e.severity ?? 'problem'} on line ${e.line} containing "${e.includes}"; got ${JSON.stringify(r.problems.map((p) => [p.line, p.severity, p.message]))}`);
  for (const t of c.traces ?? []) if (!r.plan?.segments.some((s) => s.trace?.reason?.includes(t))) why.push(`no segment traced "${t}"`);
  if (why.length) { failed++; console.log(`FAIL ${c.name}\n  ${why.join('\n  ')}`); }
}
console.log(`${CASES.length - failed} of ${CASES.length} explanation cases pass`);
for (const e of EXPLAIN_EXAMPLES) { const r = checkExplain(e.code); if (r.plan) console.log(`  ${e.title}: ${r.plan.segments.length} segments, ${Math.round(r.plan.seconds)} s, ${r.problems.length} warnings`); }
process.exit(failed ? 1 : 0);
