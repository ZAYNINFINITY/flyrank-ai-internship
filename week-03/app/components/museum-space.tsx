"use client";

import { type ReactNode, useEffect } from "react";
import type { LightingPreset } from "@/lib/museum/types";

type TransitionType = "doorway-fade" | "spotlight-reveal" | "corridor" | "none";

const presetToSpace: Record<string, string> = {
  entrance: "entrance",
  reception: "reception",
  gallery: "gallery",
  exhibit: "exhibit",
  studio: "studio",
  collection: "gallery",
  archive: "gallery",
  outside: "entrance",
};

const SPACE_ATTR = "data-museum-space";

export function MuseumSpace({
  preset,
  transition = "doorway-fade",
  children,
}: {
  preset: LightingPreset;
  transition?: TransitionType;
  children: ReactNode;
}) {
  const space = presetToSpace[preset] ?? "gallery";

  useEffect(() => {
    document.documentElement.setAttribute(SPACE_ATTR, space);
    return () => {
      document.documentElement.removeAttribute(SPACE_ATTR);
    };
  }, [space]);

  return (
    <div data-museum-transition={transition} className="relative min-h-screen">
      <div className="space-glow" aria-hidden="true" />
      <div className="space-content relative z-1">{children}</div>
    </div>
  );
}
