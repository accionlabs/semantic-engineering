---
title: "Agentic Legacy Modernization"
description: "The legacy modernization instantiation of Semantic Engineering. The Modernization Translation Tax, the five engagement modes, the Source-state and Target-state ontologies, the modernization agent fleet, the operating model, the engagement model, and the case studies for legacy modernization under the methodology."
weight: 30
date: 2026-06-12
lastmod: 2026-06-12
draft: false
section: true
audience:
  - cto
  - cio
  - vp-engineering
  - architect
  - chief-architect
---

This section covers the legacy modernization instantiation of Semantic Engineering. The work covered here is the kind a team does when replacing a legacy stack with a modern stack while preserving the behavior the business has built up over years. The target is well-defined: the legacy behavior is the parity contract; the target stack is chosen up front. The work is bounded rather than continuous.

The parallel section for continuous software engineering is [Agentic Software Engineering (SDLC)](../sdlc/_index.md). The two use cases share a methodology but use different graph models because they ask different questions.

## How to Walk This Section

The pages below are sequenced to build understanding in reading order. A reader who is new to the modernization methodology should walk them top to bottom. A reader who is already familiar can use the page descriptions to jump to the specific depth they need.

| Page | What it covers |
|---|---|
| [The Modernization Translation Tax](translation-tax.md) | The structural cost of modernizing a legacy application without a machine-readable substrate the agents can query. Four components: reverse-engineering, lost-context, validation-vacuum, and knowledge-disappearance. How the methodology addresses each. |
| [Engagement Modes of Legacy Modernization](engagement-modes/_index.md) | The five engagement modes through which modernization is delivered: Documentation Only, Discovery and Documentation, Migration Readiness, Full Modernization, and Maintain / Operate. Each mode is an entry point sized to the work the client is ready to commit to. |
| [Ontologies for Legacy Modernization](methodology.md) | The methodology in depth: the Source-state ontology decomposed from the legacy system, the Target-state ontology defined by the four custodians from a target blueprint, the specification format that bridges the two, the annotation discipline (Retain, Modify, Replace, Retire), and the parity contract that constrains agent generation. |
| [The Modernization Agent Fleet](agents.md) | The agent fleet that operates the modernization pipeline. Nine named agents across five stages (Discover, Document, Migrate, Validate, Maintain). Bounded project pipeline rather than continuous loop. Progressive autonomy calibrated per engagement. |
| [Process](process/_index.md) | The operating model that delivers legacy modernization. Five-stage delivery, SME tuning loop, Expert Review pattern. The enablement frame sized for a bounded project. |
| ↳ [Modernization Operating Model](process/operating-model.md) | Five-stage delivery, SME tuning loop, Expert Review pattern, team composition, and how the discipline differs from the continuous SDLC sprint cadence. |
| ↳ [The Modernization Enablement Frame](process/enablement-frame.md) | Who holds the custodial position during modernization, how the five engagement principles apply to a bounded project, the modernization offboarding doctrine, and the transition to the continuous SDLC enablement frame if the engagement continues. |
| [Engagement Model](engagement-model.md) | The commercial engagement model for modernization engagements: five entry modes with deliverables and durations per mode. Pricing per mode. How the modes differ from the continuous SDLC phases. |
| [Case Archetypes](case-archetypes.md) | Seven anonymized modernization case studies covering ASP.Net, COBOL, Delphi, VB.NET, ASP Forms, and Java migrations across industries (insurance, healthcare, logistics, edu tech, financial services, fuel and billing). |

## What This Section Maps To

The legacy modernization instantiation is operationalized by the [ASIMOV platform](../practitioner/asimov.md). The ASIMOV page covers the production implementation: the four pillars (AGIE, ASF, AMM, AVF) and the Maintain stage, the four quality gates, the deployment architecture, and the operational track record across 15M+ LOC modernized.

The [About Accion Labs](../practitioner/_index.md) page covers the firm. Engagement entry point for modernization work is on the [Contact](../practitioner/contact.md) page.

> **The Universal Principles**
>
> Semantic Engineering is a methodology, not a single ontology. The same underlying principles (structured representation as the substrate, agents constrained by structure, named ownership of the substrate, validation gates that produce machine-verifiable evidence) appear in both instantiations. The modernization ontologies described here are the modernization instantiation. The [four-layer ontology](../sdlc/methodology.md) of the SDLC instantiation is the parallel structure for the continuous-evolution use case. When a modernization completes and the client wants ongoing SDLC governance on the modern system, the modernization knowledge graph transfers to the four-layer ontology and the engagement continues under the SDLC instantiation.

---

Start with [The Modernization Translation Tax](translation-tax.md) for the problem definition, or jump directly to the page that fits the depth you need.
