---
title: "How ASIMOV Works"
linkTitle: "How It Works"
description: "ASIMOV's five stages, from reading the legacy code to maintaining the new system; where people review; and the four quality gates every module passes."
weight: 10
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

![ASIMOV architecture: Five pillars across the legacy modernization lifecycle. AGIE produces Source Graph and Target Graph (Discover). ASF is the human-readable specification format that the Product Owner and Architect annotate, with input from the other custodians (Document). AMM is the agentic migration machine (Migrate). AVF is the validation framework with four named gates feeding back into AMM (Validate). Maintain covers ongoing operation of the modernized system (Maintain).](/diagrams/asimov-architecture.svg)

## The Five Stages

| Stage | Component | What happens | What it produces |
|---|---|---|---|
| **Discover** | AGIE (graph ingestion and enrichment) | Agents read the legacy code, configuration, schemas and interfaces into a source graph, and add dependencies, descriptions and metrics. A separate agent reads the target architecture into a target graph. | Source graph, target graph, analysis report |
| **Document** | ASF (ASIMOV specification format) | A specification of what the system does, readable by people, built from the two graphs. It produces business requirements, test scenarios and a chat interface to the code. | Business requirements document, Gherkin and Playwright tests, code chat |
| **Migrate** | AMM (migration machine) | Agents build the new code for a selected module, from the reviewed specification and the target graph. | Target code |
| **Validate** | AVF (validation framework) | Four quality gates check each module. Failures go back to the migration agents with the evidence, and the loop runs until every gate passes. | Pass or fail evidence for each gate |
| **Maintain** | Maintain | The knowledge built during the program supports fixes and changes on the new system, and is handed over to the client. | Maintained code, transferred knowledge |

## Where People Review

People review at two points:

1. **Before migration.** The product owner and architect review the specification and mark each module to keep, change, replace or retire. This sets the scope, module by module.
2. **After migration.** Experts review the new code that passed the gates, before it is deployed and tested.

The steps between those two points are run by agents.

## The Four Quality Gates

| Gate | What it checks |
|---|---|
| **Architecture** | The new code follows the approved target architecture |
| **Design** | Screens follow the approved design system and interface guidelines |
| **Standards** | Security rules, policies and coding standards |
| **Functional** | The business rules behave the same as in the legacy system |

## Showing the New System Behaves Like the Old One

Three kinds of tests run against the new application:

- **Functional audit:** agents use the running interfaces of both systems, with AI vision models, and compare features.
- **Unit tests:** generated for the new code, with a typical target of 80% coverage or more.
- **End-to-end tests:** complete business workflows checked against what the source graph recorded.

## The Delivery Phases

| Phase | What happens | Typical duration |
|---|---|---|
| Discovery and analysis | Analysis report, migration plan, target architecture, choice of a first module | Two to four weeks |
| Graph generation and enrichment | Source and target graphs built and enriched | One to three weeks |
| First module | Agents set up for the stacks involved; the first module migrated, reviewed and tuned | Six to twelve weeks |
| Scaled migration | The remaining modules, in waves | Quarters, by group of modules |
| Acceptance testing and deployment | User acceptance testing, fixes and technical documentation | Each release wave |

Durations depend on the size of the legacy system, the target stack and the client's path to production. The method behind these stages is described in [Ontologies for Legacy Modernization](../modernization/methodology.md) and [The Modernization Agent Fleet](../modernization/agents.md).
