import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SUMMARIES, sectionByN, sectionHref } from '../content/data';
import { Blocks } from '../parts/Blocks';

/** A section of the paper, read beside the paused video. */
export const Reader: React.FC<{ n: number; anchor?: string; onClose: () => void; onResume: () => void }> = ({ n, anchor, onClose, onResume }) => {
  const ref = useRef<HTMLDivElement>(null);
  const s = sectionByN(n);
  useEffect(() => {
    ref.current?.focus();
    if (anchor) requestAnimationFrame(() => ref.current?.querySelector(`#${CSS.escape(anchor)}`)?.scrollIntoView({ block: 'start' }));
    else ref.current?.scrollTo(0, 0);
  }, [n, anchor]);
  if (!s) return null;
  return (
    <aside className="panel reader" role="dialog" aria-labelledby="reader-title" tabIndex={-1} ref={ref}>
      <div className="panel-head">
        <span className="kicker accent">Paper section {n} · video paused</span>
        <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <h2 id="reader-title">{n}. {s.title}</h2>
      <div className="reader-actions">
        <button className="btn primary" onClick={onResume}>Resume the video</button>
        <Link className="btn" to={sectionHref(n)}>Open as a page</Link>
      </div>
      <div className="inshort"><span className="kicker">In short</span><p>{SUMMARIES[String(n)]}</p></div>
      <Blocks blocks={s.blocks} />
      <div className="reader-actions"><button className="btn primary" onClick={onResume}>Resume the video</button></div>
    </aside>
  );
};
