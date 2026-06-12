---
title: "Case Archetypes: Continuous SDLC"
description: "Anonymized engagement anchors that demonstrate the continuous SDLC instantiation of Semantic Engineering. Live application evolution, greenfield growing into complexity, and SDD reaching its operational ceiling."
weight: 70
date: 2026-06-04
lastmod: 2026-06-12
draft: false
audience:
  - cto
  - vp-engineering
  - cio
  - analyst
  - procurement
---

This page covers the continuous SDLC instantiation. The legacy modernization case studies are on [Case Archetypes: Legacy Modernization](../modernization/case-archetypes.md).

We have applied the same methodology across continuous SDLC engagements that differ on every meaningful axis: industry, scale, starting context, tech stack, and the specific dimension of complexity that triggered the move to Semantic Engineering. The methodology generalizes because the failure modes it addresses generalize. Whether the trigger is a 2 million line live code base that has accumulated decades of implicit behavior, a clean greenfield workstream that has grown past the point where its design system can govern itself, or a mature SDD practice that has reached the ceiling of what a spec alone can govern, the structural response is the same.

This page presents three anonymized SDLC archetypes.

## The Archetypes

| Archetype | Starting context | Trigger for SE adoption | Methodology slice applied |
|---|---|---|---|
| [Brownfield Enterprise Modernization](#brownfield-enterprise-modernization) | 2M+ LOC, five to six scrum teams, Node.js, TypeScript, React. Prior AI tooling produced isolated UI prototypes but no global productivity gain. | Global context absent. AI tools failing to deliver value beyond isolated pockets. | Full four-ontology extraction in two to three weeks, plus agent fleet. The team moved past traditional SDD into agent-driven development. |
| [Greenfield Growing into Complexity](#greenfield-growing-into-complexity) | Greenfield UI workstream within a larger multi-workstream brownfield platform. React, TypeScript, Figma-driven UI workflow. SDD discipline working initially. | Component duplication and design-system drift as the codebase expanded. Multiple workstreams converging. Figma-to-code path widening. | Design Ontology slice initially. Other three ontologies planned for expansion as additional complexity dimensions emerge. |
| [SDD at the Governance Ceiling](#sdd-at-the-governance-ceiling) | Mature in-house SDD practice with custom plugin, agent constitution, and supervisor skills. 1M+ LOC legacy rewrite delivered in 5 to 6 months. 20+ engineers and QA across multiple feature pods. | The SDD ceiling reached from inside: review burden at 300 to 400 files per PR, two-plus weeks per review cycle, burnout, talent thinning, governance breakdown as pod count grows. | Forward-looking. SE introduced as the next layer that absorbs the failure modes SDD by itself cannot. |

### The Pattern Across the Three

SDD discipline alone was insufficient once the complexity threshold was crossed. The trigger differs by context. The structural response is the same: introduce machine-readable structure at the layer where the spec alone is failing, and let the agent consume that structure as additional context.

The brownfield archetype is what we do when the team has crossed the threshold before SE arrives. The greenfield archetype is what we do when SE is introduced as the team is approaching the threshold. The third archetype is what the threshold looks like from the SDD side: a team that has built SDD scaffolding to high maturity and is now living inside the operational ceiling that scaffolding alone cannot raise. Three different entry points to the same operating destination.

### A Cautionary Tale That Surfaces in Both Archetypes

A third engagement (a social media marketing platform) had artificially split its backend products along organizational lines rather than along technical service boundaries. Multiple "products" were really one monolithic application presented to the user as a unified experience. After four to five years of evolution, the org structure had produced duplication that no team owned and no architect could fully see.

When we applied the methodology, extraction was not just representation. The Functional Ontology surfaced the duplicate capabilities immediately because the same outcome appeared in multiple product graphs with different implementation paths. The output of extraction was the refactor roadmap the team had been putting off.

The four-layer graph is not only the context the agent reads. It is also the diagnostic surface the team uses to surface the structural work that has been hidden by the org structure.

## Brownfield Enterprise Modernization

A global content research and product company. 2 million plus lines of code in production. Five to six scrum teams. A Node.js, TypeScript, and React stack. A prior attempt to roll out AI coding tools that produced isolated UI prototypes but no global productivity gain.

This is what the methodology looks like when applied at full scale from the start, to an application already past the complexity threshold at the time of adoption. We produced a four-layer knowledge graph of the entire 2.25M LOC code base in two to three weeks. The first demo, delivered on the ground in the client's office, used the Impact Analysis Agent to answer a deliberately open-ended client question.

### Project Shape

| Dimension | Value |
|---|---|
| Total code base | 2.0 to 2.25 million lines of code |
| Largest application | About 1.6 million LOC |
| Secondary ETL and extraction application | 500 to 600 thousand LOC |
| Tech stack | Node.js, TypeScript, React |
| Engineering team | 50 to 60 people |
| Scrum teams | 5 to 6 across the two applications combined |
| QA / QC | Separate organization, not embedded |
| Prior AI tooling attempt | Claude Code, used directly by the team, produced isolated UI prototypes but no global productivity gain |

The prior AI tooling attempt is instructive. The team had access to a state-of-the-art coding agent. Individual engineers got value in pockets, typically on isolated UI prototypes. At the global level, where changes had to coordinate across multiple repositories and respect contracts owned by other teams, the agent produced very little of substance. The missing ingredient was global context.

### What Was Built

In roughly two to three weeks of processing, the engagement team built the first version of all four ontologies for the entire 2.25M LOC code base.

| Ontology layer | Extraction approach | Outcome |
|---|---|---|
| Code | AST parsing using open-source parsers; LLM-inferred metadata per node | Full code graph at function and module granularity |
| Architecture | Inferred from code structure; cross-validated with existing architectural documentation | Service-level graph with bounded contexts, entity definitions, workflow nodes |
| Functional | Inferred from the enriched code graph, starting from the UI and following code paths | Persona-outcome-scenario hierarchy aligned with the actual user-facing behavior |
| Design | Extracted from component code; enriched by browser-automation agents that exercised the application end-to-end | Componentized design ontology including user flows, screenshots, and API calls |

The first demo used the Impact Analysis Agent to answer the client's open-ended question: "What would we have to do to replace our faceted search with semantic search?"

The agent produced a ten-page impact report covering the functional changes, architectural entities affected, UI components touched, code modules to modify, and database schema impact. The report was produced from the high-level question alone, with no further specification authoring required.

### What Changed in How the Team Works

The team moved past traditional SDD into what we describe internally as agent-driven development. The spec remains the input, but agents handle design, planning, implementation, testing, and pre- and post-implementation analysis. Every change passes through the four-ontology validation gate before it can merge, which closes the cross-team coordination gap that the prior Claude Code attempt could not.

| Before the engagement | After the engagement |
|---|---|
| AI coding tools produced isolated UI prototypes; no global productivity gain | The team operates under agent-driven development; the spec is the input, agents handle the rest under governance |
| Cross-team coordination happened in meetings and Slack | Cross-team conflicts are caught at the PR validation gate before integration |
| Brownfield changes required senior-engineer archaeology of three to five days | Brownfield impact analysis runs in eight minutes against the live graph |
| BDD scenarios were authored manually and routinely abandoned | BDD scenarios are auto-generated from the Functional Ontology; 93.4% test coverage with zero manual overhead |

### The Verification Suite Found Real Issues

The P0 integrity assessment run against the extracted graphs surfaced specific structural defects in two of the four ontologies.

| Ontology | P0 verification result | Notable findings |
|---|---|---|
| Functional | Passed 9 of 9 | Healthy; ready for agent consumption |
| Architecture | Passed 9 of 9 | Healthy; ready for agent consumption |
| Design | Failed on fragmentation | 65 weakly connected components; giant component only 4.88% of nodes; remediation backlog created |
| Code | Failed 7 of 9 | 257 self-loops on recursive function nodes; 12 reciprocal IMPORTS pairs from barrel re-exports; remediation backlog created |

These findings illustrate why the verification suite is mandatory. Two of the four ontologies passed cleanly and were immediately usable. The other two surfaced specific, addressable structural defects that would have made downstream agent outputs unreliable. Without the verification gate, those defects would have remained invisible until production incidents started accumulating.

The remediation backlog was added to the next sprint's planning. By the end of the second month, all four ontologies were passing the P0 suite cleanly.

### Methodology Takeaway

When an application is already past the complexity threshold at the time the methodology is introduced, the appropriate response is a full four-ontology extraction up front. The brownfield extraction capability makes this tractable in weeks rather than months, and the resulting graph becomes the operating substrate for every subsequent change.

This archetype is the canonical reference for the methodology's full deployment. Engagements that begin with smaller scope (single application, Design Ontology slice first) eventually grow toward this shape as they mature.

The technical archetype focuses on the deployment of the methodology. The operating-model transition that runs alongside is in [Layered Team Structure in Depth](process/team.md#layered-team-structure-in-depth). The custodial structure that holds the engagement across years is in [The Enablement Partnership](process/enablement-partnership.md).

## Greenfield Growing into Complexity

A utility management and billing platform. Multifamily, single-family, commercial, and student housing. A long-standing client engagement with prior cloud and data platform modernization delivered before the Semantic Engineering work began. The current engagement focus: a Single Family Activation workstream within the larger multi-workstream brownfield platform. React, TypeScript, Figma-driven UI workflow, custom component library.

This is the more common pattern. A project begins as a manageable greenfield, applies SDD discipline successfully through its early phase, and then crosses a complexity threshold that makes Semantic Engineering adoption the natural next step. The methodology was not introduced from Day 1. It was introduced when the SDD ceiling conditions described in [Zone 2: Spec-Driven Development](zones/zone-2-spec-driven-development.md) started to surface: design system drift, cross-workstream coordination friction, and AI-generated outputs that were plausibly correct but structurally inconsistent with the existing codebase.

### Project Shape

| Dimension | Value |
|---|---|
| Business domain | Utility management and billing for multifamily, single-family, commercial, and student housing |
| Engagement history | Long-standing client; prior cloud and data platform modernization delivered before the SE engagement |
| Current SE engagement focus | Single Family Activation modernization, UI development workstream |
| Tech stack | React, TypeScript, Figma-driven UI workflow, custom component library |
| Starting context | Greenfield UI workstream within a multi-workstream brownfield platform |

### The Evolution

The recent UI workstream began as a clean greenfield within the larger platform. The team applied SDD discipline: written specifications, structured review, spec-as-gate before sprint planning. For the first several sprints this was sufficient. The codebase was small enough that a single developer could hold the design system in their head. The component library was new enough that duplication was not yet a meaningful risk. AI-assisted code generation produced output that the team could review and integrate without structural friction.

Three things changed as the workstream grew.

The component library expanded. What started as a small set of primitives grew into a substantive design system. New AI-generated components increasingly duplicated existing ones because the spec did not reference them and the LLM had no visibility into what already existed.

Multiple workstreams converged. The Single Family Activation work intersected with the existing multifamily platform code, introducing cross-workstream coordination requirements that no single spec could capture.

The Figma-to-code path widened. UI designers began shipping more designs faster than developers could review them for component reuse. Without structural enforcement, the gap between "what the design system has" and "what the new UI uses" grew on every sprint.

These are the precise failure modes the methodology describes as the trigger conditions for Zone 3 adoption. The spec was still doing its job at the change level. The bottleneck moved upstream into design system currency and downstream into AI-output reliability.

### What Was Built

The team adopted the methodology by starting with the slice that most directly addressed the failure mode: the Design Ontology. The existing component library was extracted into a structured ontology, connected to Figma wireframes, and wired so the LLM consulted the ontology before generating any new component.

The other three ontologies were planned for expansion later as additional complexity dimensions emerged. This staged adoption is itself an important pattern: the methodology does not have to be deployed all at once.

### Results from the First SE-Governed Sprint

| Metric | Result |
|---|---|
| Component reuse from existing design system | 53% reuse in the first sprint |
| AI code generation quality | 23 files generated; 0 errors; 0 boundary violations; 4-way traceability verified at commit |
| Figma-to-code accuracy on first attempt | 95%+ match |
| Per-component development time | 85 to 90% reduction (1 to 2 hours versus 15 to 31 hours manual) |
| Overall workstream timeline | 30 to 40% improvement (approval workflows unchanged) |

For context on the broader relationship, the prior digital transformation engagement (cloud and data platform modernization) delivered $3M in annual cost savings, 60% reduction in infrastructure costs, 70% reduction in manual processes, and an 18-month ROI. The SE-driven UI workstream is the most recent chapter in a multi-year client relationship that has progressed through successive methodology generations.

### Methodology Takeaways

Three lessons from this archetype.

Greenfield projects with SDD discipline have a complexity ceiling. The ceiling is rarely reached in the first few sprints. It is reached when the codebase, the design system, the team count, or the workstream count crosses a threshold the spec alone cannot govern. The trigger is the rate of complexity accrual, not the absolute starting size.

SE adoption can be staged by ontology. A team does not have to deploy all four ontologies at once. Starting with the ontology most aligned to the active bottleneck (Design at this engagement; Code and Architecture at the brownfield enterprise modernization archetype) produces measurable wins immediately and builds the operating discipline for broader rollout.

The Design Ontology alone is a high-leverage entry point for UI-heavy workstreams. Component reuse percentages in the 50%+ range from sprint one are achievable without the broader four-ontology investment. For teams not yet ready for full SE deployment, the Design Ontology is the lowest-friction first step.

## SDD at the Governance Ceiling

A multi-product platform suite serving the US automotive aftermarket. A long-standing delivery relationship with the client, roughly two and a half years on this product family. The trigger for the SDD investment was a legacy product the client had acquired, carrying north of a million lines of unmaintainable code, that needed to be rewritten at pace under acute revenue pressure.

The team rewrote 1M+ LOC in five to six months under SDD. The engagement is currently the most operationally mature SDD practice the firm runs, and it is also where the SDD ceiling described in [Zone 2](zones/zone-2-spec-driven-development.md) is hitting hardest. SE has not yet been introduced. The shape of this archetype is therefore the SDD destination and the SE on-ramp at the same time.

### Project Shape

| Dimension | Value |
|---|---|
| Business domain | Multi-product platform suite for the US automotive aftermarket (dealer-facing dashboards, scheduling, digital storefront, integrations) |
| Engagement history | Multi-year delivery relationship; about 2.5 years on this product family |
| SDD adoption trigger | Acquired legacy product, 1M+ LOC of unmaintainable code, rewrite required at pace during a market downturn |
| Rewrite outcome | 1M+ LOC rewritten in 5 to 6 months under SDD |
| Engineering team | 20+ engineers and QA across multiple concurrent feature pods |
| Pod composition | One PO, one dev lead, one QA lead per feature pod; architects shared across pods |
| Tooling stack built in-house | Custom SDD plugin with slash commands, a written constitution and coding guidelines, supervisor skills to keep the agent deterministic, MCP-based QA automation with Playwright, agent gateway for multi-agent routing |
| Primary code generation | Claude Code via custom plugin |
| Typical PR size | 300 to 400 files, ~30,000 lines of code |
| Review cycle | Two-plus weeks per PR; rigorous human-in-the-loop |
| Cadence | Asynchronous via chat and repo; sign-off ceremony at spec freeze; deploy on feature complete under modern CI/CD |
| Security posture | SAST and DAST integrated into pipeline; vulnerability scanning continuous |

### What the Team Built for Itself

The team did not start with a methodology. It started with sales pressure and a million lines of legacy code. The SDD scaffolding emerged as the team encountered each operational gap and patched it.

A small group of architects and engineering managers wrote a constitution: how SDD should be run, what the dev lead does, what the architect does, what the PO does, and how each of them talks to the agent. The constitution went through four versions in roughly six months.

The team built supervisor skills to keep the agent on task: a multi-question interview flow that runs before any spec is finalized, conventions for prompting patterns, automated checks that the agent has not forgotten earlier constraints, and integration with the team's existing pipeline tooling. The skills bundle was packaged as a plugin so every engineer in the unit could install it from one place.

The spec is treated as a living document. It is the single source of truth for the agent and the team. It is amended through the build cycle when reality diverges from the original draft. QA validates the spec first and the code second: a spec that cannot be tested goes back to the drawing board before any code is generated against it.

This scaffolding is exactly what a team builds before reaching for a structured knowledge graph. It demonstrates discipline. It also reveals its own limits.

### The SDD Ceiling in Operation

The four ceiling conditions described in [Zone 2](zones/zone-2-spec-driven-development.md) are concrete operational realities at this archetype. They are not described here as hypotheticals because the engagement is currently working through them.

**Review burden at scale.** A PR that touches 300 to 400 files and 30,000 lines cannot be reviewed inside a normal sprint cadence. The dev lead and architect spend two-plus weeks on each review cycle. Engineers added as reviewers on adjacent features lack context for what the feature is supposed to do and cannot meaningfully validate cross-cutting changes. The team has begun reducing scope per generation to make outputs human-reviewable, which is a workaround rather than a structural fix.

**Operating-model burnout.** Once the spec is approved, individual engineers spend their working hours in an asynchronous loop with the agent. The collaboration patterns that absorbed load in agile have no equivalent here. Sixteen to eighteen hour days have become routine on this engagement during feature-completion windows.

> From a conversation with the engagement lead:
>
> "SDD is waterfall reimagined. SDD forces people to work sixteen to eighteen hours a day because the amount and volume of code is so much. Once the spec is thrashed out, you are on your own. You talk to Claude. Claude talks to you. You are logged in a room and working for hours and hours."

**Talent thinning.** The team has found that the bottom 30 to 40 percent of engineers cannot operate inside the SDD pattern. The combination of spec writing fluency, large-output review discipline, asynchronous self-management, and conversational fluency with the agent compounds into a competency profile that a meaningful fraction of any team cannot meet. The engagement lead describes the failure modes as some mix of discipline, ownership, EQ, conversational English, and domain knowledge.

> "Bottom thirty to forty percent will struggle with SDD. There is no place to hide. It is between you and Claude as a developer."

**Governance at scale.** The pod structure works for a small number of concurrent features. As pod count grows, no oversight role can hold cross-feature coherence in mind, and the spec is not a structure that supports cross-team queries. The engagement lead names governance and review as the two biggest open problems on the engagement today.

**Estimation misfit.** Leadership wants SDD productivity expressed in story-point terms because that is the framework the rest of the portfolio runs on. The team superimposes historical sprint velocity on SDD output to produce a comparison number. The team itself describes this as juxtaposing historical data rather than measuring SDD on its own terms.

> "Estimation is a bad problem because the entire leadership is agile focused. We are juxtaposing historical data: sprint velocity for past five sprints, and after using SDD, how many story points we have been able to deliver. It is not ideal."

### Where SE Goes Next

The team has not yet introduced the four-layer knowledge graph or the agent fleet that operates against it. The next steps that would absorb the failure modes above are visible from inside the methodology.

The Code Ontology and Architecture Ontology give the review process a structural validation gate. Generated changes are checked against the live graph before they reach a human reviewer, which is how the [Brownfield Enterprise Modernization](#brownfield-enterprise-modernization) archetype closes the cross-team coordination gap on PRs of similar size.

The Functional Ontology turns spec validation from a manual exercise into BDD scenarios generated against the graph. This addresses the QA bottleneck that emerged in the engagement-lead conversation as the hardest part of the work, and that the methodology surfaces as the universal observation across mature SDD teams.

> Observation from the same conversation, captured back to the team:
>
> "Code generation is the easy bit of the whole problem. The real problem is managing QA and governance."

The [Layered Team Structure](process/team.md#layered-team-structure-in-depth) absorbs the talent-thinning failure mode by placing SDD-fluent practitioners in an Enablement Layer that supports a wider Implementation Layer, rather than requiring every engineer to operate at the SDD ceiling.

The [deliverable-based engagement frame](process/team.md#phase-2-deliverable-based-engagement) reshapes the estimation conversation. Clients commit to the knowledge graph and its quality guarantees rather than to story-point velocity that does not map cleanly to agent-led work.

### Methodology Takeaway

This archetype illustrates SDD as the on-ramp the methodology describes. A team can adopt SDD with discipline, succeed at it on a meaningful scale, and reach the operational ceiling that Zone 2 predicts. The pattern is recognizable from the artifacts the team has already produced: a plugin, a constitution, supervisor skills, prompting conventions, MCP-mediated QA automation. These are precisely the scaffolds a team builds in the late SDD maturity before reaching for a structured substrate underneath the spec.

Where the brownfield archetype shows SE adopted at full scale up front, and the greenfield archetype shows SE adopted as the threshold is approached, this archetype shows the threshold reached from the SDD side. The next move for this engagement is to layer the four ontologies beneath the spec so the review, the QA validation, the governance, and the talent envelope all gain a structural floor.

---

The three archetypes together show that the methodology generalizes across very different starting conditions. The failure modes it addresses are universal. The structural response is the same regardless of context. The next step depends on what the team's specific starting context demands. The [Practitioner section](../practitioner/_index.md) covers how we engage.
