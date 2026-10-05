import React from 'react';
import { Link } from 'react-router-dom';
import { SCENES as SCENE_TEXT } from '@film/engine/cues';
import { SCENE_SECTION, sectionHref } from '../content/data';
import chapters from '../content/chapters.json';
import { media } from '../content/media';

/** The rendered MP4 with chapters, for reduced motion or where the live player cannot run. */
export const Fallback: React.FC<{ tldr?: boolean }> = ({ tldr }) => {
  if (tldr) return (
    <section className="fallback" aria-label="The overview">
      <video controls preload="metadata" poster={media('tldr-poster.jpg')}><source src={media('tldr-720p.mp4')} type="video/mp4" /></video>
    </section>
  );
  const ref = React.useRef<HTMLVideoElement>(null);
  const list = (chapters as { key: string; n?: number; start: number }[]).filter((c) => c.n);
  return (
    <section className="fallback" aria-label="Explainer video">
      <video ref={ref} controls preload="metadata" poster={media('poster.jpg')}>
        <source src={media('explainer-720p.mp4')} type="video/mp4" />
        <track kind="captions" src={media('captions.vtt')} srcLang="en" label="English" default />
      </video>
      <h2>Chapters</h2>
      <ol>
        {list.map((c) => (
          <li key={c.key}>
            <button className="linkish" onClick={() => { if (ref.current) { ref.current.currentTime = c.start; ref.current.play().catch(() => {}); } }}>{Math.floor(c.start / 60)}:{String(Math.floor(c.start) % 60).padStart(2, '0')}</button>{' '}
            {SCENE_TEXT.find((s) => s.n === c.n)?.title} · <Link to={sectionHref(SCENE_SECTION[c.n!])}>section {SCENE_SECTION[c.n!]}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
};
