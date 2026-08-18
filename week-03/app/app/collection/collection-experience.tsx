import Link from "next/link";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

export const collectionMeta: Record<string, { label: string; description: string; color: string }> = {
  frontend: {
    label: "Frontend Engineering",
    description: "Components, design systems, and interactive experiences",
    color: "border-l-[var(--color-text)]/30",
  },
  fullstack: {
    label: "Full-Stack Systems",
    description: "End-to-end applications and production infrastructure",
    color: "border-l-[var(--color-text)]/20",
  },
  "data-viz": {
    label: "Data Visualization",
    description: "Interactive data stories and visual exploration",
    color: "border-l-[var(--color-text)]/25",
  },
  experiments: {
    label: "Experiments & Prototypes",
    description: "Bold explorations and creative coding",
    color: "border-l-[var(--color-text)]/15",
  },
};

export function CollectionExperience() {
  const all = mockExhibits;

  return (
    <div className="mb-12">
      <h2 className="font-heading text-2xl tracking-tight mb-2">
        Collections
      </h2>
      <p className="text-sm opacity-50 mb-8 max-w-md">
        Exhibits grouped by theme. Each collection tells a different part of
        the story.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(collectionMeta).map(([key, meta]) => {
          const count = all.filter((e) => e.collectionIds.includes(key)).length;
          return (
            <Link
              key={key}
              href={`/gallery?collection=${key}`}
              className={`border border-[var(--color-text)]/10 p-6 hover:border-[var(--color-text)]/30 transition-all duration-500 ${meta.color}`}
            >
              <p className="font-heading text-base">{meta.label}</p>
              <p className="mt-1 text-xs opacity-50">{meta.description}</p>
              <p className="mt-3 text-xs opacity-30">
                {count} exhibit{count !== 1 ? "s" : ""}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
