import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { UserCircle } from "lucide-react";

const Navbar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const username = useUserStore((state) => state.username);
  const role = useUserStore((state) => state.role); // <-- Get role
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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid">
        <Link to={brandLink} className="navbar-brand fs-3 fw-bold text-primary">
          LearnFlow
        </Link>
        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            {isAuthenticated && role === "educator" ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/discuss"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Discussions
                  </NavLink>
                </li>
              </>
            ) : isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to={protectedLink(`/dashboard/${username}`)}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${
                        isActive || location.pathname === `/dashboard` ? "active-link" : ""
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={protectedLink("/quiz-select")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Take Quiz
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={protectedLink("/recommend")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Get Recommendation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={protectedLink("/playground")}
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Ask Dhruv
                  </NavLink>
                  </li>
                <li className="nav-item">
                  <NavLink
                    to="/discuss"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Discuss
                  </NavLink>
                </li>
              <li>
                <NavLink
                  to={protectedLink(`/Assignments`)}
                  className={({ isActive }) =>
                    `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                  }
                >
                  Assignments
                </NavLink>

              </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link text-white fw-semibold mx-2 ${isActive ? "active-link" : ""}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-success px-4 py-2 ms-lg-3"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center text-white fw-semibold mx-2"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserCircle size={20} className="me-2" />
                  {username}
                </a>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                  <li>
                    <Link to={brandLink} className="dropdown-item">
                      <i className="bi bi-house-door me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
