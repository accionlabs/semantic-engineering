# Source map: The Agile and Scrum Baseline

Page: `content/sdlc/zones/agile-scrum-baseline.md` (draft). Every statement below is traced to an existing page and heading. Items marked **FLAG** are sentences where the support is partial, interpretive, or assembled from more than one passage; the author should check them.

## Intro (before the first heading)

- Teams "already run distributed Scrum": `sdlc/process/team.md` (opening paragraphs; "distributed-scrum architecture"); `sdlc/case-archetypes.md#brownfield-enterprise-modernization` (five to six scrum teams); `sdlc/case-archetypes.md#the-sdd-ceiling-in-operation` ("the entire leadership is agile focused"). **FLAG:** "Most enterprise teams ... already run distributed Scrum" is the brief's framing. No page states it as a general fact; the closest is team.md calling distributed scrum "the conventional" architecture.
- The quote "The conventional distributed-scrum architecture was the right answer ...": `sdlc/process/team.md` (opening, second paragraph), repeated in `sdlc/process/_index.md#the-team-that-runs-the-two-sprints`.
- "AI compresses the work the engineer did and pushes the bottleneck upstream into specification, ontology curation, design system maintenance, and architecture currency": `sdlc/process/team.md` (opening, second paragraph).

## The Baseline Operating Model

- Scrum element table: standard Scrum definitions paraphrased from the Scrum Guide (allowed by the brief, one sentence each). Story points and velocity are labelled as practice outside the Scrum Guide. **FLAG:** check that the author is comfortable with the "one month or less" and "ordering the product backlog" wording (both from the Scrum Guide, not the site).
- "Each scrum team owned a workstream, contained all the disciplines ... Coordination across teams happened through informal channels and occasional architecture reviews": `sdlc/process/team.md#layered-team-structure-in-depth`.
- Specialists engaged as one-time or quarterly inputs, lose visibility: `sdlc/process/team.md#visibility-across-workstreams`.
- Architect often only at quarterly review cadence, designer often only at the start of a workstream: `sdlc/process/team.md#the-role` (last paragraph under Forward-Deployed Engineers > The Role).

## What Distributed Scrum Was the Right Answer For

- Optimized for implementation throughput; autonomy absorbed implementation hours; trade-off accepted because a central bottleneck was costlier: `sdlc/process/team.md#how-the-layered-structure-complements-distributed-scrum`.
- Small greenfield team: conventional sprint cadence with spec authorship at the start works; separate cadence adds overhead without payback: `sdlc/process/spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence` (first table row); also `sdlc/process/spec-sprint.md#why-a-separate-cadence` (third paragraph).

## Where the Manual Translation Tax Sits in a Sprint

- Diagram `sprint-communication-breakdown.svg`: already used on `sdlc/translation-tax.md#what-this-looks-like-on-a-sprint`.
- PO knowledge refined through sprint planning conversations, rarely in the ticket: `sdlc/translation-tax.md#what-the-custodians-know-that-the-code-does-not-show`.
- One-paragraph user story, five bilateral messages, unrecorded, not captured for the next developer: `sdlc/translation-tax.md#what-this-looks-like-on-a-sprint`.
- Component table: Ambiguity row from `sdlc/translation-tax.md#how-it-shows-up-in-a-sprint` (Requirements ambiguity); Non-persistence row combines "Architectural drift" and "Loss after a senior departure" from the same table; Non-traceability row from `sdlc/translation-tax.md#the-three-components-of-the-tax` (Non-traceability paragraph). **FLAG:** the mapping of the sprint-friction rows onto the three named components is mine; the source table lists six frictions without assigning each to a component.
- "Ten-engineer teams cannot ship faster than five-engineer teams": `sdlc/translation-tax.md#how-it-shows-up-in-a-sprint` (closing paragraph).
- "In the baseline the tax is paid through people: Slack DMs, peer pings, ad hoc conversations, and the senior engineer's memory": `sdlc/translation-tax.md#the-landscape-today` (the caption describing the mechanism). **FLAG:** the source describes the manual landscape generally; the page applies it to "the baseline".

## What AI Changes About the Baseline

- Bottleneck moves into specification, design, architecture, ontology curation, cross-product reasoning; scrum team structure does not contain those disciplines at the needed depth: `sdlc/process/team.md#layered-team-structure-in-depth` (second paragraph).
- "Adding more engineers to a spec-bound project produces no acceleration ... skill mix is wrong": `sdlc/process/team.md` (opening). **FLAG:** the page joins the two sentences with "because"; the source places them side by side.
- "AI compresses implementation, which was the cost distributed scrum was built to absorb": synthesis of `team.md#how-the-layered-structure-complements-distributed-scrum` ("absorbed the largest cost of the pre-AI era: implementation hours") and "AI shifts the balance. Implementation hours compress".
- Zone 1 bullet: custodian input ad hoc and unrecorded; diff four times bigger, review slower: `sdlc/zones/zone-1-manual-vibe-coding.md#when-this-zone-stops-working`.
- Zone 2 bullet: spec and implementation compressed into one timebox: `sdlc/zones/zone-2-spec-driven-development.md#spec-sprint-cadence-as-a-zone-2-best-practice`; senior people stuck in spec authoring and review, cost structure no longer aligns with FTE-based estimation: `zone-2-spec-driven-development.md#when-this-zone-stops-working` (Specs become the new bottleneck). **FLAG:** the bullet links only to the "When This Zone Stops Working" section though its first clause comes from the spec sprint best-practice section.
- Mature SDD bullet: "collaboration patterns that absorbed load in agile have no equivalent", async loop with the agent: `sdlc/case-archetypes.md#the-sdd-ceiling-in-operation` (Operating-model burnout). "Most operationally mature SDD practice" from `case-archetypes.md#sdd-at-the-governance-ceiling`.
- "A different team shape and a separate cadence for specification": `sdlc/process/team.md` (opening, third paragraph).
- Spec written at start of implementation sprint compresses two activities, both done poorly: `sdlc/process/spec-sprint.md#why-a-separate-cadence`.

## How the Methodology Compares with the Baseline

Diagram `mtt-by-zone-resolution.svg` (exists in `static/diagrams/`, previously unused on any page; its text matches the zones landing MTT table).

Row by row:

- **Team shape.** Baseline: `team.md#layered-team-structure-in-depth`, `team.md#visibility-across-workstreams` ("outside the scrum team, called in occasionally with significant ramp each time"). Zone 1: `zones/_index.md#the-four-zones` (single-developer scope, no team coordination); `zone-1-manual-vibe-coding.md#when-this-zone-stops-working` (ad hoc Slack). Zone 2: `zones/_index.md#the-four-zones` (PO / architect / designer triangle); `zone-2-spec-driven-development.md#the-pod-small-feature-teams-that-own-end-to-end`. Zone 3: `team.md#the-layered-team-structure`, `team.md#fractional-allocation`, `team.md#visibility-across-workstreams`. Zone 4: `process/_index.md#from-zone-3-to-zone-4`, `zones/_index.md#zone-4-se-at-scale`.
- **Cadence.** Baseline: `spec-sprint.md#why-a-separate-cadence`; `team.md#the-evolving-role-mix` (architecture review "from a quarterly event"). Zone 1: no cadence change described. Zone 2: `zone-1-manual-vibe-coding.md#the-operating-model-change` (spec as hard gate before sprint planning); `zone-2-spec-driven-development.md#the-async-workflow` ("closer to project execution than to daily-standup agile", deploy per feature); `zone-2-spec-driven-development.md#spec-sprint-cadence-as-a-zone-2-best-practice`. Zone 3: `process/_index.md#the-two-sprints`; `spec-sprint.md#the-mechanics`; `team.md#why-the-shape-works` (enablement quarterly and on trigger). Zone 4: `implementation-sprint.md#what-changes-for-the-implementation-team` (each agent earns autonomy on its own evidence); `implementation-sprint.md#zone-4-agents-run-the-loop` (audit trail on a defined cadence).
- **Backlog and specification.** Baseline: `translation-tax.md#what-this-looks-like-on-a-sprint` (one-paragraph user story); `translation-tax.md#what-the-custodians-know-that-the-code-does-not-show` (rarely in the ticket). Zone 1: `zones/zone-1-manual-vibe-coding.md#where-the-team-is` and the diagram caption (vague, often verbal). Zone 2: `zones/_index.md#zone-2-spec-driven-development`; `zone-1-manual-vibe-coding.md#the-operating-model-change` (reviewed by PO, architect, tech lead). Zone 3: `spec-sprint.md#the-mechanics`, `process/_index.md#how-the-sprints-coordinate`. Zone 4: `spec-sprint.md#when-the-spec-sprint-is-worth-a-separate-cadence` (multi-product row), `spec-sprint.md#cross-product-reconciliation-lives-in-the-spec-sprint`.
- **Estimation.** Baseline: `team.md#phase-1-effort-based-engagement-current-market-posture` (story points, velocity); `team.md#what-this-means-for-procurement` (engineer-hours times rate, labelled there as the procurement default). Zone 1: nothing described. Zone 2: `team.md#phase-1-effort-based-engagement-current-market-posture` and `case-archetypes.md#the-sdd-ceiling-in-operation` (Estimation misfit). Zone 3: `team.md#why-the-same-people-can-cover-more-workstreams` (five story points to fifteen or twenty) and `team.md#phase-1-effort-based-engagement-current-market-posture`. Zone 4: `team.md#phase-2-deliverable-based-engagement`; `case-archetypes.md#where-se-goes-next`. **FLAG (Zone 3 and Zone 4 estimation cells):** the site does not tie the effort-based or deliverable-based frames to a zone; the shift is tied to vocabulary standardization ("As ontology and semantic engineering vocabulary becomes standardized"). The velocity uplift is stated for "once the graph is in place", which I placed at Zone 3. The Zone 4 cell says "No zone-specific change described" and then names the deliverable frame as the structural response; the author may prefer plain "No change described".
- **Review.** Baseline: `translation-tax.md#the-manual-translation-tax-the-cost-named` (reviewer opens PR, ticket, spec, architecture page); `translation-tax.md#how-it-shows-up-in-a-sprint` (reconciliation in code review). Zone 1: `zone-1-manual-vibe-coding.md#when-this-zone-stops-working`. Zone 2: `zones/_index.md#zone-2-spec-driven-development`; `zone-1-manual-vibe-coding.md#the-operating-model-change` (CI drift detection); `zone-2-spec-driven-development.md#code-generation-and-review`. Zone 3: `implementation-sprint.md#the-per-change-sdlc-flow`; `zone-2-spec-driven-development.md#what-stays-the-same` (judgment calls rather than context assembly). Zone 4: `implementation-sprint.md#what-changes-for-the-implementation-team`.
- **Knowledge held between sprints.** Baseline: `translation-tax.md#the-landscape-today`, `translation-tax.md#why-documentation-does-not-fix-it`. Zone 1: `zones/_index.md#the-detailed-mapping-by-mtt-component` (Non-persistence, Zone 1). Zone 2: same table; `zone-2-spec-driven-development.md#what-mature-sdd-buys-you` (constitution and spec history survive turnover); Zone 2 diagram caption (other three artifacts still red and decaying). Zone 3: same table; `implementation-sprint.md#the-per-change-sdlc-flow` (stage 6: next spec sprint runs against current graph). Zone 4: `zones/_index.md#zone-4-se-at-scale` (custodianship holds the asset across years).
- **Ambiguity, Non-persistence, Non-traceability.** Zone columns copied in substance from `zones/_index.md#the-detailed-mapping-by-mtt-component`. Baseline column: `translation-tax.md#how-it-shows-up-in-a-sprint` and `translation-tax.md#the-three-components-of-the-tax`. **FLAG:** the zones table starts at Zone 1 and has no "manual baseline" column; the baseline cells describe the tax in the manual process as the translation-tax page does. Zone 1 for Ambiguity is shown as "Amplified by AI velocity"; the diagram `mtt-by-zone-resolution.svg` labels the same cell "UNCHANGED" while the zones table text says "Amplified". I followed the table text.
- Closing sentence ("each zone keeps what the previous zone provided and adds the response to a failure the previous zone cannot handle at the higher complexity range"): `zones/_index.md#the-four-zones`.

## What Carries Forward from the Baseline

- Implementation layer continues to do what distributed scrum was good at, under structural validation and higher velocity: `team.md#how-the-layered-structure-complements-distributed-scrum`. **FLAG:** team.md says both that the layered model "replaces distributed scrum" and that it "complements" it, with the implementation layer continuing scrum's work. The page presents both; the author may want one framing to lead.
- Implementation sprint on regular team sprint cadence: `process/_index.md#the-two-sprints`.
- Ticket system remains progress source of truth; project management does not change: `zone-2-spec-driven-development.md#what-stays-the-same`.
- Backlogs in existing platform, labels or boards: `process/_index.md#the-two-sprints`; `spec-sprint.md#the-spec-sprint-and-the-implementation-sprint-together`.
- In-team roles remain embedded in the scrum cycle: `team.md#the-evolving-role-mix`.
- Product owner owns spec sprint, custodian of Functional Ontology: `spec-sprint.md#the-mechanics`; `team.md#what-each-layer-does`.
- Code review still happens: `zone-2-spec-driven-development.md#what-stays-the-same`.
- Rationalization findings flow back into normal sprint planning: `sdlc/methodology.md#extraction-as-rationalization` (How the Patterns Emerge Mechanically, last paragraph); also `methodology.md#how-the-aperture-matures` ("rationalization findings flowing back into sprint planning").
- Three sources of truth: `process/_index.md#three-sources-of-truth`.

## Estimation Against Story Points

- Leadership wants story points because the rest of the portfolio runs on them: `case-archetypes.md#the-sdd-ceiling-in-operation` (Estimation misfit).
- Quote: verbatim from `team.md#phase-1-effort-based-engagement-current-market-posture` (the case-archetypes version omits the sentence "They understand story points but SDD does not have a story point").
- "The team writes effectively no code by hand ... effort frame still works for procurement ... less and less accurately": same section of team.md.
- Velocity rises as implementation compresses under structural validation: `team.md#why-the-same-people-can-cover-more-workstreams`.
- Deliverable-based frame (validated graph, agent fleet, graph-health SLA; clients commit to the asset): `team.md#phase-2-deliverable-based-engagement`; `case-archetypes.md#where-se-goes-next`. "The same engagement model supports both": `team.md#phase-2-deliverable-based-engagement` (last paragraph).
- **FLAG:** "The methodology addresses this in two stages" maps the two engagement phases onto estimation. The source presents the phases as engagement/commercial frames; case-archetypes says the deliverable frame "reshapes the estimation conversation", which supports the link for Phase 2 only.

## Moving from the Baseline

- Right zone set by complexity; same team at different zones for different workstreams: `zones/_index.md#how-the-manual-translation-tax-scales-with-work-complexity`.
- Manual to SDD four to six sprints; first result reduction in code review burden: `zones/_index.md#time-to-value-at-each-transition`.
- Sprints 1 and 2 feel slower; improvement starts in Sprint 3: `zone-1-manual-vibe-coding.md#adoption-considerations` (linked via the parent `#from-manual-to-sdd`).
- **FLAG:** the transition table on zones/_index.md is "Manual to SDD"; the page treats "the baseline" as the manual starting point for this transition. The site does not state that a distributed-scrum team is necessarily at Zone 1.
- Four-quarter transition: `team.md#how-the-transition-is-managed`.
- Methodology in weeks, operating model across quarters: `team.md#what-to-expect`; `zones/_index.md#change-management-considerations`.
- Engineers contribute across workstreams, consume specs they did not author, follow the validation gate: `team.md#adoption-considerations` (second one, under Layered Team Structure in Depth). Note the heading "Adoption Considerations" occurs three times on team.md, so it was not linked.

## Closing links

- Zone pages 1 to 4, Team, Spec Sprint. Zone 3 and Zone 4 pages are drafts written in parallel; the build resolved both links.
