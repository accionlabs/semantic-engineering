// The tools an agent uses, as plain functions over the knowledge graph and the explanation language.
// WebMCP (in the page) and the remote MCP server both wrap these. No browser APIs here.
import { EDGES, NODES, nodeById, type Evidence, type Kind } from './graph';
import { PLACES, sceneByN } from './vocab';
import { checkExplain, compiledListing } from './explain';
import { referenceMarkdown } from './reference';
import { searchBoth } from './search';

const KINDS: Kind[] = ['context', 'layer', 'demand', 'cause', 'symptom', 'principle', 'recommendation', 'limit', 'case'];

/** The evidence behind a concept or link, as text: the video's sentences and the paper's paragraphs. */
export const evidenceText = (ev: Evidence) => ({
  video: (ev.video ?? []).map((v) => {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/)!; const s = sceneByN(Number(m[1]))!;
    return { ref: `scene ${s.n}, sentence${m[3] ? 's' : ''} ${m[2]}${m[3] ? `-${m[3]}` : ''}`, scene: s.title, text: s.sentences.slice(Number(m[2]) - 1, Number(m[3] ?? m[2])).map((x) => x.text).join(' ') };
  }),
  paper: (ev.paper ?? []).map((p) => {
    const m = p.match(/^(\d+(?:\.\d+)?)(?: p(\d+))?$/)!; const pl = PLACES[m[1]];
    return { ref: m[2] ? `section ${m[1]}, paragraph ${m[2]}` : `section ${m[1]}`, title: `${pl.number}. ${pl.title}`, text: m[2] ? pl.paras[Number(m[2]) - 1].text : pl.paras[0]?.text ?? '' };
  }),
});

const brief = (id: string) => { const x = nodeById(id)!; return { id: x.id, kind: x.kind, label: x.label, definition: x.definition, ...(x.layer ? { layer: x.layer } : {}), ...(x.contexts ? { contexts: x.contexts } : {}) }; };

export const TOOLS = {
  explanation_guide: {
    title: 'How to explain the paper for this person',
    description: "Returns the reference for the explanation language: how it is meant to be used, its statements, worked examples, and the full knowledge graph of the paper 'SaaS architecture when code is cheap'.",
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ guide: referenceMarkdown() }),
  },
  graph_concepts: {
    title: 'List concepts in the knowledge graph',
    description: "Concepts from the paper's knowledge graph, optionally filtered by kind (context, layer, demand, cause, symptom, principle, recommendation, limit, case) and, for symptoms, by layer.",
    inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: KINDS }, layer: { type: 'string', description: 'A layer id, for example onboarding' } } },
    run: ({ kind, layer }: { kind?: Kind; layer?: string }) => {
      if (kind && !KINDS.includes(kind)) return { error: `unknown kind "${kind}". Kinds: ${KINDS.join(', ')}.` };
      if (layer && !NODES.some((x) => x.kind === 'layer' && x.id === layer)) return { error: `unknown layer "${layer}". Layers: ${NODES.filter((x) => x.kind === 'layer').map((x) => x.id).join(', ')}.` };
      return { concepts: NODES.filter((x) => (!kind || x.kind === kind) && (!layer || x.layer === layer || x.id === layer)).map((x) => brief(x.id)) };
    },
  },
  graph_links: {
    title: 'Follow the links from a concept',
    description: 'Every link the paper makes to or from one concept: what addresses a symptom, what a principle requires, what limits it, which context a recommendation applies to.',
    inputSchema: { type: 'object', properties: { concept: { type: 'string' } }, required: ['concept'] },
    run: ({ concept }: { concept: string }) => {
      if (!nodeById(concept)) return { error: `no concept "${concept}". graph_concepts lists them.` };
      return {
        concept: brief(concept),
        outgoing: EDGES.filter((x) => x.from === concept).map((x) => ({ relation: x.rel, to: brief(x.to) })),
        incoming: EDGES.filter((x) => x.to === concept).map((x) => ({ relation: x.rel, from: brief(x.from) })),
      };
    },
  },
  concept_evidence: {
    title: 'The evidence for a concept or link',
    description: 'Returns the video sentences and paper paragraphs behind one concept, or behind the link between two concepts.',
    inputSchema: { type: 'object', properties: { concept: { type: 'string' }, linkedTo: { type: 'string', description: 'Optional: a second concept, for the evidence of the link between them' } }, required: ['concept'] },
    run: ({ concept, linkedTo }: { concept: string; linkedTo?: string }) => {
      const node = nodeById(concept);
      if (!node) return { error: `no concept "${concept}".` };
      if (linkedTo) {
        const link = EDGES.find((x) => (x.from === concept && x.to === linkedTo) || (x.from === linkedTo && x.to === concept));
        if (!link) return { error: `the paper does not link "${concept}" and "${linkedTo}".` };
        return { link: `${link.from} ${link.rel} ${link.to}`, evidence: evidenceText(link.why) };
      }
      return { concept: brief(concept), evidence: evidenceText(node.evidence) };
    },
  },
  find_in_paper: {
    title: 'Search the video and the paper',
    description: "Keyword search over the video's narration and the paper's paragraphs. Returns the best-matching sentences and paragraphs with their addresses.",
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    run: ({ query }: { query: string }) => (typeof query === 'string' && query.trim() ? searchBoth(query, 6) : { error: 'give a query: a few words, for example "configuration errors after go-live".' }),
  },
  check_explanation: {
    title: 'Check an explanation',
    description: 'Checks an explanation written in the explanation language against the knowledge graph and the paper\'s rules. Returns each problem with its line and a reason, and what it compiles to.',
    inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] },
    run: ({ code }: { code: string }) => {
      if (typeof code !== 'string' || !code.trim()) return { error: 'give the explanation as text in "code", starting with: explain "<the question>"' };
      const r = checkExplain(code);
      return { ok: r.ok, problems: r.problems, ...(r.plan ? { minutes: Math.round((r.plan.seconds / 60) * 10) / 10, parts: r.plan.segments.length, compiled: compiledListing(r.plan) } : {}) };
    },
  },
};

export type ToolName = keyof typeof TOOLS;
