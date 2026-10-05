// The explanation language. An agent, having mapped the paper's approach onto one person's problem,
// writes how that approach is best explained to them, in the domain's own terms: which symptoms to show,
// how they connect to the principles, and what to recommend. Every name is a concept in the knowledge
// graph, every "connect" must follow a link the graph holds, and the paper's rules about context and
// dependency are checked. The result compiles to scenes, sentences and quotes the reel player runs.
// No browser APIs, so the MCP server shares it.
import { EDGES, NODES, nodeById, type Edge, type Evidence, type Kind, type Node } from './graph';
import { sceneByN } from './vocab';
import { LIMITS, clipFor, closest, quoted, readLines, speakingTime, textProblems, type Highlight, type Plan, type Problem, type Segment } from './language';

export type ExplainResult = { ok: boolean; problems: Problem[]; plan?: Plan };

const MOVES = ['explain', 'for', 'context', 'layer', 'say', 'show', 'connect', 'compare', 'recommend', 'caveat', 'answer', 'read'];
const KIND_WORD: Record<Kind, string> = { context: 'context', layer: 'layer', demand: 'demand', cause: 'cause', symptom: 'symptom', principle: 'principle', recommendation: 'recommendation', limit: 'limit', case: 'case' };
const SHOWABLE: Kind[] = ['demand', 'cause', 'symptom', 'principle', 'case'];
const byKind = (k: Kind[]) => NODES.filter((x) => k.includes(x.kind)).map((x) => x.id);
const REQUIRED_SENTENCES = 1; // how much of a required principle is played when the graph adds it

/** Links between two concepts, in either direction. */
const linksBetween = (a: string, b: string) => EDGES.filter((x) => (x.from === a && x.to === b) || (x.from === b && x.to === a));
const neighbours = (a: string) => [...new Set(EDGES.filter((x) => x.from === a || x.to === a).map((x) => (x.from === a ? x.to : x.from)))];
const appliesTo = (node: Node, context: string) => {
  const edges = EDGES.filter((x) => x.from === node.id && x.rel === 'applies-to').map((x) => x.to);
  const set = new Set([...(node.contexts ?? []), ...edges]);
  return set.size === 0 || set.has(context);
};

/** The clips and quotes for a piece of evidence. */
const fromEvidence = (ev: Evidence, line: number, trace: Segment['trace'], maxSentences?: number): Segment[] => {
  const out: Segment[] = [];
  for (const v of ev.video ?? []) {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/);
    if (!m || !sceneByN(Number(m[1]))) continue;
    const a = Number(m[2]);
    let b = Number(m[3] ?? m[2]);
    if (maxSentences) b = Math.min(b, a + maxSentences - 1);
    out.push({ ...clipFor(Number(m[1]), a, b, line), trace });
  }
  const highlights: Highlight[] = (ev.paper ?? []).map((p) => { const m = p.match(/^(\d+(?:\.\d+)?)(?: p(\d+))?$/)!; return { key: m[1], para: m[2] ? Number(m[2]) : undefined, line }; });
  const last = [...out].reverse().find((s) => s.kind === 'clip');
  if (last && last.kind === 'clip') last.highlights.push(...highlights);
  else if (highlights.length) out.push({ kind: 'quote', highlights, line, seconds: 6 + 4 * highlights.length, trace });
  return out;
};

const sameClip = (a: Segment, b: Segment) => a.kind === 'clip' && b.kind === 'clip' && a.scene === b.scene && a.sentences[0] === b.sentences[0] && a.sentences[1] === b.sentences[1];

export const checkExplain = (code: string): ExplainResult => {
  const problems: Problem[] = [];
  const err = (line: number, message: string) => problems.push({ line, message, severity: 'error' });
  const warn = (line: number, message: string) => problems.push({ line, message, severity: 'warning' });
  const lines = readLines(code);
  const plan: Plan = { question: '', segments: [], seconds: 0, layers: [], read: [] };
  const introduced = new Map<string, number>(); // concept -> line where the reel first brings it in
  const shownSymptoms: { id: string; line: number }[] = [];
  let pendingSay: { text: string; line: number } | undefined;
  let current: { word: string; line: number; ok: boolean } | undefined;
  let answered = false;

  if (!lines.length) return { ok: false, problems: [{ line: 1, message: 'the explanation is empty. Start with: explain "<the person\'s question>"', severity: 'error' }] };

  // Resolves a concept name, checking its kind.
  const concept = (word: string | undefined, line: number, kinds: Kind[], what: string): Node | undefined => {
    if (!word) { err(line, `${what} needs a concept name.`); return; }
    const node = nodeById(word);
    if (!node) {
      const hint = closest(word, byKind(kinds)) ?? closest(word, NODES.map((x) => x.id));
      err(line, `the knowledge graph has no concept "${word}".${hint ? ` Did you mean "${hint}"?` : ''}`);
      return;
    }
    if (!kinds.includes(node.kind)) {
      err(line, `"${word}" is a ${KIND_WORD[node.kind]}; ${what} takes a ${kinds.map((k) => KIND_WORD[k]).join(' or ')}.${node.kind === 'recommendation' ? ` Use "recommend ${word}".` : node.kind === 'limit' ? ` Use "caveat ${word}".` : node.kind === 'layer' ? ` Use "compare ${word} today with after".` : ''}`);
      return;
    }
    return node;
  };

  // Plays a concept, first adding what it requires if the reel has not brought that in yet.
  const bring = (node: Node, line: number, move: string, lead?: { text: string; line: number }) => {
    const before: Segment[] = [];
    const addRequired = (id: string, chain: string[]) => {
      for (const r of EDGES.filter((x) => x.from === id && x.rel === 'requires').map((x) => x.to)) {
        if (introduced.has(r) || chain.includes(r)) continue;
        addRequired(r, [...chain, r]);
        const req = nodeById(r)!;
        introduced.set(r, line);
        before.push(...fromEvidence(req.evidence, line, { move, node: r, reason: `added from the graph: ${nodeById(chain[chain.length - 1] ?? node.id)?.label ?? node.label} requires ${req.label}` }, REQUIRED_SENTENCES));
      }
    };
    addRequired(node.id, [node.id]);
    const added = [...new Set(before.map((x) => x.trace?.node).filter(Boolean))] as string[];
    if (added.length) warn(line, `"${node.id}" builds on ${added.length === 1 ? 'a principle' : `${added.length} principles`} not yet shown, so the graph adds a sentence of each first: ${added.join(', ')}. If any matters to this person, show it yourself before this line, with a "say" that introduces it.`);
    if (lead) plan.segments.push({ kind: 'host', role: 'bridge', text: lead.text, line: lead.line, seconds: speakingTime(lead.text), trace: { move, node: node.id, reason: "the guide's lead-in" } });
    plan.segments.push(...before);
    plan.segments.push(...fromEvidence(node.evidence, line, { move, node: node.id }));
    introduced.set(node.id, introduced.get(node.id) ?? line);
  };

  // A move's "say" is written under it but spoken before it, so each move is completed at the next one.
  let queued: (() => void) | undefined;
  const flush = () => { queued?.(); queued = undefined; pendingSay = undefined; };

  lines.forEach((l, i) => {
    const child = l.indent > 0;
    const w = l.rest.split(/\s+/).filter(Boolean);
    if (i === 0 && l.word !== 'explain') err(l.n, `an explanation starts with: explain "<the person's question>". Found "${l.word}".`);
    if (answered && !child) err(l.n, `"answer" ends the explanation; "${l.word}" comes after it.`);

    if (!child && l.word !== 'explain') { flush(); current = { word: l.word, line: l.n, ok: true }; }

    switch (l.word) {
      case 'explain': {
        if (i !== 0) { err(l.n, '"explain" appears once, on the first line.'); break; }
        const q = quoted(l.rest);
        if (q === undefined) { err(l.n, 'write the question in double quotes: explain "Onboarding takes us months."'); break; }
        problems.push(...textProblems(q, l.n, LIMITS.question, 'question'));
        plan.question = q;
        current = { word: 'explain', line: l.n, ok: true };
        queued = () => plan.segments.push({ kind: 'host', role: 'intro', text: pendingSay?.text ?? '', line: l.n, seconds: speakingTime(`${plan.question} ${pendingSay?.text ?? ''}`), trace: { move: 'explain', reason: 'the question, and the guide\'s opening' } });
        break;
      }
      case 'for': {
        if (!child || current?.word !== 'explain') { err(l.n, '"for" goes indented under "explain", to say who the explanation is for.'); break; }
        const a = quoted(l.rest);
        if (a === undefined) { err(l.n, 'write who it is for in double quotes: for "the head of implementation at a payroll SaaS company"'); break; }
        problems.push(...textProblems(a, l.n, LIMITS.audience, 'audience'));
        plan.audience = a;
        break;
      }
      case 'context': {
        if (!child || current?.word !== 'explain') { err(l.n, '"context" goes indented under "explain": context brownfield, or context greenfield.'); break; }
        const node = concept(w[0], l.n, ['context'], '"context"');
        if (node) { if (plan.context) err(l.n, 'an explanation has one context.'); plan.context = node.id; introduced.set(node.id, l.n); }
        break;
      }
      case 'layer': {
        if (!child || current?.word !== 'explain') { err(l.n, '"layer" goes indented under "explain", once for each layer in the person\'s problem area.'); break; }
        const node = concept(w[0], l.n, ['layer'], '"layer"');
        if (node) { if (plan.layers!.includes(node.id)) warn(l.n, `layer "${node.id}" is listed twice.`); else plan.layers!.push(node.id); }
        break;
      }
      case 'say': {
        if (!child || !current) { err(l.n, '"say" goes indented under a move, as the guide\'s lead-in to it.'); break; }
        if (!current.ok) break;
        if (current.word === 'answer') { err(l.n, '"answer" is already the guide speaking; put the text in the answer itself.'); break; }
        const t = quoted(l.rest);
        if (t === undefined) { err(l.n, 'write the guide\'s line in double quotes: say "…"'); break; }
        if (pendingSay) err(l.n, 'a move has one "say".');
        problems.push(...textProblems(t, l.n, LIMITS.text, 'guide\'s line'));
        pendingSay = { text: t, line: l.n };
        break;
      }
      case 'show': {
        if (child) { err(l.n, '"show" is a move of its own; remove the indent.'); break; }
        const node = concept(w[0], l.n, SHOWABLE, '"show"');
        if (!node || w.length > 1) { if (node) err(l.n, `"show" takes one concept. Found "${l.rest}".`); current!.ok = false; break; }
        if (node.kind === 'symptom' && plan.layers!.length && !plan.layers!.includes(node.layer!)) {
          err(l.n, `"${node.id}" occurs in ${node.layer}, which is not in this problem area (${plan.layers!.join(', ')}). Add "layer ${node.layer}" under explain, or show a symptom of these layers: ${NODES.filter((x) => x.kind === 'symptom' && plan.layers!.includes(x.layer!)).map((x) => x.id).join(', ')}.`);
          current!.ok = false; break;
        }
        if (node.kind === 'principle' && plan.context && !appliesTo(node, plan.context)) { err(l.n, `"${node.id}" is a principle for ${node.contexts!.join(' and ')} products; this explanation's context is ${plan.context}.`); current!.ok = false; break; }
        if (node.kind === 'case' && plan.context && !appliesTo(node, plan.context)) warn(l.n, `"${node.id}" is the ${node.contexts!.join(' and ')} case; this explanation's context is ${plan.context}. It still illustrates the principle, but say why it applies.`);
        if (node.kind === 'symptom') shownSymptoms.push({ id: node.id, line: l.n });
        queued = () => bring(node, l.n, 'show', pendingSay);
        break;
      }
      case 'connect': {
        if (child) { err(l.n, '"connect" is a move of its own; remove the indent.'); break; }
        const m = l.rest.match(/^(\S+)\s+to\s+(\S+)$/);
        if (!m) { err(l.n, 'write a connection as: connect <concept> to <concept>, for example "connect errors-after-go-live to domain-language".'); current!.ok = false; break; }
        const a = concept(m[1], l.n, [...SHOWABLE, 'recommendation', 'limit', 'layer', 'context'], '"connect"');
        const b = concept(m[2], l.n, [...SHOWABLE, 'recommendation', 'limit', 'layer', 'context'], '"connect"');
        if (!a || !b) { current!.ok = false; break; }
        const links = linksBetween(a.id, b.id);
        if (!links.length) {
          err(l.n, `the paper does not link "${a.id}" and "${b.id}". "${a.id}" connects to: ${neighbours(a.id).join(', ') || 'nothing'}.`);
          current!.ok = false; break;
        }
        if (!introduced.has(a.id) && !introduced.has(b.id)) warn(l.n, `neither "${a.id}" nor "${b.id}" has been shown yet. Connections read best from something already on screen.`);
        if (b.kind === 'recommendation' && plan.context && !appliesTo(b, plan.context)) { err(l.n, `"${b.id}" is the ${EDGES.filter((x) => x.from === b.id && x.rel === 'applies-to').map((x) => x.to).join(' or ') || b.contexts?.join(' or ')} path; this explanation's context is ${plan.context}.`); current!.ok = false; break; }
        const link: Edge = links[0];
        queued = () => {
          if (pendingSay) plan.segments.push({ kind: 'host', role: 'bridge', text: pendingSay.text, line: pendingSay.line, seconds: speakingTime(pendingSay.text), trace: { move: 'connect', reason: "the guide's lead-in" } });
          plan.segments.push(...fromEvidence(link.why, l.n, { move: 'connect', node: `${link.from} ${link.rel} ${link.to}`, reason: `the paper's link: ${nodeById(link.from)!.label} ${link.rel.replace('-', ' ')} ${nodeById(link.to)!.label}` }));
          [a, b].forEach((x) => introduced.set(x.id, introduced.get(x.id) ?? l.n));
        };
        break;
      }
      case 'compare': {
        if (child) { err(l.n, '"compare" is a move of its own; remove the indent.'); break; }
        const m = l.rest.match(/^(\S+)\s+today\s+with\s+after$/);
        if (!m) { err(l.n, 'write a comparison as: compare <layer> today with after, for example "compare onboarding today with after".'); current!.ok = false; break; }
        const node = concept(m[1], l.n, ['layer'], '"compare"');
        if (!node) { current!.ok = false; break; }
        if (plan.layers!.length && !plan.layers!.includes(node.id)) warn(l.n, `"${node.id}" is not in this problem area (${plan.layers!.join(', ')}).`);
        if (!introduced.has('line-moves-down')) warn(l.n, `"after" means after the multi-tenancy line moves. Show "line-moves-down" first, or the viewer meets the new placement without its reason.`);
        queued = () => {
          if (pendingSay) plan.segments.push({ kind: 'host', role: 'bridge', text: pendingSay.text, line: pendingSay.line, seconds: speakingTime(pendingSay.text), trace: { move: 'compare', node: node.id, reason: "the guide's lead-in" } });
          const today = sceneByN(node.today!)!, after = sceneByN(node.after!)!;
          plan.segments.push({ ...clipFor(today.n, 1, today.sentences.length, l.n), trace: { move: 'compare', node: node.id, reason: `${node.label} today` } });
          plan.segments.push({ ...clipFor(after.n, 1, after.sentences.length, l.n), trace: { move: 'compare', node: node.id, reason: `${node.label} after the line moves` } });
          introduced.set(node.id, introduced.get(node.id) ?? l.n);
        };
        break;
      }
      case 'recommend': case 'caveat': {
        if (child) { err(l.n, `"${l.word}" is a move of its own; remove the indent.`); break; }
        const kind: Kind = l.word === 'recommend' ? 'recommendation' : 'limit';
        const node = concept(w[0], l.n, [kind], `"${l.word}"`);
        if (!node) { current!.ok = false; break; }
        if (kind === 'recommendation' && plan.context && !appliesTo(node, plan.context)) {
          const alt = NODES.filter((x) => x.kind === 'recommendation' && appliesTo(x, plan.context!)).map((x) => x.id);
          err(l.n, `"${node.id}" is not the paper's advice for a ${plan.context} product. For ${plan.context}, it recommends: ${alt.join(', ')}.`);
          current!.ok = false; break;
        }
        queued = () => bring(node, l.n, l.word, pendingSay);
        break;
      }
      case 'answer': {
        if (child) { err(l.n, '"answer" is a move of its own; remove the indent.'); break; }
        const t = quoted(l.rest);
        if (t === undefined) { err(l.n, 'write the answer in double quotes: answer "…"'); break; }
        problems.push(...textProblems(t, l.n, LIMITS.text, 'answer'));
        answered = true;
        queued = () => plan.segments.push({ kind: 'host', role: 'close', text: t, line: l.n, seconds: speakingTime(t), trace: { move: 'answer', reason: "the guide's answer to the question" } });
        break;
      }
      case 'read': {
        if (!child || current?.word !== 'answer') { err(l.n, '"read" goes indented under "answer", to offer a section of the paper at the end.'); break; }
        const m = l.rest.match(/^(\d+(?:\.\d+)?)$/);
        if (!m) { err(l.n, 'write "read 6" or "read 4.1".'); break; }
        plan.read!.push({ key: m[1], line: l.n });
        break;
      }
      default: {
        const hint = closest(l.word, MOVES);
        err(l.n, hint ? `unknown move "${l.word}". Did you mean "${hint}"?`
          : `the explanation language cannot express "${l.word}". It can show a concept, connect two concepts the paper links, compare a layer today with after, recommend, add a caveat, and let the guide say and answer. Anything else is out of scope.`);
        if (current) current.ok = false;
      }
    }
  });
  flush();

  // Whole-explanation rules.
  const last = lines[lines.length - 1]?.n ?? 1;
  if (!plan.context) err(1, 'say where the product starts: add "context brownfield" or "context greenfield" under explain.');
  for (const s of shownSymptoms) {
    const fixes = EDGES.filter((x) => x.from === s.id && x.rel === 'addressed-by').map((x) => x.to);
    if (!fixes.some((f) => introduced.has(f))) warn(s.line, `"${s.id}" is shown, and nothing in this explanation addresses it. The paper addresses it with: ${fixes.join(', ')}.`);
  }
  if (!answered) warn(last, 'the explanation has no "answer". End with the guide answering the question in one or two sentences.');
  // A clip played twice in a row adds nothing; keep the first.
  plan.segments = plan.segments.filter((s, i, all) => !(i > 0 && sameClip(all[i - 1], s)));
  const clips = plan.segments.filter((s) => s.kind === 'clip');
  if (!clips.length && !problems.some((p) => p.severity === 'error')) err(last, 'the explanation shows nothing from the video. Add a "show", "connect" or "compare".');
  if (clips.length > LIMITS.clips) warn(1, `the explanation plays ${clips.length} clips; at most ${LIMITS.clips} keeps it watchable.`);
  plan.seconds = plan.segments.reduce((a, s) => a + s.seconds, 0);
  if (plan.seconds > LIMITS.seconds) err(1, `the explanation runs about ${Math.round(plan.seconds / 60)} minutes; the limit is ${LIMITS.seconds / 60}. Show fewer concepts, or compare fewer layers.`);
  const ok = !problems.some((p) => p.severity === 'error');
  return { ok, problems: problems.sort((a, b) => a.line - b.line), plan: ok ? plan : undefined };
};

/** The compiled form, written in the scene-level terms the player runs. Shown beside the source. */
export const compiledListing = (plan: Plan) => plan.segments.map((s) => {
  const why = s.trace?.reason ? `   # ${s.trace.reason}` : s.trace?.node ? `   # ${s.trace.node}` : '';
  if (s.kind === 'host') return `guide ${s.role}${why}`;
  if (s.kind === 'quote') return `quote ${s.highlights.map((h) => (h.para ? `${h.key} para ${h.para}` : h.key)).join(', ')}${why}`;
  if (s.kind === 'hold') return `hold scene ${s.scene} at sentence ${s.sentence}${why}`;
  const sc = sceneByN(s.scene)!;
  const range = s.sentences[0] === 1 && s.sentences[1] === sc.sentences.length ? '' : s.sentences[0] === s.sentences[1] ? ` sentence ${s.sentences[0]}` : ` sentences ${s.sentences[0]}-${s.sentences[1]}`;
  return `play scene ${s.scene}${range}${s.highlights.length ? ` + quote ${s.highlights.map((h) => (h.para ? `${h.key} para ${h.para}` : h.key)).join(', ')}` : ''}${why}`;
}).join('\n');
