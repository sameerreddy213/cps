import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import AttemptHistory from "../components/AttemptHistory";
import { validTopics } from "../data/validTopic";

type Question = { concept: string; question: string };
type Result = {
  strongConcepts: string[];
  weakConcepts: string[];
  recommendedConcepts: string[];
};

const PlaygroundPage = () => {
  const { username: user } = useAuthStore();
  const [inputConcept, setInputConcept] = useState("");
  const [concept, setConcept] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const localData = localStorage.getItem("playgroundHistory");
      if (localData) {
        setHistory(JSON.parse(localData));
        return;
      }

      if (!user) return;

      try {
        const res = await api.get(`/user/${user}/playground-attempts`);
        setHistory(res.data);
        localStorage.setItem("playgroundHistory", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error loading previous attempts", err);
      }
    };
    loadHistory();
  }, [user]);

  const handleStart = async () => {
    if (!inputConcept || !user) return;

    if (history[inputConcept]) {
      setConcept(inputConcept);
      setResult(history[inputConcept]);
      setQuestion(null);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/start", {
        params: { concept: inputConcept, userId: user },
      });

      setConcept(inputConcept);
      setSessionId(res.data.sessionId);
      setQuestion(res.data.question);
      setResult(null);
    } catch (err) {
      console.error("Failed to start session", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: "yes" | "no") => {
    try {
      const res = await api.post("/answer", {
        sessionId,
        answer,
      });

      if (res.data.isComplete) {
        setResult(res.data.results);
        setHistory((prev) => {
          const updated = { ...prev, [concept]: res.data.results };
          localStorage.setItem("playgroundHistory", JSON.stringify(updated));
          return updated;
        });
        setQuestion(null);
      } else {
        setQuestion(res.data.question);
      }
    } catch (err) {
      console.error("Answer submission failed", err);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 bg-black text-white">
      <div className="row g-4 justify-content-center">
        {/* Left: Playground */}
        <div className="col-12 col-lg-7 mb-4 mb-lg-0">
          <div className="card shadow-lg border-primary border-2 h-100 bg-dark text-white">
            <div className="card-body">
              <h1 className="display-6 fw-bold mb-4 text-info">
                Dhruv - Your Path to Mastery...
              </h1>

              {/* Topic Dropdown */}
              <form
                className="row g-2 align-items-center mb-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStart();
                }}
              >
                <div className="col-12 col-md-8">
                  <select
                    value={inputConcept}
                    onChange={(e) => setInputConcept(e.target.value)}
                    className="form-select form-select-lg bg-black text-white border-primary"
                    disabled={loading}
                  >
                    <option value="">Select a topic...</option>
                    {validTopics.map((topic, idx) => (
                      <option key={idx} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading || !inputConcept}
                  >
                    {history[inputConcept] ? "View Attempt" : "Start"}
                  </button>
                </div>
              </form>

              {loading && (
                <div className="text-center text-info mb-3 fs-5">
                  ⏳ Generating questions...
                </div>
              )}

              {question && (
                <div className="card bg-dark text-white p-4 shadow-sm mb-4 border border-secondary">
                  <h2 className="h5 fw-semibold text-white mb-2">
                    Concept:{" "}
                    <span className="text-info">{question.concept}</span>
                  </h2>
                  <p className="fs-5 text-light mb-3">{question.question}</p>
                  <div className="d-flex gap-3">
                    <button
                      onClick={() => handleAnswer("yes")}
                      className="btn btn-success px-4 py-2 fs-5"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleAnswer("no")}
                      className="btn btn-danger px-4 py-2 fs-5"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {result && (
                <div className="card bg-black text-white border-success border-2 p-4 shadow-sm mt-4">
                  <h3 className="h5 fw-bold text-success mb-3">
                    ✅ Session Summary
                  </h3>
                  <p className="mb-1">
                    <strong>Strong Concepts:</strong>{" "}
                    {result.strongConcepts.join(", ") || "None"}
                  </p>
                  <p className="mb-1">
                    <strong>Weak Concepts:</strong>{" "}
                    {result.weakConcepts.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Recommended:</strong>{" "}
                    {result.recommendedConcepts.join(", ") || "None"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Knowledge Trail */}
        <div className="col-12 col-lg-5">
          <div className="card shadow border-0 h-100 bg-dark text-white">
            <div className="card-body">
              <h2 className="h4 fw-bold mb-4">🎓 Knowledge Trail</h2>
              <AttemptHistory history={history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
