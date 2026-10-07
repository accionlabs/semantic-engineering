import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTEXTS, ROLES, buildChecked, symptomsFor } from '../reel/builder';
import { reels } from '../reel/store';
import { track } from '../reel/track';

// The guided builder: three choices, and the site writes an explanation from the knowledge graph. No AI runs.
export const Builder: React.FC = () => {
  const navigate = useNavigate();
  const [context, setContext] = useState('');
  const [role, setRole] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');
  const options = useMemo(() => (context ? symptomsFor(context) : []), [context]);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const build = () => {
    const r = buildChecked({ context, role: role || undefined, symptoms: picked });
    if (!r.ok || !r.code || !r.plan) { setError(r.error ?? 'This combination could not be built. Choose fewer problems and try again.'); return; }
    const saved = reels.save(r.code, { question: r.plan.question, audience: r.plan.audience }, 'builder');
    track('builder_build', { context, role: role || 'none', problems: picked.length });
    navigate(`/explain/${saved.id}`);
  };
  return (
    <section className="builder" aria-label="Build an explanation">
      <h2>Build your explanation</h2>
      <p className="muted">Three choices, and the site puts together a short explanation from the film for your situation, with deep dives you can choose. Nothing is sent anywhere until you share it.</p>

      <fieldset>
        <legend>1. What kind of work is it?</legend>
        <div className="builder-row">
          {CONTEXTS.map((c) => <button key={c.id} type="button" className={`reel-chip ${context === c.id ? 'on' : ''}`} aria-pressed={context === c.id} onClick={() => { setContext(c.id); setPicked([]); setError(''); }}>{c.name}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend>2. Your role <span className="muted">(optional)</span></legend>
        <div className="builder-row">
          {ROLES.map((r) => <button key={r.slug} type="button" className={`reel-chip ${role === r.slug ? 'on' : ''}`} aria-pressed={role === r.slug} onClick={() => setRole(role === r.slug ? '' : r.slug)}>{r.name}</button>)}
        </div>
      </fieldset>

      {context && (
        <fieldset>
          <legend>3. What do you see? <span className="muted">Choose one or more; the first you choose leads.</span></legend>
          <ul className="builder-list">
            {options.map((s) => {
              const n = picked.indexOf(s.id);
              return (
                <li key={s.id}>
                  <label className={n >= 0 ? 'on' : ''}>
                    <input type="checkbox" checked={n >= 0} onChange={() => toggle(s.id)} />
                    <span><strong>{s.label}</strong>{n === 0 && picked.length > 1 && <span className="g-tag" style={{ marginLeft: 8 }}>leads</span>}<span className="muted builder-def">{s.definition}</span></span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      )}

      {error && <p className="reel-bad">{error}</p>}
      <button className="btn primary builder-go" disabled={!context || !picked.length} onClick={build}>Build and play</button>
    </section>
  );
};
