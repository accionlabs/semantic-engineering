import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SCENES as SCENE_TEXT, ACT_NAMES } from '@film/engine/cues';
import { Watch, reducedMotion } from './Home';
import { Fallback } from '../player/Fallback';
import { Chapters } from '../parts/Chapters';
import { layerBySlug } from '../content/data';

/**
 * Every way through the video has its own address:
 *   /watch                 the full video, one act at a time
 *   /watch/overview        the overview (also /watch/short)
 *   /watch/act-2           one act
 *   /watch/scene-7         one scene
 *   /watch/layer-interface one layer, today and then after the line moves
 * Any of them takes ?t=<seconds> (a moment), &target=<id> (an element's panel) and ?read=<section>&at=<anchor> (the reader).
 */
const sceneInfo = (n: number) => SCENE_TEXT.find((s) => s.n === n && s.act > 0);
const actOf = (n?: number) => (n ? sceneInfo(n)?.act : undefined);

// Keep the address on what is playing, without reloading the player.
const follow = (path: string) => { if (location.pathname !== path) history.replaceState(history.state, '', path + location.search); };

const NotFound = () => <div className="wrap narrow"><h1>Page not found</h1><p><Link to="/#story">All acts and scenes</Link></p></div>;

export const WatchPage: React.FC = () => {
  const { slug = 'full' } = useParams();
  const [pos, setPos] = useState<{ act?: number; scene?: number }>({});

  if (slug === 'overview' || slug === 'short') {
    return (
      <div className="wrap wide">
        <p className="crumbs"><Link to="/">Home</Link> / The overview</p>
        {reducedMotion() ? <Fallback tldr /> : <Watch key={slug} tldr />}
        <Chapters />
      </div>
    );
  }

  const layer = slug.startsWith('layer-') ? layerBySlug(slug.slice(6)) : undefined;
  if (layer) {
    const end = (
      <>
        <p className="kicker">After the line moves</p>
        <h2>{layer.name}</h2>
        <p className="muted">The highlights list what this layer draws on in the paper.</p>
        <div className="act-end-actions">
          <Link className="btn primary" to="/#layers">Pick another layer</Link>
          <Link className="btn" to={`/watch/layer-${layer.slug}`} reloadDocument>Watch this layer again</Link>
        </div>
      </>
    );
    return (
      <div className="wrap wide">
        <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#layers">Pick a layer</Link> / {layer.name}</p>
        {reducedMotion() ? <Fallback /> : <Watch key={slug} start={{ scene: layer.before }} stopMode="scene"
          path={{ scenes: [layer.before, layer.after], nextLabel: () => `Next: ${layer.short} after the line moves`, end }} />}
        <Chapters current={{ layer: layer.slug }} />
      </div>
    );
  }

  const m = slug === 'full' ? ['', 'full', '1'] : slug.match(/^(act|scene)-(\d+)$/);
  const kind = m?.[1] as 'full' | 'act' | 'scene' | undefined, n = Number(m?.[2]);
  if (!kind || (kind !== 'scene' && !ACT_NAMES[String(n)]) || n === 0 || (kind === 'scene' && !sceneInfo(n))) return <NotFound />;

  const stopMode = kind === 'scene' ? 'scene' : 'act';
  // Where the viewer is now: continuing to the next act or scene moves the address and the highlight with them.
  const act = pos.act ?? (kind === 'scene' ? actOf(n) : n);
  const scene = pos.scene ?? (kind === 'scene' ? n : undefined);
  const onPosition = (sc?: number, card?: number) => {
    if (stopMode === 'scene') { if (sc && sc !== scene) { setPos({ scene: sc, act: actOf(sc) }); follow(`/watch/scene-${sc}`); } return; }
    const a = card ?? actOf(sc);
    if (a && a !== act) { setPos({ act: a }); if (kind === 'act') follow(`/watch/act-${a}`); }
  };
  const here = kind === 'full' ? 'The full video' : stopMode === 'scene' ? `Act ${act}, scene ${scene}: ${sceneInfo(scene!)?.title}` : `Act ${act}: ${ACT_NAMES[String(act)]}`;
  return (
    <div className="wrap wide">
      <p className="crumbs"><Link to="/">Home</Link> / <Link to="/#story">Follow the story</Link> / {here}</p>
      {reducedMotion() ? <Fallback /> : <Watch key={slug} start={{ act: kind === 'scene' ? undefined : n, scene: kind === 'scene' ? n : undefined }} stopMode={stopMode} onPosition={onPosition} />}
      <Chapters current={stopMode === 'scene' ? { scene } : { act }} />
    </div>
  );
};
