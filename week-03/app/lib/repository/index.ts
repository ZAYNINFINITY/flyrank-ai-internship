import type { ExhibitRepository } from "./exhibit-repository";
import { MockExhibitRepository } from "./mock-exhibit-repository";

export type { ExhibitRepository } from "./exhibit-repository";

let instance: ExhibitRepository | undefined;

/**
 * Single seam for the museum's data source.
 *
 * Tools, routes, and the chat UI depend on the ExhibitRepository interface
 * only — swapping the concrete source (database, CMS, vector search,
 * production content) happens here and nowhere else.
 */
export function getExhibitRepository(): ExhibitRepository {
  if (!instance) instance = new MockExhibitRepository();
  return instance;
}
