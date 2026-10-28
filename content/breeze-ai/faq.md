---
title: "Breeze.AI FAQ"
linkTitle: "FAQ"
description: "Questions buyers ask about Breeze.AI: languages, tools, deployment, the graph database, who maintains the graph, and how to start."
weight: 90
date: 2026-10-27
lastmod: 2026-10-27
draft: false
faqs:
  - question: "Does Breeze.AI replace the AI coding tools we already use?"
    answer: "No. Engineers keep the assistant they use. Claude Code gets all of Breeze.AI's commands; Cursor, Cline, Windsurf and other assistants that support MCP get the graph's tools. Each pull request is then checked against the graph."
  - question: "Which languages does it support?"
    answer: "TypeScript, JavaScript, Python, Java, C#, VB.NET, Kotlin, Groovy, C++ and GraphQL, with the routes of the common web frameworks. Applications in older languages such as COBOL or Delphi are modernized with ASIMOV."
  - question: "Where does it run?"
    answer: "Hosted by Accion Labs, or deployed in the client's own environment with its own address and sign-in."
  - question: "Which graph database does it use, and do we need an enterprise licence?"
    answer: "The graph is stored in Neo4j, with PostgreSQL alongside it for ticket scope and document search. Accion Labs is a Neo4j partner."
  - question: "How long does it take to build the graph of an existing application?"
    answer: "About two to three weeks for an application of more than two million lines of code, followed by the owners' review."
  - question: "How much of the code goes into the graph?"
    answer: "The structure of the code: files, classes, functions, routes and the links between them. The code stays the source of truth for what the code does, and the graph points agents to the code that matters for a change."
  - question: "Who maintains the graph?"
    answer: "Four named owners, one per layer: the Product Owner for the functional layer, the UX Designer for design, the Architect for architecture and the Engineering Team for code. The KG Sync Agent updates the code layer when each change merges."
  - question: "Does a person have to approve every impact analysis?"
    answer: "No. A person reads the report when a person owns the decision. When an agent owns the work, the agent reads the list of affected items and continues."
  - question: "How is each pull request checked?"
    answer: "An agent checks it against the graph and the impact report and posts its findings on the pull request, so problems are found before integration or production. The check can be set to block a merge."
  - question: "What happens to the platform and the graph if the engagement ends?"
    answer: "Deployed in the client's environment, they stay where they run. In every deployment, the graph can be exported, the agents can be reproduced and the roles can be handed to the client's staff."
  - question: "How do we start?"
    answer: "With a two-day workshop or the two-to-three-week System Model Pilot, which builds the graph of one application and runs impact analysis on a real item from the backlog."
---

{{< faq >}}
