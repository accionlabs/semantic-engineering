---
title: "Process: Continuous SDLC Operating Model"
description: "The operating model that delivers continuous SDLC under Semantic Engineering. Spec sprints and implementation sprints running staggered. Layered team structure. Enablement partnership across years."
weight: 50
date: 2026-06-09
lastmod: 2026-06-12
draft: false
section: true
audience:
  - cto
  - vp-engineering
  - tech-lead
  - product-owner
  - architect
  - chief-architect
---

This is the operating model that delivers continuous SDLC. It is sprint-cadenced, custodian-owned, and runs continuously across years. The parallel operating model for legacy modernization is on the [Modernization Process](../../modernization/process/_index.md) section.

## The Structured Landscape

The diagram below pairs with the manual landscape from the [Manual Translation Tax](../translation-tax.md) page. External signals are unchanged. Custodians are unchanged. The medium they output to flips: from red text artifacts that have to be translated by every reader, to green machine-readable ontologies that the agent reads directly.

![The Structured Landscape: persistent context above, per-change SDLC flow below](/diagrams/structured-landscape.svg)

The top half is the persistent context the methodology maintains: the four custodians curate the four ontologies on an ongoing basis as the world changes. The bottom half is the per-change SDLC flow: a specification arrives on the left (one of many flowing through in parallel), the Impact Analysis Agent reads the spec plus the graph and emits an impact report, the developer and the coding agent both consume the report, code is produced, the PR Validation Agent checks it against the graph at merge, and the KG Sync Agent updates the Code Ontology on every merge. The graph feeds context into the Impact Analysis Agent and validation rules into the PR Validation Agent. The KG Sync Agent loops back into the Code Ontology so the graph stays current.

## The Two Sprints

Specification authorship runs ahead of implementation. Two sprint cycles run staggered, each with its own backlog, with a feedback loop between them.

| Sprint | What it produces | Backlog tool | Cadence |
|---|---|---|---|
| [Spec Sprint](spec-sprint.md) | Impact-analyzed specifications. Refreshed knowledge graph. | Posthog or equivalent (separate from implementation) | Runs ahead of the implementation sprint it feeds |
| [Implementation Sprint](implementation-sprint.md) | Code merged to master under structural validation. KG Sync updates the Code Ontology on every merge. | Jira, Linear, or equivalent | Regular team sprint cadence |

The two backlogs can live in the same platform, differentiated by labels or boards rather than separate tools. The discipline is what matters; the tool is the team's existing one.

## How the Sprints Coordinate

![Spec Sprint and Implementation Sprint: two backlogs, one feedback loop](/diagrams/spec-and-implementation-sprints.svg)

The four custodians participate in the spec sprint workshop (time-boxed to one or two days, batched across multiple pending change requests). The workshop produces two outputs: refreshed ontologies in the knowledge graph, and refined specs added to the implementation sprint backlog. The implementation sprint pulls specs from its backlog and runs them through the per-change SDLC flow.

When the implementation sprint's Impact Analysis Agent detects a spec missing context that only the custodians can supply, the feedback loop pushes the spec back to the spec sprint backlog. The custodians clear it in the next workshop. This is what keeps the implementation sprint a known-plan execution: the spec sprint absorbs the structural risk.

The detailed mechanics of each sprint live on its own page. [Spec Sprint](spec-sprint.md) covers the workshop, the four-custodian participation, and the backlog discipline. [Implementation Sprint](implementation-sprint.md) covers the per-change SDLC flow, the agent fleet that runs it, and how the developer role evolves as the agents take on more of the loop.

## The Team That Runs the Two Sprints

The conventional distributed-scrum architecture was the right answer for the work engineers did ten years ago. AI compresses the work the engineer did, and pushes the bottleneck upstream into specification, ontology curation, design system maintenance, and architecture currency. The org structure that delivered the old work does not deliver the new work.

The replacement is a three-layer structure. The top layer is custodianship: the four ontology custodians (Product Owner, Architect, UX Designer, Engineering Team) running the spec sprint and owning the graphs. The middle layer is implementation teams consuming the impact-analyzed specs. The bottom layer is the Enablement Layer (Accion Labs-supplied: Chief Architect, Ontology Maintainer, Knowledge Agent Owner, Semantic Engineers) supporting the custodians under a chosen tier of managed support. Each layer has its own cadence. Specialists outside the layers (Agent Developers, Data Architects, UX Architects) engage fractionally at trigger points.

The full treatment of the layered structure, the fractional allocation model that staffs it, the Forward-Deployed Engineer role, and the commercial evolution that pairs with the operating-model shift is in [Team](team.md).

## From Zone 3 to Zone 4

Zone 3 is single-product Semantic Engineering: one knowledge graph, one product, the per-change SDLC flow operated by the agent fleet, the spec sprint workshop running ahead of the implementation sprint. Most enterprise teams that adopt SE stabilize here for several quarters.

Zone 4 is the operating mode at portfolio scale. Multiple products operate under their own knowledge graphs. Cross-product reasoning happens through the Cross-Product Impact Extension and the Portfolio Rationalization Agent (both in the [agent fleet](../agents.md)). The client's four custodians continue to own the four ontologies; the Engineering Team's custodianship expands to include the agent fleet. Accion Labs's [enablement partnership](enablement-partnership.md) supports the custodians under codified engagement principles. The developer moves upstream from the per-change loop into custodianship of the agent fleet. The agents run the loop.

[The Enablement Partnership](enablement-partnership.md) is the engagement frame for Accion Labs's role beneath the custodianship and implementation layers. It is what makes the long-term engagement work for both the enabling partner and the enterprise that owns the asset.

> **How Accion Labs operationalizes the continuous SDLC operating model**
>
> The [Breeze.AI platform](../../practitioner/breeze-ai.md) implements the per-change SDLC flow, the four-ontology validation gate, and the agent fleet. The [Engagement Model](../engagement-model.md) staffs the operating model across Advise, Launch, Scale, and Optimize phases.

---

[Spec Sprint](spec-sprint.md) and [Implementation Sprint](implementation-sprint.md) cover the two SDLC cadences in depth. [Team](team.md) covers the operating model that runs both. [The Enablement Partnership](enablement-partnership.md) is the engagement frame for the long-term partnership. The parallel operating model for legacy modernization is on the [Modernization Process](../../modernization/process/_index.md) section.
