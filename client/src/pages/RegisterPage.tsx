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
    <div className="card-base">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="regUsername">Username:</label>
          <input
            id="regUsername"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="regPassword">Password:</label>
          <input
            id="regPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="topicsCovered">Topics Already Covered (comma-separated):</label>
          <textarea
            id="topicsCovered"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="e.g. Recursion, Loops, Functions"
            rows={3}
          ></textarea>
        </div>

        <button type="submit" className="btn">Register</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;