---
title: "Zone 2: Spec-Driven Development"
description: "Written specifications as the contract AI agents generate against. Where this zone is genuinely suitable, the four ceilings it hits at enterprise scale, and the transition to Semantic Engineering."
weight: 20
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
  - product-owner
---

![Zone 2: Spec-Driven Development](/diagrams/zone-2-sdd.svg)

The diagram shows what changes when SDD lands. The persistent context up top is still four custodians and four codified artifacts, but the prose specs box has flipped from red to amber: spec authoring is now structured, supported by tools like AWS Kiro, GitHub Spec Kit, Tessl, or an in-house markdown library. The other three artifacts (architecture wiki, Figma handoffs, codebase tacit knowledge) are still red and still decay. The SDLC flow lengthens to five stages: spec authoring with tools, cross-functional spec review, developer plus coding agent generating against the spec, CI drift detection plus manual review, then code. The translation tax is reduced at the spec-to-code link (because the spec is now structured) but is still paid for everything the spec does not cover: architecture, design, cross-team contracts, codebase reality.

## The Manual SDLC Problem This Zone Addresses

The Zone 1 ceiling is the absence of a contract. The product owner says "let users do X". Three developers interpret X differently. Code review three sprints later is when the reconciliation happens, by which point the divergence has shipped to staging. The team is paying the ambiguity component of the Manual Translation Tax on every change.

SDD makes the contract explicit. Every change of meaningful size gets a written specification before code is generated. The spec captures acceptance criteria, out-of-scope items, and a brief "why now". AI agents generate against the spec rather than against conversation.

## Where the Team Is

Every change of meaningful size is preceded by a written specification. The spec is versioned alongside the code. Reviewers have a contract to verify against. AI-generated output can be checked structurally against the spec.

## What the Team Operates With

The AI tool plus a verifiable per-change contract. Outputs can be checked against the spec. Reviewers have a contract to verify against.

## When This Zone Is Genuinely Suitable

![Decision diagram: when SDD fits, a single team, one clear owner per layer, codebase small enough to hold in one head](/diagrams/zone-2-when-suitable.svg)

SDD is the right operating mode for a substantial set of contexts. For these teams, the spec is the right granularity of structure and adding ontologies would be overhead without payback.

| Context | Why SDD is sufficient |
|---|---|
| Single team, single product, single repository | One person can hold the architecture, product mechanics, and design system in their head. The spec carries the per-change intent; the team's mental model carries the structural context. |
| Greenfield project with one clear owner per layer | The product owner, architect, and designer triangle is small enough to coordinate verbally between spec sprints. Architecture and design decisions live in the team's collective memory at acceptable accuracy. |
| Mid-size applications without significant brownfield complexity | Codebase is small enough that "where does X live" is answerable without a knowledge graph. The team's tenure on the code is long enough that tacit knowledge is fresh. |
| Early-stage B2B SaaS in the one-to-two-year range | The product surface is still small. Cross-team coordination has not yet emerged because there is only one team. Time-to-market matters more than long-term context infrastructure. |
| Internal tooling for a single team | The audience and the producer are the same team. Cross-team integration risk is zero by design. |

Examples that fit the pattern: a five-engineer startup shipping a single B2B product where the founding architect is still hands-on; a platform team inside a larger company maintaining one well-bounded internal service where the team owns the entire stack; a greenfield rebuild where the original system's complexity has been deliberately left behind and the new system is small enough that one architect can hold its current shape.

## When This Zone Stops Working

![The four SDD ceilings: localized context, spec drift, single-layer coverage, specs as bottleneck](/diagrams/zone-2-four-ceilings.svg)

SDD raises the floor. It does not change the medium. The spec is still text, and the spec captures one custodian's view (the product owner's). The four ceiling conditions appear in roughly the order below.

**Localized context.** A team-A product owner writes a spec for an alert frequency feature. The spec is reviewed by the team-A tech lead, approved, and handed to the AI agent. The agent generates code that adds a write to a shared notification-preferences table. Team B has been migrating that table to a new schema for six weeks and has a PR open that drops two columns the team-A change relies on. Team B's architect never saw team A's spec. Team A's PO never saw team B's migration plan. Both PRs merge in the same week, integration breaks on a Friday afternoon, and the production hotfix takes the weekend. The spec was correct against team A's local view. There was no place in the SDD workflow for either architect to look across the boundary, because the architects' view is not part of the spec.

A different version of the same ceiling appears on brownfield work. The PO writes a spec for changing how renewal reminders are scheduled. The spec describes the new behavior cleanly. The existing 1.6M LOC application has the current behavior scattered across four services, a cron job that nobody on the current team set up, and a sproc in the reporting database that someone added in 2021 as a stop-gap and never removed. The architect would know about three of those four locations from memory. The spec captures none of them. The agent generates code that updates the obvious location and the team discovers the other three when customers complain.

**Spec drift.** A product owner writes a spec in Sprint 3 that depends on the saved-search service owning alert preferences. The architect refactors in Sprint 5, moves alert preferences to the notification service because saved-search became a bottleneck, and updates the architecture wiki. Nobody updates the spec. In Sprint 8, a new feature spec is written by a junior PO who reads the original spec for context, repeats the assumption that alert preferences live in saved-search, and the agent generates code against that assumption. The change merges and silently writes to a table that the notification service reads from but does not write back to. The bug surfaces three weeks later when a customer support ticket walks the team back through the chain.

The architect updated her artifact. The PO updated her artifact. Neither of them had a structural way to see that the architect's update broke the assumptions in the PO's earlier spec. Spec drift is what happens when the three custodians maintain their own slices and nobody maintains the connection between them.

**Single-layer coverage.** SDD tools like AWS Kiro, GitHub Spec Kit, and Tessl capture functional intent, which is the product owner's contribution. They do not structurally capture the architecture (the architect's contribution) or the design system (the designer's contribution). A spec says "add a configuration form for alert preferences with daily, weekly, and off options". The agent generates the form, picks a Dropdown because that is what the model has seen most often in training, places the API call in the saved-search service because the spec mentioned saved searches, and uses inline labels because the spec did not specify visual treatment. The form ships. The designer notices in a sprint demo that the Dropdown should have been a SegmentedControl, that the team has a guideline against inline labels for short option sets, and that the visual treatment violates two design tokens. The architect notices the API call should have gone through the notification service. Both noticed too late. Their context was not in the spec the agent read because the spec captures only the PO's layer.

**Specs become the new bottleneck.** Once the team has hit the three ceilings above, the obvious fix is to make the specs richer. Bring the architect into spec review. Bring the designer into spec review. Make sure every spec covers all the angles the agent needs. We have watched several teams attempt this. It does work, in a sense: the specs get more accurate and AI-generated code gets more reliable. But the throughput collapses. The PO can write specs at the rate she can think; the architect can review them at the rate she has free time, which is not much because she is also fielding the Slack DMs from Zone 1; the designer is in the same boat. The team's senior people end up spending their week in spec authoring and review meetings while the implementation engineers wait for input. The bottleneck moves from typing to thinking, and the operating model is not configured to absorb the shift. The cost structure no longer aligns with FTE-based estimation, because the work the team needs is no longer the work the team is staffed for.

## The Pattern

The four conditions compound. A team can survive one. A team that hits two or three at the same time will not survive without changing the substrate.

| If your team is hitting | The signal you will see |
|---|---|
| Just localized context | Cross-team integration produces surprises that should have been predicted |
| Just spec drift | AI-generated outputs that are confidently wrong against the current system |
| Just single-layer coverage | Design system erosion, architectural boundary violations, broken downstream consumers |
| Just specs becoming the bottleneck | The team's senior people stuck in spec-authoring meetings rather than shipping value |
| Three or four at once | All of the above, simultaneously, with engineering velocity declining despite more AI tool adoption |

Most enterprise teams hitting the ceiling are in the last row.

## Readiness Criteria to Move to Zone 3

The team is ready to extend SDD with SE when at least three of the following hold.

- Cross-team integration is producing surprises the per-change specs did not predict
- The application has grown past the point a single engineer can hold its full structure in their head
- Brownfield work consumes more than a third of sprint capacity
- Two or more teams are working on the same product and informal coordination is breaking down
- The team has hit at least one production incident traceable to AI-generated code that violated an unstated architectural or design constraint

## From SDD to SE

Once an SDD discipline is in place, the addition of a structured knowledge graph is what carries the team to Semantic Engineering. The relationship between SDD and SE is straightforward: SE is a strict superset of SDD. Every team that has adopted SDD reaches SE faster because the spec authorship habits transfer directly. The ontology becomes the additional shared artifact the specs feed into and are validated against.

### What the Knowledge Graph Adds

Semantic Engineering is additive to SDD. The specification remains the canonical articulation of intent for a change. SE adds a second source of truth: the knowledge graph, which captures the application's current reality at a level the agent can traverse and validate against.

| Ceiling condition | What the methodology changes |
|---|---|
| Localized context | The four-layer knowledge graph provides global context across functional, design, architecture, and code. Every change is validated against all four layers, not just the local spec. |
| Spec drift | The graph auto-updates on every PR merge. The agent operates against current reality every commit, without manual upkeep. |
| Single-layer coverage | Each of the four layers has its own ontology with its own validation. Design system enforcement is structural. Architecture boundaries are checked at merge. |
| Specs becoming the bottleneck | Specs are produced on their own cadence (the spec sprint), validated by the Impact Analysis Agent against the graph, and consumed by the implementation sprint as input. The bottleneck moves from sequential to parallel. |

The mechanism is consistent across all four. Add structure where the spec alone is failing. Let the agent consume the structure as additional context. Validate every change against the structure at merge time. The structure is the knowledge graph. The depth treatment of the substrate is in [Semantic Knowledge Graphs](../methodology.md). The operating model that runs the substrate is in [Process](../process/_index.md).

### What Stays the Same

The methodology is additive. The things the team already does well do not change.

The spec remains the canonical intent for a change. SDD discipline transfers directly. The ticket system (Jira or whatever the team uses) remains the progress-tracking source of truth. Project management does not change. The codebase remains the implementation source of truth. Engineers still write or generate code. Code review still happens; reviewers focus on judgment calls rather than context assembly. Existing CI/CD pipelines still work; the methodology adds validation gates rather than replacing them.

What changes is what the agent has access to, and what the merge gate enforces. The team's day-to-day rhythm shifts toward higher-leverage activities, but the artifacts the team is accustomed to producing remain.

### What Changes for the Team

The SDD-to-SE transition changes what the team produces and how the team is composed. Both shifts are operational and both are worth planning for.

**What the team produces.** The deliverable shape changes from "running code aligned to specifications" to "running code aligned to specifications plus an evergreen knowledge graph that makes every future change cheaper." The graph becomes a continuously evolving asset the team owns alongside the code base.

**How the team is composed.** The transition has two phases with different team shapes. The first is an **upfront investment**: a team of semantic engineers (typically provided by Accion Labs) extracts the four-layer knowledge graph from the existing codebase, design system, and product documentation. For a 2M+ LOC application this typically completes in two to three weeks. The deliverable of this phase is the populated graph, the verification suite passing on it, and the agent fleet wired up against it. Once the graph is in place, the team shape shifts to **ongoing custody**: the four custodians take over each layer of the graph: the product owner for the Functional Ontology, the architect for the Architecture Ontology, the UX designer for the Design Ontology, and the engineering team for the Code Ontology. Each custodian is assigned at least on a fractional basis per workstream to review and update their layer of the graph as the product evolves: participating in the spec sprint, reading the impact reports that touch their ontology, and extending it when their domain changes. The materialized view of the graph keeps the re-entry cost low, so the same custodian can cover more than one workstream at the same depth of judgment. The staffing pattern is **fractional allocation**: specialists engaged at the moments their judgment creates value, sized to the deliverable rather than to a calendar quarter.

Both shifts are developed in [Team](../process/team.md). The adoption playbook with phase gates and team composition is in [Three-Phase Rollout](../../practitioner/_index.md#three-phase-rollout).

> **How Accion Labs operationalizes this**
>
> The [Breeze.AI platform](../../practitioner/breeze-ai.md) implements the four-layer knowledge graph, the brownfield extraction process, and the Impact Analysis Agent. The [ASIMOV platform](../../practitioner/asimov.md) is the peer agentic platform that applies the same Semantic Engineering principles to legacy modernization, with a focused subset of the ontologies and a fully agentic flow.

---

Next: [Semantic Knowledge Graphs](../methodology.md) covers the substrate that Zone 3 introduces. [Process](../process/_index.md) covers the operating model that runs on top of the substrate.
