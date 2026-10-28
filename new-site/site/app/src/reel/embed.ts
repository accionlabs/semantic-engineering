// The embed view: the player alone, for a page that frames it (the sales kit). Explanations: /embed#z.<packed>,
// or ?embed=1 on /e/<id> and /explain/import. The film: ?embed=1 on /watch, /watch/overview, /watch/act-<n> and
// /watch/scene-<n>. The same addresses and events as dialect-engineering.ai's embed view.

/** Pages allowed to frame the embed view (worker.ts sends the same list as frame-ancestors); they hear its events. */
export const EMBED_PARENTS = ['https://saleskit.accionlabs.com', 'http://localhost:8088'];

export const isEmbed = () => typeof location !== 'undefined' && (location.pathname.replace(/\/$/, '') === '/embed' || new URLSearchParams(location.search).has('embed'));

export type EmbedEvent = 'ready' | 'play' | 'part_end' | 'deep_dive' | 'error';

/** Tells the framing page what is happening: { source: 'explanation-embed', site, type, ... }. */
export const postEmbed = (type: EmbedEvent, detail: Record<string, unknown>) => {
  if (typeof window === 'undefined' || window.parent === window) return;
  const msg = { source: 'explanation-embed', site: 'semantic-engineering.ai', type, ...detail };
  EMBED_PARENTS.forEach((origin) => { try { window.parent.postMessage(msg, origin); } catch { /* not that parent */ } });
};
