export type DeveloperId = string;

export type DeveloperLink = {
  label: string;
  url: string;
};

export type Developer = {
  id: DeveloperId;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  socialLinks: DeveloperLink[];
  joinedAt: string;
};
