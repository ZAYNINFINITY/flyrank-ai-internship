export type Project = {
  id: string;
  title: string;
  story: string;
  stack: string[];
  image: string;
  imagePosition: "left" | "right";
  isLightest?: boolean;
};

export type Exhibit = {
  username: string;
  name: string;
  role: string;
  avatar: string;
  projects: Project[];
};

export const exhibits: Record<string, Exhibit> = {
  zayn: {
    username: "zayn",
    name: "Zain Ul Abideen",
    role: "CS student @ PAF-IAST · MERN Stack Developer",
    avatar: "/images/avatar.png",
    projects: [
      {
        id: "pos-it",
        title: "POS-it",
        story:
          "Professional offline point-of-sale system built with Electron, React, and SQLite. Featuring real-time inventory, multi-user support, PDF invoicing, and auto-updates. Currently in production-grade development with a live pharmacy pilot.",
        stack: ["Electron", "React", "SQLite"],
        image: "/images/pos-it.png",
        imagePosition: "left",
      },
      {
        id: "collaborative-workspace",
        title: "Collaborative Workspace",
        story:
          "Full-stack MERN collaboration platform with live chat via Socket.io, multi-user document editing, Kanban task boards, and OAuth 2.0 authentication. Built to handle concurrent users with real-time event broadcasting.",
        stack: ["MERN", "Socket.io", "OAuth 2.0"],
        image: "",
        imagePosition: "right",
      },
      {
        id: "zse-store",
        title: "ZSE Store",
        story:
          "Live e-commerce site for a real sanitary and electric products business. Built with a full product catalog, brand filtering, WhatsApp order integration, and a clean responsive UI.",
        stack: ["React", "Node.js", "MySQL"],
        image: "/images/zse-store.png",
        imagePosition: "left",
      },
      {
        id: "scrollstreak",
        title: "ScrollStreak",
        story:
          "Chrome and Edge browser extension that tracks Instagram Reels watched, shows a live counter overlay, and lets you challenge friends to duels with leaderboards and weekly Wrapped stats. Published on the Microsoft Edge Add-ons store.",
        stack: ["Chrome Extension", "JavaScript"],
        image: "/images/scrollstreak.png",
        imagePosition: "right",
        isLightest: true,
      },
    ],
  },
};
