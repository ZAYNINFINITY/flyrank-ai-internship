# Repository State

Last verified against repository contents: 2026-07-31.
This document is a snapshot, not a prediction — update it as work lands, don't rewrite history in it.

---

## Current Branch

- **Branch:** `main` (only branch present in `.git/refs/heads` at time of writing)
- **Purpose:** Tracks weekly FlyRank AI Frontend Engineering internship deliverables (`week-01/` – `week-08/`) plus the in-progress Plinth capstone build living in `week-03/app/`
- **Current deployment:** [plinth-cyan.vercel.app](https://plinth-cyan.vercel.app) — Next.js 16 / React 19 / Tailwind v4 app, 8 routes (entrance, explore, gallery, exhibit, dashboard, login, about, health), deployed via Vercel from `week-03/app/`

### Assignments Completed (repository-verified)

| Assignment | Status |
|---|---|
| Week 1 — Onboarding / Setup | Done |
| Week 2 — Foundations (Case Studies, Prompting, Workflow Drill) | Done |
| Week 3 — Plinth Capstone Skeleton, Docs, Submission Materials | Done |
| FE-05 — Accessible Component Fundamentals | Done (implementation + evidence both complete) |
| FE-06 — Streaming AI Chat | Done (implementation complete; optional supporting evidence could be richer — see gaps) |
| Three Roads (stack rationale) | Done |
| Empty but Live | Done (implementation + submission pointer `week-04/empty-but-live.md` + screenshots) |
| FL-04 — Automation Workflow | Done (manual comparison run executed 2026-07-31 — see fl-04-automation-workflow.md § Manual Run Comparison) |
| FL-05 — Agent Concepts & MCP | Done (screenshot filename reference fixed to the actual file on disk) |

### Known Gaps (genuine, not documentation nitpicks)

For each item below, the implementation is not in question — these are optional-evidence or packaging notes, not open implementation work, except FL-04 item 1 which is a genuine unexecuted task.

1. **FL-04 (implementation gap):** Resolved 2026-07-31 — the manual comparison brief for the Frontend Tooling theme was executed (assisted search + manual brief, ~3 min) and written into `fl-04-automation-workflow.md` (§ Manual Run Comparison), with an honest comparison vs the NotebookLM Run 3 output and a transparency note on the assisted execution method.
2. **FL-05 (evidence packaging):** Resolved 2026-07-31 — `fl-05-agent-concepts-mcp.md` §8 now references the actual file on disk (`screenshots/Screenshot 2026-07-28 213811.png`) and the MCP tool-call evidence (`screenshots/MCP-EVIDENCE.md`).
3. **FE-06 (optional supporting evidence):** Implementation is complete and verified (`app/api/chat/route.ts`, `app/assistant/page.tsx`). One static screenshot (`assistant-streaming-chat.png`) is on file; an additional screenshot or GIF of the stop-mid-stream state would make the *evidence* more complete, but is not required to consider the assignment done.
4. **Empty but Live (submission packaging only):** Resolved 2026-07-31 — explicit pointer written at `week-04/empty-but-live.md` naming the live URL (https://plinth-cyan.vercel.app/explore, verified 200) that satisfies the milestone, plus screenshot evidence (`week-04/screenshots/explore-empty-but-live.png`, `playground-components.png`).

Do not rebuild any of FE-05, FE-06, FL-04's core workflow, or FL-05's MCP integration — all four are functionally complete. Do not treat items 2–4 above as reasons to reopen implementation.

---

## Capstone Vision

- **Purpose:** Plinth is a gallery-style "museum" platform where developers get exhibit pages for their shipped projects, eventually with an AI curator guiding visitors.
- **Repository-verified fact:** `docs/architecture.md` and `docs/roadmap.md` are committed directly to `main`. No second, unmerged "future architecture" branch or folder was found anywhere in the filesystem locations accessible for this audit (checked `.git/refs/heads`, the `PROJECTS/` directory, and the `ROADMAPS/` directory).
- **Project Context (asserted by project owner, not independently verifiable from this repository):** A broader Plinth architecture and vision has been planned outside the currently merged implementation. The repository intentionally represents only the current internship implementation at this stage; the fuller architecture is expected to be brought in incrementally as future milestones land, not merged wholesale. Future AI assistants should treat this as stated project intent rather than a claim they can confirm by inspecting the repo — the absence of a visible second architecture in the repository is not evidence that no such planning exists elsewhere (e.g., outside version control). Conversely, this note is also not proof that such planning exists in a specific, detailed form — treat it as the owner's stated direction, and ask the owner directly if precise architectural details are needed for a specific task.
- **Guidance for future assistants:** Do not recommend prematurely merging, redesigning, or "reconciling" the current implementation against an assumed future architecture. Do not conclude the future vision "does not exist" simply because it isn't represented in this repository — and do not assert specifics about it beyond what's written here or confirmed by the owner.
- **Future milestones** (from `docs/roadmap.md`, unmodified):
  - [x] Milestone 1 — Museum Foundation (Week 3)
  - [ ] Milestone 2 — Museum Entrance
  - [ ] Milestone 3 — Reception
  - [ ] Milestone 4 — AI Communication Layer *(FE-06's streaming chat is the concrete first piece of this)*
  - [ ] Milestone 5 — Curator Intelligence *(FL-05's MCP research is the concrete first piece of this)*
  - [ ] Milestone 6 — Galleries
  - [ ] Milestone 7 — Collections
  - [ ] Milestone 8 — Discovery
  - [ ] Milestone 9 — Public Beta

---

## Project Timelines

This section exists to prevent future assistants from treating current assignments and the long-term capstone as two competing or conflicting implementations. They are one roadmap at different stages of realization.

### Timeline A — Current Internship Implementation

- **Purpose:** Satisfy FlyRank AI internship weekly assignments (FE-05, FE-06, Three Roads, Empty but Live, FL-04, FL-05, and future weeks) while building the real, deployed first slice of Plinth.
- **Current deployment:** [plinth-cyan.vercel.app](https://plinth-cyan.vercel.app), built from `week-03/app/` on `main`.
- **Status:** Repository-verified. Milestone 1 (Museum Foundation) complete; Week 4 assignments complete or near-complete (see Known Gaps above). This is the active, present-tense codebase.

### Timeline B — Long-Term Plinth Direction

- **Purpose:** The eventual full museum platform — AI curator, galleries, collections, discovery, public beta — per the milestone list in `docs/roadmap.md`.
- **Current implementation status:** *(Project Context, not repository-verified)* Planned outside the currently merged implementation; not required to exist as code in this repository yet. What *is* repository-verified is the milestone roadmap itself and the architectural principles in `docs/architecture.md`.
- **Expected integration strategy:** *(Project Context)* Incremental — each week's assignment is intended to become a real piece of Timeline B (e.g., FE-06's chat route becomes the Curator Agent's base in Milestone 5), rather than Timeline B being built separately and swapped in wholesale later. Timeline A does not get discarded or replaced by Timeline B; it grows into it.

**For future assistants:** these are not two competing codebases to reconcile. Timeline A is the current, real state of Timeline B's foundation. Do not propose merging "Timeline B into Timeline A" as if they were separate branches to unify — per repository evidence, there is only one branch, and the correct mental model is incremental evolution, not merge.

---

## Reusable Components

Verified to exist in `week-03/app/` and explicitly marked reusable in source docs (mainly `playground/NOTES.md`):

| Component / Module | Location | Reuse note |
|---|---|---|
| Modal | `playground/modal.tsx` | Reuse as exhibit media lightbox; needs portal + close animation added |
| Tabs | `playground/tabs.tsx` | Reuse as gallery filter tabs; needs Plinth color tokens |
| Disclosure | `playground/disclosure.tsx` | Reuse as-is for curator notes expand/collapse |
| Streaming Chat UI | `app/assistant/page.tsx` | Becomes the Curator Agent's chat surface (Milestone 5) |
| AI Route | `app/api/chat/route.ts` | Becomes the base for the Curator Agent's server endpoint |
| Prompt System | `lib/ai/prompts.ts` | Extend with curator-specific prompts |
| AI Config | `lib/ai/config.ts` | Single-source model config; swap model here only |
| AI Provider abstraction | `lib/ai/provider.ts` | One-line provider swap point (currently thin — reference only, actual call is raw `fetch` in `route.ts`) |
| Primitives (Frame, Spotlight Button, Ghost Button, Museum Tag Label, Floor Directory) | `components/primitives/` | Already Plinth-branded, used across live routes |

Focus-trap and roving-tabindex logic (currently inline in `modal.tsx`/`tabs.tsx`) are **planned** extractions (`lib/hooks/useFocusTrap.ts`, `lib/hooks/useRovingTabIndex.ts`) per `NOTES.md` — not yet extracted. Listed here as a known, deliberate next step, not a gap.

---

## Temporary Assignment Artifacts

Exist only to satisfy internship deliverables — not part of the final museum:

- `playground/` route and its NOTES.md (the *components* inside get reused; the playground page itself is a demo harness, not a museum route)
- `week-04/fl-04-automation-workflow.md` + NotebookLM screenshots
- `week-04/fl-05-agent-concepts-mcp.md` + MCP-EVIDENCE.md (the *concepts* and *Plinth connection plan* carry forward; the Magic UI MCP tool-call evidence itself is submission proof, not production code)
- `week-04/task-2-stack-rationale.md` (decision record, not code)
- All `week-0X/README.md` and task write-ups

---

## Remaining Week 4 Work

Only genuine, unfinished items:

1. ~~Run the manual (no-AI) comparison brief for FL-04's Frontend Tooling theme and complete that row of the tracking table.~~ **Done 2026-07-31.** *(Implementation gap — resolved.)*
2. ~~Fix the FL-05 screenshot reference (rename file or update the doc to point at `Screenshot 2026-07-28 213811.png`).~~ **Done 2026-07-31 — §8 now references the actual PNG + MCP-EVIDENCE.md.** *(Evidence packaging — resolved.)*
3. Optional: add one more piece of FE-06 evidence (stop-mid-stream state) to strengthen submission — not required for implementation completeness. *(Optional supporting evidence.)*
4. ~~Optional: add a short explicit note confirming which page/URL satisfies "Empty but Live."~~ **Done 2026-07-31 — `week-04/empty-but-live.md`.** *(Submission packaging — resolved.)*

Nothing else. No code rebuilding, no redesign, no re-implementation.

---

## Week 5 Starting Point

Development resumes from the current state of `week-03/app/` exactly as it stands today:

- Routes, primitives, playground components, AI chat route, and AI config module are all considered stable and reusable — build on top of them, don't rewrite them.
- Next milestone per `docs/roadmap.md` is **Milestone 2 — Museum Entrance** (landing experience, first impression, visitor context), followed by Milestone 3 (Reception).
- No merge is pending — there is no second branch to reconcile with `main` before Week 5 begins (see Project Timelines section above).
- Any Week 4 remaining-work items above can be closed out in parallel with Week 5 without blocking it — they are documentation/evidence tasks, not code dependencies.
