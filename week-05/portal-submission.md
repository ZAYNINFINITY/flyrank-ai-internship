# Week 5 — Portal Submission Links

Copy-paste ready resources for each Week 5 assignment. Attach the files / paste the links into the corresponding portal submission.

**Intern:** Zain Ul Abideen · **Track:** Frontend AI Engineering
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://plinth-cyan.vercel.app
**Master packet:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/submission-summary.md

---

## Assignment 1 — Museum Spatial System

**Summary:** World graph (`Building → Floor → Wing → Room → Door → Surface → Anchor`), world renderer with entity registry, and the four primary rooms — Entrance, Reception, Gallery, Collections — plus exhibit room template. Rooms are real Next.js routes navigable via doors carrying `?via=<doorId>`.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/world.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/types.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/queries.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/placement.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/visitor.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/navigation-adapter.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/world-renderer.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/room-shell.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/door-renderer.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/surface-renderer.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/museum-space.tsx

**Room routes:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/entrance/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/reception/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/collection/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/e/%5Bid%5D/page.tsx

**Commit:** `3b295b5`
**Live:** https://plinth-cyan.vercel.app/entrance · https://plinth-cyan.vercel.app/reception · https://plinth-cyan.vercel.app/gallery · https://plinth-cyan.vercel.app/collection

---

## Assignment 2 — Phase A: AI Communication Layer

**Summary:** Curator's communication layer — streaming AI route, reusable assistant chat surface, model/provider/prompt configuration, and the repository injection seam so the AI depends on the `ExhibitRepository` interface.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/api/chat/route.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/assistant/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/config.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/prompts.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/provider.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/index.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/exhibit-repository.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/mock-exhibit-repository.ts

**Commits:** `defa39e`, `ba83c8d` (foundation `fd493e4`)
**Live:** https://plinth-cyan.vercel.app/assistant

---

## Assignment 3 — FE-07: Tool Results & Structured Output

**Summary:** Chat route upgraded from raw `fetch` + SSE pipe to AI SDK `streamText` with a model-driven `exhibitLookup` tool — Zod-validated `inputSchema`, typed `Exhibit[]` output, and all four tool lifecycle states rendered as dedicated UI. Structured output, no raw JSON exposed.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/ai/tools/exhibit.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/exhibit-tool-result.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/tool-state-views.tsx

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-tool-results.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-sse-tool-call.txt
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-07-output-available.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-07-output-error.png

**Commits:** `defa39e`, `ba83c8d`, `0ad266d`, `8790d6b`
**Live:** https://plinth-cyan.vercel.app/assistant

---

## Assignment 4 — FE-08: Chat Error States & Recovery

**Summary:** Replaced the single hardcoded red banner with a classified error system on the AI SDK's own primitives — offline / bad-request / server classification, `ErrorBoundary` crash safety, and a friendly stable 500 body on the route. Recovery is genuine: Retry → `regenerate()`, Dismiss → `clearError()`.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-error-banner.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/error-boundary.tsx

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-08-error-recovery.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-08-server-error.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/fe-08-offline-error.png

**Commits:** `30959f8`, `2f34caf`
**Live:** https://plinth-cyan.vercel.app/assistant

---

## Assignment 5 — Phase C: Cohesive Museum Wiring

**Summary:** Wired the standalone rooms into one navigable museum without rebuilding anything — home "Enter the Museum" CTA, nav Museum link, `?collection=` gallery filtering through the existing repository seam, exhibit ↔ long-form cross-links both directions, and `/dashboard` made reachable with a real `/login` link. Verified end-to-end (T1–T12) via Playwright against a production build.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/gallery/gallery-experience.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/e/%5Bid%5D/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/exhibit/%5Busername%5D/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/dashboard/page.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/nav.tsx

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/phase-c-cohesive-wiring.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-home-cta.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-entrance.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-reception.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-corridor.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-collection-journey.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-exhibit-room.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/screenshots/phase-c-longform-crosslinks.png

**Commit:** `bef109e`
**Live:** https://plinth-cyan.vercel.app

---

## Supporting Documentation (not a dashboard assignment)

Evidence docs, screenshots, project memory, and this packet make the completed assignments verifiable and the submission copy-ready.

- Submission packet: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/submission-summary.md
- FE-07 evidence: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-tool-results.md
- FE-08 evidence: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-08-error-recovery.md
- Phase C evidence: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/phase-c-cohesive-wiring.md
- Raw SSE capture: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/fe-07-sse-tool-call.txt
- Vision doc (internal, planning only): https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-05/vision-validation.md
- Screenshots folder: https://github.com/ZAYNINFINITY/flyrank-ai-internship/tree/main/week-05/screenshots

**Quality gates:** `npx eslint .` → 0 errors (3 pre-existing warnings); `npm run build` → green, 17 routes.
