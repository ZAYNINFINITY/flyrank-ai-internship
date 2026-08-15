# Week 07 · FE-AA2 — Walkable 3D Corridor: Handoff (very detailed)

> **READ FIRST — USER FEEDBACK (critical context):**
> The current prototype is functionally verified (14/14 Playwright checks) but the
> user rejected it visually: *"well i said i want like this itomdev what u gave is
> totally rubbish and not even close to what i said"*. The mechanics work; the
> **aesthetic is wrong**. The deliverable currently looks like flat navy-blue 3D
> boxes with generic white text — it does NOT evoke itomdev.com's sketchy,
> hand-drawn, atmospheric corridor. The next session's TOP priority is making it
> actually look and feel like itomdev. Do NOT defer the visual identity again.
>
> App repo root: `D:\WORK - ARCHIVE\IMPORTANT CODING DATA AND PROJECTS\INTERNSHIP\flyrank ai\week-03\app`
> Everything below is accurate as of the last verified run.

---

## 1. Mission

Build the Week-07 capstone for **Plinth** ("a room for every project you've
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
- **Typography:** handwritten-style webfont for labels/frames (match Plinth's
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

Screenshots (fresh, from the walkable prototype):
`week-07/screenshots/fe-aa2-walk-corridor.png`,
`fe-aa2-walk-door-open.png`, `fe-aa2-walk-inspect.png`, `fe-aa2-walk-mobile.png`.
Older v1 diorama shots (`fe-aa2-desktop-room.png`, `fe-aa2-desktop-inspect-dialog.png`,
`fe-aa2-mobile-room.png`) are the REJECTED orbit view — ignore them.

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
| `components/three/walkable-player.tsx` | `WalkablePlayer` — first-person controller. Constants: `PLAYER_RADIUS 0.4, EYE_HEIGHT 1.7, WALK_SPEED 4.4, SPRINT_SPEED 6.6, LOOK_SENSITIVITY 0.0022, PITCH_LIMIT 1.15`. Each frame: look (yaw -= dx·sens, pitch -= dy·sens, clamped, Euler YXZ applied to camera quaternion), move (`forward=(sin yaw, -cos yaw)`, `right=(cos yaw, sin yaw)`, normalized, speed·dt, `resolveCollision`), then proximity (door first: within 3.2 → `Open — {toLabel}`; else nearest item within range + facing dot>0.3 → its prompt). `activate` consumed → open door (add id to `openDoors` ref) or `onInspect(item.inspect)`. Exposes **`window.__plinth`** debug hook `{ camera(), doors() }` — **remove before shipping**. |
| `components/three/walkable-world.tsx` | Scene + Canvas host. `WalkableWorldCanvas` (props = `Omit<WalkableSceneProps,"world">`) builds the world model via `useMemo` (solids + doors + interactives). Scene: `<Canvas dpr=[1,maxDpr] fov 72 near 0.1 far 60 camera.position=spawn>`, clear color `#0b0d1c`, ambient 0.55 + directional + 3 colored point lights (corridor blue, exhibit violet, reception teal). Components: `RoomBox` (floor/ceiling + walls split around gap rects), `Frame` (corridor exhibit: dark box border + troika Text title/tagline), `Plaque` (title/notes/signage: border + Text), `ProjectionScreen` (loads exhibit `media[0].src` via `THREE.TextureLoader` + onLoad setState), `ArtifactPlinth` (box base + emissive octahedron), `DoorPanel` (group at hinge; panel offset ±0.8 by hinge sign; `useFrame` lerp rotation.y toward `swing` when open). Palette: navy corridor `#2b3160` walls, violet room `#262147`, teal reception `#1e3242`, ivory text `#eceaf4`, accent `#3555ff`, gold handle `#c9a227`. |
| `lib/museum/walkable-model.ts` | Pure world model + helpers (no React). Types: `Rect {minX,maxX,minZ,maxZ}`, `InspectSource` (`"title"|"notes"|"artifact"|"projection"|"frame"|"signage"`), `InspectInfo {title,body,source}`, `WorldDoor {id,label,position,hingeX,hingeZ,swing,rect,toLabel}`, `InteractiveItem {id,position,range,prompt,inspect}`, `WalkableWorld {solids,doors,interactives}`. `FOOTPRINTS` (reception/corridor/exhibit rects). `buildSolids()` — wall rects minus door gaps (`DOOR_GAP = {-0.8..0.8, z:0..0}`); walls: north/south split around gap, east/west full; exhibit north solid. `buildDoors()` — the two walkable doors (rect = wallRect spanning the gap + thickness). `CORRIDOR_FRAMES` + `corridorFrameSpot(id)`. `ROOM_SPOTS` + `frameInspect(exhibit)`. `buildInteractives(corridorLayout, roomLayout, exhibits, roomOrigin, currentExhibit?)` — corridor frames (byId by real exhibit id) + room content (falls back to `currentExhibit` because signage entityIds are `pos-it-title`-style) + hardcoded reception signage item. `resolveCollision(x,z,radius,solids)` 2-pass circle-vs-AABB. `nearestItem(x,z,fx,fz,items)` range + facing dot > 0.3. `nearestDoor(x,z,doors)` range 3.2 (no facing check). |
| `components/three/exhibit-room-3d.tsx` | Host component (rewired; v1 orbit code removed). Props: `{ layout: SurfaceLayout[], exhibitId, portfolioRoute?, quality: RendererQuality, arrivedVia?: string|null }`. `arrivedVia === "door-exhibit-from-corridor" ? spawn (-9.5) : spawn (9)`. Builds corridor layout via `populateCorridor(createPlacementMap(),"main-corridor",new MockExhibitRepository(),mockExhibits).then(getSurfaceLayout…)` into state. Wires input effects (keyboard + pointer lock + touch handlers on the container div), `SceneErrorBoundary`, prompt pill overlay, inspect dialog (`SOURCE_LABELS` includes frame/signage), "View as text walls" toggle, mobile hint via lazy `useState(() => matchMedia("(pointer: coarse)").matches)` (repo lint bans setState-in-effect). Player `enabled={!inspect}`; opening inspect exits pointer lock. |
| `components/renderer/exhibit-walls.tsx` | Renderer-selection seam. `useCapableRenderer()`; mode `!=="3d"` → flat `SurfaceRenderer`; else dynamic `<ExhibitRoom3D/>`. Threads `arrivedVia` from the page. `loading:` = "Building the room…" state. |
| `lib/renderer/capability.ts`, `use-capable-renderer.ts`, `capability.test.ts` | Capability detection + 12 unit tests (41/41 total green). |
| `week-07/fe-aa2-perf-note.md` | Performance note (see §8). |
| `week-07/handoff.md` | This document. |
| `week-07/screenshots/fe-aa2-walk-*.png` | Fresh prototype screenshots. |

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
   Playwright assertion must wait for `window.__plinth` or the canvas and then
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
- **`window.__plinth`** debug hook: `{ camera():{x,y,z,yaw}, doors():string[] }` —
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
7. **Remove `window.__plinth`** debug hook before shipping.
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
