import type { Developer, DeveloperId } from "@/lib/types/developer";

export interface DeveloperRepository {
  getAll(): Promise<Developer[]>;
  getById(id: DeveloperId): Promise<Developer | null>;
  getByUsername(username: string): Promise<Developer | null>;
  getDevelopersWithExhibits(): Promise<Developer[]>;
}
