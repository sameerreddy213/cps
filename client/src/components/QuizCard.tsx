import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  topic: string;
  onTakeQuiz: (selectedTopic: string) => void;
}

const QuizCard = ({ topic }: QuizCardProps) => {
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    navigate(`/quiz/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="quiz-card">
      <h4>{topic}</h4>
      <button
        onClick={handleTakeQuiz}
        className="btn btn-warning"
      >
        Take Quiz
      </button>
    </div>
  );
};

export default QuizCard;