// The guide's voice: the browser's own speech. The recorded narration is the expert; the browser voice
// reads the agent's connecting lines. Where speech is missing, lines are shown for their reading time.
const ok = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
const VOICE_KEY = 'de.voice';

export const voices = (): SpeechSynthesisVoice[] => (ok() ? speechSynthesis.getVoices().filter((v) => /^en(-|_|$)/i.test(v.lang)) : []);

/** The chosen voice, or the most natural-sounding English one available. */
export const pickVoice = (): SpeechSynthesisVoice | undefined => {
  const all = voices();
  let chosen: string | null = null;
  try { chosen = localStorage.getItem(VOICE_KEY); } catch { /* ignore */ }
  const named = all.find((v) => v.name === chosen);
  if (named) return named;
  const score = (v: SpeechSynthesisVoice) => (/natural|neural|premium|enhanced/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (/en-GB|en-US/i.test(v.lang) ? 1 : 0) + (v.localService ? 0 : 1);
  return [...all].sort((a, b) => score(b) - score(a))[0];
};
export const chooseVoice = (name: string) => { try { localStorage.setItem(VOICE_KEY, name); } catch { /* ignore */ } };
export const speechAvailable = ok;

/** Speaks a line; calls onEnd when done. Returns a function that stops it. */
export const speak = (text: string, onEnd: () => void): (() => void) => {
  if (!ok()) { onEnd(); return () => {}; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\bSaaS\b/g, 'sass').replace(/\bOn2Go\b/g, 'on to go'));
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = 1; u.pitch = 1;
  let done = false;
  const finish = () => { if (done) return; done = true; clearInterval(keep); onEnd(); };
  u.onend = finish; u.onerror = finish;
  // Some browsers stop long utterances after about fifteen seconds unless nudged.
  const keep = setInterval(() => { if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); speechSynthesis.resume(); } }, 9000);
  speechSynthesis.speak(u);
  return () => { done = true; clearInterval(keep); speechSynthesis.cancel(); };
};
