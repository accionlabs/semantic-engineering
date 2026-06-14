---
title: "Agentic Software Engineering (SDLC)"
description: "The continuous SDLC instantiation of Semantic Engineering. The Manual Translation Tax, the four zones of process, the four-layer ontology, the agent fleet, the operating model, the engagement model, and the case archetypes for continuous software engineering under the methodology."
weight: 20
date: 2026-06-12
lastmod: 2026-06-12
draft: false
section: true
audience:
  - cto
  - vp-engineering
  - product-owner
  - tech-lead
  - cio
---

This section covers the continuous SDLC instantiation of Semantic Engineering. The work covered here is the kind a team does on a live application that needs to keep evolving: greenfield, brownfield, or anywhere in between. Scope is a moving target. Requirements emerge as the product grows. Architecture, design, and functionality update incrementally over years.

The parallel section for legacy modernization is [Agentic Legacy Modernization](../modernization/_index.md). The two use cases share a methodology but use different graph models because they ask different questions.

## How to Walk This Section

The pages below are sequenced to build understanding in reading order. A reader who is new to the methodology should walk them top to bottom. A reader who is already familiar can use the page descriptions to jump to the specific depth they need.

| Page | What it covers |
|---|---|
| [The Manual Translation Tax](translation-tax.md) | The structural cost the team pays every day converting unstructured knowledge into action. Four custodians (Product Owner, Architect, UX Designer, Engineering Team) who hold the tacit knowledge. Three components of the tax. The stake-in-the-ground on what stays human. The structural response in two paired diagrams. |
| [Zones of AI-Assisted SDLC](zones/_index.md) | The four zones of process matched to four zones of work complexity. Each zone is sized for a range of complexity. Each zone keeps what the previous one delivered and adds the response to a failure the previous one cannot handle at the higher complexity. The right zone for the work in front of you depends on the complexity of that work. |
| ↳ [Zone 1: Manual / Vibe Coding](zones/zone-1-manual-vibe-coding.md) | Conversational AI use without a written specification. Where it is suitable, where it stops working, and the transition path to Spec-Driven Development. |
| ↳ [Zone 2: Spec-Driven Development](zones/zone-2-spec-driven-development.md) | SDD as a complete operating mode. The practitioner playbook (constitution, toolkit, spec format, pod structure, async workflow, validation, review discipline, engineering constraints), the Zone 2 spec sprint best practice, and the ceiling conditions teams encounter when complexity grows past SDD's reach. |
| [The Four-Layer Ontology](methodology.md) | The methodology in depth: each ontology layer (Functional, Design, Architecture, Code), the aperture criterion that decides what enters the graph, partition by product, brownfield extraction as rationalization, and the governance framework that keeps the graph healthy. |
| [The Agent Fleet](agents.md) | The agents that operate on the four-layer graph at runtime. Impact analysis before a change, validation on merge, BDD generation, KG sync. How they earn autonomy over time. |
| [Process](process/_index.md) | The operating model that makes this work. Spec sprints, fractional allocation, the layered team structure, the enablement partnership across years. |
| ↳ [Spec Sprint](process/spec-sprint.md) | A separate sprint cycle running ahead of implementation. Custodian-owned workshop mechanics, the impact-analyzed specification as the deliverable, and the lighter form that applies as a Zone 2 best practice. |
| ↳ [Implementation Sprint](process/implementation-sprint.md) | The per-change SDLC flow that consumes refined specs and runs them through the agent fleet from impact analysis to PR validation to KG sync. The Three Sources of Truth in operation. Zone 4 where the agents run the loop. |
| ↳ [Team](process/team.md) | The layered team structure, fractional allocation, the Forward-Deployed Engineer role, and the engagement-model evolution from effort-based to deliverable-based. |
| ↳ [The Enablement Partnership](process/enablement-partnership.md) | How Accion Labs supports the client's custodianship across years. Five engagement principles, three tiers of managed support, and the offboarding doctrine that makes the entry decision easy. |
| [Engagement Model](engagement-model.md) | The commercial engagement model for SDLC engagements: Advise, Launch, Scale, Optimize. Pricing across phases. Three-Phase Rollout that aligns to the methodology phases inside the engagement. |
| [Case Archetypes](case-archetypes.md) | Three anonymized engagements walked end to end. Brownfield enterprise modernization at 2M LOC, greenfield growing into complexity, and SDD at the governance ceiling. |

## What This Section Maps To

The continuous SDLC instantiation is operationalized by the [Breeze.AI platform](../practitioner/breeze-ai.md). The Breeze.AI page covers the production implementation: the four-layer knowledge graph storage, the agent fleet implementation, the integration surface, deployment modes, and the operational maturity numbers from production engagements.

The [About Accion Labs](../practitioner/_index.md) page covers the firm, the AI evolution timeline from 2017 through 2026, the AI Operating Model, and the services catalog. Workshop request and engagement entry point are on the [Contact](../practitioner/contact.md) page.

> **The Universal Principles**
>
> Semantic Engineering is a methodology, not a single ontology. The same underlying principles (structured representation as the substrate, agents constrained by structure, named ownership of the substrate, validation gates that produce machine-verifiable evidence) appear in both instantiations. The four-layer ontology described here is the SDLC instantiation. The [Source-state, Target-state, and specification format](../modernization/methodology.md) of the modernization instantiation is the parallel structure for the bounded modernization use case.

---

Start with [The Manual Translation Tax](translation-tax.md) for the problem definition, or jump directly to the page that fits the depth you need.
