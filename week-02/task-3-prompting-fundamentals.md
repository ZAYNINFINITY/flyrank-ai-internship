# Prompting Fundamentals on Real Tasks v2 — README for Project Costing Module

**Task:** Write documentation for the Project Costing module (isolated SQLite add-on to POS-it).

---

## Baseline (naive, one-line)

**Prompt:** "Write documentation for my project costing module."

**Output:**
"# Project Costing Module

## Overview
This module allows you to track costs for your projects.

## Features
- Add projects
- Track costs
- View reports

## Installation
Install the module and configure it according to your needs.

## Usage
Use the module to manage your project costs effectively."

Completely generic — could be documentation for literally any costing tool in existence. Doesn't mention SQLite, isolation, POS-it, or anything real.

---

## Version 1 — Technique: role assignment

**Prompt:** "You are a senior technical writer who specializes in developer documentation for desktop software. Write documentation for my project costing module."

**Output:**
Similar structure, but tone shifted to be more precise and structured — added a "Prerequisites" section and used more formal technical language ("This module extends the core application via a modular architecture").

**What changed in the prompt:** Assigned a specific expert role.
**What actually improved in the output:** Tone got noticeably more professional/structured, and it added a section (Prerequisites) that wasn't asked for but is standard in real docs.
**What still failed:** Still entirely generic — the role change affected *how* it writes, not *what* it knows about the actual module.
**What to try next:** Give it the real facts about the module.

---

## Version 2 — Technique: context and motivation

**Prompt:** "You are a senior technical writer who specializes in developer documentation for desktop software. Write documentation for my project costing module. Context: this is a module I built for POS-it, an Electron desktop POS app. It's a strictly isolated add-on — it uses its own `project-costing.db` SQLite file, separate from POS-it's core database, so it doesn't risk breaking the main app. It's used to track costs for a contractor client's CCTV, Solar, and Lift installation projects. I'm writing this so that if I hand this project to another developer later, or revisit it in six months, the isolation decision and its reasoning is clear."

**Output:**
Docs now include a real "Architecture" section explaining the separate `project-costing.db` file and *why* it's isolated (risk containment for core POS-it), a "Scope" section naming the three project types, and the tone shifted from generic feature-listing to explaining design reasoning — closer to actual engineering documentation.

**What changed in the prompt:** Added the real facts (what it is, why it's isolated, who it's for) and the motivation (future-proofing for handoff).
**What actually improved in the output:** The document now explains *why* the architecture looks the way it does, not just *what* it does — which is exactly what documentation is supposed to do and the baseline completely missed.
**What still failed:** Structure is still just prose paragraphs under headers — no clear developer-facing sections like setup steps, file locations, or a schema reference someone could actually follow.
**What to try next:** Show it an example of the structure that's actually useful.

---

## Version 3 — Technique: few-shot examples

**Prompt:** [Version 2 prompt] + "Here's the kind of structure I want you to follow, based on a README I liked for another project:

```
# Module Name
One-line description.

## Why it exists
(the problem/reasoning)

## Architecture
(files, isolation boundaries, how it connects)

## Setup
(concrete steps)

## Known limitations
(honest, current)
```

Follow this shape."

**Output:**
Output now matches that exact shape — "Why it exists" section pulls directly from the isolation reasoning given earlier, "Architecture" lists the actual `project-costing.db` file and its boundary from POS-it core, "Setup" has numbered steps (even though generic placeholders, since no real setup steps were given), and "Known limitations" honestly states the module is still in development.

**What changed in the prompt:** Gave a concrete template/example structure to mirror.
**What actually improved in the output:** The document finally *looks* like real documentation instead of a generic wall of prose — headers match a shape a developer would actually expect, and it correctly reused the isolation rationale from earlier under "Why it exists" instead of restating generic boilerplate.
**What still failed:** The "Setup" steps are still invented/generic ("clone the repo, install dependencies") since no actual setup process was described.
**What to try next:** Force it to decompose into steps and only fill in what's actually known, flagging gaps.

---

## Version 4 — Technique: output structure (explicit formatting rules)

**Prompt:** [Version 3 prompt] + "Formatting rules: use actual markdown code blocks for any file paths or commands. Keep each section under 100 words. If you don't have enough information for a section (like exact setup steps), write '[NEEDS INPUT: describe X]' instead of inventing placeholder content."

**Output:**
Sections got tighter and more scannable. Critically, the "Setup" section now honestly returned "[NEEDS INPUT: exact install/setup steps for project-costing.db initialization]" instead of fabricating generic steps.

**What changed in the prompt:** Added explicit formatting constraints and a rule against inventing missing information.
**What actually improved in the output:** This fixed the exact problem flagged in Version 3 — instead of confidently making up fake setup steps, it now honestly flags the gap. That's a meaningfully more trustworthy document.
**What still failed:** The document is now correct but incomplete — still needs the real setup steps filled in by hand, which no prompt layer can solve since that information doesn't exist yet.
**What to try next:** Break the writing task itself into steps, so each part gets focused attention instead of one long generation pass.

---

## Version 5 — Technique: step decomposition

**Prompt:** "Let's do this in steps. Step 1: List the sections a README for an isolated SQLite module like this should have, and briefly say what belongs in each — don't write the content yet, just the outline. Step 2: Once I confirm the outline, write each section one at a time, following the context, template, and formatting rules already established above, flagging any section where real information is missing rather than inventing it."

**Output:**
Step 1 produced a clean outline (Overview, Why it exists, Architecture, Setup, Known limitations, Future modules) with a one-line description of each section's purpose, before writing anything — giving a checkpoint to confirm scope before full generation. Step 2 (after confirming) produced the same quality as Version 4, but with more deliberate section-by-section content since each was generated with focused attention rather than in one pass.

**What changed in the prompt:** Split the task into a plan-then-write loop instead of one shot.
**What actually improved in the output:** Having the outline as a checkpoint means catching a wrong-scope document before wasting a full generation — genuinely useful for a longer doc, less so for this short one. Here it didn't change the *content* much since Version 4 was already solid.
**What still failed (the honest "this didn't help much" moment):** For a document this short, step decomposition added an extra round-trip without meaningfully improving the final output over Version 4. This technique earns its keep on longer, more ambiguous documents — not a single-page README where the scope was already clear.
**What to try next:** Save decomposition for longer, multi-file documentation tasks; for a README this size, Version 4 is close to the ceiling.

---

## Cross-Model Comparison (Claude vs ChatGPT)

**This is a live comparison** — the final template was run on both models with identical input.

**Handling missing info — the main divergence.** Both models correctly refused to invent fake setup steps, which was the main risk this rule was meant to catch. But they handled granularity differently: Claude collapsed the entire "Setup" section into one `[NEEDS INPUT: ...]` line covering install/init/paths/commands together. ChatGPT split "Setup" into five separate subsections (Prerequisites, Database, Installation, Initialization, Configuration, Running the module), each with its own individually-flagged gap. ChatGPT's version is more useful here — it tells you exactly which five things are missing instead of one vague bundle, even though neither model invented content.

**Structure adherence — Claude followed the format rules more strictly.** The prompt capped each section at "under 100 words." Claude stayed close to that. ChatGPT's "Why it exists" and "Architecture" sections ran well past 100 words each (Architecture alone has two full paragraphs plus a bulleted benefits list and a bulleted project-type list before Setup even starts). The instruction was there, but ChatGPT prioritized completeness over the stated word limit.

**Tone.** ChatGPT leaned more into marketing-adjacent phrasing in the one-line description ("safely manages contractor project costs") than Claude did, despite neither being asked for that framing. Claude's version stuck closer to the plain, mechanical description given in context.

**Formatting choice.** ChatGPT wrapped every `[NEEDS INPUT: ...]` flag in its own fenced code block, even for single-line items — technically following the "use code blocks for paths/commands" rule but applying it more literally/aggressively than intended, since NEEDS INPUT notes aren't paths or commands.

**Verdict:** ChatGPT's output was more granular and arguably more actionable for the Setup gaps specifically, but Claude followed the explicit length constraint more faithfully. Neither model fabricated content — the rule against inventing information held on both platforms, which is the property that matters most for documentation someone else might trust.

---

## Final Reusable Template

"You are a senior technical writer for developer documentation.

Context: [what the thing is, why it exists, the key architecture/design decision and its reasoning, who will read this].

Follow this structure:
```
# [Name]
One-line description.

## Why it exists
## Architecture
## Setup
## Known limitations
```

Formatting rules: markdown code blocks for paths/commands, each section under 100 words, and if information for a section is missing, write '[NEEDS INPUT: describe what's missing]' instead of inventing content.

First, output just the section outline for confirmation. Once confirmed, write each section using only what's been given above."
