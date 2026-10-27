---
title: "Breeze.AI Deployment and Architecture"
linkTitle: "Deployment and Architecture"
description: "How Breeze.AI is installed for a client: the three deployment options, the platform's components and tech stack, what it needs from the client, and the steps from setup to the first checked change."
weight: 50
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Three Ways to Deploy

![Three Breeze.AI deployment modes: SaaS (Accion Labs-hosted), Client-hosted dedicated, On-premises (Gen AI in a Box), showing where the platform, the graph, and the inference live for each](/diagrams/breeze-deployment-modes.svg)

| Option | Where the platform runs | Where the graph is stored | Where the AI models run |
|---|---|---|---|
| **Hosted by Accion Labs** | A dedicated environment for the client on Accion Labs' managed infrastructure | Accion Labs' managed graph storage | Cloud providers (OpenAI, Anthropic, AWS Bedrock) |
| **In the client's cloud** | The client's own AWS, Azure or Google Cloud account | The client's cloud account | Cloud providers, or endpoints the client manages |
| **On the client's premises** | The client's data center | The client's data center | Local models through GenAI in a Box |

The client and Accion Labs choose the option at the start of the engagement. The choice depends on where the client's code and data may go, the client's compliance rules, the tools it already runs, and cost.

## Components

| Component | What it does | Built on |
|---|---|---|
| Graph database | Stores the four-layer graph | Neo4j Community Edition by default; another graph database where the client has its own standard |
| Platform service | Runs extraction, impact analysis, validation and graph sync; serves the API | |
| Web application | The graph editor and chat for product owners, architects and designers | |
| MCP server | Gives AI coding assistants about forty-three tools for reading and updating the graph | Model Context Protocol over HTTP |
| Sign-in | Single sign-on for the web application and the MCP server | Keycloak |
| Sync agents | Watch the client's repositories and ticket system and update the graph | Webhooks from GitHub, Bitbucket and Jira |
| Code parsers | Read source code into the code layer | Tree-sitter |
| Claude Code plugin | Installed on each engineer's machine; adds commands, tools and guardrails | Claude Code plugin marketplace |
| Command-line tool | Used by CI pipelines to update and check the graph | API key held in the pipeline's secrets |

> **To confirm with the Breeze.AI lead:** the platform service's language and framework, the web application's framework, how the platform is packaged (containers, Kubernetes, Helm charts or Terraform), and the minimum compute, memory and storage for a typical application.

## What Breeze.AI Needs from the Client

| Dependency | Why it is needed | Required or optional |
|---|---|---|
| Read access to the source repositories | To extract the code layer and watch for changes | Required |
| Webhooks from the version control system | To update the graph on each pull request | Required |
| A pipeline step in CI/CD | To run the check before merge | Required |
| Access to the ticket system | To attach impact reports and follow ticket states | Required |
| AI model access | Keys for a cloud provider, or a client-managed or local model endpoint | Required |
| Read access to database schemas | To add tables and columns to the graph | Recommended |
| Documents and Confluence spaces | To build the functional and architecture layers | Recommended |
| Access to the running application | For browser agents to record the design layer | Recommended |
| Figma access, with the Figma MCP server | To build the design layer from the design files | Optional |
| Claude Code for engineers | For the plugin's commands and guardrails; other MCP clients get the tools only | Recommended |
| Named owners for each layer | To review the graph and keep it accurate | Required |

For the client's own cloud or premises, the client also provides the environment: a cloud account or servers, network access to the repositories and ticket system, and the single sign-on connection to its identity provider.

> **To confirm with the Breeze.AI lead:** which identity providers Keycloak is connected to in current deployments (for example Microsoft Entra ID or Okta), and the network ports and outbound addresses the platform needs.

## From Setup to the First Checked Change

| Step | What happens | Typical time |
|---|---|---|
| 1. Choose the deployment | Where the platform, graph and models run | Part of the first workshop |
| 2. Set up the environment | Install the platform, connect sign-in, connect the model endpoint | |
| 3. Connect the tools | Repositories, CI pipeline, ticket system, documents | |
| 4. Extract the graph | Code, schemas, documents and the running interface | About two to three weeks for two million lines of code |
| 5. Owners review | Each owner checks their layer | |
| 6. Switch on the checks | Impact analysis on tickets, the check before merge, graph sync | |
| 7. Engineers install the plugin | Two commands in Claude Code, then a browser sign-in | Minutes per engineer |

> **To confirm with the Breeze.AI lead:** typical times for steps 2, 3, 5 and 6, and whether steps 2 to 4 fit inside the two-to-three-week System Model Pilot.

## Running It

| Topic | Current practice |
|---|---|
| Updates | The plugin updates through its marketplace; engineers reinstall to take a new version |
| The graph's database licence | Neo4j Community Edition is free; enterprise support matters only when a graph grows large enough to need it. Accion Labs is a Neo4j partner. |
| Monitoring | Agent actions go to the client's monitoring tools |

> **To confirm with the Breeze.AI lead:** how platform updates are delivered in each deployment option, backup and recovery of the graph, availability targets, and who runs the platform day to day in the client's cloud.
