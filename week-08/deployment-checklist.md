# Deployment Checklist — Plinth (Capstone)

## Deployment

- [x] **Platform:** Vercel (Next.js auto-detected)
- [x] **URL:** https://plinth-cyan.vercel.app
- [x] **Branch:** `main` (auto-deploys on push)
- [x] **Project ID:** `prj_ESruoLrrT72xcMIrRKy0TeEmZYr0`

## Environment Variables

| Variable | Set in Vercel | Notes |
|----------|:---:|-------|
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key for curator chat |
| `DATABASE_URL` | ❌ | Commented out — using mock repositories |
| `NEXTAUTH_URL` | ❌ | Commented out — auth not wired yet |
| `NEXTAUTH_SECRET` | ❌ | Commented out — auth not wired yet |

## Build Verification

- [x] `npm run build` passes with 0 errors
- [x] `npx tsc --noEmit` passes (TypeScript clean)
- [x] `npx eslint .` passes (0 errors, 2 pre-existing warnings)
- [x] `npx vitest run` — 74/74 tests pass
- [x] No `console.log` in production code
- [x] No `window.__plinth` debug hooks

## Error States Verified

| Scenario | Behavior | Status |
|----------|----------|:------:|
| API key missing | Chat shows "API configuration error" banner | ✅ |
| API rate limit hit | Chat shows rate limit message | ✅ |
| OpenRouter API failure | Chat shows retry prompt with error details | ✅ |
| No WebGL2 support | Auto-falls back to 2D `SurfaceRenderer` | ✅ |
| `prefers-reduced-motion` | 2D fallback, no 3D download | ✅ |
| Low device memory | 2D fallback, no 3D download | ✅ |
| 404 route | Custom `not-found.tsx` with in-voice message | ✅ |
| Empty exhibit state | "No exhibits yet" placeholder | ✅ |

## Accessibility

- [x] WCAG 2.1 AA — 0 WAVE errors on all 2D routes
- [x] `prefers-reduced-motion` — global override kills all animations
- [x] Skip-to-content link on all pages
- [x] Focus-visible outlines on all interactive elements
- [x] Keyboard `E` + prompt button for 3D inspection (no mouse required)
- [x] "Accessible view" toggle switches 3D → flat 2D (screen reader full access)
- [x] Inspect dialog: `aria-modal="true"`, focus on open, Escape closes

## Performance

- [x] 2D routes: Lighthouse 98-100 (Performance), 95-100 (Accessibility), 100 (Best Practices), 100 (SEO)
- [x] 3D home: Lighthouse 100 (Performance), 100 (Accessibility), 100 (Best Practices), 100 (SEO)
- [x] All routes ≥85 across all four categories
- [x] 3D is lazy-loaded via `next/dynamic` + `ssr:false`
- [x] Procedural geometry only (no GLTF model downloads)
- [x] Paper texture cached once as `CanvasTexture`

## Monitoring

- [x] Vercel Analytics available (requires Pro plan for full metrics)
- [x] Error states visible to users (banners, retry prompts)
- [x] No external error tracking service (Sentry etc.) — manual monitoring

## Rollback Plan

1. **Immediate:** Revert to previous deployment in Vercel dashboard → Deployments → Promote
2. **Git:** `git revert <commit-hash>` on `main`, push triggers auto-redeploy
3. **Nuclear:** Delete Vercel project, re-import from GitHub

## Known Limitations

| Issue | Impact | Mitigation |
|-------|--------|------------|
| 3D canvas has no ARIA labels | Screen readers can't navigate 3D | "Accessible view" toggle provides full 2D access |
| No physical device testing | Untested on real phones/tablets | DevTools mobile simulation used |
| Lighthouse not in CI | Manual audit only | CI integration deferred |
| No external error tracking (Sentry etc.) | No error aggregation in production | Manual monitoring via Vercel dashboard |
