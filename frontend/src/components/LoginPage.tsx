/*AUTHOR-MANDA RANI(created on 14/06/25)*/
/*Modified by Nakshatra Bhandary (16/6/26) and (17/6/25) to connect to the backend*/
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      // Save token and redirect
      localStorage.setItem('token', data.token);
      setError('');
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
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