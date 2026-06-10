---
title: "Semantic Engineering Site: Content Conventions"
description: "How this content tree is structured, edited, and published"
status: Living document
---

# Semantic Engineering Site: Content Conventions

This folder holds the markdown source for the public Semantic Engineering site. The same files are edited in Obsidian and published with Hugo. The conventions below keep both environments working without translation steps.

## Folder Structure (v2: domain-first)

```
semantic-engineering-site/
├── _index.md                          Home page (Hugo section root)
├── smarter-products/                  Outcome group
│   ├── _index.md                      Outcome landing
│   └── sdlc/                          Domain sub-site
│       ├── _index.md                  Domain landing
│       ├── the-problem.md
│       ├── what-se-produces.md
│       ├── the-ontology.md
│       ├── transformation-journey.md  The SDD-to-SE evolution applied to SDLC
│       ├── impact-analysis-agent.md   Domain-specific depth
│       ├── brownfield-extraction.md   Domain-specific depth
│       ├── portfolio-rationalization.md Domain-specific depth
│       ├── case-archetypes.md
│       └── how-accion-delivers.md
├── smarter-processes/                 Outcome group
│   ├── _index.md
│   ├── operations/
│   │   ├── _index.md
│   │   ├── the-problem.md
│   │   ├── what-se-produces.md
│   │   ├── the-ontology.md
│   │   ├── transformation-journey.md  Tribal Knowledge → Runbook-driven → SE-governed
│   │   ├── managed-services-pattern.md
│   │   ├── case-archetypes.md
│   │   └── how-accion-delivers.md
│   └── business-process-automation/
│       └── (same template)
├── smarter-people/                    Outcome group
│   ├── _index.md
│   ├── knowledge/
│   │   └── (same template)
│   └── capabilities-and-ip/
│       └── (same template)
├── foundations/                       Shared methodology spine
│   ├── _index.md                      Foundations landing with reading paths
│   ├── philosophy.md                  From Bible Part I
│   ├── transformation-pattern.md      The general Manual → Disciplined → SE pattern
│   ├── aperture.md                    From Bible Part II
│   ├── ontology-framework.md          From Bible Part III
│   ├── enterprise-brain.md            From Bible Part IV
│   ├── agent-fleet.md                 From Bible Part VI
│   ├── progressive-autonomy.md        From Bible Part VII
│   ├── prompt-governance.md           From Bible Part VIII
│   ├── domain-ai.md                   From Bible Part IX
│   ├── enterprise-governance.md       From Bible Part X
│   ├── business.md                    From Bible Part XI
│   ├── people-and-organization.md     From Bible Part XII (expanded with fractional skills)
│   ├── adoption-framework.md          From Bible Part XIII
│   ├── evolving-frontier.md           From Bible Part XIV
│   └── custodianship.md               From Bible Part XV
├── practitioner/                      Accion as the methodology's primary practitioner
│   ├── _index.md
│   ├── platforms/
│   ├── architecture-patterns.md
│   ├── engagement-model.md
│   └── case-archetypes/
├── resources/                         Papers, talks, glossary, downloads, community
│   └── _index.md
└── about/                             Origins, copyright, governance, contact
    └── _index.md
```

### Why Domain-First

A methodology-first IA forces every reader to translate from abstract concepts to their own context before the content becomes useful. A domain-first IA lets a CTO with an SDLC problem read about SDLC, a VP Operations read about Operations, and a CKO read about Knowledge, each in their own language. The shared methodology that makes all of this work lives in Foundations and is surfaced from every domain page where readers want depth.

The outcome triad (Smarter Products / Processes / People) is the top-level navigation, with each outcome containing one or more domains. The mapping is clean: each domain belongs to exactly one outcome.

| Outcome | Domains |
|---|---|
| Smarter Products | SDLC |
| Smarter Processes | Operations, Business Process Automation |
| Smarter People | Knowledge, Capabilities and IP |

## Frontmatter Conventions

Every page carries Hugo-compatible YAML frontmatter at the top. Obsidian reads the same frontmatter and uses it for metadata.

```yaml
---
title: "Human-readable page title"
description: "One-sentence summary for SEO, social cards, and listings"
weight: 10            # ordering within the parent section (10, 20, 30 ...)
date: 2026-06-02      # creation date
lastmod: 2026-06-02   # last modified date
draft: false          # true while in progress; false when ready to publish
audience:             # one or more: cto, cio, analyst, practitioner
  - cto
  - practitioner
part: "II"            # Roman numeral for methodology spine pages
related:              # related pages (use relative paths)
  - "/methodology/philosophy/"
  - "/transformation/journey-stages/"
---
```

Section index files (`_index.md`) include an additional `section: true` flag in the frontmatter so Hugo treats them as section landing pages.

## Markdown Conventions

The conventions below keep the content readable in Obsidian and clean in Hugo.

| Element | Convention |
|---|---|
| Links | Standard markdown links with relative paths: `[text](../methodology/philosophy.md)`. Both Obsidian and Hugo handle these correctly. Avoid wikilinks. |
| Headings | One H1 per page (the page title). H2 for major sections, H3 for subsections. Avoid H4 and deeper unless absolutely required. |
| Lists | Always preceded by a blank line. Use `-` for bullets. Numbered lists only for ordered sequences. |
| Tables | Used liberally for comparisons, role descriptions, and any structured data. Always include a header row. |
| Mermaid | Use ```mermaid fenced blocks. Hugo's default renderer and Obsidian's mermaid plugin both render these correctly. |
| Pull quotes | Use blockquote (`>`) syntax. Both environments render these as visual emphasis blocks. |
| Sidebar callouts | Use blockquote with a bold lead: `> **How Accion operationalizes this**`. Hugo theme can style these specially via a custom render hook. |
| Code | Use fenced code blocks with language identifiers (`bash`, `typescript`, `yaml`, etc.). |
| Emphasis | Use `**bold**` for terms being introduced. Avoid italics for emphasis; reserve them for proper nouns and titles. |
| Em-dashes | Not used anywhere. Sentences are written without them. |
| Contrast statements | Not used. Avoid the "this is X, not Y" pattern. Frame contrasts through positive description. |

## Voice and Treatment Rules

The site speaks in the methodology's voice. The rules below apply to every page in `/methodology/`, `/transformation/`, `/outcomes/`, and `/domains/`. The `/practitioner/` section is the only place where Accion is the subject.

| Rule | Why |
|---|---|
| Third-person methodology voice ("Semantic Engineering treats...", "The methodology produces...") | Establishes the methodology as the object of attention |
| **No meta-narration about the page or the document itself.** Avoid sections like "Why This Chapter Exists Now", "What Comes Next", "What This Chapter Established", "How This Page Is Maintained", "What This Section Covers". Pages speak directly to the substance. Cross-references to other pages happen inline or via a one-line "Continue to" link at the end. | The reader is here for the methodology, not for documentation about the documentation |
| **No contrast statements.** Avoid the "This is X. This is not Y" pattern and its variants ("It is not A. It is not B. The answer is C"). Frame contrasts through positive description. When a comparison is necessary, prefer parallel structure or a table over negation. | Author preference. Negation patterns read as defensive and add length without clarity. |
| **No em-dashes.** Use periods, commas, parentheses, or colons. | Author preference |
| Accion-specific platform names (Breeze.AI, ASIMOV, ECL, KAPS, SPEX, Semantic KG) appear only in `/practitioner/`, with sidebar callouts from spine pages pointing to them | Keeps methodology pages neutral and durable |
| Named clients (Hubexo, Conservice, WHO, Abbott, Orion, Apex, Cision) are anonymized to engagement archetypes throughout methodology and domain content. Logos and full named studies live in `/practitioner/case-archetypes/` | Matches the white paper direction in the existing client briefing |
| Sidebar callout pattern from spine to practitioner: `> **How Accion operationalizes this** > > Accion's [platform name] implements the [methodology element] described above. See the [Platforms page](/practitioner/platforms/) for details. | Single click from methodology depth to commercial implementation |

## Hugo Build Notes

When this content is wired to Hugo:

- The top-level `_index.md` becomes the site home (`/`)
- Each subfolder with an `_index.md` becomes a Hugo section
- The `weight` field orders pages within their section
- Page bundles can be added later for pages that carry their own images
- A custom render hook for blockquotes can detect the "**How Accion operationalizes this**" pattern and style it as a distinct sidebar callout

## Editing Workflow

1. Edit in Obsidian directly. The vault is configured to recognize this folder as part of the workspace.
2. Mermaid diagrams render live in Obsidian preview.
3. Cross-references use relative paths, so renaming a page requires updating links in any page that references it.
4. Frontmatter `draft: true` keeps a page out of the published site while letting Obsidian render it.
5. When publishing to Hugo, copy this folder to the Hugo project's `content/` directory; the structure is one-to-one.
