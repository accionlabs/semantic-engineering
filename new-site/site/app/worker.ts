// The site's Worker. It runs before the static assets to:
//   - send www.semantic-engineering.ai to the bare domain, keeping the path,
//   - serve /media/* with byte ranges, so the player can seek within the narration (Cloudflare's static
//     assets answer a byte-range request with the whole file),
//   - answer the MCP server at /mcp: the same tools the page offers over WebMCP, for agents outside the
//     browser. It is stateless and read-only: it keeps nothing and stores nothing,
//   - answer requests for Markdown on the agent pages with the explanation language's reference.
// Everything else is a static asset.
import { TOOLS, lengths } from './src/reel/tools';
import { checkExplain, compiledListing } from './src/reel/explain';
import { ROLE, STYLE } from './src/reel/reference';
import { SITE } from './src/reel/prompt';

type Env = { ASSETS: { fetch: (r: Request | URL) => Promise<Response> } };

const media = async (request: Request, env: Env, url: URL) => {
  const range = request.headers.get('range');
  const res = await env.ASSETS.fetch(new Request(url, { method: 'GET' }));
  if (res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', 'public, max-age=86400');
  if (!range) return new Response(request.method === 'HEAD' ? null : res.body, { status: 200, headers });
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const m = range.match(/bytes=(\d*)-(\d*)/);
  if (!m) return new Response(buf, { status: 200, headers });
  const start = m[1] === '' ? Math.max(0, size - Number(m[2])) : Number(m[1]);
  const end = m[1] !== '' && m[2] !== '' ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
  headers.set('content-range', `bytes ${start}-${end}/${size}`);
  headers.set('content-length', String(end - start + 1));
  return new Response(request.method === 'HEAD' ? null : buf.slice(start, end + 1), { status: 206, headers });
};

// ---------- MCP ----------

const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id',
  'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
};
const base64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

type Tool = { title: string; description: string; inputSchema: object; run: (input: never) => unknown; readOnly: boolean };
const REMOTE: Record<string, Tool> = {
  ...Object.fromEntries(Object.entries(TOOLS).map(([name, t]) => [name, { ...t, run: t.run as (input: never) => unknown, readOnly: true }])),
  make_explanation: {
    title: 'Make an explanation the person can play',
    description: "Checks an explanation and, if it passes, returns a link that opens it on semantic-engineering.ai in the person's own browser, where it plays and is saved there. The explanation travels in the link itself; this server keeps nothing.",
    inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] },
    readOnly: true,
    run: ({ code }: { code: string }) => {
      if (typeof code !== 'string' || !code.trim()) return { error: 'give the explanation as text in "code", starting with: explain "<the question>"' };
      const r = checkExplain(code);
      if (!r.plan) return { ok: false, problems: r.problems };
      return { ok: true, link: `${SITE}/explain/import#${base64url(code)}`, ...lengths(r.plan), warnings: r.problems, compiled: compiledListing(r.plan) };
    },
  },
};

const INSTRUCTIONS = `${ROLE}

${STYLE}

Tools: explanation_guide holds the language, its rules, worked examples and the whole knowledge graph. graph_concepts, graph_links, concept_evidence and find_in_site help with the mapping; check_explanation checks a draft; make_explanation returns the link that plays it for the person.`;

type RpcMessage = { jsonrpc: '2.0'; id?: string | number | null; method?: string; params?: Record<string, unknown> };
const reply = (id: RpcMessage['id'], result: unknown) => ({ jsonrpc: '2.0', id, result });
const fail = (id: RpcMessage['id'], code: number, message: string) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

const handle = async (m: RpcMessage) => {
  if (m.id === undefined || m.id === null) return undefined; // a notification: nothing to answer
  switch (m.method) {
    case 'initialize': {
      const asked = String(m.params?.protocolVersion ?? '');
      return reply(m.id, {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'semantic-engineering', title: 'Semantic Engineering: knowledge graphs that govern AI coding agents', version: '0.1.0' },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping': return reply(m.id, {});
    case 'tools/list':
      return reply(m.id, { tools: Object.entries(REMOTE).map(([name, t]) => ({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: { title: t.title, readOnlyHint: t.readOnly, openWorldHint: false } })) });
    case 'tools/call': {
      const name = String(m.params?.name ?? '');
      const tool = REMOTE[name];
      if (!tool) return fail(m.id, -32602, `unknown tool "${name}"`);
      try {
        const out = (await tool.run((m.params?.arguments ?? {}) as never)) as Record<string, unknown>;
        return reply(m.id, { content: [{ type: 'text', text: JSON.stringify(out, null, 1) }], structuredContent: out, isError: Boolean(out && 'error' in out) });
      } catch (e) {
        return reply(m.id, { content: [{ type: 'text', text: `The tool failed: ${(e as Error).message}` }], isError: true });
      }
    }
    default: return fail(m.id, -32601, `method not found: ${m.method}`);
  }
};

const mcp = async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('This MCP server answers POST requests (Streamable HTTP, JSON responses).', { status: 405, headers: { ...CORS, allow: 'POST, OPTIONS' } });
  const body = await request.text();
  if (body.length > 64_000) return new Response(JSON.stringify(fail(null, -32600, 'request too large')), { status: 413, headers: { ...CORS, 'content-type': 'application/json' } });
  let parsed: RpcMessage | RpcMessage[];
  try { parsed = JSON.parse(body); } catch { return new Response(JSON.stringify(fail(null, -32700, 'parse error')), { status: 400, headers: { ...CORS, 'content-type': 'application/json' } }); }
  const messages = Array.isArray(parsed) ? parsed : [parsed];
  const answers = (await Promise.all(messages.map(handle))).filter(Boolean);
  if (!answers.length) return new Response(null, { status: 202, headers: CORS });
  return new Response(JSON.stringify(Array.isArray(parsed) ? answers : answers[0]), { status: 200, headers: { ...CORS, 'content-type': 'application/json' } });
};

/** An agent asking for Markdown on the agent pages gets the explanation language's reference. */
const wantsMarkdown = (request: Request) => /text\/markdown/.test(request.headers.get('accept') ?? '');
const AGENT_PAGES = ['/graph', '/explain', '/connect'];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) { url.hostname = url.hostname.slice(4); return Response.redirect(url.toString(), 301); }
    if (url.pathname === '/mcp' || url.pathname === '/mcp/') return mcp(request);
    if (url.pathname.startsWith('/media/')) return media(request, env, url);
    if (wantsMarkdown(request) && AGENT_PAGES.some((p) => url.pathname === p || url.pathname === `${p}/`)) return env.ASSETS.fetch(new Request(new URL('/explanation-language.md', url)));
    // Saved explanations live in the visitor's browser; every /explain/<id> address is the same page.
    if (url.pathname.startsWith('/explain/') && url.pathname !== '/explain/') {
      const res = await env.ASSETS.fetch(new Request(new URL('/explain/saved/', url)));
      const headers = new Headers(res.headers); headers.set('x-robots-tag', 'noindex');
      return new Response(res.body, { status: res.status, headers });
    }
    return env.ASSETS.fetch(request);
  },
};
