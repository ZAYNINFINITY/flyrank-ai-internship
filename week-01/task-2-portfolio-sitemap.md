# Draw the Path: Portfolio Sitemap + Toolkit

## 1. Sitemap

Four sections, walking one person (a small business/SaaS founder hiring a
full-stack engineer) from landing to the one action (book a call):

1. **Home / Hero** — headline + subtext + "Book a Call" CTA
2. **Work / Case Studies** — featured project (POS desktop app, live pilot
   client) framed as Problem → What I Built → Result, plus an optional
   secondary project slot
3. **About** — 2-3 line bio: CS undergrad, MERN stack dev,
   security-conscious, building toward application security
4. **Contact / CTA** — repeated "Book a Call" action, no nav links, no
   distractions

Sketch: `week-01/sitemap-sketch.png` (Figma wireframe, low-fidelity, 4-page
flow with single repeated CTA)

## 2. Toolkit Setup

- [x] Claude account
- [ ] ChatGPT account
- [ ] Gemini account
- [ ] Perplexity account

## 3. Claude Project (Portfolio Build)

- [x] Created a Claude Project named "Portfolio Build"
- [x] Custom instructions include the proof statement, pasted in
- [x] Instructed to act as a tutor for this build
- [x] Screenshot saved: `week-01/portfolio-claude-project-screenshot.png`

## 4. Pressure-Test Prompt + Output

**Prompt used:**
> "Here's my proof statement: I build full-stack SaaS products for real
> businesses, with security-conscious auth and data handling — not just
> demos, with an eye toward moving into application security. My one
> action: book a call. Here's my sitemap: Home/Hero, Work/Case Studies
> (POS desktop app, live pilot client), About, Contact/CTA. Pressure-test
> this — does every page earn its place against the one action (book a
> call) and the claim? What would you cut or merge?"

**Output (actual Claude response):**

> Good instinct to pressure-test before building anything. Let's go page
> by page against the one action (book a call) and the claim (full-stack +
> security-conscious + moving into appsec).
>
> **Home/Hero** — What's the actual headline text? "I build full-stack
> apps" is a claim anyone can type. A founder skimming for 8 seconds needs
> proof-flavored language, not adjective-flavored language.
>
> **Work/Case Studies** — The POS app with a live pilot client is the
> strongest asset — a real business trusted you with something that
> touches money and inventory. But: (1) what fills the "optional secondary
> project slot" — does it reinforce "I handle the parts that break," or
> does it remind the visitor you also build toy projects? (2) Nowhere in
> the sitemap does anything demonstrate the security-conscious auth/data
> handling part of the claim specifically. "Problem → What I Built →
> Result" isn't reassuring to a founder who's been burned before if
> "Result" is just "client uses it happily." What would need to appear for
> a skeptical founder to specifically trust you with logins and data?
>
> **About** — Does this need its own page? Every full page is a click a
> founder can take instead of "Book a Call." What decision does a founder
> make on the About page that they couldn't make from a 2-3 line bio
> placed directly under the case study or in the hero?
>
> **Contact/CTA** — Same question: why a separate page rather than the
> natural end of the case study page? What does a founder gain by clicking
> to a fourth page just to see a button they already saw twice?
>
> One more thing: the sitemap could currently describe almost any
> full-stack portfolio. What's one page or section where a founder can see
> you *thinking* like someone security-conscious — not just claiming it?
> Where would that live?

## 5. What I'll Change

1. **Merge About and Contact into the Home and Case-Study pages** — cut
   from 4 separate pages to effectively 2 (Hero+About-blurb, and
   Case-Study+Contact), since neither About nor Contact gives a founder a
   decision they couldn't make earlier. This directly answers "resist
   adding pages just because."
2. **Add a concrete security-proof element inside the Case Study** —
   instead of only "Problem → What I Built → Result," add a specific
   callout describing exactly how auth/session/tokenization was handled in
   the POS app (e.g. session expiry handling, token refresh flow, input
   validation) — so the claim is demonstrated, not just stated.
