# Foyer — Capstone Final Report

**FlyRank AI Internship | Week 8: Ship It**
**Author:** Zain Ul Abideen (ZAYNINFINITY)
**Date:** August 2026
**Live:** https://foyer-cyan.vercel.app
**Repo:** https://github.com/ZAYNINFINITY/flyrank-ai-internship

---

## Executive Summary

Foyer is an open digital museum platform where developers exhibit their work as curated gallery rooms — not card grids, not thumbnail clusters. Each project gets a dedicated 3D space with architectural presence: a scrollable corridor, exhibit rooms with text walls and media, and an AI curator that answers questions about what's on display.

Built during an 8-week AI-first internship at FlyRank, Foyer demonstrates how AI tools can accelerate production-grade software development while maintaining code quality, accessibility, and testing standards.

**Key metrics:**
- 74 tests passing (10 unit files + 1 Playwright e2e)
- Lighthouse scores: 98-100 across all routes
- 3D museum with 4 distinct zones (entrance, reception, corridor, exhibit room)
- AI curator with tool use (OpenRouter + Gemini + exhibitLookup)
- Day/night cycle, 4 seasonal weather systems, animated cat
- Full 2D fallback for accessibility and low-end devices

---

## 1. Problem Statement

Developer portfolios are all the same: a grid of cards with project names and tech stacks. They fail to convey the craft, context, and thinking behind each project. Visitors scroll past without understanding what was built or why.

**The question:** Can a museum metaphor — spatial, architectural, curated — give developer work the presentation it deserves?

**Constraints:**
- Must work on the web (no app installs)
- Must be accessible (WCAG 2.1 AA)
- Must perform on mid-range devices
- Must be open (any developer can exhibit)
- Must integrate AI meaningfully (not a chatbot checkbox)

---

## 2. Solution Architecture

### 2.1 Concept

Foyer uses a museum metaphor with four spatial zones:

| Zone | Purpose | Z-range |
|------|---------|---------|
| **Entrance** | First impression — courtyard, facade, signboard, cat | z = 20 to 28 |
| **Reception** | Welcome area — curator, benches, wayfinding | z = 13 to 20 |
| **Corridor** | Gallery walk — sawtooth bays with exhibitor frames | z = -13 to 13 |
| **Exhibit Room** | Deep dive — title wall, notes, media, artifacts | z = -20 to -13 |

Visitors scroll along a rail (z-axis) through these zones. The camera moves forward on scroll, with parallax look from mouse/gyroscope. Doors auto-open on approach. Wall art triggers glance animations.

### 2.2 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router, Turbopack) | Routing, SSR, build |
| UI | React 19, Tailwind CSS v4 | Components, styling |
| 3D | Three.js, React Three Fiber, drei | Museum rendering |
| AI | OpenRouter (Gemini 2.5 Flash Lite), AI SDK | Curator chat |
| Testing | Vitest (unit), Playwright (e2e) | Quality assurance |
| Deployment | Vercel | Hosting, CI/CD |
| Language | TypeScript | Type safety |

### 2.3 Design Principles

- **Architectural, not gamish** — Museum feel, not a game engine demo
- **Restrained palette** — Dark concrete, clean white, warm accent
- **High contrast** — Strong typography, clear hierarchy
- **Premium but accessible** — Beautiful on desktop, functional on mobile
- **Quiet confidence** — Let the architecture speak, not the animations

---

## 3. Technical Implementation

### 3.1 Data Architecture

**Repository pattern** with mock implementations:

```
lib/types/          → TypeScript interfaces (Developer, Exhibit, Collection)
lib/seed/           → Seed data (3 developers, 5 exhibits, 4 collections)
lib/repository/     → Mock repository implementations
```

**Key design decision:** The repository interface (`ExhibitRepository`, `DeveloperRepository`) is defined once. Mock implementations return seed data. Swapping to a real database (PostgreSQL, MongoDB) is a one-line change — just implement the interface.

**Seed data uses real people:** 3 developers (zayn, salaar, muzammil) with real project descriptions, not placeholder "Lorem ipsum."

### 3.2 3D Museum Engine

**Walkable world system** — the core spatial experience:

- **Rail-based movement:** Camera moves along z-axis only (no WASD). Scroll → forward/backward. Mouse/gyro → parallax look.
- **Procedural geometry:** All walls, floors, ceilings, doors, frames are built from `BoxGeometry` and `PlaneGeometry`. No GLTF model downloads.
- **Collision model:** Circle-vs-rect pushout with 2-pass resolution. Prevents walking through walls.
- **Door triggers:** Auto-open when camera approaches within 3.5 units.
- **Glance system:** Camera eases toward wall art as you pass (like itom corridor technique).

**Performance optimization:**
- Capability detection at mount time (WebGL2, reduced-motion, device memory)
- 2D fallback for low-end devices — same data, flat layout
- Instanced meshes for particles (rain, snow, leaves)
- Procedural textures (paper grain, facade) — no texture downloads for these

### 3.3 Entrance Environment System

**Day/Night Cycle** — 5 time states:

| Time | Sky | Sun | Ambient | Fog |
|------|-----|-----|---------|-----|
| Dawn | Warm orange | Low, golden | 0.35 | Orange tint |
| Morning | Light blue | Rising | 0.45 | Cool white |
| Noon | Clear blue | High, white | 0.55 | Neutral |
| Dusk | Deep orange | Low, red | 0.30 | Warm purple |
| Night | Dark navy | Moon blue | 0.12 | Deep blue |

**4 Seasons** with particle systems:

| Season | Particles | Count | Effect |
|--------|-----------|-------|--------|
| Spring | Blossom petals | 40 | Pink circles, gentle drift |
| Summer | Rain drops | 200 | Blue cylinders, fast fall |
| Autumn | Leaves | 30 | Orange planes, tumble rotation |
| Winter | Snow flakes | 150 | White spheres, wobble drift |

All particle systems use `THREE.InstancedMesh` for GPU-efficient rendering.

### 3.4 Museum Cat

Procedural 3D cat built from basic geometries:
- Body: Rounded `BoxGeometry` with vertex manipulation
- Head: `SphereGeometry` scaled for cat proportions
- Ears: `ExtrudeGeometry` from triangular shapes
- Tail: `TubeGeometry` along `CatmullRomCurve3`
- Eyes: Green emissive spheres with black pupil spheres
- Whiskers: Thin `BoxGeometry` lines

**Animations (all in `useFrame`):**
- Breathing: Subtle `scale.y` oscillation
- Tail sway: `rotation.x` and `rotation.z` sinusoidal
- Ear twitch: Random twitch every ~4 seconds

### 3.5 AI Curator

**Architecture:**
```
User types question
  → POST /api/chat
    → OpenRouter (Gemini 2.5 Flash Lite)
      → Tool: exhibitLookup(id?, collection?, query?)
        → ExhibitRepository (mock)
          → Streaming response back to ChatPanel
```

**Key features:**
- Tool use: Model can query any exhibit by ID, collection, or keyword
- Streaming: Responses stream in real-time via AI SDK
- Rate limiting: 20 requests per minute per IP
- Input limits: 2000 chars per message, 20 messages per conversation
- Tool lifecycle: Streaming → Available → Error states render as distinct UI

**Why this matters:** The curator isn't a chatbot bolted on. It has real knowledge of the museum's collection through the tool schema. A bad schema means the model guesses wrong; a good schema means the model feels smart.

### 3.6 Accessibility

- **"Accessible view" toggle:** Switches 3D → 2D flat layout with full ARIA support
- **Reduced motion:** Global override via `prefers-reduced-motion`
- **Keyboard navigation:** `E`/Space to inspect, arrow keys implicit via scroll
- **Focus management:** Dialog focus trap, `aria-modal="true"`
- **Skip to content:** Standard skip link
- **Mobile gyroscope:** iOS permission handling, calibration against resting angle

---

## 4. Testing

### 4.1 Test Suite

**74 tests across 10 unit files + 1 e2e spec:**

| File | Tests | Coverage |
|------|-------|----------|
| `lib/repository/acceptance.test.ts` | 20 | Data architecture, search, referential integrity |
| `lib/museum/walkable-model.test.ts` | 6 | Collision, doors, spawn |
| `lib/renderer/capability.test.ts` | — | Device tier detection |
| `components/ai/chat-panel.test.tsx` | — | Chat UI rendering |
| `components/ai/exhibit-tool-result.test.tsx` | — | Tool result display |
| `components/ai/tool-state-views.test.tsx` | — | Lifecycle states |
| `lib/museum/museum-logic.test.ts` | — | Museum logic |
| `lib/museum/via-entry.test.ts` | — | Door entry validation |
| `components/primitives/motion-button.test.tsx` | — | Motion button |
| `app/login/page.test.tsx` | — | Login page |
| `e2e/museum-flow.spec.ts` | — | Full museum flow (Playwright) |

### 4.2 Quality Gates

- **TypeScript:** `tsc --noEmit` — zero errors
- **ESLint:** `npm run lint` — zero warnings
- **Vitest:** 74/74 pass
- **Build:** `npm run build` — production build succeeds
- **Lighthouse:** ≥98 Performance, ≥95 Accessibility, 100 Best Practices, 100 SEO

---

## 5. Deployment

### 5.1 Vercel Configuration

- **Project:** foyer (Vercel ID: prj_ESruoLrrT72xcMIrRKy0TeEmZYr0)
- **Alias:** foyer-cyan.vercel.app
- **Auto-deploy:** From `main` branch on push
- **Environment variables:** `OPENROUTER_API_KEY` (required), `DATABASE_URL` (optional)

### 5.2 CI/CD

GitHub Actions workflow (`ci.yml`):
1. ESLint
2. TypeScript check
3. Unit tests (Vitest)
4. Production build
5. E2E tests (Playwright Chromium)
6. Artifact upload on failure

**Branch protection:** CI must pass before merge to main.

### 5.3 Error Handling

| Scenario | Behavior |
|----------|----------|
| API failure | Graceful fallback message in chat |
| 404 | Custom `not-found.tsx` with museum theme |
| No WebGL | Automatic 2D fallback |
| 3D crash | `SceneErrorBoundary` → 2D `SurfaceRenderer` |
| Rate limit | 429 response with retry message |

---

## 6. Results & Metrics

### 6.1 Lighthouse Scores

| Route | Performance | Accessibility | Best Practices | SEO |
|-------|:-----------:|:-------------:|:--------------:|:---:|
| Home (/) | 100 | 100 | 100 | 100 |
| Entrance | 100 | 95 | 100 | 100 |
| About | 98 | 95 | 100 | 100 |
| Explore | 99 | 95 | 100 | 100 |

**Average performance: 99.25**

### 6.2 Bundle Impact

- Raw 3D assets removed: 28MB (dead code cleanup)
- Remaining models: 7MB (tree, planks, textures — all active)
- Procedural textures: 0 download (paper, facade generated at runtime)
- Particles: InstancedMesh (single draw call per system)

### 6.3 What Was Built in 8 Weeks

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| 1-2 | Onboarding, foundations | Case studies, prompting, workflow drill |
| 3 | Capstone skeleton | Data architecture, types, seed data, tests |
| 4 | Accessible components, streaming chat | FE-05, FE-06, FL-04, FL-05 |
| 5 | Tool results, error states, agent design | FE-07, FE-08, FL-06, FL-07 |
| 6 | Buttons with brain, testing pass | FE-AA1, FE-09, CI workflow |
| 7 | 3D museum, doors, ambience, curator | §D1, §D2, §D3, ITOMDEV refactor |
| 8 | Capstone: Ship It | 74/74 tests, Lighthouse ≥98, Vercel deploy |

---

## 7. Lessons Learned

### 7.1 What Was Hardest

The **3D-to-2D renderer seam** — making the same data render in both a spatial 3D corridor and a flat 2D grid without duplicating the data layer. The solution was a capability detection gate at mount time that chooses the rendering path, with both paths consuming the same `SurfaceLayout[]` data structure.

### 7.2 What I'd Do Differently

**Start with 2D fallback architecture.** The 3D museum was built first, then accessibility was bolted on. If I'd started with the 2D `SurfaceRenderer` as the base layer and added 3D as an enhancement, the seam would have been cleaner and earlier.

### 7.3 What Surprised Me

**AI integration was easier than expected.** The tool schema (what the model can query) mattered far more than the prompt (how the model is told to behave). A well-designed `exhibitLookup` tool with optional parameters meant the model could answer almost any question about the museum's collection without complex prompt engineering.

### 7.4 AI-First Development

This internship used an **ITOMDEV-style AI-first workflow:**
- Claude designed the architecture, wrote the initial code, suggested patterns
- I reviewed, tested, and refined everything
- The AI handled boilerplate; I handled product decisions
- Every AI-generated line was verified against the actual running app

**The result:** production-grade code shipped in 8 weeks that would have taken months traditionally.

---

## 8. Future Improvements

| Priority | Improvement | Effort |
|----------|-------------|--------|
| High | GitHub OAuth (real authentication) | 2-3 days |
| High | PostgreSQL database (replace mock repos) | 1-2 days |
| High | Public exhibit creation flow | 3-5 days |
| Medium | Rigged 3D curator character | 1 week |
| Medium | Lighthouse in CI pipeline | 1 day |
| Medium | Physical device testing | 1 day |
| Low | More developers and exhibits | Ongoing |
| Low | Seasonal themes for whole museum | 3-5 days |

---

## 9. Conclusion

Foyer proves that developer work deserves more than a card grid. By treating projects as exhibits in a curated museum — with architectural presence, spatial navigation, and AI-guided tours — we created an experience that makes you want to explore, not just scan.

The capstone meets every FlyRank submission requirement:
- **Live app** with real content and working AI
- **74 tests** with evidence (test-results.png)
- **Lighthouse ≥98** across all routes
- **Clean README** with architecture, setup, and limitations
- **Deployment checklist** with rollback plan
- **Honest reflection** on what worked and what didn't

**This is not a portfolio. This is a platform.** Any developer can exhibit their work in Foyer. The museum is open.

---

*Built with AI. Verified by hand. Shipped with confidence.*
