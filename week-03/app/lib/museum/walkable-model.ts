import type { SurfaceLayout } from "@/lib/museum/queries";
import type { Exhibit } from "@/lib/types/exhibit";
import type { Developer } from "@/lib/types/developer";
import { getDoor } from "./world";

export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type InspectSource =
  | "frame"
  | "title"
  | "notes"
  | "artifact"
  | "projection"
  | "signage"
  | "curator"
  | "receptionist"
  | "cat";
export type InspectInfo = {
  title: string;
  body: string;
  source: InspectSource;
  href?: string;
  hrefLabel?: string;
  /** Optional portrait/preview image shown at the top of the inspect card
   * — a developer's avatar, an exhibit's screenshot, or the curator's
   * portrait. Omitted for text-only content (signage, curator's note,
   * artifact labels) where no real image exists to show. */
  image?: string;
};

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
  approach: { minX: -4, maxX: 4, minZ: 20, maxZ: 28 },
  reception: { minX: -5, maxX: 5, minZ: 13, maxZ: 20 },
  corridor: { minX: -3, maxX: 3, minZ: -13, maxZ: 13 },
  exhibit: { minX: -5, maxX: 5, minZ: -20, maxZ: -13 },
};

/** Scroll rail extents (north = smaller Z). Includes the exterior approach path. */
export const RAIL_START = 26;
export const RAIL_END = -18;
export const DEFAULT_SPAWN_Z = 24;

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
      swing: -1.57,
      rect: wallRect(-0.8, 0.8, -13 - WALL_THICKNESS, -13 + WALL_THICKNESS),
      toLabel: "Exhibit Room",
    },
    {
      id: "door-corridor-from-reception",
      label: "Reception",
      position: [0, 1.3, 13],
      hingeX: 0.8,
      hingeZ: 13,
      swing: 1.57,
      rect: wallRect(-0.8, 0.8, 13 - WALL_THICKNESS, 13 + WALL_THICKNESS),
      toLabel: "Reception Hall",
    },
  ];
}

// Frames hang on the sawtooth bay walls (angled wall across each 4-unit bay:
// outer x=3.0 at the high-Z end → inner x=1.6 at the low-Z end). The ry below
// matches SawtoothSide's bay-wall rotation so each frame's front face (text
// side) points back into the corridor toward the player.
//   east bay wall: baseRotation = -atan2(dz, dx) + PI   (dx=-1.4, dz=-4)
//   west bay wall: baseRotation = -atan2(dz, dx)       (dx=+1.4, dz=-4)
const BAY_WALL_X = 2.3;
const EAST_BAY_RY = -Math.atan2(-4, -1.4) + Math.PI;
const WEST_BAY_RY = -Math.atan2(-4, 1.4);
const CORRIDOR_FRAMES: Record<string, { position: [number, number, number]; ry: number }> = {
  "corridor-exhibit-1": { position: [BAY_WALL_X, 2.25, 4], ry: EAST_BAY_RY },
  "corridor-exhibit-2": { position: [BAY_WALL_X, 2.25, 8], ry: EAST_BAY_RY },
  "corridor-exhibit-3": { position: [-BAY_WALL_X, 2.25, -4], ry: WEST_BAY_RY },
  "corridor-exhibit-4": { position: [-BAY_WALL_X, 2.25, -8], ry: WEST_BAY_RY },
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
    // Nudged 0.4 off exhibit-notes' Z (both were at the exact same
    // coordinate). The interaction system picks the nearest item by Z
    // distance only — an exact tie meant one of the two could never be
    // triggered, no matter where the player stopped. This makes both
    // individually reachable.
    position: (o) => [4.7, 2.4, o.z + 3.1],
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
    body: [exhibit.tagline, exhibit.year]
      .filter(Boolean)
      .join(" · "),
    source: "frame",
    href: `/exhibit/e/${exhibit.id}`,
    hrefLabel: "Open exhibit",
    image: exhibit.media[0]?.src || undefined,
  };
}

// Corridor frames represent DEVELOPERS first (see MuseumWallFrame) — the
// inspect panel opened from a corridor frame should match that: who they
// are and how many works they have, not which single project happens to
// anchor their bay. Room-level frameInspect (above) is unchanged and still
// used for exhibit-room content, which is genuinely exhibit-first.
export function developerFrameInspect(
  developer: Developer,
  exhibit: Exhibit,
  workCount: number
): InspectInfo {
  return {
    title: developer.name,
    body: [developer.role, `${workCount} ${workCount === 1 ? "work" : "works"} on display`]
      .filter(Boolean)
      .join(" · "),
    source: "frame",
    href: `/exhibit/e/${exhibit.id}`,
    hrefLabel: "Enter exhibition",
    image: developer.avatar || undefined,
  };
}

export function buildInteractives(
  corridorLayout: SurfaceLayout[],
  roomLayout: SurfaceLayout[],
  exhibits: Exhibit[],
  developers: Developer[],
  roomOrigin: { x: number; z: number },
  currentExhibit?: Exhibit
): InteractiveItem[] {
  const byId = new Map(exhibits.map((e) => [e.id, e]));
  const developerById = new Map(developers.map((d) => [d.id, d]));
  const workCountByDeveloper = new Map<string, number>();
  for (const e of exhibits) {
    workCountByDeveloper.set(e.developerId, (workCountByDeveloper.get(e.developerId) ?? 0) + 1);
  }
  const items: InteractiveItem[] = [];

  for (const surface of corridorLayout) {
    for (const { anchor, placement } of surface.anchors) {
      const pos = CORRIDOR_FRAMES[anchor.id];
      if (!pos || !placement) continue;
      const exhibit = byId.get(placement.entityId);
      if (!exhibit) continue;
      const developer = developerById.get(exhibit.developerId);
      if (!developer) continue;
      const workCount = workCountByDeveloper.get(developer.id) ?? 1;
      items.push({
        id: anchor.id,
        position: pos.position,
        range: 2.4,
        prompt: "Meet the exhibitor",
        inspect: developerFrameInspect(developer, exhibit, workCount),
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
      title: "Foyer Museum",
      body: "Welcome to Foyer — an open museum for digital work. Walk the corridor to explore exhibits, or step into the exhibit room for a deeper look.",
      source: "signage",
    },
  });

  items.push({
    id: "curator-presence",
    position: [1.0, 1.62, 11.5],
    range: 2.8,
    prompt: "Talk to curator",
    inspect: {
      // No href here on purpose: the curator opens the real chat panel
      // in-scene (see exhibit-room-3d.tsx's source === "curator" branch)
      // instead of navigating away to /assistant.
      title: "The Curator",
      body: "I guide visitors through the museum. Each exhibit tells the story behind what was built — the architecture, the decisions, and the craft.",
      source: "curator",
      image: "/images/curator.png",
    },
  });

  // Receptionist — stands just behind the desk (matches ReceptionFemale's
  // render position in walkable-world.tsx). Basic wayfinding only; deeper
  // exhibit questions get routed to the curator by her own system prompt.
  items.push({
    id: "receptionist-presence",
    position: [-1.2, 1.55, 17.85],
    // Wider range than the curator's (2.8) — the receptionist sits further
    // off-center (x=3.3 vs the curator's x=1.8), and the camera's x only
    // ever moves via small mouse-look parallax, not real strafing, so a
    // tight range here could leave her unreachable from the walking rail.
    range: 3.4,
    prompt: "Talk to receptionist",
    inspect: {
      title: "The Receptionist",
      body: "Welcome to Foyer! Need directions, or just want to know what's here?",
      source: "receptionist",
    },
  });

  return items;
}

/** Map a validated door id (or default) to a first-person spawn on the museum rail. */
export function resolveSpawnFromVia(via: string | null): [number, number, number] {
  const door = via ? getDoor(via) : undefined;
  if (door?.id === "door-exhibit-from-corridor") return [0, 1.7, -9.5];
  if (door?.id === "door-corridor-from-reception") return [0, 1.7, 9];
  if (door?.id === "door-reception-from-entrance") return [0, 1.7, 16];
  if (door?.id === "door-entrance-from-hall") return [0, 1.7, 22];
  return [0, 1.7, DEFAULT_SPAWN_Z];
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
