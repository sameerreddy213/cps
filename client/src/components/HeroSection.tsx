import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 lg:pr-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 lg:text-6xl">
              Personalized Learning
              <span className="block text-indigo-600 mt-2">Powered by Knowledge Graphs</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-3xl">
              Enter your current knowledge. Set a goal. Follow the shortest path. Quiz and learn along the way.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => navigate('/register')}
                className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all duration-200"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/learn-more')}
                className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Learn More <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 lg:mt-0 lg:w-1/2"
          >
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Adaptive Quizzes</h3>
                  <p className="mt-2 text-gray-600">Generated on-the-fly based on your learning journey.</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Shortest Path</h3>
                  <p className="mt-2 text-gray-600">Smart graph traversal from your current to target knowledge.</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                  <p className="mt-2 text-gray-600">Mastery score per topic. Visual feedback after every quiz.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-x-0 top-0 hidden h-[37.5rem] overflow-hidden blur-3xl sm:block" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
};

export default HeroSection;
