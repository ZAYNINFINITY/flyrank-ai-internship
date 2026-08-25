# Contributing to Foyer

Thanks for thinking about contributing. Foyer is in early development (Week 3 of a public build), so the best way to contribute right now is:

## Getting started

1. Fork the repo
2. Clone your fork
3. `cd week-3/app && npm install`
4. `npm run dev` to start the dev server
5. Create a branch for your change
6. Make your changes, verify with `npm run build`
7. Open a pull request

## What's needed

- **Real screenshots** — the exhibit pages currently show placeholder frames. If you're a user, replace them with your actual project screenshots.
- **Accessibility fixes** — contrast, focus states, keyboard navigation improvements
- **Responsive edge cases** — anything that breaks at 375px, 768px, or 1280px
- **Documentation** — improving the README, adding examples, clarifying the architecture

## Code style

- TypeScript only
- Tailwind CSS for styling (no inline styles, no CSS modules)
- Functional components, no class components
- Keep components in `components/primitives/` — these are the building blocks
- Mock data lives in `lib/mock-data/` — structured as if it came from a real API

## Good first issues

Once the project matures, watch for issues labeled `good first issue`. For now, the project is moving fast and the best way to help is to test it on real devices and report what breaks.

## Questions?

Open an issue or reach out on GitHub.
