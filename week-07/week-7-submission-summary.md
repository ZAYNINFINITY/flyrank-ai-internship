# Week 7 Submission Summary

**Intern:** Zain Ul Abideen  
**Track:** Frontend AI Engineering  
**Week status:** Complete — 4 tasks submitted  

## Task 1: FE-AA2 — 3D Experience on the Web

### What was built
A **walkable 3D museum corridor** using React Three Fiber. Visitors glide through an exterior approach → reception → sawtooth corridor → exhibit room on a scroll-rail camera. The museum is the homepage on WebGL2-capable devices; a 2D flat path exists as fallback.

### Key features
- **Scroll-rail movement**: scroll or touch-drag advances through the museum
- **Gyroscope look** (mobile): tilt phone to look around, calibrated to resting angle
- **Click-to-inspect**: tap any interactive object directly (raycasted hit)
- **Auto-opening doors**: entrance double-leaf and interior doors swing open on approach
- **Sawtooth corridor**: angled bay walls (itom-inspired) with exhibit frames, camera auto-glance
- **Curator billboard**: camera-facing sprite at entrance with gentle bob
- **Text walls toggle**: switches 3D → flat renderer for accessibility
- **2D fallback**: automatic for reduced-motion / no-WebGL / low-memory devices

### Performance
- 3D chunk: ~1 MB raw, lazy-loaded only on capable devices
- Procedural geometry only (no GLTF models)
- 74 unit tests passing

### Evidence
- `week-07/fe-aa2-3d-room.md` — full feature doc
- `week-07/fe-aa2-perf-note.md` — performance analysis
- `week-07/screenshots/` — 64 screenshots (local + deployed)
- Live: Vercel deployment at `foyer` project

---

## Task 2: Break Your Own Site

### What was tested
- Empty/garbage form submission
- Rapid double-submit
- Cross-browser (Firefox, Safari, Chrome)
- Mobile viewports (375px, 390px, 412px)
- Reduced-motion, no-WebGL, low-memory fallbacks
- All navigation links and routes
- 3D-specific breakage (scroll limits, click areas, keyboard)

### Findings
**Fixed:**
- Door leaves too narrow (hinged at wrong position)
- Opening door revealed solid wall (missing gap in visual)
- Facade was solid sheet (no hole)
- Touch drag too twitchy
- Camera smoothing laggy

**Known limitations:**
- No on-screen joystick for mobile
- 3D not tested on physical devices
- Portfolio PNGs still large
- Lighthouse not in CI

### Evidence
- `week-07/break-your-own-site.md`

---

## Task 3: Plant Your Flag — Domain + Badge

### Status
- Deployed on Vercel with automatic HTTPS
- Vercel free subdomain (clean fallback per FlyRank Q&A)
- Page title, meta description, social preview, favicon all configured
- Custom domain: not yet (budget constraint)
- Analytics: not yet (deferred)
- FlyRank badge: pending September certificate issuance

### Evidence
- `week-07/plant-your-flag.md`

---

## Task 4: FE-10 — Accessibility & Performance Audit

### Lighthouse scores (August 19, 2026, desktop)

| Page | Performance | Accessibility | SEO |
|------|-------------|---------------|-----|
| `/` (3D home) | 60 | 95 | 91 |
| `/entrance` (3D museum) | 97 | 95 | 100 |
| `/about` | 97 | 95 | 100 |
| `/explore` | 99 | 95 | 100 |

### Analysis
- **Home Performance = 60**: Expected — 3D museum loads three.js bundle client-side. 2D routes score 97-99. 3D is progressive enhancement.
- **Accessibility = 95**: 5-point deduction from Three.js WebGL canvas (no ARIA). "Text walls" toggle provides full content access.
- **SEO = 91 on Home**: Client-rendered 3D impacts crawlability. All other routes are server-rendered (100).

### WAVE audit
- 0 errors on `/about`, `/explore`, `/collection`
- 2 alerts (Three.js canvas — inherent limitation)

### Keyboard-only pass
- All navigation flows completable by keyboard
- `E` key + prompt button for 3D inspection
- Escape closes inspect dialog
- Focus management on mobile nav overlay

### Evidence
- `week-07/AUDIT.md` — full before/after audit
- `week-07/phone-audit.md` — mobile viewport testing

---

## All week-07 files

| File | Task |
|------|------|
| `week-07/fe-aa2-3d-room.md` | Task 1 |
| `week-07/fe-aa2-perf-note.md` | Task 1 |
| `week-07/break-your-own-site.md` | Task 2 |
| `week-07/plant-your-flag.md` | Task 3 |
| `week-07/AUDIT.md` | Task 4 |
| `week-07/phone-audit.md` | Task 4 |
| `week-07/submission-checklist.md` | All |
| `week-07/week-7-submission-summary.md` | All |
| `week-07/screenshots/` | Task 1 (64 images) |
| `week-07/handoff.md` | Reference |
