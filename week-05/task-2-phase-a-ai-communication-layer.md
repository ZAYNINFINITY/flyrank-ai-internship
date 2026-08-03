# Task 2 / Phase A — AI Communication Layer

**Assignment:** AI communication layer (Phase A) — Curator assistant, streaming route, repository injection
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (Week 5, builds on FE-06 streaming baseline)
**Deliverable:** https://plinth-cyan.vercel.app/assistant

---

## Architecture Overview

### 1. AI route — `app/api/chat/route.ts`

The Curator's server-side brain. Uses the AI SDK's `streamText` with a `createOpenAICompatible` provider pointing at OpenRouter (Google Gemini model), and returns `toUIMessageStreamResponse()` — the exact SSE protocol `useChat`'s `DefaultChatTransport` expects, so the existing FE-06 client keeps working unchanged.

- Validates `{ messages }`; empty/absent → `400 { error: "No messages provided" }`.
- Any failure → friendly `500 { error: "The assistant couldn't respond. Please try again." }`, real cause logged server-side only (FE-08).
- Wires the `exhibitLookup` tool (FE-07) through the repository seam.

**Key file:** `app/api/chat/route.ts` — 50 lines (was ~120 with the old raw-fetch pipe).

### 2. Reusable chat surface — `components/ai/chat-panel.tsx`

Extracted from the old `/assistant` page into one reusable component (later reused by the Curator in future milestones). `useChat` + `DefaultChatTransport({ api: "/api/chat" })`, renders `message.parts` for text **and** tool parts, with thinking dots, stop button, autoscroll + jump-to-latest, and the FE-08 error banner. `/assistant` is now a thin wrapper.

### 3. Config module — `lib/ai/`

- `config.ts` — model name + max tokens, single source of truth.
- `prompts.ts` — Curator system prompt, separated from logic.
- `provider.ts` — provider abstraction (the swap point for future providers).

All AI settings live in one directory; changing model or provider touches config only.

### 4. Repository injection seam — `lib/repository/index.ts`

The single seam for the museum's data source. `getExhibitRepository()` returns a lazy singleton `MockExhibitRepository` behind the `ExhibitRepository` interface. Tools, routes, and the chat UI depend **only** on the interface — swapping mock → real data (database, CMS, vector search) happens here and nowhere else.

---

## How It Works

```
User types message on /assistant
  → ChatPanel useChat POSTs /api/chat { id, messages, trigger }
  → route.ts validates, builds streamText({ model, system, messages, maxOutputTokens, tools })
  → model (Gemini via OpenRouter) generates; may invoke exhibitLookup (FE-07)
  → toUIMessageStreamResponse pipes SSE (text-start / text-delta / text-end, tool events, finish)
  → ChatPanel renders parts as they arrive; stop button interrupts
  → error → ChatErrorBanner (FE-08); recovery via regenerate() / clearError()
```

---

## Evaluation Criteria Met

| Criteria | Status |
|----------|--------|
| Server-side AI route (key never client-side) | ✅ `OPENROUTER_API_KEY` server-only |
| Streaming, stop, multi-turn preserved | ✅ SDK handles it (`toUIMessageStreamResponse`) |
| Reusable chat surface, not page-specific | ✅ `ChatPanel` extracted; `/assistant` is a wrapper |
| Config isolated from logic | ✅ `lib/ai/` (config / prompts / provider) |
| AI depends on interface, not concrete source | ✅ `getExhibitRepository()` seam |
| Route slimmer than Week 4 baseline | ✅ 50 lines vs ~120 |
| Build green | ✅ 17 routes, TypeScript clean |

---

## Files

- `app/api/chat/route.ts` — AI route: `streamText` + OpenRouter + tool wiring
- `app/assistant/page.tsx` — Curator assistant page (thin wrapper)
- `components/ai/chat-panel.tsx` — reusable chat surface
- `lib/ai/config.ts` — model name + params
- `lib/ai/prompts.ts` — Curator system prompt
- `lib/ai/provider.ts` — provider abstraction
- `lib/repository/index.ts` — repository injection seam
- `lib/repository/exhibit-repository.ts` — `ExhibitRepository` interface
- `lib/repository/mock-exhibit-repository.ts` — mock implementation

---

## Links

- **Preview URL:** https://plinth-cyan.vercel.app/assistant
- **Route handler:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts
- **Chat panel:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx
- **Repository seam:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/index.ts
- **AI config module:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/tree/main/week-03/app/lib/ai
