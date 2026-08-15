import type { SurfaceLayout } from "@/lib/museum/queries";
import type { Exhibit } from "@/lib/types/exhibit";

export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type InspectSource = "frame" | "title" | "notes" | "artifact" | "projection" | "signage";
export type InspectInfo = { title: string; body: string; source: InspectSource };

export type WorldDoor = {
  id: string;
  label: string;
  position: [number, number, number];
  hingeX: number;
  hingeZ: number;
  swing: number;
  rect: Rect;
  toLabel: string;
};

export type InteractiveItem = {
  id: string;
  position: [number, number, number];
  range: number;
  prompt: string;
  inspect: InspectInfo;
};

export type WalkableWorld = {
  solids: Rect[];
  doors: WorldDoor[];
  interactives: InteractiveItem[];
};

// ─── Room footprints (north = -Z) ──────────────────────────────
export const FOOTPRINTS = {
  reception: { minX: -5, maxX: 5, minZ: 13, maxZ: 20 },
  corridor: { minX: -3, maxX: 3, minZ: -13, maxZ: 13 },
  exhibit: { minX: -5, maxX: 5, minZ: -20, maxZ: -13 },
};

const DOOR_GAP: Rect = { minX: -0.8, maxX: 0.8, minZ: 0, maxZ: 0 };
const WALL_THICKNESS = 0.1;

function wallRect(
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number
): Rect {
  return { minX, maxX, minZ, maxZ };
}

// Every wall segment minus the door gaps. Doors provide their own rects so a
// closed door blocks the gap and an open one releases it.
export function buildSolids(): Rect[] {
  const { reception, corridor, exhibit } = FOOTPRINTS;
  const solids: Rect[] = [];

  const alongX = (room: Rect, x: number) =>
    wallRect(x - WALL_THICKNESS / 2, x + WALL_THICKNESS / 2, room.minZ, room.maxZ);

  for (const room of [reception, corridor, exhibit]) {
    solids.push(alongX(room, room.minX), alongX(room, room.maxX));
  }

  const northWall = (room: Rect, gap: Rect) => {
    solids.push(
      wallRect(room.minX, gap.minX, room.minZ - WALL_THICKNESS / 2, room.minZ + WALL_THICKNESS / 2),
      wallRect(gap.maxX, room.maxX, room.minZ - WALL_THICKNESS / 2, room.minZ + WALL_THICKNESS / 2)
    );
  };
  const southWall = (room: Rect, gap: Rect) => {
    solids.push(
      wallRect(room.minX, gap.minX, room.maxZ - WALL_THICKNESS / 2, room.maxZ + WALL_THICKNESS / 2),
      wallRect(gap.maxX, room.maxX, room.maxZ - WALL_THICKNESS / 2, room.maxZ + WALL_THICKNESS / 2)
    );
  };

  northWall(reception, DOOR_GAP); // corridor → reception
  southWall(reception, DOOR_GAP);
  northWall(corridor, DOOR_GAP); // corridor → exhibit
  southWall(corridor, DOOR_GAP);
  northWall(exhibit, { ...DOOR_GAP, minX: 0, maxX: 0 }); // solid north wall
  southWall(exhibit, DOOR_GAP); // corridor → exhibit

  return solids;
}

export function buildDoors(): WorldDoor[] {
  return [
    {
      id: "door-exhibit-from-corridor",
      label: "Exhibit Room",
      position: [0, 1.3, -13],
      hingeX: -0.8,
      hingeZ: -13,
      swing: -1.9,
      rect: wallRect(-0.8, 0.8, -13 - WALL_THICKNESS, -13 + WALL_THICKNESS),
      toLabel: "Exhibit Room",
    },
    {
      id: "door-corridor-from-reception",
      label: "Reception",
      position: [0, 1.3, 13],
      hingeX: 0.8,
      hingeZ: 13,
      swing: 1.9,
      rect: wallRect(-0.8, 0.8, 13 - WALL_THICKNESS, 13 + WALL_THICKNESS),
      toLabel: "Reception Hall",
    },
  ];
}

const CORRIDOR_FRAMES: Record<string, { position: [number, number, number]; ry: number }> = {
  "corridor-exhibit-1": { position: [2.85, 2.25, 4], ry: Math.PI / 2 },
  "corridor-exhibit-2": { position: [2.85, 2.25, 8], ry: Math.PI / 2 },
  "corridor-exhibit-3": { position: [-2.85, 2.25, -4], ry: -Math.PI / 2 },
  "corridor-exhibit-4": { position: [-2.85, 2.25, -8], ry: -Math.PI / 2 },
};

export const ROOM_SPOTS: Record<
  string,
  { position: (origin: { x: number; z: number }) => [number, number, number]; source: InspectSource; label: string }
> = {
  "exhibit-title-wall": {
    position: (o) => [0, 2.25, o.z - 0.3],
    source: "title",
    label: "Title wall",
  },
  "exhibit-notes": {
    position: (o) => [-4.7, 2.25, o.z + 3.5],
    source: "notes",
    label: "Curator's note",
  },
  "exhibit-media-wall": {
    position: (o) => [4.7, 2.4, o.z + 3.5],
    source: "projection",
    label: "Media projection",
  },
  "exhibit-artifact-1": {
    position: (o) => [4.5, 0.75, o.z + 6.3],
    source: "artifact",
    label: "Artifact on display",
  },
  "exhibit-artifact-2": {
    position: (o) => [-4.5, 0.75, o.z + 6.3],
    source: "artifact",
    label: "Artifact on display",
  },
};

export function corridorFrameSpot(anchorId: string) {
  return CORRIDOR_FRAMES[anchorId];
}

export function frameInspect(exhibit: Exhibit): InspectInfo {
  return {
    title: exhibit.title,
    body: [exhibit.tagline, exhibit.developer, exhibit.year, exhibit.collection]
      .filter(Boolean)
      .join(" · "),
    source: "frame",
  };
}

export function buildInteractives(
  corridorLayout: SurfaceLayout[],
  roomLayout: SurfaceLayout[],
  exhibits: Exhibit[],
  roomOrigin: { x: number; z: number },
  currentExhibit?: Exhibit
): InteractiveItem[] {
  const byId = new Map(exhibits.map((e) => [e.id, e]));
  const items: InteractiveItem[] = [];

  for (const surface of corridorLayout) {
    for (const { anchor, placement } of surface.anchors) {
      const pos = CORRIDOR_FRAMES[anchor.id];
      if (!pos || !placement) continue;
      const exhibit = byId.get(placement.entityId);
      if (!exhibit) continue;
      items.push({
        id: anchor.id,
        position: pos.position,
        range: 2.4,
        prompt: "Inspect exhibit",
        inspect: frameInspect(exhibit),
      });
    }
  }

  const ROOM_SPOT_ENTRIES: Array<[string, (typeof ROOM_SPOTS)[string]]> = Object.entries(ROOM_SPOTS);

  for (const surface of roomLayout) {
    for (const { anchor, placement } of surface.anchors) {
      const spot = ROOM_SPOT_ENTRIES.find(([id]) => id === anchor.id)?.[1];
      if (!spot || !placement) continue;
      const exhibit = currentExhibit ?? byId.get(placement.entityId);
      const title = exhibit?.title ?? anchor.label;
      const body = exhibit
        ? exhibit.description ?? exhibit.tagline
        : anchor.label;
      items.push({
        id: anchor.id,
        position: spot.position(roomOrigin),
        range: 2.6,
        prompt: spot.source === "artifact" ? "Inspect artifact" : "Read",
        inspect: { title, body, source: spot.source },
      });
    }
  }

  items.push({
    id: "reception-signage-north",
    position: [0, 2.25, 13.3],
    range: 2.4,
    prompt: "Read signage",
    inspect: {
      title: "Museum signage",
      body: "Plinth Museum — Collections Wing and Curator Studio are still being hung. They open later this week.",
      source: "signage",
    },
  });

  return items;
}

export function resolveCollision(
  x: number,
  z: number,
  radius: number,
  solids: Rect[]
): { x: number; z: number } {
  for (let pass = 0; pass < 2; pass++) {
    for (const rect of solids) {
      const cx = Math.max(rect.minX, Math.min(x, rect.maxX));
      const cz = Math.max(rect.minZ, Math.min(z, rect.maxZ));
      const dx = x - cx;
      const dz = z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < radius * radius) {
        const len = Math.sqrt(d2) || 0.0001;
        x = cx + (dx / len) * radius;
        z = cz + (dz / len) * radius;
      }
    }
  }
  return { x, z };
}

export function nearestItem(
  x: number,
  z: number,
  forwardX: number,
  forwardZ: number,
  items: InteractiveItem[]
): InteractiveItem | null {
  let best: InteractiveItem | null = null;
  let bestDist = Infinity;
  for (const item of items) {
    const dx = item.position[0] - x;
    const dz = item.position[2] - z;
    const dist = Math.hypot(dx, dz);
    if (dist > item.range) continue;
    const facing = (dx * forwardX + dz * forwardZ) / (dist || 1);
    if (facing < 0.3) continue;
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return best;
}

export function nearestDoor(
  x: number,
  z: number,
  doors: WorldDoor[]
): WorldDoor | null {
  let best: WorldDoor | null = null;
  let bestDist = 3.2;
  for (const door of doors) {
    const dx = door.position[0] - x;
    const dz = door.position[2] - z;
    const dist = Math.hypot(dx, dz);
    if (dist < bestDist) {
      bestDist = dist;
      best = door;
    }
  }
  return best;
}
