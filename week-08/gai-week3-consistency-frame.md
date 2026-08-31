# Consistency, Not Talent — Visual Identity & Image Judgment (Week 3)

**Assignment:** General AI Fluency — "Consistency, Not Talent (and Frame, Not Upstage)"
**Intern:** Zain Ul Abideen
**Live URL:** https://plinth-cyan.vercel.app (About + Explore + 2D home share one identity)

## The skill: judgment, not talent

This week is about choosing well. Great-looking portfolios aren't built by
talent — they're built by a few deliberate, repeatable decisions applied
consistently. Here are the choices I made for Foyer, why each one makes it
feel intentional instead of amateur, and how I judged AI's image output.

## 1. The few simple choices that make it feel intentional

I locked a tiny, shared system and reused it on every page — a single
`theme.ts` token file driving About, Explore and the 2D engine room.

| Decision | Choice | Why it works |
|---|---|---|
| **Palette** | Warm editorial: parchment `#F5F0E7`, ink `#2E2821`, one clay accent `#C94F0A` | Few, warm, human colours. A restrained palette reads as considered; a rainbow reads as amateur. |
| **Typography** | Georgia serif for headings, monospace for eyebrows/labels | Serif = "editorial/journal" voice. Monospace eyebrow = "system/engineer" label. One heading voice + one label voice is enough. |
| **Spacing & borders** | Generous white space, uniform 3 px radius, hairline `rgba(46,40,33,0.12)` borders | Consistent rhythm + thin borders = calm and intentional. |
| **Texture** | One faint paper-noise background (2.5 % opacity) on every page | A shared texture makes pages feel like one place, not separate tabs. |

No page invents its own colours — the code greps clean: **about + explore use
zero hardcoded hex codes**; everything pulls from the shared `S` theme. That
*consistency* is the whole assignment.

## 2. Frame, Not Upstage

The design's job is to **frame the work, never upstage it**.

- The layout gives every project "a room, not a card" — generous space and
  quiet borders so the *content* is what you notice, not the chrome.
- The design recedes: no loud gradients, no decorative clutter, one muted
  accent used sparingly (eyebrows and arrows only).
- The body text is muted to ~55 % ink so the images and headings carry the
  proof. The frame disappears; the work stays.

## 3. Judging images: real screenshots beat generated when they serve the proof

This is where the "judgment" lives. AI can generate a hundred images a minute;
the real skill is choosing which one **serves the proof** and rejecting the rest.

**What I kept (real screenshots of my own work):**
- The story beats — `problem`, `idea`, `what-broke`, `what-shipped` — are
  real captures from the actual museum walk. These are the proof: a visitor
  sees the real thing, not a decorative illustration.
- The about gallery (`entrance`, `corridor`, `reception`) are real screenshots
  of the built museum rooms.

**Why real beats generated here:** a portfolio's job is to convince someone the
work exists and works. A generated image *replaces* proof with a fantasy; a real
screenshot *is* the proof. For "the thing I built," a screenshot always wins.

**What I used AI image generation taste for, and rejected:** the "dev sketch"
(`dev`) is a stylised portrait, not a fake screenshot of the product — I kept
one, framed it in an arched paper mount with a multiply blend so it sits *in*
the theme rather than shouting over it. Everything decorative that did not
serve the proof was cut.

## 4. Making them "belong together"

All images share the same treatment so the set reads as one collection:
- Converted to **WebP** and downscaled (93–98 % smaller) so they load together.
- Framed uniformly (same border, same rounded corners, same spacing rhythm).
- Warm tones match the parchment palette via the multiply-blend treatment.

Colour grading + identical framing is what makes a set of images "belong
together" — that's the consistency rule applied to pictures.

## 5. AI transparency — where AI was my build partner

I built the shader hero, the museum renderers, and this site with Claude as my
build partner, and I checked myself:
- **I chose the palette and type** — the "taste" decisions were mine.
- **I judged the images** — I kept real screenshots over generated prettiness
  because they serve the proof, and I rejected anything decorative that
  upstaged the work.
- **I verified everything** — typecheck, lint (0 errors), 74 tests, and a build
  pass confirm AI-generated code compiles and works, not just "looks right."

## Where the system lives

- `week-03/app/components/ops/theme.ts` — the single identity token file
- `week-03/app/app/about/page.tsx` + `explore/page.tsx` — pages using the identity
- `week-03/app/public/images/{about,story}/*.webp` — the chosen, optimized set
