---
title: "ASIMOV Security and Data"
linkTitle: "Security and Data"
description: "Where a client's legacy code and data go during an ASIMOV program, how security rules are applied to the new code, and what the client keeps at the end."
weight: 50
date: 2026-10-27
lastmod: 2026-10-27
draft: false
---

## Where Code and Data Go

ASIMOV runs in the client's environment. The legacy code, the graphs, the specification and the new code stay there.

> **To confirm with the ASIMOV lead:** which parts of the code are sent to AI models, which model providers are used, their data retention terms, and whether production data is ever needed (for example for reconciliation) and how it is masked.

## Security in the New Code

The standards gate applies the client's security rules, policies and coding standards to every module, and reports any departure from them. Modules that fail go back to the migration agents until they pass.

## What Is Recorded

- Every module has gate results, test results and traceability back to the legacy code.
- The client's decisions on each module (keep, change, replace or retire) are kept in the specification.

## At the End of the Program

The client owns the new code, the tests, the documentation and the specification. The new system does not depend on ASIMOV.

> **To confirm with the ASIMOV lead:** whether the source and target graphs are handed over and in what format, and how ASIMOV is removed from the client's environment.

## Certifications and Reviews

> **To confirm with the ASIMOV lead:** security certifications that apply, access control for reviewers, encryption, and the security questionnaire answers the team can share with clients.
