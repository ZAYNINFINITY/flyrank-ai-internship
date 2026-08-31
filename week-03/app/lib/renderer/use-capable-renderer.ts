"use client";

import { useEffect, useState } from "react";
import {
  type RendererCapability,
  detectCapabilityInput,
  evaluateRendererCapability,
} from "./capability";

function getViewOverride(): "2d" | "3d" | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get("view");
  if (v === "2d" || v === "3d") return v;
  return null;
}

function detectInitial(): RendererCapability {
  const override = getViewOverride();
  if (override === "2d") {
    return {
      mode: "2d",
      reason: "unsupported-webgl",
      quality: { maxDpr: 1, shadows: false },
    };
  }
  if (override === "3d") {
    // A force-3D toggle must never strand a device that can't run the scene.
    // If WebGL isn't actually available, honor the intent as best we can by
    // landing back on the flat room instead of a black/failing viewport.
    const detected = evaluateRendererCapability(detectCapabilityInput());
    if (detected.mode === "3d") return detected;
    return {
      mode: "2d",
      reason: "unsupported-webgl",
      quality: { maxDpr: 1, shadows: false },
    };
  }
  return evaluateRendererCapability(detectCapabilityInput());
}

// Server-safe default: detectCapabilityInput() always reports
// supportsWebGL2: false when `window` is undefined, so the server
// always renders the 2D path. Starting every client render at this
// exact same value guarantees the first client render (during
// hydration) matches the server's output byte-for-byte — no mismatch.
// The real capability is detected a tick later, safely after mount,
// inside useEffect, and applied via a state update. This trades a
// possible one-frame 2D→3D swap for correctness, which is strictly
// better than the hydration error it replaces: a "Recoverable Error"
// silently discards and re-renders the whole tree client-side anyway,
// so this removes wasted work and visible flicker, not just a warning.
const SERVER_SAFE_DEFAULT: RendererCapability = {
  mode: "2d",
  reason: "unsupported-webgl",
  quality: { maxDpr: 1, shadows: false },
};

export function useCapableRenderer(): RendererCapability {
  const [capability, setCapability] = useState<RendererCapability>(SERVER_SAFE_DEFAULT);

  // Re-detect whenever the URL's ?view= override changes (2D ↔ 3D toggles
  // are plain links to /?view=2d and /?view=3d, which only change the query
  // string — the page component itself never remounts). Reading the search
  // here and using it as the effect dependency makes the renderer switch
  // without a reload. On the server this is "" so the first client render
  // still matches the hydration output, then the real value takes over.
  const search = typeof window === "undefined" ? "" : window.location.search;

  useEffect(() => {
    // Deferred via requestAnimationFrame to satisfy react-hooks/set-state-in-effect
    // (same convention used throughout operational-room.tsx). This is purely a
    // lint-satisfying deferral, not a hydration-safety requirement: React only
    // runs effects after commit, so the setState call is already guaranteed to
    // land after hydration regardless of how it's wrapped.
    const raf = requestAnimationFrame(() => setCapability(detectInitial()));
    return () => cancelAnimationFrame(raf);
  }, [search]);

  return capability;
}
