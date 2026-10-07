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
    <p>With it, an agent can ask a person about their situation, map what they describe onto the method, and write an explanation in a small language built on the graph. The connector checks that explanation against the graph and the method's rules, stores it, and returns a short link. Opening the link plays the explanation on this site as a short film: the recorded narration explains the method, and the agent's lines connect it to the person's question.</p>

    <h2>Add it</h2>
    <p>Server address: <code>{MCP_URL}</code>. It uses Streamable HTTP and needs no sign-in or account. Every tool is read-only except make_explanation, which stores the explanation it is given.</p>
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
        <tr><td><code>make_explanation</code></td><td>Checks an explanation and, if it passes, stores it and returns a short link that plays it on this site. The same explanation always gets the same link. Stored explanations are kept for 90 days.</td></tr>
      </tbody>
    </table></div>
    <p>The language and the whole graph are also published at <a href="/explanation-language.md">/explanation-language.md</a>, and the graph with its evidence at <Link to="/graph">/graph</Link>.</p>

    <h2>Example prompts</h2>
    <ul>{EXAMPLE_PROMPTS.map((p) => <li key={p}>{p}</li>)}</ul>

    <h2>Privacy and support</h2>
    <p>The connector needs no account. It stores the explanations agents make with it, for 90 days, and nothing about who made them. See the <Link to="/privacy">privacy policy</Link>. For questions or problems, contact <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="wrap narrow">
    <p className="kicker" style={{ marginTop: 28 }}>Privacy</p>
    <h1>Privacy policy</h1>
    <p className="muted">For {SITE.replace('https://', '')} and its MCP connector at {MCP_URL.replace('https://', '')}. Last updated 6 October 2026.</p>

    <h2>What we collect</h2>
    <p>The site has no accounts and no advertising. It uses Google Analytics to count visits and see which pages are read, which sets cookies and sends Google the address of each page viewed and general information about the browser and device, under the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google privacy policy</a>.</p>
    <p>When an agent uses the connector, the server receives the tool requests it sends, such as a search phrase or the text of an explanation to check, and returns a result. When an agent makes an explanation for you, the server stores the text of that explanation, including the question and any description of you or your company the agent wrote into it, so that its short link can play it. Stored explanations are kept for 90 days and then deleted. Anyone with the link can play the explanation. The server keeps no record of who made an explanation or who called it, and the connector sends nothing to Google Analytics. To have a stored explanation removed sooner, write to the contact address below with its link.</p>

    <p>Explanations you build on the site from your choices stay in your browser. They are stored on the server only when you press Share, on the same terms as explanations an agent makes.</p>

    <h2>How we use it</h2>
    <p>We read stored explanations in aggregate, such as the kinds of work, the roles and the questions people ask, to improve the site and the method's content. The server also keeps anonymous counts of connector use: which tool was called, whether the explanation passed its checks and the first problem found, the name of the agent's software, and the country a request came from. These counts include no address and nothing that identifies a person. On the explanation pages, Google Analytics also records anonymous events, such as an explanation starting, a deep dive being chosen and an explanation being shared, with the kind of work and the role chosen, and never the text of a question.</p>

    <h2>What stays in your browser</h2>
    <p>The site keeps a few things in your browser's local storage: your colour theme, the guide voice you chose, and the explanations you have played, with the questions and descriptions they contain, so that you or an agent working in your browser can return to them. None of this is sent to us. You can remove it with "Clear the history" on the <Link to="/explain">explanations page</Link> or by clearing this site's data in your browser.</p>
    <p>When you open an explanation's link, your browser also saves a copy of it in its local storage, with your other explanations.</p>

    <h2>Speech</h2>
    <p>The guide's lines in an explanation are read aloud by your browser's own speech feature. Some browsers use an online voice service for some voices, in which case that browser's provider processes the text of those lines under its own policy. Choose a voice installed on your device to keep the text on your device.</p>

    <h2>Hosting</h2>
    <p>The site and the connector are hosted on Cloudflare, which processes each request to deliver and protect the service, under the <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare privacy policy</a>. We do not sell data.</p>

    <h2>Retention</h2>
    <p>Explanations made through the connector are kept for 90 days. What your browser keeps stays until you clear it.</p>

    <h2>Contact</h2>
    <p>Questions about this policy: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
  </div>
);
