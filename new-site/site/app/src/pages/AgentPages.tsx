import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../reel/tools';
import { CONTACT, MCP_URL, SITE } from '../reel/prompt';

const EXAMPLE_PROMPTS = [
  'Help me understand how Semantic Engineering applies to our application. Our coding agents keep breaking services other teams depend on.',
  'We have a two-million-line Java application and every change needs days of investigation first. Where would Semantic Engineering have us start?',
  'Our new UI keeps rebuilding components the design system already has. What does Semantic Engineering suggest?',
  'The people who understood our COBOL system have retired. How would a legacy modernization with Semantic Engineering work for us?',
];

/** Documentation for the MCP connector: what it does, how to add it, its tools, and example prompts. */
export const ConnectPage: React.FC = () => (
  <div className="wrap narrow">
    <p className="kicker" style={{ marginTop: 28 }}>For agents</p>
    <h1>The Semantic Engineering connector</h1>
    <p className="lede muted">An MCP server that helps an agent explain how Semantic Engineering applies to a person's own software work.</p>

    <h2>What it does</h2>
    <p>The connector gives an agent the knowledge graph of the method: the four layers of knowledge and their custodians, the symptoms a team sees today and their causes, the principles and practices that address them, the recommendations for new applications, existing applications and legacy modernization, and the limits the content states, each tied to the passages of the site and the moments in its film that support it.</p>
    <p>With it, an agent can ask a person about their situation, map what they describe onto the method, and write an explanation in a small language built on the graph. The connector checks that explanation against the graph and the method's rules, and returns a link. Opening the link plays the explanation on this site as a short film: the recorded narration explains the method, and the agent's lines connect it to the person's question.</p>

    <h2>Add it</h2>
    <p>Server address: <code>{MCP_URL}</code>. It uses Streamable HTTP, needs no sign-in or account, and every tool is read-only.</p>
    <ul>
      <li><strong>Claude (web, desktop and mobile):</strong> in Settings, under Connectors, add a custom connector with the address above.</li>
      <li><strong>Claude Code:</strong> <code>claude mcp add --transport http semantic-engineering {MCP_URL}</code></li>
      <li><strong>Other MCP clients:</strong> add a remote server over Streamable HTTP with the address above.</li>
      <li><strong>Agents in the browser:</strong> where a browser supports WebMCP, the site offers the same tools directly, with nothing to add.</li>
    </ul>

    <h2>Tools</h2>
    <div className="table-wrap"><table>
      <thead><tr><th>Tool</th><th>What it does</th></tr></thead>
      <tbody>
        {Object.entries(TOOLS).map(([name, t]) => <tr key={name}><td><code>{name}</code></td><td>{t.description}</td></tr>)}
        <tr><td><code>make_explanation</code></td><td>Checks an explanation and, if it passes, returns a link that opens it on this site in the person's own browser, where it plays and is saved there. The explanation travels in the link itself; the server keeps nothing.</td></tr>
      </tbody>
    </table></div>
    <p>The language and the whole graph are also published at <a href="/explanation-language.md">/explanation-language.md</a>, and the graph with its evidence at <Link to="/graph">/graph</Link>.</p>

    <h2>Example prompts</h2>
    <ul>{EXAMPLE_PROMPTS.map((p) => <li key={p}>{p}</li>)}</ul>

    <h2>Privacy and support</h2>
    <p>The connector keeps no data and needs no account. See the <Link to="/privacy">privacy policy</Link>. For questions or problems, contact <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="wrap narrow">
    <p className="kicker" style={{ marginTop: 28 }}>Privacy</p>
    <h1>Privacy policy</h1>
    <p className="muted">For {SITE.replace('https://', '')} and its MCP connector at {MCP_URL.replace('https://', '')}. Draft of 6 October 2026, for review before publishing.</p>

    <h2>What we collect</h2>
    <p>The site has no accounts and no advertising. It uses Google Analytics to count visits and see which pages are read, which sets cookies and sends Google the address of each page viewed and general information about the browser and device, under the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google privacy policy</a>.</p>
    <p>When an agent uses the connector, the server receives the tool requests it sends, such as a search phrase or the text of an explanation to check, and returns a result. It does not store requests or results, and it keeps no record of who called it. The connector sends nothing to Google Analytics.</p>

    <h2>What stays in your browser</h2>
    <p>The site keeps a few things in your browser's local storage: your colour theme, the guide voice you chose, and the explanations you have played, with the questions and descriptions they contain, so that you or an agent working in your browser can return to them. None of this is sent to us. You can remove it with "Clear the history" on the <Link to="/explain">explanations page</Link> or by clearing this site's data in your browser.</p>
    <p>When an agent gives you a link to an explanation, the explanation is carried in the part of the link after the "#", which browsers do not send to the server.</p>

    <h2>Speech</h2>
    <p>The guide's lines in an explanation are read aloud by your browser's own speech feature. Some browsers use an online voice service for some voices, in which case that browser's provider processes the text of those lines under its own policy. Choose a voice installed on your device to keep the text on your device.</p>

    <h2>Hosting</h2>
    <p>The site and the connector are hosted on Cloudflare, which processes each request to deliver and protect the service, under the <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare privacy policy</a>. We do not sell data.</p>

    <h2>Contact</h2>
    <p>Questions about this policy: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
  </div>
);
