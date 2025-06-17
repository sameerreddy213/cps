// src/services/authService.ts
import api from './api';

export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const signup = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};