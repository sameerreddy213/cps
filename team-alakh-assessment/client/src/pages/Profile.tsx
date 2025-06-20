// Profile.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const [data, setData] = useState<{ email: string; passed: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setError('Unauthorized');

        const res = await api.get('/api/user/passed', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg">Loading profile...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-red-600">
          {error}
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="text-indigo-600 hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-auto bg-gradient-to-r from-white to-indigo-50 rounded-3xl shadow-2xl border border-indigo-100 p-6 overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          ✕
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center w-full -ml-5">👤 Profile</h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Email: <span className="text-indigo-600">{data.email}</span>
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">✅ Passed Topics</h3>

        <div className="flex flex-wrap gap-4">
          {data.passed.length > 0 ? (
            data.passed.map((topic, index) => (
              <div
                key={index}
                className="px-5 py-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-300 text-indigo-700 font-medium text-sm"
              >
                {topic}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-base font-medium w-full text-center py-6 bg-white border border-dashed border-indigo-200 rounded-xl">
              ❗You haven't completed any quiz yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
