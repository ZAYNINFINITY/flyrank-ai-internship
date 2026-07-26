# Through-Line

## One-Line Claim

**"A room for every project you've shipped."**

This is the one that matches the thing you're actually building. The gallery metaphor isn't decorative — visitors will literally be standing in rooms on `/exhibit/[username]`, scrolling through one project per full-viewport beat. The claim names that experience directly: a *room*, not a card, not a grid. It's calm and invitational, which fits Plinth's voice.

---

## Content Map

| Route | Purpose | CTA |
|---|---|---|
| `/` | Platform landing. Sells the *platform*, not Zayn. Sequence of full-viewport "beats" — entrance claim, exhibit concept explanation, explore prompt. No hero image, no feature grid, no pricing. Gallery pacing: one idea per screen. | Primary: "Create your exhibit" (Spotlight Button, accent fill, only colored element on Beat 1). Secondary: "Explore all exhibits" → `/explore` (Ghost Button, outline only). |
| `/explore` | Grid of exhibit slots. Mix of "Live Exhibit" slots (real content, clickable) and "Opening Soon" slots (placeholder, not clickable, visually distinct). Empty-state copy for when there are zero live exhibits. | "View exhibit →" text link on each Live slot. No CTA on Opening Soon slots. |
| `/exhibit/[username]` | Dynamic route. Single gallery-style exhibit page per user. Room-by-room scroll rhythm — one room per project, alternating image-left/image-right. Entrance room with name, role, floor directory. Isolated CTA at the end. | "Book a call" (Spotlight Button, accent fill) — only on Zayn's exhibit. This is the *only* place on the entire platform with this CTA. |
| `/dashboard` | Placeholder state. Honest preview, not a broken empty page. Explains sign-in isn't wired yet. | "Sign in" prompt → `/login`. |
| `/login` | Placeholder auth form. Labels, note that it's a stub. | Login/Sign up buttons (non-functional). |
| `/health` | Technical proof-of-concept. Fetches and renders mock JSON data, demonstrating the data-fetching pattern works. | None — this is a developer-facing route. |
| `/about` | About Plinth as an open-source project. Why it exists, why it's open-source. | GitHub link (primary). |
| 404 | In-voice message: "No exhibit here yet." Link back to `/explore`. Not a generic error page. | "Explore exhibits" → `/explore`. |

---

## Still Need to Gather

What's done, what's still needed. Most items are completed — the remaining blockers are real gaps that affect the exhibit page quality.

### Content Zayn Must Provide

- **Screenshots of his four projects.** POS-it, Collaborative Workspace, ZSE Store, ScrollStreak — each needs at least one clean, high-quality screenshot for the exhibit room frames. These cannot be faked or AI-generated; they're the proof that the projects are real.
- **One-liner identity line for the exhibit entrance room.** ✅ Appears under name in Room 0: "CS student @ PAF-IAST · MERN Stack Developer"
- **Per-project story copy (2–3 sentences each).** ✅ Extracted from `zainportfoli0.netlify.app`. POS-it, Collaborative Workspace, ZSE Store, ScrollStreak — real descriptions pulled, ready to trim for exhibit rooms.
- **Landing page supporting sentence.** ✅ Written and placed below the hero claim in Beat 1: "An open-source platform where any developer gets a gallery-style exhibit page for their projects — real space, real story, nothing competing for attention."
- **Landing page Beat 2 paragraph.** ✅ Written and placed above the preview thumbnails: "Every project gets a room of its own. Not a card in a grid, not a thumbnail in a cluster — a dedicated page with space to tell the story behind what you built. Plinth is open-source, and yours starts here."
- **Headshot/avatar photo.** Real photo needed — currently using placeholder with "Photo" label.

### Decisions to Make

- **Logo/favicon.** ✅ Concept decided in identity-kit.md: stylized "P" (geometric, single color, works at 16×16). Generated as `app/icon.tsx` using Next.js `ImageResponse`.
- **Which hero claim to ship.** ✅ Locked: "A room for every project you've shipped." Confirmed, matches the gallery metaphor and Plinth's non-adversarial voice.
- **Exhibit page final CTA heading.** ✅ Written: "Want to talk about working together?" — natural for Zayn's exhibit, generic enough for future users.
- **/about page copy.** ✅ Written — 3 paragraphs covering what Plinth is, the architecture metaphor, and why it's open-source.

### Technical Pre-work

- **Confirm project screenshots exist and are accessible.** If any of the four projects don't have usable screenshots yet, that blocks the exhibit room build. POS-it (Electron app) and ScrollStreak (browser extension) might need fresh captures.
- **Extract Zayn's current site copy.** ✅ Done — pulled from `zainportfoli0.netlify.app`. Real project descriptions available for all four exhibit projects.
- **App scaffolded and deployed.** ✅ Next.js 16, all 8 routes, build passes. Deploy to Vercel/Netlify pending.


