# Week 7 Submission Checklist

## Task 1: FE-AA2 — 3D Experience on the Web

- [x] Renders a real 3D scene in the browser (React Three Fiber)
- [x] At least one meaningful interaction beyond orbiting (scroll-rail movement, click-to-inspect, gyroscope look, door auto-open)
- [x] Loads responsibly: lazy-loaded via `next/dynamic` + `ssr:false`, procedural geometry only, no GLTF
- [x] Fallback for reduced-motion / low-power contexts (2D `SurfaceRenderer`)
- [x] Usable on mobile (touch drag, gyroscope tilt, 44px touch targets)
- [x] Performance note documented (`fe-aa2-perf-note.md`)
- [x] Live URL deployed (Vercel)
- [x] README with what was built + perf note
- [x] Feature doc (`fe-aa2-3d-room.md`)
- [x] Screenshots captured (41 local + 23 deployed-site)

## Task 2: Break Your Own Site

- [x] Tested empty form submission (login form validates)
- [x] Tested garbage input (email validation catches invalid)
- [x] Tested rapid double-submit (disabled state prevents)
- [x] Tested across browsers (Firefox, Safari, Chrome)
- [x] Tested mobile viewports (375px, 390px, 412px)
- [x] Tested reduced-motion → 2D fallback
- [x] Tested no-WebGL → 2D fallback
- [x] Tested all navigation links
- [x] Tested 3D-specific breakage (scroll limits, click non-interactive, E key, Escape, doors)
- [x] Findings triaged: fix-now items fixed, known limitations documented
- [x] SEO/meta added (title, description, social preview, favicon)
- [x] Documentation (`break-your-own-site.md`)

## Task 3: Plant Your Flag — Domain + Badge

- [x] Deployed on Vercel with HTTPS
- [x] Vercel free subdomain (clean fallback per FlyRank Q&A)
- [ ] Custom domain (budget constraint — using Vercel subdomain)
- [ ] Analytics installed (deferred)
- [x] Page title correct
- [x] Meta description correct
- [x] Social share preview correct
- [x] Favicon generated
- [ ] FlyRank badge (pending September certificate issuance)
- [x] Documentation (`plant-your-flag.md`)

## Task 4: FE-10 — Accessibility & Performance Audit

- [x] Lighthouse (desktop) run on 4 pages: `/`, `/entrance`, `/about`, `/explore`
- [x] WAVE audit run (0 errors)
- [x] Keyboard-only pass completed
- [x] AI-specific accessibility checked (aria-live, stop button, focus management)
- [x] AUDIT.md written with before/after scores
- [x] Findings: fix-nows fixed, known limitations named

### Lighthouse scores (August 19, 2026)

| Page | Performance | Accessibility | SEO |
|------|-------------|---------------|-----|
| `/` (3D home) | 60 | 95 | 91 |
| `/entrance` (3D museum) | 97 | 95 | 100 |
| `/about` | 97 | 95 | 100 |
| `/explore` | 99 | 95 | 100 |

## Evidence files

| File | Task |
|------|------|
| `week-07/fe-aa2-3d-room.md` | Task 1 |
| `week-07/fe-aa2-perf-note.md` | Task 1 |
| `week-07/screenshots/` (64 images) | Task 1 |
| `week-07/break-your-own-site.md` | Task 2 |
| `week-07/plant-your-flag.md` | Task 3 |
| `week-07/AUDIT.md` | Task 4 |
| `week-07/phone-audit.md` | Task 4 |
| `week-07/week-7-submission-summary.md` | All |
