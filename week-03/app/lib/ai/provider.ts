import { createGoogle } from "@ai-sdk/google";
import { config } from "./config";

const google = createGoogle({
  apiKey:
    process.env["FLYRANK Gemini API Key"] ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    undefined,
});

export const model = google(config.model);
