import { describe, expect, it } from "vitest";
import { createVisitor, enterRoom } from "./visitor";
import { getVisibleDoors, getSurfaceLayout } from "./queries";
import { createPlacementMap, populateCorridor } from "./placement";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

describe("museum queries and placement", () => {
  it("getVisibleDoors returns doors for current room", () => {
    const visitor = enterRoom(createVisitor("main-corridor"), "main-corridor", "door-corridor-from-reception");
    const doors = getVisibleDoors(visitor);
    expect(doors.some((d) => d.id === "door-corridor-from-reception")).toBe(true);
  });

  it("populateCorridor places exhibits on display anchors", async () => {
    const map = await populateCorridor(
      createPlacementMap(),
      "main-corridor",
      { getAll: async () => [] } as never,
      mockExhibits.slice(0, 2)
    );
    const layout = getSurfaceLayout("main-corridor", map);
    const placed = layout.flatMap((s) => s.anchors.filter((a) => a.placement));
    expect(placed.length).toBeGreaterThan(0);
  });
});
