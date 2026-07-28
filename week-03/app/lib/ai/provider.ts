import { createGoogle } from "@ai-sdk/google";
import { config } from "./config";

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GEMI_API_KEY ||
  process.env["FLYRANK Gemini API Key"] ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  undefined;

const google = createGoogle({ apiKey });

export const model = google(config.model);
