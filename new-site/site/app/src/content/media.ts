// Media addresses carry a version: the hash of the file's content where the build saw the file, else one
// taken from the narration's timing. Any change to a narration, video or thumbnail changes its address, so a
// browser that cached an older copy fetches the new one.
import timing from '../../../../video/animation/src/voice-timing.json';
import versions from './media-versions.json';

const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
export const MEDIA_VERSION = hash(JSON.stringify(timing));
const FILE_VERSIONS = versions as Record<string, string>;
export const media = (name: string) => `/media/${name}?v=${FILE_VERSIONS[name] ?? MEDIA_VERSION}`;
