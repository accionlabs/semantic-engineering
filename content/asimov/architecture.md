---
title: "ASIMOV Architecture"
linkTitle: "Architecture"
description: "ASIMOV's five pillars, the pipeline from legacy code to deployed new code, the agent behind each quality gate, the three validation streams, and what discovery produces."
weight: 15
date: 2026-10-28
lastmod: 2026-10-28
draft: false
audience:
  - cto
  - architect
  - chief-architect
---

ASIMOV is built as five pillars, one for each stage of a modernization. Agents run each pillar, and people review at two named points.

## The Five Pillars of ASIMOV

![ASIMOV architecture: Five pillars across the legacy modernization lifecycle. AGIE produces Source Graph and Target Graph (Discover). ASF is the human-readable specification format that the Product Owner and Architect annotate, with input from the other custodians (Document). AMM is the agentic migration machine (Migrate). AVF is the validation framework with four named gates feeding back into AMM (Validate). Maintain covers ongoing operation of the modernized system (Maintain).](/diagrams/asimov-architecture.svg)

| Pillar | Stage | What it does | What it produces |
|---|---|---|---|
| **AGIE** (ASIMOV Graph Ingestion and Enrichment) | Discover | Reads the legacy code into a source graph and adds dependencies, relationships, descriptions and metrics. Reads the target architecture into a target graph. | Source graph, enriched source graph, target graph |
| **ASF** (ASIMOV Specification Format) | Document | A specification of the system, kept as structured data, that can be written out as a business requirements document, Gherkin and Playwright tests, and a chat interface to the code. The architect and product owner review it and mark each module to keep, change, replace or retire, which sets the scope module by module. | Reviewed specification, business requirements, tests, code chat, the modules in scope |
| **AMM** (ASIMOV Migration Machine) | Migrate | Agents build the target code for a selected module, from the reviewed specification and the target graph, in a loop with the validation agents | Target code |
| **AVF** (ASIMOV Validation Framework) | Validate | Checks that the new code compiles and conforms to the specification and the target architecture, runs the four quality gates, and sends findings back to the migration agents | Pass or fail for each gate, with evidence |
| **Maintain** | Maintain | Supports changes to the new code after deployment, and hands the knowledge built during the program over to the client at the pace agreed in the engagement | Maintained code, transferred knowledge |

The pipeline runs: inputs, AGIE, ASF with the reviewers' decisions, AMM in a loop with AVF, target code, expert review, deployment, testing, and Maintain. The two review points are the decisions on the specification and the expert review of the new code. Agents run the steps between them.

### How the Pillars Map to Semantic Engineering

| ASIMOV element | Semantic Engineering construct |
|---|---|
| Source graph | A structured record of the legacy system: its behavior, code structure, dependencies and metrics |
| Target blueprint | The target architecture, coding guidelines, security standards and compliance requirements, read into the target graph |
| Specification (ASF) | The structured bridge between the source graph and the target graph, where the custodians' decisions are recorded |
| Target graph | A structured record of the new system: the same behavior as the source graph at the functional level, built to the target blueprint at the architecture and code levels |
| Validation gates (AVF) | Checks against both graphs at every pass of the migration, each with evidence |

The functional and code layers are always central, because the aim is the same behavior on a new technology. Architecture is central when the structure changes, and design when the user interface is rebuilt.

## The Solution Architecture End to End

| Stage | What runs | What it produces |
|---|---|---|
| **Input** | The legacy source code, supporting documents and the target blueprint enter the pipeline. The Code Ingestion Agent parses the legacy code. The Code Enrichment Agent adds relationships, dependencies, descriptions and metrics to each item. The Target Blueprint Ingestion Agent reads the target architecture into a target graph. | Source graph, enriched source graph, target graph |
| **Specification** | The Extraction Agent writes the specification from the two graphs. The product owner and architect review it and mark which modules to keep, change, replace or retire. | Reviewed specification, the modules in scope |
| **Migration** | The migration agents take the reviewed specification and a selected module and build the new code. The validation agents run the four quality gates on it, and their findings go back to the migration agents until every gate passes. | Target code |
| **Expert review, deployment, testing** | Experts review the new code, which is then deployed to the target environment and tested. Any feedback, issue or error goes back to the migration agents. | Migrated code, technical documents |

## Quality Gates Enforced by Intelligent Agents

Each gate has its own validation agent. Each produces evidence that a machine can check, and its findings go back into the migration loop.

| Gate | Agent | What the gate checks |
|---|---|---|
| **Architecture** | Architecture Validation Agent | Works out the source architecture from the source graph, checks the new code against the target blueprint, and flags structural drift |
| **Design** | Design Validation Agent | Applies the approved design system and interface guidelines to the screens that are generated |
| **Standards** | Compliance Agent | Applies the enterprise's security rules, policies and coding standards, and reports any departure from them |
| **Functional** | Functional Validation Agent | Checks that the business rules behave as they did in the legacy system, and reports any difference |

Code that passes all four gates goes to expert review. Code that fails a gate goes back to the migration agents with that gate's evidence.

## The Agentic Validation Approach

Alongside the gates, three kinds of validation run against the new application:

| Stream | What it produces |
|---|---|
| **Functional and feature audit** | Agents use the running interfaces of both systems, with AI vision models, and confirm the new one has the same features |
| **Unit tests** | Tests generated for the new code; the usual target is 80% coverage or more |
| **End-to-end tests** | Tests of complete business workflows against what the source graph recorded |

## Humans Validate, Agents Execute

The agents run the pipeline from the source graph to the gates. People decide at two points: the product owner and architect mark each module in the specification, and experts review the code that passed the gates. A modernization has a clear test of success, the same behavior on the new technology, and the four gates measure it, so the agents run the steps between those points and people check the result.

## Discovery Output and Knowledge Graph

Discovery measures the legacy system before migration starts. For a Struts application of 3.2 million lines, it reported 16,944 files, 1,255 Struts action classes, 2,573 action mappings, a migration complexity score of 100 out of 100, and 1,387 high-priority files. The full report is on the [Deliverables](deliverables.md#what-the-analysis-report-shows) page.

The source graph records directories, files, classes and methods, and how they relate: which directory holds which file, which file imports which, which class holds which method. Traceability runs from the high-priority files out to every dependency the migration touches.
