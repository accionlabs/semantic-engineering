---
title: "Semantic Knowledge Graphs"
description: "The structural substrate of Semantic Engineering. How graphs create global context, what each custodian writes into the four ontologies, how the aperture decides what enters the graph, and how the three sources of truth keep the operating model honest."
weight: 40
date: 2026-06-04
lastmod: 2026-06-09
draft: false
section: true
audience:
  - cto
  - vp-engineering
  - cio
  - analyst
  - tech-lead
---

The [Manual Translation Tax](../manual-translation-tax.md) names the structural cost the team pays converting unstructured knowledge into action. The [Zones of AI-Assisted SDLC](../zones-of-ai-assisted-sdlc/_index.md) walks the path teams take to address it. This section covers the response itself. A four-layer knowledge graph replaces the four codified text artifacts of the manual landscape with a structured, machine-readable substrate that every custodian writes into and every agent reads from.

## Why Knowledge Graphs Are Viable Now

Knowledge graphs as a concept have been around for decades. None reached wide enterprise adoption because the maintenance cost ran ahead of the value. Constructing a comprehensive ontology took months of expert labor. Keeping it current took continuous manual curation. Most organizations watched their ontology efforts go stale and abandoned them.

AI has the opposite problem. Foundation models process unstructured information at remarkable speed and generate plausible output at scale. Without structured constraint, the output looks right and breaks when it meets reality.

The combination resolves both. Agents do the heavy lifting on the graph: extracting structure from existing code and documentation, updating the graph on every PR merge, flagging inconsistencies. The graph constrains the agent: an agent operating against a four-layer graph cannot hallucinate a function the Code Ontology does not hold, violate a boundary the Architecture Ontology defines, or duplicate a component the Design Ontology already contains. Every action against the graph enriches it. Every enrichment makes the next action more precise.

## The Knowledge Graph as an Asset

What the combination produces is a structured, continuously enriched representation of how an enterprise's software thinks, decides, and operates. Over the lifetime of an engagement, the graph becomes inseparable from the business. The intent it captures, the judgment it encodes, the audit trail it maintains, the cross-layer connections it preserves: together these make it irreplaceable. Documents can be rewritten. Code can be rebuilt. A mature knowledge graph cannot be reconstructed without rerunning the years of governed activity that produced it.

The asset deteriorates without ongoing curation. Agents reading and writing into the graph degrade it unless governed. Ontologies drift from operational reality unless refreshed. Audit trails atrophy unless reviewed. The graph needs named, accountable custodians. The four ontology custodians inside the client's team fill that role: the Product Owner for the Functional Ontology, the Architect for the Architecture Ontology, the UX Designer for the Design Ontology, the Engineering Team for the Code Ontology. Accion supports their custodianship through the [Enablement Partnership](../process/enablement-partnership.md), borrowed from managed-services partnerships and trusteeship.

## The Four Custodians and Their Ontologies

Each custodian writes into one ontology layer. The layer is the minimal governance structure that ensures the custodian is doing their work properly, and the substrate the agent reads at runtime.

| Custodian | Ontology layer | What they articulate | What the agent reads |
|---|---|---|---|
| Product Owner | Functional | Personas, outcomes, scenarios, steps, actions | One structured definition of every outcome the system supports |
| Architect | Architecture | Services, boundaries, dependencies, data stores, integrations | The current ownership map, including cross-team contracts |
| UX Designer | Design | Components, molecules, templates, flows, design tokens | The constraint set that decides which component applies to which case |
| Engineering Team | Code | Modules, classes, functions, endpoints, database schemas | What was tacit in distributed code knowledge, now queryable across teams |

When a team adopts this structure, the day-to-day shifts in a specific way. The architect is no longer answering "where should this endpoint live?" on Slack every other day, because the answer is in the Architecture Ontology and the agent can read it. The designer no longer fields one-off "is there a component for this?" pings, because the Design Ontology answers them. The product owner is no longer re-explaining outcomes that already exist. Each custodian's time goes to the structural questions where their judgment actually adds value: when a boundary should move, when a pattern warrants a new ontology entry, when an outcome conflicts with one already promised elsewhere.

The four ontologies are not independent. They are cross-linked. A single Functional action traces through Design (which component renders it), Architecture (which service owns it), and Code (which function implements it, and which database tables it reads or writes). The [The Four-Layer Ontology](four-layer-ontology.md) subpage covers the cross-layer traversal in operational detail.

## What the Agent Sees, Before and After

The clearest way to see the change is from the agent's point of view.

| Dimension | SDD alone | SDD plus Semantic Engineering |
|---|---|---|
| Intent for the change | Authoritative spec | Spec plus cross-references to related outcomes in the graph |
| Context scope | One feature, one repository | Full application across four connected layers |
| Cross-repository awareness | None | Modules, services, dependencies across every repository |
| Cross-team contracts | None | API contracts and boundaries owned by other teams |
| Architecture awareness | Implicit in spec author's mind | Explicit graph of services, boundaries, data stores |
| Design system awareness | Wireframes if attached | Componentized Design Ontology with reusable primitives |
| Code-level knowledge | None | Function, class, endpoint, table-level nodes |
| Brownfield reality | Aspirational | Actual current state extracted from the code |
| Impact prediction | None | Pre-implementation blast-radius report |
| Post-implementation verification | None | Comparison of predicted versus actual impact |
| Drift over time | Decays under deadline pressure | Auto-updates on every merge |
| Cross-team coordination | Informal | Conflicts surfaced at the PR validation gate |
| Knowledge half-life | Decays from the moment the spec is written | Compounds; every sprint enriches the graph |

The pattern across every row is the same. The spec is necessary. The graph is what makes the spec actionable in a complex, brownfield, or multi-team environment.

## Three Sources of Truth

Many programs conflate progress tracking with intent tracking with state tracking. The conflation is invisible until something breaks, at which point the team discovers that their "single source of truth" was trying to be three things at once and failing at all three.

![Three Sources of Truth: Specification, Ticket System, Knowledge Graph](/diagrams/three-sources-of-truth.svg)

We separate them cleanly.

| Source for | System | Scope | Primary consumer |
|---|---|---|---|
| Intent for a specific change | Specification (markdown or ticket body) | Local: one feature, one user story | Implementation team, AI agents |
| Progress, ownership, sprint status | Ticket system (Jira, Linear, or equivalent) | Global: program-wide ticket flow | Engineering managers, product leaders |
| Application state, structure, behavior | Knowledge Graph | Global: the full application as it actually runs today | AI agents, the custodianship team, anyone asking "what does this system actually do" |

Each system holds the load it is suited for. The misuse pattern is treating the spec as a substitute for the other two. The spec becomes a hybrid document, then a stale hybrid, then the team rediscovers the staleness when AI-generated code from the stale spec breaks something nobody predicted. The clean separation eliminates the failure mode.

## Where Humans Stay

The methodology does not remove humans from engineering. It changes the medium of their work. Product owners still define what to accomplish, by populating the Functional Ontology rather than writing prose. Architects still define how the system is organized, by maintaining the Architecture Ontology rather than writing Confluence pages. Designers still maintain the Design Ontology rather than handing off Figma files developers may or may not consult. Engineering teams still write code, or write the agents that write code, consuming impact-analyzed specs rather than reconstructing context for every change.

Humans govern. AI executes. The custodianship discipline gives each role somewhere to put what they know in a form the agent can read.

> **How Accion operationalizes this**
>
> The [Breeze.AI platform](../practitioner/breeze-ai.md) implements the four-layer ontology, the brownfield extraction process, the cross-layer validation gate, and the agent fleet. The [ASIMOV platform](../practitioner/asimov.md) is the peer platform that applies the same Semantic Engineering principles to AI-led legacy modernization, with a focused subset of the ontologies and a fully agentic flow.

---

[The Four-Layer Ontology](four-layer-ontology.md) is the depth treatment: each ontology layer in detail, the aperture criterion that decides what enters the graph, partition by product, brownfield extraction as rationalization, and the governance framework that keeps the graph healthy.
