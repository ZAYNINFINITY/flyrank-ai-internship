import { collectionMeta } from "@/app/collection/collection-experience";

export function GalleryExperience({
  collection = null,
}: {
  collection?: string | null;
}) {
  const meta = collection ? collectionMeta[collection] : null;

  return (
    <div className="mb-12">
      <div
        className={`max-w-md ${meta ? `border-l-2 pl-4 ${meta.color}` : ""}`}
      >
        <h2 className="font-heading text-2xl tracking-tight">
          {meta ? meta.label : "Main Corridor"}
        </h2>
        <p className="mt-2 text-sm opacity-50">
          {meta
            ? meta.description
            : "Exhibits line the walls in the order they were curated. Each one opens into its own room."}
        </p>
        {meta && (
          <p className="mt-2 text-xs uppercase tracking-[0.25em] opacity-30">
            {collection} collection
          </p>
        )}
      </div>
    </div>
  );
}
