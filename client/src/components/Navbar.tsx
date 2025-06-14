// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";

// const NavBar = () => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const navigate = useNavigate();

//   const handleProtectedRoute = (path: string) => {
//     if (isAuthenticated) navigate(path);
//     else navigate("/register");
//   };

//   return (
//     <nav className="bg-indigo-900 text-white shadow">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold text-indigo-100">
//           LearnFlow
//         </Link>
//         <div className="space-x-6">
//           <button onClick={() => handleProtectedRoute("/dashboard")} className="hover:text-indigo-300">
//             Dashboard
//           </button>
//           <button onClick={() => handleProtectedRoute("/quiz-select")} className="hover:text-indigo-300">
//             Take Quiz
//           </button>
//           <button onClick={() => handleProtectedRoute("/recommend")} className="hover:text-indigo-300">
//             Get Recommendation
//           </button>
//           <button onClick={() => navigate("/login")} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
//             Login
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleProtectedRoute = (path: string) => {
    if (isAuthenticated) navigate(path);
    else navigate("/register");
  };

  return (
    <nav className="bg-indigo-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-100">
          LearnFlow
        </Link>
        <div className="space-x-6">
          <button onClick={() => handleProtectedRoute("/dashboard")} className="hover:text-indigo-300">
            Dashboard
          </button>
          <button onClick={() => handleProtectedRoute("/quiz-select")} className="hover:text-indigo-300">
            Take Quiz
          </button>
          <button onClick={() => handleProtectedRoute("/recommend")} className="hover:text-indigo-300">
            Get Recommendation
          </button>
          <button onClick={() => navigate("/login")} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

