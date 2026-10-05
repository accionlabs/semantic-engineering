// Checks the knowledge graph against the content it cites. Run with: npx tsx scripts/test-graph.ts
import { EDGES, NODES, nodeById, type Evidence } from '../src/reel/graph';
import { PLACES, sceneByN } from '../src/reel/vocab';

const problems: string[] = [];
const ids = new Set<string>();
NODES.forEach((x) => { if (ids.has(x.id)) problems.push(`duplicate node ${x.id}`); ids.add(x.id); });

const checkEvidence = (ev: Evidence, where: string) => {
  if (!ev.video?.length && !ev.paper?.length) problems.push(`${where}: no evidence`);
  for (const v of ev.video ?? []) {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/);
    const s = m && sceneByN(Number(m[1]));
    if (!m || !s) { problems.push(`${where}: video "${v}" is not a scene.sentence reference`); continue; }
    const a = Number(m[2]), b = Number(m[3] ?? m[2]);
    if (a < 1 || b > s.sentences.length || a > b) problems.push(`${where}: video "${v}" is outside scene ${s.n}, which has ${s.sentences.length} sentences`);
  }
  for (const p of ev.paper ?? []) {
    const m = p.match(/^(\d+(?:\.\d+)?)(?: p(\d+))?$/);
    const place = m && PLACES[m[1]];
    if (!m || !place) { problems.push(`${where}: paper "${p}" is not a section`); continue; }
    if (m[2] && Number(m[2]) > place.paras.length) problems.push(`${where}: paper "${p}": section ${m[1]} has ${place.paras.length} paragraphs`);
  }
};

NODES.forEach((x) => {
  checkEvidence(x.evidence, x.id);
  if (x.kind === 'symptom' && !nodeById(x.layer ?? '')) problems.push(`${x.id}: symptom without a layer`);
  if (x.kind === 'layer' && !(x.today && x.after)) problems.push(`${x.id}: layer without today and after scenes`);
});
EDGES.forEach((ed) => {
  const w = `${ed.from} ${ed.rel} ${ed.to}`;
  if (!ids.has(ed.from)) problems.push(`${w}: no node ${ed.from}`);
  if (!ids.has(ed.to)) problems.push(`${w}: no node ${ed.to}`);
  checkEvidence(ed.why, w);
});

// Structure: every symptom is addressed; every principle is used; "requires" has no cycles.
const out = (id: string, rel: string) => EDGES.filter((x) => x.from === id && x.rel === rel).map((x) => x.to);
NODES.filter((x) => x.kind === 'symptom').forEach((s) => { if (!out(s.id, 'addressed-by').length) problems.push(`${s.id}: symptom no principle addresses`); });
NODES.filter((x) => x.kind === 'principle').forEach((p) => {
  const used = EDGES.some((x) => x.to === p.id && (x.rel === 'addressed-by' || x.rel === 'requires'));
  if (!used) problems.push(`${p.id}: principle nothing addresses or requires`);
});
const visit = (id: string, path: string[]) => {
  if (path.includes(id)) { problems.push(`requires cycle: ${[...path, id].join(' > ')}`); return; }
  out(id, 'requires').forEach((t) => visit(t, [...path, id]));
};
NODES.filter((x) => x.kind === 'principle').forEach((p) => visit(p.id, []));

const count = (k: string) => NODES.filter((x) => x.kind === k).length;
console.log(`graph: ${NODES.length} nodes (${['context', 'layer', 'demand', 'cause', 'symptom', 'principle', 'recommendation', 'limit', 'case'].map((k) => `${count(k)} ${k}`).join(', ')}), ${EDGES.length} edges`);
if (problems.length) { console.log(problems.map((p) => `PROBLEM ${p}`).join('\n')); process.exit(1); }
console.log('every reference resolves; structure checks pass');
