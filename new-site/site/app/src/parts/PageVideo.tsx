import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { scenesForPage, sceneTitleOf } from '../content/film';
import { LiveVideo } from '../player/LiveVideo';
import { Transcript } from './Transcript';

/** On a page: the scenes of the video that draw on it, and a player for just those scenes, on request. */
export const PageVideo: React.FC<{ file: string }> = ({ file }) => {
  const scenes = scenesForPage(file);
  const [playing, setPlaying] = useState(false);
  if (!scenes.length) return null;
  const list = scenes.map((s) => s.n);
  const end = (
    <>
      <p className="kicker">End of the scenes for this page</p>
      <h2>Keep reading, or follow the full story</h2>
      <div className="act-end-actions"><Link className="btn primary" to="/watch">Follow the story</Link></div>
    </>
  );
  return (
    <section className="page-video" aria-label="In the video">
      <div className="page-video-head">
        <span className="kicker">In the video</span>
        {!playing && <button className="btn primary" onClick={() => setPlaying(true)}>▶ Play {list.length === 1 ? 'this scene' : `these ${list.length} scenes`}</button>}
      </div>
      <ol className="page-video-scenes">
        {scenes.map((s) => <li key={s.n}><Link to={`/watch/scene-${s.n}`}><span className="scene-num">{s.n}</span>{s.title}</Link></li>)}
      </ol>
      {playing && (
        <LiveVideo start={{ scene: list[0] }} stopMode="scene" fallbackScenes={list}
          path={{ scenes: list, nextLabel: (n) => `Next: ${n}. ${sceneTitleOf(n)}`, end }} />
      )}
      {playing && <Transcript scenes={list} />}
    </section>
  );
};
