// client/src/pages/StudentDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import LearnedConceptCard from "../components/LearnedConceptCard";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

interface QuizEntry {
  topic: string;
  score: number;
  mastery: number;
  createdAt: string;
}

const StudentDetailPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState<QuizEntry[]>([]);
  const [mastery, setMastery] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchStudentData = async () => {
      try {
        const res = await api.get(`/quiz-history/${username}`);
        if (Array.isArray(res.data)) {
          setQuizHistory(res.data);

          const masteryMap: Record<string, number[]> = {};
          res.data.forEach((entry) => {
            if (!masteryMap[entry.topic]) masteryMap[entry.topic] = [];
            masteryMap[entry.topic].push(entry.mastery);
          });

          const updatedMastery: Record<string, number> = {};
          const learned: string[] = [];

          Object.entries(masteryMap).forEach(([topic, scores]) => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            updatedMastery[topic] = avg;
            const confidence = (1 - avg) * 100;
            if (confidence >= 70) learned.push(topic);
          });

          setMastery(updatedMastery);
          setProgress(learned);
        }
      } catch (err) {
        setError("Failed to fetch student data");
        console.error(err);
      }
    };

    fetchStudentData();
  }, [username]);

  const chartData = quizHistory
    .map((entry) => ({
      topic: entry.topic,
      mastery: (1 - entry.mastery) * 100,
      date: new Date(entry.createdAt).toLocaleDateString(),
      fullDate: new Date(entry.createdAt).getTime(),
    }))
    .sort((a, b) => a.fullDate - b.fullDate);

  return (
    <div className="container py-4 text-white">
      <h2 className="text-center mb-4">📘 Student: {username}</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Mastery Over Time */}
      <div className="mb-5">
        <h4 className="text-info text-center">📈 Mastery Over Time</h4>
        {chartData.length === 0 ? (
          <p className="text-center text-muted">No data to display.</p>
        ) : (
          <div className="chart-container bg-dark-subtle p-3 rounded shadow">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="topic" stroke="#ccc" />
                <YAxis domain={[0, 100]} stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="mastery" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Learned Topics */}
      <div className="mb-5">
        <h4 className="text-info text-center">✅ Learned Topics</h4>
        {progress.length === 0 ? (
          <p className="text-center text-muted">No topics learned yet.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {progress.map((topic) => (
              <div key={topic} className="col">
                <LearnedConceptCard title={topic} quizScores={
                  quizHistory
                    .filter(q => q.topic === topic)
                    .map(q => ({ score: q.score, date: q.createdAt }))
                } />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz History */}
      <div className="mb-5">
        <h4 className="text-info text-center">🧪 Quiz History</h4>
        {quizHistory.length === 0 ? (
          <p className="text-center text-muted">No quizzes attempted yet.</p>
        ) : (
          <ul className="list-group">
            {quizHistory.map((entry, i) => (
              <li key={i} className="list-group-item bg-secondary-subtle text-dark">
                <strong>{entry.topic}</strong> — Score: {entry.score}%, Mastery: {entry.mastery}
                <br />
                <small className="text-muted">{new Date(entry.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="btn btn-outline-light mt-4" onClick={() => navigate(-1)}>⬅ Back to Dashboard</button>
    </div>
  );
};

export default StudentDetailPage;