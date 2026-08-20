import type { Exhibit } from "@/lib/types/exhibit";

export const seedExhibits: Exhibit[] = [
  // ── Zain Ul Abideen ──────────────────────────────────────────
  {
    id: "pos-it",
    title: "POS-it",
    tagline: "Offline-first point-of-sale for pharmacies",
    description:
      "Professional offline-point-of-sale system built with Electron, React, and SQLite. Real-time inventory, multi-user support, PDF invoicing, and auto-updates. Currently in production-grade development with a live pharmacy pilot.",
    developerId: "zayn",
    media: [{ type: "image", src: "/images/pos-it.png", alt: "POS-it dashboard" }],
    artifacts: [
      { id: "pos-it-invoice", label: "Invoice template", description: "PDF invoice with auto-calculation" },
      { id: "pos-it-api", label: "REST API spec", description: "Offline-first sync protocol" },
    ],
    technologies: ["Electron", "React", "SQLite", "Node.js"],
    links: [
      { label: "GitHub", url: "https://github.com/ZAYNINFINITY/pos-it", type: "github" },
    ],
    curatorNotes: "POS-it demonstrates offline resilience — a pattern worth studying for any production-grade desktop app.",
    collectionIds: ["fullstack"],
    year: "2026",
    featured: true,
  },
  {
    id: "collaborative-workspace",
    title: "Collaborative Workspace",
    tagline: "Real-time MERN collaboration platform",
    description:
      "Full-stack MERN collaboration platform with live chat via Socket.io, multi-user document editing, Kanban task boards, and OAuth 2.0 authentication. Built to handle concurrent users with real-time event broadcasting.",
    developerId: "zayn",
    media: [{ type: "image", src: "", alt: "Workspace board" }],
    artifacts: [
      { id: "collab-kanban", label: "Kanban board", description: "Drag-and-drop task management" },
      { id: "collab-chat", label: "Live chat", description: "Socket.io real-time messaging" },
    ],
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "OAuth 2.0"],
    links: [
      { label: "GitHub", url: "https://github.com/ZAYNINFINITY/collaborative-workspace", type: "github" },
    ],
    curatorNotes: "This project showcases real-time architecture at the application level. The socket event model is cleanly separated from the REST layer.",
    collectionIds: ["fullstack"],
    year: "2026",
    featured: false,
  },
  {
    id: "scrollstreak",
    title: "ScrollStreak",
    tagline: "Chrome extension for Reels tracking",
    description:
      "Chrome and Edge browser extension that tracks Instagram Reels watched, shows a live counter overlay, and lets you challenge friends to duels with leaderboards and weekly Wrapped stats. Published on the Microsoft Edge Add-ons store.",
    developerId: "zayn",
    media: [{ type: "image", src: "/images/scrollstreak.png", alt: "ScrollStreak overlay" }],
    artifacts: [
      { id: "ss-counter", label: "Live counter", description: "Overlay showing Reels count" },
      { id: "ss-duels", label: "Friend duels", description: "Challenge system with leaderboards" },
    ],
    technologies: ["Chrome Extension", "JavaScript", "HTML", "CSS"],
    links: [
      { label: "Edge Add-ons", url: "https://microsoftedge.microsoft.com/addons/detail/scrollstreak", type: "demo" },
    ],
    curatorNotes: "A browser extension might seem simple, but ScrollStreak required working within extension APIs, content script isolation, and cross-browser compatibility.",
    collectionIds: ["experiments"],
    year: "2026",
    featured: false,
  },

  // ── Salaar Tariq ─────────────────────────────────────────────
  {
    id: "vision-and-voice-doctor",
    title: "Vision & Voice Doctor",
    tagline: "Image-and-voice symptom checker chatbot",
    description:
      "A chatbot that takes an uploaded image, works out what type of allergy it might indicate, and replies back using voice or text.",
    developerId: "salaar",
    media: [{ type: "image", src: "", alt: "Vision & Voice Doctor" }],
    artifacts: [],
    technologies: ["Python"],
    links: [
      { label: "GitHub", url: "https://github.com/SalaarTariq/Vision-And-Voice-Doctor", type: "github" },
    ],
    curatorNotes: "",
    collectionIds: ["experiments"],
    year: "2026",
    featured: true,
  },

  // ── Muzammil Ahmad ───────────────────────────────────────────
  {
    id: "pak-law-chatbot",
    title: "PakLawChatBot",
    tagline: "BS Software Engineering final year project",
    description:
      "A chatbot built as a BS Software Engineering final year project.",
    developerId: "muzammil",
    media: [{ type: "image", src: "", alt: "PakLawChatBot" }],
    artifacts: [],
    technologies: ["Python"],
    links: [
      { label: "GitHub", url: "https://github.com/muzammilahmad01/PakLawChatBot", type: "github" },
    ],
    curatorNotes: "",
    collectionIds: ["fullstack"],
    year: "2026",
    featured: true,
  },
];
