# FL-05 — Agent Concepts & Model Context Protocol (MCP)

**Assignment:** Agent Concepts & MCP Integration (FL-05)
**Track:** General AI Fluency
**Intern:** Zain Ul Abideen
**Tool:** Magic UI MCP Server, Vercel MCP, MCP Documentation

---

## 1. Assignment Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Read MCP docs (architecture, primitives, transport) | Done | MCP architecture, server concepts, client concepts studied |
| Connect an MCP server | Done | Magic UI MCP server connected and used |
| 3 tool-using tasks | Done | `listRegistryItems`, `searchRegistryItems`, `getRegistryItem` |
| 600-900 word explainer | Done | Section 4 + 4a (~850 words combined) |
| Connection to Plinth | Done | Section 5 + 5a |
| Screenshots / evidence | Done | Screenshots captured (see Section 8) |

---

## 2. MCP Research Summary

### What is MCP?

Model Context Protocol (MCP) is an open standard (Jan 2025, by Anthropic) that defines how AI applications connect to external tools, data sources, and workflows. It uses a client-server architecture:

- **MCP Host** — AI app (Claude, VS Code, Cursor, ChatGPT)
- **MCP Client** — component maintaining connection to a server
- **MCP Server** — exposes tools, resources, and prompts via JSON-RPC 2.0

### Architecture

MCP has two layers:

1. **Data layer** — JSON-RPC 2.0 protocol defining discovery (`server/discover`), primitives (tools, resources, prompts), notifications, and caching
2. **Transport layer** — STDIO (local processes) or Streamable HTTP (remote servers)

### Core Primitives

| Primitive | Control | Purpose |
|-----------|---------|---------|
| **Tools** | Model-controlled | Executable functions the LLM calls (search flights, send emails, query DB) |
| **Resources** | Application-controlled | Read-only data sources (files, DB schemas, API responses) |
| **Prompts** | User-controlled | Reusable templates that guide LLM interactions |

### Key Features (Protocol 2026-07-28)

- **Stateless protocol** — every request carries version + capabilities in `_meta`
- **Server discovery** — mandatory `server/discover` endpoint for version/capability negotiation
- **Caching** — results include `ttlMs` + `cacheScope` for client-side caching
- **Notifications** — opt-in real-time updates via `subscriptions/listen` streams
- **Pagination** — cursor-based for listing primitives
- **Authorization** — OAuth 2.1 recommended, supports bearer tokens, API keys
- **MCP Apps** — sandboxed iframe UIs rendered alongside agent output (new in protocol 2026)
- **Multi Round-Trip Requests** — for elicitation (user confirmation flows)

### Ecosystem

MCP is supported across Claude Desktop, Claude Code, VS Code Copilot, Cursor, ChatGPT, and more. Public registries exist at `modelcontextprotocol.io/registry` and `github.com/modelcontextprotocol/servers`. Vercel, OpenAI, Sentry, and Cloudflare all host production MCP servers.

---

## 3. MCP Tool Usage Evidence

Three distinct MCP tool calls were performed using the Magic UI design MCP server connected in this environment:

### Tool Call 1: `listRegistryItems` — Discover available components

```
listRegistryItems(limit: 5)
```

Returned 247 total items across 4 kinds (component, example, lib, style). Listed the first 5: `android`, `android-demo`, `android-demo-2`, `android-demo-3`, `animated-beam`.

**Relevance:** Demonstrates the `tools/list` pattern — the host discovers what tools are available before using them.

### Tool Call 2: `searchRegistryItems` — Search for specific components

```
searchRegistryItems(query: "animated background", limit: 3)
```

Returned 80 matches. Top 3: `animated-gradient-text`, `animated-gradient-text-demo`, `animated-gradient-text-demo-2`.

**Relevance:** Shows how tools support search/filter parameters — analogous to a resource template with dynamic query parameters.

### Tool Call 3: `getRegistryItem` — Get detailed component info with source

```
getRegistryItem(name: "animated-beam", includeSource: true)
```

Returned full component metadata: dependencies (`motion`), install command, and complete source code (an `AnimatedBeam` React component with SVG path animation via `motion`).

**Relevance:** Demonstrates `tools/call` — executing a tool with specific arguments and getting structured content back.

---

## 4. Explainer: Why MCP Matters for AI Agents

MCP solves a fundamental problem: every AI application used to need custom integration code for every external system. If you wanted Claude to read your files, query your database, and send Slack messages, that was three separate integrations, each with its own auth, format, and error handling. MCP standardizes this into a single protocol.

Think of MCP as USB-C for AI. Before USB-C, every peripheral needed a different cable. After USB-C, one cable works for monitors, drives, keyboards, and chargers — the device negotiates what it needs over a standard connection. MCP does the same for AI: one protocol handles tools (actions), resources (data), and prompts (templates), regardless of the provider.

The architecture separates concerns cleanly. An MCP server exposes its capabilities through three primitives. Tools are the most powerful — they let the LLM perform actions like searching, writing, or calling APIs. Resources provide read-only context like files or database schemas. Prompts are user-invoked templates that structure how the LLM should work.

MCP is stateless by design. Every request carries protocol version and capabilities in its metadata, so servers don't need session state. This makes MCP horizontally scalable — you can route requests to any server instance without sticky sessions.

The protocol supports real-time notifications. When a server's available tools change (e.g., a new integration is added), it pushes a notification to subscribed clients. The client refreshes its tool registry without polling.

For transport, MCP supports STDIO for local servers (fast, no network overhead) and Streamable HTTP for remote servers (standard REST with SSE for streaming). Authorization uses OAuth 2.1 by default, with bearer tokens and API keys as alternatives.

The ecosystem is growing fast. Anthropic's Claude was first, but now VS Code Copilot, Cursor, ChatGPT, and many others support MCP. Companies like Vercel, Sentry, and Cloudflare host production MCP servers. There are 247+ components in the Magic UI registry alone, each accessible through MCP.

The key insight: MCP doesn't replace AI frameworks. It complements them. The AI SDK (in your Plinth stack) handles model orchestration and streaming; MCP handles tool integration and context. Together they form a complete agent infrastructure.

### Transport Layer Deep Dive

MCP's two transport options serve different deployment scenarios:

**STDIO (Stream I/O):** The client spawns the server as a child process and communicates over stdin/stdout. This is ideal for local development — zero network latency, no port conflicts, and the server lifecycle matches the client. Tools like `@modelcontextprotocol/server-filesystem` and `@modelcontextprotocol/server-github` run this way in Claude Desktop and VS Code. The tradeoff: the server only lives as long as the client process, so state (if any) must be re-established on each connection.

**Streamable HTTP:** The server runs as an independent HTTP endpoint, typically with Server-Sent Events (SSE) for streaming responses. This enables remote hosting, horizontal scaling, and persistent server processes. Vercel's MCP servers, Sentry's MCP integration, and Cloudflare's AI Gateway MCP endpoints all use this transport. The client sends JSON-RPC 2.0 requests over HTTP POST, and the server streams back deltas when the response is a tool call with streaming output.

Authorization follows OAuth 2.1 as the recommended flow, with bearer tokens and API keys as simpler alternatives for internal servers. The `_meta` object in every request carries the protocol version (currently 2026-07-28) and capability flags, so servers can reject incompatible clients early.

### Caching and Performance

MCP responses include two caching fields: `ttlMs` (how long the result is valid, in milliseconds) and `cacheScope` (either `session` or `global`). A client can cache tool results within a session to avoid redundant work — for example, if two consecutive prompts both call `listRegistryItems`, the second call can return cached results. Servers control cache invalidation via notifications through the subscription system, so stale data is purged without polling.

### Real-World MCP Ecosystem

The ecosystem spans multiple domains:

- **Development:** GitHub MCP Server (repo operations, PR management), Filesystem Server (read/write local files), Database Servers (PostgreSQL, SQLite schema introspection)
- **Infrastructure:** Vercel MCP (deployment management), Cloudflare MCP (AI Gateway, Workers), Sentry MCP (error tracking, performance monitoring)
- **Design & Content:** Magic UI MCP (component registry, 247+ components), Figma MCP (design tokens, component inspection)
- **Protocol Tools:** MCP Inspector (test and debug MCP servers), Playwright MCP (browser automation), WebMCP (browser-to-agent structured tool exposure)

This diversity makes MCP a genuine protocol standard rather than a single-vendor integration layer. Any MCP client can talk to any MCP server, regardless of the hosting AI application.

---

## 4a. Version Negotiation and Protocol Evolution

MCP's `server/discover` endpoint is the first call every client makes. It returns:
- The protocol version the server supports (e.g., `2026-07-28`)
- The server's capabilities (which primitives it exposes: tools, resources, prompts)
- Optional features like notifications, streaming, and MCP Apps

If the client's version is incompatible, the client can either negotiate a fallback or reject the server. This forward-compatibility mechanism ensures that old clients don't break against new servers — they simply lose access to features their version doesn't understand.

The protocol also supports **MCP Apps** (sandboxed iframe UIs rendered alongside agent output) and **Multi Round-Trip Requests** (user confirmation flows where the server can ask "Are you sure?" before executing a destructive action). These are opt-in capabilities that servers advertise during discovery, keeping the core protocol lean while allowing rich extensions.

---

## 5. Connection to Plinth

Plinth's roadmap (Milestone 5: Curator Intelligence) calls for MCP integration. Here's the concrete plan:

| MCP Concept | Plinth Equivalent |
|-------------|-------------------|
| **MCP Host** | Plinth itself (the Next.js app acts as the host) |
| **MCP Client** | `lib/mcp/client.ts` — connects to curator servers |
| **MCP Server** | GitHub server (project data), filesystem server (documentation), database server (mock data) |
| **Tools** | Curator actions: search exhibits, recommend paths, fetch project stats |
| **Resources** | Museum data: exhibit metadata, visitor context, collection details |
| **Prompts** | Curator prompt templates: "Explain this project", "Compare two projects", "Suggest next exhibit" |

The Curator Agent (built in Milestone 5) will be an MCP client that connects to:

1. **GitHub MCP Server** — fetches real repo stats, READMEs, commit history for live exhibits
2. **Plinth Museum Server** — custom MCP server exposing museum data as resources (exhibits, collections, visitor history) and tools (recommend paths, search exhibits, track visitor)
3. **Documentation Server** — filesystem MCP server serving project documentation as read-only resources

This turns Plinth from a static museum into a living, context-aware experience. The curator can answer "What should I look at next?" by combining visitor context (resource) with collection data (resource) and path-finding logic (tool).

### 5a. Curator Conversation Flow (End-to-End)

Here's how a visitor interaction would work through the MCP stack:

```
Visitor: "What should I look at next, I liked the ScrollStreak exhibit?"

1. Plinth (MCP Host) receives the question
2. Client (lib/mcp/client.ts) sends a resources/read request
   to the Plinth Museum Server for visitor context
3. Server responds with visitor history resource
4. Client sends tools/call to recommend_exhibit
   with: { tags: ["scrollstreak", "chrome-extension"], limit: 3 }
5. Server queries exhibit metadata, returns recommendations
6. Client sends resources/read to Documentation Server
   for the recommended exhibit's docs
7. Plinth renders: recommendation + exhibit preview + call-to-action
```

This flow uses all three MCP primitives: resources (visitor context, exhibit docs), tools (recommendation logic), and the host (Plinth's curator UI). Each step is a standard MCP call — no custom API endpoints needed.

### 5b. lib/mcp/client.ts Implementation Pattern

```typescript
// lib/mcp/client.ts — future MCP client for Plinth Curator
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { transport } from './transport' // STDIO or HTTP

const curatorClient = new Client(
  { name: 'plinth-curator-client', version: '0.1.0' },
  { capabilities: {} }
)

await curatorClient.connect(transport)

// Discovering server capabilities
const { tools, resources, prompts } = await curatorClient.discover()

// Fetching context (resource)
const visitorCtx = await curatorClient.readResource({
  uri: 'plinth://visitors/current'
})

// Getting recommendation (tool)
const recommendation = await curatorClient.callTool({
  name: 'recommend_exhibit',
  arguments: {
    tags: visitorCtx.recentTags,
    limit: 3
  }
})
```

This pattern cleanly separates the MCP integration from Plinth's business logic. The Curator Agent only needs to know the MCP protocol — it doesn't care whether the museum server is running locally via STDIO or deployed remotely via HTTP.

---

## 6. How to Connect MCP in Your Environment

### Option A: Claude Desktop (if you use it)

```json
{
  "mcpServers": {
    "plinth-curator": {
      "command": "node",
      "args": ["path/to/plinth-mcp-server/index.js"]
    }
  }
}
```

### Option B: In Plinth codebase (Next.js route)

```typescript
// app/api/mcp/route.ts — future MCP endpoint for Plinth
import { Server } from '@modelcontextprotocol/sdk/server/index.js'

const server = new Server(
  { name: 'plinth-curator', version: '0.1.0' },
  { capabilities: { tools: {}, resources: {} } }
)

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'recommend_exhibit',
    description: 'Recommend an exhibit based on visitor preferences',
    inputSchema: {
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number' }
      }
    }
  }]
}))
```

**To actually connect and test:** Install `@modelcontextprotocol/sdk`, create a minimal server, and run it with an MCP client (Claude Desktop or the MCP Inspector).

---

## 7. What Needs Your Action (Zain)

- [x] **Screenshot** the MCP server connection in your AI tool (Claude/Cursor/VS Code showing the connected MCP server)
- [ ] **Optional:** Install `@modelcontextprotocol/sdk` and run the MCP Inspector to test a local server
- [x] **Screenshot** the Magic UI MCP or any MCP connection screen
- [x] Submit this doc + screenshots as FL-05 deliverable

## 8. Screenshots & Evidence

| Screenshot | File | Content |
|-----------|------|---------|
| MCP Tool Calls Console | `screenshots/Screenshot 2026-07-28 213811.png` | Terminal showing Magic UI MCP tool calls |
| MCP Connection Evidence | `screenshots/MCP-EVIDENCE.md` | 4 MCP servers configured + Magic UI MCP tool calls (listRegistryItems, searchRegistryItems, getRegistryItem) |
| NotebookLM Run 1 | `screenshots/notebooklm-run1-ai-sdk-evolution.png` | Run 1 brief in NotebookLM |
| NotebookLM Run 1 (Viewport) | `screenshots/notebooklm-run1-viewport.png` | Prompt + response visible |
| FE-06 Streaming Chat | `screenshots/assistant-streaming-chat.png` | Chat interface with streamed response |
