import { describe, expect, it } from "vitest";
import {
  buildInteractives,
  buildSolids,
  DEFAULT_SPAWN_Z,
  nearestItem,
  resolveCollision,
  resolveSpawnFromVia,
  RAIL_END,
  RAIL_START,
} from "./walkable-model";
import { createPlacementMap, populateExhibitRoom } from "./placement";
import { getSurfaceLayout } from "./queries";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

describe("walkable-model", () => {
  it("buildSolids leaves door gaps in corridor north/south walls", () => {
    const solids = buildSolids();
    const blocksCenterNorth = solids.some(
      (r) => r.minZ <= -13.1 && r.maxZ >= -12.9 && r.minX <= 0 && r.maxX >= 0
    );
    expect(blocksCenterNorth).toBe(false);
  });

  it("resolveCollision pushes point outside a wall rect", () => {
    const rect = { minX: -1, maxX: 1, minZ: -1, maxZ: 1 };
    const out = resolveCollision(1.2, 0, 0.5, [rect]);
    expect(out.x).toBeGreaterThan(1);
  });

  it("nearestItem requires facing dot above threshold", () => {
    const items = [
      {
        id: "a",
        position: [0, 0, 5] as [number, number, number],
        range: 5,
        prompt: "p",
        inspect: { title: "t", body: "b", source: "frame" as const },
      },
    ];
    expect(nearestItem(0, 0, 0, -1, items)).toBeNull();
    expect(nearestItem(0, 0, 0, 1, items)?.id).toBe("a");
  });

  it("buildInteractives uses currentExhibit for signage entity ids", () => {
    const exhibit = mockExhibits[0];
    const layout = getSurfaceLayout(
      "exhibit-room",
      populateExhibitRoom(createPlacementMap(), exhibit.id, "exhibit-room")
    );
    const items = buildInteractives([], layout, mockExhibits, { x: 0, z: -16.5 }, exhibit);
    const title = items.find((i) => i.id === "exhibit-title-wall");
    expect(title?.inspect.title).toBe(exhibit.title);
  });

  it("includes curator interactive that opens the in-scene chat (no href)", () => {
    const items = buildInteractives([], [], mockExhibits, { x: 0, z: -16.5 });
    const curator = items.find((i) => i.id === "curator-presence");
    expect(curator?.prompt).toBe("Talk to curator");
    expect(curator?.inspect.source).toBe("curator");
    // Curator no longer navigates to /assistant — the room hosts the real
    // ChatPanel in-scene (see exhibit-room-3d.tsx), so there's no href.
    expect(curator?.inspect.href).toBeUndefined();
  });

  it("resolveSpawnFromVia maps doors and defaults to approach path", () => {
    expect(resolveSpawnFromVia(null)[2]).toBe(DEFAULT_SPAWN_Z);
    expect(resolveSpawnFromVia("door-exhibit-from-corridor")[2]).toBe(-9.5);
    expect(RAIL_END).toBeLessThan(DEFAULT_SPAWN_Z);
    expect(RAIL_START).toBeGreaterThan(DEFAULT_SPAWN_Z);
  });
});
