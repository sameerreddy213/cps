import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import LearnedConceptCard from "../components/LearnedConceptCard";
import QuizCard from "../components/QuizCard";
import { useEffect, useState } from "react";
import axios from "axios";
// Removed Recharts import as it's not being used in the provided code logic
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface QuizHistoryEntry {
  topic: string;
  score: number;
  mastery: number;
  createdAt: string;
}

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const username = useUserStore((state) => state.username);
  const mastery = useUserStore((state) => state.mastery);
  const progress = useUserStore((state) => state.progress);
  const recommendations = useUserStore((state) => state.recommendations);

  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearProfile();
    navigate("/");
  };

  const handleTakeQuiz = (selectedTopic: string) => {
    navigate(`/quiz/${encodeURIComponent(selectedTopic)}`);
  };

  // ✅ Fetch quiz history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/quiz-history/${username}`);
        // Ensure we always have an array, even if empty
        setQuizHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch quiz history", err);
        setQuizHistory([]); // Set empty array on error
      }
    };

    if (username) fetchHistory();
  }, [username]);

  return (
    <div className="page-container">
      <h2>Welcome, {username}!</h2>
      <p>This is your personalized dashboard.</p>

      {/* Mastery Scores */}
      <div className="dashboard-section">
        <h3>Mastery Levels</h3>
        {Object.keys(mastery).length === 0 ? (
          <p>No mastery data available.</p>
        ) : (
          <ul className="dashboard-list">
            {Object.entries(mastery).map(([topic, score]) => (
              <li key={topic}>
                {topic}: {(1 - score).toFixed(2)} confidence
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Topics Learned */}
      <div className="dashboard-section">
        <h3>Topics Learned</h3>
        <div className="cards-container">
          {progress.length === 0 ? (
            <p>No topics marked as completed.</p>
          ) : (
            progress.map((topic) => (
              <LearnedConceptCard key={topic} title={topic} />
            ))
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="dashboard-section">
        <h3>Recommended Next Topics</h3>
        <div className="cards-container">
          {recommendations.length === 0 ? (
            <p>No current recommendations.</p>
          ) : (
            recommendations.map((topic) => (
              <QuizCard
                key={topic}
                topic={topic}
                onTakeQuiz={handleTakeQuiz}
              />
            ))
          )}
        </div>
      </div>

      {/* Quiz History */}
      <div className="dashboard-section">
        <h3>Quiz History</h3>
        {!Array.isArray(quizHistory) || quizHistory.length === 0 ? (
          <p>No quiz attempts recorded.</p>
        ) : (
          <ul className="dashboard-list">
            {quizHistory.map((entry, i) => (
              <li key={i}>
                <strong>{entry.topic}</strong> — Score: {entry.score}% — Weight: {entry.mastery}
                <br />
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout & Choose Quiz Buttons */}
      <div className="dashboard-actions">
        <button onClick={handleLogout} className="dashboard-button">
          Logout
        </button>
        <button onClick={() => navigate("/quiz-select")} className="dashboard-button">
          Choose Your Own Quiz Topic
        </button>
      </div>
    </div>
  );
};

export default Dashboard;