import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // Make sure this is an Axios instance

interface Learner {
  _id: string;
  email: string;
  profile: {
    name: string;
    picture?: string;
  };
}

const MentorLearnersPage: React.FC = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLearners = async () => {
      const token = localStorage.getItem("token"); // Or use cookies if applicable
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
        console.error("Error fetching learners:", err);
        setError("Failed to fetch learners. You may not have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchLearners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Learners List
        </h1>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading learners...</p>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : learners.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No learners found.</p>
        ) : (
          <ul className="space-y-4">
            {learners.map((learner) => (
              <li
                key={learner._id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex justify-between items-center"
              >
                <div className="text-gray-900 dark:text-white">
                  <p className="font-medium text-lg">
                    {learner.profile.name || learner.email}
                  </p>
                  <p className="text-sm text-gray-500">{learner.email}</p>
                </div>
                <Link
                  to={'#'}
                  // to={`/learners/${encodeURIComponent(learner.email)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  View Profile
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MentorLearnersPage;
