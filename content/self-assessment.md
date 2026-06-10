---
title: "Self-Assessment"
description: "Six questions to identify which zone of process best fits the work you do today, and a recommended reading path through the rest of the site."
weight: 90
date: 2026-06-05
lastmod: 2026-06-05
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
  - product-owner
---

Six questions about the work the team handles today. The output is the zone of process that fits that work and a recommended reading path through the rest of the site. The same team often uses different zones for different work; what the assessment reveals is the dominant zone that fits the bulk of the work in front of you.

## The Six Questions

Answer each with one of the four options. Note the letter for each answer.

**Question 1: How does your team specify work for AI coding agents today?**

- **A.** We use chat-style prompts. No written specifications are required before code is generated.
- **B.** We write a specification for every change of meaningful size, version-controlled alongside the code.
- **C.** We write specifications, and we also have a knowledge graph of the application that the agent consults during code generation.
- **D.** We operate multiple products under their own knowledge graphs, with cross-product reasoning and progressive agent autonomy.

**Question 2: When two developers implement the same change independently, what do you typically see?**

- **A.** Two completely different implementations. The reconciliation happens in code review or later.
- **B.** Two implementations that vary in implementation detail but match the spec.
- **C.** Two implementations that vary in style but produce the same structural change against the knowledge graph.
- **D.** Implementations that are converging because the team is increasingly writing agents rather than code.

**Question 3: How does the AI agent know what is already in the codebase?**

- **A.** It does not. It generates code based on the prompt and may duplicate existing capability.
- **B.** It has the spec for the current change but no structured view of what already exists.
- **C.** It traverses the knowledge graph to identify what already exists, what depends on what, and what will be affected.
- **D.** It does the same as (C), plus it operates across multiple product graphs when the change crosses product boundaries.

**Question 4: What happens when a change touches multiple repositories or teams?**

- **A.** We discover the cross-team effects during integration or in production.
- **B.** The spec describes the change in one repo. Cross-team effects are coordinated through meetings and Slack.
- **C.** The Impact Analysis Agent surfaces cross-repository blast radius before code is written.
- **D.** The same as (C), plus the Cross-Product Impact Extension surfaces effects across multiple product graphs.

**Question 5: How does your team handle brownfield work on an existing application?**

- **A.** A senior engineer reads the relevant code, builds a mental model, then implements.
- **B.** A senior engineer reads the code and writes a spec. The implementation team builds against the spec.
- **C.** The four-layer graph extraction has built a model of the existing application. The agent and the team both consult it.
- **D.** The same as (C), plus the extraction surfaces duplicate capabilities, dead code, and architectural drift as part of the brownfield engagement.

**Question 6: How is your team composed today?**

- **A.** A flat team of implementation engineers with a tech lead and product owner.
- **B.** The same as (A), plus disciplined spec authorship as part of the sprint cadence.
- **C.** A team with at least one Forward-Deployed Engineer running spec sprints with all four ontology custodians (PO, Architect, UX Designer, Engineering Team), plus fractionally allocated specialists (Semantic Engineer, Agent Developer) engaged at trigger points.
- **D.** A layered team structure with Custodianship plus Forward-Deployed Engineers plus Implementation Teams, and the operating model in place across multiple workstreams.

## Scoring

Count the letter you chose most often.

| Most common letter | Zone of process that fits today's work | Start here |
|---|---|---|
| Mostly A | Zone 1: Manual / Vibe Coding | [From Manual to SDD](zones-of-ai-assisted-sdlc/zone-1-manual-vibe-coding.md#from-manual-to-sdd) |
| Mostly B | Zone 2: Spec-Driven Development | [From SDD to SE](zones-of-ai-assisted-sdlc/zone-2-spec-driven-development.md#from-sdd-to-se) |
| Mostly C | Zone 3: SDD plus Semantic Engineering | [Three-Phase Rollout](practitioner/_index.md#three-phase-rollout) for the path to Zone 4 |
| Mostly D | Zone 4: SE at Scale | [The Enablement Partnership](process/enablement-partnership.md) for the operating mode that holds the asset across years |

If your answers span two adjacent zones (mostly A with some B, or mostly B with some C), the work sits on the boundary between two complexity zones. Start with the page for the lower of the two zones; the higher-zone approach will be there when the complexity of the work demands it.

If your answers span non-adjacent zones (mostly A with some C), the work has uneven complexity across areas. The lower zone is the right starting point for the bulk of the work. The higher zone is worth investigating to understand where the more complex pockets came from and how the pattern was handled.

## Want a Diagnostic Run by Accion Labs?

The [two-day deep-dive workshop](practitioner/_index.md#services) produces a more detailed diagnostic, including a per-ontology view of where the work sits across each of the four layers (the work can demand Zone 3 process on the Code Ontology while staying at Zone 2 on the Design Ontology), an identification of the specific ceiling conditions the team is bumping against, a scoped twelve-week roadmap for the transition with phase gates and acceptance criteria, and an indicative team composition under the fractional allocation model.

The workshop requires no infrastructure change and no commitment beyond the workshop itself.
