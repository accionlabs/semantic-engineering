import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource-variable/bricolage-grotesque';
import './site.css';
import { Layout } from './parts/Layout';
import { Home } from './pages/Home';
import { SectionPage } from './pages/SectionPage';
import { WatchPage } from './pages/WatchPage';
import { GraphPage } from './pages/GraphPage';
import { ExplainHome, ExplainImport, ExplainPage } from './pages/ExplainPage';
import { ConnectPage, PrivacyPage } from './pages/AgentPages';
import { CONTACT } from './reel/prompt';
import { Navigate, useParams } from 'react-router-dom';

// The old drill-down pages now live with the other scenes.
const DrillRedirect = () => <Navigate replace to={`/watch/scene-${useParams().n}`} />;
import { About, Glossary, References, Sections, Summary } from './pages/Other';

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="watch" element={<WatchPage />} />
          <Route path="watch/:slug" element={<WatchPage />} />
          <Route path="graph" element={<GraphPage />} />
          {/* The connector's documentation and privacy policy go live once a contact address is set. */}
          {CONTACT && <Route path="connect" element={<ConnectPage />} />}
          {CONTACT && <Route path="privacy" element={<PrivacyPage />} />}
          <Route path="explain" element={<ExplainHome />} />
          <Route path="explain/import" element={<ExplainImport />} />
          <Route path="explain/:id" element={<ExplainPage />} />
          <Route path="sections" element={<Sections />} />
          <Route path="sections/:slug" element={<SectionPage />} />
          <Route path="summary" element={<Summary />} />
          <Route path="drill-downs/:n" element={<DrillRedirect />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="references" element={<References />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<div className="wrap narrow"><h1>Page not found</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>,
);
