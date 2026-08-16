"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Visitor } from "@/lib/museum/types";
import type { ExhibitCollection } from "@/lib/types/exhibit";
import { createPlacementMap, populateCorridor } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { useDoorEntry } from "@/lib/museum/use-door-entry";
import { resolveEntryDoor } from "@/lib/museum/via-entry";
import { MockExhibitRepository } from "@/lib/repository/mock-exhibit-repository";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { GalleryExperience } from "./gallery-experience";

const repo = new MockExhibitRepository();

const validCollections: ExhibitCollection[] = [
  "infrastructure",
  "visual-design",
  "experiments",
  "journey",
];

function toCollection(value: string | null): ExhibitCollection | null {
  return validCollections.includes(value as ExhibitCollection)
    ? (value as ExhibitCollection)
    : null;
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <GalleryView />
    </Suspense>
  );
}

function GalleryView() {
  const searchParams = useSearchParams();
  const collection = toCollection(searchParams.get("collection"));
  const via = useDoorEntry();

  const visitor: Visitor = useMemo(
    () =>
      enterRoom(
        createVisitor("main-corridor"),
        "main-corridor",
        resolveEntryDoor(via, "main-corridor")
      ),
    [via]
  );

  const [placements, setPlacements] = useState(createPlacementMap());

  useEffect(() => {
    const load = async () => {
      setPlacements(createPlacementMap());
      const exhibits = collection
        ? await repo.getByCollection(collection)
        : await repo.getAll();
      const next = await populateCorridor(
        createPlacementMap(),
        "main-corridor",
        repo,
        exhibits
      );
      setPlacements(next);
    };
    void load();
  }, [collection]);

  if (placements.size === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <GalleryExperience collection={collection} />
    </WorldRenderer>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4 px-6" aria-hidden="true">
      <p className="text-xs uppercase tracking-[0.25em] opacity-20">Loading exhibits...</p>
      <div className="w-8 h-px bg-[var(--color-text)]/10" />
    </div>
  );
}
