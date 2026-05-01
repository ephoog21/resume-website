// data/profile.ts
// Typed accessor for the generated profile content.
//
// To update the site content:
//   1. Edit data/source/ed_hoogasian_resume_database.json (or rebuild it from
//      the canonical .sqlite/.xlsx workbook).
//   2. Run `npm run build:data`. This regenerates data/profile.json.
//   3. The site rebuilds at deploy time. No DB, no API routes.

import profileJson from "./profile.json";

export type Achievement = {
  id: string;
  text: string;
  metric: string;
  skillTags: string[];
  bestFor: string[];
};

export type Experience = {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
  location: string;
  description: string;
  domains: string[];
  achievements: Achievement[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
  startLabel: string;
  endLabel: string;
  description: string;
};

export type Skill = {
  name: string;
  category: string;
  detail: string;
  evidence: string;
  roleIds: string[];
};

export type SkillCluster = {
  cluster: string;
  skills: Skill[];
};

export type CaseStudy = {
  id: string;
  title: string;
  company: string;
  roleId: string;
  problem: string;
  actions: string;
  impact: string;
  keywords: string[];
};

export type Highlight = {
  id: string;
  title: string;
  metric: string;
  context: string;
  company: string;
  roleTitle: string;
  skillTags: string[];
  softSkills: string[];
  problem: string;
  approach: string;
  outcome: string;
};

export type RoleFit = {
  id: string;
  label: string;
  headline: string;
  targetRoles: string[];
  summary: string;
  keywords: string[];
  proofIds: string[];
  proofs: { id: string; text: string; metric: string; company: string }[];
  caseStudyIds: string[];
};

export type ProfileData = {
  generatedAt: string;
  profile: {
    name: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    headline: string;
    summary: string;
    differentiators: string[];
    personalNotes: string;
  };
  highlights: Highlight[];
  experience: Experience[];
  education: Education[];
  skillClusters: SkillCluster[];
  caseStudies: CaseStudy[];
  roleFit: RoleFit[];
  atsBank: { keyword_group: string; keywords: string; usage: string }[];
};

export const profile = profileJson as unknown as ProfileData;
