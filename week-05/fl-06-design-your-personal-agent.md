# FL-06 — Design Your Personal Agent

**Assignment:** Design Your Personal Agent (FL-06)
**Track:** Foundational
**Intern:** Zain Ul Abideen
**When:** Week 5 · **Workload:** 3h · **Phase:** Design
**Agent name:** **Project Guardian**
**Deliverable:** This design document — the blueprint FL-07 builds against.

---

## 1. Who is the human in the loop?

**User:** Zain Ul Abideen — CS student at PAF-IAST, MERN stack developer, FlyRank AI internship week 5-6, currently shipping the Foyer museum and preparing his Week 5 submission.

**What I actually have going on (so the agent can ground itself in real life):**

| Source | Path / URL | Notes |
|---|---|---|
| Personal projects | `D:\WORK - ARCHIVE\IMPORTANT CODING DATA AND PROJECTS\PROJECTS` | POS-it, Collaborative Workspace, ZSE Store, ScrollStreak, Streamer Dash |
| Internship repo | `D:\WORK - ARCHIVE\...\flyrank ai` | Active week 5 work, git repo, pushed to GitHub |
| Version control | `git log`, `git status` in each repo | The single most honest source of "what actually moved" |
| Task trackers | `TODOs.md` / todo files where they exist | Explicitly declared intent |
| Portfolio | `zainportfoli0.netlify.app` | PF-04 deliverable, needs to stay current |
| Career inbox | email / LinkedIn | internship + junior role leads (week 6+ focus) |

**How often:** **Weekly**, on a fixed cadence — every **Sunday evening** before the new week starts. Rationale: a weekly beat catches drift (three silent days) without the noise of a daily report; Sunday evening gives me a clean summary I can read Monday morning before the FlyRank week resets.

**What I do with the output:** read a 10-line summary, action the flagged blockers Monday morning, and ignore the rest. If I miss two consecutive weeks, the agent should nudge me rather than quietly accumulate.

---

## 2. What is the agent's job?

**Mission:** Each week, Project Guardian scans my real project + internship activity, produces a truthful status snapshot, and surfaces the **one or two things most likely to block me next week** — with a concrete next step for each.

**It is NOT a chatbot.** It has one job and one cadence. It does not chat; it reports.

**Inputs it reads (read-only):**
- `git log --oneline -20 --since=7 days` + `git status --short` in each repo
- TODO/task files if present (`*.md` named `TODO`, `TASKS`, `PLAN`, etc.)
- `week-05/submission-summary.md` and any open `week-0X` docs in the internship repo
- An optional `guardian.md` file I can drop notes into mid-week ("doing X, blocked by Y")

**Output it produces (write):**
- `guardian-report.md` — overwritten each week with:
  - **Status:** one line per active project (moved / stalled / new).
  - **Blockers:** things blocking progress, ranked. Each gets a *next step I can take in <30 min*.
  - **Next week's focus:** 1-3 items, derived from the data, not from vibes.
  - **Requested attention:** anything the agent cannot verify itself and needs me to confirm.

**Success signal:** after reading 3 minutes of output, I know exactly where my week stood and what to start on Monday. If a blocker existed that the report missed, it failed.

---

## 3. Tools and access

| Access | Level | Why |
|---|---|---|
| Read `git log` / `git status` in project + internship repos | **Read-only** | Truth source. Never writes to my repos, never auto-commits. |
| Read project files (TODOs, docs) | **Read-only** | Grounding + intent. |
| Write `guardian-report.md` | **Single file only** | The only file it owns. Overwrites its own report, nothing else. |
| Web (optional) | None in v1 | Keep the failure surface small; verifiable data > scraped data. Add later if needed. |
| Email/notifications | None in v1 | Weekly run is manual or scheduled; no background push. |

**Explicit NOs:**
- No `git commit`, `git push`, `git checkout`, destructive git ops. Ever.
- No writes outside `guardian-report.md`.
- No editing TODOs or docs — it *proposes* edits in the report, I apply them.
- No secrets: it never reads `.env`, keys, or `config` with credentials. (The internship repo has a `.env.example`; real keys stay out of reach.)

---

## 4. First draft of the agent instructions

```
You are Project Guardian, a weekly project-status agent for Zain, a CS student and
MERN developer in the FlyRank AI internship (Week 5-6).

You run exactly once per week, on Sunday evening. You are not a chatbot.

PROCEDURE
1. In the projects directory and the internship repo, run:
   - `git log --oneline -20 --since="7 days ago"` (project + internship repo)
   - `git status --short`
   - if `git log` is empty for a repo, mark it "no commits this week" — do not guess.
2. Look for any task/plan files (TODO*, PLAN*, TASKS*, guardian.md) in those repos.
   - `guardian.md` may contain the user's own mid-week notes; treat them as ground truth.
3. Build the report. For each active project, classify: MOVED (commits this week),
   STALLED (none), or NEW (first commit this week).
4. Find the 1-2 most likely blockers: a stalled item with recent prior activity,
   a broken build/test if detectable, an overdue deliverable mentioned in week-0X docs.
   For each blocker give a concrete next step the user can do in under 30 minutes.
5. Write `guardian-report.md` at the repo root. Structure:
     ## Week of <date>
     ### Status        (one line per project)
     ### Blockers      (ranked, each with a <30min next step)
     ### Next week     (1-3 concrete focus items)
     ### Confirm       (anything you could not verify; ask the user to confirm)

CONSTRAINTS
- Read-only on git. Never commit, push, rebase, or check out.
- Write to guardian-report.md only. Overwrite your previous report.
- Never read .env, key files, or anything credential-like.
- If you find a blocker but cannot name a next step, still report it but mark it UNVERIFIED.
- Be blunt and short. 10-15 lines of status, not paragraphs.
- Do not invent work. Empty repo = "no commits this week", not a hero story.
```

---

## 5. Five evaluation cases

| # | Scenario | Expected behavior |
|---|---|---|
| 1 | Repo had 7 commits, one project got no commits all week | Report shows MOVED for the busy repo, STALLED for the silent one; does not pad the silent one with invented progress |
| 2 | `guardian.md` says "blocked: AI tool flaky, spent 3 days debugging" | Report ranks this as the #1 blocker and proposes a concrete <30min next step (e.g. "log a real repro, then switch to the repo-seam fallback"), not generic advice |
| 3 | Git repo has no commits in 7 days but a plan file exists | STALLED, and the plan file is cited so the user can see what was *intended* vs *done* |
| 4 | User wrote 3 completed items into a TODO file with checkboxes | Report reflects the checked items as done and does not re-list them as blockers |
| 5 | Report generation fails partway (a repo is inaccessible / permission denied) | Agent says clearly which repo it could not read, instead of silently omitting it |

---

## 6. Guardrails

- **One file, one overwrite:** the agent's entire write surface is `guardian-report.md`. Anything else must be proposed, not performed.
- **Read-only git, always:** no command that changes repository state is allowed in the tool definition — the tools literally won't exist, not just discouraged.
- **No secrets:** credential files and `.env` are off-limits by construction; it reads code and git history only.
- **Truth over optimism:** an empty week is reported as an empty week. The whole point is that the agent cannot lie to me about drift.
- **Human confirmation:** anything it can't verify goes in the "Confirm" section, and the weekly run is mine to trigger or schedule.
- **Structured output:** fixed sections, hard length cap, no freeform essays.

---

## 7. Why this platform/design

- **Why a scriptable agent rather than a chatbot:** my problem is *drift detection across multiple repos*, not conversation. A periodic, read-only, single-file-write agent matches the job; a chat interface would just get in the way.
- **Why weekly, not daily:** a daily cadence produces noise I'll start ignoring. A Sunday-evening weekly beat is slow enough to see real movement and fast enough to catch a stalled week before it becomes a lost one.
- **Why git as the truth source:** git history is the one thing that cannot misremember. Task files are intent; git is fact.
- **Why a single owned file:** total write-surface control means the agent can't scatter junk through my projects. Everything it wants to change, it asks me to change.
- **Why v1 has no web/email:** a first agent should succeed on a small, verifiable surface. Web scraping and notifications are a Week 7+ upgrade, once the core loop is proven.

---

## 8. FL-07 build plan (what this blueprint unlocks)

- Implementation lives in `D:\WORK - ARCHIVE\...\PROJECTS\project-guardian\` as a small script + config (e.g. a Node.js script with an OpenAI/Anthropic function-calling tool or a Claude Code-style agent harness, decided at build time).
- Tool definitions are the hard guardrails from section 6: `read_git_log`, `read_git_status`, `read_file`, `write_guardian_report` — and nothing destructive.
- The five evaluation cases in section 5 are the test suite; the agent passes FL-07's Checkpoint 1 only when all five produce the expected output.
- Report template copied verbatim from section 4.
