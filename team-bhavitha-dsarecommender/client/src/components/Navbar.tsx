import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { UserCircle, LogOut, Home, BookOpen, Target, MessageCircle, Upload, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const username = useUserStore((state) => state.username);
  const role = useUserStore((state) => state.role);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const protectedLink = (path: string) =>
    isAuthenticated ? path : "/register";

  const brandLink = isAuthenticated
    ? role === "educator"
      ? "/dashboard"
      : `/dashboard/${username}`
    : "/";

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.nav 
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-fluid">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={brandLink} className="navbar-brand fs-3 fw-bold text-gradient">
            LearnFlow
          </Link>
        </motion.div>
        
        <button
          className="navbar-toggler border-0 focus-ring"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {isAuthenticated && role === "educator" ? (
              <>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <BarChart3 size={18} className="me-2" />
                    Dashboard
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/discuss"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <MessageCircle size={18} className="me-2" />
                    Discussions
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/educator/upload"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <Upload size={18} className="me-2" />
                    Upload Materials
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/educator/questions"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <BookOpen size={18} className="me-2" />
                    Questions Asked
                  </NavLink>
                </motion.li>
              </>
            ) : isAuthenticated ? (
              <>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to={protectedLink(`/dashboard/${username}`)}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${
                        isActive || location.pathname === `/dashboard` ? "active-link" : ""
                      }`
                    }
                  >
                    <Home size={18} className="me-2" />
                    Dashboard
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to={protectedLink("/quiz-select")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <Target size={18} className="me-2" />
                    Take Quiz
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to={protectedLink("/recommend")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <BookOpen size={18} className="me-2" />
                    Get Recommendation
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to={protectedLink("/playground")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <MessageCircle size={18} className="me-2" />
                    Ask Dhruv
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/discuss"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    <MessageCircle size={18} className="me-2" />
                    Discuss
                  </NavLink>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 d-flex align-items-center ${isActive ? "active-link" : ""}`
                    }
                  >
                    Sign In
                  </NavLink>
                </motion.li>
                <motion.li className="nav-item" variants={navItemVariants} initial="hidden" animate="visible" whileHover="hover">
                  <Link
                    to="/register"
                    className="btn btn-success px-4 py-2 ms-lg-3"
                  >
                    Sign Up
                  </Link>
                </motion.li>
              </>
            )}

            {isAuthenticated && (
              <motion.li 
                className="nav-item dropdown" 
                variants={navItemVariants} 
                initial="hidden" 
                animate="visible" 
                whileHover="hover"
              >
                <motion.a
                  className="nav-link dropdown-toggle d-flex align-items-center text-white fw-semibold mx-2"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserCircle size={20} className="me-2" />
                  {username}
                </motion.a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link to={brandLink} className="dropdown-item d-flex align-items-center">
                      <Home size={16} className="me-2" />
                      Dashboard
                    </Link>
                  </motion.li>
                  <li><hr className="dropdown-divider" /></li>
                  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <motion.button 
                      onClick={handleLogout} 
                      className="dropdown-item text-danger d-flex align-items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut size={16} className="me-2" />
                      Logout
                    </motion.button>
                  </motion.li>
                </ul>
              </motion.li>
            )}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
