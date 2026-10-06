import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SITE, PAGES, navTitle, pageByUrl, type NavNode } from '../content/data';
import { Search } from './Search';

const ThemeButton: React.FC = () => {
  const [theme, setTheme] = useState<string | null>(null);
  useEffect(() => { try { setTheme(localStorage.getItem('theme')); } catch { /* storage unavailable */ } }, []);
  const choose = (t: string | null) => {
    setTheme(t);
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
    try { t ? localStorage.setItem('theme', t) : localStorage.removeItem('theme'); } catch { /* storage unavailable */ }
  };
  const next = theme === null ? 'dark' : theme === 'dark' ? 'light' : null;
  return <button className="theme-btn" onClick={() => choose(next)} aria-label="Switch colour theme">{theme === null ? 'Theme: system' : theme === 'dark' ? 'Theme: dark' : 'Theme: light'}</button>;
};

const NavItem: React.FC<{ node: NavNode; current: string; onGo: () => void }> = ({ node, current, onGo }) => {
  const p = PAGES.get(node.key)!;
  const inside = current === node.key || current.startsWith(node.key + '/');
  const [open, setOpen] = useState(inside);
  useEffect(() => { if (inside) setOpen(true); }, [inside]);
  return (
    <li>
      <div className={`nav-row${current === node.key ? ' active' : ''}`}>
        <Link to={p.url} onClick={onGo} aria-current={current === node.key ? 'page' : undefined}>{navTitle(p)}{p.draft && <span className="draft-tag">draft</span>}</Link>
        {node.children.length > 0 && (
          <button className="nav-toggle" aria-expanded={open} aria-label={`${open ? 'Collapse' : 'Expand'} ${navTitle(p)}`} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        )}
      </div>
      {node.children.length > 0 && open && <ul>{node.children.map((c) => <NavItem key={c.key} node={c} current={current} onGo={onGo} />)}</ul>}
    </li>
  );
};

export const Sidebar: React.FC<{ current: string; onGo: () => void }> = ({ current, onGo }) => (
  <nav className="sidebar-nav" aria-label="Site">
    <ul>
      <li><div className={`nav-row${current === 'video-home' ? ' active' : ''}`}><Link to="/" onClick={onGo} aria-current={current === 'video-home' ? 'page' : undefined}>Home</Link></div></li>
      <li><div className={`nav-row${current === 'home' ? ' active' : ''}`}><Link to="/introduction/" onClick={onGo} aria-current={current === 'home' ? 'page' : undefined}>Introduction</Link></div></li>
      {SITE.nav.map((n) => <NavItem key={n.key} node={n} current={current} onGo={onGo} />)}
      <li className="nav-group"><span className="kicker">For agents</span></li>
      {[['/graph', 'The knowledge graph'], ['/explain', 'Explanations'], ['/connect', 'The connector']].map(([to, name]) => (
        <li key={to}><div className={`nav-row${current === to ? ' active' : ''}`}><Link to={to} onClick={onGo} aria-current={current === to ? 'page' : undefined}>{name}</Link></div></li>
      ))}
    </ul>
  </nav>
);

declare global { interface Window { gtag?: (...a: unknown[]) => void } }

export const Layout: React.FC = () => {
  const { pathname, hash } = useLocation();
  const current = pathname === '/' ? 'video-home' : pageByUrl(pathname)?.key ?? ['/graph', '/explain', '/connect'].find((p) => pathname === p || pathname.startsWith(`${p}/`)) ?? '';
  // WebMCP: where the browser supports it, the page offers the connector's tools to an agent running in it.
  const navigate = useNavigate();
  useEffect(() => {
    let stop = () => {};
    let gone = false;
    import('../reel/webmcp').then((m) => { if (!gone) stop = m.registerSiteTools((p) => navigate(p)); }).catch(() => {});
    return () => { gone = true; stop(); };
  }, []); // eslint-disable-line
  const [menu, setMenu] = useState(false);
  useEffect(() => { setMenu(false); }, [pathname]);
  // The watch pages use the full width: the sidebar opens over them from the menu button.
  const watch = pathname === '/' || pathname === '/watch' || pathname.startsWith('/watch/');
  // On wide screens the menu button collapses the sidebar of the content pages; the choice is remembered.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { try { setCollapsed(localStorage.getItem('se-sidebar') === 'collapsed'); } catch { /* storage unavailable */ } }, []);
  const toggle = () => {
    const narrow = matchMedia('(max-width: 860px)').matches;
    if (narrow || watch) { setMenu(!menu); return; }
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem('se-sidebar', next ? 'collapsed' : 'open'); } catch { /* storage unavailable */ }
  };
  const open = watch || collapsed ? menu : !collapsed;
  // Analytics (production host only, see postbuild): the first view is sent on load, later ones on navigation.
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (first) { setFirst(false); return; }
    window.gtag?.('event', 'page_view', { page_location: location.href, page_title: document.title });
  }, [pathname]); // eslint-disable-line
  // A new page starts at the top; PageView scrolls to an anchor once the page's content has loaded.
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname]); // eslint-disable-line
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="header">
        <div className="header-in">
          <button className="menu-btn" aria-expanded={open} aria-controls="sidebar" aria-label={watch ? 'Menu' : collapsed ? 'Show the menu' : 'Hide the menu'} title={watch ? 'Menu' : collapsed ? 'Show the menu' : 'Hide the menu'} onClick={toggle}>
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" /></svg>
          </button>
          <Link className="brand" to="/">
            <img className="brand-mark logo-light" src="/images/logo.svg" alt="" width="34" height="24" />
            <img className="brand-mark logo-dark" src="/images/logo-dark.svg" alt="" width="34" height="24" />
            <span>Semantic Engineering</span>
          </Link>
          <Search />
          <ThemeButton />
        </div>
      </header>
      <div className={`shell${watch ? ' watch-shell' : ''}${collapsed && !watch ? ' collapsed' : ''}`}>
        {menu && (watch || collapsed) && <div className="scrim" onClick={() => setMenu(false)} aria-hidden="true" />}
        <aside id="sidebar" className={`sidebar${menu ? ' open' : ''}`}><Sidebar current={current} onGo={() => setMenu(false)} /></aside>
        <main id="main" className="main"><Outlet /></main>
      </div>
      <footer className="footer"><div className="footer-in">© 2026 Accion Labs · <Link to="/graph">Knowledge graph</Link> · <Link to="/connect">Connector</Link> · <Link to="/privacy">Privacy</Link></div></footer>
    </>
  );
};
