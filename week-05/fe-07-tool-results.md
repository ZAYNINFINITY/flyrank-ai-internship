# FE-07 — Tool Results & Structured Output (AI SDK Upgrade)

**Assignment:** AI tool usage with structured tool results (FE-07)
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (Week 5)
**Deliverable:** https://foyer-cyan.vercel.app/assistant

---

## What Changed

The chat route was upgraded from a hand-rolled `fetch` + SSE pipe to the AI SDK's `streamText`, enabling real model-driven **tool calls** with **Zod-structured output**.

### Before (Week 4 / FE-06)
- `app/api/chat/route.ts` called OpenRouter via raw `fetch`, manually converting `UIMessage` parts and piping SSE events.
- No tools — the model could only produce free-text answers.

### After (Week 5 / FE-07)
- `streamText` + `createOpenAICompatible` provider (`@ai-sdk/openai-compatible`), same OpenRouter + Gemini model.
- A `exhibitLookup` tool backed by a Zod schema lets the model query the museum's exhibit data (`getExhibitRepository()`).
- The tool's structured output (typed `Exhibit[]`) is rendered as dedicated UI — a real result card, not prose.

**Route:** `app/api/chat/route.ts` — ~47 lines (was ~120).

---

## Architecture Overview

### 1. Repository seam — `lib/repository/index.ts`

`getExhibitRepository()` returns a lazy singleton `MockExhibitRepository` behind the `ExhibitRepository` interface. The AI tool depends **only** on the interface, so swapping mock → real data later is a one-line change in this file.

### 2. Tool — `lib/ai/tools/exhibit.ts`

- `exhibitLookupSchema` (Zod): optional `id`, `collection`, `query` — every field self-describing via `.describe()`.
- `createExhibitLookupTool(repo)` wraps `tool({ description, inputSchema, execute })`:
  - `id` given → `repo.getById(id)`
  - `collection` given → `repo.getByCollection(collection)` (optionally filtered by `query`)
  - otherwise → `repo.getAll()` (optionally filtered by `query`)
- Returns plain `Exhibit[]` — fully typed, validated by Zod on the way in.

### 3. Route — `app/api/chat/route.ts`

```ts
const result = streamText({
  model,                       // createOpenAICompatible → openrouter.chatModel(config.model)
  system: guideEngine,
  messages: await convertToModelMessages(messages),
  maxOutputTokens: config.maxTokens,
  tools: { exhibitLookup: createExhibitLookupTool(getExhibitRepository()) },
});
return result.toUIMessageStreamResponse();
```

`toUIMessageStreamResponse()` emits the exact SSE event protocol `useChat`'s `DefaultChatTransport` expects, so the existing FE-06 client keeps working unchanged. Streaming, stop, and multi-turn state are now handled by the SDK instead of custom code.

### 4. Shared UI — `components/ai/`

- `chat-panel.tsx` — the single reusable chat surface (extracted from the old `/assistant` page): `useChat`, text + tool part rendering, thinking dots, stop button, autoscroll with jump-to-latest.
- `tool-state-views.tsx` — distinct UI for the four tool lifecycle states the SDK reports:
  - `input-streaming` → "Asking the museum…" pulse
  - `input-available` → search chips showing the model's structured input
  - `output-available` → delegates to the real result renderer
  - `output-error` → friendly error card (no raw JSON dumps)
- `exhibit-tool-result.tsx` — the actual `Exhibit[]` result: `isExhibitArray` type guard + a card grid (title, tagline, developer, year, collection) linking into the museum via `getExhibitRoute`.
- `app/assistant/page.tsx` is now a thin wrapper around `ChatPanel` — URL and behavior preserved.

### 5. Documented tool contract — `week-03/app/README.md`

The dashboard brief requires documenting the tool contract in the README. The
app README now has an **AI tool contract** section: name (`exhibitLookup`),
Zod schema (`{ id?, collection?, query? }`), return shape (`Exhibit[]`), the
repository seam, and the four lifecycle states.

---

## How It Works

```
User: "show me infrastructure exhibits"
  → useChat POSTs /api/chat
  → streamText calls Gemini; model decides to use exhibitLookup
  → tool: { collection: "infrastructure" } validated by Zod
  → execute → repo.getByCollection("infrastructure") → Exhibit[]
  → UI shows "Searching the collection" → ExhibitToolResult cards
  → model narrates over the structured result
```

---

## Evaluation Criteria Met

| Criteria | Status |
|----------|--------|
| Model invokes a tool to fetch real data | ✅ `exhibitLookup` tool, Zod-validated |
| Structured output, not raw prose | ✅ Typed `Exhibit[]` → dedicated result UI |
| All four tool states rendered | ✅ input-streaming / input-available / output-available / output-error |
| No raw JSON exposed to the user | ✅ State views + result cards only |
| Streaming + stop + multi-turn preserved | ✅ `toUIMessageStreamResponse()` = same protocol |
| Route slimmer than before | ✅ ~47 lines vs ~120 |
| Build green | ✅ 17 routes, TypeScript clean |

---

## Functional Verification (2026-08-02)

Verified end-to-end against a running production build. No prompt changes were needed — the model used the tool on its own.

### 1. Genuine tool call through `/api/chat`

`POST /api/chat` with `"List the exhibits in the infrastructure collection."` produced a real model tool call:

- `tool-input-start` / `tool-input-delta` → `tool-input-available` with `{"collection":"infrastructure"}`
- `tool-output-available` with the typed `Exhibit[]` (pos-it, collaborative-workspace, museum-architecture)
- `finishReason: "tool-calls"`

Raw capture: `week-05/fe-07-sse-tool-call.txt`. The model invoked the tool in **every** test message (infrastructure, visual-design, experiments, free-text) — no prompt tuning required.

### 2. All four lifecycle states rendered (DOM-verified)

A 25 ms DOM watcher recorded the state sequence during live tool calls:

| State | DOM marker | Result |
|-------|-----------|--------|
| **Input Streaming** | "Asking the museum…" pulse | ✅ caught (~50 ms — inherently transient) |
| **Input Available** | "Searching the collection" + `collection:` chip | ✅ caught (~2.1 s) |
| **Output Available** | exhibit card grid | ✅ caught + screenshot |
| **Output Error** | "Museum search failed" alert card | ✅ caught + screenshot |

Screenshots: `week-05/screenshots/fe-07-output-available.png`, `week-05/screenshots/fe-07-output-error.png`.

The error state was verified via temporary failure injection (tool `execute` threw for one build, then fully reverted — current code has no throw and builds green). The error card renders with `role="alert"`, a recovery hint, and the SDK-safe error text "An error occurred." (the SDK genericizes tool errors — no raw error leaks to the client).

### 3. Findings

- **Input-streaming is genuinely transient.** Gemini streams the tool-input JSON in a single chunk, so the pulse lasts ~50 ms — correct rendering confirmed by the DOM watcher, but it cannot be screenshot at human speed. This is a provider characteristic, not a defect.
- **No hardcoding or artificial tool calls.** Every tool call above was the model deciding to use the tool. The only temporary change was failure injection to exercise the error state, since no natural error path exists with valid data — reverted after capture.
- **Tool reliability is model-dependent.** The free-tier model used the tool consistently in this session, but Gemini sometimes answers collection questions from memory instead of calling the tool. If that happens in production, the fix is a minimal system-prompt nudge toward tool use (Phase D Curator work), not a workaround.

---

## Links

- **Preview URL:** https://foyer-cyan.vercel.app/assistant
- **Route handler:** `week-03/app/app/api/chat/route.ts`
- **Tool:** `week-03/app/lib/ai/tools/exhibit.ts`
- **Repository seam:** `week-03/app/lib/repository/index.ts`
- **Chat UI:** `week-03/app/components/ai/chat-panel.tsx`
- **State views:** `week-03/app/components/ai/tool-state-views.tsx`
- **Result card:** `week-03/app/components/ai/exhibit-tool-result.tsx`
