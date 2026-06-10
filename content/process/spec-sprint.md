---
title: "Spec Sprint"
description: "A separate sprint cycle that runs ahead of the implementation sprint. Output is specifications, not code. The discipline that makes the layered team structure work at enterprise scale."
weight: 10
date: 2026-06-09
lastmod: 2026-06-09
draft: false
audience:
  - cto
  - vp-engineering
  - tech-lead
  - product-owner
---

A separate sprint cycle that runs ahead of the implementation sprint. The output is specifications, not code. The discipline that makes the layered team structure work at enterprise scale.

## Why a Separate Cadence

When AI compresses coding effort, specification authoring becomes the bottleneck. The old pattern of writing the spec at the start of the implementation sprint, then building against it, compresses two distinct activities into one timebox. The predictable result is that both activities are done poorly because neither has enough time.

The spec sprint resolves this by giving specification its own cadence. The [implementation sprint](implementation-sprint.md) then consumes a fully validated, impact-analyzed specification as its input. The implementation sprint becomes a known-plan execution. The risk surfaces during the spec sprint, when the team has the bandwidth to reason about it.

The justification for separating spec authorship into its own sprint cycle scales with context complexity. For a small greenfield team, a single architect-product-owner-designer hybrid can hold the entire context and produce reliable specs inside the regular sprint. Above a certain complexity threshold, that becomes unsustainable. Cross-product validation alone can consume more time than implementation. Trying to fit it into the implementation sprint compresses both activities into poor outcomes for both.

## The Mechanics

| Element | What it looks like |
|---|---|
| Owner | Product Owner |
| Participants | The four ontology custodians: Product Owner, Architect, UX Designer, and Engineering Team representative (typically a tech lead). Each contributes the slice that maps to their ontology layer |
| Spec sprint backlog | Pending change requests, maintained in Posthog, Jira, or an equivalent tool. Distinct from the implementation backlog |
| Output | Two artifacts per change request: a well-formed specification, and any knowledge graph updates the change requires |
| Cadence | One or two spec sprints ahead of the corresponding implementation sprint, depending on the complexity of the workstream |
| Implementation handoff | Refined specs land in the implementation sprint backlog (Jira or equivalent). Pushed-back specs return to the spec sprint backlog |

The four participants map to the four custodian roles. See [Forward-Deployed Engineers](team.md#forward-deployed-engineers) for the role definition and the substitute pattern when one person cannot cover the role fluently.

## What Happens in a Spec Sprint

![The spec sprint workflow: seven steps from pending change requests to impact-analyzed specs, with the push-back loop from implementation backlog](/diagrams/spec-sprint-workflow.svg)

The spec sprint is structured around the Impact Analysis Agent. The agent provides the feedback loop that turns spec authorship from "write and hope" into "draft, validate, refine".

| Step | What the team does |
|---|---|
| 1. Pull pending change requests | The product owner pulls a batch of pending change requests from the spec sprint backlog (Posthog or equivalent). The four custodians decide together which to address in this sprint. |
| 2. Author the draft spec | Product Owner writes a candidate spec using the standard template (title, acceptance criteria, out-of-scope items, brief "why now") |
| 3. Run pre-implementation Impact Analysis | The agent traverses the four-layer graph and produces the impact report |
| 4. Review the impact report across all four layers | All four custodians review together. The product owner anchors the persona/outcome. The architect approves boundaries and integration contracts. The UX designer names the components. The engineering team verifies code touchpoints and flags refactor candidates. |
| 5. Update the graph where the change requires new nodes | New personas in Functional Ontology, new services in Architecture Ontology, new design primitives in Design Ontology, refactor flags in Code Ontology. The graph stays current as a side effect of the sprint. |
| 6. For cross-product changes, run the cross-product extension | The Cross-Product Impact Extension consults the additional product graphs and surfaces the cross-product reconciliations needed |
| 7. Produce the final spec | Validated against the now-current knowledge graph, with the impact report attached as a markdown adjunct. The spec lands in the implementation sprint backlog (Jira or equivalent). |

The final spec plus the impact report is what the implementation sprint consumes. The implementation sprint does not run impact analysis on the spec it receives, because it has already been done.

When the implementation sprint's Impact Analysis Agent later finds a spec that still has missing context (a custodian decision the spec sprint did not anticipate), the spec is **pushed back into the spec sprint backlog** marked with what is missing. The next spec sprint clears it.

## What Comes Out of the Spec Sprint

The deliverable is the **impact-analyzed specification**. A conventional spec describes what the change should do. An impact-analyzed specification additionally captures which functional outcomes, design components, architectural services, and code modules the change will touch, which other products will be affected, which database tables will be read or written, the deploy choreography (including out-of-band steps that need separate coordination), the rollback path per service, the risk taxonomy with mitigations, and a suggested ticket-slicing plan with dependency ordering.

The implementation sprint uses all of this. Engineers do not have to discover any of it during implementation. They consume it as input and write code, or invoke agents that write code, against the structured plan.

## Cross-Product Reconciliation Lives in the Spec Sprint

The spec sprint is the natural home for cross-product impact analysis. When a proposed change affects multiple product knowledge graphs, the spec sprint is where the architect runs the cross-product extension, examines results across product graphs, and decides whether to modify the API contract, the architecture, or the design system to keep the change tractable.

Doing cross-product reconciliation during the implementation sprint is too late. By the time engineers are coding, the architectural decisions need to already be made. The spec sprint is when those decisions get made. The graph partitioning (one graph per product, with cross-product extensions) is designed around this cadence. See [Partition by Product](../semantic-knowledge-graphs/four-layer-ontology.md#partition-by-product) for the structural rationale.

## When the Spec Sprint Is Not Necessary

The spec sprint is not necessary in every context. The threshold is operational complexity, and complexity is context-specific.

| Context | Spec sprint necessary? |
|---|---|
| Small greenfield team, single product, single repo, no cross-team dependencies, one person can hold the full context | Not yet. The conventional sprint cadence with spec authorship at the start works. |
| Single product but growing past one person's mental capacity, multiple workstreams converging, design system drift surfacing | Yes. The spec sprint becomes worth its own cadence. |
| Multiple products with integration points, multiple teams working concurrently, brownfield reality at scale | Yes, and the spec sprint becomes the most consequential meeting on the engineering calendar. |

A team adopting the methodology should not impose spec sprints prematurely. They should adopt them when the work crosses the complexity threshold that separates Zone 2 from Zone 3 in the [Zones of AI-Assisted SDLC](../zones-of-ai-assisted-sdlc/_index.md).

## The Spec Sprint and the Implementation Sprint Together

The two cadences run staggered, with the spec sprint always one or two sprints ahead of the implementation sprint it feeds.

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#f5f5f5","primaryTextColor":"#111111","primaryBorderColor":"#4b5563","lineColor":"#4b5563","secondaryColor":"#ffffff","tertiaryColor":"#FDE8DD","clusterBkg":"#fafafa","clusterBorder":"#9ca3af","edgeLabelBackground":"#ffffff","actorBkg":"#f5f5f5","actorBorder":"#4b5563","actorTextColor":"#111111","noteBkgColor":"#FDE8DD","noteBorderColor":"#E94E1B","signalColor":"#4b5563","signalTextColor":"#111111","sectionBkgColor":"#f5f5f5","altSectionBkgColor":"#ffffff","taskBkgColor":"#9ca3af","taskBorderColor":"#4b5563","taskTextColor":"#111111","gridColor":"#d1d5db","activeTaskBkgColor":"#FDE8DD","activeTaskBorderColor":"#E94E1B"}}}%%
gantt
    title Spec Sprint feeding Implementation Sprint
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    section Spec
    Spec Sprint 1 :s1, 2026-06-01, 14d
    Spec Sprint 2 :s2, 2026-06-15, 14d
    Spec Sprint 3 :s3, 2026-06-29, 14d
    section Implementation
    Implementation Sprint 1 :i1, after s1, 14d
    Implementation Sprint 2 :i2, after s2, 14d
```

The Spec Sprint team often fractionalizes across two or three workstreams. The Product Owner is per-workstream, but the Architect, UX Designer, and Engineering Team representative may rotate across spec sprints for different workstreams. This is what makes the fractional allocation model work in practice. The same Architect contributes to spec sprints for three workstreams across a quarter, sized to the cadence rather than to a full-time allocation.

The two backlogs (spec sprint and implementation sprint) can live in the same platform (Jira, Posthog, or equivalent) with labels or board configurations distinguishing the two. The custodianship discipline is what matters; the tool is the team's existing one.

> **How Accion supports the spec sprint adoption**
>
> Accion's [Forward-Deployed Engineer program](team.md#forward-deployed-engineers) staffs the spec sprint with the role profile that makes it work. The [two-day deep-dive workshop](../practitioner/_index.md#services) includes a session on diagnosing whether the client's complexity has crossed the threshold where spec sprints become worth the cadence change.

---

[Implementation Sprint](implementation-sprint.md) is the cadence that consumes the spec sprint's output. [Team](team.md) covers the layered structure that staffs both sprints.
