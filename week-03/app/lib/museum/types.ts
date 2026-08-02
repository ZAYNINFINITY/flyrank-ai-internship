export type RoomId = string;
export type WingId = string;
export type DoorId = string;
export type AnchorId = string;

export type SurfaceDirection = "north" | "south" | "east" | "west";
export type LightingPreset = "entrance" | "reception" | "gallery" | "exhibit" | "studio" | "archive" | "outside";
export type RoomKind = "hall" | "corridor" | "exhibit" | "studio" | "outside";
export type EntityType = "exhibit" | "artifact" | "projection" | "timeline" | "terminal" | "statue" | "signage";
export type AnchorCapability = "display" | "projection" | "terminal" | "signage" | "pedestal";

export interface Door {
  id: DoorId;
  label: string;
  fromRoom: RoomId;
  fromSurface: SurfaceDirection;
  toRoom: RoomId;
  toSurface: SurfaceDirection;
}

export interface Anchor {
  id: AnchorId;
  label: string;
  surfaceDirection: SurfaceDirection;
  position: "left" | "center" | "right";
  capabilities: AnchorCapability[];
}

export interface Surface {
  direction: SurfaceDirection;
  anchors: Anchor[];
}

export interface Room {
  id: RoomId;
  name: string;
  kind: RoomKind;
  surfaces: Surface[];
  doors: Door[];
  lighting: LightingPreset;
}

export interface Wing {
  id: WingId;
  name: string;
  rooms: RoomId[];
}

export interface Floor {
  level: number;
  name: string;
  wings: Wing[];
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Placement {
  anchorId: AnchorId;
  entityType: EntityType;
  entityId: string;
}

export interface Visitor {
  currentRoomId: RoomId;
  cameFromDoorId: DoorId | null;
  enteredAt: number;
}

export interface WorldIndex {
  byId: Map<RoomId, Room>;
  byDoorId: Map<DoorId, Door>;
  byAnchorId: Map<AnchorId, Anchor>;
}
