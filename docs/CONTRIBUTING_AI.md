# Contributing (AI Assistants)

This file is for AI coding assistants (Claude, OpenCode, or others) working in this repository. Read it before making changes.

## Read First

1. **`docs/REPOSITORY_STATE.md`** — current state of the repo: what's done, what's a gap, what's temporary vs. reusable, and the Week 5 starting point.
2. **`docs/DECISIONS.md`** — why things are built the way they are, plus a **Do Not** section of guardrails. Read this before proposing any change that touches architecture, deployment, or completed assignments.
3. **`week-05/vision-validation.md`** — long-term architecture & design vision (planning context only; it does not change the current plan or authorize refactoring). Reference it for direction, but follow the existing roadmap.

## Core Distinctions

- **Assignment artifact vs. capstone artifact:** Some code exists only to satisfy an internship deliverable (`playground/` demo route, NotebookLM docs, stack-rationale write-ups). Other code is a real, permanent piece of Plinth (AI route, chat UI, primitives, accessible components). `REPOSITORY_STATE.md`'s Capstone State table marks which is which — check it before assuming something is disposable or permanent.
- **Repository-verified fact vs. Project Context:** Some statements in these docs are confirmed directly from repo contents. Others (mainly around the long-term Plinth architecture) are labeled "Project Context" because they reflect the owner's stated intent and can't be verified by inspecting this repository alone. Don't collapse that distinction in either direction — don't treat Project Context as unconfirmed fact, and don't treat it as false just because it isn't in the repo.

## Ground Rules

- **Preserve completed work.** Don't rebuild, refactor, or "improve" a finished assignment (FE-05, FE-06, Three Roads, Empty but Live, FL-04, FL-05) without being asked. If you find a gap, check whether it's an actual implementation gap or just missing evidence/packaging — `REPOSITORY_STATE.md` distinguishes these explicitly.
- **Extend architecture rather than replacing it.** New work should build on `lib/ai/*`, the primitives in `components/primitives/`, and the playground components — not introduce a parallel implementation.
- **Ask before major refactors.** Renaming modules, restructuring routes, or changing the deployment/branch strategy should be confirmed with the project owner first, even if it looks like an improvement.
- **Don't audit repeatedly.** If `REPOSITORY_STATE.md` already answers "is X done," trust it unless you have a specific reason to re-verify (e.g., you're about to build directly on top of X).
- **Update, don't overwrite, project memory.** If you complete one of the "Remaining Week 4 Work" items or start a new milestone, update `REPOSITORY_STATE.md` and `DECISIONS.md` incrementally rather than regenerating them from scratch.
