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

  // ── Maya Chen ────────────────────────────────────────────────
  {
    id: "prism-ui",
    title: "Prism UI",
    tagline: "Open-source React component library with motion",
    description:
      "A comprehensive React component library built on TypeScript with fluid Framer Motion animations. Features 40+ accessible components, a theme editor, and zero-config dark mode. Published on npm with 2k+ weekly downloads.",
    developerId: "maya",
    media: [{ type: "image", src: "", alt: "Prism UI component showcase" }],
    artifacts: [
      { id: "prism-theme", label: "Theme editor", description: "Real-time color and spacing customization" },
      { id: "prism-motion", label: "Motion system", description: "Configurable spring and easing presets" },
    ],
    technologies: ["React", "TypeScript", "Framer Motion", "Storybook"],
    links: [
      { label: "GitHub", url: "https://github.com/mayachen/prism-ui", type: "github" },
      { label: "npm", url: "https://npmjs.com/package/prism-ui", type: "demo" },
    ],
    curatorNotes: "Prism UI demonstrates how motion design can be systematic rather than decorative. Every animation serves a usability purpose.",
    collectionIds: ["frontend"],
    year: "2025",
    featured: true,
  },
  {
    id: "terraform-dashboard",
    title: "Terraform Dashboard",
    tagline: "Visual infrastructure monitoring with D3.js",
    description:
      "Real-time infrastructure monitoring dashboard that visualizes cloud resources, dependency graphs, and cost trends. Built with React, D3.js, and WebGL for rendering large-scale infrastructure maps with smooth 60fps interaction.",
    developerId: "maya",
    media: [{ type: "image", src: "", alt: "Terraform Dashboard visualization" }],
    artifacts: [
      { id: "tf-graph", label: "Dependency graph", description: "Interactive resource relationship map" },
      { id: "tf-cost", label: "Cost trends", description: "Real-time spending visualization" },
    ],
    technologies: ["React", "D3.js", "WebGL", "TypeScript", "GraphQL"],
    links: [
      { label: "GitHub", url: "https://github.com/mayachen/terraform-dashboard", type: "github" },
    ],
    curatorNotes: "This project bridges infrastructure and frontend — a rare combination. The WebGL rendering layer handles thousands of nodes without frame drops.",
    collectionIds: ["frontend", "data-viz"],
    year: "2026",
    featured: true,
  },
  {
    id: "sonic-portfolio",
    title: "Sonic Portfolio",
    tagline: "Audio-reactive 3D portfolio experience",
    description:
      "An experimental portfolio site where 3D geometry responds to music. Uses the Web Audio API for real-time frequency analysis, Three.js for rendering, and GSAP for cinematic camera transitions. Every visit produces a unique visual composition.",
    developerId: "maya",
    media: [{ type: "video", src: "", alt: "Sonic Portfolio demo" }],
    artifacts: [
      { id: "sonic-audio", label: "Audio analyzer", description: "Real-time FFT frequency extraction" },
      { id: "sonic-geo", label: "Reactive geometry", description: "Mesh deformation driven by bass and treble" },
    ],
    technologies: ["Three.js", "GSAP", "Web Audio API", "GLSL"],
    links: [
      { label: "Live Demo", url: "https://sonicportfolio.mayachen.dev", type: "demo" },
    ],
    curatorNotes: "Sonic Portfolio pushes the boundary of what a personal site can be. It's not a page — it's a performance.",
    collectionIds: ["experiments"],
    year: "2025",
    featured: false,
  },

  // ── Omar Farooq ──────────────────────────────────────────────
  {
    id: "code-collab",
    title: "CodeCollab",
    tagline: "Real-time collaborative code editor",
    description:
      "A browser-based collaborative code editor supporting multiple cursors, syntax highlighting for 50+ languages, and live preview. Uses operational transforms for conflict-free concurrent editing. Built with Monaco Editor and WebSockets.",
    developerId: "omar",
    media: [{ type: "image", src: "", alt: "CodeCollab editor interface" }],
    artifacts: [
      { id: "cc-ot", label: "OT engine", description: "Operational transform for concurrent edits" },
      { id: "cc-preview", label: "Live preview", description: "Real-time code execution sandbox" },
    ],
    technologies: ["Next.js", "WebSocket", "Monaco Editor", "TypeScript", "Docker"],
    links: [
      { label: "GitHub", url: "https://github.com/omarfarooq/code-collab", type: "github" },
      { label: "Live Demo", url: "https://codecollab.omarfarooq.dev", type: "demo" },
    ],
    curatorNotes: "CodeCollab solves the hardest problem in collaborative editing — keeping multiple cursors in sync without conflicts. The OT implementation is production-quality.",
    collectionIds: ["fullstack"],
    year: "2026",
    featured: true,
  },
  {
    id: "pulse-cms",
    title: "Pulse CMS",
    tagline: "Headless CMS with visual page builder",
    description:
      "A headless CMS with an integrated visual page builder. Content editors can design pages using a drag-and-drop interface while developers maintain full API access. Includes role-based access control, media management, and webhook integrations.",
    developerId: "omar",
    media: [{ type: "image", src: "", alt: "Pulse CMS page builder" }],
    artifacts: [
      { id: "pc-builder", label: "Page builder", description: "Drag-and-drop visual editor" },
      { id: "pc-api", label: "Content API", description: "RESTful API with GraphQL overlay" },
    ],
    technologies: ["Node.js", "React", "PostgreSQL", "Redis", "GraphQL"],
    links: [
      { label: "GitHub", url: "https://github.com/omarfarooq/pulse-cms", type: "github" },
    ],
    curatorNotes: "Pulse CMS bridges the gap between developer flexibility and editorial simplicity. The visual builder generates clean, predictable content structures.",
    collectionIds: ["fullstack"],
    year: "2025",
    featured: false,
  },
  {
    id: "auction-live",
    title: "Auction Live",
    tagline: "Real-time auction platform with WebSocket bidding",
    description:
      "A real-time auction platform where hundreds of bidders compete simultaneously. Features sub-100ms bid propagation, anti-sniping countdown extensions, and live bid history streaming. Built with Go backend and React frontend.",
    developerId: "omar",
    media: [{ type: "image", src: "", alt: "Auction Live bidding interface" }],
    artifacts: [
      { id: "al-bid", label: "Bid engine", description: "Sub-100ms bid propagation via WebSocket" },
      { id: "al-anti", label: "Anti-sniping", description: "Automatic countdown extension on late bids" },
    ],
    technologies: ["Go", "WebSocket", "Redis", "React", "PostgreSQL"],
    links: [
      { label: "GitHub", url: "https://github.com/omarfarooq/auction-live", type: "github" },
    ],
    curatorNotes: "Auction Live demonstrates how backend language choice affects real-time performance. Go's goroutines handle hundreds of concurrent bid streams efficiently.",
    collectionIds: ["fullstack"],
    year: "2026",
    featured: false,
  },

  // ── Sara Okonkwo ─────────────────────────────────────────────
  {
    id: "climate-viz",
    title: "Climate Viz",
    tagline: "Interactive climate data visualization platform",
    description:
      "An interactive platform for exploring decades of climate research data. Features WebGL-powered globe rendering, animated temperature overlays, and downloadable datasets. Used by researchers at three universities for public communication.",
    developerId: "sara",
    media: [{ type: "image", src: "", alt: "Climate Viz globe visualization" }],
    artifacts: [
      { id: "cv-globe", label: "3D globe", description: "WebGL-rendered earth with temperature overlays" },
      { id: "cv-timeline", label: "Timeline scrubber", description: "Animated data across 50+ years" },
    ],
    technologies: ["D3.js", "Python", "WebGL", "FastAPI", "PostgreSQL"],
    links: [
      { label: "GitHub", url: "https://github.com/saraokonkwo/climate-viz", type: "github" },
      { label: "Live Demo", url: "https://climateviz.saraokonkwo.dev", type: "demo" },
    ],
    curatorNotes: "Climate Viz proves that data visualization can be both scientifically rigorous and emotionally compelling. The globe rendering handles millions of data points.",
    collectionIds: ["data-viz"],
    year: "2025",
    featured: true,
  },
  {
    id: "portfolio-grader",
    title: "Portfolio Grader",
    tagline: "AI-powered portfolio review tool",
    description:
      "An AI-powered tool that analyzes developer portfolios and provides actionable feedback. Uses LLMs to evaluate project descriptions, code quality signals, and presentation patterns. Generates detailed reports with improvement suggestions.",
    developerId: "sara",
    media: [{ type: "image", src: "", alt: "Portfolio Grader analysis report" }],
    artifacts: [
      { id: "pg-ai", label: "AI analysis", description: "LLM-powered portfolio evaluation" },
      { id: "pg-report", label: "Report generator", description: "Detailed PDF reports with scores" },
    ],
    technologies: ["React", "Python", "OpenAI API", "FastAPI"],
    links: [
      { label: "GitHub", url: "https://github.com/saraokonkwo/portfolio-grader", type: "github" },
    ],
    curatorNotes: "Portfolio Grader is meta — it evaluates the kind of work that gets exhibited in museums like this one. The AI feedback is surprisingly nuanced.",
    collectionIds: ["experiments", "data-viz"],
    year: "2026",
    featured: false,
  },
  {
    id: "ml-playground",
    title: "ML Playground",
    tagline: "Browser-based machine learning experiments",
    description:
      "An interactive playground for running machine learning experiments in the browser. Features pre-trained model demos, custom training workflows, and real-time visualization of model internals. Supports TensorFlow.js and ONNX models.",
    developerId: "sara",
    media: [{ type: "image", src: "", alt: "ML Playground interface" }],
    artifacts: [
      { id: "ml-train", label: "Training viewer", description: "Real-time loss and accuracy graphs" },
      { id: "ml-viz", label: "Model visualizer", description: "Layer-by-layer activation maps" },
    ],
    technologies: ["Python", "TensorFlow", "React", "WebAssembly", "FastAPI"],
    links: [
      { label: "GitHub", url: "https://github.com/saraokonkwo/ml-playground", type: "github" },
    ],
    curatorNotes: "ML Playground democratizes machine learning experimentation. Complex model training becomes accessible through visual, interactive interfaces.",
    collectionIds: ["data-viz", "experiments"],
    year: "2026",
    featured: true,
  },
];
