// src/pages/QuizPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useUserStore } from "../store/userStore";
import LoadingWithQuote from "../components/LoadingWithQuotes";
import { useQuizStore } from "../store/quizStore"; // ✅ Import Zustand store

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
  const addLearnedTopic = useUserStore((state) => state.addLearnedTopic);
  const quizHistory = useUserStore((state) => state.quizHistory);
  const setQuizHistory = useUserStore((state) => state.setQuizHistory);
  const progress = useUserStore((state) => state.progress);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState<boolean[]>([]);

  const quizStore = useQuizStore();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!topic) {
        setError("No topic specified");
        setLoading(false);
        return;
      }

      // ✅ Use cached quiz if same topic
      if (quizStore.topic === topic) {
        setQuestions(quizStore.questions);
        setCorrectAnswers(quizStore.correctAnswers);
        setAnswers(new Array(quizStore.questions.length).fill(""));
        setShowSolution(new Array(quizStore.questions.length).fill(false));
        setLoading(false);
        return;
      }

      // ✅ Otherwise, fetch new quiz
      try {
        setLoading(true);
        const res = await api.get(`/quiz/${encodeURIComponent(topic)}`);
        const fetchedQuestions = res.data.questions;

        if (!Array.isArray(fetchedQuestions)) {
          throw new Error("Invalid questions format received from server");
        }

        setQuestions(fetchedQuestions);
        setCorrectAnswers(res.data._correctAnswers || []);
        setAnswers(new Array(fetchedQuestions.length).fill(""));
        setShowSolution(new Array(fetchedQuestions.length).fill(false));

        // ✅ Cache quiz in Zustand
        quizStore.setQuizData({
          topic,
          questions: fetchedQuestions,
          correctAnswers: res.data._correctAnswers || [],
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load quiz questions";
        console.error("Quiz loading error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, quizStore]);

  const handleOptionSelect = (qIndex: number, selected: string) => {
    if (submitted) return;
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[qIndex] = selected;
      return newAnswers;
    });
  };

  const toggleSolution = (index: number) => {
    setShowSolution((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleDiscuss = async (index: number) => {
    const questionText = questions[index].question;
    try {
      const res = await api.post("/discuss/create-or-get", {
        topic,
        questionText,
        questionIndex: index,
        username,
      });
      const threadId = res.data._id;
      navigate(`/discuss/${threadId}`);
    } catch (err) {
      console.error("Failed to open discussion thread:", err);
      alert("Unable to open discussion thread. Please try again.");
    }
  };

  const handleAsk = (index: number) => {
    const questionText = questions[index].question;
    alert(`Opening educator Q&A for Q${index + 1}: "${questionText}"`);
  };

  const handleReport = (index: number) => {
    const questionText = questions[index].question;
    alert(`Reporting issue for Q${index + 1}: "${questionText}"`);
  };

  const handleSubmit = async () => {
    if (!topic) return;
    if (questions.length === 0 || answers.some((a) => a === "")) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitted(true);

      const res = await api.post("/quiz/submit", {
        topic,
        answers,
        username,
        _correctAnswers: correctAnswers,
      });

      const masteryValue = res.data.masteryUpdate?.[topic];
      setSummary(res.data);

      updateProfile({
        mastery: {
          ...currentMastery,
          ...res.data.masteryUpdate,
        },
      });

      if (
        typeof masteryValue === "number" &&
        (1 - masteryValue) >= 0.7 &&
        !progress.includes(topic)
      ) {
        addLearnedTopic(topic);
      }

      const newEntry = {
        topic,
        score: res.data.score,
        mastery: masteryValue,
        createdAt: new Date().toISOString(),
      };
      setQuizHistory([...quizHistory, newEntry]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit quiz";
      console.error("Quiz submission error:", err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <LoadingWithQuote />
        <p className="mt-3 fs-4 text-primary">Loading quiz questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <h2 className="text-danger mb-4 display-5">Error</h2>
        <div className="alert alert-danger mb-4 w-100 text-center">{error}</div>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-primary btn-lg px-5"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold text-primary">Quiz on: {topic}</h2>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          {questions.length === 0 ? (
            <p className="text-center fs-4 text-muted mt-3">
              No questions available for this topic.
            </p>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              {questions.map((q, i) => (
                <div key={i} className="card bg-light-subtle text-dark p-4 shadow rounded mb-4">
                  <p className="card-text fs-5 fw-bold mb-3 text-dark">
                    {i + 1}. {q.question}
                  </p>
                  <div className="d-flex flex-column gap-3 mb-3">
                    {q.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`list-group-item list-group-item-action bg-white text-dark border border-secondary rounded py-3 px-4 d-flex align-items-center ${
                          submitted && summary
                            ? summary.correctAnswers?.[i] === option
                              ? "border-success bg-success-subtle text-success-emphasis"
                              : summary.userAnswers?.[i] === option &&
                                summary.correctAnswers?.[i] !== option
                              ? "border-danger bg-danger-subtle text-danger-emphasis"
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
                          disabled={submitted || isSubmitting}
                          className="form-check-input me-3"
                          style={{ transform: "scale(1.4)" }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>

                  <div className="d-flex flex-wrap gap-3 justify-content-between mt-2">
                    <button
                      className="btn btn-outline-primary btn-sm px-3"
                      onClick={() => handleDiscuss(i)}
                    >
                      🗣️ Discuss
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm px-3"
                      onClick={() => handleAsk(i)}
                    >
                      ❓ Ask
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => handleReport(i)}
                    >
                      🐞 Report
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm px-3"
                      onClick={() => toggleSolution(i)}
                    >
                      📘 {showSolution[i] ? "Hide" : "View"} Solution
                    </button>
                  </div>

                  {showSolution[i] && submitted && summary?.correctAnswers?.[i] && (
                    <div className="alert alert-info mt-3">
                      <strong>Solution:</strong> {summary.correctAnswers[i]} — *(Add explanation text here)*
                    </div>
                  )}
                </div>
              ))}

              {!submitted && (
                <button
                  onClick={handleSubmit}
                  disabled={answers.some((a) => a === "") || answers.length === 0 || isSubmitting}
                  className="btn btn-primary btn-lg w-100 mt-4"
                >
                  {isSubmitting ? <LoadingWithQuote /> : "Submit Quiz"}
                </button>
              )}
            </form>
          )}

          {summary && (
            <div className="card bg-light-subtle text-dark p-5 shadow-lg rounded mt-5 text-center">
              <h3 className="card-title text-success mb-3 display-6">Quiz Results</h3>
              <p className="card-text fs-3 mb-2 text-dark">
                <span className="fw-semibold">Score:</span> {summary.score.toFixed(1)}%
              </p>
              {summary.masteryUpdate && topic && (
                <p className="card-text fs-4 mb-4 text-dark">
                  <span className="fw-semibold">Mastery Level:</span>{" "}
                  {((1 - (summary.masteryUpdate[topic] || 0)) * 100).toFixed(1)}%
                </p>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-primary btn-lg px-5"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
