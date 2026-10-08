import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Story } from './Story';
import { QUESTIONS, ROLES, SITUATIONS, sceneTitle, type Path } from '../content/paths';

// The builder carries the knowledge graph, so it loads only when its tab opens.
const Builder = lazy(() => import('../pages/Builder').then((m) => ({ default: m.Builder })));

export type Tab = 'story' | 'roles' | 'situations' | 'questions' | 'explain';
const TABS: { id: Tab; label: string; note: string }[] = [
  { id: 'story', label: 'Follow the story', note: 'The full video in six parts and an appendix, one part at a time.' },
  { id: 'roles', label: 'Pick your role', note: 'The scenes that matter most for your role, in order.' },
  { id: 'situations', label: 'Pick your situation', note: 'A new application, an existing one, or a legacy modernization.' },
  { id: 'questions', label: 'Ask a question', note: 'The questions engineering leaders ask, each answered in one scene.' },
  { id: 'explain', label: 'Explain it for you', note: 'A short film built for your own situation, from three choices, with deep dives you choose. Or have your AI agent write one.' },
];
const fromHash = (): Tab | undefined => {
  if (typeof location === 'undefined') return undefined;
  const h = location.hash.slice(1);
  return TABS.find((t) => t.id === h)?.id;
};

const PathList: React.FC<{ paths: Path[]; prefix: string; current?: string }> = ({ paths, prefix, current }) => (
  <ol className="path-list">
    {paths.map((p) => (
      <li key={p.slug} className={current === p.slug ? 'current' : ''}>
        <Link to={`/watch/${prefix}-${p.slug}`} className="path-card">
          <strong>{p.name}</strong>
          <span className="muted">{p.note}</span>
          <span className="path-scenes">{p.scenes.length} scenes · {p.scenes.map(sceneTitle).slice(0, 3).join(' · ')}{p.scenes.length > 3 ? ' …' : ''}</span>
        </Link>
      </li>
    ))}
  </ol>
);

const Questions: React.FC<{ current?: number }> = ({ current }) => (
  <ol className="question-list">
    {QUESTIONS.map((n) => (
      <li key={n} className={current === n ? 'current' : ''}>
        <Link to={`/watch/scene-${n}`}><span className="scene-num">{n}</span>{sceneTitle(n)}</Link>
      </li>
    ))}
  </ol>
);

/** Below the video: every way through it, each with its own address. */
export const Paths: React.FC<{ initial?: Tab; current?: { act?: number; scene?: number; role?: string; situation?: string } }> = ({ initial = 'story', current }) => {
  const [tab, setTab] = useState<Tab>(initial);
  useEffect(() => {
    const sync = () => { const h = fromHash(); if (h) setTab(h); };
    sync(); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync);
  }, []);
  const choose = (t: Tab) => { setTab(t); history.replaceState(history.state, '', `#${t}`); };
  const note = TABS.find((t) => t.id === tab)!.note;
  return (
    <section className="paths" id="paths" aria-label="Choose a path">
      <h2 className="kicker">Choose a path</h2>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => choose(t.id)}>{t.label}</button>
        ))}
      </div>
      <p className="muted tab-note">{note}</p>
      <div role="tabpanel">
        {tab === 'story' && <Story current={current} />}
        {tab === 'roles' && <PathList paths={ROLES} prefix="role" current={current?.role} />}
        {tab === 'situations' && <PathList paths={SITUATIONS} prefix="use" current={current?.situation} />}
        {tab === 'questions' && <Questions current={current?.scene} />}
        {tab === 'explain' && (
          <>
            <Suspense fallback={<p className="muted">Loading</p>}><Builder /></Suspense>
            <p className="muted">Using an AI agent such as Claude? <Link to="/connect">Connect it to this site</Link> and it can write an explanation from a conversation with you. Explanations saved in this browser are on <Link to="/explain">the explanations page</Link>.</p>
          </>
        )}
      </div>
    </section>
  );
};
