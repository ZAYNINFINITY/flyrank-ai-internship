"use client";

import dynamic from "next/dynamic";
import type { Door, SurfaceDirection } from "@/lib/museum/types";
import type { SurfaceLayout } from "@/lib/museum/queries";
import type { EntityRegistry } from "./entity-view";
import { SurfaceRenderer } from "./surface-renderer";
import { useCapableRenderer } from "@/lib/renderer/use-capable-renderer";

const ExhibitRoom3D = dynamic(
  () =>
    import("@/components/three/exhibit-room-3d").then((m) => m.ExhibitRoom3D),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[420px] items-center justify-center border border-dashed border-[var(--color-text)]/10"
        role="status"
        aria-label="Loading the 3D room"
      >
        <p className="text-xs uppercase tracking-[0.25em] opacity-40">
          Building the room&hellip;
        </p>
      </div>
    ),
  }
);

export function ExhibitWalls({
  layout,
  entityComponents,
  exhibitId,
  portfolioRoute,
  arrivedVia,
}: {
  layout: SurfaceLayout[];
  entityComponents: EntityRegistry;
  doors: Door[];
  entrySurface: SurfaceDirection | null;
  exhibitId: string;
  portfolioRoute?: string;
  arrivedVia?: string | null;
}) {
  const capability = useCapableRenderer();

  if (capability.mode !== "3d") {
    return <SurfaceRenderer layout={layout} entityComponents={entityComponents} />;
  }

  return (
    <ExhibitRoom3D
      layout={layout}
      exhibitId={exhibitId}
      portfolioRoute={portfolioRoute}
      quality={capability.quality}
      arrivedVia={arrivedVia ?? null}
    />
  );
}
