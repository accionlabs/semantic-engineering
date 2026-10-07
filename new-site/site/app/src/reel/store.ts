// Reels live in this browser only. Each saved reel keeps its source, its question and who it was for,
// so the history can tell a new agent what this person has asked before.
export type SavedReel = { id: string; code: string; question: string; audience?: string; created: string; updated: string; source: 'agent' | 'paste' | 'import' | 'example' | 'builder'; plays: number };

const KEY = 'se.explanations.v1';
const read = (): SavedReel[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; } };
const write = (all: SavedReel[]) => { try { localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200))); } catch { /* storage full or blocked: the reel still plays */ } };
const newId = () => Date.now().toString(36).slice(-6) + Math.random().toString(36).slice(2, 6);

export const reels = {
  list: () => read().sort((a, b) => b.updated.localeCompare(a.updated)),
  get: (id: string) => read().find((r) => r.id === id),
  /** Saves a reel, or returns the existing one if the same code is already saved. */
  save(code: string, meta: { question: string; audience?: string }, source: SavedReel['source']): SavedReel {
    const all = read(), now = new Date().toISOString();
    const same = all.find((r) => r.code.trim() === code.trim());
    if (same) { same.updated = now; write(all); return same; }
    const r: SavedReel = { id: newId(), code, question: meta.question, audience: meta.audience, created: now, updated: now, source, plays: 0 };
    write([r, ...all]); return r;
  },
  played(id: string) { const all = read(), r = all.find((x) => x.id === id); if (r) { r.plays += 1; r.updated = new Date().toISOString(); write(all); } },
  remove(id: string) { write(read().filter((r) => r.id !== id)); },
  clear() { write([]); },
};
