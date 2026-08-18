# Week 7 Submission Summary

**Intern:** Zain Ul Abideen  
**Track:** Frontend AI Engineering  
**Feature:** FE-AA2 — Walkable 3D exhibit corridor  
**Week status:** Complete for agreed handoff scope  

## What changed

- **Walkable 3D museum** on WebGL2-capable devices: scroll-rail glide through approach → reception → corridor → exhibit room
- **Home is the museum** on 3D devices (`app/page.tsx`); flat “Enter the Museum” fallback otherwise
- **Latest museum rescue pass:** root website chrome removed, home starts in the 3D museum, reception now reads as an exhibit preview hall, and exhibit previews route into project rooms
- **Visual polish:** the earlier ITOM-inspired paper pass has been superseded in the active working tree by a darker concrete/stone/wood museum moodboard with warm strip lighting, backlit panels, category signage, and framed exhibit portraits
- **Arrival beat:** exterior path + facade signage + brief “Approaching” intro overlay
- **Curator placeholder:** simple figure in reception; inspect links to `/assistant`
- **`?via=` adapter:** `lib/museum/via-entry.ts` + spawn mapping in `walkable-model.ts`
- **Tests:** +13 unit tests (via, walkable-model, museum logic); E2E updated for 3D home
- **Cleanup:** removed `room-scene-3d.tsx`, `window.__plinth` debug hook

## What was deliberately not changed

- World graph structure (`world.ts` rooms/doors/anchors)
- Placement engine and entity registry architecture
- AI curator chat implementation (`/assistant`, `/api/chat`)
- Live GitHub auth/API integration; current profiles are GitHub-shaped seed data
- Full building exterior modeling and animated curator (week 9/10)

## Key architectural decision

Kept `World Graph → Queries/Placement → Renderer` intact. The 3D scene reads the same `SurfaceLayout[]` as the flat renderer. Capability detection (`lib/renderer/capability.ts`) chooses 3D vs 2D; users can always toggle “Text walls” inside the 3D overlay.

Orbit diorama v1 (`room-scene-3d.tsx`) was **rejected and deleted**. Week 7 ships the **scroll-rail walkable corridor** instead.

## Accessibility

- Reduced motion / no WebGL2 → 2D `SurfaceRenderer` automatically
- 3D: Text walls toggle, keyboard `E` + prompt button, Escape closes inspect
- Inspect dialog: `aria-modal="true"`, focus on open

## Performance

- 3D stack remains one lazy chunk (~1 MB raw, measured previously in `fe-aa2-perf-note.md`)
- Procedural geometry only; paper texture generated once
- Build and 54 unit tests green

## Mobile

- Breadcrumb wrap, `100dvh`, touch-friendly overlay controls
- Touch vertical drag advances the rail (same as scroll)

## Testing

```text
npm run typecheck  — pass
npm run lint       — pass (2 pre-existing warnings)
npm test           — 54/54 pass
npm run build      — pass
e2e museum-flow    — updated for 3D-or-flat home entry
```

## Known limitations

- 2D museum pages not fully redesigned (fallback path)
- Portfolio PNG assets still large
- Lighthouse not re-run this session
- Curator is a placeholder mesh, not a guided character
- Current developer profile data is mocked until GitHub auth/repo fetching is wired

## Next logical step

Next: do a visual QA pass of exhibit preview → curator narration → Open exhibit → project room. Week 9/10 polish remains full exterior approach path, rigged curator, door reveal shader, on-screen mobile joystick, and image asset compression.
