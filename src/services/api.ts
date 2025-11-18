// src/services/api.ts
import axios from 'axios';
import { Quiz, Student } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Quiz API
export const quizAPI = {
  save: async (quiz: Partial<Quiz>): Promise<{ success: boolean; quizId: string; quiz?: any }> => {
    try {
      const response = await api.post('/quiz/save', quiz);
      return response.data;
    } catch (error) {
      console.error('Quiz save error:', error);
      throw error;
    }
  },

  share: async (shareData: {
    quizId: string;
    recipients: string[];
    message?: string;
    expiresInHours?: number;
  }) => {
    try {
      const response = await api.post('/quiz/share', shareData);
      return response.data;
    } catch (error) {
      console.error('Quiz share error:', error);
      throw error;
    }
  },

  getAll: async (): Promise<Quiz[]> => {
    try {
      const response = await api.get('/quiz/all');
      return response.data;
    } catch (error) {
      console.error('Get all quizzes error:', error);
      throw error;
    }
  },

  delete: async (quizId: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Delete quiz error:', error);
      throw error;
    }
  },

  getAllWithStats: async (): Promise<any[]> => {
    try {
      const response = await api.get('/quiz/results/all');
      return response.data;
    } catch (error) {
      console.error('Get quiz stats error:', error);
      throw error;
    }
  },

  getResults: async (quizId: string, live: boolean = false) => {
    try {
      const response = await api.get(`/quiz/${quizId}/results${live ? '?live=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Get quiz results error:', error);
      throw error;
    }
  },
};

// Students API
export const studentsAPI = {
  upload: async (students: Student[]) => {
    try {
      const response = await api.post('/students/upload', { students });
      return response.data;
    } catch (error) {
      console.error('Upload students error:', error);
      throw error;
    }
  },

  getAll: async (): Promise<Student[]> => {
    try {
      const response = await api.get('/students/all');
      return response.data;
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  },

  delete: async (studentId: string) => {
    try {
      const response = await api.delete(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },
};

// Folders API
export const foldersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/folders');
      return response.data.folders;
    } catch (error) {
      console.error('Get folders error:', error);
      throw error;
    }
  },

  create: async (folderData: { name: string; description?: string; color?: string }) => {
    try {
      const response = await api.post('/folders', folderData);
      return response.data.folder;
    } catch (error) {
      console.error('Create folder error:', error);
      throw error;
    }
  },

  update: async (folderId: string, folderData: { name?: string; description?: string; color?: string }) => {
    try {
      const response = await api.put(`/folders/${folderId}`, folderData);
      return response.data.folder;
    } catch (error) {
      console.error('Update folder error:', error);
      throw error;
    }
  },

  delete: async (folderId: string) => {
    try {
      const response = await api.delete(`/folders/${folderId}`);
      return response.data;
    } catch (error) {
      console.error('Delete folder error:', error);
      throw error;
    }
  },
};

// Bookmarks API - FIXED: Handle different response structure
export const bookmarksAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/bookmarks');
      // Handle both response structures
      return response.data.bookmarks || response.data || [];
    } catch (error) {
      console.error('Get bookmarks error:', error);
      return []; // Return empty array instead of throwing
    }
  },

  create: async (bookmarkData: any) => {
    try {
      const response = await api.post('/bookmarks', bookmarkData);
      return response.data.bookmark || response.data;
    } catch (error) {
      console.error('Create bookmark error:', error);
      throw error;
    }
  },

  delete: async (bookmarkId: string) => {
    try {
      const response = await api.delete(`/bookmarks/${bookmarkId}`);
      return response.data;
    } catch (error) {
      console.error('Delete bookmark error:', error);
      throw error;
    }
  },
};

export default api;