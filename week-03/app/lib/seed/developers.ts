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
    id: "maya",
    username: "mayachen",
    name: "Maya Chen",
    avatar: "",
    bio: "Frontend engineer obsessed with motion design and component systems. Building the next generation of design tools.",
    role: "Frontend Engineer · React & Animation Specialist",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/mayachen" },
      { label: "Website", url: "https://mayachen.dev" },
    ],
    joinedAt: "2026-02-10",
  },
  {
    id: "omar",
    username: "omarfarooq",
    name: "Omar Farooq",
    avatar: "",
    bio: "Full-stack developer building collaborative developer tools. Interested in real-time systems and distributed architectures.",
    role: "Full-Stack Developer · DevTools & Real-Time Systems",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/omarfarooq" },
    ],
    joinedAt: "2026-03-05",
  },
  {
    id: "sara",
    username: "saraokonkwo",
    name: "Sara Okonkwo",
    avatar: "",
    bio: "Data scientist and creative developer. Turning complex datasets into interactive visual stories.",
    role: "Data Visualization Engineer · ML & Interactive Graphics",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/saraokonkwo" },
      { label: "Website", url: "https://saraokonkwo.dev" },
    ],
    joinedAt: "2026-01-28",
  },
];
