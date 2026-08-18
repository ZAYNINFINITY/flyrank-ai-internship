import type { Exhibit } from "@/lib/types/exhibit";
import type { ExhibitRepository, ExhibitFilter } from "./exhibit-repository";
import { seedExhibits } from "@/lib/seed/exhibits";

export const mockExhibits: Exhibit[] = [...seedExhibits];

export class MockExhibitRepository implements ExhibitRepository {
  async getAll(): Promise<Exhibit[]> {
    return [...mockExhibits];
  }

  async getById(id: string): Promise<Exhibit | null> {
    return mockExhibits.find((e) => e.id === id) ?? null;
  }

  async getByDeveloper(developerId: string): Promise<Exhibit[]> {
    return mockExhibits.filter((e) => e.developerId === developerId);
  }

  async getFeatured(): Promise<Exhibit[]> {
    return mockExhibits.filter((e) => e.featured);
  }

  async search(query: string): Promise<Exhibit[]> {
    const needle = query.toLowerCase();
    return mockExhibits.filter((e) =>
      [e.title, e.tagline, e.description, e.developerId, ...e.technologies]
        .some((field) => field.toLowerCase().includes(needle))
    );
  }

  async filter(filters: ExhibitFilter): Promise<Exhibit[]> {
    let results = [...mockExhibits];

    if (filters.developerId) {
      results = results.filter((e) => e.developerId === filters.developerId);
    }
    if (filters.collectionId) {
      results = results.filter((e) => e.collectionIds.includes(filters.collectionId!));
    }
    if (filters.technologies && filters.technologies.length > 0) {
      results = results.filter((e) =>
        filters.technologies!.some((t) => e.technologies.includes(t))
      );
    }
    if (filters.featured !== undefined) {
      results = results.filter((e) => e.featured === filters.featured);
    }
    if (filters.query) {
      const needle = filters.query.toLowerCase();
      results = results.filter((e) =>
        [e.title, e.tagline, e.description, ...e.technologies]
          .some((field) => field.toLowerCase().includes(needle))
      );
    }

    return results;
  }
}
