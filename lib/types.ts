export type Experience = {
  id: number;
  position: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
};

export type Profile = {
  id: number;
  userId: number;
  slug: string;
  firstName: string;
  lastName: string;
  headline: string;
  currentCompany: string;
  bio: string;
  location: string;
  publicEmail: string;
  website: string;
  linkedin: string;
  github: string;
  updatedAt: string;
};

export type ProfileWithExperience = {
  profile: Profile;
  experiences: Experience[];
};

export type ExperienceInput = {
  position: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};
