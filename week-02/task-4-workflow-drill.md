# WORKFLOW.md — AI-Assisted Workflow Drill

**Feature:** Project Costing Settings form (Company Name, Tax Rate, Default Currency) — a scratch/standalone build mirroring the real settings form needed in POS-it's Project Costing module, done in an isolated repo rather than the production codebase.

## Round 1: Vague Prompt

**Prompt used:** "Make a settings form for project costing."

**What I got:** Three uncontrolled-feeling text inputs, no labels (only placeholders), a save button that logs to console and pops an `alert()`. No validation of any kind — tax rate accepts any string, including empty, negative, or non-numeric input, and it "saves" regardless.

## Round 2: Precise Prompt

**Prompt used:** Specified exact fields and their validation rules (Company Name 2-60 chars, Tax Rate 0-100, Default Currency one of PKR/USD/AED), required `react-hook-form` + `zod` (no uncontrolled inputs), required real `<label>`s linked via `htmlFor`/`id`, required `aria-invalid` + visible errors, gave one example behavior (empty tax rate → specific error, no submit), and ended with a verification instruction: write it, then write and run tests covering valid submit, empty required field, out-of-range tax rate, and invalid currency.

**What I got:** A `react-hook-form` + `zod` component with real labels, `aria-invalid`/`aria-describedby` wiring, and inline error messages tied to each field. Four tests were written and run.

## Correctness

Round 1 has **zero validation** — it will happily "save" a tax rate of `"abc"` or `-500`, because nothing checks the value before the save handler fires. Round 2 rejects all of that at the schema level before submission is even attempted.

Round 2 also surfaced a real bug during the verification step: the initial schema used Zod's older `errorMap`/`invalid_type_error` API, but the installed `zod` version is v4, which replaced that with a unified `error` parameter. The old API didn't throw — it silently fell back to zod's default error text instead of the custom messages, which is a worse failure mode than a crash because it looks like it's working until you read the message text closely. Running the tests caught this immediately (3 of 4 tests failed with unexpected error text); a purely vague, "trust the output" round-one workflow would never have caught it, since Round 1 has no tests at all.

## Accessibility

Round 1: inputs use `placeholder` as the only field label, which disappears the moment a user types and isn't reliably read by screen readers as a label. No error states exist to communicate at all.

Round 2: every input has a real `<label htmlFor>` tied to a matching `id`, `aria-invalid` toggles based on validation state, and `aria-describedby` points at the specific error message so assistive tech announces it. This wasn't something I had to catch after the fact — it was in the prompt's constraints from the start, which is the actual lesson: accessibility has to be a stated constraint, not an afterthought review comment.

## Edge Cases

Round 1 doesn't define any edge case behavior — it wasn't asked to. Round 2 explicitly required and tested: empty required field, tax rate outside the valid 0-100 range, and an invalid currency value forced onto the field (simulating a bad/injected value). All three are now handled and covered by a passing test, plus a fourth test for the valid/happy path.

## Review Effort

Round 1 took seconds to generate and *feels* faster — but reviewing it meant manually checking every field for missing validation, accessibility, and error handling, none of which is visible just by reading the eight-line component; you'd only find the gaps by trying to break it by hand.

Round 2 took longer to prompt and generate, including one real debugging pass (the zod v4 API issue above). But the review effort afterward was almost zero — the tests already prove the validation boundaries work, so I don't have to manually re-verify them. This matches the mentor tip directly: Round 2 felt slower up front, but was faster end-to-end once review and manual testing time for Round 1 is counted.

## AI Mistake Caught

The zod `errorMap`/`invalid_type_error` API mismatch above — the AI generated code using an older Zod API pattern than the version actually installed, and it failed silently (wrong error text) rather than throwing an error. The verification step (writing and running tests) is what caught it; without that step, this would have shipped and only surfaced as a support issue when a real user saw a generic message instead of an intended one.
