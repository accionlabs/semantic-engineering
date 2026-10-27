---
title: "Breeze.AI Security and Data"
linkTitle: "Security and Data"
description: "Where a client's code and data go in each Breeze.AI deployment, how people and pipelines sign in, what is recorded, and what the client keeps when an engagement ends."
weight: 60
date: 2026-10-27
lastmod: 2026-10-27
draft: true
---

## Where Code and Data Go

| Deployment | Code and graph | Prompts to AI models |
|---|---|---|
| Hosted by Accion Labs | Accion Labs' managed infrastructure, in an environment dedicated to the client | Sent to the cloud provider the client chooses |
| In the client's cloud | Stay in the client's cloud account | Sent to the cloud provider the client chooses, or to the client's own endpoint |
| On the client's premises | Stay in the client's data center | Stay in the client's data center, with local models |

The graph holds the structure of the application and points to the code. The code itself stays in the client's repositories.

> **To confirm with the Breeze.AI lead:** which parts of the code are sent to AI models during extraction and analysis, and the data retention terms with each model provider.

## Signing In

- People sign in through single sign-on, for the web application and for the plugin. No passwords or keys are pasted into the editor.
- CI pipelines use an API key kept in the pipeline's secrets. The project file that holds a developer's key is left out of version control by default.
- The plugin checks that a workspace is linked to the right project before any tool runs.

> **To confirm with the Breeze.AI lead:** user roles and permissions inside a project, and whether access can be limited to some layers or products.

## What Is Recorded

- Every graph item cites the ticket, document, design frame or code file it came from.
- Every agent action is recorded and sent to the client's monitoring tools.
- Every impact report and check result is kept on the ticket and the pull request.

## When the Engagement Ends

In the client's cloud or on its premises, the platform and the graph stay where they run. In every deployment, Accion Labs commits that the graph can be exported, the agents can be reproduced, the governance framework is documented, and the roles can be handed to the client's own staff.

> **To confirm with the Breeze.AI lead:** the licence terms for continuing to use the platform after an engagement ends.

## Certifications and Reviews

> **To confirm with the Breeze.AI lead:** security certifications that cover the platform or Accion Labs' hosting (for example SOC 2 or ISO 27001), encryption of stored data and data in transit, results of penetration tests, and the security questionnaire answers the team can share with clients.
