// Worked explanations: shown on /explain, given to agents in the reference, and run by the tests. Each is
// a short explanation with deep dives the person can choose.
export const EXPLAIN_EXAMPLES: { title: string; code: string }[] = [
  {
    title: 'Agents on a large existing application',
    code: `explain "Our coding agents keep breaking things other teams depend on, and every change needs days of investigation first."
  for "the VP of Engineering at an insurance software company"
  context brownfield
  layer architecture
  layer code
  say "On large applications this is a common pattern, and both halves have one cause: the knowledge each change depends on is written nowhere an agent can read."

show agents-make-mistakes
  say "First, why the agents go wrong."

show breeze-extract
  say "The method starts by building that knowledge into a graph, extracted from your application itself."

show impact-analysis
  say "Every change is then analyzed against the graph before anyone writes code."

show validation-gates
  say "And before anything merges, the change is checked against the graph."

caveat graph-not-a-spec

answer "Extract the graph from your code, run impact analysis before each change, and check every pull request against the graph. Your specifications keep describing the change."
  read sdlc/methodology#brownfield-extraction

branch "How impact analysis replaces days of investigation"
  say "This part shows what impact analysis finds on a real change."
show days-of-investigation
connect days-of-investigation to impact-report
show alert-example
caveat results-in-context

branch "What extraction produced on one application"
  say "This part shows extraction on an application of over two million lines."
show brownfield-2m
caveat results-in-context

branch "How each pull request is checked"
  say "This part shows what the check looks for, and what happens when it fails."
show pr-validation
connect boundary-violations to pr-validation
caveat detail-still-reviewed

branch "How coding agents read the graph"
  say "Your developers keep the coding agents they use today."
show coding-agents-via-mcp
show structure-fixed
caveat detail-still-reviewed`,
  },
  {
    title: 'A new user-interface workstream growing complex',
    code: `explain "Our new UI keeps rebuilding components the design system already has."
  for "a design system owner"
  context greenfield
  layer design
  say "This usually means the design knowledge lives with people. The method records it where every change is checked against it."

show design-duplication

show breeze-functional-first
  say "For a new application, the method records what the application is for, and the graph grows with the code."

connect design-duplication to pr-validation
  say "With the design system recorded in the graph, every pull request is checked against it."

caveat graph-not-a-spec

answer "Record the design system as the design layer of the graph, and let the pull request check catch duplicates."
  read sdlc/case-archetypes#greenfield-growing-into-complexity

branch "Design knowledge today and with the graph"
  say "This part compares design knowledge passed by hand with design knowledge in the graph."
show four-layer-graph
compare design today with after

branch "Adopting the design layer on its own"
  say "Adoption can be staged, one layer at a time, beginning where the problem is."
recommend start-with-a-layer
show ui-workstream
  say "One workstream did exactly that."
caveat results-in-context`,
  },
  {
    title: 'A legacy COBOL system, for a CTO',
    code: `explain "We run a large COBOL system that the business depends on. How would Semantic Engineering help us modernize it?"
  for "a CTO with a legacy COBOL system"
  context legacy-modernization
  say "A system the business cannot stop is the hardest kind to replace. The method answers that by working from the one record that is complete: the code."

show legacy-experts-gone
  say "The people who could explain the system are mostly gone."

connect legacy-experts-gone to asimov-discover
  say "So the method starts with the code itself: ASIMOV's agents turn it into a graph of the old system."

show modernization-stalls
  say "The other risk is a migration that nobody can prove complete."

connect modernization-stalls to parity-contract
  say "The graphs and the specification become the contract the new system must meet."

caveat contract-fixed

answer "Have ASIMOV build a graph of your COBOL system from its code first. Every module is then decided, migrated and proven against that record, and you choose how far to go."
  read modernization/agents#how-the-pipeline-runs

branch "From the code to a decision on every module"
  say "This part shows the two graphs, and the decision your team makes on every module."
show source-state-graph
show target-state-graph
show asimov-document
sample four-decisions "Decisions on your COBOL modules"
  say "Here is what those decisions could look like for your system."
  line "module CLAIMS-ENTRY       Retain"
  line "module RATE-CALC          Modify"
  line "module DATE-UTILS         Replace"
  line "module PRINT-STATEMENTS   Retire"
  note 2 "Modify: the Product Owner records how the behavior changes."
  note 4 "Retire: the module is removed, and it stays documented."
  reject "module BATCH-RECONCILE" "It has no decision yet."
caveat module-needs-decision

branch "Migrating and proving each module"
  say "This part shows how each module is migrated and proven against the contract."
show asimov-migrate
show asimov-validate
show expert-review
  say "People still check the work at two points."

branch "Engagement modes and the handover"
  say "This part shows how far you can go, where you can stop, and what happens after."
recommend choose-a-mode
show asimov-maintain

branch "Results so far"
  say "This part shows the track record, including a COBOL system on AS400."
show asimov-programs
caveat results-in-context`,
  },
];
