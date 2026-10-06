import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkExplain, compiledListing } from '../reel/explain';
import { quoteFor, type Plan, type Segment } from '../reel/language';
import { ReelPlayer, type ReelApi } from '../reel/ReelPlayer';
import { reels } from '../reel/store';
import { nodeById } from '../reel/graph';
import { placeOf, sceneByN } from '../reel/vocab';
import { EXPLAIN_EXAMPLES } from '../reel/explain-examples';
import { Reader } from '../player/Reader';
import { PAGES } from '../content/data';
import type { Loc } from '../content/film';
import { MCP_URL } from '../reel/prompt';

/** A page reference ("sdlc/agents#the-kg-sync-agent p3") as a location the reader opens. */
const locOf = (ref: string): Loc | undefined => {
  const p = placeOf(ref);
  const page = p && PAGES.get(p.key);
  if (!p || !page) return undefined;
  return { page, anchor: p.anchor || undefined, url: p.url, heading: p.anchor ? p.section.title : undefined };
};

/** Beside the video: what the current part draws on, and why it is there. */
const Beside: React.FC<{ seg?: Segment; plan: Plan; onRead: (ref: string) => void }> = ({ seg, plan, onRead }) => {
  if (!seg) return (
    <aside className="companion"><p className="kicker">Your explanation</p><h2 className="companion-title">{plan.question}</h2>
      {plan.audience && <p className="muted companion-note">For {plan.audience}</p>}
      <p className="muted companion-note">{plan.segments.length} parts · {nodeById(plan.context ?? '')?.label}{plan.layers.length ? ` · ${plan.layers.join(', ')}` : ''}</p></aside>
  );
  const parts = seg.trace?.node?.split(' ') ?? [];
  const node = parts.length === 1 ? nodeById(parts[0]) : undefined;
  const link = parts.length === 3 ? { from: nodeById(parts[0]), to: nodeById(parts[2]) } : undefined;
  const quotes = seg.kind === 'clip' || seg.kind === 'quote' ? seg.quotes : [];
  return (
    <aside className="companion" aria-live="polite">
      <p className="kicker">{seg.kind === 'host' ? 'The guide' : seg.kind === 'quote' ? 'From the site' : `The expert · scene ${seg.scene}`}</p>
      <h2 className="companion-title">{seg.kind === 'host' ? (seg.role === 'intro' ? plan.question : seg.role === 'close' ? 'The answer' : 'Connecting the parts') : link ? `${link.from?.label} → ${link.to?.label}` : node?.label ?? (seg.kind !== 'quote' ? sceneByN(seg.scene)?.title : '')}</h2>
      {node && seg.kind !== 'host' && <p className="muted companion-note">{node.definition}</p>}
      {seg.trace?.reason && seg.kind !== 'host' && <p className="reel-why">{seg.trace.reason}</p>}
      {seg.kind === 'host' && seg.text && <p className="companion-note">{seg.text}</p>}
      {quotes.length > 0 && <p className="kicker companion-sub">On the site</p>}
      <ul className="related">
        {quotes.map((ref) => {
          const q = quoteFor(ref);
          if (!q) return null;
          return (
            <li key={ref}>
              <button className="related-card" onClick={() => onRead(ref)}>
                <span><strong>{q.page}{q.section ? ` · ${q.section}` : ''}</strong><span className="related-sum reel-quote">{q.text}</span><span className="related-go">Read →</span></span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

const Source: React.FC<{ code: string; plan: Plan; index: number; onLine: (line: number) => void }> = ({ code, plan, index, onLine }) => {
  const [tab, setTab] = useState<'source' | 'compiled'>('source');
  const seg = plan.segments[index];
  const lines = code.split(/\r?\n/);
  const compiled = compiledListing(plan).split('\n');
  const ref = useRef<HTMLDivElement>(null);
  // Keep the playing line in view inside the code box, without scrolling the page.
  useEffect(() => {
    const box = ref.current, on = box?.querySelector('.on') as HTMLElement | null;
    if (box && on && (on.offsetTop < box.scrollTop || on.offsetTop > box.scrollTop + box.clientHeight - 30)) box.scrollTop = on.offsetTop - box.clientHeight / 3;
  }, [index, tab]);
  return (
    <details className="reel-source">
      <summary>How this explanation was made</summary>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'source'} className={`tab ${tab === 'source' ? 'on' : ''}`} onClick={() => setTab('source')}>What the agent wrote</button>
        <button role="tab" aria-selected={tab === 'compiled'} className={`tab ${tab === 'compiled' ? 'on' : ''}`} onClick={() => setTab('compiled')}>What it compiled to</button>
      </div>
      <p className="muted tab-note">{tab === 'source' ? 'The explanation language names concepts from the knowledge graph of Semantic Engineering. The site checked it against the graph before playing it. Select a line to jump there.' : 'Each move became scenes, sentences and quotes. Lines marked "added from the graph" are concepts the graph required first.'}</p>
      <div className="reel-code" ref={ref}>
        {tab === 'source'
          ? lines.map((l, i) => <div key={i} className={`reel-line ${seg && seg.line === i + 1 ? 'on' : ''}`} onClick={() => onLine(i + 1)}><span className="reel-ln">{i + 1}</span><code>{l || ' '}</code></div>)
          : compiled.map((l, i) => <div key={i} className={`reel-line ${i === index ? 'on' : ''}`} onClick={() => onLine(plan.segments[i].line)}><span className="reel-ln">{i + 1}</span><code>{l}</code></div>)}
      </div>
    </details>
  );
};

export const ExplainPage: React.FC = () => {
  const { id = '' } = useParams();
  const saved = reels.get(id);
  const result = useMemo(() => (saved ? checkExplain(saved.code) : undefined), [saved?.code]); // eslint-disable-line
  const api = useRef<ReelApi | null>(null);
  const [index, setIndex] = useState(-1);
  const [reading, setReading] = useState<Loc | null>(null);
  useEffect(() => { if (saved) reels.played(saved.id); }, [id]); // eslint-disable-line
  if (!saved) return <div className="wrap narrow"><h1>Not in this browser</h1><p>Explanations are kept in the browser that made them. <Link to="/explain">See the ones saved here</Link>.</p></div>;
  if (!result?.plan) return (
    <div className="wrap narrow"><h1>This explanation does not check</h1>
      <ul>{result?.problems.map((p, i) => <li key={i}>Line {p.line}: {p.message}</li>)}</ul>
      <pre className="reel-code">{saved.code}</pre></div>
  );
  const plan = result.plan;
  const end = (
    <>
      <p className="kicker">End of your explanation</p>
      <h2>{plan.question}</h2>
      <div className="act-end-actions">
        {plan.read.map((r) => { const l = locOf(r); return l ? <button key={r} className="btn primary" onClick={() => setReading(l)}>Read: {l.heading ?? l.page.title}</button> : null; })}
        <Link className="btn" to="/explain">Your explanations</Link>
      </div>
    </>
  );
  return (
    <div className="wrap wide">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/explain">Explanations</Link> / {plan.question}</p>
      <p className="reel-banner">Written by an agent for one question. The scenes and quotes come from the film and the site's pages; the guide's lines are the agent's.</p>
      <div className="watch">
        <ReelPlayer plan={plan} api={api} onIndex={(i) => setIndex(i)} endOverlay={end} />
        <Beside seg={plan.segments[index]} plan={plan} onRead={(ref) => { const l = locOf(ref); if (!l) return; api.current?.pause(); setReading(l); }} />
      </div>
      <Source code={saved.code} plan={plan} index={index} onLine={(line) => { const i = plan.segments.findIndex((s) => s.line >= line); if (i >= 0) api.current?.goto(i); }} />
      {result.problems.length > 0 && <details className="reel-warnings"><summary>{result.problems.length} note{result.problems.length > 1 ? 's' : ''} from the checker</summary><ul>{result.problems.map((p, i) => <li key={i}>Line {p.line}: {p.message}</li>)}</ul></details>}
      {reading && <Reader loc={reading} onClose={() => setReading(null)} onResume={() => { setReading(null); api.current?.play(); }} />}
    </div>
  );
};

/** /explain/import#<code>: saves an explanation handed over in the address, then plays it. */
export const ExplainImport: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const code = decodeURIComponent(escape(atob(location.hash.slice(1).replace(/-/g, '+').replace(/_/g, '/'))));
      const r = checkExplain(code);
      const saved = reels.save(code, { question: r.plan?.question ?? code.match(/"([^"]*)"/)?.[1] ?? 'Explanation', audience: r.plan?.audience }, 'import');
      navigate(`/explain/${saved.id}`, { replace: true });
    } catch { navigate('/explain', { replace: true }); }
  }, []); // eslint-disable-line
  return <div className="wrap narrow"><p>Opening the explanation…</p></div>;
};

const CopyButton: React.FC<{ text: string; label: string }> = ({ text, label }) => {
  const [done, setDone] = useState(false);
  return <button className="btn" onClick={() => navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1800); }).catch(() => {})}>{done ? 'Copied' : label}</button>;
};

export const ExplainHome: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState(reels.list());
  const open = (c: string, source: 'example') => { const r = checkExplain(c); if (!r.plan) return; const s = reels.save(c, { question: r.plan.question, audience: r.plan.audience }, source); navigate(`/explain/${s.id}`); };
  return (
    <div className="wrap narrow">
      <p className="kicker" style={{ marginTop: 28 }}>Explanations</p>
      <h1>Semantic Engineering, explained for your situation</h1>
      <p className="lede muted">An agent can help you map Semantic Engineering onto your own software work: it asks about your situation, finds the matching symptoms, practices and limits in the knowledge graph of the method, and writes an explanation that plays as a short film. The recorded narration is the expert; the agent's lines are the guide.</p>
      <h2>Connect your agent</h2>
      <p>The site is an MCP server. Add it to your agent, then ask it to help you understand how Semantic Engineering applies to your application or your modernization.</p>
      <p><code className="reel-url">{MCP_URL}</code> <CopyButton text={MCP_URL} label="Copy" /></p>
      <ul className="reel-connect">
        <li><strong>Claude (web or desktop):</strong> in Settings, under Connectors, add a custom connector with that address.</li>
        <li><strong>Claude Code:</strong> run <code>claude mcp add --transport http semantic-engineering {MCP_URL}</code></li>
        <li><strong>Other agents:</strong> add it as a remote MCP server over Streamable HTTP. It needs no sign-in and keeps nothing.</li>
        <li><strong>Agents in your browser:</strong> where a browser supports WebMCP, this site offers the same tools directly, and can play an explanation on the page.</li>
      </ul>
      <p className="muted">When the agent has written an explanation, it gives you a link. Opening it plays the explanation here and saves it in this browser. The knowledge graph the agent works from, with its evidence, is on <Link to="/graph">the graph page</Link>; how to connect, the tools and the privacy policy are on <Link to="/connect">the connector page</Link>.</p>

      <h2>Saved in this browser</h2>
      {list.length === 0 ? <p className="muted">None yet. Connect your agent and ask it about your own work, or try an example below.</p> : (
        <ul className="reel-list">
          {list.map((r) => (
            <li key={r.id}>
              <Link to={`/explain/${r.id}`}><strong>{r.question}</strong></Link>
              <span className="muted"> {r.audience ? `· for ${r.audience} ` : ''}· {new Date(r.created).toLocaleDateString()} · {r.source === 'example' ? 'an example' : 'from your agent'}</span>
              <button className="linkish" onClick={() => { reels.remove(r.id); setList(reels.list()); }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && <button className="linkish" onClick={() => { reels.clear(); setList([]); }}>Clear the history</button>}

      <h2>Try an example</h2>
      <ul className="reel-list">{EXPLAIN_EXAMPLES.map((e) => <li key={e.title}><button className="linkish" onClick={() => open(e.code, 'example')}>{e.title}</button></li>)}</ul>

    </div>
  );
};
