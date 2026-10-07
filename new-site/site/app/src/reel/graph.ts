// The knowledge graph of Semantic Engineering. DRAFT for the author's review: every concept and link is a
// claim about the method, and the author is its custodian.
//
// Evidence refers to the film by scene and sentence ("13.8", "15.1-4"; scenes 1 to 30) and to the site's
// pages by page, section and block ("sdlc/methodology#aperture p3", or a whole section,
// "sdlc/agents#the-kg-sync-agent"). Definitions keep to the site's own terms and to the methodology facts
// the author set: the graph holds high-aperture knowledge only and does not replace specifications; it
// matches the main branch; only legacy modernization has a graph of the target.
// No browser APIs, so the MCP server shares it.

export type Evidence = { video?: string[]; pages?: string[] };
export type Context = 'greenfield' | 'brownfield' | 'legacy-modernization';
export type Kind = 'context' | 'platform' | 'layer' | 'cause' | 'symptom' | 'principle' | 'step' | 'practice' | 'recommendation' | 'limit' | 'case';
export type Platform = 'breeze-ai' | 'asimov';
export type Node = {
  id: string; kind: Kind; label: string; definition: string; evidence: Evidence;
  /** Symptoms: the layer of knowledge where the problem shows. */
  layer?: string;
  /** Principles, practices, recommendations and cases that hold only for some kinds of work. */
  contexts?: Context[];
  /** Layers: who keeps the layer, and the film's moments for that knowledge today and under the method. */
  custodian?: string; today?: Evidence; after?: Evidence;
  /** The platform a step, practice, recommendation, case or limit belongs to. The four principles have none. */
  platform?: Platform;
  /** Steps: the position in the method's sequence, and whether the method starts here for its kinds of work. */
  order?: number; start?: boolean;
};
export type Relation =
  | 'part-of'      // a component of a larger cause
  | 'caused-by'    // a symptom traces back to a cause
  | 'addressed-by' // a symptom or cause is addressed by a principle, practice or recommendation
  | 'requires'     // a principle or practice builds on another
  | 'limited-by'   // a principle, practice or case carries a stated limit
  | 'shown-in'     // a principle or practice is illustrated by a case
  | 'applies-to'   // a recommendation applies to a kind of work
  | 'precedes'     // a step of the method comes before the next step
  | 'uses'         // a step carries out a practice
  | 'runs-on';     // a kind of work runs on a platform
export type Edge = { from: string; rel: Relation; to: string; why: Evidence };

const n = (kind: Kind, id: string, label: string, definition: string, evidence: Evidence, extra: Partial<Node> = {}): Node => ({ id, kind, label, definition, evidence, ...extra });
const LIVE: Context[] = ['greenfield', 'brownfield'];
const LEGACY: Context[] = ['legacy-modernization'];
const BREEZE = { platform: 'breeze-ai' as Platform };
const ASIMOV = { platform: 'asimov' as Platform };

export const NODES: Node[] = [
  // ---- The kinds of work
  n('context', 'greenfield', 'A new application', 'Building a new application: the four-layer graph is built up as the application grows, with new items entering as the code that builds them merges.', { video: ['9.1', '9.4'], pages: ['sdlc/methodology#the-four-layer-ontology'] }),
  n('context', 'brownfield', 'An existing application', 'Changing an application already in use: the four-layer graph is extracted from the application and then maintained by its owners.', { video: ['9.1', '9.4-5'], pages: ['sdlc/methodology#brownfield-extraction'] }),
  n('context', 'legacy-modernization', 'Legacy modernization', 'Replacing an old system with a fixed end state chosen at the start: a graph of the old system, a graph of the new one, and a specification that connects them.', { video: ['9.6-7', '22.1'], pages: ['modernization/methodology#why-modernization-needs-a-different-ontology-shape'] }),

  // ---- The two platforms that run the method
  n('platform', 'breeze-ai', 'Breeze.AI', 'The platform for new and existing applications: the four-layer graph kept in step with the main branch, and the agents that carry each change through impact analysis, the pull request check and the graph update.', { video: ['14.2', '15.7'], pages: ['practitioner/breeze-ai', 'home#two-platforms-one-methodology'] }, { contexts: LIVE }),
  n('platform', 'asimov', 'ASIMOV', 'The platform for legacy modernization: a bounded pipeline of nine agents across five stages, from the graph of the old system built from its code to validated, deployed new code.', { video: ['24.10', '24.12'], pages: ['practitioner/asimov', 'home#two-platforms-one-methodology'] }, { contexts: LEGACY }),

  // ---- The method, step by step. Each kind of work has one starting step; the steps follow in order.
  n('step', 'asimov-discover', 'Discover: a graph of the old system from its code', 'The method starts from the legacy code itself. ASIMOV\'s Code Ingestion Agent parses it, COBOL included, into the Source-state ontology, and the Code Enrichment Agent adds dependencies, relationships, descriptions and metrics; the Blueprint Ingestion Agent turns the target blueprint into the Target-state ontology. Discovery and analysis also fix the scope and the first module to migrate.', { video: ['23.2', '24.10'], pages: ['modernization/agents#how-the-pipeline-runs p2', 'modernization/process/operating-model#the-five-stage-delivery p3', 'modernization/process/operating-model#the-five-stage-delivery p4'] }, { contexts: LEGACY, ...ASIMOV, order: 1, start: true }),
  n('step', 'asimov-document', 'Document: the specification, and a decision on every module', 'The Specification Extraction Agent reads both graphs and produces the specification between them, with a requirements document, test scenarios, end-to-end test scripts and a code chatbot; the Product Owner and Architect then mark every module Retain, Modify, Replace or Retire.', { video: ['23.5-6'], pages: ['modernization/agents#how-the-pipeline-runs p4'] }, { contexts: LEGACY, ...ASIMOV, order: 2 }),
  n('step', 'asimov-migrate', 'Migrate: one module first, then the rest', 'Migration agents write the new code one module at a time from the specification and the Target-state ontology, under the parity contract; one first module is migrated while subject-matter experts tune the agents, then the remaining modules follow.', { video: ['24.3', '25.9-10'], pages: ['modernization/agents#how-the-pipeline-runs p6', 'modernization/process/operating-model#the-five-stage-delivery p5', 'modernization/process/operating-model#the-five-stage-delivery p6'] }, { contexts: LEGACY, ...ASIMOV, order: 3 }),
  n('step', 'asimov-validate', 'Validate: four gates on every candidate', 'Every piece of migrated code passes the architecture, design, standards and functional gates, returning with the evidence until all four pass; a modernization expert then signs off each module.', { video: ['24.4', '24.9', '24.11'], pages: ['modernization/agents#how-the-pipeline-runs p8', 'modernization/agents#how-the-pipeline-runs p10'] }, { contexts: LEGACY, ...ASIMOV, order: 4 }),
  n('step', 'asimov-maintain', 'Maintain: deployment and the handover', 'User acceptance testing and deployment per release, then maintenance until hand-over; for ongoing governance, a four-layer graph is built for the new system, its code layer extracted from the new code by Breeze.AI.', { video: ['26.6-7', '25.9'], pages: ['modernization/methodology#how-the-two-instantiations-connect-at-the-handoff', 'modernization/process/operating-model#the-five-stage-delivery p7', 'modernization/agents#how-the-pipeline-runs p11'] }, { contexts: LEGACY, ...ASIMOV, order: 5 }),
  n('step', 'breeze-extract', 'Extract the four-layer graph from the existing application', 'For an application in use, the method starts by building the graph from the application itself: Breeze.AI\'s agents parse the code, infer the architecture, trace the journeys from the screens and exercise the running application, and the custodians review their layers; typically two to three weeks for more than two million lines.', { video: ['19.1-2', '9.5'], pages: ['sdlc/methodology#brownfield-extraction', 'sdlc/engagement-model#the-four-phases p11'] }, { contexts: ['brownfield'], ...BREEZE, order: 1, start: true }),
  n('step', 'breeze-functional-first', 'Author the functional layer, then grow the graph with the code', 'For a new application, the method starts by authoring the functional layer, and the graph grows with the code: new items enter as the code that builds them merges.', { video: ['9.4', '12.7'], pages: ['sdlc/engagement-model#the-four-phases p11'] }, { contexts: ['greenfield'], ...BREEZE, order: 1, start: true }),
  n('step', 'breeze-spec-sprint', 'Prepare each change in the spec sprint', 'The custodians prepare specifications a step ahead of implementation; impact analysis reports what each touches, and each custodian reviews their layer.', { video: ['12.2', '12.5-6'], pages: ['sdlc/process#the-two-sprints p2'] }, { contexts: LIVE, ...BREEZE, order: 2 }),
  n('step', 'breeze-build', 'Build with coding agents bound by the impact report', 'Developers keep their coding agents, which read the graph through the Breeze.AI MCP server, with the impact report in the prompt.', { video: ['14.2-4'], pages: ['sdlc/process/implementation-sprint#the-per-change-sdlc-flow p3'] }, { contexts: LIVE, ...BREEZE, order: 3 }),
  n('step', 'breeze-check', 'Check every pull request against the graph', 'The PR Validation Agent checks each change against the impact report and all four layers before it can merge.', { video: ['15.1-2'], pages: ['sdlc/process/implementation-sprint#the-per-change-sdlc-flow p5'] }, { contexts: LIVE, ...BREEZE, order: 4 }),
  n('step', 'breeze-sync', 'Update the graph before the merge', 'The KG Sync Agent updates the graph before the pull request merges, so the graph matches the main branch and the next change starts from the application as it is.', { video: ['15.7-8'], pages: ['sdlc/agents#the-kg-sync-agent p1'] }, { contexts: LIVE, ...BREEZE, order: 5 }),

  // ---- The four kinds of knowledge, each with its custodian
  n('layer', 'functional', 'Functional knowledge', 'Personas, outcomes, scenarios, steps and actions: what the application is for. Kept by the Product Owner.', { video: ['1.2', '6.2'], pages: ['sdlc/methodology#the-four-layer-ontology', 'sdlc/translation-tax#the-product-owner'] }, { custodian: 'Product Owner', today: { video: ['2.4', '3.8-10'] }, after: { video: ['12.4-7', '15.6'] } }),
  n('layer', 'design', 'Design knowledge', 'Screen components and their building blocks, page templates and user flows. Kept by the UX Designer and the design system owner.', { video: ['1.3', '6.3'], pages: ['sdlc/methodology#the-four-layer-ontology', 'sdlc/translation-tax#the-ux-designer'] }, { custodian: 'UX Designer', today: { video: ['2.5'] }, after: { video: ['15.3', '28.5-6'] } }),
  n('layer', 'architecture', 'Architecture knowledge', 'Services, boundaries, dependencies, data stores and integrations. Kept by the Architect and the tech lead.', { video: ['1.4', '6.4'], pages: ['sdlc/methodology#the-four-layer-ontology', 'sdlc/translation-tax#the-architect'] }, { custodian: 'Architect', today: { video: ['2.6', '3.18'] }, after: { video: ['13.1', '13.10'] } }),
  n('layer', 'code', 'Code knowledge', 'Modules, classes, functions, endpoints and database schemas. Kept by the Engineering Team.', { video: ['1.5', '1.7', '6.5'], pages: ['sdlc/methodology#the-four-layer-ontology', 'sdlc/translation-tax#the-engineering-team'] }, { custodian: 'Engineering Team', today: { video: ['2.7-9', '3.15-16'] }, after: { video: ['13.8-9', '15.7-8'] } }),

  // ---- Causes
  n('cause', 'knowledge-unwritten', 'Knowledge written nowhere an agent can read', 'The knowledge an enterprise application depends on is spread across four roles, and much of it stays in people\'s heads, messages and meetings.', { video: ['1.6-8', '4.3-4'], pages: ['sdlc/translation-tax#what-the-custodians-know-that-the-code-does-not-show'] }),
  n('cause', 'manual-translation-tax', 'The Manual Translation Tax', 'The recurring cost of knowledge and context lost at each handoff across roles, artifacts and tools, as documents, messages and memory become decisions and code.', { video: ['3.1-2', '2.13'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }, { contexts: LIVE }),
  n('cause', 'ambiguity', 'Ambiguity', 'The same words mean different things to different people.', { video: ['3.7'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p6'] }, { contexts: LIVE }),
  n('cause', 'non-persistence', 'Non-persistence', 'Knowledge that was never written down is lost when the person who holds it leaves, and an agent session starts with no memory of the last.', { video: ['3.11', '3.13'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p6'] }, { contexts: LIVE }),
  n('cause', 'non-traceability', 'Non-traceability', 'Nothing records which parts of the code depend on a feature the user sees.', { video: ['3.14'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p6'] }, { contexts: LIVE }),
  n('cause', 'modernization-tax', 'The Modernization Translation Tax', 'The cost of working by hand from the legacy code, the only authoritative record of what the old system does.', { video: ['22.3-4'], pages: ['modernization/translation-tax#the-modernization-version-of-the-problem'] }, { contexts: LEGACY }),
  n('cause', 'reverse-engineering-tax', 'The reverse-engineering tax', 'Finding out from the legacy code what the system does, which needs senior engineers.', { video: ['22.5'], pages: ['modernization/translation-tax#the-four-components'] }, { contexts: LEGACY }),
  n('cause', 'lost-context-tax', 'The lost-context tax', 'Business decisions the code does not show, such as deliberate edge cases and old workarounds.', { video: ['22.6'], pages: ['modernization/translation-tax#the-four-components'] }, { contexts: LEGACY }),
  n('cause', 'validation-vacuum-tax', 'The validation-vacuum tax', 'Nothing can test the old behavior automatically, so every migrated module needs a hand-built check.', { video: ['22.7'], pages: ['modernization/translation-tax#the-four-components'] }, { contexts: LEGACY }),
  n('cause', 'knowledge-disappearance-tax', 'The knowledge-disappearance tax', 'After the project, the people who built up the understanding leave with the engagement.', { video: ['22.8'], pages: ['modernization/translation-tax#the-four-components'] }, { contexts: LEGACY }),

  // ---- Symptoms, by layer where they show (cross-cutting symptoms have no layer)
  n('symptom', 'no-faster-delivery', 'Faster code, no faster delivery', 'A coding agent makes writing code faster, and the team ships no faster while it pays the tax.', { video: ['2.11', '3.3-4'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }, { contexts: LIVE }),
  n('symptom', 'agents-make-mistakes', 'Agents make mistakes on large applications', 'Coding agents do well on small, contained tasks and make mistakes on enterprise applications, such as calling a function the team had removed.', { video: ['4.5-6'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p3'] }),
  n('symptom', 'no-overall-gain', 'Isolated prototypes, no overall gain', 'AI coding tools produce value in pockets, such as isolated prototypes, and no overall gain in productivity.', { video: ['4.7'], pages: ['sdlc/case-archetypes#brownfield-enterprise-modernization p1'] }, { contexts: ['brownfield'] }),
  n('symptom', 'waiting-on-people', 'Work waits on people', 'Each kind of knowledge comes from a person: questions, partial answers and colleagues who are away.', { video: ['2.3', '2.7-9'], pages: ['sdlc/translation-tax#what-this-looks-like-on-a-sprint'] }, { contexts: LIVE }),
  n('symptom', 'rework-from-misreading', 'Work redone after misreading', 'One requirement is read three ways, and the difference surfaces in code review with weeks of work partly redone.', { video: ['3.8-10'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }, { contexts: LIVE, layer: 'functional' }),
  n('symptom', 'specs-fall-short', 'Specifications fall short', 'Each specification describes one change and knows little about the rest of the application; specifications drift and become the slowest step.', { video: ['10.3-7'], pages: ['sdlc/process/spec-sprint#why-a-separate-cadence'] }, { contexts: LIVE, layer: 'functional' }),
  n('symptom', 'design-duplication', 'Duplicated design components', 'New screens rebuild components the design system already has, and the design system drifts as the codebase grows.', { video: ['8.3'], pages: ['sdlc/case-archetypes#greenfield-growing-into-complexity', 'sdlc/agents#the-pr-validation-agent'] }, { contexts: LIVE, layer: 'design' }),
  n('symptom', 'documentation-decays', 'Documentation goes out of date', 'Wikis and architecture pages fall out of date, and more documentation decays the same way.', { video: ['2.6', '3.17-19'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p16'] }, { contexts: LIVE, layer: 'architecture' }),
  n('symptom', 'days-of-investigation', 'Days of investigation before a change', 'A senior engineer spends days working out what a change touches before anyone writes code.', { video: ['13.11', '21.5'], pages: ['sdlc/case-archetypes#brownfield-enterprise-modernization p10'] }, { contexts: LIVE, layer: 'architecture' }),
  n('symptom', 'boundary-violations', 'Changes cross boundaries and break dependents', 'A change crosses a service boundary or breaks something another team depends on, found late in review or in production.', { video: ['2.10', '8.3'], pages: ['sdlc/agents#the-pr-validation-agent'] }, { contexts: LIVE, layer: 'architecture' }),
  n('symptom', 'hidden-dependencies', 'Hidden dependencies', 'Code elsewhere depends on a feature and nothing records it, so a change has effects nobody predicted.', { video: ['3.15-16'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }, { contexts: LIVE, layer: 'code' }),
  n('symptom', 'knowledge-leaves', 'Knowledge leaves with people', 'When a senior engineer leaves, the team spends months rediscovering what they knew.', { video: ['3.12'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }, { contexts: LIVE, layer: 'code' }),
  n('symptom', 'agent-starts-empty', 'Each agent session starts empty', 'A coding agent remembers nothing from its last session, and more unstructured text gives it nothing to check its work against.', { video: ['3.13', '4.9'], pages: ['sdlc/translation-tax#what-the-custodians-know-that-the-code-does-not-show p14'] }, { contexts: LIVE, layer: 'code' }),
  n('symptom', 'review-overload', 'Reviews too large to read', 'Generated changes reach reviewers at hundreds of files per pull request, and review becomes the bottleneck.', { pages: ['sdlc/case-archetypes#sdd-at-the-governance-ceiling', 'sdlc/case-archetypes#the-sdd-ceiling-in-operation'] }, { contexts: LIVE, layer: 'code' }),
  n('symptom', 'fast-technical-debt', 'Technical debt added quickly', 'Agents that write code quickly can also add technical debt quickly.', { video: ['19.4'], pages: ['sdlc/methodology#paying-down-technical-debt'] }, { contexts: LIVE, layer: 'code' }),
  n('symptom', 'duplicated-capability', 'Capability duplicated across products', 'The same capability is built more than once across products, or kept after nobody uses it.', { video: ['18.8', '19.3'], pages: ['sdlc/methodology#extraction-as-rationalization', 'sdlc/case-archetypes#a-cautionary-tale-that-surfaces-in-both-archetypes'] }, { contexts: LIVE }),
  n('symptom', 'work-not-visible', 'Work by people and agents hard to see', 'Managers need to see what people and agents are doing, and some products receive more requests than a ticket system handles well.', { video: ['17.1', '17.3'], pages: ['sdlc/process/implementation-sprint#how-the-ticket-carries-the-change', 'sdlc/agents#high-volume-support-work'] }, { contexts: LIVE }),
  n('symptom', 'legacy-experts-gone', 'The people who knew the old system are gone', 'The people who could once explain the legacy system are retiring, scarce or already gone.', { video: ['22.2'], pages: ['modernization/translation-tax#the-modernization-version-of-the-problem'] }, { contexts: LEGACY }),
  n('symptom', 'legacy-undocumented', 'The old system is barely documented', 'Documentation of the legacy system is partial, outdated or absent, so its behavior has to be worked out from the code itself.', { video: ['22.3', '22.5'], pages: ['modernization/translation-tax#the-four-components p2'] }, { contexts: LEGACY }),
  n('symptom', 'senior-engineers-tied-up', 'Senior engineers tied up reading old code', 'The few engineers who can read the legacy code spend their time on it, and every other part of the modernization waits for them.', { video: ['22.5'], pages: ['modernization/translation-tax#why-the-tax-compounds p2'] }, { contexts: LEGACY }),
  n('symptom', 'unknown-quirks', 'Nobody knows which old behaviors were deliberate', 'Without the people who know why, the team either keeps every quirk of the old system, which inflates the scope, or drops some and risks breaking what the business depends on.', { video: ['22.6'], pages: ['modernization/translation-tax#why-the-tax-compounds p3'] }, { contexts: LEGACY }),
  n('symptom', 'hand-built-checks', 'Every migrated module needs a check built by hand', 'Nothing can test the old behavior automatically, so the team builds a check for every migrated module to show it behaves as before.', { video: ['22.7'], pages: ['modernization/translation-tax#the-four-components p2'] }, { contexts: LEGACY }),
  n('symptom', 'understanding-leaves', 'The understanding leaves when the project ends', 'The hand-over transfers the code but not the understanding behind it, so the next team pays to work it out again on the new code.', { video: ['22.8'], pages: ['modernization/translation-tax#why-the-tax-compounds p5'] }, { contexts: LEGACY }),
  n('symptom', 'modernization-stalls', 'The modernization cannot be proven complete', 'Without an executable contract that the new system behaves like the old one, nobody can show the migration is complete, and it stalls before it can deploy.', { video: ['22.9-11'], pages: ['modernization/translation-tax#why-the-tax-compounds'] }, { contexts: LEGACY }),

  // ---- The four principles that hold for every kind of work
  n('principle', 'knowledge-graph', 'One structured knowledge graph', 'Record the knowledge that governs the application once, in a knowledge graph with explicit items and the relationships between them; each agent asks it for just the part its task needs.', { video: ['5.2-3', '4.11', '23.1'], pages: ['home#the-methodology p2', 'sdlc/methodology', 'modernization/methodology#the-three-modernization-ontologies p2'] }),
  n('principle', 'impact-analysis', 'Agents bound by the graph', 'Agents work from what the graph records and cannot ignore it: for a live application, every change is analyzed against the graph before code is written; in a modernization, the migration agents follow the parity contract.', { video: ['5.4', '13.1', '24.1'], pages: ['home#the-methodology p2', 'sdlc/agents#the-impact-analysis-agent', 'modernization/agents#why-the-agents-work p2'] }),
  n('principle', 'named-ownership', 'A named owner for each part', 'Every part of the graph has a person accountable for it; the same four custodian roles govern both shapes of graph, and in a modernization the Product Owner and Architect decide every module.', { video: ['5.6-7', '1.9', '23.6'], pages: ['home#the-methodology p2', 'sdlc/translation-tax#where-we-draw-the-line-on-automation', 'modernization/process/enablement-frame#who-holds-the-custodial-position-in-modernization'] }),
  n('principle', 'validation-gates', 'A check on every change', 'Automatic checks test every change against the graph, each pull request on a live application and each migrated module in a modernization, and each check records a pass or a fail the team can audit.', { video: ['5.8-9', '24.4'], pages: ['home#the-methodology p2', 'sdlc/methodology#the-validation-gate', 'modernization/agents#how-the-pipeline-runs p8'] }),

  // ---- How the method works for new and existing applications
  n('practice', 'four-layer-graph', 'The four-layer graph', 'For an application in use, the graph has four layers, each an ontology: functional, design, architecture and code, linked so one search follows a user action through to the code behind it.', { video: ['6.1', '6.6-8'], pages: ['sdlc/methodology#the-four-layer-ontology', 'sdlc/methodology#cross-layer-traversal'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'citations', 'Every item cites its source', 'Every item in the graph points back to the document, design frame, ticket or code file it came from.', { video: ['6.9'], pages: ['sdlc/methodology#citations-at-every-layer'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'aperture', 'The aperture: only high-aperture knowledge', 'An item enters the graph when it has a wide blast radius; detail that affects nothing beyond itself stays in the specification and the code. The aperture starts narrow and widens.', { video: ['7.3-8'], pages: ['sdlc/methodology#aperture'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'graph-beside-specs', 'The graph beside the specification', 'The specification still describes each change in full; the graph supplies the design, architecture and code knowledge it lacks and governs how the change fits.', { video: ['5.5', '10.8-9'], pages: ['sdlc/translation-tax#three-sources-of-truth', 'sdlc/process#three-sources-of-truth'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'three-records', 'Three records of the work', 'The specification says what one change should do, the ticket system who is doing what, and the knowledge graph what the application does today.', { video: ['11.1-5'], pages: ['sdlc/process/implementation-sprint#the-three-sources-of-truth-in-operation'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'brownfield-extraction', 'Extraction from the existing application', 'Agents build the graph from the application itself: they parse the code, infer the architecture, trace journeys from the screens and exercise the running application; the custodians review their layers.', { video: ['19.1-3', '9.4-5'], pages: ['sdlc/methodology#brownfield-extraction'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('practice', 'graph-grows-with-code', 'The graph grows with the code', 'For a new application, new items enter the graph as the code that builds them merges.', { video: ['9.4', '12.7'], pages: ['sdlc/agents#the-kg-sync-agent'] }, { contexts: ['greenfield'], ...BREEZE }),
  n('practice', 'graph-matches-main', 'The graph matches the main branch', 'The graph keeps strict parity with the code: new items are proposed in the specification and enter the graph only when their code merges, and a planned target lives in the specifications until it reaches the code.', { video: ['12.7', '19.7'], pages: ['sdlc/methodology#paying-down-technical-debt'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'spec-sprint', 'The spec sprint', 'Preparing specifications gets its own sprint, a step ahead of implementation: the custodians meet, impact analysis reports what each specification touches, and each custodian reviews their layer.', { video: ['12.1-6', '12.8-9'], pages: ['sdlc/process/spec-sprint'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'impact-report', 'The impact report', 'Impact analysis follows the graph from a specification to everything it touches, writes a readable report for people and structured data for agents, and runs at the specification, after coding and at the pull request.', { video: ['13.1-5'], pages: ['sdlc/agents#two-kinds-of-output', 'sdlc/agents#when-impact-analysis-runs'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'coding-agents-via-mcp', 'Coding agents read the graph', 'Developers keep their coding agents, which connect to the graph through the Breeze.AI MCP server; the impact report goes into the agent\'s prompt.', { video: ['14.1-4'], pages: ['sdlc/agents#the-impact-analysis-agent'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'structure-fixed', 'Structure fixed, detail varies', 'The impact report fixes the structure of a change, so code generated twice differs in detail only, and review moves to whether the details are right.', { video: ['14.7-9'], pages: ['sdlc/agents#the-variance-bounding-insight'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'pr-validation', 'The pull request check', 'The PR Validation Agent compares each change with its impact report and checks it against all four layers; it fails a change that misses an outcome, duplicates a component, crosses a boundary or breaks a dependent.', { video: ['8.2-3', '15.1-4'], pages: ['sdlc/agents#the-pr-validation-agent'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'kg-sync', 'The graph updated before the merge', 'The KG Sync Agent updates the graph before the pull request merges, so the next impact analysis runs against the application as it is.', { video: ['8.4', '15.7-8'], pages: ['sdlc/agents#the-kg-sync-agent'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'bdd-generation', 'Test scenarios from the functional layer', 'The BDD Generation Agent writes test scenarios from the functional layer, each describing how the application should respond to a user\'s action.', { video: ['15.6'], pages: ['sdlc/agents#the-bdd-generation-agent'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'graph-health', 'The graph\'s own health measured', 'Twenty-nine metrics and fourteen verification checks measure the graph; a merge that fails a critical check is blocked.', { video: ['8.5-6'], pages: ['sdlc/methodology#governance-and-metrics'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'custodians-stay-human', 'The custodians stay human', 'Custodians work with knowledge no agent can read, such as customer calls and compliance decisions; agents draft updates to the graph and the custodians approve them.', { video: ['8.7-10', '20.6-8'], pages: ['sdlc/translation-tax#where-we-draw-the-line-on-automation'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'agent-owner', 'Every agent has a named owner', 'No agent runs without a named human owner, and people decide which work goes to agents.', { video: ['16.1-2'], pages: ['sdlc/agents#agent-ownership', 'modernization/agents#the-modernization-agent-fleet p4'] }),
  n('practice', 'repeatable-work-to-agents', 'Repeatable work to agents', 'Work with a repeatable pattern suits an agent once it has a record of reliable results on that pattern; new scope stays with people.', { video: ['16.3-5'], pages: ['sdlc/agents#which-work-goes-to-agents'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'progressive-autonomy', 'Autonomy earned in five levels', 'Agents earn autonomy over five levels, each step recorded in a written agreement, and step back down when results fall below the threshold.', { video: ['16.6-9'], pages: ['sdlc/agents#progressive-autonomy', 'modernization/agents#progressive-autonomy-in-the-modernization-fleet'] }),
  n('practice', 'ticket-carries-change', 'The ticket carries the change', 'Every step of a change, by a person or an agent, updates the ticket and attaches its results, so managers see the work in the system they already use.', { video: ['11.5-9', '17.1-2'], pages: ['sdlc/process/implementation-sprint#how-the-ticket-carries-the-change'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'agent-workbench', 'An agent workbench for high volume', 'Where requests arrive at high volume, triage agents classify each request, apply the product\'s priorities and route it to a person or an agent.', { video: ['17.4-6'], pages: ['sdlc/agents#high-volume-support-work'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'graph-per-product', 'One graph per product', 'Each product has one graph, shared by every team on it; where products integrate, impact analysis follows the integration points.', { video: ['7.9-11', '18.1-2', '18.7'], pages: ['sdlc/methodology#partition-by-product'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'enterprise-knowledge', 'Enterprise knowledge defined once', 'Compliance and security rules, infrastructure preferences, shared pipelines and an enterprise design system are defined once and read by every product\'s agents under access rights.', { video: ['18.5-6'], pages: ['sdlc/methodology#knowledge-shared-across-products'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'portfolio-sweep', 'A quarterly look across products', 'Every quarter, an agent looks across the product graphs for capability that is duplicated or no longer used.', { video: ['18.8'], pages: ['sdlc/methodology#cross-product-reasoning'] }, { contexts: LIVE, ...BREEZE }),
  n('practice', 'layered-team', 'Three layers of team', 'The custodians, the implementation teams, and an enablement layer; forward-deployed engineers fill any custodian role the client cannot staff yet.', { video: ['20.3-5'], pages: ['sdlc/process/team#the-layered-team-structure', 'sdlc/process/team#forward-deployed-engineers'] }, { contexts: LIVE, ...BREEZE }),

  // ---- How the method works for legacy modernization
  n('practice', 'source-state-graph', 'The Source-state ontology', 'A graph of the old system built from the legacy code by agents, keeping the actual code statements as evidence of the behavior to reproduce.', { video: ['23.2-3'], pages: ['modernization/methodology#the-source-state-ontology-in-detail'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'target-state-graph', 'The Target-state ontology', 'A graph of the new system built from the target blueprint: its architecture, runtime, standards and design system. Only legacy modernization has a graph of the target.', { video: ['23.4', '19.9'], pages: ['modernization/methodology#the-target-state-ontology-in-detail'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'modernization-spec', 'The specification between the graphs', 'The specification connects the two graphs and produces a requirements document, test scenarios, end-to-end test scripts and a code chatbot.', { video: ['23.5'], pages: ['modernization/methodology#the-specification-format-bridging-source-and-target'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'four-decisions', 'A decision on every module', 'The Product Owner and Architect mark every module Retain, Modify, Replace or Retire.', { video: ['23.6-10'], pages: ['modernization/methodology#the-annotation-discipline-retain-modify-replace-retire'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'parity-contract', 'The parity contract', 'The two graphs and the marked-up specification form the agreed definition of how the new system must behave, which the agents follow.', { video: ['24.1-3'], pages: ['modernization/methodology#the-parity-contract'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'four-gates', 'Four validation gates', 'Every piece of migrated code passes an architecture, a design, a standards and a functional gate, each run by its own agent, and goes back with evidence until all four pass.', { video: ['24.4-9'], pages: ['modernization/agents#validation-stage-agents'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'expert-review', 'People check at two points', 'People check the decisions in the specification before migration, and a modernization expert reviews code that has passed the gates.', { video: ['24.11', '25.10'], pages: ['modernization/process/operating-model#the-expert-review-pattern'] }, { contexts: LEGACY, ...ASIMOV }),
  n('practice', 'modernization-handover', 'The handover to the four-layer graph', 'When a modernization completes, a four-layer graph is built for the new system, its code layer extracted from the new code.', { video: ['26.6-10', '9.9'], pages: ['modernization/methodology#how-the-two-instantiations-connect-at-the-handoff'] }, { contexts: [...LEGACY, 'brownfield'], ...ASIMOV }),

  // ---- Products that agents use
  n('practice', 'graph-for-agents', 'An interface for agents from the graph', 'The graph records what a product provides, so an interface for customers\' agents can be built from it, and the graph governs which agent may use which capability.', { video: ['29.3-5'], pages: ['home#graphs-for-agent-facing-products'] }, { contexts: LIVE, ...BREEZE }),

  // ---- Recommendations
  n('recommendation', 'graph-for-complex', 'Use the graph where the application is complex', 'A large, complex or legacy application needs the knowledge graph, even when a single team works on it; complexity decides, and team count is one factor.', { video: ['10.3', '9.10'], pages: ['sdlc/zones/zone-2-spec-driven-development#when-this-zone-stops-working'] }),
  n('recommendation', 'extract-first', 'Start an existing application with extraction', 'Extract the graph from the code first, typically two to three weeks for more than two million lines, then govern every change against it.', { video: ['19.1-2', '27.3'], pages: ['sdlc/methodology#brownfield-extraction'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('recommendation', 'start-with-a-layer', 'Start with the layer that hurts', 'Adoption can be staged by layer: start with the one aligned to the active bottleneck, such as the design layer for a UI workstream.', { video: ['28.5-7'], pages: ['sdlc/case-archetypes#methodology-takeaways'] }, { contexts: LIVE, ...BREEZE }),
  n('recommendation', 'narrow-aperture-first', 'Keep the aperture narrow at first', 'Start with the widest-radius items and widen as the team gains confidence; when unsure, leave an item out.', { video: ['7.7-8'], pages: ['sdlc/methodology#how-the-aperture-matures'] }, { contexts: LIVE, ...BREEZE }),
  n('recommendation', 'one-product-at-a-time', 'One product at a time', 'A portfolio adopts the method one product at a time: the first builds its graph and process, then the next follows.', { video: ['18.3-4'], pages: ['sdlc/methodology#rolling-out-product-by-product'] }, { contexts: LIVE, ...BREEZE }),
  n('recommendation', 'four-phases', 'Advise, Launch, Scale, Optimize', 'A continuous SDLC engagement runs Advise (two to four weeks), Launch (about twelve weeks, the first graph and the gate), Scale, and Optimize.', { video: ['27.1-5'], pages: ['sdlc/engagement-model#the-four-phases'] }, { contexts: LIVE, ...BREEZE }),
  n('recommendation', 'add-spec-sprint', 'Add a spec sprint, keep the rest', 'The sprint, the ticket system and code review stay as they are; the team adds a spec sprint ahead of implementation.', { video: ['20.1-2'], pages: ['sdlc/process/spec-sprint#when-the-spec-sprint-is-worth-a-separate-cadence'] }, { contexts: LIVE, ...BREEZE }),
  n('recommendation', 'choose-a-mode', 'Choose an engagement mode', 'A modernization enters through one of five modes, from Documentation Only to Full Modernization, and may stop at any mode.', { video: ['25.1-8'], pages: ['modernization/engagement-modes#the-five-engagement-modes'] }, { contexts: LEGACY, ...ASIMOV }),
  n('recommendation', 'first-module', 'Migrate one module first', 'Full Modernization migrates one first module while subject-matter experts review the output and tune the agents, then migrates the rest.', { video: ['25.9-10'], pages: ['modernization/process/operating-model#stage-3-mvp-migration-one-identified-module'] }, { contexts: LEGACY, ...ASIMOV }),

  // ---- Limits the content states
  n('limit', 'small-apps-need-specs', 'A small application needs specifications only', 'A small application its team can hold in mind works well with a written specification for each change.', { video: ['10.1-2'], pages: ['sdlc/zones/zone-2-spec-driven-development'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'graph-not-a-spec', 'The graph does not replace specifications', 'The graph holds high-aperture knowledge only; the specification describes what to build, including the detail the graph leaves out.', { video: ['5.5', '10.9'], pages: ['sdlc/methodology#aperture'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'no-future-scope', 'The graph holds what is in the code', 'A planned target lives in the specifications until the change reaches the code; only a legacy modernization has a graph of its target.', { video: ['19.5-9'], pages: ['sdlc/methodology#paying-down-technical-debt'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'query-cost-grows', 'Query cost grows with the graph', 'The cost of a query grows with the size of the graph, so each graph is kept to one product.', { video: ['7.10', '18.2'], pages: ['sdlc/methodology#what-decides-it'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'over-inclusion', 'Everything in the graph overwhelms the team', 'Putting everything into the graph creates a maintenance burden that overwhelms the team within a few sprints.', { video: ['7.1-2'], pages: ['sdlc/methodology#aperture p1'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'agents-cannot-read-everything', 'Some knowledge no agent can read', 'Customer calls, compliance decisions, vendor contracts and user research reach the graph only through its custodians.', { video: ['8.8-9', '20.7'], pages: ['sdlc/translation-tax#where-we-draw-the-line-on-automation'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'detail-still-reviewed', 'Detail is still reviewed', 'Generated code still differs in detail, so code review continues; style, linting and unit test coverage stay in the team\'s build pipeline.', { video: ['14.7', '14.9', '15.5'], pages: ['sdlc/agents#what-the-gate-does-not-do'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'new-scope-stays-human', 'New scope stays with people', 'A new feature needs product, design and architecture judgment, so it stays with people.', { video: ['16.5'], pages: ['sdlc/agents#which-work-goes-to-agents'] }, { contexts: LIVE, ...BREEZE }),
  n('limit', 'contract-fixed', 'The contract is fixed for the project', 'Neither the recorded legacy behavior nor the target architecture can change during a modernization.', { video: ['24.2', '23.1'], pages: ['modernization/methodology#the-parity-contract'] }, { contexts: LEGACY, ...ASIMOV }),
  n('limit', 'module-needs-decision', 'A module without a decision cannot be migrated', 'Every module needs one of the four decisions before migration.', { video: ['23.11'], pages: ['modernization/methodology#the-annotation-discipline-retain-modify-replace-retire'] }, { contexts: LEGACY, ...ASIMOV }),
  n('limit', 'results-in-context', 'Results hold in their own context', 'Each figure holds in the context it was measured in; outcomes vary by scope, stack and the modules selected, and modeled figures are not measured results.', { video: ['21.1', '21.9', '26.5'], pages: ['home#numbers-from-real-engagements'] }),

  // ---- Cases
  n('case', 'brownfield-2m', 'An existing application of over two million lines', 'Five to six scrum teams; extraction built all four layers in two to three weeks, and impact analysis replaced three to five days of investigation by senior engineers.', { video: ['28.2-4'], pages: ['sdlc/case-archetypes#brownfield-enterprise-modernization'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('case', 'ui-workstream', 'A new user-interface workstream', 'A workstream that grew in complexity and started with the design layer; it reused 53 percent of its components in its first sprint.', { video: ['28.5-6', '21.6'], pages: ['sdlc/case-archetypes#greenfield-growing-into-complexity'] }, { contexts: ['greenfield'], ...BREEZE }),
  n('case', 'sdd-ceiling', 'Specification-driven development at its ceiling', 'A mature specification-driven team rewriting a legacy product, where review of hundreds of files per pull request became the bottleneck.', { pages: ['sdlc/case-archetypes#sdd-at-the-governance-ceiling'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('case', 'multi-product', 'Three products in a fourteen-week pilot', 'Deployments rose from 19 to 36 a month and lead time fell from 2.0 to 1.42 days; 60 percent of the team had named estimation and code comprehension as where the tax was paid.', { video: ['21.2-3', '3.5'], pages: ['sdlc/case-archetypes#delivery-outcomes-on-a-multi-product-engagement'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('case', 'alert-example', 'The saved-search alert change', 'On an application of 1.6 million lines, the impact report found an existing column, a likely and serious double-email risk, and the deployment order across three repositories.', { video: ['13.6-11'], pages: ['sdlc/agents#a-worked-example'] }, { contexts: ['brownfield'], ...BREEZE }),
  n('case', 'asimov-programs', 'Modernization programs with ASIMOV', 'More than fifteen million lines across more than ten programs, including Java 8 to Java 21, Delphi to cloud-native .NET 8, and 600 thousand lines of COBOL on AS400 to .NET 8 microservices.', { video: ['26.1-4'], pages: ['modernization/case-archetypes#aggregate-track-record', 'modernization/case-archetypes#mainframe-modernization-insurance', 'home#numbers-from-real-engagements'] }, { contexts: LEGACY, ...ASIMOV }),
];

const e = (from: string, rel: Relation, to: string, why: Evidence): Edge => ({ from, rel, to, why });
const nodeEvidence = (id: string): Evidence => NODES.find((x) => x.id === id)!.evidence;

export const EDGES: Edge[] = [
  // The tax and its components
  ...['ambiguity', 'non-persistence', 'non-traceability'].map((c) => e(c, 'part-of', 'manual-translation-tax', { video: ['3.6'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named p6'] })),
  e('manual-translation-tax', 'caused-by', 'knowledge-unwritten', { video: ['1.8', '2.12-13'], pages: ['sdlc/translation-tax#what-the-custodians-know-that-the-code-does-not-show'] }),
  ...['reverse-engineering-tax', 'lost-context-tax', 'validation-vacuum-tax', 'knowledge-disappearance-tax'].map((c) => e(c, 'part-of', 'modernization-tax', { video: ['22.4'], pages: ['modernization/translation-tax#the-four-components'] })),

  // Symptoms trace back to causes
  e('no-faster-delivery', 'caused-by', 'manual-translation-tax', { video: ['3.3-4'], pages: ['sdlc/translation-tax#the-manual-translation-tax-the-cost-named'] }),
  e('agents-make-mistakes', 'caused-by', 'knowledge-unwritten', { video: ['4.3-5'], pages: ['sdlc/translation-tax#why-ai-coding-agents-stall-on-this'] }),
  e('no-overall-gain', 'caused-by', 'knowledge-unwritten', { video: ['4.7'], pages: ['sdlc/case-archetypes#project-shape'] }),
  e('waiting-on-people', 'caused-by', 'manual-translation-tax', { video: ['2.11-13'], pages: ['sdlc/translation-tax#what-this-looks-like-on-a-sprint'] }),
  e('rework-from-misreading', 'caused-by', 'ambiguity', { video: ['3.7-10'] }),
  e('specs-fall-short', 'caused-by', 'knowledge-unwritten', { video: ['10.6'], pages: ['sdlc/process/spec-sprint#why-a-separate-cadence'] }),
  e('documentation-decays', 'caused-by', 'non-persistence', { video: ['3.19'], pages: ['sdlc/translation-tax#why-documentation-does-not-fix-it'] }),
  e('knowledge-leaves', 'caused-by', 'non-persistence', { video: ['3.11-12'] }),
  e('agent-starts-empty', 'caused-by', 'non-persistence', { video: ['3.13'] }),
  e('hidden-dependencies', 'caused-by', 'non-traceability', { video: ['3.14-16'] }),
  e('days-of-investigation', 'caused-by', 'non-traceability', { video: ['13.11'], pages: ['sdlc/agents#the-impact-analysis-agent'] }),
  e('boundary-violations', 'caused-by', 'non-traceability', { video: ['2.10'], pages: ['sdlc/agents#how-the-gate-catches-cross-team-contract-violations'] }),
  e('design-duplication', 'caused-by', 'knowledge-unwritten', { pages: ['sdlc/case-archetypes#the-evolution'] }),
  e('legacy-experts-gone', 'caused-by', 'knowledge-disappearance-tax', { video: ['22.2', '22.8'] }),
  e('modernization-stalls', 'caused-by', 'validation-vacuum-tax', { video: ['22.7', '22.10-11'], pages: ['modernization/translation-tax#why-the-tax-compounds'] }),

  e('legacy-undocumented', 'caused-by', 'reverse-engineering-tax', { video: ['22.5'], pages: ['modernization/translation-tax#the-four-components p2'] }),
  e('senior-engineers-tied-up', 'caused-by', 'reverse-engineering-tax', { video: ['22.5'], pages: ['modernization/translation-tax#why-the-tax-compounds p2'] }),
  e('unknown-quirks', 'caused-by', 'lost-context-tax', { video: ['22.6'], pages: ['modernization/translation-tax#why-the-tax-compounds p3'] }),
  e('hand-built-checks', 'caused-by', 'validation-vacuum-tax', { video: ['22.7'], pages: ['modernization/translation-tax#the-four-components p2'] }),
  e('understanding-leaves', 'caused-by', 'knowledge-disappearance-tax', { video: ['22.8'], pages: ['modernization/translation-tax#why-the-tax-compounds p5'] }),
  e('legacy-undocumented', 'addressed-by', 'asimov-discover', { video: ['23.2-3'], pages: ['modernization/agents#how-the-pipeline-runs p2'] }),
  e('senior-engineers-tied-up', 'addressed-by', 'asimov-discover', { video: ['23.2'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('unknown-quirks', 'addressed-by', 'asimov-document', { video: ['23.6-8'], pages: ['modernization/methodology#the-annotation-discipline-retain-modify-replace-retire'] }),
  e('hand-built-checks', 'addressed-by', 'asimov-validate', { video: ['24.8-9'], pages: ['modernization/agents#how-the-pipeline-runs p8'] }),
  e('understanding-leaves', 'addressed-by', 'asimov-maintain', { video: ['26.6-7'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),

  // Causes and symptoms are addressed
  e('knowledge-unwritten', 'addressed-by', 'knowledge-graph', { video: ['4.11', '5.2'], pages: ['sdlc/translation-tax#the-structural-response'] }),
  e('manual-translation-tax', 'addressed-by', 'knowledge-graph', { video: ['3.20', '5.1-2'], pages: ['sdlc/translation-tax#the-structural-response'] }),
  e('ambiguity', 'addressed-by', 'four-layer-graph', { video: ['6.2'], pages: ['sdlc/methodology#the-functional-ontology-in-detail'] }),
  e('non-persistence', 'addressed-by', 'knowledge-graph', { video: ['5.2-3'] }),
  e('non-traceability', 'addressed-by', 'four-layer-graph', { video: ['6.6'], pages: ['sdlc/methodology#cross-layer-traversal'] }),
  e('no-faster-delivery', 'addressed-by', 'impact-analysis', { video: ['21.2-3'], pages: ['sdlc/case-archetypes#where-the-manual-translation-tax-was-paid'] }),
  e('agents-make-mistakes', 'addressed-by', 'coding-agents-via-mcp', { video: ['14.3-5'] }),
  e('agents-make-mistakes', 'addressed-by', 'validation-gates', { video: ['5.8'] }),
  e('no-overall-gain', 'addressed-by', 'brownfield-extraction', { video: ['28.3-4'], pages: ['sdlc/case-archetypes#what-changed-in-how-the-team-works'] }),
  e('waiting-on-people', 'addressed-by', 'spec-sprint', { video: ['12.3-6'] }),
  e('rework-from-misreading', 'addressed-by', 'spec-sprint', { video: ['12.6', '12.9'] }),
  e('specs-fall-short', 'addressed-by', 'graph-beside-specs', { video: ['10.8-9'] }),
  e('specs-fall-short', 'addressed-by', 'spec-sprint', { video: ['12.1-2'] }),
  e('design-duplication', 'addressed-by', 'pr-validation', { video: ['15.3'], pages: ['sdlc/agents#how-the-gate-catches-design-system-duplication'] }),
  e('design-duplication', 'addressed-by', 'start-with-a-layer', { video: ['28.5-6'] }),
  e('documentation-decays', 'addressed-by', 'kg-sync', { video: ['15.7-8'], pages: ['sdlc/agents#why-sync-must-be-continuous'] }),
  e('documentation-decays', 'addressed-by', 'named-ownership', { video: ['5.7'] }),
  e('days-of-investigation', 'addressed-by', 'impact-report', { video: ['13.7-11'] }),
  e('boundary-violations', 'addressed-by', 'pr-validation', { video: ['15.3-4'], pages: ['sdlc/agents#how-the-gate-catches-cross-team-contract-violations'] }),
  e('hidden-dependencies', 'addressed-by', 'impact-report', { video: ['13.9'] }),
  e('knowledge-leaves', 'addressed-by', 'knowledge-graph', { video: ['5.2'] }),
  e('agent-starts-empty', 'addressed-by', 'coding-agents-via-mcp', { video: ['14.2-4'] }),
  e('review-overload', 'addressed-by', 'structure-fixed', { video: ['14.8-9'], pages: ['sdlc/case-archetypes#where-se-goes-next'] }),
  e('review-overload', 'addressed-by', 'pr-validation', { pages: ['sdlc/case-archetypes#where-se-goes-next'] }),
  e('fast-technical-debt', 'addressed-by', 'graph-matches-main', { video: ['19.7-8'], pages: ['sdlc/methodology#paying-down-technical-debt'] }),
  e('duplicated-capability', 'addressed-by', 'portfolio-sweep', { video: ['18.8'] }),
  e('duplicated-capability', 'addressed-by', 'brownfield-extraction', { video: ['19.3'], pages: ['sdlc/methodology#extraction-as-rationalization'] }),
  e('work-not-visible', 'addressed-by', 'ticket-carries-change', { video: ['17.1-2'] }),
  e('work-not-visible', 'addressed-by', 'agent-workbench', { video: ['17.4-5'] }),
  e('reverse-engineering-tax', 'addressed-by', 'source-state-graph', { video: ['23.2'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('lost-context-tax', 'addressed-by', 'four-decisions', { video: ['23.6-8'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('validation-vacuum-tax', 'addressed-by', 'four-gates', { video: ['24.8'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('knowledge-disappearance-tax', 'addressed-by', 'modernization-handover', { video: ['26.6-10'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('legacy-experts-gone', 'addressed-by', 'source-state-graph', { video: ['23.3'] }),
  e('modernization-stalls', 'addressed-by', 'parity-contract', { video: ['24.1'], pages: ['modernization/methodology#the-parity-contract'] }),

  // What each principle and practice builds on
  e('four-layer-graph', 'requires', 'knowledge-graph', { video: ['6.1'] }),
  e('four-layer-graph', 'requires', 'named-ownership', { video: ['6.2-5'] }),
  e('citations', 'requires', 'knowledge-graph', { video: ['6.9'] }),
  e('aperture', 'requires', 'knowledge-graph', { video: ['7.3'] }),
  e('graph-beside-specs', 'requires', 'knowledge-graph', { video: ['10.8'] }),
  e('three-records', 'requires', 'graph-beside-specs', { video: ['11.2-4'] }),
  e('brownfield-extraction', 'requires', 'four-layer-graph', { video: ['9.4'] }),
  e('brownfield-extraction', 'requires', 'custodians-stay-human', { video: ['19.1'] }),
  e('graph-grows-with-code', 'requires', 'kg-sync', { video: ['12.7'] }),
  e('graph-matches-main', 'requires', 'kg-sync', { video: ['8.4'] }),
  e('spec-sprint', 'requires', 'impact-report', { video: ['12.5'] }),
  e('spec-sprint', 'requires', 'named-ownership', { video: ['12.6'] }),
  e('impact-report', 'requires', 'impact-analysis', { video: ['13.1'] }),
  e('impact-report', 'requires', 'four-layer-graph', { video: ['13.1'] }),
  e('coding-agents-via-mcp', 'requires', 'impact-report', { video: ['14.3'] }),
  e('structure-fixed', 'requires', 'coding-agents-via-mcp', { video: ['14.8'] }),
  e('pr-validation', 'requires', 'validation-gates', { video: ['8.1-2'] }),
  e('pr-validation', 'requires', 'impact-report', { video: ['15.2'] }),
  e('kg-sync', 'requires', 'knowledge-graph', { video: ['8.4'] }),
  e('bdd-generation', 'requires', 'four-layer-graph', { video: ['15.6'] }),
  e('graph-health', 'requires', 'validation-gates', { video: ['8.5-6'] }),
  e('custodians-stay-human', 'requires', 'named-ownership', { video: ['8.7'] }),
  e('agent-owner', 'requires', 'named-ownership', { video: ['16.1'] }),
  e('repeatable-work-to-agents', 'requires', 'agent-owner', { video: ['16.2-3'] }),
  e('progressive-autonomy', 'requires', 'agent-owner', { video: ['16.7'] }),
  e('ticket-carries-change', 'requires', 'three-records', { video: ['11.5'] }),
  e('agent-workbench', 'requires', 'agent-owner', { video: ['17.5'] }),
  e('graph-per-product', 'requires', 'knowledge-graph', { video: ['7.9'] }),
  e('enterprise-knowledge', 'requires', 'graph-per-product', { video: ['18.5-6'] }),
  e('portfolio-sweep', 'requires', 'graph-per-product', { video: ['18.8'] }),
  e('layered-team', 'requires', 'named-ownership', { video: ['20.3-4'] }),
  e('source-state-graph', 'requires', 'knowledge-graph', { video: ['23.1-2'] }),
  e('target-state-graph', 'requires', 'knowledge-graph', { video: ['23.4'] }),
  e('modernization-spec', 'requires', 'source-state-graph', { video: ['23.5'] }),
  e('modernization-spec', 'requires', 'target-state-graph', { video: ['23.5'] }),
  e('four-decisions', 'requires', 'modernization-spec', { video: ['23.6'] }),
  e('four-decisions', 'requires', 'named-ownership', { video: ['23.6'] }),
  e('parity-contract', 'requires', 'four-decisions', { video: ['24.1'] }),
  e('four-gates', 'requires', 'parity-contract', { video: ['24.3-4'] }),
  e('four-gates', 'requires', 'validation-gates', { video: ['24.4'] }),
  e('expert-review', 'requires', 'four-gates', { video: ['24.11'] }),
  e('modernization-handover', 'requires', 'four-layer-graph', { video: ['26.6-7'] }),
  e('graph-for-agents', 'requires', 'knowledge-graph', { video: ['29.3-4'] }),

  // Stated limits
  e('knowledge-graph', 'limited-by', 'graph-not-a-spec', { video: ['5.5'] }),
  e('knowledge-graph', 'limited-by', 'small-apps-need-specs', { video: ['10.1-3'] }),
  e('four-layer-graph', 'limited-by', 'query-cost-grows', { video: ['7.10'] }),
  e('aperture', 'limited-by', 'over-inclusion', { video: ['7.1-3'] }),
  e('graph-matches-main', 'limited-by', 'no-future-scope', { video: ['19.7'] }),
  e('graph-per-product', 'limited-by', 'query-cost-grows', { video: ['18.2'] }),
  e('custodians-stay-human', 'limited-by', 'agents-cannot-read-everything', { video: ['8.8-9'] }),
  e('structure-fixed', 'limited-by', 'detail-still-reviewed', { video: ['14.7-9'] }),
  e('pr-validation', 'limited-by', 'detail-still-reviewed', { video: ['15.5'] }),
  e('repeatable-work-to-agents', 'limited-by', 'new-scope-stays-human', { video: ['16.5'] }),
  e('parity-contract', 'limited-by', 'contract-fixed', { video: ['24.2'] }),
  e('four-decisions', 'limited-by', 'module-needs-decision', { video: ['23.11'] }),
  e('target-state-graph', 'limited-by', 'contract-fixed', { video: ['24.2'] }),

  ...['brownfield-2m', 'ui-workstream', 'multi-product', 'asimov-programs'].map((c) => e(c, 'limited-by', 'results-in-context', { video: ['21.1', '26.5'], pages: ['home#numbers-from-real-engagements'] })),

  // Cases
  e('brownfield-extraction', 'shown-in', 'brownfield-2m', { video: ['28.3'] }),
  e('impact-report', 'shown-in', 'brownfield-2m', { video: ['28.4'] }),
  e('impact-report', 'shown-in', 'alert-example', { video: ['13.6-10'] }),
  e('start-with-a-layer', 'shown-in', 'ui-workstream', { video: ['28.5-6'] }),
  e('pr-validation', 'shown-in', 'ui-workstream', { video: ['21.6'] }),
  e('graph-beside-specs', 'shown-in', 'sdd-ceiling', { pages: ['sdlc/case-archetypes#where-se-goes-next'] }),
  e('impact-analysis', 'shown-in', 'multi-product', { video: ['21.2-3'] }),
  e('parity-contract', 'shown-in', 'asimov-programs', { video: ['26.1'] }),

  // Which platform runs each kind of work
  e('greenfield', 'runs-on', 'breeze-ai', { video: ['9.3'], pages: ['home#two-platforms-one-methodology'] }),
  e('brownfield', 'runs-on', 'breeze-ai', { video: ['19.1'], pages: ['home#two-platforms-one-methodology'] }),
  e('legacy-modernization', 'runs-on', 'asimov', { video: ['24.12'], pages: ['home#two-platforms-one-methodology'] }),

  // The method, in order
  e('asimov-discover', 'precedes', 'asimov-document', { video: ['23.5'], pages: ['modernization/agents#how-the-pipeline-runs p4'] }),
  e('asimov-document', 'precedes', 'asimov-migrate', { video: ['24.3'], pages: ['modernization/agents#how-the-pipeline-runs p4'] }),
  e('asimov-migrate', 'precedes', 'asimov-validate', { video: ['24.4'], pages: ['modernization/agents#how-the-pipeline-runs p7'] }),
  e('asimov-validate', 'precedes', 'asimov-maintain', { video: ['26.6'], pages: ['modernization/agents#how-the-pipeline-runs p11'] }),
  e('breeze-extract', 'precedes', 'breeze-spec-sprint', { video: ['19.1', '12.2'], pages: ['sdlc/engagement-model#the-four-phases p13'] }),
  e('breeze-functional-first', 'precedes', 'breeze-spec-sprint', { video: ['12.2'], pages: ['sdlc/engagement-model#the-four-phases p11'] }),
  e('breeze-spec-sprint', 'precedes', 'breeze-build', { video: ['12.8-9'], pages: ['sdlc/process/implementation-sprint#the-per-change-sdlc-flow p3'] }),
  e('breeze-build', 'precedes', 'breeze-check', { video: ['15.1'], pages: ['sdlc/process/implementation-sprint#the-per-change-sdlc-flow p3'] }),
  e('breeze-check', 'precedes', 'breeze-sync', { video: ['15.7'], pages: ['sdlc/process/implementation-sprint#the-per-change-sdlc-flow p3'] }),

  // What each step carries out
  ...([
    ['asimov-discover', 'source-state-graph'], ['asimov-discover', 'target-state-graph'], ['asimov-document', 'modernization-spec'], ['asimov-document', 'four-decisions'],
    ['asimov-migrate', 'parity-contract'], ['asimov-validate', 'four-gates'], ['asimov-validate', 'expert-review'], ['asimov-maintain', 'modernization-handover'],
    ['breeze-extract', 'brownfield-extraction'], ['breeze-functional-first', 'graph-grows-with-code'], ['breeze-functional-first', 'four-layer-graph'],
    ['breeze-spec-sprint', 'spec-sprint'], ['breeze-spec-sprint', 'impact-report'], ['breeze-build', 'coding-agents-via-mcp'], ['breeze-build', 'structure-fixed'],
    ['breeze-check', 'pr-validation'], ['breeze-sync', 'kg-sync'],
  ] as const).map(([a, b]) => e(a, 'uses', b, nodeEvidence(a))),

  // Symptoms the steps answer
  e('legacy-experts-gone', 'addressed-by', 'asimov-discover', { video: ['23.2-3'], pages: ['modernization/agents#how-the-pipeline-runs p2'] }),
  e('reverse-engineering-tax', 'addressed-by', 'asimov-discover', { video: ['23.2'], pages: ['modernization/translation-tax#how-the-methodology-addresses-each-component'] }),
  e('modernization-stalls', 'addressed-by', 'asimov-validate', { video: ['24.8-9'], pages: ['modernization/agents#how-the-pipeline-runs p8'] }),
  e('no-overall-gain', 'addressed-by', 'breeze-extract', { video: ['28.3-4'], pages: ['sdlc/case-archetypes#what-changed-in-how-the-team-works'] }),
  e('days-of-investigation', 'addressed-by', 'breeze-spec-sprint', { video: ['12.5'], pages: ['sdlc/process#the-two-sprints p2'] }),

  // Recommendations apply to kinds of work
  e('extract-first', 'applies-to', 'brownfield', { video: ['19.1'] }),
  e('start-with-a-layer', 'applies-to', 'greenfield', { video: ['28.5'] }),
  e('start-with-a-layer', 'applies-to', 'brownfield', { pages: ['sdlc/case-archetypes#methodology-takeaways'] }),
  e('narrow-aperture-first', 'applies-to', 'greenfield', { video: ['7.8'] }),
  e('narrow-aperture-first', 'applies-to', 'brownfield', { video: ['7.8'] }),
  e('one-product-at-a-time', 'applies-to', 'brownfield', { video: ['18.3'] }),
  e('four-phases', 'applies-to', 'greenfield', { video: ['27.1'] }),
  e('four-phases', 'applies-to', 'brownfield', { video: ['27.1'] }),
  e('add-spec-sprint', 'applies-to', 'greenfield', { video: ['20.2'] }),
  e('add-spec-sprint', 'applies-to', 'brownfield', { video: ['20.2'] }),
  e('choose-a-mode', 'applies-to', 'legacy-modernization', { video: ['25.1'] }),
  e('first-module', 'applies-to', 'legacy-modernization', { video: ['25.9'] }),
  e('graph-for-complex', 'applies-to', 'greenfield', { video: ['10.3'], pages: ['sdlc/case-archetypes#methodology-takeaways'] }),
  e('graph-for-complex', 'applies-to', 'brownfield', { video: ['10.3'] }),
  e('graph-for-complex', 'applies-to', 'legacy-modernization', { video: ['10.3'] }),
];

export const nodeById = (id: string) => NODES.find((x) => x.id === id);
