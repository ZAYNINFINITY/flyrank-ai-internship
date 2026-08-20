# Reflection — Ship It Capstone

## What was hardest?

The 3D-to-2D renderer seam. Getting a Three.js scene and a flat React component to render the same content — with the same data, same interactions, same feel — without one becoming a degraded copy of the other. The first attempt was an orbit diorama that felt like a toy. The second attempt (scroll-rail corridor) worked because the 2D path became a first-class citizen, not a fallback. The capability gate (`lib/renderer/capability.ts`) decides at mount time which renderer to use, and both paths consume the same data layer. Making that seam invisible to the visitor was the hardest architectural decision in the project.

## What would I do differently?

Start with the 2D fallback architecture from day one. I spent the first two weeks building the 3D scene and then tried to bolt 2D on afterward. If I'd designed the data layer and component hierarchy around "two renderers, same data" from the start, the renderer seam would have been a clean interface instead of a refactoring project. The lesson: design for the constraint first, then build the experience.

## One thing that surprised me

AI integration was easier than expected. The hard part wasn't the chat interface or the streaming — it was designing the tool schema. Once `exhibitLookup` had the right input shape (id, collection, query — all optional, validated with Zod), the model naturally asked the right questions. The prompt barely needed tuning. What surprised me was how much the tool design mattered: a bad schema means the model guesses wrong, a good schema means the model feels smart. The engineering was in the schema, not the prompt.

## What I'd tell the next intern

Ship the ugly version first. My first corridor was hideous — grey boxes, no textures, no lighting. But it worked. And because it worked, I could iterate on the visual layer without worrying about breaking the interaction model. If you wait for it to look good before you ship it, you'll never ship it.
