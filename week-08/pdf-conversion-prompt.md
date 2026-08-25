# PDF Conversion Instructions

Use this prompt when asking Claude (or any tool) to convert the capstone report to PDF.

---

## Prompt for Claude

```
Convert `week-08/capstone-final-report.md` to a polished, submission-ready PDF.

Requirements:
1. ALL 31 images must be embedded in the PDF (not links, not placeholders). Use the relative paths as-is (../screenshots/*.png, demo-walkthrough.gif, week-08/test-results.png).
2. The GIF (demo-walkthrough.gif) should render as a static frame if GIF animation isn't supported.
3. Tables must render with borders and proper alignment.
4. Code blocks must have syntax highlighting (TypeScript, bash, directory trees).
5. Page breaks between major sections (## headings start on new pages).
6. Headers should use a clean sans-serif font (not monospace).
7. The title page should show: "Foyer — Capstone Final Report", author, date, live URL, repo URL.
8. Footer on every page: "Zain Ul Abideen (ZAYNINFINITY) | FlyRank AI Internship | August 2026"
9. Page numbers in footer.
10. Output file: `week-08/capstone-final-report.pdf`

If images fail to embed, list which ones are missing so I can fix the paths.

Do NOT:
- Remove any images
- Summarize or shorten content
- Change the markdown structure
- Add placeholder text
```

---

## What the PDF Should Contain

### Title Page
- "Foyer — Capstone Final Report"
- Author: Zain Ul Abideen (ZAYNINFINITY)
- Date: August 2026
- Live: plinth-cyan.vercel.app
- Repo: github.com/ZAYNINFINITY/flyrank-ai-internship

### Sections (12 total)
1. **Executive Summary** — GIF + metrics table (74 tests, Lighthouse 99+, etc.)
2. **Project Brief** — Problem, audience, why
3. **Objectives & Scope** — FL-09, FE-AA3, FL-10, FE-11, Capstone checklists
4. **The Build Journey** — 4 phases with before/after screenshots (20+ images)
5. **Technical Architecture** — Stack table, directory tree, spatial design
6. **AI Integration** — Architecture diagram, tool schema, rate limiting
7. **Testing & Quality** — 74 tests table, quality gates, test evidence image
8. **Performance Audit** — Lighthouse scores table, accessibility features
9. **Deployment & Operations** — Vercel config, CI/CD, error handling
10. **Lessons Learned** — Reflection, AI-first workflow
11. **Future Roadmap** — 3 phases + tech debt table
12. **Deliverables Index** — 14 items with status

### Images (31 total)
- 3 "before" screenshots (grey corridor, early 3D)
- 4 phase progression screenshots
- 14 demo screenshots (all routes)
- 4 mobile responsive screenshots
- 1 test results screenshot
- 1 GIF (14-step walkthrough)
- 4 "before journey" screenshots

### Tables (15+)
- Key metrics, tech stack, test suite, Lighthouse scores, etc.

---

## If Using Pandoc

```bash
pandoc week-08/capstone-final-report.md \
  -o week-08/capstone-final-report.pdf \
  --pdf-engine=xelatex \
  --highlight-style=tango \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V mainfont="Segoe UI" \
  -V monofont="Consolas" \
  --toc \
  --toc-depth=2 \
  -V toc-title="Table of Contents"
```

## If Using Playwright (Markdown → HTML → PDF)

1. Convert MD to HTML with embedded images (base64)
2. Add CSS for print styling
3. Use Playwright PDF generation

## If Using markdown-pdf (npm)

```bash
npx markdown-pdf week-08/capstone-final-report.md \
  -o week-08/capstone-final-report.pdf \
  --css week-08/pdf-style.css
```
