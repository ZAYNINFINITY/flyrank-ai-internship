"use client";

import { use, useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap, populateExhibitRoom } from "@/lib/museum/placement";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";

export default function ExhibitRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const visitor: Visitor = useMemo(() => ({
    currentRoomId: "exhibit-room",
    cameFromDoorId: "door-exhibit-from-corridor",
    enteredAt: Date.now(),
  }), []);

  const placements = useMemo(
    () => populateExhibitRoom(createPlacementMap(), id, "exhibit-room"),
    [id]
  );

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry} />
  );
}
