---
title: "ASIMOV"
description: "Accion Labs's agentic platform for legacy modernization. Built on Semantic Engineering principles. Five-pillar architecture (AGIE, ASF, AMM, AVF, Maintain) built on a Source Graph, a Target Blueprint, and an intermediate ASIMOV Specification Format. Four Quality Gates enforced by agents. Five engagement modes from Documentation Only through Full Modernization. Humans validate behavioral parity rather than approving each step."
weight: 20
date: 2026-06-11
lastmod: 2026-06-11
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
---

Accion Labs's agentic platform for legacy modernization. ASIMOV is a peer of [Breeze.AI](breeze-ai.md) under Accion Labs's Software Engineering and Modernization capability. Both apply Semantic Engineering principles. Breeze.AI is the agentic SDLC platform for evolving an application; ASIMOV is the agentic modernization platform for replacing a legacy stack while preserving the behavior the business has built up over years.

## Proven Track Record

| Indicator | Value |
|---|---|
| Legacy code modernized | **15M+ lines of code** across ASP.Net, COBOL, Delphi, ASP Forms, VB.NET, and custom proprietary systems |
| Modernization programs delivered | **10+** at scale across large enterprises and regulated environments |
| Cross-industry footprint | Insurance and Finance, Healthcare and Life Sciences, Inventory and Logistics |
| Continuous AI innovation | **3+ years** of field-tested evolution |
| Delivery shape | Time-boxed cycles for complex enterprise systems |
| Engagement attributes | Precise and flexible, scalable and cost-efficient, fully agentic |

**Indicative outcomes on a 1M LOC standalone codebase:**

| Outcome | Value |
|---|---|
| Modernization speed | **Up to 4× faster** than manual modernization |
| Migration time reduction | **Up to 70%** |

Delivery duration on any specific engagement depends on the organization's path-to-production process. Actual cost outcomes depend on the engagement scope, the target environment, the organization's prevailing rate structure, and the modules selected for migration. ASIMOV reports duration and effort outcomes; cost outcomes are framed engagement by engagement.

## What ASIMOV Solves

Generic AI coding assistants and code-translation tools hit predictable walls on enterprise legacy estates. The challenges group into three categories.

| Category | What goes wrong without ASIMOV |
|---|---|
| **Code and Structure Issues** | Spaghetti code with tangled logic and no clear structure. Architecture misalignment between the legacy estate and the target organization's tech stack, patterns, and reuse posture. |
| **Knowledge and Context Gaps** | AI struggles with the vastness of large source applications. Documentation and resident knowledge of the legacy application are missing. Test automation is blocked by the absence of requirement documents. |
| **Integration and Execution Hurdles** | Brownfield migration into an existing target application is poorly handled. External dependencies create parity issues and runtime risk. Agent accuracy and hallucination produce unreliable output without structural constraint. |

ASIMOV addresses each by replacing free-text reasoning with a structured Source Graph, structured Target Blueprint, and a human-readable specification layer that sits between them.

## Three Core Capabilities

![ASIMOV's three core capabilities: Legacy System Renewal, Scalable Architecture Redesign, AI-Guided Upgrades, each with representative migration examples](/diagrams/asimov-three-capabilities.svg)

ASIMOV is positioned around three capabilities that map to the three categories of legacy work clients bring to us.

| Capability | What it covers | Typical example |
|---|---|---|
| **Legacy System Renewal** | End-to-end transformation of legacy codebases into modern, reliable stacks. Breaks free from obsolete platforms; reduces technical debt; positions the application for innovation. | COBOL to .NET 8; Delphi to C# / .NET 8; VB.NET to .NET Core |
| **Scalable Architecture Redesign** | Structured path to a modern modular design. Intelligent analysis and guided transformation move the application from monolith to microservices, or from tightly coupled to modular. | Monolithic ASP.Net 4.5 to .NET 10 microservices with React 19 UI |
| **AI-Guided Upgrades** | Rapid version upgrades within a technology family. Automated code scanning, dependency mapping, compatibility recommendations. Keeps systems secure, compliant, and high-performing. | Java 8 to Java 21; Java Struts to Spring MVC; .NET 4.5 to .NET 8 |

All three capabilities use the same five-pillar architecture and the same agentic execution model. The differences are in the Target Blueprint and the per-language adapters in the migration agents.

## The Five Pillars of ASIMOV

![ASIMOV architecture: Five pillars across the legacy modernization lifecycle. AGIE produces Source Graph and Target Graph (Discover). ASF is the human-readable specification format that the custodians annotate (Document). AMM is the agentic migration machine (Migrate). AVF is the validation framework with four named gates feeding back into AMM (Validate). Maintain covers ongoing operation of the modernized system (Maintain).](/diagrams/asimov-architecture.svg)

The platform is built around five named pillars covering the legacy modernization lifecycle: **Discover → Document → Migrate → Validate → Maintain**. Each pillar is a distinct concern, each is operated by a named set of agents, and the five together cover the lifecycle from legacy understanding through ongoing operation of the modernized system.

| Pillar | Lifecycle stage | What it does | Key outputs |
|---|---|---|---|
| **AGIE** (ASIMOV Graph Ingestion and Enrichment) | Discover | Decomposes the legacy code into a Code Graph. Enriches the graph with dependencies, relationships, descriptions, and metrics. Decomposes the Target Blueprint into the Target Graph. | Source Graph, Enriched Source Graph, Target Graph |
| **ASF** (ASIMOV Specification Format) | Document | A specification-as-code intermediate that can be extracted into multiple human-readable formats: a Business Requirements Document (BRD), function tests (Gherkin and Playwright), and a code chatbot interface. Lets the Architects and Product Owners review the migration plan and annotate modules to retain, modify, replace, or retire. Lets the team select the scope of migration at module granularity. | Annotated ASF, BRD, Gherkin and Playwright tests, code chatbot, scoped module selection |
| **AMM** (ASIMOV Migration Machine) | Migrate | Runs the agentic migration of source code into the target stack. Takes directional inputs (the annotated ASF plus the selected module) and produces target code. Operates in a feedback loop with the validation agents inside AVF. | Target code output, iteration on validation feedback |
| **AVF** (ASIMOV Validation Framework) | Validate | Ensures the migrated code conforms to the ASF and to the Target Blueprint. Ensures the migrated code compiles. Runs the four quality gates (covered below) and feeds findings back into AMM for the next iteration. | Pass or fail per gate, machine-verifiable evidence per gate, AMM feedback signals |
| **Maintain** | Maintain | Maintains the modernized code after deployment. The knowledge graph that AGIE produced continues to accelerate development on the modern stack. Hand-over to the client at a pace and time agreed in the engagement. This is the connection point to ongoing SDLC governance under [Breeze.AI](breeze-ai.md). | Maintained modern codebase, transferred knowledge graph, ongoing SDLC under Breeze.AI |

The pipeline runs Inputs → AGIE → ASF (with SME annotation) → AMM (in a loop with AVF) → Target Code Output → Expert Review → Deployment → Testing → Maintain. The SME annotation and the Expert Review are the named human-validation points; everything between them is agentic.

### How the Pillars Map to Semantic Engineering

ASIMOV uses the same ontology-and-graph discipline that powers Breeze.AI, applied to a finite modernization project rather than to continuous operation.

| ASIMOV element | Semantic Engineering construct |
|---|---|
| Source Graph (AGIE output) | Structured representation of the legacy system. Captures behavior, code structure, dependencies, and metrics. The same kind of graph Breeze.AI maintains for an evolving application, scoped to the legacy snapshot. |
| Target Blueprint (input) | The target architecture, coding guidelines, security standards, and compliance requirements, encoded as a structured constraint. The Target Blueprint Ingestion Agent decomposes it into the Target Graph. |
| ASF (intermediate specification) | A structured, machine-readable and human-readable bridge between the Source Graph and the Target Graph. Where the custodians' domain knowledge enters the pipeline as governed annotations rather than as free-text comments. |
| Target Graph | Structured representation of the modern system. Behaviorally equivalent to the Source Graph at the Functional Ontology level. Structurally aligned to the Target Blueprint at the Architecture and Code Ontology levels. |
| Validation gates (AVF) | The same agent-fleet discipline Breeze.AI uses on the per-change SDLC flow, applied here to verify behavioral parity and structural conformance at every iteration of the migration. |
| Subset of the four ontologies | The objective is behavioral parity with a technology change, so the Functional and Code ontologies are always central. Architecture is central whenever the redesign changes structure. Design is in scope when UI re-platforming is part of the engagement. |

The Semantic Engineering anchor is what makes ASIMOV more than a pattern-matched code transpiler. The Source Graph captures actual behavior, not aspirational documentation. The Target Blueprint gives the agents a structured constraint to generate against, not a free-text prompt. The validation gates compare the generated system against both at every iteration. Structure constrains generation at every step.

## The Solution Architecture End to End

The detailed flow shows where each agent sits, where the custodians annotate, and where the AVF feedback loop closes.

| Stage | What runs | Artifact produced |
|---|---|---|
| **Input ingestion** | Legacy Source Code, Supporting Artifacts, and the Target Blueprint enter the pipeline. The **Code Ingestion Agent** parses the legacy code base. The **Code Enrichment Agent** annotates each node with relationships, dependencies, descriptions, and metrics. The **Target Blueprint Ingestion Agent** parses the target architecture into a Target Graph. | Source Graph, Enriched Source Graph, Target Graph |
| **Specification extraction** | The **Extraction Agent** produces the ASF (ASIMOV Specification Format) from the Source Graph and the Target Graph. The Product Owner and Architect review and annotate: which modules to retain, modify, replace, or retire. | Annotated ASF, scoped module selection |
| **Agentic migration** | AMM takes the annotated ASF and a selected module as directional inputs. It runs the migration. AVF runs the four quality gates against the produced code. Findings feed back into AMM. The loop iterates until the gates pass. | Target Code Output |
| **Expert review, deployment, testing** | Expert Review of the produced target code. Deployment to the target environment. Testing. Any feedback, issues, or errors loop back into AMM for additional iteration. | Migrated Target Code, Technical Documents |

## Quality Gates Enforced by Intelligent Agents

> Quality is validated continuously, not approved at the end.

AVF runs four named gates. Each gate has its own validation agent. Each gate produces machine-verifiable evidence and feeds back into the migration loop.

| Gate | Agent | What the gate enforces |
|---|---|---|
| **Architecture Gate** | Architecture Validation Agent | Infers source architecture from the Source Graph. Enforces target architecture alignment against the Target Blueprint. Flags structural drift. |
| **Design Gate** | Design Validation Agent | Applies approved design systems and UI guidelines. Ensures generated interfaces conform to design standards. |
| **Standards Gate** | Compliance Agent | Applies enterprise-level security rules and policies. Detects deviation of output from defined security rules. Enforces coding standards. |
| **Functional Gate** | Functional Validation Agent | Validates business logic equivalence between the legacy behavior and the migrated output. Detects deviation of business rules in the migrated code. |

A target code candidate that passes all four gates is what advances to Expert Review. A candidate that fails any gate returns to AMM with the gate's evidence attached. The loop iterates until the gates pass.

## The Agentic Validation Approach

In parallel with the gate-by-gate validation inside AVF, ASIMOV runs three validation streams against the migrated modern application, all powered by the Agentic Validation Core.

| Stream | What it produces |
|---|---|
| **Agentic Functional and Feature Audit** | Agentic functional audit with a feedback loop. Agentic inspection of running interfaces using AI vision models. Confirms feature parity between the legacy application and the migrated one. |
| **Automated Unit Test Coverage** | AI-generated unit tests for the migrated code, sized for comprehensive coverage. Typical engagement target is 80% or higher. |
| **End-to-End Functional Testing** | Behavior Driven Testing (BDT) that validates complete business workflows against the Functional Ontology captured in the Source Graph. |

The three streams converge on the same outcome: a validated, production-ready application that the client can adopt with confidence in behavioral parity.

## Humans Validate, Agents Execute

ASIMOV's architecture is explicit about where humans sit relative to the loop.

| Mode | Where the human sits |
|---|---|
| Breeze.AI (the agentic SDLC) | **In the loop**: the developer reviews the coding agent's draft, the PR Validation Agent gives pass or fail at merge, the human approves merges. At Zone 4 the developer moves upstream into a custodial role over the agent fleet but still owns specific decisions per change. |
| ASIMOV (the agentic modernization platform) | **Validation, not per-step approval**: the agent pipeline runs end to end across AGIE, ASF, AMM, and AVF. The named human points are SME annotation of the ASF (what to retain, modify, replace, retire) and Expert Review of the migrated output. Everything between those two points is agentic. |

This difference reflects the difference between the two problems. Evolving an application is an open-ended sequence of decisions where each decision deserves human review. Modernization has a finite, measurable success criterion: behavioral parity with the legacy system on a target stack. That criterion is what the four quality gates measure, so the agents run autonomously and the human validates the outcome.

## The Five-Phase Delivery

![ASIMOV five-phase delivery: Discovery and Analysis, Code Graph Generation and Enrichment, MVP Iterative Migration, Scaled Iterative Migration, UAT and Deployment](/diagrams/asimov-four-phase-delivery.svg)

| Phase | What it covers |
|---|---|
| **Discovery and Analysis** | Agentic deep analysis of the existing source code and supporting artifacts. Comprehensive Analysis Report and migration recommendations. Detailed migration plan with target architecture and designs. MVP module identification. |
| **Code Graph Generation and Enrichment** | Creation of the knowledge graph with automated ingestion of source code, target architecture, and designs into the graph database. Agentic enrichment of the knowledge graph. |
| **MVP - 1 Identified Module (Iterative Migration)** | Customization and configuration of AI agents (frontend, backend, services) per migration requirements. Agent-driven migration of the MVP module. Architect and Product Owner feedback. Agent tuning for iterative improvement. |
| **Scaled Migration (Iterative Migration)** | Agent-driven migration and validation of remaining modules. Deployment and testing of migrated application code. Custodian feedback. Agent tuning for iterative improvement across the wider estate. |
| **UAT and Deployment** | Deployment and UAT testing of migrated application code. Architect and Product Owner feedback. UAT fixes. Generation of technical documentation for the migrated application code. |

The MVP and Scaled Migration phases are iterative by design. Each iteration runs the AMM-AVF loop with the custodians providing tuning feedback, until the gates pass and the module is ready for deployment.

## Discovery Output and Knowledge Graph

The Discovery and Analysis phase produces a quantitative dashboard of the legacy estate before the migration begins. For a representative Struts-based application, the output looks like this.

| Codebase indicator | Value |
|---|---|
| Total files | 16,944 |
| Total lines of code | 3,217,606 |
| Java files | 12,578 |
| JSP files | 1,929 |
| Struts Action classes | 1,255 |
| Struts Form classes | 413 |
| Struts config files | 23 |
| Action mappings | 2,573 |
| Form beans | 1,085 |
| JSP Struts tags | 6,279 |
| Migration complexity score | 100 / 100 |
| High-priority files | 1,387 |
| Medium-priority files | 715 |
| Low-priority files | 923 |

The Knowledge Graph that AGIE produces is the operational substrate everything downstream consumes. It contains directories, files, classes, methods, and their relationships (HAS_CHILD_DIR, HAS_FILE, IMPORTS, CONTAINS, IMPORTS_CLASS, HAS_METHOD, IMPORTS_METHOD, HAS_INSTANCE_INFO). Traceability runs from the high-priority root files outward to every dependency the migration touches.

## Outcomes and Deliverables

ASIMOV guarantees four outcomes on the modernized application.

| Outcome | What it means |
|---|---|
| **Highly maintainable, future-ready code** | High-quality, optimized code with improved performance, reliability, and security. Reduces operational issues and extends the lifespan of the system. |
| **Zero cloud dependency on migrated code** | Full control over infrastructure decisions. No vendor lock-in. Freedom to optimize cost and deployment environment after the migration. |
| **Source code, test cases, and documentation** | Guaranteed transparency. Internal teams can manage, audit, and scale the solution confidently. Onboarding is fast because the artifacts are complete. |
| **Optimized, high-quality code** | Reduces long-term technical debt. Makes it easier to adapt, enhance, and extend the system as the business evolves. |

## Success Stories

Seven anonymized case studies covering the breadth of legacy stacks ASIMOV has modernized (ASP.Net, COBOL, Delphi, VB.NET, ASP Forms, Java) across industries (insurance, healthcare, logistics, education technology, financial services, fuel and billing) are on the [Case Archetypes: Legacy Modernization](../modernization/case-archetypes.md) page. The list is representative rather than exhaustive; the five-stage architecture and the per-language adapters extend to legacy stacks beyond those covered there.

## How ASIMOV Relates to Breeze.AI

![Breeze.AI and ASIMOV as peer platforms under Semantic Engineering: same principles, different problems, with key distinctions in problem, ontology usage, graph artifact, human role, and time horizon](/diagrams/breeze-vs-asimov.svg)

ASIMOV and [Breeze.AI](breeze-ai.md) are peer platforms under Accion Labs's Software Engineering and Modernization capability. Both apply Semantic Engineering principles. The defining difference is the shape of the scope. Breeze.AI operates where the scope is a moving target (the system is in live development, with architecture, design, and functionality evolving incrementally). ASIMOV operates where the target is well-defined (the legacy system's behavior is the contract, and the target stack is fixed up front).

| Dimension | Breeze.AI | ASIMOV |
|---|---|---|
| Problem | Agentic SDLC for an application whose scope evolves incrementally over time | Agentic modernization of a legacy stack to a defined target stack while preserving the legacy behavior |
| Scope shape | Moving target: requirements emerge as the product evolves; architecture, design, and functionality are updated incrementally | Well-defined target: the legacy behavior is the parity contract; the target stack and Target Blueprint are chosen up front |
| Ontology usage | The four-layer ontology of the live system: Functional, Design, Architecture, Code, continuously maintained as the system evolves | A different set of ontologies sized for the modernization problem. A Source-state ontology decomposed from the legacy system by AGIE. A Target-state ontology defined by the four custodians from a target blueprint. The ASF specification format bridges the two. The Source-state ontology intersects with Breeze's four-layer (both decompose code-level state). The Target-state ontology has no Breeze equivalent because Breeze's evolution model has no fixed target. |
| Graph artifact | One four-layer graph per product, continuously maintained | Source Graph, Target Graph, and an ASF document bridging them, all produced during the modernization project |
| Constraint mechanism | Four-layer ontology plus governance and metrics framework | Source Graph plus Target Blueprint plus ASF plus the four AVF gates |
| Human role | In the loop: developer reviews per change; gates approve at merge | Validation, not per-step approval: custodians annotate ASF (Retain / Modify / Replace / Retire); Expert reviews target output |
| Engagement shape | Open-ended ongoing operation under [Advise / Launch / Scale / Optimize](_index.md#engagement-models) | Finite project with a parity objective under one of the [five ASIMOV engagement modes](#the-asimov-engagement-model) |
| Time horizon | Years (continuous) | Quarters per migration estate |

A client engagement that includes both modernization and ongoing SDLC governance uses ASIMOV for the modernization and, once the modernized system is in live operation, Breeze.AI for its continuous evolution. The Source Graph and Functional Ontology that ASIMOV captured from the legacy system transfer to Breeze.AI as the seed for the four-layer graph on the modern stack. The graph travels; the engagement models do not overlap.

## When ASIMOV Is the Right Platform

ASIMOV is the right platform when the target is well-defined. Three conditions tend to be present together: the engagement objective is to replace a legacy stack with a defined modern stack, the legacy system's behavior is the parity contract that must be preserved, and the modernization scope can be bounded up front rather than discovered incrementally.

Breeze.AI is the right platform when the scope is a moving target. The product is in live development (greenfield, brownfield, or anywhere in between); requirements emerge as the team works; architecture, design, and functionality update incrementally as the product evolves. Breeze.AI does not require a fixed target stack because the system itself is the target, continuously refined.

The two are not in tension. Many enterprise clients use both: ASIMOV for the bounded modernization project, then Breeze.AI for the ongoing SDLC evolution of the modernized system once it is in production. The handoff is the knowledge graph.

## The ASIMOV Engagement Model

ASIMOV's engagement model is distinct from Breeze.AI's. Breeze.AI engagements run on the [Advise / Launch / Scale / Optimize](_index.md#engagement-models) phases because the work is continuous SDLC evolution. ASIMOV engagements are framed around five entry modes because the legacy-modernization lifecycle has natural points where a client may want ASIMOV to engage without committing to the full migration.

The intelligence core that ASIMOV builds (the Source Graph, the Enriched Graph, the ASF, the Target Graph) is multi-utility. Each of the five engagement modes consumes a different slice of the same core.

| Engagement mode | What the client engages ASIMOV to deliver | When this mode fits |
|---|---|---|
| **Documentation Only** | Generate functional and technical documentation, test scenarios, and traceability artifacts from the legacy code base. No migration. | When the legacy system will continue to run and the priority is ending the documentation gap so SMEs can leave without losing institutional knowledge. |
| **Discovery + Documentation** | Application inventory, dependency maps, business rules, process flows, SME review packs, plus the documentation outputs above. | When the organization needs a defensible baseline of system understanding before committing to a modernization path. |
| **Migration Readiness** | Migration scope, as-is versus delta classification, target mapping inputs, sequencing, risk and complexity view, requirements traceability matrix. | When a modernization is planned but the team needs a rigorous readiness foundation before transformation begins. |
| **Full Modernization** | The end-to-end pipeline: AGIE → ASF → AMM → AVF → Maintain. Target code generation, API and interface specs, architecture alignment, custom code for approved deltas, developer-ready work packages. | When the client commits to replacing a legacy stack with a modern stack and wants ASIMOV to drive the migration. |
| **Maintain, Operate, and Convergence** | Operational knowledge base, lifecycle documentation, change-impact support, overlap analysis across products, consolidation opportunities, convergence blueprint. | When the modernization is complete (or partially complete) and the client wants ASIMOV to continue operating the knowledge graph for ongoing maintenance, rationalization, and convergence across products. |

A client may move from one mode to the next as confidence builds. A Documentation Only engagement often leads to Discovery + Documentation, which leads to Migration Readiness, which leads to Full Modernization. The five modes are not a forced ladder; they are entry points sized to the client's situation.

### How the Engagement Model Relates to Breeze.AI

The two engagement models do not overlap. ASIMOV's five modes serve a bounded modernization objective. Breeze.AI's Advise / Launch / Scale / Optimize phases serve continuous SDLC evolution. A client may use one without the other, both at different times, or both for different parts of the portfolio.

What does travel between the two is the knowledge graph. When ASIMOV completes a Full Modernization (or finishes a Maintain, Operate, and Convergence engagement and hands the modernized system back to the client), the Source Graph and the Functional Ontology that ASIMOV captured are available as the seed for Breeze.AI's four-layer graph on the modern stack. If the client then wants continuous SDLC governance on the modernized system, Breeze.AI takes over with its own engagement model starting from that seed. The two engagements are sequential, not concurrent, and the use cases are distinct.

### Indicative Phase Cadence Within Full Modernization

Within the Full Modernization mode, the work unfolds across the five-phase delivery model already shown above. Indicative durations:

| Phase | Duration |
|---|---|
| Discovery and Analysis | Two to four weeks |
| Code Graph Generation and Enrichment | One to three weeks |
| MVP (One Identified Module) | Six to twelve weeks |
| Scaled Migration | Quarters per module group |
| UAT and Deployment | Per release wave |

Durations depend on the legacy estate size, the target stack, and the organization's path-to-production process.

---

[Breeze.AI](breeze-ai.md) is the peer platform for evolving the modern system once the migration is complete. [Engagement Model](_index.md#engagement-models) covers the Advise / Launch / Scale / Optimize phases that apply to Breeze.AI engagements.
