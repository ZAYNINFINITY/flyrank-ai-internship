import type { Exhibit, ExhibitId, ExhibitCollection } from "@/lib/types/exhibit";

export interface ExhibitRepository {
  getAll(): Promise<Exhibit[]>;
  getById(id: ExhibitId): Promise<Exhibit | null>;
  getByCollection(collection: ExhibitCollection): Promise<Exhibit[]>;
}
