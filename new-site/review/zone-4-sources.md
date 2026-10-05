# Source map: Zone 4: SE at Scale

Page: `content/sdlc/zones/zone-4-se-at-scale.md` (draft: true). Paths below are relative to `content/`.

One source outside the requested reading list is used: `practitioner/_index.md#phase-3-se-at-scale`, `#phase-3-adoption-considerations` and `#phase-2-se-foundation`. It is the only place the content gives Zone 4 deliverables, phase-gate criteria and adoption pacing. Uses are marked **[practitioner]** below so the reviewer can decide whether to keep them.

## Diagram and intro paragraph

- Diagram `static/diagrams/zone-4-agentic-se.svg`, already used in `sdlc/process/implementation-sprint.md#zone-4-agents-run-the-loop`.
- Description paraphrased from the paragraph under that diagram in `sdlc/process/implementation-sprint.md#zone-4-agents-run-the-loop`.

## The Manual SDLC Problem This Zone Addresses

- Zone 3 definition ("one knowledge graph, ... spec sprint workshop running ahead"); "Most enterprise teams that adopt SE stabilize here for several quarters": `sdlc/process/_index.md#from-zone-3-to-zone-4`.
- Crossing conditions (multiple products, cross-product reasoning, sustained operation across years and multiple engagement teams): `sdlc/zones/_index.md#the-four-zones` (table, Zone 3 row, last column).
- "The tax grows faster than the complexity..."; "A portfolio of products requires sustained methodology...": `sdlc/zones/_index.md#how-the-manual-translation-tax-scales-with-work-complexity`.
- Eight-minute query, monolithic graph over ten applications, one graph per product: `sdlc/methodology.md#partition-by-product`, `#the-number-that-decides-it`.
- Org-line product split, four to five years, duplication no team owned: `sdlc/case-archetypes.md#a-cautionary-tale-that-surfaces-in-both-archetypes`; also `sdlc/methodology.md#a-pattern-we-see-often`.
- Bottleneck moves upstream into specification, design, architecture, ontology curation, cross-product reasoning; scrum team lacks those disciplines: `sdlc/process/team.md#layered-team-structure-in-depth`.
- Agent fleet becomes a second asset class needing custodianship: `sdlc/process/enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution`.
- **Flag:** "As the agents take on more of the per-change loop" is my connective framing for why the fleet becomes an asset; the source states only that at Zone 4 the fleet becomes a second asset class.

## Where the Team Is

- First paragraph: `sdlc/zones/_index.md#zone-4-se-at-scale`; `sdlc/process/_index.md#from-zone-3-to-zone-4`.
- **Flag:** the zones page says "codified fiduciary duties"; the enablement page calls them "codified engagement principles" (and Duties of Care, Loyalty, etc.). I used "codified engagement principles". The reviewer may prefer the zones-page wording.
- Gradual, agent by agent; Zone 4 on Impact Analysis while Zone 3 on Coding Agent; "overall zone is the floor across the fleet": `sdlc/process/implementation-sprint.md#what-changes-for-the-implementation-team`.

## What the Team Operates With

- One graph per product; integration points as bridges: `sdlc/methodology.md#partition-by-product`, `#cross-product-reasoning`.
- Cross-Product Impact Extension (graphs consulted, Chief Architect owner, Chief Architect approves each analysis): `sdlc/methodology.md#cross-product-reasoning`; `sdlc/agents.md#agent-ownership`; `sdlc/agents.md#the-five-levels-mapped-to-agent-classes`.
- Portfolio Rationalization Agent (quarterly, all graphs, rationalization backlog): `sdlc/agents.md#the-fleet-at-a-glance`; `#the-five-levels-mapped-to-agent-classes`.
- Two-level orchestration: `sdlc/agents.md#two-level-orchestration`.
- Progressive autonomy, Promotion Agreement fields: `sdlc/agents.md#the-five-levels`, `#the-promotion-agreement`.
- Audit trail: `sdlc/agents.md#the-audit-trail`; Engineering Team review on cadence: `sdlc/process/enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution`.
- 29 metrics, 14 checks, cadences: `sdlc/methodology.md#the-14-verification-checks`, `#custodianship-cadence`.
- Layered team structure "in full operation", fractional allocation at trigger points: **[practitioner]** Phase 3 team composition; structure from `sdlc/process/team.md#the-layered-team-structure`.
- Enablement partnership elements: `sdlc/process/enablement-partnership.md` (five principles, three tiers, Engagement Council, offboarding doctrine).

## When This Zone Is Genuinely Suitable

- "Use a higher-zone process below its range and the team pays overhead without benefit": `sdlc/zones/_index.md#how-the-manual-translation-tax-scales-with-work-complexity`.
- "Multi-team or multi-repository work on one product is Zone 3 work": `sdlc/zones/_index.md#the-four-zones` (Zone 3 row).
- Portfolio with integration points; analysis at spec time when the team has bandwidth: `sdlc/methodology.md#cross-product-reasoning`.
- Org-chart product boundaries; duplicate and dead capabilities; quarterly agent: `sdlc/case-archetypes.md#a-cautionary-tale-that-surfaces-in-both-archetypes`; `sdlc/agents.md#the-fleet-at-a-glance`.
- Asset compounds, becomes inseparable from the business: `sdlc/process/enablement-partnership.md` (opening paragraph).
- **Flag:** "the custodianship has to hold across years and team changes": "team changes" is my wording; the source talks about years and multiple engagement teams.
- Progressive autonomy on pattern-based work: `sdlc/engagement-model.md#scale`; **[practitioner]** Phase 3 objective. "Some stable task classes execute autonomously": `sdlc/agents.md#the-five-levels-mapped-to-agent-classes` (Impact Analysis, Level 5 achievable for stable task classes). **Flag:** slight generalization from one agent to "some stable task classes".
- Deep Operations once the methodology is core: `sdlc/process/enablement-partnership.md#the-three-tiers-of-managed-support`.
- Most enterprise work in Zones 1 to 2, small number at Zone 3: `sdlc/zones/_index.md#the-four-zones`.
- Teams run at Zone 3 for several quarters before extending: **[practitioner]** `#phase-3-adoption-considerations`; also `sdlc/process/_index.md#from-zone-3-to-zone-4`.

## How the Methodology Compares at This Zone

### By Manual Translation Tax Component

- All cells: `sdlc/zones/_index.md#the-detailed-mapping-by-mtt-component`. Zones 1 and 2 merged into one column, wording condensed.
- Cross-product integration point review by Ontology Maintainer plus Chief Architect: `sdlc/agents.md#what-triggers-human-review`.
- Implicit integration surfaced as a finding: `sdlc/methodology.md#cross-product-reasoning`.

### By Operating Model

- Graph scope: `sdlc/process/_index.md#from-zone-3-to-zone-4`.
- Custodianship, agent-custodial span: `sdlc/process/enablement-partnership.md#engineering-teams-custodianship-of-the-agent-fleet-zone-4-evolution`; `sdlc/process/team.md#what-each-layer-does`.
- Per-change loop, developer per-change and upstream roles, what the team optimizes for, what blocks at merge: `sdlc/process/implementation-sprint.md#what-changes-for-the-implementation-team` (table, near verbatim).
- Agent autonomy, Zone 3 cell ("Progressive autonomy begins on the first pattern-based agent classes"): **[practitioner]** `#two-paths-through-phase-2` (Semantic First, weeks 9 to 12). Zone 4 cell: **[practitioner]** Phase 3 deliverables; `sdlc/engagement-model.md#scale`.
- Cross-product reasoning: `sdlc/methodology.md#cross-product-reasoning`. **Flag:** the Zone 2 page's spec sprint table lists "Cross-product extension run by the architect against multiple product graphs" under "Full SE spec sprint (Zone 3+)". My Zone 3 cell says "Impact analysis within the product graph", which follows the zones page (cross-product reasoning is the trigger to leave Zone 3) but sits in mild tension with that Zone 2 table.
- Enablement partnership, Zone 3 cell: `sdlc/engagement-model.md#launch` (Launch reaches Zone 3) and `#how-the-phases-map-to-managed-support-tiers` (Launch: Light Governance); Enablement Layer begins to form: **[practitioner]** Phase 2 team composition. Zone 4 cell: `sdlc/engagement-model.md#scale` ("Establish the enablement partnership as the operating mode"), Optimize tier mapping; Engagement Council: `sdlc/process/enablement-partnership.md#the-engagement-council`. **Flag:** mapping Zone 3 to Launch and Zone 4 to Scale/Optimize is my inference from the engagement-model objectives.
- Engagement frame: `sdlc/engagement-model.md#pricing-across-the-phases` (Launch, Scale, Optimize rows), same inference as above.

### Across All Four Zones

- Zone 1 custodians' input ad hoc and unrecorded: `sdlc/zones/zone-1-manual-vibe-coding.md#when-this-zone-stops-working`. Per-change loop and merge check: Zone 1 diagram paragraph.
- Zone 2: diagram paragraph at the top of `sdlc/zones/zone-2-spec-driven-development.md`; single-layer coverage in `#when-this-zone-stops-working`.
- Zone 3: `sdlc/process/_index.md#the-structured-landscape`; `sdlc/zones/_index.md#zone-3-sdd-plus-semantic-engineering`.
- Zone 4: as above.

## Where the Limits Sit and What Continues to Evolve

- Operating mode rather than destination; methodology evolves, new domains, asset enriches: `sdlc/zones/_index.md#zone-4-se-at-scale`.
- "There is no fifth zone for the work to cross into": inferred from the four-zone model and the Zone 4 row of the zones table ("The methodology continues to evolve"). **Flag:** inference.
- Aspirational endpoint, selected workstreams, engineers still produce code with AI assistance: `sdlc/agents.md#the-aspirational-endpoint`, `#what-the-fleet-does-not-do`.
- Autonomy authorized levels, rollback, Sev-1 to Level 1: `sdlc/agents.md#what-the-fleet-does-not-do`, `#rollback-and-demotion`.
- Premature extension degrades graphs: **[practitioner]** `#phase-3-adoption-considerations`.
- Quarterly sync back to Zone 2 within two quarters: `sdlc/agents.md#why-sync-must-be-continuous`.
- FDE beyond two or three workstreams loses depth: `sdlc/process/team.md#what-the-fde-does-not-do`.
- Effort-based to deliverable-based; vocabulary converging: `sdlc/process/team.md#phase-2-deliverable-based-engagement`.

## Readiness Criteria to Move to Zone 4

- The lower-zone pages give "at least three of the following" checklists. No such checklist exists for Zone 3 to Zone 4. I did not invent a threshold count. **Flag:** the two lists are assembled from several pages; the reviewer may want to confirm this framing.
- Work signals: `sdlc/zones/_index.md#the-four-zones` (Zone 3 row); "no single product graph can answer" echoes `sdlc/zones/_index.md#time-to-value-at-each-transition`.
- Sustainable Zone 3 conditions: **[practitioner]** `#phase-2-se-foundation` (phase-gate criteria, near verbatim).
- Several quarters at Zone 3; enablement partnership before extension: **[practitioner]** `#phase-3-adoption-considerations`; `sdlc/process/_index.md#from-zone-3-to-zone-4`.
- Evidence and Promotion Agreements: `sdlc/agents.md#how-evidence-is-built`, `#the-promotion-agreement`.

## From Zone 3 to Zone 4

- Quarters to years; first cross-product query: `sdlc/zones/_index.md#time-to-value-at-each-transition`.
- Three to six months per additional product, enablement maturing in parallel: **[practitioner]** `#phase-3-adoption-considerations`.
- What Gets Extended table: **[practitioner]** Phase 3 deliverables (near verbatim).
- Layered structure cadences: `sdlc/process/team.md#why-the-shape-works`.
- One FDE per product, fractionalized: `sdlc/process/team.md#sizing-the-fde-cohort-across-a-portfolio`; backfill condition: `sdlc/process/team.md#the-role`.
- Chief Architect and Ontology Maintainer for five to ten products: `sdlc/process/team.md#why-the-shape-works`.
- Phase gate and "no fixed end": **[practitioner]** Phase 3 phase-gate criteria and closing paragraph.
- Callout: Breeze.AI Phase 3 full platform across the portfolio: `practitioner/breeze-ai.md#engagement-lifecycle`; agents and progressive autonomy: `practitioner/breeze-ai.md#what-breezeai-implements`; Scale/Optimize: `sdlc/engagement-model.md`; tiers: `sdlc/process/enablement-partnership.md`.

## Links

- `zone-3-sdd-plus-semantic-engineering.md` (drafted in parallel; it existed when the build ran).
- All other links point to existing pages and headings. `build-content.mjs` reported no problems.
