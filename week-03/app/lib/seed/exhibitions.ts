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
    id: "maya-motion-systems",
    developerId: "maya",
    title: "Motion & Design Systems",
    description:
      "Exploring how animation and systematic design thinking can elevate developer tools and creative experiences.",
    exhibitIds: ["prism-ui", "terraform-dashboard", "sonic-portfolio"],
    featured: true,
    publishedAt: "2026-02-15",
  },
  {
    id: "omar-real-time",
    developerId: "omar",
    title: "Real-Time Developer Tools",
    description:
      "Building collaborative and real-time systems that solve actual developer workflow problems — from code editing to content management to live auctions.",
    exhibitIds: ["code-collab", "pulse-cms", "auction-live"],
    featured: false,
    publishedAt: "2026-03-10",
  },
  {
    id: "sara-data-stories",
    developerId: "sara",
    title: "Data Stories",
    description:
      "Using interactive visualization and machine learning to make complex data accessible, beautiful, and actionable.",
    exhibitIds: ["climate-viz", "portfolio-grader", "ml-playground"],
    featured: true,
    publishedAt: "2026-01-20",
  },
];
