## Voice Card

**direct, plain, no-fluff, security-conscious, technically honest**

---

## Case 1: Project Costing Module — POS-it

**The problem.** A contractor client needed to track project costs across three different service lines — CCTV, Solar, and Lift installations. Nothing in POS-it's core handled that, and building contractor-specific logic into the main product wasn't the right call.

**What I did.** I built the module as a completely separate piece: its own `project-costing.db` SQLite file, kept strictly isolated from POS-it's core database and logic. If I hardcode one client's workflow into the main app, every future client-specific module becomes a mess to maintain. Isolating it means the pattern can be reused instead of rebuilt from scratch next time.

**What came of it.** The P&L calculation is working end-to-end on a real completed project — a CCTV installation job with a contract value of Rs 100,000. The module correctly pulled together invoiced revenue (Rs 250,500), collected cash, purchase costs, an inventory adjustment, service costs, and expenses, and calculated a final profit of Rs 280,600 at a 112% margin. That's the isolation decision proving out in practice: real project data, real cost tracking, computed correctly, without touching POS-it's core.

![Project Costing P&L view showing a completed project's revenue, cost breakdown, profit, and margin](https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-02/project-costing-pnl-evidence.png?raw=true)

---

## Case 2: POS-it — Core Product

**The problem.** Most POS software on the market either had broken workflows or clearly wasn't built with the actual user in mind. Even freelance-built "custom" solutions were mostly web apps running on localhost, sold at high prices despite being fundamentally unstable for non-technical shop owners to rely on.

**What I did.** I built POS-it as a desktop app instead of following the crowd into web-based tools, specifically to avoid the server/localhost fragility that leaves non-technical business owners stuck when something breaks. Having worked with PHP/MySQL before, I knew firsthand how much time gets lost fixing overlapped DB servers or stuck instances — often ending in a full reinstall. I also skipped the dated .NET/Java-style UI still common in regional POS software and built something modern instead.

**What came of it.** Still actively in development. I tried outsourcing part of the build early on and ran into problems from that, so I pulled back to handle more of it directly — making sure the product stays smooth and daily operations for existing users aren't disrupted while I keep building.

---

## Before / After

**Generic AI line:**
> "Leveraged a robust, scalable architecture to seamlessly deliver a dynamic project costing solution tailored to client needs."

**Edited version (mine):**
> "I kept it in a separate database so I wouldn't have to hardcode one client's logic into the main app."
