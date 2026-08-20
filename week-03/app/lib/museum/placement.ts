import type { Placement, AnchorId, EntityType, AnchorCapability, RoomId } from "./types";
import { getAnchorsByCapability, getRoom } from "./world";
import type { ExhibitRepository } from "@/lib/repository/exhibit-repository";
import type { Exhibit } from "@/lib/types/exhibit";

const entityCapabilities: Record<EntityType, AnchorCapability[]> = {
  exhibit: ["display"],
  artifact: ["display", "pedestal"],
  projection: ["projection"],
  timeline: ["display"],
  terminal: ["terminal"],
  statue: ["pedestal"],
  signage: ["signage"],
};

export function canPlace(
  anchorCapabilities: AnchorCapability[],
  entityType: EntityType
): boolean {
  const required = entityCapabilities[entityType];
  return required.some((c) => anchorCapabilities.includes(c));
}

export function createPlacementMap(): Map<AnchorId, Placement> {
  return new Map();
}

export function place(
  map: Map<AnchorId, Placement>,
  anchorId: AnchorId,
  entityType: EntityType,
  entityId: string
): Map<AnchorId, Placement> {
  const next = new Map(map);
  next.set(anchorId, { anchorId, entityType, entityId });
  return next;
}

export function getPlacementAtAnchor(
  map: Map<AnchorId, Placement>,
  anchorId: AnchorId
): Placement | undefined {
  return map.get(anchorId);
}

export async function populateCorridor(
  map: Map<AnchorId, Placement>,
  roomId: RoomId,
  repo: ExhibitRepository,
  exhibits?: Exhibit[]
): Promise<Map<AnchorId, Placement>> {
  const all = exhibits ?? (await repo.getAll());
  // Corridor bays represent developers, not projects (each bay = "who is
  // exhibiting here?"). Picking the first N exhibits in seed order would
  // let one prolific developer fill most of the corridor if their projects
  // happen to sort first — so instead we take the first exhibit per
  // distinct developerId, preserving seed order, so each filled bay is a
  // different person.
  const seen = new Set<string>();
  const items: Exhibit[] = [];
  for (const exhibit of all) {
    if (seen.has(exhibit.developerId)) continue;
    seen.add(exhibit.developerId);
    items.push(exhibit);
  }

  const displayAnchors = getAnchorsByCapability(roomId, "display");
  let next = map;

  for (let i = 0; i < Math.min(items.length, displayAnchors.length); i++) {
    next = place(next, displayAnchors[i].id, "exhibit", items[i].id);
  }

  return next;
}

export function populateExhibitRoom(
  map: Map<AnchorId, Placement>,
  exhibitId: string,
  roomId: RoomId
): Map<AnchorId, Placement> {
  const room = getRoom(roomId);
  if (!room) return map;

  let next = map;

  for (const surface of room.surfaces) {
    for (const anchor of surface.anchors) {
      if (anchor.capabilities.includes("signage")) {
        if (anchor.id.includes("notes")) {
          next = place(next, anchor.id, "signage", `${exhibitId}-notes`);
        } else {
          next = place(next, anchor.id, "signage", `${exhibitId}-title`);
        }
      } else if (anchor.capabilities.includes("projection")) {
        next = place(next, anchor.id, "projection", exhibitId);
      } else if (anchor.capabilities.includes("display") || anchor.capabilities.includes("pedestal")) {
        next = place(next, anchor.id, "artifact", exhibitId);
      }
    }
  }

  return next;
}
