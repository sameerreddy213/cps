import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (res.status === 200) {
        const userData = res.data.user;
        login(userData.username);
        setProfile(userData);
        navigate(`/dashboard/${userData.username}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="card-base">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;