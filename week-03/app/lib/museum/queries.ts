import type {
  Visitor, Room, Door, Anchor, Placement,
  Surface, Wing, Floor, AnchorId,
} from "./types";
import { building, getRoom } from "./world";

// ─── Room ─────────────────────────────────────────────────
export function getCurrentRoom(visitor: Visitor): Room | undefined {
  return getRoom(visitor.currentRoomId);
}

// ─── Navigation ───────────────────────────────────────────
export function getVisibleDoors(visitor: Visitor): Door[] {
  return getRoom(visitor.currentRoomId)?.doors ?? [];
}

export interface ConnectedRoom {
  door: Door;
  room: Room;
}

export function getConnectedRooms(visitor: Visitor): ConnectedRoom[] {
  const doors = getVisibleDoors(visitor);
  return doors
    .map((d) => ({ door: d, room: getRoom(d.toRoom) }))
    .filter((c): c is ConnectedRoom => c.room !== undefined);
}

// ─── Surface layout (pre-joined with placements) ──────────
export type SurfaceLayoutAnchor = {
  anchor: Anchor;
  placement: Placement | undefined;
};

export type SurfaceLayout = {
  direction: Surface["direction"];
  anchors: SurfaceLayoutAnchor[];
};

export function getSurfaceLayout(
  roomId: string,
  placementMap: Map<AnchorId, Placement>
): SurfaceLayout[] {
  const room = getRoom(roomId);
  if (!room) return [];

  return room.surfaces.map((surface) => ({
    direction: surface.direction,
    anchors: surface.anchors.map((anchor) => ({
      anchor,
      placement: placementMap.get(anchor.id),
    })),
  }));
}

// ─── Context ──────────────────────────────────────────────
export function getWing(roomId: string): Wing | undefined {
  for (const floor of building.floors) {
    for (const wing of floor.wings) {
      if (wing.rooms.includes(roomId)) return wing;
    }
  }
  return undefined;
}

export function getFloor(roomId: string): Floor | undefined {
  for (const floor of building.floors) {
    for (const wing of floor.wings) {
      if (wing.rooms.includes(roomId)) return floor;
    }
  }
  return undefined;
}
