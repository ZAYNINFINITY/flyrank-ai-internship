import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

export function SignageView({ entityId, anchor }: EntityComponentProps) {
  const baseId = entityId.replace(/-(title|notes)$/, "");
  const exhibit = mockExhibits.find((e) => e.id === baseId);

  const isTitle = entityId.endsWith("-title");
  const isNotes = entityId.endsWith("-notes");

  if (isTitle && exhibit) {
    return (
      <div>
        <p className="text-xs uppercase tracking-[0.3em] opacity-30 mb-1">
          {anchor.label}
        </p>
        <h2 className="font-heading text-2xl md:text-3xl tracking-tight">
          {exhibit.title}
        </h2>
        <p className="mt-2 text-sm opacity-50">{exhibit.tagline}</p>
      </div>
    );
  }

  if (isNotes && exhibit) {
    return (
      <div className="border-l-2 border-[var(--color-text)]/10 pl-4">
        <p className="text-xs uppercase tracking-[0.2em] opacity-30 mb-2">
          {anchor.label}
        </p>
        <p className="text-sm italic opacity-60 leading-relaxed">
          &ldquo;{exhibit.curatorNotes}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] opacity-30 mb-1">
        {anchor.label}
      </p>
      {exhibit && (
        <p className="text-sm opacity-60">{exhibit.tagline}</p>
      )}
    </div>
  );
}
