// Total code developed by sahithya, meghana and pradeep - team4
import { useState, useEffect, useRef } from 'react';

type MCQ = {
  topic: string;
  question: string;
  options: string[];
  answer: string;
};

type Props = {
  mcqs: MCQ[];
};

const Quiz: React.FC<Props> = ({ mcqs }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(mcqs.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEnterFullScreenModal, setShowEnterFullScreenModal] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallTimeLeft, setOverallTimeLeft] = useState(mcqs.length * 60); // 1 minute per question
  const quizRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Overall quiz timer logic
  useEffect(() => {
    if (isFullScreen && !submitted) {
      timerRef.current = window.setInterval(() => {
        setOverallTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isFullScreen, submitted]);

  const handleOptionChange = (index: number, value: string) => {
    if (!submitted && isFullScreen) {
      const newAnswers = [...userAnswers];
      newAnswers[index] = value;
      setUserAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (isFullScreen) {
      setSubmitted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getScore = () => {
    let score = 0;
    mcqs.forEach((q, i) => {
      const userAnswer = userAnswers[i]?.trim().toLowerCase() || '';
      const correctAnswer = q.answer.trim().toLowerCase();
      if (userAnswer === correctAnswer) score++;
    });
    return score;
  };

  const enterFullScreen = () => {
    if (quizRef.current) {
      quizRef.current.requestFullscreen().then(() => {
        setIsFullScreen(true);
        setShowWarning(false);
        setShowEnterFullScreenModal(false);
      }).catch((err) => {
        console.error('Error entering full-screen mode:', err);
        setShowWarning(true);
      });
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      }).catch((err) => {
        console.error('Error exiting full-screen mode:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen && !submitted) {
        setShowWarning(true);
        console.log('Warning: User exited full-screen mode during the quiz. Possible tab-switching detected.');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [submitted]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={quizRef}
      style={{
        padding: isFullScreen ? '40px' : '20px',
        background: '#f9fafb',
        borderRadius: isFullScreen ? '0' : '12px',
        minHeight: isFullScreen ? '100vh' : 'auto',
        width: isFullScreen ? '100vw' : 'auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Initial Enter Full Screen Modal */}
      {showEnterFullScreenModal && !isFullScreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '500px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ color: '#6366f1', marginBottom: '20px' }}>
              📝 Enter Full-Screen Mode
            </h3>
            <p style={{ marginBottom: '20px', color: '#374151' }}>
              Please enter full-screen mode to start the quiz. You have {mcqs.length} minute(s) for {mcqs.length} question(s).
            </p>
            <button
              onClick={enterFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Enter Full Screen
            </button>
          </div>
        </div>
      )}

      {/* Warning Modal for Re-enter Full Screen */}
      {showWarning && !isFullScreen && !showEnterFullScreenModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '500px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>
              ⚠️ Full-Screen Mode Required
            </h3>
            <p style={{ marginBottom: '20px', color: '#374151' }}>
              This quiz must be taken in full-screen mode. Exiting full-screen mode has been flagged. Please re-enter to continue.
            </p>
            <button
              onClick={enterFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Re-enter Full Screen
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>
          MCQ Test {submitted ? '(Results)' : `(Question ${currentQuestionIndex + 1} of ${mcqs.length})`}
        </h2>
        {isFullScreen && !submitted && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ fontWeight: 'bold', color: overallTimeLeft <= 30 ? 'red' : '#374151' }}>
              Time Left: {formatTime(overallTimeLeft)}
            </div>
            <button
              onClick={exitFullScreen}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Exit Full Screen
            </button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {mcqs.length > 0 && (
          <>
            {submitted ? (
              // Display all questions with feedback after submission
              mcqs.map((mcq, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '20px',
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <p style={{ fontWeight: 600 }}>
                    {i + 1}. {mcq.question}
                  </p>
                  <div>
                    {mcq.options.map((opt, j) => (
                      <label key={j} style={{ display: 'block', margin: '6px 0' }}>
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={opt}
                          checked={userAnswers[i] === opt}
                          disabled={true}
                          style={{ marginRight: '8px' }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {userAnswers[i] ? (
                    <p
                      style={{
                        color:
                          userAnswers[i].trim().toLowerCase() === mcq.answer.trim().toLowerCase()
                            ? 'green'
                            : 'red',
                        fontWeight: 500,
                        marginTop: '6px',
                      }}
                    >
                      {userAnswers[i].trim().toLowerCase() === mcq.answer.trim().toLowerCase()
                        ? '✅ Correct'
                        : `❌ Incorrect (Correct answer: ${mcq.answer})`}
                    </p>
                  ) : (
                    <p
                      style={{
                        color: 'red',
                        fontWeight: 500,
                        marginTop: '6px',
                      }}
                    >
                      ❌ Not Answered (Correct answer: {mcq.answer})
                    </p>
                  )}
                </div>
              ))
            ) : (
              // Display only the current question before submission
              <div
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <p style={{ fontWeight: 600 }}>
                  {currentQuestionIndex + 1}. {mcqs[currentQuestionIndex].question}
                </p>
                <div>
                  {mcqs[currentQuestionIndex].options.map((opt, j) => (
                    <label key={j} style={{ display: 'block', margin: '6px 0' }}>
                      <input
                        type="radio"
                        name={`q${currentQuestionIndex}`}
                        value={opt}
                        checked={userAnswers[currentQuestionIndex] === opt}
                        onChange={() => handleOptionChange(currentQuestionIndex, opt)}
                        disabled={submitted || !isFullScreen}
                        style={{ marginRight: '8px' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0 || submitted || !isFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: currentQuestionIndex === 0 || submitted || !isFullScreen ? '#d1d5db' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor:
                  currentQuestionIndex === 0 || submitted || !isFullScreen ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={submitted || !isFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: submitted || !isFullScreen ? '#d1d5db' : '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: submitted || !isFullScreen ? 'not-allowed' : 'pointer',
              }}
            >
              {currentQuestionIndex < mcqs.length - 1 ? 'Next' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          🏁 Your Score: {getScore()} / {mcqs.length}
        </div>
      )}
    </div>
  );
};

export default Quiz;
