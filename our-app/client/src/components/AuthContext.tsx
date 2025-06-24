import React, { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserData {
  userName: string;
  email: string;
  role?: string;
  [key: string]: any; // Extendable
}

interface AuthContextType {
  userId: string | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  userData: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // Load userId from localStorage and fetch userData
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    }
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const res = await axios.get<UserData>(`/api/users/${uid}/dashboard`);
      setUserData(res.data);
    } catch (err: any) {
      console.error('Error fetching user data:', err.response?.data?.message || err.message);
    }
  };

  const checkInitialSetupAndRedirect = (data: any) => {
    const basicQuizDone = data.QuizId && data.QuizId.some((q: any) => q.quizId.toLowerCase().includes('basic'));
    const assessmentDone = data.knownConcepts && data.targetConcept && data.language;
    const customQuizDone = data.CustomQuizId && data.CustomQuizId.length > 0;
    const pathChosen = data.Courses && data.Courses.filter((c: any) => c.Status === 'pending').length > 0;
    if (!data.language || !basicQuizDone || !assessmentDone || !customQuizDone || !pathChosen) {
      navigate('/initial-setup');
    } else {
      navigate('/dashboard');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post<{ userId: string }>('/api/login', {
        email,
        password,
      });
      const userId = res.data.userId;
      setUserId(userId);
      localStorage.setItem('userId', userId);
      const dashRes = await axios.get(`/api/users/${userId}/dashboard`);
      setUserData(dashRes.data);
      checkInitialSetupAndRedirect(dashRes.data);
    } catch (err: any) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const signup = async (userName: string, email: string, password: string) => {
    try {
      const res = await axios.post<{ userId: string }>('/api/signup', {
        userName,
        email,
        password,
      });
      
    } catch (err: any) {
      alert('Signup failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    setUserId(null);
    setUserData(null);
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, userData, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
