import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FilmView, type Film } from '@film/engine/film';
import { fontsReady } from '@film/fonts';
import { C, F } from '@film/theme';
import { MAIN } from '../player/Player';
import { quoteFor, speakingTime, type Plan, type Segment } from './language';
import { speak, speechAvailable, voices, pickVoice, chooseVoice } from './speech';
import '../player/player.css';
import { media } from '../content/media';

// Plays a compiled explanation: the guide's lines in the browser's voice, the expert's clips of the film
// with the recorded narration, and quotes from the site's pages where a concept has no moment in the film.
const W = 1920, H = 1080;
export type ReelApi = { goto: (i: number) => void; play: () => void; pause: () => void };

const seekAudio = (a: HTMLAudioElement, t: number) => {
  if (a.readyState >= 1) { a.currentTime = t; return; }
  a.addEventListener('loadedmetadata', () => { a.currentTime = t; }, { once: true });
  a.load();
};
/** Seconds of fade on the narration at each cut. */
const FADE = 0.12;
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

const HostCard: React.FC<{ seg: Segment & { kind: 'host' }; question: string }> = ({ seg, question }) => (
  <div key={seg.line} className="reel-card" style={{ background: C.canvas }}>
    <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.warn, textTransform: 'uppercase' }}>{seg.role === 'intro' ? 'Your question' : seg.role === 'close' ? 'The answer' : 'Your guide'}</div>
    {seg.role === 'intro' && <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 68, lineHeight: 1.12, marginTop: 26, maxWidth: 1500 }}>{question}</div>}
    {seg.text && <div style={{ fontFamily: seg.role === 'intro' ? F.sans : F.display, fontWeight: seg.role === 'intro' ? 400 : 600, fontSize: seg.role === 'intro' ? 40 : 58, lineHeight: 1.3, marginTop: seg.role === 'intro' ? 36 : 28, maxWidth: 1500, color: seg.role === 'intro' ? C.muted : C.text }}>{seg.text}</div>}
    <div style={{ position: 'absolute', left: 96, bottom: 70, fontFamily: F.mono, fontSize: 20, color: C.muted, letterSpacing: 1 }}>GUIDE · WRITTEN BY AN AGENT · BROWSER VOICE</div>
  </div>
);

const QuoteCard: React.FC<{ seg: Segment & { kind: 'quote' } }> = ({ seg }) => {
  const q = quoteFor(seg.quotes[0]);
  if (!q) return null;
  return (
    <div key={seg.line} className="reel-card" style={{ background: C.canvas }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.layer.architecture, textTransform: 'uppercase' }}>From the site · {q.page}</div>
      {q.section && <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: 46, marginTop: 22 }}>{q.section}</div>}
      <div style={{ fontFamily: F.sans, fontSize: 36, lineHeight: 1.45, marginTop: 26, maxWidth: 1500, color: C.text }}>{q.text.split(/(?<=\.)\s/).slice(0, 3).join(' ')}</div>
    </div>
  );
};

/** Plays one section of an explanation. Given a new section (a deep dive the person chose), it stops, and
 *  starts the new one at once when autoPlay is set, without loading the film again. */
export const ReelPlayer: React.FC<{ plan: Plan; api?: React.MutableRefObject<ReelApi | null>; onIndex?: (i: number, playing: boolean) => void; endOverlay?: React.ReactNode; autoPlay?: boolean }> = ({ plan, api, onIndex, endOverlay, autoPlay }) => {
  const [film, setFilm] = useState<Film | null>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(true);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const run = useRef(0);          // bumps on every start or stop, so stale callbacks do nothing
  const stopSpeech = useRef<() => void>(() => {});
  const raf = useRef(0);
  const timer = useRef(0);
  const resumeAt = useRef<number | null>(null);
  const segs = plan.segments;
  const total = plan.seconds;
  const ended = index >= segs.length;

  useEffect(() => { const el = box.current; if (!el) return; const ro = new ResizeObserver(() => setScale(el.clientWidth / W)); ro.observe(el); return () => ro.disconnect(); }, []);
  useEffect(() => { if (!speechAvailable()) return; const load = () => setVoiceList(voices()); load(); speechSynthesis.addEventListener('voiceschanged', load); return () => speechSynthesis.removeEventListener('voiceschanged', load); }, []);
  const onReady = useCallback((f: Film) => { setFilm(f); fontsReady().then(() => setReady(true)); }, []);
  useEffect(() => { onIndex?.(index, playing); }, [index, playing]); // eslint-disable-line

  const startOf = (scene: number) => film?.chapters.find((c) => c.n === scene)?.start ?? 0;

  const halt = useCallback(() => {
    run.current++;
    stopSpeech.current(); stopSpeech.current = () => {};
    cancelAnimationFrame(raf.current); clearTimeout(timer.current);
    audio.current?.pause();
  }, []);

  const start = useCallback((i: number, from?: number) => {
    if (!film) return;
    halt();
    const token = run.current;
    const alive = () => run.current === token;
    setIndex(i); resumeAt.current = null;
    if (i >= segs.length) { setPlaying(false); return; }
    setPlaying(true);
    const seg = segs[i];
    const next = () => { if (alive()) start(i + 1); };

    // The guide speaks; where speech is off or missing, the line stays up for its reading time.
    const say = (text: string, then: () => void, atLeast = 0) => {
      let spoke = false, waited = atLeast <= 0;
      const done = () => { if (spoke && waited && alive()) then(); };
      if (atLeast > 0) timer.current = window.setTimeout(() => { waited = true; done(); }, atLeast * 1000);
      if (sound && speechAvailable() && text) {
        const guard = window.setTimeout(() => { spoke = true; done(); }, (speakingTime(text) * 2.5 + 4) * 1000);
        stopSpeech.current = speak(text, () => { clearTimeout(guard); window.setTimeout(() => { spoke = true; done(); }, 350); });
      } else window.setTimeout(() => { spoke = true; done(); }, speakingTime(text || ' ') * 1000);
    };

    if (seg.kind === 'host') { say(seg.role === 'intro' ? `${plan.question} ${seg.text}` : seg.text, next); return; }
    if (seg.kind === 'quote') { timer.current = window.setTimeout(next, seg.seconds * 1000); return; }
    // An expert clip: the narration's clock drives the picture, as in the main player.
    const a = audio.current;
    const begin = startOf(seg.scene) + (from ?? seg.from), end = startOf(seg.scene) + seg.to;
    film.master.seek(begin);
    let clock = { wall: performance.now(), t: begin }, loadStart = performance.now(), bad = false;
    if (a) { a.muted = !sound; a.volume = 0; seekAudio(a, begin); a.play().catch(() => { bad = true; }); }
    const tick = () => {
      if (!alive()) return;
      let now = clock.t + (performance.now() - clock.wall) / 1000;
      if (a && !bad) {
        const settling = a.seeking || a.readyState < 3 || a.paused;
        if (settling && performance.now() - loadStart < 5000) { clock = { wall: performance.now(), t: clock.t }; now = clock.t; }
        else if (!settling) {
          if (Math.abs(a.currentTime - now) > 1.5) { seekAudio(a, now); loadStart = performance.now(); }
          else { now = a.currentTime; clock = { wall: performance.now(), t: now }; }
        }
      }
      if (now >= end) { a?.pause(); if (a) a.volume = 1; next(); return; }
      // Fade in after the cut at the start, and out before the cut at the end.
      if (a) a.volume = Math.max(0, Math.min(1, (now - begin) / FADE, (end - now) / FADE));
      film.master.seek(now);
      resumeAt.current = now - startOf(seg.scene);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [film, segs, halt, sound, plan.question]); // eslint-disable-line

  const pause = useCallback(() => { halt(); setPlaying(false); }, [halt]);
  const play = useCallback(() => {
    if (index < 0 || ended) return start(0);
    const seg = segs[index];
    start(index, seg?.kind === 'clip' && resumeAt.current !== null ? resumeAt.current : undefined);
  }, [index, ended, segs, start]);
  if (api) api.current = { goto: (i) => start(Math.max(0, Math.min(segs.length - 1, i))), play, pause };
  const firstPlan = useRef(true);
  useEffect(() => {
    if (firstPlan.current) { firstPlan.current = false; return; }
    halt(); resumeAt.current = null; setIndex(-1); setPlaying(false);
    if (autoPlay && film && ready) start(0);
  }, [plan]); // eslint-disable-line
  useEffect(() => () => halt(), [halt]);
  useEffect(() => { if (audio.current) audio.current.muted = !sound; if (!sound) stopSpeech.current(); }, [sound]);

  // A frame to show before the first play: the first expert clip.
  useEffect(() => {
    if (!film || !ready) return;
    const first = segs.find((s) => s.kind === 'clip');
    if (first?.kind === 'clip') film.master.seek(startOf(first.scene) + first.from + 1.5);
  }, [film, ready]); // eslint-disable-line

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === ' ' && document.activeElement === document.body) { e.preventDefault(); playing ? pause() : play(); } };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [playing, play, pause]);

  const seg = index >= 0 && index < segs.length ? segs[index] : undefined;
  const elapsed = segs.slice(0, Math.max(0, index)).reduce((a, s) => a + s.seconds, 0);
  const guideOnScreen = seg?.kind === 'host' || seg?.kind === 'quote';
  return (
    <section className="player reel-player" aria-label="Your explanation">
      <div ref={box} className="player-stage" style={{ height: H * scale }} onClick={(e) => { if ((e.target as Element).closest('button, a')) return; playing ? pause() : play(); }}>
        <div ref={stage} className={`stage ${guideOnScreen ? 'no-captions' : ''}`} style={{ transform: `scale(${scale})` }} aria-hidden>
          <FilmView items={MAIN} onReady={onReady} />
          {seg?.kind === 'host' && <HostCard seg={seg} question={plan.question} />}
          {seg?.kind === 'quote' && <QuoteCard seg={seg} />}
          {seg?.kind === 'clip' && <div className="reel-voice">EXPERT · RECORDED NARRATION</div>}
        </div>
        {!ready && <div className="player-loading">Loading the film</div>}
        {ready && index < 0 && <button className="big-play" onClick={(e) => { e.stopPropagation(); play(); }} aria-label="Play your explanation">▶<span>Play · {mmss(total)}</span></button>}
        {ended && <div className="act-end" onClick={(e) => e.stopPropagation()}>{endOverlay}<div className="act-end-actions" style={{ marginTop: 14 }}><button className="btn" onClick={() => start(0)}>Play again</button></div></div>}
      </div>
      <div className="controls">
        <button className="ctl" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'} disabled={!ready}>{playing ? '❚❚' : '▶'}</button>
        <button className="ctl" onClick={() => start(Math.max(0, index - 1))} disabled={!ready || index <= 0} aria-label="Previous part">⏮</button>
        <button className="ctl" onClick={() => start(Math.min(segs.length, index + 1))} disabled={!ready || ended} aria-label="Next part">⏭</button>
        <div className="reel-progress" aria-label="Parts of the explanation">
          {segs.map((s, i) => <button key={i} className={`reel-tick k-${s.kind} ${i === index ? 'on' : ''} ${i < index ? 'done' : ''}`} style={{ flexGrow: Math.max(1, s.seconds) }} onClick={() => start(i)} aria-label={`Part ${i + 1}`} />)}
        </div>
        <span className="time">{mmss(Math.min(total, elapsed))} / {mmss(total)}</span>
        <button className={`ctl ${sound ? 'on' : ''}`} aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? 'Sound' : 'Muted'}</button>
        {voiceList.length > 1 && (
          <select className="ctl" aria-label="Guide's voice" defaultValue={pickVoice()?.name} onChange={(e) => chooseVoice(e.target.value)}>
            {voiceList.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/\s*\(.*\)$/, '')}</option>)}
          </select>
        )}
      </div>
      <audio ref={audio} src={media('narration.m4a')} preload="auto" />
    </section>
  );
};
