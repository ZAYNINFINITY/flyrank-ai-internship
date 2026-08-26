"use client";

import { useEffect, useState } from "react";
import {
  type RendererCapability,
  detectCapabilityInput,
  evaluateRendererCapability,
} from "./capability";

const INITIAL: RendererCapability = {
  mode: "2d",
  reason: "unsupported-webgl",
  quality: { maxDpr: 1, shadows: false },
};

function hasViewOverride(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "2d" || params.get("view") === "3d";
}

function getViewOverride(): "2d" | "3d" | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get("view");
  if (v === "2d" || v === "3d") return v;
  return null;
}

export function useCapableRenderer(): RendererCapability {
  const [capability, setCapability] = useState<RendererCapability>(INITIAL);

  useEffect(() => {
    const override = getViewOverride();
    if (override) {
      setCapability({
        mode: override,
        reason: override === "2d" ? "unsupported-webgl" : "webgl2-ok",
        quality: override === "2d" ? { maxDpr: 1, shadows: false } : { maxDpr: 2, shadows: true },
      });
      return;
    }

    const id = requestAnimationFrame(() => {
      setCapability(evaluateRendererCapability(detectCapabilityInput()));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return capability;
}
