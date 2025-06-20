/*Created by Nakshatra Bhandary on 19/6/25*/
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface TokenPayload {
  exp: number;
  userId: string;
  email: string;
}

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem('token');
      alert('Your session has expired. Please log in again.');
      navigate('/'); // SPA navigation, no reload
    };

    const setAutoLogout = (token: string) => {
      const decoded = jwtDecode<TokenPayload>(token);
      const expiryTime = decoded.exp * 1000;
      const timeout = expiryTime - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          logout();
        }, timeout);
      } else {
        logout();
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        setAutoLogout(token);
      } catch (e) {
        logout();
      }
    } else {
      navigate('/');
    }
  }, [navigate]);
};