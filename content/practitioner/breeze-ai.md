---
title: "Breeze.AI"
description: "The Accion Labs platform that operationalizes Semantic Engineering for SDLC engagements. The four-layer knowledge graph, the agent fleet that operates on it, the validation gates, and the brownfield extraction process all live here."
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

Breeze.AI is the production implementation of every methodology element described in [Semantic Knowledge Graphs](../sdlc/methodology.md), [The Agents](../sdlc/agents.md), and [The Team](../sdlc/process/team.md).

| Methodology element | Breeze.AI implementation |
|---|---|
| Four-layer ontology (Functional, Design, Architecture, Code) | Native Neo4j graph storage with typed nodes per layer and cross-layer typed relationships. Functional uses Persona → Outcome → Scenario → Step → Action. Architecture uses the eight-layer blueprint (User Experience, API Gateway, Services, Agents, Event Queue, Data Lake, Observability, Infrastructure). Design uses Atom → Molecule → Organism → Template → Page with a parallel User Journey → Flow → Page. Code uses File → Class → Function → Statement → API Endpoint. |
| Citations at every node | Every node carries a pointer back to its source artifact: Jira ticket, Confluence page, Figma frame, document, or code file. Citations are required at the time of node creation and are what make the graph audit-grade. |
| Brownfield extraction | Tree-sitter AST parsing across ten languages (TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, Perl). LLM-inferred metadata enrichment. Browser-automation design extraction. Full-stack inference of architecture and functional layers from the enriched code graph. |
| Data schema ingestion | Relational and search schemas (PostgreSQL, Oracle, SQL Server, Elasticsearch) modeled as first-class graph nodes: tables, columns, constraints, indexes, mappings. |
| Impact Analysis Agent | Pre and post implementation analysis with the full impact-report output format. |
| PR Validation Agent | CI/CD pipeline integration; per-merge validation against all four ontologies. |
| BDD Generation Agent | Functional Ontology to Gherkin-format scenario generation. |
| KG Sync Agent | Autonomous agents wired into GitHub, Bitbucket, and Jira watch every PR, push, and ticket transition. The agents re-ingest exactly what changed. The graph stays continuously current with HEAD. |
| Cross-Product Impact Extension | Multi-graph traversal for cross-product changes. |
| Portfolio Rationalization Agent | Quarterly cross-product duplication and dead-capability detection. |
| Governance and metrics framework | The 29-metric framework and 14 verification checks run automatically. |
| Progressive autonomy | Five autonomy levels with Promotion Agreement workflow. |
| Agent fleet orchestration | Two-level orchestration with workstream-specific sub-orchestrators. |

## Three Ways to Use Breeze.AI

The platform exposes three distinct interfaces, each sized for a different user.

| Interface | Who uses it | What it provides |
|---|---|---|
| **WebUI** at `ai.accionbreeze.com` | Product Owners, Architects, UX Designers, Compliance and Audit reviewers | Visual graph editor, four chat surfaces (one per ontology), document upload, ndjson upload for code, project administration. No IDE setup required. |
| **Claude Code plugin** (`breeze`) | Engineering Teams working in their IDE | The full set of `/breeze:*` slash commands, ontology-aware MCP tools, and the PreToolUse hooks that enforce ontology rules at write time. Distributed through the `breezeai-claude-plugin` marketplace. |
| **Code Ontology CLI** with an API key | CI jobs, batch indexers, headless contexts | Programmatic graph access where no browser is available for OAuth. Used by CI pipelines that re-ingest the graph on every merge. |

The same four-layer graph backs all three. A Product Owner working in the WebUI and an engineer working in Claude Code see the same nodes, the same citations, and the same validation state.

## The Claude Code Plugin

The plugin is the developer interface to Breeze.AI. It ships as one bundle through a Claude Code marketplace, and it contains three things that work together.

| Component | What it does |
|---|---|
| **MCP server** (`breeze-mcp`) | Approximately forty-three typed tools wrap the Breeze backend API, organized by graph (project management, functional graph, architecture graph, design graph, code graph, DB schema graph, documents and health). Claude Code can call any of them when reasoning about a task. |
| **Skills catalog** (eighteen `/breeze:*` slash commands) | Curated workflows that compose the MCP tools into named tasks: `/breeze:setup-project`, `/breeze:onboard-repository`, `/breeze:generate-functional-from-ui`, `/breeze:generate-functional-from-backend`, `/breeze:generate-design`, `/breeze:analyze-architecture`, `/breeze:validate-functional-graph`, `/breeze:generate-code`, `/breeze:generate-spec`, and others. Each skill is a documented procedure with confirmation gates. |
| **PreToolUse hooks** (guardrails) | Two shell-script hooks run before any tool call leaves the developer's machine. `pre-init-check.sh` verifies the workspace is linked to a Breeze project. `validate-functional-node.sh` enforces the Functional Ontology rules at write time (covered below). |

The marketplace pattern (`/plugin marketplace add accionlabs/breezeai-claude-plugin` then `/plugin install breeze`) decouples distribution from IDE configuration. A new version of the plugin ships as a single bundle. Teams that fork the methodology can publish their own marketplace.

The MCP server is plain streamable HTTP and works with any MCP-aware client (Cursor, Cline, Windsurf, and others). What is Claude-Code-specific is the skills catalog and the PreToolUse hooks. A team using a different IDE gets the tools but composes them manually.

## Ontology Guardrails

The Functional Ontology rules are enforced at write time by a PreToolUse hook on the developer's machine. The hook runs before the create or update tool call reaches the backend. If the proposed node violates a rule, the hook blocks the call with a named violation.

| Rule | What the hook enforces |
|---|---|
| Node-type label | Only `Persona`, `Outcome`, `Scenario`, `Step`, or `Action` are valid labels for a Functional Ontology node |
| Persona name discipline | Forbids technical role names (`Developer`, `Engineer`, `API`, `Service`, `Controller`, `Backend`, `Frontend`). A Persona is a domain role (`Customer`, `Analyst`, `Saved Search Owner`, `Administrator`) or the literal `System` for an internal actor |
| Outcome name discipline | Flags technical phrasings (`Handle API Request`, `Process Database Queries`). An Outcome is what the Persona is trying to accomplish in their language |
| Parent linkage | An Outcome requires a `personaId`. A Scenario requires an `outcomeId`. A Step requires a `scenarioId`. An Action requires a `stepId`. Orphan nodes cannot be created |
| Required descriptions | Scenario, Step, and Action nodes must carry a non-empty description |

The guardrails matter because they keep the ontology disciplined at the moment of authorship rather than at validation time. A Product Owner authoring through the WebUI gets the same rules enforced by the platform; an engineer authoring through Claude Code gets them enforced before the call leaves the IDE. The discipline is structural, not aspirational.

## Deployment Architecture

![Three Breeze.AI deployment modes: SaaS (Accion Labs-hosted), Client-hosted dedicated, On-premises (Gen AI in a Box), showing where the platform, the graph, and the inference live for each](/diagrams/breeze-deployment-modes.svg)

| Configuration | Where the platform runs | Where the graph lives | Where inference happens |
|---|---|---|---|
| SaaS (Accion Labs-hosted) | Accion Labs's managed infrastructure | Accion Labs's managed graph storage | Cloud LLM providers (OpenAI, Anthropic, AWS Bedrock) |
| Client-hosted dedicated | Client's cloud account (AWS, Azure, GCP) | Client's cloud account | Cloud LLM providers or client-managed |
| On-premises | Client's on-premises infrastructure | Client's data center | Local models via Gen AI in a Box |

The deployment decision is made during the Advise phase. Factors include data sovereignty requirements, compliance regime, integration with existing client infrastructure, and cost structure.

## Integration Surface

![Breeze.AI integration surface: the platform at the center with 8 integration domains around it (version control, CI/CD, ticket systems, design tools, AI coding assistants, test runners, observability, code repositories)](/diagrams/breeze-integration-surface.svg)

Breeze.AI integrates with the client's existing engineering toolchain. The methodology does not require ripping and replacing what works.

| Integration | What it covers |
|---|---|
| Version control (GitHub, GitLab, Bitbucket) | Per-merge KG sync; PR validation gate; autonomous re-ingestion on every push |
| CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI, Azure DevOps) | Validation agent runs as a CI step |
| Ticket systems (Jira, Linear, Azure DevOps Boards) | Spec linkage, traceability, and autonomous re-ingestion on every ticket transition |
| Documentation systems (Confluence, local documents in PDF and markdown) | Knowledge ingestion into the Functional and Architecture graphs |
| Design tools (Figma, Sketch) | Design Ontology extraction; drift detection between Figma and the running UI |
| AI coding assistants (Claude Code, Cursor, Cline, Windsurf, Copilot) | Impact report attached as context to prompts; MCP tools available where the IDE supports MCP |
| Test runners (Jest, Cypress, Playwright, JUnit) | BDD scenarios generated in formats the runners consume |
| Observability tools | Agent action audit trail forwarded to client's observability stack |

Breeze.AI adds a layer to the existing engineering toolchain. The platform does not replace the IDE, the test runner, the CI/CD pipeline, the ticket system, or the version control system. The integration surface above is how Breeze.AI works with those tools rather than around them. The platform also does not replace the AI coding assistant. Most engagements continue to use Claude Code, Cursor, or Copilot for the actual code generation. Breeze.AI provides the structured context (the impact analysis report) that those tools consume as additional input to their prompts.

### Companion MCP Servers

The Breeze plugin ships only the `breeze-mcp` server. Teams that want to operate adjacent surfaces from the same Claude Code session install other plugins alongside it.

| Companion plugin | What it adds |
|---|---|
| Atlassian | Confluence and Jira CRUD: page creation, ticket triage, spec-to-backlog flow |
| Figma | Design context retrieval and Code Connect mapping |
| Playwright | Browser automation for verifying UI changes against the Design Ontology |

These run independently. Claude can interleave tool calls from `breeze-mcp` and the companion servers in one conversation, which is how end-to-end workflows like "read the Jira ticket, traverse the graph for impact, generate the code, verify in the browser" are composed.

## Operational Maturity

Breeze.AI is in production at multiple client engagements.

| Metric | Current state |
|---|---|
| Largest single-application graph in production | 1.6M+ LOC |
| Typical brownfield extraction time | Two to three weeks for 2M LOC |
| Typical impact analysis query time | Eight minutes for 1.6M LOC graph |
| Code languages parsed | Ten (TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, Perl) |
| MCP tools published | Approximately forty-three, organized across seven graph and management groups |
| Skills in the Claude Code plugin | Eighteen `/breeze:*` slash commands |
| PreToolUse guardrails | Two hooks enforcing project linkage and Functional Ontology rules |
| Agent classes in production | Six core agents plus extensions |
| Named human owners required for a full deployment | Three to five (Chief Architect, Ontology Maintainer, Knowledge Agent Owner, one Forward-Deployed Engineer per workstream) |

## Engagement Lifecycle

Breeze.AI is licensed as part of the Accion Labs engagement.

| Engagement phase | What is licensed |
|---|---|
| Workshop | Platform access for the workshop duration only |
| Phase 1 (SDD Adoption) | Light integration; ticket-system traceability |
| Phase 2 (SE Foundation) | Full platform deployment for the first workstream |
| Phase 3 (SE at Scale) | Full platform deployment across the portfolio |

The engagement frame evolves over the lifecycle. See [Engagement Model Evolution](../sdlc/process/team.md#engagement-model-evolution). Early-stage engagements typically use an effort-based engagement with platform access included. Mature engagements move to a deliverable-based engagement where the platform plus the enablement hours plus the graph-health SLA are framed as an integrated outcome.

---

[ASIMOV](asimov.md) is the peer agentic platform that applies Semantic Engineering principles to legacy modernization. [Engagement Model](_index.md#engagement-model) describes the Advise / Launch / Scale / Optimize phases under which Breeze.AI is deployed.
