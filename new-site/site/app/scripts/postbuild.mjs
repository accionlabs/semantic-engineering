// Caching for static hosting. Routing falls back to the app through wrangler.jsonc.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
fs.writeFileSync(path.join(dist, '_headers'), '/media/*\n  Cache-Control: public, max-age=86400\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n');
console.log('postbuild: _headers written');
