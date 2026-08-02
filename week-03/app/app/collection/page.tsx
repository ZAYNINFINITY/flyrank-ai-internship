"use client";

import { useEffect, useState, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap, populateCorridor } from "@/lib/museum/placement";
import { MockExhibitRepository } from "@/lib/repository/mock-exhibit-repository";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { CollectionExperience } from "./collection-experience";

const repo = new MockExhibitRepository();

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6" aria-hidden="true">
      <p className="text-xs uppercase tracking-[0.25em] opacity-20">Loading collection...</p>
      <div className="w-8 h-px bg-[var(--color-text)]/10" />
    </div>
  );
}

export default function CollectionPage() {
  const visitor: Visitor = useMemo(() => ({
    currentRoomId: "collections",
    cameFromDoorId: "door-collections-from-reception",
    enteredAt: Date.now(),
  }), []);

  const [placements, setPlacements] = useState(createPlacementMap());

  useEffect(() => {
    populateCorridor(createPlacementMap(), "collections", repo).then(setPlacements);
  }, []);

  if (placements.size === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <CollectionExperience />
    </WorldRenderer>
  );
}
