import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

export function TimelineView({ entityId, anchor }: EntityComponentProps) {
  const exhibit = mockExhibits.find((e) => e.id === entityId);
  if (!exhibit) return null;

  const artifacts = exhibit.artifacts;

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.2em] opacity-30 mb-2">
        {anchor.label}
      </p>
      <div className="space-y-3">
        {artifacts.map((artifact, i) => (
          <div key={artifact.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-[var(--color-text)]/20" />
              {i < artifacts.length - 1 && (
                <div className="w-px flex-1 bg-[var(--color-text)]/10" />
              )}
            </div>
            <div className="pb-3">
              <p className="text-sm font-medium">{artifact.label}</p>
              <p className="text-xs opacity-50">{artifact.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
