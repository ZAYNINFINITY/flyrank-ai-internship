# General AI Fluency · Impact Project

**Type:** Capstone · **Code:** FL · **Track:** General AI Fluency · **Week 6 · 12h**
**Intern:** Zain Ul Abideen
**Live site:** https://plinth-cyan.vercel.app
**Repo:** https://github.com/ZAYNINFINITY/flyrank-ai-internship

---

## What this capstone asks

A portfolio stops proving anything new once it never gets a second project.
This capstone installs the one habit that turns a class artifact into a career
platform:

1. A **concrete "how to add the next case" note** (not a vague intention),
   reusing the Week-2 three-beat shape — *problem → what I did → what came of it*.
2. A **specific next real piece of work named**, with a **real reminder set**
   (calendar nudge / recurring note).
3. The **build context preserved** (Claude Project) so the next case is a short
   conversation, not a rebuild.

---

## 1. The impact project itself (attached brief)

Foyer is an open digital museum where developers exhibit their work as curated
gallery rooms — not card grids or thumbnail clusters. Every project gets a
dedicated space with architectural presence: a scrollable corridor, an exhibit
room with text walls and media, and an AI curator that answers questions about
what's on display. It auto-detects device capability: powerful devices walk
through a Three.js museum; lower-end or accessibility-first devices get the
same content as a clean 2D layout with an "Accessible view" toggle. The AI
curator is powered by OpenRouter (Gemini Flash) through a custom `exhibitLookup`
tool that pulls live data from the repository layer. It is open-source, deployed
on Vercel, and built so that anyone — not just one developer — could exhibit
their work.

**Problem it solves:** developer portfolios are all the same — card grids,
thumbnail clusters, identical layouts. Projects deserve a presentation with
presence, like a real gallery.

**Audience / who it serves:** developers who want to showcase work with real
presence; visitors who want to explore projects the way they explore a gallery.

(Full brief: `week-08/project-brief.md`.)

---

## 2. The named next piece of work — and why

**Named next piece: Foyer itself.** The real next contribution to this platform
is taking it from a working prototype to a place other developers can sign up to
and exhibit in.

Why this is honest and not a vanity answer: the projects already listed in the
exhibit (POS-it, Collaborative Workspace, ZSE Store, ScrollStreak) are
**already-built personal projects** — they are *content* poured into the
platform, not the next thing to build. The thing that actually still needs doing
is the platform itself. That is the next case study.

It also matches this capstone option's framing exactly — a personal brand built
on a real website, shipping a personal agent (the AI curator).

### The three-beat shape for this next case (problem → what I did → what came of it)
- **Problem:** Foyer currently shows seed data — no stranger can sign up, create
  their own exhibit, or publish their work. That is the gap between "demo" and
  "platform".
- **What I did (planned):** give it real data and real authors — swap the mock
  repositories for a real database behind the existing repository interfaces,
  add GitHub OAuth sign-in, exhibit create/edit/delete, and image uploads.
- **What comes of it:** a stranger can sign up, build an exhibit, and share a
  public profile — turning Foyer from a class artifact into a career platform.

---

## 3. Concrete "how to add the next case" note

The next case goes into **Foyer's own project list** and the next feature goes
into the **data layer**. Exact steps (each maps to a real file, not a guess):

1. **Store the exhibit/case** — real developer profiles + exhibits replace seed
   data. `week-03/app/lib/mock-data/exhibits.ts` and `lib/seed/exhibits.ts` are
   today's source of truth; the repository layer
   (`lib/repository/mock-*-repository.ts`) is the seam where a real database
   swaps in behind the same interfaces (Phase 1 of the roadmap).
2. **Write the case's three-beat story** — each exhibit's `story` field, and
   each `Project` entry, already carries the **problem → what I did → what came
   of it** shape. New cases follow the same field, same beats.
3. **Add the media** — optimized WebP in `app/public/images/...`, referenced by
   `image` + `imagePosition`. (The compression standard is already established.)
4. **Verify** — `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
   all green; CI gates it too.
5. **Ship** — feature branch → commit → push → `gh pr create --base main` →
   wait for the `ci` check → `gh pr merge --merge --delete-branch`. Never commit
   straight to `main`.

This exact path (without replacing the seed data) is already implemented — it is
how every existing case got into the museum.

---

## 4. Evidence of the real reminder set

I didn't just write about a reminder — I installed reminders:

| Reminder | What it is | How to verify |
|---|---|---|
| **Windows Scheduled Task** `Foyer-Add-Next-Case-Reminder` | Daily 4:00 PM, pops a notification box with the exact next steps | `Get-ScheduledTask -TaskName Foyer-Add-Next-Case-Reminder` (State: Ready) |
| **Calendar note** `foyer-add-next-case.ics` | Recurring weekly event "Add next case study — Foyer real data", importable to Outlook/Google | File: `week-08/foyer-add-next-case.ics` |
| **GitHub Issue #17** | Timestamped tracking issue for the next Foyer contribution | https://github.com/ZAYNINFINITY/flyrank-ai-internship/issues/17 |
| **Recurring note in docs** | "Plan to keep building" roadmap — Phase 1 + reminder section | `week-08/plan-to-keep-building.md` |

Two independent, executable reminders (OS-level task + calendar note), plus the
tracking issue and the doc note — the habit is installed, not promised.

---

## 5. Build context preserved (Claude Project)

The whole identity kit lives in the repo, so the next case is a short
conversation, not a rebuild:

- `week-03/app/components/ops/theme.ts` — the single visual-identity token file
  (warm-editorial palette, Georgia serif + monospace system)
- `week-03/app/app/globals.css` — global theme tokens
- `CLAUDE.md` at the repo root — project conventions, stack, and rules for AI
  assistants (the repo-level conventions file)
- `git log` + the merged PR trail — proof of how everything was built

Because all of this is saved, "take Foyer to real data" is a short conversation
with the build partner — the context, voice, and identity kit are already loaded.

---

## 6. Evidence gallery (the live portfolio)

Real full-page captures of the live site — the visual identity the next case
inherits, so it stays consistent (frame the work, never upstage it):

| # | Screenshot | What it shows |
|---|---|---|
| 1 | ![About](img-foyer-about.png) | About — warm-editorial identity |
| 2 | ![Explore](img-foyer-explore.png) | Explore — same identity, consistent |
| 3 | ![2D home](img-foyer-2d-home.png) | 2D home — the framed museum |

---

## Master submission links (table)

Copy into the portal's **"Deliverable links"** field (one http(s) URL per line).

| Item | Submittable link |
|---|---|
| **▶ Primary — this impact-project deliverable** | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/gai-impact-project.md` |
| Project brief | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/project-brief.md` |
| Plan to keep building (next-case roadmap + reminder) | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/plan-to-keep-building.md` |
| Reminder script (Scheduled Task source) | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/foyer-add-case-reminder.ps1` |
| Calendar note (.ics) | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/foyer-add-next-case.ics` |
| Screenshot — About | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/img-foyer-about.png` |
| Screenshot — Explore | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/img-foyer-explore.png` |
| Screenshot — 2D home | `https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/img-foyer-2d-home.png` |
| Live site (context for reviewers) | `https://plinth-cyan.vercel.app/about` |
