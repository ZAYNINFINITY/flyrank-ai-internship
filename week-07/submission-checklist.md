# Week 7 Submission Checklist

## Experience

- [x] Home communicates museum concept (3D approach facade or flat explanation)
- [x] User can enter spatial experience immediately on 3D home
- [x] Scroll rail shows where you are along the museum spine
- [x] Corridor exhibits and doors readable in 3D
- [x] Exhibit room content inspectable in-world
- [x] Text walls + Leave the room escape routes
- [x] Flat museum path via `/entrance` still works

## Visual polish (3D)

- [x] Paper/sketch-inspired palette and texture
- [x] Fog + vignette atmosphere
- [x] Frame corners and door labels
- [x] No mirrored troika text (rotation fix retained)
- [x] Arrival intro overlay

## Mobile

- [x] 100dvh viewport behavior
- [x] Breadcrumb wrap
- [x] Touch targets on overlay controls
- [ ] On-screen joystick graphic (deferred)

## Accessibility

- [x] 2D fallback path
- [x] Text walls toggle
- [x] Keyboard inspect (E / prompt)
- [x] Inspect dialog focus + aria-modal
- [x] Reduced motion → 2D

## Engineering

- [x] `?via=` validated (`via-entry.ts`)
- [x] Unit tests for museum logic + walkable model
- [x] E2E museum flow updated
- [x] `window.__plinth` removed
- [x] `room-scene-3d.tsx` removed
- [x] `npm test` / `npm run build` pass

## Documentation

- [x] `week-07/AUDIT.md`
- [x] `week-07/phone-audit.md`
- [x] `week-07/week-7-submission-summary.md`
- [x] `week-07/fe-aa2-3d-room.md`
- [x] `week-03/app/README.md` Week 7 entry

## Manual verification (pending)

- [ ] Desktop walk-through on GPU hardware
- [ ] Physical phone spot-check
- [ ] Lighthouse re-run on `/` and `/exhibit/e/pos-it`
