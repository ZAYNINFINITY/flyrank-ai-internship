import Link from "next/link";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

const collectionMeta: Record<string, { label: string; description: string; color: string }> = {
  infrastructure: {
    label: "Infrastructure",
    description: "Systems, backends, and resilient architectures",
    color: "border-l-[var(--color-text)]/30",
  },
  "visual-design": {
    label: "Visual Design",
    description: "Interfaces, stores, and user-facing products",
    color: "border-l-[var(--color-text)]/20",
  },
  experiments: {
    label: "Experiments",
    description: "Prototypes, games, and weekend builds",
    color: "border-l-[var(--color-text)]/15",
  },
  journey: {
    label: "Journey",
    description: "Learning artifacts and growth milestones",
    color: "border-l-[var(--color-text)]/25",
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
          const count = all.filter((e) => e.collection === key).length;
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
