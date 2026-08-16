"use client";

import { Suspense, use, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap, populateExhibitRoom } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { useDoorEntry } from "@/lib/museum/use-door-entry";
import { resolveEntryDoor, viaForRoom } from "@/lib/museum/via-entry";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { ExhibitWalls } from "@/components/renderer/exhibit-walls";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { getPortfolioRouteForExhibitId } from "@/lib/museum/navigation-adapter";

function ExhibitRoomContent({ id }: { id: string }) {
  const via = useDoorEntry();
  const doorId = resolveEntryDoor(via, "exhibit-room");
  const validatedVia = viaForRoom(via, "exhibit-room");

  const visitor: Visitor = useMemo(
    () => enterRoom(createVisitor("exhibit-room"), "exhibit-room", doorId),
    [doorId]
  );

  const placements = useMemo(
    () => populateExhibitRoom(createPlacementMap(), id, "exhibit-room"),
    [id]
  );

  const portfolioRoute = getPortfolioRouteForExhibitId(id);

  return (
    <WorldRenderer
      visitor={visitor}
      placements={placements}
      entityComponents={defaultEntityRegistry}
      wallsOverride={(props) => (
        <ExhibitWalls
          {...props}
          exhibitId={id}
          portfolioRoute={portfolioRoute}
          arrivedVia={validatedVia}
        />
      )}
    >
      {portfolioRoute && (
        <a
          href={portfolioRoute}
          className="self-start inline-block border border-[var(--color-text)]/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text)]/60 transition-all duration-500 hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)]"
        >
          Open the full exhibit →
        </a>
      )}
    </WorldRenderer>
  );
}

export default function ExhibitRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={null}>
      <ExhibitRoomContent id={id} />
    </Suspense>
  );
}
