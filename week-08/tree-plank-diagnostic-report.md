# Tree & WoodPlankAccent — Diagnostic Report

## Summary
- Tree textures fixed (404s resolved) — both Tree instances now load without errors
- Planks load without errors (18 meshes) but scale is wrong — OBJ exported in mm, Three.js treats as meters
- Both components load successfully. Models may be positioned outside the default camera viewport.

---

## Verified Console Data (JSON.stringify, real values)

```
[Tree] loaded: {"children":2,"rawSize":{"x":10.1,"y":10.4,"z":15.8},"autoScale":0.3063,"meshCount":2}
[Tree] loaded: {"children":2,"rawSize":{"x":10.1,"y":10.4,"z":15.8},"autoScale":0.2776,"meshCount":2}
[Planks] loaded: {"children":18,"rawSize":{"x":800.5,"y":23.7,"z":463.3},"autoScale":0.002748,"meshCount":18}
```

Zero errors. All models load successfully.

---

## What Was Broken (Now Fixed)

### Tree textures 404
TDSLoader's `readMap()` resolves embedded texture filenames relative to `this.resourcePath || path` (the .3ds directory). The .3ds references bare names `bark_loo.jpg`, `blatt1.jpg`, `blatt1_a.jpg`. TDSLoader tried `/models/bark_loo.jpg` → 404. When textures fail, TDSLoader's LoadingManager calls `itemError()` → rejects the entire model promise → Tree renders nothing silently.

**Fix applied:** Copied 3 textures from `public/models/tree-textures/` to `public/models/` root so TDSLoader finds them at the path it expects.

**Result:** Zero console errors. Both trees load with 2 meshes each. autoScale ~0.3 → 3.2m tall. ✅

---

## What's Still Wrong

### Planks — mm vs meter unit mismatch

The `.obj` was exported from 3ds Max (2018) in **millimeter** coordinates:
```
v  208.2769 -8.1467 52.1012    ← millimeters
v  407.3369 -8.1467 -36.9588
```

Three.js treats these as **meters**. So the raw model is:
- X span: 800.5mm → 800.5 "meters" in Three.js
- Y span: 23.7mm
- Z span: 463.3mm

The `WoodPlankAccent` component auto-scales to `targetWidth = 2.2`:
```
widestSpan = 800.5
autoScale = 2.2 / 800.5 = 0.002748
final scale = 0.002748
```

After scaling, the entire 18-piece plank assembly is 2.2m wide. But the model is 18 separate planks spread across 800mm, so each plank is roughly 800/18 ≈ 44mm wide raw → 44 × 0.002748 ≈ **0.12m (12cm)** after scaling.

12cm planks should be visible. The model is at position `[-4.3, 0.5, 16.5]`. So the question becomes: **is the camera pointing at the left wall of the reception zone?**

### My failed fix attempt (reverted)
I tried adding mm→m normalization:
```js
clone.scale.setScalar(0.001);  // mm → m
clone.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(clone);
const autoScale = targetWidth / widestSpan;
clone.scale.setScalar(0.001 * autoScale);  // = 0.002748, same result
```
This is mathematically equivalent — `0.001 * (2.2 / (800.5 * 0.001))` = `2.2 / 800.5`. **Reverted.**

---

## Scene Layout

```
FOOTPRINTS (from lib/museum/walkable-model.ts:50):
  approach:  { minX: -4, maxX: 4, minZ: 20, maxZ: 28 }
  reception: (around Z: 12-20)
  corridor:  (around Z: 0-12)
  exhibit:   (around Z: -8 to 0)
```

- **Trees** at: `approach.maxZ - 3` = **Z=25** (approach zone, outside entrance door)
  - Left tree: `[approach.minX + 0.9, 0, Z=25]` = `[-3.1, 0, 25]`
  - Right tree: `[approach.maxX - 0.9, 0, Z=25]` = `[3.1, 0, 25]` (targetHeight=2.9)
- **Planks** at: `[-4.3, 0.5, 16.5]` (reception left wall area)
- **Camera spawn**: passed as prop, starts inside corridor/exhibit area

### Critical observation
The home page (`/`) shows a 3D scene with a door, "Turn lights on" toggle, "Accessible view" button, and "Leave the room" link. This is the **approach/reception zone with the entrance door**. The trees at Z=25 are BEHIND the entrance door (outside). The planks at Z=16.5 are inside the reception area on the left wall.

**The trees might already be working** — they're just on the OTHER SIDE of the entrance door (approach zone). The user sees the reception side.

**The planks should be visible** at [-4.3, 0.5, 16.5] on the left wall of the reception area, if the camera is facing the door.

---

## Fix Needed

### Plank scale fix
The raw size is 800.5 units (mm). With targetWidth=2.2, autoScale=0.002748. The final model is 2.2m wide with 12cm planks — this should be visible.

**Possibility 1:** The model IS there but the camera isn't pointing at the left wall. User needs to walk/look left.

**Possibility 2:** The planks are too small/thin to notice at reception scale. Consider increasing `targetWidth` to make them larger wall accents (e.g., 4.4m or 6m).

**Possibility 3:** The planks are inside the wall geometry and getting z-fought/clipped.

### Recommended next steps
1. Navigate to the approach zone (past the door) to verify trees render there
2. Check if planks are visible when looking at the left wall in reception
3. If planks are positioned correctly but too small, increase `targetWidth` in `WoodPlankAccent`
4. Consider adding a console.log of the world-space bounding box after all transforms to confirm final screen position

---

## Files Modified (Uncommitted)

- `components/three/walkable-world.tsx`:
  - Tree catch (line ~2245): added `console.error("[Tree] load failed:", err)` + `treeModelPromise = null` for retry
  - Tree success: added `console.log("[Tree] loaded:", JSON.stringify({...}))`
  - Plank catch (line ~2323): added `console.error("[Planks] load failed:", err)` + `plankModelPromise = null` for retry
  - Plank success: added `console.log("[Planks] loaded:", JSON.stringify({...}))`
- `public/models/bark_loo.jpg` — Copied from `tree-textures/` (for TDSLoader)
- `public/models/blatt1.jpg` — Copied from `tree-textures/` (for TDSLoader)
- `public/models/blatt1_a.jpg` — Copied from `tree-textures/` (for TDSLoader)

## Files NOT Modified

- `public/models/tree.3ds` — Unchanged (works fine)
- `public/models/planks.obj` — Unchanged
- `public/models/planks.mtl` — Unchanged
- `public/models/floor.fbx` — Already working
