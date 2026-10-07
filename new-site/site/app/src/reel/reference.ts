// The reference an agent reads: its role, the explanation language, and the knowledge graph it names.
// The same text is served at /explanation-language.md, returned by the guide tool, and shown on the site.
import { EDGES, NODES, nodeById, type Kind } from './graph';
import { LIMITS } from './language';
import { EXPLAIN_EXAMPLES } from './explain-examples';

export const ROLE = `You are helping one person see how Semantic Engineering applies to their own software work. Semantic Engineering records the knowledge an application depends on in a knowledge graph with a named owner for each part, binds AI agents to it, and checks every change against it. It runs on two platforms with different approaches: Breeze.AI for new and existing applications, where the four-layer graph is extracted from the code (or grown with it) and governs every change; and ASIMOV for legacy modernization, a bounded pipeline that starts by building a graph of the old system from its code, then documents, migrates and validates it module by module.

Work in three steps:

1. **Understand their situation.** Ask what kind of work it is: a new application (greenfield), an existing application (brownfield), or replacing a legacy system (legacy modernization). Ask which kind of knowledge hurts (functional, design, architecture or code), whether anyone owns that knowledge today, and what they see happening, in their own words.
2. **Map it onto the method.** Call method_steps for their kind of work first: it gives the platform that runs it and the method's steps in order, from the step where the method starts. Your explanation follows that approach. Then use the knowledge graph below to find the symptoms that match what they describe, the causes behind them, the principles and practices that address them, the recommendations for their kind of work, and the limits that apply. Follow the links: a symptom is caused by a cause and addressed by a practice, practices require principles, recommendations apply to a kind of work, and practices carry limits. Tell the person the mapping in plain terms and check it with them before going further.
3. **Explain it.** Write an explanation in the language below. It plays as a short film: the recorded narration is the expert, and your "say" and "answer" lines are the guide, read by the viewer's browser voice. Start with a short explanation, under ${LIMITS.trunkSeconds / 60} minutes: their main symptom, the method's first step for their kind of work, what addresses the symptom, and your answer. Then offer two to ${LIMITS.branches} deep dives with "branch", each on one area they may want to go into, such as how a practice works, where to start, a case, or a limit, each under ${LIMITS.branchSeconds / 60} minutes. The person chooses which deep dives to watch, in any order.

Write the guide's lines as a host who connects the person to the expert, following the style guide below. Keep each line to one or two sentences, at most ${LIMITS.text} characters, in plain text. Follow the site's writing rules: no dashes (use a comma, colon or full stop), no contrasts such as "not this, but that", "rather than" or "instead of", no sales language.

Keep to what the method says, in its order. For an existing application and for a legacy modernization, the method starts by building the knowledge graph from the code, never from interviewing the people who remember the system; for a new application it starts with the functional layer. Say where it starts, and use "start" or "first" only about that step. Describe each kind of work only in its own platform's terms: never present a Breeze.AI practice, such as the pull request check or the graph update before a merge, as part of a legacy modernization, or an ASIMOV practice, such as the parity contract or the four gates, as part of work on a live application. Figures come only from the cases, each in its own context. The knowledge graph does not replace specifications, and for new and existing applications it matches the main branch; only a legacy modernization has a graph of its target. If the person's question falls outside what the method covers, say so plainly.`;


/** How the guide's lines are written. Sent to every agent with the server's instructions, and part of the guide. */
export const STYLE = `## Style guide for the guide's lines

The person hears two voices: the recorded narration, which is the expert, and your lines, which the browser reads as the guide. Your lines connect the expert to this person. They are short, plain and specific.

**The opening** (the "say" under explain). The question is on screen as the title while you speak. Do not read it out, and do not paraphrase it: an opening that restates the question sounds like an echo. Name what kind of problem it is, or what is at stake for this person, in one sentence, then say what the explanation shows first.
- Write: "A system the business cannot stop is the hardest kind to replace. Two things stand in the way: the people who knew it are gone, and nothing yet proves a new system behaves like the old one."
- Avoid: "You asked how Semantic Engineering would help modernize your COBOL system." (a paraphrase of the question)
- Avoid: "Great question." or "Let me explain." (filler)

**Lead-ins** (a "say" under a move). One sentence that says why the next part follows from the last one. Do not summarize what the expert is about to say; the film says it.
- Write: "And here is why so many modernizations stall before they deploy."
- Avoid: "Next, the film explains that modernizations stall because there is no executable contract." (repeats the expert)

**The answer.** One or two sentences that say what to do, in the person's terms. Do not restate the question, and do not announce the answer ("To answer your question…"). Start with the action.
- Write: "Record the COBOL system's behavior as a contract, and let agents migrate against it with checks that prove each module."
- Avoid: "So, how would Semantic Engineering help you modernize your COBOL system? By …"

**A deep dive's opening.** Say what this part adds to the short explanation, in one sentence. The label already names the topic, so do not repeat it.

**Follow the method's order.** The method has a starting step for each kind of work (method_steps gives it): extraction of the graph from the code for an existing application, the functional layer for a new one, and Discover (a graph of the old system from its code) for a legacy modernization. Say where the method starts, and use "start", "begin" or "first" only about that step. Problems can come first in an explanation; the guide still does not suggest starting with anything the method does not start with.
- Write: "So the method starts with the code itself: ASIMOV's agents turn it into a graph of the old system."
- Avoid: "Start with the people." (the method starts from the code)

**A sample.** Write it in the person's own nouns, small enough to read in a few seconds: a handful of lines, two or three notes that point to what the method records or checks, and at most one line the method would refuse, with the reason in the method's terms. Invent no figures, product names or claims about their system; the card says it is an illustration. Show the method's own version of the artefact first.

**One platform per kind of work.** Breeze.AI runs new and existing applications; ASIMOV runs legacy modernization. Name the platform that runs the person's work, and describe its practices only.

**Throughout.**
- Plain words. Name a term the first time it appears: "a graph of the old system, the Source-state ontology".
- Short sentences in the present tense, spoken to the person: "your team", "your system".
- No dashes: use a comma, colon or full stop.
- No contrasts such as "not this, but that", "rather than" or "instead of": say what is true directly.
- No sales language and no "honest" or "honestly".
- Figures only from the cases in the graph, each with its context.
- Each line one or two sentences, at most ${LIMITS.text} characters.`;

export const MOVES_TABLE = [
  ['explain "<their question>"', `First line: the question, in their words, as the title. Up to ${LIMITS.question} characters.`],
  ['  for "<who they are>"', `Optional: their role and company, as they describe it. Up to ${LIMITS.audience} characters.`],
  ['  context greenfield | brownfield | legacy-modernization', 'Required: the kind of work.'],
  ['  layer <layer>', 'Optional, once per layer: the problem area (functional, design, architecture, code). Symptoms shown must belong to these layers, or to none.'],
  ['  unowned <layer>', 'Optional, once per layer: a layer of knowledge nobody owns today. The explanation must then show who would own it.'],
  ['  say "<line>"', "Under explain: the guide's opening, spoken while the question shows on screen. It refers to the question in one short clause of the guide's own words, then says something new. Under any move: the guide's lead-in, spoken before it."],
  ['show <concept>', 'Plays a cause, symptom, principle, step, practice, case or platform: its main moment of the film, with a page quoted beside it. Concepts of the same platform that it requires are added first, from the graph, if not yet shown.'],
  ['connect <concept> to <concept>', 'Plays the evidence for a link the method makes between two concepts. Only links in the graph are allowed.'],
  ['compare <layer> today with after', 'Plays a layer of knowledge today, then under the method. For new and existing applications only. Show four-layer-graph first.'],
  ['recommend <recommendation or step>', 'Plays a recommendation, or a step of the method as advice. It must fit the kind of work.'],
  ['caveat <limit>', 'Plays a limit the content states. Name at least one.'],
  ['answer "<line>"', "Last: the guide's answer to their question, in one or two sentences."],
  ['  read <page>#<section>', 'Under answer: offers a page section to read, for example "read sdlc/agents#the-kg-sync-agent".'],
  ['branch "<what it covers>"', `After the short explanation's answer: starts a deep dive the person can choose, labelled in up to ${LIMITS.label} characters. It holds its own moves, an optional "say" under it as the guide's opening, and an optional "answer" to close it. Up to ${LIMITS.branches} deep dives.`],
  ['sample <concept> "<title>"', `A small sample, written by you in the person's own terms, of an artefact the method produces: four-layer-graph (an excerpt of the graph), impact-report, pr-validation (a check result) or four-decisions (decisions on modules). Shown as a card marked as an illustration. Show the concept first; one sample per part.`],
  ['  line "<text>"', `1 to ${LIMITS.sampleLines} lines, each up to ${LIMITS.sampleWidth} characters. Spaces inside the quotes indent.`],
  ['  note <n> "<what line n shows>"', `0 to ${LIMITS.sampleNotes} notes after the lines; the guide speaks each while its line lights up.`],
  ['  reject "<line>" "<why>"', 'Optional, last: one line the method would refuse, such as a link the graph does not allow, a violation the check fails, or a module with no decision, and why.'],
  ['# comment', 'Ignored.'],
];

export const RULES = [
  'A concept must fit the kind of work: legacy modernization works from a graph of the old system, a graph of the new one and a specification between them, so the four-layer practices for live applications do not apply to it, and its practices do not apply to live work.',
  'A recommendation must apply to the kind of work.',
  '"connect" must follow a link the graph holds.',
  'A symptom shown must belong to the problem area declared with "layer".',
  'A layer declared "unowned" needs one of named-ownership, layered-team or custodians-stay-human in the explanation, because every part of the graph needs a named owner.',
  'A symptom shown should be addressed by something in the explanation (a warning).',
  'A case carries figures from one engagement: add "caveat results-in-context" (a warning).',
  'Name at least one limit (a warning).',
  'The short explanation shows the step where the method starts for the kind of work (an error otherwise): breeze-extract for an existing application, breeze-functional-first for a new one, asimov-discover for a legacy modernization.',
  'Steps of the method appear in their order within a part (a warning). A guide\'s line that says "start", "begin" or "first step" about anything other than the starting step gets a warning.',
  'A guide\'s line that names ASIMOV in an explanation about a live application is an error; one that names Breeze.AI in a legacy modernization gets a warning (Breeze.AI appears there only for the four-layer graph after the migration).',
  'The short explanation ends with "answer" before the first deep dive. A deep dive builds on what the short explanation showed, never on another deep dive, because the person may watch them in any order; each symptom it shows must be addressed in it or in the short explanation.',
  'An owner for an "unowned" layer must appear in the short explanation, which everyone watches.',
  'A sample illustrates only four-layer-graph, impact-report, pr-validation or four-decisions, fits the kind of work, comes after its concept is shown, and appears at most once per part; its lines, notes and rejected line follow the limits above and the writing rules.',
];

const KIND_TITLES: [Kind, string][] = [['context', 'Kinds of work'], ['platform', 'Platforms'], ['step', 'The method, step by step'], ['layer', 'Layers of knowledge'], ['cause', 'Causes'], ['symptom', 'Symptoms'], ['principle', 'The four principles'], ['practice', 'Practices'], ['recommendation', 'Recommendations'], ['limit', 'Limits'], ['case', 'Cases']];
const REL_WORDS: Record<string, string> = { 'part-of': 'part of', 'caused-by': 'caused by', 'addressed-by': 'addressed by', requires: 'requires', 'limited-by': 'limited by', 'shown-in': 'shown in', 'applies-to': 'applies to', precedes: 'then', uses: 'carries out', 'runs-on': 'runs on' };
const CONTEXT_WORDS: Record<string, string> = { greenfield: 'new applications', brownfield: 'existing applications', 'legacy-modernization': 'legacy modernization' };

export const graphMarkdown = () => {
  const L: string[] = [];
  const layerOrder = NODES.filter((x) => x.kind === 'layer').map((x) => x.id);
  for (const [kind, title] of KIND_TITLES) {
    L.push(`### ${title}`, '');
    const nodes = NODES.filter((x) => x.kind === kind);
    if (kind === 'step') nodes.sort((a, b) => (a.platform ?? '').localeCompare(b.platform ?? '') || (a.order ?? 0) - (b.order ?? 0));
    if (kind === 'symptom') nodes.sort((a, b) => (a.layer ? layerOrder.indexOf(a.layer) : -1) - (b.layer ? layerOrder.indexOf(b.layer) : -1));
    for (const x of nodes) {
      const extra = [x.start && 'the method starts here', x.order && `step ${x.order}`, x.platform && (x.platform === 'asimov' ? 'ASIMOV' : 'Breeze.AI'), x.layer && `${x.layer} layer`, x.custodian && `kept by the ${x.custodian}`, x.contexts && `for ${x.contexts.map((c) => CONTEXT_WORDS[c]).join(' and ')}`].filter(Boolean).join('; ');
      L.push(`- \`${x.id}\` **${x.label}**${extra ? ` (${extra})` : ''}: ${x.definition}`);
      const groups = new Map<string, string[]>();
      EDGES.filter((e) => e.from === x.id).forEach((e) => groups.set(REL_WORDS[e.rel], [...(groups.get(REL_WORDS[e.rel]) ?? []), `\`${e.to}\``]));
      groups.forEach((to, rel) => L.push(`  - ${rel}: ${to.join(', ')}`));
    }
    L.push('');
  }
  return L.join('\n');
};

export const referenceMarkdown = () => {
  const L: string[] = [];
  L.push('# Explaining Semantic Engineering for one person', '', 'For agents helping someone on semantic-engineering.ai. The site checks what you write against the knowledge graph of the method, plays it as a short film, and shows your source beside it.', '');
  L.push('## Your role', '', ROLE, '');
  L.push(STYLE, '');
  L.push('## The explanation language', '', '| Statement | What it does |', '|---|---|');
  MOVES_TABLE.forEach(([s, w]) => L.push(`| \`${s.trim()}\` | ${w} |`));
  L.push('', `Indentation is two spaces. The short explanation runs at most ${LIMITS.trunkSeconds / 60} minutes and each deep dive at most ${LIMITS.branchSeconds / 60} minutes, so the person never watches more than ${LIMITS.branchSeconds / 60} minutes without choosing where to go next. Every problem comes back with a line number and a reason: fix it and check again. A move the language cannot express is refused.`, '');
  L.push('### The rules it checks', '', ...RULES.map((r) => `- ${r}`), '');
  L.push('## Examples', '');
  EXPLAIN_EXAMPLES.forEach((e) => L.push(`### ${e.title}`, '', '```', e.code, '```', ''));
  L.push('## The knowledge graph', '', 'Every concept the language can name, with its links. The evidence for each concept and link (the film\'s sentences and the pages\' passages) is available from the evidence tool and on the site at /graph.', '');
  L.push(graphMarkdown());
  return L.join('\n');
};

export { nodeById };
