import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.tsx";
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoutes from "./components/ProtectedRoutes";
import QuizPage from "./pages/QuizPage";
import QuizSelectPage from "./pages/QuizSelectPage";
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExploreTopicPage from "./pages/ExploreTopicPage";
import RecommendationPage from "./pages/RecommendationPage";
import AppEntry from "./routes/AppEntry";
import DiscussionDetailPage from "./pages/DiscussionDetailPage";
import Discuss from './pages/DiscussionPage.tsx';
import StudentDetailPage from './pages/StudentDetailPage.tsx';
import PlaygroundPage from './pages/PlaygroundPage.tsx';

// Inside <Routes>...



function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 pt-5 mt-3">
          <Routes>
            <Route path="/" element={<AppEntry />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            
            {/* Public routes go here */}
            {/* Protected routes go here */}
            <Route element={<ProtectedRoutes/>}>
              <Route path="/educator/student/:username" element={<StudentDetailPage />} />
              <Route path="/student/:username" element={<StudentDetailPage />} />
              <Route path="/discuss/:id" element={<DiscussionDetailPage />} />
              <Route path="/discuss" element={< Discuss/>} />
              <Route path="/recommend" element={<RecommendationPage />} />
              <Route path="/explore/:topic" element={<ExploreTopicPage />} />
              <Route path="/dashboard/:username" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quiz/:topic" element={<QuizPage />} />
              <Route path="/quiz-select" element={<QuizSelectPage/>} />
              <Route path="/playground" element={<PlaygroundPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;