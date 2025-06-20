import React from 'react';
import { Button } from '../styles/button';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen d-flex flex-column justify-content-center align-items-center bg-light text-center p-4">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead text-muted mb-4">Oops! The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );
};

export default NotFound;