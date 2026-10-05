import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/400-italic.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource-variable/bricolage-grotesque';
import './site.css';
import { App } from './App';
import { loadPage, pageByUrl } from './content/data';

// Pages are prerendered at build time (scripts/postbuild.mjs). Load the open page's data first, so the
// app takes over the prerendered markup without a change.
const root = document.getElementById('root')!;
const app = <BrowserRouter><App /></BrowserRouter>;
const page = pageByUrl(location.pathname);
(page ? loadPage(page.key).catch(() => undefined) : Promise.resolve()).then(() => {
  if (root.hasChildNodes()) hydrateRoot(root, app); else createRoot(root).render(app);
});
