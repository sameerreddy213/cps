// client/src/pages/StudentDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import LearnedConceptCard from "../components/LearnedConceptCard";
import AssignTaskModal from "../components/AssignTaskModal";
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
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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

          // setMastery(updatedMastery); // This line is removed as per the edit hint
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
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4 px-2 px-md-4">
            <h2 className="display-5 fw-bold text-primary">📘 Student: {username}</h2>
            {error && <p className="text-danger text-center">{error}</p>}
          </div>
        </div>
      </div>

      {/* Mastery Over Time */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow border-info border-2 mb-4">
            <div className="card-body px-2 px-md-4">
              <h4 className="text-info text-center mb-4">📈 Mastery Over Time</h4>
              {chartData.length === 0 ? (
                <p className="text-center text-muted">No data to display.</p>
              ) : (
                <div className="bg-light rounded p-2 p-md-3">
                  <ResponsiveContainer width="100%" height={300} minWidth={200} minHeight={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="topic" stroke="#888" />
                      <YAxis domain={[0, 100]} stroke="#888" />
                      <Tooltip />
                      <Line type="monotone" dataKey="mastery" stroke="#a872e6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learned Topics */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow border-success border-2 mb-4">
            <div className="card-body px-2 px-md-4">
              <h4 className="text-success text-center mb-4">✅ Learned Topics</h4>
              {progress.length === 0 ? (
                <p className="text-center text-muted">No topics learned yet.</p>
              ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center align-items-center">
                  {progress.map((topic) => (
                    <div key={topic} className="col d-flex justify-content-center align-items-center">
                      <div className="flex-fill d-flex justify-content-center align-items-center">
                        <LearnedConceptCard title={topic} quizScores={
                          quizHistory
                            .filter(q => q.topic === topic)
                            .map(q => ({ score: q.score, date: q.createdAt }))
                        } />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow border-primary border-2 mb-4">
            <div className="card-body px-2 px-md-4">
              <h4 className="text-primary text-center mb-4">🧪 Quiz History</h4>
              {quizHistory.length === 0 ? (
                <p className="text-center text-muted">No quizzes attempted yet.</p>
              ) : (
                <ul className="list-group">
                  {quizHistory.map((entry, i) => (
                    <li key={i} className="list-group-item bg-light text-dark">
                      <strong>{entry.topic}</strong> — Score: {entry.score}%, Mastery: {entry.mastery}
                      <br />
                      <small className="text-muted">{new Date(entry.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Assign Task Button */}
      <button
        className="btn btn-outline-primary btn-lg mt-4 w-50 w-md-auto d-block mx-auto"
        onClick={() => setShowModal(true)}
      >
        Assign Task
      </button>

      <AssignTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        username={username || ""}
      />

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 text-center">
          <button className="btn btn-outline-primary btn-lg mt-4 w-100 w-md-auto d-block mx-auto" onClick={() => navigate(-1)}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;