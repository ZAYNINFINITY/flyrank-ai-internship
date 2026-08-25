# Week 8 — Submission Checklist (Portal Copy-Paste)

**Capstone: Ship It — Your First Production AI Product**

**Repo:** https://github.com/ZAYNINFINITY/flyrank-ai-internship
**Branch:** `main`
**Master packet:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/capstone-final-report.md

**Live URL:** https://plinth-cyan.vercel.app ✅

---

## Deliverables

### 1. Project Brief

**Attach (MD):**
- `week-08/project-brief.md`

**Repo link:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/project-brief.md

---

### 2. Live Application

**LINK:** https://plinth-cyan.vercel.app

**Key routes to verify:**
- `/` — 3D museum homepage (or 2D fallback on low-end devices)
- `/explore` — Grid of exhibits
- `/about` — Museum language, about page
- `/exhibit/zayn` — Developer exhibit page
- `/assistant` — AI curator chat

---

### 3. Repository with Complete README

**Repo link:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md

**What the README covers:**
- Project brief and what Foyer solves
- Getting started (one command: `npm install && npm run dev`)
- Architecture overview (what each part does)
- AI integration explained (OpenRouter + curator + exhibitLookup tool)
- Environment variables table
- Testing instructions
- Known limitations & future improvements
- AI honesty line (how AI was used)

---

### 4. Testing Evidence

**Test run output:**
- `week-08/test-results.png` — vitest verbose output showing 74/74 pass

**Test files:**
- `lib/repository/acceptance.test.ts` — 20 tests (data architecture)
- `lib/museum/walkable-model.test.ts` — 6 tests (collision, doors, spawn)
- `lib/renderer/capability.test.ts` — device tier detection
- `components/ai/chat-panel.test.tsx` — chat UI
- `components/ai/exhibit-tool-result.test.tsx` — tool rendering
- `components/ai/tool-state-views.test.tsx` — lifecycle states
- `lib/museum/museum-logic.test.ts` — museum logic
- `lib/museum/via-entry.test.ts` — door entry validation
- `components/primitives/motion-button.test.tsx` — motion button
- `app/login/page.test.tsx` — login page
- `e2e/museum-flow.spec.ts` — Playwright e2e

**Coverage:** 74 tests across 10 unit test files + 1 e2e spec

---

### 5. Performance & Accessibility Audit

**Attach (MD):**
- `week-08/lighthouse-scores.md`
- WAVE audit pass (0 errors)

**Screenshots:**
- Lighthouse scores for all routes (in lighthouse-scores.md)
- WAVE audit pass (0 errors)

**Concrete improvement:** "Accessible view" toggle — added because 3D canvas scored 95 (not 100) on accessibility. Toggle provides full 2D accessible path.

---

### 6. Deployment Checklist

**Attach (MD):**
- `week-08/deployment-checklist.md`

**Covers:**
- Vercel config and environment variables
- Build verification (tsc, eslint, vitest)
- Error states verified (API failure, 404, no-WebGL)
- Rollback plan (redeploy from main)
- Known limitations

---

### 7. Reflection

**Attach (MD):**
- `week-08/reflection.md`

**Covers:**
- What was hardest (3D-to-2D renderer seam)
- What I'd do differently (start with 2D fallback architecture)
- One thing that surprised me (AI integration was easier than expected — schema matters more than prompt)

---

### 8. Capstone Report

**Attach (MD):**
- `week-08/capstone-final-report.md`

**Covers:**
- Full technical documentation with screenshots
- Before/after journey with 94 screenshots
- All assignment requirements tracked with status
- Deliverables index

---

### 9. Demo Video

**Attach (MP4):**
- `week-08/demo-video-v2.mp4` (3-5 minutes, live run, narration)

**Script:** `week-08/fl-09-demo-video.md`

---

## Quick Reference

| # | Deliverable | File | Status |
|---|-------------|------|--------|
| 1 | Project Brief | `project-brief.md` | ✅ |
| 2 | Live App | — | ✅ [plinth-cyan.vercel.app](https://plinth-cyan.vercel.app) |
| 3 | README | `README.md` | ✅ |
| 4 | Testing Evidence | `test-results.png` | ✅ |
| 5 | Performance Audit | `lighthouse-scores.md` | ✅ |
| 6 | Deployment Checklist | `deployment-checklist.md` | ✅ |
| 7 | Reflection | `reflection.md` | ✅ |
| 8 | Capstone Report | `capstone-final-report.md` | ✅ |
| 9 | Demo Video | `demo-video-v2.mp4` | ⬜ Recording |
