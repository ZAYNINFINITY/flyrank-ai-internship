# FE-AA2 — 3D Exhibit Room (Walkable Corridor)

## Status: SHIPPED (walkable scroll-rail v2)

Week 7 delivers the **walkable museum corridor** as progressive enhancement, not the rejected orbit diorama.

## What was rejected

**Orbit diorama v1** (`components/three/room-scene-3d.tsx`) — click-to-orbit around a boxed room. User feedback: did not match itomdev-style first-person corridor feel. File removed from repo.

## What shipped

| Piece | Location |
|-------|----------|
| Capability gate | `lib/renderer/capability.ts`, `use-capable-renderer.ts` |
| Renderer seam | `components/renderer/exhibit-walls.tsx` |
| 3D host | `components/three/exhibit-room-3d.tsx` |
| Scene | `components/three/walkable-world.tsx` |
| Scroll rail player | `components/three/walkable-player.tsx` |
| Input | `components/three/walkable-input.ts` |
| World model | `lib/museum/walkable-model.ts` |
| Paper texture | `lib/three/paper-texture.ts` |
| Home takeover | `app/page.tsx` (3D-capable clients) |

## Interaction model (v2)

- **Scroll / touch drag** glides camera along Z rail: approach → reception → corridor → exhibit
- **Mouse parallax** for subtle look-around (not pointer-lock FPS)
- **E / prompt pill** inspects nearest exhibit plaque, frame, or curator
- **Doors** auto-open when gliding past thresholds
- **Text walls** toggles to flat `SurfaceRenderer` (accessible path)

## Arrival + curator (week 7 placeholders)

- Exterior approach zone north of reception (facade + path + gate posts)
- Brief “Approaching Plinth Museum” CSS overlay on first mount
- Curator = capsule + sphere mesh in reception; inspect → `/assistant`

Full exterior walk-up and rigged animated curator: **week 9/10**.

## 2D fallback

Automatic when: no WebGL2, reduced motion, or low memory. Never downloads three.js chunk.

## Learnings

- Text readability required direct `camera.rotation` set (not `lookAt`) to avoid roll/mirror bugs
- Scroll rail matches itom “glide through” feel without pointer-lock friction on mobile
- Same `SurfaceLayout[]` for 2D and 3D prevented duplicate content wiring

## Tests

- `lib/museum/walkable-model.test.ts`
- `lib/renderer/capability.test.ts`
- E2E branches 3D vs flat home in `e2e/museum-flow.spec.ts`

See also: [`fe-aa2-perf-note.md`](fe-aa2-perf-note.md) (updated for walkable model).
