import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDGES, NODES, nodeById, type Evidence, type Kind, type Node } from '../reel/graph';
import { placeOf, placeText, sceneByN } from '../reel/vocab';

// The knowledge graph of Semantic Engineering, laid out for the author's review: every concept and link
// with the film's sentences and the pages' passages that support it.
const KINDS: { kind: Kind; title: string; note: string }[] = [
  { kind: 'context', title: 'Kinds of work', note: 'New applications, existing applications, and legacy modernization.' },
  { kind: 'platform', title: 'Platforms', note: 'Breeze.AI runs new and existing applications; ASIMOV runs legacy modernization.' },
  { kind: 'step', title: 'The method, step by step', note: 'Each kind of work has one starting step, marked, and the steps that follow it in order.' },
  { kind: 'layer', title: 'Layers of knowledge', note: 'The four kinds of knowledge, each with its custodian and the film\'s moments for it today and under the method.' },
  { kind: 'cause', title: 'Causes', note: 'What the symptoms trace back to: the Manual Translation Tax and the Modernization Translation Tax, with their components.' },
  { kind: 'symptom', title: 'Symptoms', note: 'What a team sees today, by the layer of knowledge where it shows.' },
  { kind: 'principle', title: 'The four principles', note: 'What holds in every kind of work.' },
  { kind: 'practice', title: 'Practices', note: 'How the principles work, for live applications and for legacy modernization.' },
  { kind: 'recommendation', title: 'Recommendations', note: 'What to do, by kind of work.' },
  { kind: 'limit', title: 'Limits', note: 'Where the content says the method stops.' },
  { kind: 'case', title: 'Cases', note: 'Engagements and examples, each with its figures in its own context.' },
];
const REL: Record<string, [string, string]> = {
  'part-of': ['is part of', 'has the component'], 'caused-by': ['is caused by', 'causes'], 'addressed-by': ['is addressed by', 'addresses'],
  requires: ['requires', 'is required by'], 'limited-by': ['is limited by', 'limits'], 'shown-in': ['is shown in', 'shows'], 'applies-to': ['applies to', 'is recommended by'],
  precedes: ['then', 'comes after'], uses: ['carries out', 'is carried out by'], 'runs-on': ['runs on', 'runs'],
};
const WORK: Record<string, string> = { greenfield: 'new applications', brownfield: 'existing applications', 'legacy-modernization': 'legacy modernization' };

const Quote: React.FC<{ ev?: Evidence }> = ({ ev }) => (
  <ul className="g-ev">
    {(ev?.video ?? []).map((v) => {
      const m = v.match(/^(\d+)\.(\d+)(?:-(\d+))?$/)!; const s = sceneByN(Number(m[1]))!;
      const text = s.sentences.slice(Number(m[2]) - 1, Number(m[3] ?? m[2])).map((x) => x.text).join(' ');
      return <li key={v}><Link className="g-ref" to={`/watch/scene-${s.n}`}>film {v}</Link> {text}</li>;
    })}
    {(ev?.pages ?? []).map((p) => {
      const pl = placeOf(p)!; const text = placeText(pl);
      return <li key={p}><Link className="g-ref" to={pl.url}>{p}</Link> <strong>{pl.page.title}{pl.anchor ? ` · ${pl.section.title}` : ''}</strong>{text ? ': ' : ''}{text.length > 320 ? text.slice(0, 318) + '…' : text}</li>;
    })}
  </ul>
);

const Card: React.FC<{ node: Node }> = ({ node }) => {
  const [open, setOpen] = useState(false);
  const outE = EDGES.filter((x) => x.from === node.id), inE = EDGES.filter((x) => x.to === node.id);
  const groups = new Map<string, string[]>();
  if (node.layer) groups.set('shows in', [node.layer]);
  outE.forEach((x) => { const k = REL[x.rel][0]; groups.set(k, [...(groups.get(k) ?? []), x.to]); });
  inE.forEach((x) => { const k = REL[x.rel][1]; groups.set(k, [...(groups.get(k) ?? []), x.from]); });
  return (
    <article className={`g-card g-${node.kind}`} id={node.id}>
      <header><strong>{node.label}</strong> <code>{node.id}</code>{node.start && <span className="g-tag">the method starts here</span>}{node.order && <span className="g-tag">step {node.order}</span>}{node.platform && <span className="g-tag">{node.platform === 'asimov' ? 'ASIMOV' : 'Breeze.AI'}</span>}{node.custodian && <span className="g-tag">kept by the {node.custodian}</span>}{node.contexts && <span className="g-tag">{node.contexts.map((c) => WORK[c]).join(', ')}</span>}</header>
      <p className="g-def">{node.definition}</p>
      <div className="g-rels">
        {[...groups.entries()].map(([rel, list]) => (
          <p key={rel}><span className="g-rel">{rel}</span> {list.map((id, i) => <React.Fragment key={id + i}>{i ? ', ' : ''}<a href={`#${id}`}>{nodeById(id)?.label ?? id}</a></React.Fragment>)}</p>
        ))}
      </div>
      <button className="linkish" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide evidence' : 'Show evidence'}</button>
      {open && (
        <div>
          <p className="kicker">Evidence for the concept</p>
          <Quote ev={node.evidence} />
          {node.today && <><p className="g-link-title">Today</p><Quote ev={node.today} /><p className="g-link-title">Under the method</p><Quote ev={node.after} /></>}
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
      <h1>The knowledge graph of Semantic Engineering</h1>
      <p className="lede muted">{NODES.length} concepts and {EDGES.length} links, each tied to the sentences of the film and the passages of the pages that support it. Agents use it to map the method onto a person's own situation.</p>
      <p>The same graph drives the <Link to="/explain">explanations</Link>: an agent maps a person's situation onto these concepts, and every link it draws must be one listed here. This graph describes the method; it is separate from the knowledge graph Breeze.AI builds of an application.</p>
      <p className="g-review">Draft for the author's review. Each concept and link is a claim about the method; open its evidence to check it.</p>

      <h2>Symptoms and what addresses them</h2>
      <div className="table-wrap">
        <table className="g-matrix">
          <thead><tr><th>Layer</th><th>Symptom</th>{fixes.map((f) => <th key={f.id} className="g-col"><a href={`#${f.id}`}><span>{f.label}</span></a></th>)}</tr></thead>
          <tbody>
            {symptoms.map((s) => (
              <tr key={s.id}>
                <td className="muted">{s.layer ? nodeById(s.layer)?.label.replace(' knowledge', '') : ''}</td>
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
          <div className="g-grid">{NODES.filter((x) => x.kind === kind).sort((a, b) => kind === 'step' ? (a.platform ?? '').localeCompare(b.platform ?? '') || (a.order ?? 0) - (b.order ?? 0) : 0).map((x) => <Card key={x.id} node={x} />)}</div>
        </section>
      ))}
    </div>
  );
};
