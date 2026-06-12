---
title: "SDLC Engagement Model"
description: "The commercial engagement model for continuous SDLC engagements. Four phases (Advise, Launch, Scale, Optimize) with activities, participants, deliverables, managed-support tier mappings, and pricing per phase."
weight: 60
date: 2026-06-12
lastmod: 2026-06-12
draft: false
audience:
  - cto
  - cio
  - cfo
  - chief-architect
  - procurement
  - business-leader
---

This page covers the commercial engagement model for continuous SDLC engagements. Four phases (Advise, Launch, Scale, Optimize) shaped for ongoing custodianship across years. The parallel engagement model for legacy modernization is on the [Modernization Engagement Model](../modernization/engagement-model.md) page.

The two engagement models do not overlap during an engagement. A client engagement that includes both modernization and ongoing SDLC governance uses the modernization model for the bounded migration project and then transitions to this continuous SDLC model once the modernized system is in live operation.

## The Four Phases

The continuous SDLC engagement model has four phases. Each phase has a defined set of activities, participants, and deliverables. The phases align to the [Three-Phase Rollout](../practitioner/_index.md#three-phase-rollout) and to the [managed support tiers](process/enablement-partnership.md).

![Continuous SDLC engagement: Advise, Launch, Scale, Optimize](/diagrams/sdlc-four-phases.svg)

### Advise

**Duration.** Two to four weeks.

**Objective.** Diagnose the client's current zone in the [Zones of AI-Assisted SDLC](zones/_index.md), identify the friction the team is bumping against, and produce a scoped roadmap for the next transition.

**Activities.** AI readiness assessment, use-case discovery and prioritization, platform evaluation (Breeze.AI versus ASIMOV versus both), twelve-week SE Foundation roadmap scoping, team composition recommendation under the fractional allocation model, ROI modeling.

**Participants.** CxO sponsors (CTO, CIO, or VP Engineering), business stakeholders for the priority workstream, Accion Labs AI strategists and lead architects.

**Deliverables.** AI roadmap for the engagement, prioritized use case backlog, platform recommendation, scoped Phase 2 plan with phase gates and acceptance criteria.

The Advise phase requires no infrastructure change and no system access beyond what is already in place. The phase typically begins with the [two-day deep-dive workshop](../practitioner/_index.md#services) and continues into a more detailed scoping conversation that produces the Launch phase plan.

### Launch

**Duration.** About twelve weeks.

**Objective.** Build the four-layer knowledge graph for the highest-priority product, deploy the agent fleet, establish the validation gate at PR merge, and reach a sustainable Zone 3 operating model for the first workstream.

**Activities.** Proof-of-value builds (the first demo against the live graph), agent fleet prototyping, data pipeline setup for KG sync, integration architecture with the client's existing toolchain (CI/CD, ticket system, design tools), brownfield extraction (if applicable) or Functional Ontology authoring (if greenfield).

**Participants.** Product owners from the priority workstream, Accion Labs engineering pods (Semantic Engineers, Agent Developers), client IT team, Forward-Deployed Engineer for the workstream (Accion Labs-provided or jointly identified).

**Deliverables.** Working proof-of-value or MVP, architecture blueprint for the integration, success metrics baseline, all four ontologies passing the P0 verification suite, Impact Analysis Agent deployed in pre-implementation mode, PR Validation Agent deployed, KG Sync Agent operating.

### Scale

**Duration.** Quarters to years, depending on portfolio scope.

**Objective.** Extend the methodology across the portfolio. Deploy progressive autonomy on pattern-based work. Establish the enablement partnership as the operating mode.

**Activities.** Production deployment of the methodology across additional workstreams, multi-agent rollout, performance tuning of the agent fleet, redundancy and recovery patterns, Forward-Deployed Engineer program expansion.

**Participants.** Engineering leads across the portfolio, DevOps and MLOps teams, Accion Labs delivery team, enablement layer beginning to form (Chief Architect, Ontology Maintainer).

**Deliverables.** Production systems operating under the methodology across the portfolio, CI/CD pipelines integrated with the agent fleet, monitoring dashboards for graph health and agent performance, first Cross-Product Impact Extension agents in production.

### Optimize

**Duration.** Continuous.

**Objective.** Steady-state operation. The methodology is in production. The custodianship discipline holds the engagement across years.

**Activities.** Continuous improvement of agent prompts and ontology shape, model retraining and drift tracking, cost optimization (model routing, token usage), governance audits (quarterly), rationalization cycles (quarterly), refresh sprints (triggered by freshness thresholds).

**Participants.** Managed services team, client operations team, Accion Labs's enablement layer (Chief Architect, Ontology Maintainer, Knowledge Agent Owner), AI governance board.

**Deliverables.** Optimization reports (quarterly), SLA compliance reporting, ROI realization metrics, rationalization backlog flowing into the product roadmap, enablement audit trail.

## How the Phases Map to Managed Support Tiers

| Engagement phase | Typical managed support tier |
|---|---|
| Advise | None (pre-engagement) |
| Launch | Light Governance |
| Scale | Light Governance or Medium Curation, depending on engagement complexity |
| Optimize | Medium Curation or Deep Operations, depending on the client's chosen mode |

The managed support tier choice is made during Advise and refined during Launch as the engagement complexity becomes visible. See [The Enablement Partnership](process/enablement-partnership.md) for the tier details.

## Pricing Across the Phases

| Phase | Typical pricing model |
|---|---|
| Advise | Fixed-price workshop or short-term engagement |
| Launch | Time-and-materials with milestone-based deliverables; mostly fractional allocation |
| Scale | Time-and-materials transitioning to outcome-based as the engagement matures |
| Optimize | Outcome-based pricing tied to the enablement SLA |

The full treatment of the engagement-shape evolution is in [Engagement Model Evolution](process/team.md#engagement-model-evolution).

---

The parallel engagement model for legacy modernization is on the [Modernization Engagement Model](../modernization/engagement-model.md) page. The [Three-Phase Rollout](../practitioner/_index.md#three-phase-rollout) on the Practitioner page describes the methodology phases inside the SDLC engagement.
