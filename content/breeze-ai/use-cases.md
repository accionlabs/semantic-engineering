---
title: "Breeze.AI Use Cases"
linkTitle: "Use Cases"
description: "Where Breeze.AI is used: existing applications, new applications that grow large, several products, test generation, documentation and support work."
weight: 30
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## An Existing Application

A large application that the business runs on, where each change is slow because no one person knows everything it affects. Breeze.AI extracts the graph from the code in a few weeks, the owners review it, and from then on every change starts with impact analysis. See the [brownfield case](../sdlc/case-archetypes.md#brownfield-enterprise-modernization).

## A New Application

A new application starts small and grows. Breeze.AI builds the graph as the application is built, so the knowledge is recorded from the first sprint. When the application becomes too large for one team to hold in their heads, the graph is already there. See the [greenfield case](../sdlc/case-archetypes.md#greenfield-growing-into-complexity).

## Several Products

Each product has its own graph, shared by every team that works on it. Knowledge that belongs to the whole enterprise, such as security rules, deployment pipelines and a shared design system, is defined once and read by each product's agents. A change that crosses products is followed across their graphs. See [delivery outcomes on a multi-product engagement](../sdlc/case-archetypes.md#delivery-outcomes-on-a-multi-product-engagement).

## Tests

Code and test cases, including Gherkin scenarios, are generated from the graphs, with the functional layer as their source. On one engagement, tests generated this way reached 93.4% coverage with no tests written by hand.

## Documentation and Onboarding

Specifications, API documentation and release notes come from the graph and the code, with sources. New team members ask questions of the graph to learn how the application fits together.

## Support and Routine Changes

Requests with a repeatable pattern, such as support requests, customer customizations, new fields, form changes and custom reports, can go to agents once an agent has a record of reliable results on that pattern. People decide which work goes to agents, in sprint planning or in support triage.
