import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleQuizNavigation = () => {
    navigate(isAuthenticated ? '/quiz-select' : '/login');
  };

  const handleExploreNavigation = () => {
    // Assuming there will be an /explore route in the future
    navigate('/explore');
  };

  const handleRecommendationNavigation = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login'); // Direct to dashboard where path recommendation is
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h2 className="display-4 fw-bold text-primary">Welcome to LearnFlow!</h2>
            <p className="lead text-secondary">Your personalized learning journey starts here.</p>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <hr className="my-5 border-secondary border-2 opacity-50" />
      <div className="row justify-content-center mb-5 g-4">
        <div className="col-md-6 col-lg-5">
          <div className="card h-100 shadow border-primary border-2">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h4 className="card-title text-success fw-bold mb-3">New to LearnFlow?</h4>
              <p className="card-text text-center text-secondary mb-4">
                Create your free account and embark on a personalized learning adventure tailored just for you.
              </p>
              <button onClick={() => navigate('/register')} className="btn btn-success btn-lg w-75">
                Register Now
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="card h-100 shadow border-primary border-2">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h4 className="card-title text-primary fw-bold mb-3">Already a Member?</h4>
              <p className="card-text text-center text-secondary mb-4">
                Welcome back! Log in to pick up where you left off and continue mastering new concepts.
              </p>
              <button onClick={() => navigate('/login')} className="btn btn-primary btn-lg w-75">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <hr className="my-5 border-secondary border-2 opacity-50" />
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-info mb-4 fs-2">Unlock Your Potential with LearnFlow</h3>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary fw-bold mb-2">Personalized Paths</h5>
                  <p className="text-secondary mb-0">Discover the shortest learning path from your current knowledge to your target concept.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary fw-bold mb-2">Adaptive Quizzes</h5>
                  <p className="text-secondary mb-0">Test your understanding and adapt your progress path based on quiz performance.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary fw-bold mb-2">Progress Tracking</h5>
                  <p className="text-secondary mb-0">Visualize your journey through quizzes, weights, and time recommendations.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary fw-bold mb-2">Knowledge Graph</h5>
                  <p className="text-secondary mb-0">Build deep conceptual understanding through connected topic paths.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <hr className="my-5 border-secondary border-2 opacity-50" />
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-info mb-4 fs-2">Ready to Start?</h3>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-4">
            <button
              onClick={handleQuizNavigation}
              className="btn btn-warning btn-lg px-5 py-3 flex-fill"
            >
              Take a Quiz
            </button>
            <button
              onClick={handleExploreNavigation}
              className="btn btn-info btn-lg px-5 py-3 flex-fill"
            >
              Explore Topics
            </button>
            <button
              onClick={handleRecommendationNavigation}
              className="btn btn-primary btn-lg px-5 py-3 flex-fill"
            >
              Get Recommendation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;