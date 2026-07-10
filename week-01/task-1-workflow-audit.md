# FL-01: AI Workflow Audit and Tool Setup

## 1. Workflow Audit Table

| # | Task | Classification | Rationale |
|---|------|----------------|-----------|
| 1 | Building POS-it core features (Electron app) | Collaborate with AI | I drive architecture/logic decisions, AI speeds up implementation |
| 2 | Debugging live pilot client (LifePH) issues | Just me | Real client, real accountability — can't risk unverified AI fixes |
| 3 | Designing DB schema for new modules | Just me | Structure/reusability decisions are architectural, mine to own |
| 4 | Scaffolding new UI components in React | Delegate to AI with review | Fast first draft, I verify structure and logic |
| 5 | Writing auth/session/token logic | Collaborate with AI | I define the flow, AI helps implement, I review security implications |
| 6 | Debugging why auth/API breaks in prod/CI-CD | Collaborate with AI | I diagnose symptoms, AI helps trace root cause faster |
| 7 | Learning HTML/CSS/JS fundamentals | Just me | AI can't build this understanding for me — no shortcut without doing it |
| 8 | Deciding whether to keep/kill a side project | Just me | Judgment call based on my time/interest, not something AI should weigh in on |
| 9 | Exploring new stack ideas (e.g. past 2D game dev curiosity) | Collaborate with AI | Early-stage exploration, AI good for rapid prototyping/learning |
| 10 | Writing PROJECT_HANDOFF.md / documentation | Delegate to AI with review | AI drafts clean docs fast, I check accuracy against actual code |
| 11 | Watching/following soccer, gaming for downtime | Just me | Leisure — no AI role, deliberately kept separate from work |
| 12 | Researching cybersecurity/appsec fundamentals | Collaborate with AI | I'm early here, use AI to explain concepts and point me to right resources |
| 13 | Solving cross-platform packaging problems (e.g. DSA course queue-sim app, web wrapped via Capacitor) | Collaborate with AI | AI suggested approaches, but I iterated through failed attempts myself until one actually worked |

## 2. Toolkit Setup

- [ ] Claude account created
- [ ] ChatGPT account created
- [ ] Anthropic Academy account created
- [ ] Enrolled in *AI Fluency: Framework & Foundations*
- [ ] Completed first module

## 3. Claude Project

- [ ] Created a Claude Project with custom instructions covering:
  - Who I am (full-stack/MERN dev, CS undergrad, building POS-it, moving toward appsec)
  - Tone preferences
  - Current goals (Week 1–8 FlyRank internship track)
- [ ] Screenshot saved: `week-01/claude-project-screenshot.png`

## 4. Three Target Tasks (reused in FL-02 – FL-04)

**1. Scaffolding UI components in React**
*Done well* = component compiles with no errors, follows `CLAUDE.md` conventions (naming, file structure), needs ≤1 round of manual fixes after AI's first draft.

**2. Writing/reviewing auth or session logic**
*Done well* = the flow is documented (what token goes where, when it expires, what happens on refresh) *before* code is written, and I can explain every step without re-reading AI's output.

**3. Debugging production/CI-CD breakages**
*Done well* = root cause is identified and written down (not just patched), and the same class of bug doesn't recur in the next deploy.
