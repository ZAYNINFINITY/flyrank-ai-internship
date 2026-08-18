import type { Exhibit, ExhibitId } from "@/lib/types/exhibit";

export type ExhibitFilter = {
  developerId?: string;
  collectionId?: string;
  technologies?: string[];
  featured?: boolean;
  query?: string;
};

export interface ExhibitRepository {
  getAll(): Promise<Exhibit[]>;
  getById(id: ExhibitId): Promise<Exhibit | null>;
  getByDeveloper(developerId: string): Promise<Exhibit[]>;
  getFeatured(): Promise<Exhibit[]>;
  search(query: string): Promise<Exhibit[]>;
  filter(filters: ExhibitFilter): Promise<Exhibit[]>;
}
