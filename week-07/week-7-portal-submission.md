# Week 7 — Portal Submission Links

Copy-paste ready resources for each Week 7 assignment. Attach the files / paste the links into the corresponding portal submission.

**Intern:** Zain Ul Abideen · **Track:** Frontend AI Engineering
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://plinth-cyan.vercel.app
**Master packet:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/week-7-submission-summary.md

---

## Assignment 1 — FE-AA2: 3D Experience on the Web

**Summary:** A walkable 3D museum corridor using React Three Fiber. Visitors glide through an exterior approach → reception → sawtooth corridor → exhibit room on a scroll-rail camera. Features gyroscope look (mobile), click-to-inspect, auto-opening doors, curator billboard sprite, and a 2D flat fallback for reduced-motion / no-WebGL / low-memory devices.

**Implementation files (main):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/three/walkable-world.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/three/walkable-player.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/three/walkable-input.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/three/exhibit-room-3d.tsx
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/walkable-model.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/three/paper-texture.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.ts

**Where it's used in production:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/page.tsx (home 3D takeover)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/exhibit-walls.tsx (renderer seam)
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/surface-renderer.tsx (2D fallback)

**Tests:**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/walkable-model.test.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.test.ts
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/repository/acceptance.test.ts (74 total)

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/fe-aa2-3d-room.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/fe-aa2-perf-note.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-homepage.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-entrance.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-homepage-mobile.png
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-entrance-mobile.png

**Commits:** `e5db12b` (sawtooth corridor) · `bc7dd98` (itom structure) · `bd3607c` (Phase 2+3A) · `22b319e` (gyroscope, facade fix, mobile polish)
**Live:** https://plinth-cyan.vercel.app (3D museum renders on WebGL2-capable devices)

---

## Assignment 2 — Break Your Own Site

**Summary:** Systematic breakage testing across browsers, devices, input edge cases, and 3D-specific scenarios. Found and fixed 6 bugs (door gaps, facade solid wall, touch sensitivity, camera smoothing). Documented SEO/meta, known limitations, and triaged findings into fix-now vs deferred.

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/break-your-own-site.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/break-your-own-site-explore.png

**Commits:** `22b319e` (all breakage fixes shipped)
**Live:** https://plinth-cyan.vercel.app/explore

---

## Assignment 3 — Plant Your Flag: Domain + Badge

**Summary:** Deployed on Vercel with automatic HTTPS. Vercel free subdomain used (clean fallback per FlyRank Q&A). Page title, meta description, social share preview, and favicon all configured. Custom domain deferred (budget constraint). Badge pending September certificate issuance.

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/plant-your-flag.md

**Commits:** `22b319e` (deployment on main)
**Live:** https://plinth-cyan.vercel.app

---

## Assignment 4 — FE-10: Accessibility and Performance Audit

**Summary:** Full Lighthouse (desktop) audit on 4 routes — `/`, `/entrance`, `/about`, `/explore`. WAVE audit with 0 errors. Keyboard-only navigation pass. AI-specific accessibility check (aria-live, stop button, focus management). Before/after scores documented. Performance 97-99 on 2D routes, 95 accessibility, 91-100 SEO.

**Lighthouse scores (August 19, 2026):**

| Page | Performance | Accessibility | SEO |
|------|-------------|---------------|-----|
| `/` (3D home) | 60 | 95 | 91 |
| `/entrance` (3D museum) | 97 | 95 | 100 |
| `/about` | 97 | 95 | 100 |
| `/explore` | 99 | 95 | 100 |

**Evidence / docs (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/AUDIT.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/phone-audit.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-10-audit-about.png

**Commits:** `36db6c4` (submission packet with Lighthouse scores)
**Live:** https://plinth-cyan.vercel.app/about

---

## Supporting Documentation

- Master packet: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/week-7-submission-summary.md
- FE-AA2 feature doc: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/fe-aa2-3d-room.md
- FE-AA2 perf note: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/fe-aa2-perf-note.md
- Break Your Own Site: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/break-your-own-site.md
- Plant Your Flag: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/plant-your-flag.md
- AUDIT.md: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/AUDIT.md
- Phone audit: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/phone-audit.md
- Screenshots:
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-homepage.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-entrance.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-homepage-mobile.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-aa2-entrance-mobile.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/break-your-own-site-explore.png
  - https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-07/screenshots/fe-10-audit-about.png

**Quality gates:** ESLint → 0 errors (2 pre-existing warnings); TypeScript → clean; unit tests → 74/74; production build → green.
