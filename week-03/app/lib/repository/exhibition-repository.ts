import type { Exhibition, ExhibitionId } from "@/lib/types/exhibition";

export interface ExhibitionRepository {
  getAll(): Promise<Exhibition[]>;
  getById(id: ExhibitionId): Promise<Exhibition | null>;
  getByDeveloper(developerId: string): Promise<Exhibition[]>;
  getFeatured(): Promise<Exhibition[]>;
}
