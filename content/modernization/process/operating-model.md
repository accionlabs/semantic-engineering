---
title: "Modernization Operating Model"
description: "The operating model that delivers legacy modernization. Five-stage delivery, SME tuning loop, Expert Review pattern, team composition, and how the discipline differs from the continuous SDLC sprint cadence."
weight: 10
date: 2026-06-11
lastmod: 2026-06-11
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
  - cio
---

The continuous SDLC operating model is covered in depth across [Spec Sprint](../../sdlc/process/spec-sprint.md), [Implementation Sprint](../../sdlc/process/implementation-sprint.md), [Team](../../sdlc/process/team.md), and [Enablement Partnership](../../sdlc/process/enablement-partnership.md). It is sized for live applications with evolving scope: two staggered sprint cadences, four ontology custodians, a layered team structure, an enablement partnership across years. That operating model does not fit a modernization project, where the work is bounded and the target is well-defined.

This page covers the operating model that does fit modernization. It is the human-side discipline that wraps the modernization agent fleet across the five-stage pipeline. Where the continuous SDLC operating model is sprint-cadenced and custodian-owned, the modernization operating model is stage-sequenced and custodian-governed.

## How the Two Operating Models Differ

The two operating models share principles (agents constrained by structure, humans validating rather than implementing every step, named owners for each artifact) but differ on six dimensions that derive from the use case shape.

| Dimension | Continuous SDLC operating model | Modernization operating model |
|---|---|---|
| **Cadence** | Two staggered sprint cycles ([Spec Sprint](../../sdlc/process/spec-sprint.md) ahead of [Implementation Sprint](../../sdlc/process/implementation-sprint.md)) running continuously | Five sequential stages running once across the modernization project |
| **Knowledge anchoring** | Continuous custodianship: the four custodians articulate intent into their ontology layers on a sprint cadence | Stage-sequenced custodianship: the same four custodians govern the modernization ontologies; the Product Owner and Architect lead the annotation discipline (Retain, Modify, Replace, Retire) at module scoping, adjust during functional gate reviews, and validate at UAT |
| **Iteration** | Per-change SDLC flow runs once per change request | Per-module migration-validation iteration loop runs until the four validation gates pass |
| **Human role** | Developer in the loop on per-change decisions; PR Validation Agent gates each merge | Modernization Expert validates per-iteration target code output; Product Owner validates the parity contract at UAT |
| **Engagement length** | Years of continuous operation | Quarters per modernization estate |
| **Team composition** | The four custodians plus the implementation team plus the enablement layer | The Modernization Expert plus the Product Owner plus the Architect plus the engagement's Chief Architect, sized to the modernization scope |

A client who runs both engagement types uses the modernization operating model for the bounded migration project and then transitions to the continuous SDLC operating model once the modernized system is in live operation. The transition point is the hand-over at the end of the maintenance stage.

## The Five-Stage Delivery

![The modernization operating model: five sequential stages (Discovery and Analysis, Ontology Generation and Enrichment, MVP Migration, Scaled Migration, UAT and Deployment with Maintenance), two iteration loops running in parallel across Stages 3 and 4 (automated migration-validation loop and human-driven SME tuning loop), and the two human validation points (SME Annotation before migration begins and Expert Review at each gate-pass iteration and at hand-over).](/diagrams/modernization-operating-model.svg)

Modernization unfolds across five sequential stages. The first two build the modernization ontologies; the next two execute the migration and validate it; the fifth maintains the modernized system through hand-over. This section covers each stage from an operating-model perspective: who participates, what they decide, what gets produced, and how the SME tuning loop runs across stages.

### Stage 1: Discovery and Analysis

| Element | Detail |
|---|---|
| Participants | Modernization Expert, Product Owner, Architect, engagement's Chief Architect, client's CTO or VP Engineering as sponsor |
| Duration | Two to four weeks |
| Decisions made | The modernization scope at module level. The target stack (typically chosen by the client before the engagement starts and confirmed here). The MVP module that will pilot the migration. The pace and shape of the SME engagement across the project. |
| Outputs | Comprehensive Analysis Report on the legacy estate. Migration recommendations and detailed migration plan with target architecture and designs. MVP module identification. |
| Where the agents run | The ingestion and enrichment agents run on the legacy estate to produce a preliminary Source-state ontology that supports the analysis. The target blueprint is selected from the engagement's options or composed bespoke. |

### Stage 2: Ontology Generation and Enrichment

| Element | Detail |
|---|---|
| Participants | Modernization Expert, engagement's Chief Architect, Product Owner for periodic review |
| Duration | One to three weeks |
| Decisions made | The aperture of the Source-state ontology: which legacy modules are decomposed at full statement depth, which are captured at module-summary depth (typically the modules slated for Retire treatment). |
| Outputs | The full Source-state ontology in the graph database, with AI-driven enrichment for dependencies, descriptions, and metrics. The Target-state ontology from the blueprint ingestion agent. |
| Where the agents run | The ingestion and enrichment agents complete their full pass. The specification extraction agent produces the first specification document and the human-readable extractions (business requirements document, BDD function tests, end-to-end test scripts, code chatbot). |

### Stage 3: MVP Migration (One Identified Module)

| Element | Detail |
|---|---|
| Participants | Modernization Expert, Product Owner for specification annotation and functional gate review, Architect for standards and architecture gate review, engagement's Chief Architect for validation oversight |
| Duration | Six to twelve weeks |
| Decisions made | The SME's annotation across the MVP module (Retain, Modify, Replace, Retire per Source-state node). The customization and configuration of the migration agents (frontend, backend, services) per migration requirements. The autonomy level the migration and validation agents will operate at for this engagement. |
| Outputs | The MVP module migrated end-to-end. Engagement-specific tuning of the agents based on Architect and Product Owner feedback. A documented per-module workflow that the Scaled Migration stage will run against. |
| Where the agents run | The migration agents produce target code candidates per module sub-unit. The four validation gates check each candidate. The iteration loop runs until the gates pass. The SME tuning loop runs in parallel: feedback from the SME on the MVP output drives agent prompt and configuration tuning for the subsequent modules. |

### Stage 4: Scaled Migration

| Element | Detail |
|---|---|
| Participants | Modernization Expert, Product Owner for annotation on remaining modules and functional gate review on each, Architect and Chief Architect for ongoing validation oversight |
| Duration | Quarters per module group, paced by the engagement's release cadence |
| Decisions made | The order in which remaining modules are migrated (typically guided by the dependency map and risk classification from Stage 1). The deployment plan for each module group. |
| Outputs | The remaining modules migrated end-to-end. Deployment and testing of each module group. Ongoing agent tuning based on feedback across the engagement's life. |
| Where the agents run | The Stage 3 workflow runs at scale across the remaining modules, with the agents operating at the engagement-tuned steady-state autonomy level. |

### Stage 5: UAT, Deployment, and Maintenance

| Element | Detail |
|---|---|
| Participants | Modernization Expert, Product Owner for UAT, client's UAT team, deployment engineering |
| Duration | Per release wave, then ongoing through hand-over |
| Decisions made | The UAT acceptance per module. The deployment sequencing. The post-deployment monitoring window. The pace and shape of the hand-over to the client (or to a continuous SDLC engagement on the modern stack). |
| Outputs | Deployed modern system. UAT fixes based on feedback. Technical documentation for the migrated application code. The knowledge graph in a state suitable for ongoing operation. |
| Where the agents run | The maintenance discipline operates the modernized system. Modernization Experts remain engaged at a reduced cadence to support change-impact analysis until hand-over to the client or to a continuous SDLC engagement on the modern stack. |

## The Two Iteration Loops

Stages 3 and 4 both run two distinct iteration loops in parallel. The loops are different in kind: one is automated and runs on a fast cadence; the other is human-driven and runs on a slow cadence.

| Loop | Cadence | What it drives |
|---|---|---|
| Migration-Validation iteration loop | Per migration candidate (typically minutes to hours) | Re-generation of the target code candidate until the four validation gates pass |
| SME tuning loop | Per module (typically weeks) | Adjustments to agent prompts, agent configurations, and the SME's annotations based on review of the gate-passed output |

The SME tuning loop is what makes the modernization operating model accumulate engagement-specific knowledge. By the end of the MVP stage, the agents are operating at the autonomy level the engagement supports. By the end of the Scaled Migration stage, the per-module workflow is well calibrated and the SME's annotation patterns are captured in the engagement-specific configuration.

## The Expert Review Pattern

The Modernization Expert is the named human owner across the modernization project. The role pairs with the engagement's Chief Architect on the validation side and with the Product Owner on the specification and parity-contract side.

| Where the Modernization Expert reviews | What they validate |
|---|---|
| At the end of every migration-validation iteration where the four gates pass | That the target code output is consistent with the parity contract from the SME's annotations and the target blueprint. That the gate evidence is sufficient to advance the module to deployment. |
| At the end of every Stage 3 and Stage 4 module migration | That the module is ready for deployment. That the engagement-specific agent tuning is consistent with the gate outcomes. That any Product Owner or Architect feedback has been incorporated into the configuration. |
| At the hand-over at the end of Stage 5 | That the modern system is operating as expected. That the knowledge graph is in a state that can transfer to a continuous SDLC engagement or to the client's internal team for ongoing maintenance. |

The Expert Review pattern is what makes the modernization model's "validation, not per-step approval" stance operationally credible. The agents run autonomously through migration and validation; the Expert reviews the bounded outputs at defined gates rather than approving each agent action.

## Team Composition Across the Engagement

![Team composition across the modernization engagement: roles and engagement intensity per stage](/diagrams/modernization-team-by-stage.svg)

| Role | Where they engage |
|---|---|
| **Client CTO or VP Engineering** | Engagement sponsor. Stage 1 scope decisions, mid-engagement reviews, hand-over sign-off. |
| **Product Owner (one or more, per domain)** | Specification annotation in Stage 3. Functional gate review per module across Stages 3 and 4. UAT in Stage 5. The named human owner of the parity contract. |
| **Architect (typically the client's lead architect or senior engineer)** | Standards gate and architecture gate review per module. Validates that the modern output is consistent with the target architecture and the engagement's standards. Pairs with the engagement's Chief Architect. |
| **Modernization Expert (from the implementing partner)** | Named human owner of the agents in the engagement. Tuning loop driver. Per-iteration Expert Review. |
| **Engagement's Chief Architect (from the implementing partner)** | Validation oversight across the four gates. Calibrates the gates' thresholds to the engagement's standards. Reviews migration-validation iteration outcomes. |
| **Engineering Team for deployment (client or implementing partner)** | Stage 5 deployment, post-deployment monitoring. |

The team is sized to the modernization scope. A 500K LOC modernization typically engages one Modernization Expert, one Chief Architect, two to three Product Owners (one per major domain), and one Architect. A 3M LOC modernization typically engages two Modernization Experts, one Chief Architect with one supporting senior architect, four to six Product Owners, and two Architects.

## How the Modernization Operating Model Connects to the Continuous SDLC Operating Model

The two operating models do not overlap during their respective engagements, but they connect at the hand-over.

When the modernization completes and the modernized system is in live operation, the knowledge graph that the modernization built is fully populated against the modern stack. At this point the client has options.

| Path | What follows the modernization |
|---|---|
| Client takes over operationally | The Source-state ontology (now the running state of the modern system) is handed to the client's internal team. The client operates the modernized system on their own. The implementing partner may provide bounded support agreements but the operating-model engagement ends. |
| Client engages a continuous SDLC operating model | The Source-state ontology becomes the seed for the four-layer Code Ontology in the SDLC instantiation. The same four custodians who owned the modernization ontologies continue as the custodians of the four-layer ontology. They articulate the ongoing intent into the Functional, Design, and Architecture ontologies. The continuous SDLC operating model resumes from the seeded graph. |
| Client retires the engagement entirely | The modernized system is in production and the client has no ongoing engagement. The knowledge graph remains the client's; the offboarding doctrine (see [Enablement Partnership](../../sdlc/process/enablement-partnership.md#the-offboarding-doctrine)) governs the transition. |

The three paths are not exclusive. A common engagement shape is: the modernization is delivered, then a continuous SDLC engagement runs for a defined initial period (typically eighteen months), then the client takes over operationally with a residual support agreement.

> **How Accion Labs operationalizes this**
>
> The [ASIMOV platform](../../practitioner/asimov.md) implements the five-stage pipeline (Discover, Document, Migrate, Validate, Maintain) and the four validation gates that the operating model wraps. The five engagement modes (Documentation Only through Maintain / Operate) are described on the [ASIMOV engagement model](../../practitioner/asimov.md#the-asimov-engagement-model) section. The [Breeze.AI platform](../../practitioner/breeze-ai.md) implements the continuous SDLC operating model that the modernization engagement can transition to at hand-over.

---

[The Team](../../sdlc/process/team.md) covers the operating model that delivers continuous SDLC. [Spec Sprint](../../sdlc/process/spec-sprint.md) and [Implementation Sprint](../../sdlc/process/implementation-sprint.md) are the two cadences that operating model runs on. [The Enablement Partnership](../../sdlc/process/enablement-partnership.md) is the engagement frame for the implementing partner's role across both operating models in their respective use cases.
