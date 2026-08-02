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

export type ExhibitCollection = "infrastructure" | "visual-design" | "experiments" | "journey";

export type Exhibit = {
  id: ExhibitId;
  title: string;
  tagline: string;
  description: string;
  media: ExhibitMedia[];
  artifacts: ExhibitArtifact[];
  curatorNotes: string;
  collection: ExhibitCollection;
  developer: string;
  year: string;
};
