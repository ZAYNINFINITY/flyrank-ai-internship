import { tool } from "ai";
import { z } from "zod";
import type { ExhibitRepository } from "@/lib/repository";

export const exhibitLookupSchema = z
  .object({
    id: z.string().min(1).optional().describe('Exact exhibit id, e.g. "pos-it"'),
    collection: z
      .string()
      .min(1)
      .optional()
      .describe("Filter exhibits by collection id, e.g. frontend, fullstack, data-viz, experiments"),
    query: z
      .string()
      .min(1)
      .optional()
      .describe("Free-text search across title, tagline, description, technologies, and developer id"),
  })
  .describe("Look up project exhibits in the Foyer museum");

export type ExhibitLookupInput = z.infer<typeof exhibitLookupSchema>;

/**
 * Tool contract:
 * - input: { id?, collection?, query? } (Zod-validated)
 * - output: Exhibit[] (plain typed data; the chat UI is unaware of the data source)
 */
export function createExhibitLookupTool(repo: ExhibitRepository) {
  return tool({
    description:
      "Search the Foyer museum collection. Returns project exhibits by id, collection, or free-text query.",
    inputSchema: exhibitLookupSchema,
    async execute({ id, collection, query }) {
      if (id) {
        const exhibit = await repo.getById(id);
        return exhibit ? [exhibit] : [];
      }

      let exhibits = collection
        ? await repo.filter({ collectionId: collection })
        : await repo.getAll();

      if (query) {
        exhibits = await repo.search(query);
      }

      return exhibits;
    },
  });
}
