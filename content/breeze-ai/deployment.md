---
title: "Breeze.AI Deployment and Architecture"
linkTitle: "Deployment and Architecture"
description: "How Breeze.AI is set up for a client: where it runs, its components and tech stack, what it needs from the client and from each engineer's machine, and the steps from setup to the first checked change."
weight: 50
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Where It Runs

| Option | What it means |
|---|---|
| **Hosted by Accion Labs** | The client uses the platform on Accion Labs' managed infrastructure, a shared environment that serves several clients |
| **In the client's environment** | The platform is deployed for the client, with its own address and sign-in |

The client and Accion Labs choose the option at the start of the engagement. The choice depends on where the client's code and data may go, the client's compliance rules, and the tools it already runs.

> **To confirm with the Breeze.AI lead:** whether a deployment on the client's premises with local AI models can be offered, and on which clouds the client-environment option has run.

## Components

| Component | What it does | Built on |
|---|---|---|
| Web application | Editors for each layer, imports, the graph view and the code explorer | |
| Backend API | Stores and serves the graphs; runs impact analysis and the agents | Behind an API gateway |
| Graph store | Holds the four layers, with search indexes on the items | Neo4j |
| Relational store | Holds ticket scope and the documents used for search | PostgreSQL with pgvector |
| Agent workflows | Run the Impact Analysis, Scope Analysis, PR Validator and KG Sync agents on events from Jira and the repositories | n8n |
| MCP server | Gives AI coding assistants more than fifty tools for reading and updating the graph | Python; Model Context Protocol over HTTP |
| Sign-in | Single sign-on for the web application and the MCP server | Keycloak, connected to the client's Microsoft Entra ID |
| AI models | Platform services and search | Claude models and embeddings through AWS Bedrock; OpenAI or Gemini embeddings where chosen |
| Code parser | Reads source code into the code layer, on the engineer's machine | Python and Tree-sitter, run with uv |
| Claude Code plugin | Commands, tools and rules on each engineer's machine | Claude Code plugin marketplace |

> **To confirm with the Breeze.AI lead:** the frameworks of the backend and the web application, how the platform is packaged and installed (containers, Kubernetes, Helm charts or Terraform), and the minimum compute, memory and storage for a client deployment.

## What Breeze.AI Needs from the Client

| Dependency | Why it is needed | Required or optional |
|---|---|---|
| GitHub or Bitbucket, with a repository webhook to Breeze.AI | To check pull requests and update the graph when they merge | Required |
| Jira, with administrator access for setup | Three custom fields, two workflow statuses, a webhook to Breeze.AI and an API token, set up once per organization | Required for impact analysis on tickets |
| Confluence | A space and folder for impact reports | Required for impact analysis on tickets |
| Microsoft Entra ID | Single sign-on through Keycloak | Required for sign-in with company accounts |
| Read access to the source code | To build the code, functional and design layers | Required |
| Database schemas as SQL files | To add the data stores to the architecture layer | Recommended |
| Documents and Confluence pages | To add to the functional and architecture layers | Recommended |
| Figma designs | To compare the built interface with the design | Optional |
| Named owners for each layer | To review the graph and keep it accurate | Required |

## What Each Engineer's Machine Needs

| Need | Detail |
|---|---|
| Claude Code | With Claude Opus and Claude Sonnet, or the same models through AWS Bedrock |
| Python | Version 3.10 or later, with uv and git, for the code parser |
| Windows | The parser runs under WSL |

## From Setup to the First Checked Change

| Step | What happens | Typical time |
|---|---|---|
| 1. Choose where it runs | Hosted by Accion Labs, or in the client's environment | Part of the first workshop |
| 2. Connect the tools | Repository webhooks; Jira fields, statuses and webhook; the Confluence folder; sign-in | Once per organization |
| 3. Install the plugin | Add the marketplace, install and enable the plugin, restart Claude Code, then run project setup and sign in in the browser | Minutes per engineer |
| 4. Build the graph | Code first, then the functional layer with approval at each stage, then design and architecture | A first graph of a small repository in about ten minutes; about two to three weeks for two million lines of code |
| 5. Owners review | Each owner checks their layer; a new stack usually needs two or three rounds of checking and fixing | |
| 6. Switch on the agents | Impact analysis on tickets, the pull request check and graph sync | |

> **To confirm with the Breeze.AI lead:** typical times for steps 5 and 6, and whether steps 2 to 5 fit inside the two-to-three-week System Model Pilot.

## Running It

| Topic | Current practice |
|---|---|
| Plugin updates | Through the plugin marketplace; engineers reinstall to take a new version |
| Parser updates | Fetched on first use and kept per version |
| Sign-in | Engineers sign in again about once a week |

> **To confirm with the Breeze.AI lead:** how platform updates are delivered in each option, backup and recovery of the graph, availability targets, and who runs the platform day to day in the client's environment.
