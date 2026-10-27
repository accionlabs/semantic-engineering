---
title: "How Breeze.AI Works"
linkTitle: "How It Works"
description: "The knowledge graph Breeze.AI keeps, the people who own it, and what happens to every change: impact analysis on the ticket, a check on the pull request, and the graph updated when the change merges."
weight: 10
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

Breeze.AI works in the same order on every application: it builds a graph from the code, the owners review it, and then every change is checked against it.

## 1. Build the Graph from the Code

For an existing application, Breeze.AI builds the graph from what already exists:

- **Code:** a parser reads the source code with Tree-sitter, an open-source parser, and records files, classes, functions, routes and database queries, and the links between them. No AI model is involved in this step. An optional pass adds AI-written descriptions.
- **Data:** database schemas become part of the architecture layer: tables, columns, constraints, indexes, views and procedures, and search indexes.
- **Functional:** agents in Claude Code read the frontend and the backend and write the personas, outcomes, scenarios, steps and actions. They stop for a person to approve the personas, then the list of entry points, then a pilot on a few entry points, before the full run.
- **Design:** agents read the frontend code together with the functional scenarios and record the screens and components.
- **Documents:** specifications, Confluence pages, PDFs and images can be read into the functional and architecture layers.

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

When a Jira ticket moves into the impact analysis status, or someone mentions Breeze.AI in a comment, the Impact Analysis Agent reads the graph and reports everything the change affects across the four layers. The report goes on the ticket and into a Confluence folder, usually within a few minutes. People read it when they own the decision; an agent reads the structured form, a list of the affected graph items, when it owns the work.

The detailed report includes the affected items in each layer, diagrams, a traceability matrix, risks, a test plan and a rating of how far the change reaches.

## 4. Check Each Pull Request

When a pull request is opened, the PR Validator Agent checks it against the graph and the impact report and posts its findings on the pull request. The check can be set to block a merge.

## 5. Update the Graph When the Change Merges

When the pull request merges, the KG Sync Agent updates the code layer from what changed, so the graph keeps matching the main branch. Updating the functional, design and architecture layers in the same way is in early support.

> **To confirm with the Breeze.AI lead:** when the check can block merges for all clients, and when sync of the other three layers is generally available.

## Where People Decide

People decide what is built and which work goes to agents. Each agent has a named human owner.

The method behind these steps is described in [Semantic Knowledge Graphs](../sdlc/methodology.md), [The Agents](../sdlc/agents.md) and [The Team](../sdlc/process/team.md).
