import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={32} />
                  </div>
                  <h3 className="text-xl font-semibold">Amazing Product</h3>
                  <p className="text-sm opacity-90 mt-2">Experience the future</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Hero Content */}
          <div className="order-1 md:order-2">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Something
              <span className="text-blue-600 block">Amazing Today</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your ideas into reality with our powerful platform. 
              Join thousands of creators who are already building the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center group transition-all duration-300"
              >
                Get Started Free
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
                Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <span className="ml-3 text-gray-600">1000+ happy users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;