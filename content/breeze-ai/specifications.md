---
title: "Breeze.AI Technical Specifications"
linkTitle: "Technical Specifications"
description: "The languages, database schemas, tools and AI coding assistants Breeze.AI works with."
weight: 40
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Languages

Breeze.AI reads source code in ten languages, using Tree-sitter, an open-source parser:

| Languages |
|---|
| TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex, Perl |

Applications in older languages, such as COBOL or Delphi, are the work of [ASIMOV](../asimov/_index.md).

## Data Schemas

| Kind | Supported |
|---|---|
| Relational databases | PostgreSQL, Oracle, SQL Server |
| Search | Elasticsearch |

Tables, columns, constraints, indexes and mappings become items in the graph.

## Integrations

| Kind | Supported | What Breeze.AI does with it |
|---|---|---|
| Version control | GitHub, GitLab, Bitbucket | Updates the graph on every pull request and push; runs the check before merge |
| CI/CD | GitHub Actions, Jenkins, GitLab CI, Azure DevOps | Runs the check before merge as a pipeline step |
| Ticket systems | Jira, Linear, Azure DevOps Boards | Links specifications to the graph; updates the graph when a ticket changes state |
| Documents | Confluence, PDF, Markdown | Reads documents into the functional and architecture layers |
| Design | Figma, Sketch | Builds the design layer; finds where the running interface differs from the design |
| AI coding assistants | Claude Code, Cursor, Cline, Windsurf, GitHub Copilot | Gives the impact report to the assistant; graph tools in any assistant that supports MCP |
| Test runners | Jest, Cypress, Playwright, JUnit | Generates acceptance tests the runners can execute |
| Monitoring | The client's own tools | Receives the record of every agent action |

Breeze.AI works alongside these tools. The team keeps its editor, test runner, pipeline, ticket system and version control.

## AI Models

| Where the models run | Examples |
|---|---|
| Cloud providers | OpenAI, Anthropic, AWS Bedrock |
| The client's own endpoints | Models the client manages in its cloud account |
| On premises | Local models through GenAI in a Box, Accion Labs' private AI platform |

## Scale

| Measure | Current figure |
|---|---|
| Largest single-application graph in production | More than 1.6 million lines of code |
| Extraction time | About two to three weeks for two million lines of code |

> **To confirm with the Breeze.AI lead:** GitLab and Linear support for graph sync (the site lists them as integrations, the plugin documents GitHub, Bitbucket and Jira); which model versions are tested; any limits on graph size or number of repositories per project.
