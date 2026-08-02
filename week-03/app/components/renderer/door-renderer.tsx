import type { Door, Visitor } from "@/lib/museum/types";
import { getRoute } from "@/lib/museum/navigation-adapter";
import { getEntrySurface, getRelativeDirection } from "./direction-utils";
import { SpaceDoor } from "@/components/space-door";

export function DoorRenderer({
  doors,
  visitor,
}: {
  doors: Door[];
  visitor: Visitor;
}) {
  const entrySurface = getEntrySurface(visitor);

  return (
    <section aria-label="Exits">
      <p className="text-xs uppercase tracking-[0.25em] opacity-30 mb-6">
        From here you can see
      </p>
      <div className="flex flex-col gap-6">
        {doors.map((door) => {
          const route = getRoute(door.toRoom);
          if (!route) return null;

          const direction = entrySurface
            ? getRelativeDirection(entrySurface, door.fromSurface)
            : undefined;

          return (
            <div key={door.id} className="flex-1">
              <SpaceDoor
                href={`${route}?via=${door.id}`}
                label={door.label}
                direction={direction}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
