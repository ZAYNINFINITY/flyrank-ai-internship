# FE-AA2 — Exhibit Room 3D: Performance Note

Feature: the exhibit room renders as a **live 3D room** on capable devices,
with a text-walls 2D fallback for everything else.

## Why this is not a "just add three.js" change

Plinth's architecture is `World Graph → Queries/Placement → Renderer`.
FE-AA2 kept that intact: the same `SurfaceLayout[]` that drives the flat
renderer now also drives the 3D scene. Every plaque, artifact, projection
screen and door is positioned from the placement engine — nothing is
hand-placed in the scene. The renderer became switchable (2D | 3D) instead
of replaced.

## Bundle cost

The 3D stack (three + @react-three/fiber + drei + troika) lives in one
lazy chunk:

| Metric | Value |
|--------|-------|
| Raw | 1005 KB |
| gzip | 276 KB |
| brotli | 227 KB |
| Loading | `next/dynamic` + `ssr:false`, only on the exhibit route |

The chunk is only fetched **after** `evaluateRendererCapability()` confirms
WebGL2, no reduced-motion preference, and adequate memory. 2D-only devices
never download it — the exhibit route's HTML/JS footprint is unchanged for
them.

## Scene budget

- Fully **procedural geometry** — no GLTF, no external models.
- ~480 triangles for the whole room (10×7×4.2 units: 4 walls, floor,
  ceiling, grid, title/notes plaques, artifact plinths, projection screen,
  door portal).
- ~37 draw objects; single texture only when an exhibit supplies media
  (procedural panel otherwise).

## Quality tiers (`lib/renderer/capability.ts`)

| Device profile | maxDpr | shadows | Result |
|----------------|--------|---------|--------|
| Desktop, ≥4 GB, WebGL2 | 2 | on | 3D |
| Coarse pointer / touch | 1.5 | off | 3D |
| Memory 2–3 GB | 1.5 | off | 3D |
| No WebGL2 | — | — | 2D fallback |
| `prefers-reduced-motion` | — | — | 2D fallback |
| <2 GB | — | — | 2D fallback |

## Measured performance

Test: production build, headless Chromium **software** WebGL (SwiftShader),
1280×900 viewport, `/exhibit/e/pos-it`.

- Render loop: **46.7 fps** (software rasterizer; real GPUs run vsync-locked
  at 60+).
- Canvas buffer 894×520 at DPR 1.
- First 3D mount ≈ 6–8 s on SwiftShader (shader compile + troika font
  setup). The flat room and a `Loading the 3D room…` state show
  immediately while the chunk loads, so there is never a blank screen;
  on GPU hardware mount is near-instant.
- No per-frame state churn: re-renders only on hover, focus or inspect.

## Interaction model

- **OrbitControls** — drag to look around, scroll/pinch to zoom, polar
  clamped so the room stays grounded.
- **Raycast clicks** — any plaque/artifact/projection opens an inspect
  overlay (real `<div role="dialog">`, Escape closes it).
- **Door portal** — click navigates to the connected space via `?via=`,
  which re-uses the existing world-graph door entry surface.
- **Keyboard path** — "View as text walls" toggles to the flat renderer,
  which is fully keyboard/screen-reader accessible.

## Why the numbers matter

The 3D room is a progressive enhancement on top of a fast baseline, not a
replacement for it. Budget (approx 277 KB gzip lazy) is documented so a
future change that adds models or an asset CDN has a baseline to compare
against.
