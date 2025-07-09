import React, { useEffect, useState } from "react";
import {api} from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
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
  <div className="flex min-h-screen bg-gray-100 font-sans">
    {/* Left: Playground (60%) */}
    <div className="w-3/5 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-blue-700">
          Dhruv - Your Path to Mastery...
        </h1>

        <div className="mb-4 flex gap-2">
          <input
            value={inputConcept}
            onChange={(e) => setInputConcept(e.target.value)}
            placeholder="e.g. Recursion"
            className="px-4 py-2 border border-gray-300 rounded w-full"
          />
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {history[inputConcept] ? "View Attempt" : "Start"}
          </button>
        </div>

        {loading && <p>⏳ Generating questions...</p>}

        {question && (
          <motion.div
            key={question.question}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded shadow"
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Concept: <span className="text-indigo-600">{question.concept}</span>
            </h2>
            <p className="text-gray-800">{question.question}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleAnswer("yes")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer("no")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gray-50 border p-6 rounded"
          >
            <h3 className="text-xl font-semibold mb-2">✅ Session Summary</h3>
            <p>
              <strong>Strong Concepts:</strong>{" "}
              {result.strongConcepts.join(", ") || "None"}
            </p>
            <p>
              <strong>Weak Concepts:</strong>{" "}
              {result.weakConcepts.join(", ") || "None"}
            </p>
            <p>
              <strong>Recommended:</strong>{" "}
              {result.recommendedConcepts.join(", ") || "None"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>

    {/* Right: Knowledge Trail (40%) */}
    <div className="w-2/5 bg-black shadow-md p-6 border-l border-gray-200">
      <h2 className="text-xl font-bold mb-4">🎓 Knowledge Trail</h2>
      <AttemptHistory history={history} />
    </div>
  </div>
);
}
export default PlaygroundPage;