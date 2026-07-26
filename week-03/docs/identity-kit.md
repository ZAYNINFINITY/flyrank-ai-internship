# Identity Kit

## Fonts

| Role | Font | Weight(s) | Loaded via |
|---|---|---|---|
| Headings — anything a visitor should remember | Space Grotesk | 500, 700 | `next/font/google` (self-hosted automatically, zero layout shift, no external request) |
| Body — anything a visitor should read comfortably | Inter | 400, 500 | `next/font/google` (same treatment) |

Why these two: Space Grotesk is geometric without being cold — it has personality at large sizes without becoming distracting. Inter is the default body choice for a reason: it's legible at small sizes, scales cleanly, and disappears when it should disappear. The pairing gives Plinth a distinct voice at the top of the hierarchy and quiet readability everywhere else.

---

## Palette

Three colors. That's it. No secondary palette, no gradient definitions, no "surprise" accent. The restraint is the identity.

| Token | Hex | OKLCH (for Tailwind v4 `@theme`) | Usage |
|---|---|---|---|
| `--color-text` | `#0F172A` | `oklch(0.208 0.040 265.8)` | Primary text, borders, Frame borders. The only color that appears in every section of every page. |
| `--color-background` | `#FAFAFA` | `oklch(0.985 0.000 89.9)` | Page background, everything sits on this. Not pure white — the slight warmth keeps the gallery feeling alive rather than clinical. |
| `--color-accent` | `#2563EB` | `oklch(0.546 0.245 262.881)` | The spotlight. Used for exactly one thing per screen: a CTA, a highlighted title, a "LIVE" tag. Never as a background wash, never repeated as decoration. This rule is non-negotiable. |

### OKLCH conversion notes

Tailwind v4 uses OKLCH color values in its `@theme` directive, not raw hex or HSL. The values above were converted from the hex originals specified in the brief. If any color needs verification before the build, run both text/background and text/accent pairs through a WCAG contrast checker — the brief flags this as a hard requirement (4.5:1 for body text, 3:1 for large text).

---

## Logo / Favicon

The brief doesn't specify one, so this is a decision, not a reuse.

**Concept:** A minimal mark that works at 16×16 (favicon) and 32×32 (browser tab). Two options:

1. **Stylized "P"** — geometric, using the same stroke weight and angle logic as Space Grotesk. Single color (text or accent), no fills, no gradients. Works at any size.
2. **Abstract frame shape** — a single thin-border rectangle with a subtle offset, echoing "The Frame" component that forms the visual backbone of the entire site. More abstract, more distinctive, but harder to read at 16×16.

**Recommendation:** Start with option 1 (the "P"). It's safer at small sizes and more immediately recognizable. Option 2 can be explored as a secondary mark or social preview image later.

**Technical:** Generate as SVG for the favicon, export as PNG fallback. Place in `app/icon.tsx` (Next.js App Router convention for favicon).

---

## Style Note (two lines)

Gallery spotlight, not wallpaper — the accent blue appears once per screen, used for exactly one interactive element, never repeated as decoration. Typography does the heavy lifting: Space Grotesk at genuinely large sizes for the one-line claim, restrained Inter everywhere else, with generous negative space as the primary layout tool.

---

*This kit is the source of truth for Plinth's visual identity. Every component, every token, every design decision should trace back to these three colors, these two fonts, and this style note. If something isn't defined here, it doesn't exist yet.*
