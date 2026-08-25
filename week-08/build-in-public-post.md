# Build in Public — Foyer: From Ugly Boxes to a Digital Museum

**Zain Ul Abideen (ZAYNINFINITY) · August 2026**

---

## The Story

Eight weeks ago, I had grey boxes in a Three.js scene and a dream about developers exhibiting their work like paintings in a museum. Today, Foyer is live — a scrollable 3D museum with an AI curator, sketch-to-paint reveal shaders, and 74 tests passing.

Here's what happened.

## Week 1–2: The Ugly Ship

My first corridor was hideous. Grey boxes. No textures. No lighting. Just a camera moving along a z-axis through rectangular rooms. It looked like a hospital hallway designed by someone who'd never been inside one.

But it worked. And that was the point. Ship the ugly version first. Get the interaction model right. Worry about beauty later.

**Lesson:** If you wait for it to look good before you ship it, you'll never ship it.

## Week 3: Data Architecture

I built the data layer first — TypeScript interfaces, seed data, repository pattern. Three developers, five exhibits, four collections. Real people, real projects, not placeholder "Lorem ipsum."

The key decision: make the repository interface swappable. Mock implementations return seed data today. PostgreSQL tomorrow. One-line change.

**Lesson:** Design for the constraint first, then build the experience.

## Week 4–5: AI Integration

The curator chat uses OpenRouter (Gemini Flash) with a custom `exhibitLookup` tool. The model can query any exhibit by ID, collection, or keyword.

The hard part wasn't the chat interface or the streaming. It was the tool schema. A bad schema means the model guesses wrong. A good schema means the model feels smart. The engineering was in the schema, not the prompt.

**Lesson:** AI integration is about tool design, not prompt engineering.

## Week 6: The Shader

I wrote a GLSL fragment shader that creates a brush-stroke sketch-to-paint reveal effect. When you approach an exhibit frame, the sketch layer dissolves from bottom to top with a noisy brush edge, revealing the painted content underneath.

This is the signature visual effect. Without it, exhibits are static textured planes. With it, the museum feels alive — each piece reveals itself as you approach, creating a sense of discovery that a card grid can never match.

**Lesson:** One good visual effect can define an entire experience.

## Week 7: 3D + 2D Seam

The hardest week. Getting a Three.js scene and a flat React component to render the same content — same data, same interactions, same feel — without one becoming a degraded copy of the other.

The solution: capability detection at mount time. `lib/renderer/capability.ts` checks WebGL2, `prefers-reduced-motion`, memory, and pointer type. Both renderers consume the same `SurfaceLayout[]` data. No duplication.

**Lesson:** Design for accessibility from day one, not as an afterthought.

## Week 8: Ship It

74 tests. Lighthouse 99.25 average. Vercel deployment. CI/CD pipeline. Rate limiting. Input validation. Error states verified. Rollback plan documented.

The capstone isn't about proving you can code. It's about proving you can ship. Real trade-offs. Real edge cases. Real documentation.

**Lesson:** The difference between a class artifact and a career platform is one simple habit: ship, document, iterate.

## What I'd Tell the Next Intern

1. **Ship the ugly version first.** Get the interaction model right. Beauty comes later.
2. **Design for the constraint.** Accessibility, performance, testing — build them in from day one.
3. **AI integration is about tool design.** The schema matters more than the prompt.
4. **Document everything.** README, deployment checklist, reflection. The documentation is the proof.

## What's Next

Foyer is a working prototype. What it's NOT yet: a platform where other developers can sign up, create exhibits, and publish their work. That's the gap between "demo" and "product."

Phase 1: PostgreSQL + OAuth + exhibit CRUD.
Phase 2: Public launch + custom URLs + search.
Phase 3: Curated exhibitions + visitor analytics.

The museum is open. Come visit: [plinth-cyan.vercel.app](https://plinth-cyan.vercel.app)

---

**Built with AI. Verified by hand. Shipped with confidence.**

*This post was written as part of the FlyRank AI Internship — Frontend AI Engineering track.*
