# Week 8 — Submission Summary (Capstone: Ship It)

## What was built

**Foyer** — an open digital museum where developers exhibit their work as curated gallery rooms. Not a card grid, not a thumbnail cluster. Each project gets a dedicated space with architectural presence: a scrollable 3D corridor, an exhibit room with text walls and media, and an AI curator that answers questions about what's on display.

**Live URL:** https://foyer-cyan.vercel.app

**Current verification (August 24, 2026):** Local typecheck, lint, tests, and production build pass. The documented Vercel URL returned HTTP 404 during verification, so production completion is not currently confirmed. Recent local polish includes the corrected room floor placement, bounded procedural wooden reception desk, live curator/receptionist speech bubbles, smooth camera focus limits, and the live-project showcase wheel.

## What's included

| Layer | What it does |
|-------|-------------|
| **3D Museum** | Scroll-rail corridor with approach → reception → corridor → exhibit. Door triggers, collision, gyroscope mobile controls, click-to-inspect. Procedural geometry, no model downloads. |
| **2D Fallback** | Automatic on low-end devices or with `prefers-reduced-motion`. Same data, same content, flat layout. "Accessible view" toggle switches 3D → 2D. |
| **AI Curator** | OpenRouter (Gemini Flash) with `exhibitLookup` tool. Pulls live data from repository layer. Streaming responses. Rate-limited (20 req/min/IP). |
| **Data Architecture** | Multi-developer seed data (3 developers, 5 exhibits, 4 collections). Repository pattern with mock implementations. Swap to real DB in one line. |
| **Accessibility** | WCAG 2.1 AA. Reduced-motion global override. Skip-to-content. Focus-visible. Keyboard `E` + prompt button for 3D inspection. ARIA on dialogs. |
| **Testing** | 74 tests (10 unit files + 1 Playwright e2e). Data architecture, collision math, capability detection, chat UI, tool rendering. |
| **Deployment** | Vercel, auto-deploys from `main`. Error states verified. Rollback via Vercel dashboard. |

## Files

| File | Purpose |
|------|---------|
| `week-08/project-brief.md` | 1-paragraph project brief |
| `week-08/reflection.md` | 1-page honest reflection |
| `week-08/deployment-checklist.md` | Vercel config, error states, rollback plan |
| `week-08/lighthouse-scores.md` | Lighthouse scores + WAVE audit |
| `week-08/submission-checklist.md` | Portal copy-paste for all deliverables |
| `README.md` | Complete project README (rewritten) |

## How AI fits

Foyer's curator chat (`app/api/chat/route.ts`) uses OpenRouter (Gemini Flash) with a custom `exhibitLookup` tool. The model can query any exhibit by ID, collection, or keyword. The tool resolves data through the `ExhibitRepository` interface — swapping mock for real DB is a one-line change. Tool lifecycle states (streaming → available → error) render as distinct UI. The model was chosen for cost efficiency; the tool schema was the hard part, not the prompt.

## Honest limitations

- 3D canvas has no ARIA labels (Three.js limitation) — "Accessible view" toggle provides full access
- No physical device testing (devtools simulation only)
- Lighthouse not in CI (manual run only)
- No external error tracking (manual monitoring)
- The documented production URL needs redeployment or alias correction after returning HTTP 404.
- The existing demo video is 35 seconds and does not satisfy the required 3-5 minute recording.
- The streaming chat route does not currently declare a `maxDuration`.

## One concrete improvement from audit

Added "Accessible view" toggle specifically because the 3D canvas scored 95 (not 100) on accessibility. The toggle provides a parallel 2D path that scores 100 — not a degraded fallback, but a first-class citizen.
