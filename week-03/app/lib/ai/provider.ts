import { createOpenAI } from "@ai-sdk/openai";
import { config } from "./config";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "https://plinth-cyan.vercel.app",
    "X-Title": "Plinth",
  },
});

export const model = openrouter(config.model);
