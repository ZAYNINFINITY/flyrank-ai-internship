# Plinth — Architecture & Design Vision

> **Status: Internal architecture and design vision document.**
>
> This document is **not** an internship deliverable, implementation milestone, or roadmap replacement.
>
> - It captures the long-term direction of Plinth.
> - It is based on reviewing the current architecture and studying itomdev.com as an interaction reference.
> - It does **not** modify the current implementation plan.
> - It does **not** authorize refactoring.
> - It exists to preserve the project's long-term vision so future architectural decisions remain consistent.

---

## 1. Purpose & Status

Plinth currently exists as a 2D museum where developer projects are experienced as exhibits inside interconnected rooms. That implementation is real, working, and has been built incrementally across the internship weeks.

This document captures where Plinth is heading *after* the internship. It records the guiding statement, the intended content-model destination, and the architectural direction agreed for how the experience should evolve — without changing anything that is currently planned or built.

It is a reference for future decisions, not a work order. Anything proposed here is deliberately non-committed: it becomes real work only when a future milestone explicitly picks it up.

---

## 2. Current Implementation

What exists today (repository-verified):

- **A 2D world graph** — `Building → Floor → Wing → Room → Door → Surface → Anchor`, defined declaratively in `lib/museum/world.ts` with typed helpers (`door()`, `anchor()`, `room()`). Rooms are navigable via doors; surfaces carry anchors; anchors carry placements.
- **Route-driven rooms** — each room is a real Next.js route (`/`, `/entrance`, `/reception`, `/gallery`, `/exhibit/e/[id]`, `/collection`, `/assistant`), wired through a `routeMap` in `lib/museum/navigation-adapter.ts`. Door links use `?via=<doorId>` to preserve the visitor's entry direction.
- **A renderer registry** — `EntityView` + `defaultEntityRegistry` map entity types (`exhibit`, `artifact`, `projection`, `signage`, `timeline`, `terminal`, `statue`) to view components, with a placeholder fallback for unregistered types.
- **A repository seam** — `ExhibitRepository` interface (`getAll` / `getById` / `getByCollection`) with a `MockExhibitRepository` and a `getExhibitRepository()` singleton. Currently used consistently by the AI route, but partially bypassed by renderer components.
- **A generic chat surface** — `ChatPanel` (`/assistant`) backed by the AI SDK (`useChat` + `streamText`) with a single `exhibitLookup` tool and a model-agnostic provider config.
- **Real DOM rendering** — rooms render as server-rendered HTML, which keeps the site accessible and indexable.

---

## 3. Interaction Reference: itomdev.com

itomdev.com was studied as an **inspiration and interaction reference** for the *kind of user experience* Plinth wants — not as something to reproduce, and not as a source of implementation details to copy. Plinth remains a 2D experience with its own architecture and identity.

What it demonstrates about experience design:

- **A portfolio as an experience, not a list.** Visitors move through a continuous space rather than scrolling through sections. The interface tells a story instead of behaving like a traditional website.
- **Spatial navigation as the primary interaction.** Movement through a corridor and into rooms is the wayfinding system. Exploration is the point.
- **Rooms as distinct worlds with their own interaction language.** Each space carries its own metaphor (a gallery, a studio, a flight, a destination), so moving between rooms feels like entering different places rather than switching pages.
- **Diegetic affordances.** Interactivity is signalled *within the world* (an element visibly reacting on hover) instead of relying on UI chrome like "click here" labels.
- **Teaching through discovery.** New interaction patterns are hinted inside the experience and reinforced by rewarding completion — guidance that doubles as acknowledgment of exploration.

None of these are architectural prescriptions. They are the user-experience qualities Plinth's direction should keep moving toward: **the museum should feel like a place you walk through, where the content lives inside the space rather than on top of it.**

---

## 4. Architectural Observations

### Strengths

- **The world graph is the right foundation.** It is data-driven and content-agnostic at its core — rooms, doors, surfaces, anchors, and placements are all declarative. This is genuinely reusable and is the strongest asset for a platform future.
- **The entity registry pattern is sound.** Decoupling entity rendering behind a registry with a placeholder fallback is exactly the right seam for pluggable content.
- **The repository seam exists.** The `ExhibitRepository` interface plus singleton is the correct abstraction boundary — it just needs to be applied consistently.
- **Real DOM over a single canvas.** Rooms as real routes keep the site accessible, indexable, and resilient. This is an advantage to preserve, not an accident.

### Weaknesses / technical debt

- **Route-driven navigation limits the spatial feel.** Each room is a separate page load; transitions, entry-direction tracking, and shared context only partially mask the boundary. This is the main gap against the walking-through-a-museum vision.
- **Two divergent exhibit data models.** The repository `Exhibit` (museum cards) and the long-form portfolio data (`lib/mock-data/exhibits.ts`) are separate shapes bridged by id-string matching. The museum can drift out of sync with the portfolio.
- **Renderer components bypass the repository.** Some entity views import `mockExhibits` directly, so swapping the data source requires touching renderer code rather than the seam.
- **Museum vocabulary is baked into the world types.** `RoomKind`, `EntityType`, `LightingPreset`, and `AnchorCapability` are museum-flavored enums in the core types file. That's fine for the museum as the first experience, but it means the "world" is not yet theme-agnostic.
- **The Curator has no world context.** The assistant is a generic chat surface; its lookup tool knows nothing about the visitor's current room, path, or visible doors. A guide that lives in the world needs to know where the visitor is.

---

## 5. Long-Term Vision

> **Plinth is not a portfolio with an interactive UI.**
>
> **Plinth is an interactive storytelling platform where software projects are experienced as places rather than viewed as cards.**

The museum is the first experience built on that platform — **not the platform itself**. The portfolio is simply the first content domain.

The long-term data flow should evolve toward a single source of truth:

```text
Creator
    ↓
Portfolio
    ↓
Projects
    ↓
Exhibits
    ↓
Museum Views
```

The museum should **never own a separate copy** of the portfolio data. Instead:

- The content model becomes the single source of truth.
- The museum simply renders that content through spatial experiences.
- Future experience domains (office, laboratory, campus, gallery, studio, company headquarters, research center, and so on) reuse the exact same content model.

This is the foundation that eventually allows Plinth to become a reusable storytelling platform instead of a one-off museum application — where different creators and organizations can replace the content while preserving the same immersive experience.

---

## 6. Architectural Direction (Hybrid)

The long-term vision is an uninterrupted, explorable world. The agreed approach is to evolve toward it **incrementally, without a rebuild**.

- **Keep rooms as real Next.js routes.** This preserves deep linking, accessibility, and search indexing.
- **Introduce a shared spatial shell** (`MuseumCanvas` or equivalent) that makes transitions between rooms feel continuous.
- **Maintain visitor state across rooms** so the journey reads as one continuous walk rather than disconnected pages.
- **Gradually dissolve page boundaries** through shared transitions, persistent ambient elements, breadcrumbs, subtle camera movement, audio, and persistent world state.

**Explicitly out of scope for now:** a full single-shell architecture (rooms as pure client-side states on one route). That would require unnecessary re-architecture, increase complexity, and slow development without providing enough value at this stage.

The destination remains a seamless museum experience — but it is reached by evolution, not by replacing what already works.

---

## 7. Future Roadmap (non-committed)

These are desired directions, **not** committed implementation work. None of them should trigger refactoring today.

1. **Content model first.** After the internship deliverables are complete, the highest architectural priority is unify the content model toward `Creator → Portfolio → Projects → Exhibits → Museum Views`. One source of truth; the museum renders it, never copies it.
2. **Theme-agnostic world.** Decouple the museum-specific vocabulary (`RoomKind`, `EntityType`, `LightingPreset`, `AnchorCapability`) from the core world types so other experiences (office, laboratory, campus, …) can reuse the same graph.
3. **Room-experience registry.** Generalize the entity-registry pattern so whole *rooms* can have registered experience components, not just entities.
4. **Position-aware Curator.** Give the assistant world context — the visitor's current room, entry path, and visible doors — so it acts as a guide inside the museum rather than a detached chat box.
5. **Experience layers as platform features.** Audio ambience, visitor-trail / achievement tracking, and persistent world state should be platform-level concerns, not per-page code.

---

## 8. Vision Alignment Scorecard

Scored against the long-term vision (museum-as-product, reusable platform), not against a traditional portfolio.

| Area | Score | Note |
|------|-------|------|
| World graph | 8 / 10 | Data-driven spine; the strongest asset for the platform future. |
| Content model | 2 / 10 | Two divergent exhibit models today; no `Creator → Portfolio → Projects` chain yet. |
| Renderer | 8 / 10 | Registry pattern is right; generalize to room-level experiences later. |
| Navigation | 4 / 10 | Route-driven today; the main gap against a continuous walking feel. |
| Theming | 4 / 10 | Museum vocabulary embedded in core types; not yet theme-agnostic. |
| Curator | 3 / 10 | Generic chat with no world context; needs to become position-aware. |
| **Overall** | **5 / 10** | Correct foundation, missing experience and content layers. |

---

*This document is a reference for future architectural decisions. It does not change the current implementation plan and does not authorize any refactoring.*
