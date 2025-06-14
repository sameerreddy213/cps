/* AUTHOR - SHREYAS MENE (UPDATED WITH LOGIN + REGISTER ROUTES BY RANI) */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Chatbot from './components/Chatbot';
import TopicSelector from './components/TopicSelector';
import AssessmentDisplay from './components/AssessmentDisplay';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import './App.css';

interface Topic {
  id: number;
  name: string;
  category: string;
}

const AppContent = () => {
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [shouldGenerateAssessment, setShouldGenerateAssessment] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleTopicSelect = (topics: Topic[]) => {
    setSelectedTopics(topics);
    setShouldGenerateAssessment(false);
  };

  const handleGenerateAssessment = () => {
    setShouldGenerateAssessment(true);
  };

  const handleAssessmentGenerated = () => {
    setShouldGenerateAssessment(false);
  };

  return (
    <div className="App">
      <ThemeToggle />
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1>
              <img
                src="/graduation-cap.svg"
                alt="EduAssess Logo"
                className="header-icon"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/vite.svg';
                }}
              />
              EduAssess
            </h1>
          </div>
          {!isAuthPage && (
            <div className="header-right">
              <button className="login-button" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          )}
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div className="content-container">
                  <TopicSelector
                    onTopicSelect={handleTopicSelect}
                    onGenerateAssessment={handleGenerateAssessment}
                  />
                  <AssessmentDisplay
                    selectedTopics={selectedTopics}
                    shouldGenerateAssessment={shouldGenerateAssessment}
                    onAssessmentGenerated={handleAssessmentGenerated}
                  />
                </div>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </main>

        {!isAuthPage && <Chatbot />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
export default App; 