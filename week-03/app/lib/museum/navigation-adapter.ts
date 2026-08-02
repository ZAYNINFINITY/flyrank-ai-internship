import type { RoomId } from "./types";

const routeMap: Record<RoomId, string> = {
  "entrance-hall": "/",
  "entrance": "/entrance",
  "reception": "/reception",
  "main-corridor": "/gallery",
  "exhibit-room": "/exhibit/e/[id]",
  "collections": "/collection",
  "curator-studio": "/assistant",
};

const roomByRoute = new Map(
  Object.entries(routeMap).map(([id, route]) => [route, id])
);

export function getRoute(roomId: RoomId): string | undefined {
  return routeMap[roomId];
}

export function getRoomIdByRoute(route: string): RoomId | undefined {
  return roomByRoute.get(route);
}

export function getExhibitRoute(exhibitId: string): string {
  return `/exhibit/e/${exhibitId}`;
}
