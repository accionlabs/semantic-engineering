---
title: "Modernization Engagement Model"
description: "The commercial engagement model for legacy modernization. Five entry modes from Documentation Only through Maintain and Operate. How the modes differ from the continuous SDLC phases. Pricing per mode."
weight: 60
date: 2026-06-11
lastmod: 2026-06-11
draft: false
audience:
  - cto
  - cio
  - cfo
  - chief-architect
  - procurement
  - business-leader
---

We offer two distinct engagement models, one per use case. This page covers the legacy modernization engagement model. The continuous SDLC engagement model (Advise / Launch / Scale / Optimize) is on the [Practitioner page](../practitioner/_index.md#continuous-sdlc-engagement-model). The two engagement models do not overlap during an engagement. A client engagement that includes both modernization and ongoing SDLC governance uses the modernization model for the bounded migration project and then transitions to the continuous SDLC model once the modernized system is in live operation.

## The Five Engagement Modes

The legacy modernization engagement model has five entry modes. Unlike the SDLC phases (which are a sequence every engagement runs through), the five modes are entry points sized to what the client is ready to commit to. A client may enter at any mode and stay there, or progress through several modes as confidence builds.

The five modes are covered in depth in [Engagement Modes of Legacy Modernization](engagement-modes/_index.md). The summary:

| Mode | What it delivers | Typical duration | Suitable when |
|---|---|---|---|
| **[Documentation Only](engagement-modes/_index.md#mode-1-documentation-only)** | Functional and technical documentation extracted from the legacy code, including BRD, BDD test scenarios, end-to-end test scripts, and a code chatbot interface. No migration. | Two to six weeks | Legacy system continues to run; SMEs are leaving; priority is preserving institutional knowledge. |
| **[Discovery and Documentation](engagement-modes/_index.md#mode-2-discovery-and-documentation)** | Documentation Only outputs plus application inventory, dependency maps, business rules, process flows, SME review packs. | Four to ten weeks | Organization is considering modernization and needs a defensible baseline of system understanding before committing. |
| **[Migration Readiness](engagement-modes/_index.md#mode-3-migration-readiness)** | Migration scope at module level, as-is versus delta classification, target mapping, sequencing, risk and complexity view, requirements traceability matrix. | Six to twelve weeks | Modernization decision is taken; team needs a rigorous readiness foundation before transformation begins. |
| **[Full Modernization](engagement-modes/_index.md#mode-4-full-modernization)** | End-to-end agentic pipeline across all five modernization stages (Discover, Document, Migrate, Validate, Maintain). Modernized target code validated against four named quality gates. | Quarters to years, paced by legacy estate size | Client commits to replacing a legacy stack and wants the agent fleet to drive the migration. |
| **[Maintain, Operate, and Convergence](engagement-modes/_index.md#mode-5-maintain-operate-and-convergence)** | Operational knowledge base, lifecycle documentation, change-impact support, overlap analysis across products, consolidation opportunities, convergence blueprint. | Continuous after Full Modernization | Modernization is complete; client wants the knowledge graph operated as a living asset. |

## How the Modernization Modes Differ from the SDLC Phases

The two engagement models look superficially similar (both have a sequence of named stages) but they differ structurally.

| Dimension | SDLC: four phases | Modernization: five modes |
|---|---|---|
| **Sequence** | Every engagement runs through all four in order | Client may enter at any mode; may stop at any mode |
| **Time horizon** | Years (continuous) | Quarters per modernization estate (bounded) |
| **Anchored on** | The four ontology custodians maintaining the four-layer ontology continuously | The same four custodians governing the three modernization ontologies through the modernization stages and into the modernized system's operation |
| **Operating model** | Sprint-cadenced ([spec sprint](../sdlc/process/spec-sprint.md) + [implementation sprint](../sdlc/process/implementation-sprint.md)) | Stage-sequenced (the five-stage [modernization operating model](process/operating-model.md)) |
| **Enablement frame** | The [SDLC enablement partnership](../sdlc/process/enablement-partnership.md) with five principles and three tiers | The [modernization enablement frame](process/enablement-frame.md) sized for a bounded project |
| **Platform** | [Breeze.AI](../practitioner/breeze-ai.md) | [ASIMOV](../practitioner/asimov.md) |

A client who runs both shapes (modernization first, then continuous SDLC on the modernized system) goes through the modernization modes first and then the continuous SDLC phases starting from Advise. The transition point is the hand-over at the end of the [Maintain mode](engagement-modes/_index.md#mode-5-maintain-operate-and-convergence), where the knowledge graph that the modernization built becomes the seed for the four-layer ontology.

## Pricing for Modernization Modes

The pricing model varies across the five modes to reflect the difference in scope.

| Mode | Typical pricing model |
|---|---|
| Documentation Only | Fixed-price scoped to the legacy estate size |
| Discovery and Documentation | Fixed-price or time-and-materials scoped to the estate size and SME engagement depth |
| Migration Readiness | Fixed-price scoped to the modules in the migration scope |
| Full Modernization | Time-and-materials with module-level milestone-based deliverables, transitioning to outcome-based as the engagement matures |
| Maintain, Operate, and Convergence | Outcome-based pricing tied to the modernized system's operational SLA and the analytical outputs (change-impact reports, convergence blueprints) the client subscribes to |

The earlier modes are fixed-scope and fixed-price; Full Modernization is variable-scope and time-and-materials transitioning to outcome-based; Maintain is outcome-based throughout. The pricing transition reflects the difference between scope-bounded discovery and outcome-driven modernization.

## How the Modes Map to Managed Support Tiers

The [modernization enablement frame](process/enablement-frame.md) covers managed support during and after the engagement. The mapping to the three tiers (Light Governance, Medium Curation, Deep Operations) varies by mode.

| Mode | Typical managed support tier |
|---|---|
| Documentation Only | Light Governance (occasional refresh, no ongoing operation) |
| Discovery and Documentation | Light Governance |
| Migration Readiness | Light Governance during readiness; Medium Curation as Full Modernization begins |
| Full Modernization | Medium Curation throughout; Deep Operations during cutover waves |
| Maintain, Operate, and Convergence | Medium Curation or Deep Operations depending on the client's chosen mode |

The managed support tier choice is made during the engagement mode selection and refined as the engagement matures. See [The Modernization Enablement Frame](process/enablement-frame.md) for the tier details.

## When a Client Engages Both Models

A common engagement shape is: modernization first under the five modes, then transition to continuous SDLC under the four phases.

![Modernization engagement modes flowing into the continuous SDLC phases at hand-over](/diagrams/modernization-to-sdlc-handoff.svg)

The hand-over at the end of Maintain is the transition point. The modernization knowledge graph seeds the four-layer ontology; the four custodians who governed the modernization ontologies continue under the sprint cadence of the SDLC operating model; the modernization agent fleet hands over to the SDLC agent fleet; the bounded engagement transitions into a continuous engagement.

The two models can also run independently. A client who modernizes one product can stop at hand-over without engaging Maintain or transitioning to continuous SDLC. A client who has no legacy to modernize can engage directly at Advise on the continuous SDLC model. The methodology accommodates both pure cases and the hybrid sequence.

> **How Accion Labs operationalizes this**
>
> The [ASIMOV platform](../practitioner/asimov.md) implements the five modernization engagement modes. The [Breeze.AI platform](../practitioner/breeze-ai.md) implements the continuous SDLC engagement model. The [Engagement Modes of Legacy Modernization](engagement-modes/_index.md) section covers the modes in depth.

---

The companion to this page is the [continuous SDLC engagement model](../practitioner/_index.md#continuous-sdlc-engagement-model) on the Practitioner landing. [Engagement Modes of Legacy Modernization](engagement-modes/_index.md) covers each mode in depth. [The Modernization Enablement Frame](process/enablement-frame.md) covers the managed support tiers for modernization engagements.
