import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Player, type PlayerApi } from '../player/Player';
import { Companion } from '../player/Companion';
import { Reader } from '../player/Reader';
import { Fallback } from '../player/Fallback';
import { Chapters } from '../parts/Chapters';

export const reducedMotion = () => typeof matchMedia !== 'undefined' && (matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('mp4'));

type WatchProps = { onPosition?: (scene: number | undefined, card: number | undefined) => void; tldr?: boolean; start?: { act?: number; scene?: number }; stopMode?: 'act' | 'scene'; howTo?: boolean; endOverlay?: React.ReactNode; path?: React.ComponentProps<typeof Player>['path'] };

/** The live player with the highlights beside it, and the paper reader over both. */
export const Watch: React.FC<WatchProps> = ({ tldr, start, stopMode, howTo, endOverlay, path, onPosition }) => {
  const api = useRef<PlayerApi | null>(null);
  const [scene, setScene] = useState<number | undefined>();
  const [card, setCard] = useState<number | undefined>();
  const [playing, setPlaying] = useState(false);
  const [actEnd, setActEnd] = useState<number | null>(null);
  // ?read=6 (and &at=s6-2) opens the reader on a section of the paper.
  const [reading, setReadingState] = useState<{ n: number; anchor?: string } | null>(() => {
    const q = new URLSearchParams(location.search), n = Number(q.get('read'));
    return n > 0 ? { n, anchor: q.get('at') ?? undefined } : null;
  });
  const setReading = (r: { n: number; anchor?: string } | null) => {
    setReadingState(r);
    const u = new URL(location.href);
    if (r) { u.searchParams.set('read', String(r.n)); if (r.anchor) u.searchParams.set('at', r.anchor); else u.searchParams.delete('at'); }
    else { u.searchParams.delete('read'); u.searchParams.delete('at'); }
    history.replaceState(history.state, '', u.toString());
  };
  const chapters = (window as unknown as { __chapters?: { n?: number; start: number }[] }).__chapters;
  // The instructions show only until the video first plays.
  const [played, setPlayed] = useState(false);
  // On phones the watch area is one screen; bring it into view when playback starts.
  const watch = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playing && matchMedia('(max-width: 700px)').matches) watch.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [playing]);
  return (
    <>
    {howTo && !played && !playing && <HowTo />}
    <div className="watch" ref={watch}>
      <Player deepLink tldr={tldr} start={start} stopMode={stopMode} endOverlay={endOverlay} path={path} onActEnd={setActEnd} api={api}
        onScene={(n, p, c) => { setScene(n); setPlaying(p); setCard(c); if (p) setPlayed(true); onPosition?.(n, c); }} />
      <Companion scene={scene} card={card} playing={playing} actEnd={actEnd}
        onRead={(n, anchor) => { api.current?.pause(); setReading({ n, anchor }); }}
        onJump={(n) => { const c = chapters?.find((x) => x.n === n); if (c) api.current?.seekTo(c.start + 0.01); }} />
      {reading && <Reader n={reading.n} anchor={reading.anchor} onClose={() => setReading(null)} onResume={() => { setReading(null); api.current?.play(); }} />}
    </div>
    </>
  );
};

const HowTo: React.FC = () => (
  <details className="howto" open={typeof matchMedia === 'undefined' || !matchMedia('(max-width: 700px)').matches}>
    <summary className="kicker">How to use this site</summary>
    <ol>
      <li><strong>Play the overview.</strong> It covers the whole argument in under two minutes.</li>
      <li><strong>Go deeper.</strong> Below the video, follow the story act by act, or pick a layer to see it before and after. Each part pauses at its end with the sections of the paper it drew on.</li>
      <li><strong>Follow the highlights.</strong> Beside the video, or below it on a phone, the highlights show the sections the current scene draws on. Select one to pause and read it.</li>
      <li><strong>Explore a frame.</strong> Pause, then select Explore to outline what you can click in the picture. <Link to="/sections">Sections</Link> lists every part of the paper.</li>
    </ol>
  </details>
);

const TldrEnd: React.FC = () => (
  <>
    <p className="kicker">The overview</p>
    <h2>Go deeper</h2>
    <p className="muted">Follow the full story act by act, or pick a layer and see it before and after.</p>
    <div className="act-end-actions">
      <Link className="btn primary" to="/watch">Follow the story</Link>
      <a className="btn" href="#layers" onClick={(e) => { e.preventDefault(); history.replaceState(null, '', '#layers'); dispatchEvent(new HashChangeEvent('hashchange')); }}>Pick a layer</a>
    </div>
  </>
);

export const Home: React.FC = () => (
  <div className="wrap wide">
    {reducedMotion() ? <Fallback tldr /> : <Watch tldr howTo endOverlay={<TldrEnd />} />}
    <Chapters />
  </div>
);
