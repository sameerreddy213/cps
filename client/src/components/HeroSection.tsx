import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-indigo-800 via-indigo-900 to-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-32 md:flex md:items-center md:justify-between">
        {/* Left text block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Personalized Learning, 
            <span className="text-indigo-300 block"> Powered by Knowledge Graphs</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Enter your current knowledge. Set a goal. Follow the shortest path. Quiz and learn along the way.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/learn-more')}
              className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mt-12 md:mt-0"
        >
          <div className="bg-white bg-opacity-5 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900">Adaptive Quizzes</h3>
              <p className="text-indigo-800">Generated on-the-fly based on your learning journey.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900">Shortest Path</h3>
              <p className="text-indigo-800">Smart graph traversal from your current to target knowledge.</p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900">Track Progress</h3>
              <p className="text-indigo-800">Mastery score per topic. Visual feedback after every quiz.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
