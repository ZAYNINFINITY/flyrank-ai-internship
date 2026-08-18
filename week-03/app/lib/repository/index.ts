import type { ExhibitRepository } from "./exhibit-repository";
import type { DeveloperRepository } from "./developer-repository";
import type { CollectionRepository } from "./collection-repository";
import type { ExhibitionRepository } from "./exhibition-repository";
import { MockExhibitRepository } from "./mock-exhibit-repository";
import { MockDeveloperRepository } from "./mock-developer-repository";
import { MockCollectionRepository } from "./mock-collection-repository";
import { MockExhibitionRepository } from "./mock-exhibition-repository";

export type { ExhibitRepository, ExhibitFilter } from "./exhibit-repository";
export type { DeveloperRepository } from "./developer-repository";
export type { CollectionRepository } from "./collection-repository";
export type { ExhibitionRepository } from "./exhibition-repository";

let exhibitInstance: ExhibitRepository | undefined;
let developerInstance: DeveloperRepository | undefined;
let collectionInstance: CollectionRepository | undefined;
let exhibitionInstance: ExhibitionRepository | undefined;

/**
 * Single seam for the museum's exhibit data source.
 * Swapping the concrete source (database, CMS) happens here.
 */
export function getExhibitRepository(): ExhibitRepository {
  if (!exhibitInstance) exhibitInstance = new MockExhibitRepository();
  return exhibitInstance;
}

/**
 * Single seam for the museum's developer data source.
 */
export function getDeveloperRepository(): DeveloperRepository {
  if (!developerInstance) developerInstance = new MockDeveloperRepository();
  return developerInstance;
}

/**
 * Single seam for the museum's collection data source.
 */
export function getCollectionRepository(): CollectionRepository {
  if (!collectionInstance) collectionInstance = new MockCollectionRepository();
  return collectionInstance;
}

/**
 * Single seam for the museum's exhibition data source.
 */
export function getExhibitionRepository(): ExhibitionRepository {
  if (!exhibitionInstance) exhibitionInstance = new MockExhibitionRepository();
  return exhibitionInstance;
}
