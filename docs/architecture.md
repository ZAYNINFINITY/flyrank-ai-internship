# Plinth Architecture

Technical architecture for Plinth — the digital museum for developer projects.

## Frontend

- **Framework:** Next.js 16 (App Router, Server Components by default)
- **UI:** React 19
- **Styling:** Tailwind CSS v4 (OKLCH color tokens via `@theme inline`)
- **Fonts:** Space Grotesk (headings), Inter (body)
- **Design:** 3-color palette (text, background, accent), accent once per screen max

## AI Layer

- **Provider abstraction:** `lib/ai/provider.ts` — single model export, one-line provider swap
- **Prompt abstraction:** `lib/ai/prompts.ts` — system prompts separated from logic
- **Config:** `lib/ai/config.ts` — model name, params, all AI settings
- **Streaming:** `app/api/chat/route.ts` → `useChat` client hook
- **Provider:** Google Gemini (free tier), swappable to OpenAI/Groq/OpenRouter

## Future

- **Museum engine:** Spaces, experiences, visitor flow (Entrance → Reception → Galleries)
- **Curator intelligence:** MCP integration (GitHub, filesystem, database, documentation)
- **GitHub integration:** Live project data, repo stats, contribution history
- **Collections:** Developer profiles, project grouping, discovery paths

## Principles

- **Provider agnostic** — swap AI providers in one line in `provider.ts`
- **Performance first** — server components, minimal client JS, image optimization
- **Progressive enhancement** — works without AI, better with it
- **Experience over features** — museum feel > feature checklist
- **Extension points over monoliths** — every module designed to be extended, not modified
