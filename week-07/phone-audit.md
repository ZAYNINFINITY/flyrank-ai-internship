# Phone Audit

## Tested viewports

- 375×812 (layout/CSS review via responsive classes)
- 390×844 (breadcrumb wrap, touch targets)
- 412×915 (fullscreen 3D overlay controls)

## Fixed issues

- SpatialBreadcrumb stacks/wraps on narrow screens instead of forcing horizontal overflow
- Museum shell uses `min-h-[100dvh]` instead of `100vh` where viewport height matters
- 3D overlay buttons (`Text walls`, prompt pill, inspect actions) use minimum touch-friendly sizing
- Walkable scene uses `100dvh` fullscreen portal

## Remaining issues

- No on-screen joystick graphic for touch (drag-to-scroll only)
- 3D scene readability on very small phones depends on user zooming via parallax drag — no dedicated mobile composition layer
- Large portfolio PNGs may slow exhibit portfolio pages on slow networks

## Real-device verification

Pending manual verification on physical iOS/Android hardware.
