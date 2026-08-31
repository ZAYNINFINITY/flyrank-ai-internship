# Assignment 8.2 — FL-10: Final Package, Retrospective, and Capstone

**Intern:** Zain Ul Abideen
**Track:** General AI Fluency
**Assignment:** FL-10 — final package, retrospective, hours log, live site + build-in-public post, final review checkpoint
**Week:** 8 · **Phase:** Submit · Final checkpoint

---

## 1. Submission package — everything in one place, reachable from the index

The master index is **`week-08/FINAL-SUBMISSION.md`** — a single table that links every deliverable from the whole track (Ship It capstone + Send the Link capstone + supporting evidence). Each deliverable is an absolute GitHub link on `main`, so a reviewer can reach everything from one page in five minutes.

Package contents (all reachable from the index):

| Area | Deliverables |
|---|---|
| Project | Brief, live URL, repo |
| Documentation | README (setup + architecture + AI + limitations) |
| Evidence | Lighthouse scores + JSONs, test results, deployment checklist, error states, rollback plan |
| AI | Curator integration, model swap report |
| Video/GIF | Demo video (YouTube + MP4), walkthrough GIF |
| Report | Capstone report (PDF + source MD) |
| Story | Build-in-public post, plan-to-keep-building, send-the-link |

---

## 2. Retrospective — `week-08/reflection.md`

Written for the person I was in Week 1, ~500+ words, structured as:

1. **What was hardest** — the 3D/2D renderer seam (same content, two renderers, same feel).
2. **What I'd do differently** — design the 2D path into the architecture from day one, not bolt it on.
3. **One thing that surprised me** — the engineering was in the tool schema, not the prompt.
4. **What I'd tell the next intern** — ship the ugly version first.
5. **What I'd tell the Week-1 me** — the lesson I only understood after shipping (self-addressed, distinct from advice to others).

It is specific to this build, not a generic reflection.

---

## 3. Build-in-public post — `week-08/build-in-public-post.md`

The post tells the story (ugly ship → data architecture → AI → shader → 3D/2D seam → shipping) and satisfies the "one real decision + one real limitation" criterion:

- **One real decision** (Week 3 section, line 25): *make the repository interface swappable* — mock implementations today, PostgreSQL tomorrow, one-line change.
- **One real limitation** (What's Next section, line 70): *"Foyer is a working prototype. What it's NOT yet: a platform where other developers can sign up, create exhibits, and publish their work. That's the gap between demo and product."*

Link: https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/build-in-public-post.md

---

## 4. Hours log

The hours log is completed **in the portal** (it lives there, not in the repo — this is the one deliverable I can't write for you). Please confirm it's filled in before final sign-off, and that the entered hours are plausible against the actual working timestamps recorded across weeks 1–8.

---

## 5. Live site + post URL

- **Live:** https://plinth-cyan.vercel.app
- **Post:** https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/build-in-public-post.md

---

## ⚠️ 6. Open item — FlyRank domain (NOT met)

FL-10 states the site must be **published on the FlyRank domain**. That criterion is **currently not met**:

- The live site is on **`plinth-cyan.vercel.app`** (a Vercel subdomain).
- **Interim status:** using the Vercel subdomain is the working deployment for the submission; per FlyRank's own Q&A, a clean Vercel subdomain is an acceptable fallback where a custom/FlyRank domain isn't available.
- **Action needed (yours, not code-fixable from here):** either (a) set up a FlyRank subdomain / CNAME to satisfy the criterion exactly, or (b) document in the submission that the Vercel subdomain is used in place of the FlyRank domain and why.

This stays **open** and is tracked as an unticked item in the checklist — it is not hidden as if done.

---

## 7. Final review checkpoint

The final review is the documented human sign-off the certificate depends on. Options per the assignment: a **written sign-off** or a **scheduled review / demo session**. Please select one, complete the hours log, resolve the domain item, then submit — the rest of the package is ready.

---

## Files

| File | Purpose |
|---|---|
| `week-08/FL-10-portal-submission.md` | Copy-paste links for the portal |
| `week-08/FL-10-submission-checklist.md` | Portal checklist (this assignment only) |
| `week-08/FINAL-SUBMISSION.md` | Master index linking every deliverable |
| `week-08/reflection.md` | Retrospective (500+ words, 5 sections) |
| `week-08/build-in-public-post.md` | Build-in-public story (1 decision + 1 limitation) |
