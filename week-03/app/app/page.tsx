"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { createPlacementMap, populateExhibitRoom } from "@/lib/museum/placement";
import { getSurfaceLayout } from "@/lib/museum/queries";
import { useCapableRenderer } from "@/lib/renderer/use-capable-renderer";
import { getPortfolioRouteForExhibitId } from "@/lib/museum/navigation-adapter";

// Loaded client-side only — three.js/r3f can't run during SSR.
const ExhibitRoom3D = dynamic(
  () => import("@/components/three/exhibit-room-3d").then((m) => m.ExhibitRoom3D),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a0b16]">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          Building the museum&hellip;
        </p>
      </div>
    ),
  }
);

// The room the front door opens into. Walking further in (through the
// corridor door) reveals every other exhibit hanging on the corridor walls.
const HOME_EXHIBIT_ID = "pos-it";

// This is the front door of Plinth. No hero text, no "Enter the Museum"
// button, no marketing beats to scroll past first — the museum itself IS
// the homepage, the same way itom's site puts you straight into the space
// instead of behind a landing page. Low-power / no-WebGL devices still get
// a minimal flat entrance below, since that's a real accessibility need,
// not a design choice.
export default function HomePage() {
  const capability = useCapableRenderer();

  const layout = useMemo(
    () =>
      getSurfaceLayout(
        "exhibit-room",
        populateExhibitRoom(createPlacementMap(), HOME_EXHIBIT_ID, "exhibit-room")
      ),
    []
  );

  if (capability.mode !== "3d") {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-6 text-center">
        <div>
          <h1 className="font-heading text-[28px] text-text md:text-[36px]">
            Plinth Museum
          </h1>
          <p className="mt-3 max-w-[420px] font-body text-[15px] leading-relaxed text-text/60">
            A digital museum of developer projects. Your device is showing
            the flat, low-power view — every room still exists, just as text
            and links instead of walkable 3D.
          </p>
        </div>
        <a
          href="/reception"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/25 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Enter the Museum
        </a>
      </main>
    );
  }

  return (
    <ExhibitRoom3D
      layout={layout}
      exhibitId={HOME_EXHIBIT_ID}
      portfolioRoute={getPortfolioRouteForExhibitId()}
      quality={capability.quality}
      arrivedVia={null}
    />
  );
}
