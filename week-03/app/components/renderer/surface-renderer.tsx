import type { Anchor } from "@/lib/museum/types";
import type { SurfaceLayout } from "@/lib/museum/queries";
import { EntityView, type EntityRegistry } from "./entity-view";

export function SurfaceRenderer({
  layout,
  entityComponents,
}: {
  layout: SurfaceLayout[];
  entityComponents: EntityRegistry;
}) {
  const hasContent = layout.some((surface) =>
    surface.anchors.some((a) => a.placement !== undefined)
  );

  if (!hasContent) return null;

  return (
    <section aria-label="Walls">
      {layout.map((surface) => {
        const filledAnchors = surface.anchors.filter((a) => a.placement !== undefined);
        if (filledAnchors.length === 0) return null;

        return (
          <div key={surface.direction} className="border-t border-[var(--color-text)]/8 pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {surface.anchors.map(({ anchor, placement }) => {
                if (!placement) {
                  return <EmptyAnchor key={anchor.id} anchor={anchor} />;
                }

                return (
                  <div
                    key={anchor.id}
                    className={`anchor-${anchor.position} border border-[var(--color-text)]/10 p-4`}
                  >
                    <EntityView
                      entityId={placement.entityId}
                      entityType={placement.entityType}
                      anchor={anchor}
                      registry={entityComponents}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function EmptyAnchor({ anchor }: { anchor: Anchor }) {
  return (
    <div className="border border-dashed border-[var(--color-text)]/5 p-4 min-h-[80px] flex items-center justify-center">
      <p className="text-xs opacity-20 italic">{anchor.label}</p>
    </div>
  );
}
