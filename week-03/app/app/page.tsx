"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createPlacementMap, populateExhibitRoom } from "@/lib/museum/placement";
import { getSurfaceLayout } from "@/lib/museum/queries";
import { getPortfolioRouteForExhibitId } from "@/lib/museum/navigation-adapter";
import type { RendererQuality } from "@/lib/renderer/capability";
import { OperationalRoom } from "@/components/ops/operational-room";
import { StoryIntro } from "@/components/ops/story-intro";

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

// A clean `/` link is Foyer's front door: it hands the visitor a choice of
// how to step inside rather than silently committing to one renderer.
// - `/`             → the story chooser (3D or 2D)
// - `/?view=2d`     → the flat 2D engine room
// - `/?view=3d`     → the 3D museum
// Reading the path's ?view via useSearchParams is reactive on navigation and
// server-aware on direct loads, so switching modes never flashes a wrong page.
const QUALITY_3D: RendererQuality = { maxDpr: 2, shadows: true };

function HomeContent() {
  const params = useSearchParams();
  const view = params.get("view");

  const layout = useMemo(
    () =>
      getSurfaceLayout(
        "exhibit-room",
        populateExhibitRoom(createPlacementMap(), HOME_EXHIBIT_ID, "exhibit-room")
      ),
    []
  );

  if (view === "2d") {
    return <OperationalRoom />;
  }

  if (view === "3d") {
    return (
      <ExhibitRoom3D
        layout={layout}
        exhibitId={HOME_EXHIBIT_ID}
        portfolioRoute={getPortfolioRouteForExhibitId()}
        quality={QUALITY_3D}
        arrivedVia={null}
      />
    );
  }

  return <StoryIntro />;
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
