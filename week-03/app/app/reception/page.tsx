"use client";

import { useMemo } from "react";
import type { Visitor } from "@/lib/museum/types";
import { createPlacementMap } from "@/lib/museum/placement";
import { createVisitor, enterRoom } from "@/lib/museum/visitor";
import { WorldRenderer } from "@/components/renderer/world-renderer";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import { ReceptionExperience } from "./reception-experience";

export default function ReceptionPage() {
  const visitor: Visitor = useMemo(
    () => enterRoom(createVisitor("reception"), "reception", "door-reception-from-entrance"),
    []
  );

  const placements = useMemo(() => createPlacementMap(), []);

  return (
    <WorldRenderer visitor={visitor} placements={placements} entityComponents={defaultEntityRegistry}>
      <ReceptionExperience />
    </WorldRenderer>
  );
}
