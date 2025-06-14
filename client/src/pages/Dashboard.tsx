import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import LearnedConceptCard from "../components/LearnedConceptCard";
import QuizCard from "../components/QuizCard";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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
        setQuizHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch quiz history", err);
        setQuizHistory([]);
      }
    };

    if (username) fetchHistory();
  }, [username]);

  const chartData = quizHistory.map(entry => ({
    name: entry.topic,
    score: entry.score,
  }));

  return (
    <div className="dashboard-container">
      <h2>Welcome, {username}!</h2>
      <p>This is your personalized dashboard.</p>

      {/* Mastery Levels */}
      <div className="dashboard-section">
        <h3>Mastery Levels</h3>
        {Object.keys(mastery).length === 0 ? (
          <p>No mastery data available.</p>
        ) : (
          <ul className="quiz-history-list">
            {Object.entries(mastery).map(([topic, score]) => (
              <li key={topic}>
                <strong>{topic}</strong>: {((1 - score) * 100).toFixed(1)}% confidence
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Topics Learned */}
      <div className="dashboard-section">
        <h3>Topics Learned</h3>
        <div className="card-grid">
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
        <div className="card-grid">
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
          <ul className="quiz-history-list">
            {quizHistory.map((entry, i) => (
              <li key={i}>
                <strong>{entry.topic}</strong> — Score: {entry.score}% — Mastery Weight: {entry.mastery}
                <br />
                <small>{new Date(entry.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Simple Chart for quiz scores */}
      {quizHistory.length > 0 && (
        <div className="dashboard-section">
          <h3>Quiz Score Trends</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="dashboard-section card-grid" style={{borderTop: 'none'}}> {/* Override border for button group */}
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
        <button onClick={() => navigate("/quiz-select")} className="btn btn-secondary">
          Choose Your Own Quiz Topic
        </button>
      </div>
    </div>
  );
};

export default Dashboard;