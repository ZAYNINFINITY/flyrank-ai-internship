import { createGoogle } from "@ai-sdk/google";
import { config } from "./config";

const apiKey = process.env["FLYRANK Gemini API Key"];

const google = createGoogle({
  apiKey,
});

export const model = google(config.model);
