// Worked examples for agents, shown on the reference page and returned by the reference tool.
// Each one is also a test case: it must pass the checks.
export const EXAMPLES: { title: string; code: string }[] = [
  {
    title: 'Pricing, for a finance lead',
    code: `reel "How would pricing change for a payroll provider like us?"
  for "a CFO at a mid-size payroll SaaS company"

intro "You asked how pricing would change. The paper starts with what a customer pays for today."

play scene 10 sentences 1-3        # the bill today: tiers bundle what the customer may not use
  highlight 4 para 1

bridge "Now the other end of the journey. Once each customer's rules sit in their own document, that document lists what they use."

play scene 23                      # the bill after the line moves
  highlight 4.1 para 2
  highlight 4.3

hold scene 12 at sentence 6 on line.mt for 4s
  say "This is the line that decides what stays shared, and so what the base price covers."

close "So the price can follow the document: the capabilities used, plus the work of assembling them. Section 4 has the detail."
  read 4`,
  },
  {
    title: 'Onboarding first, for an implementation lead',
    code: `reel "Where would we start with an existing product?"
  for "the head of implementation at a SaaS vendor"

intro "You asked where to start. The paper's answer is the layer your customers meet first."

play layer onboarding              # onboarding today, then after the line moves
  highlight 6 para 1
  highlight 6 para 4

bridge "Here is why the paper puts onboarding ahead of the interface."

play scene 16 sentences 4          # take onboarding first
  highlight 14 para 4

close "Onboarding comes first because it leaves the product's code untouched, and its value shows in how fast customers go live."
  read 6`,
  },
];
