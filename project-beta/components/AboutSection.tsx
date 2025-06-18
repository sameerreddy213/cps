// Fix for src/components/AboutSection.tsx
import React from 'react';
import { Heart } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Our Platform
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We're passionate about creating tools that empower people to achieve their goals. 
              Our platform combines cutting-edge technology with intuitive design to deliver 
              an exceptional user experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4"></div>
                <p className="text-gray-600">Over 10,000 satisfied customers worldwide</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4"></div>
                <p className="text-gray-600">99.9% uptime guarantee</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4"></div>
                <p className="text-gray-600">24/7 customer support</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="w-full h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Heart size={48} className="mx-auto mb-4" />
                <h3 className="text-2xl font-semibold">Built with Love</h3>
                <p className="text-sm opacity-90 mt-2">For creators, by creators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;