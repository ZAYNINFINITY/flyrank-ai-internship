# Week 6 — Submission Summary

**Intern:** Zain Ul Abideen
**Track:** Frontend AI Engineering
**Program:** FlyRank AI Internship
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://plinth-cyan.vercel.app
**Week status:** Complete & frozen
**Submission:** All three available Week 6 assignments — FE-AA1 (Buttons with a Brain), FE-09 (Testing Pass), and Explain It Like You Built It — accompanied by implementation, tests, evidence documents, screenshots, and a green CI pipeline.

---

## Week 6 Overview

Week 6 hardens the Plinth capstone. FE-AA1 gives the app a real interaction language: a `MotionButton` primitive whose state machine (idle → loading → success/error → idle) is choreographed entirely with compositor-friendly `transform`/`opacity` transitions, with an interruptible async cycle, `aria-busy`, and reduced-motion support. FE-09 locks the regression baseline: 29 component tests across 5 files, one real Playwright e2e walk of the museum, and a GitHub Actions CI workflow that verifies lint, types, tests, build, and the browser flow on every push. Explain It Like You Built It documents the museum world graph and spatial navigation in plain language.

**Quality gates (verified locally and in CI):** ESLint → 0 errors (3 pre-existing warnings); `npm run typecheck` → clean; `npm test` → 29/29 locally (3 consecutive runs) and 29/29 in CI; `npm run build` → green; `npm run test:e2e` → 1/1 passed locally and in CI.

---

## Assignment 1 — FE-AA1: Buttons with a Brain

**Status:** Complete (post-fix, verified live)
**Summary:** A button primitive that communicates its full lifecycle — idle, hover/focus, loading, success, error — instead of a silent `<button>`. "With a brain" = the button owns its async state machine: it disables itself and sets `aria-busy` while loading, swaps to success/error labels, shakes on error, resets after a configurable feedback window, and is interruptible (spam-clicks never double-fire). Everything animates via `transform` + `opacity` only (no layout thrash), and reduced-motion collapses the movement while keeping the feedback. The primitive is intentionally not tied to the current website's look — the variant system plus shared motion tokens are designed to survive the future museum presentation pass unchanged.

> **Post-audit fix (`c6def02`, verified live):** the success "pop" and error "shake" keyframe animations reference `var(--motion-ease-enter)` / `var(--motion-ease-shake)`, which were not defined in `app/globals.css` — so the `animation` shorthand was dropped (computed `animation-name: none`) and the choreography was inert. The three `--motion-ease-*` custom properties are now defined in `:root` (synced with `lib/motion/tokens.ts`); computed styles on the live site now show `plinth-pop 0.32s cubic-bezier(0.05,0.7,0.1,1)` and `plinth-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97)`. Full detail: [`week-6-audit-findings.md`](week-6-audit-findings.md) §2.

### Implementation files (main)

- [`week-03/app/components/primitives/motion-button.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.tsx) — the state-machine button primitive (controlled + uncontrolled modes, `aria-busy`, interruptible guard, spinner/check/alert icons)
- [`week-03/app/lib/motion/tokens.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/motion/tokens.ts) — shared motion tokens: `MotionState`, `MOTION_FEEDBACK_DURATION_MS`, easing & duration constants
- [`week-03/app/app/globals.css`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/globals.css) — `plinth-pop`, `plinth-spin`, `plinth-shake` keyframes + the `--motion-ease-*` custom properties (defined in `:root`, synced with `lib/motion/tokens.ts`) + reduced-motion collapse

### Where it's used in production

- [`week-03/app/app/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/page.tsx) — home "Create your exhibit" CTA
- [`week-03/app/components/ai/chat-panel.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx) — Curator "Send message" button (the "brain" is what makes the send button behave correctly against the live stream)
- [`week-03/app/app/playground/motion-lab/page.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/playground/motion-lab/page.tsx) — Motion Lab: reviewers' window that imports the exact production component and lets you force each lifecycle state

### Tests

- [`week-03/app/components/primitives/motion-button.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.test.tsx) — 8 tests: idle render, disabled prop, loading is busy + disabled, controlled success, controlled error, full async cycle, async failure → error state, interruptible guard

### Evidence / screenshots

- [`week-06/screenshots/fe-aa1-motion-idle.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-idle.png) — controlled idle
- [`week-06/screenshots/fe-aa1-motion-loading.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-loading.png) — forced loading (spinner + busy)
- [`week-06/screenshots/fe-aa1-motion-success.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-success.png) — forced success (check + tint; pop verified live post-fix)
- [`week-06/screenshots/fe-aa1-motion-error.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-error.png) — forced error (retry + red tint; shake verified live post-fix)

### Commits

- `e77f609` — `feat(week6): motion language, 29 component tests, Playwright e2e, GitHub Actions CI`
- `c6def02` — `fix(week6): define motion easing tokens (FE-AA1 pop/shake animate) + make async-cycle test deterministic`

### Live deployment

- https://plinth-cyan.vercel.app/playground/motion-lab (verified live, all four states forceable)

---

## Assignment 2 — FE-09: Testing Pass

**Status:** Complete
**Summary:** A testing pass over the existing feature surface that (1) unit-tests the interactive primitives and AI chat layer, (2) adds one real Playwright e2e that walks the primary museum flow from home → entrance → reception → curator chat → send, and (3) wires it all into GitHub Actions CI so every push verifies lint, typecheck, unit tests, production build, and the browser flow without touching the real AI API.

### Implementation files (main)

- [`.github/workflows/ci.yml`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/.github/workflows/ci.yml) — CI workflow (lint, typecheck, unit, build, Playwright e2e, Chromium only, report artifact on failure)
- [`week-03/app/e2e/museum-flow.spec.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/e2e/museum-flow.spec.ts) — e2e: home → entrance → reception → curator chat → send, with `/api/chat` stubbed via SSE (no real AI, no secrets)
- [`week-03/app/vitest.config.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/vitest.config.ts) + [`week-03/app/vitest.setup.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/vitest.setup.ts) — Vitest config (jsdom, `@/` alias, jest-dom matchers)
- [`week-03/app/playwright.config.ts`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/playwright.config.ts) — Playwright config (build + start, Chromium only, CI retries)

### Test files (29 tests across 5 files)

- [`motion-button.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.test.tsx) — 8 tests
- [`chat-panel.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.test.tsx) — 6 tests
- [`tool-state-views.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/tool-state-views.test.tsx) — 6 tests
- [`login/page.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/login/page.test.tsx) — 5 tests
- [`exhibit-tool-result.test.tsx`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/exhibit-tool-result.test.tsx) — 4 tests

### Evidence / screenshots

- [`week-06/fe-09-ci-evidence.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/fe-09-ci-evidence.md) — evidence doc (what the workflow runs, safety guarantees, how to re-run)
- [`week-06/screenshots/week6-fe-09-ci-green.png`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/week6-fe-09-ci-green.png) — green CI run screenshot

### GitHub (CI runs)

| Commit | CI run | Result |
|---|---|---|
| `e77f609` (motion language + tests + CI) | [31317092875](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31317092875) | ✅ passed |
| `34a5f94` (FE-09 evidence) | [31320432472](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31320432472) | ✅ passed |
| `c2905c6` (Phase 8 doc) | [31328347815](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31328347815) | ✅ passed |
| `c6def02` (motion tokens fix + deterministic test) | [31426007202](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31426007202) | ✅ passed |

### Commits

- `e77f609` — `feat(week6): motion language, 29 component tests, Playwright e2e, GitHub Actions CI`
- `34a5f94` — `docs(week6): record FE-09 green CI evidence (run 31317092875, screenshot)`
- `c6def02` — `fix(week6): define motion easing tokens (FE-AA1 pop/shake animate) + make async-cycle test deterministic`

---

## Assignment 3 — Explain It Like You Built It

**Status:** Complete
**Summary:** A plain-language, first-person explanation of how the museum works internally — the world graph (`Building → Floor → Wing → Room → Door → Surface → Anchor`), spatial queries, entry/exit semantics, `?via=` door routing, the renderer pipeline, and the navigation adapter — written for a non-author reviewer.

### Documentation

- [`week-06/phase-8-explain-it-like-you-built-it.md`](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/phase-8-explain-it-like-you-built-it.md)

### Commits

- `c2905c6` — `docs(week6): phase 8 — explain it like you built it (museum world graph & spatial navigation)`

---

## Remaining items

- **None blocking.** One Week 5 dashboard item remains TBD (as before) and is not part of this submission.
- Both audit findings (FE-AA1 motion bug, timing-fragile test) were **fixed and verified** at `c6def02`.
- See [`week-06/week-6-audit-findings.md`](week-6-audit-findings.md) for the full audit against repo state.

---

## Working tree & repo state

- Working tree clean at time of submission.
- Branch `main`, all Week 6 work committed and pushed, all CI runs green.
- Week 6 documentation lives in `week-06/` per the existing evidence convention.
