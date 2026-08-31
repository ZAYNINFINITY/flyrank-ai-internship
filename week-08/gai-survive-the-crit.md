# Survive the Crit — Design Review

**Assignment:** General AI Fluency — "Survive the Crit" (Week 6)
**Intern:** Zain Ul Abideen
**Live URL:** https://plinth-cyan.vercel.app
**Proof statement:** Foyer is an open digital museum for developers — every
project gets a room, not a card. It exists to prove that a project archive can
feel like a place, not a list, and that a developer can present work in a way
that tells the story behind what was built.

## The two questions I asked the reviewer first

> **In ten seconds: what do I do?**
> "You build digital museums for developers — a more human way to show off
> programming projects instead of a card grid."

> **Would you believe I'm good at it?**
> "Yes, because the product itself is doing the talking — it's not empty. It
> has a real 2D + 3D walkable museum, story beats with images, and it actually
> works."

## Raw feedback (collected without defending)

- The About page images were huge and made the page feel heavy on mobile —
  "it lags when I scroll."
- The self-story ("what I do / about the capstone") was spread across pages;
  it wasn't obvious in ten seconds what the person behind it does.
- The design and copy read as one coherent museum, which was the strong point.
- "I believed it was real because I could click through a real museum, not
  read a CV."

## Sorted: must-fix vs. nice-to-have

### Must-fix
1. **Huge unoptimised images** → slow, laggy on mobile. → Fixed: compressed
   every About/story image to WebP (93–98% smaller; ~5.4 MB → ~160 KB on About).
2. **One clear action missing** — a visitor who liked the work had no obvious
   next step. → Fixed: added a working **contact form** ("Get in touch") so the
   one action — reach the person — is obvious and real.

### Nice-to-have (deferred, not blocking)
3. Physical-device screenshot verification (used viewport emulation instead).
4. A one-line "what I do" tagline on the home chooser (currently implied by the
   museum itself).

## Evidence the must-fixes are addressed on the live site

- Must-fix 1: all About/story images now ship as tiny WebP files; verified in
  the deployment build and live page weight.
- Must-fix 2: the About page now ends with a working "Get in touch" section
  that submits to Formspree and reaches the owner — a real test submission was
  sent as evidence.

## How I engaged with the feedback
I took the feedback without pushing back — the two must-fixes were legitimate
(readability/perf and a missing call-to-action), and I fixed both rather than
explaining why the page was "fine as is."
