import React, { useEffect, useState } from 'react';
import type { Count, Insights } from '../reel/insights';
import { REQUESTS } from '../reel/contact';

// /insights: what people use the explanations and the connector for, in aggregate. Behind Cloudflare Access;
// the Worker checks the sign-in again before it answers.
const Table: React.FC<{ title: string; rows?: Count[]; note?: string }> = ({ title, rows, note }) => (
  <section className="ins-card">
    <h3>{title}</h3>
    {note && <p className="muted ins-note">{note}</p>}
    {!rows?.length ? <p className="muted">None yet.</p> : (
      <table><tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td className="ins-n">{v}</td></tr>)}</tbody></table>
    )}
  </section>
);

export const InsightsPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Insights | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null); setError('');
    fetch(`/api/insights?days=${days}`, { credentials: 'same-origin' })
      .then(async (r) => { const body = await r.json(); if (!r.ok) throw new Error(body.error ?? `error ${r.status}`); setData(body); })
      .catch((e) => setError(e.message));
  }, [days]);
  return (
    <div className="wrap wide insights-page">
      <p className="kicker" style={{ marginTop: 28 }}>Insights</p>
      <h1>What people use the explanations for</h1>
      <p className="lede muted">Contact requests, stored explanations and anonymous connector counts. Contact requests hold personal details people chose to send: use them only to reply, and they are deleted after 12 months.</p>
      <div className="builder-row" role="group" aria-label="Period">
        {[7, 30, 90].map((d) => <button key={d} className={`reel-chip ${days === d ? 'on' : ''}`} aria-pressed={days === d} onClick={() => setDays(d)}>Last {d} days</button>)}
      </div>
      {error && <p className="reel-bad" style={{ marginTop: 20 }}>{error}</p>}
      {!data && !error && <p className="muted" style={{ marginTop: 20 }}>Loading</p>}
      {data && (
        <>
          <h2>Contact requests <span className="muted" style={{ fontWeight: 400 }}>· {data.contacts?.length ?? 0}</span></h2>
          {!data.contacts?.length ? <p className="muted">None in this period.</p> : (
            <div className="table-wrap"><table>
              <thead><tr><th>When</th><th>Request</th><th>Name</th><th>Email</th><th>Company</th><th>Message</th><th>Explanation</th></tr></thead>
              <tbody>{data.contacts.map((c, i) => (
                <tr key={i}>
                  <td>{c.created.slice(0, 10)}</td>
                  <td>{REQUESTS.find((r) => r.id === c.request)?.label ?? c.request}</td>
                  <td>{c.name}</td>
                  <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
                  <td>{c.company}</td>
                  <td style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>{c.message}</td>
                  <td>{c.link ? <a href={c.link} target="_blank" rel="noopener">{c.question ?? 'Watch'}</a> : c.question ?? ''}{c.context ? <span className="muted"> · {c.context}{c.role ? `, ${c.role}` : ''}</span> : null}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}

          <h2>Explanations stored <span className="muted" style={{ fontWeight: 400 }}>· {data.stored.total}</span></h2>
          <div className="ins-grid">
            <Table title="Kinds of work" rows={data.stored.kinds} />
            <Table title="Made by, and against the current rules" rows={data.stored.madeBy} />
            <Table title="Who they were for" rows={data.stored.audiences} />
            <Table title="Explanations per week" rows={data.stored.weeks} note="Week starting." />
            <Table title="Concepts used most" rows={data.stored.concepts} />
            <Table title="Deep dives offered" rows={data.stored.deepDives} />
          </div>
          <h2>Questions</h2>
          {!data.stored.questions.length ? <p className="muted">None yet.</p> : (
            <div className="table-wrap"><table>
              <thead><tr><th>Question</th><th>Kind of work</th><th>Stored</th><th>Current rules</th></tr></thead>
              <tbody>{data.stored.questions.map((q, i) => <tr key={i}><td>{q.question}</td><td>{q.context}</td><td>{q.created ?? ''}</td><td>{q.passes ? 'passes' : 'fails'}</td></tr>)}</tbody>
            </table></div>
          )}
          <h2>Connector usage</h2>
          {data.usageNote && <p className="muted">{data.usageNote}</p>}
          {data.usage && (
            <div className="ins-grid">
              <Table title="Requests by kind and tool" rows={data.usage.requests} />
              <Table title="Outcomes" rows={data.usage.outcomes} />
              <Table title="Most common checker problems" rows={data.usage.errors} />
              <Table title="Clients that connected" rows={data.usage.clients} />
              <Table title="Kinds of work asked about" rows={data.usage.kinds} />
              <Table title="Countries" rows={data.usage.countries} />
            </div>
          )}
          <p className="muted" style={{ marginTop: 24 }}>Generated {new Date(data.generated).toLocaleString()}.</p>
        </>
      )}
    </div>
  );
};
