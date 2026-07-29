# Task 5 / FE-06 — Streaming AI Chat Interface

**Assignment:** Streaming AI chat interface (FE-06)
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (core)
**Deliverable:** https://plinth-cyan.vercel.app/assistant

---

## Architecture Overview

### Server: `/app/api/chat/route.ts`

Route handler that calls OpenRouter API (OpenAI-compatible) directly via `fetch`, bypassing the AI SDK's provider packages to avoid model validation issues. Returns a `text/event-stream` with events conforming to `uiMessageChunkSchema` (the format expected by `useChat`'s `DefaultChatTransport`).

Stream events emitted:
- `start` — stream begins
- `text-start` / `text-delta` / `text-end` — token-by-token streaming
- `finish` — generation complete
- `error` — error case

Model used: `google/gemini-2.5-flash-lite` via OpenRouter (cheapest available, ~$0.0000001/1K tokens).

**Key file:** `app/api/chat/route.ts` — 120 lines, no AI SDK dependency for the model call.

### Client: `/app/assistant/page.tsx`

Uses `useChat` from `@ai-sdk/react` with `DefaultChatTransport({ api: "/api/chat" })`. Renders `message.parts` for text content (AI SDK v7 format). Features:

- Distinct user/assistant message styling
- Auto-scroll that respects user scroll position
- "Jump to latest" button when scrolled up
- Thinking indicator (pulsing dots) before first token
- Stop button during generation — state persists after stop
- Mobile-friendly input with disabled state during loading

**Key file:** `app/assistant/page.tsx` — 189 lines.

### Config Module: `/lib/ai/`

- `config.ts` — model name, max tokens (single source of truth)
- `prompts.ts` — guideEngine system prompt (separated from logic)
- `provider.ts` — provider factory (currently raw fetch; ready for SDK swap)

All AI settings live in one directory. Changing the model or provider requires touching config only.

---

## How It Works

```
User types message
  → useChat sends POST /api/chat { id, messages, trigger }
  → Server converts UIMessage parts → OpenAI message format
  → Server calls OpenRouter API with stream: true
  → Server pipes SSE response through ReadableStream
  → Server emits uiMessageChunk events (text-start, text-delta, text-end, finish)
  → useChat parses events and updates messages state
  → React re-renders with streamed tokens
```

## Evaluation Criteria Met

| Criteria | Status |
|----------|--------|
| Responses stream token by token | ✅ Verified — each `text-delta` event is rendered as it arrives |
| Generation can be stopped mid-stream | ✅ Stop button interrupts, state persists |
| Conversation state survives multiple turns | ✅ Messages array persists across sends |
| API key lives server-side only | ✅ `OPENROUTER_API_KEY` in Vercel env vars, never client-side |
| Usable at phone width | ✅ Responsive layout, mobile-friendly input |

---

## Provider Choice

**Why OpenRouter + Gemini instead of Claude directly?**

The assignment brief suggests Claude/Anthropic SDK, but Anthropic has no free tier. Per the FlyRank Q&A (7/26/2026): *"you are welcome to use any resources at your disposal to complete the assignments, so Google Gemini is completely fine."*

OpenRouter provides an OpenAI-compatible API for Gemini models, avoiding:
- Google AI Studio's zero quota on free tier (`limit: 0` for `generate_content_free_tier_requests`)
- Model validation in `@ai-sdk/openai` (rejects non-OpenAI model IDs)

The raw fetch approach is provider-agnostic — swapping to Anthropic/Claude later requires changing only the API URL and request body in `route.ts`.

---

## Links

- **Preview URL:** https://plinth-cyan.vercel.app/assistant
- **Route handler:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts
- **Chat component:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/assistant/page.tsx
- **AI config module:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/tree/main/week-03/app/lib/ai
- **Screenshot:** `week-04/screenshots/assistant-streaming-chat.png`
