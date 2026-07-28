# Task 2 — Three Roads: Choose Your Stack with AI

**Assignment:** Three Roads — Choose Your Stack with AI (Week 4)
**Track:** General AI Fluency
**Intern:** Zain Ul Abideen

---

## Constraints Given to AI

1. **Free only** — no paid hosting, no paid APIs for core functionality
2. **Honest skill level** — strong React/JavaScript, learning Next.js patterns, comfortable with Tailwind
3. **Portfolio needs** — display projects as gallery-style exhibits (not card grids), image-heavy, smooth transitions, responsive
4. **How work must be displayed** — image galleries, embedded demos, code repo links, long-form reading per project
5. **Dynamic?** — not yet. Static content for now, AI interaction planned for later weeks

---

## Three Stack Options

### Option 1: Astro + Markdown/MDX

**How to build:** Content in MDX files, Astro renders static pages. Islands architecture for any interactive components.

**Hosting:** Cloudflare Pages (free tier, unlimited bandwidth).

**Backend needed:** No.

**Trade-off:** Fastest page loads, simplest content model. But adding React components later (chat interface, streaming AI) means fighting Astro's islands model. Interactive features feel bolted on, not native.

### Option 2: Vite + React SPA (Single Page Application)

**How to build:** Client-side React app with React Router. All rendering in browser.

**Hosting:** Vercel or Netlify (free tier).

**Backend needed:** Yes, eventually — API routes for AI interaction would require a separate server or serverless functions.

**Trade-off:** Maximum control over every pixel. But SEO is weak (client-rendered), first paint is slow, and adding a backend later means restructuring the entire app. No server components, no API routes built in.

### Option 3: Next.js + React 19 + Tailwind CSS v4

**How to build:** App Router with Server Components by default. Client Components only where interactivity is needed. Tailwind for styling.

**Hosting:** Vercel (free tier, native Next.js support, preview deployments on every push).

**Backend needed:** Built in — API routes live inside the app. No separate server.

**Trade-off:** Heavier initial setup than Astro. Slightly more complex than a plain SPA. But: server components mean fast first paint, API routes mean AI integration is a file not a restructure, and Vercel deployment is one click.

---

## Pressure Test

**What breaks if I pick the simplest (Astro)?**
When I need to add the streaming AI chat interface (Week 5 assignment), I'd need to install React as an "island" and wire it manually. The AI SDK assumes a Node.js server environment. Astro can do it, but it's fighting the framework.

**What do I maintain if I pick the most powerful (Next.js)?**
The framework itself. Server components, App Router patterns, API route conventions. But these are patterns I need to learn anyway for modern frontend work.

**Can I finish in two weeks?**
Yes. Next.js scaffolding is fast. The real work is content and design, not framework setup.

**Does it show my work the way it needs to be shown?**
Yes. Image galleries work via `next/image`. Long-form reading works with server-rendered content. Responsive is native with Tailwind. AI streaming works via API routes + `useChat`.

---

## Decision

**Chosen: Next.js + React 19 + Tailwind CSS v4**

**Why:**

The portfolio needs to display projects as gallery-style exhibits with images, smooth transitions, and eventually an AI-powered museum guide. Next.js gives me server components for performance, API routes for AI integration, and Vercel for zero-config deployment. The backend is already built in — no restructuring needed when AI features arrive.

Astro is simpler but would require fighting the framework when interactive features arrive. A Vite SPA gives maximum control but no server-side story. Next.js is the middle ground that scales from static pages to AI-powered experiences without a rewrite.

**Can I maintain this?** Yes. Next.js is well-documented, widely used, and Vercel handles hosting/deployment.

**Does it show my work well?** Yes. Server-rendered pages load fast. Image optimization is built in. Responsive is native. AI streaming is a natural extension, not a hack.

---

## Alternatives Considered

| Stack | Why Not |
|-------|---------|
| Astro + MDX | Great for content, but adding React interactivity later means fighting the framework. No built-in API routes for AI. |
| Vite + React SPA | Maximum control, but no server story. Adding backend means restructuring. Weak SEO. |

Both are good options for different projects. For a portfolio that needs to evolve from static exhibits to AI-powered experiences, Next.js is the right foundation.
