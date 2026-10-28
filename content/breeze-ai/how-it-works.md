---
title: "How Breeze.AI Works"
linkTitle: "How It Works"
description: "The knowledge graph Breeze.AI keeps, the people who own it, and what happens to every change: scope analysis on the ticket, a check of each pull request against that scope, and the graph updated when the change merges."
weight: 10
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

Breeze.AI works in the same order on every application: it builds a graph from the code, the owners review it, and then every change is checked against it.

## 1. Build the Graph from the Code

For an existing application, Breeze.AI builds the graph from what already exists, usually in this order: code, functional, design, architecture. For a new application it starts from the documents, then the functional and design layers.

- **Code:** a parser reads the source code with Tree-sitter, an open-source parser, and records files, classes, functions, routes and database queries, and the links between them. No AI model is involved in this step. An optional pass adds AI-written descriptions. Breeze.AI can clone the repository itself, or an engineer can run the parser and send only the result.
- **Data:** database schemas become part of the architecture layer: tables, columns, constraints, indexes, views and procedures, NoSQL collections, and search indexes.
- **Functional:** agents in Claude Code read the frontend and the backend and write the personas, outcomes, scenarios, steps and actions. They stop for a person to approve the personas, then the list of entry points, then a pilot on a few entry points, before the full run.
- **Design:** agents read the frontend code together with the functional scenarios and record the screens and components.
- **Documents:** specifications, Word, PowerPoint and Excel files, PDFs and images are uploaded and analysed against the existing graph, so a new document extends the graph without duplicating it. Pages from Confluence, SharePoint or OneDrive are brought in through Claude and uploaded.

The graph has four layers:

| Layer | What it records | Owner |
|---|---|---|
| Functional | Who uses the system and what they do with it: personas, outcomes, scenarios, steps, actions and the APIs behind them | Product Owner |
| Design | Screens and components, from the design system to each page | UX Designer |
| Architecture | Eight layers of the running system, from the user interface to the infrastructure, with every data store | Architect |
| Code | Files, classes, functions and the links between them | Engineering Team |

Each scenario, step and action in the functional layer cites where it came from: a ticket, a document, a screen or a code file.

For an application of more than two million lines of code, extraction takes about two to three weeks.

## 2. The Owners Review It

Each layer has a named owner who reviews what was built and keeps it accurate. Product owners, architects and designers edit their layers in the web application. The code layer is read from the code, so it is viewed there and changed only through the code.

## 3. Check Each Change Before Code Is Written

When a Jira ticket is created or updated, or reaches a status the team has chosen, the Scope Analysis Agent reads the four layers of the graph and reports everything the change affects. It writes the change's scope to Breeze.AI, fills in fields on the ticket and writes a report to Confluence. People read the report when they own the decision; an agent reads the structured form, the list of affected graph items, when it owns the work. Scope that someone types into Jira directly is brought back into the graph.

The detailed report includes the affected items in each layer, diagrams, a traceability matrix, risks, a test plan and a rating of how far the change reaches.

## 4. Check Each Pull Request

When a pull request is opened or updated, the Merge Validation Agent checks that the files it changes fall within the scope recorded for its ticket. It posts its findings on the pull request and on the ticket, and sets a status check that blocks the merge when the change goes outside that scope.

## 5. Update the Graph When the Change Merges

When the pull request merges, the KG Sync Agent applies the change to the functional, design and architecture layers in one step, checking for duplicates, and rebuilds the code layer from the merged code. The graph keeps matching the main branch.

The three agents share only the scope recorded for each ticket, and none calls another.

## Where People Decide

People decide what is built and which work goes to agents. Each agent has a named human owner.

The method behind these steps is described in [Semantic Knowledge Graphs](../sdlc/methodology.md), [The Agents](../sdlc/agents.md) and [The Team](../sdlc/process/team.md).
