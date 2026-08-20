import { streamText, convertToModelMessages } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { UIMessage } from "ai";
import { config } from "@/lib/ai/config";
import { guideEngine } from "@/lib/ai/prompts";
import { createExhibitLookupTool } from "@/lib/ai/tools/exhibit";
import { getExhibitRepository } from "@/lib/repository";
import { checkRateLimit, validateMessages } from "@/lib/ai/rate-limit";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://plinth-cyan.vercel.app",
    "X-Title": "Plinth",
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

    const { messages } = (await req.json()) as {
      id?: string;
      messages: UIMessage[];
    };

    const validation = validateMessages(messages);
    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: 400 });
    }

    const result = streamText({
      model,
      system: guideEngine,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: config.maxTokens,
      tools: {
        exhibitLookup: createExhibitLookupTool(getExhibitRepository()),
      },
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
