import { config } from "@/lib/ai/config";
import { guideEngine } from "@/lib/ai/prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type UIPart = { type: string; text?: string };
type UIMessage = { role: string; parts: UIPart[] };

function toOpenAIContent(msg: UIMessage): string {
  return (msg.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

export async function POST(req: Request) {
  try {
    const { id, messages } = await req.json() as {
      id?: string;
      messages: UIMessage[];
    };

    const openrouterBody = {
      model: config.model,
      messages: [
        { role: "system", content: guideEngine },
        ...messages.map((m) => ({
          role: m.role,
          content: toOpenAIContent(m),
        })),
      ],
      stream: true,
    };

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://plinth-cyan.vercel.app",
        "X-Title": "Plinth",
      },
      body: JSON.stringify(openrouterBody),
    });

    if (!response.ok) {
      const text = await response.text();
      return Response.json(
        { error: `OpenRouter ${response.status}: ${text}` },
        { status: 502 },
      );
    }

    const openrouterStream = response.body;
    if (!openrouterStream) {
      return Response.json({ error: "No response body" }, { status: 502 });
    }

    const messageId = id ?? crypto.randomUUID();

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "start", messageId })}\n\n`),
          );

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text-start", id: messageId })}\n\n`,
            ),
          );

          const reader = openrouterStream.getReader();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const jsonStr = trimmed.slice(6);
              if (jsonStr === "[DONE]") continue;

              try {
                const data = JSON.parse(jsonStr);
                const delta = data.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "text-delta", id: messageId, delta })}\n\n`,
                    ),
                  );
                }
              } catch {
                // skip malformed JSON lines
              }
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "text-end", id: messageId })}\n\n`,
            ),
          );

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "finish", finishReason: "stop" })}\n\n`,
            ),
          );

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e: unknown) {
          const errMsg = e instanceof Error ? e.message : String(e);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", errorText: errMsg })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
}
