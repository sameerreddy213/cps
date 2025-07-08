// src/pages/RecommendationPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { validTopics } from "../data/validTopic";
import {api} from "../lib/api";

const RecommendationPage = () => {
  const username = useUserStore((state) => state.username);
  const navigate = useNavigate();

  const [startConcept, setStartConcept] = useState("");
  const [endConcept, setEndConcept] = useState("");
  const [recommendedPath, setRecommendedPath] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetPath = async () => {
    setError(null);
    if (!startConcept.trim() || !endConcept.trim()) {
      setError("Please select both start and target concepts.");
      setRecommendedPath([]);
      return;
    }

    try {
      const res = await api.post("/recommendation", {
        start: startConcept.trim(),
        end: endConcept.trim(),
        username,
      });

      setRecommendedPath(res.data.path || []);
      if (res.data.path?.length === 0) {
        setError("No path found between the selected concepts.");
      }
    } catch (err: any) {
      console.error("Error fetching recommendation:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  const handleTakeQuiz = (topic: string) => {
    navigate(`/quiz/${encodeURIComponent(topic)}`);
  };

  const handleExplore = (topic: string) => {
    navigate(`/explore/${encodeURIComponent(topic)}`);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold text-primary">Get Learning Path Recommendation</h2>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow border-primary border-2 mb-4 bg-light-subtle">
            <div className="card-body">
              <div className="row g-3 align-items-center justify-content-center">
                <div className="col-12 col-md-4">
                  <select
                    value={startConcept}
                    onChange={(e) => setStartConcept(e.target.value)}
                    className="form-select form-select-lg border-primary"
                  >
                    <option value="">Select Start Concept</option>
                    {validTopics.filter((t) => t !== endConcept).map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <select
                    value={endConcept}
                    onChange={(e) => setEndConcept(e.target.value)}
                    className="form-select form-select-lg border-primary"
                  >
                    <option value="">Select Target Concept</option>
                    {validTopics.filter((t) => t !== startConcept).map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4 d-flex justify-content-center">
                  <button
                    onClick={handleGetPath}
                    className="btn btn-primary btn-lg w-100 w-md-auto px-4 py-2"
                  >
                    Get Path
                  </button>
                </div>
              </div>
            </div>
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
        </div>
      </div>

      {recommendedPath.length > 0 && (
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow border-success border-2 mb-4 bg-light-subtle">
              <div className="card-body">
                <h4 className="text-center mb-4 text-success">Recommended Path:</h4>
                <ul className="list-group">
                  {recommendedPath.map((topic, idx) => (
                    <li
                      key={idx}
                      className="list-group-item bg-light-subtle d-flex flex-column flex-md-row justify-content-between align-items-center py-3 px-4 mb-2 rounded"
                    >
                      <span className="fw-bold fs-5 mb-2 mb-md-0">{idx + 1}. {topic}</span>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleTakeQuiz(topic)}
                          className="btn btn-success btn-sm px-3"
                        >
                          Take Quiz
                        </button>
                        <button
                          onClick={() => handleExplore(topic)}
                          className="btn btn-info btn-sm px-3"
                        >
                          Explore
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
