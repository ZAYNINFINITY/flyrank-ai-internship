import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExhibitToolResult, isExhibitArray } from "./exhibit-tool-result";
import type { Exhibit } from "@/lib/types/exhibit";

const exhibits: Exhibit[] = [
  {
    id: "e1",
    title: "POS-it",
    collectionIds: ["experiments"],
    tagline: "A sticky-note clone",
    description: "Turn sticky notes into an API.",
    media: [{ type: "image", src: "/pos-it.png", alt: "POS-it screenshot" }],
    artifacts: [{ id: "a1", label: "Source", description: "GitHub repo" }],
    technologies: ["React", "Node.js"],
    links: [],
    curatorNotes: "Shipped in a weekend.",
    developerId: "test-dev",
    year: "2026",
    featured: false,
  },
];

describe("ExhibitToolResult", () => {
  it("renders the exhibit title and collection", () => {
    render(<ExhibitToolResult exhibits={exhibits} />);
    expect(screen.getByRole("heading", { name: "POS-it" })).toBeInTheDocument();
    expect(screen.getByText("experiments")).toBeInTheDocument();
  });

  it("renders an empty-state message when no exhibits match", () => {
    render(<ExhibitToolResult exhibits={[]} />);
    expect(screen.getByText(/no exhibits matched/i)).toBeInTheDocument();
  });

  it("links each exhibit to its museum route", () => {
    render(<ExhibitToolResult exhibits={exhibits} />);
    const link = screen.getByRole("link", { name: /POS-it/ });
    expect(link).toHaveAttribute("href");
    expect(link.getAttribute("href")).toContain("e1");
  });

  it("guards exhibit output with isExhibitArray", () => {
    expect(isExhibitArray(exhibits)).toBe(true);
    expect(isExhibitArray(null)).toBe(false);
    expect(isExhibitArray([{ id: "x" }])).toBe(false);
    expect(isExhibitArray("nope")).toBe(false);
  });
});
