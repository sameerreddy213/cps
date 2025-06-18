import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No token found.");
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else if (response.status === 403) {
          setError("Invalid or expired token.");
          setIsValid(false);
        } else {
          setError("Unknown error verifying token.");
          setIsValid(false);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setError("Network or server error.");
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isValid) {
    // Optional: clear invalid token to prevent looping
    localStorage.removeItem('token');

    // Optional: show an error toast or message before redirect
    alert(error || "Unauthorized access");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
//Corrected by @omkar