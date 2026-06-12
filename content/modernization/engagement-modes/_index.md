---
title: "Engagement Modes of Legacy Modernization"
description: "The five engagement modes through which legacy modernization is delivered: Documentation Only, Discovery and Documentation, Migration Readiness, Full Modernization, and Maintain, Operate, and Convergence. Entry points sized to what the client is ready to commit to."
weight: 20
date: 2026-06-11
lastmod: 2026-06-12
draft: false
section: true
audience:
  - cto
  - cio
  - vp-engineering
  - architect
  - chief-architect
---

The companion to this section is [The Manual Translation Tax](../translation-tax.md). This section is about which engagement mode fits where you are on the modernization journey. The five modes below are not a complexity ladder. They are entry points sized to the work the client is ready to do, with a natural progression that many engagements follow over time.

## Why Modes, Not Zones

The continuous SDLC use case has [four zones of process](../../sdlc/zones/_index.md) matched to four zones of work complexity. The right zone is determined by the complexity of the work in front of the team. The modernization use case is shaped differently. The complexity of a legacy estate does not change as the client moves through their journey; what changes is what the client is ready to commit to.

A client may need to close a documentation gap before SMEs retire, without any migration intent. A second client may be considering modernization but not yet committed. A third may be planning a migration and need readiness work first. A fourth is committed and ready for the end-to-end pipeline. A fifth has modernized and needs to operate the modernized system going forward. Each of these is a different scope of work, not a different complexity. The modernization methodology offers a distinct mode for each.

The Manual Translation Tax in modernization (covered on the [MTT page](../translation-tax.md)) has three components plus a residual: the reverse-engineering tax, the lost-context tax, the validation-vacuum tax, and the knowledge-disappearance tax that surfaces post-modernization. Each engagement mode addresses a defined subset.

## The Five Engagement Modes

![The five engagement modes of legacy modernization with translation-tax component coverage per mode](/diagrams/modernization-engagement-modes-flow.svg)

Each mode consumes a different slice of the same modernization intelligence core. The core itself (the Source-state ontology, the Target-state ontology, the specification format) is built once. Each mode draws on the parts of the core it needs and produces the deliverable the client engaged for.

| Mode | What it delivers | Typical duration |
|---|---|---|
| **1. Documentation Only** | Functional and technical documentation, test scenarios, traceability artifacts. No migration. | 2 to 6 weeks |
| **2. Discovery and Documentation** | Application inventory, dependency maps, business rules, process flows, SME review packs, plus the docs above. | 4 to 10 weeks |
| **3. Migration Readiness** | Migration scope at module level, target mapping, sequencing, risk view, requirements traceability matrix. | 6 to 12 weeks |
| **4. Full Modernization** | End-to-end pipeline: Discover → Document → Migrate → Validate → Maintain. Target code validated against four quality gates. | Quarters to years |
| **5. Maintain, Operate, and Convergence** | Operational knowledge base, lifecycle documentation, change-impact support, overlap analysis, convergence blueprint. | Continuous after Mode 4 |

### MTT Components Addressed by Each Mode

| Modernization Translation Tax | Mode 1 | Mode 2 | Mode 3 | Mode 4 | Mode 5 |
|---|---|---|---|---|---|
| **Reverse-engineering tax** | Closed | Closed | Closed | Closed | Closed |
| **Lost-context tax** | Partial | Substantial | Closed | Closed | Closed |
| **Validation-vacuum tax** | Not addressed | Not addressed | Partial | Closed | Sustained |
| **Knowledge-disappearance tax** | Partial | Partial | Not addressed | Partial | Closed |

## Mode 1: Documentation Only

**The right mode when the legacy system will continue to run and the priority is closing the documentation gap.** SMEs are retiring or scarce. Institutional knowledge is at risk of walking out. The team needs documentation, test scenarios, and traceability artifacts produced from the legacy code itself, so the system can be operated without depending on tribal memory.

| Element | Detail |
|---|---|
| **Duration** | Two to six weeks for a legacy estate up to 1M LOC. Larger estates pace proportionally. |
| **Participants** | Modernization Expert, engagement Chief Architect, one or more Product Owners for review, occasional client developer for code-chatbot validation. |
| **Inputs** | Legacy source code, supporting artifacts, access to a small SME pool. |
| **Outputs** | Source-state ontology, BRD, BDD test scenarios, end-to-end test scripts, code chatbot interface. Optional knowledge-graph hand-over. |
| **Agents that run** | Code Ingestion, Code Enrichment, Specification Extraction. No migration agents, no validation agents. |
| **Pillars that run** | Discover, Document only. |

**Suitable when:**

- The legacy system continues to run and modernization is not on the near-term plan
- SMEs who carry the legacy knowledge are leaving and the documentation window is closing
- The legacy code base is the only authoritative record of system behavior
- Regulatory or audit pressure exists for documented system behavior
- The cost-to-confidence ratio for full modernization looks bad and the team wants to preserve knowledge first

**Does not address:**

- Does not produce a modern system; no code is migrated
- Does not produce a parity test suite (BDD scenarios document the legacy but have not been run against a modern equivalent)
- Does not capture operational behavior outside the code (runbooks, escalation procedures, vendor contracts)
- Does not establish the modernization scope; Mode 2 builds on this foundation when the decision is taken

**Next mode trigger:** The organization decides it needs a defensible system-understanding baseline beyond just documentation.

## Mode 2: Discovery and Documentation

**The right mode when the organization is considering modernization but needs a defensible baseline of system understanding first.** Modernization attempts that fail in the market usually fail because the team underestimated the complexity of the legacy estate. Discovery layers application inventory, dependency maps, business rules, process flows, and SME review packs on top of the documentation outputs.

| Element | Detail |
|---|---|
| **Duration** | Four to ten weeks for a legacy estate up to 1M LOC. Larger estates pace proportionally. |
| **Participants** | Modernization Expert, engagement Chief Architect, three to six Product Owners (one per major domain), Business Process Owner, Compliance and Audit liaisons if regulated. |
| **Inputs** | Legacy source code, supporting artifacts, broader SME pool than Mode 1, existing process documentation, regulatory and compliance documents. |
| **Outputs** | All Mode 1 outputs plus application inventory, dependency map, business rules inventory, process flows, SME review packs. |
| **Agents that run** | Same as Mode 1, running deeper analysis with broader SME interaction. |
| **Pillars that run** | Discover, Document. |

**Suitable when:**

- A modernization decision is on the table and leadership needs evidence before committing
- A failed prior modernization attempt has made leadership cautious
- Business stakeholders need to understand what the legacy actually does before signing off
- Adjacent systems are being modernized and the dependency map is needed to scope impact
- The legacy team has shrunk and SME review packs are how the remaining knowledge gets converted into a form the next team can operate from

**Does not address:**

- Does not produce a modernization plan at module level; that is Mode 3
- Does not select the target stack; the Target Blueprint is decided in Mode 3 or at the start of Mode 4
- Does not produce a modern equivalent of any module
- Does not generate parity tests for a modernization (no modern equivalent exists yet)

**Next mode trigger:** The organization commits to modernization and needs a rigorous readiness foundation before transformation begins.

## Mode 3: Migration Readiness

**The right mode when modernization is planned and the team needs a rigorous readiness foundation before transformation begins.** The Target Blueprint is selected and decomposed into a Target-state ontology. The specification format is generated, and the SME annotation (Retain / Modify / Replace / Retire) is captured for every Source-state module.

| Element | Detail |
|---|---|
| **Duration** | Six to twelve weeks for a legacy estate up to 2M LOC. Larger estates pace proportionally. |
| **Participants** | Modernization Expert, engagement Chief Architect, Product Owners (one per major domain), Architect, CFO or business sponsor, compliance liaison if regulated. |
| **Inputs** | Legacy source code, Source-state ontology (often built in a prior mode), Target Blueprint selected by the client, prior Mode 2 outputs if any, business requirements and regulatory constraints. |
| **Outputs** | Migration scope at module level, as-is versus delta classification, Target-state ontology, target mapping, sequencing, risk and complexity view, requirements traceability matrix, annotated specification format. |
| **Agents that run** | Code Ingestion and Enrichment (if not already run), Target Blueprint Ingestion, Specification Extraction. Migration and validation agents are calibrated but do not run on migration output. |
| **Pillars that run** | Discover, Document. Migrate and Validate are configured but do not execute. |

**Suitable when:**

- The modernization decision has been taken and a target date is in mind
- The Target Blueprint is in focus and the target stack has been chosen or narrowed to finalists
- SMEs are available for the Retain / Modify / Replace / Retire annotation discipline
- Cost and timeline confidence are needed before capital is committed
- The implementing partner and client engineering team need a shared, auditable plan

**Does not address:**

- Does not modernize any module; migration agents do not run
- Does not validate the modernization; AVF gates are calibrated here but run during Mode 4
- Does not deliver a system; the legacy continues to run

**Next mode trigger:** The team commits to executing the migration and wants the agent fleet to drive it.

## Mode 4: Full Modernization

**The right mode when the client commits to replacing a legacy stack with a defined modern target and wants the agent fleet to drive the migration.** The end-to-end pipeline runs across five stages: Discover, Document, Migrate, Validate, Maintain. The migration agents generate target code per scoped module, validated by the four quality gates, iterated until the gates pass, and reviewed by the Modernization Expert before deployment.

| Element | Detail |
|---|---|
| **Duration** | Quarters to years, paced by the legacy estate size and release cadence. MVP module typically completes in 12 to 20 weeks. Scaled Migration runs across remaining modules in waves of similar duration. |
| **Participants** | Modernization Expert (one or more depending on scale), engagement Chief Architect (with supporting senior architects on larger estates), Product Owners (one per major domain), Architect, CTO or VP Engineering as sponsor, Client UAT team, deployment engineering team. |
| **Inputs** | Mode 3 outputs (or built in this engagement), Target Blueprint, legacy source code, SME availability throughout. |
| **Outputs** | Modernized target code per module validated against four AVF gates. Deployed modern system. Technical documentation for the migrated code. Knowledge graph ready for ongoing operation or transition. |
| **Agents that run** | All nine named agents (see [The Modernization Agent Fleet](../agents.md)). |
| **Pillars that run** | All five: Discover, Document, Migrate, Validate, Maintain (Maintain begins at hand-over). |

**Suitable when:**

- Capital is allocated and procurement and finance have approved a multi-quarter or multi-year program
- A Mode 3 package exists or is being produced in Stage 2 of this mode
- The Target Blueprint is locked; mid-engagement changes are disruptive
- Product Owners are available throughout the engagement to feed the SME tuning loop
- The deployment team and operational owners are aligned on cutover strategy

**Does not address:**

- Does not establish the long-term operating model of the modernized system; Mode 5 takes over
- Does not modernize what is annotated Retire in the spec; those modules need a separate retirement plan
- Does not solve organizational issues (skill profile, procurement, operations) that modernization surfaces
- Does not include the continuous SDLC engagement that may follow on the modernized system; that is a separate engagement under [continuous SDLC](../../sdlc/zones/_index.md)

**Next mode trigger:** Modernization is complete and the client wants to operate the modernized system going forward.

## Mode 5: Maintain, Operate, and Convergence

**The right mode when modernization is complete (or partially complete) and the client wants to operate the knowledge graph as a living asset on the modern stack.** Maintenance covers the operational knowledge base, lifecycle documentation, change-impact support, overlap analysis across products, consolidation opportunities, and a convergence blueprint where the modernized system needs to converge with other products in the portfolio.

| Element | Detail |
|---|---|
| **Duration** | Continuous after Mode 4, paced by the client's release cadence and the volume of post-modernization work. |
| **Participants** | Modernization Expert (reduced engagement compared to Mode 4), engagement Chief Architect at a steward cadence, Product Owner(s) for review of post-deployment changes, Client architecture team for change-impact reviews. |
| **Inputs** | The knowledge graph from Mode 4, ongoing code changes, change-impact requests, multiple modernized product graphs for overlap analysis. |
| **Outputs** | Maintained knowledge graph, refreshed documentation extractions, change-impact reports, overlap and consolidation reports, convergence blueprints when consolidation is approved. |
| **Agents that run** | The full nine-agent fleet remains available. Documentation and analysis agents run most often; migration and validation agents exercise during refresh, extension, or convergence cycles. |
| **Pillars that run** | All five remain instrumented. In steady state, Document and Maintain are most active; Discover runs on incremental changes; Migrate and Validate run during refresh or convergence cycles. |

**Suitable when:**

- Modernization is complete (or at a stable interim milestone) and the modernized system is in production
- The client wants the knowledge graph to remain a living asset rather than an artifact at hand-over
- Multiple modernized products are coming online and portfolio-scale value (overlap, consolidation, convergence) is realized
- Continuous SDLC under the four-layer ontology is not yet ready to start but the modernization-side knowledge needs to keep being maintained

**Does not address:**

- Does not migrate any new legacy; that is a new Mode 1-4 engagement
- Does not replace the continuous SDLC operating model; the two do not overlap and Mode 5 is what runs until the continuous SDLC engagement starts (or instead of it)
- Does not produce new code at modernization scale

This mode is the bridge to the continuous SDLC instantiation. The Source-state ontology (now the running state of the modern system) and the custodian-annotated specification can transfer to the four-layer ontology under the continuous SDLC operating model. The four custodians who governed the modernization ontologies continue as the four custodians of the four-layer ontology; the cadence of custodianship shifts from stage-sequenced to sprint-cadenced.

## Natural Progression and Stopping Points

Many engagements move through several modes in sequence. A Documentation Only engagement often leads to Discovery and Documentation; that leads to Migration Readiness; that leads to Full Modernization; that leads to Maintain. The modes are not a forced ladder. Many clients stay at Documentation Only or Discovery and Documentation indefinitely because the legacy system is not actually being retired and only the knowledge needs to be preserved.

| Stopping point | What it looks like |
|---|---|
| Stop at Documentation Only | The legacy system runs for several more years. SMEs are leaving. Capture knowledge before they go. No commitment to migration. |
| Stop at Discovery and Documentation | The organization wanted a system-understanding baseline. Whether to modernize will be decided later (or not at all). The discovery artifacts inform that decision. |
| Stop at Migration Readiness | The migration is planned but commercial or regulatory conditions delay execution. The readiness package is preserved so the migration can start cleanly when conditions allow. |
| Stop at Full Modernization | The modernized system is in production. The client operates it on their own. The knowledge graph is delivered as an artifact, not as a maintained asset. |
| Continue to Maintain | The modernized system is in production and the client wants the graph to keep being maintained, either by the implementing partner or by transitioning to a continuous SDLC engagement under the four-layer ontology. |

## Time to First Deliverable

| Mode | Time to first deliverable |
|---|---|
| Documentation Only | Initial Source-state ontology and documentation in the first two weeks |
| Discovery and Documentation | Application inventory and dependency map in the first three weeks |
| Migration Readiness | Module-level migration scope in the first four weeks |
| Full Modernization | MVP module migrated in 12 to 20 weeks; full estate over quarters |
| Maintain, Operate, and Convergence | Ongoing |

Durations depend on the size of the legacy estate, the target stack, and the organization's path-to-production process.

## Change Management Considerations

Legacy modernization is bounded, but the work has organizational implications that outlast the engagement. Three things are worth naming before the engagement starts.

The SMEs who annotate the specification are giving up tacit knowledge in a structured form. This is good for the organization (the knowledge is preserved) and may be uncomfortable for the SME (their unique-position knowledge becomes shared). Engagement structure has to account for this.

The target stack the client chooses will shape the engineering team's skill profile for years. The Target Blueprint decision in Discovery and Analysis is not just a technical decision; it is a workforce-planning decision. Procurement and HR need to be aware.

The transition from a legacy system to a modern system rarely happens in one cutover. Strangler patterns, parallel operation, and traffic-shifting all need to be planned in Migration Readiness or earlier. The earlier engagement modes (Documentation Only, Discovery and Documentation) do not address operational cutover at all, which is appropriate because they do not produce a modern system, but the team needs to know that.

---

The companion pages: [The Manual Translation Tax](../translation-tax.md) names the problem. [Ontologies for Legacy Modernization](../methodology.md) covers the methodology depth. [Modernization Operating Model](../process/operating-model.md) covers the operating model that delivers the modes. [ASIMOV](../../practitioner/asimov.md) is the platform that operationalizes the methodology.
