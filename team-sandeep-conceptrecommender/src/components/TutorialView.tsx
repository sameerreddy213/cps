//Author: Sai Lokesh, Mondi
import React from 'react';
import { Topic } from '../types';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Play,
  Video,
  BookOpen
} from 'lucide-react';

interface TutorialViewProps {
  topic: Topic;
  onBack: () => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({ 
  topic, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Topics</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
              <p className="text-gray-600">{topic.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Video className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">
                      {topic.tutorials.filter(t => t.completed).length}/{topic.tutorials.length}
                    </div>
                    <div className="text-xs text-gray-600">Tutorials</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{topic.totalProblems}</div>
                    <div className="text-xs text-gray-600">Problems</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorials List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Tutorials</h2>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">{topic.tutorials.length} tutorials available</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {topic.tutorials.map((tutorial, index) => (
                    <div 
                      key={tutorial.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tutorial.completed ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {tutorial.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Play className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{tutorial.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{tutorial.duration}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <button 
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                tutorial.completed
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {tutorial.completed ? 'Review' : 'Start Tutorial'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
