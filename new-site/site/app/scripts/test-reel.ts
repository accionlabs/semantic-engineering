// The reel language's case corpus: reels with known outcomes. Run with: npx tsx scripts/test-reel.ts
import { checkReel } from '../src/reel/language';
import { EXAMPLES } from '../src/reel/examples';

type Case = { name: string; code: string; ok: boolean; expect?: { line: number; includes: string }[]; segments?: number };
const R = (body: string) => `reel "A question"\n${body}\nclose "That is the answer."`;

const CASES: Case[] = [
  ...EXAMPLES.map((e) => ({ name: `example: ${e.title}`, code: e.code, ok: true })),
  { name: 'a scene and a close', code: R('play scene 5'), ok: true, segments: 2 },
  { name: 'part of a scene', code: R('play scene 12 sentences 2-4'), ok: true },
  { name: 'an act expands to its scenes', code: R('play act 3'), ok: true, segments: 5 },
  { name: 'a layer is today, then after', code: R('play layer bill'), ok: true, segments: 3 },
  { name: 'must start with reel', code: 'play scene 5', ok: false, expect: [{ line: 1, includes: 'starts with: reel' }] },
  { name: 'question in quotes', code: 'reel How does this work?\nplay scene 1', ok: false, expect: [{ line: 1, includes: 'double quotes' }] },
  { name: 'no such scene', code: R('play scene 40'), ok: false, expect: [{ line: 2, includes: 'no scene 40' }] },
  { name: 'sentences past the end', code: R('play scene 10 sentences 2-9'), ok: false, expect: [{ line: 2, includes: 'has 6 sentences' }] },
  { name: 'element misspelt', code: R('hold scene 12 at sentence 6 on line.mtt'), ok: false, expect: [{ line: 2, includes: 'Did you mean "line.mt"' }] },
  { name: 'element not on screen then', code: R('hold scene 10 at sentence 1 on bill.seat'), ok: false, expect: [{ line: 2, includes: 'not on screen at sentence 1' }] },
  { name: 'hold too long', code: R('hold scene 12 at sentence 6 for 30s'), ok: false, expect: [{ line: 2, includes: 'from 1 to 12 seconds' }] },
  { name: 'layer misspelt', code: R('play layer onbording'), ok: false, expect: [{ line: 2, includes: 'Did you mean "onboarding"' }] },
  { name: 'no such section', code: R('play scene 5\n  highlight 44'), ok: false, expect: [{ line: 3, includes: 'no section 44' }] },
  { name: 'no such paragraph', code: R('play scene 5\n  highlight 4.1 para 9'), ok: false, expect: [{ line: 3, includes: 'no paragraph 9' }] },
  { name: 'highlight needs a clip', code: 'reel "Q"\nintro "Hello."\n  highlight 4\nplay scene 5', ok: false, expect: [{ line: 3, includes: 'indented under a "play" or "hold"' }] },
  { name: 'say needs a hold', code: R('play scene 5\n  say "Look at this."'), ok: false, expect: [{ line: 3, includes: 'indented under a "hold"' }] },
  { name: 'out of scope', code: R('animate a new diagram of the stack'), ok: false, expect: [{ line: 2, includes: 'cannot express "animate"' }] },
  { name: 'near-miss statement', code: R('plya scene 5'), ok: false, expect: [{ line: 2, includes: 'Did you mean "play"' }] },
  { name: 'no web addresses in host lines', code: 'reel "Q"\nintro "See example.com for more."\nplay scene 5', ok: false, expect: [{ line: 2, includes: 'web address' }] },
  { name: 'no dashes in host lines', code: 'reel "Q"\nintro "The line moves — and that changes everything."\nplay scene 5', ok: false, expect: [{ line: 2, includes: 'dash' }] },
  { name: 'contrast is a warning', code: 'reel "Q"\nintro "It is not about code, but about the line."\nplay scene 5\nclose "Done."', ok: true, expect: [{ line: 2, includes: '"not this, but that"' }] },
  { name: 'host line too long', code: `reel "Q"\nintro "${'word '.repeat(60).trim()}"\nplay scene 5`, ok: false, expect: [{ line: 2, includes: 'the limit is 240' }] },
  { name: 'nothing after close', code: 'reel "Q"\nplay scene 5\nclose "Done."\nplay scene 6', ok: false, expect: [{ line: 4, includes: 'ends the reel' }] },
  { name: 'read belongs to close', code: R('play scene 5\n  read 4'), ok: false, expect: [{ line: 3, includes: 'indented under "close"' }] },
  { name: 'no scenes at all', code: 'reel "Q"\nintro "Hello."\nclose "Bye."', ok: false, expect: [{ line: 3, includes: 'plays no scenes' }] },
];

let failed = 0;
for (const c of CASES) {
  const r = checkReel(c.code);
  const why: string[] = [];
  if (r.ok !== c.ok) why.push(`expected ok=${c.ok}, got ok=${r.ok}: ${r.problems.map((p) => `${p.line}: ${p.message}`).join(' | ')}`);
  for (const e of c.expect ?? []) if (!r.problems.some((p) => p.line === e.line && p.message.includes(e.includes))) why.push(`missing problem on line ${e.line} containing "${e.includes}"; got ${JSON.stringify(r.problems.map((p) => [p.line, p.message]))}`);
  if (c.segments !== undefined && r.plan?.segments.length !== c.segments) why.push(`expected ${c.segments} segments, got ${r.plan?.segments.length}`);
  if (c.ok && r.plan && !(r.plan.seconds > 0)) why.push('plan has no length');
  if (why.length) { failed++; console.log(`FAIL ${c.name}\n  ${why.join('\n  ')}`); }
}
console.log(`${CASES.length - failed} of ${CASES.length} cases pass`);
for (const e of EXAMPLES) { const p = checkReel(e.code).plan; if (p) console.log(`  ${e.title}: ${p.segments.length} segments, ${Math.round(p.seconds)} s`); }
process.exit(failed ? 1 : 0);
