import React from 'react';
import { ACT_NAMES, actLabel, actSources, locName, sceneInfo, sceneSources, SCENES, type Loc } from '../content/film';

const SHOWN = 3;

const Related: React.FC<{ items: Loc[]; onRead: (l: Loc) => void }> = ({ items, onRead }) => {
  const [all, setAll] = React.useState(false);
  const key = items.map((x) => x.url).join(',');
  React.useEffect(() => setAll(false), [key]);
  const shown = all ? items : items.slice(0, SHOWN);
  const more = items.length - SHOWN;
  return (
    <>
      <ul className="related">
        {shown.map((l) => (
          <li key={l.url}>
            <button className="related-card" onClick={() => onRead(l)}>
              <span>
                <strong>{locName(l)}</strong>
                {l.heading && <span className="related-sum">{l.page.title}</span>}
                <span className="related-go">Read →</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {more > 0 && (
        <button className="linkish related-more" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? 'Show fewer pages' : `Show ${more} more page${more > 1 ? 's' : ''}`}
        </button>
      )}
    </>
  );
};

/** Beside the video: the pages the current scene or act draws on, to pause and read. */
export const Companion: React.FC<{ scene?: number; card?: number; playing: boolean; actEnd?: number | null; onRead: (l: Loc) => void; onJump: (scene: number) => void }> = ({ scene, card, playing, actEnd, onRead, onJump }) => {
  if (actEnd || card) {
    const act = (actEnd || card)!;
    return (
      <aside className="companion" aria-live="polite" aria-label={actEnd ? 'Go deeper' : 'This part'}>
        <p className="kicker">{actEnd ? `End of ${actLabel(act)} · go deeper` : `${playing ? 'Now playing' : 'Paused at'} · ${actLabel(act)}`}</p>
        <h2 className="companion-title">{ACT_NAMES[String(act)]}</h2>
        <p className="muted companion-note">{actEnd ? 'The pages this part drew on.' : 'The pages this part draws on.'}</p>
        <Related items={actSources(act)} onRead={onRead} />
      </aside>
    );
  }
  const s = sceneInfo(scene ?? 0) ?? SCENES[0];
  const next = s.act === 0 ? undefined : SCENES.find((x) => x.n === s.n + 1 && x.act > 0);
  return (
    <aside className="companion" aria-live="polite" aria-label="On the site">
      <p className="kicker">{playing ? 'Now playing' : 'Paused at'} · {s.act === 0 ? 'the overview' : `scene ${s.n}`}</p>
      <h2 className="companion-title">{s.title}</h2>
      <p className="kicker companion-sub">On the site</p>
      <Related items={sceneSources(s.n)} onRead={onRead} />
      {next && <p className="up-next">Up next: <button className="linkish" onClick={() => onJump(next.n)}>{next.n}. {next.title}</button></p>}
    </aside>
  );
};
