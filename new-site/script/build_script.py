import json, pathlib, re, sys
HERE = pathlib.Path(__file__).parent
exec((HERE / 'scenes.py').read_text())
import sys
# script.md lives with the project documents; override with DOCS_DIR.
import os
DOCS = pathlib.Path(os.environ.get("DOCS_DIR", "/Users/ashutoshbijoor/Documents/Documentation System/content/shared/semantic-engineering-process/DSL/saas-architecture-media"))
dest = DOCS / "video/script.md"
ACTS={1:"Act 1: above the surface",2:"Act 2: the customer's journey down today's stack",3:"Act 3: the approach",4:"Act 4: implementation",5:"Act 5, optional: the brownfield path, layer by layer"}
def dur(x): return round(len(x.split())/140*60+1.5)
tw=sum(len(s[4].split()) for s in S); tt=sum(dur(s[4]) for s in S)
L=["# Narration script: SaaS architecture when code is cheap\n",
"**Phase:** 1, script, version 8. Approved except the added line in scene 14.\n",
"**Structure:** follows [`storyline.md`](storyline.md), agreed with the author. Earlier versions are superseded. Version 8 names dialect engineering in scene 14, matching amendment P in the paper.\n",
"**Source:** [`../../dsl-saas-architecture.md`](../../dsl-saas-architecture.md). Section numbers refer to the paper.\n",
f"**Length:** main cut (Acts 1 to 4) {sum(len(s[4].split()) for s in S if s[0]<5)} words, about {sum(dur(s[4]) for s in S if s[0]<5)//60} minutes; optional Act 5 {sum(len(s[4].split()) for s in S if s[0]==5)} words. All together {tw} words across {len(S)} scenes, about {tt//60} minutes {tt%60} seconds at 140 words per minute. Length is set aside until the flow is settled, as agreed; compression comes after.\n",
"---\n\n## Scene list\n",
"| Act | Scene | Title | Paper sections | Words | Seconds |\n|---|---|---|---|---|---|"]
for a,n,t,p,x,f in S: L.append(f"| {a} | {n} | {t} | {p} | {len(x.split())} | {dur(x)} |")
L.append(f"| | | **Total** | | **{tw}** | **{tt}** |\n")
L.append("---\n")
cur=None
for a,n,t,p,x,f in S:
    if a!=cur: L.append(f"## {ACTS[a]}\n"); cur=a
    L.append(f"### Scene {n}: {t}\n")
    L.append(f"*Paper section {p}. {len(x.split())} words, about {dur(x)} seconds.*\n")
    L.append(f"> {x}\n")
    if f:
        L.append("**On screen, with source:**\n")
        for i in f: L.append(f"- {i}")
        L.append("")
L+=["---\n\n## Paper amendments this script depends on\n",
"The site is generated from the paper, so every claim the video makes must end up in it. Status of each:\n",
"| # | Paper section | Amendment | Source | Status |\n|---|---|---|---|---|",
"| A | 1.2 | Vendor reports of agents building whole applications | Anthropic, February 2026; OpenAI | Added, approved by the author |",
"| L | 2 or 5 | Customisation is close to universal and a minority goes deep (7% none; 12% extreme or complete) | [Panorama Consulting, 2015 ERP Report](https://www.panorama-consulting.com/wp-content/uploads/2016/07/2015-ERP-Report-3.pdf) | Proposed; the author may have more recent or SaaS-specific data |",
"| M | 1.3 or 8 | Customisation need falls with depth: onboarding varies with every customer, the interface with many, the business rules with fewer, the deep layers with fewer still | Author's reasoning, with the 2015 Panorama figures as context | Proposed |",
"| P | 9 | Dialect engineering: governs change above the line as semantic engineering governs change below it; glossary entry | Author\'s decision | Applied to the paper |",
"| O | 8 | Semantic engineering governs change below the line: four-layer ontology with named custodians; agents analyse impact, generate against the graph and validate before merge; graph synced on every merge | [semantic-engineering.ai](https://semantic-engineering.ai) | Proposed |",
"| N | 8 | Semantic engineering: the knowledge graph records the invariants beneath an abstraction layer | Author's programme; link to [semantic-engineering.ai](https://semantic-engineering.ai) | Proposed |",
"| B | 6 | Onboarding as a sequence: requirements, mapping to features and configuration, customisation, data migration, training | [Microsoft, Success by Design](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/success-by-design), 2026; [Panorama Consulting, 6 phases](https://www.panorama-consulting.com/erp-implementation-success-factors/), 2019 | Proposed |",
"| C | 10 | Configuration held in files such as JSON, YAML or XML; a schema states fields and types but not valid combinations | Extends existing section 10 | Proposed |",
"| D | 3 | APIs let programs bypass the screens; the contract does not tell the caller in advance which combinations are valid | [Microsoft Learn, Dataverse Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview), 2026 | Proposed |",
"| E | 2 | Configurable workflows cover most common scenarios | [Salesforce Trailhead, Flow Basics](https://trailhead.salesforce.com/content/learn/modules/flow-basics/go-with-the-flow-th); [Workday business process framework](https://www.workday.com/content/dam/web/en-us/documents/datasheets/workday-business-process-framework.pdf) | Proposed |",
"| F | 2 | Custom fields stored as metadata without schema change | [Salesforce Architects](https://architect.salesforce.com/docs/architect/fundamentals/guide/platform-multitenant-architecture.html); [Aulbach et al., SIGMOD 2008](https://db.in.tum.de/research/publications/conferences/sigmod2008-mtd.pdf) | Proposed |",
"| G | 2 | Custom fields often hold information at the edge of the domain | No source found; narrated as \"in our experience\" | Needs the author's decision |",
"| H | 9.1 | Replace or reframe the dbt semantic-layer comparison with parser-constrained decoding (PICARD: execution errors 12% without, 2% unusable with); the dbt semantic layer sits closer to the knowledge graph | [Scholak et al., PICARD, EMNLP 2021](https://arxiv.org/abs/2109.05093) | Proposed |",
"| I | 2 or 15 | Business rules as rules over entities and workflows; existing APIs cover a large part of the domain | Author's reasoning | Proposed |",
"| J | 5, 14 | Use \"brownfield\" alongside \"existing product\" | Terminology | Proposed |",
"| K | 13 | Name Wadi and On2Go, framed as the greenfield and brownfield illustrations | Author's own products | Proposed |",
"",
"## Qualifications kept from the paper\n",
"| Qualification | Where |\n|---|---|",
"| The lowered line is one plausible placement, and gives up sharing (2) | Scene 12 |",
"| Customer demand for agent operation is growing, with uncertain timing (3) | Scene 4: \"Increasingly\" |",
"| The grammar refuses what it cannot express, and errors inside remain possible (9.1) | Scene 13 |",
"| Vertical modernisation is a rate claim, with close review of the first screens; run-time generation needs a desired-state platform (7, 13.1) | Scene 20; the 20% to 85% range with its limit on screen in scene 13 |",
"| Business rules move later or never in an existing product (5) | Scenes 15 and 21 |",
"| Plugins are left to the site at the author's direction (15) | Not in the video |",
"| The onboarding language is a demonstration on test data, scoped to data migration (13.2) | Scene 19: \"only the migration step has been demonstrated, on test data\"; scene 18 |",
"| The house-design case never built its case corpus (13.1) | Scene 18 |",
"| Component pricing alone can under-price value (4.3) | Scene 23 |",
"| Client anonymisation | \"Payroll\" names a domain; no client is named. Wadi and On2Go are the author's own products |",
"| The agent remains capable of error inside the language (9.1) | Scene 13 |",
"| Deriving the grammar from the knowledge graph is an aim the method does not yet meet (15) | Scene 13 |",
"| Customisation data is old and coarse | Scene 11 on screen: 2015, ERP in general, not by layer |"]
txt="\n".join(L)+"\n"
assert '—' not in txt and '–' not in txt
open(dest,'w').write(txt)

# The animation reads the narration split into sentences.
ACTS = {0: "Overview", 1: "Above the surface", 2: "The customer's journey down today's stack", 3: "The approach", 4: "Implementation", 5: "The brownfield path, layer by layer"}
out = [dict(act=a, n=n, title=t, paper=p, text=x, words=len(x.split()), sentences=re.split(r'(?<=[.?])\s+(?=[A-Z“"])', x.strip()), figs=f) for a, n, t, p, x, f in [TLDR] + S]
(HERE / "../video/animation/src/narration.json").write_text(json.dumps(dict(acts=ACTS, scenes=out), ensure_ascii=False, indent=1))
print("wrote", dest, "and video/animation/src/narration.json")
