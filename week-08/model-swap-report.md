# Claude Handoff — Full Context (August 23, 2026)

## Project Overview
**Foyer** — open digital museum for developers. Live at `plinth-cyan.vercel.app`. Repo: `ZAYNINFINITY/flyrank-ai-internship`. 3D museum built with React Three Fiber + Three.js. AI curator via OpenRouter (Gemini 2.5 Flash Lite). 74/74 tests pass.

## What Was Done Today

### 1. FE-AA3 Shader Hero (DONE)
**File:** `week-03/app/app/shader-hero/page.tsx`
- New route `/shader-hero` — fullscreen GLSL fragment shader (aurora/nebula effect)
- Uses all 3 uniforms: `u_time`, `u_resolution`, `u_mouse`
- DPR capped at 1.5, pauses when tab hidden, reduced-motion → static gradient
- Zero impact on existing pages

### 2. Curator: Billboard sprite → 3D OBJ model (DONE, may need tuning)
**File:** `week-03/app/components/three/walkable-world.tsx` — `CuratorFigure` component

**Before:** Flat 2D billboard sprite (`/images/curator.png`)
**After:** Lazy-loaded OBJ model with diffuse texture, hardcoded scale

**Model files:**
- OBJ: `public/models/curator/rp_dennis_posed_004_30k.OBJ` (2.67MB, ~15K vertices)
- Diffuse: `public/models/curator/tex/rp_dennis_posed_004_dif.jpg` (4.91MB)
- No MTL — material created manually

**Raw OBJ bounding box:** X: ±23, Y: -1.11 to 186, Z: ±29
**Scale:** `CURATOR_SCALE = 0.00908` (1.7 / 187.14)
**Y offset:** `CURATOR_Y_OFFSET = 0.01` (feet to ground)

**Code pattern:** Singleton promise cache → load once → clone per instance → fallback to capsule silhouette on failure. Same pattern as existing `Tree` component.

**Position:** `[1.8, 0, 18.4]`

**Potential issues to check:**
- Model might face wrong direction (try `obj.rotation.y = Math.PI`)
- Texture might not map correctly (try solid color material to isolate)
- Scale might still be off (log bounding box to verify)

### 3. Reception Desk: Procedural boxes → OBJ model (DONE, may need tuning)
**File:** `week-03/app/components/three/walkable-world.tsx` — `ReceptionDesk` component

**Before:** Procedural box geometry
**After:** Lazy-loaded OBJ with MTL, hardcoded scale

**Model files:**
- OBJ: `public/models/reception desk/ReceptionDesk-1-OBJ/Reception_Desk_1_obj.obj` (183KB, ~1.5K vertices)
- MTL: `public/models/reception desk/ReceptionDesk-1-OBJ/Reception_Desk_1_obj.mtl` (0.5KB)

**Raw OBJ bounding box:** X: ±416, Y: 0–43.5, Z: ±279
**Scale:** `DESK_SCALE = 0.0207` (0.9 / 43.5)

**Position:** `[3.3, 0, 19.2]`, `ry=0`

**Fallback:** Procedural desk (box + countertop + "FOYER" text) if OBJ fails

### 4. Curator System Prompt (DONE)
**File:** `week-03/app/lib/ai/prompts.ts`

Full curator persona: warm, knowledgeable, short answers, uses exhibitLookup tool, stays in character, knows boundaries. Was 3 lines, now ~25 lines of real personality.

### 5. Speech Bubble Replaces Chatbox (PARTIALLY DONE — needs extension)
**New file:** `week-03/app/components/ai/curator-speech-bubble.tsx`
**Modified:** `week-03/app/components/three/exhibit-room-3d.tsx`

**Current state:** Only the curator uses the speech bubble. The receptionist and cat don't have speech bubbles yet.

**What exists:** `CuratorSpeechBubble` component — greeting + input field + streaming AI responses. Wired for `source === "curator"` in exhibit-room-3d.tsx.

**What's needed:** Extend this to receptionist and cat. The component should accept a `systemPrompt` prop so each character has different AI personality. See "URGENT" section below.

### 6. Claude's Earlier Changes (UNCOMMITTED, in working tree)
These were made by a previous Claude session:

**`museum-cat.tsx`:** Higher subdivision, superellipse rounding, better colors
**`entrance-environment.tsx`:** Rain wind, snow vx fix, leaf per-instance color, blossom glow
**`walkable-world.tsx`:** Ceiling cap, MuseumClock, ReceptionDesk (now OBJ), removed old tree refs

## Key Architecture

| File | What it does |
|---|---|
| `components/three/walkable-world.tsx` | Main3D scene (~3000 lines). All models, doors, interactives |
| `components/three/exhibit-room-3d.tsx` | Orchestrates 3D + UI. Routes curator click → speech bubble |
| `components/three/walkable-player.tsx` | Camera, door triggers, inspect detection, click handling |
| `components/three/entrance-environment.tsx` | Day/night + seasonal particles |
| `components/three/museum-cat.tsx` | Procedural animated cat |
| `components/ai/curator-speech-bubble.tsx` | **NEW** — speech bubble UI for curator chat |
| `components/ai/chat-panel.tsx` | Old chat UI (still used on /assistant page) |
| `lib/ai/prompts.ts` | System prompt (curator persona) |
| `lib/ai/tools/exhibit.ts` | exhibitLookup tool |
| `lib/ai/config.ts` | Model config (Gemini 2.5 Flash Lite) |
| `lib/museum/walkable-model.ts` | World model, interactives, curator presence |
| `app/api/chat/route.ts` | OpenRouter streaming + rate limiting |

## Interaction System (Works, No Changes Needed)
- **Doors:** auto-open on approach
- **Objects:** direct click on hitboxes → inspect card
- **Curator:** click → speech bubble (not inspect card)
- **Keyboard:** `E` key activates nearest object

## URGENT — What Needs Fixing

### 1. Orange/distortion artifact on the floor
There's an orange-colored thing visible on the floor in the museum scene. This is likely a material or texture issue — possibly from the OBJ models loading with wrong materials, or from the procedural floor textures conflicting. Check:
- The reception desk OBJ MTL might be applying wrong materials to other meshes
- The floor PBR textures (`floor-textures/`) might be conflicting
- The plank model (`planks.obj`) materials might be overriding scene materials
- Could be the reception desk's gold bell or name plate material bleeding

### 2. Curator model distortion
The curator OBJ model (`rp_dennis_posed_004_30k.OBJ`) is showing distortion. The hardcoded scale is `0.00908` with Y offset `0.01`. Check:
- Model might face wrong direction — try `obj.rotation.y = Math.PI`
- Texture might not map — try solid color material first to isolate
- The OBJ has no MTL file — material is created manually with MeshStandardMaterial
- Log the bounding box before/after scaling to verify math
- The clone() might not preserve transforms correctly — try applying transforms to the clone instead

### 3. Reception desk distortion
The reception desk OBJ (`Reception_Desk_1_obj.obj`) might also be distorted. Scale is `0.0207`. Same debugging approach as curator.

### 4. ALL 3 characters need speech bubbles with AI
Currently only the curator has a speech bubble. ALL THREE characters need to be interactive AI characters:

**Curator (deep knowledge):**
- Already has speech bubble (`curator-speech-bubble.tsx`)
- Uses exhibitLookup tool
- Answers questions about projects, architecture, technology
- Position: `[1.8, 0, 18.4]`

**Receptionist (basic queries):**
- Needs speech bubble too
- Handles: directions, museum hours, simple info, "where is X?"
- Does NOT need exhibitLookup — just simple responses
- Model: `public/models/reception-female/rp_mei_posed_001_30k.obj` (30K vertices) — load same pattern as curator
- Has diffuse texture: `public/models/reception-female/tex/rp_mei_posed_001_dif_2k.jpg`
- Position: near the desk `[3.3, 0, 19.2]` area
- Needs its own system prompt (friendly, helpful, knows the museum layout)

**Cat (click reaction):**
- Already has procedural model (`museum-cat.tsx`)
- When clicked, should show a speech bubble with a fun personality
- NOT a chat — just a reaction. Examples: "Meow!", "Welcome to Foyer!", "The curator is over there", or a cat fact
- Should use AI but with a very short, playful system prompt
- Position: somewhere in the museum (check walkable-model.ts for cat interactive)

**The speech bubble component (`curator-speech-bubble.tsx`) should be reused for all 3** — just pass different system prompts and titles.

### What Claude Should Do:
1. Fix the orange floor distortion — check materials/textures
2. Fix curator model — check rotation, scale, texture
3. Fix reception desk model — check scale, materials
4. Load receptionist OBJ model (same pattern as curator)
5. Create cat click → speech bubble interaction
6. Make the speech bubble accept a custom system prompt so all 3 characters can use it
7. Write distinct system prompts for each character
8. Test everything — 74/74 tests must still pass
9. Visual check — open localhost:3000, walk through museum, click all 3 characters

### bench-female Models
16MB of seated figure models (`public/models/bench-female/`). Either use as visitors or delete.

## Unused Model Files (126MB)
| Folder | Size | Status |
|---|---|---|
| `bench-female/` | 16MB | Unused — use or delete |
| `cat/` | 6MB | Unused — procedural cat used instead |
| `curator/` | 56MB | Only30k OBJ + diffuse used. Delete 100k, .3dm, vray, spec maps |
| `reception desk/` | 0.2MB | Now used ✅ |
| `reception-female/` | 48MB | Unused — could load for receptionist |

**Curator folder cleanup:** Only keep `rp_dennis_posed_004_30k.OBJ` and `tex/rp_dennis_posed_004_dif.jpg`. Delete everything else (~50MB saved).

## Git Status
- Branch protection enabled on `main` (CI required)
- To push: disable → push → re-enable
- Claude's earlier changes + today's changes are all uncommitted in working tree
- `week-08/model-swap-report.md` exists (this file will replace it)
