import type { ReactNode } from "react";
import type { Room, RoomKind } from "@/lib/museum/types";
import { MuseumSpace } from "@/components/museum-space";

const transitionMap: Record<RoomKind, string> = {
  hall: "doorway-fade",
  corridor: "corridor",
  exhibit: "spotlight-reveal",
  studio: "spotlight-reveal",
  outside: "doorway-fade",
};

export function RoomShell({
  room,
  children,
}: {
  room: Room;
  children: ReactNode;
}) {
  return (
    <MuseumSpace preset={room.lighting}>
      <main
        className="flex flex-col min-h-[100dvh] px-6 py-20 pb-32"
        data-museum-transition={transitionMap[room.kind]}
      >
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-16">
          {children}
        </div>
      </main>
    </MuseumSpace>
  );
}
