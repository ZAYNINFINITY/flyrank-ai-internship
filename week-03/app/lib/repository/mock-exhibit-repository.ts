import type { Exhibit } from "@/lib/types/exhibit";
import type { ExhibitRepository } from "./exhibit-repository";

export const mockExhibits: Exhibit[] = [
  {
    id: "pos-it",
    title: "POS-it",
    tagline: "Offline-first point-of-sale for pharmacies",
    description:
      "Professional offline point-of-sale system built with Electron, React, and SQLite. Real-time inventory, multi-user support, PDF invoicing, and auto-updates. Currently in production-grade development with a live pharmacy pilot.",
    media: [
      { type: "image", src: "/images/pos-it.png", alt: "POS-it dashboard" },
    ],
    artifacts: [
      { id: "pos-it-invoice", label: "Invoice template", description: "PDF invoice with auto-calculation" },
      { id: "pos-it-api", label: "REST API spec", description: "Offline-first sync protocol" },
    ],
    curatorNotes: "POS-it demonstrates offline resilience — a pattern worth studying for any production-grade desktop app.",
    collection: "infrastructure",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "collaborative-workspace",
    title: "Collaborative Workspace",
    tagline: "Real-time MERN collaboration platform",
    description:
      "Full-stack MERN collaboration platform with live chat via Socket.io, multi-user document editing, Kanban task boards, and OAuth 2.0 authentication. Built to handle concurrent users with real-time event broadcasting.",
    media: [
      { type: "image", src: "/images/collab.png", alt: "Workspace board" },
    ],
    artifacts: [
      { id: "collab-kanban", label: "Kanban board", description: "Drag-and-drop task management" },
      { id: "collab-chat", label: "Live chat", description: "Socket.io real-time messaging" },
    ],
    curatorNotes: "This project showcases real-time architecture at the application level. The socket event model is cleanly separated from the REST layer.",
    collection: "infrastructure",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "zse-store",
    title: "ZSE Store",
    tagline: "Live e-commerce for sanitary products",
    description:
      "Live e-commerce site for a real sanitary and electric products business. Full product catalog, brand filtering, WhatsApp order integration, and a clean responsive UI.",
    media: [
      { type: "image", src: "/images/zse-store.png", alt: "ZSE Store homepage" },
    ],
    artifacts: [
      { id: "zse-catalog", label: "Product catalog", description: "Categorized with brand filtering" },
      { id: "zse-whatsapp", label: "WhatsApp integration", description: "One-click order via WhatsApp" },
    ],
    curatorNotes: "ZSE Store is a real client project — constraints included working with an existing inventory and minimal onboarding time.",
    collection: "visual-design",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "scrollstreak",
    title: "ScrollStreak",
    tagline: "Chrome extension for Reels tracking",
    description:
      "Chrome and Edge browser extension that tracks Instagram Reels watched, shows a live counter overlay, and lets you challenge friends to duels with leaderboards and weekly Wrapped stats. Published on the Microsoft Edge Add-ons store.",
    media: [
      { type: "image", src: "/images/scrollstreak.png", alt: "ScrollStreak overlay" },
    ],
    artifacts: [
      { id: "ss-counter", label: "Live counter", description: "Overlay showing Reels count" },
      { id: "ss-duels", label: "Friend duels", description: "Challenge system with leaderboards" },
    ],
    curatorNotes: "A browser extension might seem simple, but ScrollStreak required working within extension APIs, content script isolation, and cross-browser compatibility.",
    collection: "experiments",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "streamer-dash",
    title: "Streamer Dash",
    tagline: "Browser-based face-clicking game",
    description:
      "A fast-paced browser game where players click faces that appear on screen. Built with vanilla JavaScript and Canvas API. Features combo scoring, difficulty progression, and leaderboard tracking.",
    media: [
      { type: "image", src: "", alt: "Streamer Dash gameplay" },
    ],
    artifacts: [
      { id: "sd-combo", label: "Combo system", description: "Multiplier scoring for consecutive clicks" },
      { id: "sd-diff", label: "Difficulty curve", description: "Progressive speed increase" },
    ],
    curatorNotes: "Pure fun. Streamer Dash was built in a weekend but taught more about requestAnimationFrame and hit detection than most tutorials.",
    collection: "experiments",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "forms-validation",
    title: "Forms & Validation",
    tagline: "React Hook Form + Zod drill",
    description:
      "A focused exercise in form architecture using react-hook-form and Zod validation. Every form has real labels, accessible error messages, and type-safe schemas. Tests assert invalid submissions are blocked.",
    media: [],
    artifacts: [
      { id: "fv-schema", label: "Zod schema", description: "Type-safe validation with custom errors" },
      { id: "fv-tests", label: "Test suite", description: "Invalid submission rejection tests" },
    ],
    curatorNotes: "This drill established a pattern the internship still follows: forms are never uncontrolled. react-hook-form + Zod is the standard.",
    collection: "journey",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "api-design",
    title: "API Design Patterns",
    tagline: "RESTful API with Express middleware",
    description:
      "Designed and documented a RESTful API following resource-oriented design. Implemented Express middleware for auth, rate limiting, request validation, and error handling. Includes OpenAPI documentation.",
    media: [],
    artifacts: [
      { id: "api-middleware", label: "Auth middleware", description: "JWT verification with role-based access" },
      { id: "api-spec", label: "OpenAPI spec", description: "Full API documentation" },
    ],
    curatorNotes: "The middleware architecture here — validation → auth → rate-limit → handler → error — became the template for all subsequent API work.",
    collection: "journey",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "auth-oauth",
    title: "Auth & OAuth Integration",
    tagline: "Passport.js strategies for social login",
    description:
      "Implemented OAuth 2.0 authentication with Google and GitHub strategies using Passport.js. Covers token management, session handling, and account linking. Built alongside a JWT-based authentication fallback.",
    media: [],
    artifacts: [
      { id: "oauth-flow", label: "OAuth flow diagram", description: "Visual auth sequence" },
      { id: "oauth-jwt", label: "JWT utility", description: "Token generation and verification" },
    ],
    curatorNotes: "Understanding OAuth at this level is rare in junior developers. This isn't just library usage — it's protocol comprehension.",
    collection: "journey",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "testing-patterns",
    title: "Testing Patterns",
    tagline: "Unit, integration, and E2E test suites",
    description:
      "Built comprehensive test suites using Jest, React Testing Library, and Playwright. Covers unit tests for utilities, integration tests for form flows, and E2E tests for critical user journeys. Achieved 85%+ coverage.",
    media: [],
    artifacts: [
      { id: "tp-unit", label: "Unit tests", description: "Pure function tests with Jest" },
      { id: "tp-e2e", label: "E2E tests", description: "Playwright user flow tests" },
    ],
    curatorNotes: "Testing isn't optional — it's how you ship with confidence. This exhibit should be the first stop for anyone wondering how tests are structured in this internship.",
    collection: "journey",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
  {
    id: "museum-architecture",
    title: "Museum Architecture",
    tagline: "Domain model for the Plinth museum",
    description:
      "The Plinth museum domain model: a pure TypeScript world with Building → Floor → Wing → Room → Surface → Anchor hierarchy. Separated from React, independent of framework, designed to be rendered by any frontend. This is the architecture behind this very exhibit.",
    media: [],
    artifacts: [
      { id: "ma-types", label: "Type system", description: "20+ domain types with no framework deps" },
      { id: "ma-adapter", label: "Navigation adapter", description: "RoomId → Route mapping for Next.js" },
    ],
    curatorNotes: "This exhibit is self-referential — it occupies the very room defined by its own architecture. The renderer that displays this text is the same one you're using now.",
    collection: "infrastructure",
    developer: "Zain Ul Abideen",
    year: "2026",
  },
];

export class MockExhibitRepository implements ExhibitRepository {
  async getAll(): Promise<Exhibit[]> {
    return [...mockExhibits];
  }

  async getById(id: string): Promise<Exhibit | null> {
    return mockExhibits.find((e) => e.id === id) ?? null;
  }

  async getByCollection(collection: Exhibit["collection"]): Promise<Exhibit[]> {
    return mockExhibits.filter((e) => e.collection === collection);
  }
}
