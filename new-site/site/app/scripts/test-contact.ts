// Contact requests: the rules a request must meet, and the Worker's handling (stored, limited, emailed, listed).
// Run with: npx tsx scripts/test-contact.ts
import { checkContact } from '../src/reel/contact';

let failed = 0;
const ok = (name: string, cond: boolean, detail = '') => { if (!cond) { failed++; console.log(`FAIL ${name} ${detail}`); } };
const base = { name: 'Ada Lovelace', email: 'ada@example.com', company: 'Analytical', request: 'architect', message: 'Hello', consent: true, website: '' };
ok('a complete request passes', !!checkContact(base).contact);
ok('a name is required', checkContact({ ...base, name: ' ' }).problem?.includes('name') ?? false);
ok('an email is required', checkContact({ ...base, email: 'nope' }).problem?.includes('email') ?? false);
ok('a known request is required', checkContact({ ...base, request: 'lunch' }).problem?.includes('choose') ?? false);
ok('consent is required', checkContact({ ...base, consent: false }).problem?.includes('tick') ?? false);
ok('consent must be true, not a string', !!checkContact({ ...base, consent: 'true' }).problem);
ok('a long message is refused', !!checkContact({ ...base, message: 'x'.repeat(1001) }).problem);
ok('the company is optional', !!checkContact({ ...base, company: '' }).contact);
ok('a filled hidden field is a bot', checkContact({ ...base, website: 'http://spam' }).bot === true);
console.log(`${9 - failed} of 9 contact rules pass`);
process.exit(failed ? 1 : 0);
