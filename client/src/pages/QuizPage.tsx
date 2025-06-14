import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store/userStore";

interface MCQQuestion {
  question: string;
  options: string[];
}

interface QuizSummary {
  topic: string;
  score: number;
  masteryUpdate: Record<string, number>;
  correctAnswers?: string[];
  userAnswers?: string[];
}

const QuizPage = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const username = useUserStore((state) => state.username);
  const updateProfile = useUserStore((state) => state.setProfile);
  const currentMastery = useUserStore((state) => state.mastery);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  // Fetch MCQ questions
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!topic) {
        setError("No topic specified");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/quiz/${encodeURIComponent(topic)}`);

        if (!res.data) {
          throw new Error("No data received from server");
        }

        const fetchedQuestions = res.data.questions;

        if (!Array.isArray(fetchedQuestions)) {
          throw new Error("Invalid questions format received from server");
        }

        setQuestions(fetchedQuestions);
        setAnswers(new Array(fetchedQuestions.length).fill(""));
        setCorrectAnswers(res.data._correctAnswers || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load quiz questions";
        console.error("Quiz loading error:", err);
        setError(errorMessage);
        setQuestions([]);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic]);

  const handleOptionSelect = (qIndex: number, selected: string) => {
    if (submitted) return;

    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[qIndex] = selected;
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (questions.length === 0 || answers.some((a) => !a)) return;

    try {
      setSubmitted(true);

      const res = await axios.post("/api/quiz/submit", {
        topic,
        answers,
        username,
        _correctAnswers: correctAnswers,
      });

      setSummary(res.data);

      if (res.data?.masteryUpdate) {
        updateProfile({
          mastery: {
            ...currentMastery,
            ...res.data.masteryUpdate,
          },
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit quiz";
      console.error("Quiz submission error:", err);
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container error-state">
        <h2 className="error-title">Error</h2>
        <p className="error-message">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="button-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="page-container quiz-page">
      <h2 className="quiz-title">Quiz on: {topic}</h2>

      {questions.length === 0 ? (
        <p className="no-questions-message">No questions available for this topic.</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="quiz-form">
          {questions.map((q, i) => (
            <div key={i} className="quiz-question-card">
              <p className="question-text">
                {i + 1}. {q.question}
              </p>
              <div className="options-container">
                {q.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`option-label ${
                      submitted && summary
                        ? summary.correctAnswers?.[i] === option
                          ? "option-correct"
                          : summary.userAnswers?.[i] === option
                          ? "option-incorrect"
                          : ""
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={option}
                      checked={answers[i] === option}
                      onChange={() => handleOptionSelect(i, option)}
                      disabled={submitted}
                      className="option-radio"
                    />
                    <span className="option-text">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={answers.some((a) => !a)}
              className="submit-quiz-button"
            >
              Submit Quiz
            </button>
          )}
        </form>
      )}

      {/* Quiz Results */}
      {summary && (
        <div className="quiz-results-summary">
          <h3 className="results-title">Quiz Results</h3>
          <p className="results-score">
            <span className="font-semibold">Score:</span> {summary.score.toFixed(1)}%
          </p>
          {summary.masteryUpdate && topic && (
            <p className="results-mastery">
              <span className="font-semibold">Mastery Level:</span>{" "}
              {((1 - (summary.masteryUpdate[topic] || 0)) * 100).toFixed(1)}%
            </p>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="button-primary"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;