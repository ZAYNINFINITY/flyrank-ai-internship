import type { EntityComponentProps } from "@/components/renderer/entity-view";
import { mockExhibits } from "@/lib/repository/mock-exhibit-repository";

export function ProjectionView({ entityId }: EntityComponentProps) {
  const exhibit = mockExhibits.find((e) => e.id === entityId);
  if (!exhibit) return null;

  const media = exhibit.media[0];
  if (!media) return null;

  if (media.type === "image" && media.src) {
    return (
      <div className="aspect-video bg-[var(--color-text)]/5 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt}
          className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-[var(--color-text)]/5 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] opacity-30 mb-1">
          Media
        </p>
        <p className="text-sm opacity-50">{exhibit.title}</p>
      </div>
    </div>
  );
}
