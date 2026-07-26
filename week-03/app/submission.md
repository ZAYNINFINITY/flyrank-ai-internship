# Plinth — React App Development with AI Submission

**Assignment:** React App Development with AI (Week 3)
**Track:** Frontend AI Engineering
**App:** Plinth — a room for every project you've shipped

---

## The Application

Plinth is an open-source platform where developers create gallery-style exhibit pages for their projects. Built with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. 8 routes, responsive across 375px/768px/1280px, accessibility-first.

**Live preview:** *(deploy pending — will add Vercel URL)*
**Repo:** `week-3/app/` under the main project repo

---

## Prompts Used During Development

The build was structured as 12 sequential prompts, each building on the previous. Phase A (Prompts 1–3) was documentation-only — no code. Phase B (Prompts 4–12) was the full code scaffold and build.

### Phase A — Documentation (no code)

**Prompt 1 — Through-Line doc:** "Create `week-3/docs/through-line.md`: write the one-line claim, the full content map table (route, purpose, CTA), and an honest 'still need to gather' list."

**Prompt 2 — Identity Kit doc:** "Create `week-3/docs/identity-kit.md`: choose fonts (Space Grotesk + Inter), define the 3-color palette with hex and OKLCH values, describe the favicon concept, write the two-line style note."

**Prompt 3 — Curate Images:** "Create `week-3/docs/image-curation.md`: list every image the site needs mapped to specific routes, mark each as real or generated, write 2–3 rejection notes explaining why certain images were declined."

### Phase B — Code Build

**Prompt 4 — Scaffold:** "Initialize Next.js 16 project with Tailwind v4. Set up `@theme inline` with OKLCH color tokens (text, background, accent). Create empty route shells for all 8 pages. Install dependencies."

**Prompt 5 — Base components:** "Build 5 atomic primitives in `components/primitives/`: Frame (border container), Spotlight Button (accent fill), Ghost Button (outline), Museum Tag Label (LIVE/OPENING SOON tags), Floor Directory (exhibit navigation). All with 44×44px tap targets and focus-visible states."

**Prompt 6 — Landing page:** "Build the landing page as 3 full-viewport beats: Beat 1 (100vh entrance — claim + supporting sentence + CTA), Beat 2 (100vh exhibit concept + 3 preview frames), Beat 3 (60vh explore CTA). Add nav with 'Menu' collapse on mobile. Minimal footer."

**Prompt 7 — Explore page:** "Build the explore grid with live slots (accent LIVE tag, clickable) and opening soon slots (gray tag, aria-disabled). Add empty-state copy. Mock data in `lib/mock-data/explore-exhibits.ts`."

**Prompt 8 — Exhibit page:** "Build the exhibit page with Room 0 (entrance — name, role, avatar placeholder, Floor Directory) and Rooms 1–4 (alternating image-left/right, real project copy from Zayn's site, stack labels, ScrollStreak at 60dvh). Isolated 'Book a call' CTA at the end."

**Prompt 9 — Remaining routes:** "Build Dashboard (honest preview + sign-in prompt), Login (placeholder form, client component), Health (server-rendered mock data), About (3 paragraphs on Plinth's purpose), 404 ('No exhibit here yet.' in-voice)."

**Prompt 10 — Responsive pass:** "Audit all routes at 375px, 768px, 1280px. Add tablet breakpoint for hero claim (56px). Standardize gutters: 24px mobile → 32px tablet → 48px desktop. Create client-side nav component with 'Menu' text trigger and full-screen overlay. Make Floor Directory horizontal scrollable on mobile."

**Prompt 11 — Accessibility + motion pass:** "Add `prefers-reduced-motion` media query to globals.css. Add skip-to-content link in root layout. Add Escape key dismissal + body scroll lock + auto-focus to mobile nav overlay. Add `role='dialog'` and `aria-modal='true'` to overlay. Add `autoComplete` attributes to login form inputs."

**Prompt 12 — Repo hygiene + deploy prep:** "Replace default README with Plinth-specific one. Add MIT LICENSE. Add CONTRIBUTING.md. Add `.env.example` with placeholder values. Update package.json name and description."

---

## How AI Assisted

AI (OpenCode Zen / Claude) was the primary development tool throughout this project. It handled:

- **Architecture decisions:** Recommended the file structure, component hierarchy, and data flow patterns. Suggested separating raw shadcn primitives (`components/ui`) from reshaped Plinth-specific components (`components/primitives`).
- **Code generation:** Generated all page layouts, component implementations, mock data structures, and route configurations from textual prompts.
- **Design token setup:** Converted the hex palette (`#0F172A`, `#FAFAFA`, `#2563EB`) into Tailwind v4's OKLCH format for the `@theme inline` directive.
- **Accessibility patterns:** Suggested focus-visible outlines, `aria-disabled` for placeholder slots, `role="dialog"` for the mobile overlay, and the `prefers-reduced-motion` fallback.
- **Documentation:** Generated all three Phase A docs (through-line, identity kit, image curation) from the technical brief specifications.

The workflow was prompt-driven: I described what each section should accomplish, AI generated the code, I reviewed the output, and we iterated. Each prompt built on the confirmed output of the previous one.

---

## Manual Improvements & Corrections

After reviewing AI-generated code, I made the following manual fixes:

### 1. OKLCH Color Correction

AI initially generated incorrect OKLCH values for the accent blue. I manually verified the values against Tailwind's documented blue-600 (`oklch(0.546 0.245 262.881)`) and corrected the `@theme inline` block in `globals.css`. This was critical — wrong values would have broken every accent element on the site.

### 2. Contrast Ratio Verification

AI estimated contrast ratios without calculating them. I manually computed all text/background and text/accent pairs using OKLCH luminance:

- Text on background: 17.11:1 (passes AA and AAA)
- Accent on background: 4.95:1 (passes AA for non-text, 3:1 threshold)
- White on accent: 5.17:1 (passes AA for body text)

These calculations were not in the original AI output — they were manual additions that determined which opacity levels (text/60, text/50, text/40) are acceptable for different UI roles.

### 3. Mobile Navigation Rebuild

The initial AI-generated nav used a hamburger icon pattern. I changed it to a text-only "Menu" trigger because:
- Hamburger icons are ambiguous at small sizes
- Text "Menu" is universally understood
- The full-screen overlay needed proper keyboard handling (Escape to close, auto-focus on Close button, body scroll lock) that wasn't in the original AI output

### 4. Floor Directory Mobile Behavior

The Floor Directory component was originally vertical-only. I modified it to be a horizontal scrollable strip on mobile (below 768px) and vertical on desktop. This was a manual adjustment to the responsive layout that AI didn't anticipate in the initial component design.

### 5. Gather List Accuracy

The through-line doc's "Still Need to Gather" section listed items as "not written yet" that we had actually completed during the build. I updated the doc to cross off items like landing page copy, about page copy, and Beat 2 paragraph — ensuring the document reflects the actual state of the project.

---

*Built with AI assistance. Verified and corrected manually. Week 3 of a public build-in-progress.*
