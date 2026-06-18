---
title: "The Four-Layer Ontology"
description: "The four-layer ontology in depth, the aperture criterion that decides what enters it, partition by product, brownfield extraction as rationalization, and the governance framework that keeps the graph healthy."
weight: 30
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - architect
  - tech-lead
  - chief-architect
---

The Semantic Knowledge Graph is one of the [three sources of truth](process/_index.md#three-sources-of-truth) in the Semantic Engineering methodology, and captures the knowledge from the custodians - product owners, architects and UX designers. This page describes the four ontology layers in operational detail, the inclusion criterion that keeps them sustainable, how we partition and extract them, and the metrics framework that keeps them healthy.

Frederick Brooks called the shared theory of a system its "design concept": the ephemeral understanding that everyone working on the system carries in their head. The graph is what that design concept looks like when it is made persistent and queryable rather than reconstructed in each conversation. The four layers below are the structure of the design concept; the aperture and governance sections that follow are the disciplines that keep the structure honest.

## The Four-Layer Ontology

An application is captured as four cross-linked graphs.

![The four-layer ontology with cross-layer relationships and the custodian role per layer](/diagrams/four-layer-ontology-relationships.svg)

| Ontology     | What it captures                                              | Custodian                           |
| ------------ | ------------------------------------------------------------- | ----------------------------------- |
| Functional   | Personas, outcomes, scenarios, steps, actions                 | Product Owner                       |
| Design       | Components, molecules, atoms, templates, flows, wireframes    | UX Designer and design system owner |
| Architecture | Services, boundaries, dependencies, data stores, integrations | Architect and tech lead             |
| Code         | Modules, classes, functions, endpoints, database schemas      | Engineering Team                    |

![The four ontology hierarchies in detail: Functional, Design, Architecture, and Code](/diagrams/four-ontology-hierarchies.svg)
### The Functional Ontology in Detail

The Functional Ontology is the layer that exposes whether the product owner is doing the work properly. The structure is simple.

| Node type | What it captures | Example |
|---|---|---|
| Persona | A named user with a defined relationship to the system | "Saved Search Owner" |
| Outcome | What this persona is trying to accomplish | "Receive a weekly digest of new matches to my saved search" |
| Scenario | A starting condition that leads to the outcome | "First-time configuration of weekly alerts" |
| Step | An ordered unit of work within the scenario | Open saved search, configure alert frequency, save |
| Action | The atomic operation the user performs | Click "Edit", select "Weekly", click "Save" |

The structure matters for governance, not specification. When a product owner says "we want the user to be able to do X", the Functional Ontology forces the question: which persona, which outcome, which scenario? The ontology is not the requirements. It is the shape the requirements have to take so the team and the agent can both reason about them consistently.

### The Design Ontology in Detail

The Design Ontology is the layer that exposes whether the UX designer and the design system owner are maintaining a coherent interface. The structure follows the atomic-design model on the component side, with a parallel journey hierarchy that links the user experience back to the Functional Ontology.


| Node type | What it captures | Example |
|---|---|---|
| User Journey | A persona's end-to-end experience that crosses multiple flows | "First-time onboarding for a Saved Search Owner" |
| Flow | An ordered sequence of pages that delivers a Functional Scenario | "Configure weekly alerts" |
| Page | A composed screen the user lands on | "Saved Searches list", "Alert configuration drawer" |
| Template | A reusable page-level layout pattern | "Two-column settings layout with right-side preview" |
| Organism | A composed UI block that delivers a discrete user task | "Alert frequency selector with preview" |
| Molecule | A group of atoms that work together as a small functional unit | "Labelled dropdown with helper text" |
| Atom | The smallest reusable UI primitive | "Button", "Input", "Badge", "Color token" |

The Design Ontology connects to the Functional Ontology along the journey side: every User Journey maps to a Functional Persona and Outcome, every Flow maps to a Functional Scenario, every Page maps to a Functional Step. The atomic-design side governs reuse: when a product owner asks for a feature that needs a new control, the ontology surfaces the existing molecules or organisms that already deliver that affordance, so the team composes rather than duplicates. Drift between Figma and the running UI shows up as Design Ontology nodes that no Page actually renders, or rendered components that no Design Ontology node describes.

### The Architecture Ontology in Detail

The Architecture Ontology is the layer that exposes whether the architect is keeping the system's structural decisions current. The structure is an eight-layer blueprint rather than a deep hierarchy. Each layer contains per-product component nodes with relationships to layers above and below.


| Layer | What it captures | Example |
|---|---|---|
| User Experience | The frontend applications, mobile clients, and external-facing surfaces | "Web app", "iOS client", "Customer portal" |
| API Gateway | The contract layer between clients and services | "Public REST gateway", "BFF for mobile" |
| Services | The owned business-logic units behind the gateway | "Saved Search Service", "Notification Service" |
| Agents | The intelligent agents that read graphs and produce outputs | "Impact Analysis Agent", "PR Validation Agent" |
| Event Queue | The asynchronous coordination layer between services | "Alert delivery topic", "Search-indexed event stream" |
| Data Lake | The persistent stores: relational, document, search, blob | "Postgres primary", "Elasticsearch index", "S3 archive" |
| Observability | The monitoring, logging, and tracing layer | "Metrics pipeline", "Distributed trace store", "Alert routing" |
| Infrastructure | The deployment and runtime substrate | "Kubernetes cluster", "Region topology", "Secrets manager" |

The eight layers are fixed; the per-product component nodes inside each layer are not. A small product may have two services and no Event Queue; an enterprise product may have forty services across three regions. The ontology captures what is present and how the components connect across layers. The architect uses the ontology to answer questions like: when this contract changes, which services have to update? When this region fails over, which downstream consumers feel it? When a new agent gets added to the fleet, where does it sit and what does it depend on? Boundary violations (a User Experience node calling a Service directly past the API Gateway, a Service writing to another Service's Data Lake) surface as graph-shape violations during PR validation.

### The Code Ontology in Detail

The Code Ontology is the layer that exposes whether the engineering team has the implementation surface under structural control. The structure is auto-generated from the actual source using AST parsers, then enriched with LLM-inferred metadata.


| Node type | What it captures | Example |
|---|---|---|
| File | A source file in the repository, with language and module attribution | `services/saved-search/charge.ts` |
| Class | A class, interface, or module-scoped type defined in a file | `class AlertScheduler` |
| Function | A function, method, or arrow function with signature and call sites | `function scheduleWeeklyAlert(savedSearchId, userId)` |
| Statement | A captured statement body for the call-graph and impact analysis | The body of `scheduleWeeklyAlert`, retained so downstream agents can reason about behavior |
| API Endpoint | A route exposed by the file (REST, GraphQL, gRPC, or message-queue consumer) | `POST /alerts/configure` |

The Code Ontology bridges the Architecture Ontology and the implementation surface. Each File node carries a module attribution that links it to a Service node in the Architecture Ontology. Each API Endpoint node carries a route signature that links it to an API Gateway contract. Each Function node carries call-graph edges that let the Impact Analysis Agent trace a Functional Action down to the specific lines that implement it. The captured statement bodies are what make the impact analysis precise rather than approximate: the agent reads behavior, not just structure.

The Code Ontology is extracted by AST parsers across the supported language set (currently TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, and Perl). The parsers run on every merge to master, so the Code Ontology stays current as a side effect of the implementation sprint cadence covered in [Implementation Sprint](process/implementation-sprint.md).

### Citations at Every Layer

Every node in every layer carries a citation: a link back to the source document, Figma frame, Jira ticket, design brief, or code file that justifies the node's existence. The citation is required at the time the node is created. A node without a citation does not enter the graph.

The discipline matters for two reasons. First, it makes the graph audit-grade: any element in the graph can be traced back to the artifact that produced it. Second, it lets the graph be diffed against its sources: when a Jira ticket changes, the agents know which nodes to re-validate; when a Figma frame moves, the agents know which Design nodes need to follow.

### Cross-Layer Traversal

A single Functional action traces through Design (which component renders it), Architecture (which service owns it), and Code (which function implements it, and which database tables it reads or writes).

A real example. A product owner files a user story: "Let users choose how often they receive email alerts for each saved search: daily, weekly, or off." The Impact Analysis Agent traverses the four-layer graph for that user story and produces:

| Layer | What the traversal surfaces |
|---|---|
| Functional | Two outcomes modified, two scenarios added, two existing scenarios touched, three actions modified |
| Design | Three components, three user journeys, one new email template |
| Architecture | Fourteen architecture nodes touched: services, data stores, queues, infrastructure including a new task family per region |
| Code | Fifteen specific code-level changes across five distinct repositories |
| Data | The database column that already exists and supports the change with no DDL required |
| Cross-layer matrix | One row per affected scenario, linking Functional, Design, Code, and Architecture nodes |

![Cross-layer traversal of one user story through Functional, Design, Architecture, Code, and Data layers](/diagrams/cross-layer-traversal.svg)

The traversal happens before any code is written. The senior developer who used to assemble this context manually now reviews it. Full mechanism in [The Impact Analysis Agent](agents.md#the-impact-analysis-agent).

### Queryability and the Token Economy

The four-layer ontology is what makes the Structured Substrate principle concrete: it is queryable. Agents that operate against the graph load only the slice each task needs (the affected personas and outcomes, the architecture nodes the change crosses, the code modules involved, the design components touched) rather than receiving the whole codebase plus the whole spec library as raw context.

This matters because the alternative is prompt stuffing. Without a structured substrate, the team has to feed the agent enough text to cover every case it might encounter on the way to the answer. The richer the change, the larger the prompt. The richer the prompt, the higher the per-invocation token cost, and the more likely the agent misses something buried in the middle of it, which triggers another prompt with more context. Token spend grows super-linearly with change complexity.

Queryability inverts this. Each agent invocation pulls a known-shaped slice; the rest of the graph is held in storage rather than carried in the prompt. Cross-layer impact analysis runs before generation rather than emerging from iteration. The cost per change tracks change size rather than the size of the surrounding context. The token-economy advantage is a direct consequence of giving the agent a queryable substrate rather than a stack of documents.

### Why We Model at Function and Module Level

If an agent has to make a safe, targeted change inside a 1.6 million line application, it needs to know which functions and modules implement the relevant behavior. A repository-level map tells the agent that a repository exists. It does not tell the agent where the logic actually lives. Without code-level nodes, the agent either reparses the repository at runtime (slow, expensive, nondeterministic) or guesses (confidently wrong).

The same principle runs upward. The Functional Ontology has to capture personas, outcomes, and scenarios at a level fine enough to govern individual user stories. The granularity at every layer is determined by the questions the agents that read the graph need to answer.

### Brownfield Extraction

A team adopting the methodology on an existing application does not write all four ontologies by hand. We extract them from the existing code, then enrich.

| Layer | Extraction approach |
|---|---|
| Code | AST parsing using open-source parsers; LLM-inferred metadata attached to each node |
| Architecture | Inferred from code structure; cross-validated with any existing architectural documentation |
| Functional | Inferred from the enriched code graph, starting from the UI and following code paths |
| Design | Extracted from component code and design tool wireframes; enriched by browser-automation agents that exercise the application end to end |

The output is a model of the system's actual behavior, not its intended behavior. Documentation usually describes the system as it was originally designed. Specs describe the system as the team wishes it were. Only the knowledge graph describes the system as it actually runs. For a 2M+ LOC application, extraction typically completes in two to three weeks.

### The Validation Gate

Once the four ontologies exist, every change is validated against all four before it can merge. The [PR Validation Agent](agents.md#the-pr-validation-agent) runs the gate on every merge to master. The gate fails if the Functional Ontology shows the change should affect an outcome the code does not touch, the Design Ontology shows a duplicate component being created where an existing one would have served, the Architecture Ontology shows a boundary violation, or the Code Ontology shows a downstream dependency the change breaks.

## Aperture

A common first instinct when adopting the methodology is to put everything into the knowledge graph. Within a few sprints, the maintenance burden has overwhelmed the team and the methodology gets blamed for the failure. The aperture is the inclusion criterion that keeps the graph sustainable.

John Ousterhout defines complexity as "anything related to the structure of a software system that makes it hard to understand and modify the system." That is the complexity the graph is built to attack: the cross-boundary, structurally consequential relationships the team cannot keep current in prose. The same author's distinction between deep modules (significant logic hidden behind a small, stable interface) and shallow modules (thin wrappers whose interface is as complex as their implementation) is the same distinction the aperture draws. Wide-radius elements that hide structural complexity behind a clean interface belong in the graph. Locally-contained complexity inside a function or a one-off layout stays in the code or the file where it lives.

### The Blast Radius Test

Every decision in a system has a **blast radius**: the set of other decisions, artifacts, and behaviors that have to change if the decision changes. A persona definition, a service boundary, a canonical API contract, a core user journey: these have wide blast radius. The internal algorithm of a utility function, the wording on a single button, a color token used on one page: these have locally contained blast radius.

The aperture admits elements whose change cascades beyond their immediate context. Elements whose change is locally contained stay outside the graph.

![Aperture and blast radius: wide-radius elements enter the graph; locally contained ones stay out](/diagrams/aperture-blast-radius.svg)

![The blast radius test: a single rule decides what enters the knowledge graph](/diagrams/blast-radius-decision-tree.svg)

### High-Aperture and Low-Aperture Elements, by Layer

When a team faces a question of whether a specific element belongs in the graph, the row for that layer is the reference.

**Functional Ontology**

| High-aperture (enters the graph) | Low-aperture (stays local) |
|---|---|
| Personas, outcomes, canonical scenarios, core step sequences, named workflows | UI copy, help text, microcopy, one-off variant phrasings, error message wording |

**Design Ontology**

| High-aperture (enters the graph) | Low-aperture (stays local) |
|---|---|
| Core journeys, reusable flows, shared components, templates, design system primitives | One-off page-level layout adjustments, local styling overrides, single-use UI variations |

**Architecture Ontology**

| High-aperture (enters the graph) | Low-aperture (stays local) |
|---|---|
| Layer boundaries, service types and identities, inter-service relationships, integration contracts, infrastructure topology | Internal service implementations, algorithm choices, in-memory data structures, local configuration values |

**Code Ontology**

| High-aperture (enters the graph) | Low-aperture (stays local) |
|---|---|
| Module-to-service mappings, cross-module contracts, externally consumed interfaces, public API endpoints | Function internals, local variable naming, private helper methods, transient logs |

### How the Aperture Matures

A team adopting the methodology should not try to set the aperture at full width from day one.

| Phase | Aperture width | What the team holds in the graph |
|---|---|---|
| Day 1 to Sprint 4 | Narrow | Core personas, top three to five outcomes per persona, primary service boundaries, top ten code-level cross-module dependencies |
| Sprint 4 to Sprint 12 | Widening | Full functional ontology for the most-touched product areas, full design system, full architecture, code ontology for actively-developed modules |
| Sprint 12 onward | Full operational width | All four layers extracted; verification suite running; rationalization findings flowing back into sprint planning |
| Mature | Stable | The aperture has reached the natural width for this application. New elements enter when their blast radius warrants it. |

The aperture never reaches maximum width. The mature graph is the one where the team has high confidence that the elements in the graph are the ones that need to be there, and the elements not in the graph are the ones that do not.

### The Decision Rule

1. Default to excluding the element. The graph should not contain anything unless there is a positive reason to include it.
2. Ask the blast-radius question. If this element changes, how many other things in other parts of the system have to change?
3. If the answer is "many things across teams or layers", include it.
4. If the answer is "a few things, all local", exclude it.
5. If the answer is ambiguous, exclude it for now and revisit.

The default is exclusion. Elements that should have been included will surface when their changes start cascading without graph governance, and the team can add them then with the evidence to justify inclusion.

## Partition by Product

We build one knowledge graph per product or application. Not per repository, and not monolithic across the portfolio. The reason is operational.

![Partition by product with integration-point bridges and three agent variants that handle the partition](/diagrams/partition-by-product.svg)

### The Number That Decides It

A single Impact Analysis query against a 1.6M LOC application graph takes about eight minutes. The query traverses functional, design, architecture, and code nodes, surfaces the cross-layer impact, and produces a structured impact report. Eight minutes is an acceptable agent runtime budget for the spec sprint. A monolithic graph spanning ten such applications does not produce useful results in any reasonable agent runtime budget.

| Partition choice | Why we rejected it |
|---|---|
| Per repository | Code-level dependencies between elements would require cross-graph traversal even for trivial questions |
| Monolithic across portfolio | Cypher query performance degrades sharply as graph complexity grows; queries become slow enough to be unusable |
| Per product or application | Queries remain efficient. Cross-product reasoning happens through specialized agents that consult multiple graphs in sequence. |

### Cross-Product Reasoning

Partitioning by product does not isolate the graphs. The agent fleet runs three variants of impact analysis to handle the partition.

| Question type | Agent variant | Graphs consulted |
|---|---|---|
| What in this product is affected by this change? | Standard Impact Analysis Agent | One product graph |
| What in other products is affected? | Cross-Product Impact Extension | Originating graph plus each downstream graph reached via integration points |
| What duplicated capability exists across products? | Portfolio Rationalization Agent | All product graphs filtered by functional-ontology overlap |

Integration points (APIs, events, shared databases, shared libraries) are the bridges between product graphs. If integration is implicit (shared global state, undocumented file-based coupling, ad-hoc HTTP calls without contracts), the cross-product analysis surfaces the gap as a finding and recommends that the integration be made explicit. The expensive cross-product traversal happens at spec time, when the team has the bandwidth to reason about it. The cheap single-product traversal happens at every change, when the team needs the answer immediately.

## Extraction as Rationalization

Knowledge graph extraction does not simply photograph the current state of the application. For applications with significant accumulated technical debt, the extraction process is itself a rationalization opportunity, and we treat it that way on every engagement.

### A Pattern We See Often

One client had divided its products along functional domains rather than technical service boundaries. The decision was organizational: separate teams for each domain, each owning a separate "product" backend. From the user's point of view, the front end was a single unified experience. The backends were treated as multiple products. After four to five years of evolution, the platform had a serious mess. Duplicate capabilities accumulated across the platform. The same outcome was implemented two or three times across "products", with different implementation paths and no shared abstraction.

The org structure was designed around manual development processes, and the code is the outcome of that org structure. When we applied the methodology, the extraction did not produce one graph per "product". It worked across the unified user experience. Duplicate functionality became immediately visible in the Functional Ontology: the same outcome appeared in multiple regions of the graph with different implementation paths. The output of extraction was not a snapshot. It was a structured map of the rationalization work the team needed to do.

### The Four Diagnostic Patterns Extraction Surfaces

![Four diagnostic patterns: duplicate capabilities, split functionality, dead capabilities, misclassified architecture](/diagrams/brownfield-four-patterns.svg)

| Pattern | What it looks like in the graph | What it means in the code |
|---|---|---|
| **Duplicate capabilities** | The same functional outcome appears in multiple regions of the graph with different implementation paths | The team has built the same feature two or three times, each time slightly differently, and no one realizes they are duplicates |
| **Split functionality** | A single functional outcome depends on code modules in multiple repositories without a shared abstraction | Functionality that should live behind one interface is scattered across services, with implicit coordination requirements that nobody documents |
| **Dead capabilities** | Functional outcomes with no live code paths reaching them | Features that were once shipped but are no longer in use, still carried in the code base |
| **Misclassified architecture** | Services whose actual code-level dependencies do not match their named bounded context | A service named "billing" that actually owns most of the user-profile logic; an "auth" service that has accumulated reporting functionality nobody knows about |

### How the Patterns Emerge Mechanically

| Pattern | Graph signal that surfaces it |
|---|---|
| Duplicate capabilities | The same functional outcome node has multiple distinct sets of incoming edges from code nodes in different modules |
| Split functionality | A functional outcome has code edges into modules in different repositories without a unifying intermediate node |
| Dead capabilities | Functional outcome nodes with no incoming edges from code nodes that are still active in the runtime traversal |
| Misclassified architecture | Service nodes whose actual code-edge density to other services does not match their declared bounded context; community-detection algorithms (Leiden modularity) flag the boundary as leaky |

The verification suite runs these checks during the initial extraction phase. The output is a prioritized backlog of structural improvements that flow back into normal sprint planning. The graph is paid for by the AI productivity case. The rationalization output is value the client did not have to budget for separately.

## Governance and Metrics

A knowledge graph that is not measured will degrade the same way text documentation degrades. We define a measurable notion of semantic health and run verification against it on every merge.

![Governance framework: 29 metrics and 14 verification checks across four cadences (P0 every merge, P1 per release, P2/P3 quarterly)](/diagrams/governance-metrics-framework.svg)

### What Semantic Health Means

| Condition | Why it matters |
|---|---|
| The graph reflects the current state of the application | If the graph has drifted from the code, agents that consume the graph produce wrong outputs |
| The graph's structure satisfies the DAG and connectivity properties the ontology requires | Structural defects produce wrong agent outputs even when the graph is current |
| The graph has not accumulated dead, duplicate, or misclassified nodes beyond a threshold | Accumulated structural debt degrades query performance and impact-analysis accuracy |

### The 29-Metric Framework

We track twenty-nine graph metrics organized into six categories.

| Category | Purpose | Representative metrics | Run cadence |
|---|---|---|---|
| Size and Density | Growth and shape tracking | Node count, edge count, edge density, degree distributions, source and sink count | Per release (P1) |
| DAG Depth and Reachability | Tier and layering integrity | Longest path length, topological layers, width, reachability density, transitive reduction ratio | Per release (P1) |
| Connectivity | Fragmentation detection | Weakly connected components, giant WCC fraction | Every merge (P0) |
| Local Structure | DAG validity; clustering anomalies | Reciprocity, self-loops, clustering coefficient | Every merge (P0) |
| Community Structure | Bounded-context alignment; architectural drift | Leiden modularity, community count, conductance, spectral eigengap | Quarterly (P2) |
| Centrality | Critical-node identification | PageRank, HITS (hub and authority), betweenness | Quarterly (P3) |

### The 14 Verification Checks

The verification checks run on every merge and gate the merge if they fail.

| Priority | Checks |
|---|---|
| P0 (every merge) | DAG validity, source and sink existence, degree-sum identity, giant component check, self-loop audit, reciprocity check, layered structure validity |
| P1 (per release) | Edge-type heterogeneity, longest-path plausibility, reachability sanity, transitive-reduction stability, typed-edge DAG checks |
| P2 (quarterly) | Community-structure checks (Leiden modularity, conductance) |
| P3 (quarterly) | Centrality-based critical-node identification |

A merge that produces a graph that fails a P0 check is blocked until the underlying defect is fixed.

### Concrete Thresholds

The framework runs to concrete thresholds. The numbers below are what we operate to in production on a 1.6M LOC application.

| Metric | Threshold | What a violation indicates |
|---|---|---|
| Giant WCC fraction | Greater than 0.95 | Graph fragmentation; isolated nodes indicate stale or orphaned modules |
| Transitive reduction ratio | Less than 0.9 triggers review | More than 10% redundant edges; review for cleanup |
| Community conductance | Greater than 0.3 flags leaky bounded contexts | Service boundaries no longer hold cleanly; architectural drift |
| Reciprocity, self-loops, cycles | Exactly 0 in a DAG | Structural defect; immediate remediation required |
| Longest path | Within tier count plus 1 | Layer inversion or unexpected dependency chain |
| Ontology freshness | Less than or equal to 30 days | Stale beyond 30 days auto-triggers a refresh sprint |
| Agent retrain trigger | Rework effort up 15% month-over-month, OR AI acceptance below 0.5, OR two or more Sev-1 incidents linked to agent code | The agent's outputs are no longer reliable against the current graph |

### Custodianship Cadence

| Cadence | What runs | Owner |
|---|---|---|
| Every merge | The P0 checks. The merge is blocked if a P0 check fails. | Implementation team, automated via CI |
| Per release | The P1 size, density, and reachability metrics. Telemetry feeds the release retrospective. | Tech Lead, Chief Architect |
| Quarterly | The P2 community structure and P3 centrality metrics. Output is a prioritized rationalization backlog. | Chief Architect, Ontology Maintainer |
| Continuously | Ontology freshness check. Refresh sprints scheduled when freshness threshold is breached. | Knowledge Agent Owner |

The metrics framework is what makes the knowledge graph a sustainable asset rather than another stale documentation artifact. The four ontology custodians own the framework; Accion Labs's [Enablement Partnership](process/enablement-partnership.md) supports them at a chosen tier of managed support.

> **How Accion Labs operationalizes graph operation**
>
> The [Breeze.AI platform](../practitioner/breeze-ai.md) maintains the product-partitioned graphs, runs the brownfield extraction, runs the 29-metric framework and 14 verification checks, and runs the three Impact Analysis variants. The [Managed Support tiers](process/enablement-partnership.md) (Light, Medium, Deep) determine which cadence of metrics review Accion Labs runs alongside the client's custodians.

---

Return to [The Methodology landing](methodology.md) for the framing. [The Agents](agents.md) describes the agents that operate on the graph at runtime.
