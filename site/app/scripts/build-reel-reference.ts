// Writes public/explanation-language.md: the agent's reference, from the same code the site checks with.
import fs from 'node:fs';
import { referenceMarkdown } from '../src/reel/reference';
const md = referenceMarkdown();
fs.writeFileSync(new URL('../public/explanation-language.md', import.meta.url), md);
console.log('explanation-language.md', Math.round(md.length / 1024), 'KB');
