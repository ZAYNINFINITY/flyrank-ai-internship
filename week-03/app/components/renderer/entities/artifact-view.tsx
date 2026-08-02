import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

export function ArtifactView({ entityId }: EntityComponentProps) {
  const exhibit = mockExhibits.find((e) => e.id === entityId);
  if (!exhibit) return null;

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed opacity-70">
        {exhibit.description}
      </p>

      {exhibit.artifacts.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] opacity-30">
            Artifacts
          </p>
          <div className="grid gap-2">
            {exhibit.artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="border border-[var(--color-text)]/10 p-4"
              >
                <p className="font-heading text-sm">{artifact.label}</p>
                <p className="mt-1 text-xs opacity-50">{artifact.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs opacity-30 pt-2 border-t border-[var(--color-text)]/8">
        <span>{exhibit.developer}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{exhibit.year}</span>
      </div>
    </div>
  );
}
