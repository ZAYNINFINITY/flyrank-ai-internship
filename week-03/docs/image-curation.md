# Image Curation

## What the Site Actually Needs

Every image below is mapped to a specific route and component. If it's not listed here, it doesn't exist in the build.

### Exhibit Rooms (`/exhibit/[username]`)

The Room Block component (Section 5.4) pairs one image with text per project. Four rooms, four images.

| Project | Image needed | Source | Notes |
|---|---|---|---|
| POS-it | Screenshot of the Electron app UI (inventory screen, POS terminal view, or dashboard) | **Real capture** — Zayn must provide. Electron app, so needs to be captured from a running instance. | Should show the app in a usable state, not a loading screen. One clean screenshot, not a collage. |
| Collaborative Workspace | Screenshot of the MERN app (Kanban board, live chat, or document editor) | **Real capture** — Zayn must provide. Web app, easiest to capture from browser. | Preferably showing the real-time aspect (chat messages, multiple cursors, live Kanban state) if possible. |
| ZSE Store | Screenshot of the live e-commerce site (`zsesanitary.com`) | **Real capture** — can be pulled from the live site itself. | Product catalog or homepage. Should look like a real business site, not a dev server. |
| ScrollStreak | Screenshot of the browser extension (popup UI, overlay counter, or leaderboard) | **Real capture** — Zayn must provide. Browser extension, needs to be captured from a running instance with Reels open. | Should show the extension in context (browser toolbar, overlay on a Reel) rather than just the popup alone. |

**Hard rule:** All four must be real screenshots. No mockups, no AI-generated approximations, no placeholder images. The entire point of Plinth is that exhibits show real work — faking the screenshots defeats the purpose.

### Exhibit Entrance (`/exhibit/[username]`)

| Image needed | Source | Notes |
|---|---|---|
| Zayn's headshot/avatar | **Real photo** — Zayn must provide. Used in Room 0, circular or square-framed. | Not a generic avatar. A real photo, even a casual one, is more honest than an illustration. Should be square-cropped, minimum 256×256. |

### Landing Page (`/`)

| Image needed | Source | Notes |
|---|---|---|
| Exhibit preview thumbnails (2–3) | **Derived from real screenshots** — cropped/framed versions of the exhibit room images above. | These are the small "frames" in Beat 2. They should visually echo the Room Block images but at thumbnail scale. Not separate photos — same source images, cropped tighter. |

**No hero image.** Section 5.1 is explicit: "No hero image. No illustration. No gradient. If it feels empty, it's working." The landing page is typography-driven. This is a design decision, not an oversight.

### Favicon / Logo

| Image needed | Source | Notes |
|---|---|---|
| Favicon (16×16, 32×32) | **Generated** — SVG created from the stylized "P" concept in identity-kit.md. | Single color (text or accent), no fills, no gradients. Generated as SVG, PNG fallback. |
| `app/icon.tsx` | **Generated** — Next.js App Router favicon component. | SVG embedded in JSX, self-hosted by Next.js. |

### Explore Page (`/explore`)

| Image needed | Source | Notes |
|---|---|---|
| Live Exhibit slot thumbnails | **Same as exhibit preview thumbnails** — reuse from landing page. | One set of thumbnails serves both routes. |
| Opening Soon slot visuals | **None** — the brief specifies "no thumbnail image (empty frame interior, or a very subtle diagonal hairline pattern at ~5% opacity)." | Not a gray box, not a spinner, not "coming soon" text. The emptiness is the design. |

---

## Real vs Generated — Summary

| Category | Count | Rule |
|---|---|---|
| Real screenshots | 4 | One per project. Cannot be faked. |
| Real photo | 1 | Zayn's headshot/avatar. |
| Derived (cropped thumbnails) | 2–3 | Same source images as exhibit rooms, different crop. |
| Generated (SVG) | 1 | Favicon/logo. Technical asset, not photography. |
| **Total images in the build** | **8–9** | |

That's it. A gallery doesn't need a lot of images — it needs the right ones, given real space.

---

## Rejection Notes

### Rejected: Subtle diagonal pattern for empty "Opening Soon" frames

**What it was:** A generated SVG pattern — very fine diagonal lines at ~5% opacity, intended to fill the interior of empty exhibit frames on `/explore` so they don't read as pure white voids.

**Why it was rejected:** The brief already solves this better: "a very subtle diagonal hairline pattern at ~5% opacity — not a gray box, not a spinner, not 'coming soon' in giant text." The problem is that even at 5%, a pattern adds visual noise to a page that should feel calm and deliberate. The frames are *supposed* to look empty — that's the honesty. An empty frame that looks intentionally empty (thin border, white interior, "OPENING SOON" tag in gray) communicates the right message: "this slot exists, but nothing's here yet." A pattern says "we tried to make the emptiness pretty," which undermines the transparency mandate.

**Decision:** Empty interior. No pattern. Let the frame be a frame.

### Rejected: AI-generated "gallery interior" hero illustration

**What it was:** A conceptual illustration of a modern art gallery interior — clean lines, white walls, dramatic lighting, meant to reinforce the gallery metaphor on the landing page.

**Why it was rejected:** Section 3 is explicit: "No generic melted-glass/gradient-blob hero illustrations" and "No stock 'hero image of people pointing at a laptop' energy anywhere." A gallery illustration falls squarely into the first category — it's decorative, not structural. The gallery metaphor shows up in *how the page is built* (one room at a time, generous whitespace, deliberate pacing), not in a picture of a gallery. Adding an illustration would be like a museum putting a photo of a museum on its front door.

**Decision:** The landing page is typography-first. The metaphor lives in the layout, not in imagery.

### Rejected: Gradient accent wash for the final CTA section

**What it was:** A subtle blue-to-transparent gradient behind the "Book a call" CTA on the exhibit page — meant to create visual emphasis and draw the eye.

**Why it was rejected:** Section 5.3 says the final CTA is isolated: "Nothing else shares this screen — no footer links crowding it, no secondary CTA. One action, isolated." A gradient behind it would be decoration, not isolation. The accent blue is the spotlight — it appears once, as the button fill. Adding a gradient wash behind it would be the accent appearing *twice* (button + background), which violates the one-per-screen rule. The CTA's isolation is what gives it weight, not a gradient.

**Decision:** Clean white background, generous top padding, one filled button. That's the entire screen.

---

## What Zayn Needs to Provide (Before Build Can Start)

These are blocking items — the exhibit rooms can't be assembled without them.

1. **POS-it screenshot** — Electron app, captured from a running instance. One clean UI shot.
2. **Collaborative Workspace screenshot** — Browser-based, easiest to capture. Preferably showing real-time state.
3. **ZSE Store screenshot** — Can be pulled from `zsesanitary.com` directly.
4. **ScrollStreak screenshot** — Browser extension, captured with Reels open to show the overlay in context.
5. **Headshot/avatar photo** — Square-cropped, minimum 256×256, real photo.

---

*This document is the source of truth for Plinth's visual assets. Every image in the build should trace back to this list. If it's not here, it doesn't exist yet.*
