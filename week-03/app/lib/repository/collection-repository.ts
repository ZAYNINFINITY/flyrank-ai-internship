import type { Collection, CollectionId } from "@/lib/types/collection";

export interface CollectionRepository {
  getAll(): Promise<Collection[]>;
  getById(id: CollectionId): Promise<Collection | null>;
  getByExhibit(exhibitId: string): Promise<Collection[]>;
}
