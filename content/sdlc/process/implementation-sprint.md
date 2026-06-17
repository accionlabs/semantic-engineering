---
title: "Implementation Sprint"
description: "The per-change SDLC flow that consumes refined specs and runs them through the agent fleet, from impact analysis through PR validation to KG sync. How the developer role evolves as the agents take on more of the loop."
weight: 20
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
---

The implementation sprint consumes the impact-analyzed specifications produced by the [Spec Sprint](spec-sprint.md) and runs them through the per-change SDLC flow. Each change moves left-to-right through the agent fleet under structural validation. The Code Ontology stays current as a side effect of every merge.

## The Per-Change SDLC Flow

![The per-change SDLC flow: six stages from spec pull through PR validation to KG sync, with the structural gate highlighted](/diagrams/per-change-sdlc-flow.svg)

A specification enters the flow from the left, one of many flowing through in parallel.

| Stage | What runs | What it produces |
|---|---|---|
| 1. Spec pulled from backlog | The product owner (via the implementation sprint backlog in Jira or equivalent) | An impact-analyzed spec, validated in the prior spec sprint, ready for the implementation team |
| 2. Impact Analysis Agent | The [Impact Analysis Agent](../agents.md#the-impact-analysis-agent) traverses the four-layer graph for the spec | A pre-implementation impact report: which functional outcomes are touched, which design components, which architecture services, which code modules and database tables |
| 3. Coding Agent | A coding agent generates code under the impact report's structural plan | A draft implementation, scoped to the impact report's surface |
| 4. Developer review (Zone 3) or autonomous execution (Zone 4) | At Zone 3, the developer reviews and refines. At Zone 4, the agent runs the loop and the developer reviews the agent's audit trail. | Code ready for PR |
| 5. PR Validation Agent | The [PR Validation Agent](../agents.md#the-pr-validation-agent) checks the merge against all four ontologies | Pass or fail. A failing merge is blocked until the underlying structural violation is fixed. |
| 6. Code merge + KG Sync | The merge lands. The [KG Sync Agent](../agents.md#the-kg-sync-agent) updates the Code Ontology. | Updated graph. The next spec sprint runs against the current graph. |

The implementation sprint does not run impact analysis on the spec it receives, because it has already been done in the spec sprint. When the implementation sprint's Impact Analysis Agent (running for verification) detects a spec missing context that only the custodians can supply, the spec is pushed back to the spec sprint backlog. The implementation team does not block on it. They pull the next spec from the backlog.

## The Three Sources of Truth in Operation

The flow uses all three sources of truth (covered in [Three Sources of Truth](_index.md#three-sources-of-truth) on the Process landing) together.

| Step | Source consulted | Question answered |
|---|---|---|
| Spec pulled | Specification | What is the change supposed to do? |
| Spec correlated to ticket | Ticket system | Which workstream is this part of? Which team owns it? When is it scheduled? |
| Impact analysis | Knowledge graph | What will this change touch across all four layers? |
| Code generated and validated | All three | Implementation against the spec, validated against the graph, tracked in the ticket |
| Post-merge sync | Knowledge graph | The graph now reflects the change. Future impact analyses operate against the new state. |

After the change is merged, the same Impact Analysis Agent can rerun the analysis against the new state of the knowledge graph and compare the post-implementation reality against the pre-implementation specification. The three sources of truth, used together, are what make that comparison meaningful.

## Zone 4: Agents Run the Loop

At Zone 3, the developer is in the per-change loop, reviewing the coding agent's output and applying implementation judgment. At [Zone 4](../zones/_index.md#zone-4-se-at-scale), the agents run the loop and the developer moves upstream.

![Zone 4: Agentic SE at Scale](/diagrams/zone-4-agentic-se.svg)

The diagram shows the operating picture at Zone 4. Three custodial layers stack vertically. At the top, the four ontology custodians (PO, Architect, Designer, Engineering Team) keep the four-layer knowledge graph current. In the middle, the per-change SDLC flow runs through a six-stage agent fleet: Specification (PO extends the Functional Ontology), Impact Analysis Agent, Coding Agent (autonomous), Test Generation Agent, PR Validation Agent, and Code merge with KG Sync. At the bottom, a new custodial layer appears: the Engineering Team as custodian of the agent fleet, stewarding the four agents from Impact Analysis through PR Validation.

The Engineering Team's day-to-day in this mode includes approving Promotion Agreements that move agents to higher autonomy levels, reviewing the agent audit trail on a defined cadence, refining agent prompts when failure patterns emerge, catching the edge cases where the impact report missed something, and calibrating the policies that govern agent behavior. [Progressive Autonomy](../agents.md#progressive-autonomy) covers the agent-side discipline. [Engineering Team's Custodianship of the Agent Fleet](enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution) covers the human-side discipline that pairs with it.

## What Changes for the Implementation Team

The shift from Zone 3 to Zone 4 is gradual. The agent fleet does not become autonomous overnight. Each agent earns higher autonomy through demonstrated evidence, governed by [Progressive Autonomy](../agents.md#progressive-autonomy) and Promotion Agreements.

| Dimension | Zone 3 | Zone 4 |
|---|---|---|
| Developer's per-change role | Reviews the coding agent's output, applies implementation judgment, refines | Reviews the agent's audit trail, catches edge cases the impact report missed |
| Developer's upstream role | Light: occasional agent prompt refinement | Substantial: custodian of the agent fleet, approves Promotion Agreements, reviews audit trail on cadence |
| What runs the per-change loop | Developer + coding agent together | The agent fleet, with developer custodial oversight |
| What blocks at merge | PR Validation Agent against the graph | Same; the gate does not change |
| What the engineering team optimizes for | Implementation judgment, code quality, edge case handling | Agent reliability, prompt quality, autonomy threshold calibration |

The progression is not a single transition. Each agent in the fleet earns higher autonomy on its own evidence. A team can be at Zone 4 on Impact Analysis (the agent runs autonomously, dev reviews audit trail quarterly) while still at Zone 3 on the Coding Agent (dev still in the per-change loop). The team's overall zone is the floor across the fleet.

## What the Implementation Sprint Does Not Do

The implementation sprint does not author specifications. That is the [spec sprint's](spec-sprint.md) work. Trying to author specs inside the implementation sprint is the Zone 2 ceiling that the spec sprint discipline is designed to remove.

The implementation sprint does not make architecture decisions. Architecture decisions belong in the Architecture Ontology, maintained by the architect during the spec sprint. The implementation sprint executes against the validated specs.

The implementation sprint does not govern the knowledge graph. Graph governance is the enablement team's responsibility. The implementation sprint surfaces findings through PR validation failures and the merge events that trigger KG sync; the enablement team acts on the patterns.

> **How Accion Labs operationalizes the implementation sprint**
>
> The [Breeze.AI platform](../../practitioner/breeze-ai.md) runs the Impact Analysis, BDD Generation, PR Validation, and KG Sync agents that operate the per-change SDLC flow, integrating with external AI coding assistants for code generation. The [engagement model](../../practitioner/_index.md#engagement-models) staffs the implementation team and the Zone 4 custodial role evolution.

---

[Spec Sprint](spec-sprint.md) is the cadence that feeds the implementation sprint. [Team](team.md) covers the operating model that staffs both sprints. [The Agents](../agents.md) describes each agent in the per-change SDLC flow in detail.
