# Plinth

**An open digital museum for developers.**

Plinth is a platform where developers exhibit their work as curated gallery rooms — not card grids, not thumbnail clusters. Each project gets a dedicated space with architectural presence: a scrollable 3D corridor, an exhibit room with text walls and media, and an AI curator that answers questions about what's on display.

**Live:** [plinth-cyan.vercel.app](https://plinth-cyan.vercel.app)

## What it solves

Developer portfolios are all the same. Plinth gives projects the presentation they deserve — rooms, not cards. Visitors walk through a museum instead of scrolling a grid.

## Who it's for

Developers who want their work to feel like something more than a list of links. Visitors who want to explore projects like they explore a gallery.

## Getting started

```bash
git clone https://github.com/ZAYNINFINITY/flyrank-ai-internship.git
cd flyrank-ai-internship/week-03/app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Notes |
|----------|:--------:|-------|
| `OPENROUTER_API_KEY` | Yes | API key for curator chat ([openrouter.ai](https://openrouter.ai)) |
| `DATABASE_URL` | No | PostgreSQL connection (commented out — using mock repos) |
| `NEXTAUTH_URL` | No | Auth callback URL (not wired yet) |
| `NEXTAUTH_SECRET` | No | Auth secret (not wired yet) |

## Architecture

```
app/
  page.tsx                    # Homepage — 3D museum takeover on capable devices
  layout.tsx                  # Root layout, fonts, nav, footer
  about/page.tsx              # Museum language
  explore/page.tsx            # Grid of exhibits
  exhibit/[username]/page.tsx # Developer exhibit page
  assistant/page.tsx          # AI curator chat
  api/chat/route.ts           # OpenRouter streaming endpoint
  health/page.tsx             # Mock data rendering
  not-found.tsx               # Custom 404

components/
  ai/                         # ChatPanel, tool state views, exhibit tool results
  primitives/                 # Frame, MotionButton, nav overlay, footer
  renderer/                   # SurfaceRenderer (2D fallback), exhibit-walls seam
  three/                      # WalkableWorld, ExhibitRoom3D, walkable-player, input

lib/
  ai/                         # Config, prompts, tools (exhibitLookup), rate limiter
  museum/                     # World model, placement, collision, queries
  renderer/                   # Capability detection, useCapableRenderer hook
  repository/                 # Mock repos (developer, exhibit, collection, exhibition)
  seed/                       # Seed data (3 developers, 5 exhibits, 4 collections)
  types/                      # TypeScript types for all entities
  three/                      # Paper texture, reveal material
```

## AI integration

Plinth's curator chat (`app/api/chat/route.ts`) uses **OpenRouter** (Gemini Flash) with a custom `exhibitLookup` tool:

```typescript
exhibitLookup: { id?: string, collection?: string, query?: string }
```

All parameters are optional. The tool resolves data through the `ExhibitRepository` interface — swapping mock for a real database is a one-line change. Tool lifecycle states (streaming → available → error) render as distinct UI in `components/ai/tool-state-views.tsx`.

The model was chosen for cost efficiency. The hard part was the tool schema, not the prompt — a bad schema means the model guesses wrong, a good schema means the model feels smart.

**Rate limiting:** 20 requests per minute per IP. Input capped at 2000 characters per message, 20 messages per conversation.

## 3D + 2D renderer

The museum renders through a capability-gated seam:

- **3D path** (powerful devices): Scroll-rail corridor via Three.js + R3F. Approach → reception → corridor → exhibit. Door triggers, collision, gyroscope mobile controls, click-to-inspect.
- **2D path** (low-end / accessibility): Flat `SurfaceRenderer` with full ARIA support. "Accessible view" toggle inside 3D switches between paths.

`lib/renderer/capability.ts` decides at mount time based on WebGL2 support, `prefers-reduced-motion`, memory, and pointer type. Both paths consume the same data layer.

## Testing

```bash
# Unit tests
npx vitest run

# E2E tests
npx playwright test
```

74 tests across 10 unit test files + 1 Playwright e2e spec:

| Test file | Coverage |
|-----------|----------|
| `lib/repository/acceptance.test.ts` | Data architecture, search, filtering, referential integrity |
| `lib/museum/walkable-model.test.ts` | Collision, door triggers, spawn resolution |
| `lib/renderer/capability.test.ts` | Device tier detection |
| `components/ai/chat-panel.test.tsx` | Chat UI rendering |
| `components/ai/exhibit-tool-result.test.tsx` | Tool result display |
| `components/ai/tool-state-views.test.tsx` | Lifecycle state UI |
| `lib/museum/museum-logic.test.ts` | Museum logic |
| `lib/museum/via-entry.test.ts` | Door entry validation |
| `components/primitives/motion-button.test.tsx` | Motion button |
| `app/login/page.test.tsx` | Login page |
| `e2e/museum-flow.spec.ts` | Full museum flow (Playwright) |

## Lighthouse scores

| Route | Performance | Accessibility | Best Practices | SEO |
|-------|:-----------:|:-------------:|:--------------:|:---:|
| Home (/) | 100 | 100 | 100 | 100 |
| Entrance | 100 | 95 | 100 | 100 |
| About | 98 | 95 | 100 | 100 |
| Explore | 99 | 95 | 100 | 100 |

Average performance: 99.25. Accessibility = 95 on 3D routes because Three.js canvas has no ARIA labels; "Accessible view" toggle provides full 2D accessible path scoring 100.

## Known limitations

- **3D canvas has no ARIA labels** — Three.js WebGL limitation. "Accessible view" toggle provides full access.
- **No physical device testing** — Desktop + devtools mobile simulation only.
- **Lighthouse not in CI** — Manual run only.
- **No external error tracking** — Manual monitoring.
- **Auth not wired** — Dashboard and login are placeholders.

## Future improvements

- Real database (PostgreSQL) replacing mock repositories
- OAuth authentication with GitHub
- Public exhibit creation flow (developers submit their own projects)
- Rigged 3D curator character with walking animation
- Contextual curator buttons (location-aware guidance)
- Lighthouse in CI pipeline
- Physical device testing

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Three.js / React Three Fiber / drei
- Tailwind CSS v4
- TypeScript
- OpenRouter (Gemini Flash)
- AI SDK (`@ai-sdk/react`)
- Vitest + Playwright
- Vercel

## License

MIT
