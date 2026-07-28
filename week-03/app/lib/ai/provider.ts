import { google } from "@ai-sdk/google";
import { config } from "./config";

export const model = google(config.model);
