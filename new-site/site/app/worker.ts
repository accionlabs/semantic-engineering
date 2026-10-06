// The site's Worker. It runs before the static assets to:
//   - send www.semantic-engineering.ai to the bare domain, keeping the path,
//   - serve /media/* with byte ranges, so the player can seek within the narration (Cloudflare's static
//     assets answer a byte-range request with the whole file).
// Everything else is a static asset.
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) { url.hostname = url.hostname.slice(4); return Response.redirect(url.toString(), 301); }
    if (url.pathname.startsWith('/media/')) return media(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
