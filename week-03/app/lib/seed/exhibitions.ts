import type { Exhibition } from "@/lib/types/exhibition";

export const seedExhibitions: Exhibition[] = [
  {
    id: "zayn-internship-journey",
    developerId: "zayn",
    title: "Internship Journey",
    description:
      "A collection of projects from a MERN stack internship — from offline-first desktop apps to real-time collaboration platforms and browser extensions.",
    exhibitIds: ["pos-it", "collaborative-workspace", "scrollstreak"],
    featured: true,
    publishedAt: "2026-03-01",
  },
  {
    id: "salaar-ai-experiments",
    developerId: "salaar",
    title: "AI Experiments",
    description:
      "Exploring LLMs, computer vision, and voice interfaces — building chatbots that see, hear, and respond to the real world.",
    exhibitIds: ["vision-and-voice-doctor"],
    featured: true,
    publishedAt: "2026-02-15",
  },
  {
    id: "muzammil-chatbot",
    developerId: "muzammil",
    title: "Conversational AI",
    description:
      "Building chatbots that solve real problems — from legal knowledge access to domain-specific assistance.",
    exhibitIds: ["pak-law-chatbot"],
    featured: false,
    publishedAt: "2026-03-10",
  },
];
