import { useNavigate } from 'react-router-dom';
// No Navbar, HeroSection, Footer imports here as their content is now integrated or removed
// Navbar will be a standalone element wrapping the main content implicitly or explicitly in App.tsx layout
// Footer content is moved to the end of this component

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container"> {/* Main container for dashboard-like style */}
      <h2>Welcome to LearnFlow!</h2>
      <p style={{ fontSize: '1.1em', color: '#b0b0b0', marginBottom: '2.5rem' }}>Your personalized learning journey starts here.</p>

      {/* Get Started Section - Mimicking dashboard's card grid */}
      <div className="dashboard-section">
        <h3>Start Your Learning Journey</h3>
        <div className="card-grid">
          <div className="card-base"> {/* Card for new users */}
            <h4>New to LearnFlow?</h4>
            <p style={{ fontSize: '0.95em', color: '#b0b0b0', marginBottom: '1.5rem' }}>
              Create your free account and embark on a personalized learning adventure tailored just for you.
            </p>
            <button onClick={() => navigate('/register')} className="btn btn-secondary">
              Register Now
            </button>
          </div>
          <div className="card-base"> {/* Card for returning users */}
            <h4>Already a Member?</h4>
            <p style={{ fontSize: '0.95em', color: '#b0b0b0', marginBottom: '1.5rem' }}>
              Welcome back! Log in to pick up where you left off and continue mastering new concepts.
            </p>
            <button onClick={() => navigate('/login')} className="btn">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Features Section - Mimicking dashboard lists */}
      <div className="dashboard-section">
        <h3>Unlock Your Potential with LearnFlow</h3>
        <ul className="mastery-list" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <li style={{ justifyContent: 'center' }}>
            <strong style={{ color: '#a8c8e9' }}>Personalized Paths:</strong> Discover the most efficient learning path from your current knowledge to your desired expertise.
          </li>
          <li style={{ justifyContent: 'center' }}>
            <strong style={{ color: '#a8c8e9' }}>Adaptive Quizzes:</strong> Master concepts with dynamically generated quizzes that adapt to your performance.
          </li>
          <li style={{ justifyContent: 'center' }}>
            <strong style={{ color: '#a8c8e9' }}>Comprehensive Progress Tracking:</strong> Visualize your mastery over time and identify areas for improvement.
          </li>
          <li style={{ justifyContent: 'center' }}>
            <strong style={{ color: '#a8c8e9' }}>Concept Mastery:</strong> Build strong, interconnected foundations with our knowledge graph-powered learning.
          </li>
        </ul>
      </div>

      {/* Direct Quiz Call to Action - Similar to dashboard's actions-group */}
      <div className="dashboard-section actions-group">
        <button onClick={() => navigate("/quiz-select")} className="btn btn-warning">
          Or, Choose Your Own Quiz Topic
        </button>
      </div>

      {/* Integrated Footer Content (minimal) */}
      <div className="dashboard-section" style={{ borderTop: 'none', paddingTop: '2rem', marginBottom: '0' }}>
        <p style={{ color: '#b0b0b0', fontSize: '0.9em', textAlign: 'center' }}>
          © {new Date().getFullYear()} LearnFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default HomePage;