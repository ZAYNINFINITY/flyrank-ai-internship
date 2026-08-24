# Copilot Handoff

**Agent:** GitHub Copilot
**Timestamp:** 2026-08-24 05:02:28 +05:00
**Repository:** Foyer museum app

## Scope

This handoff records the work completed by GitHub Copilot in this session. No Claude handoff file was found in the repository or its immediate parent, and no Claude file was created or modified.

## Completed Work

### Walkable 3D scene

- Corrected room floor and ceiling placement in `components/three/walkable-world.tsx`.
  - Room surfaces now use each footprint's actual Z center instead of all rendering at world Z=0.
  - This fixed uncovered blue/white floor areas in reception and exhibit rooms.
- Unified entrance and reception floors with the corridor floor definition.
- Removed the separate approach floor overlay that caused mismatched floor appearance.
- Kept the supplied brown/red corridor floor material using world-scaled texture repeats.
- Added anisotropic filtering to floor textures.
- Removed the extra floor color multiplication that amplified the orange cast.
- The floor material is rendered consistently without warm lighting changing its base appearance.

### Reception

- Moved the reception placement to the left side near the entrance.
- Kept the receptionist behind the counter and synchronized her interaction hotspot with her rendered position.
- Removed the problematic reception desk OBJ from the active render path.
  - Its exported MTL contained flat placeholder colors, including the visible green material.
  - Its raw dimensions caused it to become oversized when normalized by height.
- Replaced it with a bounded procedural wooden counter.
- Added the `FOYER` label to the front of the counter.
- Reduced warm fill lighting to lessen the orange scene cast.
- Removed the entrance cat from the rendered scene.

### Camera and interaction focus

- Corrected the character/exhibit focus yaw and pitch signs in `components/three/walkable-player.tsx`.
- Added focus angle limits so selecting a wall exhibit or character does not rotate the camera into the wall.
- Updated the reception glance target to follow the moved left-side reception position.
- Added project-switch remount behavior so changing the showcase project resets stale camera state.

### AI characters

- Curator remains the main AI guide for exhibits, technologies, projects, and museum questions.
- Receptionist prompt now handles:
  - Entry and wayfinding
  - Museum sections and developer categories
  - Current-session visitor context
  - Directing detailed project questions to the curator
- Removed the stale cat interaction hotspot after removing the cat from the entrance.
- Kept curator and receptionist as the only live AI speech characters.
- Converted the bottom chat-style presentation into a compact in-world speech bubble with a pointer tail, short spoken turns, and reply options.
- Opening greetings are now requested from the live AI model instead of being displayed from static scene text.
- Curator requests retain the exhibit lookup tool; receptionist requests do not use the exhibit lookup tool.

### Exhibit-room showcase wheel

- Added live-link eligibility based on project `links` containing a valid HTTP(S) URL.
- Added a data-driven showcase wheel for projects belonging to the current developer.
- Wheel selection updates the selected project used by the room's board, projection, artifacts, and inspection data.
- Added a `NOW SHOWING · LIVE PROJECT` label to the physical exhibit-room board.
- Board media uses the selected project's first available media image as a subtle background.
- Projects without media retain the readable paper-board fallback.
- Remounted board and projection components per selected project to prevent stale images from remaining visible.
- Wheel selection closes any previous inspection card before switching project state.

## Live AI Verification

The live app was running at `http://localhost:3000`.

Verified through `POST /api/chat`:

- Curator request returned `200 text/event-stream` with a model-generated answer about museum collections.
- Receptionist request returned `200 text/event-stream` with a role-specific answer about developer types and collections.
- A second, different curator question produced a different streamed response and different follow-up options.
- This confirms replies are not coming from a hardcoded local response table.

## Validation

Passed after the final changes:

- `npm run typecheck`
- `npm run lint`
- `npm run test -- --run`
- 10 test files passed
- 74 tests passed
- `npm run build` passed during the session
- Editor diagnostics reported no errors in touched scene files
- `git diff --check` passed

The Vitest command prints an existing Vite config warning about ESM syntax loaded as CommonJS; it does not fail the tests.

## Existing Unrelated Worktree Changes

These files were already deleted/modified outside the requested work and were left untouched:

- `public/models/bench-female/091_W_Aya.jpg`
- `public/models/bench-female/091_W_Aya_100K.mtl`
- `public/models/bench-female/091_W_Aya_100K.obj`
- `public/models/bench-female/091_W_Aya_10K.mtl`
- `public/models/bench-female/091_W_Aya_10K.obj`
- `public/models/bench-female/091_W_Aya_30K.mtl`
- `public/models/bench-female/091_W_Aya_30K.obj`
- `public/models/bench-female/tex/091_W_Aya_2K_01.jpg`

## Current Modified Application Files

- `components/ai/curator-speech-bubble.tsx`
- `components/three/exhibit-room-3d.tsx`
- `components/three/museum-cat.tsx`
- `components/three/walkable-player.tsx`
- `components/three/walkable-world.tsx`
- `lib/ai/prompts.ts`
- `lib/museum/walkable-model.ts`

## Follow-up Notes

- The current repository uses mock/seed exhibit data and has no persistence database. Receptionist visitor records are described as current-session context only and are not claimed to be permanently stored.
- `assets/floor+ceilin/Floor.FBX` exists outside `public`; browser loading currently uses the copied floor texture maps under `public/models/floor-textures`.
- The integrated browser may show a stale Next/Turbopack bundle after edits; a page refresh or dev-server restart may be needed when visually checking the latest scene.
