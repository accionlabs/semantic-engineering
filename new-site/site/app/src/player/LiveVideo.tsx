import React, { Suspense, useEffect, useState } from 'react';
import type { WatchProps } from './Watch';
import { Fallback } from './Fallback';
import './player.css';

// The film and its player load only on pages that show the video, and only in the browser:
// a prerendered page carries a placeholder of the same size, and the player takes its place.
const Watch = React.lazy(() => import('./Watch'));

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches && !new URLSearchParams(location.search).has('motion');

const Placeholder: React.FC = () => (
  <div className="watch"><section className="player"><div className="player-stage placeholder"><div className="player-loading">Loading the video</div></div></section><aside className="companion" /></div>
);

export const LiveVideo: React.FC<WatchProps & { fallbackScenes?: number[] }> = ({ fallbackScenes, ...props }) => {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  if (!client) return <Placeholder />;
  if (reducedMotion()) return <Fallback scenes={fallbackScenes} />;
  return <Suspense fallback={<Placeholder />}><Watch {...props} /></Suspense>;
};
