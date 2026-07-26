# Figma Wireframe Spec — Plinth

This document maps every page and component we've built so far into a Figma-ready spec. Use it as a handoff guide — each section defines exact spacing, sizing, colors, and layout rules so Figma matches the code 1:1.

---

## Design Tokens (copy into Figma)

### Colors

| Token | Hex | Usage |
|---|---|---|
| Text | `#0F172A` | Primary text, borders, Frame borders |
| Background | `#FAFAFA` | Page background |
| Accent | `#2563EB` | Spotlight Button fill, LIVE tags, focus rings |

**Rule:** Accent appears once per screen max. Never as background wash. Never repeated as decoration.

### Fonts

| Role | Font | Weights | Use for |
|---|---|---|---|
| Heading | Space Grotesk | 500, 700 | Claim, project titles, exhibit names |
| Body | Inter | 400, 500 | Paragraphs, tag labels, nav links, buttons |

### Spacing

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| Beat gap (between sections) | 128px | 96px | 64px |
| Page gutter | 48px | 32px | 24px |
| Frame internal padding | 24px min | 24px min | 24px min |
| Button horizontal padding | 32px+ | 32px+ | 32px+ |

### Breakpoints

| Name | Width |
|---|---|
| Mobile | 375px |
| Tablet | 768px |
| Desktop | 1280px |

---

## Page 1: Landing (`/`)

### Nav (fixed or sticky, optional — currently static)

```
┌─────────────────────────────────────────────────────────┐
│  Plinth          Explore   About   Sign in   GitHub     │
│  (wordmark)                                               │
└─────────────────────────────────────────────────────────┘
```

- Left: "Plinth" wordmark — Space Grotesk 500, 14px, text color
- Right: 4 links — Inter 400, 14px, 60% opacity, hover → 100%
- Padding: 20px vertical, 48px horizontal (desktop)
- Footer link between each item: no — just gap-6 (24px)

### Beat 1 — Entrance (100vh)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   A room for every project                              │
│   you've shipped.                                       │
│                                                         │
│   An open-source platform where any developer           │
│   gets a gallery-style exhibit page for their           │
│   projects — real space, real story, nothing            │
│   competing for attention.                              │
│                                                         │
│   [ Create your exhibit ]  ← accent fill button         │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Claim (h1) | Space Grotesk 700, 80px desktop / 36px mobile, line-height 1.08, tracking tight, text color |
| Supporting sentence | Inter 400, 19px desktop / 17px mobile, line-height relaxed, 60% opacity text |
| Spotlight Button | Accent fill, white text, Inter 500 14px, px-32 py-12, min 44×44 hit area |
| Layout | Left-aligned, max-width 640px, vertically centered (not dead-center — optical center-left) |
| Background | Background color only. No image. No gradient. No illustration. |

### Beat 2 — What this is (100vh)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│        Every project gets a room of its own.            │
│        Not a card in a grid, not a thumbnail            │
│        in a cluster — a dedicated page with             │
│        space to tell the story behind what              │
│        you built. Plinth is open-source,                │
│        and yours starts here.                           │
│                                                         │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│   │         │  │         │  │         │               │
│   │ (empty) │  │ (empty) │  │ (empty) │               │
│   │         │  │         │  │         │               │
│   ├─────────┤  ├─────────┤  ├─────────┤               │
│   │ LIVE    │  │ LIVE    │  │ LIVE    │  ← gray tags  │
│   │ POS-it  │  │ Collab  │  │ Scroll  │               │
│   └─────────┘  └─────────┘  └─────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Paragraph | Inter 400, 19px/17px, 70% opacity, centered, max-width 560px |
| Frame grid | 3 columns desktop / 1 mobile, gap 24px |
| Frames | 1px border at 10% text opacity, 3px radius, min-height ~160px |
| Tags | **Gray (placeholder variant)** on landing page — not accent blue. Inter 11px uppercase, 0.05em tracking, 40% opacity |
| Project names | Space Grotesk 500, 15px, text color |
| Frame hover | Border deepens to 20% opacity |

### Beat 3 — Explore CTA (60vh)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│               [ Explore all exhibits ]  ← ghost button  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Ghost anchor | Outline only, 15% text border, transparent fill, Inter 500 14px, min 44×44, centered |

### Footer

```
┌─────────────────────────────────────────────────────────┐
│  GitHub · About                                         │
└─────────────────────────────────────────────────────────┘
```

- 2 links, Inter 400, 14px, 40% opacity, gap 24px
- Top border: 1px at 10% text opacity
- Padding: 24px vertical, 48px horizontal

---

## Page 2: Explore (`/explore`)

### Header + Empty State

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Explore exhibits                                       │
│                                                         │
│  The first exhibits are being built. Yours              │
│  could be next.                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| h1 | Space Grotesk 500, 36px desktop / 28px mobile |
| Empty state copy | Inter 400, 16px, 50% opacity, max-width 480px |

### Exhibit Grid

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│               │ │               │ │               │
│   (empty)     │ │   (empty)     │ │   (empty)     │
│               │ │               │ │               │
├───────────────┤ ├───────────────┤ ├───────────────┤
│ LIVE          │ │ OPENING SOON  │ │ OPENING SOON  │
│ Zain Ul       │ │ Your exhibit  │ │ Your exhibit  │
│ Abideen       │ │ here          │ │ here          │
│ CS student... │ │ Create your   │ │ Create your   │
│               │ │ exhibit...    │ │ exhibit...    │
│ View exhibit→ │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
```

**Live Slot (clickable):**

| Element | Spec |
|---|---|
| Frame | Same as landing — 1px border 10% opacity, 3px radius |
| LIVE tag | Accent blue (`#2563EB`), Inter 11px uppercase, 0.05em tracking |
| Name | Space Grotesk 500, 17px |
| Tagline | Inter 400, 14px, 50% opacity |
| "View exhibit →" | Inter 400, 13px, 40% opacity → 60% on hover |
| Hover | Border deepens to 20% |
| Link | Entire card is clickable, focus-visible outline on the frame |

**Opening Soon Slot (not clickable):**

| Element | Spec |
|---|---|
| Frame | Same dimensions, same border |
| OPENING SOON tag | Neutral gray (40% text opacity), Inter 11px uppercase |
| Name | Space Grotesk 500, 17px, 30% opacity |
| Tagline | Inter 400, 14px, 20% opacity |
| Cursor | Default (not pointer) |
| Hover | No hover state |
| `aria-disabled` | true |

**Grid:** 3 columns desktop / 2 tablet / 1 mobile, gap 32px, max-width 1120px

---

## Component Specs (for Figma components)

### The Frame

```
┌──────────────────────────────────────┐
│  24px padding all sides              │
│  1px border: #0F172A at 10% opacity  │
│  Border-radius: 3px                  │
│  No shadow                           │
│  No gradient                         │
│  Min-height: varies by context       │
└──────────────────────────────────────┘
```

### The Spotlight Button

```
┌──────────────────────────────────────┐
│  Fill: #2563EB                       │
│  Text: white, Inter 500, 14px        │
│  Padding: 32px horizontal, 12px vert │
│  Border-radius: 3px                  │
│  Min size: 44×44px (tap target)      │
│  Hover: opacity 90%                  │
│  Focus: 2px outline, offset 2px      │
│  ONE per screen maximum              │
└──────────────────────────────────────┘
```

### The Ghost Button

```
┌──────────────────────────────────────┐
│  Fill: transparent                   │
│  Border: 1px, #0F172A at 15% opacity │
│  Text: #0F172A, Inter 500, 14px      │
│  Padding: 32px horizontal, 12px vert │
│  Border-radius: 3px                  │
│  Min size: 44×44px                   │
│  Hover: border deepens to 30%        │
│  Focus: 2px outline, offset 2px      │
│  Used for ALL secondary actions      │
└──────────────────────────────────────┘
```

### The Museum Tag Label

```
Font: Inter 400
Size: 11px
Case: UPPERCASE
Letter-spacing: 0.05em

Variant "live":      color = #2563EB (accent blue)
Variant "placeholder": color = #0F172A at 40% opacity (gray)

RULE: Text content always present ("LIVE" / "OPENING SOON")
      Color is never the only signal of meaning.
```

### The Floor Directory

```
Semantic: <nav> with <ol>

01  POS-it
02  Collaborative Workspace
03  ZSE Store
04  ScrollStreak

- Numbers: Inter 11px uppercase, 0.05em tracking, 40% opacity
- Labels: Inter 14px, 60% opacity → 100% on hover
- Gap between items: 12px
- Vertical layout on desktop, horizontal scroll on mobile
```

---

## Responsive Behavior Summary

| Element | 375px (mobile) | 768px (tablet) | 1280px (desktop) |
|---|---|---|---|
| Nav | "Menu" text trigger, full-screen overlay | Full nav if space allows | Full horizontal nav |
| Hero claim | 36px | 56px | 80px |
| Room Block | Stacked (image top, text below) | Side-by-side begins | Full side-by-side, alternating |
| Floor Directory | Horizontal scroll strip or "Jump to" select | Vertical list | Vertical list |
| Exhibit grid | 1 column | 2 columns | 3 columns |
| Gutter/padding | 24px | 32px | 48px |

---

## Accessibility Checklist (for Figma review)

- [ ] White on accent: 5.17:1 (passes WCAG AA 4.5:1)
- [ ] Accent on background: 4.95:1 (passes WCAG AA 3:1 for non-text)
- [ ] Every clickable Frame has visible focus ring (accent blue, 2px, offset 2px)
- [ ] All buttons minimum 44×44px hit area
- [ ] Museum Tag Labels always include text — color never carries meaning alone
- [ ] `prefers-reduced-motion` fallback for any animated transitions

---

*This document is a Figma handoff spec, not a design file. Build Figma components to match these exact values — the code is the source of truth.*
