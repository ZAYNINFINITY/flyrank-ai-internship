export type ExhibitionId = string;

export type Exhibition = {
  id: ExhibitionId;
  developerId: string;
  title: string;
  description: string;
  exhibitIds: string[];
  featured: boolean;
  publishedAt: string;
};
