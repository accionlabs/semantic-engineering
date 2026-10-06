import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ACT_NAMES, APPENDIX, actLabel, actOf, actPath, sceneInfo, scenesOf } from '../content/film';
import { LiveVideo } from '../player/LiveVideo';
import { Story } from '../parts/Story';

/**
 * Every way through the video has its own address:
 *   /watch            the full video, one part at a time
 *   /watch/overview   the overview
 *   /watch/act-3      one act (1 to 6)
 *   /watch/appendix   the appendix
 *   /watch/scene-14   one scene
 * Any of them takes ?t=<seconds> (a moment), &target=<id> (an element's panel) and ?read=<file#anchor> (the reader).
 */
// Keep the address on what is playing, without reloading the player.
const follow = (path: string) => { if (location.pathname !== path) history.replaceState(history.state, '', path + location.search); };

const NotFound = () => <div className="wrap narrow"><h1>Page not found</h1><p><Link to="/watch">All acts and scenes</Link></p></div>;

const OverviewEnd: React.FC = () => (
  <>
    <p className="kicker">The overview</p>
    <h2>Go deeper</h2>
    <p className="muted">Follow the full story, one part at a time, or pick a scene.</p>
    <div className="act-end-actions"><Link className="btn primary" to="/watch">Follow the story</Link></div>
  </>
);

export const WatchPage: React.FC = () => {
  const { slug = 'full' } = useParams();
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
        <Story />
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
      <Story current={stopMode === 'scene' ? { scene } : { act }} />
    </div>
  );
};

/** The home page: the overview, then the home page's content. */
export const HomeWatch: React.FC = () => (
  <div className="wrap wide home-watch">
    <LiveVideo tldr endOverlay={<OverviewEnd />} fallbackScenes={[0]} />
  </div>
);
