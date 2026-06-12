---
title: "Ontologies for Legacy Modernization"
description: "The modernization instantiation of Semantic Engineering. The Source-state ontology decomposed from the legacy system, the Target-state ontology defined by the four custodians from a target blueprint, the specification format that bridges the two, the annotation discipline, and the parity contract that constrains agent generation."
weight: 30
date: 2026-06-11
lastmod: 2026-06-11
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
---

The methodology landing covers the [continuous SDLC instantiation](../sdlc/methodology.md#the-four-custodians-and-their-ontologies-continuous-sdlc-instantiation) in depth on [The Four-Layer Ontology](../sdlc/methodology.md) page. This page covers the legacy modernization instantiation in equivalent depth. The ontologies have a different shape because the use case is different. Modernization is a bounded project with a well-defined target. The ontology structure is sized for that shape.

## Why Modernization Needs a Different Ontology Shape

The four-layer ontology of the SDLC instantiation captures the current state of a live system. Each layer is owned by a custodian who keeps it current as the system evolves. The graph is continuously updated; there is no fixed target state because the system itself is the target, refined incrementally.

Legacy modernization works against a different set of facts. The legacy system already exists and its behavior is the parity contract. The target stack is chosen before the project starts. The work is bounded: produce the modern equivalent and then operate it. The four custodian roles (Product Owner, Architect, UX Designer, Engineering Team) still own the ontologies, but the cadence of custodianship matches the modernization stages instead of the sprint loop. The Product Owner and Architect annotate the specification at module scoping (what to retain, modify, replace, retire), the UX Designer and Architect define the target system through the target blueprint, and the Engineering Team interprets the source code and operates the migrated system. The same custodians continue into the modernized system's operation, which preserves the ontologies as a long-term knowledge investment.

These differences produce a different ontology shape.

| What the modernization ontology needs | Why the four-layer SDLC ontology does not provide it |
|---|---|
| A representation of the legacy system's actual behavior | The four-layer ontology captures the live system; for modernization the system is "live" but is the legacy that will be retired, so the representation has to be Source-snapshot |
| A custodian-governed representation of the target system | The SDLC ontology has no target state because the system evolves incrementally; modernization requires a target ontology derived from the target blueprint before any code is generated |
| A bridge that lets the custodians shape the scope at project start | SDLC has no equivalent because scope is shaped continuously through sprint cycles, not at project start |
| A parity contract the agents are bound to | SDLC agents validate change against the current ontology; modernization agents validate the modern output against the legacy behavior captured in the Source-state ontology |

## The Three Modernization Ontologies

![The three modernization ontologies: Source-state (decomposed from the legacy system), Target-state (derived from the target blueprint), and the specification format bridging them with the SME annotation discipline. The Source-state ontology is the parity contract; the Target-state ontology is the target contract.](/diagrams/modernization-ontologies.svg)

The modernization instantiation anchors three structured representations across the project. Each has a distinct role.

| Ontology | What it captures | When it is built |
|---|---|---|
| **Source-state ontology** | The legacy system as it actually runs. Code-level decomposition (files, classes, functions, statements, APIs), enriched with dependencies, relationships, descriptions, and metrics. The behavior contract that the modern system must preserve. | Built at the start of the project from the legacy source code and supporting artifacts by the ingestion and enrichment agents. Fixed for the duration of the engagement. |
| **Target-state ontology** | The modern system as it should be structured. Target architecture, target language and framework choices, coding standards, security policies, compliance requirements, design system primitives. | Decomposed from the target blueprint by the blueprint ingestion agent during the discovery stage. Fixed for the duration of the engagement. |
| **Specification format** | A specification-as-code intermediate that bridges the Source-state and Target-state ontologies. Captures the migration plan at module granularity. Extractable to multiple human-readable formats: a business requirements document, function tests in standard formats (BDD scenarios and end-to-end test suites), and a code chatbot interface that lets engineers query legacy behavior in natural language. | Generated by the specification extraction agent from the Source and Target ontologies. Annotated by the Product Owner and Architect at the start of the project (Retain, Modify, Replace, Retire). Fixed once annotation is complete. |

The three ontologies are fixed for the duration of the project. This matters: the migration and validation agents operate against a stable contract. The legacy behavior cannot drift mid-project, and the target architecture cannot drift mid-project, because the work is bounded.

## The Source-State Ontology in Detail

The Source-state ontology is the modernization equivalent of the Code Ontology in the four-layer SDLC instantiation. The hierarchy is the same on the structural side (File → Class → Function → Statement → API), the AST-derived extraction is the same technology, and the LLM enrichment is the same discipline.

What differs is the purpose. In the SDLC instantiation, the Code Ontology is one of four layers and is continuously updated. In the modernization instantiation, the Source-state ontology is the parity contract: the behavioral evidence the modern system has to honor.

| Node type | What it captures | Example in a COBOL-to-.NET migration |
|---|---|---|
| File | A source file in the legacy code base | `CRDDUPC.cbl` |
| Class / Section / Paragraph | A unit of logic in the legacy language | A COBOL paragraph implementing credit-card duplicate-check logic |
| Function / Subroutine | A callable unit with signature and call sites | A subroutine that validates a card-holder ID |
| Statement | Captured statement body for the call graph and behavioral evidence | The body of the validation subroutine, retained so the migration agents can generate the modern equivalent that produces the same outputs for the same inputs |
| API / Boundary | A boundary the legacy exposes to other systems (CICS transaction, batch interface, queue consumer) | `CC00 sign-on transaction`, `COSGN00C credit-card system entry` |

The captured statement bodies are what make the modernization parity precise rather than approximate. The functional validation agent can replay legacy behavior against the modern output because the statement-level facts are in the graph.

## The Target-State Ontology in Detail

The Target-state ontology has no SDLC-instantiation equivalent. It captures the modern system's structural intent before any modern code is generated.

| Layer | What the target blueprint encodes |
|---|---|
| Target language and runtime | The framework family the modern system targets (for example: .NET 8, Java 21, Spring MVC) |
| Target architecture | Microservices versus modular monolith, the architectural layers from user experience through infrastructure, deployment topology |
| Target design system | Component library, atomic-design primitives, UI conventions the modern frontend conforms to |
| Coding standards | Patterns, naming conventions, dependency-injection style, error-handling conventions |
| Security and compliance | Field-level encryption requirements, audit-trail requirements, data-residency constraints |
| Integration contracts | The APIs, queues, and data stores the modern system must integrate with |

The blueprint ingestion agent decomposes the blueprint into a structured Target-state ontology. The migration agents generate against it. The four validation gates check conformance to it: the architecture gate against the architecture layer, the design gate against the design system, the standards gate against the coding and security standards, and the functional gate against the parity contract from the Source-state ontology.

## The Specification Format: Bridging Source and Target

The specification format sits between the Source-state and Target-state ontologies. The specification extraction agent produces it. The custodians annotate it. The migration and validation agents consume it.

The specification captures, at module granularity:

| What the specification expresses | Example in a COBOL-to-.NET migration |
|---|---|
| Which Source-state modules are in scope for this engagement | The four Source-state modules that handle credit-card lifecycle |
| The SME's annotation for each module | Card-holder-ID validation: **Retain** behavior, **Modify** implementation. Duplicate-check: **Replace** with the modern fraud-detection library. Statement-printing: **Retire** (legacy paper workflow ending). |
| The mapping from Source-state modules to Target-state architecture | Card-holder-ID validation → Account Service in the target architecture. Duplicate-check → Fraud-Detection Service. |
| The expected target outputs per module | The .NET classes, controllers, and services that should result from migrating each Source module |
| Test scenarios that capture the parity contract | BDD scenarios derived from the legacy behavior, executable against the modern output |

The specification is extractable to multiple human-readable formats: a business requirements document for stakeholder review, function tests in standard BDD format for behavioral validation, end-to-end test scripts for UI-level validation, and a code chatbot interface for engineers to query the legacy behavior in natural language during the modernization.

## The Annotation Discipline: Retain, Modify, Replace, Retire

![The annotation discipline: every Source-state module receives Retain, Modify, Replace, or Retire — with concrete examples per option](/diagrams/modernization-rmrr-annotation.svg)

The SME annotation discipline is how custodianship is performed in modernization. The same four custodians who own the four-layer ontology in the SDLC instantiation own the three modernization ontologies. The cadence is different: the SDLC custodians articulate intent continuously into their ontology layers across sprints; the modernization custodians articulate intent through the annotation discipline at module scoping, adjust during functional gate reviews, and validate at UAT. The Product Owner and Architect drive the per-module annotation, with input from the Engineering Team on technical disposition and from the UX Designer on legacy interaction patterns where the target retains a user interface surface. Each module gets one of four annotations.

| Annotation | What it means | Effect on the migration agents |
|---|---|---|
| **Retain** | The legacy module's behavior is preserved in the modern equivalent. The structural shape may change (paragraph to class, subroutine to method) but the functional behavior must match. | The migration agents generate a modern equivalent and the functional validation gate verifies parity. |
| **Modify** | The legacy module's behavior is changing in defined ways during the modernization. The Product Owner captures what changes in the annotation. | The migration agents generate a modern equivalent that reflects the modification. The functional gate validates against the modified contract, not the legacy. |
| **Replace** | The legacy module is being replaced by a different solution (a modern library, a SaaS subscription, an existing service in the target architecture). The legacy implementation is not migrated. | The migration agents do not generate a migration; they wire the target architecture to the replacement and validate the integration. |
| **Retire** | The legacy module's function is being eliminated. The modern system will not have an equivalent. | The migration agents do not generate a migration. The Source-state nodes are documented in the technical artifacts as retired. |

The four annotations capture every disposition a custodian needs to express. The discipline is governed: every Source-state module must receive an annotation before migration begins. Modules that have not been annotated cannot enter the migration loop.

## The Parity Contract

The Source-state ontology, the Target-state ontology, and the specification format together form the **parity contract** that constrains agent generation throughout the project. The contract is what makes agentic execution in modernization reliable rather than speculative.

| Constraint mechanism | What it ensures |
|---|---|
| Source-state ontology with captured statement bodies | The migration agents generate modern code against actual legacy behavior rather than against the architect's recollection of it. The functional validation gate has executable evidence to replay. |
| Target-state ontology with the architectural layers and standards | The migration agents generate code that fits the target architecture and conforms to the chosen patterns. The architecture, design, and standards gates validate against the blueprint. |
| Specification with the custodian-assigned Retain / Modify / Replace / Retire annotation | The migration scope is bounded by the custodian declaration. The migration agents do not migrate retired modules. Replaced modules go to the replacement target. Modified modules go to the modified contract. Retained modules go to the parity contract. |

Compared to the four-layer SDLC ontology, the modernization ontology has more structure at project start (the target blueprint pre-defines what the SDLC instantiation discovers incrementally) and less structure at project end (the modernization project terminates; the SDLC operating model continues). The trade-off matches the use case.

## How the Two Instantiations Connect at the Handoff

When a modernization engagement completes, the Source-state ontology that the modernization built and the Functional Ontology that the SME's annotations effectively documented are available as the seed for the four-layer ontology on the modern stack. The transition path:

| Modernization output | What it becomes in the continuous SDLC instantiation |
|---|---|
| Source-state ontology (post-migration: now the running state of the modern system) | Seed for the four-layer Code Ontology under the Engineering Team's custodianship going forward |
| Annotated specification (Retain / Modify entries) | Seed for the Functional Ontology under the Product Owner's custodianship |
| Target blueprint (architecture and standards) | Seed for the Architecture Ontology under the Architect's custodianship |
| Target blueprint (design system) | Seed for the Design Ontology under the UX Designer's custodianship |

The graph travels. The four custodians of the modernization instantiation continue as the four custodians of the continuous SDLC instantiation. The methodology principles are the same; the operating discipline shifts from stage-sequenced to sprint-cadenced to match the new shape of the work.

> **How Accion Labs operationalizes the modernization ontology**
>
> The [ASIMOV platform](../practitioner/asimov.md) implements all three modernization ontologies and the parity contract: the ingestion and enrichment agents that build the Source-state ontology, the blueprint ingestion agent that produces the Target-state ontology, the specification extraction agent and the human-readable extractions, the migration agents, and the four validation gates. The [Modernization Operating Model](process/operating-model.md) covers the delivery discipline that runs on top of the ontology.

---

[The Four-Layer Ontology](../sdlc/methodology.md) is the depth treatment for the continuous SDLC instantiation. [Semantic Knowledge Graphs](../sdlc/methodology.md) is the methodology landing that covers the principles common to both instantiations.
