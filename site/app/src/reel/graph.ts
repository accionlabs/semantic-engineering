// The knowledge graph of the paper's domain. DRAFT for the author's review: every node and edge is a
// claim about the argument, and the author is its custodian.
//
// Evidence refers to the video by scene and sentence ("5.2", "6.6-8") and to the paper by section and
// paragraph ("3 p2", "4.1 p3"; "16" alone when a section has no numbered paragraphs). Definitions keep
// to the paper's own terms. No browser APIs, so the MCP server shares it.

export type Evidence = { video?: string[]; paper?: string[] };
export type Kind = 'context' | 'layer' | 'demand' | 'cause' | 'symptom' | 'principle' | 'recommendation' | 'limit' | 'case';
export type Node = { id: string; kind: Kind; label: string; definition: string; evidence: Evidence; layer?: string; contexts?: ('brownfield' | 'greenfield')[]; today?: number; after?: number };
export type Relation =
  | 'meets'        // a demand meets a symptom in today's product
  | 'occurs-in'    // a symptom occurs in a layer
  | 'caused-by'    // a symptom traces back to a cause
  | 'addressed-by' // a symptom or cause is addressed by a principle or recommendation
  | 'requires'     // a principle builds on another principle
  | 'limited-by'   // a principle carries a stated limit
  | 'shown-in'     // a principle is illustrated by a case
  | 'applies-to';  // a recommendation applies to a context
export type Edge = { from: string; rel: Relation; to: string; why: Evidence };

const n = (kind: Kind, id: string, label: string, definition: string, evidence: Evidence, extra: Partial<Node> = {}): Node => ({ id, kind, label, definition, evidence, ...extra });

export const NODES: Node[] = [
  // ---- Where the product starts
  n('context', 'brownfield', 'Brownfield', 'An existing product with customers and revenue on its lower layers.', { video: ['15.4'], paper: ['5 p2'] }),
  n('context', 'greenfield', 'Greenfield', 'A new product with nothing running yet, free to build from the bottom.', { video: ['15.3'], paper: ['5 p2', '5 p3'] }),

  // ---- The layers, top to bottom, with the scene that shows each today and after the line moves
  n('layer', 'onboarding', 'Onboarding and configuration', 'Gathering requirements, mapping them to features and configuration, customising, migrating data and training people.', { video: ['5.1'], paper: ['6 p1', '6 p3'] }, { today: 5, after: 19 }),
  n('layer', 'interface', 'Interface and APIs', 'The screens and APIs through which people, and increasingly their agents, operate the product.', { video: ['6.1'], paper: ['7 p1'] }, { today: 6, after: 20 }),
  n('layer', 'business-rules', 'Business rules', "How each customer's policies, approvals and workflows apply the product's capabilities.", { video: ['7.1'], paper: ['2 p3'] }, { today: 7, after: 21 }),
  n('layer', 'invariants', 'Domain invariants', 'The entities, calculations and relationships every customer relies on, which do not vary between customers.', { video: ['8.1', '11.5-6'], paper: ['2 p3', '8 p2'] }, { today: 8, after: 11 }),
  n('layer', 'deep-layers', 'Data model, database and infrastructure', 'The layers every customer stands on, where risk is greatest.', { video: ['9.1-2'], paper: ['5 p1'] }, { today: 9, after: 22 }),
  n('layer', 'bill', 'The bill', 'What the customer pays, and what it pays for.', { video: ['10.1'], paper: ['4 p1'] }, { today: 10, after: 23 }),

  // ---- What customers now expect
  n('demand', 'immediate-use', 'Immediate use', 'Customers expect to start using the product without a project measured in months.', { video: ['4.2'], paper: ['3 p2'] }),
  n('demand', 'easy-change', 'Easy change', 'After go-live, a change for one customer should be a small, contained action.', { video: ['4.3'], paper: ['3 p3'] }),
  n('demand', 'personal-below-tenant', 'Personalisation below the tenant', 'Customers want the product fitted to each user, below the tenant.', { video: ['4.4'], paper: ['3 p4'] }),
  n('demand', 'agent-operable', 'Operable by their agents', "Customers increasingly expect their own agents to operate the product.", { video: ['4.5'], paper: ['3 p5'] }),

  // ---- The root cause
  n('cause', 'line-drawn-high', 'The line drawn high', 'Practice pushes the multi-tenancy line as high as it will go, which fixes the product\'s flexibility at design time.', { video: ['1.7-10', '10.4'], paper: ['2 p2', '1 p4'] }),

  // ---- Symptoms, by layer
  n('symptom', 'months-to-go-live', 'Months to go live', 'The customer cannot use the product until onboarding is done, and enterprise implementation is still measured in months.', { video: ['5.2'], paper: ['3 p2'] }, { layer: 'onboarding' }),
  n('symptom', 'errors-after-go-live', 'Errors after go-live', 'A schema lists fields and types, while the rules for valid combinations are written nowhere it can enforce, so errors surface after go-live.', { video: ['5.4'], paper: ['10 p3', '10 p4', '6 p2'] }, { layer: 'onboarding' }),
  n('symptom', 'knowledge-in-few-heads', 'Knowledge in a few heads', 'The knowledge sits with a few people, every attribute needs review, and the work repeats whenever a law, a policy or the organisation changes.', { video: ['5.5'], paper: ['10 p5', '14 p3'] }, { layer: 'onboarding' }),
  n('symptom', 'same-screens-for-all', 'Same screens for everyone', 'Every customer sees the same screens, and personalisation stops at the tenant.', { video: ['6.3'], paper: ['3 p4'] }, { layer: 'interface' }),
  n('symptom', 'agents-cannot-operate', 'Agents cannot operate it', "An API bypasses the screens, but an agent still has to learn the product's rules from somewhere else, and a product that needs a person clicking through menus is one their agents cannot use.", { video: ['6.4-5'], paper: ['3 p6', '3 p7'] }, { layer: 'interface' }),
  n('symptom', 'cost-grows-with-screens', 'Cost grows with every screen', 'Modernising means wireframe, build and review, one screen at a time; agents make each screen faster, and the cost still grows with the number of screens.', { video: ['6.6-8'], paper: ['7 p2'] }, { layer: 'interface' }),
  n('symptom', 'no-middle-option', 'No middle option', 'When the workflows cannot express a need, either the configuration exposes a value for it or it becomes an engineering change to shared code.', { video: ['7.3-4'], paper: ['2 p6'] }, { layer: 'business-rules' }),
  n('symptom', 'special-cases-in-shared-code', 'Special cases in shared code', 'A request the configuration did not anticipate arrives with a deadline, and the quickest answer is a special case in code every tenant runs.', { video: ['2.1', '2.3'], paper: ['1.1 p1', '1.1 p2'] }, { layer: 'business-rules' }),
  n('symptom', 'cross-tenant-defects', 'Defects in other tenants', 'A change made for one customer can surface as a defect for another, and the debt compounds because it sits in the shared layers.', { video: ['7.5'], paper: ['1.1 p3'] }, { layer: 'business-rules' }),
  n('symptom', 'core-value-unstated', 'Core value stated as delivery', "The value proposition is stated in terms of delivery, which is cheap to replicate once code is cheap, while the product's encoded understanding of its domain goes unstated.", { video: ['3.5'], paper: ['1.3 p1', '1.3 p2'] }, { layer: 'invariants' }),
  n('symptom', 'risky-invariant-change', 'Risky changes to what every tenant shares', 'The invariants still change, less often and with more at stake, because every tenant stands on them.', { video: ['14.1'], paper: ['8 p3'] }, { layer: 'invariants' }),
  n('symptom', 'custom-fields-at-the-edge', 'Custom fields at the edge', 'Data the model did not include goes into custom fields stored as metadata, which often hold information at the edge of the domain.', { video: ['9.3-4'], paper: ['2 p7'] }, { layer: 'deep-layers' }),
  n('symptom', 'deep-change-risk', 'Deep changes are hard to see or reverse', 'Risk grows with depth: a change to the deep layers cannot easily be seen, compared or reversed, so they change last, if at all.', { video: ['9.5-7'], paper: ['5 p1'] }, { layer: 'deep-layers' }),
  n('symptom', 'paying-for-unused', 'Paying for what is not used', 'A tier bundles a common set of capabilities whether this customer needs them or not.', { video: ['10.2'], paper: ['4 p1', '4 p2'] }, { layer: 'bill' }),
  n('symptom', 'seats-losing-ground', 'Seat pricing losing ground', 'Seat-based pricing loses ground as agents take on work that users used to do.', { video: ['10.3'], paper: ['4 p3'] }, { layer: 'bill' }),

  // ---- Principles of the approach
  n('principle', 'invariants-as-core', 'The invariants are the core value', "The domain invariants are where correctness is decided and what the revenue depends on, so the architecture needs a layer that holds them, with everything that varies built on top.", { video: ['11.5-9'], paper: ['1.3 p2', '1.3 p4'] }),
  n('principle', 'knowledge-graph-inventory', 'The knowledge graph as the inventory', "A product's knowledge graph records the invariants: its capabilities, workflows and entities, and nothing specific to one customer.", { video: ['11.10-11'], paper: ['8 p1', '8 p2'] }),
  n('principle', 'line-moves-down', 'The line moves down onto the invariants', 'Below the line, shared: the invariants, a compiler for the language, the data platform and the infrastructure. Above it, per customer: onboarding, the interface and each customer\'s business rules.', { video: ['12.6-9'], paper: ['2 p9', '2 p10', '2 p11'] }),
  n('principle', 'domain-language', 'A language over the invariants', 'The invariants are its vocabulary, and its grammar says how business rules may combine them: which parts may vary, what values they admit, and which combinations are legal.', { video: ['12.4-5'], paper: ['9 p1', '9 p2', '10 p6'] }),
  n('principle', 'agents-write', 'Agents write in the language', "A domain expert states the intent in plain language, and an agent writes it in the domain's own vocabulary; the grammar splits one long step into two shorter ones.", { video: ['13.1-7'], paper: ['9 p7', '11 p2'] }),
  n('principle', 'checked-by-running', 'Checked by running', 'A validator rejects anything malformed with a location and a reason, functional tests run against a case corpus, and the compiler turns the result into something the expert can see.', { video: ['13.8-10'], paper: ['12 p3', '12 p4', '9.1 p6'] }),
  n('principle', 'bounded-language', 'A bounded language', 'A request the language cannot express is refused, and an agent working in it cannot add an API, a table or a code path, so the shared layers stay out of its reach.', { video: ['13.11', '13.13'], paper: ['9.1 p1', '9 p4'] }),
  n('principle', 'govern-invariants', 'Governing the invariants', 'Semantic engineering governs changes below the line: agents trace every change through the graph and report its impact before code is written, and a change merges only when checks against the graph pass.', { video: ['14.2-7'], paper: ['8 p3'] }),
  n('principle', 'onboarding-as-document', 'Onboarding as one checked document', "Requirements are stated in the domain's vocabulary and written as a document that is checked before anything is applied, drives the migration, and compiles to inputs the product already accepts.", { video: ['19.2-8'], paper: ['6 p4', '2 p5'] }),
  n('principle', 'screen-grammar', 'A grammar of screens', "A screen becomes a document checked against the domain's rules, so a tenant's or a user's layout is a variation the agent can write; a fixed cost, then a falling cost per screen.", { video: ['20.2-4', '20.6'], paper: ['7 p3', '7 p4'] }),
  n('principle', 'agent-addressable', 'The language is what agents need', "The same language is what a customer's own agent needs to operate the product in the domain's terms.", { video: ['20.8'], paper: ['3 p7'] }),
  n('principle', 'rules-over-invariants', "Each customer's rules over the invariants", "A customer's variation becomes that customer's own business rules, checked against the invariants, and the shared code stays as it is.", { video: ['21.2-3'], paper: ['2 p11'] }),
  n('principle', 'change-path', 'A path for each customer change', "A change goes first into that customer's own document; where the language cannot express it, into a plugin scoped to that customer, generalised once the need recurs.", { paper: ['15 p3', '15 p4', '15 p5'] }),
  n('principle', 'deep-layers-stay', 'The deep layers stay shared', 'In a brownfield product the data model, database and infrastructure stay shared and unchanged, out of reach of an agent working in the language; needs that reach them are handled case by case.', { video: ['22.1-4'], paper: ['9 p4'] }, { contexts: ['brownfield'] }),
  n('principle', 'bill-of-materials', 'The document is a bill of materials', "The customer's document lists the capabilities it uses and how they are put together, so the price can follow it: each capability used, plus the work of assembling them.", { video: ['23.2-3', '23.5-6'], paper: ['4.1 p1', '4.1 p3', '4.2 p1'] }),
  n('principle', 'packages-and-outcomes', 'Packages and outcomes beside components', 'Packages for common scenarios, priced on their value, sit beside the components, and outcome pricing meters what the assembly then does.', { video: ['23.4'], paper: ['4.3 p2', '4.4 p2'] }),

  // ---- Recommendations
  n('recommendation', 'top-down', 'Work from the top down', 'A brownfield product follows the customer\'s journey: onboarding first, then the interface, then the business rules, later or not at all.', { video: ['15.4-5'], paper: ['5 p1', '5 p2'] }, { contexts: ['brownfield'] }),
  n('recommendation', 'bottom-up', 'Build from the bottom', 'A greenfield product designs its execution layer and data model to be driven by a document.', { video: ['15.3'], paper: ['5 p3'] }, { contexts: ['greenfield'] }),
  n('recommendation', 'onboarding-first', 'Take onboarding first', 'It touches no product code, and its value shows in cycle time on the process that gates revenue.', { video: ['16.4'], paper: ['14 p4', '6 p1'] }, { contexts: ['brownfield'] }),
  n('recommendation', 'no-screen-programme', 'No screen-by-screen programme', 'Do not staff a screen-by-screen interface programme now; fix only the screens that are losing deals.', { video: ['16.2'], paper: ['14 p2'] }, { contexts: ['brownfield'] }),
  n('recommendation', 'grammar-and-compiler', 'Invest in the grammar and compiler', 'They are the durable assets: the grammar encodes the mapping from requirement to capability that a few people hold today.', { video: ['16.3'], paper: ['14 p3'] }, { contexts: ['brownfield', 'greenfield'] }),
  n('recommendation', 'design-line-in', 'Design the lower line into a re-architecture', 'Where a company already plans to rebuild the layer that applies configuration, that rebuild is the place to design the lower line in.', { video: ['16.5', '22.5'], paper: ['14 p5'] }, { contexts: ['brownfield'] }),

  // ---- Limits the paper states
  n('limit', 'sharing-given-up', 'Some sharing is given up', 'Lowering the line gives up some of the sharing that justified the original design, affordable only once the per-customer part is cheap to produce.', { video: ['12.9'], paper: ['2 p12'] }),
  n('limit', 'errors-inside-language', 'Errors inside the language remain possible', 'An agent writing inside the language can still be wrong, which is why the tests carry the weight.', { video: ['13.12'], paper: ['9.1 p4', '9.1 p5'] }),
  n('limit', 'grammar-is-judgement', 'The grammar is architectural judgement', 'Deciding what becomes a primitive, a parameter or stays as configuration is a decision an architect makes.', { video: ['13.14', '21.5'], paper: ['15 p1', '15 p2'] }),
  n('limit', 'rate-not-guarantee', 'A faster rate, still reviewed', 'The evidence supports a faster rate of screen conversion, with close review of the first screens.', { video: ['20.6-7'], paper: ['7 p6'] }),
  n('limit', 'runtime-needs-platform', 'Run-time interfaces need a platform', 'Composing the interface at run time, per user, needs a platform that accepts a desired-state description, which usually means new platform work.', { video: ['20.5'], paper: ['7 p5'] }),
  n('limit', 'component-underpricing', 'Components can under-price value', 'What the customer values is what the assembled whole does, and a component price can under-price that.', { paper: ['4.3 p1'] }),
  n('limit', 'falsifiers', 'What would show this wrong', 'Grammar coverage that stalls, semantic errors that survive validation, and a case corpus that proves impractical to build.', { video: ['17.1'], paper: ['16'] }),

  // ---- The two applications
  n('case', 'wadi', 'Wadi, the greenfield case', 'A house-design application built around its language: an agent writes the documents, and the controls are generated from them. Its case corpus has not been built.', { video: ['18.2-3'], paper: ['13.1 p1', '13.1 p3', '13.1 p4'] }, { contexts: ['greenfield'] }),
  n('case', 'on2go', 'On2Go, the brownfield case', 'An onboarding language above an existing product that compiles to inputs the product already accepts, shown so far on test data.', { video: ['18.4', '19.9'], paper: ['13.2 p1', '13.2 p4', '13.2 p5'] }, { contexts: ['brownfield'] }),
];

const e = (from: string, rel: Relation, to: string, why: Evidence): Edge => ({ from, rel, to, why });

export const EDGES: Edge[] = [
  // Demands meet symptoms
  e('immediate-use', 'meets', 'months-to-go-live', { video: ['4.2', '5.2'], paper: ['3 p2'] }),
  e('easy-change', 'meets', 'no-middle-option', { video: ['4.3', '7.3-4'], paper: ['3 p3'] }),
  e('personal-below-tenant', 'meets', 'same-screens-for-all', { video: ['4.4', '6.3'], paper: ['3 p4'] }),
  e('agent-operable', 'meets', 'agents-cannot-operate', { video: ['4.5', '6.5'], paper: ['3 p5', '3 p7'] }),

  // Symptoms trace back to the line drawn high
  ...['months-to-go-live', 'errors-after-go-live', 'knowledge-in-few-heads', 'same-screens-for-all', 'agents-cannot-operate', 'cost-grows-with-screens', 'no-middle-option', 'special-cases-in-shared-code', 'cross-tenant-defects', 'paying-for-unused']
    .map((s) => e(s, 'caused-by', 'line-drawn-high', { video: ['10.4'], paper: ['2 p4', '2 p5', '2 p6'] })),
  e('line-drawn-high', 'addressed-by', 'line-moves-down', { video: ['12.6'], paper: ['2 p9'] }),

  // Symptoms are addressed by principles and recommendations
  e('months-to-go-live', 'addressed-by', 'onboarding-as-document', { video: ['19.3-4'], paper: ['6 p4'] }),
  e('months-to-go-live', 'addressed-by', 'onboarding-first', { video: ['16.4'], paper: ['14 p4'] }),
  e('errors-after-go-live', 'addressed-by', 'domain-language', { paper: ['10 p6'] }),
  e('errors-after-go-live', 'addressed-by', 'checked-by-running', { video: ['19.4'], paper: ['12 p3'] }),
  e('errors-after-go-live', 'addressed-by', 'onboarding-as-document', { video: ['19.4', '19.6'], paper: ['6 p4'] }),
  e('knowledge-in-few-heads', 'addressed-by', 'onboarding-as-document', { video: ['19.8'], paper: ['14 p3'] }),
  e('knowledge-in-few-heads', 'addressed-by', 'grammar-and-compiler', { video: ['16.3'], paper: ['14 p3'] }),
  e('same-screens-for-all', 'addressed-by', 'screen-grammar', { video: ['20.3'], paper: ['7 p3'] }),
  e('agents-cannot-operate', 'addressed-by', 'agent-addressable', { video: ['20.8'], paper: ['3 p7'] }),
  e('cost-grows-with-screens', 'addressed-by', 'screen-grammar', { video: ['20.6'], paper: ['7 p4'] }),
  e('cost-grows-with-screens', 'addressed-by', 'no-screen-programme', { video: ['16.2'], paper: ['14 p2'] }),
  e('no-middle-option', 'addressed-by', 'rules-over-invariants', { video: ['21.3'], paper: ['2 p11'] }),
  e('no-middle-option', 'addressed-by', 'change-path', { paper: ['15 p3'] }),
  e('special-cases-in-shared-code', 'addressed-by', 'rules-over-invariants', { video: ['21.3'], paper: ['2 p11'] }),
  e('special-cases-in-shared-code', 'addressed-by', 'change-path', { paper: ['15 p3', '15 p5'] }),
  e('cross-tenant-defects', 'addressed-by', 'bounded-language', { video: ['13.13'], paper: ['9 p4'] }),
  e('cross-tenant-defects', 'addressed-by', 'rules-over-invariants', { video: ['21.3'], paper: ['2 p11'] }),
  e('core-value-unstated', 'addressed-by', 'invariants-as-core', { video: ['11.8'], paper: ['1.3 p2'] }),
  e('risky-invariant-change', 'addressed-by', 'govern-invariants', { video: ['14.5-6'], paper: ['8 p3'] }),
  e('custom-fields-at-the-edge', 'addressed-by', 'deep-layers-stay', { video: ['22.2'], paper: ['2 p8'] }),
  e('deep-change-risk', 'addressed-by', 'deep-layers-stay', { video: ['22.3'], paper: ['5 p1'] }),
  e('deep-change-risk', 'addressed-by', 'design-line-in', { video: ['22.5'], paper: ['14 p5'] }),
  e('paying-for-unused', 'addressed-by', 'bill-of-materials', { video: ['23.3'], paper: ['4.1 p3'] }),
  e('seats-losing-ground', 'addressed-by', 'packages-and-outcomes', { video: ['23.4'], paper: ['4.4 p2'] }),
  e('seats-losing-ground', 'addressed-by', 'bill-of-materials', { paper: ['4 p3', '4.1 p3'] }),

  // Principles build on one another
  e('line-moves-down', 'requires', 'invariants-as-core', { video: ['12.6'], paper: ['2 p10'] }),
  e('knowledge-graph-inventory', 'requires', 'invariants-as-core', { video: ['11.10'], paper: ['8 p2'] }),
  e('domain-language', 'requires', 'knowledge-graph-inventory', { video: ['12.2'], paper: ['9 p1'] }),
  e('domain-language', 'requires', 'line-moves-down', { video: ['12.8'], paper: ['2 p11'] }),
  e('agents-write', 'requires', 'domain-language', { video: ['13.3'], paper: ['9 p7'] }),
  e('checked-by-running', 'requires', 'domain-language', { video: ['13.8'], paper: ['12 p3'] }),
  e('bounded-language', 'requires', 'domain-language', { video: ['13.11'], paper: ['9.1 p1'] }),
  e('onboarding-as-document', 'requires', 'domain-language', { video: ['19.2'], paper: ['6 p4'] }),
  e('onboarding-as-document', 'requires', 'agents-write', { video: ['19.3'], paper: ['13.2 p2'] }),
  e('onboarding-as-document', 'requires', 'checked-by-running', { video: ['19.4'], paper: ['12 p3'] }),
  e('screen-grammar', 'requires', 'domain-language', { video: ['20.2'], paper: ['7 p3'] }),
  e('screen-grammar', 'requires', 'agents-write', { video: ['20.3'], paper: ['7 p4'] }),
  e('agent-addressable', 'requires', 'domain-language', { video: ['20.8'], paper: ['3 p7'] }),
  e('rules-over-invariants', 'requires', 'domain-language', { video: ['21.2'], paper: ['2 p11'] }),
  e('change-path', 'requires', 'rules-over-invariants', { paper: ['15 p3'] }),
  e('govern-invariants', 'requires', 'knowledge-graph-inventory', { video: ['14.3'], paper: ['8 p3'] }),
  e('bill-of-materials', 'requires', 'domain-language', { video: ['23.2'], paper: ['4.1 p1'] }),
  e('packages-and-outcomes', 'requires', 'bill-of-materials', { video: ['23.4'], paper: ['4.3 p2'] }),

  // Principles carry stated limits
  e('line-moves-down', 'limited-by', 'sharing-given-up', { video: ['12.9'], paper: ['2 p12'] }),
  e('agents-write', 'limited-by', 'errors-inside-language', { video: ['13.12'], paper: ['9.1 p4'] }),
  e('checked-by-running', 'limited-by', 'errors-inside-language', { paper: ['9.1 p6'] }),
  e('domain-language', 'limited-by', 'grammar-is-judgement', { video: ['13.14'], paper: ['15 p1'] }),
  e('screen-grammar', 'limited-by', 'rate-not-guarantee', { video: ['20.7'], paper: ['7 p6'] }),
  e('screen-grammar', 'limited-by', 'runtime-needs-platform', { video: ['20.5'], paper: ['7 p5'] }),
  e('bill-of-materials', 'limited-by', 'component-underpricing', { paper: ['4.3 p1'] }),
  e('domain-language', 'limited-by', 'falsifiers', { video: ['17.1'], paper: ['16'] }),

  // Cases illustrate principles
  e('onboarding-as-document', 'shown-in', 'on2go', { video: ['18.4'], paper: ['13.2 p2', '13.2 p5'] }),
  e('agents-write', 'shown-in', 'wadi', { video: ['18.2'], paper: ['13.1 p4'] }),
  e('bounded-language', 'shown-in', 'wadi', { paper: ['13.1 p5'] }),
  e('screen-grammar', 'shown-in', 'wadi', { paper: ['13.1 p3'] }),
  e('checked-by-running', 'shown-in', 'wadi', { paper: ['9.1 p5', '13.1 p6'] }),

  // Recommendations apply to a context
  e('top-down', 'applies-to', 'brownfield', { video: ['15.4'], paper: ['5 p2'] }),
  e('bottom-up', 'applies-to', 'greenfield', { video: ['15.3'], paper: ['5 p3'] }),
  e('onboarding-first', 'applies-to', 'brownfield', { video: ['16.1', '16.4'], paper: ['14 p4'] }),
  e('no-screen-programme', 'applies-to', 'brownfield', { video: ['16.1-2'], paper: ['14 p2'] }),
  e('design-line-in', 'applies-to', 'brownfield', { video: ['16.5'], paper: ['14 p5'] }),
  e('grammar-and-compiler', 'applies-to', 'brownfield', { video: ['16.3'], paper: ['14 p3'] }),
];

export const nodeById = (id: string) => NODES.find((x) => x.id === id);
