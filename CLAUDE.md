# Project Conventions

## About

This repo tracks weekly deliverables for the FlyRank AI Frontend AI
Engineering internship (8 weeks), plus the capstone portfolio build.

## Stack (capstone build)

- React + Vite
- TypeScript
- Tailwind CSS
- Node/Express (if backend needed)

## Conventions

- Weekly work lives in `week-01/` through `week-08/`
- Commits: Conventional Commits format (`feat:`, `fix:`, `docs:`, `chore:`)
- Components (once capstone code starts): PascalCase, one per file
- Documentation: Markdown, one file per task, named `task-N-description.md`

## Notes for AI assistants working in this repo

- Keep weekly folders self-contained — don't cross-reference internal
  client/project specifics that aren't meant to be public
- Prioritize honest, specific documentation over generic filler

## Rules learned (Week 2 — FE-03 Workflow Drill)

- Forms use `react-hook-form` + `zod`, never uncontrolled inputs managed
  by hand with `useState` per field. Enforced by test: every form
  component must have a test asserting invalid submissions are blocked.
- Every form input must have a real `<label htmlFor>` linked to a
  matching `id` — placeholders are never a substitute for labels.
  Enforced by test: `getByLabelText` must succeed for every field.
- Check the installed major version of a validation/schema library
  (e.g. `zod`) before writing custom error-message syntax — the
  error-customization API changes between major versions and mismatches
  fail silently instead of throwing. Enforced by: running the test suite
  before committing.
