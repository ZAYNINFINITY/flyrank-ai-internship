"use client";

import Link from "next/link";
import type { Direction } from "@/lib/navigation/museum-layout";
import { getDirectionSymbol } from "@/lib/navigation/museum-layout";
import { usePathname } from "next/navigation";

type Exit = {
  direction: Direction;
  roomId: string;
  label: string;
  href: string;
};

export function SpatialBreadcrumb({
  currentRoom,
  exits,
}: {
  currentRoom: string;
  exits: Exit[];
}) {
  const pathname = usePathname();

  if (!currentRoom) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-text)]/8 bg-[var(--color-background)]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <p className="opacity-40 tracking-wide shrink-0">
          <span className="opacity-30">You are here:</span>{" "}
          <span className="font-medium">{currentRoom}</span>
        </p>

        {exits.length > 0 && (
          <nav aria-label="Spatial navigation" className="flex flex-wrap items-center gap-3 sm:gap-4 max-w-full">
            {exits.map((exit) => (
              <Link
                key={exit.href}
                href={exit.href}
                className={`inline-flex items-center gap-1.5 min-h-[44px] opacity-50 hover:opacity-100 transition-opacity duration-300 ${
                  pathname === exit.href ? "opacity-100" : ""
                }`}
              >
                {exit.direction && (
                  <span aria-hidden="true" className="text-xs">
                    {getDirectionSymbol(exit.direction)}
                  </span>
                )}
                <span>{exit.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
