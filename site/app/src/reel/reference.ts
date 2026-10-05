// The reference an agent reads: its role, the explanation language, and the knowledge graph it names.
// The same text is served at /explanation-language.md, returned by the reference tool, and shown on the site.
import { EDGES, NODES, nodeById, type Kind } from './graph';
import { LIMITS } from './language';
import { EXPLAIN_EXAMPLES } from './explain-examples';

export const ROLE = `You are helping one person see how the approach in the paper *SaaS architecture when code is cheap* applies to their own product. The paper argues that once code is cheap, the multi-tenancy line can move down onto the domain invariants, with each customer's variation written in a language over them.

Work in three steps:

1. **Understand their problem.** Ask whether their product is new (greenfield) or already has customers (brownfield), which layer hurts (onboarding, interface, business rules, the invariants, the deep layers, or the bill), and what they see happening, in their own words.
2. **Map it onto the paper.** Use the knowledge graph below to find the symptoms that match what they describe, the principles that address those symptoms, and the recommendations for their context. Follow the links: a symptom is addressed by principles, principles require other principles, recommendations apply to a context, and principles carry limits. Tell the person the mapping in plain terms and check it with them before going further.
3. **Explain it.** Write an explanation in the language below. It plays as a short video: the recorded narration is the expert, and your "say" and "answer" lines are the guide, read by the viewer's browser voice. Show their symptoms through the paper's evidence, connect them to the principles the paper links them to, recommend what fits their context, name a limit, and answer their question.

Write the guide's lines as a host who connects the person to the expert: start from their words ("You said onboarding takes months"), hand over to the paper ("Here is how the paper sees it"), and say why the next part follows. Do not repeat what the expert is about to say. Keep each line to one or two sentences, at most ${LIMITS.text} characters, in plain text. Follow the site's writing rules: no dashes (use a comma, colon or full stop), no "not this, but that" contrasts, no sales language.

If the person's question falls outside what the paper covers, say so plainly rather than stretching the mapping.`;

export const MOVES_TABLE = [
  ['explain "<their question>"', `First line: the question, in their words, as the title. Up to ${LIMITS.question} characters.`],
  ['  for "<who they are>"', `Optional: their role and company, as they describe it. Up to ${LIMITS.audience} characters.`],
  ['  context brownfield | greenfield', 'Required: where their product starts.'],
  ['  layer <layer>', 'Optional, once per layer: the problem area. Symptoms shown must occur in these layers.'],
  ['  say "<line>"', "Under explain: the guide's opening. Under any move: the guide's lead-in, spoken before it."],
  ['show <concept>', 'Plays a demand, cause, symptom, principle or case through its evidence, and quotes the paper beside it. Principles it requires are added first, from the graph, if not yet shown.'],
  ['connect <concept> to <concept>', 'Plays the evidence for a link the paper makes between two concepts. Only links in the graph are allowed.'],
  ['compare <layer> today with after', "Plays the layer today, then after the multi-tenancy line moves. Show line-moves-down first."],
  ['recommend <recommendation>', 'Plays a recommendation. It must apply to the context.'],
  ['caveat <limit>', 'Plays a limit the paper states. Name at least one.'],
  ['answer "<line>"', "Last: the guide's answer to their question, in one or two sentences."],
  ['  read <section>', 'Under answer: offers a section of the paper to read, for example "read 6" or "read 4.1".'],
  ['# comment', 'Ignored.'],
];

const KIND_TITLES: [Kind, string][] = [['context', 'Contexts'], ['layer', 'Layers'], ['demand', 'Demands: what customers now expect'], ['cause', 'The cause'], ['symptom', 'Symptoms, by layer'], ['principle', 'Principles'], ['recommendation', 'Recommendations'], ['limit', 'Limits'], ['case', 'Cases']];
const REL_WORDS: Record<string, string> = { meets: 'meets', 'caused-by': 'caused by', 'addressed-by': 'addressed by', requires: 'requires', 'limited-by': 'limited by', 'shown-in': 'shown in', 'applies-to': 'applies to' };

export const graphMarkdown = () => {
  const L: string[] = [];
  for (const [kind, title] of KIND_TITLES) {
    L.push(`### ${title}`, '');
    const nodes = NODES.filter((x) => x.kind === kind);
    const layerOrder = NODES.filter((x) => x.kind === 'layer').map((x) => x.id);
    if (kind === 'symptom') nodes.sort((a, b) => layerOrder.indexOf(a.layer!) - layerOrder.indexOf(b.layer!));
    for (const x of nodes) {
      const extra = [x.layer && `layer ${x.layer}`, x.contexts && `for ${x.contexts.join(' and ')}`].filter(Boolean).join('; ');
      L.push(`- \`${x.id}\` **${x.label}**${extra ? ` (${extra})` : ''}: ${x.definition}`);
      const out = EDGES.filter((e) => e.from === x.id);
      const groups = new Map<string, string[]>();
      out.forEach((e) => groups.set(REL_WORDS[e.rel], [...(groups.get(REL_WORDS[e.rel]) ?? []), `\`${e.to}\``]));
      groups.forEach((to, rel) => L.push(`  - ${rel}: ${to.join(', ')}`));
    }
    L.push('');
  }
  return L.join('\n');
};

export const referenceMarkdown = () => {
  const L: string[] = [];
  L.push('# Explaining the paper for one person', '', 'For agents helping someone on dialect-engineering.ai. The site checks what you write against the knowledge graph of the paper, plays it as a short video, and shows your source beside it.', '');
  L.push('## Your role', '', ROLE, '');
  L.push('## The explanation language', '', '| Statement | What it does |', '|---|---|');
  MOVES_TABLE.forEach(([s, w]) => L.push(`| \`${s.trim()}\` | ${w} |`));
  L.push('', `Indentation is two spaces. An explanation runs at most ${LIMITS.seconds / 60} minutes. Every problem comes back with a line number and a reason: fix it and check again. The checks follow the paper's own rules, for example that a recommendation must fit the context, that "connect" must follow a link the paper makes, and that each symptom shown should be addressed. A move the language cannot express is refused.`, '');
  L.push('## Examples', '');
  EXPLAIN_EXAMPLES.forEach((e) => L.push(`### ${e.title}`, '', '```', e.code, '```', ''));
  L.push('## The knowledge graph', '', 'Every concept the language can name, with its links. Evidence for each concept and link (the video sentences and paper paragraphs) is available from the evidence tool and on the site at /graph.', '');
  L.push(graphMarkdown());
  return L.join('\n');
};

export { nodeById };
