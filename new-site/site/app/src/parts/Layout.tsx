import React, { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { registerSiteTools } from '../reel/webmcp';
import { PAPER } from '../content/data';

const ThemeButton: React.FC = () => {
  const [theme, setTheme] = useState<string | null>(() => { try { return localStorage.getItem('theme'); } catch { return null; } });
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme; else delete document.documentElement.dataset.theme;
    try { theme ? localStorage.setItem('theme', theme) : localStorage.removeItem('theme'); } catch { /* storage unavailable */ }
  }, [theme]);
  const next = theme === null ? 'dark' : theme === 'dark' ? 'light' : null;
  return <button className="theme-btn" onClick={() => setTheme(next)} aria-label="Switch colour theme">{theme === null ? 'Theme: system' : theme === 'dark' ? 'Theme: dark' : 'Theme: light'}</button>;
};

export const Layout: React.FC = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  // Offer the site's tools to an agent in the visitor's browser, where the browser supports WebMCP.
  useEffect(() => registerSiteTools((path) => navigate(path)), []); // eslint-disable-line
  useEffect(() => { if (!hash) window.scrollTo(0, 0); else document.getElementById(hash.slice(1))?.scrollIntoView(); }, [pathname, hash]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="header">
        <div className="wrap">
          <Link className="brand" to="/"><img className="brand-mark" src="/logo.svg" alt="" width="40" height="40" /><span className="brand-text">Dialect Engineering<span className="tagline">SaaS architecture when code is cheap</span></span></Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/explain">Explain</NavLink>
            <NavLink to="/sections">Sections</NavLink>
            <NavLink to="/glossary">Glossary</NavLink>
            <NavLink to="/references">References</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
          <ThemeButton />
        </div>
      </header>
      <div className="draft"><div className="wrap">{PAPER.status.startsWith('Draft') ? 'Draft, September 2026' : PAPER.status}</div></div>
      <main id="main"><Outlet /></main>
      <footer className="footer">
        <div className="wrap">
          <span>Companion to <a href="https://semantic-engineering.ai" target="_blank" rel="noopener">semantic-engineering.ai</a></span>
          <span>On2Go, the brownfield example: <a href="https://on2go.ai" target="_blank" rel="noopener">on2go.ai</a></span>
          <Link to="/about">About this site</Link>
          <span>Draft, September 2026</span>
          <span>Brought to you by <a href="https://accionlabs.com" target="_blank" rel="noopener">Accion Labs</a></span>
        </div>
      </footer>
    </>
  );
};
