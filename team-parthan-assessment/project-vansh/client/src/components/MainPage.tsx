import React, { useState, useRef } from 'react';
import { Brain,Trophy, BarChart3, Network, Clock, CheckCircle, AlertCircle, Play, User, RotateCcw, Upload, Youtube, FileText, Image, Loader, Plus, X, ExternalLink, XCircle } from 'lucide-react';
import type { Topic, UserProfile, CustomContent, Quiz, QuizQuestion } from '../interface/types';
import type { QuizState } from '../interface/types';

const MainPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'youtube' | 'pdf' | 'image'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customContents, setCustomContents] = useState<CustomContent[]>([]);
  const [generatedQuizzes, setGeneratedQuizzes] = useState<Quiz[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'custom'>('topics');
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const [quizHistory, setQuizHistory] = useState<QuizState[]>([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizState | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewQuiz, setReviewQuiz] = useState<QuizState | null>(null);

  

  const userProfile: UserProfile = {
    name: "Vansh Tuteja",
    masteredTopics: ["Arrays", "Strings", "Basic Math"],
    totalScore: 85,
    streak: 7
  };

  const topics: Topic[] = [
    {
      id: 'arrays',
      name: 'Arrays',
      prerequisites: [],
      status: 'mastered',
      score: 5,
      totalQuestions: 5
    },
    {
      id: 'strings',
      name: 'Strings',
      prerequisites: [],
      status: 'mastered',
      score: 5,
      totalQuestions: 5
    },
    {
      id: 'linked-lists',
      name: 'Linked Lists',
      prerequisites: ['arrays'],
      status: 'in-progress',
      score: 2,
      totalQuestions: 5
    },
    {
      id: 'stacks',
      name: 'Stacks',
      prerequisites: ['arrays', 'linked-lists'],
      status: 'not-started'
    },
    {
      id: 'queues',
      name: 'Queues',
      prerequisites: ['arrays', 'linked-lists'],
      status: 'not-started'
    },
    {
      id: 'trees',
      name: 'Binary Trees',
      prerequisites: ['linked-lists', 'recursion'],
      status: 'not-started'
    },
    {
      id: 'recursion',
      name: 'Recursion',
      prerequisites: ['arrays', 'strings'],
      status: 'not-started'
    },
    {
      id: 'sorting',
      name: 'Sorting Algorithms',
      prerequisites: ['arrays', 'recursion'],
      status: 'not-started'
    }
  ];

  const getTopicStatus = (topic: Topic) => {
    const allPrereqsMastered = topic.prerequisites.every(prereq =>
      topics.find(t => t.id === prereq)?.status === 'mastered'
    );

    if (topic.status === 'mastered') return 'mastered';
    if (topic.status === 'in-progress') return 'in-progress';
    if (allPrereqsMastered || topic.prerequisites.length === 0) return 'ready';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'ready': return <Play className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'in-progress': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'ready': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) return;

    setIsProcessing(true);
    const newContent: CustomContent = {
      id: Date.now().toString(),
      type: 'youtube',
      title: `YouTube Video - ${new Date().toLocaleDateString()}`,
      url: youtubeUrl,
      uploadDate: new Date().toISOString(),
      status: 'processing'
    };

    setCustomContents(prev => [...prev, newContent]);
    setYoutubeUrl('');
    setShowUploadModal(false);

    // Simulate AI processing
    setTimeout(() => {
      setCustomContents(prev =>
        prev.map(content =>
          content.id === newContent.id
            ? { ...content, status: 'ready', quizGenerated: true }
            : content
        )
      );

      // Generate sample quiz
      const sampleQuiz: Quiz = {
        id: `quiz-${newContent.id}`,
        title: 'AI Generated Quiz from YouTube Video',
        contentId: newContent.id,
        questions: [
          {
            id: '1',
            question: 'What is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 1,
            explanation: 'Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.'
          },
          {
            id: '2',
            question: 'Which data structure is best for implementing a recursive algorithm?',
            options: ['Array', 'Stack', 'Queue', 'Hash Table'],
            correctAnswer: 1,
            explanation: 'Stack is ideal for recursion as it follows LIFO principle, matching the recursive call pattern.'
          }
        ]
      };

      setGeneratedQuizzes(prev => [...prev, sampleQuiz]);
      setIsProcessing(false);
    }, 3000);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.includes('pdf') ? 'pdf' : 'image';

    setIsProcessing(true);
    const newContent: CustomContent = {
      id: Date.now().toString(),
      type: fileType,
      title: file.name,
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: 'processing'
    };

    setCustomContents(prev => [...prev, newContent]);
    setShowUploadModal(false);

    // Simulate AI processing
    setTimeout(() => {
      setCustomContents(prev =>
        prev.map(content =>
          content.id === newContent.id
            ? { ...content, status: 'ready', quizGenerated: true }
            : content
        )
      );

      const sampleQuiz: Quiz = {
        id: `quiz-${newContent.id}`,
        title: `AI Generated Quiz from ${file.name}`,
        contentId: newContent.id,
        questions: [
          {
            id: '1',
            question: 'Based on the uploaded content, what is a key concept in data structures?',
            options: ['Memory allocation', 'Data organization', 'Algorithm complexity', 'All of the above'],
            correctAnswer: 3,
            explanation: 'Data structures involve all these concepts: how data is organized, stored in memory, and affects algorithm performance.'
          }
        ]
      };

      setGeneratedQuizzes(prev => [...prev, sampleQuiz]);
      setIsProcessing(false);
    }, 4000);
  };

  const removeCustomContent = (id: string) => {
    setCustomContents(prev => prev.filter(content => content.id !== id));
    setGeneratedQuizzes(prev => prev.filter(quiz => quiz.contentId !== id));
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'image': return <Image className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

 const TOPIC_QUIZ_DATA = {
  'arrays': {
    questions: [
      {
        id: '1',
        question: 'What is the time complexity of accessing an element in an array by index?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
        explanation: 'Array elements can be accessed directly using their index in constant time O(1).',
      }]}}
  const generateQuizForTopic = (topicId: string): QuizQuestion[] => {
    const topicData = TOPIC_QUIZ_DATA[topicId as keyof typeof TOPIC_QUIZ_DATA];
    if (!topicData) {
      // Fallback for topics without predefined questions
      return [
        {
          id: '1',
          question: `What is a key concept in ${topics.find(t => t.id === topicId)?.name}?`,
          options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
          correctAnswer: 3,
          explanation: 'This is a placeholder question. More questions will be added for this topic.'
        }
      ];
    }

    // Shuffle questions and return a subset (e.g., 5 random questions)
    const shuffledQuestions = [...topicData.questions].sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, 5);
  };

  const startQuizForTopic = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    const questions = generateQuizForTopic(topicId);
    const newQuiz: QuizState = {
        topicId,
        questions,
        currentQuestionIndex: 0,
        userAnswers: [],
        score: 0,
        isCompleted: false,
        timeStarted: new Date(),
        timeLimit: 0,
        timeRemaining: 0
    };

    setCurrentQuiz(newQuiz);
    setShowQuizModal(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!currentQuiz || currentQuiz.isCompleted) return;

    const updatedAnswers = [...currentQuiz.userAnswers];
    updatedAnswers[currentQuiz.currentQuestionIndex] = answerIndex;

    const updatedQuiz = {
      ...currentQuiz,
      userAnswers: updatedAnswers
    };

    setCurrentQuiz(updatedQuiz);
  };

  const nextQuizQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuiz.currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuiz({
        ...currentQuiz,
        currentQuestionIndex: currentQuiz.currentQuestionIndex + 1
      });
    } else {
      // Quiz completed
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!currentQuiz) return;

    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (currentQuiz.userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    const completedQuiz: QuizState = {
      ...currentQuiz,
      score,
      isCompleted: true,
      timeCompleted: new Date()
    };

    // Update quiz history
    setQuizHistory(prev => [...prev, completedQuiz]);

    setCurrentQuiz(completedQuiz);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setCurrentQuiz(null);
  };

  const showTopicReview = (topicId: string) => {
    const topicQuizHistory = quizHistory.filter(quiz =>
      quiz.topicId === topicId && quiz.isCompleted
    );

    const latestQuiz = topicQuizHistory[topicQuizHistory.length - 1];
    console.log(latestQuiz)
    if (latestQuiz) {
      setReviewQuiz(latestQuiz);
      setShowReviewModal(true);
      setCurrentQuiz(latestQuiz);
      setShowQuizModal(true);
    }
  };



  const getButtonHandler = (status: string, topicId: string): ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined => {
    switch (status) {
      case 'ready':
        return (e) => {
          e.stopPropagation();
          startQuizForTopic(topicId);
        };
      case 'in-progress':
        return (e) => {
          e.stopPropagation();
          startQuizForTopic(topicId);
        };
      case 'mastered':
        return (e) => {
          e.stopPropagation();
          showTopicReview(topicId);
        };
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DSA Assessment Hub</h1>
                <p className="text-sm text-gray-600">Dependency-Aware Learning System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Create Custom Quiz</span>
              </button>
              <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-indigo-700">{userProfile.totalScore}% Avg</span>
              </div>
              
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <Brain className="w-12 h-12" />
                <div>
                  <h2 className="text-3xl font-bold">Master Data Structures & Algorithms</h2>
                  <p className="text-indigo-100 mt-2">
                    Learn step-by-step with our prerequisite-aware assessment system
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{userProfile.masteredTopics.length}</div>
                  <div className="text-sm text-indigo-100">Topics Mastered</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{userProfile.streak}</div>
                  <div className="text-sm text-indigo-100">Day Streak</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{topics.length}</div>
                  <div className="text-sm text-indigo-100">Standard Topics</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{customContents.length}</div>
                  <div className="text-sm text-indigo-100">Custom Quizzes</div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('topics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'topics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Standard Learning Path
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'custom'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Custom Content Quizzes
                  {customContents.length > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {customContents.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'topics' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Learning Path</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Network className="w-4 h-4" />
                    <span>Prerequisite-based progression</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topics.map((topic) => {
                    const status = getTopicStatus(topic);
                    const isDisabled = status === 'locked';

                    return (
                      <div
                        key={topic.id}
                        className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${isDisabled
                          ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                          : getStatusColor(status)
                          }`}
                        onClick={() => !isDisabled && setSelectedTopic(topic.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(status)}
                            <div>
                              <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</p>
                            </div>
                          </div>
                          {topic.score && (
                            <div className="text-right">
                              <div className="font-bold text-lg">{topic.score}/{topic.totalQuestions}</div>
                              <div className="text-sm text-gray-600">Score</div>
                            </div>
                          )}
                        </div>

                        {topic.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">Prerequisites:</div>
                            <div className="flex flex-wrap gap-2">
                              {topic.prerequisites.map((prereq) => {
                                const prereqTopic = topics.find(t => t.id === prereq);
                                const prereqMastered = prereqTopic?.status === 'mastered';
                                return (
                                  <span
                                    key={prereq}
                                    className={`px-2 py-1 rounded text-xs ${prereqMastered
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                      }`}
                                  >
                                    {prereqTopic?.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {status === 'ready' && 'Ready to start!'}
                            {status === 'in-progress' && 'Continue assessment'}
                            {status === 'mastered' && 'Completed ✓'}
                            {status === 'locked' && 'Complete prerequisites first'}
                          </div>
                          {!isDisabled && (
                            <button
                              onClick={getButtonHandler(status, topic.id)}
                              className="hover:cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              {status === 'ready' ? 'Start Quiz' : status === 'in-progress' ? 'Continue' : 'Review'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Custom Content Quizzes</h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Content</span>
                  </button>
                </div>

                {customContents.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No custom content yet</h3>
                    <p className="text-gray-600 mb-4">Upload YouTube videos, PDFs, or images to generate AI-powered quizzes</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Upload Your First Content
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    {customContents.map((content) => (
                      <div key={content.id} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-200 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getContentIcon(content.type)}
                            <div>
                              <h4 className="font-semibold text-gray-900 truncate">{content.title}</h4>
                              <p className="text-sm text-gray-600">
                                {content.type === 'youtube' ? 'YouTube Video' : content.type.toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCustomContent(content.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {content.url && (
                          <div className="mb-4">
                            <a
                              href={content.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate">View original content</span>
                            </a>
                          </div>
                        )}

                        <div className="mb-4">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs ${content.status === 'ready' ? 'bg-green-100 text-green-800' :
                            content.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {content.status === 'processing' && <Loader className="w-3 h-3 mr-1 animate-spin" />}
                            {content.status === 'ready' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {content.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {content.status === 'processing' ? 'AI Analyzing...' :
                              content.status === 'ready' ? 'Quiz Ready' : 'Processing Failed'}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          Uploaded: {new Date(content.uploadDate).toLocaleDateString()}
                        </div>

                        {content.status === 'ready' && content.quizGenerated && (
                          <button  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                            Take AI Generated Quiz
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Processing Content</h4>
                    <p className="text-sm text-yellow-700">AI is analyzing your content to generate a quiz...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Progress Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round((userProfile.masteredTopics.length / topics.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(userProfile.masteredTopics.length / topics.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {topics.filter(t => t.status === 'mastered').length}
                    </div>
                    <div className="text-xs text-green-600">Mastered</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {customContents.filter(c => c.status === 'ready').length}
                    </div>
                    <div className="text-xs text-blue-600">Custom Ready</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Your Profile
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">{userProfile.totalScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-semibold">{userProfile.streak} days</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">Recent Achievements</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mastered Arrays</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mastered Strings</span>
                    </div>
                    {customContents.filter(c => c.status === 'ready').length > 0 && (
                      <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>Generated Custom Quiz</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Custom Quiz</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Content Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setUploadType('youtube')}
                    className={`p-4 rounded-lg border-2 transition-all ${uploadType === 'youtube'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Youtube className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">YouTube</div>
                  </button>
                  <button
                    onClick={() => setUploadType('pdf')}
                    className={`p-4 rounded-lg border-2 transition-all ${uploadType === 'pdf'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">PDF</div>
                  </button>
                  <button
                    onClick={() => setUploadType('image')}
                    className={`p-4 rounded-lg border-2 transition-all ${uploadType === 'image'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-medium">Image</div>
                  </button>
                </div>
              </div>

              {/* Content Input */}
              {uploadType === 'youtube' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Our AI will analyze the video content and generate relevant DSA questions
                  </p>
                </div>
              )}

              {(uploadType === 'pdf' || uploadType === 'image') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload {uploadType === 'pdf' ? 'PDF Document' : 'Image'}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      {uploadType === 'pdf' ? 'PDF files up to 10MB' : 'PNG, JPG, GIF up to 5MB'}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={uploadType === 'pdf' ? '.pdf' : 'image/*'}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}

              {/* AI Features Info */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">AI-Powered Quiz Generation</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Analyzes content to identify key concepts</li>
                      <li>• Generates contextual DSA questions</li>
                      <li>• Creates explanations for each answer</li>
                      <li>• Adapts difficulty based on content complexity</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quiz Configuration */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Quiz Settings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Number of Questions</span>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>5 questions</option>
                      <option>10 questions</option>
                      <option>15 questions</option>
                      <option>20 questions</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty Level</span>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>Auto-detect</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Focus Area</span>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>All DSA Topics</option>
                      <option>Data Structures</option>
                      <option>Algorithms</option>
                      <option>Time Complexity</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (uploadType === 'youtube') {
                      handleYouTubeUpload();
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                  disabled={uploadType === 'youtube' && !youtubeUrl.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                >
                  {uploadType === 'youtube' ? 'Generate Quiz' : 'Upload & Generate'}
                </button>
              </div>

              {/* Processing Info */}
              <div className="text-center text-xs text-gray-500">
                <p>Processing typically takes 30-60 seconds depending on content length</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Results Modal (for when quiz is ready) */}
      {generatedQuizzes.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Quiz Ready!</h4>
              <p className="text-sm text-gray-600">
                {generatedQuizzes[generatedQuizzes.length - 1].questions.length} questions generated
              </p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors">
              Take Quiz
            </button>
            <button
              onClick={() => setGeneratedQuizzes(prev => prev.slice(0, -1))}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Quiz Modal */}
      {showQuizModal && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {topics.find(t => t.id === currentQuiz.topicId)?.name} Quiz
              </h2>
              <button
                onClick={closeQuizModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!currentQuiz.isCompleted ? (
              <>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuiz.currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
                    <span>{Math.round(((currentQuiz.currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuiz.currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {currentQuiz.questions[currentQuiz.currentQuestionIndex].question}
                  </h3>
                  <div className="space-y-3">
                    {currentQuiz.questions[currentQuiz.currentQuestionIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${currentQuiz.userAnswers[currentQuiz.currentQuestionIndex] === index
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${currentQuiz.userAnswers[currentQuiz.currentQuestionIndex] === index
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                            }`}>
                            {currentQuiz.userAnswers[currentQuiz.currentQuestionIndex] === index && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentQuiz({
                      ...currentQuiz,
                      currentQuestionIndex: Math.max(0, currentQuiz.currentQuestionIndex - 1)
                    })}
                    disabled={currentQuiz.currentQuestionIndex === 0}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextQuizQuestion}
                    disabled={currentQuiz.userAnswers[currentQuiz.currentQuestionIndex] === undefined}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${currentQuiz.score >= 80 ? 'bg-green-100' : currentQuiz.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                  <div className={`text-3xl font-bold ${currentQuiz.score >= 80 ? 'text-green-600' : currentQuiz.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {currentQuiz.score}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentQuiz.score >= 80 ? 'Excellent!' : currentQuiz.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  You scored {currentQuiz.score}% on {topics.find(t => t.id === currentQuiz.topicId)?.name}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {currentQuiz.questions.filter((q, i) => currentQuiz.userAnswers[i] === q.correctAnswer).length}
                    </div>
                    <div className="text-sm text-green-600">Correct</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {currentQuiz.questions.filter((q, i) => currentQuiz.userAnswers[i] !== q.correctAnswer).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrect</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((currentQuiz.timeCompleted!.getTime() - currentQuiz.timeStarted.getTime()) / 1000)}s
                    </div>
                    <div className="text-sm text-blue-600">Time</div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setReviewQuiz(currentQuiz);
                      setShowReviewModal(true);
                      setShowQuizModal(false);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                  >
                    Review Answers
                  </button>
                  <button
                    onClick={closeQuizModal}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Review Modal - Continuation */}
      {showReviewModal && reviewQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Review: {topics.find(t => t.id === reviewQuiz.topicId)?.name} Quiz
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quiz Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Quiz Results</h3>
                  <p className="text-sm text-gray-600">
                    Completed on {reviewQuiz.timeCompleted?.toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-2xl font-bold ${reviewQuiz.score >= 80 ? 'text-green-600' :
                    reviewQuiz.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {reviewQuiz.score}%
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-6">
              {reviewQuiz.questions.map((question, questionIndex) => {
                const userAnswer = reviewQuiz.userAnswers[questionIndex];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex-1">
                        {questionIndex + 1}. {question.question}
                      </h4>
                      <div className={`flex items-center space-x-2 ml-4 ${isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                ? 'border-green-500 bg-green-50'
                                : isUserAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${isCorrectAnswer
                                  ? 'border-green-500 bg-green-500'
                                  : isUserAnswer
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300'
                                }`}>
                                {(isCorrectAnswer || isUserAnswer) && (
                                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                )}
                              </div>
                              <span className="flex-1">{option}</span>
                              {isCorrectAnswer && (
                                <span className="text-sm font-medium text-green-600">
                                  Correct Answer
                                </span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-sm font-medium text-red-600">
                                  Your Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
                      <p className="text-blue-800 text-sm">{question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>)
}

export default MainPage;