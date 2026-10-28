---
title: "Breeze.AI Deployment and Architecture"
linkTitle: "Deployment and Architecture"
description: "How Breeze.AI is set up for a client: where it runs, its components and tech stack, how it is packaged and sized, what it needs from the client and from each engineer's machine, and how it is updated and backed up."
weight: 50
date: 2026-10-27
lastmod: 2026-10-28
draft: false
---

## Where It Runs

| Option | What it means |
|---|---|
| **Hosted by Accion Labs** | The client uses the platform on Accion Labs' managed infrastructure, a shared environment that serves several clients |
| **In the client's AWS account** | The platform is deployed into the client's own AWS account, with its own address and sign-in |

The client and Accion Labs choose the option at the start of the engagement. A deployment without a connection to outside services, with local AI models, is not offered today.

## Components

| Component | What it does | Built on |
|---|---|---|
| Web application | Editors for each layer, document analysis, chat, the graph view and administration | React and TypeScript, served by Nginx |
| Backend API | Stores the graphs, owns every write, and receives the webhooks from Jira and the repositories | Node.js, Express and TypeScript |
| Agents service | Chat, document analysis and graph generation | Python, FastAPI and LangGraph |
| Delivery agents | Scope Analysis, Merge Validation and KG Sync, each working from its own queue | Python and LangGraph, with Amazon SQS |
| MCP server | Gives AI coding assistants 44 tools for reading and updating the graph | Python, Model Context Protocol |
| Code parser | Reads source code into the code layer; also runs on an engineer's machine | Python and Tree-sitter |
| Graph store | Holds the four layers, with search indexes on the items | Neo4j: Community Edition for a trial, Enterprise Edition likely for production |
| Relational store | Holds projects, users, ticket scope and documents | PostgreSQL (Amazon RDS) |
| File store | Graph snapshots and uploaded documents | Amazon S3 |
| Gateway | Routes requests to the services | Kong, behind an AWS load balancer |
| Sign-in | Single sign-on (SSO) for the web application and the MCP server | Keycloak, connected to the client's identity provider |
| Secrets | Keys and passwords for the services | AWS Secrets Manager |
| AI models | Platform services, chat and search | Claude and Amazon Titan embeddings through AWS Bedrock |

## Packaging and Sizing

Each service is a Docker image. A client deployment runs on Amazon EKS (Kubernetes) across two availability zones, set up with Terraform and Kubernetes manifests, with Helm for the gateway and the graph store.

The reference deployment:

| Part | Size |
|---|---|
| Kubernetes nodes | m5.2xlarge (8 vCPU, 32 GB), one to four nodes, 70 GB disk each |
| PostgreSQL | db.t3.large, 100 GB of storage growing to 1,000 GB |
| Shared file storage | 200 GB |

> **To confirm with the Breeze.AI lead:** the minimum size for a client deployment, and how size grows with the number of applications and lines of code.

## What Breeze.AI Needs from the Client

| Dependency | Why it is needed | Required or optional |
|---|---|---|
| GitHub, GitLab, Bitbucket or Azure DevOps, with a read token and a repository webhook | To build the code layer, check pull requests and update the graph when they merge | Required |
| Jira, with administrator access for setup | A product field, the analysis and analysis-status fields, optional trigger statuses, a webhook to Breeze.AI and an API token, set up once per organization | Required for scope analysis on tickets |
| Confluence | A space and folder for the reports | Required for scope analysis on tickets |
| The client's identity provider | Single sign-on (SSO) with company accounts | Required for sign-in with company accounts |
| An AWS account | For a deployment in the client's account | Required for that option |
| Database schemas as SQL files | To add the data stores to the architecture layer | Recommended |
| Documents | To add to the functional and architecture layers | Recommended |
| Figma designs | To compare the built interface with the design | Optional |
| Named owners for each layer | To review the graph and keep it accurate | Required |

## What Each Engineer's Machine Needs

| Need | Detail |
|---|---|
| Claude Code or Cursor | With Claude models, or the same models through AWS Bedrock |
| Python | Version 3.10 or later, with uv and git, to run the code parser locally |
| Windows | The parser runs under WSL |

## From Setup to the First Checked Change

| Step | What happens | Typical time |
|---|---|---|
| 1. Choose where it runs | Hosted by Accion Labs, or in the client's AWS account | Part of the first workshop |
| 2. Connect the tools | Version control, Jira and Confluence, and sign-in | Once per organization |
| 3. Install the plugin | Add the marketplace, install and enable the plugin, restart the editor, then run project setup and sign in in the browser | Minutes per engineer |
| 4. Build the graph | Code first, then the functional layer with approval at each stage, then design and architecture | A first graph of a small repository in about ten minutes; about two to three weeks for two million lines of code |
| 5. Owners review | Each owner checks their layer; a new stack usually needs two or three rounds of checking and fixing | |
| 6. Switch on the agents | Scope analysis on tickets, the pull request check and graph sync | |

> **To confirm with the Breeze.AI lead:** typical times for steps 5 and 6, and whether steps 2 to 5 fit inside the two-to-three-week System Model Pilot.

## Running It

| Topic | Current practice |
|---|---|
| Updates | New images are copied into the client's registry and rolled out service by service; a release can be rolled back |
| Backups | Automatic daily database backups kept for seven days; graph snapshots in S3; users can take snapshots and export and import projects |
| Plugin updates | Through the plugin marketplace; engineers reinstall to take a new version |
| Monitoring | Threat detection and image scanning are switched on in AWS |

> **To confirm with the Breeze.AI lead:** availability targets, and who runs the platform day to day in the client's account.
