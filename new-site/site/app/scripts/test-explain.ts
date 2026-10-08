// The explanation language's case corpus: the domain rules, each with a known outcome.
// Run with: npx tsx scripts/test-explain.ts
import { checkExplain } from '../src/reel/explain';
import { EXPLAIN_EXAMPLES } from '../src/reel/explain-examples';

type Case = { name: string; code: string; ok: boolean; lenient?: boolean; expect?: { line: number; includes: string; severity?: 'error' | 'warning' }[]; traces?: string[] };
// A short explanation around a body: the method's starting step for the kind of work follows the body, then a
// caveat and the answer. Body lines start at L(layers); the start step is the line after the body.
const START: Record<string, string> = { brownfield: 'breeze-extract', greenfield: 'breeze-functional-first', 'legacy-modernization': 'asimov-discover' };
const X = (body: string, context = 'brownfield', layers = ['architecture']) =>
  ['explain "A question"', `  context ${context}`, ...layers.map((l) => `  layer ${l}`), body, `show ${START[context]}`, 'caveat graph-not-a-spec', 'answer "That is the answer."'].join('\n');
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
  { name: 'connect follows a link either way', code: X('show impact-analysis') + '\nbranch "The report"\nshow impact-report\nconnect impact-report to days-of-investigation', ok: true, traces: ["the method's link: Days of investigation before a change addressed by The impact report"] },
  { name: 'a legacy practice does not apply to live work', code: X('show target-state-graph'), ok: false, expect: [{ line: A, includes: 'the target has a graph of its own' }] },
  { name: 'live practices do not apply to legacy modernization', code: X('show kg-sync', 'legacy-modernization', []), ok: false, expect: [{ line: 3, includes: 'four-layer practices for live applications do not apply' }] },
  { name: 'the universal principles apply to legacy modernization', code: X('show validation-gates', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed') + '\nbranch "The gates"\nshow four-gates', ok: true },
  { name: 'recommendation must fit the kind of work', code: X('recommend choose-a-mode'), ok: false, expect: [{ line: A, includes: 'the content recommends: ' }] },
  { name: 'extraction is for an existing application', code: X('recommend extract-first', 'greenfield', []), ok: false, expect: [{ line: 3, includes: 'an existing application' }] },
  { name: 'compare is for live applications', code: X('compare code today with after', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: false, expect: [{ line: 3, includes: 'different shape' }] },
  { name: 'compare wants the graph shown first', code: X('compare architecture today with after'), ok: true, expect: [{ line: A, includes: 'Show "four-layer-graph"', severity: 'warning' }], traces: ['Architecture knowledge today', 'Architecture knowledge under the method'] },
  { name: 'the graph adds what a practice requires', code: X('show pr-validation'), ok: true, expect: [{ line: A, includes: 'builds on', severity: 'warning' }], traces: ['requires The impact report'] },
  { name: 'required concepts from another kind of work are not added', code: X('show legacy-experts-gone\nconnect legacy-experts-gone to source-state-graph', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed') + '\nbranch "The gates"\nshow four-gates', ok: true, traces: ['requires The parity contract'] },
  { name: 'a symptom shown should be addressed', code: X('show days-of-investigation'), ok: true, expect: [{ line: A, includes: 'nothing in this explanation addresses it', severity: 'warning' }] },
  { name: 'a layer nobody owns needs an owner', code: ['explain "Nobody keeps our architecture current."', '  context brownfield', '  unowned architecture', 'show documentation-decays', 'show kg-sync', 'show breeze-extract', 'caveat graph-not-a-spec', 'answer "A."'].join('\n'), ok: false, expect: [{ line: 8, includes: 'nobody owns the architecture layer' }] },
  { name: 'an owner shown satisfies the rule', code: ['explain "Nobody keeps our architecture current."', '  context brownfield', '  unowned architecture', 'show documentation-decays', 'connect documentation-decays to named-ownership', 'show layered-team', 'show breeze-extract', 'caveat graph-not-a-spec', 'answer "A."'].join('\n'), ok: true },
  { name: 'figures need their context', code: X('show brownfield-2m'), ok: true, expect: [{ line: A, includes: 'caveat results-in-context', severity: 'warning' }] },
  { name: 'a case from other work is a warning', code: X('show ui-workstream'), ok: true, expect: [{ line: A, includes: 'comes from a new application', severity: 'warning' }] },
  { name: 'name at least one limit', code: 'explain "Q"\n  context brownfield\nshow breeze-extract\nanswer "A."', ok: true, expect: [{ line: 4, includes: 'names no limit', severity: 'warning' }] },
  { name: 'out of scope is refused', code: X('deploy the graph'), ok: false, expect: [{ line: A, includes: 'cannot express "deploy"' }] },
  { name: 'near-miss move', code: X('shwo impact-analysis'), ok: false, expect: [{ line: A, includes: 'Did you mean "show"' }] },
  { name: 'nothing after the answer', code: 'explain "Q"\n  context brownfield\nshow impact-analysis\nanswer "A."\nshow kg-sync', ok: false, expect: [{ line: 5, includes: 'ends the short explanation' }] },
  { name: 'guide lines follow the writing rules: dashes', code: X('show impact-analysis\n  say "It runs first — every time."'), ok: false, expect: [{ line: A + 1, includes: 'dash' }] },
  { name: 'guide lines follow the writing rules: contrasts', code: X('show impact-analysis\n  say "It runs before coding rather than after."'), ok: true, expect: [{ line: A + 1, includes: 'contrast', severity: 'warning' }] },
  { name: 'say belongs under a move', code: 'explain "Q"\n  context brownfield\nsay "Hello."\nshow impact-analysis\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'lead-in', severity: 'error' }] },
  { name: 'read takes a page of the site', code: X('show impact-analysis') + '\n  read sdlc/agents#no-such-section', ok: false, expect: [{ line: A + 4, includes: 'not a page or section' }] },
  { name: 'read with a page and section', code: X('show impact-analysis') + '\n  read sdlc/agents#the-kg-sync-agent', ok: true },
  // Branching: a short explanation, then deep dives the person chooses.
  { name: 'a deep dive after the answer', code: X('show impact-analysis') + '\nbranch "How the check works"\nshow pr-validation', ok: true },
  { name: 'a deep dive needs the short answer first', code: 'explain "Q"\n  context brownfield\nshow impact-analysis\nbranch "More"\nshow pr-validation', ok: false, expect: [{ line: 4, includes: 'ends with "answer" before the first deep dive' }] },
  { name: 'a deep dive needs something from the film', code: X('show impact-analysis') + '\nbranch "Nothing here"\nanswer "A."', ok: false, expect: [{ line: A + 4, includes: 'shows nothing from the film' }] },
  { name: 'at most four deep dives', code: X('show impact-analysis') + [1, 2, 3, 4, 5].map((k) => `\nbranch "Dive ${k}"\nshow kg-sync`).join(''), ok: false, expect: [{ line: A + 12, includes: 'at most 4 deep dives' }] },
  { name: 'deep dive labels are unique', code: X('show impact-analysis') + '\nbranch "Same"\nshow kg-sync\nbranch "Same"\nshow pr-validation', ok: false, expect: [{ line: A + 6, includes: 'already a deep dive called' }] },
  { name: 'the short explanation is at most two minutes', code: X('show agents-make-mistakes\nshow days-of-investigation\nconnect days-of-investigation to impact-report\nshow pr-validation\nshow brownfield-2m\nshow kg-sync'), ok: false, expect: [{ line: 1, includes: 'the limit is 2 minutes' }] },
  { name: 'a deep dive is at most three minutes', code: X('show impact-analysis') + '\nbranch "Everything"\nshow agents-make-mistakes\nconnect days-of-investigation to impact-report\nshow pr-validation\nshow brownfield-2m\nshow kg-sync\nshow progressive-autonomy\nshow graph-per-product\nshow spec-sprint\nrecommend four-phases', ok: false, expect: [{ line: A + 4, includes: 'the limit is 3 minutes' }] },
  { name: 'a deep dive builds on the short explanation only', code: X('show impact-analysis') + '\nbranch "First"\nshow four-layer-graph\nbranch "Second"\nshow brownfield-extraction', ok: true, traces: ['added from the graph: Extraction from the existing application requires The four-layer graph'] },
  { name: 'a deep dive reuses what the short explanation showed', code: X('show knowledge-graph') + '\nbranch "Sync"\nshow kg-sync', ok: true, expect: [] },
  { name: 'a symptom in a deep dive is addressed there or in the short explanation', code: X('show pr-validation') + '\nbranch "Why it breaks"\nshow boundary-violations', ok: true },
  { name: 'an owner for an unowned layer belongs in the short explanation', code: ['explain "Nobody keeps our architecture current."', '  context brownfield', '  unowned architecture', 'show documentation-decays', 'show kg-sync', 'show breeze-extract', 'caveat graph-not-a-spec', 'answer "A."', 'branch "Owners"', 'show named-ownership'].join('\n'), ok: false, expect: [{ line: 10, includes: 'in the short explanation' }] },
  { name: 'an opening that only repeats the question is a warning', code: X('show impact-analysis').replace('explain "A question"', 'explain "Our coding agents keep breaking services that other teams own."\n  say "You said your coding agents keep breaking services other teams own."'), ok: true, expect: [{ line: 2, includes: 'echoes the question', severity: 'warning' }] },
  { name: 'a paraphrase of the question is a warning', code: X('show impact-analysis').replace('explain "A question"', 'explain "Our coding agents keep breaking services that other teams own."\n  say "You asked about agents breaking services other teams own. Two causes are at work."'), ok: true, expect: [{ line: 2, includes: 'echoes the question', severity: 'warning' }] },
  { name: 'an opening that names the problem passes', code: X('show impact-analysis').replace('explain "A question"', 'explain "Our coding agents keep breaking services that other teams own."\n  say "On large applications this is a common pattern. Two causes are at work, and the method answers both before any code is written."'), ok: true, expect: [] },
  { name: 'an answer that repeats the question is a warning', code: X('show impact-analysis').replace('explain "A question"', 'explain "Our coding agents keep breaking services that other teams own."').replace('answer "That is the answer."', 'answer "Your coding agents keep breaking services other teams own because nothing checks them."'), ok: true, expect: [{ line: A + 3, includes: 'the answer repeats the question', severity: 'warning' }] },
  { name: 'no deep dives is a warning', code: X('show impact-analysis'), ok: true, expect: [{ line: A + 3, includes: 'offers no deep dives', severity: 'warning' }] },
  // The method's own approach: where it starts, its order, and the platform that runs each kind of work.
  { name: 'the short explanation shows where the method starts', code: 'explain "Q"\n  context legacy-modernization\nshow legacy-experts-gone\nshow parity-contract\ncaveat contract-fixed\nanswer "A."', ok: false, expect: [{ line: 6, includes: 'does not show where the method starts for a legacy modernization' }] },
  { name: 'the starting step in a deep dive only is not enough', code: 'explain "Q"\n  context legacy-modernization\nshow legacy-experts-gone\ncaveat contract-fixed\nanswer "A."\nbranch "How it starts"\nshow asimov-discover', ok: false, expect: [{ line: 5, includes: 'does not show where the method starts' }] },
  { name: 'an existing application starts with extraction', code: 'explain "Q"\n  context brownfield\nshow pr-validation\ncaveat graph-not-a-spec\nanswer "A."', ok: false, expect: [{ line: 5, includes: 'show breeze-extract' }] },
  { name: '"start with" about something else is a warning', code: X('show legacy-experts-gone\n  say "Start with the people, because most estates share this."', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: true, expect: [{ line: 4, includes: 'the method starts with asimov-discover', severity: 'warning' }] },
  { name: '"start with" about the starting step is fine', code: 'explain "Q"\n  context legacy-modernization\nshow asimov-discover\n  say "Start with the code itself, which becomes a graph of the old system."\ncaveat contract-fixed\nanswer "A."', ok: true, expect: [] },
  { name: 'steps follow the method\'s order', code: 'explain "Q"\n  context legacy-modernization\nshow asimov-discover\nshow asimov-validate\nshow asimov-document\ncaveat contract-fixed\nanswer "A."', ok: true, expect: [{ line: 5, includes: 'comes before "asimov-validate" in the method', severity: 'warning' }] },
  { name: 'a Breeze.AI step does not apply to legacy modernization', code: X('show breeze-check', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: false, expect: [{ line: 3, includes: 'four-layer practices for live applications do not apply' }] },
  { name: 'an ASIMOV step does not apply to an existing application', code: X('show asimov-validate'), ok: false, expect: [{ line: A, includes: 'belongs to legacy modernization' }] },
  { name: 'naming ASIMOV in a Breeze.AI explanation is an error', code: X('show impact-analysis\n  say "ASIMOV checks every change."'), ok: false, expect: [{ line: A + 1, includes: 'names ASIMOV' }] },
  { name: 'naming Breeze.AI in a legacy explanation is a warning', code: X('show four-gates\n  say "Breeze.AI checks every module."', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: true, expect: [{ line: 4, includes: 'names Breeze.AI', severity: 'warning' }] },
  { name: 'an ASIMOV practice adds no Breeze.AI moments', code: X('show four-gates', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: true },
  { name: 'a problem of live applications is not shown in a legacy modernization', code: X('show specs-fall-short', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: false, expect: [{ line: 3, includes: 'holds for a new application and an existing application' }] },
  { name: 'the Manual Translation Tax belongs to live applications', code: X('show manual-translation-tax', 'legacy-modernization', []).replace('caveat graph-not-a-spec', 'caveat contract-fixed'), ok: false, expect: [{ line: 3, includes: 'holds for' }] },
  // Samples: an illustration of an artefact the method produces, written by the agent.
  { name: 'a sample passes', code: X('show impact-report\nsample impact-report "Your alert change"\n  line "functional  outcome  weekly alerts"\n  line "code        worker   daily-digest"\n  note 2 "The worker in another repository is found before coding."\n  reject "service  billing" "Nothing links billing to this change."'), ok: true, traces: ['an illustration written by the agent'] },
  { name: 'a sample needs an artefact the method produces', code: X('show kg-sync\nsample kg-sync "Sync"\n  line "x"'), ok: false, expect: [{ line: A + 1, includes: 'has no sample' }] },
  { name: 'a sample comes after its concept is shown', code: X('sample impact-report "Report"\n  line "x"'), ok: false, expect: [{ line: A, includes: 'show impact-report before its sample' }] },
  { name: 'a sample needs lines', code: X('show impact-report\nsample impact-report "Report"'), ok: false, expect: [{ line: A + 1, includes: 'has no lines' }] },
  { name: 'a note points at a line', code: X('show impact-report\nsample impact-report "Report"\n  line "x"\n  note 3 "Nothing there."'), ok: false, expect: [{ line: A + 3, includes: 'no line 3 to note' }] },
  { name: 'sample lines fit the card', code: X('show impact-report\nsample impact-report "Report"\n  line "' + 'x'.repeat(57) + '"'), ok: false, expect: [{ line: A + 2, includes: 'at most 56' }] },
  { name: 'one sample per part', code: X('show impact-report\nsample impact-report "One"\n  line "x"\nsample impact-report "Two"\n  line "y"'), ok: false, expect: [{ line: A + 3, includes: 'already has a sample' }] },
  { name: 'one rejected line', code: X('show impact-report\nsample impact-report "Report"\n  line "x"\n  reject "y" "No."\n  reject "z" "No."'), ok: false, expect: [{ line: A + 4, includes: 'one rejected line' }] },
  { name: 'a line belongs to a sample', code: X('show impact-report\n  line "x"'), ok: false, expect: [{ line: A + 1, includes: 'goes indented under a "sample"' }] },
  { name: 'a legacy sample does not fit live work', code: X('show impact-report\nsample four-decisions "Modules"\n  line "x"'), ok: false, expect: [{ line: A + 1, includes: 'holds for a legacy modernization' }] },
  { name: 'an older explanation plays when checked leniently', code: 'explain "Q"\n  context legacy-modernization\nshow legacy-experts-gone\ncaveat contract-fixed\nanswer "A."', ok: true, lenient: true, expect: [{ line: 5, includes: 'does not show where the method starts', severity: 'warning' }] },
  { name: 'shows nothing from the film', code: 'explain "Q"\n  context brownfield\nanswer "A."', ok: false, expect: [{ line: 3, includes: 'does not show where the method starts' }] },
];

let failed = 0;
for (const c of CASES) {
  const r = checkExplain(c.code, { lenient: c.lenient });
  const why: string[] = [];
  if (r.ok !== c.ok) why.push(`expected ok=${c.ok}, got ok=${r.ok}: ${r.problems.map((p) => `${p.line} ${p.severity}: ${p.message}`).join(' | ')}`);
  if (c.expect && !c.expect.length && r.problems.some((p) => /question/.test(p.message))) why.push(`expected no problem about the question; got ${JSON.stringify(r.problems.map((p) => p.message))}`);
  for (const e of c.expect ?? []) if (!r.problems.some((p) => p.line === e.line && p.message.includes(e.includes) && (!e.severity || p.severity === e.severity))) why.push(`missing ${e.severity ?? 'problem'} on line ${e.line} containing "${e.includes}"; got ${JSON.stringify(r.problems.map((p) => [p.line, p.severity, p.message]))}`);
  const allSegments = r.plan ? [...r.plan.segments, ...r.plan.branches.flatMap((b) => b.segments)] : [];
  for (const t of c.traces ?? []) if (!allSegments.some((s) => s.trace?.reason?.includes(t))) why.push(`no segment traced "${t}"`);
  if (c.name.includes('adds no Breeze.AI moments') && r.plan) {
    const outside = [...r.plan.segments, ...r.plan.branches.flatMap((b) => b.segments)].filter((x) => x.kind === 'clip' && (x.scene < 22 || x.scene > 26));
    if (outside.length) why.push(`clips outside the modernization act: ${outside.map((x) => x.kind === 'clip' ? x.scene : '').join(', ')}`);
  }
  if (why.length) { failed++; console.log(`FAIL ${c.name}\n  ${why.join('\n  ')}`); }
}
console.log(`${CASES.length - failed} of ${CASES.length} explanation cases pass`);
for (const e of EXPLAIN_EXAMPLES) { const r = checkExplain(e.code); if (r.plan) console.log(`  ${e.title}: ${Math.round(r.plan.seconds)} s, then ${r.plan.branches.map((b) => `${Math.round(b.seconds)} s`).join(', ')}; ${r.problems.length} warnings`); }
process.exit(failed ? 1 : 0);
