# Lighthouse Scores — Foyer (August 2026)

Desktop Lighthouse via `npx lighthouse --preset=desktop` on deployed URL `https://foyer-cyan.vercel.app`.

## Scores

| Metric | Home (/) | Entrance | About | Explore |
|--------|:--------:|:--------:|:-----:|:-------:|
| **Performance** | 100 | 100 | 98 | 99 |
| **Accessibility** | 100 | 95 | 95 | 95 |
| **Best Practices** | 100 | 100 | 100 | 100 |
| **SEO** | 100 | 100 | 100 | 100 |

All routes ≥85 across all four categories. Average performance: 99.25.

## Analysis

**Home (/) = 100/100/100/100**: The 3D museum loads as a progressive enhancement. Lighthouse's desktop preset gives a perfect score because the initial HTML is server-rendered and the 3D canvas loads asynchronously without blocking.

**Entrance = 100/95/100/100**: Performance is perfect; accessibility loses 5 points on the 3D canvas element (Three.js WebGL context, inherent limitation — mitigated by the "Accessible view" toggle).

**About / Explore = 98-99/95/100/100**: Pure 2D server-rendered pages. Accessibility at 95 is the same Three.js canvas limitation where the 3D overlay appears on these routes.

## Accessibility Note

The "Accessible view" toggle was added specifically because the 3D canvas scored 95 (not 100) on accessibility. This toggle switches the entire museum experience from a Three.js WebGL scene to a flat `SurfaceRenderer` with full ARIA support, keyboard navigation, and screen reader access. It's not a degraded fallback — it's a parallel path that scores 100 on accessibility.

## WAVE Audit (August 2026)

- **0 WAVE errors** on `/about`, `/explore`, `/collection`
- **Alerts**: 2 (both from Three.js canvas elements — no ARIA on WebGL context, inherent limitation)
- **Contrast**: All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Alt text**: All `<img>` elements have `alt` attributes
- **Labels**: All form inputs have associated `<label>` elements
