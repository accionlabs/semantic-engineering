# Questions for the Breeze.AI and ASIMOV product sections

The new sections `content/breeze-ai/` and `content/asimov/` are drafts. Each open point is marked on its page as "To confirm". Once a point is answered, replace the note with the fact and remove it from this list.

## For leadership

1. "From" prices to publish for the entry offers: the Breeze.AI two-day workshop, the Breeze.AI System Model Pilot (two to three weeks), the ASIMOV Modernization Assessment, and ASIMOV Documentation Only. The full rate card goes in the sales kit and is not published. (breeze-ai/pricing, asimov/pricing)
2. Who pays for AI model usage in each deployment option, and whether it is passed through at cost. (breeze-ai/pricing, asimov/pricing)
3. Who pays for cloud infrastructure when the platform runs in the client's account. (breeze-ai/pricing, asimov/pricing)
4. Whether a graph database enterprise licence is ever included. (breeze-ai/pricing)
5. Whether a client can keep a Breeze.AI licence on its own after the engagement ends, and how it is priced. (breeze-ai/pricing, breeze-ai/security)
6. Whether there is a separate ASIMOV licence fee. (asimov/pricing)

## For the Breeze.AI lead

1. The platform's tech stack: the language and framework of the platform service and of the web application; how it is packaged (containers, Kubernetes, Helm charts, Terraform); minimum compute, memory and storage for a typical application. (breeze-ai/deployment)
2. Which identity providers Keycloak is connected to in current deployments (for example Microsoft Entra ID, Okta); network ports and outbound addresses needed. (breeze-ai/deployment)
3. Typical times for setting up the environment, connecting the tools, the owners' review and switching on the checks; whether these fit inside the System Model Pilot. (breeze-ai/deployment)
4. How platform updates are delivered in each deployment option; backup and recovery of the graph; availability targets; who runs the platform day to day in the client's cloud. (breeze-ai/deployment)
5. Which parts of the code are sent to AI models during extraction and analysis; data retention terms with each model provider. (breeze-ai/security)
6. User roles and permissions inside a project; whether access can be limited to some layers or products. (breeze-ai/security)
7. Security certifications (SOC 2, ISO 27001), encryption at rest and in transit, penetration test results, and security questionnaire answers that can be shared. (breeze-ai/security)
8. GitLab and Linear support for graph sync (the site lists them; the plugin documents GitHub, Bitbucket and Jira); tested model versions; limits on graph size or repositories per project. (breeze-ai/specifications)
9. The current count of plugin tools and commands (plugin version 0.6.0); whether the web application has a dashboard for managers. (breeze-ai/features)

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
