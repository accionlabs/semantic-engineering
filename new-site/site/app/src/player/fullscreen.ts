import { useEffect, useState, type RefObject } from 'react';

/** Full screen for one element (the video with what sits beside it). Undefined where the browser cannot do it
 *  (iPhone Safari, or a frame that was not allowed full screen), so no button is shown there. */
export const useFullscreen = (ref: RefObject<HTMLElement | null>) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onChange = () => setOn(document.fullscreenElement === ref.current);
    document.addEventListener('fullscreenchange', onChange); return () => document.removeEventListener('fullscreenchange', onChange);
  }, [ref]);
  if (typeof document === 'undefined' || !document.fullscreenEnabled) return undefined;
  return { on, toggle: () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else ref.current?.requestFullscreen().catch(() => {}); } };
};
