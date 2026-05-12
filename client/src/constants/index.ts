// src/constants/index.ts
// All static data used across the app

import { NavLink } from '@/types';

// ─── Navigation Links ─────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: 'Home',       path: '/' },
  { label: 'About',      path: '/about' },
  { label: 'Projects',   path: '/projects' },
  { label: 'Skills',     path: '/skills' },
  { label: 'Experience', path: '/experience' },
  { label: 'Blog',       path: '/blog' },
  { label: 'Contact',    path: '/contact' },
];

// ─── Project category filters ─────────────────────────────────────────────────
export const PROJECT_CATEGORIES = [
  { label: 'All',       value: 'all' },
  { label: 'Full Stack', value: 'fullstack' },
  { label: 'Frontend',  value: 'frontend' },
  { label: 'Backend',   value: 'backend' },
  { label: 'Mobile',    value: 'mobile' },
  { label: 'AI / ML',   value: 'ai' },
  { label: 'Other',     value: 'other' },
];

// ─── Skill categories ─────────────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  { label: 'Frontend',  value: 'frontend',  color: '#00f5ff' },
  { label: 'Backend',   value: 'backend',   color: '#7c3aed' },
  { label: 'Database',  value: 'database',  color: '#f59e0b' },
  { label: 'DevOps',    value: 'devops',    color: '#10b981' },
  { label: 'Tools',     value: 'tools',     color: '#ef4444' },
  { label: 'Languages', value: 'languages', color: '#3b82f6' },
];

// ─── Tech stack icons map (name → react-icons class) ─────────────────────────
export const TECH_COLORS: Record<string, string> = {
  'React':       '#61DAFB',
  'Node.js':     '#339933',
  'MongoDB':     '#47A248',
  'Express':     '#ffffff',
  'TypeScript':  '#3178C6',
  'JavaScript':  '#F7DF1E',
  'Tailwind':    '#06B6D4',
  'Next.js':     '#ffffff',
  'Vue':         '#4FC08D',
  'Python':      '#3776AB',
  'PostgreSQL':  '#4169E1',
  'Docker':      '#2496ED',
  'Git':         '#F05032',
  'AWS':         '#FF9900',
  'Firebase':    '#FFCA28',
  'GraphQL':     '#E10098',
  'Redux':       '#764ABC',
};

// ─── Marquee tech stack for hero section ──────────────────────────────────────
export const MARQUEE_ITEMS = [
  'React.js', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript',
  'Tailwind CSS', 'Next.js', 'Redux', 'REST API', 'GraphQL',
  'Docker', 'AWS', 'Git', 'PostgreSQL', 'Firebase',
];

// ─── Animation variants for Framer Motion ────────────────────────────────────
export const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const STAGGER_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── API base URL ─────────────────────────────────────────────────────────────
export const API_URL = import.meta.env.VITE_API_URL || '/api';