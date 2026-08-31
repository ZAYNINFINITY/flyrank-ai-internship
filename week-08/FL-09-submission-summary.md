# Assignment 8.1 — FL-09: Show It / Tell the Story

**Intern:** Zain Ul Abideen
**Track:** General AI Fluency
**Assignment:** FL-09 — Documentation and demo (README + demo video)
**Week:** 8 · **Phase:** Submit

The two deliverables for this assignment are the **README** (live in the repo) and a **demo video link in the showcase thread**. Both are ready; this packet documents what they contain and why they pass.

---

## 1. README — Foyer

**File:** `week-03/app/README.md`
**Live URL:** https://plinth-cyan.vercel.app

| FL-09 criterion | Where it's met |
|---|---|
| A stranger could reproduce the setup from the README alone | `git clone` + `cd week-03/app` + `npm install` + `npm run dev`, env vars table, then open `localhost:3000` |
| Usage examples | "AI integration" section: `exhibitLookup` tool, config, rate limits |
| A simple architecture sketch | File-tree diagram of `app/`, `components/`, `lib/` |
| v2 eval results | "Lighthouse scores" table (99.25 avg) + **honest note**: no formal v1 baseline was captured — these are post-production (August 2026) measurements |
| Limitations list | "Known limitations": 3D no-ARIA, no physical-device testing, Lighthouse not in CI, no external error tracking, auth placeholders, no `maxDuration` |
| Honest about where AI did the work | "How AI was used": names Claude (Anthropic), how it helped, that product decisions were made by the intern and every AI line was reviewed/tested/verified |

### README audit result

All six FL-09 criteria are satisfied. The one caveat you should know: **there is no formal v1 baseline** for the eval numbers — the Lighthouse figures are the post-production measurements. This is stated honestly in the README rather than faked as a before/after.

---

## 2. Demo video — FOYER CAPSTONE DEMO VIDEO

**YouTube (unlisted):** https://youtu.be/09ydadUL_4o
**Duration:** 5:27 · **Uploaded:** ~3 days ago · **Status:** live, playable, unlisted (viewable by anyone with the link)

The video is a **live end-to-end run** of the real app, not slides:

- Landing → walking into the museum (scroll-rail 3D)
- Sawtooth corridor + sketch-to-paint reveal shaders
- Exhibit interaction (click to inspect)
- AI curator chat with a live streamed response
- Accessible (2D) view toggle
- End card with live URL

It runs **5 minutes 27 seconds** (within the 3–5 minute target) with narration/overlays explaining what each section is doing and why.

### Self-check before submitting (things I can't verify for you)

The two on-camera credibility criteria depend on what's actually in your recording. Please confirm before posting:

- [ ] Does it stay a **live run** end to end (no slides/mockups)?
- [ ] Is at least **one design decision explained** on camera?
- [ ] Is at least **one limitation acknowledged** on camera?

If any of those three is missing, re-record just that beat rather than submitting it thin — the honesty-on-camera is the point of the assignment.

---

## 3. Transparency line (framework note)

The README's "How AI was used" section already names the AI and how it was used. For the showcase-thread post, the one-liner is:

> *This was built with Claude as the primary coding assistant — architecture, boilerplate, and GLSL. Every AI-generated line was reviewed, unit/e2e tested, and verified against the running app. Product decisions — the museum's feel, spatial zones, and visual priorities — were mine.*

---

## Evidence / files

| File | Purpose |
|---|---|
| `week-08/FL-09-portal-submission.md` | Copy-paste links for the portal |
| `week-08/FL-09-submission-checklist.md` | Portal checklist (this assignment only) |
| `week-08/fl-09-demo-video.md` | Demo video script + walkthrough notes |
| `week-08/lighthouse-scores.md` | Eval results backing the README table |
| `week-03/app/README.md` | The README itself |
