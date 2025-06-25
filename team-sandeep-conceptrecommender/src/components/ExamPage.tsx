// Created by : Venkata Sai Pranav Balusu and Pentapati V V Satya Pavan Sandeep
import React, { useState, useEffect } from 'react';
import { UserProfile } from './UserProfile';
import { ProgressChart } from './ProgressChart';
import { TopicCard } from './TopicCard';
import { RecommendedTopics } from './RecommendedTopics';
import { KnownTopics } from './KnownTopics';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { Topic, User } from '../types';
import { CurrentTopics } from './CurrentTopics';
import { Recommendations } from './Recommendations';
import { Progress } from './Progress';
import axios from 'axios';
import SelectKnownTopics from '../pages/SelectKnownTopics';
import { ExamPage } from './ExamPage';
import { getRandomQuizQuestions, submitExamResult } from '../services/api';
import { TutorialView } from './TutorialView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'overview' | 'topics' | 'progress' | 'recommendations';

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<User>(user);
  const [showSelectKnown, setShowSelectKnown] = useState(false);
  const [examTopic, setExamTopic] = useState<Topic | null>(null);
  const [examInProgress, setExamInProgress] = useState(false);
  const [examQuestions, setExamQuestions] = useState<any[] | null>(null);
  const [userTopics, setUserTopics] = useState<any[]>([]);
  const [tutorialsTopic, setTutorialsTopic] = useState<Topic | null>(null);
  const [tutorialsInProgress, setTutorialsInProgress] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/topics', {
          headers: {
            Authorization: Bearer ${token}
          }
        });
        setTopics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load topics');
        setLoading(false);
      }
    };
    fetchTopics();
  }, [user]);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/user-topics/my', {
          headers: { Authorization: Bearer ${token} }
        });
        setUserTopics(response.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchUserTopics();
  }, []);

  // Merge userTopics status/progress into topics for display
  const currentTopics = userTopics
    .filter(ut => ut.status === 'in-progress')
    .map(ut => {
      const topic = topics.find(
        t => t.name.trim().toLowerCase() === ut.topicName.trim().toLowerCase()
      );
      return topic ? { ...topic, ...ut } : null;
    })
    .filter(Boolean);

  const knownTopics = userTopics
    .filter(ut => ut.status === 'completed')
    .map(ut => {
      const topic = topics.find(
        t => t.name.trim().toLowerCase() === ut.topicName.trim().toLowerCase()
      );
      return topic ? { ...topic, ...ut } : null;
    })
    .filter(Boolean);

  // Debug logs for troubleshooting Current Topics
  console.log('userTopics:', userTopics);
  console.log('topics:', topics);
  console.log('currentTopics:', currentTopics);

  // For recommendations
  // Normalize topic names for robust matching
  // Proper recommendations logic: Only recommend topics that have prerequisites, all prerequisites are completed, and the topic itself is not completed
  const completedTopicNames = new Set(
    userTopics
      .filter(t => t.status === 'completed')
      .map(t => t.topicName.trim().toLowerCase())
  );
  const recommendedTopics = topics.filter(topic => {
    // Only recommend if topic has prerequisites
    if (!topic.prerequisites || topic.prerequisites.length === 0) return false;
    // Only recommend if all prerequisites are completed
    const allPrereqsCompleted = topic.prerequisites.every(
      prereq => completedTopicNames.has(prereq.trim().toLowerCase())
    );
    // Only recommend if the topic itself is not completed
    const topicCompleted = completedTopicNames.has(topic.name.trim().toLowerCase());
    return allPrereqsCompleted && !topicCompleted;
  });

  // Store recommended topics in the backend when they are shown to the user
  useEffect(() => {
    if (recommendedTopics.length === 0 || !localUser?.email) return;
    const storedKey = lastRecommended_${localUser.email};
    const lastSent = localStorage.getItem(storedKey);
    const currentSet = JSON.stringify(recommendedTopics.map(t => t.name).sort());
    if (lastSent === currentSet) return;
    const sendRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5001/api/recommendations', {
          userEmail: localUser.email,
          recommendedTopics: recommendedTopics.map(t => t.name),
          shownAt: new Date().toISOString()
        }, {
          headers: { Authorization: Bearer ${token} }
        });
        localStorage.setItem(storedKey, currentSet);
      } catch (err) {
        // Optionally handle error
      }
    };
    sendRecommendations();
  }, [recommendedTopics, localUser]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'topics', label: 'Topics' },
    { id: 'progress', label: 'Progress' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  const handleAddKnownTopics = async (selectedTopicNames: string[]) => {
    const selectedTopic = topics.find(topic => topic.name === selectedTopicNames[0]);
    if (selectedTopic) {
      try {
        const questions = await getRandomQuizQuestions(selectedTopic.name, 10);
        setExamQuestions(questions);
        setExamTopic(selectedTopic);
        setExamInProgress(true);
      } catch (err) {
        alert('Failed to load quiz questions.');
      }
    }
    setShowSelectKnown(false);
  };

  // Update handleExamComplete to accept all fields
  const handleExamComplete = async ({ score, totalQuestions, correctAnswers, timeTaken }: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number;
  }) => {
    if (!examTopic) return;
    // Frontend validation
    if (
      typeof score !== 'number' ||
      typeof totalQuestions !== 'number' ||
      typeof correctAnswers !== 'number' ||
      typeof timeTaken !== 'number' ||
      isNaN(score) || isNaN(totalQuestions) || isNaN(correctAnswers) || isNaN(timeTaken)
    ) {
      alert('Invalid exam result data. Please try again.');
      return;
    }
    try {
      await submitExamResult({
        topicName: examTopic.name,
        score,
        totalQuestions,
        correctAnswers,
        timeTaken
      });
    } catch (err) {
      alert('Failed to save exam result.');
    }
    setTopics(prevTopics => prevTopics.map(topic =>
      topic.name === examTopic.name
        ? { ...topic, status: score >= 60 ? 'completed' : 'in-progress', examScore: score }
        : topic
    ));
    setExamInProgress(false);
    setExamTopic(null);
  };

  const handleExamBack = () => {
    setExamInProgress(false);
    setExamTopic(null);
  };

  const handleStartTutorials = (topicName: string) => {
    const topic = topics.find(t => t.name === topicName);
    if (topic) {
      setTutorialsTopic(topic);
      setTutorialsInProgress(true);
    }
  };

  const handleTutorialsBack = () => {
    setTutorialsInProgress(false);
    setTutorialsTopic(null);
  };

  const handleTakeExam = async (topicName: string) => {
    const topic = topics.find(t => t.name === topicName);
    if (topic) {
      setExamTopic(topic);
      setExamInProgress(true);
      
      try {
        const questions = await getRandomQuizQuestions(topicName);
        setExamQuestions(questions);
      } catch (error) {
        console.error('Error fetching exam questions:', error);
        setExamInProgress(false);
        setExamTopic(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exam Modal */}
      {examInProgress && examTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <ExamPage 
              topic={examTopic} 
              onBack={handleExamBack} 
              onComplete={handleExamComplete}
              questions={examQuestions || []}
            />
          </div>
        </div>
      )}

      {/* Tutorials Modal */}
      {tutorialsInProgress && tutorialsTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl w-full relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <TutorialView 
              topic={tutorialsTopic} 
              onBack={handleTutorialsBack}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">DSA AI Tutor</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search topics..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <button 
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as Tab); setIsMenuOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {localUser.name}!</h1>
                    <p className="text-blue-100">Ready to continue your DSA learning journey?</p>
                  </div>
                  <div className="hidden md:block text-right max-w-xs">
                    <p className="italic text-lg font-semibold opacity-90">“Mastering DSA opens the door to opportunities you haven't imagined yet.”</p>
                  </div>
                </div>
              </div>

              {/* User Profile and Progress */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <UserProfile 
                    user={localUser} 
                    onProfileImageChange={(imageUrl) => setLocalUser(prev => ({ ...prev, profileImage: imageUrl }))}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ProgressChart data={localUser.progress || []} />
                </div>
              </div>

              {/* AI Recommendations */}
              <RecommendedTopics 
                topics={topics}
                recommendations={[]}
              />

              {/* Known Topics */}
              <KnownTopics 
                topics={knownTopics}
                onAddKnownTopics={() => setShowSelectKnown(true)}
                onReview={handleStartTutorials}
              />
              {knownTopics.length === 0 && (
                <div className="text-red-500 mt-2">No known topics found.</div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Topics</h2>
                <CurrentTopics topics={currentTopics} onStartTopic={handleStartTutorials} />
              </div>
              {showSelectKnown && !examInProgress && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      onClick={() => setShowSelectKnown(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <SelectKnownTopics onContinue={handleAddKnownTopics} />
                  </div>
                </div>
              )}

              <Recommendations user={localUser} recommendedTopics={recommendedTopics} onStartTopic={handleStartTutorials} />
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">All DSA Topics</h1>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <span className="text-lg font-medium text-gray-700">{topics.length} Topics Available</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map(topic => (
                  <TopicCard 
                    key={topic.name} 
                    topic={topic} 
                    onStartTopic={handleStartTutorials}
                    onTakeExam={handleTakeExam}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-medium text-gray-700">Detailed Analytics</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <UserProfile 
                  user={localUser} 
                  onProfileImageChange={(imageUrl) => setLocalUser(prev => ({ ...prev, profileImage: imageUrl }))}
                />
                <ProgressChart data={localUser.progress || []} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Progress History</h3>
                <div className="space-y-4">
                  {localUser.progress?.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">Topic {result.topicName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(result.lastAttempted).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                        <div className="text-sm text-gray-600">
                          {result.completed ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Progress data={localUser.progress || []} />

              {/* Current Topics from user progress */}
              {currentTopics.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Topics (from your progress)</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentTopics.map(topic => (
                      <div key={topic.topicName} className="p-4 bg-white rounded shadow">
                        <div className="font-semibold">{topic.topicName}</div>
                        <div>Status: {topic.status}</div>
                        <div>Progress: {topic.progress}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Topics from user progress */}
              {knownTopics.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-green-700 mb-4">Completed Topics (from your progress)</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {knownTopics.map(topic => (
                      <div key={topic.topicName} className="p-4 bg-green-50 rounded shadow">
                        <div className="font-semibold">{topic.topicName}</div>
                        <div>Status: {topic.status}</div>
                        <div>Progress: {topic.progress}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-8">
              <Recommendations user={localUser} recommendedTopics={recommendedTopics} onStartTopic={handleStartTutorials} />
            </div>
          )}
        </>
      </main>
    </div>
  );
};
