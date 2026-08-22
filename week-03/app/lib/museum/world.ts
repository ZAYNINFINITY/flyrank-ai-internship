import type {
  Building, Floor, Wing, Room, Door, Surface, Anchor,
  RoomId, DoorId, AnchorId, WorldIndex,
  SurfaceDirection, AnchorCapability,
} from "./types";

const n: SurfaceDirection = "north";
const s: SurfaceDirection = "south";
const e: SurfaceDirection = "east";
const w: SurfaceDirection = "west";

function door(
  id: string, label: string,
  fromRoom: string, fromSurface: SurfaceDirection,
  toRoom: string, toSurface: SurfaceDirection
): Door {
  return { id, label, fromRoom, fromSurface, toRoom, toSurface };
}

function anchor(
  id: string, label: string,
  surfaceDirection: SurfaceDirection,
  position: "left" | "center" | "right",
  capabilities: AnchorCapability[]
): Anchor {
  return { id, label, surfaceDirection, position, capabilities };
}

function surface(direction: SurfaceDirection, ...anchors: Anchor[]): Surface {
  return { direction, anchors };
}

function room(
  id: string, name: string, kind: Room["kind"],
  lighting: Room["lighting"],
  ...args: (Surface | Door)[]
): Room {
  const surfaces = args.filter((a): a is Surface => "direction" in a);
  const doors = args.filter((a): a is Door => "fromRoom" in a);
  return { id, name, kind, surfaces, doors, lighting };
}

// ─── Entrance Wing ────────────────────────────────────────
const entranceHall = room("entrance-hall", "Outside", "outside", "outside",
  surface(n), surface(s), surface(e), surface(w),
  door("door-entrance-hall-to-entrance", "Entrance", "entrance-hall", n, "entrance", s),
);

const entrance = room("entrance", "Entrance", "hall", "entrance",
  surface(n), surface(s),
  surface(e, anchor("entrance-centerpiece", "Center inscription", e, "center", ["signage"])),
  surface(w),
  door("door-entrance-from-hall", "Outside", "entrance", s, "entrance-hall", n),
  door("door-entrance-to-reception", "Reception Hall", "entrance", n, "reception", s),
);

// ─── Main Wing ────────────────────────────────────────────
const reception = room("reception", "Reception Hall", "hall", "reception",
  surface(n, anchor("reception-signage-north", "Museum signage", n, "center", ["signage"])),
  surface(s),
  surface(e, anchor("reception-door-east", "East wing door", e, "center", ["signage"])),
  surface(w, anchor("reception-door-west", "West wing door", w, "center", ["signage"])),
  door("door-reception-from-entrance", "Entrance", "reception", s, "entrance", n),
  door("door-reception-to-corridor", "Main Corridor", "reception", n, "main-corridor", s),
  door("door-reception-to-collections", "Collections Wing", "reception", e, "collections", w),
  door("door-reception-to-studio", "Curator Studio", "reception", w, "curator-studio", n),
);

const mainCorridor = room("main-corridor", "Main Corridor", "corridor", "gallery",
  surface(n), surface(s),
  surface(e,
    anchor("corridor-exhibit-1", "Exhibit frame 1", e, "center", ["display"]),
    anchor("corridor-exhibit-2", "Exhibit frame 2", e, "right", ["display"]),
  ),
  surface(w,
    anchor("corridor-exhibit-3", "Exhibit frame 3", w, "center", ["display"]),
    anchor("corridor-exhibit-4", "Exhibit frame 4", w, "right", ["display"]),
  ),
  door("door-corridor-from-reception", "Reception Hall", "main-corridor", s, "reception", n),
);

const exhibitTemplate = room("exhibit-room", "Exhibit Room", "exhibit", "exhibit",
  surface(n, anchor("exhibit-title-wall", "Title wall", n, "center", ["signage"])),
  surface(s),
  surface(e,
    anchor("exhibit-media-wall", "Media display", e, "center", ["projection"]),
    anchor("exhibit-artifact-1", "Artifact shelf 1", e, "right", ["display", "pedestal"]),
  ),
  surface(w,
    anchor("exhibit-artifact-2", "Artifact shelf 2", w, "left", ["display", "pedestal"]),
    anchor("exhibit-notes", "Curator notes", w, "center", ["signage"]),
  ),
  door("door-exhibit-from-corridor", "Main Corridor", "exhibit-room", s, "main-corridor", n),
);

// ─── East Wing ────────────────────────────────────────────
const collections = room("collections", "Collections Wing", "hall", "archive",
  surface(n,
    anchor("collections-infrastructure", "Infrastructure", n, "center", ["display"]),
    anchor("collections-visual-design", "Visual Design", n, "right", ["display"]),
  ),
  surface(s),
  surface(e,
    anchor("collections-experiments", "Experiments", e, "center", ["display"]),
    anchor("collections-journey", "Internship Journey", e, "right", ["display"]),
  ),
  surface(w),
  door("door-collections-from-reception", "Reception Hall", "collections", w, "reception", e),
);

// ─── Studio Wing ──────────────────────────────────────────
const curatorStudio = room("curator-studio", "Curator Studio", "studio", "studio",
  surface(n), surface(s),
  surface(e, anchor("studio-guide", "Guide terminal", e, "center", ["terminal"])),
  surface(w),
  door("door-studio-from-reception", "Reception Hall", "curator-studio", n, "reception", w),
);

// ─── All rooms ────────────────────────────────────────────
const allRooms: Room[] = [
  entranceHall, entrance, reception, mainCorridor,
  exhibitTemplate, collections, curatorStudio,
];

// ─── Building hierarchy ───────────────────────────────────
const groundFloor: Floor = {
  level: 0,
  name: "Ground Floor",
  wings: [
    { id: "entrance-wing", name: "Entrance Wing", rooms: ["entrance-hall", "entrance"] },
    { id: "main-wing", name: "Main Wing", rooms: ["reception", "main-corridor", "exhibit-room"] },
    { id: "east-wing", name: "East Wing", rooms: ["collections"] },
  ],
};

const lowerFloor: Floor = {
  level: -1,
  name: "Lower Floor",
  wings: [
    { id: "studio-wing", name: "Studio Wing", rooms: ["curator-studio"] },
  ],
};

export const building: Building = {
  id: "foyer-museum",
  name: "Foyer Museum",
  floors: [groundFloor, lowerFloor],
};

// ─── Indexes ──────────────────────────────────────────────
export const worldIndex: WorldIndex = buildIndex(allRooms);

function buildIndex(rooms: Room[]): WorldIndex {
  const byId = new Map<RoomId, Room>();
  const byDoorId = new Map<DoorId, Door>();
  const byAnchorId = new Map<AnchorId, Anchor>();

  for (const room of rooms) {
    byId.set(room.id, room);
    for (const door of room.doors) {
      byDoorId.set(door.id, door);
    }
    for (const surface of room.surfaces) {
      for (const anchor of surface.anchors) {
        byAnchorId.set(anchor.id, anchor);
      }
    }
  }

  return { byId, byDoorId, byAnchorId };
}

// ─── Lookup helpers ───────────────────────────────────────
export function getRoom(id: RoomId): Room | undefined {
  return worldIndex.byId.get(id);
}

export function getDoor(id: DoorId): Door | undefined {
  return worldIndex.byDoorId.get(id);
}

export function getAnchor(id: AnchorId): Anchor | undefined {
  return worldIndex.byAnchorId.get(id);
}

export function getDoorsInRoom(roomId: RoomId): Door[] {
  return getRoom(roomId)?.doors ?? [];
}

export function getSurfaces(roomId: RoomId): Surface[] {
  return getRoom(roomId)?.surfaces ?? [];
}

export function getAnchors(roomId: RoomId): Anchor[] {
  const room = getRoom(roomId);
  if (!room) return [];
  return room.surfaces.flatMap((s) => s.anchors);
}

export function getAnchorsByCapability(roomId: RoomId, capability: AnchorCapability): Anchor[] {
  return getAnchors(roomId).filter((a) => a.capabilities.includes(capability));
}
