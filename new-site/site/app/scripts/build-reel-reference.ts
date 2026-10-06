// Writes public/explanation-language.md, the agent's reference, from the same code the site checks with,
// and adds the agent section to public/llms.txt (which build-content.mjs writes first).
import fs from 'node:fs';
import { referenceMarkdown } from '../src/reel/reference';
import { MCP_URL, SITE } from '../src/reel/prompt';

const md = referenceMarkdown();
fs.writeFileSync(new URL('../public/explanation-language.md', import.meta.url), md);
const llmsPath = new URL('../public/llms.txt', import.meta.url);
const llms = fs.readFileSync(llmsPath, 'utf8').replace(/\n## For agents[\s\S]*$/, '\n');
fs.writeFileSync(llmsPath, `${llms.trimEnd()}\n\n## For agents\n\n- MCP server: ${MCP_URL} (Streamable HTTP, read-only, no sign-in). Tools to map Semantic Engineering onto a person's situation and to write an explanation that plays on the site.\n- [The explanation language and the knowledge graph](${SITE}/explanation-language.md)\n- [The knowledge graph with its evidence](${SITE}/graph)\n- [The connector](${SITE}/connect)\n`);
console.log('explanation-language.md', Math.round(md.length / 1024), 'KB');
