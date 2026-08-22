# FE-AA2 — 3D Exhibit Room (Walkable Corridor)

## Status: SHIPPED (walkable scroll-rail v2 + visual polish)

Week 7 delivers the **walkable museum corridor** as progressive enhancement, not the rejected orbit diorama. A second pass added architectural polish, gyroscope mobile controls, and click-to-inspect interaction.

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
| Input (gyroscope + mouse + touch) | `components/three/walkable-input.ts` |
| World model | `lib/museum/walkable-model.ts` |
| Paper texture + reveal material | `lib/three/paper-texture.ts`, `lib/three/reveal-material.ts` |
| Home takeover | `app/page.tsx` (3D-capable clients) |

## Interaction model (v2)

- **Scroll / touch drag** glides camera along Z rail: approach → reception → corridor → exhibit
- **Mouse parallax** for subtle look-around (desktop)
- **Gyroscope tilt** for look-around (mobile) — calibrated to phone resting angle, separate from touch drag for movement
- **Direct click/tap** on any interactive object inspects it (raycasted hit, not just nearest)
- **E / prompt pill** as accessible fallback for nearest-item inspection
- **Doors** auto-open when gliding past thresholds
- **Text walls** toggles to flat `SurfaceRenderer` (accessible path)

## Scene architecture

- **Approach exterior**: courtyard walls, lamp posts (4), planters (2), stone steps, welcome mat, facade with real ShapeGeometry door cutout, "FOYER MUSEUM" signage
- **Reception hall**: information signage, curator billboard sprite, bench, potted plants
- **Sawtooth corridor**: angled bay walls (itom-inspired) with 4 exhibit frames, camera auto-glance toward wall pieces
- **Exhibit room**: title wall, media projection, artifact plinths, curator notes
- **Curator**: billboard sprite (`curator.png`), camera-facing quaternion, gentle bob, ground shadow disc

## Entrance door fix (critical bug)

The original entrance door was a decorative prop floating 1.2 units in front of a solid wall with no hole in it. Opening the door revealed nothing — a solid wall sat right behind it.

**Root cause**: Two separate bugs at once:
1. `ApproachExterior` drew one solid facade plane — the door had nothing to open into
2. Reception's `RoomBox` never declared a south gap — the wall rendered solid even though the collision model already had a 1.6-unit opening there

**Fix**:
- Added `ENTRANCE_HALF = 0.8` constant matching `walkable-model.ts`'s `DOOR_GAP` exactly
- Reception south wall now has a real cutout matching the collision gap
- Facade uses `ShapeGeometry` with a door-shaped hole (not two stretched halves)
- Door leaves hinged at outer jambs, meeting in center (real double-door behavior)
- Added `omitDoorwayFrame` to `RoomBox` so grand exterior frame doesn't double up with interior doorway

## Mobile improvements

- **Gyroscope look**: `enableGyroscope()` requests `DeviceOrientationEvent` permission (iOS Safari), calibrates to resting angle, feeds tilt into look direction
- **Touch drag tuned**: 1.8x multiplier (was 2.6x) — less twitchy
- **Gyro/mouse exclusive**: once gyroscope is active, horizontal drag stays dedicated to movement instead of fighting with tilt for "look"

## 2D fallback

Automatic when: no WebGL2, reduced motion, or low memory. Never downloads three.js chunk.

## Tests

- `lib/museum/walkable-model.test.ts` — collision, door triggers, spawn resolution
- `lib/renderer/capability.test.ts` — device tier detection
- `lib/repository/acceptance.test.ts` — 74 tests total

## Performance

See [`fe-aa2-perf-note.md`](fe-aa2-perf-note.md).
