import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { sectionByN, sectionHref } from '../content/data';
import { Blocks } from '../parts/Blocks';

export const Panel: React.FC<{ content: import('./panels').PanelContent; onClose: () => void; onResume: () => void }> = ({ content, onClose, onResume }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { ref.current?.focus(); }, [content.id]);
  const s = sectionByN(content.section);
  // A link to this page at this moment, with this element's panel open.
  const link = `${location.origin}${location.pathname}?t=${Math.floor(content.time)}&target=${encodeURIComponent(content.id)}`;
  const diagram = content.diagram && s?.blocks.find((b) => b.type === 'diagram' && b.id === content.diagram);
  return (
    <aside className="panel" role="dialog" aria-modal="false" aria-labelledby="panel-title" tabIndex={-1} ref={ref}>
      <div className="panel-head">
        <span className="kicker accent">Paper section {content.section}</span>
        <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <h2 id="panel-title">{content.title}</h2>
      {content.figure && (
        <div className="panel-figure">
          <p>{content.figure.text}</p>
          {content.figure.url && <a href={content.figure.url} target="_blank" rel="noopener">{content.figure.source ?? 'Source'} ↗</a>}
        </div>
      )}
      {content.link && <p><a href={content.link.url} target="_blank" rel="noopener">{content.link.label} ↗</a></p>}
      {content.text && <p>{content.text}</p>}
      {diagram && <Blocks blocks={[diagram]} />}
      <div className="panel-actions">
        <Link className="btn primary" to={sectionHref(content.section)}>Read section {content.section}{s ? `: ${s.title}` : ''} →</Link>
        <button className="btn" onClick={onResume}>Resume</button>
        <button className="linkish" onClick={() => navigator.clipboard?.writeText(link).then(() => setCopied(true)).catch(() => {})}>{copied ? 'Link copied' : 'Copy a link to this moment'}</button>
      </div>
    </aside>
  );
};
