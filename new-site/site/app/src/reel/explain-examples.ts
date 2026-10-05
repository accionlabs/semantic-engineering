// Worked explanations for agents, shown in the reference and used as test cases: each must pass.
export const EXPLAIN_EXAMPLES: { title: string; code: string }[] = [
  {
    title: 'Onboarding, for an existing product',
    code: `explain "Onboarding takes us months, and customers find configuration errors after go-live."
  for "the head of implementation at a payroll SaaS company"
  context brownfield
  layer onboarding
  say "You told me onboarding takes months and errors show up after go-live. Here is how the paper explains both."

show months-to-go-live
  say "First, the months. The paper sees the same pattern across enterprise software."

show errors-after-go-live
  say "Now the errors. They have a specific cause."

connect errors-after-go-live to domain-language
  say "Rules that nothing checks can become rules a parser enforces."

show onboarding-as-document
  say "Applied to onboarding, that becomes one checked document."

recommend onboarding-first
  say "For a product with customers on it, this is where the paper says to begin."

caveat errors-inside-language
  say "One limit to keep in view."

answer "Describe each customer's setup as a checked document. The checks catch errors before go-live, and the product stays untouched."
  read 6`,
  },
  {
    title: 'Pricing, for a finance lead',
    code: `explain "Customers complain they pay for features they never use. How would pricing change?"
  for "a CFO at a mid-size payroll SaaS company"
  context brownfield
  layer bill

show paying-for-unused
  say "You said customers pay for features they never use. The paper starts there too."

show line-moves-down
  say "The fix begins further down, with where the line between shared and per-customer sits."

compare bill today with after
  say "Here is the same bill, before and after that line moves."

caveat component-underpricing
  say "Pricing by component has one risk the paper names."

show packages-and-outcomes

answer "Price can follow each customer's document: the capabilities it uses, plus the work of assembling them, with packages for common cases."
  read 4`,
  },
  {
    title: 'A new product',
    code: `explain "We are starting a new HR product. What should we design differently?"
  for "a founding CTO"
  context greenfield
  say "You are starting from nothing, which the paper calls greenfield. That gives you a choice existing products do not have."

show invariants-as-core
  say "Begin with what will not vary between your customers."

show domain-language
  say "Everything that does vary is written in a language over those invariants."

recommend bottom-up
  say "With nothing running yet, the paper says to build from the bottom."

show wadi
  say "Here is an application built that way from the start."

caveat grammar-is-judgement

answer "Design the data model and execution layer around the invariants, and let each customer's variation be a document in a language over them."
  read 9`,
  },
];
