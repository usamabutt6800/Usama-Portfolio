// src/utils/index.ts
// Helper utility functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Tailwind class merger (avoids conflicts) ─────────────────────────────────
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// ─── Format date ──────────────────────────────────────────────────────────────
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// ─── Calculate duration between two dates ────────────────────────────────────
export const getDuration = (start: string, end?: string | null): string => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12
    + (endDate.getMonth() - startDate.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} yr${years !== 1 ? 's' : ''}`;
  return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo`;
};

// ─── Truncate text ────────────────────────────────────────────────────────────
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// ─── Estimate read time ───────────────────────────────────────────────────────
export const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// ─── Debounce ─────────────────────────────────────────────────────────────────
export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T, delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// ─── Random number in range ───────────────────────────────────────────────────
export const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

// ─── Get initials from name ───────────────────────────────────────────────────
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
