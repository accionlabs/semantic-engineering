---
title: "Glossary"
description: "The methodology's terminology with one-paragraph definitions and links into the depth pages."
weight: 80
date: 2026-06-04
lastmod: 2026-06-12
draft: false
section: true
audience:
  - all
---

The Semantic Engineering glossary. Each term has a one-paragraph definition and links into the depth page where the concept is treated fully. The terms are organized alphabetically; the alphabet jumps below take you to each letter's section.

**Jump to:** [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [I](#i) · [K](#k) · [L](#l) · [M](#m) · [O](#o) · [P](#p) · [S](#s) · [T](#t) · [V](#v)

The methodology's terminology. One paragraph per term, with a link to the depth treatment.

## A

**AGIE (ASIMOV Graph Ingestion and Enrichment).** The first ASIMOV pillar. Decomposes legacy code into the Code Graph (Code Ingestion Agent), enriches it with dependencies, relationships, descriptions, and metrics (Code Enrichment Agent), and decomposes the Target Blueprint into the Target Graph (Target Blueprint Ingestion Agent). See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**AMM (ASIMOV Migration Machine).** The third ASIMOV pillar. Agentic migration of source code into the target stack, scoped by the annotated ASF and the selected module. Operates in a feedback loop with AVF: each candidate target code output is validated by the four gates, and findings drive re-generation until the gates pass. See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**Aperture.** The inclusion criterion that decides what enters the knowledge graph and what stays in local code. The aperture admits elements whose change would cascade beyond their immediate context. Elements whose change is locally contained stay outside the graph. The aperture widens over time as the team builds confidence in the graph. See [Aperture](../sdlc/methodology.md#aperture).

**Architecture Ontology.** The third of the four ontology layers. Captures services, boundaries, dependencies, data stores, and integration paths. The Architecture Ontology is the minimal governance structure that ensures the architect is keeping service boundaries clean. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

**Architecture Validation Agent (ASIMOV).** The agent behind ASIMOV's Architecture Gate inside AVF. Infers source architecture from the Source Graph; enforces target architecture alignment against the Target Blueprint; flags structural drift. One of four named validation agents in AVF. See [Quality Gates](../practitioner/asimov.md#quality-gates-enforced-by-intelligent-agents).

**ASF (ASIMOV Specification Format).** A specification-as-code intermediate produced by the Extraction Agent from the Source Graph and Target Graph. Can be extracted to a human-readable format. The point at which the Product Owner and Architect annotate which modules to retain, modify, replace, or retire, and where the team selects the scope of migration at module granularity. See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**ASIMOV.** The Accion Labs agentic platform for legacy modernization. Built on Semantic Engineering principles (peer to Breeze.AI under L3). Five-pillar architecture across the legacy modernization lifecycle: **AGIE** (Discover: Code Ingestion Agent, Code Enrichment Agent, Target Blueprint Ingestion Agent produce Source Graph and Target Graph) → **ASF** (Document: Extraction Agent generates spec-as-code in multiple human-readable formats (BRD, Gherkin and Playwright tests, code chatbot); SME annotates which modules to retain, modify, replace, or retire) → **AMM** (Migrate: agentic migration of source code into the target stack, iterating in a feedback loop with AVF) → **AVF** (Validate: four named gates: Architecture, Design, Standards, Functional) → **Maintain** (Maintain the modernized code; transfer the knowledge graph to ongoing SDLC governance under Breeze.AI). Three core capabilities: Legacy System Renewal, Scalable Architecture Redesign, AI-Guided Upgrades. Five engagement modes: Documentation Only, Discovery + Documentation, Migration Readiness, Full Modernization, Maintain, Operate, and Convergence. Track record: 15M+ LOC modernized across 10+ programs over 3+ years in Insurance and Finance, Healthcare and Life Sciences, Inventory and Logistics. Migrates legacy stacks (COBOL, Delphi, VB.NET, older Java, ASP.Net) to modern stacks (.NET 8/10, Java 21, React 19, Spring MVC, Angular 19) while preserving behavioral parity. Humans validate at SME annotation and Expert Review; everything between is agentic. See [ASIMOV](../practitioner/asimov.md).

**Audit Trail.** The log of every agent action at every autonomy level, including the input, output, level of authorization, and the human owner. Reviewed by the Engagement Council and used as the basis for promotion decisions in the progressive autonomy framework. See [Progressive Autonomy](../sdlc/agents.md#progressive-autonomy).

**AVF (ASIMOV Validation Framework).** The fourth ASIMOV pillar. Runs four named quality gates against every migration candidate: Architecture Gate, Design Gate, Standards Gate, Functional Gate. Each gate has its own agent. Each gate produces machine-verifiable evidence and feeds back into AMM. See [Quality Gates](../practitioner/asimov.md#quality-gates-enforced-by-intelligent-agents).

## B

**BDD Generation Agent.** The agent that auto-generates executable test scenarios from the Functional Ontology. Removes the manual BDD overhead that defeats most teams' test discipline. Typically achieves 90%+ test coverage with zero manual scenario authoring. See [BDD Generation Agent](../sdlc/agents.md#the-bdd-generation-agent).

**Blast Radius.** The set of other decisions, artifacts, and behaviors that must change if a given decision changes. Used as the test for aperture inclusion: elements with wide blast radius enter the graph; elements with locally contained blast radius stay local. See [Aperture](../sdlc/methodology.md#aperture).

**Breeze.AI.** The Accion Labs platform that operationalizes Semantic Engineering for SDLC engagements. The four-layer knowledge graph sits at the center; six core agents (Impact Analysis, PR Validation, KG Sync, BDD Generation, Coding, Test Generation) operate on it; the integration surface plugs it into the client's existing toolchain (version control, CI/CD, ticket systems, design tools, AI coding assistants, test runners, observability). Peer to ASIMOV under Accion Labs's L3. Three deployment modes: SaaS (Accion Labs-hosted), Client-hosted dedicated, On-premises via Gen AI in a Box. The platform's name carries the 2017 Breeze framework's heritage: the role-governance discipline preserved, the maintenance burden handled by the agent fleet. See [Breeze.AI](../practitioner/breeze-ai.md).

**Brownfield Extraction.** The process of building the four-layer knowledge graph from an existing code base. AST parsing extracts the Code Ontology; LLM-inferred metadata enriches each node; the Architecture, Functional, and Design ontologies are inferred from the enriched code graph. Typically completes in two to three weeks for a 2M+ LOC application. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

## C

**Chief Architect.** An Enablement Layer role (Accion Labs-supplied) responsible for cross-ontology governance. Owns the bulk of P0 and P1 health metrics. Arbitrates layered structure, connectivity, and centrality findings on behalf of the client's custodians. See [The Enablement Partnership](../sdlc/process/enablement-partnership.md) and [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

**Code Enrichment Agent.** ASIMOV's AGIE-pillar agent that annotates the Source Graph with relationships, dependencies, descriptions, and metrics. Produces the Enriched Source Graph that downstream pillars operate on. See [ASIMOV Solution Architecture](../practitioner/asimov.md#the-solution-architecture-end-to-end).

**Code Ingestion Agent.** ASIMOV's AGIE-pillar agent that parses the legacy code base and supporting artifacts and produces the Source Graph. See [ASIMOV Solution Architecture](../practitioner/asimov.md#the-solution-architecture-end-to-end).

**Code Ontology.** The fourth of the four ontology layers. Captures modules, classes, functions, endpoints, and database schemas at fine granularity. The Code Ontology is the minimal governance structure that ensures the engineer is generating code that fits. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

**Compliance Agent (ASIMOV).** The agent behind ASIMOV's Standards Gate inside AVF. Applies enterprise-level security rules and policies; detects deviation of generated output from defined security rules; enforces coding standards. One of four named validation agents in AVF. See [Quality Gates](../practitioner/asimov.md#quality-gates-enforced-by-intelligent-agents).

**Coding Agent.** The external AI coding assistant (Copilot, Cursor, Claude Code, or equivalent) that Breeze.AI integrates with to generate code under the structural plan of the Impact Analysis Agent's impact report. The Coding Agent itself is not part of the SDLC methodology fleet; the methodology's contribution is the structured context the agent operates against and the gates that validate its output. The developer reviews and refines at Zone 3; at Zone 4 the integration runs autonomously and the developer reviews the audit trail. See [The Per-Change SDLC Flow](../sdlc/process/implementation-sprint.md#the-per-change-sdlc-flow).

**Context Collapse.** The phenomenon of AI generating confident outputs disconnected from domain reality because it lacks the structured context to distinguish correct from plausible. Semantic Engineering's central claim is that structured context prevents context collapse. See [The Manual Translation Tax](../sdlc/translation-tax.md).

**Cross-Product Impact Extension.** An extension of the Impact Analysis Agent that traverses multiple product knowledge graphs when a change crosses product boundaries. Uses integration points (APIs, events, shared databases) as bridges between the partitioned graphs. See [Partition by Product](../sdlc/methodology.md#partition-by-product).

**Custodianship.** The discipline by which the client's four custodians (Product Owner, Architect, UX Designer, Engineering Team) own and maintain the four ontologies of the knowledge graph. Each custodian owns one ontology layer and keeps it current. The graph belongs to the client; the four custodians are its principals. See [What the Custodians Know That the Code Does Not Show](../sdlc/translation-tax.md#what-the-custodians-know-that-the-code-does-not-show).

## D

**Design Validation Agent.** The agent behind ASIMOV's Design Gate inside AVF. Applies approved design systems and UI guidelines; ensures generated interfaces conform to design standards. One of four named validation agents in AVF. See [Quality Gates](../practitioner/asimov.md#quality-gates-enforced-by-intelligent-agents).

**Design Ontology.** The second of the four ontology layers. Captures components, molecules, atoms, templates, and flows. The Design Ontology is the minimal governance structure that ensures the designer is reusing the design system properly. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

## E

**Enablement Layer.** The bottom layer of the layered team structure. Accion Labs-supplied. Four roles: Chief Architect, Ontology Maintainer, Semantic Engineers, and Knowledge Agent Owner. Supports the client's custodianship layer with cross-ontology governance, ontology stewardship, agent-fleet operations, and brownfield extraction. Sits beneath the custodians, who own the asset. See [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

**Enablement Partnership.** The discipline by which Accion Labs supports the client's custodians across years. Operationalized through five engagement principles (Care, Loyalty, Prudence, Independence, Transparency) and three tiers of managed support (Light, Medium, Deep). Accion Labs provides customization, setup, and managed support; the client's custodians own the asset. See [The Enablement Partnership](../sdlc/process/enablement-partnership.md).

**Engagement Council.** The body that adjudicates conflicts when Accion Labs enables the same methodology for competing clients. Operates independently of commercial account teams. See [The Enablement Partnership](../sdlc/process/enablement-partnership.md#the-engagement-council).

**Engagement Model Evolution.** The two-phase evolution of how Accion Labs's engagements are framed. Phase 1: effort-based engagement (familiar to procurement, maps to existing professional services patterns). Phase 2: deliverable-based engagement (the client commits to outcomes (validated four-layer graph, agent fleet, graph-health SLA) rather than to effort). The same engagement model supports both. See [Engagement Model Evolution](../sdlc/process/team.md#engagement-model-evolution).

**Engineering Team (as custodian).** The fourth ontology custodian, owning the Code Ontology. At Zone 4 (Agentic SE at Scale), the Engineering Team's custodianship expands to include the agent fleet: approving Promotion Agreements, setting autonomy levels, reviewing the audit trail, and refining agent prompts. Bottom custodial layer in the Zone 4 diagram. See [Engineering Team's Custodianship of the Agent Fleet](../sdlc/process/enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution).

**Extraction as Rationalization.** The principle that the brownfield extraction process is not just representation. The extraction surfaces duplicate capabilities, split functionality, dead capabilities, and misclassified architecture as a side effect of building the graph. The extraction output is a refactor roadmap, not just a snapshot. See [Extraction as Rationalization](../sdlc/methodology.md#extraction-as-rationalization).

## F

**Five Engagement Modes (ASIMOV).** The five entry modes for engaging ASIMOV. Documentation Only (functional and technical docs, test scenarios, traceability from the legacy code; no migration). Discovery + Documentation (application inventory, dependency maps, business rules, process flows, SME review packs, plus documentation). Migration Readiness (migration scope, as-is versus delta classification, target mapping, sequencing, risk and complexity, requirements traceability matrix). Full Modernization (the end-to-end pipeline AGIE → ASF → AMM → AVF → Maintain). Maintain, Operate, and Convergence (operational knowledge base, lifecycle documentation, change-impact support, overlap analysis, consolidation opportunities, convergence blueprint). Distinct from Breeze.AI's Advise / Launch / Scale / Optimize phase model. See [The ASIMOV Engagement Model](../practitioner/asimov.md#the-asimov-engagement-model).

**Forward-Deployed Engineer (FDE).** The role that backfills missing coverage in the client's custodianship layer (the top layer of the layered team structure). Spans all four custodian roles (product owner, architect, UX designer, engineering team) in proportions calibrated to the product or application. A UI-heavy product needs an FDE heavier on design; a data platform needs one heavier on architecture and engineering. Plays one or more ontology custodian roles in the spec sprint when the client cannot supply all four fluently. The substitute pattern (two or three people each contributing their strongest area) is normal when one person cannot cover the full span. See [Forward-Deployed Engineers](../sdlc/process/team.md#forward-deployed-engineers).

**Fractional Allocation.** The operating model for specialist roles. Specialists are engaged at the moments their judgment creates value, sized to the deliverable rather than to a calendar quarter. The materialized view of the graph keeps re-entry cost low, so the same specialist can cover multiple workstreams at full depth of judgment. See [Fractional Allocation](../sdlc/process/team.md#fractional-allocation).

**Functional Ontology.** The first of the four ontology layers. Captures personas, outcomes, scenarios, steps, and actions. The Functional Ontology is the minimal governance structure that ensures the product owner is defining requirements properly. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

**Functional Validation Agent (ASIMOV).** The agent behind ASIMOV's Functional Gate inside AVF. Validates business logic equivalence between the legacy behavior and the migrated output; detects deviation of business rules in the migrated code. One of four named validation agents in AVF. See [Quality Gates](../practitioner/asimov.md#quality-gates-enforced-by-intelligent-agents).

## G

**Gen AI in a Box.** The Accion Labs deployment pattern for on-premises AI inference. Used by clients in highly regulated industries where AI inference must remain inside the client's infrastructure. Typically achieves 81% lower five-year TCO than cloud-only patterns at enterprise scale.

## I

**Impact Analysis Agent.** The agent that traverses the four-layer knowledge graph to produce an impact report for a proposed change. The cognitive shortcut that puts a senior engineer's context-assembly work into the system. See [Impact Analysis Agent](../sdlc/agents.md#the-impact-analysis-agent).

**Impact Report.** The structured markdown output of the Impact Analysis Agent. Identifies which functional outcomes, design components, architectural services, code modules, and database tables a proposed change touches. Typically a fifteen-section document for a meaningful change. See [Impact Analysis Agent](../sdlc/agents.md#the-impact-analysis-agent).

## K

**KG Sync Agent.** The agent that updates the knowledge graph on every PR merge. The drift-prevention mechanism that distinguishes a living asset from a stale documentation artifact. See [KG Sync Agent](../sdlc/agents.md#the-kg-sync-agent).

**Knowledge Agent Owner.** An Enablement Layer role (Accion Labs-supplied) responsible for ongoing operations of the agent fleet against the knowledge graph: monthly KG refresh audit; tracking ontology age and freshness; triggering refresh sprints when freshness thresholds are breached. See [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

**Knowledge Custodianship.** See Custodianship.

## L

**Layered Team Structure.** The layered model that replaces distributed scrum. Custodianship at the top (the four ontology custodians, namely PO, Architect, UX Designer, and Engineering Team, typically client-supplied, with Forward-Deployed Engineers backfilling missing coverage); Implementation Teams in the middle consuming the impact-analyzed specs; the Enablement Layer at the bottom (Accion Labs-supplied: Chief Architect, Ontology Maintainer, Knowledge Agent Owner, Semantic Engineers) supporting the custodians under a chosen tier of managed support. At Zone 4 the Engineering Team gains a second custodial role as custodian of the agent fleet. Each layer has its own cadence and its own work. See [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

## M

**Maintain (ASIMOV).** The fifth ASIMOV pillar. Maintains the modernized code after deployment; the knowledge graph that AGIE produced continues to accelerate development on the modern stack. Hand-over to the client at a pace and time agreed in the engagement. This is the connection point to ongoing SDLC governance under Breeze.AI. See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**Manual Translation Tax.** The structural cost the team pays every day converting unstructured knowledge into action during software delivery. Three components: ambiguity (text admits multiple interpretations), non-persistence (knowledge resets at handoffs), non-traceability (no structural link from intent through design and architecture to code). A fourth manifestation surfaces in the distributed tacit knowledge of the codebase that no single developer holds. The term primarily describes the friction in human-to-human and human-to-agent knowledge transfer; AI agents pay it too. The term is an Accion Labs trademark in the context of software delivery methodology; see [Copyright and Trademark](../about/_index.md#copyright-and-trademark). For the depth treatment, see [The Manual Translation Tax](../sdlc/translation-tax.md).

**Materialized View (of the graph).** Each custodian's structured access to their layer of the knowledge graph. The materialized view replaces the manual recovery cost of reading old docs, re-reading code, or asking colleagues what changed. It is what makes fractional allocation work: re-entry into a workstream goes from costly context recovery to opening a structured view of current state. See [Fractional Allocation](../sdlc/process/team.md#fractional-allocation).

**Minimal Governance Structure.** The framing of the four-layer ontology. The ontologies are not full specifications. They are the minimal structure that ensures the corresponding role does their work properly. See [The Four-Layer Ontology](../sdlc/methodology.md#the-four-layer-ontology).

## O

**Ontology Maintainer.** An Enablement Layer role (Accion Labs-supplied) responsible for per-ontology stewardship support. Investigates anomalies flagged by the verification checks. Advises on structural changes to a specific ontology layer; the ontology custodian (PO, Architect, UX Designer, or Engineering Team) holds the final say. See [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

## P

**Partition by Product.** The methodology's choice to build one knowledge graph per product or application rather than per repository (too granular) or monolithically (too slow). The 8-minute query time for a 1.6M LOC graph is the engineering rationale. Cross-product reasoning happens through the Cross-Product Impact Extension. See [Partition by Product](../sdlc/methodology.md#partition-by-product).

**Portfolio Rationalization Agent.** The agent that runs quarterly across all product graphs to detect cross-product duplication and dead capabilities. Output feeds the rationalization backlog. See [Agent Fleet](../sdlc/agents.md#agent-fleet-topology).

**PR Validation Agent.** The merge-time gate that validates every change against all four ontologies. Refuses merges that violate cross-team contracts, design system patterns, or architectural boundaries. See [PR Validation Agent](../sdlc/agents.md#the-pr-validation-agent).

**Progressive Autonomy.** The discipline that controls what each agent in the fleet is authorized to do. Five autonomy levels. Agents earn higher autonomy through demonstrated evidence over time, not through a leap of faith. See [Progressive Autonomy](../sdlc/agents.md#progressive-autonomy).

**Promotion Agreement.** The artifact that documents an agent's promotion from one autonomy level to the next. Includes evidence, threshold, approver, rollback criteria, and audit cadence. See [Progressive Autonomy](../sdlc/agents.md#progressive-autonomy).

## S

**Scalable Architecture Redesign.** One of ASIMOV's three core capabilities. Structured path to a modern modular design. Transitions legacy applications from monolith to microservices or from tightly coupled to modular. See [Three Core Capabilities](../practitioner/asimov.md#three-core-capabilities).

**Semantic Engineer.** An Enablement Layer specialist responsible for initial brownfield extraction and ongoing knowledge-graph enrichment. Designs and integrates ontologies with downstream agents. Engaged at trigger points across multiple workstreams from a shared pool. See [Layered Team Structure](../sdlc/process/team.md#layered-team-structure-in-depth).

**Source Graph.** ASIMOV's structured representation of the legacy system, produced by the Code Ingestion Agent and the Code Enrichment Agent inside the AGIE pillar. Captures the legacy system's behavior, code structure, dependencies, and metrics. The behavior contract that the modern system must preserve. See [The Solution Architecture End to End](../practitioner/asimov.md#the-solution-architecture-end-to-end).

**Spec Sprint.** A separate sprint cycle that runs ahead of the implementation sprint. The output is two artifacts per change request: a well-formed specification and any knowledge graph updates the change requires. Owned by the Product Owner with participation from the four ontology custodians (PO, Architect, UX Designer, Engineering Team). The spec sprint has its own backlog (Linear or equivalent), separate from the implementation sprint backlog (Jira or equivalent), and the two can live in the same tool. Specs flagged as missing context by the Impact Analysis Agent are pushed back to the spec sprint backlog. See [Spec Sprints](../sdlc/process/spec-sprint.md) and the combined-sprint diagram in [Zones of AI-Assisted SDLC](../sdlc/process/_index.md#how-the-sprints-coordinate).

**Spec-Driven Development (SDD).** The discipline of authoring a written specification for every change of meaningful size. The discipline Semantic Engineering extends rather than replaces. See [From Manual to SDD](../sdlc/zones/zone-1-manual-vibe-coding.md#from-manual-to-sdd).

## T

**Target Blueprint.** The input to ASIMOV that encodes the target architecture, coding guidelines, security standards, and compliance requirements. The Target Blueprint Ingestion Agent (in the AGIE pillar) decomposes the Blueprint into the Target Graph. AMM generates against the Blueprint; AVF's gates validate conformance to it. The Blueprint replaces the V2-era "Target Ontology Configurator" in current ASIMOV terminology. See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**Target Graph.** ASIMOV's structured representation of the modern system. Behaviorally equivalent to the Source Graph; structurally aligned to the Target Blueprint. Produced by the AGIE pillar from the Target Blueprint and consumed by AMM during agentic migration. See [The Five Pillars of ASIMOV](../practitioner/asimov.md#the-five-pillars-of-asimov).

**Test Generation Agent.** The same agent as the BDD Generation Agent in the SDLC fleet, named Test Generation Agent in some platform contexts. Generates the test suite from the Functional Ontology in Breeze.AI; produces unit and end-to-end tests against the Source Graph's Functional Ontology in ASIMOV (Automated Unit Test Coverage and End-to-End Functional Testing using BDT). See [BDD Generation Agent](../sdlc/agents.md#the-bdd-generation-agent) and [The Agentic Validation Approach](../practitioner/asimov.md#the-agentic-validation-approach).

**Three Core Capabilities (ASIMOV).** Legacy System Renewal (end-to-end transformation, e.g. COBOL to .NET 8, Delphi to C#/.NET 8); Scalable Architecture Redesign (monolith to microservices, tightly coupled to modular); AI-Guided Upgrades (version upgrades within a technology family, e.g. Java 8 to Java 21, Struts to Spring MVC). All three run through the same five-pillar architecture (AGIE, ASF, AMM, AVF, Maintain); the Target Blueprint and per-language adapters in AMM differ across the three. See [Three Core Capabilities](../practitioner/asimov.md#three-core-capabilities).

**Three Sources of Truth.** The clean separation of intent (specification), progress (ticket system), and state (knowledge graph). The misuse of any one to carry the load of the others is what produces drift. See [Three Sources of Truth](../sdlc/process/_index.md#three-sources-of-truth).

**Translation Tax.** See Manual Translation Tax above. The methodology uses "Manual Translation Tax" as the primary, trademarked term for this phenomenon.

## V

**Verification Suite.** The 14 verification checks that gate every merge to master and the 29 metrics that run on per-release and quarterly cadences. The framework that keeps the knowledge graph structurally sound. See [Governance and Metrics](../sdlc/methodology.md#governance-and-metrics).

---

Explore the methodology in depth via [The Four-Layer Ontology](../sdlc/methodology.md), [The Agents](../sdlc/agents.md), [Process](../sdlc/process/_index.md), or the platforms ([Breeze.AI](../practitioner/breeze-ai.md), [ASIMOV](../practitioner/asimov.md)).
