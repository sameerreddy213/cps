// src/services/api.ts
import { User } from '../types';

// Mock MongoDB operations (replace with actual API calls)
export const mockAPI = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@example.com' && password === 'password') {
      return { id: '1', name: 'John Doe', email };
    }
    throw new Error('Invalid credentials');
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: Date.now().toString(), name, email };
  }
};

// When you connect to real MongoDB, replace mockAPI with:
export const realAPI = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  }
};