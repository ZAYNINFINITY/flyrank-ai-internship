import type { Developer } from "@/lib/types/developer";

export const seedDevelopers: Developer[] = [
  {
    id: "zayn",
    username: "zayn",
    name: "Zain Ul Abideen",
    avatar: "/images/avatar.png",
    bio: "CS student building production tools and browser extensions. Focused on offline-first architecture and real-time systems.",
    role: "CS Student @ PAF-IAST · MERN Stack Developer",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/ZAYNINFINITY" },
    ],
    joinedAt: "2026-01-15",
  },
  {
    id: "salaar",
    username: "SalaarTariq",
    name: "Salaar Tariq",
    avatar: "https://avatars.githubusercontent.com/u/223099320?v=4",
    bio: "AI Engineer exploring LLMs, agents, and GenAI architecture. Co-founder of an AI startup, based in Peshawar.",
    role: "AI Engineer · GenAI & LLM Systems",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/SalaarTariq" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/salaartariq/" },
      { label: "Website", url: "https://www.aidot.tech" },
    ],
    joinedAt: "2026-02-10",
  },
  {
    id: "muzammil",
    username: "muzammilahmad01",
    name: "Muzammil Ahmad",
    avatar: "https://avatars.githubusercontent.com/u/162564402?v=4",
    bio: "Software engineering student building full-stack and AI-driven applications.",
    role: "Software Engineer · Full-Stack",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/muzammilahmad01" },
    ],
    joinedAt: "2026-03-05",
  },
];
