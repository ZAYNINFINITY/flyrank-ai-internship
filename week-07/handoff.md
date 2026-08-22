# Week 07 · FE-AA2 — Walkable 3D Museum: Handoff (very detailed)

> **LATEST CONTINUATION — August 17, 2026.**
> The current working tree is no longer the committed paper/sketch pass described
> later in this document. A new rescue pass is in progress under `week-03/app`
> that moves Foyer toward a **public 3D museum**, closer to the
> user's latest direction: no website wrapper, no personal-only portfolio, no
> broken hallway labels.

## §0 — Current working tree state (museum stabilization pass)

The active app is still `week-03/app`. The home route now treats the museum as
the product, not as an optional landing-page enhancement:

- `app/layout.tsx` removed the global nav/footer shell so the 3D experience is
  not wrapped in old website chrome.
- `app/page.tsx` starts from a public developer seed (`torvalds`) instead of a
  personal project/default portfolio.
- `lib/repository/mock-exhibit-repository.ts` now contains GitHub-shaped public
  developer profiles: profile identity, avatar/image URL, curator notes, and
  project-like artifacts. This is still mock data, but the shape is intentionally
  ready for GitHub auth/API wiring.
- `lib/museum/walkable-model.ts` now exposes reception exhibit frames,
  `Inspect exhibit` interactions, exhibit preview copy, `Open exhibit`, and
  curator narration that explains what the visitor is looking at.
- `components/three/walkable-world.tsx` now renders the main hall as a portrait gallery with exhibit-backed frames, a Collections/category wall,
  warmer visible LED strips, backlit panels, darker concrete/stone/metal/wood
  materials, upgraded doors, richer plinths, and profile-room project artifacts.
- `lib/three/paper-texture.ts` now includes procedural museum materials
  (`concrete`, `floor-stone`, `wood`, `metal`, `dark-panel`) in addition to the
  prior paper texture work.

Correction after user feedback: do **not** treat the dark concrete moodboard as
the final direction. The user explicitly asked to take help from `itomdev.com`,
so the next visual pass should re-anchor the museum in itomdev's actual design
moves: warm hand-drawn/sketch corridor, flat geometry instead of Blender-style
models, smooth scroll/camera storytelling, doors as navigation, click-based
inspection, wall frames that reveal/paint as visitors approach, and minimal
website chrome. The developer-profile idea is still correct, but the art
direction should feel authored and sketch-built, not like a random dark museum
theme.

### Current verification

From the last continuation session:

- `npm run typecheck` passed.
- `npm run lint` passed with the same two pre-existing unused-import warnings.
- `npm run build` passed.
- August 17 continuation: local dev server started from `week-03/app` with
  `npm run dev -- -p 3000`; `http://localhost:3000/` returned HTTP 200.
  Log file: `week-03/app/dev-server.log`.

### Important remaining work

- Connect real GitHub auth/profile/repository data. The current developer
  profiles are GitHub-shaped seed content, not live GitHub API output.
- Immediate fix now in progress: keep the developer-profile museum concept, but
  remove the random dark concrete/metal moodboard styling from the active scene
  and restore the itomdev-inspired warm paper/sketch visual language already
  present in the older pass.
- Fix applied in `components/three/walkable-world.tsx`: the active scene palette
  is back to warm paper/ink/terracotta, visible wall/floor/ceiling/frame/panel
  materials use paper/ink washes again, the facade texture was repainted from
  dark concrete to sketched paper, and the profile/project content remains in
  place. This preserves the useful developer museum work while removing the
  random dark moodboard layer.
- Verification after that fix: `npm run typecheck` passed; `npm run lint`
  passed with only the two existing warnings in `lib/museum/queries.ts` and
  `lib/museum/world.ts`; `npm run build` passed.
- Replace/finish the curator visual with a real asset or character system. The
  referenced `curator.jpg` was mentioned by the user, but it was not reliably
  loaded in the prior session.
- Run visual verification again after any scene changes: desktop and mobile
  screenshots, canvas nonblank check, and interaction check for portrait preview
  → `Open exhibit` → project room.
- Update older docs if this direction becomes final. Sections below preserve
  historical context and may still mention the earlier paper/sketch pass,
  sawtooth corridor pass, or "all committed" state.

> **READ FIRST — DECIDED DIRECTION (supersedes everything below this box).**
> This brief was settled in a Claude working session with the user. The previous
> prototype feedback ("not itomdev-like") is superseded by a much bigger vision.
> Read §A (vision) and §B (decided week-7 scope) before touching any code.

## §A — The vision (long-term direction)

The exhibit route should become an **arrival sequence**, not a landing page:

- Someone visits the link and they are **standing outside a building** — a gate,
  a path leading up to it, and the building itself reads **unmistakably as a
  museum** (architecture that says "museum" the way a stone
  facade with columns says "history museum").
- They **walk the path, through the gate, into the museum** — and that is the
  actual homepage. **No header nav, no hero text, no button first.**
- The **curator is not a chatbot in a box anymore** — it is a character, a
  presence physically in the space: a 3D figure or sprite that greets you at the
  entrance and guides you room to room. **The AI chat work already built
  (`/assistant`, @ai-sdk/google pipeline) becomes that character's brain** — not
  a floating chat widget.

This is a genuinely bigger and better framing: the difference between a *demo*
and a *place*. The itomdev-style sketch/paper aesthetic (§2 below) is still the
visual language, but it now serves this arrival concept rather than being an
end in itself.

## §B — Decided week-7 scope (the honest ask for right now)

Fully modeling a museum exterior + walkable approach path + rigged animated
curator is a lot of new 3D asset work — that is **week-9/10 polish**, not
today's goal. The agreed scope for week 7 is:

1. **Make the existing corridor actually work** — full-screen, visible, correct
   text. (Fix the real defects first; see §6 for known ones.)
2. **Add the simplest possible arrival beat** — even a single exterior shot, or
   a short walk-up to a doorway before you are inside, so the shell of "you're
   arriving at a building" exists.
3. **Add a curator figure** — even a simple placeholder shape/sprite standing in
   the reception room **instead of the chat box**, so the concept is proven.
4. **Build up fidelity in week 9/10** — full exterior, walkable approach path,
   rigged animated curator character.

> Goal of the week: prove the *shell* of arrival + curator-in-space. Fidelity
> comes later.

## §C — Latest state: v2 scroll-rail + itom design pass (supersedes stale bits below)

Since §B was written, Claude + Cursor built **v2 (scroll-rail player)** and I
applied an **itom design pass** on top. All of it is verified and committed.

**v2 player (built by Claude/Cursor, verified 10/10):** the WASD/pointer-lock
controller was replaced by a **scroll-rail**: scroll/touch-drag glides the camera
along the corridor spine with mouse parallax and doors that auto-open on
approach. Arrival beat: fullscreen "Approaching / Foyer Museum" intro overlay
that fades only once the scene is ready, then an exterior gate shot as you walk
back toward the approach. Curator figure stands in reception (inspect → prompt →
`/assistant`). `?via=door-exhibit-from-corridor` validated via
`lib/museum/via-entry.ts` → spawn `z≈-9.5`. `window.__foyer` and
`room-scene-3d.tsx` were removed. 54/54 tests, AUDIT.md + fe-aa2-3d-room.md +
submission docs written.

**itom design pass (I did this):** root cause of "design is horrible" —
Claude/Cursor's v2 was **dark ink** (`#121218` walls, heavy vignette 0.55,
fog-to-ink), but itomdev.com is **bright warm paper** (`#fafafa/#f5f5f5`
sketchbook, faint notebook grid, vignette ~0.03, RevealMaterial sketch→paint
shader). Reference source confirmed via **MIT-licensed repo
`github.com/ITomPoland/portfolio-itom`** (code reusable; its personal art assets
are NOT — keep Foyer procedural). Applied:

- `walkable-world.tsx`: PALETTE flipped to paper (`corridorWall #efe9da`,
  ink text `#2a2a30`, accent `#c96a3a`), fog `[paper,26,85]`, clear color paper,
  lights rebalanced. **GridFloor** (faint notebook grid, x -3.5..3.5, z -13..20,
  opacity 0.07). **Frame** redesigned: thin ink sketch border (4 strokes, no
  slab) + paper mat + ink title/tagline + **SketchCard** reveal below each frame
  (wobbly pencil doodle that paints in as you approach, via new
  `lib/three/reveal-material.ts`). Plaque/ProjectionScreen/ArtifactPlinth/
  CuratorFigure recolored. Curator = ink humanoid silhouette (legs/torso/arms/
  head/eye) bobbing gently. Exterior got a **lintel** so the two gate posts read
  as a real doorway.
- `lib/three/paper-texture.ts`: rewritten warm-paper grain texture.
- `exhibit-room-3d.tsx`: overlays restyled black-glass → **ink-on-paper**
  ("Text walls", prompt pill, inspect dialog, "Leave the room"); scene bg paper;
  vignette lightened to `rgba(70,58,34,0.18)`; arrival overlay paper. **Fade now
  gated on scene readiness** (`onReady` from Canvas → `sceneReady` → 2.8s fade),
  fixing the cold-start race where the intro vanished before the scene mounted.
- **Gibberish fix:** prompt pill rendered `{prompt}` + "E" hint with no
  whitespace → screen-readers/innerText read "TALK TO CURATORE", "INSPECT
  EXHIBITE", "READE". Hint now `\u00A0E` + `aria-hidden`.

**itom structure + smoothness port (this session, user directive):** "use those
from existing repo so museum structure and everything is smooth" → read the
local copy of the MIT repo (`INTERNSHIP\portfolio-itom-main`) and ported three
things:

1. **CRITICAL wall bug fixed** — `RoomBox.wallAlongZ` sized every east/west wall
   with `footprint.maxX - footprint.minX` (the room's X width) instead of the
   actual Z span. The corridor is 6 wide × 26 long, so its side walls were only
   6 units long (z∈[-3,3]) — the frames at z=4/8/-4/-8 **floated in open space**.
   Now every side wall spans its real length (`toZ - fromZ`).
2. **Architecture** (itom museum grammar): thin ink **baseboards** on every wall
   segment (`BASEBOARD_H 0.14`, `BASEBOARD_D 0.08`, `PALETTE.frame`); each door
   gap got a **Doorway** — two vertical posts (`DOOR_POST 0.14`) + lintel
   (`DOOR_LINTEL_Y 2.72`) + floor threshold, inset 0.02 toward each room's own
   interior so the corridor and its neighbour don't z-fight at the shared wall
   line.
3. **Door auto-glance** (ported from `useInfiniteCamera.js` glance math) — as
   you walk the corridor the camera eases toward each wall-hung frame and
   releases after passing it. Same ramp (`GLANCE_START 15 / PEAK 8 / END -2`),
   eased `strength*(2-strength)`, **slow to look (0.03) / fast to release (0.08)**
   so the motion never drags behind you. `MAX_GLANCE_YAW 0.15` rad (~9°), added
   to the parallax yaw in `walkable-player.tsx`. Targets computed in the scene
   from `corridorLayout` → `corridorFrameSpot` (east frames → dir -1 = look
   right, west → +1 = look left). Only side-wall frames glance (the doors are
   straight ahead at z=±13).

**Verification (all green):** typecheck clean · lint 0 errors (2 pre-existing
warnings) · tests **54/54** · build clean · live Playwright **10/10**
(verify-v2.cjs) · fresh screenshots of every route + every museum state in
`week-07/screenshots/` (36 files — `museum-01..20` + `route-*`; the stale
`fe-aa2-*` set was removed). Corridor shots now show real walls/doors
(stdev jumped 9.0 → 27–53 once the side walls rendered). All committed on
`main`. The `404` console line during the all-page run is the
`/exhibit/placeholder-1` route itself (intended not-found test), not a broken
asset. Screen brightness checks: corridor ~199 mean (bright paper),
arrival-intro uniform paper (expected).

---

## §C2 — Sawtooth corridor port (user: "use itom assets, but don't let it feel copied")

The itom corridor's signature is its **sawtooth walls**: straight filler runs at
the outer wall line interrupted by 4-unit recessed bays, each with one **angled
wall** that holds the door and **leans toward the camera as you walk past**.
Ported faithfully (MIT) and adapted to Foyer so it reads inspired, not copied:

- **Geometry** (`SawtoothSide` in `walkable-world.tsx`) — direct port of
  `CorridorWalls.jsx` segment walk (high Z → low Z): `filler → angled bay →
  connector`, per bay. `baseRotation = -atan2(dz, dx)` with
  `dx = innerX - outerX`, `dz = -4`; `finalRotation = isLeft ? baseRotation :
  baseRotation + PI`. Foyer dims: `BAY_OUTER_X 3.0`, `BAY_INNER_X 1.6`,
  `BAY_HALF_SPAN 2`, corridor run `fromZ 13 → toZ -13`.
- **Bays follow the exhibits, not hardcoded** — each corridor frame is a bay
  center (`corridorBays` memo built from `corridorLayout` →
  `corridorFrameSpot`, split east/west by position sign). East bays at z=8/4,
  west bays at z=-4/-8 → alternating sides as you walk south, matching itom's
  left/right door rhythm.
- **Frames hang on the angled walls** — `CORRIDOR_FRAMES` moved from the flat
  wall line (x=±2.85, ry=±π/2) onto the bay wall (x=±2.3,
  `ry = ∓atan2(-4,∓1.4) ± π`). Interactive prompts, glance targets and the
  SketchCard reveal all re-derived automatically (SketchCard takes an explicit
  `revealZ` = bay center so the paint-in still fires on approach, not at local z).
- **DoorWallSegment tilt** — each `BayWall` ramps `rotation.y` toward the camera
  over `BAY_TILT {base 0.02 → max 0.2, start 12 → peak 2}`, eased `t*(2-t)`,
  lerp 0.06 (exact itom constants). The frame is a child of the tilting wall, so
  both lean together and stay flush. Only the 4 bay walls animate — the filler
  straight walls and connectors are static.
- **Baseboards** on the straight filler runs only (matches itom — they skip the
  zigzag); the angled bays deliberately have none so the recess reads clean.
- **RevealMaterial brush edge** — adopted itom's squared noise (`res*res`) and
  scale 15 (was 18/unsquared) for a blotchier paint edge; shader cache key
  bumped `p1 → p2` so the new GLSL actually compiles.
- **Procedural doodles** (`CorridorDoodles`) — the itom *technique* of floating
  sketchbook marks around the avatar, regenerated as pure geometry/canvas so no
  art asset is copied: a spinning 4-stroke `DoodleStar`, a dotted `DoodleSquiggle`
  line, a pulsing `DoodleCircle`, and a bobbing `FloatNote` paper card carrying a
  canvas-drawn wobbly star (own drawing via existing `wobblyLine`). Placed around
  the curator in reception.

`RoomBox` gained `omitSides` so the corridor renders floor/ceiling + end walls
only; `SawtoothSide` east+west supply the full side walls. Collision solids are
unchanged (camera max parallax |x|≈1.1 never reaches the recessed 1.6 line).

**Verification (all green):** typecheck clean · lint 0 errors (2 pre-existing
warnings) · tests **54/54** · build clean · live Playwright **10/10** · new
sawtooth screenshot series in `week-07/screenshots/`
(`museum-13-sawtooth-south-mouth` … `museum-26-sawtooth-west-bay-close`, stdev
22–57, no console errors). Committed + pushed on `main`.

## 1. Mission

Build the Week-07 capstone for **Foyer** ("a room for every project you've
shipped" — gallery-style exhibit pages for developers, MERN/Next intern project).
Feature ID **FE-AA2**: the exhibit room renders as a **live 3D space** on capable
devices, with a flat text-walls 2D renderer as fallback.

The user's reference is **itomdev.com** (Tomasz Szmajda's portfolio, FWA Site of
the Day). He explicitly wants a **first-person walkable 3D corridor** in that
style — NOT an orbit/diorama view. The earlier orbit "diorama" v1 was built,
verified, then **rejected** ("menay kaha is trah ka ho yeh kia bana dia
https://itomdev.com").

Locked user decisions:
1. **Direction:** first-person walkable corridor — spawn in the corridor, walk
   along framed exhibit walls, doors open in-world, walk into rooms.
2. **Aesthetic:** sketch/pencil corridor (itom vibe) — hand-drawn paper feel.
3. **Build order:** playable prototype first, polish second — BUT the prototype
   must at least *evoke* the reference. It currently doesn't, which is the
   complaint.

Non-negotiable architecture rule (from the Week-07 plan):
`World Graph → Queries/Placement → Renderer`. The renderer is switchable
2D | 3D; the flat renderer is the accessible fallback. Never break the 2D path.

---

## 2. What itomdev.com actually is (aesthetic target)

Reference site: https://itomdev.com. Observed characteristics to replicate:

- **Sketchbook/paper aesthetic.** Rooms read as dark hand-drawn pencil sketches:
  paper-toned surfaces, ink/pen linework, hatching, rough edges — NOT flat
  plastic colors.
- **First-person walk + mouse look.** You move through a corridor and turn with
  the mouse; rooms sit ahead of you.
- **Doors that reveal.** Doors/panels open with a page-turn / paper-tear / wipe
  effect, revealing the project behind it. The reveal is the signature move.
- **Monochrome, atmospheric.** Near-monochrome palette, moody lighting, vignette,
  focus on line and texture over color.
- **Frames = exhibits.** Exhibit art/typography hangs on the walls like framed
  sketches; clicking interacts.

Implementation directions (choose pragmatically, iterate with user):
- **Procedural paper texture:** generate a small noise/paper `CanvasTexture`
  once and use as map on wall materials (or a simple `ShaderMaterial` that
  mixes a paper noise + hatching lines via UVs).
- **Ink linework:** thin darker wireframe overlay / edge lines on wall edges,
  sketched frame borders (rectangle geometry with jittered corners), doodle
  accents (arrows, underlines, hand-drawn circles).
- **Door reveal:** animate door swing (already done) PLUS a shader/overlay wipe
  on the doorway that reveals the next room (uv-based progress uniform advanced
  while the door opens), or a CSS paper-tear overlay.
- **Intro:** paper-tear / page-flip intro animation over the canvas.
- **Atmosphere:** CSS radial vignette overlay, faint grain, soft fog
  (`<fog>`), desaturated palette.
- **Typography:** handwritten-style webfont for labels/frames (match Foyer's
  existing font stack where possible; troika `Text` supports any loaded font).

**Validation gate:** show the user a short video/screenshot and ask "is this the
itom feel?" before proceeding. He will not accept flat-shaded rooms again.

---

## 3. Current state (verified)

Prototype is **live and working** at `http://localhost:3000/exhibit/e/pos-it`
(server running via `npm run start`).

### Playwright verification — 14/14 PASS
Script: `C:\Users\user\AppData\Local\Temp\opencode\verify-walkable.cjs`
(run with `$env:NODE_PATH="<app>\node_modules"`):

1. Spawns at corridor entrance (z≈9) on default entry.
2. WASD moves north (z decreases) — collision keeps player inside map.
3. Walking north shows prompt `Open — Exhibit Room`.
4. `E` opens the door (`openDoors` contains `door-exhibit-from-corridor`).
5. Player walks through the doorway into the exhibit room (z crosses -13).
6. Title wall shows `Read` prompt.
7. `E` opens inspect dialog; dialog `h4` = the exhibit's real title ("POS-it").
8. `Escape` closes inspect; movement resumes.
9. "View as text walls" drops all canvases (flat renderer).
10. "View the room in 3D" remounts the canvas.
11. No console/page errors.
12. `?via=door-exhibit-from-corridor` spawns near the exhibit door (z≈-9.5).
13. Mobile (coarse pointer) shows the touch hint; canvas renders.
14. `prefers-reduced-motion` → 2D flat fallback (0 canvases).

Screenshots: current set is `week-07/screenshots/museum-01..20` + `route-*`
(36 files, final build). Older v1 diorama shots (`fe-aa2-desktop-room.png`,
`fe-aa2-desktop-inspect-dialog.png`, `fe-aa2-mobile-room.png`) are the REJECTED
orbit view — removed from the folder, ignore them.

### Static checks (all green)
- `npm run typecheck` — clean.
- `npm run lint` — 0 errors; 2 pre-existing warnings (`lib/museum/world.ts:2`
  unused `Wing`, `lib/museum/queries.ts:5` unused `worldIndex`). Do not "fix"
  them gratuitously.
- `npm test` — 41/41 (vitest). Includes 12 capability tests in
  `lib/renderer/capability.test.ts`.
- `npm run build` — clean (all routes listed, dynamic routes server-rendered).

---

## 4. Architecture

```
World Graph (lib/museum/world.ts)
   → Queries (lib/museum/queries.ts: getSurfaceLayout, getVisibleDoors…)
   → Placement (lib/museum/placement.ts: populateCorridor, populateExhibitRoom)
   → Renderer:
        flat  = components/renderer/surface-renderer.tsx (+ entity registry)
        3D    = components/three/walkable-world.tsx (Canvas host + scene)
   chosen by lib/renderer/use-capable-renderer.ts → capability.ts
   seam = components/renderer/exhibit-walls.tsx (dynamic, ssr:false)
```

- The **same `SurfaceLayout[]`** drives both renderers. The walkable scene reads
  corridor layout (`populateCorridor(map,"main-corridor",repo,mockExhibits)`) for
  the corridor frames, and the page's exhibit-room layout (the `layout` prop) for
  the room content.
- The 3D chunk (`three` + fiber + drei + troika) is **lazy-loaded** only after
  capability check passes. 2D-only devices never download it.

### Capability detection (`lib/renderer/capability.ts`)

Types: `RendererMode = "2d" | "3d"`; `RendererQuality = { maxDpr, shadows }`;
`RendererCapability = { mode, reason, quality }`.

`evaluateRendererCapability(input)`:
- No WebGL2 → `2d` (unsupported-webgl)
- `prefersReducedMotion` → `2d` (reduced-motion)
- memory = `deviceMemory ?? (hardwareConcurrency < 4 ? 2 : 4)`; `<2` → `2d` (low-memory)
- else `3d`: `maxDpr = coarsePointer || memory<4 ? 1.5 : 2`, `shadows = !coarsePointer && memory>=4`

`use-capable-renderer.ts`: starts at INITIAL (2d/unsupported) and upgrades after a
`requestAnimationFrame` (no SSR flash).

### World graph (lib/museum/world.ts) — every room/door/anchor

Rooms: `entrance-hall` (Outside), `entrance`, `reception`, `main-corridor`,
`exhibit-room` (template), `collections`, `curator-studio`.

Key doors:
- `door-exhibit-from-corridor` — exhibit-room south ↔ main-corridor north
- `door-corridor-from-reception` — main-corridor south ↔ reception north
- `door-reception-to-corridor` — reception north ↔ main-corridor south (mirror)
- others: entrance hall/entrance, reception→collections (east), reception→studio (west)

`main-corridor` display anchors (capability "display"):
`corridor-exhibit-1` (east/center), `corridor-exhibit-2` (east/right),
`corridor-exhibit-3` (west/center), `corridor-exhibit-4` (west/right).

`exhibit-room` anchors:
`exhibit-title-wall` (north/center, signage), `exhibit-media-wall` (east/center,
projection), `exhibit-artifact-1` (east/right, display+pedestal),
`exhibit-artifact-2` (west/left, display+pedestal), `exhibit-notes` (west/center,
signage).

Helpers: `getRoom`, `getDoor`, `getAnchor`, `getDoorsInRoom`, `getSurfaces`,
`getAnchors`, `getAnchorsByCapability`.

### Placement (`lib/museum/placement.ts`)

- `populateCorridor(map, roomId, repo, exhibits?)` — async; when `exhibits` is
  passed it resolves synchronously (repo unused). Places the first N exhibits on
  the display anchors in order.
- `populateExhibitRoom(map, exhibitId, roomId)` — **signage placements use
  entity ids like `pos-it-title` / `pos-it-notes`**, projection places the
  exhibit id, display/pedestal places the exhibit id. This is why the 3D room
  must not resolve room content by entityId (see Gotchas §7).

### Queries (`lib/museum/queries.ts`)

`getSurfaceLayout(roomId, placementMap): SurfaceLayout[]` where
`SurfaceLayout = { direction, anchors: { anchor, placement }[] }`.
Also `getVisibleDoors`, `getConnectedRooms`, `getCurrentRoom`, `getWing`,
`getFloor`.

### Routes (`lib/museum/navigation-adapter.ts`)

`routeMap`: entrance-hall→`/`, entrance→`/entrance`, reception→`/reception`,
main-corridor→`/gallery`, exhibit-room→`/exhibit/e/[id]`, collections→`/collection`,
curator-studio→`/assistant`. `getExhibitRoute(id)`, `getPortfolioRouteForExhibitId(id)`
(finds the portfolio route containing the project).

---

## 5. World layout (walkable coordinates, north = −Z)

```
reception:  x ∈ [-5, 5],  z ∈ [13, 20]
corridor:   x ∈ [-3, 3],  z ∈ [-13, 13]   ← the walkable spine
exhibit:    x ∈ [-5, 5],  z ∈ [-20, -13]

Doors (gap x ∈ [-0.8, 0.8]):
  door-exhibit-from-corridor   corridor north wall z=-13, hinge x=-0.8, swing -1.9
  door-corridor-from-reception corridor south wall z=+13, hinge x=+0.8, swing +1.9

Player: radius 0.4, eye height 1.7, walk 4.4 u/s, sprint (Shift) 6.6 u/s,
FOV 72, near 0.1, far 60.
Default spawn (0, 1.7, 9) facing north. ?via=door-exhibit-from-corridor → (0, 1.7, -9.5).
```

Corridor frame positions (`corridorFrameSpot(anchorId)` in walkable-model):
`corridor-exhibit-1` → (2.85, 2.25, +4) east-facing (ry=π/2),
`-2` → (2.85, 2.25, +8) east, `-3` → (-2.85, 2.25, -4) west (ry=-π/2),
`-4` → (-2.85, 2.25, -8) west.

Exhibit-room content (`ROOM_SPOTS`, `roomOrigin = (0, -16.5)`):
`exhibit-title-wall` (0, 2.25, -16.8), `exhibit-notes` (-4.7, 2.25, -13.0),
`exhibit-media-wall` (4.7, 2.4, -13.0), `exhibit-artifact-1` (4.5, 0.75, -10.2),
`exhibit-artifact-2` (-4.5, 0.75, -10.2).
Reception signage plaque (0, 2.25, 13.3).

Wall heights 4.2, wall thickness 0.1.

---

## 6. File map — every new/modified file

### New — 3D feature

| File | What it does |
|---|---|
| `components/three/walkable-input.ts` | Module-level input store shared between DOM handlers (outside canvas) and the frame loop (inside). `inputState = { move:{x,z}, look:{dx,dy}, locked, activate, sprint, joystick:{active,x,y,originX,originY} }`. `MOVE_KEYS` (w/a/s/d + arrows + uppercase). `attachWalkableKeyboard`/`detachWalkableKeyboard` (WASD→pressed set, `e`→activate, Shift→sprint, preventDefault on move keys). `attachWalkablePointer(lockTarget)` returns a cleanup; pointer-lock `mousemove` accumulates `look`; click toggles pointer lock (queries `document.querySelector("canvas")`). `createWalkableTouch(container)` → `{ onPointerDown, onPointerMove, onPointerUp, isJoystickActive }` typed with **DOM** `globalThis.PointerEvent` (left 40% = joystick, right side = look; `computeMove()` merges joystick into `move`). `resetWalkableInput()` on unmount. |
| `components/three/walkable-player.tsx` | `WalkablePlayer` — first-person controller. Constants: `PLAYER_RADIUS 0.4, EYE_HEIGHT 1.7, WALK_SPEED 4.4, SPRINT_SPEED 6.6, LOOK_SENSITIVITY 0.0022, PITCH_LIMIT 1.15`. Each frame: look (yaw -= dx·sens, pitch -= dy·sens, clamped, Euler YXZ applied to camera quaternion), move (`forward=(sin yaw, -cos yaw)`, `right=(cos yaw, sin yaw)`, normalized, speed·dt, `resolveCollision`), then proximity (door first: within 3.2 → `Open — {toLabel}`; else nearest item within range + facing dot>0.3 → its prompt). `activate` consumed → open door (add id to `openDoors` ref) or `onInspect(item.inspect)`. Exposes **`window.__foyer`** debug hook `{ camera(), doors() }` — **remove before shipping**. |
| `components/three/walkable-world.tsx` | Scene + Canvas host. `WalkableWorldCanvas` (props = `Omit<WalkableSceneProps,"world">`) builds the world model via `useMemo` (solids + doors + interactives). Scene: `<Canvas dpr=[1,maxDpr] fov 72 near 0.1 far 60 camera.position=spawn>`, clear color `#0b0d1c`, ambient 0.55 + directional + 3 colored point lights (corridor blue, exhibit violet, reception teal). Components: `RoomBox` (floor/ceiling + walls split around gap rects), `Frame` (corridor exhibit: dark box border + troika Text title/tagline), `Plaque` (title/notes/signage: border + Text), `ProjectionScreen` (loads exhibit `media[0].src` via `THREE.TextureLoader` + onLoad setState), `ArtifactPlinth` (box base + emissive octahedron), `DoorPanel` (group at hinge; panel offset ±0.8 by hinge sign; `useFrame` lerp rotation.y toward `swing` when open). Palette: navy corridor `#2b3160` walls, violet room `#262147`, teal reception `#1e3242`, ivory text `#eceaf4`, accent `#3555ff`, gold handle `#c9a227`. |
| `lib/museum/walkable-model.ts` | Pure world model + helpers (no React). Types: `Rect {minX,maxX,minZ,maxZ}`, `InspectSource` (`"title"|"notes"|"artifact"|"projection"|"frame"|"signage"`), `InspectInfo {title,body,source}`, `WorldDoor {id,label,position,hingeX,hingeZ,swing,rect,toLabel}`, `InteractiveItem {id,position,range,prompt,inspect}`, `WalkableWorld {solids,doors,interactives}`. `FOOTPRINTS` (reception/corridor/exhibit rects). `buildSolids()` — wall rects minus door gaps (`DOOR_GAP = {-0.8..0.8, z:0..0}`); walls: north/south split around gap, east/west full; exhibit north solid. `buildDoors()` — the two walkable doors (rect = wallRect spanning the gap + thickness). `CORRIDOR_FRAMES` + `corridorFrameSpot(id)`. `ROOM_SPOTS` + `frameInspect(exhibit)`. `buildInteractives(corridorLayout, roomLayout, exhibits, roomOrigin, currentExhibit?)` — corridor frames (byId by real exhibit id) + room content (falls back to `currentExhibit` because signage entityIds are `pos-it-title`-style) + hardcoded reception signage item. `resolveCollision(x,z,radius,solids)` 2-pass circle-vs-AABB. `nearestItem(x,z,fx,fz,items)` range + facing dot > 0.3. `nearestDoor(x,z,doors)` range 3.2 (no facing check). |
| `components/three/exhibit-room-3d.tsx` | Host component (rewired; v1 orbit code removed). Props: `{ layout: SurfaceLayout[], exhibitId, portfolioRoute?, quality: RendererQuality, arrivedVia?: string|null }`. `arrivedVia === "door-exhibit-from-corridor" ? spawn (-9.5) : spawn (9)`. Builds corridor layout via `populateCorridor(createPlacementMap(),"main-corridor",new MockExhibitRepository(),mockExhibits).then(getSurfaceLayout…)` into state. Wires input effects (keyboard + pointer lock + touch handlers on the container div), `SceneErrorBoundary`, prompt pill overlay, inspect dialog (`SOURCE_LABELS` includes frame/signage), "View as text walls" toggle, mobile hint via lazy `useState(() => matchMedia("(pointer: coarse)").matches)` (repo lint bans setState-in-effect). Player `enabled={!inspect}`; opening inspect exits pointer lock. |
| `components/renderer/exhibit-walls.tsx` | Renderer-selection seam. `useCapableRenderer()`; mode `!=="3d"` → flat `SurfaceRenderer`; else dynamic `<ExhibitRoom3D/>`. Threads `arrivedVia` from the page. `loading:` = "Building the room…" state. |
| `lib/renderer/capability.ts`, `use-capable-renderer.ts`, `capability.test.ts` | Capability detection + 12 unit tests (41/41 total green). |
| `week-07/fe-aa2-perf-note.md` | Performance note (see §8). |
| `week-07/handoff.md` | This document. |
| `week-07/screenshots/museum-*.png`, `route-*.png` | Final-build screenshots (40 files — 25 `museum-*` + 15 `route-*`): every app route + every museum state incl. the sawtooth bay series (`museum-13..26`) + doors + exhibit deep + reception doorway. |

### Modified

| File | Change |
|---|---|
| `app/exhibit/e/[id]/page.tsx` | Passes `arrivedVia={via}` to `ExhibitWalls`. Uses `useDoorEntry()`, `enterRoom`, `populateExhibitRoom`, `getPortfolioRouteForExhibitId`. |
| `components/renderer/world-renderer.tsx` | `WallsOverrideProps` seam (`wallsOverride({layout, entityComponents, doors, entrySurface})`), exit links via `getRoute`. |
| `app/README.md` | Added "Exhibit room in 3D (Week 7)" bullet + "Renderer (2D \| 3D)" section. |
| `package.json` / `package-lock.json` | Added three, @react-three/fiber, @react-three/drei, @types/three. |

### Abandoned (do NOT resurrect for the corridor)
- `components/three/room-scene-3d.tsx` — v1 orbit diorama (`Room3DCanvas`, `View`,
  `InspectInfo` origin). Some reusable ideas: camera rig, `maxPolarAngle: 1.5→1.57`
  fix, `arrived=false` initial. Deleted logic (not the file) from exhibit-room-3d.

---

## 7. Gotchas / constraints (learned the hard way — respect these)

1. **FPS-bound movement.** `dt` MUST NOT be clamped to 0.05. SwiftShader (software
   WebGL) runs this scene slowly; the small frame-time clamp capped walk speed to
   ~1 u/s. Now `const dt = Math.min(delta, 0.2)`. Keep the clamp ≥0.2 or remove it.
2. **Mount latency 6–8 s on SwiftShader** (shader compile + troika font setup). Any
   Playwright assertion must wait for `window.__foyer` or the canvas and then
   re-poll; the verification script uses a `waitFor` helper with 25–30 s timeouts.
3. **Lazy 3D chunk ≈ 995 KB raw** (~276 KB gzip / 227 KB brotli, v1 measured). Loaded
   only after capability check passes, via `next/dynamic` + `ssr:false` in
   `exhibit-walls.tsx`. Keep the 3D stack lazy.
4. **Repo lint bans setState-in-effect** (`react-hooks/set-state-in-effect`) and
   **ref access during render** (`react-hooks/refs`). Initialize `matchMedia`
   state lazily in `useState`, attach event handlers inside effects, never touch
   `ref.current` in render (e.g. don't pass `containerRef.current` into a
   function called during render).
5. **Room content must fall back to `currentExhibit`.** Signage placements use
   entity ids like `pos-it-title`, so resolving room interactives by
   `byId(entityId)` yields "Title wall" instead of "POS-it". Corridor frames use
   real exhibit ids and resolve fine by id.
6. **Pointer-lock click handler** uses `document.querySelector("canvas")` — fragile
   if multiple canvases exist; fine now. The prompt pill stops propagation so
   tapping it doesn't toggle lock.
7. **Playwright needs** `--enable-unsafe-swiftshader --use-angle=swiftshader-webgl`
   and `NODE_PATH=<app>/node_modules` (script lives in temp dir). Use the pinned
   chromium at `C:\Users\user\AppData\Local\ms-playwright\chromium-1237\chrome-win64\chrome.exe`.
8. **Windows server management:** check `Get-NetTCPConnection -LocalPort 3000`,
   kill with `Stop-Process`, start with
   `Start-Process cmd /c "npm run start > .next-server.log 2>&1"` (hidden).
   Delete `.next` on stale-cache build errors.
9. **troika `<Text>` is heavy** — several instances is fine, dozens is not. The
   scene currently has ~10. Keep the count down; batch/instancing if adding more.
10. **`touch-none` + `select-none` on the container** is required for the joystick
    (prevents scroll/text selection while dragging).
11. **Doors release their collision rect the moment they open** (player walks
    through while it swings) — that's intended; `openDoors` ref drives both
    collision and `DoorPanel` animation.
12. **`?via=` filtering:** the exhibit page only honors
    `via=door-exhibit-from-corridor` (other via fall back to default spawn).
13. **Chunk drift:** the build chunk name/hash changes every build; the size
    estimate (995 KB raw) is approximate. Re-measure after significant changes
    via the largest `.next/static/chunks/*.js`.

---

## 8. Performance facts (measured)

- Render loop 46.7 fps on SwiftShader (software); real GPUs vsync 60+.
- Canvas buffer 894×520 @ DPR 1 (v1); quality caps DPR at 1.5–2.
- Scene is fully procedural — no GLTF/external models; ~480 triangles (v1 room).
- Quality tiers (capability.ts): desktop ≥4GB WebGL2 → maxDpr 2 + shadows; coarse
  pointer → 1.5, no shadows; memory 2–3 → 1.5; no WebGL2 / reduced-motion / <2GB → 2D.
- 2D-only devices never download the 3D chunk — the exhibit route's JS footprint
  is unchanged for them.

---

## 9. Interaction model (as built)

- **Desktop:** click canvas → pointer lock (mouse look). WASD/arrows move, Shift
  sprints, `E` activates. `Esc` releases lock. Bottom-center prompt pill shows the
  nearest interaction (`Open — X` / `Read` / `Inspect …`) with an `E` hint;
  clicking the pill also activates.
- **Touch:** left 40% of viewport = virtual joystick (walk), right side = drag to
  look. Pill shows `Tap` hint. No visual joystick drawn yet (phase-2 item).
- **Inspect dialog:** real `<div role="dialog" aria-modal="false">`, `SOURCE_LABELS`
  label the source (title wall / curator's note / artifact / media projection /
  corridor frame / wayfinding). Opening it exits pointer lock; `Escape`/Close
  dismisses; player disabled while open.
- **Doors:** `E`/tap adds id to `openDoors` → collision released + panel swings
  (lerp to ±1.9). Rooms connected in-world; **no router navigation for doors**
  (that was v1's portal behavior).
- **Toggle:** "View as text walls" → flat `SurfaceRenderer` (fully keyboard/AT
  accessible); back button remounts the 3D scene.
- **`window.__foyer`** debug hook: `{ camera():{x,y,z,yaw}, doors():string[] }` —
  used by Playwright; remove before shipping.

---

## 10. Phase-2 polish roadmap (ordered by user priority)

1. **THE ITOM LOOK (do first).** Replace flat materials with the sketch/paper
   aesthetic per §2. Start cheap: procedural paper `CanvasTexture` + desaturated
   palette + vignette overlay + fog; then line/hatch shaders; then door wipe/reveal
   shader; then paper-tear intro. **Show the user, get sign-off.**
2. **Corridor content polish:** real frame border styling with sketched corners,
   door nameplates, wall trim, floor skirt lines.
3. **Door reveal juice:** wipe/paint-reveal on the doorway as the door swings.
4. **Mobile:** draw joystick base/knob, tap-vs-drag disambiguation, landscape hint.
5. **Perf:** re-measure after aesthetic work (text count, draw calls, chunk size).
6. **Unit tests for `walkable-model.ts`** — buildSolids wall/gap output,
   resolveCollision edge cases, nearestItem facing rule, buildInteractives
   content + `currentExhibit` fallback. (capability has tests; model has none.)
7. **Remove `window.__foyer`** debug hook before shipping.
8. **FE-10 remediation** — only contrast-token a11y failures on 6 baseline pages;
   write `AUDIT.md`; Survive-the-Crit packet + Week-07 submission mirroring
   `week-06/submission-summary.md` format; commit + deploy + live verify.
9. **Phone/reviewer feedback:** must come from the user; do NOT fabricate.

---

## 11. Repo, commands, environment

- Repo: `https://github.com/ZAYNINFINITY/flyrank-ai-internship.git`, branch `main`.
  Everything is **uncommitted** (see `git status` in `week-03/`): modified
  `app/README.md`, `app/app/exhibit/e/[id]/page.tsx`,
  `app/components/renderer/world-renderer.tsx`, `app/package*.json`; untracked
  `app/components/renderer/exhibit-walls.tsx`, `app/components/three/`,
  `app/lib/museum/walkable-model.ts`, `app/lib/renderer/`, `week-07/`.
- Commands (run inside `week-03/app`):
  - `npm run typecheck` · `npm run lint` · `npm test` (41/41) ·
    `npm run build` · `npm run start` (port 3000).
  - Verify: `$env:NODE_PATH="<app>\node_modules"; node C:\Users\user\AppData\Local\Temp\opencode\verify-walkable.cjs`
- Versions: Next 16.2.11, React 19.2.4, three 0.185.1, @react-three/fiber 9.7.0,
  drei 10.7.8, TypeScript 5, Vitest 4.1.10, @playwright/test 1.62.1, ESLint 9,
  Tailwind 4, Zod 4. Scripts: `dev/build/start/lint/typecheck/test/test:watch/test:e2e/test:e2e:ui`.
- Working conventions: pure functions, immutability, comments explain WHY only,
  no magic numbers, desi co-founder energy in communication, don't be a yes-man,
  reference his ongoing projects. Default workdir:
  `D:\WORK - ARCHIVE\IMPORTANT CODING DATA AND PROJECTS\PROJECTS` (this task lives
  in the INTERNSHIP folder instead — keep it there).
- Prior week conventions: submission packets in `week-05/` and `week-06/`
  (`submission-summary.md`), lighthouse baseline in `%TEMP%\opencode\lh-baseline\`.

---

## §D — Visual Polish Plan: Doors, Ambience, Curator (August 18, 2026)

> **STATUS: PLANNED — not yet executed.**
> This section contains a complete, line-by-line execution plan for the three
> visual issues identified during user review: compressed doors, over-lit
> ambience, and the curator being a portrait frame instead of a character.
> Reference site: itomdev.com. Curator asset: `C:\Users\user\Downloads\curator.png`.

### §D1 — DOORS: Make Them Real

**Root cause:** Both `DoorPanel` (interior) and `EntranceDoor` (facade) use
`planeGeometry` — zero-thickness flat planes that read as cardboard.

**File:** `components/three/walkable-world.tsx`

#### DoorPanel (lines 875–918)

| What | Current | New |
|------|---------|-----|
| Geometry | `planeGeometry [1.6, 2.4]` | `boxGeometry [1.5, 2.35, 0.06]` |
| Hinge offset | 0.8 | 0.75 |
| Swing lerp | `delta * 6` | `delta * 4` (heavier feel) |
| Handle | None | Cylinder [0.015 radius, 0.12 length] + Sphere [0.022] at handle pos |

Replace lines 894–903 with boxGeometry + handle group. Handle position:
`panelOffset > 0 ? panelOffset + 0.12 : panelOffset - 0.12` at y=1.0, z=0.04.
Handle color: `PALETTE.gold`, metalness 0.3, roughness 0.6.

#### EntranceDoor (lines 1107–1140)

Same geometry upgrade per leaf:
- Each leaf: `boxGeometry [0.75, 2.35, 0.06]`
- Handle at x=±0.38 (inner edge), y=1.0
- Swing: `angle = swing.current * 1.57` (was 1.7)
- Add threshold strip: `boxGeometry [1.8, 0.03, 0.12]` at y=0.015

#### walkable-model.ts swing angles

| Door | Current | New |
|------|---------|-----|
| `door-exhibit-from-corridor` | `swing: -1.9` | `swing: -1.57` |
| `door-corridor-from-reception` | `swing: 1.9` | `swing: 1.57` |

### §D2 — AMBIENCE: Kill the Over-Lighting

**Root cause:** 18+ light sources with ambient at 1.7 flattens shadows. All
lights gold `#f0cf8b` — monochromatic warmth kills depth. Vignette 0.18 is
6× heavier than itom's ~0.03.

**File:** `components/three/walkable-world.tsx`

#### Global lights (lines 1281–1288) — replace entirely:

```tsx
<fog attach="fog" args={[PALETTE.paper, 18, 55]} />
<ambientLight intensity={0.55} />
<hemisphereLight args={["#f0ede6", "#d2c4a8", 0.75]} />
<directionalLight position={[4, 8, 3]} intensity={1.0} color="#fff6df" />
<pointLight position={[0, 3.2, 0]} intensity={3.0} distance={20} decay={2} color="#f0cf8b" />
<pointLight position={[0, 3.2, -14]} intensity={2.5} distance={18} decay={2} color="#e8e4dc" />
```

**Removed:** Third global point light (z=16.5, intensity 5).
**Changed:** fog start 22→18, end 70→55. Ambient 1.7→0.55. Hemi 1.2→0.75.
Point: 6→3.0 and 5→2.5. Added cool `#e8e4dc` on second point light.

#### LinearLight (line 746):

`pointLight intensity={1.6}` (was 2.2)

#### MuseumLighting (lines 751–764) — reduce:

- Remove LinearLight at z=12.6 (keep 3 of 4)
- Remove all 3 west reception point lights (keep 3 of 6)
- Reception point intensity: 2.2→1.8

#### CSS Vignette (exhibit-room-3d.tsx line 237):

```
transparent_55%→65%, opacity 0.18→0.06
```

#### Film grain overlay — ADD after vignette div (after line 239):

```tsx
<div
  className="pointer-events-none absolute inset-0 z-[44] opacity-[0.035]"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
    mixBlendMode: "multiply",
  }}
  aria-hidden="true"
/>
```

### §D3 — CURATOR: Billboard Sprite from Provided Image

**Root cause:** Current curator is a framed `avatar.png` portrait — a 2D
billboard frame that bobs up and down. The handoff describes "ink humanoid
silhouette" but the code is a painting. User provided `curator.png` of a
standing figure.

**Asset:** Copy `C:\Users\user\Downloads\curator.png` to
`public/images/curator.png`.

**Replace CuratorFigure (lines 1142–1211) entirely:**

```tsx
function CuratorFigure({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load("/images/curator.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      if (alive) setTexture(tex);
    });
    return () => { alive = false; };
  }, []);

  useFrame(({ camera, clock }) => {
    if (!meshRef.current) return;
    meshRef.current.quaternion.copy(camera.quaternion);
    meshRef.current.position.set(
      position[0],
      position[1] + 1.4 + Math.sin(clock.elapsedTime * 0.8) * 0.04,
      position[2]
    );
  });

  if (!texture) return null;

  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.08} />
      </mesh>
      <mesh ref={meshRef} position={[0, 1.4, 0]}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Text
        position={[0, -0.1, 0.1]}
        fontSize={0.12}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
      >
        Curator
      </Text>
    </group>
  );
}
```

**Key techniques:**
- `quaternion.copy(camera.quaternion)` — billboard always faces camera
- `alphaTest: 0.1` — transparent background pixels become invisible
- `depthWrite: false` — prevents z-fighting with wall behind
- `planeGeometry [1.8, 2.8]` — tall standing proportions
- Shadow disc on floor for grounding
- Gentle bob via `sin(time * 0.8) * 0.04`
- Loads `/images/curator.png` (NOT avatar.png)

**If image has opaque background:** Either preprocess to add alpha channel,
or replace `alphaTest` approach with a custom shader that discards white/near-white
pixels: `if (all(greaterThan(color.rgb, vec3(0.95)))) discard;`

### §D4 — PAPER TEAR INTRO (Phase 2 — Optional, signature itom effect)

**Current:** Simple 2.8s CSS fade overlay (`fade-out_2.8s_ease_forwards`).
**New:** Two paper halves that rip apart, revealing the 3D corridor.

**Replace arrival intro (exhibit-room-3d.tsx lines 221–233) with:**

```tsx
{arrivalIntro && sceneReady && (
  <div className="pointer-events-none absolute inset-0 z-50" aria-hidden="true">
    <div
      className="absolute inset-0 origin-left motion-safe:animate-[tear-left_1.5s_ease-in-out_forwards]"
      style={{ backgroundColor: "#efe9da" }}
    >
      <div className="absolute right-0 top-0 h-full w-8"
           style={{ background: "linear-gradient(to left, transparent, rgba(180,170,155,0.3))" }} />
    </div>
    <div
      className="absolute inset-0 origin-right motion-safe:animate-[tear-right_1.5s_ease-in-out_forwards]"
      style={{ backgroundColor: "#efe9da" }}
    >
      <div className="absolute left-0 top-0 h-full w-8"
           style={{ background: "linear-gradient(to right, transparent, rgba(180,170,155,0.3))" }} />
    </div>
    <div className="absolute left-1/2 top-0 h-full w-12 -translate-x-1/2 motion-safe:animate-[fade-out_0.5s_ease_1.2s_forwards]"
         style={{ background: "repeating-linear-gradient(to bottom, transparent 0px, rgba(160,150,130,0.2) 2px, transparent 4px)" }} />
    <div className="absolute inset-0 flex items-center justify-center motion-safe:animate-[fade-out_0.8s_ease_0.8s_forwards]">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#6f6c62]">Approaching</p>
        <p className="mt-2 font-heading text-xl tracking-tight text-[#2a2a30]">Foyer Museum</p>
      </div>
    </div>
  </div>
)}
```

**Add CSS keyframes (tailwind config or global CSS):**

```css
@keyframes tear-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-105%); }
}
@keyframes tear-right {
  0%   { transform: translateX(0); }
  100% { transform: translateX(105%); }
}
```

### §D5 — FILES CHANGED SUMMARY

| File | Changes | Lines Affected |
|------|---------|---------------|
| `components/three/walkable-world.tsx` | Doors (BoxGeometry + handles), lighting overhaul, curator sprite | ~746, 751–764, 875–918, 1107–1211, 1281–1288 |
| `components/three/exhibit-room-3d.tsx` | Vignette lighten, grain overlay, paper tear intro | ~221–239 |
| `lib/museum/walkable-model.ts` | Door swing angles (1.9→1.57) | ~118, ~125 |
| `public/images/curator.png` | NEW — curator standing figure asset | N/A |

### §D6 — VERIFICATION AFTER EACH FIX

1. `npm run typecheck` — must pass
2. `npm run lint` — 0 new errors
3. `npm run build` — clean
4. Visual check at `localhost:3000` — corridor, doors, curator, ambience
5. Mobile check — touch navigation still works
6. Performance — FPS stays above 30 on SwiftShader
