import { PAPER, SUMMARIES, SCENE_SECTION, sectionByN } from '../content/data';

export type PanelContent = { id: string; section: number; title: string; text: string; diagram?: string; figure?: { text: string; url?: string; source?: string }; link?: { url: string; label: string }; time: number };

// Elements that stand for another site open a link to it from their panel.
const LINKS: Record<string, { url: string; label: string }> = {
  'link.on2go': { url: 'https://on2go.ai', label: 'Visit on2go.ai' }, 'example.on2go': { url: 'https://on2go.ai', label: 'Visit on2go.ai' },
  'link.semantic-engineering': { url: 'https://semantic-engineering.ai', label: 'Visit semantic-engineering.ai' },
};

const BANDS: Record<string, string> = { infrastructure: 'Infrastructure', database: 'Database', 'data-model': 'Data model', primitives: 'Domain primitives', invariants: 'Domain invariants', rules: 'Business rules', interface: 'Interface and APIs', onboarding: 'Onboarding and configuration', deep: 'The deep layers' };

// Section and diagram for an element, by the kind of thing it is. Anything else uses its scene's section.
const RULES: [RegExp, number, string?][] = [
  [/^line\.mt$/, 2, 'd2'], [/^layer\./, 2, 'd2'], [/^tenant\./, 2, 'd1'], [/^shard\.|^defect\./, 1], [/^stack$/, 2, 'd1'],
  [/^rule\./, 1], [/^question\./, 1], [/^need\./, 3], [/^counter\./, 2],
  [/^step\.|^artefact\.|^schema\.|^queue\.onboarding|^error\.after-go-live/, 6], [/^validator|^records\.|^product\.untouched/, 6],
  [/^screen\.|^grid\.|^cursor\.|^variants|^build\.|^path\.runtime|^cost\.per-screen/, 7, 'd5'],
  [/^api\./, 3], [/^agent\.api/, 3], [/^workflow\.|^code\.shared|^request\./, 2], [/^token\.|^policy\./, 2],
  [/^field\.custom|^gauge\.risk/, 2], [/^bill\./, 4, 'd3'],
  [/^graph\.|^heat\.|^link\.semantic/, 8], [/^ontology\.|^custodian\.|^change\.invariant|^report\.impact|^gate\.validation/, 8],
  [/^term\.|^grammar\.panel|^card\./, 9, 'd6'], [/^loop\.|^refusal|^boundary\.agent|^funnel\.|^agent$|^request\.expert|^tool\./, 9, 'd6'],
  [/^path\.(green|brown)field/, 5, 'd4'], [/^link\.on2go/, 13], [/^rec\./, 14, 'd7'], [/^falsifier\./, 16], [/^example\./, 13], [/^judgement\.|^api\.existing/, 15, 'd8'],
  [/^needs\.case-by-case|^drill\./, 5],
];

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const humanise = (id: string) => clean(id.replace(/[.-]/g, ' ')).replace(/^\w/, (c) => c.toUpperCase());

const NAMES: Record<string, string> = {
  'line.mt': 'The multi-tenancy line', 'code.shared': 'Shared code', 'shard.special-case': 'A special case in shared code',
  'defect.cross-tenant': "A defect in another tenant", 'workflow.node': 'Configurable workflows', 'request.misfit': 'A request no workflow fits',
  'graph.knowledge': 'The knowledge graph', 'graph.four-layer': 'The four-layer knowledge graph', 'heat.bars': 'How many customers change each layer',
  'grammar.panel': 'What the grammar says', 'term.dsl': 'Domain-specific language', 'term.invariants': 'Domain invariants', 'term.rules': 'Business rules',
  'refusal': 'A request the language refuses', 'boundary.agent': 'Where the agent stops', 'funnel.freedom': 'Degrees of freedom', 'agent': 'The AI agent',
  'request.expert': "The domain expert's request", 'report.impact': 'The impact report', 'gate.validation': 'The validation gate', 'change.invariant': 'A change to an invariant',
  'field.custom': 'A custom field', 'gauge.risk': 'Risk grows with depth', 'bill.tier': 'The tier', 'bill.seat': 'Priced per seat', 'counter.tenants': 'Tenants, illustrative',
  'link.semantic-engineering': 'semantic-engineering.ai', 'site.link': 'The site', 'example.wadi': 'Wadi, the greenfield case', 'example.on2go': 'On2Go, the brownfield case', 'link.on2go': 'on2go.ai',
  'path.greenfield': 'Greenfield: build from the bottom', 'path.brownfield': 'Brownfield: work from the top', 'rec.rearchitecture': 'Design the lower line into a re-architecture',
};

export const labelFor = (id: string, el: Element) => {
  if (NAMES[id]) return NAMES[id];
  const band = id.match(/^layer\.(.+?)(\.\d+)?$/)?.[1];
  if (band && BANDS[band]) return BANDS[band];
  const tn = id.match(/^tenant\.(\d+)$/);
  if (tn) return `Tenant ${String.fromCharCode(65 + Number(tn[1]))}`;
  const text = clean((el as HTMLElement).innerText ?? el.textContent ?? '');
  if (/^(lens|callout)\./.test(id) && text) return text.length > 90 ? text.slice(0, 88) + '…' : text;
  if (/^fig\./.test(id) && text) return text.split(/\n/)[0].slice(0, 90);
  if (text && text.length < 60) return text;
  return humanise(id);
};

const citationFor = (text: string) => {
  const t = text.toLowerCase();
  return PAPER.citations.find((c) => {
    const title = c.title.toLowerCase();
    return title.length > 6 && (t.includes(title.slice(0, Math.min(28, title.length))) || title.split(/[,(]/)[0].length > 8 && t.includes(title.split(/[,(]/)[0].trim()));
  });
};

export const panelFor = (id: string, el: Element, scene: number, time: number): PanelContent => {
  const hit = RULES.find(([re]) => re.test(id));
  const section = hit?.[1] ?? SCENE_SECTION[scene] ?? 1;
  const title = labelFor(id, el);
  const base: PanelContent = { id, section, title, text: SUMMARIES[String(section)] ?? '', diagram: hit?.[2], link: LINKS[id], time };
  if (/^fig\./.test(id)) {
    const text = clean((el as HTMLElement).innerText ?? '');
    const c = citationFor(text);
    base.figure = { text, url: c?.url, source: c?.title };
    base.title = sectionByN(section)?.title ?? title;
  }
  return base;
};
