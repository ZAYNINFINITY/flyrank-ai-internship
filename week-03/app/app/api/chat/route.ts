import { streamText, convertToModelMessages } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { UIMessage } from "ai";
import { config } from "@/lib/ai/config";
import { guideEngine, receptionistPrompt, catPrompt } from "@/lib/ai/prompts";
import { createExhibitLookupTool } from "@/lib/ai/tools/exhibit";
import { getExhibitRepository } from "@/lib/repository";
import { checkRateLimit, validateMessages } from "@/lib/ai/rate-limit";

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

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

    const rate = checkRateLimit(ip);
    if (!rate.ok) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) } },
      );
    }

    const { messages, character } = (await req.json()) as {
      id?: string;
      messages: UIMessage[];
      /** Which museum character is speaking — picks the system prompt and
       * whether tools are attached. Defaults to the curator for backward
       * compatibility with any caller that doesn't send this. */
      character?: "curator" | "receptionist" | "cat";
    };

    const validation = validateMessages(messages);
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const system =
      character === "receptionist" ? receptionistPrompt : character === "cat" ? catPrompt : guideEngine;

    // Only the curator needs exhibit lookups — the receptionist handles basic
    // wayfinding and the cat isn't answering real questions at all.
    const result = streamText({
      model,
      system,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: config.maxTokens,
      tools:
        !character || character === "curator"
          ? { exhibitLookup: createExhibitLookupTool(getExhibitRepository()) }
          : undefined,
    });

    return result.toUIMessageStreamResponse();
  } catch (e: unknown) {
    console.error("[api/chat] failed to produce a response:", e);
    return Response.json(
      { error: "The assistant couldn't respond. Please try again." },
      { status: 500 },
    );
  }
}
