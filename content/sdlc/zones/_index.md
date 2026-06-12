---
title: "Zones of AI-Assisted SDLC"
description: "The four zones of process matched to four zones of work complexity, from manual / vibe coding to Spec-Driven Development to SDD plus Semantic Engineering to SE at Scale. Each zone addresses a subset of the Manual Translation Tax as complexity rises."
weight: 20
date: 2026-06-04
lastmod: 2026-06-09
draft: false
section: true
audience:
  - cto
  - vp-engineering
  - product-owner
  - tech-lead
  - cio
---

The companion to this section is [The Manual Translation Tax](../translation-tax.md), which sets up the problem. This section is about which process to use for which work. The Manual Translation Tax scales with the complexity of the work being done, and the right process to handle it changes as that complexity rises. The four zones below are each sized for a complexity range. The question this section answers is which zone of process fits the work in front of you.

## How the Manual Translation Tax Scales with Work Complexity

![How MTT scales with work complexity: each zone of process is the right methodology for one complexity zone](/diagrams/mtt-complexity-curve.svg)

The Manual Translation Tax is not a fixed cost. It grows faster than the complexity of the work that produces it. A solo developer writing a throwaway script pays almost no tax. A single team shipping a small product pays a modest tax that written specifications absorb cleanly. A multi-team enterprise application crosses a threshold where text-based artifacts cannot keep up and the tax becomes overwhelming. A portfolio of products at portfolio scale requires sustained methodology that holds the tax in check across products and years.

The four zones of process below are each the right methodology for one complexity zone. Use a lower-zone process beyond its range and the team pays the tax in full. Use a higher-zone process below its range and the team pays overhead without benefit. The same team may operate at different zones for different workstreams. The right zone for any given piece of work is determined by the complexity of that work, not by where the team is in its journey.

## The Four Zones

![What each zone of process provides: the capability staircase from Manual / Vibe Coding to SE at Scale](/diagrams/zones-staircase.svg)

Each zone of process is sized for a complexity range. Each zone keeps what the previous zone provided and adds the response to a failure the previous zone cannot handle at the higher complexity range. The progression below moves from low-complexity work on the left to portfolio-scale work on the right. The right zone for your workstream is determined by the complexity of the work in that workstream, not by where the team is in its overall journey.

| Zone | What the zone covers | What the zone provides | Where the work crosses into the next zone |
|---|---|---|---|
| 1: Manual / Vibe Coding | Throwaway, exploratory, solo. Single-developer scope, no team coordination. | Conversational AI use; first taste of velocity; no spec gate needed | The work has to be reviewed, reproduced, or audited post-incident. The lack of a contract starts costing more than the velocity gives back. |
| 2: Spec-Driven Development | Single team, single product, single repository. One PO / architect / designer triangle that can coordinate verbally. | A written specification per change, versioned alongside code; AI generates against the spec rather than against conversation | The work crosses a team boundary, hits brownfield depth, requires architectural or design judgment the spec cannot carry, or specs themselves become the bottleneck. |
| 3: SDD plus Semantic Engineering | Multi-team or multi-repository work on one product. Brownfield reality at enterprise scale. | A four-layer knowledge graph that every change validates against; impact analysis before code is written; auto-update on every merge | The work spans multiple products, requires cross-product reasoning, or needs sustained operation across years and multiple engagement teams. |
| 4: SE at Scale | Portfolio of products, cross-product integration, multi-year custodianship. | Multi-product graphs, governed agent fleet with progressive autonomy, custodianship as operating mode | The methodology continues to evolve. This is the operating mode at portfolio scale. |

Most enterprise work in 2026 sits in the Zone 1 to Zone 2 complexity zone. Most enterprise teams use AI coding tools at the individual-developer level for small contained work, with isolated SDD discipline on specific workstreams. A growing minority have made SDD their standard for single-team work. A small number are operating at Zone 3 for the workstreams that need it.


### The Detailed Mapping by MTT Component

For each component of the Manual Translation Tax, the mapping below shows what changes as the work moves up the complexity zones and the process moves up with it.

| Manual Translation Tax component | Zone 1: Manual / Vibe Coding | Zone 2: Spec-Driven Development | Zone 3: SDD + Semantic Engineering | Zone 4: SE at Scale |
|---|---|---|---|---|
| **Ambiguity** in custodian-to-developer translation | Amplified by AI velocity; same five-word phrase produces different code on different days | Partial: written intent contract per change reduces ambiguity at the product owner layer | Addressed: structured ontology per custodian; agent reads the same definition every team uses | Sustained across multiple products and teams |
| **Non-persistence** of knowledge across handoffs | Unchanged (humans forget, agent sessions reset every time) | Partial: specs persist alongside code but decay under deadline pressure | Addressed: graph compounds with every change; KG Sync auto-updates the Code Ontology on every merge | Sustained across multiple products via cross-product extensions |
| **Non-traceability** across intent, design, architecture, code | Unchanged (no structural link from prompt to commit to incident) | Partial: spec-to-commit traceability instrumented at the ticket level | Addressed: cross-layer graph links every functional outcome to its design components, architecture services, and code modules | Sustained across products; cross-product impact analysis follows the same model |

## Zone 1: Manual / Vibe Coding

**The right process when the work is throwaway, exploratory, or solo.** Developers use AI coding tools conversationally. No spec gate. The same change made by two developers produces two different implementations, which is fine because the output is not meant to be reviewed, reproduced, or audited later. The pattern works for prototypes, learning, POCs, internal one-off scripts, and any work where the act is the deliverable.

Zone 1 fails the moment the work needs review, reproduction, or post-incident traceability. The deep treatment, including the specific contexts where vibe coding is the right call and where it stops working, is in [Zone 1: Manual / Vibe Coding](zone-1-manual-vibe-coding.md).

## Zone 2: Spec-Driven Development

**The right process when the work fits a single team, a single product, a single repository, with a hands-on architect.** Every change of meaningful size is preceded by a written specification. The spec is versioned alongside the code. Reviewers have a contract to verify against. AI agents generate against the spec rather than against conversation. SDD raises the floor of AI-assisted engineering substantially within its complexity zone.

Zone 2 fails at the four ceilings that surface when work crosses team boundaries, hits brownfield depth, or requires architectural / design judgment the spec cannot carry: localized context, spec drift, single-layer coverage, and specs becoming the bottleneck. The deep treatment is in [Zone 2: Spec-Driven Development](zone-2-spec-driven-development.md).

## Zone 3: SDD plus Semantic Engineering

**The right process when the work spans multiple teams or hits brownfield depth on a single product.** A knowledge graph of the application sits alongside the per-change specifications. The graph captures four connected layers: Functional (the product owner's), Architecture (the architect's), Design (the designer's), and Code (the engineering team's). Every change runs through pre-implementation impact analysis. Every merge updates the graph automatically. The four custodians write into structured ontologies that the agent reads directly. The Manual Translation Tax collapses because the medium changes from text artifacts to machine-readable ontologies.

The structural substrate is in [Semantic Knowledge Graphs](../methodology.md). The operating model that runs the substrate is in [Process](../process/_index.md). The two together are what Zone 3 looks like in practice.

## Zone 4: SE at Scale

**The right process when the work spans multiple products at portfolio scale, with multi-year custodianship.** Multiple products operate under their own knowledge graphs. A governed agent fleet operates with progressive autonomy. The custodianship discipline holds the knowledge asset across years under codified fiduciary duties. The developer moves upstream from the per-change loop into a custodial role over the agent fleet. The agents run the loop.

Zone 4 is an operating mode rather than a destination. The methodology continues to evolve, new domains continue to be added, and the knowledge asset continues to enrich. Cross-product reasoning, custodianship as operating mode, and the commercial evolution that pairs with both are covered in [Process](../process/_index.md) and [The Enablement Partnership](../process/enablement-partnership.md).

## Time to Value at Each Transition

The transitions are not equal in cost or in payback.

| Transition | Typical adoption time | Typical first measurable result |
|---|---|---|
| Manual to SDD | Four to six sprints | Reduction in code review burden; first defect-rate improvement against baseline |
| SDD to SE (Design Ontology slice first) | Two to four sprints to deploy the slice | First-sprint design component reuse in the 50% range; first AI-generated UI passing the four-way traceability gate at commit |
| SDD to SE (full four-ontology extraction, brownfield) | Two to three weeks to extract a 2M LOC code base; four to six weeks to reach steady-state operation | Impact Analysis Agent answering open-ended client questions on the live graph; first cross-team conflict caught at the PR gate |
| SE single product to SE at scale | Quarters to years depending on product count and custodial maturity | First cross-product query that no single graph could answer alone |

The Zone 2 to Zone 3 transition is the most consequential. The Design Ontology slice path is the most common entry point for greenfield teams that have grown into complexity. The full four-ontology extraction path is the most common entry for brownfield modernization at enterprise scale.

## Change Management Considerations

The methodology itself rolls out in weeks. The operating model that delivers its full value is a change management exercise that runs across quarters. Team structure changes. Incentives change. How engineers are evaluated changes. The methodology produces partial value before the operating model catches up, but the full value depends on the operating model. [Process](../process/_index.md) covers the operating-model side in depth.

---

