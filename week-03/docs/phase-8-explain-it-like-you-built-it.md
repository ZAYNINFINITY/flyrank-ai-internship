# Phase 8 — Explain It Like You Built It

**Week 6 assignment · Plinth Museum World Graph & Spatial Navigation**

One-liner: **Plinth doesn't have pages that look like a museum. It has a museum that happens to be a website.** Every screen you walk through is a *room* in a data model, and the page is just that room being drawn.

This document explains how the museum's world graph and spatial navigation work, based on the implementation as it exists today.

---

## 1. Why connected spaces instead of ordinary pages

A normal site is a list of routes. Page A links to page B, and the only thing linking them is a hand-written `<a>`. There is no model of *place* — the URL is the only source of "where am I."

Plinth's claim is **"A room for every project you've shipped."** If the metaphor is going to be real — not a marketing gloss on a standard grid — then moving between projects should feel like moving between rooms. That needs three things ordinary routing doesn't give you for free:

1. **A model of space** — rooms, walls, doors, and how they connect.
2. **A visitor** — you are somewhere, and you came from somewhere.
3. **Doors as real objects** — each one knows which room it goes to and which wall it sits on, so the UI can tell you "Reception Hall → ahead" instead of just "Reception Hall".

The world graph gives us all three, and it does it as pure data and pure functions. No rendering logic pollutes the model, which is exactly what we need for the eventual visual pass (Section 8).

---

## 2. What the world graph represents

The graph is a hierarchy of *places*, defined in `app/lib/museum/world.ts`:

```
Building ── Floor ── Wing ── Room ── Surface ── Anchor
```

- **Building** — `plinth-museum`, containing two floors.
- **Floor** — `Ground Floor` (level 0) and `Lower Floor` (level -1), each holding wings.
- **Wing** — groups of rooms (Entrance Wing, Main Wing, East Wing, Studio Wing).
- **Room** — the level a visitor actually occupies. A room has a `name`, a `kind` (hall / corridor / exhibit / studio / outside), a `lighting` preset, `surfaces`, and `doors`.
- **Surface** — one wall, with a compass direction (`north | south | east | west`) and a list of `anchors`.
- **Anchor** — a fixed spot on a wall, with a `position` (`left | center | right`) and `capabilities` (what kind of thing can sit there: `display | projection | terminal | signage | pedestal`).

The rooms, as defined today:

| Room id | Name | Kind | Maps to URL |
|---|---|---|---|
| `entrance-hall` | Outside | outside | `/` |
| `entrance` | Entrance | hall | `/entrance` |
| `reception` | Reception Hall | hall | `/reception` |
| `main-corridor` | Main Corridor | corridor | `/gallery` |
| `exhibit-room` | Exhibit Room | exhibit | `/exhibit/e/[id]` |
| `collections` | Collections Wing | hall | `/collection` |
| `curator-studio` | Curator Studio | studio | `/assistant` |

Alongside the room definitions, `buildIndex` produces a **`WorldIndex`** — three lookup maps keyed by id:

- `byId` — room id → room
- `byDoorId` — door id → door
- `byAnchorId` — anchor id → anchor

So any part of the app can ask "give me the room with this id", "which door is this?", or "what anchors exist in this room?" through small pure helpers (`getRoom`, `getDoor`, `getAnchorsByCapability`, …) instead of walking the tree by hand.

---

## 3. How doors know their destination

A door is a single object with both endpoints and both walls baked in:

```ts
interface Door {
  id: DoorId;
  label: string;              // "Reception Hall"
  fromRoom: RoomId;           // "entrance"
  fromSurface: SurfaceDirection; // "north"
  toRoom: RoomId;             // "reception"
  toSurface: SurfaceDirection;   // "south"
}
```

Two details matter:

1. **Doors are stored on the room they belong to.** Each room has a `doors` array. The entrance room owns `door-entrance-to-reception`, the reception room owns `door-reception-from-entrance`, and so on. A room doesn't need to search the world to know what it connects to — its own data answers that.

2. **The same physical doorway exists twice — once per side.** Walking from the Entrance to the Reception Hall is one doorway, but it's modeled as two `Door` records: `door-entrance-to-reception` (belonging to `entrance`, `fromSurface: north`) and `door-reception-from-entrance` (belonging to `reception`, `fromSurface: south`). This is what lets each side render the doorway with the correct label and the correct *relative* direction — from the entrance it's "ahead", from reception it's "back".

Because every door lives in `worldIndex.byDoorId`, the renderer can take any door id (for example, the one a visitor came through) and resolve the full object — including which surface it's on — without coupling to any particular room.

---

## 4. How clicking a door becomes navigation

The renderer treats every visible door as a `SpaceDoor` — which is just a styled Next.js `<Link>`.

In `DoorRenderer`:

```ts
const route = getRoute(door.toRoom);            // room → URL
const direction = getRelativeDirection(entrySurface, door.fromSurface);
// <SpaceDoor href={`${route}?via=${door.id}`} label={door.label} direction={direction} />
```

So clicking "Reception Hall" in the Entrance doesn't call some bespoke navigation function. It produces a normal URL — `/reception?via=door-entrance-to-reception` — and the browser navigates to it like any link. The `?via=` query string is the URL carrying *which door you used*.

What the URL doesn't yet do, and what the page does instead: each museum page creates its own visitor with a hardcoded "door you came through":

```ts
enterRoom(createVisitor("entrance"), "entrance", "door-entrance-from-hall")
```

That call is the seed of the spatial illusion. It says *"you are in the entrance room, and you walked in from the Outside door"* — and from that one fact, the renderer derives which direction everything else sits. (More on this in Section 7.)

---

## 5. How the navigation adapter connects rooms to URLs

`app/lib/museum/navigation-adapter.ts` is the single seam between the spatial model and the routing system:

```ts
const routeMap: Record<RoomId, string> = {
  "entrance-hall": "/",
  "entrance": "/entrance",
  "reception": "/reception",
  "main-corridor": "/gallery",
  "exhibit-room": "/exhibit/e/[id]",
  "collections": "/collection",
  "curator-studio": "/assistant",
};
```

It also builds the reverse map (`route → roomId`) and exposes:

- `getRoute(roomId)` — room → URL (used when rendering doors and exits)
- `getRoomIdByRoute(route)` — URL → room (reverse lookups)
- `getExhibitRoute(exhibitId)` — a concrete exhibit's page
- `getPortfolioRouteForExhibitId(exhibitId)` — that exhibit's portfolio page

The point of the adapter is that **URLs live in exactly one place**. The world graph never mentions a route, and no component hardcodes a link to another room's URL — they all ask the adapter. If a room's URL ever changes, one map updates and every door across the site follows.

---

## 6. How the renderer uses world data to display the current space

`WorldRenderer` is the single integration point that turns a visitor + the world into a screen. Given a `visitor`, it:

1. `getCurrentRoom(visitor)` — resolves `visitor.currentRoomId` to a room. No room, nothing renders.
2. `getVisibleDoors(visitor)` — the current room's doors (doors whose destination room has no route are filtered out later, in the renderers).
3. `getEntrySurface(visitor)` — which wall you entered from (Section 7).
4. `getSurfaceLayout(room.id, placements)` — every wall of the room, pre-joined with whatever has been placed on its anchors.
5. Builds the `exits` list — for each door: route from the adapter, direction from `getRelativeDirection`, and `href: ${route}?via=${door.id}`.

Then it composes four layers inside a `RoomShell`:

```
RoomShell (room)
├─ page content (children — the "experience" JSX)
├─ DoorRenderer        — each visible door as a SpaceDoor link
├─ SurfaceRenderer     — anchors grouped by wall, rendered via EntityView
└─ SpatialBreadcrumb   — fixed bottom bar: "You are here" + exits with direction symbols
```

- **`RoomShell`** wraps everything in `MuseumSpace`, passing `room.lighting` as the preset and a transition keyed to `room.kind` (halls fade, the corridor does a corridor transition, exhibits do a spotlight reveal).
- **`SurfaceRenderer`** skips the whole section when no anchor has a placement, then renders filled anchors per wall. Each anchor renders through `EntityView`, which looks up the right component from a registry — `exhibit → ExhibitCard`, `signage → SignageView`, `projection → ProjectionView`, and so on. Anchors without placement render as dashed `EmptyAnchor` placeholders.
- **`SpatialBreadcrumb`** is the only client component of the four — it reads `usePathname` to highlight the active exit in the bottom bar.

**A key separation:** *what is in a room* (placements) is separate from *where the room is* (the graph). Pages build a `Map<AnchorId, Placement>` via `populateCorridor` (fill display anchors with exhibits from a repository) or `populateExhibitRoom` (map signage / projection / pedestal anchors for a single exhibit). `WorldRenderer` just joins that map onto the room's anchors. The graph can grow, or the placement logic can change, without the other side caring.

---

## 7. How direction works — "ahead / left / right / back"

Direction is derived, never stored. It falls out of one piece of visitor state: `cameFromDoorId`.

**`getEntrySurface(visitor)`** (`direction-utils.ts`):
- No `cameFromDoorId` → `null` (a fresh visitor has no bearing yet).
- Resolve the door from `worldIndex.byDoorId`.
- If the door belongs to the current room (`door.fromRoom === visitor.currentRoomId`), your entry wall is `door.fromSurface`.
- If you entered the *other* way, it's `door.toSurface`.

**`getRelativeDirection(entrySurface, doorSurface)`** then places any door relative to that entry wall:

- same wall as your entry → **back** (the door you came through)
- opposite wall → **ahead**
- clockwise-next wall → **right**
- otherwise → **left**

So in the Entrance, entering via the south wall (`door-entrance-from-hall`, `fromSurface: south`) makes the Outside door "back" and the Reception door "ahead". `SpaceDoor` renders these as compass symbols and labels — `↑ Ahead`, `↓ Back` — and the breadcrumb uses the same symbols for its exit list.

---

## 8. Why this architecture supports the eventual visual direction

The whole point of modeling space as data is that **the visual pass doesn't have to rebuild anything**.

- **Walls exist.** Every room already knows its four surfaces and each anchor's position (`left | center | right`). A first-person / pseudo-3D view can read the compass directly — it doesn't need guessing.
- **Directions are a compass, not a grid position.** `ahead | left | right | back` is exactly the vocabulary a spatial interface needs. The current UI renders them as arrows; an immersive view renders them as where to look.
- **Lighting is a data field.** Each room carries a `lighting` preset, and `MuseumSpace` translates it into a single `data-museum-space` attribute on `<html>`. One attribute = one CSS hook. When the visual language deepens, the styling can react per space without touching the model.
- **Rendering is swappable.** The model (`world.ts`) knows nothing about React. If `SurfaceRenderer` and `DoorRenderer` are replaced with a 3D renderer, the graph, visitor, placements, and URL adapter don't change at all.
- **"What's here" is decoupled from "where it sits."** Placements are a separate map, so curating content and arranging space are independent jobs.

The world graph is the stable foundation; everything visual sits on top of it.

---

## 9. Honest note: `?via=` is written but not yet read

Every door link carries `?via=${door.id}`, but **no page reads it today.** A grep for `useSearchParams` shows only `/gallery` uses it — and that's for `?collection`, not `?via`. Instead, each page hardcodes its visitor entry door (`enterRoom(createVisitor(...), roomId, doorId)`).

So `?via=` is forward-looking plumbing: when navigation becomes dynamic (or a deep link needs to restore *where you came from* so the "back" door points correctly), the door id is already riding along in the URL. I've left it unwired deliberately — it's honest about what's connected and what isn't, and the current hardcoded seeding produces correct directions for every page that renders the world.

---

## 10. Files that make this work

| File | Role |
|---|---|
| `app/lib/museum/types.ts` | Door, Room, Surface, Anchor, Visitor, Placement, WorldIndex types |
| `app/lib/museum/world.ts` | Building hierarchy, rooms, doors, surfaces, anchors + `WorldIndex` + lookup helpers |
| `app/lib/museum/queries.ts` | `getCurrentRoom`, `getVisibleDoors`, `getConnectedRooms`, `getSurfaceLayout`, `getWing`, `getFloor` |
| `app/lib/museum/visitor.ts` | `createVisitor`, `enterRoom`, `getRoomName` |
| `app/lib/museum/placement.ts` | `canPlace`, `populateCorridor`, `populateExhibitRoom`, placement map helpers |
| `app/lib/museum/navigation-adapter.ts` | `routeMap`, `getRoute`, `getRoomIdByRoute`, exhibit route helpers |
| `app/lib/navigation/museum-layout.ts` | Direction labels + symbols |
| `app/components/renderer/world-renderer.tsx` | The integration point: room + doors + layout + breadcrumb |
| `app/components/renderer/room-shell.tsx` | MuseumSpace + per-kind transition wrapper |
| `app/components/renderer/door-renderer.tsx` | Turns room doors into `SpaceDoor` links |
| `app/components/renderer/surface-renderer.tsx` | Walls → anchors → `EntityView` |
| `app/components/renderer/entity-view.tsx` | Registry-based entity rendering |
| `app/components/renderer/direction-utils.ts` | `getEntrySurface`, `getRelativeDirection` |
| `app/components/space-door.tsx` | The door as a link (path + return variants) |
| `app/components/spatial-breadcrumb.tsx` | "You are here" bar with exit directions |
| `app/components/museum-space.tsx` | `data-museum-space` + transition attributes |
| `app/app/{entrance,reception,gallery,collection}/page.tsx` | Pages that seed a visitor and render `WorldRenderer` |
