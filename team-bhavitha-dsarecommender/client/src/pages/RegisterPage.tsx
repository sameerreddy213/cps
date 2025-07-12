import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import Select from "react-select";
import { validTopics } from "../data/validTopic";
import { Eye, EyeOff, User, Mail, Lock, BookOpen, GraduationCap } from "lucide-react";
import LoadingWithQuotes from "../components/LoadingWithQuotes";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"student" | "educator">("student");
  const [eid, setEid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  const getPasswordStrength = (password: string): { score: number; label: string } => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (password.length >= 10) score++;

    const labels = ["Too Weak", "Weak", "Moderate", "Strong", "Very Strong"];
    return { score, label: labels[score] };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one uppercase letter and one special character.");
      setIsLoading(false);
      return;
    }
    if (role === "educator") {
    const eidPattern = /^\d{16}$/;
    if (!eidPattern.test(eid.trim())) {
      setError("Educator ID must be exactly 16 digits.");
      setIsLoading(false);
      return;
    }
  }

    try {
      const userPayload = {
        name,
        username,
        password,
        email,
        progress: topics,
        role,
        eid: role === "educator" ? eid.trim() : undefined,
      };

      const res = await authApi.post("/register", userPayload);

      if (res.status === 201) {
        const userData = res.data.user;
        login(userData.username, userData.role);
        setProfile(userData);
        navigate(`/dashboard/${userData.username}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      className="d-flex justify-content-center align-items-center min-vh-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="card bg-gradient-secondary border-0 shadow-2xl"
        style={{ maxWidth: "800px", width: "100%" }}
        variants={itemVariants}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-body p-5">
          <motion.div 
            className="text-center mb-4"
            variants={itemVariants}
          >
            <motion.div
              className="mb-3"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <User size={48} className="text-primary" />
            </motion.div>
            <h2 className="card-title text-gradient fs-1 fw-bold mb-2">Create Account</h2>
          </motion.div>

          {isLoading ? (
            <LoadingWithQuotes />
          ) : (
            <motion.form onSubmit={handleRegister} variants={itemVariants}>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="fullName" className="form-label text-white fw-semibold d-flex align-items-center">
                    <User size={18} className="me-2" />
                    Full Name
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="fullName"
                      type="text"
                      className="form-control form-control-lg focus-ring"
                      placeholder="e.g. Anurag Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="regUsername" className="form-label text-white fw-semibold d-flex align-items-center">
                    <User size={18} className="me-2" />
                    Username
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="regUsername"
                      type="text"
                      className="form-control form-control-lg focus-ring"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="email" className="form-label text-white fw-semibold d-flex align-items-center">
                    <Mail size={18} className="me-2" />
                    Email
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg focus-ring"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="role" className="form-label text-white fw-semibold d-flex align-items-center">
                    <GraduationCap size={18} className="me-2" />
                    Role
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <select
                      id="role"
                      className="form-control form-control-lg focus-ring"
                      value={role}
                      onChange={(e) => setRole(e.target.value as "student" | "educator")}
                      disabled={isLoading}
                    >
                      <option value="student">Student</option>
                      <option value="educator">Educator</option>
                    </select>
                  </motion.div>
                </div>
              </div>

              {role === "educator" && (
                <div className="mb-4">
                  <label htmlFor="eid" className="form-label text-white fw-semibold d-flex align-items-center">
                    <BookOpen size={18} className="me-2" />
                    Educator ID
                  </label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="eid"
                      type="text"
                      className="form-control form-control-lg focus-ring"
                      placeholder="Enter 16-digit Educator ID"
                      value={eid}
                      onChange={(e) => setEid(e.target.value)}
                      required={role === "educator"}
                      disabled={isLoading}
                    />
                  </motion.div>
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="regPassword" className="form-label text-white fw-semibold d-flex align-items-center">
                    <Lock size={18} className="me-2" />
                    Password
                  </label>
                  <motion.div
                    className="position-relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="regPassword"
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg focus-ring pe-5"
                      placeholder="Use at least 1 uppercase & special character"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <motion.button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ zIndex: 10 }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </motion.div>
                  <div className="progress mt-2" style={{ height: "6px" }}>
                    <motion.div
                      className={`progress-bar ${["bg-danger", "bg-warning", "bg-info", "bg-success"][
                        passwordStrength.score - 1
                      ] || "bg-secondary"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <small className="text-muted">Strength: {passwordStrength.label}</small>
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="confirmPassword" className="form-label text-white fw-semibold d-flex align-items-center">
                    <Lock size={18} className="me-2" />
                    Confirm Password
                  </label>
                  <motion.div
                    className="position-relative"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control form-control-lg focus-ring pe-5"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <motion.button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{ zIndex: 10 }}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary btn-lg w-100 mb-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner me-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <User size={20} className="me-2" />
                    Create Account
                  </div>
                )}
              </motion.button>
            </motion.form>
          )}

          {error && (
            <motion.div
              className="alert alert-danger mt-4 d-flex align-items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-4"
            variants={itemVariants}
          >
            <p className="text-secondary mb-0">
              Already have an account?{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                  Sign In
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;