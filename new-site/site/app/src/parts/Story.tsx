import React from 'react';
import { Link } from 'react-router-dom';
import { ACT_NAMES, ACTS, actLabel, actPath, scenesOf } from '../content/film';

/** Every act and scene, each with its own address. */
export const Story: React.FC<{ current?: { act?: number; scene?: number } }> = ({ current }) => (
  <section className="story" aria-label="Follow the story">
    <h2 className="kicker">Follow the story</h2>
    <div className="acts">
      {ACTS.map((a) => (
        <article key={a} className={`act-tile ${current?.act === a ? 'current' : ''}`}>
          <Link to={actPath(a)} className="act-head">
            <span className="act-label">
              <span className="kicker">{actLabel(a)}</span>
              <strong>{ACT_NAMES[String(a)]}</strong>
              <span className="act-play">Play →</span>
            </span>
          </Link>
          <ol className="scene-list">
            {scenesOf(a).map((s) => (
              <li key={s.n} className={current?.scene === s.n ? 'current' : ''}>
                <Link to={`/watch/scene-${s.n}`}><span className="scene-num">{s.n}</span>{s.title}</Link>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  </section>
);
