---
title: "Zone 2: Spec-Driven Development"
description: "Spec-Driven Development as a complete operating mode. The contexts where SDD is the right destination, the practitioner playbook (constitution, toolkit, spec format, pod structure, async workflow, validation, review discipline, engineering constraints), the spec sprint cadence as a Zone 2 best practice, and the ceiling conditions teams encounter when complexity grows past SDD's reach."
weight: 20
date: 2026-06-09
lastmod: 2026-06-13
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
  - product-owner
---

![Zone 2: Spec-Driven Development](/diagrams/zone-2-sdd.svg)

The diagram shows what changes when SDD lands. The persistent context up top is still four custodians and four codified artifacts, but the prose specs box has flipped from red to amber: spec authoring is now structured, supported by tools like AWS Kiro, GitHub Spec Kit, Tessl, or an in-house markdown library. The other three artifacts (architecture wiki, Figma handoffs, codebase tacit knowledge) are still red and still decay. The SDLC flow lengthens to five stages: spec authoring with tools, cross-functional spec review, developer plus coding agent generating against the spec, CI drift detection plus manual review, then code. The translation tax is reduced at the spec-to-code link (because the spec is now structured) but is still paid for everything the spec does not cover: architecture, design, cross-team contracts, codebase reality.

## The Manual SDLC Problem This Zone Addresses

The Zone 1 ceiling is the absence of a contract. The product owner says "let users do X". Three developers interpret X differently. Code review three sprints later is when the reconciliation happens, by which point the divergence has shipped to staging. The team is paying the ambiguity component of the Manual Translation Tax on every change.

SDD makes the contract explicit. Every change of meaningful size gets a written specification before code is generated. The spec captures acceptance criteria, out-of-scope items, and a brief "why now". AI agents generate against the spec rather than against conversation.

## Where the Team Is

Every change of meaningful size is preceded by a written specification. The spec is versioned alongside the code. Reviewers have a contract to verify against. AI-generated output can be checked structurally against the spec.

## What the Team Operates With

The AI tool plus a verifiable per-change contract. Outputs can be checked against the spec. Reviewers have a contract to verify against.

## When This Zone Is Genuinely Suitable

![Decision diagram: when SDD fits, a single team, one clear owner per layer, codebase small enough to hold in one head](/diagrams/zone-2-when-suitable.svg)

SDD is the right operating mode for a substantial set of contexts. For these teams, the spec is the right granularity of structure and adding ontologies would be overhead without payback.

| Context | Why SDD is sufficient |
|---|---|
| Single team, single product, single repository | One person can hold the architecture, product mechanics, and design system in their head. The spec carries the per-change intent; the team's mental model carries the structural context. |
| Greenfield project with one clear owner per layer | The product owner, architect, and designer triangle is small enough to coordinate verbally between spec sprints. Architecture and design decisions live in the team's collective memory at acceptable accuracy. |
| Mid-size applications without significant brownfield complexity | Codebase is small enough that "where does X live" is answerable without a knowledge graph. The team's tenure on the code is long enough that tacit knowledge is fresh. |
| Early-stage B2B SaaS in the one-to-two-year range | The product surface is still small. Cross-team coordination has not yet emerged because there is only one team. Time-to-market matters more than long-term context infrastructure. |
| Internal tooling for a single team | The audience and the producer are the same team. Cross-team integration risk is zero by design. |

Examples that fit the pattern: a five-engineer startup shipping a single B2B product where the founding architect is still hands-on; a platform team inside a larger company maintaining one well-bounded internal service where the team owns the entire stack; a greenfield rebuild where the original system's complexity has been deliberately left behind and the new system is small enough that one architect can hold its current shape.

## How to Practice SDD Well

Teams that adopt SDD well stay in SDD productively for years. SDD is a complete operating mode for the contexts it fits, with its own discipline, its own tooling stack, and its own engineering rhythm. The practices below are what mature commercial SDD looks like in the field: an explicit constitution, a custom toolkit that enforces it, a structured spec that the agent acts against, small feature pods that own each workstream end to end, and a review discipline that makes the AI-generated output trustworthy at merge time.

The detail in this section is drawn from a conversation with the engagement lead at an SDD-mature practice that has rewritten more than a million lines of legacy code under SDD over five to six months and ships features under the model continuously. Quoted material is anonymized; the practices are what the team built over four versions of their internal SDD discipline.

### The Constitution

The first artifact a mature SDD practice produces is a written constitution. It captures how the team practices SDD: who initiates what, the contract between the product owner and the agent, the contract between the architect and the dev lead, the coding standards the generated code must follow, the conventions for prompting, and the boundaries the team has decided are non-negotiable.

> From the engagement lead at a mature SDD practice:
>
> "We wrote the constitution as to what should be done and what should not be done, and how a dev lead should interact with an architect, how an architect should interact with a PO, and how they all should interact with the agent."

The constitution is versioned. The team that anchored this section went through four versions over six months as the practice matured. New engineers join by reading the constitution before they start. New tooling integrations get designed against it. When something fails, the constitution is the first thing that gets updated.

What the constitution captures:

| Area | What it codifies |
|---|---|
| Roles and ownership | Who owns the spec, who owns the review, who owns the agent prompting, who breaks ties |
| Contracts between roles | What the architect commits to give the dev lead, what the PO commits to give the architect, what the engineer commits to validate before merging |
| Coding standards | The design patterns, principles, and idioms the generated code must follow (SOLID, event-driven architecture, framework conventions, etc.) |
| Constraints | What the agent must never do: bypass the spec, reach beyond declared scope, mix concerns the architecture forbids |
| Prompting conventions | The expected structure for prompts, the supervisor skills that wrap them, the patterns that have worked and the ones that have failed |
| Boundary cases | How to handle spec ambiguity, how to handle agent refusals, how to handle drift between spec and implementation |

The constitution by itself does not enforce itself. The team needs a toolkit that puts it in the engineer's hands at the moment of work. That is the next section.

### The Toolkit: Plugins, Slash Commands, and Supervisor Skills

In a mature SDD practice the constitution lands in the engineer's coding environment as a custom plugin or extension package, exposing the team's conventions through slash commands, supervisor skills, and a configured agent setup. A typical toolkit includes:

| Component | What it does |
|---|---|
| Slash commands | Shortcuts that invoke common SDD workflows: drafting a spec, running the interview flow, requesting impact assessment, asking the agent to enforce a specific convention |
| Supervisor skills | Pre-configured skills that wrap the agent and keep it deterministic. The agent receives the team's constraints automatically on every invocation, so it cannot bypass them by accident |
| Interview templates | Question sets the agent runs through with the PO when drafting a spec, covering edge cases, observability, security, scalability, and other quality attributes the spec needs to address |
| Code review prompts | Structured prompts the dev lead and architect use during review, so the same review questions get asked consistently across features |
| Boilerplate scaffolding | Project-template scaffolds aligned to the team's architecture so generated code lands in the right place from the start |

> "The plugin offers slash commands and enforces conventions, guardrails, and consistent prompting patterns. Under the hood, supervisor skills make the agent deterministic. It does not forget the constraints."

The toolkit is what makes the constitution operational. Without it, practitioners have to remember to apply the constitution every time they engage the agent, and the discipline drifts. With it, the constitution becomes the default behaviour.

### The Spec: Interview Flow, Structure, Living Document

In SDD the spec is the single source of truth for a change. Code is generated against it, reviewed against it, tested against it. The spec carries more weight than in conventional practice because no one is hand-writing the code that backs it. If the spec is wrong, the wrong thing gets built.

**The interview flow.** Spec authoring starts with an interview rather than a blank document. The PO works through a structured set of questions (driven by the toolkit's interview template) covering what the change is for, who the persona is, what the must-haves are, what is explicitly out of scope, what nice-to-haves exist, and what cross-cutting concerns (observability, resilience, security, scalability, performance) apply. The interview surfaces ambiguity early. The output is a spec the team can sign off against.

> "The interview flow lets the agent ask questions to cover edge cases, architecture, and monitoring when crafting specs. Even if I am not thinking about it, it is making sure that all these edge cases are covered."

**The structure.** A mature SDD spec follows a consistent format the team has converged on. The sections that matter most in commercial practice:

| Section | What goes in it |
|---|---|
| Must Haves | The acceptance criteria. What the change must do for it to be considered complete |
| Do Not Haves | What is explicitly out of scope. The hardest section to get right and the most important for keeping the agent inside boundaries |
| Nice to Haves | What the team would do with unlimited time, separated cleanly so the agent does not silently include them |
| Personas | Who the change is for. Cross-references to the team's persona definitions so the agent reasons against shared definitions |
| Technical context | Existing systems the change must integrate with, data model touchpoints, architectural decisions that constrain the implementation |
| Cross-cutting concerns | Observability, resilience, security, scalability, performance requirements specific to this change |
| Validation criteria | How QA will verify the change. Specific scenarios, not "test it thoroughly" |
| Open questions | What is undecided, who can decide it, by when |

**The living document.** The spec is not frozen at sign-off. As the team learns more during implementation (the agent surfaces a constraint, the architect realizes a contract was wrong, QA finds an untestable assertion), the spec gets amended. The team treats the spec as the running record of what the change is committing to deliver. Where the spec fails: if QA cannot find a way to verify it, the spec goes back to the drawing board before any code is generated against it.

### The Pod: Small Feature Teams That Own End to End

Mature SDD practices organize around small feature pods rather than large standing teams. Each pod owns one feature from spec authoring through deployment. The pod composition is consistent:

| Role | What they do |
|---|---|
| Product Owner | Drafts the spec, owns the interview, signs off on the final version, handles spec amendments during build |
| Architect | Sets technical context, reviews architectural fit, breaks technical ties. Often shared across pods in the same domain |
| Dev Lead | Owns the implementation. Drives the agent, reviews generated code, decides when the build is ready for QA. One per pod |
| QA Lead | Validates the spec before generation, builds the test scenarios, runs the QA pass on generated output. One per pod |

The architect is typically shared across pods because architectural decisions span features. The dev lead and QA lead are usually pod-dedicated for the feature lifecycle, since holding a feature's full context is the work. A team running five features in parallel runs five pods. Coordination between pods happens through the shared architect and the constitution, not through a single team meeting.

### The Async Workflow

Mature SDD practices run asynchronously. The model is closer to project execution than to daily-standup agile.

| Ceremony | What it does | Cadence |
|---|---|---|
| Spec drafting | The PO works through the interview flow and produces a draft spec | Async, owner-driven |
| Async review | Architect, dev lead, QA lead comment on the spec via the repo or chat | Async, 24 to 72 hour turnaround |
| Sign-off ceremony | A short synchronous session where the four roles align and sign the spec | One-time per spec, similar to a kickoff |
| Generation | The agent generates code against the signed spec | Async, three to four days for a substantial change |
| Review iteration | The dev lead and architect review the generated output, iterate the agent prompts where needed | Async, often two weeks or more on substantial PRs |
| QA pass | QA validates the implementation against the spec scenarios | Async, typically a few days |
| Deploy | When the feature is QA-validated, deploy on the team's CI/CD pipeline | Per feature, not per sprint |

> "It is an async process, so we do not meet synchronously on a daily basis. We have a couple of chat channels where we communicate. There is a sign-off session when the spec is ready, which is traditionally similar to a project kickoff. No one is coding until all four stakeholders give a go-ahead."

The async-first model is intentional. Most of the work is independent (the PO drafting, the agent generating, the dev lead reviewing). Standups would introduce more overhead than they would resolve. The signal-rich moments (spec sign-off, generation completion, review completion) become the synchronous touchpoints, and everything else flows through the repo and the chat channel.

### Validation: Spec-First QA, BDD, and Automation

QA in SDD starts before any code is generated. The QA lead reads the spec and asks: is everything in it verifiable? If a must-have cannot be tested, the spec is not done. This shifts QA from "find the bugs in the code" to "find the bugs in the spec before code is written against it."

> "The QA lead would start with the spec. Instead of testing the code, they would first test whether everything is verifiable in terms of whatever is written in the spec. Once the spec is approved, the verification cycle kicks in."

Once the spec is sign-off-ready and the agent has generated code, three things run in parallel:

- BDD scenarios written from the spec's must-haves, often produced by the agent and refined by the QA lead. The scenarios become the executable acceptance criteria
- Automation frameworks (Playwright for browser, MCP for backend integration, the team's existing unit-test frameworks) run the scenarios continuously
- The QA lead remains the human in the loop, deciding when an implementation is ready to ship even when all automated tests pass

This approach makes the spec a measurable contract. Either the implementation satisfies the spec or it does not. Either the spec is verifiable or it needs amending.

### Code Generation and Review

The team prompts the agent against the signed spec, the constitution, the supervisor skills, and the existing codebase context. The agent generates code over hours or days depending on the size of the change. Three to four days is a typical generation timeline for a substantial feature change in commercial practice.

Review is the hardest part of mature SDD. PRs in commercial use can touch 300 to 400 files and 30,000 lines. Review cycles can run two weeks or more. The team needs a structured review approach that scales to that volume:

| Review element | How mature teams handle it |
|---|---|
| Scope per generation | Reduce scope so the output is human-reviewable. Mature teams break features into smaller agent prompts to keep generation outputs in a reviewable range |
| Architectural review | The architect reviews structural decisions: service boundaries, data flow, dependency direction, integration patterns |
| Implementation review | The dev lead reviews implementation quality: idiom adherence, error handling, observability hooks, performance attributes |
| Spec-conformance review | The dev lead and QA lead check the implementation against the spec, surfacing any divergence as either a spec amendment or an implementation fix |
| Iteration | When review finds issues, the agent is re-prompted with the issues as context, rather than the engineer fixing the code by hand. This keeps the constitution and the spec as the single source of truth |

The agent is the writer. The human is the editor. The editor's job is non-trivial and requires the discipline the constitution articulates.

### Engineering Constraints: Standards, Security, and Quality

Mature SDD practices treat the agent as a junior engineer who needs explicit standards to work to. The agent receives the team's coding standards, the architectural patterns, the security requirements, and the quality attributes on every invocation through the supervisor skills.

What the agent receives:

| Constraint area | What the team enforces |
|---|---|
| Design principles | SOLID, separation of concerns, dependency inversion, explicit error handling |
| Architectural patterns | The patterns the team has standardized on (event-driven, hexagonal, repository, etc.) |
| Security baseline | Input validation, secret handling, auth and authorization patterns, the team's threat model assumptions |
| Observability | What gets logged, what gets metricized, what gets traced. Required on every external call and every domain event |
| Test coverage | What categories of test must accompany a feature (unit, integration, contract, end-to-end), enforced at PR validation |

Static and dynamic security scanning are integrated into the CI pipeline. SAST tools (SonarQube and similar) run on every PR for static analysis. DAST tools (Snyk and similar) run for dynamic scanning. These are gates on every merge, not periodic audits.

> "We treat the agent as an engineering graduate. We have told it to use all the SOLID principles, all the design patterns, and event-driven architecture where applicable. As soon as it starts a task, all these things are fed in, so it does not have to be repeated each time."

### What Mature SDD Buys You

Practiced this way, SDD produces measurable operational gains the team can stand on for as long as the work fits the contexts SDD addresses well:

- Reduced rework and bugs because the spec is the verified contract
- Improved delivery predictability and revenue visibility
- Cross-functional alignment at the spec sign-off rather than during integration
- Engineering discipline encoded in tooling rather than tribal memory
- Knowledge captured in the constitution and the spec history, which survives team turnover

A mature SDD practice rebuilt more than a million lines of legacy code in five to six months under this model. SDD is not a transitional phase for teams whose complexity profile fits it. It is the operating mode.

## Spec Sprint Cadence as a Zone 2 Best Practice

The two-sprint cadence (specification work running ahead of implementation work) is associated with the [Semantic Engineering process](../process/_index.md), but the cadence itself is independent of the knowledge graph. SDD teams that adopt a lighter form of the spec sprint discipline see measurable benefit even without the graph, the Impact Analysis Agent, or the four-ontology validation gates that come with Zone 3. The cadence discipline applies at Zone 2 before the team has committed to the full SE structure.

In standard SDD practice, specification authorship and implementation get compressed into one timebox. Most teams accept the resulting quality cost on both activities as a fact of life. The Zone 2 spec sprint relieves that compression without yet committing to the structural depth of SE.

| Element | Lighter Zone 2 form | Full SE spec sprint (Zone 3+) |
|---|---|---|
| Cadence | Runs one or two sprints ahead of implementation | Same: runs one or two sprints ahead |
| Participants | PO, Architect, UX Designer, Engineering tech lead | Same four roles, formalized as ontology custodians |
| Output | Reviewed, scoped, prioritized specification with cross-functional alignment | Impact-analyzed specification plus refreshed knowledge graph |
| Impact analysis | Human-driven by the four participants | Impact Analysis Agent runs against the graph |
| Cross-team reconciliation | Architect reviews known cross-team touchpoints from memory | Cross-product extension run by the architect against multiple product graphs |
| Validation before implementation pulls | Spec freeze after four-role sign-off | Spec freeze after agent and custodian sign-off |

The Zone 2 spec sprint produces the same operational benefit as the SE version on a smaller surface. Implementation engineers consume a known plan rather than discovering structural issues mid-sprint. The team's senior people get a dedicated cadence to think before the work starts. Cross-functional alignment happens in a working session rather than in scattered review comments.

A team should adopt this lighter discipline when the early signals of the SDD ceiling appear (cross-team integration surprises, AI-generated outputs diverging from team conventions, spec authoring eating into implementation time) but the work complexity does not yet justify the full SE adoption. The discipline becomes the bridge between Zone 2 in its compressed form and the [readiness criteria](#readiness-criteria-to-move-to-zone-3) for Zone 3.

The canonical treatment of the spec sprint, including the full SE form, is on the [Spec Sprint](../process/spec-sprint.md) page.

## When This Zone Stops Working

![The first four SDD ceilings: localized context, spec drift, single-layer coverage, specs as bottleneck. Token economy is the fifth ceiling and appears as a corollary of the four](/diagrams/zone-2-four-ceilings.svg)

SDD is the right operating mode for the contexts described above, and many teams will rightly stay in SDD for years. For teams whose complexity profile grows past those contexts, SDD has a ceiling. The spec is still text, and the spec captures one custodian's view (the product owner's). Five ceiling conditions appear in roughly the order below. The diagram above shows the first four; the fifth (token economy) compounds the others rather than appearing as a discrete failure.

**Localized context.** A team-A product owner writes a spec for an alert frequency feature. The spec is reviewed by the team-A tech lead, approved, and handed to the AI agent. The agent generates code that adds a write to a shared notification-preferences table. Team B has been migrating that table to a new schema for six weeks and has a PR open that drops two columns the team-A change relies on. Team B's architect never saw team A's spec. Team A's PO never saw team B's migration plan. Both PRs merge in the same week, integration breaks on a Friday afternoon, and the production hotfix takes the weekend. The spec was correct against team A's local view. There was no place in the SDD workflow for either architect to look across the boundary, because the architects' view is not part of the spec.

A different version of the same ceiling appears on brownfield work. The PO writes a spec for changing how renewal reminders are scheduled. The spec describes the new behavior cleanly. The existing 1.6M LOC application has the current behavior scattered across four services, a cron job that nobody on the current team set up, and a sproc in the reporting database that someone added in 2021 as a stop-gap and never removed. The architect would know about three of those four locations from memory. The spec captures none of them. The agent generates code that updates the obvious location and the team discovers the other three when customers complain.

**Spec drift.** A product owner writes a spec in Sprint 3 that depends on the saved-search service owning alert preferences. The architect refactors in Sprint 5, moves alert preferences to the notification service because saved-search became a bottleneck, and updates the architecture wiki. Nobody updates the spec. In Sprint 8, a new feature spec is written by a junior PO who reads the original spec for context, repeats the assumption that alert preferences live in saved-search, and the agent generates code against that assumption. The change merges and silently writes to a table that the notification service reads from but does not write back to. The bug surfaces three weeks later when a customer support ticket walks the team back through the chain.

The architect updated her artifact. The PO updated her artifact. Neither of them had a structural way to see that the architect's update broke the assumptions in the PO's earlier spec. Spec drift is what happens when the three custodians maintain their own slices and nobody maintains the connection between them.

**Single-layer coverage.** SDD tools like AWS Kiro, GitHub Spec Kit, and Tessl capture functional intent, which is the product owner's contribution. They do not structurally capture the architecture (the architect's contribution) or the design system (the designer's contribution). A spec says "add a configuration form for alert preferences with daily, weekly, and off options". The agent generates the form, picks a Dropdown because that is what the model has seen most often in training, places the API call in the saved-search service because the spec mentioned saved searches, and uses inline labels because the spec did not specify visual treatment. The form ships. The designer notices in a sprint demo that the Dropdown should have been a SegmentedControl, that the team has a guideline against inline labels for short option sets, and that the visual treatment violates two design tokens. The architect notices the API call should have gone through the notification service. Both noticed too late. Their context was not in the spec the agent read because the spec captures only the PO's layer.

**Specs become the new bottleneck.** Once the team has hit the three ceilings above, the obvious fix is to make the specs richer. Bring the architect into spec review. Bring the designer into spec review. Make sure every spec covers all the angles the agent needs. We have watched several teams attempt this. It does work, in a sense: the specs get more accurate and AI-generated code gets more reliable. But the throughput collapses. The PO can write specs at the rate she can think; the architect can review them at the rate she has free time, which is not much because she is also fielding the Slack DMs from Zone 1; the designer is in the same boat. The team's senior people end up spending their week in spec authoring and review meetings while the implementation engineers wait for input. The bottleneck moves from typing to thinking, and the operating model is not configured to absorb the shift. The cost structure no longer aligns with FTE-based estimation, because the work the team needs is no longer the work the team is staffed for.


**Token economy.** SDD's response to the previous three ceilings is to load more context into the prompt. The PO writes a richer spec; the dev attaches the affected service code; another snippet is added to cover the design system; the architect's last decision memo is pasted in for good measure. Each invocation grows, and so does its cost. Some of the cost shows up as larger context windows on every API call. More of it shows up as iteration loops because the agent missed something inside the larger prompt and a follow-up prompt has to add it. Over time, a team that is succeeding at SDD discovers that token spend grows super-linearly with change complexity rather than linearly with change size, and a meaningful share of the engineering budget is going into reprompting the agent toward a correct answer that was already in someone's head.

This ceiling is a corollary of the other four. The fix the methodology proposes (the structured substrate) reduces the cost per invocation in two ways. First, the agent queries the graph for the slice each task needs rather than receiving a re-stuffed package of background; the payload is targeted and known-shaped. Second, the cross-layer impact analysis catches gaps before generation, so the iteration loop does not start. Token economy is rarely the first ceiling a team feels, but it is the ceiling that compounds fastest once the team is past the others.

### From the Field: An SDD-Mature Engagement at the Ceiling

The following observations come from a recent conversation with the engagement lead at a long-running SDD practice that has reached the ceiling in operation. PRs on this engagement touch 300 to 400 files and 30,000 lines of code, and a typical review cycle now runs over two weeks. The lead describes the operating model in his own terms.

> "SDD is waterfall reimagined. SDD forces people to work sixteen to eighteen hours a day because the amount and volume of code is so much. Once the spec is thrashed out, you are on your own. You talk to Claude. Claude talks to you. You are logged in a room and working for hours and hours."

On the talent envelope the ceiling forces:

> "Bottom thirty to forty percent will struggle with SDD. There is no place to hide. It is between you and Claude as a developer."

On the open problem the team has not yet solved:

> "Governance becomes very challenging as complexity and team count grow."

The conclusion captured back to the team in the same conversation:

> "Code generation is the easy bit of the whole problem. The real problem is managing QA and governance."

The full case is in [SDD at the Governance Ceiling](../case-archetypes.md#sdd-at-the-governance-ceiling).

## The Pattern

The five conditions compound. A team can survive one. A team that hits two or three at the same time will not survive without changing the substrate.

| If your team is hitting | The signal you will see |
|---|---|
| Just localized context | Cross-team integration produces surprises that should have been predicted |
| Just spec drift | AI-generated outputs that are confidently wrong against the current system |
| Just single-layer coverage | Design system erosion, architectural boundary violations, broken downstream consumers |
| Just specs becoming the bottleneck | The team's senior people stuck in spec-authoring meetings rather than shipping value |
| Just token economy strain | Per-change agent spend growing super-linearly with change complexity; budget conversations about coding-agent cost rather than developer productivity |
| Three or more at once | All of the above, simultaneously, with engineering velocity declining despite more AI tool adoption |

Most enterprise teams hitting the ceiling are in the last row.

## Readiness Criteria to Move to Zone 3

The team is ready to extend SDD with SE when at least three of the following hold.

- Cross-team integration is producing surprises the per-change specs did not predict
- The application has grown past the point a single engineer can hold its full structure in their head
- Brownfield work consumes more than a third of sprint capacity
- Two or more teams are working on the same product and informal coordination is breaking down
- The team has hit at least one production incident traceable to AI-generated code that violated an unstated architectural or design constraint
- Coding-agent token spend per change is growing faster than change complexity, and prompt-stuffing rounds are visible in the team's working pattern

## From SDD to SE

This section is for teams whose complexity profile has crossed the SDD ceiling and that need to keep operating beyond it. Teams whose contexts stay inside the patterns SDD addresses well do not need to make this move. SDD remains the right operating mode for them indefinitely.

There is a critique of SDD worth engaging with directly here. As Matt Pocock has put it, "specs-to-code is v-coding by another name." The critique has force when the spec is the only durable artifact and the code is treated as a disposable byproduct: without something underneath the spec that captures the application's actual structure, every change re-derives that structure from prose, and drift compounds with each generation cycle. Semantic Engineering's answer is to add structure beneath the spec rather than to replace the spec with the agent. The knowledge graph is the persistent substrate. The spec stays as the intent for one change. The code stays as the implementation. The graph is what the agent reads when intent and implementation have to be reconciled against the rest of the system. The spec is no longer asked to carry knowledge it cannot carry, and the code stays first-class.

For teams that do need to extend SDD, the addition of a structured knowledge graph is what carries the team to Semantic Engineering. SE is a strict superset of SDD. The spec authorship habits transfer directly. The ontology becomes the additional shared artifact the specs feed into and are validated against.

### What the Knowledge Graph Adds

Semantic Engineering is additive to SDD. The specification remains the canonical articulation of intent for a change. SE adds a second source of truth: the knowledge graph, which captures the application's current reality at a level the agent can traverse and validate against.

| Ceiling condition | What the methodology changes |
|---|---|
| Localized context | The four-layer knowledge graph provides global context across functional, design, architecture, and code. Every change is validated against all four layers, not just the local spec. |
| Spec drift | The graph auto-updates on every PR merge. The agent operates against current reality every commit, without manual upkeep. |
| Single-layer coverage | Each of the four layers has its own ontology with its own validation. Design system enforcement is structural. Architecture boundaries are checked at merge. |
| Specs becoming the bottleneck | Specs are produced on their own cadence (the spec sprint), validated by the Impact Analysis Agent against the graph, and consumed by the implementation sprint as input. The bottleneck moves from sequential to parallel. |

The mechanism is consistent across all four. Add structure where the spec alone is failing. Let the agent consume the structure as additional context. Validate every change against the structure at merge time. The structure is the knowledge graph. The depth treatment of the substrate is in [Semantic Knowledge Graphs](../methodology.md). The operating model that runs the substrate is in [Process](../process/_index.md).

### What Stays the Same

The methodology is additive. The things the team already does well do not change.

The spec remains the canonical intent for a change. SDD discipline transfers directly. The ticket system (Jira or whatever the team uses) remains the progress-tracking source of truth. Project management does not change. The codebase remains the implementation source of truth. Engineers still write or generate code. Code review still happens; reviewers focus on judgment calls rather than context assembly. Existing CI/CD pipelines still work; the methodology adds validation gates rather than replacing them.

What changes is what the agent has access to, and what the merge gate enforces. The team's day-to-day rhythm shifts toward higher-leverage activities, but the artifacts the team is accustomed to producing remain.

### What Changes for the Team

The SDD-to-SE transition changes what the team produces and how the team is composed. Both shifts are operational and both are worth planning for.

**What the team produces.** The deliverable shape changes from "running code aligned to specifications" to "running code aligned to specifications plus an evergreen knowledge graph that makes every future change cheaper." The graph becomes a continuously evolving asset the team owns alongside the code base.

**How the team is composed.** The transition has two phases with different team shapes. The first is an **upfront investment**: a team of semantic engineers (typically provided by Accion Labs) extracts the four-layer knowledge graph from the existing codebase, design system, and product documentation. For a 2M+ LOC application this typically completes in two to three weeks. The deliverable of this phase is the populated graph, the verification suite passing on it, and the agent fleet wired up against it. Once the graph is in place, the team shape shifts to **ongoing custody**: the four custodians take over each layer of the graph: the product owner for the Functional Ontology, the architect for the Architecture Ontology, the UX designer for the Design Ontology, and the engineering team for the Code Ontology. Each custodian is assigned at least on a fractional basis per workstream to review and update their layer of the graph as the product evolves: participating in the spec sprint, reading the impact reports that touch their ontology, and extending it when their domain changes. The materialized view of the graph keeps the re-entry cost low, so the same custodian can cover more than one workstream at the same depth of judgment. The staffing pattern is **fractional allocation**: specialists engaged at the moments their judgment creates value, sized to the deliverable rather than to a calendar quarter.

Both shifts are developed in [Team](../process/team.md). The adoption playbook with phase gates and team composition is in [Three-Phase Rollout](../../practitioner/_index.md#three-phase-rollout).

> **How Accion Labs operationalizes this**
>
> The [Breeze.AI platform](../../practitioner/breeze-ai.md) implements the four-layer knowledge graph, the brownfield extraction process, and the Impact Analysis Agent. The [ASIMOV platform](../../practitioner/asimov.md) is the peer agentic platform that applies the same Semantic Engineering principles to legacy modernization, with a focused subset of the ontologies and a fully agentic flow.

---

Next: [Semantic Knowledge Graphs](../methodology.md) covers the substrate that Zone 3 introduces. [Process](../process/_index.md) covers the operating model that runs on top of the substrate.
