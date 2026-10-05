import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Site search over /search.json (one entry per page section, written by build-content.mjs), loaded on first use.
type Entry = { url: string; page: string; heading: string; text: string };
let index: Promise<Entry[]> | null = null;
const load = () => (index ??= fetch('/search.json').then((r) => r.json()).catch(() => { index = null; return []; }));

const terms = (q: string) => q.toLowerCase().split(/[^\p{L}\p{N}.]+/u).filter((t) => t.length > 1);
const score = (e: Entry, ts: string[]) => {
  const head = `${e.page} ${e.heading}`.toLowerCase(), body = e.text.toLowerCase();
  let s = 0;
  for (const t of ts) {
    const inHead = head.includes(t), inBody = body.includes(t);
    if (!inHead && !inBody) return 0;
    s += (inHead ? 10 : 0) + (inBody ? Math.min(5, body.split(t).length - 1) : 0);
  }
  return s;
};
const snippet = (text: string, ts: string[]) => {
  const low = text.toLowerCase();
  const at = Math.max(0, Math.min(...ts.map((t) => { const i = low.indexOf(t); return i < 0 ? Infinity : i; })) - 50);
  return (at > 0 ? '…' : '') + text.slice(at, at + 160) + (text.length > at + 160 ? '…' : '');
};

export const Search: React.FC = () => {
  const [q, setQ] = useState('');
  const [all, setAll] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !/input|textarea|select/i.test((e.target as HTMLElement).tagName)) { e.preventDefault(); input.current?.focus(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  const results = useMemo(() => {
    const ts = terms(q);
    if (!ts.length) return [];
    return all.map((e) => ({ e, s: score(e, ts) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map(({ e }) => ({ ...e, snip: snippet(e.text, ts) }));
  }, [q, all]);
  const go = (url: string) => { setOpen(false); setQ(''); input.current?.blur(); navigate(url); };
  return (
    <div className="search" role="search">
      <input
        ref={input} type="search" placeholder="Search…" aria-label="Search the site" value={q}
        onFocus={() => { load().then(setAll); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => { setQ(e.target.value); setSel(0); setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
          else if (e.key === 'Enter' && results[sel]) go(results[sel].url);
          else if (e.key === 'Escape') { setOpen(false); input.current?.blur(); }
        }}
      />
      {open && q.trim() && (
        <ul className="search-results" role="listbox">
          {results.length === 0 && <li className="none">No results</li>}
          {results.map((r, i) => (
            <li key={r.url} role="option" aria-selected={i === sel} className={i === sel ? 'sel' : ''} onMouseDown={(e) => { e.preventDefault(); go(r.url); }} onMouseEnter={() => setSel(i)}>
              <span className="r-page">{r.page}</span>
              {r.heading && <span className="r-head">{r.heading}</span>}
              <span className="r-snip">{r.snip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
