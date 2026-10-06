import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { locName, type Loc } from '../content/film';
import { sectionBlocks, usePage } from './section';

/** A passage of the site, read beside the paused video. */
export const Reader: React.FC<{ loc: Loc; onClose: () => void; onResume: () => void }> = ({ loc, onClose, onResume }) => {
  const ref = useRef<HTMLDivElement>(null);
  const data = usePage(loc);
  useEffect(() => { ref.current?.focus(); ref.current?.scrollTo(0, 0); }, [loc.url]);
  return (
    <aside className="panel reader" role="dialog" aria-labelledby="reader-title" tabIndex={-1} ref={ref}>
      <div className="panel-head">
        <span className="kicker accent">{loc.page.title} · video paused</span>
        <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <h2 id="reader-title">{locName(loc)}</h2>
      <div className="reader-actions">
        <button className="btn primary" onClick={onResume}>Resume the video</button>
        <Link className="btn" to={loc.url}>Open as a page</Link>
      </div>
      {data ? sectionBlocks(data, loc.anchor).map((b, i) => <div key={i} className={`block block-${b.k}`} dangerouslySetInnerHTML={{ __html: b.html }} />) : <p className="muted">Loading…</p>}
      <div className="reader-actions"><button className="btn primary" onClick={onResume}>Resume the video</button></div>
    </aside>
  );
};
