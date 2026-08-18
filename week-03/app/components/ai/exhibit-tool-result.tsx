import Link from "next/link";
import type { Exhibit } from "@/lib/types/exhibit";
import { getExhibitRoute } from "@/lib/museum/navigation-adapter";

export function isExhibitArray(value: unknown): value is Exhibit[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as Exhibit).id === "string" &&
        typeof (item as Exhibit).title === "string"
    )
  );
}

export function ExhibitToolResult({ exhibits }: { exhibits: Exhibit[] }) {
  if (exhibits.length === 0) {
    return (
      <div className="border border-[var(--color-text)]/10 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-1">
          Museum search
        </p>
        <p className="text-sm opacity-60">No exhibits matched that query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {exhibits.map((exhibit) => (
        <Link
          key={exhibit.id}
          href={getExhibitRoute(exhibit.id)}
          className="group block border border-[var(--color-text)]/10 p-5 transition-all duration-500 hover:border-[var(--color-text)]/30"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-2">
            {exhibit.collectionIds[0] ?? "uncategorized"}
          </p>
          <h3 className="font-heading text-base tracking-tight transition-opacity duration-300 group-hover:opacity-80">
            {exhibit.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed opacity-50 line-clamp-2">
            {exhibit.tagline}
          </p>
          <p className="mt-3 text-[11px] opacity-30">
            {exhibit.developerId}
            <span aria-hidden="true"> · </span>
            {exhibit.year}
          </p>
        </Link>
      ))}
    </div>
  );
}
