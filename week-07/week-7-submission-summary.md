# Week 7 Submission Summary

**Intern:** Zain Ul Abideen  
**Track:** Frontend AI Engineering  
**Feature:** FE-AA2 — Walkable 3D exhibit corridor  
**Week status:** Complete — including museum platform pivot and §D visual polish  

## What changed

### Phase 1 — Data Architecture
- **Multi-developer museum data:** New types (`Developer`, `Collection`, `Exhibition`) and repository interfaces with mock implementations
- **4 seed developers** (Torvalds, Karpathy, Gaonkar, Zain), 12 exhibits, 4 collections, 4 exhibitions
- **Repository barrel** (`lib/repository/index.ts`) — single entry point for all data access
- **74 tests passing** (10 test files) including acceptance test validating data integrity

### Phase 2 — Visual System + Museum Identity
- **Design token system** in `globals.css`: `--color-text`, `--color-background`, `--color-accent`, surface/border/muted tokens, museum space atmospheres, motion tokens
- **3D palette rebuilt:** warm beige → architectural neutrals (concrete gray `#9d978c`, clean white `#f7f2e8`, warm brown accent `#8b6a4a`)
- **Visual noise removed:** DoodleStar, DoodleSquiggle, DoodleCircle, FloatNote, CorridorDoodles, ReceptionFurnishing, decorative tree billboards, getTreeTexture, getFloatNoteTexture
- **Zain-specific UI cleaned:** nav "Sign in"/"GitHub" links removed, layout metadata → "Open digital museum for developers", footer GitHub link removed, about page rewritten for museum language
- **CuratorFigure:** removed hardcoded "Zain Ul Abideen" name label

### Phase 3A — §D Visual Polish (Week 7)
- **§D1 — Doors:** BoxGeometry with visible thickness (0.06 depth), gold handle rod + knob, hinge pivot, swing angles 1.9→1.57 (π/2), swing lerp 6→4 (heavier feel), threshold strip on entrance double-leaf
- **§D2 — Ambience:** Global lights reduced (ambient 1.7→0.55, hemisphere 1.2→0.75, directional 1.15→1.0), third point light removed, LinearLight 2.2→1.6, MuseumLighting reduced from 6→3 LinearLights, vignette lightened (transparent 55%→65%), SVG film grain overlay added, fog range 22-70→18-55
- **§D3 — Curator:** Replaced framed portrait with billboard sprite (`curator.png`), camera-facing quaternion, alphaTest, gentle bob animation, ground shadow disc

## What was deliberately not changed

- World graph structure (`world.ts` rooms/doors/anchors)
- Placement engine and entity registry architecture
- AI curator chat implementation (`/assistant`, `/api/chat`)
- Live GitHub auth/API integration; current profiles are GitHub-shaped seed data
- 3D movement system, collision, or interaction code
- Data types, repositories, or seed data from Phase 1

## Key architectural decisions

1. **Museum-first, not portfolio-first:** Plinth is now an open digital museum platform where any developer can exhibit their work. Zain is one exhibitor among many.
2. **ITOMDEV as method, not template:** Used spatial storytelling and museum logic from ITOMDEV, but Plinth has its own identity (architectural, editorial, contemporary museum).
3. **3D is secondary:** Hybrid approach — 3D where it adds spatial value, normal UI for details/metadata/publishing/auth.
4. **`World Graph → Queries/Placement → Renderer`:** The 3D scene reads the same `SurfaceLayout[]` as the flat renderer. Capability detection chooses 3D vs 2D.

## Accessibility

- Reduced motion / no WebGL2 → 2D `SurfaceRenderer` automatically
- 3D: Text walls toggle, keyboard `E` + prompt button, Escape closes inspect
- Inspect dialog: `aria-modal="true"`, focus on open

## Performance

- 3D stack remains one lazy chunk (~1 MB raw)
- Procedural geometry only; textures generated once
- 74 unit tests green

## Mobile

- Breadcrumb wrap, `100dvh`, touch-friendly overlay controls
- Touch vertical drag advances the rail (same as scroll)

## Testing

```text
npx tsc --noEmit   — 0 errors
npx eslint .       — 0 errors (2 pre-existing warnings)
npx vitest run     — 74/74 pass
npx next build     — clean (after .next cache clear)
```

## Files changed in this session

| File | Changes |
|------|---------|
| `app/globals.css` | Design tokens, museum palette |
| `app/about/page.tsx` | Rewritten for museum language |
| `app/layout.tsx` | Metadata: "Open digital museum for developers" |
| `app/page.tsx` | Museum-first home |
| `components/primitives/nav.tsx` | Removed Zain-specific links |
| `components/three/walkable-world.tsx` | §D1 doors, §D2 lighting, §D3 curator |
| `components/three/exhibit-room-3d.tsx` | §D2 vignette + grain |
| `lib/museum/walkable-model.ts` | §D1 swing angles |
| `lib/types/` | New: Developer, Collection, Exhibition |
| `lib/repository/` | New: all repositories + acceptance test |
| `lib/seed/` | New: 4 devs, 12 exhibits, 4 collections, 4 exhibitions |
| `public/images/curator.png` | New curator asset |

## Screenshots

- `C:\Users\user\phase3a-entrance.png`
- `C:\Users\user\phase3a-homepage.png`
- `C:\Users\user\phase3a-about.png`

## Known limitations

- Curator billboard uses placeholder asset (not final character design)
- 3D is still WebGL-only; no mobile joystick
- Developer profiles in corridor not yet wired to data layer
- No image asset compression pass yet
- Lighthouse not re-run

## Next logical step

Hand off 5 remaining visual polish tasks to Emergent (or next session): facade texture cleanup, door panel texture/lighting, corridor developer profile wiring, material roughness improvements, ceiling fixture visibility, grid floor opacity. All file-specific fixes with exact line numbers documented in the Emergent prompt.
