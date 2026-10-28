---
title: "Breeze.AI Security and Data"
linkTitle: "Security and Data"
description: "Where a client's code and data go when Breeze.AI builds and uses the graph, how people sign in, who can do what, how data is protected, what is recorded, and what the client keeps when an engagement ends."
weight: 60
date: 2026-10-27
lastmod: 2026-10-28
draft: false
---

## Where Code and Data Go

The code layer can be built in three ways, depending on what may leave the client's network:

| Way in | What happens | What leaves the client's network |
|---|---|---|
| Repository connection | Breeze.AI clones the repository with a read token and parses it on its own servers | The code, to the Breeze.AI environment |
| Upload of the parsed result | An engineer runs the parser locally and uploads the result in the web application | Only the parsed structure of the code |
| From Claude Code | The parser runs on the engineer's machine and sends the parsed structure to Breeze.AI | Only the parsed structure of the code |

| Other steps | Where they run | What goes to an AI model |
|---|---|---|
| Building the functional and design layers | Claude Code on the engineer's machine | The code the agents read goes to Anthropic, or to AWS Bedrock where the client requires it |
| Chat, document analysis and impact analysis | The Breeze.AI services | Graph items and documents go to Claude and Titan models through AWS Bedrock |

Hosted by Accion Labs, the graphs are stored in a shared environment that serves several clients, and every item belongs to one project. Deployed in the client's AWS account, they stay there. Configuration files are read only for the names of their settings, never the values, and only when a repository opts in.

> **To confirm with the Breeze.AI lead:** how clients' data is kept apart in the hosted environment, and the data retention terms with each model provider.

## Signing In and Permissions

- People sign in through single sign-on (SSO), for the web application and the plugin. No password or key is pasted into the editor.
- Each person has a system role: Admin, End User or Viewer. A Viewer can read and change nothing, in any project.
- Each project has members with a project role: Owner, Admin or Viewer. Only the Owner can change roles, remove members or delete the project. Access is given project by project.
- Tools that use the API use a key created in the web application. Keys are stored hashed and shown once; saved repository tokens are never shown again.

## How Data Is Protected

| Where | Protection |
|---|---|
| In transit | TLS 1.3 to the platform, and TLS to the graph store |
| At rest | The database, disks and Kubernetes secrets encrypted with AWS KMS; secrets kept in AWS Secrets Manager |
| In the AWS account | Threat detection with Amazon GuardDuty, and scanning of every container image |

## What Is Recorded

- Every change to the graph, with the person who made it.
- Sign-ins, every webhook received from Jira and the repositories, and every project deleted.
- Scope reports on the ticket and in Confluence; pull request findings on the pull request and the ticket.
- Scenarios, steps and actions cite the ticket, document, screen or code file they came from.

## Keeping and Deleting Data

An archived project can be restored for 30 days, and is then deleted. Projects can be exported and imported, and snapshots taken at any time.

## When the Engagement Ends

Deployed in the client's AWS account, the platform and the graph stay where they run. In every case, Accion Labs commits that the graph can be exported, the agents can be reproduced, the governance framework is documented, and the roles can be handed to the client's own staff.

> **To confirm with the Breeze.AI lead:** the licence terms for continuing to use the platform after an engagement ends.

## Certifications and Reviews

> **To confirm with the Breeze.AI lead:** security certifications that cover the platform or Accion Labs' hosting (for example SOC 2 or ISO 27001), results of penetration tests, and the security questionnaire answers the team can share with clients.
