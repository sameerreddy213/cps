// src/pages/QuizSelectPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validTopics } from "../data/validTopic"; // Assuming this file exists and exports validTopics

const QuizSelectPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedTopic.trim()) {
      navigate(`/quiz/${encodeURIComponent(selectedTopic.trim())}`);
    }
  };

  return (
    <div className="page-container form-page"> {/* Reusing form-page styles */}
      <h2>Select a Topic for Quiz</h2>
      <div className="form-group">
        <label htmlFor="topic-select">Choose a Topic:</label>
        <input
          list="topics"
          id="topic-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          placeholder="Start typing a topic..."
        />
        <datalist id="topics">
          {validTopics.map((topic: string, i: number) => (
            <option key={i} value={topic} />
          ))}
        </datalist>
      </div>
      <button onClick={handleSubmit} className="primary-button">
        Take Quiz
      </button>
    </div>
  );
};

export default QuizSelectPage;