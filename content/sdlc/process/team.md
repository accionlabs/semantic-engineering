---
title: "Team"
description: "The operating model that delivers Semantic Engineering at enterprise scale. Fractional allocation, the layered team structure, and the Forward-Deployed Engineer role."
weight: 30
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - vp-engineering
  - engineering-manager
  - chief-people-officer
---

We created org structures around manual development processes, and we are getting code as the outcome of those org structures and the skill sets we built. We cannot wish that history away. We can change the org structure going forward, and the code that comes out of it will follow.

The conventional distributed-scrum architecture was the right answer for the work engineers did ten years ago. AI compresses the work the engineer did, and pushes the bottleneck upstream into specification, ontology curation, design system maintenance, and architecture currency. The org structure that delivered the old work does not deliver the new work. Adding more engineers to a spec-bound project produces no acceleration. The skill mix is wrong.

Semantic Engineering at enterprise scale requires a different team shape. The three-layer model below replaces distributed scrum, with named roles, fractional staffing, and a [spec sprint](spec-sprint.md) cadence that runs ahead of implementation. The methodology can be rolled out faster than the team transition, but the full value of the methodology depends on completing the team transition.

## The Layered Team Structure

![The three-layer team structure: Custodianship (top, the four ontology custodians), Implementation (middle), Enablement (bottom, Accion Labs-supplied). Each layer with roles, cadence, sizing, and coordination flow](/diagrams/three-layer-team-structure.svg)

| Layer | Role | What this layer does |
|---|---|---|
| Top: Custodianship | Product Owner, Architect, UX Designer, Engineering Team representative | The four ontology custodians. Each owns one ontology layer. Runs the [spec sprint](spec-sprint.md). Validates specs against the knowledge graph via Impact Analysis. Makes cross-product reconciliations. Output is specifications, not code. Typically client-supplied, with Forward-Deployed Engineers backfilling missing coverage. |
| Middle: Implementation Teams | Implementation Engineers, Agent Developers | Consumes the impact-analyzed specification. Produces code (or in the target state, agents that produce code) under the four-ontology governance. |
| Bottom: Enablement (Accion Labs-supplied) | Chief Architect, Ontology Maintainer, Knowledge Agent Owner, Semantic Engineers | Supports the custodianship layer with cross-ontology governance, ontology stewardship, agent-fleet operations, and brownfield extraction. Provides customization, setup, and managed support. Sits beneath the custodians, who own the asset. |

## What to Expect

The methodology promises speed, quality, and a sustainable knowledge asset. The operating model that delivers all three is a change-management exercise that runs across quarters. Restructuring teams. Restructuring incentives. Restructuring how engineers are evaluated. Restructuring how vendors are paid. The methodology produces partial value before the operating model catches up. The full value depends on completing the operating-model transition.

In our client conversations we set the expectation early: the methodology can be rolled out in weeks, while the operating model that delivers its full value matures across quarters.

> **How Accion Labs supports the team transition**
>
> The [engagement model](../../practitioner/_index.md#engagement-model) covers Advise, Launch, Scale, and Optimize phases. The Forward-Deployed Engineer program is a named offer in [Practitioner services](../../practitioner/_index.md#services). Managed support tiers (Light Governance, Medium Curation, Deep Operations) are described on the [Enablement Partnership](enablement-partnership.md) page.

---

## Fractional Allocation

Semantic Engineering changes how specialist time is consumed. The four ontology custodians and the supporting specialist roles continue to be the people who design and steward the system. What changes is how much of their attention each individual workstream needs. The materialized view of the four-layer graph gives each custodian direct access to the current state of every product they touch, so the time they used to spend reconstructing context (pulling up old docs, re-reading code, asking colleagues what changed) drops sharply. The recovered time is what lets the same person cover more workstreams at the same depth of judgment.

The pattern we use is **fractional allocation**: high-value specialists allocated across a larger number of workstreams, each workstream getting them at the moments their judgment is needed.

![Fractional allocation: AI compresses coding while upstream specialist work expands. Five fractional specialists engage at trigger points](/diagrams/fractional-allocation.svg)

### Why the Same People Can Cover More Workstreams

Three things change once the graph is in place.

Implementation time compresses. Velocity rises substantially with AI assistance under structural validation. A scrum team that previously delivered five story points per sprint may deliver fifteen or twenty against the same effort budget. Time-per-feature on the implementation side goes down.

Context-recovery time compresses for the custodians. The Architecture Ontology answers "where does this boundary sit today?" without the architect rereading code. The Functional Ontology shows the product owner what outcomes already exist. The Design Ontology surfaces the components already in the system. The Code Ontology lets the engineering team verify code touchpoints without scanning the codebase. Each custodian gets a materialized view of their layer rather than reconstructing it from artifacts every time they're pulled into a question.

Task switching becomes cheap. The biggest hidden cost of multi-workstream coverage in the manual model is the ramp-up required every time a specialist re-enters a workstream they haven't touched in a few weeks. With the graph, the re-entry cost is minimal: the architect or designer opens their layer of the graph, sees the current state, and is ready to contribute. The same architect who used to be effectively dedicated to one workstream can now cover two or three, because the depth of attention they bring per question is unchanged but the time per question drops.

### What Fractional Allocation Means

Fractional allocation means specialists are engaged at the moments their judgment creates value, sized to the deliverable rather than to a calendar quarter. The pattern has four common characteristics.

| Characteristic | What it means |
|---|---|
| Specialist depth | The role requires fluency in a specific discipline (ontology design, agent engineering, data architecture, deployment, design system stewardship) that takes years to build |
| Lower total duration on any given workstream | The specialist contributes at the moment their judgment is needed and then moves to the next workstream |
| Sharply scoped deliverable | An ontology, a design system update, a data model, a deployment architecture, an agent specification. A defined output, not a vague "be available" |
| Continuous re-engagement across the lifecycle | Not a single front-loaded engagement; the same specialist returns when a workstream needs them again, with low re-entry cost |

The recovered time across the team is real value. Some of it shows up as cost reduction; some shows up as faster delivery and a knowledge asset that compounds over years.

### The Evolving Role Mix

The team composition that delivers the methodology has two distinct categories: in-team roles (continuous, embedded in the scrum cycle) and fractionally allocated specialists (engaged at trigger points across multiple workstreams).

**In-team roles** remain continuous and embedded in the workstream's scrum cycle.

| Role | What changed from the pre-SE pattern |
|---|---|
| Product Designer (evolved from BA) | Moves from business systems analysis to product mechanics; understands how products are built, not just what they should do. The Functional Ontology gives them a materialized view of every outcome already in the system. |
| UX Designer | Ships working UI code with design-system primitives, anchored to the Design Ontology. AI generates reliable UI when fed component-level structure, which is what the Design Ontology provides. |
| Solution Architect / Tech Lead | Owns architecture currency through the Architecture Ontology, which is updated on every merge by KG Sync. Architecture review moves from a quarterly event to a state that is always visible. |
| Implementation Engineers | Higher leverage per engineer; work with AI agents inside the four-ontology governance frame. The implementation step compresses; the human review and integration step remains essential. |

**Fractional allocation** applies to specialists who engage at trigger points across multiple workstreams.

| Role | When engaged | Deliverable |
|---|---|---|
| Semantic Engineer | Ontology design, brownfield extraction, cross-layer linking | The knowledge graph itself, kept structurally correct |
| Agent Developer | Building Impact Analysis, PR Validation, BDD Generation, KG Sync agents | The agent fleet that operates on the knowledge graph |
| Data Architect | Data model design, data ontology curation, agentic-context data layer | The data layer that powers agentic capabilities; this role grows in importance as software shifts toward agentic patterns |
| DevOps Architect | CI/CD integration of ontology gates, deployment architecture currency | The pipeline gates that enforce semantic governance at merge time |
| UX Architect / Design System Owner | Design system curation, component governance | The design primitives that make AI-generated UI reliable |

### Visibility Across Workstreams

In a conventional SDLC, roles like data architect, UX architect, and DevOps architect are typically engaged as one-time or quarterly inputs. They produce a design or a review, hand it off, and lose visibility into how it gets used. When they're called back in, they spend significant time recovering state before they can contribute.

The graph closes that visibility gap. The architect's view of architecture is always current; the designer's view of the component system is always current. When the architect is called into a new workstream's spec sprint, the relevant context is already in the graph and the re-entry is into structured state, not into prose they have to re-read. That is what lets the architect cover two or three workstreams without losing depth on any one of them.

The practical change for a delivery organization: specialists move from "outside the scrum team, called in occasionally with significant ramp each time" to "outside the scrum team, with continuous visibility through the graph, engaged at specific trigger points with low ramp".

### What This Means for Procurement

When a client expects an AI-driven engagement to deliver cost reduction matching the implementation effort reduction, the right answer is to reframe the value.

| Old framing (procurement default) | New framing (methodology reality) |
|---|---|
| AI compresses coding by 60%; total project cost falls by 60% | AI compresses coding by 60%; total project cost falls by 30%, with the remaining value in speed, quality, and a sustainable knowledge asset |
| Vendor cost is engineer-hours times rate | Vendor cost is the deliverable (ontology, agent fleet, enablement hours) times rate |
| Cost optimization comes from fewer engineer-hours | Cost optimization comes from compounding value of the knowledge asset over time |

The headline savings from AI-assisted coding are real but partial. The compounding value is in speed and quality. The deliverable shape changes: clients receive a maintained semantic model alongside the running code, and the model makes every future change cheaper.

### Adoption Considerations

The fractional allocation model differs from how many engineering organizations are staffed today. Compensation, evaluation, and career progression often assume one-workstream attribution and may evolve over time to recognize specialist contribution across multiple workstreams. Procurement contracts may also evolve to support continuous re-engagement alongside conventional FTE allocations.

The methodology can be deployed before the operating model fully shifts. The full value compounds as the operating model matures. See [Engagement Model Evolution](#engagement-model-evolution) below for the two-stage engagement-shape transition.

> **How Accion Labs staffs the fractional allocation model**
>
> Accion Labs fields specialists from a shared pool across multiple client engagements. The pool means a single specialist can support several engagements while maintaining depth of judgment on each, so each engagement gets focused expertise at the moments it needs them.

---

## Layered Team Structure in Depth

The conventional distributed-scrum architecture was the right answer for the work engineers did ten years ago. Each scrum team owned a workstream, contained all the disciplines needed to ship that workstream, and operated relatively independently. Coordination across teams happened through informal channels and occasional architecture reviews.

That architecture stopped working once AI compressed coding effort and pushed the bottleneck upstream. The bottleneck is no longer in implementation, where the scrum team's developers could absorb it. It is in specification, design, architecture, ontology curation, and cross-product reasoning. The scrum team's structure does not contain those disciplines at the depth the new work requires.

We replace distributed scrum with a three-layer structure. The structure is hierarchical, with the layers performing different functions and operating at different cadences. The shape is captured in [The Layered Team Structure](#the-layered-team-structure) above.

### What Each Layer Does

**Top Layer: Custodianship.** The four ontology custodians, each owning one ontology layer. Runs the [spec sprint](spec-sprint.md). Output is specifications validated against the knowledge graph.

| Role | Responsibility |
|---|---|
| Product Owner | Custodian of the Functional Ontology. Anchors personas, outcomes, scenarios in the spec sprint. |
| Architect | Custodian of the Architecture Ontology. Approves service boundaries, integration contracts, infrastructure topology. |
| UX Designer | Custodian of the Design Ontology. Names the components that render the change; ships UI in code, not in wireframes. |
| Engineering Team representative | Custodian of the Code Ontology. Verifies code touchpoints; flags refactor candidates. At Zone 4, also custodian of the agent fleet. |

The custodians are typically client-supplied. When the client cannot supply all four roles fluently, Forward-Deployed Engineers staff the gap. The FDE profile and the substitute pattern (one, two, or three people covering the four roles together) are detailed in [Forward-Deployed Engineers](#forward-deployed-engineers) below. The pool is sized at one FDE per ten to fifteen million dollars of account revenue, or one per top-fifteen account.

This layer owns the knowledge graph across years. It produces well-formed specifications, refreshed ontologies, and cross-product reconciliation decisions.

**Middle Layer: Implementation Teams.** Full-time on a specific workstream. Consumes the impact-analyzed specification as input and produces code as output.

| Role | What they do |
|---|---|
| Implementation Engineers | Write code (or in the target state, write agents that produce code) under the four-ontology governance frame; consume the Impact Analysis Agent's output as input |
| Agent Developers | Write the workstream-specific agents that handle pattern-based code generation under the spec sprint's direction |

The Implementation Team's day-to-day work is constrained by the spec sprint's output. They are not authoring specs. They are not making architecture decisions. They are not extending the ontology shape. They are executing a known plan that the custodianship layer has validated.

**Bottom Layer: Enablement (Accion Labs-supplied).** Sits beneath the custodianship and implementation layers. Provides customization of Breeze.AI / ASIMOV, initial setup, and managed support cadence. Does not own the asset; supports the custodians who do.

| Role | Responsibility |
|---|---|
| Chief Architect | Cross-ontology governance support; oversees P0/P1 health metrics; advises on layered structure, connectivity, and centrality findings |
| Ontology Maintainer | Per-ontology stewardship support; investigates anomalies flagged by the verification checks; advises on structural changes to a specific ontology layer |
| Semantic Engineers | Initial brownfield extraction; ongoing KG enrichment; integration of the KG with downstream agents |
| Knowledge Agent Owner | Monthly KG refresh audit; tracks ontology age and freshness; triggers refresh sprints when freshness thresholds are breached |

This layer does not produce code and does not own the graphs. It produces graph integrity, rationalization findings, and ontology evolution recommendations that the custodians act on. The engagement model is tiered (Light Governance / Medium Curation / Deep Operations); see [The Enablement Partnership](enablement-partnership.md).

### Why the Shape Works

Four properties of the layered structure make it sustainable at enterprise scale.

Each layer is sized to its work. The Custodianship layer runs on spec sprint cadence and uses the FDE substitute pattern (one FDE per two or three workstreams) when the client cannot staff all four custodian roles fluently. The Implementation layer is full-time on each workstream. The Enablement layer is small (a Chief Architect and an Ontology Maintainer can support a portfolio of five to ten products) and engages on quarterly and trigger-based cadence. The headcount math is favorable: fewer total engineers than the equivalent distributed-scrum organization, with higher leverage per engineer.

Each layer's cadence matches its work. Custodianship runs on spec sprint cadence (one or two sprints ahead of implementation). Implementation runs on the regular sprint cadence. Enablement runs on quarterly rationalization cycles and on-trigger support. Each layer's work has a natural rhythm. The structure does not force the layers to operate at the same cadence.

Coordination is structured. The Custodianship layer produces validated specs and impact reports that flow down to Implementation. Implementation merge events trigger KG sync. The Enablement layer surfaces rationalization findings and ontology-health alerts back up to the custodians. The coordination paths are defined.

The structure allows specialists to operate fractionally without being lost. A Semantic Engineer is fractional across multiple engagements, but they have a defined home (the Enablement layer) and a defined set of responsibilities (graph integrity, brownfield extraction, KG enrichment). The fractional staffing model works because the layered structure gives each role somewhere to belong.

### How the Layered Structure Complements Distributed Scrum

Distributed scrum was optimized for implementation throughput. It worked because giving each team enough autonomy to ship independently absorbed the largest cost of the pre-AI era: implementation hours. The trade-off (coordination cost, occasional duplication, drift in cross-team architecture) was accepted because the alternative (everything routing through a central bottleneck) was costlier.

AI shifts the balance. Implementation hours compress, and the specialist work upstream (specification, ontology stewardship, design system maintenance, architecture currency) becomes a larger share of the total. The distributed scrum team is well shaped for the implementation work it has always done; what's added is a thin layer of cross-product specialists who feed the scrum teams structured specs and an enablement layer that keeps the graph healthy.

The layered structure adds what distributed scrum did not naturally produce. The Custodianship layer keeps the four ontologies current per workstream. The Enablement layer adds the cross-product governance and ontology stewardship that benefits from a portfolio view. The Implementation layer continues to do what distributed scrum has always been good at, now under structural validation and at higher velocity.

### How the Transition Is Managed

The distributed-scrum-to-layered transition takes quarters. Engineering leaders should expect:

| Quarter | What happens |
|---|---|
| Quarter 1 | First Forward-Deployed Engineer identified (often the architect who has been informally bridging across workstreams). Enablement roles named even if individual people are not yet fully assigned. First spec sprint runs as a pilot. |
| Quarter 2 | FDE program formalized. Spec sprint cadence stabilizes on the pilot workstream. Enablement team begins running the verification suite. |
| Quarter 3 | FDE program extends to two or three workstreams. The Implementation Teams adapt to consuming impact-analyzed specs as input. Code review patterns shift. |
| Quarter 4 | The layered structure is stable across the engagement. The Enablement team is producing rationalization findings on cadence. The methodology is operational. |

The transition can be accelerated by a workshop and a focused first-quarter sprint, but the operating-model maturity is a quarters-long arc. The methodology can be deployed before the operating model fully shifts. The full value depends on the operating-model shift completing.

### Adoption Considerations

Adopting the layered structure asks engineers to work in slightly different ways: contributing across more than one workstream, consuming specs they did not author themselves, and following the validation gate at merge. These are real adjustments, and engineering leaders should plan for the change-management conversation alongside the methodology rollout itself.

The transition tends to land well when teammates understand why the shape works and see a concrete role for themselves in it. Quarter 1 and Quarter 2 are typically the period when the structure is explained, piloted, and adjusted to the client's specific context.

> **How Accion Labs supports the transition**
>
> The Accion Labs engagement model includes change-management support alongside the methodology rollout. The Forward-Deployed Engineer program is staffed jointly: Accion Labs contributes FDEs from a shared pool while the client identifies and grooms their own FDE candidates over two to three quarters.

---

## Forward-Deployed Engineers

The industry has converged on "forward-deployed engineer" as the term for a specific profile: someone who sits close to a specific workstream, owns its specification quality, and brings architecture, design, and product judgment together. The role is the backfill option for the client's custodianship layer when the client cannot supply all four ontology custodian roles fluently, and it pairs with Accion Labs's enablement layer to support the custodians across the engagement.

### The Role

In the layered team structure, the Forward-Deployed Engineer (FDE) backfills missing coverage in the top (custodianship) layer when the client cannot supply all four ontology custodian roles fluently. They play one or more of the four custodian roles in the [spec sprint](spec-sprint.md). Their output is specifications validated against the knowledge graph, not code.

| Responsibility | What it looks like in practice |
|---|---|
| Own the spec sprint for a workstream | Author the spec, run the Impact Analysis Agent against it, review the impact report, modify the spec to keep the impact in control |
| Bridge to the the enablement layer | Surface findings from the impact analysis that warrant enablement-layer attention (boundary violations, duplicate-capability flags, dead-capability patterns) |
| Reconcile cross-product changes | When a change affects multiple product graphs, run the cross-product impact extension and decide how to keep the change tractable across all affected products |
| Bring product judgment into engineering | Decide which features to split, which to ship together, which to defer; the judgment that distinguishes a senior product owner from a feature backlog clerk |
| Bring architecture judgment into engineering | Decide when to modify the architecture rather than route around it; surface architectural smells the team has been working around |
| Bring design judgment into engineering | Decide when to add to the design system rather than create one-off components; surface design system gaps the team has been working around |

The role replaces what was previously distributed across a product owner, a separate architect (often only available at quarterly review cadence), and a separate designer (often only available at the start of a workstream). The FDE is what these three roles look like when they are integrated continuously into the engineering cadence.

### The Profile

![The FDE profile (three competencies overlap) and the substitute pattern (1-person, 2-person, 3-person compositions)](/diagrams/fde-profile-substitute-pattern.svg)

The FDE profile is "part architect, part product owner, part designer". The internal shorthand we use for this profile is **Amol**, after a specific engagement where the role first crystallized for us: someone who can hold the architecture, the product mechanics, and the design system in their head at the same time, and who can move fluidly between the three perspectives in a single conversation.

| Trait | What it means |
|---|---|
| Architectural literacy | Can read a service boundary diagram, identify a coupling problem, and propose a refactor that respects the existing constraints |
| Product mechanics literacy | Understands not just what the customer wants but how products are built; knows when to push back on a requirement that adds disproportionate engineering cost |
| Design system literacy | Knows the component library, knows when a new design is a real new design and when it is a duplicate of something the team already has |
| Knowledge graph literacy | Reads impact analysis reports fluently; can identify which findings warrant action and which are noise |
| Tech lead credibility | Has the engineering chops to be taken seriously by the implementation team |

The combination is rare. Most teams do not have an Amol. The methodology accommodates this through the substitute pattern.

### The Substitute Pattern

When one person cannot cover the full FDE profile, we assign two or three people to the FDE role for a workstream, each contributing the part they are strongest in.

| Substitute composition | What each person brings |
|---|---|
| Two people | An architect-product hybrid plus a designer who ships code; or a product-design hybrid plus an architect who participates in spec sprints |
| Three people | A product owner with deep product mechanics, a solution architect, and a UX designer who works in components rather than wireframes |
| Hybrid with the existing team | A senior architect from the implementation team who is available part-time for the spec sprint, plus a product owner, plus an external designer engaged fractionally |

The substitute pattern is normal. The single-person FDE is the aspirational ideal. Most engagements operate with the two-person or three-person substitute, and the substitute works because the spec sprint cadence gives the participants time to coordinate.

### Sizing the FDE Cohort Across a Portfolio

The FDE role is not full-time on any single workstream. The role fractionalizes across two or three workstreams. This is the operating-model expression of the fractional allocation principle.

The sizing heuristic we use: one FDE per ten to fifteen million dollars of account revenue, or one FDE per top-fifteen account.

| Portfolio scale | FDE cohort size |
|---|---|
| Single product, single workstream | One FDE, often fractional with another responsibility |
| Single product, multiple workstreams | One FDE per two to three workstreams |
| Multiple products in a portfolio | One FDE per product, fractionalized across the product's workstreams |
| Enterprise top-fifteen account program | Ten to fifteen FDEs across the program, one per major account |

### Building the FDE Cohort

Three patterns for sourcing the FDE cohort.

Identify candidates already inside the top accounts. The most productive pattern. Engineers who already know the account's business, who have client trust, and who have the mindset for the FDE role are often already inside the account. The act required is granting them the mandate, providing the support they need, and assigning outcome ownership. This collapses three problems at once: the extraction problem, the domain knowledge ramp-up problem, and the trust-with-the-client problem.

Groom over two to three quarters. Engineers with five years of experience and the right mindset can be developed into the FDE role over two to three quarters. The mindset filter matters more than the seniority filter. Adding more of the same kind of people grows headcount without growing capability. The grooming track focuses on architectural literacy, product mechanics, and design system fluency.

The three-month immersion archetype. Indian-origin engineers with five years of experience can sit in India for three months to absorb the working style of an existing FDE cohort, then redeploy to a North or South American time zone. This pattern was developed for accounts where geographical overlap with the client matters but full-time on-site presence is not feasible.

### The Mindset Filter

The single most important hiring criterion is mindset, not seniority.

| Mindset trait | Why it matters |
|---|---|
| Bias for surfacing structural problems | The FDE has to bring architectural smells to the architect's attention even when the team is working around them. Engineers who avoid hard conversations cannot be FDEs. |
| Comfort moving across product, architecture, and design conversations | The role requires fluency in three different professional vocabularies. Engineers who insist on staying in their lane cannot be FDEs. |
| Client engagement instinct | The FDE works closely with client product owners, architects, and designers. Engineers who are uncomfortable with client-facing interaction cannot be FDEs. |
| Comfort with ambiguity | Spec sprints involve real judgment calls. Engineers who need a fully specified problem before they start cannot be FDEs. |
| Willingness to say "this is wrong" | The FDE's value depends on telling the truth about what the impact analysis surfaces, even when the truth is inconvenient. Engineers who optimize for agreement cannot be FDEs. |

### What the FDE Does Not Do

The FDE does not write production code in the workstream they own. Writing code would conflict with the spec sprint cadence and would also pull the FDE into the implementation team's day-to-day rhythm. The FDE is a member of the implementation team in spirit but not in their daily work.

The FDE does not govern the knowledge graph. Graph governance is the enablement layer (Accion Labs)'s responsibility. The FDE surfaces findings from impact analysis that warrant enablement-layer attention, but the structural decisions about ontology shape, partition, and rationalization belong to the enablement layer (Accion Labs).

The FDE does not own multiple unrelated workstreams. The fractional model has limits. An FDE who is fractionalized across more than two or three workstreams loses the depth that makes the role valuable in any of them.

### Adoption Considerations

Building a Forward-Deployed Engineer cohort is a multi-quarter change-management exercise. The role does not exist on most engineering org charts today. Compensation, evaluation, career progression all need to be redesigned to support the role. The mindset filter is hard to recruit against. The substitute pattern is the realistic compromise for the first year of adoption.

In our client conversations we set the expectation early: the methodology can be rolled out in weeks; the FDE program matures across quarters. Both are worth doing, and the two efforts run on different timelines.

> **How Accion Labs operationalizes the FDE program**
>
> Accion Labs's [Forward-Deployed Engineer program](../../practitioner/_index.md#services) is a named offer. The program identifies candidates inside the client's top accounts, grooms them over two to three quarters, and mandates them to the spec sprint cadence with delivery manager support.

---

## Engagement Model Evolution

The methodology changes the shape of the engagement between the firm that delivers it and the enterprise that adopts it. The change unfolds in two phases.

### Phase 1: Effort-Based Engagement (Current Market Posture)

The first phase uses an effort-based engagement, the model most clients are familiar with today. Each role contributes a defined cadence of work to the engagement.

| Role class | Engagement shape |
|---|---|
| In-team roles (PO, UX, Tech Lead, Implementation Engineer) | Continuous on workstream |
| Fractional specialists (Semantic Engineer, Agent Developer, Data Architect) | Bursty across multiple workstreams |
| Enablement roles (Chief Architect, Ontology Maintainer) | Continuous but fractional across portfolio |

The effort-based model is familiar to procurement. It maps to existing professional services contracting patterns. It does not require the client to commit to outcomes the methodology has not yet demonstrated in their specific context.

It also has a limitation: it bills for the work that produces the asset rather than for the asset itself. The compounding asset (the knowledge graph) is delivered alongside the effort, but the procurement frame is the effort rather than the graph.

A second limitation surfaces when the work itself stops being effort-shaped. From a recent conversation with the engagement lead at an SDD-mature client, asked how productivity gets reported to leadership:

> "Estimation is a bad problem because the entire leadership is agile focused. They understand story points but SDD does not have a story point. We are juxtaposing historical data: sprint velocity for past five sprints, and after using SDD, how many story points we have been able to deliver. It is not ideal."

The team writes effectively no code by hand. The reported metric is sprint velocity superimposed on agent output as a comparison number. The effort frame still works for procurement, but it has begun to describe the work less and less accurately. The deliverable-based model below is the structural response.

### Phase 2: Deliverable-Based Engagement

As ontology and semantic engineering vocabulary becomes standardized, the deliverables themselves become well-defined and well-understood. At that point the engagement frame shifts from "the semantic engineer's contribution" to "the knowledge graph for this product domain", and from "the agent developer's contribution" to "the validated agent fleet".

Clients commit to the asset with quality and currency guarantees, rather than to the effort that produces it.

| Pre-shift engagement unit | Post-shift engagement unit |
|---|---|
| Semantic Engineer involvement during extraction | Validated four-layer knowledge graph for the product, meeting defined integrity thresholds |
| Agent Developer involvement during fleet build | Validated agent fleet covering Impact Analysis, PR Validation, BDD Generation, KG Sync |
| Enablement hours per month | Graph health SLA: P0 verification suite passing, freshness within 30 days, agent fleet meeting accuracy thresholds |
| Workshop hours | Workshop with named deliverables: adoption plan, ontology draft, twelve-week roadmap |

The shift is already visible in adjacent categories. Palantir's recent ontology positioning frames the ontology as the deliverable rather than the consulting effort that produced it. Snowflake's semantic layer frame is per-asset rather than per-engineer. The vocabulary is converging.

The current engagement model supports both: effort-based engagement for clients who want the conventional model, deliverable-based engagement for clients ready to commit to the outcome model.

### The Three-Year Cost-of-Ownership Shape

![Three-year TCO comparison: conventional cost rises under tech debt drag; SE-driven cost falls as the knowledge asset compounds](/diagrams/three-year-tco.svg)

A useful framing for the long engagement: total cost-of-ownership over three years, with the value delivered factored in.

| Year | Conventional engagement | SE-driven engagement |
|---|---|---|
| Year 1 | Higher implementation cost; lower upstream cost | Lower implementation cost; higher upstream cost (extraction, agent fleet build); knowledge asset begins to compound |
| Year 2 | Similar to Year 1; tech debt accumulates | Implementation cost continues to fall as the agent fleet matures; tech debt does not accumulate (rationalization findings are addressed continuously); knowledge asset is now substantial |
| Year 3 | Implementation cost is dragged down by accumulated tech debt | Implementation cost continues to fall; knowledge asset is operating substrate; team velocity is higher than Year 1 baseline; enablement is sustainable at modest cadence |

The cumulative cost over three years is typically lower for the SE-driven engagement. The cumulative value delivered (features shipped, defects avoided, modernization completed) is meaningfully higher because the methodology compounds rather than depreciating.

> **How Accion Labs frames the engagement conversation**
>
> The [two-day deep-dive workshop](../../practitioner/_index.md#services) includes a session on the engagement frame. The workshop output describes both an effort-based engagement option and a deliverable-based engagement option, with the trade-offs explained. The client chooses the frame that matches their procurement environment.

---

[The Enablement Partnership](enablement-partnership.md) is the engagement frame that supports the custodianship layer across years. [Case Archetypes: Continuous SDLC](../case-archetypes.md) walks two real engagements that ran under this operating model.
