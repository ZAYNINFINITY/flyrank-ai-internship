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

export function useCapableRenderer(): RendererCapability {
  const [capability, setCapability] = useState<RendererCapability>(INITIAL);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setCapability(evaluateRendererCapability(detectCapabilityInput()));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return capability;
}
