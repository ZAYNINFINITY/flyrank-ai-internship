import {
  generateText,
  convertToModelMessages,
} from "ai";
import { model } from "@/lib/ai/provider";
import { guideEngine } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const result = await generateText({
      model,
      system: guideEngine,
      messages: await convertToModelMessages(messages),
    });
    return Response.json({ text: result.text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
}
