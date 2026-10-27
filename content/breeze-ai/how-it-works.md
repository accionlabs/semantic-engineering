---
title: "How Breeze.AI Works"
linkTitle: "How It Works"
description: "The knowledge graph Breeze.AI keeps, the people who own it, and the checks every change goes through, from the specification to the merge."
weight: 10
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

Breeze.AI works in the same order on every application: it builds a graph from the code, the owners review it, and then every change is checked against it.

## 1. Build the Graph from the Code

For an existing application, Breeze.AI extracts the graph from what already exists:

- **Code:** parsers read the source code in ten languages, and AI models add a description of what each part does.
- **Data:** database and search schemas become part of the graph: tables, columns, constraints and indexes.
- **Design:** browser agents go through the running user interface and record its screens and components.
- **Documents:** specifications, Confluence pages and other documents are read for the functional and architecture layers.

The graph has four layers:

| Layer | What it records | Owner |
|---|---|---|
| Functional | Who uses the system and what they do with it: personas, outcomes, scenarios, steps and actions | Product Owner |
| Design | Screens and components, from the design system to each page | UX Designer |
| Architecture | Services, APIs, events, data stores and infrastructure | Architect |
| Code | The modules, classes and functions whose change would affect other parts of the system | Engineering Team |

The graph holds only the parts of the application whose change affects other parts. The details stay in the specifications and the code, and the graph points agents to them. Every item in the graph cites its source: a ticket, a document, a design frame or a code file.

For an application of more than two million lines of code, extraction takes about two to three weeks.

## 2. The Owners Review It

Each layer has a named owner who reviews what was extracted and keeps it accurate. The owners are the four roles above. A full deployment usually has three to five named people, including the person who looks after the graph's structure and one engineer per workstream who works alongside the client's team.

## 3. Check Each Change Before Code Is Written

When a change is specified, usually in a ticket, the Impact Analysis Agent reads the graph and reports everything the change affects across the four layers. The report goes on the ticket. People read it when they own the decision; an agent reads the structured form, a list of the affected graph items, when it owns the work. Agents cannot ignore what the analysis finds.

## 4. Check Again Before It Merges

When the code is ready, the PR Validation Agent checks the pull request against the graph and the impact report. A pull request that fails a check is blocked until the problem is fixed. Acceptance tests generated from the functional layer run in the same pipeline.

## 5. Update the Graph Before It Merges

The KG Sync Agent updates the graph with what changed before the pull request merges. The graph always matches the main branch. New items found during impact analysis go into the specification first, and enter the graph when their code merges.

## Where People Decide

People decide what is built, which work goes to agents, and what each agent may do on its own. Agents earn more autonomy over five levels as they show reliable results on a kind of work. Each agent has a named human owner.

The method behind these steps is described in [Semantic Knowledge Graphs](../sdlc/methodology.md), [The Agents](../sdlc/agents.md) and [The Team](../sdlc/process/team.md).
