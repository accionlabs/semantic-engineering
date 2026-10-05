import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PAPER, SUMMARIES, SECTION_SCENES, sectionByN, sectionHref } from '../content/data';
import { Blocks } from '../parts/Blocks';
import { Player } from '../player/Player';
import { reducedMotion } from './Home';
import { Fallback } from '../player/Fallback';
import { media } from '../content/media';

const DRILLS = [[19, 'Onboarding'], [20, 'The interface'], [21, 'Business rules and invariants'], [22, 'The deep layers'], [23, 'The bill']] as const;

export const Sections: React.FC = () => (
  <div className="wrap wide">
    <div className="narrow">
      <p className="kicker" style={{ marginTop: 28 }}>The paper</p>
      <h1>{PAPER.title}</h1>
      <p className="lede muted">{PAPER.subtitle}</p>
      {/* The first two paragraphs of the paper's own summary state the thesis. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: (PAPER.summary.blocks[0] as { html: string }).html.split('</p>').slice(0, 2).join('</p>') + '</p>' }} />
      <p><Link to="/summary">Read the paper's full summary</Link></p>
    </div>
    <h2 id="sections">All sections of the paper</h2>
    <div className="cards">
      {PAPER.sections.map((s) => (
        <Link key={s.n} className="card" to={sectionHref(s.n)}>
          <img src={media(`thumbs/s${String(SECTION_SCENES[s.n]?.thumb ?? 1).padStart(2, '0')}.jpg`)} alt="" loading="lazy" />
          <div className="body"><h3><span className="num">{s.n}</span>{s.title}</h3><p>{SUMMARIES[String(s.n)]?.split('. ')[0]}.</p></div>
        </Link>
      ))}
    </div>
    <h2 id="drill-downs">Drill-down chapters</h2>
    <p className="muted">The brownfield path, layer by layer. These play after the main video, or on their own.</p>
    <div className="cards">
      {DRILLS.map(([n, t]) => (
        <Link key={n} className="card" to={`/watch/scene-${n}`}>
          <img src={media(`thumbs/s${n}.jpg`)} alt="" loading="lazy" />
          <div className="body"><h3>{t}</h3><p>Scene {n}, after the line moves.</p></div>
        </Link>
      ))}
    </div>
  </div>
);

export const Summary: React.FC = () => (
  <div className="wrap narrow"><p className="kicker" style={{ marginTop: 28 }}>The paper</p><h1>Summary</h1><Blocks blocks={PAPER.summary.blocks} /></div>
);

export const Glossary: React.FC = () => (
  <div className="wrap narrow">
    <h1>Glossary</h1>
    <p className="muted">The terms the paper uses, from its Appendix B.</p>
    <dl>
      {PAPER.glossary.map((g) => (
        <div key={g.slug} id={g.slug} style={{ marginBottom: 22 }}>
          <dt><strong>{g.term}</strong></dt>
          <dd style={{ margin: '4px 0 0' }}><span dangerouslySetInnerHTML={{ __html: g.html }} />
            {g.sections.length > 0 && <div className="muted" style={{ fontSize: '0.9rem' }}>Used in {g.sections.map((n, i) => <React.Fragment key={n}>{i ? ', ' : ''}<Link to={sectionHref(n)}>section {n}</Link></React.Fragment>)}</div>}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export const References: React.FC = () => {
  const groups = [{ key: 'summary', title: 'Summary' }, ...PAPER.sections.map((s) => ({ key: String(s.n), title: `${s.n}. ${s.title}` }))];
  return (
    <div className="wrap narrow">
      <h1>References</h1>
      <p className="muted">Every source the paper cites, by the section that cites it. {PAPER.citations.length} sources.</p>
      {groups.map((g) => {
        const list = PAPER.citations.filter((c) => c.sections[0] === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="sources">
            <h2 style={{ fontSize: '1.2rem' }}>{g.key === 'summary' ? g.title : <Link to={sectionHref(Number(g.key))}>{g.title}</Link>}</h2>
            <ol>{list.map((c) => <li key={c.url}><a href={c.url} target="_blank" rel="noopener">{c.title}</a>{c.sections.length > 1 && <span className="muted"> · also {c.sections.slice(1).map((n) => (n === 'summary' ? 'summary' : `section ${n}`)).join(', ')}</span>}</li>)}</ol>
          </section>
        );
      })}
    </div>
  );
};

export const About: React.FC = () => (
  <div className="wrap narrow prose">
    <h1>About this site</h1>
    <p>This site is the companion to the paper <em>{PAPER.title}</em>. It hosts an explainer video and a page for each section of the paper. The site is generated from the paper each time it is built, so it always shows the current text.</p>
    <p><strong>Status.</strong> The paper is a draft, September 2026. Its claims are bounded by its sources, and the section pages carry every citation.</p>
    <h2>How the video was made</h2>
    <p>The animation is drawn in code and animated with GSAP. The same scenes play live on this site, so you can pause and click the diagrams, and are rendered frame by frame in a browser to produce the downloadable video.</p>
    <p>The narration is AI-generated with a synthetic voice (MiniMax Speech-02 HD, through fal.ai), read from the approved script. Counts of tenants shown in the video are illustrative; every other figure comes from the paper, with its source.</p>
    <h2>Related</h2>
    <p>Semantic engineering governs change below the multi-tenancy line: <a href="https://semantic-engineering.ai" target="_blank" rel="noopener">semantic-engineering.ai</a>. Dialect engineering, the subject of this site, governs each customer's language above it.</p>
    {PAPER.appendixA && (<><h2>The earlier papers in this programme</h2><p className="muted">These are not published on this site.</p><Blocks blocks={PAPER.appendixA.blocks} /></>)}
    <p><a href={media('explainer-720p.mp4')} download>Download the video (720p, MP4)</a></p>
  </div>
);

export const DrillDown: React.FC = () => {
  const n = Number(useParams().n);
  const titles: Record<number, string> = { 19: 'Onboarding', 20: 'The interface', 21: 'Business rules and invariants', 22: 'The deep layers', 23: 'The bill' };
  if (!titles[n]) return <div className="wrap narrow"><h1>Chapter not found</h1></div>;
  return (
    <div className="wrap">
      <p className="kicker" style={{ marginTop: 28 }}>Drill-down · after the line moves</p>
      <h1>{titles[n]}</h1>
      {reducedMotion() ? <Fallback /> : <Player from={n} to={n} />}
      <p><Link to={sectionHref({ 19: 6, 20: 7, 21: 15, 22: 5, 23: 4 }[n]!)}>Read the section it draws on: {sectionByN({ 19: 6, 20: 7, 21: 15, 22: 5, 23: 4 }[n]!)?.title}</Link></p>
    </div>
  );
};
