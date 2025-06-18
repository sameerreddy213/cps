import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const userPayload = {
        name,
        username,
        password,
        email,
        progress: topics.split(",").map((topic) => topic.trim()).filter(Boolean),
      };

      const res = await axios.post("http://localhost:5000/api/register", userPayload);

      if (res.status === 201) {
        const userData = res.data.user;
        login(userData.username);
        setProfile(userData);
        navigate(`/dashboard/${userData.username}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="card bg-dark text-white p-4 shadow-lg rounded" style={{ maxWidth: '480px', width: '100%' }}>
      {/* Heading - Ensure it's clear and stands out */}
      <h2 className="card-title text-center text-primary mb-4 fs-2">Register</h2> {/* Added fs-2 for larger font-size */}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label text-white">Full Name:</label> {/* Changed to text-white for better contrast */}
          <input
            id="fullName"
            type="text"
            className="form-control form-control-lg bg-dark text-white border-secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="regUsername" className="form-label text-white">Username:</label> {/* Changed to text-white */}
          <input
            id="regUsername"
            type="text"
            className="form-control form-control-lg bg-dark text-white border-secondary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="regPassword" className="form-label text-white">Password:</label> {/* Changed to text-white */}
          <input
            id="regPassword"
            type="password"
            className="form-control form-control-lg bg-dark text-white border-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">Email:</label> {/* Changed to text-white */}
          <input
            id="email"
            type="email"
            className="form-control form-control-lg bg-dark text-white border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="topicsCovered" className="form-label text-white">Topics Already Covered (comma-separated):</label> {/* Changed to text-white */}
          <textarea
            id="topicsCovered"
            className="form-control bg-dark text-white border-secondary"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g. Recursion, Loops, Functions"
            rows={4}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100">Register</button>
      </form>

      {error && <div className="alert alert-danger mt-4 text-center">{error}</div>}
      {/* Backtext/Link - Ensure it's clear and clickable */}
      <p className="mt-4 text-center text-white"> {/* Changed to text-white for visibility */}
        Already have an account? <Link to="/login" className="text-info fw-bold">Login</Link> {/* Added fw-bold for emphasis */}
      </p>
    </div>
  );
};

export default RegisterPage;