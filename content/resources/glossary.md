---
title: "Glossary"
description: "The methodology's terminology with one-paragraph definitions and links into the depth pages."
weight: 10
date: 2026-06-04
lastmod: 2026-06-05
draft: false
audience:
  - all
---

The methodology's terminology. One paragraph per term, with a link to the depth treatment.

## A

**Aperture.** The inclusion criterion that decides what enters the knowledge graph and what stays in local code. The aperture admits elements whose change would cascade beyond their immediate context. Elements whose change is locally contained stay outside the graph. The aperture widens over time as the team builds confidence in the graph. See [Aperture](../semantic-knowledge-graphs/four-layer-ontology.md#aperture).

**Architecture Ontology.** The third of the four ontology layers. Captures services, boundaries, dependencies, data stores, and integration paths. The Architecture Ontology is the minimal governance structure that ensures the architect is keeping service boundaries clean. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

**ASIMOV.** The Accion platform for AI-led legacy modernization. Built on Semantic Engineering principles (peer to Breeze.AI under L3). Three-stage agent pipeline: Ingestion (Code Ingestor and Code Context Enrichment Agent produce the Source Graph) → Transformation (Design Agent and Code Translation Agent generate against the Target Ontology Configurator) → Generation (Code Optimizer and Test Generation Agent produce the Target Source Code, test cases, and traceability artifacts). Three core capabilities: Legacy System Renewal, Scalable Architecture Redesign, AI-Guided Upgrades. Migrates legacy stacks (COBOL, Delphi, VB.NET, older Java, ASP.NET) to modern stacks (Java 21, .NET 8, React 18, Angular 19) while preserving behavioral parity. Fully agentic with humans outside the loop validating the outcome rather than approving each step. See [ASIMOV](../practitioner/asimov.md).

**Audit Trail.** The log of every agent action at every autonomy level, including the input, output, level of authorization, and the human owner. Reviewed by the Engagement Council and used as the basis for promotion decisions in the progressive autonomy framework. See [Progressive Autonomy](../the-agents.md#progressive-autonomy).

## B

**BDD Generation Agent.** The agent that auto-generates executable test scenarios from the Functional Ontology. Removes the manual BDD overhead that defeats most teams' test discipline. Typically achieves 90%+ test coverage with zero manual scenario authoring. See [BDD Generation Agent](../the-agents.md#the-bdd-generation-agent).

**Blast Radius.** The set of other decisions, artifacts, and behaviors that must change if a given decision changes. Used as the test for aperture inclusion: elements with wide blast radius enter the graph; elements with locally contained blast radius stay local. See [Aperture](../semantic-knowledge-graphs/four-layer-ontology.md#aperture).

**Breeze.AI.** The Accion platform that operationalizes Semantic Engineering for SDLC engagements. The four-layer knowledge graph sits at the center; six core agents (Impact Analysis, PR Validation, KG Sync, BDD Generation, Coding, Test Generation) operate on it; the integration surface plugs it into the client's existing toolchain (version control, CI/CD, ticket systems, design tools, AI coding assistants, test runners, observability). Peer to ASIMOV under Accion's L3. Three deployment modes: SaaS (Accion-hosted), Client-hosted dedicated, On-premises via Gen AI in a Box. The platform's name carries the 2017 Breeze framework's heritage: the role-governance discipline preserved, the maintenance burden handled by the agent fleet. See [Breeze.AI](../practitioner/breeze-ai.md).

**Brownfield Extraction.** The process of building the four-layer knowledge graph from an existing code base. AST parsing extracts the Code Ontology; LLM-inferred metadata enriches each node; the Architecture, Functional, and Design ontologies are inferred from the enriched code graph. Typically completes in two to three weeks for a 2M+ LOC application. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

## C

**Chief Architect.** An Enablement Layer role (Accion-supplied) responsible for cross-ontology governance. Owns the bulk of P0 and P1 health metrics. Arbitrates layered structure, connectivity, and centrality findings on behalf of the client's custodians. See [The Enablement Partnership](../process/enablement-partnership.md) and [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

**Code Context Enrichment Agent.** ASIMOV's INGESTION-stage agent that annotates the Source Graph with relationships, dependencies, descriptions, and metrics. Produces the Enriched Graph that downstream stages operate on. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Code Ingestor.** ASIMOV's INGESTION-stage agent that parses the legacy code base and supporting artifacts and produces the Source Graph. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Code Ontology.** The fourth of the four ontology layers. Captures modules, classes, functions, endpoints, and database schemas at fine granularity. The Code Ontology is the minimal governance structure that ensures the engineer is generating code that fits. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

**Code Optimizer.** ASIMOV's GENERATION-stage agent that finalizes the modern code produced by the Code Translation Agent. Produces the Target Source Code. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Code Translation Agent.** ASIMOV's TRANSFORMATION-stage agent that generates the modern code anchored to the Target Graph and the Target Ontology Configurator. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Coding Agent.** A Breeze.AI agent that generates code under the structural plan of the Impact Analysis Agent's impact report. The developer reviews and refines the output at Zone 3; at Zone 4 the agent runs autonomously and the developer reviews the audit trail. See [The Per-Change SDLC Flow](../process/implementation-sprint.md#the-per-change-sdlc-flow).

**Context Collapse.** The phenomenon of AI generating confident outputs disconnected from domain reality because it lacks the structured context to distinguish correct from plausible. Semantic Engineering's central claim is that structured context prevents context collapse. See [Philosophy](../semantic-knowledge-graphs/_index.md#why-knowledge-graphs-are-viable-now).

**Cross-Product Impact Extension.** An extension of the Impact Analysis Agent that traverses multiple product knowledge graphs when a change crosses product boundaries. Uses integration points (APIs, events, shared databases) as bridges between the partitioned graphs. See [Partition by Product](../semantic-knowledge-graphs/four-layer-ontology.md#partition-by-product).

**Custodianship.** The discipline by which the client's four custodians (Product Owner, Architect, UX Designer, Engineering Team) own and maintain the four ontologies of the knowledge graph. Each custodian owns one ontology layer and keeps it current. The graph belongs to the client; the four custodians are its principals. See [The Four Custodians and Their Ontologies](../semantic-knowledge-graphs/_index.md#the-four-custodians-and-their-ontologies).

## D

**Design Agent.** ASIMOV's TRANSFORMATION-stage agent that re-architects the system against the Target Ontology Configurator (monolith → microservices, tightly coupled → modular). Hands off the design to the Code Translation Agent. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Design Ontology.** The second of the four ontology layers. Captures components, molecules, atoms, templates, and flows. The Design Ontology is the minimal governance structure that ensures the designer is reusing the design system properly. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

## E

**Enablement Layer.** The bottom layer of the layered team structure. Accion-supplied. Four roles: Chief Architect, Ontology Maintainer, Semantic Engineers, and Knowledge Agent Owner. Supports the client's custodianship layer with cross-ontology governance, ontology stewardship, agent-fleet operations, and brownfield extraction. Sits beneath the custodians, who own the asset. See [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

**Enablement Partnership.** The discipline by which Accion supports the client's custodians across years. Operationalized through five engagement principles (Care, Loyalty, Prudence, Independence, Transparency) and three tiers of managed support (Light, Medium, Deep). Accion provides customization, setup, and managed support; the client's custodians own the asset. See [The Enablement Partnership](../process/enablement-partnership.md).

**Engagement Council.** The body that adjudicates conflicts when Accion enables the same methodology for competing clients. Operates independently of commercial account teams. See [The Enablement Partnership](../process/enablement-partnership.md#the-engagement-council).

**Engagement Model Evolution.** The two-phase evolution of how Accion's engagements are framed. Phase 1: effort-based engagement (familiar to procurement, maps to existing professional services patterns). Phase 2: deliverable-based engagement (the client commits to outcomes — validated four-layer graph, agent fleet, graph-health SLA — rather than to effort). The same engagement model supports both. See [Engagement Model Evolution](../process/team.md#engagement-model-evolution).

**Engineering Team (as custodian).** The fourth ontology custodian, owning the Code Ontology. At Zone 4 (Agentic SE at Scale), the Engineering Team's custodianship expands to include the agent fleet: approving Promotion Agreements, setting autonomy levels, reviewing the audit trail, and refining agent prompts. Bottom custodial layer in the Zone 4 diagram. See [Engineering Team's Custodianship of the Agent Fleet](../process/enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution).

**Extraction as Rationalization.** The principle that the brownfield extraction process is not just representation. The extraction surfaces duplicate capabilities, split functionality, dead capabilities, and misclassified architecture as a side effect of building the graph. The extraction output is a refactor roadmap, not just a snapshot. See [Extraction as Rationalization](../semantic-knowledge-graphs/four-layer-ontology.md#extraction-as-rationalization).

## F

**Forward-Deployed Engineer (FDE).** The role that backfills missing coverage in the client's custodianship layer (the top layer of the layered team structure). Part architect, part product owner, part designer. Plays one or more ontology custodian roles in the spec sprint when the client cannot supply all four custodian roles fluently. The substitute pattern (two or three people each contributing their strongest area) is normal when one person cannot cover all three. See [Forward-Deployed Engineers](../process/team.md#forward-deployed-engineers).

**Fractional Allocation.** The operating model for specialist roles. Specialists are engaged at the moments their judgment creates value, sized to the deliverable rather than to a calendar quarter. The materialized view of the graph keeps re-entry cost low, so the same specialist can cover multiple workstreams at full depth of judgment. See [Fractional Allocation](../process/team.md#fractional-allocation).

**Functional Ontology.** The first of the four ontology layers. Captures personas, outcomes, scenarios, steps, and actions. The Functional Ontology is the minimal governance structure that ensures the product owner is defining requirements properly. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

## G

**Gen AI in a Box.** The Accion deployment pattern for on-premises AI inference. Used by clients in highly regulated industries where AI inference must remain inside the client's infrastructure. Typically achieves 81% lower five-year TCO than cloud-only patterns at enterprise scale.

## I

**Impact Analysis Agent.** The agent that traverses the four-layer knowledge graph to produce an impact report for a proposed change. The cognitive shortcut that puts a senior engineer's context-assembly work into the system. See [Impact Analysis Agent](../the-agents.md#the-impact-analysis-agent).

**Impact Report.** The structured markdown output of the Impact Analysis Agent. Identifies which functional outcomes, design components, architectural services, code modules, and database tables a proposed change touches. Typically a fifteen-section document for a meaningful change. See [Impact Analysis Agent](../the-agents.md#the-impact-analysis-agent).

## K

**KG Sync Agent.** The agent that updates the knowledge graph on every PR merge. The drift-prevention mechanism that distinguishes a living asset from a stale documentation artifact. See [KG Sync Agent](../the-agents.md#the-kg-sync-agent).

**Knowledge Agent Owner.** An Enablement Layer role (Accion-supplied) responsible for ongoing operations of the agent fleet against the knowledge graph: monthly KG refresh audit; tracking ontology age and freshness; triggering refresh sprints when freshness thresholds are breached. See [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

**Knowledge Custodianship.** See Custodianship.

## L

**Layered Team Structure.** The layered model that replaces distributed scrum. Custodianship at the top (the four ontology custodians, namely PO, Architect, UX Designer, and Engineering Team, typically client-supplied, with Forward-Deployed Engineers backfilling missing coverage); Implementation Teams in the middle consuming the impact-analyzed specs; the Enablement Layer at the bottom (Accion-supplied: Chief Architect, Ontology Maintainer, Knowledge Agent Owner, Semantic Engineers) supporting the custodians under a chosen tier of managed support. At Zone 4 the Engineering Team gains a second custodial role as custodian of the agent fleet. Each layer has its own cadence and its own work. See [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

## M

**Manual Translation Tax.** The structural cost the team pays every day converting unstructured knowledge into action during software delivery. Three components: ambiguity (text admits multiple interpretations), non-persistence (knowledge resets at handoffs), non-traceability (no structural link from intent through design and architecture to code). A fourth manifestation surfaces in the distributed tacit knowledge of the codebase that no single developer holds. The term primarily describes the friction in human-to-human and human-to-agent knowledge transfer; AI agents pay it too. The term is an Accion Labs trademark in the context of software delivery methodology; see [Copyright and Trademark](../about/_index.md#copyright-and-trademark). For the depth treatment, see [The Manual Translation Tax](../manual-translation-tax.md).

**Materialized View (of the graph).** Each custodian's structured access to their layer of the knowledge graph. The materialized view replaces the manual recovery cost of reading old docs, re-reading code, or asking colleagues what changed. It is what makes fractional allocation work: re-entry into a workstream goes from costly context recovery to opening a structured view of current state. See [Fractional Allocation](../process/team.md#fractional-allocation).

**Minimal Governance Structure.** The framing of the four-layer ontology. The ontologies are not full specifications. They are the minimal structure that ensures the corresponding role does their work properly. See [The Four-Layer Ontology](../semantic-knowledge-graphs/four-layer-ontology.md#the-four-layer-ontology).

## O

**Ontology Maintainer.** An Enablement Layer role (Accion-supplied) responsible for per-ontology stewardship support. Investigates anomalies flagged by the verification checks. Advises on structural changes to a specific ontology layer; the ontology custodian (PO, Architect, UX Designer, or Engineering Team) holds the final say. See [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

## P

**Partition by Product.** The methodology's choice to build one knowledge graph per product or application rather than per repository (too granular) or monolithically (too slow). The 8-minute query time for a 1.6M LOC graph is the engineering rationale. Cross-product reasoning happens through the Cross-Product Impact Extension. See [Partition by Product](../semantic-knowledge-graphs/four-layer-ontology.md#partition-by-product).

**Portfolio Rationalization Agent.** The agent that runs quarterly across all product graphs to detect cross-product duplication and dead capabilities. Output feeds the rationalization backlog. See [Agent Fleet](../the-agents.md#agent-fleet-topology).

**PR Validation Agent.** The merge-time gate that validates every change against all four ontologies. Refuses merges that violate cross-team contracts, design system patterns, or architectural boundaries. See [PR Validation Agent](../the-agents.md#the-pr-validation-agent).

**Progressive Autonomy.** The discipline that controls what each agent in the fleet is authorized to do. Five autonomy levels. Agents earn higher autonomy through demonstrated evidence over time, not through a leap of faith. See [Progressive Autonomy](../the-agents.md#progressive-autonomy).

**Promotion Agreement.** The artifact that documents an agent's promotion from one autonomy level to the next. Includes evidence, threshold, approver, rollback criteria, and audit cadence. See [Progressive Autonomy](../the-agents.md#progressive-autonomy).

## S

**Scalable Architecture Redesign.** One of ASIMOV's three core capabilities. Structured path to a modern modular design. Transitions legacy applications from monolith to microservices or from tightly coupled to modular. See [Three Core Capabilities](../practitioner/asimov.md#three-core-capabilities).

**Semantic Engineer.** An Enablement Layer specialist responsible for initial brownfield extraction and ongoing knowledge-graph enrichment. Designs and integrates ontologies with downstream agents. Engaged at trigger points across multiple workstreams from a shared pool. See [Layered Team Structure](../process/team.md#layered-team-structure-in-depth).

**Source Graph.** ASIMOV's structured representation of the legacy system, produced by the Code Ingestor during INGESTION. Captures the legacy system's behavior, code structure, dependencies, and metrics. The behavior contract that the modern system must preserve. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Spec Sprint.** A separate sprint cycle that runs ahead of the implementation sprint. The output is two artifacts per change request: a well-formed specification and any knowledge graph updates the change requires. Owned by the Product Owner with participation from the four ontology custodians (PO, Architect, UX Designer, Engineering Team). The spec sprint has its own backlog (Posthog or equivalent), separate from the implementation sprint backlog (Jira or equivalent), and the two can live in the same tool. Specs flagged as missing context by the Impact Analysis Agent are pushed back to the spec sprint backlog. See [Spec Sprints](../process/spec-sprint.md) and the combined-sprint diagram in [Zones of AI-Assisted SDLC](../process/_index.md#how-the-sprints-coordinate).

**Spec-Driven Development (SDD).** The discipline of authoring a written specification for every change of meaningful size. The discipline Semantic Engineering extends rather than replaces. See [From Manual to SDD](../zones-of-ai-assisted-sdlc/zone-1-manual-vibe-coding.md#from-manual-to-sdd).

## T

**Target Graph.** ASIMOV's structured representation of the modern system, produced by the Design Agent and Code Translation Agent during TRANSFORMATION. Behaviorally equivalent to the Source Graph; structurally aligned to the Target Ontology Configurator. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Target Ontology Configurator.** ASIMOV's structured constraint on the target system: target architecture, coding guidelines, security standards, and compliance requirements. The Design Agent and Code Translation Agent generate against the Configurator, which is why ASIMOV's output cannot drift from the intended architectural and compliance shape. See [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Test Generation Agent.** In Breeze.AI, the agent that generates the test suite from the Functional Ontology. In ASIMOV, the GENERATION-stage agent that produces the test suite from the Source Graph's Functional Ontology to verify behavioral parity with the legacy system. See [BDD Generation Agent](../the-agents.md#the-bdd-generation-agent) and [ASIMOV Architecture](../practitioner/asimov.md#the-asimov-architecture).

**Three Core Capabilities (ASIMOV).** Legacy System Renewal (end-to-end transformation, e.g. COBOL→Java, Delphi→C#); Scalable Architecture Redesign (monolith→microservices, tightly coupled→modular); AI-Guided Upgrades (version upgrades within a technology family, e.g. Java 8→Java 21, Angular 0→Angular 16). All three run through the same Ingestion → Transformation → Generation pipeline; the Target Ontology Configurator and per-language adapters differ. See [Three Core Capabilities](../practitioner/asimov.md#three-core-capabilities).

**Three Sources of Truth.** The clean separation of intent (specification), progress (ticket system), and state (knowledge graph). The misuse of any one to carry the load of the others is what produces drift. See [Three Sources of Truth](../semantic-knowledge-graphs/_index.md#three-sources-of-truth).

**Translation Tax.** See Manual Translation Tax above. The methodology uses "Manual Translation Tax" as the primary, trademarked term for this phenomenon.

## V

**Verification Suite.** The 14 verification checks that gate every merge to master and the 29 metrics that run on per-release and quarterly cadences. The framework that keeps the knowledge graph structurally sound. See [Governance and Metrics](../semantic-knowledge-graphs/four-layer-ontology.md#governance-and-metrics).

---

Explore the methodology in depth via [Semantic Knowledge Graphs](../semantic-knowledge-graphs/_index.md), [The Agents](../the-agents.md), [Process](../process/_index.md), or the platforms ([Breeze.AI](../practitioner/breeze-ai.md), [ASIMOV](../practitioner/asimov.md)).
