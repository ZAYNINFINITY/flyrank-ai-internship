"use client";

import { useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap } from "@/lib/museum/placement";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { EntranceExperience } from "./entrance-experience";

export default function EntrancePage() {
  const visitor: Visitor = useMemo(() => ({
    currentRoomId: "entrance",
    cameFromDoorId: "door-entrance-from-hall",
    enteredAt: Date.now(),
  }), []);

  const placements = useMemo(() => createPlacementMap(), []);

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <EntranceExperience />
    </WorldRenderer>
  );
}
