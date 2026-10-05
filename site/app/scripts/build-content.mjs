// Reads the paper and writes src/content/paper.json: sections with their subsections, HTML blocks
// with diagram markers in place of the paper's mermaid blocks, citations, and the glossary.
// The paper stays in the documentation system; set PAPER_PATH to read it from elsewhere.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const here = path.dirname(fileURLToPath(import.meta.url));
const PAPER = process.env.PAPER_PATH ?? path.join(process.env.HOME, 'Documents/Documentation System/content/shared/semantic-engineering-process/DSL/dsl-saas-architecture.md');
const md = fs.readFileSync(PAPER, 'utf8');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const SLUGS = { 1: 'premise', 2: 'multi-tenancy-line', 3: 'customer-asks', 4: 'pricing', 5: 'two-directions', 6: 'onboarding-first', 7: 'modernisation', 8: 'knowledge-graph', 9: 'grammar', 10: 'schema-and-grammar', 11: 'degrees-of-freedom', 12: 'verification', 13: 'evidence', 14: 'roadmap', 15: 'grammar-demands', 16: 'falsifiers' };

let currentSection = 'summary';
const citations = new Map();
const renderer = new marked.Renderer();
renderer.link = ({ href, text, tokens }) => {
  const label = tokens ? marked.Parser.parseInline(tokens, { renderer }) : text;
  if (!/^https?:/.test(href)) return `<span class="unpublished">${label}</span>`; // companion papers are not published here
  const c = citations.get(href) ?? { url: href, title: text.replace(/<[^>]+>/g, ''), sections: [] };
  if (!c.sections.includes(currentSection)) c.sections.push(currentSection);
  citations.set(href, c);
  return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
};
renderer.heading = ({ tokens, depth, text }) => {
  const m = text.match(/^(\d+\.\d+)\s+(.*)$/);
  const id = m ? `s${m[1].replace('.', '-')}` : slugify(text);
  return `<h${depth} id="${id}">${marked.Parser.parseInline(tokens, { renderer })}</h${depth}>`;
};
renderer.table = function (token) {
  return `<div class="table-wrap">${marked.Renderer.prototype.table.call(this, token)}</div>`;
};

// Split the paper at level-2 headings.
const parts = md.split(/^## /m);
const header = parts.shift();
const title = header.match(/^# (.*)$/m)[1].trim();
const subtitle = (header.match(/^### (.*)$/m) ?? [])[1]?.trim() ?? '';
const status = (header.match(/\*\*Status:\*\*\s*(.*)$/m) ?? [])[1]?.trim() ?? '';

let diagramIndex = 0;
const toBlocks = (body) => {
  const tokens = marked.lexer(body);
  const blocks = [];
  let buf = [];
  const flush = () => { if (buf.length) { const t = buf; t.links = tokens.links; blocks.push({ type: 'html', html: marked.parser(t, { renderer }) }); buf = []; } };
  for (const t of tokens) {
    if (t.type === 'code' && t.lang === 'mermaid') { flush(); diagramIndex++; blocks.push({ type: 'diagram', id: `d${diagramIndex}`, source: t.text }); }
    else if (t.type === 'hr') continue;
    else buf.push(t);
  }
  flush();
  return blocks;
};

const sections = [];
let summary = null, glossary = [], appendixA = null;
for (const p of parts) {
  const nl = p.indexOf('\n');
  const heading = p.slice(0, nl).trim();
  const body = p.slice(nl + 1);
  const num = heading.match(/^(\d+)\.\s+(.*)$/);
  if (heading === 'Summary') { currentSection = 'summary'; summary = { title: 'Summary', blocks: toBlocks(body) }; continue; }
  if (heading.startsWith('Appendix A')) { currentSection = 'appendix-a'; appendixA = { title: heading, blocks: toBlocks(body) }; continue; }
  if (heading.startsWith('Appendix B')) {
    currentSection = 'glossary';
    glossary = [...body.matchAll(/^\*\*(.+?)\.\*\*\s+(.*)$/gm)].map(([, term, def]) => ({ term, slug: slugify(term), html: marked.parseInline(def, { renderer }) }));
    continue;
  }
  if (!num) continue;
  const n = Number(num[1]);
  currentSection = String(n);
  const subsections = [...body.matchAll(/^### (\d+\.\d+)\s+(.*)$/gm)].map(([, id, t]) => ({ id: `s${id.replace('.', '-')}`, number: id, title: t.trim() }));
  sections.push({ n, title: num[2].trim(), slug: `${n}-${SLUGS[n] ?? slugify(num[2])}`, subsections, blocks: toBlocks(body) });
}

// Where each glossary term is used.
for (const g of glossary) {
  const re = new RegExp(`\\b${g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  g.sections = sections.filter((s) => s.blocks.some((b) => b.type === 'html' && re.test(b.html.replace(/<[^>]+>/g, '')))).map((s) => s.n);
}

const out = { title, subtitle, status, builtFrom: path.basename(PAPER), summary, sections, appendixA, glossary, citations: [...citations.values()] };
fs.mkdirSync(path.join(here, '../src/content'), { recursive: true });
fs.writeFileSync(path.join(here, '../src/content/paper.json'), JSON.stringify(out, null, 1));
console.log(`paper: ${sections.length} sections, ${diagramIndex} diagrams, ${citations.size} citations, ${glossary.length} terms`);
