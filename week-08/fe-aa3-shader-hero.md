FE-AA3 — Signature Hero Shader ("Foyer Aurora")

## Live URL

https://plinth-cyan.vercel.app/shader-hero

(Verified live 2026-08-30 — renders the aurora shader with the "Foyer" headline, intro line, and "Enter the Museum" CTA on top.)

## What it is

A fullscreen, custom fragment shader (raw WebGL + GLSL, no Three.js/R3F) rendered as a hero behind the page's headline. Not a remix of the session playground — written from scratch for Foyer's palette and museum concept.

**Source:** `app/shader-hero/page.tsx` (`FRAGMENT_SHADER` constant + the WebGL setup/render-loop code around it)

## The shader, section by section

1. **Palette** — three Foyer tones (dark navy `#0a0b16`, ivory `#f5efe0`, gold `#d4a94c`) blended with `smoothstep` so the transition bands stay soft instead of banding.
2. **Noise stack** — a `hash` function seeds a `noise` (value noise) function, which feeds a 3-octave `fbm` (fractal brownian motion). This is the standard "aurora/nebula" noise recipe — three layered fbm calls at different scales and speeds produce the drifting cloud-like bands.
3. **Mouse influence** — `u_mouse` is remapped to roughly `[-0.3, 0.3]` and added directly into the noise coordinate space, so the aurora visibly leans toward wherever the cursor (or last touch point) is, rather than the mouse just tinting a color.
4. **Vignette** — radial darkening (`1.0 - 0.55 * length(...)`) so the center, where the headline sits, stays high-contrast against the ivory text regardless of what the noise is doing there.
5. **Grain** — a cheap per-pixel hash-based dither (`±0.02` around zero) added on top, purely for texture so large flat noise regions don't look like a flat digital gradient.

## Uniforms used

All three core uniforms, not just the minimum two required:

- `u_time` — drives the animation (scaled by `0.15` so it drifts slowly)
- `u_resolution` — keeps the fullscreen quad's aspect ratio correct on resize
- `u_mouse` — normalized `[0..1]` cursor/touch position, feeds the flow-lean effect above

## Shipping responsibly — the required one-liner

**DPR is capped at 1.5** (`Math.min(window.devicePixelRatio, 1.5)`) to avoid full native-resolution shader cost on high-DPI screens; **rendering pauses on `document.hidden`** (skips the `gl.drawArrays` call while the tab is backgrounded, and resumes by re-basing the elapsed-time clock so the animation doesn't jump); and **`prefers-reduced-motion` skips WebGL entirely** — a separate render branch shows a static radial gradient in the same palette, with no canvas or GL context created at all, so there's zero animation and zero extra GPU/battery cost for users who've asked for reduced motion.

## Contrast / readability

Headline and body text are rendered in `#f5efe0` (the shader's own ivory palette stop) over the vignette-darkened center of the shader, so text contrast was designed against the actual rendered output, not layered on as an afterthought.

## Honest gaps

- The tab-hidden pause skips the draw call but doesn't cancel the `requestAnimationFrame` loop itself — the callback still fires every frame while hidden, it just returns early before any GPU work. Functionally correct (no rendering happens), but a fully idle pause would also stop the rAF loop and restart it on visibility return.
