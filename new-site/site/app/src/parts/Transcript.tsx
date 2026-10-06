import React from 'react';
import { Link } from 'react-router-dom';
import { locName, sceneInfo, sceneSources } from '../content/film';

/** Under every video: the narration as text, scene by scene, with the pages each draws on. */
export const Transcript: React.FC<{ scenes: number[]; open?: boolean }> = ({ scenes, open }) => (
  <details className="transcript" open={open}>
    <summary className="kicker">Transcript</summary>
    {scenes.map((n) => {
      const s = sceneInfo(n);
      if (!s) return null;
      const src = sceneSources(n).slice(0, 3);
      return (
        <section key={n}>
          <h3>{n ? `${n}. ` : ''}{s.title}</h3>
          <p>{s.sentences.join(' ')}</p>
          {src.length > 0 && <p className="muted">On the site: {src.map((l, i) => <React.Fragment key={l.url}>{i ? ' · ' : ''}<Link to={l.url}>{locName(l)}</Link></React.Fragment>)}</p>}
        </section>
      );
    })}
  </details>
);
