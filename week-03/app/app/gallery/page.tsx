"use client";

import { useEffect, useState, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap, populateCorridor } from "@/lib/museum/placement";
import { MockExhibitRepository } from "@/lib/repository/mock-exhibit-repository";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { GalleryExperience } from "./gallery-experience";

const repo = new MockExhibitRepository();

export default function GalleryPage() {
  const visitor: Visitor = useMemo(() => ({
    currentRoomId: "main-corridor",
    cameFromDoorId: "door-corridor-from-reception",
    enteredAt: Date.now(),
  }), []);

  const [placements, setPlacements] = useState(createPlacementMap());

  useEffect(() => {
    populateCorridor(createPlacementMap(), "main-corridor", repo).then(setPlacements);
  }, []);

  if (placements.size === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <GalleryExperience />
    </WorldRenderer>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6" aria-hidden="true">
      <p className="text-xs uppercase tracking-[0.25em] opacity-20">Loading exhibits...</p>
      <div className="w-8 h-px bg-[var(--color-text)]/10" />
    </div>
  );
}
