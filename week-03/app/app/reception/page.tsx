"use client";

import { Suspense, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { useDoorEntry } from "@/lib/museum/use-door-entry";
import { resolveEntryDoor } from "@/lib/museum/via-entry";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { ReceptionExperience } from "./reception-experience";

function ReceptionView() {
  const via = useDoorEntry();
  const visitor: Visitor = useMemo(
    () =>
      enterRoom(
        createVisitor("reception"),
        "reception",
        resolveEntryDoor(via, "reception")
      ),
    [via]
  );

  const placements = useMemo(() => createPlacementMap(), []);

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <ReceptionExperience />
    </WorldRenderer>
  );
}

export default function ReceptionPage() {
  return (
    <Suspense fallback={null}>
      <ReceptionView />
    </Suspense>
  );
}
