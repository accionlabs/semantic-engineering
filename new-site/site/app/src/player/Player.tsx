import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilmView, itemsFor, type Film } from '@film/engine/film';
import { DEFS } from '@film/scenes';
import { fontsReady } from '@film/fonts';
import { panelFor, labelFor, type PanelContent } from './panels';
import { Panel } from './Panel';
import { ACT_NAMES, actLabel, locName, sceneInfo, sceneSources, SCENES as SCENE_TEXT } from '../content/film';
import './player.css';
import { media } from '../content/media';

const W = 1920, H = 1080;
// The full film is scenes 1 to 30 with the title and act cards; the overview (scene 0) plays on its own.
export const MAIN = itemsFor(DEFS, 1, 30);
const TLDR = itemsFor(DEFS, 0, 0, false);
export const TLDR_SCENE = 0;
type Target = { id: string; label: string; rect: { x: number; y: number; w: number; h: number }; el: Element; area: number };
/** Sets the audio position once the browser knows the file's length; before that, some browsers drop the seek. */
const seekAudio = (a: HTMLAudioElement, t: number) => {
  if (a.readyState >= 1) { a.currentTime = t; return; }
  a.addEventListener('loadedmetadata', () => { a.currentTime = t; }, { once: true });
  a.load();
};
const duration = (s: number) => (s < 90 ? `${Math.round(s)} s` : s < 600 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : `${Math.round(s / 60)} min`);
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

const visible = (el: Element, root: Element) => {
  let op = 1;
  for (let e: Element | null = el; e && e !== root.parentElement; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    op *= Number(cs.opacity || 1);
    if (op < 0.3) return false;
  }
  return true;
};

/**
 * The explainer, playing live from the same scenes and timeline that render the MP4.
 * `from`/`to` limit it to a stretch of scenes (for section pages).
 */
export type PlayerApi = { pause: () => void; play: () => void; seekTo: (t: number) => void; playing: boolean };

type PlayerProps = {
  from?: number; to?: number; deepLink?: boolean;
  onScene?: (n: number | undefined, playing: boolean, card?: number) => void;
  api?: React.MutableRefObject<PlayerApi | null>;
  /** Pause at the end of each act, or of each scene. */
  stopMode?: 'act' | 'scene'; actByAct?: boolean;
  onActEnd?: (act: number | null) => void;
  /** The overview in place of the full film. */
  tldr?: boolean;
  /** Where playback starts: an act's title card or a scene. */
  start?: { act?: number; scene?: number };
  /** Shown over the stage once playback reaches the end. */
  endOverlay?: React.ReactNode;
  /** A custom path through the film: scenes played in this order, one at a time. */
  path?: { scenes: number[]; nextLabel: (n: number) => string; end: React.ReactNode };
};

export const Player: React.FC<PlayerProps> = ({ from, to, deepLink, onScene, api, stopMode: mode, actByAct, onActEnd, tldr, start: startAt, endOverlay, path }) => {
  const stopMode = mode ?? (actByAct ? 'act' : undefined);
  const ITEMS = tldr ? TLDR : MAIN;
  const [film, setFilm] = useState<Film | null>(null);
  const [ready, setReady] = useState(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [sound, setSound] = useState(true);
  const [explore, setExplore] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [panel, setPanel] = useState<PanelContent | null>(null);
  const [scale, setScale] = useState(0.5);
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const raf = useRef(0);
  const clock = useRef({ wall: 0, t: 0 });
  const started = useRef(false);
  const audioBad = useRef(false);
  const resyncs = useRef(0);
  const playWall = useRef(0);
  const [actEnd, setActEnd] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [sceneEnd, setSceneEnd] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  useEffect(() => { onActEnd?.(actEnd); }, [actEnd]); // eslint-disable-line

  const range = useMemo(() => {
    if (!film) return { start: 0, end: 0 };
    const chs = film.chapters.filter((c) => c.n !== undefined);
    const a = from ? chs.find((c) => c.n === from) : undefined, b = to ? chs.find((c) => c.n === to) : undefined;
    return { start: a ? a.start : 0, end: b ? b.start + b.duration : film.duration };
  }, [film, from, to]);

  // Where the first play starts: the chosen act's title card or scene, else the start of the range.
  const origin = useMemo(() => {
    if (!film) return 0;
    const c = startAt?.scene ? film.chapters.find((x) => x.n === startAt.scene) : startAt?.act ? film.chapters.find((x) => x.key === `card-${startAt.act}`) : undefined;
    return c ? c.start + 0.01 : range.start;
  }, [film, startAt?.act, startAt?.scene, range.start]);

  // How long the first play will run: the path, the scene, the act, or the rest of the film.
  const planLength = useMemo(() => {
    if (!film) return 0;
    const len = (n: number) => film.chapters.find((c) => c.n === n)?.duration ?? 0;
    if (path) return path.scenes.reduce((a, n) => a + len(n), 0);
    if (stopMode === 'scene' && startAt?.scene) return len(startAt.scene);
    if (stopMode === 'act' && startAt?.act) {
      const next = film.chapters.find((c) => c.key === `card-${startAt.act! + 1}`);
      return (next ? next.start : range.end) - origin;
    }
    return range.end - origin;
  }, [film, path, stopMode, startAt?.scene, startAt?.act, range.end, origin]);

  // Fit the 1920 x 1080 stage to the container width.
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el); return () => ro.disconnect();
  }, []);

  const onReady = useCallback((f: Film) => { setFilm(f); (window as unknown as { __chapters: unknown }).__chapters = f.chapters; fontsReady().then(() => setReady(true)); }, []);

  const sceneAt = (time: number) => film?.chapters.filter((c) => c.n !== undefined && c.start <= time + 0.01).pop()?.n ?? (tldr ? 0 : undefined);

  const collect = useCallback(() => {
    const root = stage.current; if (!root) return;
    const sb = root.getBoundingClientRect(), s = sb.width / W;
    const best = new Map<string, Target>();
    root.querySelectorAll('[data-target]').forEach((el) => {
      if (!visible(el, root)) return;
      let r = el.getBoundingClientRect();
      if (r.width * r.height > sb.width * sb.height * 0.4) {
        const inner = el.querySelector(':scope > div'); // callouts: the card, not the full-frame wrapper
        if (!inner) return; r = inner.getBoundingClientRect();
      }
      if (r.width < 6 * s || r.height < 6 * s || r.right < sb.left || r.left > sb.right) return;
      const id = el.getAttribute('data-target')!;
      const area = r.width * r.height, prev = best.get(id);
      if (!prev || area > prev.area) best.set(id, { id, label: labelFor(id, el), el, area, rect: { x: r.left - sb.left, y: r.top - sb.top, w: r.width, h: r.height } });
    });
    setTargets([...best.values()].sort((a, b) => b.area - a.area));
  }, []);

  const seek = useCallback((time: number) => {
    if (!film) return;
    const c = Math.max(range.start, Math.min(range.end - 0.05, time));
    film.master.seek(c); setT(c); setActEnd(null); setSceneEnd(null); setEnded(false);
    if (audio.current) seekAudio(audio.current, c);
  }, [film, range]);

  const pause = useCallback(() => {
    cancelAnimationFrame(raf.current); setPlaying(false);
    audio.current?.pause();
    requestAnimationFrame(collect);
  }, [collect]);

  const play = useCallback((at?: unknown) => {
    if (!film) return;
    setPanel(null); setTargets([]); setActEnd(null); setSceneEnd(null); setEnded(false);
    const a = audio.current;
    // Before the first play the stage shows a preview frame; playing starts from the beginning.
    // An explicit time (Next, Replay) wins; before the first play, the chosen start; at the end, the beginning.
    const start = typeof at === 'number' ? at : !started.current ? origin : t >= range.end - 0.1 ? range.start : t;
    started.current = true;
    if (a) { a.muted = !sound; seekAudio(a, start); a.play().catch(() => { audioBad.current = true; }); }
    clock.current = { wall: performance.now(), t: start };
    audioBad.current = false; resyncs.current = 0; playWall.current = performance.now();
    // Act by act: stop at the next act boundary after where playback starts.
    // An act ends where the next act's title card begins, so Act 1's own card is not a boundary.
    // By scene: stop where the next chapter, scene or title card, begins.
    const bounds = film.chapters.filter((c) => (stopMode === 'scene' ? c.key !== 'title' : c.key.startsWith('card-')) && c.key !== 'card-1').map((c) => c.start).concat(range.end);
    const stopAt = stopMode ? Math.min(range.end, bounds.find((b) => b > start + 0.25) ?? range.end) : range.end;
    setPlaying(true);
    const tick = () => {
      // The narration's clock drives the picture. If the audio is not running, or could not seek to
      // where the picture is, a wall clock keeps the picture's own time and the audio is stopped.
      let now = clock.current.t + (performance.now() - clock.current.wall) / 1000;
      if (a && !audioBad.current) {
        const settling = a.seeking || a.readyState < 3 || a.paused;
        if (settling && performance.now() - playWall.current < 5000) {
          // The audio is still loading or seeking: hold the picture so the two start together.
          clock.current = { wall: performance.now(), t: clock.current.t };
          now = clock.current.t;
        } else if (!settling) {
          if (Math.abs(a.currentTime - now) > 1.5) {
            // Out of step: seek the audio to the picture, a few times, before playing on without sound.
            if (resyncs.current < 3) { resyncs.current += 1; seekAudio(a, now); playWall.current = performance.now(); }
            else { audioBad.current = true; a.pause(); }
          } else { now = a.currentTime; clock.current = { wall: performance.now(), t: now }; }
        }
      }
      if (now >= stopAt) {
        film.master.seek(stopAt - 0.1); setT(stopAt - 0.1); pause();
        if (stopAt >= range.end - 0.01) setEnded(true);
        if (stopMode === 'scene') {
          const sc = film.chapters.filter((c) => c.n !== undefined && c.start < stopAt - 0.1).pop();
          if (sc?.n) setSceneEnd(sc.n);
        } else if (stopMode === 'act' && stopAt < range.end) {
          const act = [...film.chapters].reverse().find((c) => c.key.startsWith('card-') && c.start < stopAt - 0.1);
          setActEnd(act ? Number(act.key.slice(5)) : 1);
        }
        return;
      }
      film.master.seek(now); setT(now);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [film, t, range, sound, pause, stopMode, origin]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const sceneNow = film?.chapters.filter((c) => c.n !== undefined && c.start <= t + 0.01).pop()?.n;
  const lastCh = film?.chapters.filter((c) => c.key !== 'title' && c.start <= t + 0.01).pop();
  const cardNow = lastCh?.key.startsWith('card-') ? Number(lastCh.key.slice(5)) : undefined;
  useEffect(() => { onScene?.(sceneNow, playing, cardNow); }, [sceneNow, playing, cardNow]); // eslint-disable-line
  if (api) api.current = { pause, play, seekTo: (x: number) => { started.current = true; seek(x); requestAnimationFrame(collect); }, playing };
  useEffect(() => { if (audio.current) audio.current.muted = !sound; }, [sound]);
  useEffect(() => {
    if (!film || !ready) return;
    const len = range.end - range.start;
    seek(from ? range.start + len * 0.55 : origin + 1.4); // a preview frame until the first play
    started.current = false;
  }, [film, ready, range.start, origin]); // eslint-disable-line

  // Deep links: ?t=seconds&target=id
  useEffect(() => {
    if (!deepLink || !film || !ready) return;
    const p = new URLSearchParams(location.search);
    const at = Number(p.get('t'));
    if (at > 0) {
      started.current = true;
      seek(at);
      requestAnimationFrame(() => {
        collect();
        const id = p.get('target');
        const el = id && stage.current?.querySelector(`[data-target="${CSS.escape(id)}"]`);
        if (el && id) setPanel(panelFor(id, el, sceneAt(at) ?? 0, at));
      });
    }
  }, [film, ready]); // eslint-disable-line

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panel) { setPanel(null); return; }
      const inside = box.current?.contains(document.activeElement) || document.activeElement === document.body;
      if (e.key === ' ' && inside && !(document.activeElement instanceof HTMLInputElement && document.activeElement.type !== 'range')) { e.preventDefault(); playing ? pause() : play(); }
    };
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey);
  }, [panel, playing, play, pause]);

  useEffect(() => { if (explore && !playing) collect(); }, [explore, playing, collect]);

  const open = (tg: Target) => { pause(); setPanel(panelFor(tg.id, tg.el, sceneAt(t) ?? 0, t)); };
  const showTargets = !playing && ready;
  const chapters = film?.chapters ?? [];
  const span = Math.max(0.001, range.end - range.start);
  const scene = sceneAt(t);

  return (
    <section className="player" aria-label="Explainer video">
      <div ref={box} className="player-stage" style={{ height: H * scale }}
        onClick={(e) => { if (playing && (e.target as Element).closest('.player-stage')) pause(); }}>
        <div ref={stage} className={`stage ${captions ? '' : 'no-captions'}`} style={{ transform: `scale(${scale})` }} aria-hidden={!showTargets}>
          <FilmView items={ITEMS} onReady={onReady} />
        </div>
        {!ready && <div className="player-loading">Loading the video</div>}
        {ready && !playing && !started.current && !panel && (
          <button className="big-play" onClick={play} aria-label="Play the video">▶<span>Play{from ? '' : ` · ${duration(planLength)}`}</span></button>
        )}
        {actEnd !== null && !playing && !panel && (
          <div className="act-end" onClick={(e) => e.stopPropagation()}>
            <p className="kicker">End of {actLabel(actEnd)}</p>
            <h2>{ACT_NAMES[String(actEnd)]}</h2>
            <p className="muted">Explore the pages this part draws on, beside the video, or carry on.</p>
            <div className="act-end-actions">
              {ACT_NAMES[String(actEnd + 1)] && <button className="btn primary" onClick={play}>{`Continue to ${actLabel(actEnd + 1)}: ${ACT_NAMES[String(actEnd + 1)]}`}</button>}
              <button className="btn" onClick={() => { const c = chapters.find((x) => x.key === `card-${actEnd}`); if (c) { seek(c.start + 0.01); play(c.start + 0.01); } }}>Replay this act</button>
            </div>
          </div>
        )}
        {sceneEnd !== null && !playing && !panel && (() => {
          const pi = path ? path.scenes.indexOf(sceneEnd) : -1;
          if (path && pi === path.scenes.length - 1) return <div className="act-end" onClick={(e) => e.stopPropagation()}>{path.end}</div>;
          const next = path && pi >= 0 ? chapters.find((c) => c.n === path.scenes[pi + 1]) : chapters.find((c) => c.n !== undefined && c.n > sceneEnd);
          const title = (n: number) => SCENE_TEXT.find((x) => x.n === n)?.title;
          return (
            <div className="act-end" onClick={(e) => e.stopPropagation()}>
              <p className="kicker">End of scene {sceneEnd}</p>
              <h2>{title(sceneEnd)}</h2>
              <p className="muted">{path ? `Scene ${pi + 1} of ${path.scenes.length} on this path.` : 'Read the pages this scene draws on, beside the video, or carry on.'}</p>
              <div className="act-end-actions">
                {next && <button className="btn primary" onClick={() => { seek(next.start + 0.01); play(next.start + 0.01); }}>{path ? path.nextLabel(next.n!) : `Next: ${next.n}. ${title(next.n!)}`}</button>}
                <button className="btn" onClick={() => { const c = chapters.find((x) => x.n === sceneEnd); if (c) { seek(c.start + 0.01); play(c.start + 0.01); } }}>Replay this scene</button>
              </div>
            </div>
          );
        })()}
        {ended && endOverlay && !playing && !panel && actEnd === null && sceneEnd === null && (
          <div className="act-end" onClick={(e) => e.stopPropagation()}>{endOverlay}</div>
        )}
        {showTargets && actEnd === null && sceneEnd === null && !(ended && endOverlay) && (
          <div className={`targets ${explore ? 'on' : ''}`} role="group" aria-label="Things you can explore in this frame">
            {targets.map((tg) => (
              <button key={tg.id} className="target" style={{ left: tg.rect.x, top: tg.rect.y, width: tg.rect.w, height: tg.rect.h }}
                aria-label={tg.label} title={tg.label} onClick={(e) => { e.stopPropagation(); open(tg); }} />
            ))}
          </div>
        )}
      </div>
      <div className="controls">
        <button className="ctl" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'} disabled={!ready}>{playing ? '❚❚' : '▶'}</button>
        <div className="scrub">
          <input type="range" aria-label="Position in the video" min={range.start} max={range.end} step={0.1} value={t}
            onChange={(e) => { started.current = true; if (playing) pause(); seek(Number(e.target.value)); requestAnimationFrame(collect); }} disabled={!ready} />
          <div className="ticks" aria-hidden>
            {chapters.filter((c) => c.key.startsWith('card-') && c.start >= range.start && c.start < range.end).map((c) => (
              <span key={c.key} style={{ left: `${((c.start - range.start) / span) * 100}%` }} title={actLabel(Number(c.key.slice(5)))} />
            ))}
          </div>
        </div>
        <span className="time">{mmss(t - range.start)} / {mmss(span)}</span>
        {!tldr && <select className="ctl chapters" aria-label="Jump to a chapter" value={String(chapters.reduce((acc, c, i) => (c.key.startsWith('card-') && c.start <= t ? i : acc), 0))} onChange={(e) => { const c = chapters[Number(e.target.value)]; if (c) { started.current = true; if (playing) pause(); seek(c.start + 0.01); requestAnimationFrame(collect); } }}>
          {chapters.map((c, i) => c.start >= range.start && c.start < range.end && c.key !== 'title' && (
            <option key={c.key} value={i}>{c.n ? `${c.n}. ${SCENE_TEXT.find((s) => s.n === c.n)?.title}` : `${actLabel(Number(c.key.slice(5)))}: ${ACT_NAMES[c.key.slice(5)]}`}</option>
          ))}
        </select>}
        <button className={`ctl ${captions ? 'on' : ''}`} aria-pressed={captions} onClick={() => setCaptions(!captions)}>CC</button>
        <button className={`ctl ${sound ? 'on' : ''}`} aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? 'Sound' : 'Muted'}</button>
        <button className="ctl" title="Copy a link to this moment" onClick={() => {
          const u = new URL(location.href); u.searchParams.set('t', String(Math.floor(t))); u.searchParams.delete('target');
          navigator.clipboard?.writeText(u.toString()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
        }}>{copied ? 'Copied' : 'Link'}</button>
        <button className={`ctl ${explore ? 'on' : ''}`} aria-pressed={explore} onClick={() => { if (playing) pause(); setExplore(!explore); }}>Explore</button>
      </div>
      {tldr ? null : cardNow ? <p className="now muted">{actLabel(cardNow)}: {ACT_NAMES[String(cardNow)]}</p> : scene !== undefined && (() => {
        const main = sceneSources(scene)[0];
        return <p className="now muted">Scene {scene}: {sceneInfo(scene)?.title}{main && <> · from <Link to={main.url}>{locName(main)}</Link></>}</p>;
      })()}
      <audio ref={audio} src={media(tldr ? 'overview.m4a' : 'narration.m4a')} preload="auto" />
      {panel && <Panel content={panel} onClose={() => { setPanel(null); collect(); }} onResume={() => { setPanel(null); play(); }} />}
    </section>
  );
};
