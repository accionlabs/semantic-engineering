// Worked explanations: shown on /explain, given to agents in the reference, and run by the tests.
export const EXPLAIN_EXAMPLES: { title: string; code: string }[] = [
  {
    title: 'Agents on a large existing application',
    code: `explain "Our coding agents keep breaking things other teams depend on, and every change needs days of investigation first."
  for "the VP of Engineering at an insurance software company"
  context brownfield
  layer architecture
  layer code
  say "You said agents break what other teams depend on, and that each change needs days of investigation. Here is how the method sees both."

show agents-make-mistakes
  say "First, why the agents go wrong."

show days-of-investigation
  say "Now the days before each change."

connect days-of-investigation to impact-report
  say "That investigation is what impact analysis does from the graph."

show pr-validation
  say "Before anything merges, the change is checked against the graph."

recommend extract-first
  say "For an application already in use, the graph comes from the code itself."

show brownfield-2m
  say "Here is what that looked like on one application of over two million lines."

caveat results-in-context
caveat graph-not-a-spec
  say "One limit to keep in view: the graph sits beside your specifications."

answer "Extract the graph from your code, run impact analysis before each change, and check every pull request against the graph. Your specifications keep describing the change."
  read sdlc/agents#the-impact-analysis-agent`,
  },
  {
    title: 'A new user-interface workstream growing complex',
    code: `explain "Our new UI keeps rebuilding components the design system already has."
  for "a design system owner"
  context greenfield
  layer design
  say "You said new screens rebuild components you already have. The method treats that as missing design knowledge."

show design-duplication

show four-layer-graph
  say "The method records design knowledge as one of four layers, each with an owner."

compare design today with after
  say "Here is design knowledge today, and with the design layer in the graph."

recommend start-with-a-layer
  say "You can start with the one layer that hurts."

show ui-workstream
  say "One workstream did exactly that."

caveat results-in-context
caveat graph-not-a-spec

answer "Record the design system as the design layer of the graph, and let the pull request check catch duplicates. Start with that layer alone."
  read sdlc/case-archetypes#greenfield-growing-into-complexity`,
  },
  {
    title: 'A legacy system nobody can explain',
    code: `explain "The people who understood our old system have left, and we cannot prove a migration is complete."
  for "the CIO of a logistics company"
  context legacy-modernization
  say "You said the experts are gone and completeness cannot be proven. Both have a specific answer in legacy modernization."

show legacy-experts-gone

connect legacy-experts-gone to source-state-graph
  say "The old code becomes a graph, with its statements kept as evidence."

show four-decisions
  say "Every module then gets a decision."

show parity-contract
  say "Those records together define what complete means."

show four-gates

recommend choose-a-mode
  say "You can start small and stop at any mode."

caveat contract-fixed

answer "Build a graph of the old system from its code, decide every module, and let four gates prove the new code behaves like the old. Begin with the mode you are ready for."
  read modernization/methodology#the-parity-contract`,
  },
];
