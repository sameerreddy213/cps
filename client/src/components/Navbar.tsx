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
//     <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
//                 LearnFlow
//               </span>
//             </Link>
//           </div>
//           
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:flex items-center space-x-6">
//               <button 
//                 onClick={() => handleProtectedRoute("/dashboard")} 
//                 className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
//               >
//                 Dashboard
//               </button>
//               <button 
//                 onClick={() => handleProtectedRoute("/quiz-select")} 
//                 className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
//               >
//                 Take Quiz
//               </button>
//               <button 
//                 onClick={() => handleProtectedRoute("/recommend")} 
//                 className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
//               >
//                 Get Recommendation
//               </button>
//             </div>
//             

//             <div className="flex items-center space-x-3">
//               <button 
//                 onClick={() => navigate("/login")} 
//                 className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//               >
//                 Login
//               </button>
//               <button 
//                 onClick={() => navigate("/register")} 
//                 className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>
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
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                LearnFlow
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => handleProtectedRoute("/dashboard")} 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleProtectedRoute("/quiz-select")} 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Take Quiz
              </button>
              <button 
                onClick={() => handleProtectedRoute("/recommend")} 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Get Recommendation
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => navigate("/login")} 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate("/register")} 
                    className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => useAuthStore.getState().logout()} 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

