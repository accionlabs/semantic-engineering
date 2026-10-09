// The guided builder: an explanation written from the person's choices and the knowledge graph, with no AI.
// The person picks the kind of work, their role and the problems they see; this writes the explanation in
// the explanation language, following the method's order, and the checker checks it like any other.
// No browser APIs, so the MCP server offers it as a tool too.
import { EDGES, NODES, nodeById, type Kind, type Node } from './graph';
import { checkExplain, fits, startStep } from './explain';

/** above: the product has to vary per customer, so the explanation adds a deep dive on Dialect Engineering. */
export type Choices = { context: string; role?: string; symptoms: string[]; above?: boolean };

/** The roles a person can pick, with what each cares about most, for the guide's opening. */
export const ROLES: { slug: string; name: string; focus: string }[] = [
  { slug: 'cto', name: 'CTO or VP Engineering', focus: 'For a technology leader, what matters is whether agents can be trusted with work that matters.' },
  { slug: 'cio', name: 'CIO', focus: 'For a CIO, what matters is cost, risk and visibility across the portfolio.' },
  { slug: 'architect', name: 'Architect', focus: 'For an architect, what matters is how the structure of the system is kept and checked.' },
  { slug: 'product-owner', name: 'Product owner', focus: 'For a product owner, what matters is that what was asked for is what gets built.' },
  { slug: 'tech-lead', name: 'Tech lead', focus: 'For a tech lead, what matters is that each change lands safely, with less investigation by hand.' },
  { slug: 'cfo', name: 'CFO or procurement', focus: 'For finance, what matters is what the work costs and what it returns.' },
];

export const CONTEXTS: { id: string; name: string }[] = [
  { id: 'brownfield', name: 'An existing application' },
  { id: 'greenfield', name: 'A new application' },
  { id: 'legacy-modernization', name: 'Replacing a legacy system' },
];

const QUESTION: Record<string, string> = {
  brownfield: 'How would Semantic Engineering help with our existing application?',
  greenfield: 'How would Semantic Engineering help us build our new application?',
  'legacy-modernization': 'How would Semantic Engineering help us modernize our legacy system?',
};
const SETTING: Record<string, string> = {
  brownfield: 'On an application already in use, the knowledge each change depends on sits mostly with people.',
  greenfield: 'On a new application, the knowledge can be recorded as it is created.',
  'legacy-modernization': 'In a modernization, everything rests on a complete record of what the old system does.',
};
const START_SAY: Record<string, string> = {
  brownfield: 'The method starts by building that knowledge into a graph, extracted from your application itself.',
  greenfield: 'For a new application, the method starts with the functional layer, and the graph grows with the code.',
  'legacy-modernization': "The method starts with the code itself: ASIMOV's agents turn it into a graph of the old system.",
};
const ANSWER: Record<string, string> = {
  brownfield: 'Build the graph from your application first, then let every change run through it.',
  greenfield: 'Record the functional layer first, and let the graph grow with the code.',
  'legacy-modernization': 'Have ASIMOV build a graph of your system from its code first, then decide, migrate and prove every module against it.',
};
const LIMIT: Record<string, string> = { brownfield: 'graph-not-a-spec', greenfield: 'graph-not-a-spec', 'legacy-modernization': 'contract-fixed' };
const CASE: Record<string, string> = { brownfield: 'brownfield-2m', greenfield: 'ui-workstream', 'legacy-modernization': 'asimov-programs' };
const READ: Record<string, string> = { brownfield: 'sdlc/methodology#brownfield-extraction', greenfield: 'sdlc/methodology#the-four-layer-ontology', 'legacy-modernization': 'modernization/agents#how-the-pipeline-runs' };

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const quote = (s: string) => `"${s.replace(/"/g, '\\"')}"`;

/** The problems a person can pick for a kind of work, in the graph's order. */
export const symptomsFor = (context: string) => NODES.filter((x) => x.kind === 'symptom' && fits(x, context));

/** What addresses a symptom for this kind of work: a step first, then a practice, a recommendation, a principle. */
const RANK: Kind[] = ['step', 'practice', 'recommendation', 'principle'];
export const fixFor = (symptom: string, context: string): Node | undefined => EDGES
  .filter((x) => x.from === symptom && x.rel === 'addressed-by')
  .map((x) => nodeById(x.to)!)
  .filter((x) => fits(x, context))
  .sort((a, b) => RANK.indexOf(a.kind) - RANK.indexOf(b.kind))[0];

/** The method's steps after the starting step, in order. */
const laterSteps = (context: string) => {
  const out: string[] = [];
  let cur = startStep(context)?.id;
  for (;;) { cur = EDGES.find((x) => x.from === cur && x.rel === 'precedes')?.to; if (!cur || out.includes(cur)) break; out.push(cur); }
  return out;
};

/** Writes an explanation from the person's choices. Problems with the choices come back as errors. */
export const buildExplanation = (c: Choices): { code?: string; error?: string } => {
  if (!CONTEXTS.some((x) => x.id === c.context)) return { error: `choose the kind of work: ${CONTEXTS.map((x) => x.id).join(', ')}.` };
  const role = c.role ? ROLES.find((x) => x.slug === c.role) : undefined;
  if (c.role && !role) return { error: `unknown role "${c.role}". Roles: ${ROLES.map((x) => x.slug).join(', ')}.` };
  const allowed = new Set(symptomsFor(c.context).map((x) => x.id));
  const symptoms = [...new Set(c.symptoms)].filter((s) => allowed.has(s));
  if (!symptoms.length) return { error: `choose at least one problem you see. For this kind of work: ${[...allowed].join(', ')}.` };
  const start = startStep(c.context)!;
  const L: string[] = [];

  // The short explanation: the main problem, where the method starts, what answers the problem, a limit, the answer.
  const main = nodeById(symptoms[0])!;
  const fix = fixFor(main.id, c.context);
  L.push(`explain ${quote(QUESTION[c.context])}`);
  if (role) L.push(`  for ${quote(role.name)}`);
  L.push(`  context ${c.context}`);
  L.push(`  say ${quote(`${role ? role.focus : 'What matters is that the method answers the problem you see.'} ${SETTING[c.context]}`)}`);
  L.push('', `show ${main.id}`, `  say ${quote('Here is the problem you see, as the method describes it.')}`);
  if (fix?.id === start.id) {
    L.push('', `connect ${main.id} to ${start.id}`, `  say ${quote(START_SAY[c.context])}`);
  } else {
    L.push('', `show ${start.id}`, `  say ${quote(START_SAY[c.context])}`);
    if (fix) L.push('', `connect ${main.id} to ${fix.id}`, `  say ${quote(`Here is how the method answers ${lower(main.label)}.`)}`);
  }
  L.push('', `caveat ${LIMIT[c.context]}`);
  const then = fix && fix.id !== start.id ? ` ${fix.label} then answers ${lower(main.label)}.` : '';
  L.push('', `answer ${quote(`${ANSWER[c.context]}${then}`)}`, `  read ${READ[c.context]}`);

  // Deep dives: each further problem, the rest of the method in order, and results.
  // Above the water takes one deep dive, so one fewer further problem fits within the four.
  const above = !!c.above && c.context !== 'legacy-modernization';
  for (const id of symptoms.slice(1, above ? 2 : 3)) {
    const s = nodeById(id)!, f = fixFor(id, c.context);
    L.push('', `branch ${quote(s.label.slice(0, 60))}`, `  say ${quote('This part shows how the method answers this problem.')}`, `show ${id}`);
    if (f) L.push(`connect ${id} to ${f.id}`);
  }
  const steps = laterSteps(c.context);
  if (steps.length) {
    L.push('', `branch ${quote('The method, step by step')}`, `  say ${quote('This part follows the rest of the method, in order.')}`);
    steps.forEach((s) => L.push(`show ${s}`));
  }
  if (above) L.push('', `branch ${quote('Above the water: Dialect Engineering')}`, `  say ${quote('This part shows what applies when each customer needs a version of the product of their own.')}`, 'recommend above-the-water');
  L.push('', `branch ${quote('Results from engagements')}`, `  say ${quote('This part shows what one engagement found.')}`, `show ${CASE[c.context]}`, 'caveat results-in-context');
  return { code: L.join('\n') };
};

/** Builds and checks. The builder's tests require every combination of choices to pass. */
export const buildChecked = (c: Choices) => {
  const built = buildExplanation(c);
  if (!built.code) return { ok: false, error: built.error, code: undefined, problems: undefined, plan: undefined };
  const r = checkExplain(built.code);
  return { ok: r.ok, error: undefined, code: built.code, problems: r.problems, plan: r.plan };
};
