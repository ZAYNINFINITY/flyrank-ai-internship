import Link from "next/link";
import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";
import { getExhibitRoute } from "@/lib/museum/navigation-adapter";

export function StatueView({ entityId, anchor }: EntityComponentProps) {
  const exhibit = mockExhibits.find((e) => e.id === entityId);
  if (!exhibit) return null;

  return (
    <Link
      href={getExhibitRoute(entityId)}
      className="group block text-center py-12"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-[var(--color-text)]/10 flex items-center justify-center group-hover:border-[var(--color-text)]/30 transition-all duration-500">
        <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500">
          &#9733;
        </span>
      </div>
      <p className="text-xs uppercase tracking-[0.25em] opacity-30 mb-1">
        {anchor.label}
      </p>
      <p className="font-heading text-lg">{exhibit.title}</p>
      <p className="text-sm opacity-50 mt-1">{exhibit.tagline}</p>
    </Link>
  );
}
