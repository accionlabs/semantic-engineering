---
title: "ASIMOV Deployment and Architecture"
linkTitle: "Deployment and Architecture"
description: "How ASIMOV is installed for a modernization program: where it runs, its components and tech stack, what it needs from the client, and the steps from setup to the first migrated module."
weight: 40
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## Where It Runs

ASIMOV runs in the client's environment for the length of the program. The legacy code, the graphs and the new code stay there.

> **To confirm with the ASIMOV lead:** whether ASIMOV can also run hosted by Accion Labs; whether it runs on premises with local models; and which clouds it has been deployed on (AWS, Azure, Google Cloud).

## Components

| Component | What it does |
|---|---|
| Graph database | Stores the source graph and the target graph |
| Ingestion and enrichment agents (AGIE) | Read the legacy code and the target architecture into the two graphs |
| Specification service (ASF) | Builds the specification and the documents and tests generated from it |
| Migration agents (AMM) | Build the new code, with an adapter for each source and target stack |
| Validation agents (AVF) | Run the four quality gates and the test streams |
| Review interface | Where the product owner and architect mark modules to keep, change, replace or retire |
| Code chat | Answers questions about the legacy and the new code |
| AI models | Used by the agents for reading, writing and checking code |

> **To confirm with the ASIMOV lead:** the graph database used, the language and framework of the platform, how it is packaged and installed (containers, Kubernetes, Terraform), which AI model providers it supports, the minimum compute, memory and storage, and how the review interface is accessed and signed in to.

## What ASIMOV Needs from the Client

| Dependency | Why it is needed | Required or optional |
|---|---|---|
| The legacy source code, configuration and schemas | To build the source graph | Required |
| The target architecture, coding guidelines and security standards | To build the target graph and set the quality gates | Required |
| An environment to run ASIMOV | A cloud account or servers with access to the code | Required |
| AI model access | For the agents | Required |
| Business and technical reviewers | To review the specification and mark modules, and to review the new code | Required |
| Access to the running legacy system | For the functional audit that compares the two systems | Recommended |
| Existing documents and tests | To check the specification and add to the test scenarios | Recommended |
| An approved design system | For the design gate, when screens are rebuilt | Required when the interface changes |
| A target environment and path to production | To deploy and test the new code | Required for full modernization |

## From Setup to the First Migrated Module

| Step | What happens | Typical time |
|---|---|---|
| 1. Scope | Agree the systems, the target and the engagement mode | |
| 2. Set up | Install ASIMOV in the client's environment and connect the code | |
| 3. Discover | Source and target graphs, analysis report and plan | Two to four weeks |
| 4. Enrich | Graphs completed and the specification built | One to three weeks |
| 5. Review | Business and technical reviewers mark each module | |
| 6. First module | Migrated, gated, reviewed and tuned | Six to twelve weeks |

> **To confirm with the ASIMOV lead:** typical times for scoping, setup and review.
