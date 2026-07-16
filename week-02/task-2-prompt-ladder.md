# The Prompt Ladder — Pricing the Project Costing Module

## Baseline (embarrassing, one month ago)

**Prompt:** "Help me price this project."

**Output:**
"Pricing a software project depends on several factors including scope, complexity, timeline, and market rates. Consider researching industry standards, calculating your hourly rate, and factoring in overhead costs. You may also want to look at competitor pricing to stay competitive in the market."

This is generic advice-column filler. It doesn't know what "this project" is, so it can't say anything real.

---

## Version 1 — Layer added: clearer goal

**Prompt:** "Help me create a pricing quote for a custom software module I'm building for a client."

**Output:**
"To create a pricing quote, start by breaking down the module into features, estimate development hours for each, apply your rate, then add a buffer for revisions and testing. Present it as a simple line-item breakdown with a total at the bottom."

**What changed in the prompt:** Added a specific goal (a quote, not general pricing advice).
**What actually improved in the output:** It stopped rambling about market research and gave an actual quote-building method (feature breakdown → hours → rate → buffer).
**What still failed:** Still has no idea what the module actually does, so the "features" it'd break down are invented, not real.
**What to try next:** Give it real context about the actual project.

---

## Version 2 — Layer added: real context

**Prompt:** "Help me create a pricing quote for a custom software module I'm building for a client. The module is a Project Costing tool for a contractor who runs CCTV, Solar, and Lift installation projects. It's built as an isolated SQLite database (`project-costing.db`) that plugs into my existing POS-it desktop app without touching POS-it's core. It's still in development."

**Output:**
"Given the isolated architecture, you'd typically break this into: (1) database schema design for three project types, (2) UI screens for cost entry per project type, (3) integration layer connecting to POS-it without modifying core, (4) testing/QA, (5) buffer for client revisions. Since it's still in development, you might quote in phases — an initial build fee, then a smaller fee for revisions once the client sees a working version."

**What changed in the prompt:** Added the real project details — what it is, the architecture, the client type.
**What actually improved in the output:** The breakdown is now specific to *this* project (schema for three project types, the isolation constraint) instead of invented generic features. It also picked up on "still in development" and suggested phased pricing on its own — I didn't ask for that.
**What still failed:** It doesn't know who's reading this quote — a contractor who isn't technical will not understand "integration layer" or "schema design" as line items on an invoice.
**What to try next:** Tell it who the quote is actually for.

---

## Version 3 — Layer added: defined audience

**Prompt:** "Help me create a pricing quote for a custom software module I'm building for a client. The module is a Project Costing tool for a contractor who runs CCTV, Solar, and Lift installation projects. It's built as an isolated SQLite database (`project-costing.db`) that plugs into my existing POS-it desktop app without touching POS-it's core. It's still in development. The quote is for the contractor himself — a non-technical business owner, not a developer — so it needs to make sense to him, not just to me."

**Output:**
"Here's a client-facing breakdown instead of a dev-facing one:
1. Custom cost tracking system for your CCTV, Solar, and Lift jobs — [fee]
2. Setup so it works alongside your existing POS-it system without any disruption — [fee]
3. Testing and fixes before handover — [fee]
4. Any changes you want after you've tried it — [fee]

Total, with a note that it's still being finished and final delivery date will follow once core testing wraps up."

**What changed in the prompt:** Specified who reads this — non-technical contractor, not a developer.
**What actually improved in the output:** The language flipped entirely — "integration layer" became "works alongside your existing system without disruption." This is the biggest single improvement in the whole ladder so far.
**What still failed:** It's just a bulleted list — no actual format for a real invoice/quote document (no totals structure, no terms, nothing a contractor could act on as a document).
**What to try next:** Specify the actual output format needed.

---

## Version 4 — Layer added: specified output format

**Prompt:** "Help me create a pricing quote for a custom software module I'm building for a client. The module is a Project Costing tool for a contractor who runs CCTV, Solar, and Lift installation projects. It's built as an isolated SQLite database (`project-costing.db`) that plugs into my existing POS-it desktop app without touching POS-it's core. It's still in development. The quote is for the contractor himself — a non-technical business owner, not a developer. Format it as an actual quote document: header with project name and date, a numbered line-item table (item / description / cost), a subtotal and total, and a short payment terms section at the bottom."

**Output:**
A properly structured quote document — header, a 4-row item table with description and cost columns, subtotal/total rows, and a payment terms paragraph (e.g. 50% upfront, 50% on delivery).

**What changed in the prompt:** Told it exactly what document structure to produce.
**What actually improved in the output:** This is genuinely usable now — it looks like something you could actually send, not just advice about what a quote should contain.
**What still failed:** This is the one honest "didn't really help" moment — the actual dollar/rupee figures it filled in were just placeholders pulled from nowhere. Format improved, but the number that matters most (the price) is still fake, because no budget range or rate was given.
**What to try next:** Add real constraints — rate, budget range, what must and must not be included.

---

## Version 5 — Layer added: constraints + verification step

**Prompt:** "Help me create a pricing quote for a custom software module I'm building for a client. The module is a Project Costing tool for a contractor who runs CCTV, Solar, and Lift installation projects. It's built as an isolated SQLite database (`project-costing.db`) that plugs into my existing POS-it desktop app without touching POS-it's core. It's still in development. The quote is for the contractor himself — a non-technical business owner, not a developer. Format it as an actual quote document: header with project name and date, a numbered line-item table (item / description / cost), a subtotal and total, and a short payment terms section at the bottom. Constraints: total should land between PKR 80,000–150,000, must clearly state that ongoing maintenance is billed separately, and must not overpromise a fixed delivery date since it's still mid-build. Before finalizing, double-check that every line item is something explained earlier in this conversation — flag anything you had to guess."

**Output:**
A finished quote document within the stated range, with a maintenance-is-separate clause, no fixed delivery date promised (phased/rolling delivery language instead), and — because of the verification step — it flagged that the exact PKR split between line items was an assumption to confirm, since the prompt hadn't specified how to divide the total.

**What changed in the prompt:** Added real numeric/business constraints, and a self-check instruction.
**What actually improved in the output:** The number is now grounded in a range that was actually given, not invented. The verification step also made it self-flag its one weak assumption instead of quietly guessing — that's the difference between output that has to be fact-checked line by line and output that tells you what's shaky.
**What still failed:** It still can't know the real hourly rate or true effort estimate — no prompt layer fixes that, since it's information only the person pricing the work has.
**What to try next:** For a real quote, feed it the actual hour estimate per line item instead of letting it split the total itself.

---

## Final Reusable Prompt

"Help me create a client-facing pricing quote for a custom software module.

Project: [one-line description of what it is and what it plugs into].
Client: [who it's for — technical level, business type].
Status: [in development / complete / phase].

Format as a quote document: header (project name + date), a numbered line-item table (item / description / cost), subtotal and total, and a payment terms section.

Constraints: total should fall within [budget range]. [Any must-include/must-exclude items, e.g. maintenance billed separately]. Do not overpromise on timeline if the work is still in progress — use phased language instead.

Before finalizing, check every line item against what's been given above and flag anything that had to be assumed or guessed."

This works for a stranger — they fill in the three bracketed setup lines and the constraints, and it produces a real, checkable quote instead of generic pricing advice.
