// The guided builder must always produce an explanation that passes, within the limits, for every kind of
// work, every role and every problem, alone and in combination. Run with: npx tsx scripts/test-builder.ts
import { CONTEXTS, ROLES, buildChecked, symptomsFor } from '../src/reel/builder';

let total = 0, failed = 0;
const warnings = new Map<string, number>();
const check = (context: string, role: string | undefined, symptoms: string[]) => {
  total++;
  const r = buildChecked({ context, role, symptoms });
  const errs = (r.problems ?? []).filter((p) => p.severity === 'error');
  (r.problems ?? []).filter((p) => p.severity === 'warning').forEach((p) => { const k = p.message.replace(/"[^"]*"/g, '"…"').slice(0, 90); warnings.set(k, (warnings.get(k) ?? 0) + 1); });
  if (!r.ok || errs.length) { failed++; if (failed <= 8) console.log(`FAIL ${context} ${role ?? '-'} [${symptoms.join(', ')}]\n  ${errs.map((p) => `${p.line}: ${p.message}`).join('\n  ')}`); }
};
for (const c of CONTEXTS) {
  const ids = symptomsFor(c.id).map((x) => x.id);
  for (const role of [undefined, ...ROLES.map((x) => x.slug)]) for (const s of ids) check(c.id, role, [s]);
  for (let i = 0; i < ids.length; i++) for (let j = 0; j < ids.length; j++) if (i !== j) check(c.id, 'cto', [ids[i], ids[j], ids[(j + 1) % ids.length]].filter((x, k, a) => a.indexOf(x) === k));
}
console.log(`${total - failed} of ${total} built explanations pass`);
[...warnings.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([m, n]) => console.log(`  warning x${n}: ${m}`));
process.exit(failed ? 1 : 0);
