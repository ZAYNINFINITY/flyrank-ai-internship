# FE-05: Accessible Component Fundamentals — NOTES

## Manual implementation

Three interactive components built from scratch in React + TypeScript,
no external component libraries:

- `playground/modal.tsx` — Focus-trapping dialog with backdrop, Escape to close,
  focus return to trigger
- `playground/tabs.tsx` — Keyboard-navigable tabs with arrow keys and roving tabindex
- `playground/disclosure.tsx` — Expand/collapse with `aria-expanded` and CSS animation

## shadcn/ui implementation

Installed via `npx shadcn@latest add dialog tabs` (which also pulled
`button` as a dependency). Generated into `components/ui/`:

- `dialog.tsx` — 11 subcomponents wrapping `@base-ui/react/dialog`
- `tabs.tsx` — 4 subcomponents wrapping `@base-ui/react/tabs`
- `button.tsx` — CVA-styled button wrapping `@base-ui/react/button`

## Accessibility comparison

| Behaviour / ARIA | Manual | shadcn |
|------------------|--------|--------|
| Modal `role="dialog"` + `aria-modal` | ✅ Explicit | ✅ Via library |
| Focus trap in modal | ✅ `useEffect` cycling Tab/Shift+Tab | ✅ Via library (`@base-ui/react/dialog`) |
| Escape closes modal | ✅ `onKeyDown` on document | ✅ Via library |
| Focus returns to trigger | ✅ `requestAnimationFrame` + querySelector | ✅ Via library |
| Backdrop click closes | ✅ `onClick` with target check | ✅ `DialogPrimitive.Backdrop` |
| Tabs `role="tablist"` / `tab` / `tabpanel` | ✅ Explicit | ✅ Via library |
| Arrow key tab navigation | ✅ Left/Right wrap, Home/End | ✅ Via library |
| Tabs `aria-selected` + roving tabindex | ✅ Manual `tabIndex` toggle | ✅ Via library |
| Disclosure `aria-expanded` | ✅ | N/A (not in shadcn) |
| Disclosure `role="region"` + `aria-labelledby` | ✅ | N/A |
| Enter/Space toggle disclosure | ✅ (browser default on `<button>`) | N/A |

## API comparison

| Aspect | Manual | shadcn |
|--------|--------|--------|
| Modal components | 1 (Modal) | 11 (Dialog, DialogTrigger, DialogContent, DialogOverlay, DialogPortal, DialogClose, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogFooter) |
| Modal trigger | `trigger` prop (ReactElement) | `DialogTrigger` wrapper component |
| Tabs components | 1 (Tabs) | 4 (Tabs, TabsList, TabsTrigger, TabsContent) |
| Tab data | `tabs: TabItem[]` prop | Children composition |
| Disclosure components | 1 (Disclosure) | N/A |
| Style model | Inline styles | Tailwind classes + CVA variants |
| Icon support | None (text arrows/symbols) | `lucide-react` (X icon, chevrons) |

## Edge cases

| Edge case | Manual | shadcn |
|-----------|--------|--------|
| Trigger removed while modal open | ❌ Not handled (`querySelector` on removed element fails) | ✅ Via library lifecycle |
| Nested dialogs | ❌ Overwrites a single state value | ✅ Stacking via library |
| Dynamic content added to modal | ❌ Focus trap only scans on open | ✅ Library watches DOM changes |
| Tab adds/removes dynamically | ❌ Relies on static `tabs` array | ✅ Library handles dynamic children |
| `prefers-reduced-motion` | ❌ No media query | ✅ Through Tailwind + data-open/data-closed |
| Vertical tab orientation | ❌ Horizontal only | ✅ `orientation="vertical"` prop |
| SR-only close label | ❌ Visible "Close" text only | ✅ `sr-only` span next to X icon |
| Modal exit animation | ❌ Dialog unmounts instantly | ✅ `data-closed` animation via CSS |
| Portal rendering | ❌ Fixed position inline | ✅ Portal (avoids stacking context bugs) |
| SSR compatibility | ❌ No portal, no hydration guard | ✅ Portal defers to client |

## Observed gaps (manual vs shadcn)

1. **Portal rendering.** shadcn's dialog renders in a React portal,
   avoiding z-index stacking context issues. My manual version uses
   `position: fixed` inline, which can break when rendered inside
   a container with `transform`, `filter`, or `z-index`.

2. **Animation on close.** shadcn applies `data-closed` CSS classes
   that trigger exit animations before unmounting. My version
   unmounts the dialog immediately. This means no fade-out or
   scale-down transition — the dialog disappears instantly.

3. **Focus trap robustness.** shadcn's library (`@base-ui/react/dialog`)
   handles edge cases like dynamic content, nested dialogs, and
   trigger elements that unmount while the dialog is open. My manual
   `useEffect` scans focusable children once on open, so dynamically
   added content is excluded from the tab cycle.

4. **Composition model.** shadcn exposes 11 subcomponents for
   flexible layout composition. My single `Modal` component with
   `children` prop offers less layout flexibility without code changes.

5. **SR-only text.** shadcn's close button includes a visually hidden
   "Close" label alongside the X icon icon. My version uses visible
   text only, which is fine for sighted users but less refined for
   screen reader users who may rely on icon+text patterns.

## What I would reuse in Plinth

| Component | Plinth use case | Changes needed |
|-----------|----------------|----------------|
| Modal | Exhibit media lightbox — click artifact image → full-size modal | Add portal, close animation, nested content support |
| Tabs | Gallery page collection filter — "All" / "Infrastructure" / "Visual Design" / "Experiments" / "Journey" | Add variant prop, use Plinth's color tokens, style for corridor context |
| Disclosure | Curator notes expand — "Show curator notes" → text appears in place | Already compatible, just needs Plinth's design tokens |
| Focus trap hook | Reusable in any Plinth overlay (door transition overlay, media viewer) | Extract into `lib/hooks/useFocusTrap.ts` |
| Keyboard nav pattern | Standardize arrow-key navigation across Plinth | Create `lib/hooks/useRovingTabIndex.ts` |

## Future improvements (not implemented — captured for later)

- Extract focus trap into a reusable `useFocusTrap` hook
- Add portal rendering to Modal via `createPortal`
- Support dynamic content in focus trap (MutationObserver)
- Add `prefers-reduced-motion` respect via CSS
- Add vertical orientation to Tabs
- Add nested dialog support via stack rather than single boolean
