import Link from "next/link";
import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";
import { getExhibitRoute } from "@/lib/museum/navigation-adapter";

export function ExhibitCard({ entityId, anchor }: EntityComponentProps) {
  const exhibit = mockExhibits.find((e) => e.id === entityId);
  if (!exhibit) return null;

  const positionStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Link
      href={getExhibitRoute(entityId)}
      className={`group block h-full border border-[var(--color-text)]/10 p-6 hover:border-[var(--color-text)]/30 transition-all duration-500 ${positionStyles[anchor.position]}`}
    >
      <p className="text-xs uppercase tracking-[0.2em] opacity-30 mb-2">
        {exhibit.collection}
      </p>
      <h3 className="font-heading text-lg tracking-tight group-hover:opacity-80 transition-opacity duration-300">
        {exhibit.title}
      </h3>
      <p className="mt-2 text-sm opacity-50 line-clamp-2">
        {exhibit.tagline}
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs opacity-30">
        <span>{exhibit.developer}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{exhibit.year}</span>
      </div>
    </Link>
  );
}
