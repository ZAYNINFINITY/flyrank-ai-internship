# Task 1 / Museum Spatial System — Plinth Museum World

**Assignment:** Museum spatial system — world graph, renderer, and navigable rooms
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** Build (Week 5)
**Deliverable:** https://plinth-cyan.vercel.app/entrance · /reception · /gallery · /collection

---

## Architecture Overview

### 1. World graph — `lib/museum/`

The museum is a typed world graph, not a set of loose routes:

- `types.ts` — the core vocabulary: `Room` (id, name, kind, lighting, surfaces, doors), `Surface` (four walls, each with anchors), `Door` (from room/surface → to room/surface), `Anchor` (a wall position with capabilities), `Building → Floor → Wing → Room`. Capability types: `display`, `projection`, `terminal`, `signage`, `pedestal`.
- `world.ts` — the graph itself, built with small factory helpers (`room`, `surface`, `anchor`, `door`). Declares 7 rooms: Entrance Hall (Outside), Entrance, Reception Hall, Main Corridor, Exhibit Room (template), Collections Wing, Curator Studio. Also builds the indexes (`byId`, `byDoorId`, `byAnchorId`) and the lookup helpers (`getRoom`, `getDoor`, `getAnchor`, `getDoorsInRoom`, `getSurfaces`, `getAnchors`, `getAnchorsByCapability`).
- `queries.ts` — pure query functions over a `Visitor`: current room, visible doors, connected rooms, and surface layout (anchors pre-joined with placements).

**Key file:** `lib/museum/world.ts` — 202 lines, all data, no rendering.

### 2. Visitor state — `lib/museum/visitor.ts`

A tiny pure-state model: `createVisitor(roomId)` and `enterRoom(visitor, roomId, doorId)` return immutable `Visitor` objects (`currentRoomId`, `cameFromDoorId`, `enteredAt`). Every museum page runs `enterRoom(createVisitor(roomId), roomId, doorId)` on render — which also fixed a pre-existing `Date.now()` purity lint error the pages carried.

### 3. Placement engine — `lib/museum/placement.ts`

Capability-based population. `entityCapabilities` maps each entity type (`exhibit`, `artifact`, `projection`, `timeline`, `terminal`, `statue`, `signage`) to the anchor capabilities it needs. `canPlace` checks compatibility; `place`/`createPlacementMap`/`getPlacementAtAnchor` manage the `Map<AnchorId, Placement>`; `populateCorridor` fills display anchors from an `ExhibitRepository`; `populateExhibitRoom` fills an exhibit room's signage/projection/display anchors for one exhibit.

### 4. Navigation adapter — `lib/museum/navigation-adapter.ts`

Bridges the world graph to the Next.js router: a `routeMap` (`RoomId` → URL) and the reverse lookup, plus `getExhibitRoute`. Doors render as real links carrying `?via=<doorId>` — the visitor's entry direction is part of the URL, read back by `use-door-entry.ts`.

### 5. Renderer — `components/renderer/`

- `world-renderer.tsx` — the composite: reads current room + visible doors + surface layout via queries, computes each door's **relative direction** (`ahead`/`left`/`right`/`back`) from the entry surface, and renders `RoomShell` → `DoorRenderer` → `SurfaceRenderer` → `SpatialBreadcrumb`.
- `room-shell.tsx` — per-`RoomKind` lighting preset + transition (`doorway-fade`, `corridor`, `spotlight-reveal`).
- `door-renderer.tsx` — door rendering with direction.
- `surface-renderer.tsx` — wall/surface layout rendering.
- `entity-view.tsx` + `entities/default-registry.ts` — registry-driven entity renderer; each entity type has its own view (exhibit card, artifact, projection, signage, statue, terminal, timeline).
- `components/museum-space.tsx` — the atmosphere/transition wrapper (CSS in `globals.css`).
- `components/spatial-breadcrumb.tsx` — "You are here" spatial footer with the room's exits.

### 6. Room routes

Entrance, Reception, Gallery (Main Corridor), Collections — each `page.tsx` + its `*-experience.tsx`, plus the dynamic exhibit room `/exhibit/e/[id]`. All are static Next.js routes that compose the renderer with a visitor + placements.

---

## How It Works

```
Visitor requests /reception
  → page.tsx: enterRoom(createVisitor("reception"), "reception", "door-...")
  → world-renderer: getCurrentRoom → Reception Hall
  → getVisibleDoors → 4 doors (Entrance, Main Corridor, Collections, Studio)
  → entrySurface from ?via= → each door gets a relative direction
  → RoomShell renders lighting + transition
  → DoorRenderer + SurfaceRenderer + SpatialBreadcrumb render the room
  → door click → /main-corridor?via=door-reception-to-corridor (next room)
```

---

## Evaluation Criteria Met

| Criteria | Status |
|----------|--------|
| Rooms are real navigable routes, not modals | ✅ Each room is a Next.js page |
| Door navigation carries entry direction | ✅ `?via=<doorId>` on every door link |
| Typed world graph (not hardcoded rooms) | ✅ `Building → Floor → Wing → Room → Door → Surface → Anchor` |
| Capability-based placement | ✅ `canPlace` / `populateCorridor` / `populateExhibitRoom` |
| Registry-driven entity rendering | ✅ `default-registry.ts` maps entity type → view |
| Immutable visitor state | ✅ `createVisitor` / `enterRoom` return new objects |
| Build green | ✅ 17 routes, TypeScript clean |

---

## Files

- `lib/museum/types.ts` — core museum types
- `lib/museum/world.ts` — world graph + indexes
- `lib/museum/queries.ts` — visitor queries
- `lib/museum/placement.ts` — placement engine
- `lib/museum/visitor.ts` — visitor state
- `lib/museum/navigation-adapter.ts` — route map + `?via=`
- `lib/museum/use-door-entry.ts` — entry transition reader
- `lib/navigation/museum-layout.ts` — direction model
- `components/renderer/world-renderer.tsx` — composite renderer
- `components/renderer/room-shell.tsx`, `door-renderer.tsx`, `surface-renderer.tsx`, `entity-view.tsx`, `direction-utils.ts`
- `components/renderer/entities/*` — entity view components
- `components/museum-space.tsx`, `components/spatial-breadcrumb.tsx`, `components/space-door.tsx`
- `app/entrance/`, `app/reception/`, `app/gallery/`, `app/collection/`, `app/exhibit/e/[id]/` — room routes

---

## Links

- **Preview URL:** https://plinth-cyan.vercel.app/entrance
- **World graph:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/world.ts
- **Renderer:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/components/renderer/world-renderer.tsx
- **Visitor state:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/visitor.ts
- **Placement engine:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/placement.ts
- **Navigation adapter:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/museum/navigation-adapter.ts
