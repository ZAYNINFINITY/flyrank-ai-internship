import type { Exhibition } from "@/lib/types/exhibition";
import type { ExhibitionRepository } from "./exhibition-repository";
import { seedExhibitions } from "@/lib/seed/exhibitions";

export class MockExhibitionRepository implements ExhibitionRepository {
  async getAll(): Promise<Exhibition[]> {
    return [...seedExhibitions];
  }

  async getById(id: string): Promise<Exhibition | null> {
    return seedExhibitions.find((e) => e.id === id) ?? null;
  }

  async getByDeveloper(developerId: string): Promise<Exhibition[]> {
    return seedExhibitions.filter((e) => e.developerId === developerId);
  }

  async getFeatured(): Promise<Exhibition[]> {
    return seedExhibitions.filter((e) => e.featured);
  }
}
