import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PAGES, SITE, ancestors, cachedPage, loadPage, navTitle, pageByUrl, type Block, type PageData, type PageMeta } from '../content/data';
import { zoomDiagram } from '../parts/zoom';
import { PageVideo } from '../parts/PageVideo';
import { scenesForSection } from '../content/film';

const Faqs: React.FC<{ data: PageData }> = ({ data }) => (
  <div className="faq">
    {data.faqs.map((f) => (
      <details key={f.question}>
        <summary>{f.question}</summary>
        <div dangerouslySetInnerHTML={{ __html: f.html }} />
      </details>
    ))}
  </div>
);

/** Beside a heading: the scenes of the video that cite this section. */
const SceneLinks: React.FC<{ file: string; anchor: string }> = ({ file, anchor }) => {
  const scenes = scenesForSection(file, anchor);
  if (!scenes.length) return null;
  return (
    <p className="scene-links">
      <span className="kicker">In the video</span>
      {scenes.map((s) => <Link key={s.n} className="scene-chip" to={`/watch/scene-${s.n}`}>▶ {s.n}. {s.title}</Link>)}
    </p>
  );
};

const BlockView: React.FC<{ b: Block; data: PageData; pageKey: string; file: string }> = ({ b, data, pageKey, file }) => {
  if (b.k === 'h') return <><div className="block-h" dangerouslySetInnerHTML={{ __html: b.html }} />{file !== '_index.md' && <SceneLinks file={file} anchor={b.id} />}</>;
  if (b.k === 'faq') return <Faqs data={data} />;
  // Every block carries its address, so the reader, the graph and agents can point at it.
  return <div className={`block block-${b.k}`} data-addr={`${pageKey}#${b.sec} p${b.n}`} dangerouslySetInnerHTML={{ __html: b.html }} />;
};

const Toc: React.FC<{ page: PageMeta }> = ({ page }) => {
  const hs = page.headings.filter((h) => h.level <= 3);
  if (!hs.length && !page.hasFaq) return null;
  return (
    <aside className="toc" aria-label="On this page">
      <span className="kicker">On this page</span>
      <ul>{hs.map((h) => <li key={h.id} className={`l${h.level}`}><a href={`#${h.id}`}>{h.text}</a></li>)}</ul>
    </aside>
  );
};

/** Previous and next follow the sidebar's order, as on the Hugo site. */
const Pager: React.FC<{ page: PageMeta }> = ({ page }) => {
  const i = SITE.order.indexOf(page.key);
  const prev = PAGES.get(SITE.order[i - 1]), next = PAGES.get(SITE.order[i + 1]);
  return (
    <nav className="pager" aria-label="Pages">
      {prev ? <Link to={prev.url}><span className="kicker">Previous</span>{navTitle(prev)}</Link> : <span />}
      {next ? <Link className="next" to={next.url}><span className="kicker">Next</span>{navTitle(next)}</Link> : <span />}
    </nav>
  );
};

export const PageView: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const page = pageByUrl(pathname);
  const [data, setData] = useState<PageData | undefined>(() => (page ? cachedPage(page.key) : undefined));
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!page) return;
    const hit = cachedPage(page.key);
    if (hit) setData(hit); else { setData(undefined); loadPage(page.key).then(setData); }
    document.title = `${page.title} · Semantic Engineering`;
  }, [page?.key]); // eslint-disable-line
  useEffect(() => {
    if (data?.key === page?.key && hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [data, hash]);
  // In-content links to this site go through the router; diagrams zoom on click.
  const onClick = (e: React.MouseEvent) => {
    const fig = (e.target as Element).closest('figure.se-diagram');
    if (fig) { zoomDiagram(fig as HTMLElement); return; }
    const a = (e.target as Element).closest('a');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('/') && !/\.(svg|png|pdf|txt|xml)$/.test(href.split('#')[0])) { e.preventDefault(); navigate(href); }
  };
  if (!page) return <NotFound />;
  const crumbs = ancestors(page).filter((a) => a.key !== 'home'); // as on the Hugo site, the trail starts below Home
  return (
    <div className="page">
      <article className="article" onClick={onClick}>
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">{crumbs.map((c) => <React.Fragment key={c.key}><Link to={c.url}>{navTitle(c)}</Link><span aria-hidden="true">›</span></React.Fragment>)}<span>{navTitle(page)}</span></nav>
        )}
        {page.draft && <p className="draft-note">Draft for review. This page is not on the live site.</p>}
        <h1>{page.title}</h1>
        {page.key !== 'home' && <PageVideo file={page.file} />}
        <div className="prose" ref={body}>
          {data ? data.blocks.map((b, i) => <BlockView key={i} b={b} data={data} pageKey={page.key} file={page.file} />) : <p className="muted">Loading…</p>}
        </div>
        <Pager page={page} />
      </article>
      <Toc page={page} />
    </div>
  );
};

export const NotFound: React.FC = () => (
  <div className="page"><article className="article"><h1>Page not found</h1><p>The page you asked for is not on this site. <Link to="/">Go to the home page</Link>, or use the search above.</p></article></div>
);
