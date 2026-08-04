# FL-07 — Build the Agent: Project Guardian (Checkpoint 1)

**Assignment:** Build Your Personal Agent (FL-07)
**Track:** Foundational
**Intern:** Zain Ul Abideen
**When:** Week 5 · **Workload:** 10h · **Phase:** Build
**Blueprint:** [`week-05/fl-06-design-your-personal-agent.md`](fl-06-design-your-personal-agent.md)

---

## Checkpoint 1: Agent works and is correct on real data

**Deliverable:** A working Project Guardian agent that runs on my real projects and produces a truthful weekly report — with the five FL-06 evaluation cases passing as its test suite.

**Location:** `D:\WORK - ARCHIVE\IMPORTANT CODING DATA AND PROJECTS\PROJECTS\project-guardian\` (its own git repo, commit `27f01e7`)

**How to run:**
```powershell
cd "D:\WORK - ARCHIVE\IMPORTANT CODING DATA AND PROJECTS\PROJECTS\project-guardian"
npm run    # scan configured repos, write + print guardian-report.md
npm test   # 5 eval cases, 16 assertions
```

---

## What was built

| Module | File | Job |
|---|---|---|
| Entry | `src/index.js` | loads config → scans repos → builds report → writes `guardian-report.md` |
| Scanner | `src/scanner.js` | read-only `git log --since` / `git status` / `rev-parse` + task-file & `guardian.md` discovery |
| Classifier | `src/classifier.js` | MOVED / STALLED / UNREADABLE classification + blocker ranking |
| Report | `src/report.js` | fixed-schema `guardian-report.md` template |
| Config | `guardian.config.json` | the only config: repo list, report path, task-file patterns |
| Tests | `test/eval-cases.js`, `test/helpers.js` | the five FL-06 evaluation cases as fixture-based assertions |

**Build decision (from FL-06 §8):** deterministic Node CLI, **no LLM dependency**. The evaluation cases are factual behaviors (repo classification, blocker ranking, checkbox counts) — a model call would add flakiness and API-key requirements without improving correctness. An LLM summarization step remains a deliberate future upgrade, not the Checkpoint 1 core.

---

## Guardrails honored (FL-06 §6)

- **Read-only git, always:** the scanner only ever runs `git rev-parse`, `git log --oneline --since`, and `git status --short`. No command that mutates repository state exists in the codebase.
- **One owned file:** the only write is `guardian-report.md`. `.gitignore` also excludes it so the report never pollutes the agent repo.
- **No secrets:** the scanner reads code and git history only; `.env` and credential files are not part of any scan.
- **Truth over optimism:** a repo with zero commits is reported STALLED — with its plan file cited — never padded into progress.
- **Human confirmation:** anything unreadable goes to the report's `## Confirm` section with the reason (`not a git repository`, permission error, etc.).

---

## Test suite: 16/16 passing

Run: `npm test`

| Case (FL-06 §5) | What it checks | Result |
|---|---|---|
| 1 — busy vs silent | MOVED vs STALLED classification; silent repo gets zero invented commits | ✅ 3/3 |
| 2 — guardian.md blocker | blocker detected, quoted, ranked first, has <30min next step | ✅ 4/4 |
| 3 — plan file, no commits | STALLED with the TODO.md plan cited; unchecked tasks = 0 done | ✅ 3/3 |
| 4 — completed checkboxes | 2 of 3 done counted correctly; no false guardian blocker | ✅ 2/2 |
| 5 — unreadable repo | reported as UNREADABLE with reason, not silently omitted | ✅ 2/2 |
| Extract helper | `blocked:` note parsing + null-safety | ✅ 2/2 |
| **Total** | | **✅ 16/16** |

---

## Live run on real repos (2026-08-04)

Ran `npm run` against the configured project list. Honest output:

```
- Collaborative Workspace: STALLED (intent exists) (dirty working tree)
- POS-it:                   STALLED (dirty working tree)
- POS-it Web:               STALLED (dirty working tree)
- ScrollStreak:             UNREADABLE
- FlyRank Internship:       MOVED
```

- **FlyRank Internship** correctly classified **MOVED** — it had commits this week (the FE-07/FE-08 submission work).
- **Collaborative Workspace** correctly classified **STALLED (intent exists)** — zero commits, but `TODO.md` present with 3 checked items, so intent exists.
- **ScrollStreak** correctly flagged **UNREADABLE** (`not a git repository`): the root is a monorepo container whose `.git` lives in none of the scanned subpaths — the report puts it in `## Confirm` rather than guessing.
- **No blockers invented:** with no `guardian.md` notes, the report honestly says *"None detected by the agent."*

This is the agent working as designed: it reports facts from real git history, flags what it cannot verify, and never fabricates progress.

---

## Evidence

- Agent repo: `PROJECTS\project-guardian\` (commit `27f01e7`)
- Test output: `npm test` → **16 passed, 0 failed**
- Live report: `PROJECTS\project-guardian\guardian-report.md`
- Design doc: [`week-05/fl-06-design-your-personal-agent.md`](fl-06-design-your-personal-agent.md)

**Status: Checkpoint 1 complete.**
