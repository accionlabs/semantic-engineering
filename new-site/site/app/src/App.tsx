import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './parts/Layout';
import { PageView } from './pages/PageView';
import { HomeWatch, WatchPage } from './pages/WatchPage';

// Every page of content/ is served at the address Hugo gave it, so existing links keep working.
export const App: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomeWatch />} />
      <Route path="/watch" element={<WatchPage />} />
      <Route path="/watch/:slug" element={<WatchPage />} />
      <Route path="*" element={<PageView />} />
    </Route>
  </Routes>
);
