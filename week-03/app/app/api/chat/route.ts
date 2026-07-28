import {
  streamText,
  toUIMessageStream,
  createUIMessageStreamResponse,
  convertToModelMessages,
} from "ai";
import { model } from "@/lib/ai/provider";
import { guideEngine } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    system: guideEngine,
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
