---
title: "Breeze.AI Technical Specifications"
linkTitle: "Technical Specifications"
description: "The languages, frameworks, databases, documents, tools and AI models Breeze.AI works with, and its known limits."
weight: 40
date: 2026-10-27
lastmod: 2026-10-28
draft: false
---

## Languages

Breeze.AI reads source code with Tree-sitter, an open-source parser:

| Languages |
|---|
| TypeScript, JavaScript, Python, Java, C#, VB.NET, Kotlin, Scala, Ruby, Groovy, C++, HTML templates, GraphQL, Terraform, Prisma, and JSON, YAML and TOML configuration |

Vue single-file components and Razor and Blazor templates are read with an extra option. Go, PHP, Swift and Rust are not supported today. Applications in older languages, such as COBOL or Delphi, are the work of [ASIMOV](../asimov/_index.md).

## Frameworks

The parser finds the routes and endpoints of these frameworks, with their request and response types and the checks that guard them, so a search can find routes left unprotected:

| Kind | Frameworks |
|---|---|
| JavaScript and TypeScript | Express, Fastify, NestJS, Next.js, Angular, React, Vue, LoopBack, GraphQL |
| Java, Kotlin and Scala | Spring, JAX-RS, Vert.x, Quartz, Ktor, Play, Akka HTTP, http4s |
| .NET | ASP.NET MVC, Web API, Minimal API, Web Forms, Razor Pages and Blazor; WCF and ASMX services; HotChocolate, graphql-dotnet, Hangfire |
| Python | FastAPI, Celery |
| Ruby | Rails, Sinatra, Grape |
| Cloud | AWS Lambda, SNS, SQS and EventBridge |

It also finds events, messaging and scheduled jobs. Specialized commands handle ASP.NET Web Forms monoliths, ASP.NET MVC and metadata-driven code.

## Databases

| Kind | Supported |
|---|---|
| Queries found in the code | PostgreSQL, MySQL and MariaDB, SQL Server, SQLite, Oracle, and common ORMs and NoSQL clients |
| Schemas in the architecture layer | Relational schemas (tables, columns, constraints, indexes, views, procedures, sequences), imported from SQL files; NoSQL collections, fields and indexes; Elasticsearch indexes, fields and aliases |

## Documents

PDF, Word, PowerPoint, Excel, HTML, Markdown, text, CSV, JSON and images, up to 50 MB each. Pages from Confluence, SharePoint and OneDrive are brought in through Claude with the Atlassian or Microsoft 365 connectors, then uploaded.

## Integrations

| Kind | Supported | What Breeze.AI does with it |
|---|---|---|
| Version control | GitHub, GitLab, Bitbucket, Azure DevOps, including self-hosted instances | Clones the code to build the code layer, checks each pull request, and updates the graph when it merges |
| Tickets and reports | Jira, Confluence | Runs scope analysis from the ticket and fills in its fields; writes reports to Confluence |
| Design | Figma, images | Turns designs into text for the graph; finds where the built interface departs from the design |
| AI coding assistants | Claude Code and Cursor; Cline, Windsurf and other MCP clients | The plugin's commands and rules in Claude Code and Cursor; the graph's tools in any assistant that supports MCP |

Breeze.AI works alongside these tools. The team keeps its editor, pipeline, ticket system and version control.

## AI Models

| Use | Models |
|---|---|
| Building the functional and design layers | Claude, run in Claude Code, or the same models through AWS Bedrock where a client requires it |
| Platform services and chat | Claude Sonnet and Claude Haiku through AWS Bedrock |
| Search across the graph | Amazon Titan embeddings through AWS Bedrock |

## Limits

- The analysis is static: routes built at run time are not found.
- Groovy is read on a best-effort basis.
- Templates are skipped unless the option to read them is set.

## Scale

| Measure | Figure |
|---|---|
| Extraction time | About two to three weeks for two million lines of code |
