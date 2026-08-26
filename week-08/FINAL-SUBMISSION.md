# Week 8 — Final Submission (Copy-Paste Ready)

---

## SHIP IT — Your First Production AI Product (Capstone)

### 1. Project Brief
```
Foyer is an open digital museum where developers exhibit their work as curated gallery rooms — not card grids, not thumbnail clusters. Each project gets a dedicated space with architectural presence: a scrollable 3D corridor, an exhibit room with text walls and media, and an AI curator that answers questions about what's on display. Developers who want their work to feel like something more than a portfolio item use Foyer to exhibit it with the same care a museum gives a painting. The app auto-detects device capability: on powerful devices visitors walk through a Three.js museum; on lower-end or accessibility-first devices, the same content renders as a clean 2D layout with an "Accessible view" toggle. An AI curator powered by OpenRouter (Gemini Flash) can answer questions about any exhibit using a custom exhibitLookup tool, pulling live data from the repository layer. Foyer is open-source, deployed on Vercel, and built so that anyone — not just one developer — could exhibit their work.

Problem: Developer portfolios are all the same — card grids, thumbnail clusters, identical layouts. Projects deserve better presentation than a list.
Audience: Developers who want to showcase their work with real presence. Visitors who want to explore projects like they explore a gallery.
Why this idea: I wanted to build something that felt different — not another portfolio template, but a place where projects have rooms, not cards.
```
Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/project-brief.md

---

### 2. Live URL
```
https://plinth-cyan.vercel.app
```

Routes to verify:
- `/` — 3D museum homepage
- `/explore` — Grid of exhibits
- `/about` — Museum language
- `/exhibit/zayn` — Developer exhibit page
- `/assistant` — AI curator chat

---

### 3. Repository
```
https://github.com/ZAYNINFINITY/flyrank-ai-internship
```

---

### 4. README

Full README:
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md

Direct section links:

| Section | Link |
|---------|------|
| Setup & run | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md#getting-started |
| Architecture | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md#architecture |
| AI integration | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md#ai-integration |
| How AI was used | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md#how-ai-was-used |
| Known limitations | https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/README.md#known-limitations |

---

### 5. Testing Evidence

Screenshot:
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/test-results.png

Copy-paste this for testing section:
```
74/74 tests passed (0 failed)

Unit tests (10 files):
- acceptance.test.ts — Data architecture, search, filtering, referential integrity
- walkable-model.test.ts — Collision, door triggers, spawn resolution
- capability.test.ts — Device tier detection
- chat-panel.test.tsx — Chat UI rendering
- exhibit-tool-result.test.tsx — Tool result display
- tool-state-views.test.tsx — Lifecycle state UI
- museum-logic.test.ts — Museum logic
- via-entry.test.ts — Door entry validation
- motion-button.test.tsx — Motion button
- page.test.tsx — Login page

E2E test (1 file):
- museum-flow.spec.ts — Full museum flow (Playwright)

Coverage: 74 tests across 11 files
```

---

### 6. Performance & Accessibility Audit

Lighthouse scores doc:
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/lighthouse-scores.md

Copy-paste this for Lighthouse:
```
Lighthouse Scores (all routes):

Home (/) — Performance: 100 | Accessibility: 100 | Best Practices: 100 | SEO: 100
Entrance — Performance: 100 | Accessibility: 95 | Best Practices: 100 | SEO: 100
About — Performance: 98 | Accessibility: 95 | Best Practices: 100 | SEO: 100
Explore — Performance: 99 | Accessibility: 95 | Best Practices: 100 | SEO: 100

Average performance: 99.25
Accessibility = 95 on 3D routes because Three.js canvas has no ARIA labels.
"Accessible view" toggle provides full 2D accessible path scoring 100.
```

Lighthouse JSONs (raw data):
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/lighthouse-home.json
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/lighthouse-about.json
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/lighthouse-entrance.json
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/lighthouse-explore.json

Concrete improvement:
```
Added "Accessible view" toggle specifically because the 3D canvas scored 95 (not 100) on accessibility.
The toggle provides a parallel 2D path that scores 100 — not a degraded fallback, but a first-class citizen.
```

---

### 7. Deployment Checklist

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/deployment-checklist.md

Copy-paste this for deployment:
```
Deployment:
- Platform: Vercel (Next.js auto-detected)
- URL: https://plinth-cyan.vercel.app
- Branch: main (auto-deploys on push)

Environment Variables:
- OPENROUTER_API_KEY: Set in Vercel ✅
- DATABASE_URL: Not set (using mock repos)
- NEXTAUTH_URL: Not set (auth not wired)
- NEXTAUTH_SECRET: Not set (auth not wired)

Build Verification:
- npm run build passes with 0 errors
- npx tsc --noEmit passes (TypeScript clean)
- npx eslint . passes (0 errors)
- npx vitest run — 74/74 tests pass

Error States Verified:
- API key missing → "API configuration error" banner
- Rate limit hit → Rate limit message
- API failure → Retry prompt with error details
- No WebGL2 → Auto-falls back to 2D SurfaceRenderer
- prefers-reduced-motion → 2D fallback, no 3D download
- Low device memory → 2D fallback, no 3D download
- 404 route → Custom not-found.tsx with in-voice message
- Empty exhibit → "No exhibits yet" placeholder

Rollback Plan:
1. Immediate: Revert to previous deployment in Vercel dashboard
2. Git: git revert <commit-hash> on main, push triggers auto-redeploy
3. Nuclear: Delete Vercel project, re-import from GitHub
```

---

### 8. Reflection

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/reflection.md

Copy-paste this for reflection:
```
What was hardest?
The 3D-to-2D renderer seam. Getting a Three.js scene and a flat React component to render the same content — with the same data, same interactions, same feel — without one becoming a degraded copy of the other. The first attempt was an orbit diorama that felt like a toy. The second attempt (scroll-rail corridor) worked because the 2D path became a first-class citizen, not a fallback. The capability gate decides at mount time which renderer to use, and both paths consume the same data layer. Making that seam invisible to the visitor was the hardest architectural decision in the project.

What would I do differently?
Start with the 2D fallback architecture from day one. I spent the first two weeks building the 3D scene and then tried to bolt 2D on afterward. If I'd designed the data layer and component hierarchy around "two renderers, same data" from the start, the renderer seam would have been a clean interface instead of a refactoring project.

One thing that surprised me?
AI integration was easier than expected. The hard part wasn't the chat interface or the streaming — it was designing the tool schema. Once exhibitLookup had the right input shape (id, collection, query — all optional, validated with Zod), the model naturally asked the right questions. The prompt barely needed tuning.
```

---

### 9. Capstone Report

PDF (28MB):
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/capstone-final-report.pdf

Source MD:
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/capstone-final-report.md

---

### 10. Demo Video

MP4 (5m28s, 85MB):
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/demo-video-final.mp4

Copy-paste this for video description:
```
Demo Video: 5m28s, 1920x1080, H.264
Structure: Intro card (6s) → Live walkthrough with 29 text overlay labels (5:11) → Outro credits (10s)
Covers: Homepage 3D, corridor walk, exhibit interaction, AI curator chat, accessible view toggle, mobile responsive views
```

GIF walkthrough (183KB):
https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/demo-walkthrough.gif

---

## SEND THE LINK — Launch, Demo & Story (Capstone)

### 1. "How to add the next case" note

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/plan-to-keep-building.md

Copy-paste this:
```
How to add the next case study:

1. Write a 1-paragraph problem statement: What problem did the project solve?
2. Write the "what I did" section: 3-5 bullet points of technical decisions
3. Add screenshots: Before (what existed) and After (what you built)
4. Link to live deployment
5. Link to source code
6. Add to portfolio site (zainportfoli0.netlify.app) as a new project card

Three-beat structure (from Week 2):
- Shape: What does the project look like?
- Problem: What pain point does it solve?
- What came of it: Results, metrics, learnings
```

---

### 2. Named next piece of work

```
Next piece of work: Add first real developer exhibit (Collaborative Workspace) to Foyer
Target date: September 15, 2026
```

---

### 3. Concrete reminder — evidence

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/issues/17

Copy-paste this:
```
GitHub Issue #17 — timestamped August 26, 2026
Title: "Reminder: Add first real exhibit — Collaborative Workspace"
Target: September 15, 2026
Status: Open
```

---

### 4. Claude Project preserved

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/CLAUDE.md

Copy-paste this:
```
Claude Project preserved — knows voice, stack, and identity kit.
Conventions documented in CLAUDE.md: project structure, component patterns, testing rules.
Future updates are a short conversation, not a rebuild.
```

---
