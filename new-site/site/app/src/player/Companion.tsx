import React from 'react';
import { SCENES as SCENE_TEXT, ACT_NAMES } from '@film/engine/cues';
import { SUMMARIES, sectionByN } from '../content/data';

type SceneInfo = { n: number; act: number; title: string; paper?: string; figs?: string[] };
const scenes = SCENE_TEXT as unknown as SceneInfo[];

/** The paper sections a scene draws on, from the script's references ("2, 3, 6" or "1.2, 1.3"). */
export const sectionsFor = (n: number) => {
  const refs = (scenes.find((s) => s.n === n)?.paper ?? '').match(/\d+(\.\d+)?/g) ?? [];
  const seen = new Map<number, string | undefined>();
  refs.forEach((r) => { const [a, b] = r.split('.'); const k = Number(a); if (sectionByN(k) && !seen.has(k)) seen.set(k, b ? `s${a}-${b}` : undefined); });
  return [...seen.entries()].map(([k, anchor]) => ({ n: k, anchor }));
};

/** Beside the video: what the current scene draws on in the paper, to pause and read. */
/** Every section an act's scenes draw on, the ones most of its scenes use first. */
export const sectionsForAct = (act: number) => {
  const seen = new Map<number, { anchor?: string; uses: number; first: number }>();
  scenes.filter((x) => Number(x.act) === act).forEach((x, i) => sectionsFor(x.n).forEach(({ n, anchor }, j) => {
    const e = seen.get(n);
    // The first reference in a scene is its main section, so it counts double.
    const w = j === 0 ? 2 : 1;
    if (e) e.uses += w; else seen.set(n, { anchor, uses: w, first: i });
  }));
  return [...seen.entries()].sort((p, q) => q[1].uses - p[1].uses || p[1].first - q[1].first || p[0] - q[0]).map(([n, e]) => ({ n, anchor: e.anchor }));
};

const SHOWN = 3;

const Related: React.FC<{ items: { n: number; anchor?: string }[]; onRead: (n: number, anchor?: string) => void }> = ({ items, onRead }) => {
  const [all, setAll] = React.useState(false);
  const key = items.map((x) => x.n).join(',');
  React.useEffect(() => setAll(false), [key]);
  const shown = all ? items : items.slice(0, SHOWN);
  const more = items.length - SHOWN;
  return (
    <>
      <ul className="related">
        {shown.map(({ n, anchor }) => {
          const sec = sectionByN(n)!;
          const sub = anchor ? sec.subsections.find((x) => x.id === anchor) : undefined;
          return (
            <li key={n}>
              <button className="related-card" onClick={() => onRead(n, anchor)}>
                <span className="related-num">{sub ? sub.number : n}</span>
                <span>
                  <strong>{sub ? sub.title : sec.title}</strong>
                  <span className="related-sum">{(SUMMARIES[String(n)] ?? '').split('. ')[0]}.</span>
                  <span className="related-go">Read →</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {more > 0 && (
        <button className="linkish related-more" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? 'Show fewer sections' : `Show ${more} more section${more > 1 ? 's' : ''}`}
        </button>
      )}
    </>
  );
};

export const Companion: React.FC<{ scene?: number; card?: number; playing: boolean; actEnd?: number | null; onRead: (n: number, anchor?: string) => void; onJump: (scene: number) => void }> = ({ scene, card, playing, actEnd, onRead, onJump }) => {
  if (actEnd || card) {
    const act = (actEnd || card)!;
    return (
      <aside className="companion" aria-live="polite" aria-label={actEnd ? 'Deep dive' : 'This act'}>
        <p className="kicker">{actEnd ? `End of Act ${act} · deep dive` : `${playing ? 'Now playing' : 'Paused at'} · Act ${act}`}</p>
        <h2 className="companion-title">{ACT_NAMES[String(act)]}</h2>
        <p className="muted companion-note">{actEnd ? 'The sections of the paper this act drew on.' : 'The sections of the paper this act draws on.'}</p>
        <Related items={sectionsForAct(act)} onRead={onRead} />
      </aside>
    );
  }
  const s = scenes.find((x) => x.n === (scene ?? 1)) ?? scenes.find((x) => x.n === 1)!;
  const next = Number(s.act) === 0 ? undefined : scenes.find((x) => x.n === s.n + 1 && Number(x.act) > 0);
  const related = sectionsFor(s.n);
  return (
    <aside className="companion" aria-live="polite" aria-label="In the paper">
      <p className="kicker">{playing ? 'Now playing' : 'Paused at'} · {Number(s.act) === 0 ? 'the overview' : `scene ${s.n}`}</p>
      <h2 className="companion-title">{s.title}</h2>
      <p className="kicker companion-sub">In the paper</p>
      <Related items={related} onRead={onRead} />
      {s.figs && s.figs.length > 0 && (
        <>
          <details className="figs" open={typeof matchMedia === 'undefined' || !matchMedia('(max-width: 700px)').matches}>
            <summary className="kicker">Figures in this scene ({s.figs.length})</summary>
            <ul className="figs-list">{s.figs.map((f, i) => <li key={i}>{f.replace(/\. Pending addition to the paper.*$/, '')}</li>)}</ul>
          </details>
        </>
      )}
      {next && (
        <p className="up-next">Up next: <button className="linkish" onClick={() => onJump(next.n)}>{next.n}. {next.title}</button></p>
      )}
    </aside>
  );
};
