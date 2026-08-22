# Week 6 — Portal Submission Links

Copy-paste ready resources for each Week 6 assignment. Attach the files / paste the links into the corresponding portal submission.

**Intern:** Zain Ul Abideen · **Track:** Frontend AI Engineering
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://foyer-cyan.vercel.app
**Master packet:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/week-6-submission-summary.md

---

## Assignment 1 — FE-AA1: Buttons with a Brain

**Summary:** A `MotionButton` primitive that owns its async state machine — idle → loading → success/error → idle — with `aria-busy`, an interruptible async cycle (spam-clicks never double-fire), compositor-friendly `transform`/`opacity`-only motion (pop, spin, shake via the `foyer-*` keyframes), and reduced-motion support. Live demo page forces each state with the exact production component.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/motion/tokens.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/globals.css
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/playground/motion-lab/page.tsx

**Where it's used in production:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/page.tsx (home CTA)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.tsx (Curator Send)

**Tests:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.test.tsx (8 tests)

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/week-6-submission-summary.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/week-6-audit-findings.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-idle.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-loading.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-success.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-error.png

**Commits:** `e77f609` (implementation) · `c6def02` (post-audit fix: `--motion-ease-*` tokens defined, pop/shake now animate)
**Live:** https://foyer-cyan.vercel.app/playground/motion-lab

---

## Assignment 2 — FE-09: Testing Pass

**Summary:** A testing pass over the existing feature surface — 29 component tests across 5 files, one real Playwright e2e that walks the museum flow (home → entrance → reception → curator chat → send) with `/api/chat` stubbed via SSE (no real AI, no secrets), and a GitHub Actions CI workflow that verifies lint, typecheck, unit tests, production build, and the browser flow on every push.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/.github/workflows/ci.yml
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/e2e/museum-flow.spec.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/vitest.config.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/vitest.setup.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/playwright.config.ts

**Test files (29 tests / 5 files):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/primitives/motion-button.test.tsx (8)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/chat-panel.test.tsx (6)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/tool-state-views.test.tsx (6)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/login/page.test.tsx (5)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/ai/exhibit-tool-result.test.tsx (4)

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/fe-09-ci-evidence.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/week6-fe-09-ci-green.png

**Commits:** `e77f609` · `34a5f94` · `c6def02` (deterministic async-cycle test)
**CI runs (all green):** [31317092875](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31317092875) · [31320432472](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31320432472) · [31328347815](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31328347815) · [31426007202](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31426007202)
**Live:** https://foyer-cyan.vercel.app

---

## Assignment 3 — Explain It Like You Built It

**Summary:** A plain-language, first-person explanation of how the museum works internally — the world graph (`Building → Floor → Wing → Room → Door → Surface → Anchor`), spatial queries, entry/exit semantics, `?via=` door routing, the renderer pipeline, and the navigation adapter — written for a non-author reviewer.

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/phase-8-explain-it-like-you-built-it.md

**Commit:** `c2905c6`
**Live:** N/A (documentation assignment)

---

## Supporting Documentation (not a dashboard assignment)

Evidence docs, screenshots, project memory, and this packet make the completed assignments verifiable and the submission copy-ready.

- Submission packet: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/week-6-submission-summary.md
- Audit findings: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/week-6-audit-findings.md
- FE-09 CI evidence: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/fe-09-ci-evidence.md
- Explain It Like You Built It: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/phase-8-explain-it-like-you-built-it.md
- Screenshots:
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-idle.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-loading.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-success.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/fe-aa1-motion-error.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-06/screenshots/week6-fe-09-ci-green.png
- Project memory: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/docs/REPOSITORY_STATE.md

**Quality gates (local + CI):** ESLint → 0 errors (3 pre-existing warnings); typecheck → clean; unit tests → 29/29 (3 consecutive local runs) and 29/29 in CI; production build → green; e2e → 1/1 passed locally and in CI.
