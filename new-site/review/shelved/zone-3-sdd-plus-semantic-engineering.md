---
title: "Zone 3: SDD plus Semantic Engineering"
description: "Spec-Driven Development extended with a four-layer knowledge graph, for multi-team and brownfield work on one product. Where it is suitable, how it compares with Zones 1 and 2 on each component of the Manual Translation Tax, where it stops working, and the transition path to SE at Scale."
weight: 30
date: 2026-10-05
lastmod: 2026-10-05
draft: true
audience:
  - cto
  - vp-engineering
  - chief-architect
  - architect
  - tech-lead
---

![The Structured Landscape: persistent context above, per-change SDLC flow below](/diagrams/structured-landscape.svg)

The diagram shows the operating picture at this zone. External signals are unchanged from Zones 1 and 2. The four custodians are unchanged. The medium they output to flips: from red text artifacts that every reader has to translate, to green machine-readable ontologies that the agent reads directly. The top half is the persistent context: the four custodians curate the four ontologies as the world changes. The bottom half is the per-change SDLC flow: a specification arrives on the left, the Impact Analysis Agent reads the spec plus the graph and emits an impact report, the developer and the coding agent both consume the report, the PR Validation Agent checks the code against the graph at merge, and the KG Sync Agent updates the Code Ontology on every merge so the graph stays current.

## The Manual SDLC Problem This Zone Addresses

The Zone 2 ceiling is that the spec is still text, and the spec captures one custodian's view: the product owner's. SDD reduces each component of the [Manual Translation Tax](../translation-tax.md#the-three-components-of-the-tax) only in part. The written contract reduces ambiguity at the product owner layer. Specs persist alongside the code but decay under deadline pressure. Traceability from spec to commit is instrumented at the ticket level.

The parts SDD leaves unpaid surface as the ceilings described in [When This Zone Stops Working](zone-2-spec-driven-development.md#when-this-zone-stops-working) on the Zone 2 page: localized context, spec drift, single-layer coverage, specs becoming the bottleneck, and token spend that grows super-linearly with change complexity.

Zone 3 changes the medium. A knowledge graph of the application sits alongside the per-change specifications. The graph captures four connected layers: Functional (the product owner's), Architecture (the architect's), Design (the designer's), and Code (the engineering team's). The four custodians write into structured ontologies that the agent reads directly. The Manual Translation Tax collapses because the medium changes from text artifacts to machine-readable ontologies.

## Where the Team Is

Every change of meaningful size still starts from a written specification. The spec remains the canonical articulation of intent for the change, and the SDD habits the team built at Zone 2 transfer directly. A knowledge graph of the application sits beside the specs. Every change runs through pre-implementation impact analysis before code is written. Every merge updates the graph automatically.

Specification work runs on its own cadence. The [spec sprint](../process/spec-sprint.md) runs one or two sprints ahead of the [implementation sprint](../process/implementation-sprint.md) it feeds. The four custodians take part in a spec sprint workshop, time-boxed to one or two days and batched across pending change requests, and the implementation team consumes the impact-analyzed specs as a known plan. At this zone the developer stays in the per-change loop, reviewing the coding agent's output and applying implementation judgment.

## What the Team Operates With

The AI tool plus a verifiable per-change contract plus a structured, current model of the whole application. The operating model rests on a clean separation between [three sources of truth](../process/_index.md#three-sources-of-truth).

![Three sources of truth: specification, ticket system, and knowledge graph, each with its own scope and consumer](/diagrams/three-sources-of-truth.svg)

| Source of truth for... | System | Scope |
|---|---|---|
| Intent for a specific change | Specification | Local: one feature, one user story, one change request |
| Progress, ownership, sprint status | Ticket system (Jira, Linear, or equivalent) | Global: program-wide ticket flow and team accountability |
| Application state, structure, behavior | [Knowledge graph](../methodology.md#the-four-layer-ontology) | Global: the full application as it actually runs today |

A small agent fleet operates on the graph. Each agent has a named human owner, and no agent writes directly to a governed ontology node without human approval.

| Agent | What it does at this zone | Owner role |
|---|---|---|
| [Impact Analysis Agent](../agents.md#the-impact-analysis-agent) | Traverses the four-layer graph for a spec and produces the impact report before code is written; reruns after merge to compare reality with the prediction | Forward-Deployed Engineer for the workstream |
| [PR Validation Agent](../agents.md#the-pr-validation-agent) | Gates every merge against all four ontologies: functional, design, architecture, and code consistency | Tech Lead for the workstream |
| [BDD Generation Agent](../agents.md#the-bdd-generation-agent) | Generates Gherkin scenarios from the Functional Ontology and regenerates them when the ontology changes | Tech Lead for the workstream |
| [KG Sync Agent](../agents.md#the-kg-sync-agent) | Updates the graph on every merge; structural changes go to the relevant owner for review first | Ontology Maintainer |
| Extraction Agents | Initial brownfield extraction of each ontology layer | Semantic Engineer during initial extraction; Ontology Maintainer thereafter |

The graph holds only what passes the [aperture](../methodology.md#aperture) test: elements whose change cascades beyond their immediate context. The aperture starts narrow and widens over the first twelve sprints. From Day 1 to Sprint 4 the graph holds core personas, the top outcomes per persona, primary service boundaries, and the top code-level cross-module dependencies. Full operational width comes from Sprint 12 onward. The graph's health is measured on every merge by the P0 verification checks, and a merge that fails a P0 check is blocked until the defect is fixed. The detail is in [Governance and Metrics](../methodology.md#governance-and-metrics).

## When This Zone Is Genuinely Suitable

Zone 3 is the right process when the work spans multiple teams or hits brownfield depth on a single product. Below that range, the four-layer graph is overhead without payback, and [Zone 2](zone-2-spec-driven-development.md#when-this-zone-is-genuinely-suitable) is sufficient. Above it, the work spans products and needs the cross-product machinery of Zone 4.

| Context | Why SDD plus SE fits |
|---|---|
| Multi-team or multi-repository work on one product | Changes cross team boundaries that no single spec can see. The PR Validation Agent catches cross-team contract violations at the merge gate, before integration. |
| Brownfield application at enterprise scale | Behavior is scattered across services in ways the current team cannot hold from memory. Extraction models the system's actual behavior, and impact analysis replaces days of senior-engineer archaeology with a report produced in minutes. |
| Greenfield workstream that has grown into complexity | The component library has grown, workstreams are converging, and AI-generated components start duplicating existing ones. A single ontology slice, typically Design, addresses the active bottleneck first. |
| Single product crossed into multi-team coordination and agent-assisted development at scale | The spec sprint cadence is worth running in its full SE form: impact-analyzed specs plus a refreshed knowledge graph, with agent participation. |
| Mature SDD practice at the governance ceiling | Review burden, QA, and cross-pod governance have outgrown what the spec can carry. The four ontologies layered beneath the spec give review, QA validation, and governance a structural floor. |

Examples that fit the pattern, from the [case archetypes](../case-archetypes.md): a 2M+ LOC Node.js, TypeScript, and React code base across five to six scrum teams, where a prior AI tooling attempt produced isolated UI prototypes but no global productivity gain; a greenfield UI workstream inside a larger multi-workstream platform, where design-system drift appeared as the component library expanded; and an SDD-mature practice reviewing PRs of 300 to 400 files over two-plus weeks per cycle, for which SE is the next layer the methodology describes.

## How Teams Enter This Zone

The Zone 2 page covers the move itself in [From SDD to SE](zone-2-spec-driven-development.md#from-sdd-to-se): what the knowledge graph adds against each SDD ceiling, what stays the same, and what changes for the team. The two common entry paths differ in starting slice and in time to first result.

| Entry path | Typical adoption time | Typical first measurable result | Most common for |
|---|---|---|---|
| Design Ontology slice first | Two to four sprints to deploy the slice | First-sprint design component reuse in the 50% range; first AI-generated UI passing the four-way traceability gate at commit | Greenfield teams that have grown into complexity |
| Full four-ontology extraction, brownfield | Two to three weeks to extract a 2M LOC code base; four to six weeks to reach steady-state operation | Impact Analysis Agent answering open-ended client questions on the live graph; first cross-team conflict caught at the PR gate | Brownfield modernization at enterprise scale |

The Zone 2 to Zone 3 transition is the most consequential of the transitions. Adoption can be staged by ontology: a team does not have to deploy all four at once, and starting with the ontology most aligned to the active bottleneck produces measurable wins while it builds the discipline for broader rollout. In the greenfield archetype, the first SE-governed sprint produced 53% component reuse from the existing design system.

## How the Methodology Compares at This Zone

![How each zone addresses the three components of the Manual Translation Tax](/diagrams/mtt-by-zone-resolution.svg)

At Zone 1 the three components of the tax are unchanged, and AI velocity amplifies the ambiguity. At Zone 2 each component is partially addressed. At Zone 3 each is addressed.

| Manual Translation Tax component | Zone 1: Manual / Vibe Coding | Zone 2: Spec-Driven Development | Zone 3: SDD + Semantic Engineering |
|---|---|---|---|
| **Ambiguity** in custodian-to-developer translation | Amplified by AI velocity; the same five-word phrase produces different code on different days | Partial: a written intent contract per change reduces ambiguity at the product owner layer | Addressed: a structured ontology per custodian; the agent reads the same definition every team uses |
| **Non-persistence** of knowledge across handoffs | Unchanged: humans forget, and agent sessions reset every time | Partial: specs persist alongside code but decay under deadline pressure | Addressed: the graph compounds with every change; KG Sync auto-updates the Code Ontology on every merge |
| **Non-traceability** across intent, design, architecture, code | Unchanged: no structural link from prompt to commit to incident | Partial: spec-to-commit traceability instrumented at the ticket level | Addressed: the cross-layer graph links every functional outcome to its design components, architecture services, and code modules |

The difference shows up in the team's day-to-day practice. The table below compares a mature Zone 2 practice with Zone 3.

| Practice | Zone 2: Spec-Driven Development | Zone 3: SDD + Semantic Engineering |
|---|---|---|
| Where the truth lives | The spec is the single source of truth for a change | Three sources: the spec for intent, the ticket system for progress, the knowledge graph for application state |
| Spec sprint | Lighter form: four-role human review running ahead of implementation | Full form: the same four roles, formalized as ontology custodians, producing impact-analyzed specs plus a refreshed graph |
| Impact analysis | Human-driven by the four participants; cross-team touchpoints reviewed by the architect from memory | The Impact Analysis Agent traverses the graph; a single query against a 1.6M LOC graph takes about eight minutes |
| Spec freeze | After four-role sign-off | After agent and custodian sign-off |
| Context the coding agent receives | The signed spec, the constitution, supervisor skills, and existing codebase context; more context is loaded into the prompt as changes grow | The impact report as a markdown adjunct to the spec; the agent queries the graph for the slice each task needs |
| Code review | Architectural, implementation, and spec-conformance review; reviewers also check whether the agent touched the right files | The impact report answers which files, services, and components; review focuses on whether the implementation detail is correct |
| Merge gate | CI drift detection plus manual review, alongside the team's security scanning | The PR Validation Agent checks every merge against all four ontologies, alongside the existing CI pipeline |
| Test scenarios | BDD scenarios written from the spec's must-haves, often agent-produced and refined by the QA lead | The BDD Generation Agent generates scenarios from the Functional Ontology; teams typically reach 93.4% test coverage with zero manual BDD overhead |
| Knowledge after merge | The spec history persists; architecture, design, and codebase knowledge still decay in their own artifacts | KG Sync updates the graph on every merge; the next impact analysis runs against current reality |
| Team shape | Small feature pods: product owner, shared architect, dev lead, QA lead | Three layers: custodianship (the four custodians), implementation teams, and an enablement layer beneath them |

Several things carry over from Zone 2 unchanged. The spec remains the canonical intent for a change. The ticket system remains the progress-tracking source of truth. Engineers still write or generate code, code review still happens, and existing CI/CD pipelines still work, with validation gates added. The full list is in [What Stays the Same](zone-2-spec-driven-development.md#what-stays-the-same).

One thing carries over from all three zones: the four custodians stay human. What changes at Zone 3 is the medium each custodian works in. Agents draft ontology updates that the custodian reviews and approves, propose entries from extracted patterns, and enforce the ontology at merge. The custodian's judgment continues to drive the decisions. The argument is in [Where We Draw the Line on Automation](../translation-tax.md#where-we-draw-the-line-on-automation).

## When This Zone Stops Working

Zone 3 stops working in two ways. The work can outgrow it, or the discipline that keeps the graph current can erode.

**The work spans products.** Zone 3 is single-product Semantic Engineering: one knowledge graph, one product. The methodology builds one graph per product rather than one graph across the portfolio, because query performance decides it. A single Impact Analysis query against a 1.6M LOC application graph takes about eight minutes, which is an acceptable runtime budget for the spec sprint. A monolithic graph spanning ten such applications does not produce useful results in any reasonable runtime budget. When changes regularly affect other products, the questions change: what in other products is affected, and what duplicated capability exists across products. Those questions are answered by the Cross-Product Impact Extension and the Portfolio Rationalization Agent, which the process page places in Zone 4. See [Partition by Product](../methodology.md#partition-by-product).

**The work needs sustained operation across years and multiple engagement teams.** At Zone 3 the operating model is a workstream with its custodians, its implementation team, and an enablement layer that is still forming. Holding the knowledge asset across years under codified engagement principles is the custodianship mode of Zone 4, supported by [The Enablement Partnership](../process/enablement-partnership.md).

**Sync stops being continuous.** A team that runs sync on a quarterly cadence rather than on every merge loses the benefit of the methodology. Within one quarter the graph drifts far enough that the Impact Analysis Agent's outputs become unreliable. The team starts working around the impact analysis, and within two quarters the team is operating at Zone 2 again, with a stale graph as an additional maintenance burden. See [Why Sync Must Be Continuous](../agents.md#why-sync-must-be-continuous).

**The aperture opens too wide.** A common first instinct is to put everything into the knowledge graph. Within a few sprints the maintenance burden overwhelms the team, and the methodology gets blamed for the failure. The default is exclusion, and elements enter when their blast radius warrants it.

**The operating model does not catch up.** The methodology rolls out in weeks. The operating model that delivers its full value is a change-management exercise that runs across quarters: team structure, incentives, and how engineers are evaluated all change. The methodology produces partial value before the operating model catches up. The full value depends on the operating model. See [Change Management Considerations](_index.md#change-management-considerations).

| If your team is hitting | The signal you will see |
|---|---|
| Work spanning products | Changes in one product need answers about other products that one graph cannot give |
| Multi-year, multi-team custody | The knowledge asset needs ownership beyond the life of a single workstream or engagement team |
| Sync falling behind | Impact reports that no longer match the code; the team working around the impact analysis |
| Aperture too wide | Graph maintenance consuming the team's attention |
| Operating model lagging | Partial value from the graph while the team structure, incentives, and evaluation stay as they were |

The first two are signals to move up to Zone 4. The last three are signals that the Zone 3 discipline needs repair before anything else.

## Readiness Criteria to Move to Zone 4

The work is ready for Zone 4 when any of the following hold.

- The work spans multiple products
- Changes require cross-product reasoning that no single product graph can answer alone
- The work needs sustained operation across years and multiple engagement teams

The Zone 3 foundation should be in place first. Most enterprise teams that adopt SE stabilize at Zone 3 for several quarters. The [Phase 2 gate](../../practitioner/_index.md#phase-2-se-foundation) for a sustainable Zone 3 operating model is that all four ontologies pass the P0 verification suite, the Impact Analysis Agent runs successfully against real specs, the PR Validation Agent has caught at least one cross-team conflict before integration, and the team uses the impact report routinely as part of spec review.

## From SDD plus SE to SE at Scale

Zone 4 is the operating mode at portfolio scale. Multiple products operate under their own knowledge graphs. Cross-product reasoning happens through the Cross-Product Impact Extension and the Portfolio Rationalization Agent. The client's four custodians continue to own the four ontologies, and the Engineering Team's custodianship expands to include the agent fleet. The developer moves upstream from the per-change loop into custodianship of the agent fleet. The agents run the loop.

### What Changes for the Implementation Team

The shift is gradual. Each agent in the fleet earns higher autonomy through demonstrated evidence, governed by [Progressive Autonomy](../agents.md#progressive-autonomy) and Promotion Agreements.

| Dimension | Zone 3 | Zone 4 |
|---|---|---|
| Developer's per-change role | Reviews the coding agent's output, applies implementation judgment, refines | Reviews the agent's audit trail, catches edge cases the impact report missed |
| Developer's upstream role | Light: occasional agent prompt refinement | Substantial: custodian of the agent fleet, approves Promotion Agreements, reviews the audit trail on cadence |
| What runs the per-change loop | Developer and coding agent together | The agent fleet, with developer custodial oversight |
| What blocks at merge | PR Validation Agent against the graph | The same; the gate does not change |
| What the engineering team optimizes for | Implementation judgment, code quality, edge case handling | Agent reliability, prompt quality, autonomy threshold calibration |

The progression happens agent by agent. A team can be at Zone 4 on Impact Analysis while still at Zone 3 on the Coding Agent. The team's overall zone is the floor across the fleet. The detail is in [Zone 4: Agents Run the Loop](../process/implementation-sprint.md#zone-4-agents-run-the-loop).

### Time to Value

| Transition | Typical adoption time | Typical first measurable result |
|---|---|---|
| SE single product to SE at scale | Quarters to years depending on product count and custodial maturity | First cross-product query that no single graph could answer alone |

At portfolio scale the spec sprint runs in full SE form plus cross-product reconciliation. See [When the Spec Sprint Is Worth a Separate Cadence](../process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence).

> **How Accion Labs operationalizes Zone 3**
>
> The [Breeze.AI platform](../../practitioner/breeze-ai.md) implements the four-layer knowledge graph, the brownfield extraction process, the per-change SDLC flow, the four-ontology validation gate, and the agent fleet. The [Engagement Model](../engagement-model.md) staffs the operating model across Advise, Launch, Scale, and Optimize phases.

---

Next: [Process](../process/_index.md) covers the operating model that runs Zone 3 day to day. [Zones of AI-Assisted SDLC](_index.md#zone-4-se-at-scale) describes Zone 4, the operating mode at portfolio scale.
