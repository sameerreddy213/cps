import React from 'react';
import { Users, Target, Award } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration tools and shared workspaces."
    },
    {
      icon: <Target size={32} />,
      title: "Goal Tracking",
      description: "Set and achieve your objectives with our comprehensive goal tracking system."
    },
    {
      icon: <Award size={32} />,
      title: "Achievement System",
      description: "Celebrate milestones and track progress with our built-in achievement system."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make our platform the perfect choice for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-blue-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;