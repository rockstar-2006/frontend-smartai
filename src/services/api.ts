// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { Quiz, Student } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// axios instance used across the app
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // send cookies (important for cookie auth)
});

/* ----------------------
   AUTH
   ---------------------- */
export const authAPI = {
  register: async (payload: { name: string; email: string; password: string; role?: string }) => {
    const resp = await api.post('/auth/register', payload);
    return resp.data;
  },

  login: async (payload: { email: string; password: string }) => {
    const resp = await api.post('/auth/login', payload);
    return resp.data;
  },

  me: async () => {
    const resp = await api.get('/auth/me');
    return resp.data;
  },

  logout: async () => {
    const resp = await api.post('/auth/logout');
    return resp.data;
  }
};

/* ----------------------
   QUIZ
   ---------------------- */
export const quizAPI = {
  save: async (quiz: Partial<Quiz>) => {
    const resp = await api.post('/quiz/save', quiz);
    return resp.data;
  },

  update: async (quizId: string, quiz: Partial<Quiz>) => {
    const resp = await api.put(`/quiz/${quizId}`, quiz);
    return resp.data;
  },

  delete: async (quizId: string) => {
    const resp = await api.delete(`/quiz/${quizId}`);
    return resp.data;
  },

  getAll: async (): Promise<Quiz[]> => {
    const resp = await api.get('/quiz/all');
    return resp.data;
  },

  // aggregated stats endpoint (teacher dashboard cards)
  getAllWithStats: async (): Promise<any[]> => {
    const resp = await api.get('/quiz/results/all');
    return resp.data;
  },

  // teacher results endpoint. pass live=true to compute on-the-fly scoring (includes in-progress attempts)
  getResults: async (quizId: string, live: boolean = false): Promise<{ quiz: any; attempts: any[] }> => {
    const resp = await api.get(`/quiz/${quizId}/results${live ? '?live=true' : ''}`);
    return resp.data;
  },

  // share endpoint - recipients array or comma separated string allowed
  share: async (payload: { quizId: string; recipients?: string[] | string; message?: string; expiresInHours?: number }) => {
    const resp = await api.post('/quiz/share', payload);
    return resp.data;
  },

  // download Excel (summary/detailed). returns blob
  downloadResults: async (quizId: string, detailed: boolean = false): Promise<Blob> => {
    const resp = await api.get(`/quiz/${quizId}/results/download${detailed ? '?detailed=true' : ''}`, {
      responseType: 'blob'
    });
    return resp.data;
  }
};

/* ----------------------
   STUDENTS
   ---------------------- */
export const studentsAPI = {
  upload: async (students: Student[]) => {
    const resp = await api.post('/students/upload', { students });
    return resp.data;
  },

  getAll: async (): Promise<Student[]> => {
    const resp = await api.get('/students/all');
    return resp.data;
  },

  delete: async (studentId: string) => {
    const resp = await api.delete(`/students/${studentId}`);
    return resp.data;
  }
};

/* ----------------------
   FOLDERS
   ---------------------- */
export const foldersAPI = {
  getAll: async () => {
    const resp = await api.get('/folders');
    return resp.data.folders;
  },

  create: async (folderData: { name: string; description?: string; color?: string }) => {
    const resp = await api.post('/folders', folderData);
    return resp.data.folder;
  },

  update: async (folderId: string, folderData: { name?: string; description?: string; color?: string }) => {
    const resp = await api.put(`/folders/${folderId}`, folderData);
    return resp.data.folder;
  },

  delete: async (folderId: string) => {
    const resp = await api.delete(`/folders/${folderId}`);
    return resp.data;
  }
};

/* ----------------------
   BOOKMARKS
   ---------------------- */
export const bookmarksAPI = {
  getAll: async () => {
    const resp = await api.get('/bookmarks');
    return resp.data.bookmarks;
  },

  create: async (bookmarkData: any) => {
    const resp = await api.post('/bookmarks', bookmarkData);
    return resp.data.bookmark;
  },

  delete: async (bookmarkId: string) => {
    const resp = await api.delete(`/bookmarks/${bookmarkId}`);
    return resp.data;
  }
};

export default api;
