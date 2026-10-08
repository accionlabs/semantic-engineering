import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_LIMITS, REQUESTS } from '../reel/contact';
import { track } from '../reel/track';

// Talk to us: an opt-in request at the end of an explanation. Nothing is sent until the person fills it in,
// ticks the consent box and presses Send. The explanation they watched goes with it.
export const ContactForm: React.FC<{ code: string; context?: string }> = ({ code, context }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', email: '', company: '', request: '', message: '', consent: false, website: '' });
  const [state, setState] = useState<'idle' | 'busy' | 'sent'>('idle');
  const [problem, setProblem] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value });
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('busy'); setProblem('');
    try {
      const link = location.pathname.startsWith('/e/') ? location.href.split('#')[0] : undefined;
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, code, link }) });
      const body = (await r.json()) as { ok?: boolean; problem?: string };
      if (!body.ok) { setProblem(body.problem ?? 'The request could not be sent.'); setState('idle'); return; }
      track('contact_send', { request: f.request, context: context ?? '' });
      setState('sent');
    } catch { setProblem('The request could not be sent. Please write to hello@semantic-engineering.ai.'); setState('idle'); }
  };
  if (state === 'sent') return (
    <section className="contact" id="contact"><h2>Thank you</h2><p>Your request has reached the Semantic Engineering team at Accion Labs, with the explanation you watched. Someone will reply to {f.email}.</p></section>
  );
  return (
    <section className="contact" id="contact" aria-label="Talk to us">
      <h2>Talk to us about this</h2>
      <p className="muted">If this matches your situation, the team at Accion Labs can take it further with you: a conversation with an architect, an assessment, a two-day workshop, or just more information.</p>
      {!open ? <button className="btn primary contact-open" onClick={() => { setOpen(true); track('contact_open', { context: context ?? '' }); }}>Ask to be contacted</button> : (
        <form onSubmit={send} className="contact-form">
          <fieldset>
            <legend>What would you like?</legend>
            {REQUESTS.map((r) => <label key={r.id} className="contact-choice"><input type="radio" name="request" value={r.id} checked={f.request === r.id} onChange={set('request')} /> {r.label}</label>)}
          </fieldset>
          <label>Name<input value={f.name} onChange={set('name')} maxLength={CONTACT_LIMITS.name} autoComplete="name" required /></label>
          <label>Work email<input type="email" value={f.email} onChange={set('email')} maxLength={CONTACT_LIMITS.email} autoComplete="email" required /></label>
          <label><span>Company <span className="muted">(optional)</span></span><input value={f.company} onChange={set('company')} maxLength={CONTACT_LIMITS.company} autoComplete="organization" /></label>
          <label><span>Anything else we should know? <span className="muted">(optional)</span></span><textarea value={f.message} onChange={set('message')} maxLength={CONTACT_LIMITS.message} rows={4} /></label>
          {/* A field people never see; automated senders fill it in. */}
          <label className="contact-hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label>
          <label className="contact-consent"><input type="checkbox" checked={f.consent} onChange={set('consent')} /> Accion Labs may contact me about this request. My details and this explanation are kept for 12 months and used only for this. <Link to="/privacy">Privacy policy</Link></label>
          {problem && <p className="reel-bad">{problem}</p>}
          <button className="btn primary" type="submit" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Send'}</button>
        </form>
      )}
    </section>
  );
};
