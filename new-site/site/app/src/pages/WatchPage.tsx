import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PAGES } from '../content/data';
import { ACT_NAMES, APPENDIX, actLabel, actOf, actPath, sceneInfo, scenesOf, SCENES } from '../content/film';
import { LiveVideo } from '../player/LiveVideo';
import { Paths, type Tab } from '../parts/Paths';
import { Transcript } from '../parts/Transcript';
import { roleBySlug, sceneTitle, situationBySlug, type Path } from '../content/paths';

/**
 * Every way through the video has its own address:
 *   /watch            the full video, one part at a time
 *   /watch/overview   the overview
 *   /watch/act-3      one act (1 to 6)
 *   /watch/appendix   the appendix
 *   /watch/scene-14   one scene
 *   /watch/role-cto   a role's path (Pick your role)
 *   /watch/use-legacy-modernization   a situation's path (Pick your situation)
 * Any of them takes ?t=<seconds> (a moment), &target=<id> (an element's panel) and ?read=<file#anchor> (the reader).
 */
// Keep the address on what is playing, without reloading the player.
const follow = (path: string) => { if (location.pathname !== path) history.replaceState(history.state, '', path + location.search); };

const NotFound = () => <div className="wrap narrow"><h1>Page not found</h1><p><Link to="/watch">All acts and scenes</Link></p></div>;

/** Opens one of the paths below the video, by its tab, and scrolls to it. */
const openTab = (tab: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  history.replaceState(null, '', `#${tab}`);
  dispatchEvent(new HashChangeEvent('hashchange'));
  document.getElementById('paths')?.scrollIntoView({ behavior: 'smooth' });
};

const OverviewEnd: React.FC = () => (
  <>
    <p className="kicker">The overview</p>
    <h2>Go deeper</h2>
    <p className="muted">Follow the full story, one part at a time, pick your role, or have it explained for your own situation.</p>
    <div className="act-end-actions">
      <Link className="btn primary" to="/watch">Follow the story</Link>
      <a className="btn" href="#roles" onClick={openTab('roles')}>Pick your role</a>
      <a className="btn" href="#explain" onClick={openTab('explain')}>Explain it for my situation</a>
    </div>
  </>
);

/** A role's or a situation's path: its scenes, one at a time, then a choice of what next. */
const PathWatch: React.FC<{ path: Path; kind: 'role' | 'situation' }> = ({ path, kind }) => {
  const [scene, setScene] = useState<number>(path.scenes[0]);
  const tab: Tab = kind === 'role' ? 'roles' : 'situations';
  const label = kind === 'role' ? 'Pick your role' : 'Pick your situation';
  useEffect(() => { document.title = `${path.name} · Semantic Engineering`; }, [path.name]);
  const end = (
    <>
      <p className="kicker">End of the path</p>
      <h2>{path.name}</h2>
      <p className="muted">Pick another path, or follow the full story.</p>
      <div className="act-end-actions">
        <Link className="btn primary" to={`/watch#${tab}`}>{label}</Link>
        <Link className="btn" to="/watch">Follow the story</Link>
      </div>
    </>
  );
  return (
    <div className="wrap wide watch-page">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to={`/watch#${tab}`}>{label}</Link> / {path.name}</p>
      <h1 className="path-title">{path.name}</h1>
      <p className="muted">{path.note} {path.scenes.length} scenes.</p>
      <LiveVideo key={path.slug} start={{ scene: path.scenes[0] }} stopMode="scene" fallbackScenes={path.scenes}
        onPosition={(sc) => { if (sc && path.scenes.includes(sc)) setScene(sc); }}
        path={{ scenes: path.scenes, nextLabel: (n) => `Next: ${n}. ${sceneTitle(n)}`, end }} />
      <Transcript scenes={path.scenes} />
      <Paths initial={tab} current={{ scene, [kind]: path.slug }} />
    </div>
  );
};

/** /watch and /watch/<slug>: a path, or the film by part or scene. */
export const WatchPage: React.FC = () => {
  const { slug = 'full' } = useParams();
  const role = slug.startsWith('role-') ? roleBySlug(slug.slice(5)) : undefined;
  const situation = slug.startsWith('use-') ? situationBySlug(slug.slice(4)) : undefined;
  if (role) return <PathWatch key={slug} path={role} kind="role" />;
  if (situation) return <PathWatch key={slug} path={situation} kind="situation" />;
  return <FilmWatch key={slug} slug={slug} />;
};

const FilmWatch: React.FC<{ slug: string }> = ({ slug }) => {
  const [pos, setPos] = useState<{ act?: number; scene?: number }>({});
  const m = slug === 'full' ? ['', 'full', '1'] : slug === 'appendix' ? ['', 'act', String(APPENDIX)] : slug.match(/^(act|scene)-(\d+)$/);
  const kind = (slug === 'overview' ? 'overview' : m?.[1]) as 'overview' | 'full' | 'act' | 'scene' | undefined;
  const n = Number(m?.[2]);
  // The tab's title follows what is playing: the part, or the scene in scene-by-scene viewing.
  const nowScene = kind === 'scene' ? pos.scene ?? n : undefined, nowAct = kind === 'act' ? pos.act ?? n : undefined;
  const title = kind === 'overview' ? 'The overview' : kind === 'full' ? 'The full video' : nowAct !== undefined ? `${actLabel(nowAct)}: ${ACT_NAMES[String(nowAct)]}` : `Scene ${nowScene}: ${sceneInfo(nowScene!)?.title}`;
  useEffect(() => { document.title = `${title} · Semantic Engineering`; }, [title]);
  if (kind === 'overview') {
    return (
      <div className="wrap wide watch-page">
        <p className="crumbs"><Link to="/">Home</Link> / The overview</p>
        <LiveVideo tldr endOverlay={<OverviewEnd />} fallbackScenes={[0]} />
        <Transcript scenes={[0]} />
        <Paths />
      </div>
    );
  }
  if (!kind || (kind === 'act' && (!ACT_NAMES[String(n)] || n === 0 || (slug.startsWith('act-') && n === APPENDIX))) || (kind === 'scene' && (!sceneInfo(n) || n === 0))) return <NotFound />;

  const stopMode = kind === 'scene' ? 'scene' : 'act';
  // Where the viewer is now: continuing to the next part or scene moves the address and the highlight with them.
  const act = pos.act ?? (kind === 'scene' ? actOf(n) : n);
  const scene = pos.scene ?? (kind === 'scene' ? n : undefined);
  const onPosition = (sc?: number, card?: number) => {
    if (stopMode === 'scene') { if (sc && sc !== scene) { setPos({ scene: sc, act: actOf(sc) }); follow(`/watch/scene-${sc}`); } return; }
    const a = card ?? actOf(sc);
    if (a && a !== act) { setPos({ act: a }); if (kind === 'act') follow(actPath(a)); }
  };
  const fallbackScenes = kind === 'scene' ? [n] : kind === 'act' ? scenesOf(n).map((s) => s.n) : undefined;
  return (
    <div className="wrap wide watch-page">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/watch">Follow the story</Link> / {title}</p>
      <LiveVideo key={slug} start={{ act: kind === 'act' ? n : undefined, scene: kind === 'scene' ? n : undefined }} stopMode={stopMode} onPosition={onPosition} fallbackScenes={fallbackScenes} />
      <Transcript scenes={fallbackScenes ?? SCENES.filter((x) => x.n > 0).map((x) => x.n)} />
      <Paths current={stopMode === 'scene' ? { scene } : { act }} />
    </div>
  );
};

/** The home page: the overview and the paths. Links to the old home page's sections (/#heading) go to the introduction. */
export const HomeWatch: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && PAGES.get('home')?.headings.some((h) => h.id === id)) navigate(`/introduction/#${id}`, { replace: true });
  }, []); // eslint-disable-line
  return <HomeBody />;
};
const HomeBody: React.FC = () => (
  <div className="wrap wide home-watch">
    <LiveVideo tldr endOverlay={<OverviewEnd />} fallbackScenes={[0]} />
    <p className="home-intro muted">Want it for your own situation? <a href="#explain" onClick={openTab('explain')}>Build a short explanation</a> from three choices. Prefer to read? <Link to="/introduction/">Start with the introduction</Link>, or use the sections in the menu.</p>
    <Transcript scenes={[0]} />
    <Paths />
  </div>
);
