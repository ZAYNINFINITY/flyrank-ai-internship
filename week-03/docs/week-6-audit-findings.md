# Week 6 — Audit Findings (Daily Journal)

**Date:** 2026-08-10
**Scope:** Audit of the three Week 6 assignments against the repository's current state, plus verification of submission-readiness.
**Method:** Repository inspection (commits, files, docs, routes), local quality gates (`lint`, `typecheck`, `test`, `build`, `test:e2e`), live CI status via GitHub, and live-site verification.

> **Transparency note:** The exact dashboard rubric text for the three Week 6 assignments is not present in this repository. The audit verifies each assignment against its implementation, tests, evidence, and CI state, and maps it to the assignment name given by the owner. If the dashboard specifies additional rubric items, confirm before submission.

---

## 1. Quality-gate matrix (run for this audit)

| Gate | Local | CI |
|---|---|---|
| ESLint (`npm run lint`) | 0 errors, 3 pre-existing warnings | ✅ passed |
| Typecheck (`npm run typecheck`) | clean | ✅ passed |
| Unit tests (`npm test`) | 28/29 pass — **1 timing-fragile** | ✅ 29/29 (runs 31317092875, 31320432472, 31328347815) |
| Production build (`npm run build`) | green | ✅ passed |
| E2E (`npm run test:e2e`) | 1/1 passed (Chromium) | ✅ passed |
| Deployment | https://plinth-cyan.vercel.app returns 200; `/playground/motion-lab` live | — |

**Overall:** Structurally submission-ready (CI green, tests, build, e2e all pass). Two findings need an owner decision before final sign-off: **(1)** a genuine bug — `--motion-ease-*` custom properties are referenced but never defined, so the success "pop" and error "shake" animations never run (see §2); **(2)** one timing-fragile unit test (see §3). Neither breaks CI; both are small, safe fixes.

---

## 2. Assignment 1 — FE-AA1: Buttons with a Brain

**Finding: Complete, with a genuine motion bug (see below).**

- Implementation verified: `components/primitives/motion-button.tsx`, `lib/motion/tokens.ts`, keyframes in `app/globals.css`, used in home CTA (`app/page.tsx`) and Curator Send (`components/ai/chat-panel.tsx`).
- 8 dedicated tests in `motion-button.test.tsx` (idle, disabled, busy+disabled, controlled success/error, async cycle, failure→error, interruptible guard).
- **Gap before this audit:** no dedicated evidence doc and no screenshots. **Resolved now:** 4 live screenshots captured from `/playground/motion-lab` (idle / loading / success / error) and the Week 6 submission packet documents the assignment.
- Live review page: https://plinth-cyan.vercel.app/playground/motion-lab (force buttons verified working).
- Commit: `e77f609`.

### ⚠ Finding (genuine bug): `--motion-ease-*` custom properties are never defined

`motion-button.tsx` references three CSS custom properties — `--motion-ease-standard`, `--motion-ease-enter`, `--motion-ease-shake` — but **none of them are defined anywhere** (no `:root`, no `@theme`, no inline style). `lib/motion/tokens.ts`'s comment claims they are "defined in app/globals.css (--motion-*)", which is **not true** — `globals.css` defines the keyframes and the reduced-motion block, but no `--motion-*` custom properties.

Verified in the live browser (computed styles on `/playground/motion-lab`):

| State | Intended | Verified computed style |
|---|---|---|
| loading spinner | `plinth-spin` | ✅ `plinth-spin` runs (no `var()` used) |
| success pop | `plinth-pop 320ms var(--motion-ease-enter)` | ❌ `animation-name: none` — **pop never runs** |
| error shake | `plinth-shake 500ms var(--motion-ease-shake)` | ❌ `animation-name: none` — **shake never runs** |
| label crossfade | `ease-[var(--motion-ease-standard)]` | ⚠️ falls back to default `ease` (`cubic-bezier(0.4,0,0.2,1)`) |

Why: `var()` with no fallback referencing an undefined custom property makes the declaration *guaranteed-invalid* — so the entire `animation` shorthand is dropped (→ `none`), and the transition easing falls back to the default. The state feedback itself is unaffected (labels, icons, and tint swaps still happen) — the "choreography" (pop/shake) is what is inert.

- **Root cause:** missing definitions in `app/globals.css` (or a fallback in each `var()`).
- **Minimal fix (implementation change — NOT applied, per freeze):** add to `app/globals.css`:
  ```css
  :root {
    --motion-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
    --motion-ease-enter: cubic-bezier(0.05, 0.7, 0.1, 1);
    --motion-ease-shake: cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }
  ```
- **Decision needed from owner:** this is the one genuine code-level issue found in the Week 6 work. Fix before submission (tiny, safe) or leave for Week 7.

---

## 3. Assignment 2 — FE-09: Testing Pass

**Finding: Complete.**

- 29 tests across 5 files (8 motion-button, 6 chat-panel, 6 tool-state-views, 5 login, 4 exhibit-tool-result) — file list verified on disk.
- Real Playwright e2e (`e2e/museum-flow.spec.ts`) stubs `/api/chat` with a canned SSE stream; no AI API, no secrets. Passed locally (1.6m) and in CI.
- GitHub Actions CI green on all three Week 6 commits (`e77f609` → run 31317092875, `34a5f94` → run 31320432472, `c2905c6` → run 31328347815).
- Evidence doc `week-03/docs/fe-09-ci-evidence.md` + screenshot exist and are referenced correctly.

### ⚠ Finding: one timing-fragile test (non-blocking)

`motion-button.test.tsx` → "drives the full async cycle on click" asserts the transient **loading** label, but the mock async resolves after 100 ms (`feedbackDuration={150}`). On this slow Windows machine the 100 ms window is consistently missed locally (assertion: `data-state === "loading"` fails because the button has already moved to `success`). CI (fast Ubuntu runner) passes 29/29. This is a **test-design** race, not a component bug — production send takes far longer than 100 ms.

- **Recommended fix (implementation change — NOT applied, per freeze):** use `vi.useFakeTimers()` (or lengthen the mock delay) so the loading state is deterministic.
- **Decision needed from owner:** fix now (small, safe) or leave until Week 7.

---

## 4. Assignment 3 — Explain It Like You Built It

**Finding: Complete.**

- Doc committed at `c2905c6` and pushed; CI green on that commit.
- Content verified for accuracy: the museum world graph, renderer pipeline, entry/exit semantics, and `?via=` door routing all match the actual implementation.

### ⚠ Accuracy check (already handled in the doc)

`lib/museum/use-door-entry.ts` exposes `useDoorEntry()` (reads `?via=`) but **no page imports or calls it today** — pages hardcode their entry door via `enterRoom(createVisitor(...), roomId, doorId)`. The Phase 8 doc and `docs/architecture.md` are honest about this ("`?via=` is written but not yet read"). Not a submission issue — a forward-looking hook, documented as such.

---

## 5. Repo-state findings

- **README** `week-06/` row was empty → now points to the Week 6 submission packet.
- **`docs/REPOSITORY_STATE.md`** had no Week 6 section (stale at 2026-08-04) → Week 6 completion section added.
- **FE-AA1 evidence** was missing → packet + 4 live screenshots added (`week-03/docs/screenshots/fe-aa1-motion-{idle,loading,success,error}.png`).
- **ESLint:** 3 pre-existing warnings (unused imports: `EntityComponentProps` in `world-renderer.tsx`, `worldIndex` in `lib/museum/queries.ts`, `Wing` in `lib/museum/world.ts`). Pre-existing, non-fatal, identical to Week 5's noted warnings — left untouched.
- Working tree clean after the audit's documentation commit.

---

## 6. Anything still required from the owner

1. **Confirm the three Week 6 assignments** map to: FE-AA1 → Buttons with a Brain, FE-09 → Testing Pass, Explain It Like You Built It. The exact dashboard rubric isn't in the repo; if the dashboard adds requirements beyond what's documented here, say so and they'll be addressed.
2. **Decide on the `--motion-ease-*` bug (genuine code issue):** fix now (add the three custom properties to `app/globals.css` — tiny, safe) or leave for Week 7. Per the audit freeze, implementation was not modified.
3. **Decide on the flaky test:** leave it (CI stays green) or allow a small test-only fix before Week 7.
4. **Optional:** re-capture FE-AA1 screenshots if you want different button variants or the full-page view.

---

*This journal is part of the Week 6 documentation commit. Review findings together before proceeding to Week 7.*
