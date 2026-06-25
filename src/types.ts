/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Skill {
  name: string;
  level: number; // 0 to 100 for percentage progress
  details?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: "AI" | "Software" | "Game" | "Web";
  features: string[];
  techStack: string[];
  launchUrl?: string;
  githubUrl?: string;
}

export interface Innovation {
  title: string;
  description: string;
  detailedPoints: string[];
  techStack: string[];
}

export interface Achievement {
  title: string;
  description: string;
  category: "academic" | "coding" | "creativity";
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  category: "early" | "development" | "ai" | "future";
  icon: string;
  skills?: string[];
  metrics?: { label: string; value: string }[];
}

export interface PersonalInfo {
  name: string;
  fullName: string;
  title: string;
  role: string;
  tagline: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  github: string;
  location: string;
  education: {
    school: string;
    grade: string;
    achievements: string;
  };
  careerGoal: {
    role: string;
    firm: string;
    description: string;
  };
  bio: string;
}


