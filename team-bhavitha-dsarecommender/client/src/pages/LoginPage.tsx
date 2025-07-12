import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import LoadingWithQuote from "../components/LoadingWithQuotes";
import { motion } from "framer-motion";
import { LogIn, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authApi.post("/login", { username, password });
      if (res.status === 200) {
        const userData = res.data.user;
        login(userData.username, userData.role);
        setProfile(userData);
        navigate(`/dashboard/${userData.username}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please check your credentials.";
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
        style={{ maxWidth: "480px", width: "100%" }}
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
              <LogIn size={48} className="text-primary" />
            </motion.div>
            <h2 className="card-title text-gradient fs-1 fw-bold mb-2">Welcome Back</h2>
          </motion.div>

          {isLoading ? (
            <LoadingWithQuote />
          ) : (
            <motion.form onSubmit={handleLogin} variants={itemVariants}>
              <div className="mb-4">
                <label htmlFor="username" className="form-label text-white fw-semibold d-flex align-items-center">
                  <User size={18} className="me-2" />
                  Username
                </label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    id="username"
                    type="text"
                    className="form-control form-control-lg focus-ring"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label text-white fw-semibold d-flex align-items-center">
                  <Lock size={18} className="me-2" />
                  Password
                </label>
                <motion.div
                  className="position-relative"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg focus-ring pe-5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                    Signing In...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <LogIn size={20} className="me-2" />
                    Sign In
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
              <AlertCircle size={20} className="me-2" />
              {error}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-4"
            variants={itemVariants}
          >
            <p className="text-secondary mb-0">
              Don't have an account?{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                  Register
                </Link>
              </motion.span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;