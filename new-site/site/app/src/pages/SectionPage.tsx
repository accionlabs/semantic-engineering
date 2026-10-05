import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PAPER, SUMMARIES, SECTION_SCENES, sectionHref } from '../content/data';
import { Blocks } from '../parts/Blocks';
import { Player } from '../player/Player';
import { reducedMotion } from './Home';

export const SectionPage: React.FC = () => {
  const { slug } = useParams();
  const i = PAPER.sections.findIndex((s) => s.slug === slug || String(s.n) === slug);
  const s = PAPER.sections[i];
  if (!s) return <div className="wrap narrow"><h1>Section not found</h1><p><Link to="/sections">All sections</Link></p></div>;
  const prev = PAPER.sections[i - 1], next = PAPER.sections[i + 1];
  const scenes = SECTION_SCENES[s.n];
  const cites = PAPER.citations.filter((c) => c.sections.includes(String(s.n)));
  return (
    <div className="wrap">
      <p className="kicker" style={{ marginTop: 28 }}><Link to="/sections">Sections</Link> / {s.n}</p>
      <h1>{s.n}. {s.title}</h1>
      <div className="page-grid">
        <article>
          <div className="inshort" id="in-short"><span className="kicker">In short</span><p>{SUMMARIES[String(s.n)]}</p></div>
          {scenes && !reducedMotion() && (<div id="in-the-video"><span className="kicker">In the video · scene{scenes.from === scenes.to ? '' : 's'} {scenes.from}{scenes.from === scenes.to ? '' : `–${scenes.to}`}</span><Player from={scenes.from} to={scenes.to} /></div>)}
          <div id="the-argument"><Blocks blocks={s.blocks} /></div>
          {cites.length > 0 && (
            <section id="sources" className="sources">
              <h2>Sources</h2>
              <ol>{cites.map((c) => <li key={c.url}><a href={c.url} target="_blank" rel="noopener">{c.title}</a></li>)}</ol>
            </section>
          )}
          <nav className="pager" aria-label="Sections">
            {prev ? <Link to={sectionHref(prev.n)}>← {prev.n}. {prev.title}</Link> : <span />}
            {next ? <Link className="next" to={sectionHref(next.n)}>{next.n}. {next.title} →</Link> : <span />}
          </nav>
        </article>
        <aside className="toc" aria-label="On this page">
          <span className="kicker">On this page</span>
          <ol>
            <li><a href="#in-short">In short</a></li>
            {scenes && <li><a href="#in-the-video">In the video</a></li>}
            <li><a href="#the-argument">The argument</a></li>
            {s.subsections.map((ss) => <li key={ss.id}><a href={`#${ss.id}`}>{ss.number} {ss.title}</a></li>)}
            {cites.length > 0 && <li><a href="#sources">Sources</a></li>}
          </ol>
        </aside>
      </div>
    </div>
  );
};
