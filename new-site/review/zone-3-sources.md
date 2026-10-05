# Source map: Zone 3: SDD plus Semantic Engineering

Page: `content/sdlc/zones/zone-3-sdd-plus-semantic-engineering.md` (draft: true)

Paths below are relative to `content/`. Anchors are heading ids. "FLAG" marks a sentence the author should check.

## Opening diagram and caption

- Diagram `structured-landscape.svg` (used on `sdlc/process/_index.md` and `sdlc/translation-tax.md`).
- Caption: `sdlc/process/_index.md#the-structured-landscape` (both paragraphs, nearly verbatim); `sdlc/translation-tax.md#the-structural-response`.
- "External signals are unchanged from Zones 1 and 2": the source says "External signals are unchanged. Custodians are unchanged" relative to the manual landscape. FLAG: "from Zones 1 and 2" is my framing (the manual landscape is the Zone 1/2 picture per the Zone 1 and Zone 2 diagram captions).

## The Manual SDLC Problem This Zone Addresses

- "spec is still text, and the spec captures one custodian's view": `sdlc/zones/zone-2-spec-driven-development.md#when-this-zone-stops-working` (first paragraph).
- The three partial resolutions: `sdlc/zones/_index.md#the-detailed-mapping-by-mtt-component` (Zone 2 column).
- List of ceilings: `sdlc/zones/zone-2-spec-driven-development.md#when-this-zone-stops-working` (localized context, spec drift, single-layer coverage, specs become the new bottleneck, token economy "super-linearly with change complexity").
- "Zone 3 changes the medium..." paragraph: `sdlc/zones/_index.md#zone-3-sdd-plus-semantic-engineering` (near-verbatim, including "The Manual Translation Tax collapses because the medium changes from text artifacts to machine-readable ontologies").

## Where the Team Is

- Spec remains canonical intent; SDD habits transfer: `sdlc/zones/zone-2-spec-driven-development.md#what-the-knowledge-graph-adds`, `#from-sdd-to-se` ("The spec authorship habits transfer directly").
- Graph beside specs, impact analysis before code, merge updates graph: `sdlc/zones/_index.md#zone-3-sdd-plus-semantic-engineering` and the zones table row for Zone 3.
- Spec sprint one or two sprints ahead; workshop time-boxed to one or two days, batched: `sdlc/process/_index.md#how-the-sprints-coordinate`, `sdlc/process/spec-sprint.md#the-mechanics`.
- Known-plan execution: `sdlc/process/spec-sprint.md#why-a-separate-cadence`.
- Developer in the per-change loop at Zone 3: `sdlc/process/implementation-sprint.md#zone-4-agents-run-the-loop` (first paragraph) and `#the-per-change-sdlc-flow` stage 4.

## What the Team Operates With

- Opening sentence mirrors the Zone 2 page's "The AI tool plus a verifiable per-change contract" (`zone-2-spec-driven-development.md#what-the-team-operates-with`). "a structured, current model of the whole application" is my phrasing of `sdlc/process/_index.md#three-sources-of-truth` ("Application state ... the full application as it actually runs today").
- Diagram `three-sources-of-truth.svg` (previously unused). Table: `sdlc/process/_index.md#three-sources-of-truth` (first three columns, verbatim).
- Named owner, no write without approval: `sdlc/agents.md#agent-ownership`.
- Agent table: purposes from `sdlc/agents.md#the-fleet-at-a-glance`, `#the-impact-analysis-agent` (pre and post modes), `#what-the-gate-checks`, `#the-bdd-generation-agent`, `#the-kg-sync-agent` / `#the-update-flow`; owners verbatim from `sdlc/agents.md#agent-ownership`. Cross-Product Impact Extension and Portfolio Rationalization Agent are left out because `sdlc/process/_index.md#from-zone-3-to-zone-4` places them in Zone 4.
- FLAG: the agent table lists the agents named in Phase 2 deliverables plus BDD Generation and Extraction. The content never states an explicit "Zone 3 agent list"; the selection is mine (the structured landscape and per-change flow name Impact Analysis, PR Validation, KG Sync; the brownfield archetype adds BDD Generation; extraction is the brownfield entry).
- Aperture: `sdlc/methodology.md#aperture`, `#the-blast-radius-test`, `#how-the-aperture-matures` (phase table; "top three to five outcomes" and "top ten" shortened to "the top outcomes" and "the top ... dependencies").
- P0 checks on every merge, blocked merge: `sdlc/methodology.md#the-14-verification-checks`.

## When This Zone Is Genuinely Suitable

- First sentence: `sdlc/zones/_index.md#zone-3-sdd-plus-semantic-engineering` (bold lead sentence).
- "Below that range ... overhead without payback": `sdlc/zones/_index.md#how-the-manual-translation-tax-scales-with-work-complexity` ("Use a higher-zone process below its range and the team pays overhead without benefit") and `zone-2-spec-driven-development.md#when-this-zone-is-genuinely-suitable` ("adding ontologies would be overhead without payback").
- "Above it ... cross-product machinery of Zone 4": zones table, Zone 3 row, last column.
- Table rows:
  - Multi-team / multi-repo: zones table Zone 3 row; `sdlc/agents.md#how-the-gate-catches-cross-team-contract-violations`.
  - Brownfield: `zone-2-spec-driven-development.md#when-this-zone-stops-working` (renewal-reminder example, behavior scattered across services); `sdlc/methodology.md#brownfield-extraction` ("model of the system's actual behavior"); `sdlc/case-archetypes.md#what-changed-in-how-the-team-works` (three to five days of archaeology versus eight minutes). FLAG: "in minutes" condenses "eight minutes".
  - Greenfield grown into complexity: `sdlc/case-archetypes.md#the-evolution`, `#what-was-built` (second instance, greenfield), `#methodology-takeaways`. FLAG: "typically Design" generalizes from one archetype plus `sdlc/zones/_index.md#time-to-value-at-each-transition` ("The Design Ontology slice path is the most common entry point for greenfield teams").
  - Single product crossed into multi-team coordination: `sdlc/process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence` (third row).
  - Mature SDD at governance ceiling: `sdlc/case-archetypes.md#sdd-at-the-governance-ceiling`, `#where-se-goes-next`, `#methodology-takeaway` ("review, the QA validation, the governance ... gain a structural floor").
- Examples paragraph: `sdlc/case-archetypes.md#brownfield-enterprise-modernization`, `#greenfield-growing-into-complexity`, `#sdd-at-the-governance-ceiling` (project shape tables).

## How Teams Enter This Zone

- Link to `zone-2-spec-driven-development.md#from-sdd-to-se` and its subsections.
- Table: `sdlc/zones/_index.md#time-to-value-at-each-transition` (two SDD to SE rows verbatim); "Most common for" column from the paragraph under that table.
- "most consequential" sentence: same section.
- Staged adoption: `sdlc/case-archetypes.md#methodology-takeaways` ("SE adoption can be staged by ontology ... produces measurable wins immediately and builds the operating discipline for broader rollout").
- 53%: `sdlc/case-archetypes.md#results-from-the-first-se-governed-sprint`; also home page `_index.md#numbers-from-real-engagements`.

## How the Methodology Compares at This Zone

- Diagram `mtt-by-zone-resolution.svg` (previously unused). FLAG: the diagram's Zone 4 column includes "cross-product ontology federation resolves cross-domain terms", a phrase that does not appear in any page text. The page text does not repeat it, but the diagram shows it.
- Lead-in sentences and MTT table: `sdlc/zones/_index.md#the-detailed-mapping-by-mtt-component` (Zone 1, 2, 3 columns, verbatim apart from articles and colons replacing parentheses).
- Practice table, row by row:
  - Where the truth lives: `zone-2-spec-driven-development.md#the-spec-interview-flow-structure-living-document` ("In SDD the spec is the single source of truth for a change"); `sdlc/process/_index.md#three-sources-of-truth`.
  - Spec sprint, impact analysis (first half), spec freeze: `zone-2-spec-driven-development.md#spec-sprint-cadence-as-a-zone-2-best-practice` (comparison table); `sdlc/process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence` (lighter form description).
  - Impact analysis, eight minutes: `sdlc/methodology.md#the-number-that-decides-it`.
  - Context the coding agent receives: `zone-2-spec-driven-development.md#code-generation-and-review` (first sentence), token economy paragraph under `#when-this-zone-stops-working`; `sdlc/agents.md#the-cognitive-shortcut-framing`; `sdlc/methodology.md#queryability-and-the-token-economy`.
  - Code review: `zone-2-spec-driven-development.md#code-generation-and-review` (review elements table); `sdlc/agents.md#the-variance-bounding-insight`. FLAG: "reviewers also check whether the agent touched the right files" for Zone 2 is inferred from agents.md, which says the "did the agent get the right files?" question "consumed most of the senior engineer's review time" before the impact report. It is not stated about the Zone 2 practice specifically.
  - Merge gate: Zone 2 diagram caption (`zone-2-spec-driven-development.md`, opening paragraph: "CI drift detection plus manual review"); SAST/DAST from `#engineering-constraints-standards-security-and-quality`; Zone 3 from `sdlc/agents.md#the-pr-validation-agent` and `zone-2-spec-driven-development.md#what-stays-the-same` ("adds validation gates rather than replacing them").
  - Test scenarios: `zone-2-spec-driven-development.md#validation-spec-first-qa-bdd-and-automation`; `sdlc/agents.md#coverage-as-a-byproduct-of-the-ontology` ("typically reaches 93.4% test coverage with zero manual BDD overhead").
  - Knowledge after merge: Zone 2 diagram caption ("The other three artifacts ... are still red and still decay"); `#what-mature-sdd-buys-you` ("Knowledge captured in the constitution and the spec history"); `sdlc/agents.md#the-kg-sync-agent`, `#post-implementation-mode`.
  - Team shape: `zone-2-spec-driven-development.md#the-pod-small-feature-teams-that-own-end-to-end`; `sdlc/process/team.md#the-layered-team-structure`.
- "Several things carry over": `zone-2-spec-driven-development.md#what-stays-the-same`.
- Custodians stay human: `sdlc/translation-tax.md#where-we-draw-the-line-on-automation`, `#what-the-methodology-changes-and-what-it-does-not`. FLAG: "carries over from all three zones" is my framing; the source states the custodians stay human as the methodology's core commitment, and Zones 1 and 2 describe the custodians as present.

## When This Zone Stops Working

- FLAG: the two-way framing ("outgrow it, or the discipline erodes") and the split of the five signals into "move up" versus "repair" are my editorial structure. Each underlying statement is sourced below.
- Work spans products: `sdlc/process/_index.md#from-zone-3-to-zone-4` ("Zone 3 is single-product Semantic Engineering: one knowledge graph, one product"; Cross-Product Impact Extension and Portfolio Rationalization Agent in Zone 4); `sdlc/methodology.md#partition-by-product`, `#the-number-that-decides-it`, `#cross-product-reasoning` (the two questions). FLAG: "When changes regularly affect other products" is my wording; the spec sprint already has a step for cross-product changes (`sdlc/process/spec-sprint.md#what-happens-in-a-spec-sprint`, step 6), and the Zone 2 page's spec sprint table puts the cross-product extension in the "Zone 3+" column. The page does not mention step 6, to avoid implying Zone 3 never handles a cross-product change; the author may want to reconcile.
- Sustained operation across years: zones table Zone 3 row last column; `sdlc/zones/_index.md#zone-4-se-at-scale`; `sdlc/process/_index.md#from-zone-3-to-zone-4` ("codified engagement principles"). FLAG: "an enablement layer that is still forming" comes from `practitioner/_index.md#phase-2-se-foundation` ("the Enablement Layer begins to form"), which is outside the listed source pages.
- Sync not continuous: `sdlc/agents.md#why-sync-must-be-continuous` (near-verbatim).
- Aperture too wide: `sdlc/methodology.md#aperture` (first paragraph), `#the-decision-rule`, `#how-the-aperture-matures` ("New elements enter when their blast radius warrants it").
- Operating model: `sdlc/zones/_index.md#change-management-considerations` (near-verbatim); `sdlc/process/team.md#what-to-expect`.
- Signals table: my condensation of the five paragraphs above. FLAG: the "signal you will see" wording ("Graph maintenance consuming the team's attention", "Impact reports that no longer match the code") is mine, derived from the sources above.

## Readiness Criteria to Move to Zone 4

- The three bullets: zones table, Zone 3 row, "Where the work crosses into the next zone" ("spans multiple products, requires cross-product reasoning, or needs sustained operation across years and multiple engagement teams"). "any of" follows the source's "or". "that no single product graph can answer alone" echoes `sdlc/zones/_index.md#time-to-value-at-each-transition` ("First cross-product query that no single graph could answer alone").
- "stabilize at Zone 3 for several quarters": `sdlc/process/_index.md#from-zone-3-to-zone-4`.
- Phase 2 gate: `practitioner/_index.md#phase-2-se-foundation` (phase-gate criteria, near-verbatim). FLAG: this page is outside the listed source pages; it is existing site content and the Zone 2 page already links to the Three-Phase Rollout.

## From SDD plus SE to SE at Scale

- First paragraph: `sdlc/process/_index.md#from-zone-3-to-zone-4` (near-verbatim).
- What Changes for the Implementation Team: `sdlc/process/implementation-sprint.md#what-changes-for-the-implementation-team` (table verbatim, paragraph on agent-by-agent progression and "the floor across the fleet").
- Time to Value: `sdlc/zones/_index.md#time-to-value-at-each-transition` (last row verbatim).
- Spec sprint at portfolio scale: `sdlc/process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence` (fourth row).
- Accion Labs callout: `sdlc/process/_index.md` callout ("How Accion Labs operationalizes the continuous SDLC operating model") and `zone-2-spec-driven-development.md` callout (Breeze.AI implements the four-layer graph, brownfield extraction, Impact Analysis Agent).
- Closing "Next" line: links only.

## Checks run

- `grep -nE '[—–]|\bhonest|, not |\bnot\b[^.]{0,60}\. (It|This|They) (is|are)'` on the page: no hits.
- `node scripts/build-content.mjs`: no problems reported (all links and anchors resolve; all three diagrams found).
