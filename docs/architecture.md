# Plinth Architecture

Technical architecture for Plinth — the digital museum for developer projects.

## Frontend

- **Framework:** Next.js 16 (App Router, Server Components by default)
- **UI:** React 19
- **Styling:** Tailwind CSS v4 (OKLCH color tokens via `@theme inline`)
- **Fonts:** Space Grotesk (headings), Inter (body)
- **Design:** 3-color palette (text, background, accent), accent once per screen max

## Museum Engine

- **World graph:** `lib/museum/world.ts` — declarative `Building → Floor → Wing → Room → Door → Surface → Anchor` model with typed helpers (`door()`, `anchor()`, `room()`), indexes, and lookup helpers.
- **Types & domain:** `lib/museum/types.ts` — `RoomKind`, `EntityType`, `LightingPreset`, `AnchorCapability`, visitor/placement types.
- **Spatial queries:** `lib/museum/queries.ts` — current room, visible doors, connected rooms, surface layout, wing lookups.
- **Placement:** `lib/museum/placement.ts` — capability-based `canPlace`, `createPlacementMap`, `populateCorridor` (exhibit corridor population, with optional pre-fetched exhibit list).
- **Visitor state:** `lib/museum/visitor.ts` — `createVisitor` / `enterRoom` (current room + entry direction).
- **Navigation:** `lib/museum/navigation-adapter.ts` — `routeMap` (RoomId → URL), `getRoute`/`getRoomIdByRoute`, door entry preserved via `?via=<doorId>`, plus `getPortfolioRouteForExhibitId` (exhibit ↔ long-form bridge). `lib/museum/use-door-entry.ts` reads `?via=` for entry transitions. `lib/navigation/museum-layout.ts` — direction model (`ahead`/`left`/`right`/`back`/`exit`).
- **Renderer:** `components/renderer/` — `WorldRenderer` (room + doors + surfaces + spatial breadcrumb), `DoorRenderer`, `SurfaceRenderer`, `RoomShell` (lighting + transition per `RoomKind`), `EntityView` with an `EntityRegistry` (`defaultEntityRegistry` covers exhibit, artifact, projection, signage, timeline, terminal, statue; unregistered types render a placeholder).
- **Lighting/atmosphere:** `components/museum-space.tsx` — `LightingPreset` → `data-museum-space` CSS space attribute.
- **Museum routes:** home → `/entrance` → `/reception` → `/gallery` (Main Corridor, `?collection=` filtering), `/collection`, `/exhibit/e/[id]` (museum room), `/exhibit/[username]` (long-form portfolio), `/assistant` (Curator chat). `/dashboard` linked in footer; `/playground` and `/health` remain dev utilities by design.

## AI Layer

- **Provider abstraction:** `lib/ai/provider.ts` — single model export, one-line provider swap
- **Prompt abstraction:** `lib/ai/prompts.ts` — system prompts separated from logic
- **Config:** `lib/ai/config.ts` — model name, params, all AI settings
- **Streaming:** `app/api/chat/route.ts` → `useChat` client hook (AI SDK `streamText` + `createOpenAICompatible` → OpenRouter)
- **Tools:** `lib/ai/tools/exhibit.ts` — `exhibitLookup` tool, Zod `inputSchema`, structured `Exhibit[]` output
- **Repository seam:** `lib/repository/index.ts` — `getExhibitRepository()`; tools depend on the `ExhibitRepository` interface only
- **Chat UI:** `components/ai/` — reusable `ChatPanel`, `ToolStateViews` (4 tool states), `ExhibitToolResult`, `ChatErrorBanner` (error classification + SDK-native retry/dismiss), `ErrorBoundary`
- **Provider:** Google Gemini (free tier), swappable to OpenAI/Groq/OpenRouter

## Future

- **Curator intelligence:** context-aware guide (visitor's room, path, visible doors), MCP integration (GitHub, filesystem, database, documentation)
- **GitHub integration:** Live project data, repo stats, contribution history
- **Collections:** Developer profiles, project grouping, discovery paths
- **Discovery:** Search, recommendations, visitor journey tracking
- **Long-term vision:** See `week-05/vision-validation.md` — Plinth evolves toward a reusable storytelling platform (content model `Creator → Portfolio → Projects → Exhibits → Museum Views`) while the museum stays the first experience. This is direction, not committed work.

## Principles

- **Provider agnostic** — swap AI providers in one line in `provider.ts`
- **Performance first** — server components, minimal client JS, image optimization
- **Progressive enhancement** — works without AI, better with it
- **Experience over features** — museum feel > feature checklist
- **Extension points over monoliths** — every module designed to be extended, not modified
