// src/types/index.ts
// Central type definitions for the entire portfolio

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface Profile {
  _id: string;
  name: string;
  title: string;
  roles: string[];
  bio: string;
  shortBio: string;
  email: string;
  phone: string;
  location: string;
  avatar: { url: string; publicId: string };
  resume: { url: string; publicId: string };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
    website: string;
  };
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    clientsSatisfied: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  settings: {
    availableForWork: boolean;
    showBlog: boolean;
    primaryColor: string;
  };
}

// ─── Project ──────────────────────────────────────────────────────────────────
export type ProjectCategory = 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'other' | 'all';
export type ProjectStatus = 'completed' | 'in-progress' | 'planned';

export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: { url: string; publicId: string };
  images: Array<{ url: string; publicId: string }>;
  techStack: string[];
  category: ProjectCategory;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill ────────────────────────────────────────────────────────────────────
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'languages' | 'other';

export interface Skill {
  _id: string;
  name: string;
  level: number;
  category: SkillCategory;
  icon: string;
  color: string;
  order: number;
}

// ─── Experience ───────────────────────────────────────────────────────────────
export type ExperienceType = 'full-time' | 'part-time' | 'freelance' | 'internship' | 'contract';

export interface Experience {
  _id: string;
  company: string;
  position: string;
  description: string;
  responsibilities: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  companyLogo: { url: string; publicId: string };
  techUsed: string[];
  type: ExperienceType;
  order: number;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string; publicId: string };
  tags: string[];
  category: string;
  published: boolean;
  views: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────
export interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  message: string;
  avatar: { url: string; publicId: string };
  rating: number;
  isVisible: boolean;
  order: number;
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactForm {
  _id: string;
  isRead: boolean;
  reply: string;
  repliedAt: string;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── UI ───────────────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
