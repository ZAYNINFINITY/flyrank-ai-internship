import type { ReactNode } from "react";
import type { Visitor, Placement, Door, SurfaceDirection } from "@/lib/museum/types";
import type { Direction } from "@/lib/navigation/museum-layout";
import { getCurrentRoom, getVisibleDoors, getSurfaceLayout, type SurfaceLayout } from "@/lib/museum/queries";
import { RoomShell } from "./room-shell";
import { DoorRenderer } from "./door-renderer";
import { SurfaceRenderer } from "./surface-renderer";
import { SpatialBreadcrumb } from "@/components/spatial-breadcrumb";
import { getRoute } from "@/lib/museum/navigation-adapter";
import { getEntrySurface, getRelativeDirection } from "./direction-utils";
import type { EntityRegistry } from "./entity-view";

export type { EntityComponentProps, EntityRegistry } from "./entity-view";

export type WallsOverrideProps = {
  layout: SurfaceLayout[];
  entityComponents: EntityRegistry;
  doors: Door[];
  entrySurface: SurfaceDirection | null;
};

export function WorldRenderer({
  visitor,
  placements,
  entityComponents = {},
  wallsOverride,
  children,
}: {
  visitor: Visitor;
  placements: Map<string, Placement>;
  entityComponents?: EntityRegistry;
  wallsOverride?: (props: WallsOverrideProps) => ReactNode;
  children?: ReactNode;
}) {
  const room = getCurrentRoom(visitor);
  if (!room) return null;

  const doors = getVisibleDoors(visitor);
  const entrySurface = getEntrySurface(visitor);
  const layout = getSurfaceLayout(room.id, placements);

  const exits = doors
    .map((door) => {
      const route = getRoute(door.toRoom);
      if (!route || !entrySurface) return null;
      const direction = getRelativeDirection(entrySurface, door.fromSurface);
      return { direction, roomId: door.toRoom, label: door.label, href: `${route}?via=${door.id}` };
    })
    .filter(Boolean) as { direction: Direction; roomId: string; label: string; href: string }[];

  return (
    <RoomShell room={room}>
      {children}

      <DoorRenderer doors={doors} visitor={visitor} />

      {wallsOverride
        ? wallsOverride({ layout, entityComponents, doors, entrySurface })
        : <SurfaceRenderer layout={layout} entityComponents={entityComponents} />}

      <SpatialBreadcrumb currentRoom={room.name} exits={exits} />
    </RoomShell>
  );
}
