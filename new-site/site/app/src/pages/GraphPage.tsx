import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDGES, NODES, nodeById, type Evidence, type Kind, type Node } from '../reel/graph';
import { PLACES, sceneByN } from '../reel/vocab';
import { sectionHref } from '../content/data';

// The knowledge graph of the paper's domain, laid out for the author's review.
const KINDS: { kind: Kind; title: string; note: string }[] = [
  { kind: 'context', title: 'Contexts', note: 'Where the product starts.' },
  { kind: 'layer', title: 'Layers', note: 'The stack, top to bottom, with the scene that shows each today and after the line moves.' },
  { kind: 'demand', title: 'Demands', note: 'What customers now expect.' },
  { kind: 'cause', title: 'Cause', note: 'What the symptoms trace back to.' },
  { kind: 'symptom', title: 'Symptoms', note: 'What a provider sees today, by layer.' },
  { kind: 'principle', title: 'Principles', note: 'The parts of the approach.' },
  { kind: 'recommendation', title: 'Recommendations', note: 'What to do, by context.' },
  { kind: 'limit', title: 'Limits', note: 'What the paper says the approach does not guarantee.' },
  { kind: 'case', title: 'Cases', note: 'The two applications.' },
];
const REL: Record<string, [string, string]> = {
  meets: ['meets', 'is met by'], 'occurs-in': ['occurs in', 'has'], 'caused-by': ['is caused by', 'causes'], 'addressed-by': ['is addressed by', 'addresses'],
  requires: ['requires', 'is required by'], 'limited-by': ['is limited by', 'limits'], 'shown-in': ['is shown in', 'shows'], 'applies-to': ['applies to', 'is the path for'],
};


const Quote: React.FC<{ ev: Evidence }> = ({ ev }) => (
  <ul className="g-ev">
    {(ev.video ?? []).map((v) => {
      const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/)!; const s = sceneByN(Number(m[1]))!;
      const text = s.sentences.slice(Number(m[2]) - 1, Number(m[3] ?? m[2])).map((x) => x.text).join(' ');
      return <li key={v}><Link className="g-ref" to={`/watch/scene-${s.n}`}>video {v}</Link> {text}</li>;
    })}
    {(ev.paper ?? []).map((p) => {
      const m = p.match(/^(\d+(?:\.\d+)?)(?: p(\d+))?$/)!; const pl = PLACES[m[1]];
      const text = m[2] ? pl.paras[Number(m[2]) - 1].text : `${pl.number}. ${pl.title}`;
      return <li key={p}><Link className="g-ref" to={sectionHref(pl.section, pl.anchor)}>paper {p}</Link> {text.length > 320 ? text.slice(0, 318) + '…' : text}</li>;
    })}
  </ul>
);

const Card: React.FC<{ node: Node }> = ({ node }) => {
  const [open, setOpen] = useState(false);
  const outE = EDGES.filter((x) => x.from === node.id), inE = EDGES.filter((x) => x.to === node.id);
  const groups = new Map<string, { id: string; why: Evidence }[]>();
  outE.forEach((x) => { const k = REL[x.rel][0]; groups.set(k, [...(groups.get(k) ?? []), { id: x.to, why: x.why }]); });
  inE.forEach((x) => { const k = REL[x.rel][1]; groups.set(k, [...(groups.get(k) ?? []), { id: x.from, why: x.why }]); });
  if (node.layer) groups.set('occurs in', [{ id: node.layer, why: {} }, ...(groups.get('occurs in') ?? [])]);
  return (
    <article className={`g-card g-${node.kind}`} id={node.id}>
      <header><strong>{node.label}</strong> <code>{node.id}</code>{node.contexts && <span className="g-tag">{node.contexts.join(', ')}</span>}{node.today && <span className="g-tag">today: scene {node.today} · after: scene {node.after}</span>}</header>
      <p className="g-def">{node.definition}</p>
      <div className="g-rels">
        {[...groups.entries()].map(([rel, list]) => (
          <p key={rel}><span className="g-rel">{rel}</span> {list.map((x, i) => <React.Fragment key={x.id + i}>{i ? ', ' : ''}<a href={`#${x.id}`}>{nodeById(x.id)?.label ?? x.id}</a></React.Fragment>)}</p>
        ))}
      </div>
      <button className="linkish" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide evidence' : 'Show evidence'}</button>
      {open && (
        <div>
          <p className="kicker">Evidence for the node</p>
          <Quote ev={node.evidence} />
          {outE.length > 0 && <p className="kicker">Evidence for its links</p>}
          {outE.map((x) => <div key={x.rel + x.to}><p className="g-link-title">{REL[x.rel][0]} {nodeById(x.to)?.label}</p><Quote ev={x.why} /></div>)}
        </div>
      )}
    </article>
  );
};

export const GraphPage: React.FC = () => {
  const symptoms = NODES.filter((x) => x.kind === 'symptom');
  const fixes = useMemo(() => [...new Set(EDGES.filter((x) => x.rel === 'addressed-by' && nodeById(x.from)?.kind === 'symptom').map((x) => x.to))].map((id) => nodeById(id)!), []);
  return (
    <div className="wrap wide graph-page">
      <p className="kicker" style={{ marginTop: 28 }}>The knowledge graph</p>
      <h1>The knowledge graph of the paper</h1>
      <p className="lede muted">{NODES.length} concepts and {EDGES.length} links, each tied to the sentences of the video and the paragraphs of the paper that support it. Agents use it to map the paper's approach onto a person's own problem.</p>
      <p>The same graph drives the <Link to="/explain">explanations</Link>: an agent maps a person's problem onto these concepts, and every link it draws must be one listed here.</p>

      <h2>Symptoms and what addresses them</h2>
      <div className="table-wrap">
        <table className="g-matrix">
          <thead><tr><th>Layer</th><th>Symptom</th>{fixes.map((f) => <th key={f.id} className="g-col"><a href={`#${f.id}`}><span>{f.label}</span></a></th>)}</tr></thead>
          <tbody>
            {symptoms.map((s) => (
              <tr key={s.id}>
                <td className="muted">{nodeById(s.layer!)?.label}</td>
                <td><a href={`#${s.id}`}>{s.label}</a></td>
                {fixes.map((f) => <td key={f.id} className="g-cell">{EDGES.some((x) => x.from === s.id && x.rel === 'addressed-by' && x.to === f.id) ? '●' : ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {KINDS.map(({ kind, title, note }) => (
        <section key={kind}>
          <h2>{title} <span className="muted" style={{ fontSize: '1rem', fontWeight: 400 }}>· {NODES.filter((x) => x.kind === kind).length}</span></h2>
          <p className="muted">{note}</p>
          <div className="g-grid">{NODES.filter((x) => x.kind === kind).map((x) => <Card key={x.id} node={x} />)}</div>
        </section>
      ))}
    </div>
  );
};
