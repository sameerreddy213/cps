import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validTopics } from "../data/validTopic";

const QuizSelectPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedTopic.trim()) {
      navigate(`/quiz/${encodeURIComponent(selectedTopic.trim())}`);
    }
  };

  return (
    <div className="container py-5 bg-dark text-white rounded shadow-lg text-center" style={{ maxWidth: '650px' }}>
      <h2 className="mb-4 text-primary fs-2">Select a Topic for Quiz</h2>
      <div className="mb-3 d-flex justify-content-center">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="form-select form-select-lg bg-dark-subtle text-dark-contrast border-secondary"
          style={{ maxWidth: '300px' }}
        >
          <option value="">Select a topic...</option>
          {validTopics.map((topic: string, i: number) => (
            <option key={i} value={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="btn btn-primary btn-lg w-100"
        disabled={!selectedTopic}
      >
        Take Quiz
      </button>
    </div>
  );
};

export default QuizSelectPage;