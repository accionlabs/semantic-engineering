---
title: "ASIMOV FAQ"
linkTitle: "FAQ"
description: "Questions buyers ask about ASIMOV: stacks, how parity is shown, where it runs, who reviews, how long it takes and how to start."
weight: 90
date: 2026-10-27
lastmod: 2026-10-27
draft: false
faqs:
  - question: "Which legacy stacks can ASIMOV modernize?"
    answer: "Delivered programs include COBOL on AS/400, Delphi, VB.NET, ASP.NET Web Forms, ASP.NET MVC, Struts and Hibernate, and Java 8. The stages and gates are the same for every stack; new stacks need a language adapter for the migration agents."
  - question: "How do we know the new system behaves like the old one?"
    answer: "Each module passes a functional gate that compares business rules with the legacy system. Agents also compare the running interfaces of both systems, generated unit tests cover the new code, and end-to-end tests check complete business workflows."
  - question: "Who decides what is kept and what is changed?"
    answer: "The client's product owner and architect. They review the specification of the legacy system and mark each module to keep, change, replace or retire before migration starts."
  - question: "Where does ASIMOV run?"
    answer: "In the client's environment, for the length of the program. The legacy code, the graphs and the new code stay there."
  - question: "Does the new system depend on ASIMOV?"
    answer: "No. The client owns the new code, tests and documentation, and the new system has no dependency on ASIMOV or on a particular cloud provider."
  - question: "Can we modernize without migrating?"
    answer: "Yes. Documentation Only records what the legacy system does, with business requirements, test scenarios and a code chat, for a system that will keep running. It takes two to six weeks."
  - question: "How long does a full modernization take?"
    answer: "Discovery takes two to four weeks, the graphs one to three weeks, and the first module six to twelve weeks. The rest runs in waves over quarters, depending on the size of the estate and the client's path to production."
  - question: "What happens after the new system is live?"
    answer: "The Maintain mode keeps supporting changes to the new system. For ongoing development, the team can use Breeze.AI, which builds its graph from the new code."
  - question: "How do we start?"
    answer: "With the Modernization Assessment or with Documentation Only, on one system."
---

{{< faq >}}
