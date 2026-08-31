# FE-AA3 — Portal Submission Links

Copy-paste ready for the FE-AA3 submission. Attach the files / paste the links into the portal.

**Intern:** Zain Ul Abideen · **Track:** Frontend AI Engineering
**Repository:** https://github.com/ZAYNINFINITY/flyrank-ai-internship (branch `main`)
**Live deployment:** https://plinth-cyan.vercel.app/shader-hero
**Master packet:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/FE-AA3-submission-summary.md

---

## FE-AA3 — Signature Hero: A Fullscreen Shader

**Summary:** A fullscreen, custom fragment shader ("Foyer Aurora") rendered as a hero behind the page headline. Written from scratch in GLSL (raw WebGL, no R3F) for Foyer's palette. Uses **all three** core uniforms (`u_time`, `u_resolution`, `u_mouse`) — exceeding the "at least two" requirement. Ships responsibly: **DPR capped at 1.5**, **pauses when the tab is hidden**, and **`prefers-reduced-motion` renders a static gradient with no WebGL context** at all.

**Deliverable 1 — Live URL (link):**
- https://plinth-cyan.vercel.app/shader-hero

**Deliverable 2 — Shader source with comments (attach MD / link):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/shader-hero/page.tsx
- Writeup (block-by-block, in my own words): https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/fe-aa3-shader-hero.md

**Deliverable 3 — Reduced-motion / perf fallback one-liner:**
- "DPR capped at 1.5; animation pauses when the tab is hidden; `prefers-reduced-motion` renders a static gradient with no WebGL context — so reduced-motion users get zero animation and zero extra GPU/battery cost."

**Supporting evidence (attach these):**
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/FE-AA3-submission-summary.md
- https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/fe-aa3-shader-hero.md

**Note:** The exhibit-frame dissolve shader (`reveal-material.ts`) is separate, documented in `week-08/reveal-material-shader.md`. It is not the FE-AA3 deliverable; the fullscreen hero above is.

---

## Supporting documentation

- Master packet: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/FE-AA3-submission-summary.md
- Assignment writeup: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/fe-aa3-shader-hero.md
- Shader source: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/app/shader-hero/page.tsx
- Exhibit-frame shader (separate): https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/reveal-material-shader.md
