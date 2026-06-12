---
title: "Process: Modernization Operating Model"
description: "The operating model that delivers legacy modernization. Five-stage delivery, SME tuning loop, Expert Review pattern, the enablement frame sized for a bounded project."
weight: 50
date: 2026-06-12
lastmod: 2026-06-12
draft: false
section: true
audience:
  - cto
  - vp-engineering
  - architect
  - chief-architect
  - cio
---

This is the operating model that delivers legacy modernization. It is stage-sequenced, custodian-governed, and runs once across the modernization project. The parallel operating model for continuous SDLC is on the [SDLC Process](../../sdlc/process/_index.md) section.

The continuous SDLC operating model does not fit a modernization project. Modernization is bounded rather than continuous, governed by the same four custodians who own the SDLC ontologies, with the cadence of custodianship matched to the modernization stages, and delivered through five sequential stages rather than two staggered sprint cadences.

| Page | What it covers |
|---|---|
| [Modernization Operating Model](operating-model.md) | The five-stage delivery (Discovery and Analysis, Ontology Generation and Enrichment, MVP Migration, Scaled Migration, UAT and Deployment with Maintenance), the SME tuning loop that runs in parallel with the migration-validation iteration loop, the Expert Review pattern, and the team composition centered on the Product Owner, the Architect, and the Modernization Expert. |
| [Modernization Enablement Frame](enablement-frame.md) | The enablement frame for modernization engagements. Who holds the custodial position. The five engagement principles in modernization context. The offboarding doctrine. The transition to the continuous SDLC enablement frame if the engagement continues. |

## Why a Different Operating Model

The two operating models do not overlap during an engagement. A client engagement that includes modernization plus continuous SDLC governance uses the modernization operating model for the bounded migration project, then transitions to the continuous SDLC operating model once the modernized system is in live operation. The transition point is the hand-over at the end of the maintenance stage. The knowledge graph travels; the operating-model discipline shifts to match the new shape of the work.

| Dimension | Continuous SDLC | Modernization |
|---|---|---|
| Cadence | Two staggered sprint cycles (Spec Sprint ahead of Implementation Sprint) running indefinitely | Five sequential stages running once across the project |
| Knowledge anchoring | Continuous custodianship: four custodians articulate intent into their ontology layers on a sprint cadence | Stage-sequenced custodianship: the same four custodians govern the modernization ontologies, with the Product Owner and Architect leading the annotation discipline at module scoping and adjusting during gate reviews |
| Iteration | Per-change SDLC flow runs once per change request | Per-module migration-validation iteration loop runs until the four validation gates pass |
| Human role | Developer in the loop on per-change decisions; PR Validation Agent gates each merge | Modernization Expert validates per-iteration target code output; Product Owner validates the parity contract at UAT |
| Engagement length | Years of continuous operation | Quarters per modernization estate |
| Team composition | Four custodians plus implementation team plus enablement layer | Modernization Expert plus Product Owner plus Architect plus engagement's Chief Architect |

> **How Accion Labs operationalizes the modernization operating model**
>
> The [ASIMOV platform](../../practitioner/asimov.md) implements the five-stage modernization pipeline and the four validation gates that the operating model wraps. The [five engagement modes](../engagement-modes/_index.md) (Documentation Only through Maintain / Operate) are the entry points clients can engage at.

---

[Modernization Operating Model](operating-model.md) covers the five-stage delivery in operational depth. [Modernization Enablement Frame](enablement-frame.md) covers the enablement frame sized for a bounded project. The parallel operating model for continuous SDLC is on the [SDLC Process](../../sdlc/process/_index.md) section.
