"use client";

import { useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { EntranceExperience } from "./entrance-experience";

export default function EntrancePage() {
  const visitor: Visitor = useMemo(
    () => enterRoom(createVisitor("entrance"), "entrance", "door-entrance-from-hall"),
    []
  );

  const placements = useMemo(() => createPlacementMap(), []);

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <EntranceExperience />
    </WorldRenderer>
  );
}
