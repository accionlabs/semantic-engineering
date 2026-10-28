# Questions for the Breeze.AI and ASIMOV product sections

The new sections `content/breeze-ai/` and `content/asimov/` are drafts. Each open point is marked on its page as "To confirm". Once a point is answered, replace the note with the fact and remove it from this list.

## For leadership

1. "From" prices to publish for the entry offers: the Breeze.AI two-day workshop, the Breeze.AI System Model Pilot (two to three weeks), the ASIMOV Modernization Assessment, and ASIMOV Documentation Only. The full rate card goes in the sales kit and is not published. (breeze-ai/pricing, asimov/pricing)
2. Who pays for AI model usage in each deployment option, and whether it is passed through at cost. (breeze-ai/pricing, asimov/pricing)
3. Who pays for cloud infrastructure when the platform runs in the client's account. (breeze-ai/pricing, asimov/pricing)
4. Whether a graph database enterprise licence is ever included. (breeze-ai/pricing)
5. Whether a client can keep a Breeze.AI licence on its own after the engagement ends, and how it is priced. (breeze-ai/pricing, breeze-ai/security)
6. Whether there is a separate ASIMOV licence fee. (asimov/pricing)
7. Cost input for AI usage: the team sizes functional extraction at about 500,000 lines of code a week per Claude Max 20x account (marked preliminary), so two million lines need about four accounts for a week. The October 2026 documentation adds two options for about 1M lines: two dedicated Max seats at about $400 a month, or metered AWS Bedrock use at about $1,800 to $3,600 once; and AWS infrastructure for a client deployment at about $1,900 to $2,080 a month (a July 2026 estimate the document calls out of date). Who pays for each, and whether it goes in the price. (breeze-ai/pricing; not for publication)

## For the Breeze.AI lead

The team's SharePoint site (27 October 2026) and the Breeze.AI documentation of October 2026 (28 October 2026) answered the earlier questions; these remain.

1. The minimum size for a client deployment, and how size grows with the number of applications and lines of code. (breeze-ai/deployment)
2. Typical times for steps 5 and 6, and whether steps 2 to 5 fit inside the two-to-three-week System Model Pilot. (breeze-ai/deployment)
3. Availability targets, and who runs the platform day to day in the client's account. (breeze-ai/deployment)
4. How clients' data is kept apart in the hosted environment, and the data retention terms with each model provider. (breeze-ai/security)
5. The licence terms for continuing to use the platform after an engagement ends. (breeze-ai/security)
6. Security certifications that cover the platform or Accion Labs' hosting (for example SOC 2 or ISO 27001), results of penetration tests, and the security questionnaire answers the team can share with clients. (breeze-ai/security)
7. For the Breeze.AI team, not for publication: the documentation (October 2026, pages 180 and 199) says the inbound Jira and repository webhooks are not authenticated. Please confirm whether they are, and if not, when they will be.

## For the ASIMOV lead (Aditya Kaole)

1. Where ASIMOV can run: in the client's environment only, or also hosted by Accion Labs, or on premises with local models; which clouds it has been deployed on. (asimov/deployment)
2. The platform's tech stack: graph database, language and framework, packaging and installation, supported AI model providers, minimum compute, memory and storage, and how reviewers sign in to the review interface. (asimov/deployment)
3. Typical times for scoping, setup and review. (asimov/deployment)
4. Duration of the Modernization Assessment (the sales kit says "to define"). (asimov/pricing)
5. Which parts of the code are sent to AI models; providers and data retention; whether production data is ever needed (for example for reconciliation) and how it is masked. (asimov/security)
6. Whether the source and target graphs are handed over and in what format; how ASIMOV is removed from the client's environment. (asimov/security)
7. Security certifications, access control for reviewers, encryption, and shareable security questionnaire answers. (asimov/security)
8. The full list of source languages and frameworks with working adapters today; default target stacks; whether databases (for example DB2 or Oracle to PostgreSQL) and batch jobs are migrated. (asimov/what-it-modernizes)
9. Total lines of legacy code modernized: the site says more than 15 million, the decks say more than 6 million. (asimov/results)
