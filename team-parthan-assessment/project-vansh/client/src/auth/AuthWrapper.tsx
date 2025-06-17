import React, { useState } from 'react';
import AuthComponent from './AuthComponent';
import { login, signup } from '../services/authService';
// import { useAuth } from '../context/AuthContext'; if using auth context

const AuthWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
//   const { userlogin } = useAuth(); // If using auth context

  const handleLogin = async (formData: { email: string; password: string }) => {
    const { token, userId } = await login(formData);
    // Store the token (in localStorage or cookies)
    localStorage.setItem('token', token);
    localStorage.setItem('id',userId);
    // If using auth context:
    // userlogin({ id: userId, token });
  };

  const handleSignup = async (formData: { email: string; password: string; confirmPassword: string;  name: string }) => {
    const { token, userId } = await signup(formData);
    // Store the token
    localStorage.setItem('token', token);
    localStorage.setItem('id',userId);
    // If using auth context:
    // userlogin({ id: userId, token });
  };

  return (
    <AuthComponent
      onLogin={handleLogin}
      onSignup={handleSignup}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

export default AuthWrapper;