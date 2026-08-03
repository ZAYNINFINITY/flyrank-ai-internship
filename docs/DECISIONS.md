# Decision Log

Project memory for "why," so this doesn't get re-litigated every few weeks. Each entry reflects a decision already made and repository-verified — this is a record, not a proposal.

---

### Why Next.js

Compared against Astro+MDX and a Vite React SPA (`week-04/task-2-stack-rationale.md`). Next.js was chosen because it has server components and API routes built in, so the AI streaming layer (Milestone 4) is a file addition, not a framework fight or restructure. Astro would require bolting React on as an island for the chat interface; a Vite SPA would need a separate backend added later. Vercel deployment is zero-config for Next.js specifically.

### Why AI SDK (`@ai-sdk/react` `useChat`)

Chosen for FE-06 because it already understands the `uiMessageChunkSchema` streaming format and handles multi-turn message state, auto-scroll, and stop-generation semantics out of the box on the client side — avoiding hand-rolled SSE parsing in React.

### Why raw `fetch` instead of an AI SDK provider package server-side

`@ai-sdk/openai` validates model IDs against known OpenAI model names and rejects non-OpenAI IDs like `google/gemini-2.5-flash-lite` routed through OpenRouter. Calling OpenRouter directly via `fetch` in `app/api/chat/route.ts` sidesteps that validation while still emitting the same SSE event shape `useChat` expects (`start`, `text-start`, `text-delta`, `text-end`, `finish`, `error`).

### Why AI SDK `streamText` (+ `@ai-sdk/openai-compatible`) superseded the raw `fetch` route (FE-07)

The raw fetch route was correct for FE-06 (no tools, just streaming). FE-07 adds **tool calls**, which need structured, schema-validated input/output — hand-rolling tool-call streaming on top of raw `fetch` would have reinvented the AI SDK. `@ai-sdk/openai-compatible` (`createOpenAICompatible({ baseURL: "https://openrouter.ai/api/v1" })`) keeps the same OpenRouter + Gemini model while avoiding `@ai-sdk/openai`'s model-ID validation that forced the raw fetch approach in the first place. `streamText` + `tool({ inputSchema })` (Zod) give: model-driven tool execution, typed `Exhibit[]` output, and the exact same SSE protocol via `toUIMessageStreamResponse()` — so the existing FE-06 client (`useChat` + `DefaultChatTransport`) works unchanged. Note the v7 rename: `maxTokens` → `maxOutputTokens`. Supersedes the "raw fetch" decision above.

### Why provider abstraction (`lib/ai/provider.ts`, `lib/ai/config.ts`)

Model name and token limits live in one file (`config.ts`) so swapping providers or models later is a one-line change, not a search-and-replace across the codebase. `provider.ts` currently just re-exports the model name (the actual call is the raw `fetch` in `route.ts`) — kept as the named seam for when a full SDK-based provider call replaces the raw fetch.

### Why Google Gemini (via OpenRouter) instead of Claude directly

The assignment brief suggested Claude/Anthropic, but Anthropic has no free tier and Google AI Studio's free tier has a `generate_content_free_tier_requests` limit of 0. Per FlyRank's own Q&A (2026-07-26), using Gemini instead of Claude was explicitly approved. OpenRouter was used as the access path because it exposes an OpenAI-compatible API for Gemini, which is easier to call directly than Google's native API.

### Why MCP (Model Context Protocol)

Chosen for FL-05 and planned for Milestone 5 (Curator Intelligence) because it standardizes tool/resource/prompt access across any AI host, rather than writing bespoke integration code per data source. Concretely: the Curator Agent will need to pull GitHub repo data, museum content (exhibits/visitors), and documentation — MCP lets all three be added as servers behind one client interface (`lib/mcp/client.ts`, planned) instead of three separate custom API integrations.

### Why streaming (rather than a single blocking response)

A museum "curator" experience is conversational — waiting for a full response before showing anything reads as broken/slow for a chat UI. Token-by-token streaming with a stop button matches the FE-06 assignment requirement and is also just the right UX for the eventual Curator Agent.

### Why manual accessible components (Modal, Tabs, Disclosure) instead of only shadcn

FE-05 required a manual implementation *and* a shadcn comparison — both exist side by side on purpose (`playground/modal.tsx` etc. vs `components/ui/dialog.tsx` etc.). Beyond satisfying the assignment, the manual versions are simpler and more directly stylable for Plinth's specific "museum" visual language (inline control over animation/backdrop/portal behavior) even though they currently lack shadcn's portal rendering, exit animation, and dynamic-content focus-trap handling — those gaps are captured as known future work in `playground/NOTES.md`, not accidental omissions.

### Why the NotebookLM workflow (FL-04)

NotebookLM was used as the AI-research tool because it lets sources be pinned per-notebook and queried in a repeatable, structured pipeline (Gather → Synthesize → Draft), which matches the assignment's requirement of a reusable, repeatable automation workflow rather than a one-off manual research session. The pipeline is documented so it can be re-run on any future topic (e.g., weekly engineering briefs beyond the internship).

### Why the current deployment (`week-03/app` on `main`) stays unchanged going into Week 5

It is the actual graded/submitted artifact for FE-05, FE-06, Three Roads, and Empty but Live — several of which were implemented specifically against this version. Changing it now would invalidate already-submitted or about-to-be-submitted evidence (screenshots, live links) tied to its current state. Week 5 builds forward on top of it (Milestone 2/3) rather than modifying what's already built.

### Why architecture "remains unmerged" — status note

**Repository-verified fact:** no separate architecture branch or folder was found in this repository (only one branch, `main`, exists, and `docs/architecture.md`/`docs/roadmap.md` are already committed to it).

**Project Context (asserted by project owner, not independently verifiable from this repository):** a broader Plinth architecture has been planned outside the currently merged implementation, and is intentionally being brought in incrementally as future milestones land rather than merged in wholesale now. Future assistants should treat this as stated intent, not something to confirm or deny by inspecting the repo alone — and should not recommend merging or redesigning against it prematurely. See the Project Timelines section of `REPOSITORY_STATE.md` for the fuller framing.

### Why chat error handling is built on AI SDK primitives, not a custom error framework (FE-08)

`useChat` already surfaces failures as a typed `error` plus `status`, and provides `regenerate()`, `clearError()`, and `stop()` as recovery surfaces. Building a bespoke error system on top would duplicate SDK state machine logic and drift from SDK behavior. So FE-08 only *classifies and renders* the SDK's error (`chat-error-banner.tsx`), and Retry/Dismiss call `regenerate()`/`clearError()` directly — genuine recovery, no fake retries or page reloads.

### Why the route 500 body is now a friendly constant instead of the raw error message (FE-08)

The SDK's `DefaultChatTransport` throws `new Error(await response.text())` on non-OK responses, so whatever the route puts in the 500 body becomes the client-side `error.message`. Returning the raw provider message leaked internals toward any error UI. The route now returns a stable `{ error: "The assistant couldn't respond. Please try again." }` (the client can surface it verbatim) while the real cause is `console.error`'d server-side only. The 400 body (`"No messages provided"`) is unchanged.

### Why an empty-response banner was NOT added (FE-08)

The SDK never commits an assistant message with zero content parts — `write()` fires only on content events (`text-start`, `tool-input-start`, …), so a no-content turn simply produces no message. A "No response" banner would be unreachable dead code, so it was removed during verification rather than shipped as fake logic.

### Why the museum wiring (Phase C) reuses existing systems instead of adding new ones

The standalone rooms already shared one world graph, route map, navigation adapter, renderer, and repository layer. Phase C's job was to connect them, so it added only two link surfaces plus one bridge function (`getPortfolioRouteForExhibitId`) and an optional `exhibits` param on `populateCorridor`. Building a second navigation/filtering system would have duplicated state and drifted from the working machine — the rooms all render from the same source of truth already.

### Why collection filtering goes through the repository's `getByCollection` seam

`/gallery` reads `?collection=` and asks the repository for that collection's exhibits, then hands them to the existing `populateCorridor` renderer. The gallery and the Collections Wing share one `collectionMeta` map (exported from `collection-experience.tsx`). One seam, one source of collection definitions — no third place to keep them in sync.

### Why a long-term architecture vision document was added (planning only)

`week-05/vision-validation.md` captures Plinth's long-term direction (museum-as-product, `Creator → Portfolio → Projects → Exhibits → Museum Views` content model, Hybrid spatial navigation) after reviewing the current architecture and studying itomdev.com as an interaction reference. It is an **internal reference for future decisions only** — it is not an internship deliverable, does not modify the current implementation plan, and does not authorize refactoring. Nothing in it changes current priorities or the incremental development strategy.

### Why `/playground` and `/health` stay unlinked (orphan routes, by design)

They exist to satisfy assignment requirements and as a component-reuse source, not as museum-facing routes. Wiring them into the museum just to remove "orphan" status would misrepresent dev/demo utilities as part of the visitor experience. `/dashboard` was different: it is a legitimate museum surface, so it got a real inbound edge (footer link) and its dead "Sign in" button became a real link.

---

## Do Not

Project guardrails. These exist so future assistants (Claude, OpenCode, or otherwise) don't need to re-derive them by re-auditing the repo each time.

- **Do not rebuild completed assignments.** FE-05, FE-06, Three Roads, Empty but Live, and FL-04/FL-05's core implementations are done — treat gaps flagged in `REPOSITORY_STATE.md` as evidence/packaging notes unless explicitly marked an implementation gap.
- **Do not replace assignment implementations solely because the final architecture differs.** A mismatch between today's code and the long-term vision is expected at this stage — extend forward, don't rewrite backward.
- **Do not merge or reconcile "Timeline B" into "Timeline A" prematurely.** There is currently only one branch (`main`); do not invent a merge step that isn't part of the documented incremental strategy.
- **Do not treat `playground/` or other demo routes as production features.** They exist to satisfy assignment requirements and as a component-reuse source — not as museum-facing routes themselves.
- **Do not regenerate accepted documentation** (`NOTES.md`, `task-*.md`, `fl-*.md`, submission files) without a specific, verified reason — these are graded/submitted artifacts.
- **Do not change deployment strategy** (framework, hosting, branch structure) unless a specific assignment requires it.
- **Do not remove historical assignment artifacts** (screenshots, NotebookLM docs, stack-rationale docs) without first verifying they aren't still needed for submission.
- **Do not present unverified claims about the future architecture as repository fact.** Keep the distinction between repository-verified evidence and Project Context intact in any future edits to these docs.
