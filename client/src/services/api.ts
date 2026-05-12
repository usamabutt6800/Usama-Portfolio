// src/services/api.ts
// All API call functions organized by resource

import api from '@/api/axios';
import { ContactForm } from '@/types';

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data: FormData) => api.put('/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params?: { category?: string; featured?: boolean }) =>
    api.get('/projects', { params }),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: FormData) => api.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: FormData) => api.put(`/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data: object) => api.post('/skills', data),
  update: (id: string, data: object) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// ─── Experience ───────────────────────────────────────────────────────────────
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data: object) => api.post('/experience', data),
  update: (id: string, data: object) => api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogsAPI = {
  getAll: () => api.get('/blogs'),
  getOne: (slug: string) => api.get(`/blogs/${slug}`),
  create: (data: FormData) => api.post('/blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (slug: string, data: FormData) => api.put(`/blogs/${slug}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data: ContactForm) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
  reply: (id: string, replyText: string) => api.post(`/contact/${id}/reply`, { replyText }),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  create: (data: object) => api.post('/testimonials', data),
  update: (id: string, data: object) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  setup: (name: string) => api.post('/auth/setup', { name }),
};