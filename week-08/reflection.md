# Reflection — Ship It Capstone

## What was hardest?

The 3D-to-2D renderer seam. Getting a Three.js scene and a flat React component to render the same content — with the same data, same interactions, same feel — without one becoming a degraded copy of the other. The first attempt was an orbit diorama that felt like a toy. The second attempt (scroll-rail corridor) worked because the 2D path became a first-class citizen, not a fallback. The capability gate (`lib/renderer/capability.ts`) decides at mount time which renderer to use, and both paths consume the same data layer. Making that seam invisible to the visitor was the hardest architectural decision in the project.

## What would I do differently?

Start with the 2D fallback architecture from day one. I spent the first two weeks building the 3D scene and then tried to bolt 2D on afterward. If I'd designed the data layer and component hierarchy around "two renderers, same data" from the start, the renderer seam would have been a clean interface instead of a refactoring project. The lesson: design for the constraint first, then build the experience.

## One thing that surprised me

AI integration was easier than expected. The hard part wasn't the chat interface or the streaming — it was designing the tool schema. Once `exhibitLookup` had the right input shape (id, collection, query — all optional, validated with Zod), the model naturally asked the right questions. The prompt barely needed tuning. What surprised me was how much the tool design mattered: a bad schema means the model guesses wrong, a good schema means the model feels smart. The engineering was in the schema, not the prompt.

## What I'd tell the next intern

Ship the ugly version first. My first corridor was hideous — grey boxes, no textures, no lighting. But it worked. And because it worked, I could iterate on the visual layer without worrying about breaking the interaction model. If you wait for it to look good before you ship it, you'll never ship it.

## What I'd tell the Week-1 me

The Week-1 me thought I was building a 3D museum. I wasn't. I was building a data layer with two front doors, and I only realised that after the renderer seam nearly sank the project. If I could sit that version of myself down, I'd say three things.

First: the machine is not the project. I spent two weeks polishing a Three.js corridor before I'd written a single repository interface. The corridor was the easiest part to make pretty and the least important to get right. Scratching the surface — the schema, the tight loop of the tool design, the shared `SurfaceLayout[]` both renderers consume — was where the real engineering lived. Beauty is a layer over substance, and I kept trying to lay it first.

Second: a constraint is a design input, not a limitation to apologise for. "Two renderers, same data" sounded like a compromise. It turned out to be the most interesting architectural decision in the whole build, because it forced me to make the data layer and every interaction renderer-agnostic. The hard path was the right path; I just needed the weeks of hindsight to see it as opportunity instead of tax.

Third, and most uncomfortable: my definition of "done" was wrong. I called it done when it looked impressive on my own machine. Real done is a stranger cloning the repo, a Lighthouse run clearing 99, a CI gate that catches my own regressions, a demo that works on a phone. The first two weeks of Week-8 were me unlearning the Week-1 habit of mistaking my own demo for a shipped product.

I wouldn't change what I built. I'd change how early I started thinking about how it would be received and reproduced — not as an afterthought in the final week, but as the very first constraint in Week 1.
