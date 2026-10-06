// An explanation travels in the link's fragment (after "#"), which browsers never send to the server.
// It is compressed so the link stays short enough to survive chat apps and browsers: "z.<deflate-raw,
// base64url>". Links made before compression ("<base64url of the text>") still open.
// Uses only CompressionStream and DecompressionStream, which browsers and Cloudflare Workers both have.

const toB64url = (bytes: Uint8Array) => { let s = ''; bytes.forEach((b) => { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const pipe = async (bytes: Uint8Array, stream: CompressionStream | DecompressionStream) => {
  const w = stream.writable.getWriter(); w.write(bytes as unknown as BufferSource).catch(() => {}); w.close().catch(() => {});
  return new Uint8Array(await new Response(stream.readable).arrayBuffer());
};

/** The fragment for an explanation's text. */
export const packExplanation = async (code: string) => `z.${toB64url(await pipe(new TextEncoder().encode(code), new CompressionStream('deflate-raw')))}`;

/** The explanation's text from a fragment, or undefined when the link is incomplete or damaged. */
export const unpackExplanation = async (fragment: string): Promise<string | undefined> => {
  try {
    if (fragment.startsWith('z.')) return new TextDecoder('utf-8', { fatal: true }).decode(await pipe(fromB64url(fragment.slice(2)), new DecompressionStream('deflate-raw')));
    return new TextDecoder('utf-8', { fatal: true }).decode(fromB64url(fragment));
  } catch { return undefined; }
};
