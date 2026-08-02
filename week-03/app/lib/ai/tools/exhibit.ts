import { tool } from "ai";
import { z } from "zod";
import type { Exhibit } from "@/lib/types/exhibit";
import type { ExhibitRepository } from "@/lib/repository";

export const exhibitCollections = [
  "infrastructure",
  "visual-design",
  "experiments",
  "journey",
] as const;

export const exhibitLookupSchema = z
  .object({
    id: z.string().min(1).optional().describe("Exact exhibit id, e.g. \"pos-it\""),
    collection: z
      .enum(exhibitCollections)
      .optional()
      .describe("Filter exhibits by collection"),
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Free-text search across title, tagline, description, and developer"),
  })
  .describe("Look up project exhibits in the Plinth museum");

export type ExhibitLookupInput = z.infer<typeof exhibitLookupSchema>;

function matchesQuery(exhibit: Exhibit, query: string): boolean {
  const needle = query.toLowerCase();
  return [
    exhibit.title,
    exhibit.tagline,
    exhibit.description,
    exhibit.developer,
  ].some((field) => field.toLowerCase().includes(needle));
}

/**
 * Tool contract:
 * - input: { id?, collection?, query? } (Zod-validated)
 * - output: Exhibit[] (plain typed data; the chat UI is unaware of the data source)
 */
export function createExhibitLookupTool(repo: ExhibitRepository) {
  return tool({
    description:
      "Search the Plinth museum collection. Returns project exhibits by id, collection, or free-text query.",
    inputSchema: exhibitLookupSchema,
    async execute({ id, collection, query }) {
      if (id) {
        const exhibit = await repo.getById(id);
        return exhibit ? [exhibit] : [];
      }

      let exhibits = collection
        ? await repo.getByCollection(collection)
        : await repo.getAll();

      if (query) {
        exhibits = exhibits.filter((e) => matchesQuery(e, query));
      }

      return exhibits;
    },
  });
}
