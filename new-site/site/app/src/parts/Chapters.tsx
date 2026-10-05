import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SCENES as SCENE_TEXT, ACT_NAMES } from '@film/engine/cues';
import { LAYERS } from '../content/data';
import { media } from '../content/media';

type SceneInfo = { n: number; act: number; title: string };
const scenes = SCENE_TEXT as unknown as SceneInfo[];
const ACTS = [1, 2, 3, 4, 5];
const thumb = (n: number) => media(`thumbs/s${String(n).padStart(2, '0')}.jpg`);
const title = (n: number) => scenes.find((s) => s.n === n)?.title.replace(/^Drill-down: /, '') ?? '';

type Tab = 'story' | 'layers';
const TABS: { id: Tab; label: string; note: string }[] = [
  { id: 'story', label: 'Follow the story', note: 'The full video in five acts, one act at a time.' },
  { id: 'layers', label: 'Pick a layer', note: 'Choose a layer of the product and see it today, then after the line moves.' },
];

const Story: React.FC<{ current?: { act?: number; scene?: number } }> = ({ current }) => (
  <div className="acts">
    {ACTS.map((a) => {
      const list = scenes.filter((s) => s.act === a);
      return (
        <article key={a} className={`act-tile ${current?.act === a ? 'current' : ''}`}>
          <Link to={`/watch/act-${a}`} className="act-head">
            <img src={thumb(list[0].n)} alt="" loading="lazy" />
            <span className="act-label">
              <span className="kicker">Act {a}{a === 5 ? ' · optional' : ''}</span>
              <strong>{ACT_NAMES[String(a)]}</strong>
              <span className="act-play">Play the act →</span>
            </span>
          </Link>
          <ol className="scene-list">
            {list.map((s) => (
              <li key={s.n} className={current?.scene === s.n ? 'current' : ''}>
                <Link to={`/watch/scene-${s.n}`}><span className="scene-num">{s.n}</span>{title(s.n)}</Link>
              </li>
            ))}
          </ol>
        </article>
      );
    })}
  </div>
);

/** The stack of layers is the menu: each band plays that layer today, then after the line moves. */
const Layers: React.FC<{ current?: string }> = ({ current }) => (
  <ol className="layer-menu">
    {LAYERS.map((l) => (
      <li key={l.slug} className={`${l.shared ? 'shared' : 'custom'} ${l.slug === 'bill' ? 'bill' : ''} ${current === l.slug ? 'current' : ''}`}>
        <Link to={`/watch/layer-${l.slug}`}>
          <strong>{l.name}</strong>
          <span className="layer-scenes">Today, then after · scenes {l.before} and {l.after}</span>
        </Link>
      </li>
    ))}
  </ol>
);

const LayerKey: React.FC = () => (
  <p className="layer-key muted"><span className="swatch custom" aria-hidden /> Per customer once the line moves <span className="swatch shared" aria-hidden /> Shared by every customer</p>
);

/** Below the video: follow the story act by act, or pick a layer. */
export const Chapters: React.FC<{ current?: { act?: number; scene?: number; layer?: string } }> = ({ current }) => {
  const [tab, setTab] = useState<Tab>(current?.layer || (typeof location !== 'undefined' && location.hash === '#layers') ? 'layers' : 'story');
  const ref = useRef<HTMLElement>(null);
  // "#story" and "#layers" (from a shared link, or the end of the overview) open that tab.
  useEffect(() => {
    const on = () => {
      const h = location.hash === '#layers' ? 'layers' : location.hash === '#story' || location.hash === '#chapters' ? 'story' : undefined;
      if (h) { setTab(h); ref.current?.scrollIntoView({ behavior: 'smooth' }); }
    };
    on();
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  const active = TABS.find((t) => t.id === tab)!;
  return (
    <section className="chapter-grid" id="chapters" ref={ref} aria-label="Go deeper">
      <h2>Go deeper</h2>
      <div className="tabs" role="tablist" aria-label="Ways to go deeper">
        {TABS.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="go-deeper-panel" className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div id="go-deeper-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <p className="muted tab-note">{active.note}</p>
        {tab === 'story' ? <Story current={current} /> : <><Layers current={current?.layer} /><LayerKey /></>}
      </div>
    </section>
  );
};
