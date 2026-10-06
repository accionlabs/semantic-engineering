// Checks the knowledge graph against the film and the pages it cites. Run with: npx tsx scripts/test-graph.ts
import { EDGES, NODES, nodeById, type Evidence } from '../src/reel/graph';
import { placeProblem, sceneByN } from '../src/reel/vocab';

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
      'addressed-by': [['symptom', 'cause'], ['principle', 'practice', 'recommendation']],
      requires: [['principle', 'practice'], ['principle', 'practice']], 'limited-by': [['principle', 'practice', 'case'], ['limit']],
      'shown-in': [['principle', 'practice', 'recommendation'], ['case']], 'applies-to': [['recommendation'], ['context']],
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
for (const x of NODES.filter((y) => y.kind === 'practice')) if (!EDGES.some((e) => (e.to === x.id && (e.rel === 'addressed-by' || e.rel === 'requires')) || (e.from === x.id && e.rel === 'requires'))) problems.push(`practice ${x.id}: unconnected`);
for (const x of NODES.filter((y) => y.kind === 'recommendation')) if (!EDGES.some((e) => e.from === x.id && e.rel === 'applies-to') && !EDGES.some((e) => e.to === x.id)) problems.push(`recommendation ${x.id}: applies to nothing`);
for (const x of NODES.filter((y) => y.kind === 'limit')) if (!EDGES.some((e) => e.to === x.id && e.rel === 'limited-by')) problems.push(`limit ${x.id}: limits nothing`);
for (const x of NODES.filter((y) => y.kind === 'case')) if (!EDGES.some((e) => e.to === x.id && e.rel === 'shown-in')) problems.push(`case ${x.id}: illustrates nothing`);
// requires has no cycles
const visit = (id: string, path: string[]) => {
  if (path.includes(id)) { problems.push(`requires cycle: ${[...path, id].join(' → ')}`); return; }
  EDGES.filter((e) => e.from === id && e.rel === 'requires').forEach((e) => visit(e.to, [...path, id]));
};
NODES.forEach((x) => visit(x.id, []));

const count = (k: string) => NODES.filter((x) => x.kind === k).length;
console.log(`graph: ${NODES.length} nodes (${['context', 'layer', 'cause', 'symptom', 'principle', 'practice', 'recommendation', 'limit', 'case'].map((k) => `${count(k)} ${k}`).join(', ')}), ${EDGES.length} edges`);
if (uncaused.length) console.log(`  symptoms with no cause in the content: ${uncaused.join(', ')}`);
if (problems.length) { [...new Set(problems)].forEach((p) => console.log('PROBLEM', p)); process.exit(1); }
