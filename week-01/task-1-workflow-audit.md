# FL-01: AI Workflow Audit and Tool Setup

**Week 1 · AI Fluency track**

## 1. Workflow Audit — my actual week

I built this list from what I really do, not a generic list. A lot of it
comes from POS-it, the point-of-sale app I'm building (it has a real pilot
client running it), plus college work and side-project history.

| # | Task | Classification | Why |
|---|------|----------------|-----|
| 1 | Building features for POS-it (Electron app) | Collaborate with AI | I decide the architecture and logic myself, AI just helps me move faster on implementation |
| 2 | Fixing bugs for the live pilot client | Just me | It's a real client using this daily — I'm not risking an AI fix I haven't verified myself |
| 3 | Designing database schema for new modules | Just me | This is a structural decision. If I get it wrong, everything built on top of it breaks later |
| 4 | Scaffolding new UI components | Delegate to AI, then review | AI gives me a fast first draft, I check the structure and clean it up |
| 5 | Writing auth/session/token logic | Collaborate with AI | I decide how the flow should work, AI helps me implement it, but I review every security-relevant part myself |
| 6 | Debugging why something breaks in prod or CI/CD | Collaborate with AI | I figure out the symptom, AI helps me get to the root cause quicker |
| 7 | Learning actual HTML/CSS/JS fundamentals | Just me | This is the one I can't skip. I've relied on AI so much that I never properly learned the basics — no shortcut fixes that |
| 8 | Deciding whether to keep working on a side project or drop it | Just me | That's a judgment call about my own time and interest, not something I want AI weighing in on |
| 9 | Exploring random stack ideas (like the 2D game dev phase I went through) | Collaborate with AI | Good for quick prototyping when I'm just exploring, not committing |
| 10 | Writing PROJECT_HANDOFF.md and other documentation | Delegate to AI, then review | AI writes it fast, I check it actually matches the real code |
| 11 | Watching football, gaming, downtime | Just me | This is my time off, I keep it fully separate from AI/work stuff |
| 12 | Reading up on cybersecurity/appsec basics | Collaborate with AI | I'm still early here, so I use AI to explain concepts and point me toward the right resources |
| 13 | Solving weird cross-platform packaging issues (e.g. the DSA course project I wrapped with Capacitor) | Collaborate with AI | AI gave me a few approaches, but I had to actually iterate through the failed ones myself before one worked |

## 2. Toolkit Setup

- [x] Claude account
- [x] ChatGPT account
- [x] Anthropic Academy account — enrolled and completed *AI Fluency: Framework & Foundations* (certificate attached)

## 3. Claude Project

Set up a Claude Project ("FlyRank AI Internship 2026") with real custom
instructions — who I am, what I actually work on, and how I want Claude to
respond to me (direct, no fluff, tell me clearly when something's wrong).
Screenshot: `claude-project-screenshot.png`

## 4. My Three Target Tasks (carrying into FL-02–04)

**1. Scaffolding UI components in React**
Done well means: it compiles clean, follows the conventions I already set in `CLAUDE.md`, and I only need one round of manual fixes after AI's first draft — not five.

**2. Writing or reviewing auth/session logic**
Done well means: I've written down the flow (what token goes where, when it expires, what happens on refresh) *before* I write any code, and I can explain every part of it out loud without going back to check what AI wrote.

**3. Debugging production/CI-CD breakages**
Done well means: I actually find and write down the root cause, not just patch the symptom — and the same kind of bug doesn't show up again in the next deploy.
