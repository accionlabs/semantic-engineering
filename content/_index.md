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
---

Semantic Engineering is the methodology we developed at Accion Labs for running AI agents reliably inside enterprise software work. It treats the knowledge an agent needs as a queryable graph, constrains generation through that graph, and governs the graph through named ownership and validation gates so it stays honest as the work proceeds. The same principles apply whether the team is building new software, evolving live software, or modernizing legacy software.

![Semantic Engineering at a Glance](/diagrams/hero-semantic-engineering-at-a-glance.svg)

This page is the executive overview. Each section links to a deep dive in the topic area it summarizes. If you want to jump straight to a use case, the two anchor sections are [Agentic Software Engineering (SDLC)](sdlc/_index.md) and [Agentic Legacy Modernization](modernization/_index.md).

## The Shared Problem

Enterprise software work is hard because the knowledge that holds a system together lives in heads, decaying documents, and code that is opaque without interpretation. In a typical enterprise application, four roles carry that tacit knowledge:

- the **product owner** holds the *why* (personas, outcomes, scenarios, rejected proposals)
- the **architect** holds the *where* (service boundaries, source-of-truth databases, integration contracts)
- the **UX designer** holds the *how it looks and behaves* (components, interaction patterns, state handling)
- the **engineering team** collectively holds the *what the code actually does* (live functions, retry policies, active feature flags, dead utilities)

No single human holds the whole picture and no document does either. AI coding assistants do well on small, contained tasks but break against this complexity because they have no structured way to query the system's actual state. Bigger context windows do not fix this. The agent needs structured context it can read against, not more raw text to wade through.

Every use case in a typical enterprise portfolio hits the same wall. Greenfield work needs the new application to fit a landscape it has not yet been built into. Brownfield work needs to reason about dependencies inside the live application as it evolves. Legacy modernization needs to honor years of accumulated behavior while replacing the stack that produced it. The complexity differs by use case, but the structural gap is the same.

The full problem treatment is in [The Manual Translation Tax](sdlc/translation-tax.md) for continuous SDLC and [The Modernization Translation Tax](modernization/translation-tax.md) for legacy modernization.

## The Methodology

Semantic Engineering responds to the structural gap with four universal principles that hold across every use case.

| Principle | What it means |
|---|---|
| **Structured representation as the substrate** | Encode the knowledge the agent needs as a queryable graph with explicit nodes and relationships. The agent queries the graph for the slice each task needs. |
| **Agent constraint through the graph** | Agents generate only against what the graph asserts. They cannot invent capabilities the graph does not contain. Generation is bounded by what is declared. |
| **Named ownership of the substrate** | Each part of the graph has a named human custodian who is accountable for keeping it honest. Decay is treated as ownership failure, not a tooling problem. |
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
| **Agents** (the fleet) | [The SDLC Agent Fleet](sdlc/agents.md): impact analysis, BDD generation, KG sync, validation on merge. Earn autonomy over time. | [The Modernization Agent Fleet](modernization/agents.md): nine named agents across Discover, Document, Migrate, Validate, Maintain. Progressive autonomy per engagement. |
| **Process** (the operating model) | [Continuous SDLC Operating Model](sdlc/process/_index.md): spec sprint and implementation sprint, fractional allocation, layered team, enablement partnership across years. | [Modernization Operating Model](modernization/process/_index.md): five-phase delivery, SME tuning loop, expert review pattern, enablement frame sized for a bounded project. |
| **Engagement Model** | [SDLC Engagement Model](sdlc/engagement-model.md): Advise, Launch, Scale, Optimize. Pricing per phase. Three-Phase Rollout aligns to methodology phases. | [Modernization Engagement Model](modernization/engagement-model.md): five entry modes (Documentation Only, Discovery + Documentation, Migration Readiness, Full Modernization, Maintain / Operate). Pricing per mode. |
| **Case Archetypes** | [SDLC Case Archetypes](sdlc/case-archetypes.md): two real engagements end to end, one brownfield at 2M LOC, one greenfield grown into complexity. | [Modernization Case Archetypes](modernization/case-archetypes.md): seven anonymized case studies across ASP.Net, COBOL, Delphi, VB.NET, ASP Forms, and Java migrations across multiple industries. |

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

Outcomes measured on engagements running under this methodology. Anonymized walkthroughs are in the case archetype pages linked above.

**Continuous SDLC engagements under Breeze.AI:**

| Number | Context |
|---|---|
| **2 to 3 weeks** to extract a 2M+ LOC codebase into the four-layer graph | Brownfield extraction on a Node.js, TypeScript and React application |
| **8 minutes** for an impact analysis agent to analyze a 1.6M LOC graph | The number that determines why we partition the graph by product |
| **53%** design component reuse in the first sprint | First sprint under SE-governed UI development on a greenfield workstream |
| **23%** defect rate reduction against the team's pre-SE baseline | Same codebase, same team, before and after |
| **93.4%** test coverage with zero manual BDD overhead | BDD scenarios generated automatically from the Functional Ontology |
| **81%** lower five-year TCO with on-premises AI deployment | For engagements where model inference must remain inside the client's infrastructure |

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

Beyond the commercial vendors, open-source projects like Graphify have started building knowledge-graph context layers around code. The technical direction is broadly consistent with what we have been building. These efforts today focus primarily on the Code layer of what we treat as a four-layer ontology. The Functional, Design, and Architecture layers, the cross-layer relationships, the enablement partnership that keeps the graph healthy over years, and the operating model that makes the methodology run at enterprise scale are not yet part of these efforts. We expect open-source to fill in over time, and we will be glad when it does.

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
