# Phase C — Cohesive Museum Wiring

**Assignment:** Cohesive museum wiring (Phase C) — tie the standalone Foyer rooms into one navigable museum
**Track:** Frontend AI Engineering
**Intern:** Zain Ul Abideen
**Phase:** C (Week 5, builds on FE-05/FE-06/FE-07/FE-08 + the museum spatial system)
**Deliverable:** https://foyer-cyan.vercel.app

---

## What Changed

Phase A/B left Foyer as separate, working rooms (entrance, reception, gallery,
collections, exhibit rooms, assistant) that a visitor could only reach by
knowing each URL. Phase C wires them into a single coherent museum without
rebuilding anything: it **reuses the world graph, route map, navigation
adapter, renderer, museum engine, and repository layer** that already existed.

### Before (Phase B)
- Home page had no museum entry point — only "Explore" leading to the long-form page.
- `nav.tsx` links: Explore / About / Sign in — no museum context.
- `/gallery` always showed the full "Main Corridor" — `?collection=` was ignored.
- Exhibit rooms (`/exhibit/e/[id]`) and the long-form portfolio (`/exhibit/[username]`) were two disconnected surfaces.
- `/dashboard` was an orphan route with a dead "Sign in" button and no inbound links.

### After (Phase C)
- **Museum entry:** home Beat 3 now has **"Enter the Museum"** → `/entrance` (alongside "Explore all exhibits" → `/explore`); nav gained **Museum** → `/entrance` (nav = Museum / Explore / About / Sign in).
- **Collection filtering:** `/gallery?collection=<id>` shows only that collection's exhibits with its title/description; an invalid id falls back to the full corridor.
- **Cross-linked exhibit experiences:** museum rooms link out to the long-form ("Open the full exhibit →") and the long-form links back into museum rooms ("View this in the museum room →") — both directions, per project.
- **Orphan route resolution:** `/dashboard` is now reachable (footer link) and its "Sign in" is a real `<Link href="/login">`. `/playground` and `/health` are **intentionally** left unlinked — they are assignment/dev utilities, not museum rooms.

---

## Architecture

### 1. Museum entry + nav

- `app/page.tsx` — home CTA "Enter the Museum" (`/entrance`) added to Beat 3, the section that already carried the "Explore all exhibits" link.
- `components/primitives/nav.tsx` — `navLinks` extended with `{ label: "Museum", href: "/entrance" }` (first item).
- `app/layout.tsx` — footer gained a **Dashboard** link (`/dashboard`), giving the previously orphaned route a legitimate inbound edge.

### 2. Collection filtering — `app/gallery/page.tsx`

The gallery is wrapped in `Suspense` and reads `useSearchParams().get("collection")`:

- `toCollection(param)` validates the param against `validCollections`; invalid or missing → `null` → full "Main Corridor".
- `populateCorridor(map, roomId, repo, exhibits?)` (in `lib/museum/placement.ts`) gained an optional pre-fetched exhibit list. The gallery passes `repo.getByCollection(collection)` or `repo.getAll()` and **resets the map to empty between switches** so the corridor shows its loading skeleton during the transition.
- `gallery-experience.tsx` now accepts a `collection` prop and renders the collection's meta (title/description/"X collection" tag with a left border accent) above the corridor.
- `collection-experience.tsx` now `export`s the single `collectionMeta` map that both `/collection` and `/gallery` read — no duplicated collection definitions.

The repository's existing `getByCollection` seam is used as-is; no new filtering system was introduced.

### 3. Cross-linked exhibit experiences

Two new bridge functions + two link surfaces, both directions:

- `lib/museum/navigation-adapter.ts` → **`getPortfolioRouteForExhibitId(id)`** — searches the portfolio data (`lib/mock-data/exhibits.ts`) for a project whose id matches the museum exhibit, returning its long-form route or `null`.
- `app/exhibit/e/[id]/page.tsx` — when a matching portfolio project exists, the room renders **"Open the full exhibit →"** at the top.
- `app/exhibit/[username]/page.tsx` — for each project that has a museum exhibit (`mockExhibits.some(e => e.id === project.id)`), the long-form renders **"View this in the museum room →"** under that project.

Verified for all four portfolio projects: POS-it, Collaborative Workspace, ZSE Store, ScrollStreak.

### 4. Orphan route resolution — `/dashboard`

- `app/dashboard/page.tsx` — the old dead `<GhostButton>` is gone; "Sign in" is now a real `<Link href="/login">`.
- Footer link (task 1) gives it an inbound route.
- `/playground` and `/health` remain intentionally isolated dev utilities — no inbound links, matching the documented stance that demo/dev routes are not museum-facing.

### Reused machinery (no new systems)

- World graph (`lib/museum/world.ts`) — unchanged; doors still carry `?via=<doorId>`.
- Route map + `getRoute`/`getRoomIdByRoute` in `navigation-adapter.ts` — only added the one exhibit bridge function.
- Renderer (`world-renderer.tsx`) and `SpatialBreadcrumb` — unchanged.
- Museum engine (`visitor.ts`) — all museum pages now use `enterRoom(createVisitor(roomId), roomId, doorId)` (this also fixed a pre-existing `Date.now()` purity lint error that 5 pages carried).

---

## Verification (2026-08-03)

Method: production build (`npm run build`, all 17 routes) served locally via
`next start -p 3101` and walked end-to-end with Playwright (accessibility
snapshots + DOM checks per page). Also re-checked on the live dev server.

| # | Case | Result |
| --- | --- | --- |
| T1 | Home CTA | "Enter the Museum" present on home; click → `/entrance`; nav shows Museum/Explore/About/Sign in |
| T2 | Entrance | Renders "You are here: Entrance"; door `↓ Back Outside` (`/?via=...`) and `↑ Ahead Reception Hall` (`/reception?via=door-entrance-to-reception`) |
| T3 | Reception | "Welcome to Foyer"; doors to Entrance / Main Corridor / Collections Wing / Curator Studio |
| T4 | Corridor (unfiltered) | `/gallery` → "Main Corridor", 4 exhibits (POS-it, Collaborative Workspace, ZSE Store, ScrollStreak) |
| T5 | Filter: journey | `/gallery?collection=journey` → heading **"Journey"**, only journey exhibits (Forms & Validation, API Design Patterns, Auth & OAuth Integration, Testing Patterns) |
| T6 | Filter: visual-design | `/gallery?collection=visual-design` → filtered corridor renders |
| T7 | Filter: invalid | `/gallery?collection=unknown` → falls back to full corridor |
| T8 | Room → long-form | `/exhibit/e/pos-it` shows "Open the full exhibit →" → `/exhibit/zayn` |
| T9 | Long-form → rooms | `/exhibit/zayn` shows "View this in the museum room →" on all 4 projects → each museum room |
| T10 | Collections card | `/collection` → "Experiments" card → `/gallery?collection=experiments` → only the 2 experiment exhibits |
| T11 | Dashboard | Footer "Dashboard" link → `/dashboard`; "Sign in" → `/login` |
| T12 | No broken assets | `/exhibit/e/collaborative-workspace` previously logged a 404 for `/images/collab.png` (file did not exist); its media `src` is now `""` so the room renders its built-in media placeholder — zero console errors |

Also fixed en route: pre-existing `react-hooks/purity` lint errors on the 5
museum pages (hand-rolled `Date.now()` memos) by moving them onto
`createVisitor`/`enterRoom`.

**Quality gates:** `npx eslint .` → 0 errors (3 pre-existing warnings
untouched: unused `EntityComponentProps` in `world-renderer.tsx`, unused
`worldIndex` in `queries.ts`, unused `Wing` in `world.ts`). `npm run build` →
green, 17 routes (`/api/chat` dynamic, all museum pages static).

### Evidence

- `screenshots/phase-c-home-cta.png` — home CTA (T1).
- `screenshots/phase-c-entrance.png` — entrance room + doors (T2).
- `screenshots/phase-c-reception.png` — reception hall + 4 doors (T3).
- `screenshots/phase-c-corridor.png` — Main Corridor, unfiltered (T4).
- `screenshots/phase-c-collection-journey.png` — `?collection=journey` filter (T5).
- `screenshots/phase-c-exhibit-room.png` — POS-it museum room with "Open the full exhibit →" (T8).
- `screenshots/phase-c-longform-crosslinks.png` — long-form with museum-room links (T9).

### Known limitations

- **Filtering is repository-backed, not URL-state round-trip.** The corridor
  reflects `?collection=` on load; client-side collection switching within the
  page re-fetches via the same `populateCorridor` path. If a future
  `Collections Wing` UI wants pushState without a page reload, that is a small
  follow-up, not a gap in the current behavior.
- **Exhibit ↔ project matching is id-based.** `getPortfolioRouteForExhibitId`
  matches museum exhibit `id` to portfolio project `id`. Adding an exhibit for
  a project not in `mock-data/exhibits.ts` (or vice versa) needs matching ids —
  the two link surfaces simply don't render when there is no counterpart, so it
  degrades gracefully.
- **Production build needs more heap on this machine.** Windows worker OOM is a
  known flake here; the verified build runs with
  `NODE_OPTIONS=--max-old-space-size=4096`. Environmental, not code-related.

---

## Files

- `app/app/page.tsx` — home "Enter the Museum" CTA.
- `app/components/primitives/nav.tsx` — Museum nav link.
- `app/app/layout.tsx` — footer Dashboard link.
- `app/app/gallery/page.tsx` — `Suspense` + `useSearchParams`, `toCollection` validation, filtered `populateCorridor`, `enterRoom` visitor helper.
- `app/app/gallery/gallery-experience.tsx` — `collection` prop + collection meta header.
- `app/app/collection/collection-experience.tsx` — `export` `collectionMeta`.
- `app/lib/museum/placement.ts` — optional `exhibits` param on `populateCorridor`.
- `app/lib/museum/navigation-adapter.ts` — `getPortfolioRouteForExhibitId`.
- `app/app/exhibit/e/[id]/page.tsx` — "Open the full exhibit →" link; `enterRoom` helper.
- `app/app/exhibit/[username]/page.tsx` — "View this in the museum room →" links.
- `app/app/entrance/page.tsx`, `app/app/reception/page.tsx`, `app/app/collection/page.tsx` — `enterRoom(createVisitor(...))` purity-lint fix.
- `app/app/dashboard/page.tsx` — real `<Link href="/login">`.
- `app/lib/repository/mock-exhibit-repository.ts` — Collaborative Workspace media `src: ""` (removes the `/images/collab.png` 404).
