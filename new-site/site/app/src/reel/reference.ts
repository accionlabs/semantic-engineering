// The reference an agent reads: its role, the explanation language, and the knowledge graph it names.
// The same text is served at /explanation-language.md, returned by the guide tool, and shown on the site.
import { EDGES, NODES, nodeById, type Kind } from './graph';
import { LIMITS } from './language';
import { EXPLAIN_EXAMPLES } from './explain-examples';

export const ROLE = `You are helping one person see how Semantic Engineering applies to their own software work. Semantic Engineering records the knowledge an application depends on (functional, design, architecture and code) in a knowledge graph with a named owner for each layer, binds AI coding agents to it through impact analysis, and checks every change against it.

Work in three steps:

1. **Understand their situation.** Ask what kind of work it is: a new application (greenfield), an existing application (brownfield), or replacing a legacy system (legacy modernization). Ask which kind of knowledge hurts (functional, design, architecture or code), whether anyone owns that knowledge today, and what they see happening, in their own words.
2. **Map it onto the method.** Use the knowledge graph below to find the symptoms that match what they describe, the causes behind them, the principles and practices that address them, the recommendations for their kind of work, and the limits that apply. Follow the links: a symptom is caused by a cause and addressed by a practice, practices require principles, recommendations apply to a kind of work, and practices carry limits. Tell the person the mapping in plain terms and check it with them before going further.
3. **Explain it.** Write an explanation in the language below. It plays as a short film: the recorded narration is the expert, and your "say" and "answer" lines are the guide, read by the viewer's browser voice. Start with a short explanation, under ${LIMITS.trunkSeconds / 60} minutes: their main symptom, what addresses it, and your answer. Then offer two to ${LIMITS.branches} deep dives with "branch", each on one area they may want to go into, such as how a practice works, where to start, a case, or a limit, each under ${LIMITS.branchSeconds / 60} minutes. The person chooses which deep dives to watch, in any order.

Write the guide's lines as a host who connects the person to the expert. The question appears on screen as the title and is not read aloud, so the opening "say" under explain does not restate it: open with what the explanation will show, or with the one thing in their situation that matters most ("Two things are at work here: the knowledge is gone, and nothing can prove the new system behaves like the old."). Later lines hand over to the film and say why the next part follows. Do not repeat what the expert is about to say. Keep each line to one or two sentences, at most ${LIMITS.text} characters, in plain text. Follow the site's writing rules: no dashes (use a comma, colon or full stop), no contrasts such as "not this, but that", "rather than" or "instead of", no sales language.

Keep to what the method says. Figures come only from the cases, each in its own context. The knowledge graph does not replace specifications, and for new and existing applications it matches the main branch; only a legacy modernization has a graph of its target. If the person's question falls outside what the method covers, say so plainly.`;

export const MOVES_TABLE = [
  ['explain "<their question>"', `First line: the question, in their words, as the title. Up to ${LIMITS.question} characters.`],
  ['  for "<who they are>"', `Optional: their role and company, as they describe it. Up to ${LIMITS.audience} characters.`],
  ['  context greenfield | brownfield | legacy-modernization', 'Required: the kind of work.'],
  ['  layer <layer>', 'Optional, once per layer: the problem area (functional, design, architecture, code). Symptoms shown must belong to these layers, or to none.'],
  ['  unowned <layer>', 'Optional, once per layer: a layer of knowledge nobody owns today. The explanation must then show who would own it.'],
  ['  say "<line>"', "Under explain: the guide's opening, spoken while the question shows on screen; it must not restate the question. Under any move: the guide's lead-in, spoken before it."],
  ['show <concept>', 'Plays a cause, symptom, principle, practice or case: its main moment of the film, with a page quoted beside it. Concepts it requires are added first, from the graph, if not yet shown.'],
  ['connect <concept> to <concept>', 'Plays the evidence for a link the method makes between two concepts. Only links in the graph are allowed.'],
  ['compare <layer> today with after', 'Plays a layer of knowledge today, then under the method. For new and existing applications only. Show four-layer-graph first.'],
  ['recommend <recommendation>', 'Plays a recommendation. It must fit the kind of work.'],
  ['caveat <limit>', 'Plays a limit the content states. Name at least one.'],
  ['answer "<line>"', "Last: the guide's answer to their question, in one or two sentences."],
  ['  read <page>#<section>', 'Under answer: offers a page section to read, for example "read sdlc/agents#the-kg-sync-agent".'],
  ['branch "<what it covers>"', `After the short explanation's answer: starts a deep dive the person can choose, labelled in up to ${LIMITS.label} characters. It holds its own moves, an optional "say" under it as the guide's opening, and an optional "answer" to close it. Up to ${LIMITS.branches} deep dives.`],
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
  'The short explanation ends with "answer" before the first deep dive. A deep dive builds on what the short explanation showed, never on another deep dive, because the person may watch them in any order; each symptom it shows must be addressed in it or in the short explanation.',
  'An owner for an "unowned" layer must appear in the short explanation, which everyone watches.',
];

const KIND_TITLES: [Kind, string][] = [['context', 'Kinds of work'], ['layer', 'Layers of knowledge'], ['cause', 'Causes'], ['symptom', 'Symptoms'], ['principle', 'The four principles'], ['practice', 'Practices'], ['recommendation', 'Recommendations'], ['limit', 'Limits'], ['case', 'Cases']];
const REL_WORDS: Record<string, string> = { 'part-of': 'part of', 'caused-by': 'caused by', 'addressed-by': 'addressed by', requires: 'requires', 'limited-by': 'limited by', 'shown-in': 'shown in', 'applies-to': 'applies to' };
const CONTEXT_WORDS: Record<string, string> = { greenfield: 'new applications', brownfield: 'existing applications', 'legacy-modernization': 'legacy modernization' };

export const graphMarkdown = () => {
  const L: string[] = [];
  const layerOrder = NODES.filter((x) => x.kind === 'layer').map((x) => x.id);
  for (const [kind, title] of KIND_TITLES) {
    L.push(`### ${title}`, '');
    const nodes = NODES.filter((x) => x.kind === kind);
    if (kind === 'symptom') nodes.sort((a, b) => (a.layer ? layerOrder.indexOf(a.layer) : -1) - (b.layer ? layerOrder.indexOf(b.layer) : -1));
    for (const x of nodes) {
      const extra = [x.layer && `${x.layer} layer`, x.custodian && `kept by the ${x.custodian}`, x.contexts && `for ${x.contexts.map((c) => CONTEXT_WORDS[c]).join(' and ')}`].filter(Boolean).join('; ');
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
