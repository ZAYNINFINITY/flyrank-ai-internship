import { describe, expect, it } from "vitest";
import { parseViaParam, resolveEntryDoor, viaForRoom } from "./via-entry";

describe("via-entry", () => {
  it("parseViaParam returns null for missing or invalid via", () => {
    expect(parseViaParam(null)).toBeNull();
    expect(parseViaParam("not-a-door")).toBeNull();
  });

  it("parseViaParam accepts real door ids", () => {
    expect(parseViaParam("door-exhibit-from-corridor")).toBe("door-exhibit-from-corridor");
  });

  it("resolveEntryDoor falls back to default for invalid via", () => {
    expect(resolveEntryDoor("bogus", "exhibit-room")).toBe("door-exhibit-from-corridor");
    expect(resolveEntryDoor(null, "reception")).toBe("door-reception-from-entrance");
  });

  it("resolveEntryDoor honors via when door targets the room", () => {
    expect(resolveEntryDoor("door-corridor-from-reception", "main-corridor")).toBe(
      "door-corridor-from-reception"
    );
  });

  it("viaForRoom returns null when via does not target room", () => {
    expect(viaForRoom("door-corridor-from-reception", "exhibit-room")).toBeNull();
    expect(viaForRoom("door-exhibit-from-corridor", "exhibit-room")).toBe(
      "door-exhibit-from-corridor"
    );
  });
});
