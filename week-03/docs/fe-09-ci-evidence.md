# Week 6 — FE-09 GitHub Actions CI Evidence

Green CI run for the Week 6 suite. Covers the assignment's testing requirement
(component tests + a real Playwright e2e) and locks the museum's regression
baseline so every push verifies lint, types, unit tests, production build, and
the browser flow without ever touching a production secret or the live AI API.

## CI run

| Field | Value |
|---|---|
| Workflow file | `.github/workflows/ci.yml` |
| Commit | `e77f609` — `feat(week6): motion language, 29 component tests, Playwright e2e, GitHub Actions CI` |
| GitHub Actions run | [31317092875](https://github.com/ZAYNINFINITY/flyrank-ai-internship/actions/runs/31317092875) |
| Result | ✅ **passed** — job `Lint, typecheck, tests, build, e2e` in 1m38s |
| Screenshot | `week-03/docs/screenshots/week6-fe-09-ci-green.png` |
| Repo screenshot | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/docs/screenshots/week6-fe-09-ci-green.png |

## What the workflow runs on every push (all required)

1. **ESLint** — `npm run lint` → 0 errors
2. **TypeScript check** — `npm run typecheck` (`tsc --noEmit`)
3. **Unit tests** — `npm test` → **29/29 pass** (5 files)
4. **Production build** — `npm run build`
5. **E2E** — `npm run test:e2e` → Playwright Chromium only, `e2e/museum-flow.spec.ts`

## Safety guarantees

- **No real AI/OpenRouter API.** The e2e intercepts `POST /api/chat` with
  `page.route` and answers with a canned UI-message-stream SSE payload. CI never
  executes the real `/api/chat` route and carries no `OPENROUTER_API_KEY`
  secret (verified: build + e2e pass with `.env.local` removed).
- **Preserved `/api/chat` interception** — unchanged `e2e/museum-flow.spec.ts`.
- **No production secrets required** — no `env` block in the workflow.
- **Existing package scripts reused** — `lint`, `typecheck`, `test`,
  `build`, `test:e2e`; no duplicate commands.
- **Fail fast** — any failing step fails the job (e.g. ESLint warnings are
  non-fatal annotations; errors are fatal).
- **Chromium only** — single Playwright project, no cross-browser matrix.

## How to re-run locally

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```
