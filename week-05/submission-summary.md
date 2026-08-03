# Week 5 — Submission Summary

**Intern:** Zain Ul Abideen
**Track:** Frontend AI Engineering
**Program:** FlyRank AI Internship
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://plinth-cyan.vercel.app
**Week status:** Complete & frozen
**Submission:** 6 assignments (one Week 5 dashboard item is still TBD and is **not** part of this submission)

---

## Week 5 Overview

Week 5 turns the standalone Plinth rooms into a working museum with a live AI layer. The museum spatial system added a real world graph and renderer (entrance → reception → galleries → collections → exhibit rooms); the AI communication layer wired the Curator assistant, streaming chat route, and repository injection; FE-07 added model-driven tool calls with structured output; FE-08 added classified chat error states with SDK-native recovery; Phase C tied everything into one navigable museum; and all evidence, screenshots, and project documentation were synchronized for submission.

**Quality gates:** `npx eslint .` → 0 errors (3 pre-existing warnings); `npm run build` → green, 17 routes.

---

## Assignment 1 — Museum Spatial System

**Status:** Complete
**Summary:** The world graph (`Building → Floor → Wing → Room → Door → Surface → Anchor`), the world renderer with entity registry, and the four primary museum rooms — Entrance, Reception, Gallery (Main Corridor), and Collections — plus the exhibit room template. Rooms are real Next.js routes navigable via doors carrying `?via=<doorId>`.

### Implementation files (main)

- [`week-03/app/lib/museum/world.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/world.ts) — world graph, rooms, doors, surfaces, anchors, indexes
- [`week-03/app/lib/museum/types.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/types.ts) — core museum types (`RoomKind`, `EntityType`, `LightingPreset`, `AnchorCapability`, `Visitor`, `Placement`)
- [`week-03/app/lib/museum/queries.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/queries.ts) — current room, visible doors, connected rooms, surface layout
- [`week-03/app/lib/museum/placement.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/placement.ts) — capability-based placement + corridor population
- [`week-03/app/lib/museum/visitor.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/visitor.ts) — `createVisitor` / `enterRoom` (current room + entry direction)
- [`week-03/app/lib/museum/navigation-adapter.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/navigation-adapter.ts) — route map (`RoomId` → URL), `?via=` door entry
- [`week-03/app/lib/museum/use-door-entry.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/use-door-entry.ts) — reads `?via=` for entry transitions
- [`week-03/app/lib/navigation/museum-layout.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/navigation/museum-layout.ts) — direction model (`ahead`/`left`/`right`/`back`/`exit`)
- [`week-03/app/components/renderer/world-renderer.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/world-renderer.tsx) — world renderer (room + doors + surfaces + breadcrumb)
- [`week-03/app/components/renderer/room-shell.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/room-shell.tsx) — room shell with lighting + transition per `RoomKind`
- [`week-03/app/components/renderer/door-renderer.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/door-renderer.tsx) — door rendering with direction
- [`week-03/app/components/renderer/surface-renderer.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/surface-renderer.tsx) — wall/surface layout rendering
- [`week-03/app/components/renderer/entity-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entity-view.tsx) — registry-driven entity renderer

### Implementation files (supporting)

- [`week-03/app/components/renderer/direction-utils.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/direction-utils.ts) — entry surface + relative direction helpers
- [`week-03/app/components/renderer/entities/default-registry.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/default-registry.ts) — entity → view component registry
- [`week-03/app/components/renderer/entities/exhibit-card.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/exhibit-card.tsx), [`artifact-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/artifact-view.tsx), [`projection-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/projection-view.tsx), [`signage-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/signage-view.tsx), [`statue-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/statue-view.tsx), [`terminal-card.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/terminal-card.tsx), [`timeline-view.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/entities/timeline-view.tsx)
- [`week-03/app/components/museum-space.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/museum-space.tsx) — space atmosphere + transition wrapper
- [`week-03/app/components/space-door.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/space-door.tsx) — door link component
- [`week-03/app/components/spatial-breadcrumb.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/spatial-breadcrumb.tsx) — "You are here" spatial footer
- [`week-03/app/app/globals.css`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/globals.css) — museum space atmospheres + transitions
- [`week-03/app/lib/repository/exhibit-repository.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/exhibit-repository.ts) — repository interface
- [`week-03/app/lib/repository/mock-exhibit-repository.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/mock-exhibit-repository.ts) — mock repository
- [`week-03/app/lib/types/exhibit.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/types/exhibit.ts) — exhibit domain types

### Room routes

- Entrance: [`app/entrance/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/entrance/page.tsx) + [`entrance-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/entrance/entrance-experience.tsx)
- Reception: [`app/reception/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/reception/page.tsx) + [`reception-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/reception/reception-experience.tsx)
- Gallery: [`app/gallery/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/page.tsx) + [`gallery-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/gallery-experience.tsx)
- Collections: [`app/collection/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/collection/page.tsx) + [`collection-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/collection/collection-experience.tsx)
- Exhibit room: [`app/exhibit/e/[id]/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/e/[id]/page.tsx)

### Commits

- `3b295b5` — feat: add museum spatial system (entrance, reception, galleries, collections)

### Live deployment

- https://plinth-cyan.vercel.app/entrance
- https://plinth-cyan.vercel.app/reception
- https://plinth-cyan.vercel.app/gallery
- https://plinth-cyan.vercel.app/collection
- https://plinth-cyan.vercel.app/exhibit/e/pos-it

---

## Assignment 2 — Phase A: AI Communication Layer

**Status:** Complete
**Summary:** The Curator's communication layer — the streaming AI route, the reusable assistant chat surface, the model/provider/prompt configuration, and the repository injection seam that lets the AI depend on the `ExhibitRepository` interface instead of a concrete source.

### Implementation files (main)

- [`week-03/app/app/api/chat/route.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts) — AI route: `streamText` + `createOpenAICompatible` → OpenRouter, `toUIMessageStreamResponse()`
- [`week-03/app/app/assistant/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/assistant/page.tsx) — Curator assistant page
- [`week-03/app/components/ai/chat-panel.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx) — reusable chat surface (`useChat`, text + tool parts, stop, autoscroll)
- [`week-03/app/lib/ai/config.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/config.ts) — model name, params, all AI settings
- [`week-03/app/lib/ai/prompts.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/prompts.ts) — Curator system prompts (separated from logic)
- [`week-03/app/lib/ai/provider.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/provider.ts) — provider abstraction
- [`week-03/app/lib/repository/index.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/index.ts) — **repository injection seam** (`getExhibitRepository()` lazy singleton)
- [`week-03/app/lib/repository/exhibit-repository.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/exhibit-repository.ts) — `ExhibitRepository` interface
- [`week-03/app/lib/repository/mock-exhibit-repository.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/mock-exhibit-repository.ts) — mock implementation

### Implementation files (supporting)

- [`week-03/app/lib/types/exhibit.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/types/exhibit.ts) — exhibit domain types shared by route + repository

### Commits

- `defa39e` — feat(ai): add exhibit repository seam, exhibitLookup tool, and streamText chat route
- `ba83c8d` — feat(ai): add reusable ChatPanel with tool state views and exhibit result card
- (Foundation from Week 4 / FE-06: `fd493e4` — streaming chat engine)

### Live deployment

- https://plinth-cyan.vercel.app/assistant

---

## Assignment 3 — FE-07: Tool Results & Structured Output

**Status:** Complete
**Summary:** The chat route was upgraded from a raw `fetch` + SSE pipe to AI SDK `streamText` with a model-driven `exhibitLookup` tool. The tool accepts a Zod-validated `inputSchema`, returns typed `Exhibit[]`, and all four tool lifecycle states (`input-streaming`, `input-available`, `output-available`, `output-error`) are rendered as dedicated UI — structured output, no raw JSON exposed to the visitor.

### Implementation files (main)

- [`week-03/app/lib/ai/tools/exhibit.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/tools/exhibit.ts) — `exhibitLookup` tool + Zod `inputSchema`
- [`week-03/app/components/ai/exhibit-tool-result.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/exhibit-tool-result.tsx) — typed `Exhibit[]` result cards linking into the museum
- [`week-03/app/components/ai/tool-state-views.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/tool-state-views.tsx) — 4 tool lifecycle states

### Implementation files (supporting)

- [`week-03/app/components/ai/chat-panel.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx) — tool part rendering
- [`week-03/app/app/api/chat/route.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts) — `tools: { exhibitLookup }` wiring in `streamText`

### Documentation / evidence

- [`week-05/fe-07-tool-results.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-tool-results.md) — full write-up + verification
- [`week-05/fe-07-sse-tool-call.txt`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-sse-tool-call.txt) — raw SSE capture of a genuine tool call
- [`week-05/screenshots/fe-07-output-available.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-07-output-available.png) — exhibit result cards (output-available)
- [`week-05/screenshots/fe-07-output-error.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-07-output-error.png) — tool error card (output-error)

### Commits

- `defa39e`, `ba83c8d` — implementation
- `0ad266d`, `8790d6b` — evidence + docs

### Live deployment

- https://plinth-cyan.vercel.app/assistant

---

## Assignment 4 — FE-08: Chat Error States & Recovery

**Status:** Complete
**Summary:** Replaced the single hardcoded red banner with a classified error system built on the AI SDK's own primitives — `chat-error-banner.tsx` (offline / bad-request / server classification), `error-boundary.tsx` (crash safety), and a friendly stable 500 body on the route. Recovery is genuine: Retry → `regenerate()`, Dismiss → `clearError()`.

### Implementation files (main)

- [`week-03/app/components/ai/chat-error-banner.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-error-banner.tsx) — error classification + banner UI (Retry / Dismiss)
- [`week-03/app/components/ai/error-boundary.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/error-boundary.tsx) — render-crash fallback

### Implementation files (supporting)

- [`week-03/app/components/ai/chat-panel.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx) — `regenerate()` / `clearError()` recovery wiring
- [`week-03/app/app/assistant/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/assistant/page.tsx) — wrapped in `ErrorBoundary`
- [`week-03/app/app/api/chat/route.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts) — friendly 500 body + server-side log

### Documentation / evidence

- [`week-05/fe-08-error-recovery.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-08-error-recovery.md) — full write-up + T1–T4 verification
- [`week-05/screenshots/fe-08-server-error.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-08-server-error.png) — server-kind banner (T1)
- [`week-05/screenshots/fe-08-offline-error.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-08-offline-error.png) — offline banner (T4)

### Commits

- `30959f8` — implementation
- `2f34caf` — evidence note

### Live deployment

- https://plinth-cyan.vercel.app/assistant

---

## Assignment 5 — Phase C: Cohesive Museum Wiring

**Status:** Complete
**Summary:** Wired the standalone rooms into one navigable museum without rebuilding anything: home "Enter the Museum" CTA, nav Museum link, `?collection=` gallery filtering through the existing repository seam, exhibit ↔ long-form cross-links both directions, and `/dashboard` made reachable with a real `/login` link. Verified end-to-end (T1–T12) via Playwright against a production build.

### Implementation files (main)

- [`week-03/app/app/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/page.tsx) — home "Enter the Museum" CTA
- [`week-03/app/components/primitives/nav.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/nav.tsx) — Museum nav link
- [`week-03/app/app/layout.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/layout.tsx) — footer Dashboard link
- [`week-03/app/app/gallery/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/page.tsx) — `Suspense` + `useSearchParams`, `toCollection` validation, filtered corridor
- [`week-03/app/app/gallery/gallery-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/gallery-experience.tsx) — collection meta header
- [`week-03/app/app/collection/collection-experience.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/collection/collection-experience.tsx) — exported `collectionMeta` (single source)
- [`week-03/app/lib/museum/navigation-adapter.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/navigation-adapter.ts) — `getPortfolioRouteForExhibitId` bridge
- [`week-03/app/app/exhibit/e/[id]/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/e/[id]/page.tsx) — "Open the full exhibit →"
- [`week-03/app/app/exhibit/[username]/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/[username]/page.tsx) — "View this in the museum room →"
- [`week-03/app/app/dashboard/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/dashboard/page.tsx) — real `<Link href="/login">`

### Implementation files (supporting)

- [`week-03/app/lib/museum/placement.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/placement.ts) — optional `exhibits` param on `populateCorridor`
- [`week-03/app/lib/repository/mock-exhibit-repository.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/mock-exhibit-repository.ts) — Collaborative Workspace media `src: ""` (removes `/images/collab.png` 404)
- [`week-03/app/app/entrance/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/entrance/page.tsx), [`reception/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/reception/page.tsx), [`collection/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/collection/page.tsx) — `enterRoom(createVisitor(...))` purity-lint fix

### Documentation / evidence

- [`week-05/phase-c-cohesive-wiring.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/phase-c-cohesive-wiring.md) — full write-up + T1–T12 verification table
- Screenshots (7):
  - [`screenshots/phase-c-home-cta.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-home-cta.png)
  - [`screenshots/phase-c-entrance.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-entrance.png)
  - [`screenshots/phase-c-reception.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-reception.png)
  - [`screenshots/phase-c-corridor.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-corridor.png)
  - [`screenshots/phase-c-collection-journey.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-collection-journey.png)
  - [`screenshots/phase-c-exhibit-room.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-exhibit-room.png)
  - [`screenshots/phase-c-longform-crosslinks.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-longform-crosslinks.png)

### Commit

- `bef109e` — feat(phase-c): cohesive museum wiring — entry, collection filter, exhibit cross-links, orphan routes

### Live deployment

- https://plinth-cyan.vercel.app (home CTA, nav, filtered gallery, cross-links, dashboard)

---

## Assignment 6 — Week 5 Documentation & Evidence

**Status:** Complete
**Summary:** All Week 5 evidence documents, screenshots, and project documentation synchronized for submission. Project memory (`README.md`, `docs/REPOSITORY_STATE.md`, `docs/roadmap.md`, `docs/architecture.md`, `docs/DECISIONS.md`, `docs/CONTRIBUTING_AI.md`) reflects Week 5 completion; the canonical submission packet is this document.

### Documentation / evidence

- [`week-05/submission-summary.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/submission-summary.md) — this submission packet
- [`week-05/fe-07-tool-results.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-tool-results.md) — FE-07 evidence
- [`week-05/fe-08-error-recovery.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-08-error-recovery.md) — FE-08 evidence
- [`week-05/phase-c-cohesive-wiring.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/phase-c-cohesive-wiring.md) — Phase C evidence
- [`week-05/fe-07-sse-tool-call.txt`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-sse-tool-call.txt) — raw tool-call capture
- [`week-05/vision-validation.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/vision-validation.md) — long-term vision (planning context only)

### Screenshots (11 total)

- FE-07: `fe-07-output-available.png`, `fe-07-output-error.png`
- FE-08: `fe-08-server-error.png`, `fe-08-offline-error.png`
- Phase C: `phase-c-home-cta.png`, `phase-c-entrance.png`, `phase-c-reception.png`, `phase-c-corridor.png`, `phase-c-collection-journey.png`, `phase-c-exhibit-room.png`, `phase-c-longform-crosslinks.png`

### Project documentation (synchronized)

- [`README.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/README.md) — Week 5 marked Done
- [`docs/REPOSITORY_STATE.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/REPOSITORY_STATE.md) — verified 2026-08-04, 17 routes, Week 5 Completion section
- [`docs/roadmap.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/roadmap.md) — Milestones 2–4 checked
- [`docs/architecture.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/architecture.md) — museum engine / AI layer current; "Future" reclassified
- [`docs/DECISIONS.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/DECISIONS.md) — FE-07 / FE-08 / Phase C / vision decisions
- [`docs/CONTRIBUTING_AI.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/CONTRIBUTING_AI.md) — Read First updated with vision doc

### Commits

- `0ad266d`, `8790d6b` — FE-07 evidence
- `2f34caf` — FE-08 evidence note
- `6bc76ea` — long-term vision document
- `f6fb150` — week 5 complete + project memory sync

---

## Deliverables Summary

| Assignment | Status | Key commit | Live |
|---|---|---|---|
| Museum Spatial System | ✅ | `3b295b5` | /entrance, /reception, /gallery, /collection |
| Phase A — AI Communication Layer | ✅ | `defa39e`, `ba83c8d` | /assistant |
| FE-07 — Tool Results & Structured Output | ✅ | `defa39e`–`8790d6b` | /assistant |
| FE-08 — Chat Error States & Recovery | ✅ | `30959f8` | /assistant |
| Phase C — Cohesive Museum Wiring | ✅ | `bef109e` | / |
| Week 5 Documentation & Evidence | ✅ | `6bc76ea`, `f6fb150` | — |

## Evidence Index

| Evidence | Type | Located at |
|---|---|---|
| FE-07 tool results + verification | Doc | `week-05/fe-07-tool-results.md` |
| FE-07 raw SSE tool call | Capture | `week-05/fe-07-sse-tool-call.txt` |
| FE-08 error states + T1–T4 | Doc | `week-05/fe-08-error-recovery.md` |
| Phase C wiring + T1–T12 | Doc | `week-05/phase-c-cohesive-wiring.md` |
| Screenshots | 11 PNG | `week-05/screenshots/` |
| Long-term vision (planning only) | Doc | `week-05/vision-validation.md` |
| Submission packet | Doc | `week-05/submission-summary.md` |

## Repository

- **Repo:** https://github.com/ZAYNINFINITY/flyrank-ai-internship
- **Branch:** `main`
- **App root:** `week-03/app/`
- **Week 5 evidence:** `week-05/`

## Live Deployment

- https://plinth-cyan.vercel.app
- Verified live: home "Enter the Museum", `/entrance`, `/reception`, `/gallery?collection=`, exhibit rooms, `/assistant`, `/dashboard`, `/login`.

## Build Status

- `npm run build` → **green**, 17 routes (16 static + dynamic `/api/chat`).
- Run with `NODE_OPTIONS=--max-old-space-size=4096` (Windows worker OOM flake, environmental).

## ESLint Status

- `npx eslint .` → **0 errors**, 3 pre-existing warnings (unused `EntityComponentProps`, `worldIndex`, `Wing`) — untouched by design.

## Notes for Reviewer

- **Week 5 dashboard structure is the source of truth** for assignment grouping; the repository is the implementation evidence. Six assignments are submitted; one additional dashboard item remains **TBD** and is intentionally not part of this submission.
- **Everything is preserved and extended, not rewritten.** Week 5 builds on the Week 3/4 foundation (routes, primitives, FE-05/FE-06, FL-04/FL-05); no completed assignment was rebuilt.
- **AI provider:** Google Gemini (2.5 flash-lite) via OpenRouter (`createOpenAICompatible`), config in `lib/ai/config.ts`, swap point in `lib/ai/provider.ts`.
- **Model-driven tools:** FE-07's `exhibitLookup` runs on the AI SDK's `streamText`; tool output is typed `Exhibit[]` from the `ExhibitRepository` interface (mock-backed today, swap in `lib/repository/index.ts`).
- **Known, documented limitations** (non-blocking): FE-07 input-streaming state is too transient to screenshot (~50 ms, provider characteristic); FE-08 `ErrorBoundary` fallback verified by wiring review rather than a live crash (no natural crash exists); collection filtering is repository-backed on load.
- **Vision document** (`week-05/vision-validation.md`) is internal planning context only — it is not an internship deliverable and does not change the roadmap.
