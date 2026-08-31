# Reveal Shader — Exhibit Frame Dissolve (RevealMaterial)

> Note: this document was originally misfiled as `fe-aa3-shader-hero.md`.
> It describes the exhibit-frame sketch-to-paint dissolve effect, which is
> real, shipped work — but it is NOT the FE-AA3 assignment deliverable.
> The FE-AA3 fullscreen hero shader is documented separately in
> `fe-aa3-shader-hero.md` (rewritten). This file is retained under its
> correct name, `reveal-material-shader.md`, so the writeup isn't lost.

## What it is

A custom `THREE.ShaderMaterial` subclass that creates a brush-stroke sketch-to-paint reveal effect. When the camera approaches an exhibit frame, the sketch layer dissolves from bottom to top with a noisy brush edge, revealing the painted content underneath.

**Source:** `lib/three/reveal-material.ts` (77 lines)
**Adapted from:** MIT-licensed [itomdev.com](https://github.com/ITomPoland/portfolio-itom) technique, customized for Foyer's museum context.

## How it works

The shader hooks into Three.js's `onBeforeCompile` pipeline — it does NOT replace the material, it injects two small GLSL blocks into the existing `MeshBasicMaterial` fragment shader:

1. **Uniform injection** (`#include <common>`): Adds `uProgress` (0..1) plus two noise functions (`revealRand`, `revealNoise`) that generate a procedural brush-stroke pattern.

2. **Discard logic** (`#include <alphatest_fragment>`): For each pixel, computes `maskValue = (1.0 - uv.y) + noise`. If `maskValue < uProgress * 1.5`, the pixel is discarded (transparent), creating the bottom-to-top brush dissolve.

The noise is squared (`res*res`) exactly like the source technique — this makes the dissolve edge read as blotchy brush strokes rather than a clean line.

## Integration

| Piece | File |
|-------|------|
| Shader class | `lib/three/reveal-material.ts` |
| Texture cache | `lib/three/paper-texture.ts` (generates sketch + painted pairs) |
| Scene usage | `components/three/walkable-world.tsx` — `SketchCard` component |
| React Three extend | `extend({ RevealMaterial })` at bottom of reveal-material.ts |

The `SketchCard` component in `walkable-world.tsx` creates two layered planes:
- **Back plane:** painted texture (full color, always visible)
- **Front plane:** sketch texture with `RevealMaterial` (dissolves as camera approaches)

Each frame, `useFrame` computes distance from camera to the frame's Z position and lerps `uProgress` from 0 (full sketch) to 1 (fully dissolved, painted visible).

```
dist = |camera.z - frame.z|
target = clamp((7.5 - dist) / 5, 0, 1)
uProgress = lerp(uProgress, target, 0.06)
```

This means exhibits "paint themselves" as you walk toward them — the sketch dissolves into the finished piece.

## Why it matters

This is the signature visual effect of Foyer's museum. Without it, exhibits are static textured planes. With it, the museum feels alive — each piece reveals itself as you approach, creating a sense of discovery that a card grid or thumbnail cluster can never match.

## Evidence

- Shader compiles and runs on all WebGL2-capable devices
- Fallback: on devices without WebGL2, the `SurfaceRenderer` shows flat 2D content (no shader needed)
- The brush-stroke noise pattern is seeded per-exhibit, so each reveal looks slightly different
- Performance: single `onBeforeCompile` per material instance, no per-frame GPU overhead beyond the existing `useFrame` distance check
