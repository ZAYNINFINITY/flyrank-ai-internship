# Week 7 Audit

## Baseline

Recorded before Week 7 polish (pre-change snapshot from repo state).

### Performance

- Production build: succeeded (`npm run build`)
- 3D chunk: lazy-loaded via `next/dynamic` + `ssr:false` on exhibit/home routes
- Lighthouse desktop/mobile: not re-run in this session; prior deployed baseline referenced in `week-07/screenshots/deployed-site/`

### Accessibility

- 2D museum path: keyboard links, skip link, SpatialBreadcrumb
- 3D path: "Text walls" toggle remains full content access; inspect dialog uses `aria-modal="true"`

### Best Practices

- ESLint: 0 errors (2 pre-existing warnings in `world.ts` / `queries.ts`)
- TypeScript: clean

### SEO

- Static marketing routes remain server-rendered where applicable; home is client 3D takeover on capable devices

## Changes

### Spatial polish (3D walkable)

- ITOM-inspired near-monochrome paper palette, procedural paper texture, fog, CSS vignette
- Exterior approach zone with gate facade and path (arrival beat)
- Curator placeholder figure in reception with inspect link to `/assistant`
- Sketched corridor frames, door nameplates, scroll-rail navigation with legible troika text

### Navigation

- `lib/museum/via-entry.ts` validates `?via=` against world graph (`fromRoom` or `toRoom`)
- Wired on entrance, reception, gallery, and exhibit routes
- `resolveSpawnFromVia()` maps validated doors to rail spawn positions

### Mobile

- `100dvh` on room shell, museum space, loading skeletons
- SpatialBreadcrumb wraps on small screens; 44px min touch targets on nav links
- Touch drag scroll + prompt pill for inspect

### Accessibility

- Inspect dialog focus on open; `data-testid="walkable-prompt"` for automation (removed `window.__plinth`)
- Reduced-motion still forces 2D renderer via capability gate

### Performance

- Deleted unused `room-scene-3d.tsx` (orbit diorama v1)
- Paper texture cached once; troika text count kept low (~12 instances)

## After

### Performance

- `npm test`: 54/54 pass
- `npm run build`: pass
- 3D still lazy-loaded; no new runtime dependencies

### Accessibility

- 3D inspect overlay improved; flat path unchanged

### Best Practices

- Lint clean (warnings only)

### SEO

- No regressions expected; home is experiential 3D on capable clients

## Remaining limitations

- Full museum exterior walk-up and rigged curator character deferred to week 9/10
- Portfolio images (`zse-store.png`, etc.) still large PNGs — optimize in a dedicated asset pass
- Lighthouse scores not re-measured in CI this session
- 2D museum routes (entrance/reception/gallery) retain lighter CSS polish vs 3D path

## Why the Week 7 scope was chosen

Handoff direction: ship a **working walkable 3D corridor** as the primary experience with honest 2D fallback, not a rescue of orbit diorama or a revert to card-only landing pages. CSS depth on 2D routes was maintained lightly; fidelity investment went into the scroll-rail 3D museum.
