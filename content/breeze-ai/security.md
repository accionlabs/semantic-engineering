---
title: "Breeze.AI Security and Data"
linkTitle: "Security and Data"
description: "Where a client's code and data go when Breeze.AI builds and uses the graph, how people sign in, what is recorded, and what the client keeps when an engagement ends."
weight: 60
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## Where Code and Data Go

| Step | Where it runs | What leaves the client's repository |
|---|---|---|
| Building the code layer | The code parser runs on the engineer's machine | The parsed structure of the code is sent to the Breeze.AI backend |
| Building the functional and design layers | Claude Code on the engineer's machine | The code the agents read goes to the AI model provider: Anthropic, or AWS Bedrock where the client requires it |
| Impact analysis and search | The Breeze.AI backend | Graph items go to Claude models and embedding models through AWS Bedrock, or to the embedding provider chosen |

Hosted by Accion Labs, the graphs are stored in a shared environment that serves several clients. Deployed in the client's environment, they stay there.

Configuration files are read only for the names of their settings, never the values, and only when a repository opts in.

> **To confirm with the Breeze.AI lead:** how clients' data is kept apart in the hosted environment, and the data retention terms with each model provider.

## Signing In

- People sign in through single sign-on (SSO), for the web application and the plugin.
- Engineers sign in to the plugin in the browser. No password or key is pasted into the editor, and the sign-in lasts about a week.
- Tools that use the API use a key created in the web application. The project file that holds it is left out of version control by default.

> **To confirm with the Breeze.AI lead:** user roles and permissions inside a project, and whether access can be limited to some layers or products.

## What Is Recorded

- Scenarios, steps and actions cite the ticket, document, screen or code file they came from.
- Impact reports are kept on the ticket and in Confluence; pull request findings are kept on the pull request.
- Changes to the graph and agent activity through the tools are logged.

## When the Engagement Ends

Deployed in the client's environment, the platform and the graph stay where they run. In every case, Accion Labs commits that the graph can be exported, the agents can be reproduced, the governance framework is documented, and the roles can be handed to the client's own staff.

> **To confirm with the Breeze.AI lead:** the licence terms for continuing to use the platform after an engagement ends.

## Certifications and Reviews

> **To confirm with the Breeze.AI lead:** security certifications that cover the platform or Accion Labs' hosting (for example SOC 2 or ISO 27001), encryption of stored data and data in transit, results of penetration tests, and the security questionnaire answers the team can share with clients.
