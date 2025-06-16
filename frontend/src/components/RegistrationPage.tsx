/*AUTHOR-MANDA RANI(created on 14/06/25)*/
/*Modified by Nakshatra Bhandary on 16/6/25 to update UI and routes/navigation */
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 
const RegistrationPage: React.FC = () => {
  useEffect(() => {
  // Disable scrolling
  document.body.style.overflow = 'hidden';

  return () => {
    // Re-enable scrolling on unmount
    document.body.style.overflow = 'auto';
  };
}, []);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    alert('Registration successful!');
    setError('');
    navigate('/');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Register to EduAssess</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

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

        <input
          type="password"
          placeholder="Confirm Password"
          className="login-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="login-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;