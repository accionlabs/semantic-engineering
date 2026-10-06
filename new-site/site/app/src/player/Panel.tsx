import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { locName } from '../content/film';
import type { PanelContent } from './panels';
import { firstParagraph, usePage } from './section';

/** Opens over the paused video when an element is clicked: what the element stands for, on the site. */
export const Panel: React.FC<{ content: PanelContent; onClose: () => void; onResume: () => void }> = ({ content, onClose, onResume }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { ref.current?.focus(); }, [content.id]);
  const data = usePage(content.loc);
  const text = data ? firstParagraph(data, content.loc?.anchor) : '';
  // A link to this page at this moment, with this element's panel open.
  const link = `${location.origin}${location.pathname}?t=${Math.floor(content.time)}&target=${encodeURIComponent(content.id)}`;
  return (
    <aside className="panel" role="dialog" aria-modal="false" aria-labelledby="panel-title" tabIndex={-1} ref={ref}>
      <div className="panel-head">
        <span className="kicker accent">{content.loc ? content.loc.page.title : content.url ? 'Another site' : 'On the site'}</span>
        <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <h2 id="panel-title">{content.title}</h2>
      {content.figure && <div className="panel-figure"><p>{content.figure}</p></div>}
      {content.loc?.heading && <p className="kicker">{content.loc.heading}</p>}
      {text && <p>{text}</p>}
      <div className="panel-actions">
        {content.loc && <Link className="btn primary" to={content.loc.url}>Read {locName(content.loc)} →</Link>}
        {content.url && <a className="btn primary" href={content.url} target="_blank" rel="noopener">Visit {content.url.replace(/^https?:\/\//, '')} ↗</a>}
        <button className="btn" onClick={onResume}>Resume</button>
        <button className="linkish" onClick={() => navigator.clipboard?.writeText(link).then(() => setCopied(true)).catch(() => {})}>{copied ? 'Link copied' : 'Copy a link to this moment'}</button>
      </div>
    </aside>
  );
};
