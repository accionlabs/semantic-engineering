// Checks the knowledge graph against the film and the pages it cites. Run with: npx tsx scripts/test-graph.ts
import { EDGES, NODES, nodeById, type Evidence } from '../src/reel/graph';
import { placeProblem, sceneByN } from '../src/reel/vocab';
import { methodFor } from '../src/reel/tools';

const problems: string[] = [];
const ids = new Set<string>();
NODES.forEach((x) => { if (ids.has(x.id)) problems.push(`duplicate node ${x.id}`); ids.add(x.id); if (!/^[a-z0-9-]+$/.test(x.id)) problems.push(`node id "${x.id}" is not kebab-case`); });

const checkEvidence = (ev: Evidence | undefined, where: string, required = true) => {
  if (required && !ev?.video?.length && !ev?.pages?.length) problems.push(`${where}: no evidence`);
  for (const v of ev?.video ?? []) {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/);
    const s = m && sceneByN(Number(m[1]));
    if (!m || !s) { problems.push(`${where}: video "${v}" is not a scene.sentence reference to scenes 1 to 30`); continue; }
    const a = Number(m[2]), b = Number(m[3] ?? m[2]);
    if (a < 1 || b > s.sentences.length || a > b) problems.push(`${where}: video "${v}" is outside scene ${s.n}, which has ${s.sentences.length} sentences`);
  }
  for (const p of ev?.pages ?? []) { const why = placeProblem(p); if (why) problems.push(`${where}: ${why}`); }
};

const layers = NODES.filter((x) => x.kind === 'layer').map((x) => x.id);
const contexts = NODES.filter((x) => x.kind === 'context').map((x) => x.id);
for (const x of NODES) {
  checkEvidence(x.evidence, x.id);
  if (x.kind === 'symptom' && x.layer && !layers.includes(x.layer)) problems.push(`${x.id}: layer "${x.layer}" is not a layer`);
  if (x.kind === 'layer') { if (!x.custodian) problems.push(`${x.id}: a layer names its custodian`); checkEvidence(x.today, `${x.id} today`); checkEvidence(x.after, `${x.id} after`); }
  (x.contexts ?? []).forEach((c) => { if (!contexts.includes(c)) problems.push(`${x.id}: context "${c}" is not a context`); });
}
for (const e of EDGES) {
  const where = `${e.from} ${e.rel} ${e.to}`;
  if (!nodeById(e.from)) problems.push(`${where}: no node "${e.from}"`);
  if (!nodeById(e.to)) problems.push(`${where}: no node "${e.to}"`);
  checkEvidence(e.why, where);
  if (EDGES.filter((y) => y.from === e.from && y.rel === e.rel && y.to === e.to).length > 1) problems.push(`${where}: listed twice`);
  const a = nodeById(e.from), b = nodeById(e.to);
  if (a && b) {
    const ok: Record<string, [string[], string[]]> = {
      'part-of': [['cause'], ['cause']], 'caused-by': [['symptom', 'cause'], ['cause']],
      'addressed-by': [['symptom', 'cause'], ['principle', 'practice', 'recommendation', 'step']],
      requires: [['principle', 'practice'], ['principle', 'practice']], 'limited-by': [['principle', 'practice', 'case', 'step'], ['limit']],
      'shown-in': [['principle', 'practice', 'recommendation', 'step'], ['case']], 'applies-to': [['recommendation'], ['context']],
      precedes: [['step'], ['step']], uses: [['step'], ['practice']], 'runs-on': [['context'], ['platform']],
    };
    const [f, t] = ok[e.rel];
    if (!f.includes(a.kind) || !t.includes(b.kind)) problems.push(`${where}: "${e.rel}" links a ${f.join('/')} to a ${t.join('/')}, found ${a.kind} to ${b.kind}`);
    // A link must not cross kinds of work: a practice for legacy modernization cannot address a symptom of live work.
    if (a.contexts && b.contexts && !a.contexts.some((c) => b.contexts!.includes(c))) problems.push(`${where}: the two concepts share no kind of work`);
  }
}
for (const x of NODES.filter((y) => y.kind === 'symptom')) if (!EDGES.some((e) => e.from === x.id && e.rel === 'addressed-by')) problems.push(`symptom ${x.id}: nothing addresses it`);
// A symptom without a cause is allowed where the content names none; listed for the author's review.
const uncaused = NODES.filter((y) => y.kind === 'symptom' && !EDGES.some((e) => e.from === y.id && e.rel === 'caused-by')).map((y) => y.id);
for (const x of NODES.filter((y) => y.kind === 'practice')) if (!EDGES.some((e) => (e.to === x.id && ['addressed-by', 'requires', 'uses'].includes(e.rel)) || (e.from === x.id && e.rel === 'requires'))) problems.push(`practice ${x.id}: unconnected`);

// Platforms: every concept for some kinds of work belongs to the platform that runs them, and nothing mixes them.
const platformOf: Record<string, string> = Object.fromEntries(EDGES.filter((e) => e.rel === 'runs-on').map((e) => [e.from, e.to]));
for (const c of contexts) if (!platformOf[c]) problems.push(`context ${c}: no platform runs it`);
// Problems (causes and symptoms) belong to kinds of work and to no platform.
for (const x of NODES.filter((y) => y.contexts && !['context', 'platform', 'cause', 'symptom'].includes(y.kind))) {
  if (!x.platform) { problems.push(`${x.id}: holds for ${x.contexts!.join(', ')} and names no platform`); continue; }
  const legacyOnly = x.contexts!.every((c) => c === 'legacy-modernization');
  const liveOnly = !x.contexts!.includes('legacy-modernization');
  if (legacyOnly && x.platform !== 'asimov') problems.push(`${x.id}: legacy modernization runs on ASIMOV, and this names ${x.platform}`);
  if (liveOnly && x.platform !== 'breeze-ai') problems.push(`${x.id}: new and existing applications run on Breeze.AI, and this names ${x.platform}`);
}
for (const x of NODES.filter((y) => y.platform && !y.contexts)) problems.push(`${x.id}: names a platform and no kinds of work`);

// The method's steps: in order, one starting step for each kind of work, every step reachable from a start.
const steps = NODES.filter((y) => y.kind === 'step');
for (const x of steps) { if (!x.order || !x.platform || !x.contexts) problems.push(`step ${x.id}: needs an order, a platform and its kinds of work`); }
for (const c of contexts) {
  const starts = steps.filter((x) => x.start && x.contexts?.includes(c as never));
  if (starts.length !== 1) problems.push(`context ${c}: needs exactly one starting step, found ${starts.length}`);
}
for (const e of EDGES.filter((y) => y.rel === 'precedes')) { const a = nodeById(e.from), b = nodeById(e.to); if (a && b && (a.order ?? 0) >= (b.order ?? 0)) problems.push(`${e.from} precedes ${e.to}: the order numbers do not increase`); }
const reach = new Set<string>();
const walk = (id: string) => { if (reach.has(id)) return; reach.add(id); EDGES.filter((y) => y.rel === 'precedes' && y.from === id).forEach((y) => walk(y.to)); };
steps.filter((x) => x.start).forEach((x) => walk(x.id));
for (const x of steps) if (!reach.has(x.id)) problems.push(`step ${x.id}: no starting step leads to it`);
for (const x of NODES.filter((y) => y.kind === 'recommendation')) if (!EDGES.some((e) => e.from === x.id && e.rel === 'applies-to') && !EDGES.some((e) => e.to === x.id)) problems.push(`recommendation ${x.id}: applies to nothing`);
for (const x of NODES.filter((y) => y.kind === 'limit')) if (!EDGES.some((e) => e.to === x.id && e.rel === 'limited-by')) problems.push(`limit ${x.id}: limits nothing`);
for (const x of NODES.filter((y) => y.kind === 'case')) if (!EDGES.some((e) => e.to === x.id && e.rel === 'shown-in')) problems.push(`case ${x.id}: illustrates nothing`);
// requires has no cycles
const visit = (id: string, path: string[]) => {
  if (path.includes(id)) { problems.push(`requires cycle: ${[...path, id].join(' → ')}`); return; }
  EDGES.filter((e) => e.from === id && e.rel === 'requires').forEach((e) => visit(e.to, [...path, id]));
};
NODES.forEach((x) => visit(x.id, []));

// The method each kind of work gets from the connector: its platform and where it starts.
const expected: Record<string, [string, string]> = { greenfield: ['breeze-ai', 'breeze-functional-first'], brownfield: ['breeze-ai', 'breeze-extract'], 'legacy-modernization': ['asimov', 'asimov-discover'] };
for (const [c, [platform, start]] of Object.entries(expected)) {
  const m = methodFor(c);
  if (m.platform?.id !== platform) problems.push(`method for ${c}: platform ${m.platform?.id}, expected ${platform}`);
  if (m.startsWith !== start) problems.push(`method for ${c}: starts with ${m.startsWith}, expected ${start}`);
  if (m.steps.some((x) => x.platform !== platform)) problems.push(`method for ${c}: a step from another platform`);
}

const count = (k: string) => NODES.filter((x) => x.kind === k).length;
console.log(`graph: ${NODES.length} nodes (${['context', 'platform', 'layer', 'cause', 'symptom', 'principle', 'step', 'practice', 'recommendation', 'limit', 'case'].map((k) => `${count(k)} ${k}`).join(', ')}), ${EDGES.length} edges`);
if (uncaused.length) console.log(`  symptoms with no cause in the content: ${uncaused.join(', ')}`);
if (problems.length) { [...new Set(problems)].forEach((p) => console.log('PROBLEM', p)); process.exit(1); }
