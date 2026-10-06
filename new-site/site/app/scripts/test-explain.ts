// The explanation language's case corpus: the domain rules, each with a known outcome.
// Run with: npx tsx scripts/test-explain.ts
import { checkExplain } from '../src/reel/explain';
import { EXPLAIN_EXAMPLES } from '../src/reel/explain-examples';

type Case = { name: string; code: string; ok: boolean; expect?: { line: number; includes: string; severity?: 'error' | 'warning' }[]; traces?: string[] };
const X = (body: string, context = 'brownfield', layers = ['architecture']) =>
  ['explain "A question"', `  context ${context}`, ...layers.map((l) => `  layer ${l}`), body, 'caveat graph-not-a-spec', 'answer "That is the answer."'].join('\n');
const L = (layers: string[]) => 3 + layers.length; // the line the body starts on
const A = L(['architecture']);

const CASES: Case[] = [
  ...EXPLAIN_EXAMPLES.map((e) => ({ name: `example: ${e.title}`, code: e.code, ok: true })),
  { name: 'starts with explain', code: 'show days-of-investigation', ok: false, expect: [{ line: 1, includes: 'starts with: explain' }] },
  { name: 'the kind of work is required', code: 'explain "Q"\nshow days-of-investigation\nanswer "A."', ok: false, expect: [{ line: 1, includes: 'context greenfield' }] },
  { name: 'unknown concept, near miss', code: X('show days-of-investigaton'), ok: false, expect: [{ line: A, includes: 'Did you mean "days-of-investigation"' }] },
  { name: 'wrong kind for the move', code: X('show extract-first'), ok: false, expect: [{ line: A, includes: 'Use "recommend extract-first"' }] },
  { name: 'a limit is a caveat', code: X('show graph-not-a-spec'), ok: false, expect: [{ line: A, includes: 'Use "caveat graph-not-a-spec"' }] },
  { name: 'symptom outside the problem area', code: X('show design-duplication'), ok: false, expect: [{ line: A, includes: 'not in this problem area' }] },
  { name: 'a cross-cutting symptom fits any problem area', code: X('show no-faster-delivery\nshow impact-analysis'), ok: true },
  { name: 'no problem area means any layer', code: X('show design-duplication\nshow pr-validation', 'greenfield', []), ok: true },
  { name: 'connect needs a link in the graph', code: X('show days-of-investigation\nconnect days-of-investigation to bdd-generation'), ok: false, expect: [{ line: A + 1, includes: 'does not link' }] },
  { name: 'connect follows a link either way', code: X('show impact-report\nconnect impact-report to days-of-investigation'), ok: true, traces: ["the method's link: Days of investigation before a change addressed by The impact report"] },
  { name: 'a legacy practice does not apply to live work', code: X('show target-state-graph'), ok: false, expect: [{ line: A, includes: 'the target has a graph of its own' }] },
  { name: 'live practices do not apply to legacy modernization', code: X('show kg-sync', 'legacy-modernization', []), ok: false, expect: [{ line: 3, includes: 'four-layer practices for live applications do not apply' }] },
  { name: 'the universal principles apply to legacy modernization', code: X('show validation-gates\nshow four-gates', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: true },
  { name: 'recommendation must fit the kind of work', code: X('recommend choose-a-mode'), ok: false, expect: [{ line: A, includes: 'the content recommends: ' }] },
  { name: 'extraction is for an existing application', code: X('recommend extract-first', 'greenfield', []), ok: false, expect: [{ line: 3, includes: 'an existing application' }] },
  { name: 'compare is for live applications', code: X('compare code today with after', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: false, expect: [{ line: 3, includes: 'different shape' }] },
  { name: 'compare wants the graph shown first', code: X('compare architecture today with after'), ok: true, expect: [{ line: A, includes: 'Show "four-layer-graph"', severity: 'warning' }], traces: ['Architecture knowledge today', 'Architecture knowledge under the method'] },
  { name: 'the graph adds what a practice requires', code: X('show pr-validation'), ok: true, expect: [{ line: A, includes: 'builds on', severity: 'warning' }], traces: ['requires A check on every change'] },
  { name: 'required concepts from another kind of work are not added', code: X('show four-gates', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: true, traces: ['requires The parity contract'] },
  { name: 'a symptom shown should be addressed', code: X('show days-of-investigation'), ok: true, expect: [{ line: A, includes: 'nothing in this explanation addresses it', severity: 'warning' }] },
  { name: 'a layer nobody owns needs an owner', code: ['explain "Nobody keeps our architecture current."', '  context brownfield', '  unowned architecture', 'show documentation-decays', 'show kg-sync', 'caveat graph-not-a-spec', 'answer "A."'].join('\n'), ok: false, expect: [{ line: 7, includes: 'nobody owns the architecture layer' }] },
  { name: 'an owner shown satisfies the rule', code: ['explain "Nobody keeps our architecture current."', '  context brownfield', '  unowned architecture', 'show documentation-decays', 'connect documentation-decays to named-ownership', 'show layered-team', 'caveat graph-not-a-spec', 'answer "A."'].join('\n'), ok: true },
  { name: 'figures need their context', code: X('show brownfield-2m'), ok: true, expect: [{ line: A, includes: 'caveat results-in-context', severity: 'warning' }] },
  { name: 'a case from other work is a warning', code: X('show ui-workstream'), ok: true, expect: [{ line: A, includes: 'comes from a new application', severity: 'warning' }] },
  { name: 'name at least one limit', code: 'explain "Q"\n  context brownfield\nshow impact-analysis\nanswer "A."', ok: true, expect: [{ line: 4, includes: 'names no limit', severity: 'warning' }] },
  { name: 'out of scope is refused', code: X('deploy the graph'), ok: false, expect: [{ line: A, includes: 'cannot express "deploy"' }] },
  { name: 'near-miss move', code: X('shwo impact-analysis'), ok: false, expect: [{ line: A, includes: 'Did you mean "show"' }] },
  { name: 'nothing after the answer', code: 'explain "Q"\n  context brownfield\nshow impact-analysis\nanswer "A."\nshow kg-sync', ok: false, expect: [{ line: 5, includes: 'ends the explanation' }] },
  { name: 'guide lines follow the writing rules: dashes', code: X('show impact-analysis\n  say "It runs first — every time."'), ok: false, expect: [{ line: A + 1, includes: 'dash' }] },
  { name: 'guide lines follow the writing rules: contrasts', code: X('show impact-analysis\n  say "It runs before coding rather than after."'), ok: true, expect: [{ line: A + 1, includes: 'contrast', severity: 'warning' }] },
  { name: 'say belongs under a move', code: 'explain "Q"\n  context brownfield\nsay "Hello."\nshow impact-analysis\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'lead-in', severity: 'error' }] },
  { name: 'read takes a page of the site', code: X('show impact-analysis') + '\n  read sdlc/agents#no-such-section', ok: false, expect: [{ line: A + 3, includes: 'not a page or section' }] },
  { name: 'read with a page and section', code: X('show impact-analysis') + '\n  read sdlc/agents#the-kg-sync-agent', ok: true },
  { name: 'shows nothing from the film', code: 'explain "Q"\n  context brownfield\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'shows nothing from the film' }] },
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
