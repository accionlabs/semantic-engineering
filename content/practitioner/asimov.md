---
title: "ASIMOV"
description: "The Accion platform for AI-led legacy modernization. Built on Semantic Engineering principles. INGESTION → TRANSFORMATION → GENERATION agent pipeline that uses a Source Graph and a Target Ontology Configurator to preserve behavioral parity while transforming the technology stack. Fully agentic, humans outside the loop."
weight: 20
date: 2026-06-10
lastmod: 2026-06-10
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
---

The Accion platform for AI-led legacy modernization. ASIMOV is a peer of [Breeze.AI](breeze-ai.md) under Accion's Software Engineering and Modernization capability. Both apply Semantic Engineering principles. Breeze.AI is the AI-native SDLC platform for evolving an application; ASIMOV is the modernization platform for replacing a legacy stack while preserving the behavior the business has built up over years.

**The headline outcomes (benchmark: 1M LOC standalone code).**

| Outcome | Value |
|---|---|
| Modernization speed | **4× faster** than manual modernization |
| Migration time reduction | **Up to 70%** |
| Migration cost reduction | **Up to 60%** |

## Three Core Capabilities

![ASIMOV's three core capabilities: Legacy System Renewal, Scalable Architecture Redesign, AI-Guided Upgrades, each with representative migration examples](/diagrams/asimov-three-capabilities.svg)

ASIMOV is positioned around three capabilities that map to the three categories of legacy work clients bring to us.

| Capability | What it covers | Typical example |
|---|---|---|
| **Legacy System Renewal** | End-to-end transformation of legacy codebases into modern, reliable stacks. Breaks free from obsolete platforms; reduces technical debt; positions the application for innovation. | COBOL to Java; Delphi to C# / .NET 8; VB.NET to .NET Core |
| **Scalable Architecture Redesign** | Structured path to a modern modular design. Intelligent analysis and guided transformation move the application from monolith to microservices, or from tightly coupled to modular. | Monolithic VB.NET → .NET Core microservices with React UI |
| **AI-Guided Upgrades** | Rapid version upgrades within a technology family. Automated code scanning, dependency mapping, compatibility recommendations. Keeps systems secure, compliant, and high-performing. | Java 8 → Java 21; Angular 0 → Angular 16; .NET 4.5 → .NET 8 |

All three capabilities use the same architecture and the same agentic execution model. The differences are in the Target Ontology Configurator and the per-language adapters in the Code Translation Agent.

## The ASIMOV Architecture

![ASIMOV architecture: Ingestion → Transformation → Generation, with named agents (Code Ingestor, Code Context Enrichment Agent, Design Agent, Code Translation Agent, Code Optimizer, Test Generation Agent), Source Graph and Target Graph, the Target Ontology Configurator on top, and Human OUT OF the loop](/diagrams/asimov-architecture.svg)

The platform runs as a three-stage agent pipeline. The same Semantic Engineering principle that powers Breeze.AI applies here: structured representations of source and target constrain the agents so that generation cannot drift from the intended behavior. The deck calls this architecture out explicitly as **"Human OUT OF the loop"**.

| Stage | What runs | Artifact produced |
|---|---|---|
| **INGESTION** | **Code Ingestor** parses the legacy code base and supporting artifacts (documentation, schemas, integration definitions). The **Code Context Enrichment Agent** annotates each node with relationships, dependencies, descriptions, and metrics. | **Source Graph** → **Enriched Graph** that captures the legacy system's behavior, structure, and tacit context |
| **TRANSFORMATION** | The **Target Ontology Configurator** is loaded with the target architecture, coding guidelines, security standards, and compliance requirements. The **Design Agent** re-architects the system against the Target Ontology (monolith → microservices, tightly coupled → modular, etc.). The **Code Translation Agent** generates the modern code anchored to the design. | **Target Graph** that represents the modern system structurally |
| **GENERATION** | The **Code Optimizer** finalizes the generated code. The **Test Generation Agent** produces the test suite from the legacy system's behavior. | **Target Source Code** plus Supporting Artifacts: test cases, traceability, documentation, specs, dashboards, agents for ongoing operation |

## How ASIMOV Applies Semantic Engineering

The deck uses ontology and graph language explicitly. Each piece corresponds to a Semantic Engineering construct.

| ASIMOV element | Semantic Engineering construct |
|---|---|
| **Source Graph** | The structured representation of the legacy system extracted on ingestion. This is the same kind of four-layer graph that Breeze.AI maintains for an evolving application. In ASIMOV it captures the legacy system's behavior, code structure, dependencies, and metrics. |
| **Target Ontology Configurator** | An ontology in the SE sense: target architecture, coding guidelines, security standards, compliance requirements all encoded as structured constraints. The Design Agent and Code Translation Agent generate against this ontology, which is why the output cannot drift from the architectural intent. |
| **Target Graph** | The structured representation of the modern system. Behaviorally equivalent to the Source Graph at the Functional Ontology level; structurally aligned to the Target Ontology Configurator at the Architecture and Code Ontology levels. |
| **Agent fleet pattern** | The same agent fleet discipline Breeze.AI uses on the per-change SDLC flow. In ASIMOV the fleet is applied to a finite project rather than to continuous operation. |
| **Subset of the four ontologies** | Because the objective is behavioral parity with a technology change, only the ontologies that serve that objective are central. The **Functional Ontology** of the legacy is the behavior contract that must be preserved. The **Code Ontology** is in play on both sides (legacy code parsed; modern code generated). The **Architecture Ontology** is invoked when the redesign changes structure (the Scalable Architecture Redesign capability). The **Design Ontology** is light unless UI re-platforming is in scope. |

The Semantic Engineering anchor is what makes ASIMOV more than a pattern-matched code transpiler. The Source Graph captures actual behavior, not aspirational documentation. The Target Ontology Configurator gives the Design Agent a structured constraint to generate against, not a free-text prompt. The Validation Agent compares the generated system against the Source Graph's Functional Ontology to confirm parity. Structure constrains generation at every step.

## Fully Agentic, Humans Outside the Loop

ASIMOV's architecture diagram calls this out explicitly. The agent pipeline runs end to end across ingestion, transformation, and generation without per-step approval. The human role is **validation**, not approval at each step.

| Mode | Where the human sits |
|---|---|
| Breeze.AI (the AI-native SDLC) | **In the loop**: the developer reviews the coding agent's draft, the PR Validation Agent gives a pass/fail at merge, the human approves merges. At Zone 4 the developer moves upstream into a custodial role over the agent fleet but still owns specific decisions per change. |
| ASIMOV (the modernization platform) | **Outside the loop**: the agent pipeline runs end to end across ingestion, transformation, and generation. The human role is to validate that the resulting modern system preserves the legacy system's behavior, that the test coverage is adequate, and that the architectural intent has been honored. |

This difference reflects the difference between the two problems. Evolving an application is an open-ended sequence of decisions where each decision deserves human review. Modernization has a finite, measurable success criterion: behavioral parity with the legacy system on a target stack. That criterion can be measured, so the agents can run autonomously and the human validates the outcome.

## The Migration and Modernization Approach

![ASIMOV four-phase delivery: Analysis & Planning, Design & Deployment, Testing & Validation, Deployment. Humans IN during analysis, validation, and deployment; OUT during agentic execution](/diagrams/asimov-four-phase-delivery.svg)

The delivery follows four phases.

| Phase | What it covers | Human role |
|---|---|---|
| **Analysis & Planning** | Expert analysis of the legacy estate; ASIMOV agent customization for the specific source language, target stack, and constraints | Expert Analysis + Agent Customization |
| **Design & Deployment** | Agentic execution of the INGESTION → TRANSFORMATION → GENERATION pipeline | Agentic Execution (human outside the loop) |
| **Testing & Validation** | Test generation against the Source Graph's Functional Ontology; behavior equivalence verification | Expert Validation of the generated test suite and parity report |
| **Deployment** | CI/CD automation, customer review, production rollout in controlled waves | Customer Review & Deployment sign-off |

## Outcomes and Deliverables

ASIMOV guarantees four outcomes on the modernized application.

| Outcome | What it means |
|---|---|
| **Highly maintainable, future-ready code** | High-quality, optimized code with improved performance, reliability, and security. Reduces operational issues and extends the lifespan of the system. |
| **Zero cloud dependency on migrated code** | Full control over infrastructure decisions. No vendor lock-in. Freedom to optimize cost and deployment environment after the migration. |
| **Source code, test cases, and documentation** | Guaranteed transparency. Internal teams can manage, audit, and scale the solution confidently. Onboarding is fast because the artifacts are complete. |
| **Optimized, high-quality code** | Reduces long-term technical debt. Makes it easier to adapt, enhance, and extend the system as the business evolves. |

## Supported Migration Paths

| From | To | ASIMOV capability |
|---|---|---|
| COBOL on mainframe | Java on cloud | Legacy System Renewal |
| COBOL on mainframe | .NET 8 plus React 18 | Legacy System Renewal |
| Delphi desktop | C# / .NET 8 plus React | Legacy System Renewal |
| VB.NET | .NET Core / .NET 8 | Legacy System Renewal + Scalable Architecture Redesign |
| Java 8 | Java 21 | AI-Guided Upgrades |
| ASP.NET 4.5 | .NET Core 10 plus React 19 microservices | Legacy System Renewal + Scalable Architecture Redesign |
| Struts | Spring MVC | AI-Guided Upgrades |
| Angular 0 | Angular 16 | AI-Guided Upgrades |
| .NET 4.5 monolith | .NET Core 8 plus Angular 19 microservices | Scalable Architecture Redesign |

The methodology and the architecture are consistent across migration paths. ASIMOV's per-path adapters handle the language-specific parsing in the Code Ingestor and the target generation in the Code Translation Agent.

## Operational Track Record

**6M+ LOC modernized** across ASIMOV engagements. Three representative case studies illustrate the three core capabilities.

### European Education-Technology Provider — Delphi to .NET 8 plus React

Serves 11,000+ schools and universities with a high-volume payments, data, and communications platform.

| Element | Detail |
|---|---|
| Legacy estate | Nearly **3 million** lines of Delphi code; expertise increasingly hard to find |
| Transformation | C# / .NET Core APIs with a React front-end. Relationship-heavy data re-modeled in Neo4j for performance and scalability. Privacy agents applied field-level encryption and anonymization throughout the ETL flow. |
| Test coverage | **85%** automated unit test coverage produced by ASIMOV's Test Generation Agent |
| Cost | Completed at **40%** of the manual approach cost |
| Outcome | Cloud-ready C# / .NET application; accessible, responsive React portal; stronger foundation for an improved user experience |

### Inventory and Warehouse Management Platform — Java 8 to Java 21

Serves global manufacturers and distributors with millions of transactions per day.

| Element | Detail |
|---|---|
| Legacy estate | **1 million** lines of Java code running on Java 7 / 8 with no ongoing security patches |
| Transformation | LLM-assisted upgrade pipeline scanned the code base, identified deprecated APIs, generated Java 21 equivalents. Refactored critical components, introduced container-ready builds, rolled out in controlled waves. |
| Test coverage | JUnit5 automated unit tests; **zero** prior automated coverage replaced with a strong baseline |
| Risk reduction | **75%** vulnerability exposure reduction by moving to an actively supported runtime |
| Performance | **2×** throughput gain on core inventory-sync operations |

### Global Logistics Provider — VB.NET to .NET Core plus React

Multimodal transport, container freight station, and contract logistics services.

| Element | Detail |
|---|---|
| Legacy estate | Monolithic VB.NET application with UI and business logic tightly coupled |
| Transformation | Backend refactored into modular .NET Core components. UI rebuilt in React. ASIMOV's automated toolchain analyzed, modularized, and refactored the legacy code. |
| Outcome | Improved scalability and flexibility; faster user experience; lower long-term maintenance cost; broader talent availability on the modern stack |

## How ASIMOV Relates to Breeze.AI

![Breeze.AI and ASIMOV as peer platforms under Semantic Engineering: same principles, different problems, with key distinctions in problem, ontology usage, graph artifact, human role, and time horizon](/diagrams/breeze-vs-asimov.svg)

ASIMOV and [Breeze.AI](breeze-ai.md) are peer platforms under Accion's Software Engineering and Modernization capability. Both apply Semantic Engineering principles. The difference is in the problem each one is shaped for.

| Dimension | Breeze.AI | ASIMOV |
|---|---|---|
| Problem | AI-native SDLC for evolving an application | AI-led modernization for replacing a legacy stack |
| Ontology usage | Full four-layer ontology, with all four custodians active | Functional and Code primarily; Architecture and Design as needed |
| Graph artifact | One four-layer graph per product, continuously maintained | Source Graph (legacy) and Target Graph (modern), produced on the project |
| Constraint mechanism | Four-layer ontology plus governance/metrics framework | Target Ontology Configurator (target architecture, coding standards, security, compliance) |
| Human role | In the loop: developer reviews per change; gates approve at merge | Outside the loop: agents run end to end; human validates behavioral parity |
| Engagement shape | Open-ended ongoing operation | Finite project with a parity objective |
| Time horizon | Years (continuous) | Quarters per migration estate |

A client engagement that includes both modernization and ongoing SDLC governance uses ASIMOV for the migration and Breeze.AI for the modern system's ongoing evolution. The Functional Ontology that ASIMOV captures from the legacy system transfers to Breeze.AI as the seed for the ongoing four-layer graph on the modern stack.

## When ASIMOV Is the Right Platform

ASIMOV is the right platform when the engagement scope includes replacing a legacy system, when the legacy system is large enough that manual migration is cost-prohibitive (typically 100K+ LOC), when the legacy system's behavior is what has to be preserved (the team is not redesigning the application from scratch), and when the modern system's design is constrained by the legacy system's contracts (database schemas, external integrations, user expectations).

When the engagement is greenfield development of a new system, ASIMOV is not the right platform. [Breeze.AI](breeze-ai.md) alone supports that work.

## Engagement Pattern

| Phase | Duration | What happens |
|---|---|---|
| Discovery | Two to four weeks | Legacy code ingestion, expert analysis, agent customization, modernization scope definition |
| Pilot | Six to twelve weeks | First slice of the legacy system migrated to the modern stack; behavior equivalence verified; team operating model established |
| Scale | Quarters to years | Full migration across the legacy estate, with the team operating under the methodology throughout |
| Steady state | Continuous | Modern system operating under Breeze.AI; legacy system fully retired |

The phases align with the Advise / Launch / Scale / Optimize structure of the broader [Engagement Model](_index.md#engagement-model).

---

[Breeze.AI](breeze-ai.md) is the peer platform for evolving the modern system once the migration is complete. [Engagement Model](_index.md#engagement-model) covers the Advise / Launch / Scale / Optimize phases.
