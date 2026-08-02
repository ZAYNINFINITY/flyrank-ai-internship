import type { Visitor, RoomId, DoorId } from "./types";
import { getRoom } from "./world";

export function createVisitor(roomId: RoomId): Visitor {
  return {
    currentRoomId: roomId,
    cameFromDoorId: null,
    enteredAt: Date.now(),
  };
}

export function enterRoom(visitor: Visitor, roomId: RoomId, doorId: DoorId): Visitor {
  return {
    currentRoomId: roomId,
    cameFromDoorId: doorId,
    enteredAt: Date.now(),
  };
}

export function getRoomName(visitor: Visitor): string {
  return getRoom(visitor.currentRoomId)?.name ?? "Unknown";
}
