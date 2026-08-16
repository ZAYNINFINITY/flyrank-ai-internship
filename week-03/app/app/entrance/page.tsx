"use client";

import { Suspense, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { useDoorEntry } from "@/lib/museum/use-door-entry";
import { resolveEntryDoor } from "@/lib/museum/via-entry";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { EntranceExperience } from "./entrance-experience";

function EntranceView() {
  const via = useDoorEntry();
  const visitor: Visitor = useMemo(
    () =>
      enterRoom(
        createVisitor("entrance"),
        "entrance",
        resolveEntryDoor(via, "entrance")
      ),
    [via]
  );

  const placements = useMemo(() => createPlacementMap(), []);

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <EntranceExperience />
    </WorldRenderer>
  );
}

export default function EntrancePage() {
  return (
    <Suspense fallback={null}>
      <EntranceView />
    </Suspense>
  );
}
