// client/src/pages/QuizSelectPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validTopics } from "../data/validTopic";
import LoadingSpinner from "../components/LoadingSpinner"; // Import LoadingSpinner

const QuizSelectPage = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for button loading
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedTopic.trim()) {
      setIsLoading(true); // Start loading animation
      // Simulate a network delay or processing time before navigation
      setTimeout(() => {
        navigate(`/quiz/${encodeURIComponent(selectedTopic.trim())}`);
        setIsLoading(false); // End loading (though navigation changes page)
      }, 800); // 800ms delay for demonstration
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark py-5">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-primary border-2 p-4 p-md-5 bg-dark text-white">
            <div className="card-body text-center">
              <h2 className="mb-4 text-primary display-6">Select a Topic for Quiz</h2>
              <div className="mb-4 w-100 d-flex justify-content-center">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="form-select form-select-lg border-primary"
                  style={{ maxWidth: '350px' }}
                  disabled={isLoading}
                >
                  <option value="">Select a topic...</option>
                  {validTopics.map((topic: string, i: number) => (
                    <option key={i} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-lg w-100 py-3 fs-5"
                disabled={!selectedTopic || isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Take Quiz"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSelectPage;