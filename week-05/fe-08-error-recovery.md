# FE-08 — Chat Error States & Recovery

**Assignment:** Chat error states and recovery (FE-08)
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (Week 5)
**Deliverable:** https://plinth-cyan.vercel.app/assistant

---

## What Changed

The chat surface (FE-06/FE-07 baseline) had a single hardcoded red banner for
any failure. FE-08 turns that into a real, classified error system built on the
**AI SDK's own recovery primitives** — no custom error framework.

### Before (FE-07)
- `chat-panel.tsx`: `{error && <div>Something went wrong. Please try again.</div>}` — no way to recover, no context for the visitor, raw message hidden.
- Empty state was passive: `"Start a conversation."` with no next action.
- `/api/chat` returned the raw `e.message` as the 500 body, which the transport (`DefaultChatTransport`) surfaces as `error.message` on the client — leaking internals into any naive error UI.

### After (FE-08)
- **`components/ai/chat-error-banner.tsx`** — classifies the SDK's `error` into visitor-facing categories and renders Retry / Dismiss.
- **`components/ai/error-boundary.tsx`** — catches render-time crashes so the chat surface never dies to a white screen.
- **`app/api/chat/route.ts`** — 500 responses now return a friendly, stable body (`{ error: "The assistant couldn't respond. Please try again." }`) while the real cause is logged server-side only.
- **`components/ai/chat-panel.tsx`** — real recovery via `regenerate()` / `clearError()` / `stop()`; the old hardcoded banner is gone.

---

## Architecture

### 1. Error classification — `chat-error-banner.tsx`

`classifyError(error)` maps the SDK's `Error` to one of three kinds:

| Kind | Trigger | Copy |
| --- | --- | --- |
| `offline` | `navigator.onLine === false`, or message matches `fetch failed` / `networkerror` / `network error` | "You appear to be offline — check your connection, then retry." |
| `bad-request` | message matches `no messages provided` (the route's 400 body) | "The request couldn't be processed — try rephrasing." |
| `server` | anything else | "The AI service hit a snag on its side. Try again in a moment." |

`serverErrorDetail(error)` extracts the friendly server message out of a JSON
error body (`JSON.parse(error.message)?.error`). Non-JSON raw errors (browser
`TypeError`s) are deliberately **not** shown — the visitor never sees internals.

All recovery uses AI SDK primitives only:

- **Retry** → `regenerate()` — re-sends the failed turn through the SDK (no fake retry, no page reload).
- **Dismiss** → `clearError()` — drops the error, input stays usable.

The banner reuses the `output-error` card's museum visual language
(`border-red-900/40 bg-red-950/10`, uppercase tracked label, `role="alert"`).

### 2. Crash safety — `error-boundary.tsx`

Class-component `ErrorBoundary` wraps `ChatPanel` on `/assistant`. A render
crash in the chat surface (e.g. a future tool output the renderer can't handle)
shows a museum-styled fallback with a "Try again" reset instead of a blank page.

### 3. Route contract hygiene — `route.ts`

Before: `Response.json({ error: message }, { status: 500 })` — raw provider
errors travel to the client.

After:

```ts
} catch (e: unknown) {
  console.error("[api/chat] failed to produce a response:", e);
  return Response.json(
    { error: "The assistant couldn't respond. Please try again." },
    { status: 500 },
  );
}
```

The 400 path is unchanged (`{ error: "No messages provided" }`). Real diagnostic
detail stays server-side in the logs; the client gets a stable, friendly body it
can safely display via `serverErrorDetail`.

### 4. Separate error paths (unchanged by design)

- **Transport / provider / network failures** → top-level `ChatErrorBanner` in `ChatPanel`.
- **Tool execution failures** → `ToolStateViews` `output-error` card (FE-07), untouched.

These two paths are intentionally distinct: a failed fetch and a failed tool run
mean different things and are rendered differently.

---

## Verification (2026-08-02)

Method: browser-level interception of `/api/chat` (Playwright `page.route`) to
inject each failure deterministically, then verify the SDK's genuine recovery
flow. Success-path stream events matched the real `uiMessageChunkSchema`
(notably `text-delta` requires an `id`).

| # | Case | Action | Result |
| --- | --- | --- | --- |
| T1 | Server 500 | mock `500 {error: "The assistant couldn't respond. Please try again."}` | Banner shows server copy **and** the extracted JSON detail; user message preserved |
| T2 | Retry → genuine recovery | click **Retry** | A **second** request fires (confirmed in network log); reply renders; banner clears |
| T3 | Dismiss | click **Dismiss** | Banner clears, input stays enabled |
| T4 | Network / offline | abort the request (`net::ERR_FAILED`) | Banner shows offline copy |

Evidence:

- `screenshots/fe-08-server-error.png` — T1 banner (server kind + JSON detail).
- `screenshots/fe-08-offline-error.png` — T4 banner (offline kind).
- Real 400 contract also verified directly: `POST /api/chat` with `{messages:[]}` → `400 {"error":"No messages provided"}`.
- Real success path re-verified against the live backend (a genuine assistant reply renders) after the changes.

### Final pass (2026-08-03) — Checkpoint 1 deliverables

Re-reviewed against the dashboard Checkpoint 1 requirement: *preview URL plus a
recording or screenshots showing the happy path and at least two handled failure
states.*

| # | Case | Evidence |
| --- | --- | --- |
| C1 | **Happy path** — example prompt click → genuine tool call → 3 exhibit cards render, zero console errors | `screenshots/fe-08-happy-path.png` |
| C2 | **First-run empty state** — guides action with click-to-fill example prompts (no longer passive text) | `screenshots/fe-08-empty-state.png` |
| C3 | Server failure (designed error + retry) | `screenshots/fe-08-server-error.png` |
| C4 | Offline failure (designed error + retry) | `screenshots/fe-08-offline-error.png` |

New in this pass:

- **Designed first-run empty state** (`chat-panel.tsx`): "No conversations yet."
  with three click-to-fill example prompts ("Show me infrastructure exhibits",
  "What's in the visual design collection?", "List the experiments"). The empty
  state now points the user somewhere useful instead of ending the story.
- **Route-segment `error.tsx`** (`app/assistant/error.tsx`): the dashboard brief
  explicitly requires *"error.tsx boundaries for route failures"* — added a
  museum-styled route boundary with a working "Try again" reset, complementing
  the existing client `ErrorBoundary` (render-crash safety) inside the page.
- **Rate-limit (429) case:** the mentor sabotage list includes "return a 429".
  In the current flow a provider 429 surfaces through the SDK and is classified
  as the designed `server` kind banner with a working retry — the brief requires
  a designed error with recovery, not a distinct rate-limit visual, so no
  separate 429 state was added.

### Known limitations

- **`ErrorBoundary` fallback not crash-exercised.** No natural render crash exists
  in the current surface (tool output is schema-guarded), so the fallback is
  verified by build/type-check and wiring review rather than a live crash test —
  consistent with how the transient `input-streaming` state was handled in FE-07.
- **Empty-response edge case deliberately removed.** The SDK never commits an
  assistant message with zero content parts (`write()` only fires on content
  events), so a "No response" banner would have been unreachable dead code.
  Nothing is rendered for it; the guard against empty bubbles is kept.
- **Known limitation:** FE-08 intentionally relies on AI SDK transport semantics. If future SDK versions change error propagation or streaming behavior, the chat error layer should be revalidated rather than extended with custom recovery logic.

---

## Files

- `app/components/ai/chat-error-banner.tsx` — new: classification + banner UI.
- `app/components/ai/error-boundary.tsx` — new: crash fallback.
- `app/components/ai/chat-panel.tsx` — banner wiring, `regenerate`/`clearError` recovery, designed empty state.
- `app/assistant/page.tsx` — wrapped in `ErrorBoundary`.
- `app/assistant/error.tsx` — new: route-segment error boundary (brief requirement).
- `app/api/chat/route.ts` — friendly 500 body + server-side log.
