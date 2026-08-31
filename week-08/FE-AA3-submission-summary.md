# FE-AA3 — Signature Hero Shader (Foyer Aurora)

**Intern:** Zain Ul Abideen
**Track:** Frontend AI Engineering
**Assignment:** FE-AA3 — Signature Hero: a fullscreen shader
**Week:** 8 · **Phase:** Submit · **Workload:** 2h

---

## Live URL

**https://plinth-cyan.vercel.app/shader-hero**

Verified live (2026-08-30): the fullscreen aurora shader renders behind the "Foyer" headline, intro line, and "Enter the Museum" CTA. The `/shader-hero` route ships in the production build.

---

## What it is

A **fullscreen, custom fragment shader** (raw WebGL + GLSL, no Three.js/R3F) rendered as a hero with real content on top. Written from scratch for Foyer's palette and museum concept — not a copy of the session playground.

**Source:** `week-03/app/app/shader-hero/page.tsx` (`FRAGMENT_SHADER` constant + the WebGL setup/render-loop around it)

## The shader, section by section (walk-a-mentor-ready)

1. **Palette** — three Foyer tones (dark navy `#0a0b16`, ivory `#f5efe0`, gold `#d4a94c`) blended with `smoothstep` so the transition bands stay soft instead of banding.
2. **Noise stack** — a `hash` function seeds a `noise` (value noise) function, which feeds a 3-octave `fbm` (fractal brownian motion). Three layered fbm calls at different scales/speeds produce the drifting cloud-like bands.
3. **Mouse influence** — `u_mouse` is remapped to roughly `[-0.3, 0.3]` and added into the noise coordinate space, so the aurora leans toward the cursor/touch point, rather than just tinting a color.
4. **Vignette** — radial darkening (`1.0 - 0.55 * length(...)`) so the center, where the headline sits, stays high-contrast against the ivory text.
5. **Grain** — a cheap per-pixel hash-based dither (`±0.02`) on top, so large flat noise regions don't read as a flat digital gradient.

## Uniforms used — all three core uniforms

| Uniform | Role |
|---|---|
| `u_time` | Drives the animation (scaled by `0.15` so it drifts slowly) |
| `u_resolution` | Keeps the fullscreen quad's aspect ratio correct on resize |
| `u_mouse` | Normalized `[0..1]` cursor/touch position, feeds the flow-lean effect |

Requirement was "at least two of three" — all three are used.

## Shipping responsibly (required one-liner)

**DPR capped at 1.5** (`Math.min(window.devicePixelRatio, 1.5)`); **animation pauses when the tab is hidden** (skips the `gl.drawArrays` call while backgrounded and re-bases the elapsed clock on return); **`prefers-reduced-motion` skips WebGL entirely** — a static radial-gradient render branch in the same palette, with no canvas or GL context created, so reduced-motion users get zero animation and zero extra GPU/battery cost.

## Contrast / readability

Headline and body text are rendered in `#f5efe0` (the shader's own ivory palette stop) over the vignette-darkened center, so text contrast was designed against the actual rendered output — not layered on as an afterthought.

## Honest gaps

- The tab-hidden pause skips the draw call but doesn't cancel the `requestAnimationFrame` loop itself — the callback still fires while hidden, returning early before any GPU work. Functionally correct (no rendering happens), though a fully idle pause would also stop the rAF loop and restart it on visibility return.

## Evidence / files

| File | Purpose |
|---|---|
| `week-08/fe-aa3-shader-hero.md` | Full assignment writeup (this design) |
| `week-08/reveal-material-shader.md` | The *other* (exhibit-frame) shader, documented separately (not the FE-AA3 deliverable) |
| `week-08/FE-AA3-portal-submission.md` | Copy-paste links for the portal |
| `week-08/FE-AA3-submission-checklist.md` | Portal checklist |
| `week-03/app/app/shader-hero/page.tsx` | The shader source |

---

## AI transparency

The GLSL was drafted with Claude as an assist, then every block was reviewed and the page verified against the running app. The palette and museum concept are the intern's; the noise/mouse/vignette/grain structure is explained block-by-block above.
