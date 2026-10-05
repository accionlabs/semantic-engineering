import React from 'react';
import type { Block } from '../content/data';

// Diagrams are loaded if present, so the page renders while any diagram is still being drawn.
const modules = import.meta.glob('../diagrams/D*.tsx', { eager: true }) as Record<string, Record<string, React.FC>>;
const DIAGRAMS: Record<string, React.FC> = {};
for (const [file, mod] of Object.entries(modules)) {
  const id = file.match(/D(\d+)\.tsx$/)?.[1];
  const C = Object.values(mod).find((v) => typeof v === 'function');
  if (id && C) DIAGRAMS[`d${id}`] = C as React.FC;
}

export const Blocks: React.FC<{ blocks: Block[] }> = ({ blocks }) => (
  <div className="prose">
    {blocks.map((b, i) => {
      if (b.type === 'html') return <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
      const D = DIAGRAMS[b.id];
      return <figure key={i} className="figure" data-diagram={b.id}>{D ? <D /> : <pre className="muted">{b.source}</pre>}</figure>;
    })}
  </div>
);
