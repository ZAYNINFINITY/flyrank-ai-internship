import { streamText, convertToModelMessages } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { UIMessage } from "ai";
import { config } from "@/lib/ai/config";
import { guideEngine } from "@/lib/ai/prompts";
import { createExhibitLookupTool } from "@/lib/ai/tools/exhibit";
import { getExhibitRepository } from "@/lib/repository";

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
    const { messages } = (await req.json()) as {
      id?: string;
      messages: UIMessage[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
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
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
}
