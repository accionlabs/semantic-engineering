// A request to talk to Accion Labs, sent from the end of an explanation. The person chooses to send it;
// these are its rules. Shared by the page and the Worker. No browser APIs.

export const REQUESTS: { id: string; label: string }[] = [
  { id: 'architect', label: 'Discuss my situation with an architect' },
  { id: 'assessment', label: 'An assessment of our system' },
  { id: 'workshop', label: 'A two-day workshop' },
  { id: 'information', label: 'Just send me information' },
];

export type ContactInput = { name?: unknown; email?: unknown; company?: unknown; request?: unknown; message?: unknown; consent?: unknown; website?: unknown; code?: unknown };
export type Contact = { name: string; email: string; company: string; request: string; message: string };

/** How long a contact request is kept, in days. */
export const KEEP_CONTACT_DAYS = 365;
export const CONTACT_LIMITS = { name: 80, email: 120, company: 100, message: 1000, perDay: 5 };

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Checks a contact request. Returns the cleaned request, or the problem to show the person. A filled hidden
 *  field marks a bot: it is accepted silently and dropped. */
export const checkContact = (input: ContactInput): { contact?: Contact; problem?: string; bot?: boolean } => {
  if (text(input.website)) return { bot: true };
  const name = text(input.name), email = text(input.email), company = text(input.company), message = text(input.message), request = text(input.request);
  if (!name) return { problem: 'Please give your name.' };
  if (name.length > CONTACT_LIMITS.name) return { problem: `Your name is longer than ${CONTACT_LIMITS.name} characters.` };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > CONTACT_LIMITS.email) return { problem: 'Please give an email address we can reply to.' };
  if (company.length > CONTACT_LIMITS.company) return { problem: `The company name is longer than ${CONTACT_LIMITS.company} characters.` };
  if (!REQUESTS.some((r) => r.id === request)) return { problem: 'Please choose what you would like.' };
  if (message.length > CONTACT_LIMITS.message) return { problem: `The message is longer than ${CONTACT_LIMITS.message} characters.` };
  if (input.consent !== true) return { problem: 'Please tick the box to agree that we may contact you about this request.' };
  return { contact: { name, email, company, request, message } };
};

/** The email the team receives: plain text, with the request, the person's details and the explanation. */
export const contactEmail = (c: Contact, extra: { link?: string; context?: string; role?: string; question?: string; site: string }) => [
  `A contact request from ${extra.site}`,
  '',
  `Request:  ${REQUESTS.find((r) => r.id === c.request)?.label ?? c.request}`,
  `Name:     ${c.name}`,
  `Email:    ${c.email}`,
  `Company:  ${c.company || '(not given)'}`,
  '',
  c.message ? `Message:\n${c.message}\n` : 'No message.\n',
  extra.question ? `Their explanation: ${extra.question}` : '',
  extra.context ? `Kind of work: ${extra.context}${extra.role ? `, for ${extra.role}` : ''}` : '',
  extra.link ? `Watch it: ${extra.link}` : '',
  '',
  `Kept for ${KEEP_CONTACT_DAYS / 30} months; listed on ${extra.site}/insights.`,
].filter((l, i, all) => l !== '' || all[i - 1] !== '').join('\n');
