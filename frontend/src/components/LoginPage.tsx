/*AUTHOR-MANDA RANI(created on 14/06/25)*/
/*Modified by Nakshatra Bhandary (16/6/26)*/
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  useEffect(() => {
  // Disable scrolling
  document.body.style.overflow = 'hidden';

  return () => {
    // Re-enable scrolling on unmount
    document.body.style.overflow = 'auto';
  };
}, []);

  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    if (email === 'user@example.com' && password === 'password123') {
      alert('Login successful!');
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login to Edu Access</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button">
          Login
        </button>
        <p style={{ fontSize: '0.9rem' }}>
  Don't have an account?{' '}
  <a href="/register" style={{ color: '#6366F1' }}>Register here</a>
</p>

      </form>
    </div>
  );
};

export default LoginPage;