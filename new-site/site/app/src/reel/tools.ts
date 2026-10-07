// The tools an agent uses, as plain functions over the knowledge graph and the explanation language.
// WebMCP (in the page) and the remote MCP server both wrap these. No browser APIs here.
import { EDGES, NODES, nodeById, type Evidence, type Kind } from './graph';
import { placeOf, placeText, sceneByN } from './vocab';
import { checkExplain, compiledListing } from './explain';
import type { Plan } from './language';
import { referenceMarkdown } from './reference';
import { searchBoth } from './search';
import { SITE } from './prompt';
import { CONTEXTS as BUILD_CONTEXTS, ROLES as BUILD_ROLES, buildChecked, symptomsFor } from './builder';

const KINDS: Kind[] = ['context', 'platform', 'layer', 'cause', 'symptom', 'principle', 'step', 'practice', 'recommendation', 'limit', 'case'];
const CONTEXTS = ['greenfield', 'brownfield', 'legacy-modernization'];

/** The method for one kind of work: the platform that runs it, and its steps in order from where it starts. */
export const methodFor = (context: string) => {
  const platform = EDGES.find((x) => x.from === context && x.rel === 'runs-on')?.to;
  const steps: string[] = [];
  let cur = NODES.find((x) => x.kind === 'step' && x.start && x.contexts?.includes(context as never))?.id;
  while (cur && !steps.includes(cur)) { steps.push(cur); cur = EDGES.find((x) => x.from === cur && x.rel === 'precedes')?.to; }
  return {
    context: brief(context), platform: platform ? brief(platform) : undefined,
    steps: steps.map((id, i) => ({ ...brief(id), position: i + 1, carriesOut: EDGES.filter((x) => x.from === id && x.rel === 'uses').map((x) => x.to) })),
    startsWith: steps[0],
    recommendations: NODES.filter((x) => x.kind === 'recommendation' && (x.contexts?.includes(context as never) || EDGES.some((y) => y.from === x.id && y.rel === 'applies-to' && y.to === context))).map((x) => x.id),
    principles: NODES.filter((x) => x.kind === 'principle').map((x) => x.id),
  };
};

/** The evidence behind a concept or link, as text: the film's sentences and the pages' passages. */
export const evidenceText = (ev: Evidence) => ({
  film: (ev.video ?? []).map((v) => {
    const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/)!; const s = sceneByN(Number(m[1]))!;
    return { ref: `scene ${s.n}, sentence${m[3] ? 's' : ''} ${m[2]}${m[3] ? `-${m[3]}` : ''}`, scene: s.title, url: `${SITE}/watch/scene-${s.n}`, text: s.sentences.slice(Number(m[2]) - 1, Number(m[3] ?? m[2])).map((x) => x.text).join(' ') };
  }),
  pages: (ev.pages ?? []).map((p) => {
    const pl = placeOf(p)!;
    return { ref: p, page: pl.page.title, section: pl.anchor ? pl.section.title : '', url: SITE + pl.url, text: placeText(pl) };
  }),
});

const minutes = (sec: number) => Math.round((sec / 60) * 10) / 10;
/** How long each part runs: the short explanation, then each deep dive. */
export const lengths = (plan: Plan) => ({ minutes: minutes(plan.seconds), parts: plan.segments.length, deepDives: plan.branches.map((b) => ({ label: b.label, minutes: minutes(b.seconds), parts: b.segments.length })) });

const brief = (id: string) => { const x = nodeById(id)!; return { id: x.id, kind: x.kind, label: x.label, definition: x.definition, ...(x.layer ? { layer: x.layer } : {}), ...(x.custodian ? { custodian: x.custodian } : {}), ...(x.contexts ? { contexts: x.contexts } : {}), ...(x.platform ? { platform: x.platform } : {}), ...(x.start ? { start: true } : {}) }; };
const layerIds = () => NODES.filter((x) => x.kind === 'layer').map((x) => x.id);

export const TOOLS = {
  explanation_guide: {
    title: 'How to explain Semantic Engineering for this person',
    description: 'Returns the reference for the explanation language: how it is meant to be used, its statements and rules, worked examples, and the full knowledge graph of Semantic Engineering.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ guide: referenceMarkdown() }),
  },
  method_steps: {
    title: 'The method for a kind of work',
    description: 'The platform that runs a kind of work (greenfield, brownfield or legacy-modernization) and the method\'s steps for it in order, from the step where the method starts, with the practices each step carries out and the recommendations that apply.',
    inputSchema: { type: 'object', properties: { context: { type: 'string', enum: CONTEXTS } }, required: ['context'] },
    run: ({ context }: { context: string }) => (CONTEXTS.includes(context) ? methodFor(context) : { error: `unknown kind of work "${context}". Kinds: ${CONTEXTS.join(', ')}.` }),
  },
  graph_concepts: {
    title: 'List concepts in the knowledge graph',
    description: 'Concepts from the knowledge graph of Semantic Engineering, optionally filtered by kind (context, platform, layer, cause, symptom, principle, step, practice, recommendation, limit, case) and, for symptoms, by layer of knowledge.',
    inputSchema: { type: 'object', properties: { kind: { type: 'string', enum: KINDS }, layer: { type: 'string', description: 'A layer of knowledge: functional, design, architecture or code' } } },
    run: ({ kind, layer }: { kind?: Kind; layer?: string }) => {
      if (kind && !KINDS.includes(kind)) return { error: `unknown kind "${kind}". Kinds: ${KINDS.join(', ')}.` };
      if (layer && !layerIds().includes(layer)) return { error: `unknown layer "${layer}". Layers: ${layerIds().join(', ')}.` };
      return { concepts: NODES.filter((x) => (!kind || x.kind === kind) && (!layer || x.layer === layer || x.id === layer)).map((x) => brief(x.id)) };
    },
  },
  graph_links: {
    title: 'Follow the links from a concept',
    description: 'Every link the method makes to or from one concept: what causes a symptom and what addresses it, what a practice requires, what limits it, which kind of work a recommendation applies to.',
    inputSchema: { type: 'object', properties: { concept: { type: 'string', description: 'A concept id, for example impact-report' } }, required: ['concept'] },
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
    description: "Returns the film's sentences and the pages' passages behind one concept, or behind the link between two concepts, each with its address.",
    inputSchema: { type: 'object', properties: { concept: { type: 'string' }, linkedTo: { type: 'string', description: 'Optional: a second concept, for the evidence of the link between them' } }, required: ['concept'] },
    run: ({ concept, linkedTo }: { concept: string; linkedTo?: string }) => {
      const node = nodeById(concept);
      if (!node) return { error: `no concept "${concept}". graph_concepts lists them.` };
      if (linkedTo) {
        if (!nodeById(linkedTo)) return { error: `no concept "${linkedTo}".` };
        const link = EDGES.find((x) => (x.from === concept && x.to === linkedTo) || (x.from === linkedTo && x.to === concept));
        if (!link) return { error: `the method does not link "${concept}" and "${linkedTo}". graph_links lists what "${concept}" links to.` };
        return { link: `${link.from} ${link.rel} ${link.to}`, evidence: evidenceText(link.why) };
      }
      return { concept: brief(concept), evidence: evidenceText(node.evidence) };
    },
  },
  find_in_site: {
    title: 'Search the film and the pages',
    description: "Keyword search over the film's narration and the site's pages. Returns the best-matching sentences and passages with their addresses.",
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    run: ({ query }: { query: string }) => (typeof query === 'string' && query.trim() ? searchBoth(query, 6) : { error: 'give a query: a few words, for example "impact analysis before coding".' }),
  },
  build_explanation: {
    title: 'Build an explanation from choices',
    description: "Writes a checked explanation, without any AI, from a kind of work, an optional role and the problems the person sees (symptom ids for that kind of work, the main one first). Returns the explanation's text, which can be edited and checked, or played with make_explanation. With only a context, returns the problems to choose from.",
    inputSchema: { type: 'object', properties: { context: { type: 'string', enum: BUILD_CONTEXTS.map((x) => x.id) }, role: { type: 'string', enum: BUILD_ROLES.map((x) => x.slug) }, symptoms: { type: 'array', items: { type: 'string' } } }, required: ['context'] },
    run: ({ context, role, symptoms }: { context: string; role?: string; symptoms?: string[] }) => {
      if (!BUILD_CONTEXTS.some((x) => x.id === context)) return { error: `unknown kind of work "${context}". Kinds: ${BUILD_CONTEXTS.map((x) => x.id).join(', ')}.` };
      if (!symptoms?.length) return { context, problems: symptomsFor(context).map((x) => brief(x.id)) };
      const r = buildChecked({ context, role, symptoms });
      if (!r.code) return { error: r.error };
      return { ok: r.ok, code: r.code, problems: r.problems, ...(r.plan ? lengths(r.plan) : {}) };
    },
  },
  check_explanation: {
    title: 'Check an explanation',
    description: "Checks an explanation written in the explanation language against the knowledge graph and the method's rules. Returns each problem with its line and a reason, how long the short explanation and each deep dive run, and what it compiles to.",
    inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] },
    run: ({ code }: { code: string }) => {
      if (typeof code !== 'string' || !code.trim()) return { error: 'give the explanation as text in "code", starting with: explain "<the question>"' };
      const r = checkExplain(code);
      return { ok: r.ok, problems: r.problems, ...(r.plan ? { ...lengths(r.plan), compiled: compiledListing(r.plan) } : {}) };
    },
  },
};

export type ToolName = keyof typeof TOOLS;
