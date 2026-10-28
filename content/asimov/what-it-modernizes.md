---
title: "What ASIMOV Modernizes"
linkTitle: "What It Modernizes"
description: "The legacy stacks ASIMOV has moved, the targets it has moved them to, and the three kinds of modernization it covers."
weight: 20
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## Kinds of Modernization

![ASIMOV's three core capabilities: Legacy System Renewal, Scalable Architecture Redesign, AI-Guided Upgrades, each with representative migration examples](/diagrams/asimov-three-capabilities.svg)

| Kind | What it covers |
|---|---|
| **Legacy system renewal** | Moving a system off an obsolete platform onto a current stack |
| **Architecture redesign** | Splitting a monolith into modules or services |
| **Version upgrades** | Moving to a current version within the same technology family, with outdated APIs found and replaced |
| **Documentation only** | Recording what a legacy system does, for a system that will keep running |

## Source and Target Stacks Delivered

| From | To | Size |
|---|---|---|
| COBOL on AS/400 | .NET 8 services, React | 600,000 lines |
| Delphi | Cloud-native .NET 8 | About 3 million lines |
| Struts, Hibernate, EJB | Java Spring MVC | About 3.2 million lines |
| Java 8 | Java 21 | 2.1 million lines |
| VB.NET monolith | Modular .NET Core, React | 300,000 lines |
| ASP.NET Web Forms | .NET Core 8 services, Angular 19 | 300,000 lines |
| ASP.NET MVC monolith | .NET 10 services, React 19 | 825,000 lines |
| Custom middleware | Event-driven APIs | |

Each of these programs is described in [Case Archetypes: Legacy Modernization](../modernization/case-archetypes.md).

The stages and gates are the same for every stack. What changes is the target architecture and the language adapters the migration agents use, so stacks beyond this list can be added.

> **To confirm with the ASIMOV lead:** the full list of source languages and frameworks with working adapters today, the target stacks offered by default, and whether databases (for example DB2 or Oracle to PostgreSQL) and batch jobs are migrated as part of the program.
