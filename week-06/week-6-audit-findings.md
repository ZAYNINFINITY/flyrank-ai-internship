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
| Unit tests (`npm test`) | ✅ 29/29 (3 consecutive runs) | ✅ 29/29 (all Week 6 runs) |
| Production build (`npm run build`) | green | ✅ passed |
| E2E (`npm run test:e2e`) | 1/1 passed (Chromium) | ✅ passed |
| Deployment | https://foyer-cyan.vercel.app returns 200; `/playground/motion-lab` live | — |

**Overall:** Submission-ready. Both audit findings — the `--motion-ease-*` bug and the timing-fragile test — were **fixed and verified** (commit `c6def02`); see §2 and §3 for before/after. CI green on all Week 6 commits, working tree clean.

---

## 2. Assignment 1 — FE-AA1: Buttons with a Brain

**Finding: Complete.** The motion bug found during audit (§2 below) was fixed in `c6def02` and re-verified live.

- Implementation verified: `components/primitives/motion-button.tsx`, `lib/motion/tokens.ts`, keyframes in `app/globals.css`, used in home CTA (`app/page.tsx`) and Curator Send (`components/ai/chat-panel.tsx`).
- 8 dedicated tests in `motion-button.test.tsx` (idle, disabled, busy+disabled, controlled success/error, async cycle, failure→error, interruptible guard).
- **Gap before this audit:** no dedicated evidence doc and no screenshots. **Resolved now:** 4 live screenshots captured from `/playground/motion-lab` (idle / loading / success / error) and the Week 6 submission packet documents the assignment.
- Live review page: https://foyer-cyan.vercel.app/playground/motion-lab (force buttons verified working).
- Commit: `e77f609`.

### ⚠ Finding (genuine bug, **RESOLVED**): `--motion-ease-*` custom properties were never defined

`motion-button.tsx` referenced three CSS custom properties — `--motion-ease-standard`, `--motion-ease-enter`, `--motion-ease-shake` — but **none of them were defined anywhere** (no `:root`, no `@theme`, no inline style). `lib/motion/tokens.ts`'s comment claimed they are "defined in app/globals.css (--motion-*)", which was **not true** — `globals.css` defined the keyframes and the reduced-motion block, but no `--motion-*` custom properties.

Verified in the live browser (computed styles on `/playground/motion-lab`):

| State | Before fix | After fix (`c6def02`) |
|---|---|---|
| loading spinner | ✅ `foyer-spin` ran | ✅ `foyer-spin` runs |
| success pop | ❌ `animation-name: none` — pop never ran | ✅ `foyer-pop` 0.32s, `cubic-bezier(0.05,0.7,0.1,1)` |
| error shake | ❌ `animation-name: none` — shake never ran | ✅ `foyer-shake` 0.5s, `cubic-bezier(0.36,0.07,0.19,0.97)` |
| label crossfade | ⚠️ default `ease` | ✅ `cubic-bezier(0.2,0.8,0.2,1)` (standard) |

Why it was broken: `var()` with no fallback referencing an undefined custom property makes the declaration *guaranteed-invalid* — so the entire `animation` shorthand was dropped (→ `none`), and the transition easing fell back to the default. The state feedback itself was unaffected (labels, icons, and tint swaps still happened) — the "choreography" (pop/shake) was what was inert.

- **Fix applied (`c6def02`, verified live + local):** the three easing custom properties were added to `app/globals.css` under `:root` (values kept in sync with `lib/motion/tokens.ts`). No motion-system redesign — the architecture is unchanged.

---

## 3. Assignment 2 — FE-09: Testing Pass

**Finding: Complete.**

- 29 tests across 5 files (8 motion-button, 6 chat-panel, 6 tool-state-views, 5 login, 4 exhibit-tool-result) — file list verified on disk.
- Real Playwright e2e (`e2e/museum-flow.spec.ts`) stubs `/api/chat` with a canned SSE stream; no AI API, no secrets. Passed locally (1.6m) and in CI.
- GitHub Actions CI green on all Week 6 commits (`e77f609` → run 31317092875, `34a5f94` → run 31320432472, `c2905c6` → run 31328347815, `c6def02` → run 31426007202).
- Evidence doc `week-06/fe-09-ci-evidence.md` + screenshot exist and are referenced correctly.

### ⚠ Finding: one timing-fragile test (**RESOLVED**)

`motion-button.test.tsx` → "drives the full async cycle on click" asserts the transient **loading** label, but the mock async resolved after 100 ms (`feedbackDuration={150}`). On this slow Windows machine the 100 ms window was consistently missed locally (assertion: `data-state === "loading"` failed because the button had already moved to `success`). CI (fast Ubuntu runner) passed 29/29. This was a **test-design** race, not a component bug — production send takes far longer than 100 ms.

- **Fix applied (`c6def02`, verified stable):** the test now drives the async cycle with a **manually-resolved deferred promise** (no fake timers — `vi.useFakeTimers()` + `userEvent` caused a 5000 ms timeout hang on this machine, so that approach was abandoned). The loading assertion is now deterministic: the promise is held, `aria-busy` asserted, then resolved inside `act` and flushed. Assertions were preserved/strengthened, not weakened.
- **Verification:** 29/29 unit tests, 3 consecutive local runs, all green; e2e 1/1; CI green on the fix commit.

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
- **FE-AA1 evidence** was missing → packet + 4 live screenshots added (`week-06/screenshots/fe-aa1-motion-{idle,loading,success,error}.png`); re-captured post-fix at commit `c6def02`.
- **ESLint:** 3 pre-existing warnings (unused imports: `EntityComponentProps` in `world-renderer.tsx`, `worldIndex` in `lib/museum/queries.ts`, `Wing` in `lib/museum/world.ts`). Pre-existing, non-fatal, identical to Week 5's noted warnings — left untouched.
- Working tree clean after the Week 6 fix + docs commits.

---

## 6. Anything still required from the owner

1. **Confirm the three Week 6 assignments** map to: FE-AA1 → Buttons with a Brain, FE-09 → Testing Pass, Explain It Like You Built It. The exact dashboard rubric isn't in the repo; if the dashboard adds requirements beyond what's documented here, say so and they'll be addressed.

All audit findings are now **fixed and verified**; nothing else blocks Week 7 sign-off.

---

*This journal is part of the Week 6 documentation commit. Review findings together before proceeding to Week 7.*
