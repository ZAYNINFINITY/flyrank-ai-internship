import type { DoorId, RoomId } from "./types";
import { getDoor } from "./world";

const DEFAULT_ENTRY_DOORS: Partial<Record<RoomId, DoorId>> = {
  entrance: "door-entrance-from-hall",
  reception: "door-reception-from-entrance",
  "main-corridor": "door-corridor-from-reception",
  "exhibit-room": "door-exhibit-from-corridor",
};

function doorConnectsRoom(doorId: DoorId, roomId: RoomId): boolean {
  const door = getDoor(doorId);
  if (!door) return false;
  return door.fromRoom === roomId || door.toRoom === roomId;
}

/** Validate a raw `?via=` value against the world graph. */
export function parseViaParam(via: string | null): DoorId | null {
  if (!via) return null;
  return getDoor(via) ? via : null;
}

/** Resolve which door the visitor entered through; invalid/missing via falls back safely. */
export function resolveEntryDoor(via: string | null, toRoom: RoomId): DoorId {
  const parsed = parseViaParam(via);
  if (parsed && doorConnectsRoom(parsed, toRoom)) return parsed;
  const fallback = DEFAULT_ENTRY_DOORS[toRoom];
  if (fallback) return fallback;
  return parsed ?? "door-exhibit-from-corridor";
}

/** `?via=` honored for spawn/entry only when the door connects to the room. */
export function viaForRoom(via: string | null, roomId: RoomId): DoorId | null {
  const parsed = parseViaParam(via);
  if (!parsed || !doorConnectsRoom(parsed, roomId)) return null;
  return parsed;
}
