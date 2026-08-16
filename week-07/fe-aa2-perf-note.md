# FE-AA2 — Exhibit Room 3D: Performance Note

Feature: the exhibit room renders as a **live 3D walkable corridor** on capable devices,
with a text-walls 2D fallback for everything else.

## Architecture

Plinth's pipeline remains `World Graph → Queries/Placement → Renderer`.
The same `SurfaceLayout[]` drives flat and 3D renderers. FE-AA2 added a switchable
renderer seam (`exhibit-walls.tsx`) rather than replacing the world model.

## Bundle cost

The 3D stack (three + @react-three/fiber + drei + troika) lives in one lazy chunk,
loaded only after `evaluateRendererCapability()` passes. 2D-only devices never fetch it.

Approximate chunk size (pre-week-7 measurement): ~1005 KB raw / ~276 KB gzip.

## Scene budget

- Procedural geometry — no GLTF models
- Paper texture: single cached `CanvasTexture`
- Troika text instances kept ~12
- Fog + standard lights; shadows tiered by capability

## Quality tiers (`lib/renderer/capability.ts`)

| Profile | maxDpr | shadows | Result |
|---------|--------|---------|--------|
| Desktop WebGL2, ≥4 GB | 2 | on | 3D |
| Coarse pointer | 1.5 | off | 3D |
| Memory 2–3 GB | 1.5 | off | 3D |
| No WebGL2 / reduced motion / <2 GB | — | — | 2D |

## Interaction model (walkable v2 — current)

- **Scroll / touch drag** moves along the museum Z rail (approach → reception → corridor → exhibit)
- **Mouse / touch parallax** offsets view slightly (no pointer lock)
- **E / prompt button** inspects nearest interactive
- **Doors** open automatically when the rail passes thresholds
- **Text walls** → flat renderer (keyboard/AT path)

OrbitControls diorama (v1) was removed.

## Why the numbers matter

3D is progressive enhancement on a fast 2D baseline. Documented so future polish
(text count, chunk size, mount time) can be compared after aesthetic changes.
