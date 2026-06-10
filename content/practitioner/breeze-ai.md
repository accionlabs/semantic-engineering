---
title: "Breeze.AI"
description: "The Accion platform that operationalizes Semantic Engineering for SDLC engagements. The four-layer knowledge graph, the agent fleet that operates on it, the validation gates, and the brownfield extraction process all live here."
weight: 10
date: 2026-06-10
lastmod: 2026-06-10
draft: false
audience:
  - cto
  - vp-engineering
  - architect
  - procurement
---

The platform that operationalizes Semantic Engineering for SDLC engagements. The four-layer knowledge graph, the agent fleet that operates on it, the validation gates, and the brownfield extraction process all live here. A client adopting Semantic Engineering for an SDLC engagement is adopting Breeze.AI as the technical substrate.

## The Heritage of the Name

![Two roots into Breeze.AI: the 2017 Breeze manual blueprint for role governance, and the 2022 knowledge-graph constraint pattern from drug discovery, converging into the 2026 platform that operationalizes both](/diagrams/breeze-heritage-timeline.svg)

Breeze.AI carries the name of an earlier framework. The original **Breeze** was published in 2017 as a manual blueprint that codified the minimal governance structure for product owners, architects, and UX designers. It worked but was operationally heavy. Maintaining the artifacts across hundreds of engagements required continuous coordination, and senior practitioners often skipped them under deadline pressure.

Breeze.AI is what Breeze became once AI could do the maintenance work humans had been doing by hand. The role-governance discipline that the 2017 framework codified is preserved in the four-layer ontology. The maintenance burden that defeated the manual version is now handled by the agent fleet, with the KG Sync Agent keeping the graph current on every merge and the verification suite gating every commit. See [Origins](../about/origins.md) for the full convergence story.

## What Breeze.AI Implements

![Breeze.AI architecture overview: the four-layer knowledge graph at the center, six core agents on the inner ring (Impact Analysis, PR Validation, KG Sync, BDD Generation, Coding, Test Generation), the integration surface on the outer ring (version control, CI/CD, ticket systems, design tools, AI coding assistants, test runners, observability)](/diagrams/breeze-architecture-overview.svg)

Breeze.AI is the production implementation of every methodology element described in [Semantic Knowledge Graphs](../semantic-knowledge-graphs/_index.md), [The Agents](../the-agents.md), and [The Team](../process/team.md).

| Methodology element | Breeze.AI implementation |
|---|---|
| Four-layer ontology (Functional, Design, Architecture, Code) | Native graph storage with typed nodes per layer and cross-layer typed relationships |
| Brownfield extraction | AST-based code parsing, LLM-inferred metadata enrichment, browser-automation design extraction, full-stack inference of architecture and functional layers |
| Impact Analysis Agent | Pre and post implementation analysis with the full impact-report output format |
| PR Validation Agent | CI/CD pipeline integration; per-merge validation against all four ontologies |
| BDD Generation Agent | Functional Ontology to Gherkin-format scenario generation |
| KG Sync Agent | Automated graph update on every merge; structural-change human-review workflow |
| Cross-Product Impact Extension | Multi-graph traversal for cross-product changes |
| Portfolio Rationalization Agent | Quarterly cross-product duplication and dead-capability detection |
| Governance and metrics framework | The 29-metric framework and 14 verification checks run automatically |
| Progressive autonomy | Five autonomy levels with Promotion Agreement workflow |
| Agent fleet orchestration | Two-level orchestration with workstream-specific sub-orchestrators |

## Deployment Architecture

![Three Breeze.AI deployment modes: SaaS (Accion-hosted), Client-hosted dedicated, On-premises (Gen AI in a Box), showing where the platform, the graph, and the inference live for each](/diagrams/breeze-deployment-modes.svg)

| Configuration | Where the platform runs | Where the graph lives | Where inference happens |
|---|---|---|---|
| SaaS (Accion-hosted) | Accion's managed infrastructure | Accion's managed graph storage | Cloud LLM providers (OpenAI, Anthropic, AWS Bedrock) |
| Client-hosted dedicated | Client's cloud account (AWS, Azure, GCP) | Client's cloud account | Cloud LLM providers or client-managed |
| On-premises | Client's on-premises infrastructure | Client's data center | Local models via Gen AI in a Box |

The deployment decision is made during the Advise phase. Factors include data sovereignty requirements, compliance regime, integration with existing client infrastructure, and cost structure.

## Integration Surface

![Breeze.AI integration surface: the platform at the center with 8 integration domains around it (version control, CI/CD, ticket systems, design tools, AI coding assistants, test runners, observability, code repositories)](/diagrams/breeze-integration-surface.svg)

Breeze.AI integrates with the client's existing engineering toolchain. The methodology does not require ripping and replacing what works.

| Integration | What it covers |
|---|---|
| Version control (GitHub, GitLab, Bitbucket) | Per-merge KG sync; PR validation gate |
| CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI, Azure DevOps) | Validation agent runs as a CI step |
| Ticket systems (Jira, Linear, Azure DevOps Boards) | Spec linkage and traceability |
| Design tools (Figma, Sketch) | Design Ontology extraction and updates |
| AI coding assistants (Claude Code, Cursor, Copilot) | Impact report attached as context to prompts |
| Test runners (Jest, Cypress, Playwright, JUnit) | BDD scenarios generated in formats the runners consume |
| Observability tools | Agent action audit trail forwarded to client's observability stack |

Breeze.AI adds a layer to the existing engineering toolchain. It does not replace the IDE, the test runner, the CI/CD pipeline, the ticket system, or the version control system. The integration surface above is how Breeze.AI works with those tools rather than around them. The platform also does not replace the AI coding assistant. Most engagements continue to use Claude Code, Cursor, or Copilot for the actual code generation. Breeze.AI provides the structured context (the impact analysis report) that those tools consume as additional input to their prompts.

## Operational Maturity

Breeze.AI is in production at multiple client engagements.

| Metric | Current state |
|---|---|
| Largest single-application graph in production | 1.6M+ LOC |
| Typical brownfield extraction time | Two to three weeks for 2M LOC |
| Typical impact analysis query time | Eight minutes for 1.6M LOC graph |
| Number of agent classes in production | Six core agents plus extensions |
| Number of named human owners required for a full deployment | Three to five (Chief Architect, Ontology Maintainer, Knowledge Agent Owner, one FDE per workstream) |

## Engagement Lifecycle

Breeze.AI is licensed as part of the Accion engagement.

| Engagement phase | What is licensed |
|---|---|
| Workshop | Platform access for the workshop duration only |
| Phase 1 (SDD Adoption) | Light integration; ticket-system traceability |
| Phase 2 (SE Foundation) | Full platform deployment for the first workstream |
| Phase 3 (SE at Scale) | Full platform deployment across the portfolio |

The engagement frame evolves over the lifecycle. See [Engagement Model Evolution](../process/team.md#engagement-model-evolution). Early-stage engagements typically use an effort-based engagement with platform access included. Mature engagements move to a deliverable-based engagement where the platform plus the enablement hours plus the graph-health SLA are framed as an integrated outcome.

---

[ASIMOV](asimov.md) is the peer platform that applies Semantic Engineering principles to AI-led legacy modernization. [Engagement Model](_index.md#engagement-model) describes the Advise / Launch / Scale / Optimize phases under which Breeze.AI is deployed.
