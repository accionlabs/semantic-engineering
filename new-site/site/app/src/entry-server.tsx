import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { primePages, type PageData } from './content/data';

// Used by scripts/postbuild.mjs to prerender every page.
primePages(import.meta.glob<PageData>('./content/pages/*.json', { eager: true, import: 'default' }));
export const render = (url: string) => renderToString(<StaticRouter location={url}><App /></StaticRouter>);
export { SITE } from './content/data';
export { ROLES, SITUATIONS } from './content/paths';
