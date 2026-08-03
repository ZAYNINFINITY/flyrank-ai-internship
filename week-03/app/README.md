# Plinth

A room for every project you've shipped.

Plinth is an open-source platform where developers create gallery-style exhibit pages for their projects — not card grids, not thumbnail clusters. Each project gets a dedicated room with space to tell the story behind what was built.

> **Status:** Week 3 of a public build-in-progress. This is a skeleton — authentication, real data, and the full exhibit creation flow are not wired up yet. The exhibit pages, responsive layout, and design system are functional.

## What's built so far

- **Landing page** — three-beat entrance with the platform's claim and exhibit previews
- **Explore page** — grid of live and upcoming exhibits
- **Exhibit page** — room-by-room layout for a single developer's projects (Zayn's real projects are the demo content)
- **Dashboard / Login** — honest placeholders showing what's coming
- **Health check** — renders mock data, proving the data-fetching pattern works
- **About** — what Plinth is and why it exists
- **404** — in-voice, not a generic error

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- TypeScript
- Space Grotesk + Inter (via `next/font/google`)

## AI tool contract

Plinth's chat route (`app/api/chat/route.ts`) exposes one server-side tool to the model via the AI SDK's `streamText`:

| Name | Schema (`inputSchema`) | Return shape |
|------|------------------------|--------------|
| `exhibitLookup` | `{ id?: string, collection?: string, query?: string }` — all optional, validated with Zod (`lib/ai/tools/exhibit.ts`) | `Exhibit[]` — `{ id, title, tagline, developer, year, collection, media }` |

The tool resolves data through the `ExhibitRepository` interface (`lib/repository/index.ts`), so swapping the mock source for real data is a one-line change. Tool lifecycle states (input-streaming / input-available / output-available / output-error) render as distinct UI in `components/ai/tool-state-views.tsx`.

## Getting started

```bash
# Clone the repo
git clone https://github.com/ZAYNINFINITY/plinth.git
cd plinth/week-3/app

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx                  # Root layout, fonts, nav, footer
  page.tsx                    # / (platform landing)
  explore/page.tsx            # Grid of exhibits
  exhibit/[username]/page.tsx # Dynamic exhibit route
  dashboard/page.tsx          # Placeholder dashboard
  login/page.tsx              # Placeholder auth form
  health/page.tsx             # Mock data rendering
  about/page.tsx              # About Plinth
  not-found.tsx               # 404 page
components/
  primitives/                 # Reshaped UI components (Frame, Spotlight Button, etc.)
lib/
  mock-data/                  # Exhibit content (swap for real API later)
  utils.ts                    # cn() utility
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started.

## License

MIT — see [LICENSE](LICENSE).
