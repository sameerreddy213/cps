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
  const [warningsLeft, setWarningsLeft] = useState(3); // Start with 3 warnings
  const [keyPressWarningShown, setKeyPressWarningShown] = useState(false); // Track key press warning
  const [showKeyPressAlert, setShowKeyPressAlert] = useState(false); // Show key press alert
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

  // Handle full-screen exits and tab switches
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen && !submitted) {
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true); // Auto-submit silently
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            console.log(`Auto-submit: Full-screen exit at ${new Date().toISOString()}. Last warning exhausted.`);
            return 0;
          }
          const newWarnings = prev - 1;
          setShowWarning(true);
          console.log(`Warning: User exited full-screen mode at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
          return newWarnings;
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isFullScreen && !submitted) {
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true); // Auto-submit silently
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            console.log(`Auto-submit: Tab switch at ${new Date().toISOString()}. Last warning exhausted.`);
            return 0;
          }
          const newWarnings = prev - 1;
          setShowWarning(true);
          console.log(`Warning: Tab switch detected at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
          return newWarnings;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [submitted]);

  // Handle warning keys (Ctrl, Tab, Shift, Alt)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullScreen && !submitted && ['Control', 'Tab', 'Shift', 'Alt'].includes(event.key)) {
        if (!keyPressWarningShown) {
          setShowKeyPressAlert(true); // Show alert on first key press
          setKeyPressWarningShown(true);
          console.log(`Alert: Key ${event.key} pressed at ${new Date().toISOString()}. First warning issued.`);
        } else {
          setWarningsLeft((prev) => {
            if (prev <= 1) {
              setSubmitted(true); // Auto-submit silently
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              console.log(`Auto-submit: Key ${event.key} pressed at ${new Date().toISOString()}. Last warning exhausted.`);
              return 0;
            }
            const newWarnings = prev - 1;
            setShowWarning(true);
            console.log(`Warning: Key ${event.key} pressed at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
            return newWarnings;
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, submitted, keyPressWarningShown]);

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
        setShowWarning(true);
      });
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Display warnings left as power symbols
  const renderWarningsLeft = () => {
    return '⚡'.repeat(warningsLeft);
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
              Please enter full-screen mode to start the quiz. You have {mcqs.length} minute(s) for {mcqs.length} question(s). Pressing Ctrl, Tab, Shift, or Alt for the first time will show a warning alert. Exiting full-screen, switching tabs, or pressing these keys again will count as a warning. You have 3 warnings (⚡⚡⚡); the quiz will auto-submit silently if the last warning is exhausted.
            </p>
            <button
              onClick={enterFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
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
              This quiz must be taken in full-screen mode. You have {warningsLeft} warning(s) left ({renderWarningsLeft()}). Exiting full-screen, switching tabs, or pressing Ctrl, Tab, Shift, or Alt again counts as a warning. The quiz will auto-submit silently if the last warning is exhausted.
            </p>
            <button
              onClick={enterFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
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

      {/* Key Press Alert Notification */}
      {showKeyPressAlert && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#fef3c7',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 1100,
            maxWidth: '300px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#b45309', marginBottom: '10px' }}>
            ⚠️ Warning: Pressing Ctrl, Tab, Shift, or Alt is prohibited. Next occurrence will reduce your warnings ({renderWarningsLeft()}).
          </p>
          <button
            onClick={() => setShowKeyPressAlert(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            OK
          </button>
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
            <div style={{ fontWeight: 'bold', color: warningsLeft <= 1 ? 'red' : '#374151' }}>
              Warnings Left: {renderWarningsLeft()}
            </div>
            <button
              onClick={exitFullScreen}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
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
                color: 'white',
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
                color: 'white',
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
          {warningsLeft <= 0 && (
            <p style={{ color: '#ef4444', marginTop: '10px' }}>
              ⚠️ Quiz auto-submitted due to exhausting all warnings (exiting full-screen, switching tabs, or pressing Ctrl, Tab, Shift, or Alt).
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
