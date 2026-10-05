---
title: "The Agile and Scrum Baseline"
description: "The distributed Scrum operating model most enterprise teams run today, what it was the right answer for, what AI changes about it, and how each of the four zones compares with it on team shape, cadence, specification, estimation, review, and the Manual Translation Tax."
weight: 5
date: 2026-10-05
lastmod: 2026-10-05
draft: true
audience:
  - cto
  - vp-engineering
  - engineering-manager
  - product-owner
  - tech-lead
---

The conventional enterprise engineering team runs distributed Scrum: it plans in sprints, keeps a backlog, estimates in story points, and reviews code before it merges. The four zones on this site describe changes relative to that team. This page sets out that starting point: the Agile and Scrum operating model as the methodology describes it, what it was the right answer for, what AI changes about it, and how the methodology's recommendations at each zone compare with it, element by element.

The short version is in [Team](../process/team.md): "The conventional distributed-scrum architecture was the right answer for the work engineers did ten years ago." AI compresses the work the engineer did and pushes the bottleneck upstream into specification, ontology curation, design system maintenance, and architecture currency.

## The Baseline Operating Model

The standard Scrum elements are defined in the [Scrum Guide](https://scrumguides.org/scrum-guide.html). In brief:

| Element | What it is |
|---|---|
| Sprint | A fixed-length timebox, one month or less, that produces a usable increment |
| Sprint planning | The event that starts the sprint, where the team selects backlog items and plans how to deliver them |
| Product backlog and refinement | An ordered list of what the product needs, which the team refines into smaller, more precise items ahead of planning |
| Daily scrum | A short daily event in which the developers inspect progress toward the sprint goal and adjust the plan |
| Sprint review | The team and stakeholders inspect the outcome of the sprint |
| Sprint retrospective | The team inspects how the sprint went and plans improvements to its way of working |
| Product owner | The person accountable for the value of the product and for ordering the product backlog |
| Story points and velocity | A relative estimation unit many teams use for backlog items, and the points completed per sprint (a common practice outside the Scrum Guide) |

At enterprise scale these elements run inside a distributed-scrum structure. The [Layered Team Structure in Depth](../process/team.md#layered-team-structure-in-depth) section describes its shape: each scrum team owned a workstream, contained all the disciplines needed to ship that workstream, and operated relatively independently. Coordination across teams happened through informal channels and occasional architecture reviews.

Specialists sit outside the scrum teams. In a conventional SDLC, roles like data architect, UX architect, and DevOps architect are typically engaged as one-time or quarterly inputs: they produce a design or a review, hand it off, and lose visibility into how it gets used ([Visibility Across Workstreams](../process/team.md#visibility-across-workstreams)). The architect is often available only at quarterly review cadence and the designer often only at the start of a workstream ([Forward-Deployed Engineers](../process/team.md#the-role)).

## What Distributed Scrum Was the Right Answer For

Distributed scrum was optimized for implementation throughput. It worked because giving each team enough autonomy to ship independently absorbed the largest cost of the pre-AI era: implementation hours. The trade-off (coordination cost, occasional duplication, drift in cross-team architecture) was accepted because the alternative, everything routing through a central bottleneck, was costlier ([How the Layered Structure Complements Distributed Scrum](../process/team.md#how-the-layered-structure-complements-distributed-scrum)).

The model still fits some work as it is. For a small greenfield team with a single product, a single repository, no cross-team dependencies, and one person who can hold the full context, the conventional sprint cadence with spec authorship at the start of the sprint works, and a separate specification cadence adds overhead without payback ([When the Spec Sprint Is Worth a Separate Cadence](../process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence)).

## Where the Manual Translation Tax Sits in a Sprint

![A single sprint, one developer's day: five bilateral threads paying the Manual Translation Tax](/diagrams/sprint-communication-breakdown.svg)

The sprint is where the [Manual Translation Tax](../translation-tax.md) is paid. The product owner's knowledge of why a feature exists is refined through sprint planning conversations, customer calls, and demo feedback, and is rarely in the ticket. In the worked example on [What This Looks Like on a Sprint](../translation-tax.md#what-this-looks-like-on-a-sprint), a developer implementing one feature from a one-paragraph user story sends five bilateral messages to the product owner, the architect, the designer, and two other developers. Each interaction is unrecorded, and none of them is captured anywhere the next developer can find.

The same three components of the tax show up as specific friction across sprints ([How It Shows Up in a Sprint](../translation-tax.md#how-it-shows-up-in-a-sprint)):

| Component | How it appears in the baseline |
|---|---|
| Ambiguity | The product owner writes "let users do X". Three developers interpret X slightly differently. The reconciliation happens in code review three sprints later. |
| Non-persistence | The architecture decisions made in Sprint 1 are no longer documented anywhere. The engineer who knew where everything lived left two months ago, and the team has been rediscovering what she knew. |
| Non-traceability | A change to one concept breaks a worker in another repository because no document linked the two, and the team had no structural way to ask what else depended on the concept. |

The cumulative effect is that ten-engineer teams cannot ship faster than five-engineer teams once the application crosses a complexity threshold. In the baseline the tax is paid through people: Slack DMs, peer pings, ad hoc conversations, and the senior engineer's memory.

## What AI Changes About the Baseline

AI compresses implementation, which was the cost distributed scrum was built to absorb. The bottleneck moves upstream into specification, design, architecture, ontology curation, and cross-product reasoning, and the scrum team's structure does not contain those disciplines at the depth the new work requires ([Layered Team Structure in Depth](../process/team.md#layered-team-structure-in-depth)). Adding more engineers to a spec-bound project produces no acceleration, because the skill mix is wrong.

The shift shows up in each zone in a different form.

- At Zone 1, the custodians' input arrives ad hoc and unrecorded, and code review, which the team expected to get faster, gets slower: the AI-generated diff is four times bigger and the reviewer is doing four times the reverse engineering ([When This Zone Stops Working](zone-1-manual-vibe-coding.md#when-this-zone-stops-working)).
- At Zone 2, specification authorship and implementation get compressed into one timebox, and once the team enriches its specs, the team's senior people spend their week in spec authoring and review while implementation engineers wait. The cost structure no longer aligns with FTE-based estimation ([When This Zone Stops Working](zone-2-spec-driven-development.md#when-this-zone-stops-working)).
- On the most operationally mature SDD practice in the case archetypes, the collaboration patterns that absorbed load in agile have no equivalent, and engineers work in an asynchronous loop with the agent once the spec is approved ([The SDD Ceiling in Operation](../case-archetypes.md#the-sdd-ceiling-in-operation)).

The methodology's response is a different team shape and a separate cadence for specification. The [Spec Sprint](../process/spec-sprint.md) gives specification its own cadence, because the old pattern of writing the spec at the start of the implementation sprint compresses two distinct activities into one timebox and both are done poorly ([Why a Separate Cadence](../process/spec-sprint.md#why-a-separate-cadence)).

## How the Methodology Compares with the Baseline

![How each zone addresses the three components of the Manual Translation Tax](/diagrams/mtt-by-zone-resolution.svg)

The table compares the baseline with each zone. Every cell is drawn from the zone and process pages; where they say nothing about an element at a zone, the cell says so.

| Element | Agile and Scrum baseline | Zone 1: Manual / Vibe Coding | Zone 2: Spec-Driven Development | Zone 3: SDD plus Semantic Engineering | Zone 4: SE at Scale |
|---|---|---|---|---|---|
| Team shape | Distributed scrum teams, each owning a workstream with all the disciplines to ship it. Specialists outside the team, called in occasionally with significant ramp each time. | Single-developer scope, no team coordination. Custodian input arrives by ad hoc message. | One PO, architect, and designer triangle that can coordinate verbally. Mature practices run small feature pods (PO, dev lead, QA lead, shared architect). | Three layers: custodianship (the four ontology custodians), implementation teams, enablement. Specialists allocated fractionally, with continuous visibility through the graph. | Same three layers. The Engineering Team's custodianship expands to the agent fleet, and the developer moves upstream from the per-change loop. |
| Cadence | Sprints, with the spec written at the start of the implementation sprint. Architecture review as a quarterly event. | No change described. | Spec authorship becomes a hard gate before sprint planning. Mature practices run async, closer to project execution than to daily-standup agile, and deploy per feature. A lighter spec sprint can run one or two sprints ahead. | Spec sprint one or two sprints ahead of the implementation sprint, which keeps the regular team sprint cadence. Enablement runs quarterly and on trigger. | Same two sprints. Each agent earns autonomy on its own evidence; the Engineering Team reviews the audit trail on a defined cadence. |
| Backlog and specification | A one-paragraph user story; intent refined in sprint planning conversations and rarely in the ticket. | Specification vague and often verbal, living in tickets, chat threads, or the developer's head. | A written spec per change, versioned with the code, reviewed by PO, architect, and tech lead before the sprint commits to it. | Impact-analyzed specification. Separate spec sprint and implementation backlogs, with a push-back loop for specs missing custodian context. | Same, with the Cross-Product Impact Extension run in the spec sprint for changes that cross product graphs. |
| Estimation | Story points and sprint velocity. Vendor cost is engineer-hours times rate. | No change described. | Leadership still asks for story points. Teams superimpose historical sprint velocity on SDD output, which the team calls "not ideal". | Velocity rises: a scrum team that delivered five story points per sprint may deliver fifteen or twenty against the same effort budget. Effort-based engagement continues. | No zone-specific change described. The deliverable-based engagement (validated graph, agent fleet, graph-health SLA) is the structural response to effort-shaped estimation. |
| Review | Manual code review, where reconciliation of differing interpretations happens. The reviewer opens the PR, the ticket, the spec, and the architecture page. | Manual review with no contract to check against. Review gets slower as diffs grow. | Review against the spec, with CI drift detection. In mature practice, architectural, implementation, and spec-conformance review; PRs of 300 to 400 files can take two weeks or more. | The PR Validation Agent checks every merge against all four ontologies. The developer reviews the coding agent's output; reviewers focus on judgment calls rather than context assembly. | The developer reviews the agent's audit trail and catches edge cases the impact report missed. The merge gate does not change. |
| Knowledge held between sprints | In heads, wikis, and unrecorded conversations. Documentation decays under deadline pressure. | Unchanged: humans forget, and agent sessions reset every time. | Specs and the constitution persist alongside the code; the other artifacts still decay. | The graph compounds with every change. KG Sync updates the Code Ontology on every merge, so the next spec sprint runs against the current graph. | Sustained across multiple products, held by the custodians across years. |
| Ambiguity | "Let users do X" read three ways; reconciled in code review three sprints later. | Amplified by AI velocity: the same five-word phrase produces different code on different days. | Partial: a written intent contract per change reduces ambiguity at the product owner layer. | Addressed: a structured ontology per custodian; the agent reads the same definition every team uses. | Sustained across multiple products and teams. |
| Non-persistence | Knowledge leaves with people and is rediscovered after something breaks. | Unchanged. | Partial: specs persist alongside code but decay under deadline pressure. | Addressed: the graph compounds with every change. | Sustained across multiple products via cross-product extensions. |
| Non-traceability | No structural way to ask what else depends on a concept before changing it. | Unchanged: no structural link from prompt to commit to incident. | Partial: spec-to-commit traceability instrumented at the ticket level. | Addressed: the cross-layer graph links every functional outcome to its design components, architecture services, and code modules. | Sustained across products; cross-product impact analysis follows the same model. |

Read across a row, the change from the baseline is cumulative: each zone keeps what the previous zone provided and adds the response to a failure the previous zone cannot handle at the higher complexity range. The full mapping of the three tax components is in [The Detailed Mapping by MTT Component](_index.md#the-detailed-mapping-by-mtt-component).

## What Carries Forward from the Baseline

The methodology keeps much of the baseline in place. The implementation layer continues to do what distributed scrum has always been good at, now under structural validation and at higher velocity ([How the Layered Structure Complements Distributed Scrum](../process/team.md#how-the-layered-structure-complements-distributed-scrum)).

| Baseline element | What happens to it |
|---|---|
| The sprint | The implementation sprint runs at the regular team sprint cadence ([The Two Sprints](../process/_index.md#the-two-sprints)) |
| The ticket system | Remains the source of truth for progress, ownership, and sprint status. Project management does not change ([What Stays the Same](zone-2-spec-driven-development.md#what-stays-the-same)) |
| The backlog tool | Both backlogs can live in the team's existing platform, distinguished by labels or boards |
| In-team roles | Product Designer, UX Designer, Solution Architect or Tech Lead, and Implementation Engineers remain continuous and embedded in the workstream's scrum cycle ([The Evolving Role Mix](../process/team.md#the-evolving-role-mix)) |
| The product owner | Owns the spec sprint and becomes custodian of the Functional Ontology |
| Code review | Still happens; reviewers focus on judgment calls rather than context assembly |
| Sprint planning | Rationalization findings from the graph flow back into normal sprint planning ([Extraction as Rationalization](../methodology.md#extraction-as-rationalization)) |

The three sources of truth make the division explicit. The specification carries intent for a change, the ticket system carries progress and sprint status, and the knowledge graph carries application state ([Three Sources of Truth](../process/_index.md#three-sources-of-truth)). The baseline already had the first two; the methodology adds the third.

## Estimation Against Story Points

Estimation is where the baseline and AI-assisted work meet most directly. On the SDD-mature engagement described in [SDD at the Governance Ceiling](../case-archetypes.md#sdd-at-the-governance-ceiling), leadership wants productivity expressed in story points because that is the framework the rest of the portfolio runs on. The engagement lead put it this way:

> "Estimation is a bad problem because the entire leadership is agile focused. They understand story points but SDD does not have a story point. We are juxtaposing historical data: sprint velocity for past five sprints, and after using SDD, how many story points we have been able to deliver. It is not ideal."

The team writes effectively no code by hand, and the reported metric is sprint velocity superimposed on agent output as a comparison number ([Phase 1: Effort-Based Engagement](../process/team.md#phase-1-effort-based-engagement-current-market-posture)). The effort frame still works for procurement, but it describes the work less and less accurately.

The methodology addresses this in two stages. In the first, effort-based engagement continues, and velocity measured in story points rises as implementation time compresses under structural validation. In the second, the engagement frame shifts to the deliverable: a validated four-layer knowledge graph, a validated agent fleet, and a graph-health SLA, with clients committing to the asset and its quality guarantees ([Phase 2: Deliverable-Based Engagement](../process/team.md#phase-2-deliverable-based-engagement)). The same engagement model supports both.

## Moving from the Baseline

The right zone for any workstream is set by the complexity of its work, and the same team may operate at different zones for different workstreams ([Zones of AI-Assisted SDLC](_index.md)). A team on the baseline moves first to Spec-Driven Development, which takes four to six sprints, with the first measurable result a reduction in code review burden ([Time to Value at Each Transition](_index.md#time-to-value-at-each-transition)). Sprints 1 and 2 of that transition should be expected to feel slower than the team's pre-SDD baseline; the improvement starts in Sprint 3 ([From Manual to SDD](zone-1-manual-vibe-coding.md#from-manual-to-sdd)).

The move from distributed scrum to the layered structure takes longer. [How the Transition Is Managed](../process/team.md#how-the-transition-is-managed) lays it out across four quarters: a first Forward-Deployed Engineer and a pilot spec sprint in Quarter 1, a stable spec sprint cadence in Quarter 2, implementation teams adapting to impact-analyzed specs in Quarter 3, and a stable layered structure in Quarter 4. The methodology can be rolled out in weeks, while the operating model that delivers its full value matures across quarters.

Engineers adjust too: they contribute across more than one workstream, consume specs they did not author, and follow the validation gate at merge.

---

The four zones are covered in depth in [Zone 1: Manual / Vibe Coding](zone-1-manual-vibe-coding.md), [Zone 2: Spec-Driven Development](zone-2-spec-driven-development.md), [Zone 3: SDD plus Semantic Engineering](zone-3-sdd-plus-semantic-engineering.md), and [Zone 4: SE at Scale](zone-4-se-at-scale.md). [Team](../process/team.md) covers the layered structure that replaces distributed scrum, and [Spec Sprint](../process/spec-sprint.md) covers the cadence that runs ahead of implementation.
