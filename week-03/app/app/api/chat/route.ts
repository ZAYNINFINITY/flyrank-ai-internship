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

    return new Response(
      JSON.stringify({ text: result.text }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
