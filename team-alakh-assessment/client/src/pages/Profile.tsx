import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Profile() {
  const [data, setData] = useState<{ passed: string[]; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); 
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await api.get('/api/user/passed', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setData(response.data);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err?.response?.data?.message || 'Something went wrong');
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>User: {data.email}</h2>
      <h3>Passed Topics:</h3>
      <ul>
        {data.passed.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
