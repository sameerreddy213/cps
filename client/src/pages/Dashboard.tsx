import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import LearnedConceptCard from "../components/LearnedConceptCard";
import QuizCard from "../components/QuizCard";
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
  mastery: number; // This is the 'weight' from your diff
  createdAt: string;
}

const Dashboard = () => {
  const logout = useAuthStore((state) => state.logout);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const username = useUserStore((state) => state.username);
  const mastery = useUserStore((state) => state.mastery);
  const progress = useUserStore((state) => state.progress);
  const recommendations = useUserStore((state) => state.recommendations);

  const navigate = useNavigate();

  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>([]);
  const [startConcept, setStartConcept] = useState("");
  const [endConcept, setEndConcept] = useState("");
  const [recommendedPath, setRecommendedPath] = useState<string[]>([]);
  const [pathError, setPathError] = useState<string | null>(null);

  // Logout
  const handleLogout = () => {
    logout();
    clearProfile();
    navigate("/");
  };

  // Navigate to quiz page
  const handleTakeQuiz = (selectedTopic: string) => {
    navigate(`/quiz/${encodeURIComponent(selectedTopic)}`);
  };

  // Fetch quiz history
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

  // Get recommendation path
  const handleGetPath = async () => {
    setPathError(null);
    if (!startConcept.trim() || !endConcept.trim()) {
      setPathError("Please enter both start and target concepts.");
      setRecommendedPath([]);
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/recommendation", {
        start: startConcept.trim(),
        end: endConcept.trim(),
        username: username
      });
      setRecommendedPath(res.data.path || []);
      if (res.data.path && res.data.path.length === 0) {
        setPathError("No path found between the specified concepts.");
      }
    } catch (err: any) {
      console.error("Failed to get recommendation path", err);
      setPathError(err.response?.data?.error || "Failed to get recommendation path.");
      setRecommendedPath([]);
    }
  };

  // Prepare chart data
  const chartData = quizHistory.map((entry) => ({
    topic: entry.topic,
    mastery: (1 - entry.mastery) * 100, // Convert to percentage for display
    date: new Date(entry.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="dashboard-container">
      <h2>Welcome, {username}!</h2>
      <p style={{ fontSize: '1.1em', color: '#b0b0b0', marginBottom: '2.5rem' }}>This is your personalized dashboard.</p>

      {/* Mastery Progress Line Chart */}
      <div className="dashboard-section">
        <h3>Mastery Over Time</h3>
        {chartData.length === 0 ? (
          <p style={{ fontSize: '1em', color: '#b0b0b0', marginTop: '1rem' }}>No data available yet to show mastery progression.</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" /> {/* Darker grid lines */}
                <XAxis dataKey="topic" interval={0} angle={-30} textAnchor="end" height={60} stroke="#b0b0b0" /> {/* Darker axis labels */}
                <YAxis domain={[0, 100]} label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft', fill: '#b0b0b0' }} stroke="#b0b0b0" /> {/* Darker axis labels */}
                <Tooltip contentStyle={{ backgroundColor: '#333333', border: '1px solid #555555', color: '#e0e0e0' }} itemStyle={{ color: '#e0e0e0' }} /> {/* Darker tooltip */}
                <Line type="monotone" dataKey="mastery" stroke="#a872e6" strokeWidth={3} dot={{ r: 5, fill: '#a872e6' }} activeDot={{ r: 8 }} /> {/* Brighter purple line */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Current Mastery Levels */}
      <div className="dashboard-section">
        <h3>Current Mastery Levels</h3>
        {Object.keys(mastery).length === 0 ? (
          <p style={{ fontSize: '1em', color: '#b0b0b0', marginTop: '1rem' }}>No mastery data available. Take some quizzes to get started!</p>
        ) : (
          <ul className="mastery-list">
            {Object.entries(mastery).map(([topic, score]) => (
              <li key={topic}>
                <strong>{topic}</strong>: <span className="mastery-score">{(1 - score).toFixed(2)} Confidence</span>
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
            <p style={{ fontSize: '1em', color: '#b0b0b0', marginTop: '1rem', gridColumn: '1 / -1' }}>No topics marked as completed yet. Keep learning!</p>
          ) : (
            progress.map((topic) => (
              <LearnedConceptCard key={topic} title={topic} />
            ))
          )}
        </div>
      </div>

      {/* Recommended Topics */}
      <div className="dashboard-section">
        <h3>Recommended Next Topics</h3>
        <div className="card-grid">
          {recommendations.length === 0 ? (
            <p style={{ fontSize: '1em', color: '#b0b0b0', marginTop: '1rem', gridColumn: '1 / -1' }}>No current recommendations. Explore new topics!</p>
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

      {/* Get Learning Path Recommendation */}
      <div className="dashboard-section">
        <h3>Get Learning Path Recommendation</h3>
        <div className="path-input-group">
          <input
            type="text"
            placeholder="Start Concept (e.g., Variables)"
            value={startConcept}
            onChange={(e) => setStartConcept(e.target.value)}
            className="path-input"
          />
          <input
            type="text"
            placeholder="Target Concept (e.g., Recursion)"
            value={endConcept}
            onChange={(e) => setEndConcept(e.target.value)}
            className="path-input"
          />
          <button onClick={handleGetPath} className="btn">
            Get Path
          </button>
        </div>

        {pathError && <p className="error-message path-error">{pathError}</p>}

        {recommendedPath.length > 0 && (
          <div className="recommended-path-section">
            <h4>Recommended Path:</h4>
            <ul className="path-list">
              {recommendedPath.map((topic, idx) => (
                <li key={idx} className="path-list-item">
                  <span className="path-topic">
                    {idx + 1}. <strong>{topic}</strong>
                  </span>
                  <div className="path-buttons">
                    <button onClick={() => handleTakeQuiz(topic)} className="btn btn-secondary btn-path">
                      Take Quiz
                    </button>
                    <button onClick={() => navigate(`/explore/${topic}`)} className="btn btn-info btn-path">
                      Explore
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quiz History */}
      <div className="dashboard-section">
        <h3>Quiz History</h3>
        {quizHistory.length === 0 ? (
          <p style={{ fontSize: '1em', color: '#b0b0b0', marginTop: '1rem' }}>No quiz attempts recorded yet.</p>
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

      {/* Actions */}
      <div className="dashboard-section actions-group">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        <button onClick={() => navigate("/quiz-select")} className="btn btn-secondary">
          Choose Your Own Quiz Topic
        </button>
      </div>
    </div>
  );
};

export default Dashboard;