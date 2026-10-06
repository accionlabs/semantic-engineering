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
  say "Both problems have one cause: the knowledge each change depends on is written nowhere an agent can read. Here is how the method changes that."

show agents-make-mistakes
  say "First, why the agents go wrong."

show impact-analysis
  say "The method starts every change with an analysis against the graph."

show validation-gates
  say "And before anything merges, the change is checked against the graph."

caveat graph-not-a-spec

answer "Run impact analysis before each change and check every pull request against the graph. Your specifications keep describing the change."
  read sdlc/agents#the-impact-analysis-agent

branch "How impact analysis replaces days of investigation"
  say "Here is what impact analysis finds, on a real change."
show days-of-investigation
connect days-of-investigation to impact-report
show alert-example
caveat results-in-context

branch "Where to start on an existing application"
recommend extract-first
  say "For an application already in use, the graph comes from the code itself."
show brownfield-2m
  say "Here is what that looked like on one application of over two million lines."
caveat results-in-context
answer "Extract the graph from your code first. It typically takes two to three weeks for more than two million lines."

branch "How each pull request is checked"
show pr-validation
  say "Here is what the check looks for, and what happens when it fails."
connect boundary-violations to pr-validation
caveat detail-still-reviewed

branch "How coding agents read the graph"
show coding-agents-via-mcp
  say "Your developers keep the coding agents they use today."
show structure-fixed
caveat detail-still-reviewed`,
  },
  {
    title: 'A new user-interface workstream growing complex',
    code: `explain "Our new UI keeps rebuilding components the design system already has."
  for "a design system owner"
  context greenfield
  layer design
  say "Duplicates are a sign of missing design knowledge, and the method records it where every change is checked against it."

show design-duplication

connect design-duplication to pr-validation
  say "With the design system recorded in the graph, every pull request is checked against it."

caveat graph-not-a-spec

answer "Record the design system as the design layer of the graph, and let the pull request check catch duplicates."
  read sdlc/case-archetypes#greenfield-growing-into-complexity

branch "Design knowledge today and with the graph"
show four-layer-graph
  say "The method records design knowledge as one of four layers, each with an owner."
compare design today with after

branch "Starting with the design layer alone"
recommend start-with-a-layer
  say "You can start with the one layer that hurts."
show ui-workstream
  say "One workstream did exactly that."
caveat results-in-context`,
  },
  {
    title: 'A legacy COBOL system, for a CTO',
    code: `explain "We run a large COBOL system that the business depends on. How would Semantic Engineering help us modernize it?"
  for "a CTO with a legacy COBOL system"
  context legacy-modernization
  say "Two things stand in the way: the people who knew the system are gone, and nothing yet proves a new system behaves like the old one."

show legacy-experts-gone
  say "Start with the people. Most COBOL estates share this problem."

show modernization-stalls
  say "And here is why so many modernizations stall before they deploy."

connect legacy-experts-gone to source-state-graph
  say "The method starts from the code itself, which becomes a graph of the old system."

connect modernization-stalls to parity-contract
  say "It then agrees a definition of how the new system must behave."

caveat contract-fixed

answer "Record the COBOL system's behavior as a contract, and let agents migrate against it with checks that prove each module. You choose how far to go."
  read modernization/methodology#the-parity-contract

branch "How the old and new systems become graphs"
show source-state-graph
  say "Here is what the graph of the old system keeps."
show target-state-graph
  say "A second graph describes the system you are moving to."
show four-decisions
caveat module-needs-decision

branch "How four gates prove the migration"
show four-gates
show expert-review
  say "People still check the work at two points."

branch "Engagement modes and the first module"
recommend choose-a-mode
  say "You do not have to commit to everything at once."
recommend first-module

branch "Results so far"
show asimov-programs
  say "Here is the track record, including a COBOL system on AS400."
caveat results-in-context`,
  },
];
