import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './parts/Layout';
import { PageView } from './pages/PageView';
import { HomeWatch, WatchPage } from './pages/WatchPage';

// The knowledge graph, the explanations and the connector pages load on demand: they carry the graph and
// the site's passages, which the rest of the site does not need.
const GraphPage = lazy(() => import('./pages/GraphPage').then((m) => ({ default: m.GraphPage })));
const ExplainHome = lazy(() => import('./pages/ExplainPage').then((m) => ({ default: m.ExplainHome })));
const ExplainImport = lazy(() => import('./pages/ExplainPage').then((m) => ({ default: m.ExplainImport })));
const ExplainStored = lazy(() => import('./pages/ExplainPage').then((m) => ({ default: m.ExplainStored })));
const ExplainPage = lazy(() => import('./pages/ExplainPage').then((m) => ({ default: m.ExplainPage })));
const ConnectPage = lazy(() => import('./pages/AgentPages').then((m) => ({ default: m.ConnectPage })));
const PrivacyPage = lazy(() => import('./pages/AgentPages').then((m) => ({ default: m.PrivacyPage })));
const later = (el: React.ReactNode) => <Suspense fallback={<div className="wrap narrow"><p className="muted" style={{ marginTop: 28 }}>Loading</p></div>}>{el}</Suspense>;

// Every page of content/ is served at the address Hugo gave it, so existing links keep working.
export const App: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomeWatch />} />
      <Route path="/watch" element={<WatchPage />} />
      <Route path="/watch/:slug" element={<WatchPage />} />
      <Route path="/graph" element={later(<GraphPage />)} />
      <Route path="/explain" element={later(<ExplainHome />)} />
      <Route path="/explain/import" element={later(<ExplainImport />)} />
      <Route path="/explain/:id" element={later(<ExplainPage />)} />
      <Route path="/e/:id" element={later(<ExplainStored />)} />
      <Route path="/connect" element={later(<ConnectPage />)} />
      <Route path="/privacy" element={later(<PrivacyPage />)} />
      <Route path="*" element={<PageView />} />
    </Route>
  </Routes>
);
