"use client";

import { useMemo } from "react";
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
  if (override) {
    return {
      mode: override,
      reason: override === "2d" ? "unsupported-webgl" : "webgl2-ok",
      quality: override === "2d" ? { maxDpr: 1, shadows: false } : { maxDpr: 2, shadows: true },
    };
  }
  return evaluateRendererCapability(detectCapabilityInput());
}

export function useCapableRenderer(): RendererCapability {
  const capability = useMemo(() => detectInitial(), []);

  return capability;
}
