# FL-05: Agent Concepts and MCP Basics

## 1. Workflow vs Agent

A **workflow** is a predetermined sequence of LLM calls. The developer defines every step, every transition, and every decision point before execution begins. The model never chooses which step comes next — the pipeline does.

An **agent** gives the model control over tool selection and execution ordering. The developer provides a goal and a set of tools; the model decides which tool to call, when, and whether to call another or produce a final answer. The model can loop, backtrack, or change strategy based on intermediate results.

The difference is control flow: workflows route *around* the model; agents route *through* the model.

## 2. Classifying FL-04

FL-04 is a **workflow**, not an agent. The pipeline defines three fixed stages (Gather → Synthesize → Brief) executed sequentially by an external automation script. NotebookLM never decides to skip synthesis if gathering was sufficient, or to search for additional sources if coverage is thin. The prompts are static; the execution order is hardcoded.

**What would need to change for it to become an agent:**

The pipeline would need to be replaced with a reasoning loop where the model has:
- **Tools** for web search, source management, and file output (via MCP)
- **A goal** ("Produce a weekly brief on this theme")
- **Autonomy** to decide which sources to query, when gathering is complete, how to structure the synthesis, and whether the brief meets quality standards before finalizing

The model would orchestrate its own pipeline instead of being pushed through one.

## 3. What Is MCP?

The Model Context Protocol (MCP) is an open standard that defines how LLMs connect to external tools, data sources, and services. It is analogous to USB-C — a single universal connector replacing a tangle of proprietary integrations.

MCP defines three primitives:

| Primitive | Purpose | Example |
|---|---|---|
| **Tools** | Actions the model can invoke | `read_file`, `search_files`, `query_database` |
| **Resources** | Data the model can read | File contents, API responses, database rows |
| **Prompts** | Pre-written templates for common tasks | "Summarize this file", "Review this PR" |

A model connected via MCP can call tools, read resources, and follow prompt templates regardless of which provider or framework sits behind the protocol. This is why "MCP support" has become a quick signal for evaluating agent platforms — if it speaks MCP, it can work with any MCP-compatible server.

## 4. Making FL-04 an Agent (Concrete Upgrade)

One concrete upgrade: replace the fixed 3-prompt chain with a single agent loop where the model uses an MCP-connected **research tool** to find and ingest sources, a **synthesis tool** to organize findings, and a **writing tool** to produce the brief — all decided by the model based on its own assessment of completeness.

For example, the model would:
1. Search the web for sources on a theme (tool: web_search)
2. Read the top results (tool: read_url)
3. Synthesize findings into a structured draft (tool: write_file)
4. Evaluate the draft against quality criteria
5. Either refine it or mark it complete

The agent decides when to stop researching and start writing — the workflow does not.

## 5. Future Relevance to Plinth

**The Plinth guide is not an agent.** At the current stage, it is an AI-powered guide: it receives a user query and generates a response using only its system prompt and conversation context. It has no tools, no access to external data, and no mechanism to autonomously decide what to do next.

**To become an agent**, the guide would need MCP access to:

- **GitHub API MCP** — fetch project metadata, star counts, last commit dates, README previews
- **Filesystem MCP** — read project documentation, source files, and architecture notes stored locally or in blob storage
- **Database MCP** — query project metadata, search tags, filter by tech stack or category
- **Search MCP** — find relevant exhibits, related projects, or documentation snippets

A visitor asking "show me your best React projects" would trigger the agent to:
1. Query the database MCP for React projects
2. Read each project's README via filesystem MCP to understand depth
3. Check GitHub stats via GitHub MCP to determine "best" by engagement
4. Construct a response with live data rather than static training knowledge

**This architecture belongs in a later milestone** — Milestone 6 or 7 from the roadmap. For FL-05, the goal is to understand MCP as a protocol and demonstrate it working generically. The Plinth-specific implementation should wait until the curator's role is fully defined and the backend data layer exists to serve MCP endpoints.

---

## Evidence: MCP Setup and Three Tool-Use Tasks

### Setup

**Client:** Custom Node.js script using `@modelcontextprotocol/sdk` (v1.9.0). The client connects to the filesystem server via stdio transport.

**Server:** `@modelcontextprotocol/server-filesystem` (invoked via npx). Allowed directory: `C:\Users\user`.

**Connection:** The client spawns the server as a child process, communicates over stdin/stdout using JSON-RPC messages. No HTTP, no cloud dependencies — pure local stdio MCP.

**Available tools (14 total):** read_text_file, read_media_file, read_multiple_files, write_file, edit_file, create_directory, list_directory, list_directory_with_sizes, directory_tree, move_file, search_files, get_file_info, list_allowed_directories, read_file (deprecated).

### Task 1: Read a Local File

**Tool called:** `read_file`
**Input:** Path to the MCP client script itself
**Output:** Complete file content returned (2,231 characters, first 200 shown)

```
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  co
```

**Why chat cannot do this:** A plain LLM has no access to the local filesystem. It cannot read arbitrary files from the user's machine. MCP bridges this gap by providing a tool the model can invoke.

### Task 2: List Directory Structure

**Tool called:** `list_directory`
**Input:** Path to the project directory
**Output:**

```
[FILE] client.mjs
[DIR]  node_modules
[FILE] package-lock.json
[FILE] package.json
```

**Why chat cannot do this:** Navigating directory trees requires filesystem access. An LLM without MCP cannot discover what files exist in a project.

### Task 3: Search Files by Pattern

**Tool called:** `search_files`
**Input:** Pattern `*.mjs`, path `\mcp-test`
**Output:**

```
C:\Users\user\AppData\Local\Temp\mcp-test\client.mjs
```

**Why chat cannot do this:** Pattern-based file search across directories is a filesystem operation. The model identified all JavaScript modules matching the pattern without knowing the directory structure in advance.

### Terminal Output

```
=== MCP Client Connected ===
Server: @modelcontextprotocol/server-filesystem

=== Available Tools ===
  read_file: Read the complete contents of a file as text. DEPRECATED
  read_text_file: Read the complete contents of a file from the file system...
  ... (12 more tools listed)

=== TASK 1: Read a local file ===
Tool: read_file
Path: client.mjs
Content length: 2231 characters
First 200 chars:
import { Client } from ...

=== TASK 2: List directory structure ===
Tool: list_directory
Contents:
  [FILE] client.mjs
  [DIR]  node_modules
  [FILE] package-lock.json
  [FILE] package.json

=== TASK 3: Search files by name pattern ===
Tool: search_files
Pattern: *.mjs
Matches:
  C:\Users\user\AppData\Local\Temp\mcp-test\client.mjs

=== MCP Session Complete ===
```
