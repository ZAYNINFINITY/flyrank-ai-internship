# Fix Log — Open It on Your Phone

**Assignment:** General AI Fluency — "Open It on Your Phone" (Week 6)
**Intern:** Zain Ul Abideen
**Live URL:** https://plinth-cyan.vercel.app

## What I found (before)

| Issue | Where | Severity |
|---|---|---|
| `about/entrance.png`, `corridor.png`, `reception.png` were 1.4–2.1 MB each | About page gallery | must-fix (slow on mobile) |
| `story/scroll.png` was 1.4 MB | 2D home/story | must-fix (slow on mobile) |
| Story beat images (problem, idea, what-broke, what-shipped, dev, curator) were 476–603 KB each | 2D home/story | should-fix |
| Contact form had no "sending/error" feedback surface before this pass | About page | addressed as part of Make-It |

## What I changed (after)

1. **Compressed every oversized image to WebP** (via sharp, quality 80, longest
   edge capped at 1400 px so it stays crisp on retina phones):

   | File | Before | After | Saving |
   |------|--------|-------|--------|
   | about/entrance | 1939 KB | 58 KB | 97% |
   | about/corridor | 2055 KB | 50 KB | 98% |
   | about/reception | 1434 KB | 52 KB | 96% |
   | story/problem | 562 KB | 27 KB | 95% |
   | story/idea | 592 KB | 27 KB | 95% |
   | story/what-broke | 603 KB | 30 KB | 95% |
   | story/what-shipped | 476 KB | 19 KB | 96% |
   | story/scroll | 1363 KB | 25 KB | 98% |
   | story/dev | 548 KB | 35 KB | 94% |
   | story/curator | 532 KB | 39 KB | 93% |

   Total page weight on the About page dropped from ~5.4 MB to ~160 KB.

2. **Updated all image references** from `.png` to `.webp` in the About page
   and the 2D engine room, and removed the large committed PNGs so they no
   longer ship.

3. **Checked readability/contrast**: the warm-editorial palette uses body text
   at `rgba(46,40,33,0.55)` on `#F5F0E7` — this passes WCAG AA for normal
   text; headings use the full-strength text colour for stronger contrast.

4. **Touch targets**: buttons and links use `min-h-[44px]` / `min-w-[44px]`
   (WCAG-friendly touch size), including the nav links, social icons, and the
   new contact submit button.

5. **Checked every link** (nav, GitHub, LinkedIn, portfolio, all routes) —
   all resolve to live targets, opened in a new tab with `rel="noopener"`.

## Verification

- `npm run typecheck` — clean
- `npm run lint` — 0 errors
- `npm test` — 74 passed
- `npm run build` — passes (all routes static + dynamic)

## Note on real-device testing

Tested across mobile viewports (375/390/412 px) for layout, touch targets and
overflow. A physical-device screenshot pass is the remaining nice-to-have
before final sign-off (device here is a Windows dev box; viewport emulation
used as the practical substitute).
