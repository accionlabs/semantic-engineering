---
title: Agentic Software Engineering and Modernization, powered by Semantic Engineering
description: Executive overview of Semantic Engineering, the methodology Accion Labs developed for agentic software engineering and legacy modernization. The shared problem, the universal principles, and how they instantiate across greenfield, brownfield, and legacy modernization work.
weight: 1
date: 2026-06-04
lastmod: 2026-06-12
draft: false
section: false
type: docs
cascade:
  type: docs
audience:
  - cto
  - vp-engineering
  - product-owner
  - tech-lead
  - cio
  - analyst
faqs:
  - question: "What is Semantic Engineering?"
    answer: "Semantic Engineering is a methodology, developed at Accion Labs, for running AI agents reliably inside enterprise software work. It models the application as a queryable four-layer knowledge graph (functional, design, architecture, and code), constrains agent generation through that graph, and governs the graph through named ownership and validation gates so it stays accurate as work proceeds."
  - question: "What is the Manual Translation Tax?"
    answer: "The Manual Translation Tax is the recurring cost a team pays converting tacit, unstructured enterprise knowledge into a form AI coding agents can act on. Four custodians (the product owner, architect, UX designer, and engineering team) hold that knowledge; Semantic Engineering reduces the tax by capturing it once in a governed knowledge graph the agents can query."
  - question: "What is the four-layer ontology?"
    answer: "The four-layer ontology is the structure of the knowledge graph at the core of Semantic Engineering: a functional layer (personas, outcomes and scenarios), a design layer (components and interaction patterns), an architecture layer (services, data stores and integrations), and a code layer (modules, functions and endpoints). Agents traverse these layers to pull only the context a given change requires."
  - question: "How is Semantic Engineering different from spec-driven development?"
    answer: "Spec-driven development gives an agent a written specification per change, but the context is local and re-derived each time. Semantic Engineering adds a persistent, governed knowledge graph spanning the whole application, so context is global, queryable, and kept current by agents and named custodians rather than rewritten for every task. SE is additive: a mature SDD practice transfers in directly, with the graph layered underneath."
  - question: "Does Semantic Engineering apply to greenfield, brownfield, and legacy modernization the same way?"
    answer: "The four universal principles apply to all three. The shape of the graph differs: greenfield and brownfield share a four-layer ontology of the live application that the four custodians curate continuously. Legacy modernization uses a Source-state / Target-state / specification format sized for the bounded scope of the migration. The custodian roles and the validation discipline are the same across all three."
  - question: "Does Semantic Engineering replace the AI coding tools we already use?"
    answer: "No. Semantic Engineering layers under whatever AI coding tools the team already runs (Copilot, Cursor, Claude Code, Devin, internal coding agents). The methodology adds the knowledge graph that the agent reads against, the impact analysis that runs before generation, and the validation gates that check the output at merge time. The agent that writes the code is unchanged; what changes is the context the agent operates against."
  - question: "How does Semantic Engineering reduce AI hallucinations?"
    answer: "The agent generates against a structured graph of what the application actually contains rather than against unstructured prose. Functions it references must exist as Code Ontology nodes. Service boundaries it crosses must be declared in the Architecture Ontology. The PR Validation Agent rejects merges that contradict the graph. Hallucinations are caught at the structural gate, before they reach production."
  - question: "What languages and stacks does Semantic Engineering support?"
    answer: "The Breeze.AI platform currently parses TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, and Perl for brownfield extraction. ASIMOV extends to legacy-modernization stacks including COBOL on AS400, Delphi, ASP.NET Web Forms, VB.NET monoliths, Struts/Hibernate, and others. The methodology itself is language-agnostic; language coverage matters for the brownfield extraction step that builds the initial Code Ontology."
  - question: "Who maintains the knowledge graph day to day?"
    answer: "Four named custodians, one per ontology layer. The Product Owner curates the Functional Ontology. The Architect curates the Architecture Ontology. The UX Designer curates the Design Ontology. The Engineering Team curates the Code Ontology. The KG Sync Agent updates the Code Ontology with every change, before the pull request merges, so the graph stays in step with the main branch; the other three are curated during the spec sprint cadence."
  - question: "How long does it take to extract a knowledge graph from an existing application?"
    answer: "For a 2M+ LOC application, full extraction of all four layers typically completes in two to three weeks. AST parsers cover the code, LLM enrichment adds the semantic metadata, browser-automation agents exercise the live UI for the Design layer, and existing documentation cross-validates the Architecture layer. The output is a populated graph plus a prioritized rationalization backlog of structural debt the extraction surfaces."
  - question: "How do validation gates affect developer velocity?"
    answer: "The gates catch structural defects at PR merge time rather than at integration or in production. In practice, velocity improves because the rework loop shortens dramatically. The P0 gates (DAG validity, layer integrity, connectivity) are sub-second and run on every merge. A merge that fails a gate is blocked until the underlying defect is fixed. The goal is structural correctness."
  - question: "Which graph database does it use, and do we need an enterprise licence?"
    answer: "Graph storage is typically Neo4j Community Edition, and another graph database can be used where a client has a standard of its own. Enterprise support for the database matters only when a graph grows large enough to need it for scale. Accion Labs is a Neo4j partner."
  - question: "Does a person have to approve every impact analysis?"
    answer: "No. Impact analysis returns a readable report for people or structured data, the IDs of the affected graph items, for another agent. A person reads the report when a person owns the decision it informs, such as new scope in the spec sprint. When an agent owns the work, the agent reads the structured form and continues."
  - question: "How do the agents fit into our existing workflow?"
    answer: "The ticket system, Jira for example, holds the state of every change. A hook runs impact analysis when a specification is written and attaches the report to the ticket; the analysis can run again after coding; acceptance tests come from the functional layer; the PR Validation Agent reconciles the pull request with the report; and the final analysis uses the whole history of the ticket. Each team designs the workflow between these steps to fit its own process."
  - question: "How does a manager see what people and agents are working on?"
    answer: "In the ticket system the team already uses. Each step updates the ticket's status, whether a person or an agent did the work. For products with a high volume of support and data requests, the requests can move to an agent workbench with triage agents, the product's own prioritization rules, and set autonomy levels."
  - question: "Which work can be handed to agents, and who decides?"
    answer: "People decide, in sprint planning or in support triage. Every agent has a named human owner. Work with a repeatable pattern, such as support requests, customer customizations, workflow and form changes, new fields and custom reports, can go to an agent once the agent has a record of reliable results on that pattern. New scope stays with people."
  - question: "Is there one graph per product, and what is shared across products?"
    answer: "There is one graph per product, shared by every team that works on that product. Knowledge that belongs to the enterprise, such as compliance and security requirements, infrastructure preferences, shared deployment pipelines and an enterprise design system, is defined once and read by each product's agents according to their access rights. A portfolio adopts the methodology one product at a time."
  - question: "How does it help with technical debt?"
    answer: "The graph can record the target state the enterprise has decided on, such as a new authorization service some products have not adopted yet. When a change touches that area, the agent looks up the target and the change can move the code toward it. Debt is paid down in the work that touches it, and agents working against a governed graph avoid adding new debt quickly."
  - question: "How much of the code goes into the knowledge graph?"
    answer: "Only high-aperture elements: those whose change would affect other parts of the system. The code stays the single source of truth for what the code does. The graph points an agent to the code elements that matter for a change, so the agent reads those directly."
  - question: "Can we report across product teams?"
    answer: "Yes. Metrics are kept per product, per graph and per agent, as data the client can collect into its own governance reporting. The methodology does not prescribe a reporting format."
  - question: "What happens to the platform and the graph if the engagement ends?"
    answer: "In the client-hosted deployment, the platform and the graph run in the client's own cloud account throughout and stay there. In every deployment, the offboarding doctrine commits that the graph is exportable, the agents are reproducible, the governance framework is documented, and the enablement roles can be handed to the client's own staff."
  - question: "How do we start? What does a first engagement look like?"
    answer: "Most engagements begin with a two-day deep-dive workshop on the client's context, producing an adoption plan, an ontology draft, and a twelve-week roadmap. A pilot engagement follows, entering at the SDLC zone or modernization engagement mode that fits the client's current state. The phased rollout (SDD Adoption, SE Foundation, SE at Scale) extends over quarters to years depending on portfolio scope."
---

Semantic Engineering is the methodology we developed at Accion Labs for running AI agents reliably inside enterprise software work. It treats the knowledge an agent needs as a queryable graph, constrains generation through that graph, and governs the graph through named ownership and validation gates so it stays accurate as the work proceeds. The same principles apply whether the team is building new software, evolving live software, or modernizing legacy software.

![Semantic Engineering at a Glance](/diagrams/hero-semantic-engineering-at-a-glance.svg)

This page is the executive overview. The section [Below and Above the Water](#below-and-above-the-water) places Semantic Engineering beside its sister method, Dialect Engineering. Each section links to a deep dive in the topic area it summarizes. If you want to jump straight to a use case, the two anchor sections are [Agentic Software Engineering (SDLC)](sdlc/_index.md) and [Agentic Legacy Modernization](modernization/_index.md).

## Below and Above the Water

When code becomes cheap, a software product can change in two places.

**Below the water**, the product stays as it is, and building and changing it becomes faster and safer. That is Semantic Engineering: the knowledge the product depends on is recorded in a knowledge graph, AI agents work from it, and every change is checked against it. The product's architecture, screens and customers are untouched.

**Above the water**, the product itself changes shape. Each customer's needs are written in a language over what every customer shares, so more of the product can vary per customer without special cases in shared code. That is [Dialect Engineering](https://dialect-engineering.ai), set out in the paper *SaaS architecture when code is cheap*.

**One foundation.** Both stand on the same knowledge graph. The graph records the product's entities, workflows, rules and contracts: its canonical model, the part every customer shares. Semantic Engineering extracts that graph from the existing code and data model, so the canonical model is read from the product itself, without being designed from scratch. Dialect Engineering builds its language on that graph: the language's words are the graph's entities, and its rules say how a customer's needs may combine them.

**Which one a product needs:**

| The product | What applies |
|---|---|
| Stays as it is, and needs to be built and changed faster and more safely | Semantic Engineering |
| Has to vary per customer: faster onboarding, per-customer rules, interfaces for customers' own agents | Both, with the graph first |
| Is a legacy system being replaced | Semantic Engineering's legacy modernization, then either of the above for the new system |

## The Shared Problem

Enterprise software work is hard because the knowledge that holds a system together lives in people's heads, in documents that fall out of date, and in code that is hard to read without someone to explain it. In a typical enterprise application, four roles hold four kinds of knowledge:

- the **product owner** holds the *functional* knowledge: personas, outcomes, scenarios, rejected proposals
- the **UX designer** holds the *design* knowledge: components, interaction patterns, state handling
- the **architect** holds the *architecture* knowledge: service boundaries, source-of-truth databases, integration contracts
- the **engineering team** collectively holds the *code* knowledge: live functions, retry policies, active feature flags, unused utilities

No single human holds the whole picture and no document does either. AI coding assistants do well on small, contained tasks but break against this complexity because they have no structured way to query the system's actual state. Bigger context windows do not fix this. The agent needs structured context it can read against.

Every use case in a typical enterprise portfolio faces the same gap. Greenfield work needs the new application to fit a landscape it has not yet been built into. Brownfield work needs to reason about dependencies inside the live application as it evolves. Legacy modernization needs to honor years of accumulated behavior while replacing the stack that produced it. The complexity differs by use case, but the structural gap is the same.

The full problem treatment is in [The Manual Translation Tax](sdlc/translation-tax.md) for continuous SDLC and [The Modernization Translation Tax](modernization/translation-tax.md) for legacy modernization.

## The Methodology

Semantic Engineering responds to the structural gap with four universal principles that hold across every use case.

| Principle | What it means |
|---|---|
| **Structured representation as the substrate** | Encode the knowledge the agent needs as a queryable graph with explicit nodes and relationships. The agent queries the graph for the slice each task needs. |
| **Agent constraint through the graph** | Every change is analyzed against the graph before code is written, and agents cannot ignore what the impact analysis finds. The graph holds the high-aperture structure of the application as it exists today; the specification describes each change, including its low-aperture details and any new scope. The graph governs how a change fits the application, and the specification remains the description of what to build. |
| **Named ownership of the substrate** | Each part of the graph has a named human custodian who is accountable for keeping it accurate. Decay is treated as a failure of ownership. |
| **Validation gates that produce machine-verifiable evidence** | Quality is enforced by gates that emit pass or fail evidence against the graph. The gates run automatically and produce artifacts the team can audit. |

The principles are universal. The shape of the graph and the rhythm of the operating model differ by use case because the questions each use case asks are different. The next section shows how the same principles instantiate across the three use cases the enterprise portfolio actually contains.

## One Methodology, Three Use Cases

The three use cases collapse into two graph models on the question of whether the target is fixed or moving. Greenfield and brownfield both have a moving target and share the four-layer ontology of a live application, curated continuously by the four custodians. Legacy modernization has a fixed delivery target and uses a different ontology shape sized for the bounded scope of the work. The same four custodian roles govern the modernization ontologies; the target state itself is defined and governed by the Product Owner, Architect, UX Designer, and Engineering Team rather than handed over as a static input.

![One Methodology, Three Use Cases](/diagrams/methodology-three-use-cases.svg)

The four-layer ontology and the Source-state / Target-state / specification format are two instantiations of the same methodology. The diagram below contrasts the two graph models directly.

![Two Knowledge Graph Models](/diagrams/two-graph-models.svg)

A side-by-side view of the three use cases against the dimensions that matter most:

| Dimension | Greenfield | Brownfield | Legacy Modernization |
|---|---|---|---|
| **Target state** | Discovered incrementally as the product grows | Existing live application, evolving incrementally | Target Blueprint chosen up front, fixed |
| **Scope** | New application built into the enterprise landscape | Live application maintained and extended | Bounded project that replaces a legacy stack |
| **Graph model** | Four-layer ontology, built up live | Four-layer ontology, extracted then curated | Source-state + Target-state + specification format |
| **Custodians** | Product Owner, Architect, UX Designer, Engineering Team | Product Owner, Architect, UX Designer, Engineering Team | Product Owner, Architect, UX Designer, Engineering Team (same four roles, lower cadence) |
| **Agent mode** | Spec-aware development at every PR | Impact-aware change against the live graph | Migration under parity contract with four validation gates |
| **Cadence** | Continuous (spec sprint + implementation sprint) | Continuous (same two-sprint operating model) | Five-phase delivery, bounded, then Maintain mode |
| **Anchor section** | [Agentic Software Engineering (SDLC)](sdlc/_index.md) | [Agentic Software Engineering (SDLC)](sdlc/_index.md) | [Agentic Legacy Modernization](modernization/_index.md) |

When a modernization completes and the client wants ongoing SDLC governance on the modern system, the modernization graph converts to the four-layer ontology and the engagement continues under the continuous SDLC instantiation. The methodology covers both halves of that lifecycle.

## Topic by Topic: How the Methodology Stays Consistent

The site is organized so a reader can walk either use case end to end across the same six topics. The table below shows how each topic instantiates on each side, with deep-dive links per cell.

| Topic | Continuous SDLC | Legacy Modernization |
|---|---|---|
| **Translation Tax** (the problem) | [Manual Translation Tax](sdlc/translation-tax.md): the daily cost of converting tacit knowledge into action across four custodians. | [Modernization Translation Tax](modernization/translation-tax.md): reverse-engineering cost, lost context, validation vacuum, knowledge disappearance. |
| **Methodology** (graph model) | [Four-Layer Ontology](sdlc/methodology.md): Functional, Design, Architecture, Code. Curated live by the four custodians. | [Ontologies for Legacy Modernization](modernization/methodology.md): Source-state decomposed from legacy code, Target-state defined by the same four custodians from a target blueprint, specification format bridges the two. |
| **Agents** (the fleet) | [The SDLC Agent Fleet](sdlc/agents.md): impact analysis, BDD generation, KG sync, validation before merge. Earn autonomy over time. | [The Modernization Agent Fleet](modernization/agents.md): nine named agents across Discover, Document, Migrate, Validate, Maintain. Progressive autonomy per engagement. |
| **Process** (the operating model) | [Continuous SDLC Operating Model](sdlc/process/_index.md): spec sprint and implementation sprint, fractional allocation, layered team, enablement partnership across years. | [Modernization Operating Model](modernization/process/_index.md): five-phase delivery, SME tuning loop, expert review pattern, enablement frame sized for a bounded project. |
| **Engagement Model** | [SDLC Engagement Model](sdlc/engagement-model.md): Advise, Launch, Scale, Optimize. Pricing per phase. Three-Phase Rollout aligns to methodology phases. | [Modernization Engagement Model](modernization/engagement-model.md): five entry modes (Documentation Only, Discovery + Documentation, Migration Readiness, Full Modernization, Maintain, Operate, and Convergence). Pricing per mode. |
| **Case Archetypes** | [SDLC Case Archetypes](sdlc/case-archetypes.md): three engagement archetypes (brownfield at 2M LOC, greenfield grown into complexity, SDD at its governance ceiling) and the measured delivery outcomes of a multi-product engagement. | [Modernization Case Archetypes](modernization/case-archetypes.md): seven anonymized case studies across ASP.Net, COBOL, Delphi, VB.NET, ASP Forms, and Java migrations across multiple industries. |

The structural response is the same in both columns. The shape of the response differs because the work asks different questions.

## Two Platforms, One Methodology

The methodology is operationalized by two production platforms. Each one is sized for the use case it serves.

![Breeze.AI versus ASIMOV](/diagrams/breeze-vs-asimov.svg)

| Platform | Use case | Operationalizes |
|---|---|---|
| **[Breeze.AI](practitioner/breeze-ai.md)** | Continuous SDLC (greenfield and brownfield) | Four-layer ontology storage, the SDLC agent fleet, integration surface, deployment modes, governance metrics. |
| **[ASIMOV](practitioner/asimov.md)** | Legacy Modernization | Five pillars (AGIE, ASF, AMM, AVF, Maintain) across the modernization lifecycle. Four validation gates. Bounded delivery pipeline at scale. |

The platforms are peers under the same methodology. They differ in graph shape and operating cadence because the use cases differ. They share the same principles, the same enablement discipline, and the same governance posture.

## Numbers from Real Engagements

Outcomes measured on engagements running under this methodology. Anonymized walkthroughs are in the case archetype pages linked above, including [the full figures for the multi-product engagement](sdlc/case-archetypes.md#delivery-outcomes-on-a-multi-product-engagement).

**Continuous SDLC engagements under Breeze.AI:**

| Number | Context |
|---|---|
| **19 to 36** deployments a month, a 90% rise, over a 14-week pilot | Three products on one engagement; measured at the start and the end of the pilot |
| **2.0 to 1.42 days** lead time for changes, 29% shorter | Same engagement, same measurement |
| **60%** of the team named estimation and code comprehension as where the Manual Translation Tax was paid | Same team surveyed at the start and the end of the pilot (n = 30); 50% reported an overall productivity impact at the end |
| **2 to 3 weeks** to extract a 2M+ LOC codebase into the four-layer graph | Brownfield extraction on a Node.js, TypeScript and React application |
| **53%** design component reuse in the first sprint | First sprint under SE-governed UI development on a greenfield workstream |
| **23%** defect rate reduction against the team's pre-SE baseline | Same codebase, same team, before and after |
| **93.4%** test coverage with zero manual BDD overhead | BDD scenarios generated automatically from the Functional Ontology |
| **81%** lower five-year TCO with on-premises AI deployment (modeled) | TCO model for engagements where model inference must remain inside the client's infrastructure; not a measured outcome from a specific engagement |

**Legacy modernization engagements under ASIMOV:**

| Number | Context |
|---|---|
| **15M+ LOC** modernized across 10+ programs | Across ASP.Net, COBOL, Delphi, ASP Forms, VB.NET, and custom proprietary stacks |
| **Up to 4×** faster than manual modernization | Indicative on a 1M LOC standalone codebase |
| **Up to 70%** migration time reduction | Indicative on a 1M LOC standalone codebase |
| **2.1M LOC Java 8 to Java 21 in ~3.5 months** | Inventory and warehouse platform; deprecated APIs automatically detected and replaced |
| **3M LOC Delphi to cloud-native .NET 8** | European education-technology provider with 80%+ market share; ~60% effort reduction versus manual |
| **600K LOC COBOL on AS400 to .NET 8 microservices** | Global specialty insurance and risk management provider |

## How We Arrived Here

Semantic Engineering started in 2017 as Breeze, an internal framework of role-based guidelines and templates for product owners, architects, and UX designers. When Gen AI entered our work in 2022 on a pharma drug-discovery engagement, we found that grounding models with a knowledge graph kept hallucinations under control. In 2023 we productized the knowledge-graph approach as KAPS and rolled it out across customer engagements, so the methodology was in commercial use well before it had a name. By 2024 we had converted the Breeze guidelines into the four-layer ontologies and built agent fleets around them, naming the resulting SDLC platform Breeze.AI in tribute to its 2017 ancestor. The legacy modernization shape of work demanded a different graph model and a different agent fleet, which became ASIMOV. The discipline took the name Semantic Engineering in 2025.

![Origins Timeline](/diagrams/origins-timeline.svg)

The full origin story is in [Origins](about/origins.md).

## What We Believe

> Domain knowledge, from intent to implementation, should be stored in a machine-readable, interconnected semantic model that admits only one valid interpretation, persists across time, and maintains traceable connections across every layer.

Every choice in the methodology traces back to this commitment. The four ontology layers, the partition rule, the validation gates, the agent fleet, the enablement partnership. Each was added because it made the commitment operational in some specific way we had run up against on an engagement.

## Where the Industry Is

Snowflake's semantic layer, Microsoft's knowledge graph integrations in Fabric, and Palantir's ontology positioning have all shipped or matured in the last twelve months. The market is converging on what we concluded in 2022: enterprise AI needs structured context to operate at scale, and a knowledge graph is the practical way to provide it.

Beyond the commercial vendors, open-source projects are starting to build knowledge-graph context layers around code. The technical direction is broadly consistent with what we have been building. These efforts today focus primarily on the Code layer of what we treat as a four-layer ontology. The Functional, Design, and Architecture layers, the cross-layer relationships, the enablement partnership that keeps the graph healthy over years, and the operating model that makes the methodology run at enterprise scale are not yet part of these efforts. We expect open-source to fill in over time, and we will be glad when it does.

## Graphs for Agent-Facing Products

Software products are starting to open their capabilities to their customers' own agents, which act on the customer's behalf through interfaces such as MCP servers. An MCP server that exposes hundreds of tools gives an agent access, and still leaves the agent to work out which tools to use, in what order and under which rules.

The knowledge graph already records what a product provides: its capabilities, workflows, entities and contracts. These are the domain invariants every customer shares. An interface for agents can be built from the graph, describing each capability in the terms of the domain, independently of the screens and APIs designed for people. The graph also governs which external agent may use which capability.

A formal grammar above the graph adds the rules a schema cannot express. With it, an agent can write what a customer needs and check its own result by running tests. This approach is called Dialect Engineering: it lets more of a software-as-a-service product vary per customer while the domain invariants stay shared. It is set out in the paper *SaaS architecture when code is cheap*, at [dialect-engineering.ai](https://dialect-engineering.ai).

## Where to Go Next

| If you want to...                                                     | Go to                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------- |
| Walk the continuous SDLC instantiation end to end                     | [Agentic Software Engineering (SDLC)](sdlc/_index.md)   |
| Walk the legacy modernization instantiation end to end                | [Agentic Legacy Modernization](modernization/_index.md) |
| Understand how Accion Labs engage commercially                        | [Practitioner](practitioner/_index.md)                  |
| See the SDLC platform that operationalizes continuous work            | [Breeze.AI](practitioner/breeze-ai.md)                  |
| See the modernization platform that operationalizes legacy work       | [ASIMOV](practitioner/asimov.md)                        |
| Look up methodology terminology                                       | [Resources / Glossary](resources/_index.md)             |
| Read the origin story and how the methodology evolved                 | [About / Origins](about/_index.md)                      |

## About the Methodology

Semantic Engineering is proprietary to Accion Labs. The framework and concepts are public, documented on this site, and free to apply. The methodology mark is reserved.

If you want to adopt the methodology in your own organization, the content here is everything you need to understand it. If you want our help running it, the [Practitioner section](practitioner/_index.md) describes how we engage.

[Talk to us about adopting this for your team](practitioner/contact.md).

## Frequently Asked Questions

{{< faq >}}
