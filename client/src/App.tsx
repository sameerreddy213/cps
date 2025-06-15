import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoutes from "./components/ProtectedRoutes";
import QuizPage from "./pages/QuizPage";
import QuizSelectPage from "./pages/QuizSelectPage";
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;