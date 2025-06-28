import { useNavigate } from "react-router-dom";
import {validTopics} from "../data/validTopic";
import { useState } from "react";

interface QuizCardProps {
  topic: string;
  onTakeQuiz: (selectedTopic: string) => void;
}

const QuizCard = ({ topic, onTakeQuiz }: QuizCardProps) => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(topic);

  const handleTakeQuiz = () => {
    navigate(`/quiz/${encodeURIComponent(selectedTopic)}`);
    onTakeQuiz(selectedTopic);
  };

  return (
    <div className="card text-center bg-secondary-subtle text-white h-100 shadow-sm border border-warning">
      <div className="card-body d-flex flex-column justify-content-between align-items-center">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="form-select form-select-lg bg-dark-subtle text-dark-contrast border-secondary mb-3"
          style={{ maxWidth: '300px' }}
        >
          {validTopics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handleTakeQuiz}
          className="btn btn-warning mt-auto"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;