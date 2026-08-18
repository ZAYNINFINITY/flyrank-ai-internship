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

/**
 * Resolves an exhibit id to its developer's profile route.
 * Returns undefined if the exhibit has no developer profile.
 */
export function getDeveloperRouteForExhibitId(): string | undefined {
  // This will be wired to the DeveloperRepository in a later phase.
  // For now, return undefined — the 3D world will handle missing routes.
  return undefined;
}

/** @deprecated Use getDeveloperRouteForExhibitId instead */
export function getPortfolioRouteForExhibitId(): string | undefined {
  return getDeveloperRouteForExhibitId();
}
