# Ship the Ugly One — Plinth (Week 5)

**Assignment:** Ship the Ugly One
**Track:** General AI Fluency
**Intern:** Zain Ul Abideen
**When:** Week 5 · **Workload:** 4h · **Phase:** Build
**Deliverable:** https://plinth-cyan.vercel.app — live, every sitemap page reachable

---

## Live URL & reachability

- **Live:** https://plinth-cyan.vercel.app
- **Every sitemap page reachable and navigable:** `/`, `/explore`, `/about`, `/entrance`, `/reception`, `/gallery`, `/collection`, `/exhibit/e/[id]`, `/exhibit/[username]`, `/assistant`, `/dashboard`, `/login`, `/health` — verified end-to-end (17 routes in the production build; Phase C T1–T12 walked the full museum via Playwright).
- **Real work in, no placeholders:** four real projects as museum exhibits (POS-it, Collaborative Workspace, ZSE Store, ScrollStreak), each with its own exhibit room and long-form project page.
- **Explainable:** architecture is documented in `docs/architecture.md`, `docs/REPOSITORY_STATE.md`, and the week-05 task/evidence docs; I built it with AI as my build partner and can explain every piece (world graph, renderer, repository seam, AI route).

---

## One Real Person's Reaction

> **Status: PENDING — user action.**
> I need to send the live link to one real person in my target field, ask them to look, and capture what they saw, what confused them, and whether the work landed.

**Person:** _[name / role]_
**When:** _[date]_
**What they said:**
> _[paste their actual words]_

**What confused them:**
> _[note any confusion]_

**Did the work land?** _[yes / mostly / no — one line why]_

---

## Honest "Still Ugly" List

Things I already know are rough — not excuses, a work list.

1. **The museum is still a vertical blog layout in places.** `RoomShell` renders its content inside a centered `max-w-4xl` column, so rooms read more like long-form articles than spatial rooms. The biggest remaining visual gap between "museum" and "webpage" is this column.
2. **Doors read as border-links, not doors.** A `space-door` is a styled link with a border — fine functionally, but it does not yet feel like walking through a doorway. No doorway animation.
3. **Walls are labeled, not wall-like.** `SurfaceRenderer` renders "north wall" / "east wall" text labels. A visitor never sees a literal wall with objects hanging on it.
4. **Transitions are CSS-only, not directional.** Rooms transition in via `doorway-fade`/`corridor`/`spotlight-reveal` presets, but the entry direction carried in `?via=` is not yet used to drive where the camera/light comes from.
5. **Atmosphere is thin.** Each room has a lighting preset (one glow/gradient), but no layered atmosphere — no shadows, no depth, no animated ambient light. It is clean but flat.
6. **`/playground` and `/health` are unlinked dev utilities.** Intentionally isolated, but a reviewer browsing the repo may trip over them.
7. **No dark/light theme toggle.** Dark-first only.
8. **Collection filtering is load-time only.** `?collection=` filters on load via the repository; switching collection inside the page doesn't pushState — a reload is required to change filter from the URL.
9. **Three pre-existing lint warnings** (unused `EntityComponentProps`, `worldIndex`, `Wing`) are still in the codebase. They're harmless but untidy.
10. **AI curator tool use is model-dependent.** The free-tier Gemini sometimes answers from memory instead of calling `exhibitLookup`. Works in my test sessions, but a prod nudge toward tool use would make it reliable.

---

## Notes

- This is a "ship it ugly, learn from a real human" pass — the polish list above is the roadmap for Week 6+ museum immersion work, not a blocker for this submission.
- The museum is genuinely navigable today; the ugly is in the visual depth, not in broken links or missing pages.
