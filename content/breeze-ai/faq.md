---
title: "Breeze.AI FAQ"
linkTitle: "FAQ"
description: "Questions buyers ask about Breeze.AI: languages, tools, deployment, the graph database, who maintains the graph, and how to start."
weight: 90
date: 2026-10-27
lastmod: 2026-10-27
draft: true
faqs:
  - question: "Does Breeze.AI replace the AI coding tools we already use?"
    answer: "No. Engineers keep Claude Code, Cursor, Copilot or the assistant they use. Breeze.AI gives the assistant the impact report and the graph's tools, and checks its work before it merges."
  - question: "Which languages does it support?"
    answer: "TypeScript, JavaScript, Python, Java, C#, Go, PHP, VB.NET, Apex and Perl. Applications in older languages such as COBOL or Delphi are modernized with ASIMOV."
  - question: "Where does it run?"
    answer: "Hosted by Accion Labs, in the client's own AWS, Azure or Google Cloud account, or on the client's premises with local models. The client chooses the AI models."
  - question: "Which graph database does it use, and do we need an enterprise licence?"
    answer: "Neo4j Community Edition by default, and another graph database where the client has a standard of its own. Enterprise support for the database matters only when a graph grows large enough to need it. Accion Labs is a Neo4j partner."
  - question: "How long does it take to build the graph of an existing application?"
    answer: "About two to three weeks for an application of more than two million lines of code, followed by the owners' review."
  - question: "How much of the code goes into the graph?"
    answer: "Only the parts whose change would affect other parts of the system. The code stays the source of truth for what the code does, and the graph points agents to the code that matters for a change."
  - question: "Who maintains the graph?"
    answer: "Four named owners, one per layer: the Product Owner for the functional layer, the UX Designer for design, the Architect for architecture and the Engineering Team for code. The KG Sync Agent updates the code layer with each change before it merges."
  - question: "Does a person have to approve every impact analysis?"
    answer: "No. A person reads the report when a person owns the decision. When an agent owns the work, the agent reads the list of affected items and continues."
  - question: "How do the checks affect how fast the team works?"
    answer: "The structural checks take under a second and run on every merge. They find problems at the pull request, before integration or production, which shortens the rework."
  - question: "What happens to the platform and the graph if the engagement ends?"
    answer: "In the client's cloud or on its premises, they stay where they run. In every deployment, the graph can be exported, the agents can be reproduced and the roles can be handed to the client's staff."
  - question: "How do we start?"
    answer: "With a two-day workshop or the two-to-three-week System Model Pilot, which builds the graph of one application and runs impact analysis on a real item from the backlog."
---

{{< faq >}}
