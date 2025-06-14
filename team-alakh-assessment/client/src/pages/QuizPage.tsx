import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Timer, Shield, AlertTriangle } from 'lucide-react';
import api from '../services/api';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface QuizData {
  questions: Question[];
}

const QuizPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-cheating measures
  useEffect(() => {
    if (!quizStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !showResults) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setCheatingDetected(true);
            handleSubmitQuiz([], true); // Auto-submit with cheating flag
          }
          return newCount;
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common cheating shortcuts
      if (
        e.key === 'F12' || // Dev tools
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Dev tools
        (e.ctrlKey && e.key === 'u') || // View source
        (e.ctrlKey && e.key === 'c') || // Copy
        (e.ctrlKey && e.key === 'v') || // Paste
        (e.ctrlKey && e.key === 'a') || // Select all
        e.key === 'PrintScreen' || // Screenshot
        (e.altKey && e.key === 'Tab') // Alt+Tab
      ) {
        e.preventDefault();
        setWarningCount(prev => prev + 1);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setWarningCount(prev => prev + 1);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showResults) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [quizStarted, showResults]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults && !cheatingDetected) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, showResults, cheatingDetected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuizData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/question/generate/${encodeURIComponent(topic!)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setQuizData(response.data);
    } catch (err: any) {
      console.error('Error fetching quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null && quizData) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitQuiz(newAnswers);
      }
    }
  };

  const handleSubmitQuiz = async (finalAnswers = answers, cheating = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/question/submit/${encodeURIComponent(topic!)}`, {
        answers: finalAnswers,
        cheatingDetected: cheating || cheatingDetected
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScore(response.data.score);
      setShowResults(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartQuiz = async () => {
    await fetchQuizData();
    if (quizData || !error) {
      setQuizStarted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
    setTimeLeft(300);
    setQuizStarted(false);
    setQuizData(null);
    setCheatingDetected(false);
    setWarningCount(0);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Quiz</h2>
          <p className="text-gray-600">Creating personalized questions for {topic}...</p>
        </div>
      </div>
    );
  }

  if (error && !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Generation Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetakeQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cheatingDetected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-red-200">
            <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-900 mb-4">Quiz Terminated</h1>
            <p className="text-red-700 mb-6">
              Suspicious activity detected. The quiz has been automatically submitted.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm">
                Detected activities: Tab switching, keyboard shortcuts, or right-click attempts.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
              <Trophy className="h-12 w-12 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {topic} Quiz
            </h1>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Quiz Instructions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 10 AI-generated questions specific to {topic}</li>
                <li>• 5 minutes time limit</li>
                <li>• You need 7/10 correct answers to pass</li>
                <li>• Once started, you cannot pause the quiz</li>
                <li>• Tab switching or suspicious activity will terminate the quiz</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 text-amber-800">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Anti-Cheating Measures Active</span>
              </div>
              <p className="text-amber-700 text-sm mt-2">
                Screenshots, copying, and tab switching are monitored and will result in quiz termination.
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= 7;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className={`p-4 rounded-full w-fit mx-auto mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? (
                <Trophy className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Complete!
            </h1>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Your Score:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {score}/10
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Percentage:</span>
                <span className="text-xl font-semibold text-gray-900">
                  {Math.round((score / 10) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-8 ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`${passed ? 'text-green-800' : 'text-red-800'}`}>
                {passed 
                  ? `Congratulations! You've mastered ${topic} and can now proceed with topics that depend on it.`
                  : `You need to score at least 7/10 to pass. Review the material and try again.`
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetakeQuiz}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with warnings */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Timer className="h-5 w-5 text-orange-500" />
              <span className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            {warningCount > 0 && (
              <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-red-600 text-sm font-medium">
                  Warnings: {warningCount}/3
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {quizData.questions[currentQuestion].question}
          </h2>

          <div className="space-y-4 mb-8">
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null || isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                currentQuestion === quizData.questions.length - 1 ? 'Submit Quiz' : 'Next Question'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;