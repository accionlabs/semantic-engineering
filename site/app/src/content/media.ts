// Media addresses carry a version taken from the narration's timing, so a browser that cached an older
// narration, video or thumbnail fetches the new one as soon as the timing changes.
import timing from '../../../../video/animation/src/voice-timing.json';

const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
export const MEDIA_VERSION = hash(JSON.stringify(timing));
export const media = (name: string) => `/media/${name}?v=${MEDIA_VERSION}`;
