// Created by Nakshatra Bhandary 23/6/25
import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const sendCode = async () => {
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Code sent to your email');
      setStep('code');
    } else {
      setMessage(data.message);
    }
  };

  const verifyCode = async () => {
    const res = await fetch('http://localhost:5000/api/auth/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep('reset');
    } else {
      setMessage(data.message);
    }
  };

  const resetPassword = async () => {
    const res = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Password reset successfully!');
      setTimeout(() => onClose(), 2000);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Forgot Password</h3>

        {step === 'email' && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendCode}>Send Code</button>
          </>
        )}

        {step === 'code' && (
          <>
            <input
              type="text"
              placeholder="Enter the code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={verifyCode}>Verify Code</button>
          </>
        )}

        {step === 'reset' && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}

        {message && <p>{message}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
