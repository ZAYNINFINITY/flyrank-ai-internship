export type ExhibitId = string;

export type ExhibitMedia = {
  type: "image" | "video" | "embed";
  src: string;
  alt: string;
};

export type ExhibitArtifact = {
  id: string;
  label: string;
  description: string;
};

export type ExhibitLink = {
  label: string;
  url: string;
  type: "github" | "demo" | "video" | "other";
};

export type Exhibit = {
  id: ExhibitId;
  title: string;
  tagline: string;
  description: string;
  developerId: string;
  media: ExhibitMedia[];
  artifacts: ExhibitArtifact[];
  technologies: string[];
  links: ExhibitLink[];
  curatorNotes: string;
  collectionIds: string[];
  year: string;
  featured: boolean;
};
