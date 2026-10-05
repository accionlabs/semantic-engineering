// One page for both jobs. The renderer calls window.__seek(seconds) and captures the frame;
// ?preview adds a player bar for watching and scrubbing in the browser.
import './fonts';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fontsReady } from './fonts';
import { Film, FilmView, itemsFor } from './engine/film';
import { DEFS } from './scenes';
import { H, W } from './theme';

declare global { interface Window { __seek: (t: number) => void; __film: { duration: number; chapters: Film['chapters'] }; __ready: Promise<void>; } }

const params = new URLSearchParams(location.search);
const [from, to] = (params.get('scenes') ?? '1-23').split('-').map(Number);
const items = itemsFor(DEFS, from, to ?? from, !params.has('notitle'));
const preview = params.has('preview');
let resolveReady!: () => void;
window.__ready = new Promise((r) => (resolveReady = r));

const Player: React.FC<{ film: Film | null }> = ({ film }) => {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!film) return;
    const tick = () => setT(film.master.time());
    film.master.eventCallback('onUpdate', tick);
    film.master.eventCallback('onComplete', () => setPlaying(false));
  }, [film]);
  if (!film) return null;
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 16px', color: '#eef1f7', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <button onClick={() => { if (playing) film.master.pause(); else film.master.play(); setPlaying(!playing); }} style={{ font: 'inherit', padding: '6px 14px' }}>{playing ? 'Pause' : 'Play'}</button>
      <input type="range" min={0} max={film.duration} step={1 / 30} value={t} style={{ flex: 1 }}
        onChange={(e) => { film.master.pause(); setPlaying(false); film.master.seek(Number(e.target.value)); setT(Number(e.target.value)); }} />
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14 }}>{mmss(t)} / {mmss(film.duration)}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [film, setFilm] = useState<Film | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!preview) return;
    const fit = () => setScale(Math.min(innerWidth / W, (innerHeight - 56) / H));
    fit(); addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);
  const onReady = (f: Film) => {
    window.__seek = (s) => { f.master.seek(s); };
    window.__film = { duration: f.duration, chapters: f.chapters };
    const at = Number(params.get('t') ?? 0);
    f.master.seek(at);
    fontsReady().then(() => resolveReady());
    setFilm(f);
  };
  const stage = <FilmView items={items} onReady={onReady} />;
  if (!preview) return stage;
  return (
    <div style={{ background: '#05080f', minHeight: '100vh' }}>
      <div style={{ width: W * scale, height: H * scale, overflow: 'hidden' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>{stage}</div>
      </div>
      <Player film={film} />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
