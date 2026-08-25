# PDF Conversion Instructions

Use this prompt when asking Claude (or any tool) to convert the capstone report to PDF.

---

## Prompt for Claude

```
Convert `week-08/capstone-final-report.md` to a polished, submission-ready PDF with academic formatting.

FONT & TYPOGRAPHY:
- Body font: Roman serif (Times New Roman, Georgia, or Cambria)
- Body size: 12pt
- H1 (title): 24pt, centered, bold
- H2 (major sections like "## 1. Executive Summary"): 16pt, bold, underline, page break before
- H3 (subsections like "### 5.1 Tech Stack"): 14pt, bold
- H4 (sub-subsections): 12pt, bold italic
- Line height: 1.5
- Text alignment: justified

LAYOUT:
- Paper: A4
- Margins: 1.25in left (for binding), 1in top/right/bottom
- Page numbers: bottom right
- Footer: "Zain Ul Abideen (ZAYNINFINITY) | FlyRank AI Internship | August 2026" (9pt, centered)
- Page breaks: each ## section starts on a new page

IMAGES:
- ALL 31 images must be embedded (not links, not placeholders)
- Paths: ../screenshots/*.png, demo-walkthrough.gif, week-08/test-results.png
- Images centered, max-width 90%, thin border (0.5pt)
- GIF: render as static frame if animation not supported
- Captions: italic, 10pt, centered below image

TABLES:
- 10pt font, thin borders (0.5pt), centered
- Header row: bold, light gray background
- Alternating row colors (subtle)
- Page break inside: avoid

CODE BLOCKS:
- Font: Consolas or Courier New, 9pt
- Background: light gray (#f5f5f5)
- Thin border, page break inside avoid
- Syntax highlighting for TypeScript/bash

TITLE PAGE:
- "Foyer — Capstone Final Report" (24pt, centered)
- Author: Zain Ul Abideen (ZAYNINFINITY)
- Date: August 2026
- Live: plinth-cyan.vercel.app
- Repo: github.com/ZAYNINFINITY/flyrank-ai-internship
- No page number on title page

OUTPUT: `week-08/capstone-final-report.pdf`

If images fail to embed, list which ones are missing so I can fix the paths.

Do NOT:
- Remove any images
- Summarize or shorten content
- Change the markdown structure
- Add placeholder text
- Use sans-serif fonts (must be Roman serif)
```

---

## CSS Reference

The file `week-08/pdf-style.css` contains the exact CSS for this formatting.
If using Playwright or markdown-pdf, reference this CSS file.

---

## Pandoc Command (with Roman fonts)

```bash
pandoc week-08/capstone-final-report.md \
  -o week-08/capstone-final-report.pdf \
  --pdf-engine=xelatex \
  --highlight-style=tango \
  -V geometry:left=1.25in,right=1in,top=1in,bottom=1in \
  -V fontsize=12pt \
  -V mainfont="Times New Roman" \
  -V monofont="Consolas" \
  -V documentclass=article \
  -V papersize=a4 \
  --toc \
  --toc-depth=2 \
  -V toc-title="Table of Contents"
```

---

## Font Size Reference

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| H1 (Title) | 24pt | Bold | Centered |
| H2 (Section) | 16pt | Bold | Underline, page break |
| H3 (Subsection) | 14pt | Bold | Left aligned |
| H4 (Sub-sub) | 12pt | Bold | Italic |
| Body | 12pt | Normal | Justified |
| Table | 10pt | Normal | Left aligned |
| Code | 9pt | Normal | Monospace |
| Footer | 9pt | Normal | Centered |
| Caption | 10pt | Normal | Italic, centered |

---

## What the PDF Contains

### Title Page
- "Foyer — Capstone Final Report"
- Author, date, live URL, repo URL

### 12 Sections
1. Executive Summary — GIF + metrics table
2. Project Brief — Problem, audience, why
3. Objectives & Scope — 5 checklists with ✅ status
4. The Build Journey — 4 phases, 20+ before/after screenshots
5. Technical Architecture — Stack, directory tree, spatial design
6. AI Integration — Architecture, tool schema, rate limiting
7. Testing & Quality — 74 tests, quality gates, evidence
8. Performance Audit — Lighthouse scores, accessibility
9. Deployment — Vercel, CI/CD, error handling
10. Reflection — Lessons learned
11. Future Roadmap — 3 phases + tech debt
12. Deliverables Index — 14 items with status

### 31 Images
### 15+ Tables
### 10+ Code blocks
