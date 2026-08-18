import { describe, expect, it } from "vitest";
import { MockDeveloperRepository } from "./mock-developer-repository";
import { MockExhibitRepository } from "./mock-exhibit-repository";
import { MockCollectionRepository } from "./mock-collection-repository";
import { MockExhibitionRepository } from "./mock-exhibition-repository";
import { seedExhibits } from "@/lib/seed/exhibits";
import { seedDevelopers } from "@/lib/seed/developers";
import { seedCollections } from "@/lib/seed/collections";
import { seedExhibitions } from "@/lib/seed/exhibitions";

describe("Phase 1 acceptance: multi-developer data architecture", () => {
  const devRepo = new MockDeveloperRepository();
  const exRepo = new MockExhibitRepository();
  const colRepo = new MockCollectionRepository();
  const exhibitionRepo = new MockExhibitionRepository();

  it("has 4 developers with distinct data", async () => {
    const devs = await devRepo.getAll();
    expect(devs.length).toBe(4);

    const names = devs.map((d) => d.name);
    expect(new Set(names).size).toBe(4);

    for (const dev of devs) {
      expect(dev.username).toBeTruthy();
      expect(dev.name).toBeTruthy();
      expect(dev.bio).toBeTruthy();
      expect(dev.role).toBeTruthy();
    }
  });

  it("has exhibits across all developers", async () => {
    const exhibits = await exRepo.getAll();
    expect(exhibits.length).toBeGreaterThanOrEqual(12);

    const developerIds = new Set(exhibits.map((e) => e.developerId));
    expect(developerIds.size).toBe(4);
  });

  it("exhibits use developerId, not developer name", async () => {
    const exhibits = await exRepo.getAll();
    for (const exhibit of exhibits) {
      expect(exhibit.developerId).toBeTruthy();
      expect(typeof exhibit.developerId).toBe("string");
      expect(exhibit.developerId.length).toBeLessThan(30);
    }
  });

  it("exhibits use collectionIds array, not single collection", async () => {
    const exhibits = await exRepo.getAll();
    for (const exhibit of exhibits) {
      expect(Array.isArray(exhibit.collectionIds)).toBe(true);
      expect(exhibit.collectionIds.length).toBeGreaterThan(0);
    }
  });

  it("has multi-collection exhibits", async () => {
    const exhibits = await exRepo.getAll();
    const multiCol = exhibits.filter((e) => e.collectionIds.length > 1);
    expect(multiCol.length).toBeGreaterThanOrEqual(2);
  });

  it("has 4 open-ended collections (not closed enum)", async () => {
    const collections = await colRepo.getAll();
    expect(collections.length).toBe(4);

    for (const col of collections) {
      expect(col.id).toBeTruthy();
      expect(col.title).toBeTruthy();
      expect(col.description).toBeTruthy();
    }
  });

  it("has exhibitions with multiple exhibits each", async () => {
    const exhibitions = await exhibitionRepo.getAll();
    expect(exhibitions.length).toBeGreaterThanOrEqual(3);

    const multiExhibit = exhibitions.filter((e) => e.exhibitIds.length > 1);
    expect(multiExhibit.length).toBeGreaterThanOrEqual(2);
  });

  it("has featured exhibits", async () => {
    const featured = await exRepo.getFeatured();
    expect(featured.length).toBeGreaterThanOrEqual(3);
  });

  it("has featured exhibitions", async () => {
    const featured = await exhibitionRepo.getFeatured();
    expect(featured.length).toBeGreaterThanOrEqual(2);
  });

  it("search works across technologies", async () => {
    const results = await exRepo.search("React");
    expect(results.length).toBeGreaterThanOrEqual(3);

    const electronResults = await exRepo.search("Electron");
    expect(electronResults.length).toBe(1);
    expect(electronResults[0].id).toBe("pos-it");
  });

  it("filter by collection works", async () => {
    const fullstack = await exRepo.filter({ collectionId: "fullstack" });
    expect(fullstack.length).toBeGreaterThanOrEqual(3);

    for (const exhibit of fullstack) {
      expect(exhibit.collectionIds).toContain("fullstack");
    }
  });

  it("filter by developer works", async () => {
    const zaynExhibits = await exRepo.getByDeveloper("zayn");
    expect(zaynExhibits.length).toBe(3);

    const mayaExhibits = await exRepo.getByDeveloper("maya");
    expect(mayaExhibits.length).toBe(3);
  });

  it("collection membership derived from exhibits, not duplicated", async () => {
    const fullstackExhibits = await exRepo.filter({ collectionId: "fullstack" });
    const collection = await colRepo.getById("fullstack");
    expect(collection).toBeTruthy();
    expect("exhibitIds" in collection!).toBe(false);
    expect(fullstackExhibits.length).toBeGreaterThan(0);
  });

  it("developer repository resolves by username", async () => {
    const maya = await devRepo.getByUsername("mayachen");
    expect(maya).toBeTruthy();
    expect(maya!.name).toBe("Maya Chen");
  });

  it("getDevelopersWithExhibits returns only developers who have exhibits", async () => {
    const active = await devRepo.getDevelopersWithExhibits();
    expect(active.length).toBe(4);
    const ids = active.map((d) => d.id);
    expect(ids).toContain("zayn");
    expect(ids).toContain("maya");
    expect(ids).toContain("omar");
    expect(ids).toContain("sara");
  });
});

describe("Phase 1 acceptance: Zain removal test", () => {
  it("museum still has developers, exhibits, collections, exhibitions without Zain", async () => {
    const devRepo = new MockDeveloperRepository();
    const exRepo = new MockExhibitRepository();
    const colRepo = new MockCollectionRepository();
    const exhibitionRepo = new MockExhibitionRepository();

    const allDevs = await devRepo.getAll();
    const allExhibits = await exRepo.getAll();
    const allCollections = await colRepo.getAll();
    const allExhibitions = await exhibitionRepo.getAll();

    const devsNoZain = allDevs.filter((d) => d.id !== "zayn");
    const exhibitsNoZain = allExhibits.filter((e) => e.developerId !== "zayn");
    const exhibitionsNoZain = allExhibitions.filter((e) => e.developerId !== "zayn");

    expect(devsNoZain.length).toBe(3);
    expect(exhibitsNoZain.length).toBe(9);
    expect(allCollections.length).toBe(4);
    expect(exhibitionsNoZain.length).toBe(3);

    const developerIds = new Set(exhibitsNoZain.map((e) => e.developerId));
    expect(developerIds.size).toBe(3);
  });
});

describe("Phase 1 acceptance: old model removal test", () => {
  it("seed data is the single source of truth for exhibits", () => {
    expect(seedExhibits.length).toBe(12);
    expect(seedDevelopers.length).toBe(4);
    expect(seedCollections.length).toBe(4);
    expect(seedExhibitions.length).toBe(4);
  });

  it("every exhibit references a valid developerId", () => {
    const devIds = new Set(seedDevelopers.map((d) => d.id));
    for (const exhibit of seedExhibits) {
      expect(devIds.has(exhibit.developerId)).toBe(true);
    }
  });

  it("every exhibit references valid collectionIds", () => {
    const colIds = new Set(seedCollections.map((c) => c.id));
    for (const exhibit of seedExhibits) {
      for (const colId of exhibit.collectionIds) {
        expect(colIds.has(colId)).toBe(true);
      }
    }
  });

  it("every exhibition references valid developerId and exhibitIds", () => {
    const devIds = new Set(seedDevelopers.map((d) => d.id));
    const exIds = new Set(seedExhibits.map((e) => e.id));
    for (const exhibition of seedExhibitions) {
      expect(devIds.has(exhibition.developerId)).toBe(true);
      for (const exId of exhibition.exhibitIds) {
        expect(exIds.has(exId)).toBe(true);
      }
    }
  });
});
