// The site's Worker. It runs before the static assets to:
//   - send www.semantic-engineering.ai to the bare domain, keeping the path,
//   - serve /media/* with byte ranges, so the player can seek within the narration (Cloudflare's static
//     assets answer a byte-range request with the whole file),
//   - answer the MCP server at /mcp: the same tools the page offers over WebMCP, for agents outside the
//     browser. It keeps no sessions; its one write is storing the explanations agents make,
//   - store the explanations agents make, and hand each to the person's browser by its short id (/e/<id>),
//   - answer requests for Markdown on the agent pages with the explanation language's reference.
// Everything else is a static asset.
import { TOOLS, lengths } from './src/reel/tools';
import { checkExplain, compiledListing } from './src/reel/explain';
import { ROLE, STYLE } from './src/reel/reference';
import { SITE } from './src/reel/prompt';
import { packExplanation } from './src/reel/link';

type KV = { get: (key: string) => Promise<string | null>; put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> };
type Env = { ASSETS: { fetch: (r: Request | URL) => Promise<Response> }; EXPLANATIONS?: KV };

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

// ---------- stored explanations ----------

/** How long a stored explanation is kept. */
const KEEP_SECONDS = 90 * 24 * 3600;
/** An explanation's id: made from its text, so the same explanation always has the same id and is stored once. */
const idFor = async (code: string) => {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code)));
  let s = ''; digest.slice(0, 9).forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
/** Stores an explanation and returns its short link; without the store, the explanation travels in the link. */
const linkFor = async (code: string, env: Env) => {
  if (!env.EXPLANATIONS) return `${SITE}/explain/import#${await packExplanation(code)}`;
  const id = await idFor(code);
  await env.EXPLANATIONS.put(`e:${id}`, code, { expirationTtl: KEEP_SECONDS });
  return `${SITE}/e/${id}`;
};
/** GET /api/explanations/<id>: the text of a stored explanation, for the page that plays it. */
const storedExplanation = async (id: string, env: Env) => {
  const code = /^[A-Za-z0-9_-]{6,20}$/.test(id) ? await env.EXPLANATIONS?.get(`e:${id}`) : null;
  return code
    ? new Response(code, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-robots-tag': 'noindex' } })
    : new Response('No explanation with this id. It may have expired.', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
};

type Tool = { title: string; description: string; inputSchema: object; run: (input: never, env: Env) => unknown; readOnly: boolean };
const REMOTE: Record<string, Tool> = {
  ...Object.fromEntries(Object.entries(TOOLS).map(([name, t]) => [name, { ...t, run: t.run as (input: never) => unknown, readOnly: true }])),
  make_explanation: {
    title: 'Make an explanation the person can play',
    description: "Checks an explanation and, if it passes, stores it and returns a short link that plays it on semantic-engineering.ai. The same explanation always gets the same link. Stored explanations are kept for 90 days.",
    inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] },
    readOnly: false,
    run: async ({ code }: { code: string }, env: Env) => {
      if (typeof code !== 'string' || !code.trim()) return { error: 'give the explanation as text in "code", starting with: explain "<the question>"' };
      const r = checkExplain(code);
      if (!r.plan) return { ok: false, problems: r.problems };
      return { ok: true, link: await linkFor(code, env), ...lengths(r.plan), warnings: r.problems, compiled: compiledListing(r.plan) };
    },
  },
};

const INSTRUCTIONS = `${ROLE}

${STYLE}

Tools: method_steps gives the platform and the method's steps, in order, for a kind of work; call it first. explanation_guide holds the language, its rules, worked examples and the whole knowledge graph. graph_concepts, graph_links, concept_evidence and find_in_site help with the mapping; check_explanation checks a draft; make_explanation stores it and returns a short link that plays it for the person; give the person that link.`;

type RpcMessage = { jsonrpc: '2.0'; id?: string | number | null; method?: string; params?: Record<string, unknown> };
const reply = (id: RpcMessage['id'], result: unknown) => ({ jsonrpc: '2.0', id, result });
const fail = (id: RpcMessage['id'], code: number, message: string) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

const handle = async (m: RpcMessage, env: Env) => {
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
      return reply(m.id, { tools: Object.entries(REMOTE).map(([name, t]) => ({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: { title: t.title, readOnlyHint: t.readOnly, ...(t.readOnly ? {} : { destructiveHint: false, idempotentHint: true }), openWorldHint: false } })) });
    case 'tools/call': {
      const name = String(m.params?.name ?? '');
      const tool = REMOTE[name];
      if (!tool) return fail(m.id, -32602, `unknown tool "${name}"`);
      try {
        const out = (await tool.run((m.params?.arguments ?? {}) as never, env)) as Record<string, unknown>;
        return reply(m.id, { content: [{ type: 'text', text: JSON.stringify(out, null, 1) }], structuredContent: out, isError: Boolean(out && 'error' in out) });
      } catch (e) {
        return reply(m.id, { content: [{ type: 'text', text: `The tool failed: ${(e as Error).message}` }], isError: true });
      }
    }
    default: return fail(m.id, -32601, `method not found: ${m.method}`);
  }
};

const mcp = async (request: Request, env: Env) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return new Response('This MCP server answers POST requests (Streamable HTTP, JSON responses).', { status: 405, headers: { ...CORS, allow: 'POST, OPTIONS' } });
  const body = await request.text();
  if (body.length > 64_000) return new Response(JSON.stringify(fail(null, -32600, 'request too large')), { status: 413, headers: { ...CORS, 'content-type': 'application/json' } });
  let parsed: RpcMessage | RpcMessage[];
  try { parsed = JSON.parse(body); } catch { return new Response(JSON.stringify(fail(null, -32700, 'parse error')), { status: 400, headers: { ...CORS, 'content-type': 'application/json' } }); }
  const messages = Array.isArray(parsed) ? parsed : [parsed];
  const answers = (await Promise.all(messages.map((m) => handle(m, env)))).filter(Boolean);
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
    if (url.pathname === '/mcp' || url.pathname === '/mcp/') return mcp(request, env);
    if (url.pathname.startsWith('/api/explanations/')) return storedExplanation(url.pathname.split('/')[3] ?? '', env);
    // A stored explanation's short link: the page that fetches it by id and plays it.
    if (/^\/e\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) {
      const res = await env.ASSETS.fetch(new Request(new URL('/explain/saved/', url)));
      const headers = new Headers(res.headers); headers.set('x-robots-tag', 'noindex');
      return new Response(res.body, { status: res.status, headers });
    }
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
