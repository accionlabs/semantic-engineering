---
title: "Breeze.AI Technical Specifications"
linkTitle: "Technical Specifications"
description: "The languages, frameworks, databases, tools and AI coding assistants Breeze.AI works with."
weight: 40
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Languages

Breeze.AI reads source code with Tree-sitter, an open-source parser:

| Languages |
|---|
| TypeScript, JavaScript, Python, Java, C#, VB.NET, Kotlin, Groovy, C++, GraphQL |

> **To confirm with the Breeze.AI lead:** the supported languages. The team's newest page lists TypeScript, JavaScript, Python, Java, C#, VB.NET, Kotlin, Groovy, C++ and GraphQL; older pages also list Go, PHP, Apex, Perl and Vue.

Applications in older languages, such as COBOL or Delphi, are the work of [ASIMOV](../asimov/_index.md).

## Frameworks

The parser finds the routes and endpoints of these frameworks:

| Kind | Frameworks |
|---|---|
| JavaScript and TypeScript | Express, NestJS, Angular, React, LoopBack, GraphQL |
| Java and Kotlin | Spring, JAX-RS, Ktor |
| .NET | ASP.NET MVC, Web API, Minimal API and Web Forms; WCF and ASMX services |
| Python | FastAPI |

Specialized commands handle ASP.NET Web Forms monoliths and metadata-driven code.

## Databases

| Kind | Supported |
|---|---|
| Queries found in the code | MySQL, PostgreSQL, SQLite, SQL Server, Oracle, and common ORMs and NoSQL clients |
| Schemas in the architecture layer | Relational schemas (tables, columns, constraints, indexes, views, procedures, sequences), imported from SQL files; Elasticsearch indexes, fields and aliases |

## Integrations

| Kind | Supported | What Breeze.AI does with it |
|---|---|---|
| Version control | GitHub, Bitbucket | Checks each pull request and updates the graph when it merges, through repository webhooks |
| Tickets and documents | Jira, Confluence | Runs impact analysis from the ticket; keeps reports in Confluence; reads Confluence pages into the graph |
| Design | Figma, images | Turns designs into text for the graph; finds where the built interface departs from the design |
| Documents | PDF, Markdown, images | Reads documents into the functional and architecture layers |
| AI coding assistants | Claude Code; Cursor, Cline, Windsurf and other MCP clients | All commands and rules in Claude Code; the graph's tools in any assistant that supports MCP |

Breeze.AI works alongside these tools. The team keeps its editor, pipeline, ticket system and version control.

> **To confirm with the Breeze.AI lead:** support for GitLab, Azure DevOps, Linear and GitHub Copilot, which earlier pages of this site listed.

## AI Models

| Use | Models |
|---|---|
| Building the functional and design layers | Claude Opus to run the work and Claude Sonnet for the sub-tasks, in Claude Code, or the same models through AWS Bedrock where a client requires it |
| Platform services | Claude models through AWS Bedrock |
| Search across the graph | Embeddings from OpenAI, Google Gemini or Amazon Titan, chosen per deployment |

## Scale

| Measure | Figure |
|---|---|
| Extraction time | About two to three weeks for two million lines of code |
