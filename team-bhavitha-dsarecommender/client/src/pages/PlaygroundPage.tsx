import React, { useEffect, useState } from "react";
import {api} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import AttemptHistory from "../components/AttemptHistory";

type Question = { concept: string; question: string };
type Result = {
  strongConcepts: string[];
  weakConcepts: string[];
  recommendedConcepts: string[];
};

const PlaygroundPage = () => {
  const { username : user } = useAuthStore();
  const [inputConcept, setInputConcept] = useState("");
  const [concept, setConcept] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState(false);

  // 🔄 Load previous attempts on first load
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
    <div className="container-fluid min-vh-100 py-5" style={{ background: 'linear-gradient(120deg, #e0e7ef 60%, #f8fafc 100%)' }}>
      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center mb-4">
          <div className="py-3 mb-3 rounded bg-primary bg-gradient shadow-sm">
            <h1 className="display-5 fw-bold text-white mb-0">Dhruv Playground</h1>
            <div className="text-white-50">Your Path to Mastery</div>
          </div>
        </div>
      </div>
      <div className="row g-4 justify-content-center">
        {/* Left: Playground (Main) */}
        <div className={`col-12 ${question ? '' : 'col-lg-7'} mb-4 mb-lg-0`}>
          <div className="card shadow-lg border-primary border-2 h-100 bg-white">
            <div className="card-body">
              <form className="row g-2 align-items-center mb-4" onSubmit={e => { e.preventDefault(); handleStart(); }}>
                <div className="col-12 col-md-8">
                  <input
                    value={inputConcept}
                    onChange={(e) => setInputConcept(e.target.value)}
                    placeholder="e.g. Recursion"
                    className="form-control form-control-lg border-primary"
                  />
                </div>
                <div className="col-12 col-md-4 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {history[inputConcept] ? "View Attempt" : "Start"}
                  </button>
                </div>
              </form>

              {loading && <div className="alert alert-info text-center mb-3 fs-5">⏳ Generating questions...</div>}

              {question && (
                <div className="card bg-light-subtle border-info border-2 p-4 shadow-sm mb-4">
                  <h2 className="h5 fw-semibold text-secondary mb-2">
                    Concept: <span className="text-primary">{question.concept}</span>
                  </h2>
                  <p className="fs-5 text-dark mb-3">{question.question}</p>
                  <div className="d-flex gap-3 justify-content-center">
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
                <div className="alert alert-success p-4 shadow-sm mt-4 text-center">
                  <h3 className="h5 fw-bold text-success mb-3">✅ Session Summary</h3>
                  <div className="row mb-2">
                    <div className="col-12 col-md-4 mb-2 mb-md-0">
                      <div className="bg-success bg-opacity-10 rounded p-2">
                        <strong>Strong Concepts:</strong><br />
                        <span className="fw-semibold">{result.strongConcepts.join(", ") || "None"}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 mb-2 mb-md-0">
                      <div className="bg-danger bg-opacity-10 rounded p-2">
                        <strong>Weak Concepts:</strong><br />
                        <span className="fw-semibold">{result.weakConcepts.join(", ") || "None"}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="bg-primary bg-opacity-10 rounded p-2">
                        <strong>Recommended:</strong><br />
                        <span className="fw-semibold">{result.recommendedConcepts.join(", ") || "None"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Knowledge Trail - only show when not answering questions */}
        {!question && (
          <div className="col-12 col-lg-5">
            <div className="card shadow border-0 h-100 bg-dark text-white">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">🎓 Knowledge Trail</h2>
                <AttemptHistory history={history} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default PlaygroundPage;