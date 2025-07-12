import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, Users, ArrowRight, Award, Lightbulb } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleQuizNavigation = () => {
    navigate(isAuthenticated ? '/quiz-select' : '/login');
  };

  const handleExploreNavigation = () => {
    navigate('/explore');
  };

  const handleRecommendationNavigation = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="container py-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div className="row justify-content-center mb-6" variants={itemVariants}>
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-5">
            <motion.h1 
              className="display-3 fw-bold text-gradient mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Welcome to LearnFlow!
            </motion.h1>

            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Get Started Section */}
      <motion.div className="row justify-content-center mb-6 g-4" variants={itemVariants}>
        <div className="col-md-6 col-lg-5">
          <motion.div 
            className="card h-100 shadow-xl border-gradient clickable-card"
            variants={cardVariants}
            whileHover="hover"
            onClick={() => navigate('/register')}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center p-5">
              <motion.div 
                className="mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen size={48} className="text-success" />
              </motion.div>
              <h4 className="card-title text-success fw-bold mb-3">New to LearnFlow?</h4>
              
              <motion.button 
                className="btn btn-success btn-lg w-75"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
                <ArrowRight size={20} className="ms-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="col-md-6 col-lg-5">
          <motion.div 
            className="card h-100 shadow-xl border-gradient clickable-card"
            variants={cardVariants}
            whileHover="hover"
            onClick={() => navigate('/login')}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center p-5">
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Users size={48} className="text-primary" />
              </motion.div>
              <h4 className="card-title text-primary fw-bold mb-3">Already a Member?</h4>
              
              <motion.button 
                className="btn btn-primary btn-lg w-75"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
                <ArrowRight size={20} className="ms-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div className="row justify-content-center mb-6" variants={itemVariants}>
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-5">
            <motion.h2 
              className="fw-bold text-info mb-4 fs-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Unlock Your Potential with LearnFlow
            </motion.h2>

          </div>
          <div className="row g-4">
            {[
              {
                icon: Target,
                title: "Personalized Paths",
                description: "Discover the shortest learning path from your current knowledge to your target concept.",
                color: "text-primary"
              },
              {
                icon: TrendingUp,
                title: "Adaptive Quizzes",
                description: "Test your understanding and adapt your progress path based on quiz performance.",
                color: "text-success"
              },
              {
                icon: BookOpen,
                title: "Progress Tracking",
                description: "Visualize your journey through quizzes, weights, and time recommendations.",
                color: "text-warning"
              },
              {
                icon: Lightbulb,
                title: "Knowledge Graph",
                description: "Build deep conceptual understanding through connected topic paths.",
                color: "text-info"
              }
            ].map((feature, index) => (
              <motion.div 
                className="col-md-6" 
                key={index}
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="card bg-gradient-secondary border-0 shadow-lg h-100"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body text-center p-4">
                    <motion.div 
                      className={`mb-3 ${feature.color}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon size={40} />
                    </motion.div>
                    <h5 className={`fw-bold mb-3 ${feature.color}`}>{feature.title}</h5>

                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="row justify-content-center" variants={itemVariants}>
        <div className="col-12 col-md-10 col-lg-8">
          <div className="text-center mb-5">
            <motion.h2 
              className="fw-bold text-info mb-4 fs-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Ready to Start?
            </motion.h2>

          </div>
          <motion.div 
            className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={handleQuizNavigation}
              className="btn btn-warning btn-lg px-5 py-3 flex-fill"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target size={20} className="me-2" />
              Take a Quiz
            </motion.button>
            <motion.button
              onClick={handleExploreNavigation}
              className="btn btn-info btn-lg px-5 py-3 flex-fill"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen size={20} className="me-2" />
              Explore Topics
            </motion.button>
            <motion.button
              onClick={handleRecommendationNavigation}
              className="btn btn-primary btn-lg px-5 py-3 flex-fill"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Award size={20} className="me-2" />
              Get Recommendation
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="row justify-content-center mt-6"
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="col-12 col-md-8">
          <div className="card bg-gradient-secondary border-0 shadow-xl">
            <div className="card-body p-5">
              <div className="row text-center">
                <div className="col-md-4 mb-4 mb-md-0">
                  <motion.div 
                    className="h1 fw-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    1000+
                  </motion.div>

                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <motion.div 
                    className="h1 fw-bold text-success mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    50+
                  </motion.div>

                </div>
                <div className="col-md-4">
                  <motion.div 
                    className="h1 fw-bold text-warning mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    95%
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;