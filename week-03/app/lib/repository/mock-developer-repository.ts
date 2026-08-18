import type { Developer } from "@/lib/types/developer";
import type { DeveloperRepository } from "./developer-repository";
import { seedDevelopers } from "@/lib/seed/developers";
import { seedExhibits } from "@/lib/seed/exhibits";

export class MockDeveloperRepository implements DeveloperRepository {
  async getAll(): Promise<Developer[]> {
    return [...seedDevelopers];
  }

  async getById(id: string): Promise<Developer | null> {
    return seedDevelopers.find((d) => d.id === id) ?? null;
  }

  async getByUsername(username: string): Promise<Developer | null> {
    return seedDevelopers.find((d) => d.username === username) ?? null;
  }

  async getDevelopersWithExhibits(): Promise<Developer[]> {
    const developerIds = new Set(seedExhibits.map((e) => e.developerId));
    return seedDevelopers.filter((d) => developerIds.has(d.id));
  }
}
