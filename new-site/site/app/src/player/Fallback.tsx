import React from 'react';
import { Link } from 'react-router-dom';
import { SCENES, sceneSources, locName } from '../content/film';

/** With reduced motion set: the narration as text, scene by scene, with the pages each draws on. */
export const Fallback: React.FC<{ scenes?: number[] }> = ({ scenes }) => {
  const list = SCENES.filter((s) => (scenes ? scenes.includes(s.n) : s.act > 0));
  return (
    <section className="fallback" aria-label="The video as text">
      <p className="muted">Your device asks for reduced motion, so the video is shown as its narration. <a href="?motion">Play the video anyway</a>.</p>
      {list.map((s) => (
        <article key={s.n}>
          <h2>{s.n ? `${s.n}. ` : ''}{s.title}</h2>
          <p>{s.sentences.join(' ')}</p>
          <p className="muted">{sceneSources(s.n).slice(0, 3).map((l, i) => <React.Fragment key={l.url}>{i ? ' · ' : 'On the site: '}<Link to={l.url}>{locName(l)}</Link></React.Fragment>)}</p>
        </article>
      ))}
    </section>
  );
};
