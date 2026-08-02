# FE-07 — Tool Results & Structured Output (AI SDK Upgrade)

**Assignment:** AI tool usage with structured tool results (FE-07)
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (Week 5)
**Deliverable:** https://plinth-cyan.vercel.app/assistant

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

## Links

- **Preview URL:** https://plinth-cyan.vercel.app/assistant
- **Route handler:** `week-03/app/app/api/chat/route.ts`
- **Tool:** `week-03/app/lib/ai/tools/exhibit.ts`
- **Repository seam:** `week-03/app/lib/repository/index.ts`
- **Chat UI:** `week-03/app/components/ai/chat-panel.tsx`
- **State views:** `week-03/app/components/ai/tool-state-views.tsx`
- **Result card:** `week-03/app/components/ai/exhibit-tool-result.tsx`
