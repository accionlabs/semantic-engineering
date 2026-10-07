import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkExplain, sectionListing } from '../reel/explain';
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
import { unpackExplanation } from '../reel/link';
import { Builder } from './Builder';
import { track } from '../reel/track';

const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

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
  if (seg.kind === 'sample') return (
    <aside className="companion" aria-live="polite">
      <p className="kicker">An illustration by your agent</p>
      <h2 className="companion-title">{seg.title}</h2>
      {node && <p className="muted companion-note">A sample of {lower(node.label)}, written for your situation.</p>}
      <p className="reel-why">Not from the method&apos;s sources, and not from any real system. The method&apos;s own description is in the parts before it.</p>
    </aside>
  );
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
  // plan is the section playing: the short explanation or one deep dive.
  const [tab, setTab] = useState<'source' | 'compiled'>('source');
  const seg = plan.segments[index];
  const lines = code.split(/\r?\n/);
  const compiled = sectionListing(plan.segments).split('\n');
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
      <p className="muted tab-note">{tab === 'source' ? 'The explanation language names concepts from the knowledge graph of Semantic Engineering. The site checked it against the graph before playing it. Select a line to jump there.' : 'The part playing now, as scenes, sentences and quotes. Lines marked "added from the graph" are concepts the graph required first.'}</p>
      <div className="reel-code" ref={ref}>
        {tab === 'source'
          ? lines.map((l, i) => <div key={i} className={`reel-line ${seg && seg.line === i + 1 ? 'on' : ''}`} onClick={() => onLine(i + 1)}><span className="reel-ln">{i + 1}</span><code>{l || ' '}</code></div>)
          : compiled.map((l, i) => <div key={i} className={`reel-line ${i === index ? 'on' : ''}`} onClick={() => onLine(plan.segments[i].line)}><span className="reel-ln">{i + 1}</span><code>{l}</code></div>)}
      </div>
    </details>
  );
};

/** Which section a source line belongs to: -1 for the short explanation, else the deep dive's index. */
const sectionOfLine = (plan: Plan, line: number) => {
  let k = -1;
  plan.branches.forEach((b, i) => { if (b.line <= line) k = i; });
  return k;
};

export const ExplainPage: React.FC<{ localId?: string }> = ({ localId }) => {
  const { id: param = '' } = useParams();
  const id = localId ?? param;
  const saved = reels.get(id);
  const result = useMemo(() => (saved ? checkExplain(saved.code) : undefined), [saved?.code]); // eslint-disable-line
  const api = useRef<ReelApi | null>(null);
  const [index, setIndex] = useState(-1);
  const [active, setActive] = useState(-1);          // -1: the short explanation; else a deep dive
  const [watched, setWatched] = useState<Set<number>>(new Set());
  const [reading, setReading] = useState<Loc | null>(null);
  useEffect(() => { if (saved) reels.played(saved.id); }, [id]); // eslint-disable-line
  const full = result?.plan;
  const section = useMemo<Plan | undefined>(() => {
    if (!full) return undefined;
    const b = full.branches[active];
    return b ? { ...full, segments: b.segments, seconds: b.seconds, read: b.read } : full;
  }, [full, active]);
  if (!saved) return <div className="wrap narrow"><h1>Not in this browser</h1><p>Explanations are kept in the browser that made them. <Link to="/explain">See the ones saved here</Link>.</p></div>;
  if (!full || !section) return (
    <div className="wrap narrow"><h1>This explanation does not check</h1>
      {saved.source === 'import' && <p className="muted">If it came in a link, the link may have been cut short when it was copied or sent. Ask your agent for the link again.</p>}
      <ul>{result?.problems.map((p, i) => <li key={i}>Line {p.line}: {p.message}</li>)}</ul>
      <pre className="reel-code">{saved.code}</pre></div>
  );
  const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;
  const choose = (k: number) => {
    setReading(null); setActive(k); setIndex(-1);
    if (k >= 0) { setWatched((w) => new Set(w).add(k)); track('deep_dive_choose', { label: full.branches[k].label, context: full.context ?? '' }); }
  };
  // Anonymous viewing events: a part starting, and a part played to its end.
  const onIndex = (i: number) => {
    setIndex(i);
    const part = active < 0 ? 'short explanation' : `deep dive: ${full.branches[active]?.label ?? ''}`;
    if (i === 0) track('explanation_play', { part, context: full.context ?? '', source: saved.source });
    if (i === section.segments.length) track(active < 0 ? 'explanation_complete' : 'explanation_part_complete', { part, context: full.context ?? '' });
  };
  const dives = full.branches.map((b, k) => ({ b, k })).filter(({ k }) => k !== active);
  const end = (
    <>
      <p className="kicker">{active < 0 ? 'End of the short explanation' : `End of: ${full.branches[active].label}`}</p>
      <h2>{dives.length ? 'Go deeper' : full.question}</h2>
      <div className="act-end-actions reel-choices">
        {dives.map(({ b, k }) => <button key={k} className="btn primary" onClick={() => choose(k)}>{b.label} <span className="reel-dur">{watched.has(k) ? 'watched · ' : ''}{mmss(b.seconds)}</span></button>)}
        {active >= 0 && <button className="btn" onClick={() => choose(-1)}>Back to the short explanation</button>}
        {section.read.map((r) => { const l = locOf(r); return l ? <button key={r} className="btn" onClick={() => setReading(l)}>Read: {l.heading ?? l.page.title}</button> : null; })}
        <Link className="btn" to="/explain">Your explanations</Link>
      </div>
    </>
  );
  return (
    <div className="wrap wide watch-page">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/explain">Explanations</Link> / {full.question}</p>
      <p className="reel-banner">{saved.source === 'builder' ? 'Built on this site from your choices.' : 'Written by an agent for one question.'} The scenes and quotes come from the film and the site&apos;s pages; the guide&apos;s lines are {saved.source === 'builder' ? 'templates' : "the agent's"}. <ShareButton code={saved.code} context={full.context ?? ''} /></p>
      {full.branches.length > 0 && (
        <nav className="reel-sections" aria-label="Parts of this explanation">
          <button className={`reel-chip ${active < 0 ? 'on' : ''}`} aria-current={active < 0} onClick={() => choose(-1)}>The short explanation <span className="reel-dur">{mmss(full.seconds)}</span></button>
          <span className="kicker">Go deeper</span>
          {full.branches.map((b, k) => <button key={k} className={`reel-chip ${active === k ? 'on' : ''} ${watched.has(k) ? 'seen' : ''}`} aria-current={active === k} onClick={() => choose(k)}>{b.label} <span className="reel-dur">{mmss(b.seconds)}</span></button>)}
        </nav>
      )}
      <div className="watch">
        <ReelPlayer plan={section} api={api} onIndex={onIndex} endOverlay={end} autoPlay />
        <Beside seg={section.segments[index]} plan={section} onRead={(ref) => { const l = locOf(ref); if (!l) return; api.current?.pause(); setReading(l); }} />
      </div>
      <Source code={saved.code} plan={section} index={index} onLine={(line) => {
        const k = sectionOfLine(full, line);
        if (k !== active) { choose(k); return; }
        const i = section.segments.findIndex((x) => x.line >= line); if (i >= 0) api.current?.goto(i);
      }} />
      {result.problems.length > 0 && <details className="reel-warnings"><summary>{result.problems.length} note{result.problems.length > 1 ? 's' : ''} from the checker</summary><ul>{result.problems.map((p, i) => <li key={i}>Line {p.line}: {p.message}</li>)}</ul></details>}
      {reading && <Reader loc={reading} onClose={() => setReading(null)} onResume={() => { setReading(null); api.current?.play(); }} />}
    </div>
  );
};

/** /explain/import#<code>: saves an explanation handed over in the address, then plays it. */
export const ExplainImport: React.FC = () => {
  const navigate = useNavigate();
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    unpackExplanation(location.hash.slice(1)).then((code) => {
      if (!code) { setBroken(true); return; }
      const r = checkExplain(code);
      const saved = reels.save(code, { question: r.plan?.question ?? code.match(/"([^"]*)"/)?.[1] ?? 'Explanation', audience: r.plan?.audience }, 'import');
      navigate(`/explain/${saved.id}`, { replace: true });
    });
  }, []); // eslint-disable-line
  if (broken) return <div className="wrap narrow"><h1>This link is incomplete</h1><p>The explanation travels inside the link, and part of it is missing, usually because the link was cut short when it was copied or sent. Ask your agent for the link again, and open the whole link.</p><p><Link to="/explain">Explanations saved in this browser</Link></p></div>;
  return <div className="wrap narrow"><p>Opening the explanation…</p></div>;
};

/** /e/<id>: fetches an explanation the connector stored, saves it in this browser, then plays it. */
export const ExplainStored: React.FC = () => {
  const { id = '' } = useParams();
  const [missing, setMissing] = useState(false);
  const [local, setLocal] = useState<string | null>(null);
  // The short link stays in the address bar, so the person can share it; the copy saved here is for the history.
  useEffect(() => {
    setLocal(null); setMissing(false);
    fetch(`/api/explanations/${encodeURIComponent(id)}`).then((r) => (r.ok ? r.text() : Promise.reject())).then((code) => {
      const r = checkExplain(code);
      setLocal(reels.save(code, { question: r.plan?.question ?? code.match(/"([^"]*)"/)?.[1] ?? 'Explanation', audience: r.plan?.audience }, 'import').id);
    }).catch(() => setMissing(true));
  }, [id]); // eslint-disable-line
  if (local) return <ExplainPage localId={local} />;
  if (missing) return <div className="wrap narrow"><h1>This explanation is not available</h1><p>There is no explanation with this address, or it has expired. Explanations made by the connector are kept for 90 days. Ask your agent to make it again.</p><p><Link to="/explain">Explanations saved in this browser</Link></p></div>;
  return <div className="wrap narrow"><p>Opening the explanation…</p></div>;
};

/** Shares an explanation made in this browser: the server checks and stores it, and returns a short link. */
const ShareButton: React.FC<{ code: string; context: string }> = ({ code, context }) => {
  const [link, setLink] = useState(location.pathname.startsWith('/e/') ? location.href : '');
  const [state, setState] = useState<'idle' | 'busy' | 'copied' | 'ready' | 'failed'>('idle');
  const share = async () => {
    try {
      let url = link;
      if (!url) {
        setState('busy');
        const r = await fetch('/api/explanations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code }) });
        const body = (await r.json()) as { link?: string };
        if (!body.link) throw new Error('not stored');
        url = body.link; setLink(url);
        track('builder_share', { context });
      }
      // The link exists now; copying can still be refused (no clipboard permission), so show it to copy by hand.
      try { if (!navigator.clipboard) throw new Error('no clipboard'); await navigator.clipboard.writeText(url); setState('copied'); } catch { setState('ready'); }
    } catch { setState('failed'); }
  };
  return (
    <span className="reel-share">
      <button className="linkish" onClick={share} disabled={state === 'busy'}>{state === 'copied' ? 'Link copied' : state === 'ready' ? 'Link ready' : state === 'busy' ? 'Making a link…' : 'Share'}</button>
      {link && state !== 'idle' && <code className="reel-url">{link}</code>}
      {state === 'failed' && <span className="reel-bad"> Could not make a link.</span>}
    </span>
  );
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
      <p className="lede muted">A short film about your own software work: the problems you see, where the method starts, and how it answers them, with deep dives you choose. Build one here from three choices, or have your own AI agent write one from a conversation.</p>
      <Builder />
      <h2>Or connect your agent</h2>
      <p>The site is an MCP server. Add it to your agent, then ask it to help you understand how Semantic Engineering applies to your application or your modernization.</p>
      <p><code className="reel-url">{MCP_URL}</code> <CopyButton text={MCP_URL} label="Copy" /></p>
      <ul className="reel-connect">
        <li><strong>Claude (web or desktop):</strong> in Settings, under Connectors, add a custom connector with that address.</li>
        <li><strong>Claude Code:</strong> run <code>claude mcp add --transport http semantic-engineering {MCP_URL}</code></li>
        <li><strong>Other agents:</strong> add it as a remote MCP server over Streamable HTTP. It needs no sign-in; it stores the explanations made with it for 90 days.</li>
        <li><strong>Agents in your browser:</strong> where a browser supports WebMCP, this site offers the same tools directly, and can play an explanation on the page.</li>
      </ul>
      <p className="muted">When the agent has written an explanation, it gives you a link. Opening it plays the explanation here and saves it in this browser. The knowledge graph the agent works from, with its evidence, is on <Link to="/graph">the graph page</Link>; how to connect, the tools and the privacy policy are on <Link to="/connect">the connector page</Link>.</p>

      <h2>Saved in this browser</h2>
      {list.length === 0 ? <p className="muted">None yet. Connect your agent and ask it about your own work, or try an example below.</p> : (
        <ul className="reel-list">
          {list.map((r) => (
            <li key={r.id}>
              <Link to={`/explain/${r.id}`}><strong>{r.question}</strong></Link>
              <span className="muted"> {r.audience ? `· for ${r.audience} ` : ''}· {new Date(r.created).toLocaleDateString()} · {r.source === 'example' ? 'an example' : r.source === 'builder' ? 'built here' : 'from your agent'}</span>
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
