---
title: "Zone 1: Manual / Vibe Coding"
description: "Conversational AI use without a written specification. The first taste of velocity. Where it is genuinely suitable, where it stops working, and the transition path to Spec-Driven Development."
weight: 10
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
  - solo-developer
---

![Zone 1: Manual / Vibe Coding](/diagrams/zone-1-vibe-coding.svg)

The diagram shows the operating picture at this zone. The persistent context up top is still the four custodians and the four codified text artifacts (decaying under pressure). The SDLC flow at the bottom is short: a vague specification (often verbal), an expanded developer + coding agent box where the two iterate together (the developer writes a prompt, the coding agent generates code, the developer reviews and refines, repeat), manual code review with no contract to check against, and code that lands with hidden defects. The translation tax is paid every time the developer reads partial signals from the red artifacts to write the next prompt.

## The Manual SDLC Problem This Zone Addresses

For most of software's history, engineers spent the bulk of their day typing code. A function to validate an email address, a CRUD endpoint for a new entity, a React component for a configuration form. Routine work consumed routine hours. A backend engineer might write three to five hundred lines of new code in a productive week, and most of those lines looked very similar to lines she had written the previous week and the week before that.

The first wave of AI coding tools (Copilot, then ChatGPT in an IDE, then Claude, then Cursor, then Claude Code) collapsed that typing time. A developer opens a chat window and types "give me a Joi schema for a user registration form with email, password meeting these rules, optional phone number, and accept-terms checkbox". The schema appears in seconds. The developer reviews it, adjusts two lines, commits. What used to be twenty minutes of typing is now ninety seconds of reading and editing. This is the first taste of velocity. Most engineers describe it as the best experience they have had with a development tool in their careers.

## Where the Team Is

Developers use AI coding tools conversationally. A developer opens a chat window, describes what they want, accepts or modifies the generated output, and commits the result. Specifications, if they exist, live in tickets, chat threads, or the developer's head. The same change made by two developers produces two different implementations.

## What the Team Operates With

The AI tool plus the developer's mental model. No structured contract for what the change is supposed to accomplish. No structural reference to what already exists in the system.

## When This Zone Is Genuinely Suitable

![Decision diagram: when vibe coding fits, throwaway/exploratory work, or solo developer with no team coordination](/diagrams/zone-1-when-suitable.svg)

Vibe coding is not always a bug to be fixed. There are real contexts where the conversational, contract-less pattern is the right tool, and forcing SDD discipline on these contexts would be overhead with no payback.

| Context | Why vibe coding works |
|---|---|
| Solo developer learning a new framework or language | The act of generating, reviewing, and adjusting code is the learning loop. Adding a spec gate would slow down the learning, not improve it. |
| Greenfield prototypes and proof-of-concept work | The point is to see whether the idea works, not to ship something maintainable. The throwaway nature absorbs the lack of structure. |
| Internal one-off scripts, admin tools, and data fixes | Blast radius is contained. No one else will read the code. The script runs once and goes away. |
| Hackathon or time-boxed exploration ("can we even do this?") | Exploration is the deliverable. Discovering whether the approach is feasible matters more than how the code reads. |
| Personal projects and toy applications | No team coordination is required. The developer is the only consumer of the code they write. |
| Spike work inside a larger project | A scoped, time-boxed dive to answer a technical question. The output is a finding, not production code. |

Examples that fit the pattern: a developer using Claude Code to prototype a new internal dashboard over a weekend; a solo engineer at a startup building the first cut of an MVP before the team grows; a senior engineer using an AI tool to explore three different approaches to a refactor before committing to one; an analyst using Claude to write a Python script that processes a CSV once.

## When This Zone Stops Working

![Three cracks where vibe coding breaks: code review burden, reproducibility loss, post-incident traceability gap](/diagrams/zone-1-three-cracks.svg)

The convenience holds for small, contained changes that the developer fully understands. It starts to break the moment the work crosses any of three thresholds.

The first crack we see, repeatedly, is in code review. A reviewer opens a PR with thirty modified files. The PR description says "implement the alert frequency feature per the ticket". The reviewer opens the ticket, reads a paragraph of intent, comes back to the diff. There is no contract that says what success looks like. The reviewer has to reverse-engineer the intent from the code. On a small team this took an hour and was tolerable. With AI-generated code, the diff is now four times bigger and the reviewer is doing four times the reverse engineering. Code review, which the team expected to get faster, has gotten slower. We have heard variations of this from at least a dozen engineering managers in the past year.

The second crack is reproducibility. A developer asks the agent for an implementation of a debounced search input. The agent produces a hook with a 300ms delay using lodash. The same developer, two months later, asks for the same thing on a different page. The agent now produces a custom implementation using setTimeout with a 500ms delay. Both work. Both are committed. The application now has two different debounced search behaviors and nobody noticed. Multiply this across thousands of small decisions and the codebase loses internal consistency in ways that are very hard to recover from without a major refactor.

The third crack is the post-incident review. Something breaks in production. The team traces it to a PR from six weeks ago. The PR description is one sentence. The reviewer comment thread has three messages. The original prompt the developer used is in their chat history, possibly. There is no audit trail from the bug back to the intent that produced it. The team cannot answer the basic post-incident question: what did we think this change was supposed to do, and where did we get that wrong? Without the answer, the team cannot prevent the next similar incident.

These three failure modes are the components of the [Manual Translation Tax](../translation-tax.md#the-manual-translation-tax-the-cost-named) cashing in. The ambiguity component shows up in code review because there is no contract to check against. The non-persistence component shows up in reproducibility because each agent session forgets what the previous one did. The non-traceability component shows up in the incident review because there is no link from the bug back to the intent. The team came for productivity and got a faster way to accumulate technical debt.

Underneath all three is the same structural absence. The product owner, the architect, and the UX designer are the three roles that hold the context the team needs to ship safely. In Zone 1 their input arrives ad hoc and unrecorded. A developer Slacks the architect at 3pm: "Quick question, where should the new alert preference endpoint live?" The architect answers in two sentences. The same developer Slacks the designer the next morning: "Is there an existing toggle component I should use for daily / weekly / off?" The designer says yes, sends a Figma link, and goes back to whatever she was doing. The product owner sees the implementation in the next demo and only then realizes the wording does not match the customer-facing brand voice. Each interaction is fine in isolation. None of them gets captured anywhere the next developer can find. When the next developer asks the same architect the same question, the architect has to reconstruct her answer from memory, sometimes contradicting what she said before because the system has evolved since. The custodians are working overtime and the team is still flying blind.

## Readiness Criteria to Move to Zone 2

The team is ready to adopt SDD when at least three of the following hold.

- Code review burden has become the team's bottleneck
- Two or more incidents in the past quarter have traced back to AI-generated code that did not match the unstated intent
- The team has tried to standardize prompt patterns informally and the standards are not holding
- Leadership is asking for measurable AI productivity outcomes and the team cannot produce them

## From Manual to SDD

The first transformation. The team moves from conversational AI use to a discipline where every change of meaningful size is preceded by a written specification. The spec becomes the contract the AI agent generates against. This is the lowest-risk, highest-leverage move a team operating at Zone 1 can make. Adoption takes four to six sprints. The payback is measurable in the first sprint that runs under the new discipline.

### What SDD Does Well

SDD raises the floor of AI-assisted engineering in five concrete ways.

1. It forces written agreement on expected behavior before code is generated, replacing conversational ambiguity with a verifiable contract.
2. It establishes the spec as the primary design artifact, treating gaps and ambiguities as defects to be resolved upstream.
3. It version-controls the spec alongside the code, giving the team a durable reference for future changes.
4. It enables AI agents to generate code against a defined target, replacing inferred intent with explicit acceptance criteria.
5. It measurably reduces scope creep, mid-sprint rework, and defect escape rate when applied with discipline.

For a small, greenfield project with one team and one repository, this is often enough. The spec, the code, and the team's mental model can be kept in sync through normal review.

### The Operating-Model Change

Three operational changes mark the transition.

| Change | What it looks like |
|---|---|
| Spec authorship is a hard gate before sprint planning | No work enters a sprint without a written spec. The spec is reviewed by the PO, the architect, and the tech lead before the sprint commits to it. |
| Spec-to-implementation traceability is instrumented in the ticket system | Every commit references the spec it implements. The ticket system tracks coverage: which spec sections have implementation, which do not. |
| CI-based drift detection in the pipeline | The CI pipeline checks that the implementation does not diverge from the spec in ways the spec does not anticipate. Drift surfaces as a build warning, not a production incident. |

None of the three requires infrastructure change. All three require discipline change. The discipline change is the hard part.

### The Tools Landscape

Several tools support SDD discipline. Each has its strengths.

| Tool | Strength |
|---|---|
| AWS Kiro | Tight integration with AWS services and Bedrock; spec authorship in markdown |
| GitHub Spec Kit | Spec authorship and validation directly in GitHub workflows |
| Tessl | Spec authorship plus implementation generation from the spec |
| In-house spec libraries | Many teams build their own using markdown plus a CI step |

The choice of tool matters less than the discipline. A team using a markdown library in GitHub plus a CI check can run SDD as well as a team using a commercial product. The methodology does not depend on a specific tool.

### The Four-to-Six-Sprint Payback

Teams adopting SDD discipline typically see measurable improvements within four to six sprints.

| Sprint | What changes |
|---|---|
| Sprint 1 | The team writes specs for the first time. The specs are uneven. The PO is uncomfortable. Several scope-creep moments surface that would have been hidden under the old discipline. |
| Sprint 2 | Specs improve. The team starts noticing that some tickets were not actually well-defined and gets explicit about what success looks like. Defect rate has not yet moved meaningfully. |
| Sprint 3 | Specs become routine. AI generation against the spec produces noticeably more reliable output than against conversation alone. Code review takes less time per PR. |
| Sprint 4 | First measurable defect-rate improvement against the pre-adoption baseline. The team starts seeing the value the discipline is producing. |
| Sprints 5 to 6 | The discipline stabilizes. The team has its own conventions for spec authorship. Senior engineers spend less time reconstructing intent from code. The implementation team ships work that does not need to be rewritten in review. |

By Sprint 6, the team is at a sustainable Zone 2 operating model. The next question is when to extend.

### Adoption Considerations

The hardest part of the Zone 1 to Zone 2 transition is changing the team's habit, not the spec authoring itself. Teams that have shipped without specs for years experience the discipline as friction. The friction is real for the first few sprints. It diminishes as the team accumulates evidence that the discipline reduces total work rather than adding to it.

Engineering leaders adopting SDD should expect Sprint 1 and Sprint 2 to feel slower than the team's pre-SDD baseline. The improvement starts in Sprint 3 and stabilizes by Sprint 6. The leadership patience to hold the discipline through the first two sprints is what makes the adoption work.

> **How Accion Labs supports the Zone 1 to Zone 2 transition**
>
> The [two-day deep-dive workshop](../../practitioner/_index.md#services) produces a prioritized SDD adoption plan for the client's active workstreams. The plan includes spec templates, the CI configuration for drift detection, and the spec-review cadence.

---

Next: [Zone 2: Spec-Driven Development](zone-2-spec-driven-development.md) is where the team operates after the SDD transition lands.
