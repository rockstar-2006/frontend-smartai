// src/services/api.ts
import axios from 'axios';
import { Quiz, Student } from '@/types';

// Resolve base URL from env; default to localhost (including /api so front-end requests match backend)
const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
console.debug('RAW VITE_API_URL:', import.meta.env.VITE_API_URL);
console.debug('API base resolved to ->', RAW_API_BASE);

// Normalize base: remove trailing slash(es)
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor: make it easy to return response.data directly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Helpful console output while debugging
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== QUIZ API =====
export const quizAPI = {
  save: async (quiz: Partial<Quiz>) => {
    const res = await api.post('/quiz/save', quiz);
    return res.data;
  },

  share: async (shareData: { quizId: string; recipients: string[]; message?: string; expiresInHours?: number }) => {
    const res = await api.post('/quiz/share', shareData);
    return res.data;
  },

  getAll: async (): Promise<Quiz[]> => {
    const res = await api.get('/quiz/all');
    // If backend wraps the array as { quizzes: [...] } return either
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.quizzes)) return res.data.quizzes;
    // sometimes backend may return { data: [...] }
    if (Array.isArray(res.data?.data)) return res.data.data;
    // otherwise try to return an empty array to avoid crashes
    return [];
  },

  delete: async (quizId: string) => {
    const res = await api.delete(`/quiz/${quizId}`);
    return res.data;
  },

  getAllWithStats: async () => {
    const res = await api.get('/quiz/results/all');
    return res.data || [];
  },

  getResults: async (quizId: string, live: boolean = false) => {
    const res = await api.get(`/quiz/${quizId}/results${live ? '?live=true' : ''}`);
    return res.data;
  },
};

// ===== STUDENTS API =====
export const studentsAPI = {
  upload: async (students: Student[]) => {
    const res = await api.post('/students/upload', { students });
    return res.data;
  },

  getAll: async (): Promise<Student[]> => {
    const res = await api.get('/students/all');
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.students)) return res.data.students;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  },

  delete: async (studentId: string) => {
    const res = await api.delete(`/students/${studentId}`);
    return res.data;
  },
};

// ===== FOLDERS API =====
export const foldersAPI = {
  getAll: async () => {
    const res = await api.get('/folders');
    return res.data?.folders || res.data || [];
  },

  create: async (folderData: { name: string; description?: string; color?: string }) => {
    const res = await api.post('/folders', folderData);
    return res.data?.folder || res.data;
  },

  update: async (folderId: string, folderData: { name?: string; description?: string; color?: string }) => {
    const res = await api.put(`/folders/${folderId}`, folderData);
    return res.data?.folder || res.data;
  },

  delete: async (folderId: string) => {
    const res = await api.delete(`/folders/${folderId}`);
    return res.data;
  },
};

// ===== BOOKMARKS API =====
export const bookmarksAPI = {
  getAll: async () => {
    try {
      const res = await api.get('/bookmarks');
      // handle both array or wrapped object
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.bookmarks)) return res.data.bookmarks;
      if (Array.isArray(res.data?.data)) return res.data.data;
      // fallback: if res.data is an object with keys, try to extract plausible array
      return [];
    } catch (error) {
      console.error('Get bookmarks error (returning empty array):', error);
      return [];
    }
  },

  create: async (bookmarkData: any) => {
    const res = await api.post('/bookmarks', bookmarkData);
    return res.data?.bookmark || res.data;
  },

  delete: async (bookmarkId: string) => {
    const res = await api.delete(`/bookmarks/${bookmarkId}`);
    return res.data;
  },
};

export default api;
