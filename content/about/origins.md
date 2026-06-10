---
title: "Origins"
description: "How Semantic Engineering came to be. The 2017 Breeze framework, the 2022 drug discovery moment, and the convergence that produced the methodology and the Breeze.AI platform."
weight: 10
date: 2026-06-04
lastmod: 2026-06-05
draft: false
audience:
  - analyst
  - press
  - academic
  - practitioner
---

Semantic Engineering came from the convergence of two long-running investments inside Accion Labs. One was organizational: a 2017 framework called Breeze that codified what good product owners, architects, and UX designers actually need to produce. The other was technical: the discovery in 2022 that knowledge graphs could constrain transformer-model hallucination in the firm's first GenAI project, a drug discovery application for a pharma leader.

Each investment ran independently for years. The convergence happened when AI matured to the point where Breeze's manual governance could be operationalized through agents reading and writing against knowledge graphs. The 2017 Breeze framework and the 2022 graph constraint together became Semantic Engineering. The platform that carries the discipline today is named for its 2017 ancestor: Breeze.AI.

This page tells the story.

## The 2017 Framework: Breeze

Accion's engineering leadership in 2017 was tackling a recurring problem. The firm was scaling rapidly. The quality of architects, product owners, and UX designers across engagements was uneven. The firm needed a way to codify what good practice looked like for each of these roles so that newer hires could be trained against the standard.

The framework was called Breeze. It articulated, for each role, the minimum set of artifacts and decisions a practitioner needed to be able to produce. For product owners, this meant persona definitions, outcome specifications, and scenario walkthroughs. For architects, it meant service decompositions, entity definitions, and integration patterns. For UX designers, it meant component libraries, journey maps, and quantitative user metrics that went beyond conventional satisfaction surveys.

Breeze worked but was operationally heavy. Maintaining the artifacts across hundreds of engagements required continuous coordination. Newer practitioners produced Breeze-compliant artifacts; senior practitioners often skipped the artifacts and relied on tacit understanding. The framework was always at risk of being abandoned under deadline pressure.

Breeze taught the firm what the minimal governance structure looked like for each role. It did not yet have the mechanism that would make that governance sustainable across hundreds of engagements at scale.

## The 2022 Discovery: Drug Discovery and Hallucination

Five years after Breeze was published, a small Accion team started the firm's first GenAI project. The project began in Q1 2022 and deployed to production in Q3 2022. The use case was drug discovery for a pharma leader. ChatGPT was still ten months away. The team chose a transformer model because conventional NLP could not handle the language of pharmaceutical research.

The model hallucinated so badly during development that the application would have been useless without intervention. Instead of finding plausible pathways in the validated decision architecture the researchers needed, the model invented its own. The output was confident and wrong, which is the most expensive kind of wrong.

The fix was structural. The team built a decision tree of the validated pathways, gave the model the tree as constrained options, and asked it to pick rather than invent. The application worked. The decision tree grew into an ontology. The ontology grew into a knowledge graph. The same constraint pattern that rescued drug discovery turned out to work in every other domain the team applied it to.

The structural insight: the combination of a large language model and a structured knowledge graph produces precise, traceable, auditable output where the model alone produces confident plausibility. The model becomes a chooser rather than an inventor. The graph constrains what can be chosen.

This insight predated the term "Semantic Engineering" by years. The team continued refining the pattern across customer engagements without yet naming the discipline.

## The Convergence

The two investments converged when AI matured. The structural insight from drug discovery (knowledge graphs constrain hallucination) and the role insight from Breeze (each role has a minimal governance structure) combined into a single discipline.

The four-layer ontology emerged as the formal version of Breeze's per-role minimal structures, rendered in a form that machines could reason over. Breeze's product-owner artifacts became the Functional Ontology. Breeze's architecture artifacts became the Architecture Ontology. Breeze's UX-design artifacts became the Design Ontology. Code, which had not been part of Breeze because code is the output of the other three, became the fourth ontology layer once AI made code-level structure extractable from the AST.

The agent fleet that operates on the four-layer ontology is what made the discipline sustainable. The maintenance burden that defeated Breeze's manual blueprint is now handled by the KG Sync Agent. The drift problem that defeated text documentation is prevented structurally. The team's senior practitioners stop being the bottleneck because their context-assembly work lives in the system through the Impact Analysis Agent.

The convergence happened gradually between 2022 and 2025. By 2025, the discipline was formal enough to be named. The methodology took the name Semantic Engineering. The platform that operationalizes it took the name of its 2017 ancestor: Breeze.AI. The continuity in the name reflects the continuity in the substance. Breeze.AI is what Breeze became once AI could do the maintenance work humans had been doing by hand.

## What Each Investment Contributed

Without the 2022 drug discovery moment, the knowledge graph would not have been part of the architecture. The team would have tried to scale Breeze's manual blueprint with better tooling. The blueprint would have continued to be abandoned under deadline pressure.

Without Breeze, the knowledge graph would have been a technical capability without a clear application. The team would have built impressive graphs that did not align to the actual structure of the work practitioners do. The graphs would have been used in narrow technical contexts and not extended into the operating model.

The convergence is what makes the methodology durable. The graphs are constrained to capture what practitioners actually need to govern. The practitioner roles have a structural medium for their work. The agents bridge the two.

## What Predates AI in the Methodology

This is worth stating explicitly because it disagrees with the common framing of AI-driven methodologies. AI is the enabling technology that made Semantic Engineering operationally viable. The underlying discipline (codifying the minimal governance structures for each engineering role) existed before AI and would have value even if AI did not exist.

The implication for clients: adopting Semantic Engineering is the adoption of an engineering discipline that AI happens to make sustainable, rather than an AI strategy as such. Clients who understand this distinction adopt the methodology more durably than clients who treat it as a wrapper around an AI tool.

## What the Methodology Refines Continuously

The methodology is not frozen. Three forces drive ongoing refinement:

| Force | What it produces |
|---|---|
| Engagement learning | Patterns that work across multiple engagements become canonical; patterns that fail are removed |
| Industry convergence | When the broader industry vocabulary moves (Snowflake semantic layer, Palantir ontologies, Microsoft KGs), the methodology adapts to maintain interoperability |
| Frontier exploration | New domains beyond SDLC where the same convergence pattern applies |

The current site focuses on SDLC. Future extensions into other domains will follow the same pattern. The convergence story (the two investments meeting at the right technical moment) is structural; it is reproducible in adjacent domains.

## How to Cite the Origin Story

When citing the origin in an analyst report, academic publication, or other context:

> The Semantic Engineering methodology emerged at Accion Labs from the convergence of two investments: a 2017 internal framework called Breeze that codified the minimal governance structures for product owners, architects, and UX designers, and a 2022 application of structured knowledge graphs to constrain transformer-model hallucination in the firm's first GenAI project (a drug discovery use case for a pharma leader). The convergence produced the four-layer ontology, the agent fleet that operates on it, and the Breeze.AI platform that operationalizes the methodology in production.

The longer version is this page.

---

Continue to [Copyright and Trademark](_index.md#copyright-and-trademark) for the methodology's intellectual property posture, or [Governance](_index.md#governance) for how the methodology evolves.
