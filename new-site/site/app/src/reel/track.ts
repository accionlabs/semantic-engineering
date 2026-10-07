// Anonymous events for Google Analytics, sent only where the site's analytics are loaded (the production
// host). They carry choices and counts, never the text of a question.
declare global { interface Window { gtag?: (...a: unknown[]) => void } }
export const track = (event: string, params: Record<string, string | number | boolean> = {}) => {
  try { if (typeof window !== 'undefined') window.gtag?.('event', event, params); } catch { /* analytics never break the page */ }
};
