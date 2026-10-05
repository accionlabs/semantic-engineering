import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../reel/tools';
import { CONTACT, MCP_URL, SITE } from '../reel/prompt';

const EXAMPLE_PROMPTS = [
  'Help me understand how the dialect engineering paper applies to our onboarding. It takes us months and customers find configuration errors after go-live.',
  'We sell a payroll product priced by tier, and customers say they pay for features they never use. What does the paper suggest?',
  'We are starting a new HR product from scratch. What would the paper have us design differently?',
  'Our customers keep asking for changes that end up as special cases in shared code. How does the paper see that problem, and where would we start?',
];

/** Documentation for the MCP connector: what it does, how to add it, its tools, and example prompts. */
export const ConnectPage: React.FC = () => (
  <div className="wrap narrow">
    <p className="kicker" style={{ marginTop: 28 }}>For agents</p>
    <h1>The Dialect Engineering connector</h1>
    <p className="lede muted">An MCP server that helps an agent explain how the paper <em>SaaS architecture when code is cheap</em> applies to a person's own product.</p>

    <h2>What it does</h2>
    <p>The connector gives an agent the paper's knowledge graph: the layers of a SaaS product, the symptoms a provider sees today, the principles that address them, the recommendations for new and existing products, and the limits the paper states, each tied to the passages of the paper and the moments in its explainer video that support it.</p>
    <p>With it, an agent can interview a person about their product, map what they describe onto the paper, and write an explanation in a small language built on the graph. The connector checks that explanation against the graph and the paper's rules, and returns a link. Opening the link plays the explanation on this site as a short video: the recorded narration explains the paper, and the agent's lines connect it to the person's question.</p>

    <h2>Add it</h2>
    <p>Server address: <code>{MCP_URL}</code>. It uses Streamable HTTP, needs no sign-in or account, and every tool is read-only.</p>
    <ul>
      <li><strong>Claude (web, desktop and mobile):</strong> in Settings, under Connectors, add a custom connector with the address above.</li>
      <li><strong>Claude Code:</strong> <code>claude mcp add --transport http dialect-engineering {MCP_URL}</code></li>
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
    <p className="muted">For {SITE.replace('https://', '')} and its MCP connector at {MCP_URL.replace('https://', '')}. Last updated 30 September 2026.</p>

    <h2>What we collect</h2>
    <p>We collect no personal data. The site has no accounts, no analytics, no advertising and no tracking cookies, and its fonts and media are served from this domain.</p>
    <p>When an agent uses the connector, the server receives the tool requests it sends, such as a search phrase or the text of an explanation to check, and returns a result. It does not store requests or results, and it keeps no record of who called it.</p>

    <h2>What stays in your browser</h2>
    <p>The site keeps a few things in your browser's local storage: your colour theme, the guide voice you chose, and the explanations you have played, with the questions and descriptions they contain, so that you or an agent working in your browser can return to them. None of this is sent to us. You can remove it with "Clear the history" on the <Link to="/explain">explanations page</Link> or by clearing this site's data in your browser.</p>
    <p>When an agent gives you a link to an explanation, the explanation is carried in the part of the link after the "#", which browsers do not send to the server.</p>

    <h2>Speech</h2>
    <p>The guide's lines in an explanation are read aloud by your browser's own speech feature. Some browsers use an online voice service for some voices, in which case that browser's provider processes the text of those lines under its own policy. Choose a voice installed on your device to keep the text on your device.</p>

    <h2>Hosting and third parties</h2>
    <p>The site and the connector are hosted on Cloudflare, which processes each request to deliver and protect the service, under the <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare privacy policy</a>. We do not share data with anyone else, and we do not sell data. Links to other sites, such as the sources cited in the paper, lead to services with their own policies.</p>

    <h2>Retention</h2>
    <p>We retain nothing, because we store nothing. What your browser keeps stays until you clear it.</p>

    <h2>Contact</h2>
    <p>Questions about this policy: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
  </div>
);
