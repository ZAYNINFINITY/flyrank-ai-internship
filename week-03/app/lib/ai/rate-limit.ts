const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_HITS = 20;

export function checkRateLimit(ip: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterMs: 0 };
  }

  entry.count++;

  if (entry.count > MAX_HITS) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }

  return { ok: true, retryAfterMs: 0 };
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 20;

export function validateMessages(messages: unknown[]): { ok: boolean; error?: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "No messages provided" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { ok: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }

  for (const msg of messages) {
    if (typeof msg === "object" && msg !== null && "content" in msg) {
      const content = (msg as { content: unknown }).content;
      if (typeof content === "string" && content.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` };
      }
    }
  }

  return { ok: true };
}
