import React, { useEffect, useRef, useState } from 'react';
import { Player, type PlayerApi } from './Player';
import { Companion } from './Companion';
import { Reader } from './Reader';
import { useFullscreen } from './fullscreen';
import { postEmbed } from '../reel/embed';
import { resolveLoc, type Loc } from '../content/film';

export type WatchProps = {
  onPosition?: (scene: number | undefined, card: number | undefined) => void; tldr?: boolean;
  start?: { act?: number; scene?: number }; stopMode?: 'act' | 'scene'; endOverlay?: React.ReactNode;
  path?: React.ComponentProps<typeof Player>['path'];
  /** The embed view: the player alone; `part` names what plays, for the framing page's events. */
  embed?: { part: (scene: number | undefined, card: number | undefined) => string; acts: { act: number; title: string }[] };
};

/** The live player with the pages it draws on beside it, and the reader over both. */
const Watch: React.FC<WatchProps> = ({ tldr, start, stopMode, endOverlay, path, onPosition, embed }) => {
  const api = useRef<PlayerApi | null>(null);
  const [scene, setScene] = useState<number | undefined>(tldr ? 0 : undefined);
  const [card, setCard] = useState<number | undefined>();
  const [playing, setPlaying] = useState(false);
  const [actEnd, setActEnd] = useState<number | null>(null);
  // ?read=<file#anchor> opens the reader on a passage of the site.
  const [reading, setReadingState] = useState<Loc | null>(() => {
    const r = new URLSearchParams(location.search).get('read');
    return (r && resolveLoc(r)) || null;
  });
  const setReading = (l: Loc | null) => {
    setReadingState(l);
    const u = new URL(location.href);
    if (l) u.searchParams.set('read', l.page.file + (l.anchor ? `#${l.anchor}` : '')); else u.searchParams.delete('read');
    history.replaceState(history.state, '', u.toString());
  };
  const chapters = (window as unknown as { __chapters?: { n?: number; start: number }[] }).__chapters;
  // On phones the watch area is one screen; bring it into view when playback starts.
  const watch = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playing && matchMedia('(max-width: 700px)').matches) watch.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [playing]);
  // Full screen takes the video and the pages beside it together.
  const fullscreen = useFullscreen(watch);
  // The embed view tells the framing page what it holds, what starts playing, and when a part ends.
  const part = embed?.part(scene, card) ?? '';
  useEffect(() => { if (embed) postEmbed('ready', { kind: 'film', part, acts: embed.acts }); }, []); // eslint-disable-line
  useEffect(() => { if (embed && playing) postEmbed('play', { kind: 'film', part }); }, [playing, part]); // eslint-disable-line
  useEffect(() => { if (embed && actEnd) postEmbed('part_end', { kind: 'film', part: embed.part(undefined, actEnd) }); }, [actEnd]); // eslint-disable-line
  return (
    <div className={`watch${embed ? ' film-embed' : ''}`} ref={watch}>
      <Player deepLink tldr={tldr} start={start} stopMode={stopMode} endOverlay={endOverlay} path={path} onActEnd={setActEnd} api={api} fullscreen={fullscreen}
        onScene={(n, p, c) => { setScene(n ?? (tldr ? 0 : undefined)); setPlaying(p); setCard(c); onPosition?.(n, c); }} />
      {!embed && <Companion scene={scene} card={card} playing={playing} actEnd={actEnd}
        onRead={(l) => { api.current?.pause(); setReading(l); }}
        onJump={(n) => { const c = chapters?.find((x) => x.n === n); if (c) api.current?.seekTo(c.start + 0.01); }} />}
      {reading && <Reader loc={reading} onClose={() => setReading(null)} onResume={() => { setReading(null); api.current?.play(); }} />}
    </div>
  );
};
export default Watch;
