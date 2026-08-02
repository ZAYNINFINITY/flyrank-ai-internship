import type { SurfaceDirection, Visitor } from "@/lib/museum/types";
import type { Direction } from "@/lib/navigation/museum-layout";
import { getDoor } from "@/lib/museum/world";

const opposites: Record<SurfaceDirection, SurfaceDirection> = {
  north: "south", south: "north", east: "west", west: "east",
};

const cw: Record<SurfaceDirection, SurfaceDirection> = {
  north: "east", east: "south", south: "west", west: "north",
};

export function getRelativeDirection(
  entrySurface: SurfaceDirection,
  doorSurface: SurfaceDirection
): Direction {
  if (doorSurface === entrySurface) return "back";
  const opposite = opposites[entrySurface];
  if (doorSurface === opposite) return "ahead";
  if (doorSurface === cw[opposite]) return "right";
  return "left";
}

export function getEntrySurface(visitor: Visitor): SurfaceDirection | null {
  if (!visitor.cameFromDoorId) return null;
  const door = getDoor(visitor.cameFromDoorId);
  if (!door) return "south";
  if (door.fromRoom === visitor.currentRoomId) return door.fromSurface;
  if (door.toRoom === visitor.currentRoomId) return door.toSurface;
  return "south";
}
