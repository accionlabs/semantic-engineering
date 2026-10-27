---
title: "ASIMOV Deliverables"
linkTitle: "Deliverables"
description: "What a client receives from an ASIMOV program: knowledge of the legacy system, the reviewed specification, the new code and tests, the evidence that it behaves the same, and documentation."
weight: 30
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## What the Client Receives

| Deliverable | What it is |
|---|---|
| **Analysis report** | Size and structure of the legacy system, migration complexity, priorities and recommendations |
| **Source and target graphs** | What the legacy system does and where each part goes in the new architecture |
| **Specification** | A reviewed description of the system, module by module, with the client's decisions on what to keep, change, replace or retire |
| **Business requirements document** | Generated from the specification, for the business to read |
| **Tests** | Gherkin scenarios and Playwright end-to-end tests from the specification, and unit tests for the new code |
| **Modernized code** | Source code for the new system, in the client's repositories, released in validated waves |
| **Evidence** | Quality gate results, test results, reconciliation and traceability for each module |
| **Technical documentation** | Documentation of the new system |
| **Code chat** | A chat interface for asking questions about the code |

## What the New System Does Not Depend On

The modernized code has no dependency on ASIMOV and no dependency on a particular cloud provider. The client owns the code, the tests and the documentation, and can run, change and host the new system without Accion Labs.

## What the Analysis Report Shows

For a Struts application of 3.2 million lines, discovery reported:

| Measure | Value |
|---|---|
| Files | 16,944 |
| Java files | 12,578 |
| JSP files | 1,929 |
| Struts action classes | 1,255 |
| Action mappings | 2,573 |
| Migration complexity score | 100 out of 100 |
| High-priority files | 1,387 |
