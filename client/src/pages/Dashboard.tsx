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
  const navigate = useNavigate();

  const [quizHistory, setQuizHistory] = useState<QuizHistoryEntry[]>([]);
  const [startConcept, setStartConcept] = useState("");
  const [endConcept, setEndConcept] = useState("");
  const [recommendedPath, setRecommendedPath] = useState<string[]>([]);

  // ⛅ Logout
  const handleLogout = () => {
    logout();
    clearProfile();
    navigate("/");
  };

  // 📚 Navigate to quiz page
  const handleTakeQuiz = (selectedTopic: string) => {
    navigate(`/quiz/${encodeURIComponent(selectedTopic)}`);
  };

  // 📈 Fetch quiz history
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

  // 🔍 Get recommendation path
  const handleGetPath = async () => {
    try {
      const res = await axios.post("/api/recommendation", {
        start: startConcept,
        end: endConcept,
      });
      setRecommendedPath(res.data.path || []);
    } catch (err) {
      console.error("Failed to get recommendation path", err);
      setRecommendedPath([]);
    }
  };

  // 📊 Prepare chart data
  const chartData = quizHistory.map((entry) => ({
    topic: entry.topic,
    mastery: 1 - entry.mastery,
    date: new Date(entry.createdAt).toLocaleDateString(),
  }));

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2>Welcome, {username}!</h2>
      <p>This is your personalized dashboard.</p>

      {/* 📊 Mastery Progress Line Chart */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Mastery Over Time</h3>
        {chartData.length === 0 ? (
          <p>No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="mastery" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ✅ Mastery List */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Current Mastery Levels</h3>
        {Object.keys(mastery).length === 0 ? (
          <p>No mastery data available.</p>
        ) : (
          <ul>
            {Object.entries(mastery).map(([topic, score]) => (
              <li key={topic}>
                {topic}: Confidence {(1 - score).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Topics Learned */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Topics Learned</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {progress.length === 0 ? (
            <p>No topics marked as completed.</p>
          ) : (
            progress.map((topic) => (
              <LearnedConceptCard key={topic} title={topic} />
            ))
          )}
        </div>
      </div>

      {/* ✅ Recommended Topics */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Recommended Next Topics</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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

      {/* 🔍 Get Recommendation Path */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Get Learning Path Recommendation</h3>
        <input
          type="text"
          placeholder="Learned concept"
          value={startConcept}
          onChange={(e) => setStartConcept(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Target concept"
          value={endConcept}
          onChange={(e) => setEndConcept(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <button onClick={handleGetPath} style={{ padding: "0.5rem 1rem" }}>
          Get Path
        </button>

        {recommendedPath.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Recommended Path:</h4>
            <ul>
              {recommendedPath.map((topic, idx) => (
                <li key={idx}>
                  <strong>{topic}</strong>
                  <button
                    onClick={() => handleTakeQuiz(topic)}
                    style={{ marginLeft: "1rem" }}
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => navigate(`/explore/${topic}`)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Explore
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🧾 Quiz History */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Quiz History</h3>
        {quizHistory.length === 0 ? (
          <p>No quiz attempts recorded.</p>
        ) : (
          <ul>
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

      {/* 🔘 Actions */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/quiz-select")}>
          Choose Your Own Quiz Topic
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
