# Draw the Path: Portfolio Sitemap + Toolkit

**Week 1 · AI Fluency track**

## 1. My sitemap

I kept this to 4 pages on purpose — every extra page is just a click
someone could take instead of hitting "Book a Call," so I cut anything that
didn't earn its place.

1. **Home / Hero** — states the claim straight up + one CTA button
2. **Work / Case Studies** — POS-it front and center (real pilot client),
   framed as Problem → What I Built → Result. I'm leaving a second project
   slot open, but only filling it if it actually reinforces "I handle the
   parts that break," not just to pad the page.
3. **About** — short, 2-3 lines max. CS undergrad, MERN dev,
   security-conscious, working toward appsec next. No life story.
4. **Contact / CTA** — same one action repeated, nothing else on the page

Sketch: `sitemap-sketch.png` (built in Figma, low-fidelity wireframe)

## 2. Toolkit

- [x] Claude
- [x] ChatGPT
- [x] Gemini
- [x] Perplexity

## 3. Claude Project (Portfolio Build)

Set up a second Claude Project just for this build, named "Portfolio
Build." Instructions include my proof statement pasted in directly, plus a
note asking Claude to act as a tutor — explain its reasoning, not just hand
me answers. Screenshot: `portfolio-claude-project-screenshot.png`

## 4. Pressure-testing my sitemap

**What I asked it:**
> "Here's my proof statement: I build full-stack SaaS products for real
> businesses — POS-it is the proof, a point-of-sale desktop app with an
> actual pilot client running it. I make the calls on auth, sessions, and
> API design myself instead of just wiring up whatever AI hands me, and
> I'm using that as my foundation to move into application security next.
> The person I want to reach is a small business or SaaS founder who needs
> a developer they can trust with the parts that break silently in
> production. The one action: book a short call with me.
>
> Here's my sitemap: Home/Hero, Work/Case Studies (POS desktop app, live
> pilot client), About, Contact/CTA.
>
> Pressure-test this — does every page earn its place against the one
> action (book a call) and the claim? What would you cut or merge?"

**What it came back with:**

It pushed back hard, in a good way. Main points:
- My headline needs to actually say something specific, not generic
  "full-stack developer" language that a hundred other portfolios already
  say.
- The Work/Case Studies page is my strongest asset (real client, real
  money/inventory on the line), but nowhere in my sitemap did I actually
  *show* the security-conscious part of my claim — I only stated it. It
  asked: what would a skeptical founder need to see in that case study to
  actually trust me with logins and data, not just UI?
- It questioned whether About and Contact even need to be their own pages,
  since neither gives a visitor a decision they couldn't make earlier in
  the flow. Every extra page is a click away from the one action.

**What I'm actually changing because of this:**

1. Cutting About and Contact down from full separate pages — folding the
   bio into the Home page and the CTA into the end of the Case Study page
   instead. Two strong pages beat four thin ones.
2. Adding a specific security callout inside the Case Study — actually
   describing how I handled auth/sessions in POS-it (token expiry, refresh
   flow, that kind of thing), instead of just saying "Problem → What I
   Built → Result" and leaving the security claim unproven.
