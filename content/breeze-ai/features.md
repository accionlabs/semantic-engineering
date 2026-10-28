---
title: "Breeze.AI Features"
linkTitle: "Features"
description: "The three ways to use Breeze.AI, the agents that carry each change from the ticket to the merge, the commands engineers use, and the rules that keep the graph consistent."
weight: 20
date: 2026-10-27
lastmod: 2026-10-28
draft: false
---

## Three Ways to Use It

The same graph sits behind all three. A product owner in the web application and an engineer in their editor see the same items and the same sources.

| Interface | Who uses it | What it provides |
|---|---|---|
| **Web application** | Product owners, architects, UX designers, reviewers, administrators | An editor for each layer; document analysis that proposes graph changes for a person to approve; a chat that answers questions across the four layers; a graph view and a code explorer; project snapshots, export and import; and, for administrators, the cost of each run and integrity reports across projects. Nothing to install. |
| **Plugin for Claude Code and Cursor** | Engineers, in their editor | 29 Breeze.AI commands for common tasks, 44 tools that read and update the graph, and rules that check graph changes before they are sent |
| **API** | Other tools and scripts | Reading and updating the graph with an API key created in the web application |

The plugin's tools use the Model Context Protocol (MCP), an open standard for connecting AI assistants to tools, so Cline, Windsurf and other MCP clients can use them too.

## Document Analysis in the Web Application

A person uploads a document (a specification, a presentation, a spreadsheet, a PDF or an image) and chooses which layers to analyse. Breeze.AI compares it with the existing graph and proposes changes for each layer. The person approves, rejects or asks for changes in a chat before anything is written. Documents of up to about 15,000 characters give the best results.

## The Agents

| Agent | When it runs | What it does |
|---|---|---|
| Scope Analysis | A Jira ticket is created, updated or commented on, or reaches a status the team has chosen | Reports everything the change affects across the four layers, records the change's scope, fills in fields on the ticket and writes a report to Confluence |
| Merge Validation | A pull request is opened, updated or commented on | Checks that the changed files fall within the ticket's scope, posts its findings on the pull request and the ticket, and blocks the merge when the change goes outside that scope |
| KG Sync | A pull request merges | Applies the change to the functional, design and architecture layers and rebuilds the code layer from the merged code |

Teams add their own agents for their own workflows. On one engagement the team ran 22 agents across delivery and support.

## Commands for Engineers

The main ones:

| Command | What it does |
|---|---|
| Project setup | Links the workspace to a Breeze.AI project and signs in |
| Onboard repository | Builds the code layer of a repository |
| Generate functional | Builds the functional layer from the frontend or the backend, with specialized versions for ASP.NET Web Forms, ASP.NET MVC and metadata-driven applications |
| Generate design | Builds the design layer from the frontend and the functional scenarios, and checks the built interface against Figma designs |
| Generate architecture | Builds the architecture layer from the code, infrastructure definitions, database schemas and documents |
| Update from a change | Updates the functional and design layers from the difference between two commits |
| Impact analysis | Reports what a change affects, as a summary or a detailed document with diagrams, a traceability matrix, risks and a test plan |
| Search | Answers questions about the application from the four layers |
| Generate spec | Writes a functional specification document from the functional layer |
| Generate code | Generates code and test cases from the graphs |

## Rules for the Functional Layer

Rules are checked when an item is written, in the web application and in the plugin:

- Only the six item types (persona, outcome, scenario, step, action, API) are allowed.
- A persona is a role from the business, such as Customer or Administrator, or one of the standard System and External System personas. Technical names such as Developer are blocked.
- An outcome is written in the user's words.
- Every item has a parent, so no item stands alone.
- Scenarios, steps and actions must have a description and cite their source. A source is recorded once and linked to every item that uses it.

## Graph Quality

A metrics tool reports the quality and coverage of each graph. Administrators can run integrity checks across projects and download them as reports.
