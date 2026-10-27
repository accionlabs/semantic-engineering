---
title: "Breeze.AI Features"
linkTitle: "Features"
description: "The three ways to use Breeze.AI, the agents that work on the graph, the guardrails that keep the graph consistent, and the governance metrics."
weight: 20
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Three Ways to Use It

The same graph sits behind all three. A product owner in the web application and an engineer in their editor see the same items, the same sources and the same check results.

| Interface | Who uses it | What it provides |
|---|---|---|
| **Web application** | Product owners, architects, UX designers, compliance and audit reviewers | A visual graph editor, a chat for each of the four layers, document upload and project administration. Nothing to install. |
| **Claude Code plugin** | Engineers, in their editor | Breeze.AI commands for common tasks, about forty-three tools that read and update the graph, and guardrails that check graph changes before they are sent. |
| **Command-line tool** | CI pipelines and batch jobs | Access to the graph with an API key, where no one signs in through a browser. CI pipelines use it to update the graph on every pull request before it merges. |

The plugin's tools use the Model Context Protocol (MCP), an open standard for connecting AI assistants to tools. Cursor, Cline, Windsurf and other MCP clients can use the tools too; the commands and guardrails are specific to Claude Code.

## The Agents

| Agent | What it does |
|---|---|
| Impact Analysis | Reports everything a change affects across the four layers, before and after the code is written. Returns a report for people or a list of affected items for another agent. |
| PR Validation | Checks each pull request against the graph in the CI pipeline before it merges. |
| KG Sync | Watches GitHub, Bitbucket and Jira and updates the graph with what changed, before the pull request merges. |
| BDD Generation | Writes acceptance tests in Gherkin, a plain-language test format, from the functional layer. |
| Cross-Product Impact | Follows a change across the graphs of several products. |
| Portfolio Rationalization | Finds duplicated and unused capabilities across products, once a quarter. |

Teams add their own agents for their own workflows. On one engagement the team ran 22 agents across delivery and support.

## Guardrails

Rules for the functional layer are checked when an item is written, in the web application and in the plugin:

- Only the five item types (persona, outcome, scenario, step, action) are allowed.
- A persona is a role from the business, such as Customer or Administrator. Technical names such as Developer or API are blocked.
- An outcome is written in the user's words.
- Every item has a parent, so no item stands alone.
- Scenarios, steps and actions must have a description.

## Governance

| Feature | What it gives the team |
|---|---|
| Metrics | 29 metrics per product, per graph and per agent, as data the client can add to its own reporting |
| Verification checks | 14 checks on the graph that run automatically |
| Autonomy levels | Five levels, with a written agreement each time an agent moves up a level |
| Audit trail | A record of every agent action, sent to the client's monitoring tools |
| Sources | Every graph item cites the ticket, document, design frame or file it came from |

> **To confirm with the Breeze.AI lead:** the current count of plugin tools and commands (the plugin is at version 0.6.0), and whether the web application has a separate dashboard for managers.
