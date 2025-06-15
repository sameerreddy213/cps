import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoutes from "./components/ProtectedRoutes";
import QuizPage from "./pages/QuizPage";
import QuizSelectPage from "./pages/QuizSelectPage";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar'; // Import the Navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* Render Navbar at the top level */}
      <div style={{ paddingTop: '80px', width: '100%', display: 'flex', justifyContent: 'center' }}> {/* Add padding to account for fixed navbar height, and center content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected routes go here */}
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard/:username" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:topic" element={<QuizPage />} />
            <Route path="/quiz-select" element={<QuizSelectPage/>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;