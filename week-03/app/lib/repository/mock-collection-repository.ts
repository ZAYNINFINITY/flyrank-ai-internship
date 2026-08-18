import type { Collection } from "@/lib/types/collection";
import type { CollectionRepository } from "./collection-repository";
import { seedCollections } from "@/lib/seed/collections";
import { seedExhibits } from "@/lib/seed/exhibits";

export class MockCollectionRepository implements CollectionRepository {
  async getAll(): Promise<Collection[]> {
    return [...seedCollections];
  }

  async getById(id: string): Promise<Collection | null> {
    return seedCollections.find((c) => c.id === id) ?? null;
  }

  async getByExhibit(exhibitId: string): Promise<Collection[]> {
    const exhibit = seedExhibits.find((e) => e.id === exhibitId);
    if (!exhibit) return [];
    return seedCollections.filter((c) => exhibit.collectionIds.includes(c.id));
  }
}
