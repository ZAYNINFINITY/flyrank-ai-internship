import { generateObject } from "ai";
import { z } from "zod";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { config } from "@/lib/ai/config";
import { checkRateLimit } from "@/lib/ai/rate-limit";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://foyer-cyan.vercel.app",
    "X-Title": "Foyer",
  },
});

const model = openrouter.chatModel(config.model);

const VALID_COLLECTIONS = ["frontend", "fullstack", "data-viz", "experiments"] as const;

// The AI's output contract — everything a seed-style Exhibit needs except
// developer/media/link fields, which stay human-supplied.
const CurationSchema = z.object({
  title: z.string().describe("Short display title for the project"),
  tagline: z.string().describe("One-line hook, max 80 chars"),
  description: z.string().describe(
    "2-3 sentence museum-plaque description of what was built and how"
  ),
  curatorNotes: z.string().describe(
    "1-2 sentences in a curator's voice on why this work matters or what pattern it demonstrates"
  ),
  technologies: z.array(z.string()).max(8).describe("Key technologies, most significant first"),
  collectionId: z.enum(VALID_COLLECTIONS).describe(
    "Best-fit collection: frontend, fullstack, data-viz, or experiments"
  ),
});

export type Curation = z.infer<typeof CurationSchema>;

// ─── GitHub helpers ─────────────────────────────────────────────

/** Accepts full URLs, shorthand owner/repo, or .git suffixes. */
function parseRepoUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\.git$/, "");
  const match = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/i
  );
  if (match) return { owner: match[1], repo: match[2] };
  // Shorthand "owner/repo" — only when it looks exactly like that
  const short = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (short) return { owner: short[1], repo: short[2] };
  return null;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      // GitHub API requires a User-Agent
      "User-Agent": "Foyer-Museum-Curator",
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`GitHub returned ${res.status}`);
  }
  return res.json();
}

type RepoMeta = {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  homepage: string | null;
};

function extractRepoMeta(raw: unknown): RepoMeta {
  const r = raw as Record<string, unknown>;
  return {
    name: typeof r.name === "string" ? r.name : "",
    description: typeof r.description === "string" ? r.description : null,
    language: typeof r.language === "string" ? r.language : null,
    topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === "string") : [],
    homepage: typeof r.homepage === "string" && r.homepage ? r.homepage : null,
  };
}

const MAX_README_CHARS = 8000;

async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const raw = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/readme`);
    const encoded = (raw as Record<string, unknown>).content;
    if (typeof encoded !== "string") return "";
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    // Strip markdown noise the LLM doesn't need — keeps tokens down
    const cleaned = decoded
      .replace(/<img[^>]*>/gi, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/gi, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/gi, "$1")
      .replace(/```[\s\S]*?```/gi, "(code sample omitted)")
      .trim();
    return cleaned.slice(0, MAX_README_CHARS);
  } catch {
    return ""; // README is optional — metadata alone is enough to curate
  }
}

// ─── Route ──────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    const rate = checkRateLimit(ip);
    if (!rate.ok) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) } }
      );
    }

    const body = (await req.json()) as { repoUrl?: unknown };
    if (typeof body.repoUrl !== "string") {
      return Response.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const parsed = parseRepoUrl(body.repoUrl);
    if (!parsed) {
      return Response.json(
        { error: "Enter a valid GitHub repo URL (e.g. https://github.com/owner/repo)" },
        { status: 400 }
      );
    }

    // Fetch repo metadata + README in parallel; README failure is non-fatal
    let meta: RepoMeta;
    try {
      meta = extractRepoMeta(
        await fetchJson(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`)
      );
    } catch (e) {
      const status = e instanceof Error && e.message.includes("404") ? 404 : 502;
      return Response.json(
        {
          error:
            status === 404
              ? `Repo not found: ${parsed.owner}/${parsed.repo}. Is it public?`
              : "Couldn't reach GitHub. Try again shortly.",
        },
        { status }
      );
    }
    const readme = await fetchReadme(parsed.owner, parsed.repo);

    const { object } = await generateObject({
      model,
      schema: CurationSchema,
      system:
        "You are the head curator of Foyer, an open museum where developers exhibit their craft. " +
        "Given GitHub repository data, write museum-quality curation: factual, warm, concise. " +
        "Never invent features that the source material doesn't support.",
      prompt: [
        `Repository: ${parsed.owner}/${parsed.repo}`,
        meta.name && `Display name: ${meta.name}`,
        meta.description && `GitHub description: ${meta.description}`,
        meta.language && `Primary language: ${meta.language}`,
        meta.topics.length > 0 && `Topics: ${meta.topics.join(", ")}`,
        meta.homepage && `Homepage: ${meta.homepage}`,
        readme && `README:\n${readme}`,
      ]
        .filter(Boolean)
        .join("\n"),
      maxOutputTokens: config.maxTokens,
    });

    return Response.json({ curation: object, repoUrl: `https://github.com/${parsed.owner}/${parsed.repo}` });
  } catch (e: unknown) {
    console.error("[api/curate] failed:", e);
    return Response.json(
      { error: "The curator couldn't finish. Please try again." },
      { status: 500 }
    );
  }
}
