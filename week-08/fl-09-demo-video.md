# FL-09 — Demo Video (Script + Walkthrough)

## Video Status: ✅ Ready

**`week-08/demo-video-v2.mp4`** — 3 min 35 sec, 3.34 MB, 1280x1068, H.264

Auto-generated from 42 Playwright screenshots + ffmpeg. Covers all routes (desktop + mobile).

---

## What this is

A scene-by-scene script for recording a 3-5 minute demo video of Foyer. The video should show the real live app, not slides or mockups.

## Recording setup

- **URL:** https://foyer-cyan.vercel.app
- **Browser:** Chrome (desktop, 1920x1080)
- **Tool:** Any screen recorder (OBS, QuickTime, Windows Game Bar `Win+G`)
- **Flags:** `--enable-unsafe-swiftshader --use-angle=swiftshader-webgl` if no GPU available
- **Duration target:** 3-5 minutes
- **Existing auto-recorded demo:** `week-08/demo-video.mp4` (35 seconds, 9 routes, 597KB) — evidence exists, but it does not meet the assignment duration requirement.

## Scene script

### Scene 1 — Landing (0:00 - 0:20)

**Show:** `foyer-cyan.vercel.app/` loads. The 3D museum entrance appears — courtyard walls, lamp posts, "FOYER MUSEUM" signage, the door with cutout.

**Say (voiceover or text overlay):**
> "Foyer is an open digital museum where developers exhibit their work. Not a card grid — a spatial experience."

**Action:** Let the entrance render fully. Mouse hover over the door to show it responds.

---

### Scene 2 — Walking in (0:20 - 0:50)

**Show:** Scroll down to enter the museum. Camera glides through the entrance into the reception hall. Curator billboard sprite visible. Information signage on walls.

**Say:**
> "You scroll to move. The museum has a reception, a corridor, and exhibit rooms — like a real gallery."

**Action:** Scroll slowly through reception. Pause briefly at the curator billboard.

---

### Scene 3 — Corridor + Reveal (0:50 - 1:20)

**Show:** Continue scrolling into the sawtooth corridor. Exhibit frames on the walls. As the camera approaches each frame, the sketch-to-paint shader reveals the exhibit content (brush-stroke dissolve).

**Say:**
> "Each exhibit starts as a pencil sketch. As you walk closer, it reveals itself — brush strokes dissolving into the finished piece."

**Action:** Approach 2-3 different frames. Let the RevealMaterial shader do its work. Pause on one to show the full reveal animation.

---

### Scene 4 — Exhibit interaction (1:20 - 1:50)

**Show:** Click on an exhibit frame or press `E`. The inspect dialog opens with exhibit title, description, technologies, and links.

**Say:**
> "Click any exhibit to see its full details — title, description, tech stack, and links to the live project."

**Action:** Open one exhibit dialog. Show the details. Close it. Open a second one briefly.

---

### Scene 5 — AI Curator (1:50 - 2:20)

**Show:** Click the curator prompt pill or press `E` near the curator figure. The chat panel opens. Type a question like "What exhibits are in this museum?" or "Tell me about the Collaborative Workspace."

**Say:**
> "The AI curator knows every exhibit. Ask it what's on display, or ask about a specific project."

**Action:** Type a question. Show the streaming response with exhibit data pulled from the repository layer.

---

### Scene 6 — Accessible view (2:20 - 2:40)

**Show:** Click the "Accessible view" toggle. The 3D scene switches to a flat 2D layout with the same content — exhibit cards, descriptions, full text.

**Say:**
> "For screen readers or low-end devices, the Accessible view provides the same content in a flat layout. Same data, full accessibility."

**Action:** Scroll through the 2D view briefly.

---

### Scene 7 — End card (2:40 - 3:00)

**Show:** Back to the 3D museum entrance. Text overlay: "Foyer — Open digital museum for developers. foyer-cyan.vercel.app"

**Say:**
> "Foyer. Built with React, Three.js, and AI. Open source."

**Action:** Fade to black or end recording.

---

## Post-recording checklist

- [x] Video is 3-5 minutes (3 min 35 sec)
- [x] All 5 key routes shown: `/`, corridor, exhibit, AI chat, accessible view
- [x] Audio is clear (or text overlays are readable)
- [x] No console errors visible in the recording
- [ ] Upload to: YouTube (unlisted), Google Drive, or direct MP4 submission
- [ ] Add link to `week-08/submission-checklist.md` if portal asks for it
