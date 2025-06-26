import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ThemeToggle from '../components/ThemeToggle';

interface LearnerBasic {
  _id: string;
  email: string;
  profile: {
    name: string;
    picture?: string;
  };
}

interface LearnerFull extends LearnerBasic {
  passedArray: string[];
  searchHistory: string[];
}

const MentorLearnersPage: React.FC = () => {
  const [learners, setLearners] = useState<LearnerBasic[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedLearnerData, setExpandedLearnerData] = useState<{
    [key: string]: LearnerFull;
  }>({});
  const [assessmentHistory, setAssessmentHistory] = useState<{ [key: string]: any[] }>({});
  const [showAssessment, setShowAssessment] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearners = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/mentor/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLearners(res.data);
      } catch (err: any) {
        setError("Failed to fetch learners.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearners();
  }, []);

  const handleExpand = async (email: string, id: string) => {
    const isExpanded = expandedId === id;
    if (isExpanded) {
      setExpandedId(null);
      return;
    }

    if (!expandedLearnerData[id]) {
      try {
        setLoadingDetails(id);
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/mentor/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpandedLearnerData((prev) => ({ ...prev, [id]: res.data }));
      } catch (error) {
        console.error("Error loading learner details", error);
      } finally {
        setLoadingDetails(null);
      }
    }

    setExpandedId(id);
  };

  const toggleAssessment = async (email: string, id: string) => {
    const isVisible = showAssessment[id];
    const token = localStorage.getItem("token");
    if (!isVisible && !assessmentHistory[id]) {
      try {
        const res = await api.get(`/api/mentor/${email}/assessment-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessmentHistory((prev) => ({ ...prev, [id]: res.data }));
      } catch (error) {
        console.error("Failed to load assessment history", error);
      }
    }
    setShowAssessment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredLearners = learners.filter((learner) =>
    learner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm"
            >
              ← Back to Dashboard
            </button>
            <input
              placeholder="Search by Gmail"
              className="px-4 py-2 w-full sm:w-64 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ThemeToggle/>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
            👨‍🏫 My Learners
          </h1>
        </div>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading learners...</p>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : filteredLearners.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No learners match your search.</p>
        ) : (
          <div className="space-y-6">
            {filteredLearners.map((learner) => {
              const isExpanded = expandedId === learner._id;
              const fullData = expandedLearnerData[learner._id];
              return (
                <div
                  key={learner._id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          learner.profile.picture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            learner.profile.name || learner.email
                          )}`
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {learner.profile.name || learner.email}
                        </p>
                        {!learner.profile.name && (
                          <p className="text-xs text-gray-400 italic">Profile not updated</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleExpand(learner.email, learner._id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700 text-sm space-y-2">
                      {loadingDetails === learner._id ? (
                        <p className="text-gray-500 dark:text-gray-300">Loading learner details...</p>
                      ) : fullData ? (
                        <>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Name:</strong> {fullData.profile.name}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Email:</strong> {fullData.email}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Passed Topics:</strong>{" "}
                            {fullData.passedArray.length > 0
                              ? fullData.passedArray.join(", ")
                              : "None"}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Search History:</strong>{" "}
                            {fullData.searchHistory.length > 0
                              ? fullData.searchHistory.join(", ")
                              : "No history"}
                          </p>

                          <button
                            onClick={() => toggleAssessment(learner.email, learner._id)}
                            className="mt-4 bg-blue-50 dark:bg-[#1f2937] border border-blue-300 dark:border-gray-700 rounded-xl px-4 py-2 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-[#374151] transition"
                          >
                            {showAssessment[learner._id]
                              ? "Hide Assessment History"
                              : "Show Assessment History"}
                          </button>

                          {showAssessment[learner._id] && (
                            <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl space-y-2">
                              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                                Assessment History
                              </h4>
                              {assessmentHistory[learner._id]?.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                                  {assessmentHistory[learner._id].map((q, i) => (
                                    <li key={i}>
                                      {q.topic || "Unknown"} – Score: {q.score ?? "N/A"}% – {new Date(q.createdAt).toLocaleDateString()}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 italic">No assessments found.</p>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-red-400 text-sm">Unable to load learner info.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorLearnersPage;