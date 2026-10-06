// WebMCP: the page offers its tools to an agent running in the visitor's browser. Uses
// document.modelContext.registerTool (the current draft), falls back to navigator.modelContext, and does
// nothing where neither exists. Everything here stays in the visitor's browser.
import { TOOLS, lengths } from './tools';
import { checkExplain } from './explain';
import { reels } from './store';

type Registrar = { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => unknown };
const context = (): Registrar | undefined => {
  const d = (document as unknown as { modelContext?: Registrar }).modelContext;
  const n = (navigator as unknown as { modelContext?: Registrar }).modelContext;
  return d?.registerTool ? d : n?.registerTool ? n : undefined;
};

const text = (value: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 1) }] });

export const registerSiteTools = (navigate: (path: string) => void): (() => void) => {
  const mc = context();
  if (!mc) return () => {};
  const controller = new AbortController();
  const add = (tool: { name: string; title: string; description: string; inputSchema: object; readOnly: boolean; run: (input: never) => unknown }) => {
    try {
      mc.registerTool({
        name: tool.name, title: tool.title, description: tool.description, inputSchema: tool.inputSchema,
        annotations: { readOnlyHint: tool.readOnly },
        execute: async (input: never) => text(await tool.run(input ?? ({} as never))),
      }, { signal: controller.signal });
    } catch { /* an older or partial implementation: skip this tool */ }
  };

  for (const [name, t] of Object.entries(TOOLS)) add({ name, title: t.title, description: t.description, inputSchema: t.inputSchema, readOnly: true, run: t.run as (input: never) => unknown });

  add({
    name: 'play_explanation', title: 'Play an explanation here',
    description: 'Checks an explanation and, if it passes, saves it in this browser and plays it on the page. Returns problems with their lines if it does not pass.',
    inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] }, readOnly: false,
    run: ({ code }: { code: string }) => {
      if (typeof code !== 'string' || !code.trim()) return { error: 'give the explanation as text in "code", starting with: explain "<the question>"' };
      const r = checkExplain(code);
      if (!r.plan) return { ok: false, problems: r.problems };
      const saved = reels.save(code, { question: r.plan.question, audience: r.plan.audience }, 'agent');
      navigate(`/explain/${saved.id}`);
      return { ok: true, id: saved.id, url: `${location.origin}/explain/${saved.id}`, ...lengths(r.plan), warnings: r.problems };
    },
  });
  add({
    name: 'explanation_history', title: "This person's earlier questions",
    description: 'Returns the explanations saved in this browser: the questions this person asked, who they said they were, and the concepts each explanation used.',
    inputSchema: { type: 'object', properties: {} }, readOnly: true,
    run: () => ({
      explanations: reels.list().map((r) => {
        const plan = checkExplain(r.code).plan;
        return { id: r.id, question: r.question, for: r.audience, created: r.created, context: plan?.context, layers: plan?.layers, unowned: plan?.unowned, concepts: [...new Set(plan?.segments.map((s) => s.trace?.node).filter(Boolean))], source: r.code };
      }),
    }),
  });
  add({
    name: 'where_am_i', title: 'What the person is looking at',
    description: 'The page the person has open on the site.',
    inputSchema: { type: 'object', properties: {} }, readOnly: true,
    run: () => ({ path: location.pathname, title: document.querySelector('h1, .companion-title')?.textContent ?? document.title }),
  });
  add({
    name: 'open_page', title: 'Open a page of the site',
    description: 'Opens a page of the site: "/", "/graph", "/explain", "/watch/scene-<n>", "/watch/role-<slug>", or a content page such as "/sdlc/agents/".',
    inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }, readOnly: false,
    run: ({ path }: { path: string }) => { if (!path.startsWith('/') || path.startsWith('//')) return { error: 'give a path on this site, starting with "/"' }; navigate(path); return { ok: true, path }; },
  });
  return () => controller.abort();
};
