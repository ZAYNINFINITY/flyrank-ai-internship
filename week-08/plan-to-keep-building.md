# Plan to Keep Building — Foyer Post-Capstone Roadmap

## Where Foyer is today

Foyer is a working prototype that proves the concept: developers can exhibit their work in a spatial museum experience, not a card grid. The core loop works — 3D corridor, exhibit frames with reveal shader, AI curator, accessible fallback, 74 tests, deployed on Vercel.

What it is NOT yet: a platform where other developers can actually sign up, create exhibits, and publish their work. That's the gap between "demo" and "product."

## Phase 1 — Real data (1-2 weeks)

**Goal:** Replace seed data with real developer profiles and exhibits.

| Task | What it means |
|------|---------------|
| Database swap | Replace mock repositories with Prisma + PostgreSQL (one-line swap thanks to repository pattern) |
| Auth | NextAuth.js with GitHub OAuth — developers sign in with their GitHub account |
| Exhibit CRUD | Dashboard where developers create/edit/delete their own exhibits |
| Image uploads | Cloudinary or S3 for exhibit images and media |
| Real exhibits | Add 5-10 real projects from the developer community |

**Why this matters:** Right now Foyer has 3 developers and 5 exhibits. Real data makes it a real museum.

## Phase 2 — Public launch (2-3 weeks)

**Goal:** Any developer can join, exhibit their work, and share a public profile.

| Task | What it means |
|------|---------------|
| Public profiles | `/exhibit/[username]` shows a developer's full exhibit page |
| Custom URLs | Developers get `foyer.dev/[username]` or custom domains |
| Share cards | Open Graph meta tags so shared links render rich preview cards |
| Search + browse | `/explore` with filters: technology, collection, developer |
| Notifications | Email digest when new exhibits are added to collections you follow |

## Phase 3 — Museum features (ongoing)

**Goal:** Make the museum feel alive and curated, not just a collection of pages.

| Feature | What it means |
|---------|---------------|
| Curated exhibitions | Featured collections curated by community members |
| Opening nights | Time-limited events where new exhibits are "unveiled" with live chat |
| Visitor analytics | Developers see how many people visited their exhibit, how long they stayed |
| Comments/reactions | Visitors can leave reactions on exhibits (no heavy comments — keep it museum-like) |
| Themes | Dark mode, light mode, different museum architectural styles |

## Technical debt to address

| Issue | Priority | Effort |
|-------|----------|--------|
| Physical device testing | High | 2-3 hours |
| Lighthouse in CI | Medium | 1 hour |
| Error tracking (Sentry) | Medium | 2 hours |
| E2E tests for full flow | Medium | 3-4 hours |
| 3D model optimization (LODs) | Low | 4-6 hours |
| Mobile touch gesture refinement | Low | 2-3 hours |

## What I learned building this

The hardest part was not the 3D or the AI — it was the seam between them. Making a Three.js scene feel like a real product (not a demo) requires the same rigor as any frontend: error states, loading states, accessibility, testing. The 2D fallback architecture was the most important architectural decision — it turned "3D or nothing" into "3D as progressive enhancement."

## Success signal

Foyer is ready to keep building when:
- [ ] A stranger can sign up, create an exhibit, and share it without asking me for help
- [ ] The museum has 10+ real developers with real projects
- [ ] The AI curator can answer questions about any exhibit in the museum
- [ ] The 3D experience loads in under 3 seconds on a mid-range phone
