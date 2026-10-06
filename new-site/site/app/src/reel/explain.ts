// The explanation language. An agent, having mapped Semantic Engineering onto one person's situation,
// writes how the method is best explained to them in the method's own terms: which symptoms to show, how
// they connect to the principles and practices, what to recommend and which limits to name. Every name is
// a concept in the knowledge graph, every "connect" must follow a link the graph holds, and the method's
// rules about kinds of work, ownership and figures are checked. The result compiles to clips of the film
// and quotes from the site's pages, which the player runs. No browser APIs, so the MCP server shares it.
import { EDGES, NODES, nodeById, type Edge, type Evidence, type Kind, type Node } from './graph';
import { placeOf, sceneByN } from './vocab';
import { LIMITS, clipFor, closest, quoted, readLines, speakingTime, textProblems, type Plan, type Problem, type Result, type Segment } from './language';

export const MOVES = ['explain', 'for', 'context', 'layer', 'unowned', 'say', 'show', 'connect', 'compare', 'recommend', 'caveat', 'answer', 'read'];
const SHOWABLE: Kind[] = ['cause', 'symptom', 'principle', 'practice', 'case'];
const CONNECTABLE: Kind[] = [...SHOWABLE, 'recommendation', 'limit', 'layer', 'context'];
const byKind = (k: Kind[]) => NODES.filter((x) => k.includes(x.kind)).map((x) => x.id);
const CONTEXT_WORDS: Record<string, string> = { greenfield: 'a new application', brownfield: 'an existing application', 'legacy-modernization': 'a legacy modernization' };
/** How much of a required concept is played when the graph adds it. */
const REQUIRED_SENTENCES = 1;
/** The concepts that answer "nobody owns this layer today". */
const OWNERSHIP = ['named-ownership', 'layered-team', 'custodians-stay-human'];

const linksBetween = (a: string, b: string) => EDGES.filter((x) => (x.from === a && x.to === b) || (x.from === b && x.to === a));
const neighbours = (a: string) => [...new Set(EDGES.filter((x) => x.from === a || x.to === a).map((x) => (x.from === a ? x.to : x.from)))];
/** Whether a concept holds for this kind of work: its own contexts, or the contexts a recommendation applies to. */
export const fits = (node: Node, context: string) => {
  const set = new Set([...(node.contexts ?? []), ...EDGES.filter((x) => x.from === node.id && x.rel === 'applies-to').map((x) => x.to)]);
  return set.size === 0 || set.has(context);
};
const contextsOf = (node: Node) => [...new Set([...(node.contexts ?? []), ...EDGES.filter((x) => x.from === node.id && x.rel === 'applies-to').map((x) => x.to)])];

/** The clips and quotes for a piece of evidence. A concept or link plays its first moment of the film,
 *  its main one; the rest of its evidence stays available to the evidence tool and the graph page. */
const fromEvidence = (ev: Evidence, line: number, trace: Segment['trace'], maxSentences?: number, all = false): Segment[] => {
  const out: Segment[] = [];
  for (const v of (ev.video ?? []).slice(0, all ? undefined : 1)) {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/);
    if (!m || !sceneByN(Number(m[1]))) continue;
    const a = Number(m[2]);
    let b = Number(m[3] ?? m[2]);
    if (maxSentences) b = Math.min(b, a + maxSentences - 1);
    out.push({ ...clipFor(Number(m[1]), a, b, line), trace });
  }
  const quotes = (ev.pages ?? []).filter((p) => placeOf(p)).slice(0, all ? undefined : 1);
  const last = [...out].reverse().find((s) => s.kind === 'clip');
  if (last && last.kind === 'clip') last.quotes.push(...quotes);
  else if (quotes.length) out.push({ kind: 'quote', quotes, line, seconds: 6 + 4 * quotes.length, trace });
  return out;
};
const sameClip = (a: Segment, b: Segment) => a.kind === 'clip' && b.kind === 'clip' && a.scene === b.scene && a.sentences[0] === b.sentences[0] && a.sentences[1] === b.sentences[1];

export const checkExplain = (code: string): Result => {
  const problems: Problem[] = [];
  const err = (line: number, message: string) => problems.push({ line, message, severity: 'error' });
  const warn = (line: number, message: string) => problems.push({ line, message, severity: 'warning' });
  const lines = readLines(code);
  const plan: Plan = { question: '', segments: [], seconds: 0, layers: [], unowned: [], read: [] };
  const introduced = new Map<string, number>(); // concept -> line where the explanation first brings it in
  const shownSymptoms: { id: string; line: number }[] = [];
  const shownCases: number[] = [];
  let caveats = 0;
  let pendingSay: { text: string; line: number } | undefined;
  let current: { word: string; line: number; ok: boolean } | undefined;
  let answered = false;

  if (!lines.length) return { ok: false, problems: [{ line: 1, message: 'the explanation is empty. Start with: explain "<the person\'s question>"', severity: 'error' }] };
  if (lines.length > LIMITS.statements * 2) err(lines[LIMITS.statements * 2].n, `an explanation has at most ${LIMITS.statements * 2} lines.`);

  const concept = (word: string | undefined, line: number, kinds: Kind[], what: string): Node | undefined => {
    if (!word) { err(line, `${what} needs a concept name.`); return; }
    const node = nodeById(word);
    if (!node) {
      const hint = closest(word, byKind(kinds)) ?? closest(word, NODES.map((x) => x.id));
      err(line, `the knowledge graph has no concept "${word}".${hint ? ` Did you mean "${hint}"?` : ''}`);
      return;
    }
    if (!kinds.includes(node.kind)) {
      err(line, `"${word}" is a ${node.kind}; ${what} takes a ${kinds.join(' or ')}.${node.kind === 'recommendation' ? ` Use "recommend ${word}".` : node.kind === 'limit' ? ` Use "caveat ${word}".` : node.kind === 'layer' ? ` Use "compare ${word} today with after".` : ''}`);
      return;
    }
    return node;
  };
  const wrongWork = (node: Node, line: number, move: string) => {
    const ctx = contextsOf(node);
    const shape = plan.context === 'legacy-modernization'
      ? ' Legacy modernization works from a graph of the old system, a graph of the new one and a specification between them; the four-layer practices for live applications do not apply to it.'
      : ctx.length === 1 && ctx[0] === 'legacy-modernization' ? ' It belongs to legacy modernization, where the target has a graph of its own; for live work the graph matches the main branch.' : '';
    err(line, `"${node.id}" holds for ${ctx.map((c) => CONTEXT_WORDS[c]).join(' and ')}; this explanation is about ${CONTEXT_WORDS[plan.context!]}.${shape}${move === 'recommend' ? ` For ${CONTEXT_WORDS[plan.context!]}, the content recommends: ${NODES.filter((x) => x.kind === 'recommendation' && fits(x, plan.context!)).map((x) => x.id).join(', ')}.` : ''}`);
  };

  // Plays a concept, first adding what it requires if the explanation has not brought that in yet.
  const bring = (node: Node, line: number, move: string, lead?: { text: string; line: number }) => {
    const before: Segment[] = [];
    const addRequired = (id: string, chain: string[]) => {
      for (const r of EDGES.filter((x) => x.from === id && x.rel === 'requires').map((x) => x.to)) {
        if (introduced.has(r) || chain.includes(r)) continue;
        const req = nodeById(r)!;
        if (plan.context && !fits(req, plan.context)) continue;
        addRequired(r, [...chain, r]);
        introduced.set(r, line);
        before.push(...fromEvidence(req.evidence, line, { move, node: r, reason: `added from the graph: ${nodeById(chain[chain.length - 1] ?? node.id)?.label ?? node.label} requires ${req.label}` }, REQUIRED_SENTENCES));
      }
    };
    addRequired(node.id, [node.id]);
    const added = [...new Set(before.map((x) => x.trace?.node).filter(Boolean))] as string[];
    if (added.length) warn(line, `"${node.id}" builds on ${added.length === 1 ? 'a concept' : `${added.length} concepts`} not yet shown, so the graph adds a sentence of each first: ${added.join(', ')}. If any matters to this person, show it yourself before this line, with a "say" that introduces it.`);
    if (lead) plan.segments.push({ kind: 'host', role: 'bridge', text: lead.text, line: lead.line, seconds: speakingTime(lead.text), trace: { move, node: node.id, reason: "the guide's lead-in" } });
    plan.segments.push(...before);
    plan.segments.push(...fromEvidence(node.evidence, line, { move, node: node.id }));
    introduced.set(node.id, introduced.get(node.id) ?? line);
  };

  // A move's "say" is written under it and spoken before it, so each move is completed at the next one.
  let queued: (() => void) | undefined;
  const flush = () => { queued?.(); queued = undefined; pendingSay = undefined; };
  const lead = (move: string, node?: string) => { if (pendingSay) plan.segments.push({ kind: 'host', role: 'bridge', text: pendingSay.text, line: pendingSay.line, seconds: speakingTime(pendingSay.text), trace: { move, node, reason: "the guide's lead-in" } }); };

  lines.forEach((l, i) => {
    const child = l.indent > 0;
    const w = l.rest.split(/\s+/).filter(Boolean);
    if (i === 0 && l.word !== 'explain') err(l.n, `an explanation starts with: explain "<the person's question>". Found "${l.word}".`);
    if (answered && !child) err(l.n, `"answer" ends the explanation; "${l.word}" comes after it.`);
    if (!child && l.word !== 'explain') { flush(); current = { word: l.word, line: l.n, ok: true }; }
    const header = (what: string) => { if (!child || current?.word !== 'explain') { err(l.n, `"${l.word}" goes indented under "explain", ${what}.`); return false; } return true; };

    switch (l.word) {
      case 'explain': {
        if (i !== 0) { err(l.n, '"explain" appears once, on the first line.'); break; }
        const q = quoted(l.rest);
        if (q === undefined) { err(l.n, 'write the question in double quotes: explain "Our agents keep breaking other teams\' services."'); break; }
        problems.push(...textProblems(q, l.n, LIMITS.question, 'question'));
        plan.question = q;
        current = { word: 'explain', line: l.n, ok: true };
        queued = () => plan.segments.push({ kind: 'host', role: 'intro', text: pendingSay?.text ?? '', line: l.n, seconds: speakingTime(`${plan.question} ${pendingSay?.text ?? ''}`), trace: { move: 'explain', reason: "the question, and the guide's opening" } });
        break;
      }
      case 'for': {
        if (!header('to say who the explanation is for')) break;
        const a = quoted(l.rest);
        if (a === undefined) { err(l.n, 'write who it is for in double quotes: for "the CTO of an insurance software company"'); break; }
        problems.push(...textProblems(a, l.n, LIMITS.audience, 'audience'));
        plan.audience = a;
        break;
      }
      case 'context': {
        if (!header('to say the kind of work: context greenfield, context brownfield or context legacy-modernization')) break;
        const node = concept(w[0], l.n, ['context'], '"context"');
        if (node) { if (plan.context) err(l.n, 'an explanation has one context.'); plan.context = node.id; introduced.set(node.id, l.n); }
        break;
      }
      case 'layer': case 'unowned': {
        if (!header(l.word === 'layer' ? "once for each layer of knowledge in the person's problem area" : 'once for each layer of knowledge nobody owns today')) break;
        const node = concept(w[0], l.n, ['layer'], `"${l.word}"`);
        if (!node) break;
        const list = l.word === 'layer' ? plan.layers : plan.unowned;
        if (list.includes(node.id)) warn(l.n, `layer "${node.id}" is listed twice.`); else list.push(node.id);
        break;
      }
      case 'say': {
        if (!child || !current) { err(l.n, '"say" goes indented under a move, as the guide\'s lead-in to it.'); break; }
        if (!current.ok) break;
        if (current.word === 'answer') { err(l.n, '"answer" is already the guide speaking; put the text in the answer itself.'); break; }
        const t = quoted(l.rest);
        if (t === undefined) { err(l.n, 'write the guide\'s line in double quotes: say "…"'); break; }
        if (pendingSay) err(l.n, 'a move has one "say".');
        problems.push(...textProblems(t, l.n, LIMITS.text, "guide's line"));
        pendingSay = { text: t, line: l.n };
        break;
      }
      case 'show': {
        if (child) { err(l.n, '"show" is a move of its own; remove the indent.'); break; }
        const node = concept(w[0], l.n, SHOWABLE, '"show"');
        if (!node || w.length > 1) { if (node) err(l.n, `"show" takes one concept. Found "${l.rest}".`); current!.ok = false; break; }
        if (node.kind === 'symptom' && node.layer && plan.layers.length && !plan.layers.includes(node.layer)) {
          err(l.n, `"${node.id}" shows in ${node.layer} knowledge, which is not in this problem area (${plan.layers.join(', ')}). Add "layer ${node.layer}" under explain, or show a symptom of these layers: ${NODES.filter((x) => x.kind === 'symptom' && (!x.layer || plan.layers.includes(x.layer))).map((x) => x.id).join(', ')}.`);
          current!.ok = false; break;
        }
        if ((node.kind === 'principle' || node.kind === 'practice') && plan.context && !fits(node, plan.context)) { wrongWork(node, l.n, 'show'); current!.ok = false; break; }
        if (node.kind === 'case' && plan.context && !fits(node, plan.context)) warn(l.n, `"${node.id}" comes from ${contextsOf(node).map((c) => CONTEXT_WORDS[c]).join(' or ')}; this explanation is about ${CONTEXT_WORDS[plan.context]}. Say why it still applies.`);
        if (node.kind === 'symptom') shownSymptoms.push({ id: node.id, line: l.n });
        if (node.kind === 'case') shownCases.push(l.n);
        queued = () => bring(node, l.n, 'show', pendingSay);
        break;
      }
      case 'connect': {
        if (child) { err(l.n, '"connect" is a move of its own; remove the indent.'); break; }
        const m = l.rest.match(/^(\S+)\s+to\s+(\S+)$/);
        if (!m) { err(l.n, 'write a connection as: connect <concept> to <concept>, for example "connect days-of-investigation to impact-report".'); current!.ok = false; break; }
        const a = concept(m[1], l.n, CONNECTABLE, '"connect"');
        const b = concept(m[2], l.n, CONNECTABLE, '"connect"');
        if (!a || !b) { current!.ok = false; break; }
        const links = linksBetween(a.id, b.id);
        if (!links.length) { err(l.n, `the method does not link "${a.id}" and "${b.id}". "${a.id}" connects to: ${neighbours(a.id).join(', ') || 'nothing'}.`); current!.ok = false; break; }
        for (const x of [a, b]) if (plan.context && (x.kind === 'principle' || x.kind === 'practice' || x.kind === 'recommendation') && !fits(x, plan.context)) { wrongWork(x, l.n, 'connect'); current!.ok = false; }
        if (!current!.ok) break;
        if (!introduced.has(a.id) && !introduced.has(b.id)) warn(l.n, `neither "${a.id}" nor "${b.id}" has been shown yet. Connections read best from something already on screen.`);
        const link: Edge = links[0];
        queued = () => {
          lead('connect');
          plan.segments.push(...fromEvidence(link.why, l.n, { move: 'connect', node: `${link.from} ${link.rel} ${link.to}`, reason: `the method's link: ${nodeById(link.from)!.label} ${link.rel.replace('-', ' ')} ${nodeById(link.to)!.label}` }));
          [a, b].forEach((x) => introduced.set(x.id, introduced.get(x.id) ?? l.n));
        };
        break;
      }
      case 'compare': {
        if (child) { err(l.n, '"compare" is a move of its own; remove the indent.'); break; }
        const m = l.rest.match(/^(\S+)\s+today\s+with\s+after$/);
        if (!m) { err(l.n, 'write a comparison as: compare <layer> today with after, for example "compare architecture today with after".'); current!.ok = false; break; }
        const node = concept(m[1], l.n, ['layer'], '"compare"');
        if (!node) { current!.ok = false; break; }
        if (plan.context === 'legacy-modernization') { err(l.n, '"compare" plays a layer of a live application today and under the method. A legacy modernization has a different shape: show source-state-graph, target-state-graph and parity-contract.'); current!.ok = false; break; }
        if (plan.layers.length && !plan.layers.includes(node.id)) warn(l.n, `"${node.id}" is not in this problem area (${plan.layers.join(', ')}).`);
        if (!introduced.has('knowledge-graph') && !introduced.has('four-layer-graph')) warn(l.n, '"after" means after the knowledge is recorded in the graph. Show "four-layer-graph" or "knowledge-graph" first, or the viewer meets the change without its reason.');
        queued = () => {
          lead('compare', node.id);
          plan.segments.push(...fromEvidence(node.today!, l.n, { move: 'compare', node: node.id, reason: `${node.label} today` }, undefined, true));
          plan.segments.push(...fromEvidence(node.after!, l.n, { move: 'compare', node: node.id, reason: `${node.label} under the method` }, undefined, true));
          introduced.set(node.id, introduced.get(node.id) ?? l.n);
        };
        break;
      }
      case 'recommend': case 'caveat': {
        if (child) { err(l.n, `"${l.word}" is a move of its own; remove the indent.`); break; }
        const kind: Kind = l.word === 'recommend' ? 'recommendation' : 'limit';
        const node = concept(w[0], l.n, [kind], `"${l.word}"`);
        if (!node) { current!.ok = false; break; }
        if (plan.context && !fits(node, plan.context)) { wrongWork(node, l.n, l.word); current!.ok = false; break; }
        if (kind === 'limit') caveats++;
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
        if (!child || current?.word !== 'answer') { err(l.n, '"read" goes indented under "answer", to offer a page at the end.'); break; }
        if (!placeOf(l.rest)) { err(l.n, `"${l.rest}" is not a page or section of the site. Write a page and section, for example "read sdlc/agents#the-kg-sync-agent".`); break; }
        plan.read.push(l.rest);
        break;
      }
      default: {
        const hint = closest(l.word, MOVES);
        err(l.n, hint ? `unknown move "${l.word}". Did you mean "${hint}"?`
          : `the explanation language cannot express "${l.word}". It can show a concept, connect two concepts the method links, compare a layer today with after, recommend, add a caveat, and let the guide say and answer. Anything else is out of scope.`);
        if (current) current.ok = false;
      }
    }
  });
  flush();

  // Whole-explanation rules, from the method.
  const last = lines[lines.length - 1]?.n ?? 1;
  if (!plan.context) err(1, 'say the kind of work: add "context greenfield", "context brownfield" or "context legacy-modernization" under explain.');
  for (const s of shownSymptoms) {
    const fixes = EDGES.filter((x) => x.from === s.id && x.rel === 'addressed-by').map((x) => x.to).filter((f) => !plan.context || fits(nodeById(f)!, plan.context));
    if (!fixes.some((f) => introduced.has(f))) warn(s.line, `"${s.id}" is shown, and nothing in this explanation addresses it. The method addresses it with: ${fixes.join(', ') || 'nothing for this kind of work'}.`);
  }
  // Named ownership: a layer nobody owns needs an owner before the method can govern it.
  for (const layer of plan.unowned) {
    if (!OWNERSHIP.some((o) => introduced.has(o))) err(last, `nobody owns the ${layer} layer today, and the method needs a named owner for every part of the graph. Show or connect one of: ${OWNERSHIP.join(', ')}, so the person sees who would keep that layer.`);
  }
  // Figures hold in their own context.
  if (shownCases.length && !introduced.has('results-in-context')) warn(shownCases[0], 'a case carries figures from one engagement. Add "caveat results-in-context" so the person reads them in their context.');
  if (!caveats) warn(last, 'the explanation names no limit. Add at least one "caveat", so the person sees where the method stops.');
  if (!answered) warn(last, 'the explanation has no "answer". End with the guide answering the question in one or two sentences.');
  plan.segments = plan.segments.filter((s, i, all) => !(i > 0 && sameClip(all[i - 1], s)));
  const clips = plan.segments.filter((s) => s.kind === 'clip');
  if (!clips.length && !problems.some((p) => p.severity === 'error')) err(last, 'the explanation shows nothing from the film. Add a "show", "connect" or "compare".');
  if (clips.length > LIMITS.clips) warn(1, `the explanation plays ${clips.length} clips; at most ${LIMITS.clips} keeps it watchable.`);
  plan.seconds = plan.segments.reduce((a, s) => a + s.seconds, 0);
  if (plan.seconds > LIMITS.seconds) err(1, `the explanation runs about ${Math.round(plan.seconds / 60)} minutes; the limit is ${LIMITS.seconds / 60}. Show fewer concepts, or compare fewer layers.`);
  const ok = !problems.some((p) => p.severity === 'error');
  return { ok, problems: problems.sort((a, b) => a.line - b.line), plan: ok ? plan : undefined };
};

/** The compiled form, in the scene-level terms the player runs. Shown beside the source. */
export const compiledListing = (plan: Plan) => plan.segments.map((s) => {
  const why = s.trace?.reason ? `   # ${s.trace.reason}` : s.trace?.node ? `   # ${s.trace.node}` : '';
  if (s.kind === 'host') return `guide ${s.role}${why}`;
  if (s.kind === 'quote') return `quote ${s.quotes.join(', ')}${why}`;
  const sc = sceneByN(s.scene)!;
  const range = s.sentences[0] === 1 && s.sentences[1] === sc.sentences.length ? '' : s.sentences[0] === s.sentences[1] ? ` sentence ${s.sentences[0]}` : ` sentences ${s.sentences[0]}-${s.sentences[1]}`;
  return `play scene ${s.scene}${range}${s.quotes.length ? ` + quote ${s.quotes.join(', ')}` : ''}${why}`;
}).join('\n');
