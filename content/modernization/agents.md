---
title: "The Modernization Agent Fleet"
description: "The agent fleet that operates the modernization pipeline. Nine named agents across five stages (Discover, Document, Migrate, Validate, Maintain). Bounded project pipeline rather than continuous loop. Progressive autonomy calibrated per engagement."
weight: 40
date: 2026-06-11
lastmod: 2026-06-11
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
  - chief-information-security-officer
---

This page walks the agent fleet that operates the modernization pipeline. The continuous SDLC agent fleet is on [The Agents](../sdlc/agents.md); the two share the same underlying principles and differ in topology because the work is different. Modernization is a bounded project with a defined target. The fleet runs a finite pipeline once across five sequential stages.

## Why the Agents Work

The agents on both fleets share four properties that make them reliable enough to put into production engineering workflows.

| Property | What it means |
|---|---|
| Constrained by the knowledge graph | The agent traverses the graph rather than guessing. It cannot generate code that violates an architectural boundary the graph defines. In modernization, the graphs are the Source-state ontology (the parity contract from the legacy) and the Target-state ontology (the target contract from the blueprint). |
| Cognitive shortcut for context assembly | The work a senior engineer does manually (assembling cross-layer context into a prompt) is now done by the agent against the graph. In modernization, the work being shortcut is the legacy reverse engineering plus the target-stack target mapping; both happen against structured representations rather than free-text reasoning. |
| Variance bounded to implementation detail | Two runs of the same agent against the same module produce different code in the small details. The structural elements (the parity contract from the Source-state ontology, the target shape from the Target-state ontology, the SME's annotation) are constrained explicitly. The remaining variance is acceptable. |
| Named human owner | Every agent has a named owner. In modernization, the owners are the Modernization Expert, the engagement's Chief Architect, the Product Owner, and the engagement's CISO liaison (depending on the agent). The owner reviews outputs and approves writes to systems of record. |

These four properties apply to both fleets. They are what make agentic execution reliable enough for production engineering whether the work is continuous SDLC or bounded modernization.

## The Modernization Agent Fleet

![The modernization agent fleet as a bounded pipeline by stage, with the four validation gates and the two human-validation points](/diagrams/modernization-pipeline-by-stage.svg)

The modernization fleet runs a project-bounded pipeline. Inputs (legacy code, supporting artifacts, target blueprint) enter once at the start. The agents operate sequentially across the five modernization stages. The migration and validation agents iterate per scoped module until the gates pass. Once the migration is complete and the modern system is deployed, the pipeline terminates. The maintenance stage continues until hand-over.

### Named Agents

The fleet has nine named agents distributed across the five stages.

| Agent | Stage | What it does | Named human owner |
|---|---|---|---|
| **Code Ingestion Agent** | Discovery | Parses the legacy code base across the supported language set (TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, Perl, COBOL, Delphi) using AST extractors. Produces the Source-state ontology. | Engagement's Chief Architect |
| **Code Enrichment Agent** | Discovery | Annotates the Source-state ontology with relationships, dependencies, descriptions, and metrics. Produces the enriched Source-state ontology that downstream stages operate on. | Engagement's Chief Architect |
| **Blueprint Ingestion Agent** | Discovery | Decomposes the target blueprint into the Target-state ontology: target architecture, target language and runtime, coding standards, security policies, design system. | Engagement's Chief Architect |
| **Specification Extraction Agent** | Documentation | Produces the specification document from the Source-state and Target-state ontologies. Generates the human-readable extractions: business requirements document, BDD function tests, end-to-end test scripts, code chatbot interface. | Modernization Expert |
| **Migration Agents** | Migration | The agentic migration: source-to-target code generation per scoped module, in iteration with validation feedback. Per-language and per-target-stack adapters. | Modernization Expert |
| **Architecture Validation Agent** | Validation | Architecture gate: infers source architecture from the Source-state ontology, enforces target architecture alignment against the target blueprint, flags structural drift. | Modernization Expert |
| **Design Validation Agent** | Validation | Design gate: applies approved design systems and UI guidelines, ensures generated interfaces conform to design standards. | Modernization Expert |
| **Standards Compliance Agent** | Validation | Standards gate: applies enterprise-level security rules and policies, detects deviation from security rules, enforces coding standards. | Engagement's CISO liaison |
| **Functional Validation Agent** | Validation | Functional gate: validates business-logic equivalence between the legacy behavior and the migrated output, detects deviation of business rules in the migrated code. | Product Owner plus Modernization Expert |

The maintenance stage does not have a dedicated agent class; it operates the existing agents at reduced cadence on incremental changes after deployment.

### Topology: Bounded Pipeline Versus Continuous Loop

The [SDLC fleet](../sdlc/agents.md#the-sdlc-agent-fleet) runs a per-change SDLC loop. Each change enters at the left, the agents process it, the change merges, the KG Sync Agent updates the graph, the loop continues for the next change. The fleet runs for years.

The modernization fleet runs a project-bounded pipeline. The agents operate sequentially across the five modernization stages. The migration and validation agents iterate per scoped module until the gates pass. Once the migration is complete, the pipeline terminates.

| Topology dimension | SDLC fleet | Modernization fleet |
|---|---|---|
| Runtime | Continuous, per PR merge | Bounded, per modernization project |
| Loop | Per-change SDLC flow | Per-module migration-validation iteration loop within the broader pipeline |
| Orchestration | Two-level orchestration with workstream sub-orchestrators | Five-stage pipeline orchestration with per-module sub-orchestration in the migration stage |
| Lifetime of an agent instance | Years (the agent operates on the same product graph across many changes) | Project duration (the agent operates on one modernization estate then terminates) |
| Termination condition | None; the methodology is designed for continuous operation | All scoped modules deployed, hand-over complete |

The pipeline topology has implications for operational decisions. Agent cost per modernization is bounded (it ends when the modernization ends), which makes commercial sizing predictable. Agent learning per modernization is bounded too: the engagement-specific tuning accumulated during the MVP phase carries through Scaled Migration but does not transfer to the next engagement automatically (the next engagement's tuning starts from the cumulative tuning across all prior engagements, calibrated to the specific legacy estate at hand).

## How the Pipeline Runs

The pipeline is sequential across stages and iterative within Stages 3 and 4.

### Discovery Stage Agents

In sequence: the Code Ingestion Agent parses the legacy source code and produces the initial Source-state ontology. The Code Enrichment Agent then walks the ontology and adds dependencies, relationships, descriptions, and metrics. In parallel, the Blueprint Ingestion Agent decomposes the Target Blueprint (chosen by the client) into the Target-state ontology.

Output: the Source-state ontology and the Target-state ontology, both fixed for the duration of the project.

### Documentation Stage Agent

The Specification Extraction Agent reads the Source-state and Target-state ontologies and produces the specification format that bridges them, along with four human-readable extractions (BRD, BDD function tests, end-to-end test scripts, code chatbot). The Product Owner and Architect then annotate the specification at module level (Retain, Modify, Replace, Retire) before Stage 3 begins.

Output: the annotated specification, fixed once annotation is complete.

### Migration Stage Agents

The Migration Agents run per scoped module. The agents consume the annotated specification and the Target-state ontology, generate target code under the parity contract from the Source-state ontology, and produce a target code candidate per iteration. The Migration Agents are language-specific and target-stack-specific: a COBOL-to-.NET migration uses different adapter logic than a VB.NET-to-React migration.

Output: a target code candidate that enters the Validation stage.

### Validation Stage Agents

All four validation agents run on every candidate before any of them can advance to deployment. The four gates each produce machine-verifiable evidence; a candidate that fails any gate returns to the Migration Agents with the gate's evidence attached for re-generation.

| Gate | Agent | What it validates |
|---|---|---|
| Architecture | Architecture Validation Agent | Conformance to the Target Blueprint's architecture |
| Design | Design Validation Agent | Conformance to the design system and UI guidelines |
| Standards | Standards Compliance Agent | Conformance to security rules, coding standards |
| Functional | Functional Validation Agent | Parity with legacy behavior captured in the Source-state ontology |

The Migration ↔ Validation iteration loop runs until all four gates pass. The Modernization Expert then reviews the gate-pass output, signs off the module for deployment, and the next module enters the loop.

### Maintenance Stage Activity

After deployment, the maintenance stage activates. The agents from the earlier stages remain available but run at reduced cadence on incremental work: refresh cycles, change-impact reviews, occasional re-modernization of legacy modules that were initially out of scope.

## Progressive Autonomy in the Modernization Fleet

Progressive autonomy applies differently in the modernization fleet than in the SDLC fleet. The SDLC fleet earns autonomy over time as the agent operates on the same product graph for many changes; the autonomy levels track the operator's accumulating confidence in the agent's behavior on that product.

The modernization fleet has a different evidence-accumulation pattern because each engagement starts with a new legacy estate. The autonomy the Code Ingestion Agent has on a COBOL parse is informed by the implementing partner's track record across prior engagements; the autonomy on the specific engagement's estate accumulates during the engagement itself. The MVP module migration (Stage 3 of the [Modernization Operating Model](process/operating-model.md)) is where engagement-specific autonomy is calibrated. By the time the Scaled Migration stage runs, the agents are operating at the steady-state level for the engagement's target stack and legacy estate.

The Expert Review pattern is also different. In the SDLC fleet, the developer is in the loop on per-change decisions. In the modernization fleet, the Modernization Expert reviews the target code output once per iteration, validates that the four validation gates' evidence is consistent with the parity contract, and signs off on the module for deployment. The Product Owner's role spans specification annotation at module scoping, functional gate review per module, and UAT validation.

| Autonomy aspect | SDLC fleet | Modernization fleet |
|---|---|---|
| Calibration starting point | Cumulative tuning across all prior engagements on similar products | Cumulative tuning across all prior engagements on similar legacy stacks |
| Engagement-specific calibration | Happens over the first several sprints of the engagement | Happens in Stage 3 (MVP migration) explicitly |
| Steady-state autonomy reached | After several sprints with stable evidence | After MVP completes; Scaled Migration runs at steady-state |
| Human review pattern | Developer per change (Zone 3); Engineering Team custodian per Promotion Agreement (Zone 4) | Modernization Expert per gate-pass iteration; Product Owner at specification annotation and UAT |

The autonomy framework in both fleets is anchored on machine-verifiable evidence (the impact analysis report in SDLC; the four gates' evidence in modernization) so that the human review can be efficient without being absent.

## Why the Fleet Stays Small

The modernization fleet is nine agents, not thirty. The fleet was sized to cover the five stages of the modernization lifecycle with one agent per distinct responsibility, plus the four validation agents that map to the four named gates. Adding more agents to the fleet adds operational surface area without adding leverage; the cost of operating an additional agent (configuration, tuning, audit trail, named ownership) is non-trivial and the benefit needs to be visible. We resist agent proliferation in the modernization fleet for the same reason we resist it in the SDLC fleet.

> **How Accion Labs operationalizes the modernization fleet**
>
> The [ASIMOV platform](../practitioner/asimov.md) implements all nine modernization agents. The five-stage pipeline runs as a bounded modernization project under the [Modernization Operating Model](process/operating-model.md). Engagement-specific autonomy is calibrated during the MVP phase, then operated at steady state during the Scaled Migration phase.

---

[The Agents](../sdlc/agents.md) covers the SDLC agent fleet. [Modernization Operating Model](process/operating-model.md) covers the operating model that runs the modernization fleet. [Engagement Modes of Legacy Modernization](engagement-modes/_index.md) covers the five modes that consume different slices of this fleet.
