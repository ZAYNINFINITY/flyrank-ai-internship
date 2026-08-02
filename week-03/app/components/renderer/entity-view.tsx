import type { ReactNode } from "react";
import type { EntityType, Anchor } from "@/lib/museum/types";

export type EntityComponentProps = {
  entityId: string;
  entityType: EntityType;
  anchor: Anchor;
};

export type EntityRegistry = Partial<
  Record<EntityType, (props: EntityComponentProps) => ReactNode>
>;

export function EntityView({
  entityType,
  entityId,
  anchor,
  registry,
}: EntityComponentProps & { registry: EntityRegistry }) {
  const Component = registry[entityType];

  if (!Component) {
    return (
      <div className="border border-dashed border-[var(--color-text)]/10 p-4 text-center">
        <p className="text-xs opacity-30">[{entityType}]</p>
        <p className="text-sm opacity-50">{anchor.label}</p>
      </div>
    );
  }

  return <Component entityId={entityId} entityType={entityType} anchor={anchor} />;
}
