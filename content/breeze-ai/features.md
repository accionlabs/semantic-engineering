---
title: "Breeze.AI Features"
linkTitle: "Features"
description: "The three ways to use Breeze.AI, the agents that work on the graph, the commands engineers use, and the rules that keep the graph consistent."
weight: 20
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## Three Ways to Use It

The same graph sits behind all three. A product owner in the web application and an engineer in their editor see the same items and the same sources.

| Interface | Who uses it | What it provides |
|---|---|---|
| **Web application** | Product owners, architects, UX designers, reviewers | An editor for each layer, import of functional items from CSV and of database schemas from SQL files, a graph view, a code explorer that groups the code into clusters, and project administration. Nothing to install. |
| **Claude Code plugin** | Engineers, in their editor | Breeze.AI commands for common tasks, more than fifty tools that read and update the graph, and rules that check graph changes before they are sent. |
| **API** | Other tools and scripts | Reading and updating the graph with an API key created in the web application. |

The plugin's tools use the Model Context Protocol (MCP), an open standard for connecting AI assistants to tools. Cursor, Cline, Windsurf and other MCP clients can use the tools too; the commands and rules are specific to Claude Code.

## The Agents

| Agent | When it runs | What it does |
|---|---|---|
| Impact Analysis | A Jira ticket moves into the impact analysis status, or someone mentions Breeze.AI in a comment | Reports everything the change affects across the four layers, on the ticket and in Confluence |
| Scope Analysis | A ticket's scope changes in Jira | Keeps the ticket's scope in step with Breeze.AI |
| PR Validator | A pull request is opened | Checks it against the graph and the impact report, and posts the findings on the pull request |
| KG Sync | A pull request merges | Updates the code layer from what changed |

Teams add their own agents for their own workflows. On one engagement the team ran 22 agents across delivery and support.

## Commands for Engineers

The plugin has 19 commands. The main ones:

| Command | What it does |
|---|---|
| Project setup | Links the workspace to a Breeze.AI project and signs in |
| Onboard repository | Builds the code layer of a repository |
| Generate functional | Builds the functional layer from the frontend or the backend |
| Generate design | Builds the design layer from the frontend and the functional scenarios |
| Analyze architecture | Checks a requirement against the architecture layer |
| Impact analysis | Reports what a change affects, as a summary or a detailed document |
| Search | Answers questions about the application from the four layers |
| Generate spec | Writes a functional specification document from the functional layer |
| Generate code | Generates code and test cases from the graphs |

## Rules for the Functional Layer

Rules are checked when an item is written, in the web application and in the plugin:

- Only the six item types (persona, outcome, scenario, step, action, API) are allowed.
- A persona is a role from the business, such as Customer or Administrator, or one of the standard System and External System personas. Technical names such as Developer are blocked.
- An outcome is written in the user's words.
- Every item has a parent, so no item stands alone.
- Scenarios, steps and actions must have a description and cite their source.

## Graph Quality

A metrics tool reports the quality and coverage of each graph, and agent activity through the tools is logged.

> **To confirm with the Breeze.AI lead:** whether the BDD Generation, Cross-Product Impact and Portfolio Rationalization agents, the 29 governance metrics, the 14 verification checks and the five autonomy levels described in the method pages are available in the product today; and whether managers have a dashboard.
