import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import LoadingWithQuote from "../components/LoadingWithQuotes";
import Select from "react-select";
import {validTopics} from "../data/validTopic";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const login = useAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const userPayload = {
        name,
        username,
        password,
        email,
        progress: topics,
      };

      const res = await api.post("/register", userPayload);

      if (res.status === 201) {
        const userData = res.data.user;
        login(userData.username);
        setProfile(userData);
        navigate(`/dashboard/${userData.username}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const topicOptions = validTopics.map((topic) => ({
    value: topic,
    label: topic,
  }));

  return (
    <div className="card bg-dark text-white p-4 shadow-lg rounded" style={{ maxWidth: "480px", width: "100%" }}>
      <h2 className="card-title text-center text-primary mb-4 fs-2">Register</h2>
      {isLoading ? (
        <LoadingWithQuote />
      ) : (
        <p className="text-center text-white mb-4">Create your account to get started!</p>
      )}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label text-white">Full Name:</label>
          <input
            ref={nameRef}
            id="fullName"
            type="text"
            className="form-control form-control-lg bg-dark-subtle text-dark-contrast border-secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="regUsername" className="form-label text-white">Username:</label>
          <input
            id="regUsername"
            type="text"
            className="form-control form-control-lg bg-dark-subtle text-dark-contrast border-secondary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="regPassword" className="form-label text-white">Password:</label>
          <input
            id="regPassword"
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg bg-dark-subtle text-dark-contrast border-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            disabled={isLoading}
          />
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
            />
            <label htmlFor="showPassword" className="form-check-label text-white">Show Password</label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">Email:</label>
          <input
            id="email"
            type="email"
            className="form-control form-control-lg bg-dark-subtle text-dark-contrast border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="topics" className="form-label text-white">
            Topics Already Covered:
          </label>
          <Select
            id="topics"
            isMulti
            options={topicOptions}
            onChange={(selected) => setTopics(selected.map((opt) => opt.value))}
            isDisabled={isLoading}
            className="text-dark"
            classNamePrefix="select"
            placeholder="Select covered topics"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
          Register
        </button>
      </form>

      {error && <div className="alert alert-danger mt-4 text-center">{error}</div>}

      <p className="mt-4 text-center text-white">
        Already have an account?{" "}
        <Link to="/login" className="text-info fw-bold">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
