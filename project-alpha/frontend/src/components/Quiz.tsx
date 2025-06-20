
import React, { useState, useEffect, useRef } from 'react';

type MCQ = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
};

type Props = {
  mcqs: MCQ[];
  quizId: string;
  onRestartQuiz?: (score: number, passed: boolean) => void;
  onSubmitQuiz?: (score: number, total: number) => void;
  canAttempt: boolean;
  attemptsToday: number;
  quizPassed: boolean;
  topic: string;
};

const Quiz: React.FC<Props> = ({ mcqs, quizId, onRestartQuiz, onSubmitQuiz, canAttempt, attemptsToday, quizPassed, topic }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(mcqs.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEnterFullScreenModal, setShowEnterFullScreenModal] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallTimeLeft, setOverallTimeLeft] = useState(mcqs.length * 60);
  const [warningsLeft, setWarningsLeft] = useState(3);
  const [keyPressWarningShown, setKeyPressWarningShown] = useState(false);
  const [showKeyPressAlert, setShowKeyPressAlert] = useState(false);
  const [showNavigationPane, setShowNavigationPane] = useState(false);

  const quizRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("Quiz component: quizId changed or mcqs length changed. Resetting state.");
    setUserAnswers(Array(mcqs.length).fill(''));
    setSubmitted(false);
    setShowWarning(false);
    setShowEnterFullScreenModal(true);
    setCurrentQuestionIndex(0);
    setOverallTimeLeft(mcqs.length * 60);
    setWarningsLeft(3);
    setKeyPressWarningShown(false);
    setShowKeyPressAlert(false);
    setShowNavigationPane(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [quizId, mcqs.length]);

  useEffect(() => {
    if (isFullScreen && !submitted) {
      timerRef.current = window.setInterval(() => {
        setOverallTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true);
            console.log("Quiz auto-submitted: Time ran out.");
            if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
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
  }, [isFullScreen, submitted, onSubmitQuiz, mcqs.length]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen && !submitted) {
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true);
            if (timerRef.current) clearInterval(timerRef.current);
            console.log(`Auto-submit: Full-screen exit at ${new Date().toISOString()}. Last warning exhausted.`);
            if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
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
            setSubmitted(true);
            if (timerRef.current) clearInterval(timerRef.current);
            console.log(`Auto-submit: Tab switch at ${new Date().toISOString()}. Last warning exhausted.`);
            if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
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
    };
  }, [isFullScreen, submitted, onSubmitQuiz, mcqs.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isProhibitedKey = ['Control', 'Alt', 'Meta', 'PrintScreen'].includes(event.key) ||
                             event.ctrlKey || event.altKey || event.metaKey;

      if (isFullScreen && !submitted && isProhibitedKey) {
        if (!keyPressWarningShown) {
          setShowKeyPressAlert(true);
          setKeyPressWarningShown(true);
          console.log(`Alert: Key "${event.key}" pressed at ${new Date().toISOString()}. First warning issued.`);
        } else {
          setWarningsLeft((prev) => {
            if (prev <= 1) {
              setSubmitted(true);
              if (timerRef.current) clearInterval(timerRef.current);
              console.log(`Auto-submit: Key "${event.key}" pressed at ${new Date().toISOString()}. Last warning exhausted.`);
              if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
              return 0;
            }
            const newWarnings = prev - 1;
            setShowWarning(true);
            console.log(`Warning: Key "${event.key}" pressed at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
            return newWarnings;
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen, submitted, keyPressWarningShown, onSubmitQuiz, mcqs.length]);

  const handleCopy = (event: React.ClipboardEvent) => {
    event.preventDefault();
    if (isFullScreen && !submitted) {
      if (!keyPressWarningShown) {
        setShowKeyPressAlert(true);
        setKeyPressWarningShown(true);
        console.log(`Alert: Copy attempt at ${new Date().toISOString()}. First warning issued.`);
      } else {
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true);
            if (timerRef.current) clearInterval(timerRef.current);
            console.log(`Auto-submit: Copy attempt at ${new Date().toISOString()}. Last warning exhausted.`);
            if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
            return 0;
          }
          const newWarnings = prev - 1;
          setShowWarning(true);
          console.log(`Warning: Copy attempt at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
          return newWarnings;
        });
      }
    }
  };

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
      console.log("Quiz submitted manually.");
      if (onSubmitQuiz) onSubmitQuiz(getScore(), mcqs.length);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleGoToQuestion = (index: number) => {
    if (!submitted && isFullScreen) {
      setCurrentQuestionIndex(index);
      // Removed setShowNavigationPane(false) to keep pane open
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

  const getScorePercentage = () => {
    if (mcqs.length === 0) return 0;
    return (getScore() / mcqs.length) * 100;
  };

  const enterFullScreen = () => {
    if (quizRef.current) {
      quizRef.current.requestFullscreen().then(() => {
        setIsFullScreen(true);
        setShowWarning(false);
        setShowEnterFullScreenModal(false);
        console.log("Entered full-screen mode.");
      }).catch((err) => {
        console.error('Error entering full-screen mode:', err);
        alert('Failed to enter full-screen mode. Please allow full-screen in browser settings.');
      });
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
        console.log("Exited full-screen mode manually.");
      }).catch((err) => {
        console.error('Error exiting full-screen mode:', err);
      });
    }
  };

  const handleRetakeQuiz = () => {
    console.log("Quiz component: Retake Quiz clicked, calling onRestartQuiz prop.");
    if (onRestartQuiz) {
      onRestartQuiz(getScore(), getScorePercentage() >= 75);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderWarningsLeft = () => {
    return '⚡'.repeat(warningsLeft);
  };

  const totalQuestions = mcqs.length;
  const answeredQuestions = userAnswers.filter(answer => answer !== '').length;
  const unattemptedQuestions = totalQuestions - answeredQuestions;

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
      onCopy={handleCopy}
    >
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
              Please enter full-screen mode to start the quiz for {topic}. You have {mcqs.length} minute(s) for {mcqs.length} question(s). Pressing Ctrl, Alt, Start (Windows key), PrintScreen, or attempting to copy for the first time will show a warning alert. Exiting full-screen, switching tabs, or repeating these actions will count as a warning. You have 3 warnings (⚡⚡⚡); the quiz will auto-submit silently if the last warning is exhausted. You have {3 - attemptsToday} attempt(s) left today for {topic}.
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

      {showWarning && !isFullScreen && !showEnterFullScreenModal && warningsLeft > 0 && (
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
              This quiz must be taken in full-screen mode. You have {warningsLeft} warning(s) left ({renderWarningsLeft()}). Exiting full-screen, switching tabs, pressing Ctrl, Alt, Start (Windows key), PrintScreen, or attempting to copy again counts as a warning. The quiz will auto-submit silently if the last warning is exhausted.
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
            ⚠️ Warning: Pressing Ctrl, Alt, Start (Windows key), PrintScreen, or attempting to copy is prohibited. Next occurrence will reduce your warnings ({renderWarningsLeft()}).
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>
          MCQ Test {submitted ? '(Results)' : `(Question ${currentQuestionIndex + 1} of ${mcqs.length})`}
        </h2>
        {isFullScreen && !submitted && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', color: overallTimeLeft <= 30 ? 'red' : '#374151' }}>
              Time Left: {formatTime(overallTimeLeft)}
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

      {!submitted && isFullScreen && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#374151' }}>Total Questions: {totalQuestions}</span>
            <span style={{ fontWeight: 'bold', color: 'green' }}>Answered: {answeredQuestions}</span>
            <span style={{ fontWeight: 'bold', color: 'red' }}>Unattempted: {unattemptedQuestions}</span>
            <span style={{ fontWeight: 'bold', color: warningsLeft <= 1 ? 'red' : '#374151' }}>
              Warnings Left: {renderWarningsLeft()}
            </span>
          </div>
        </div>
      )}

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        gap: '20px',
        position: 'relative',
      }}>
        <div style={{ flex: 1 }}>
          {mcqs.length > 0 && !submitted && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
            >
              <p style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: `${currentQuestionIndex + 1}. ${mcqs[currentQuestionIndex].question}` }} />
              <div>
                {mcqs[currentQuestionIndex].options.map((opt, j) => (
                  <label key={j} style={{ display: 'block', margin: '6px 0', userSelect: 'none' }}>
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
          {submitted && (
            mcqs.map((mcq, i) => (
              <div
                key={mcq.id}
                style={{
                  marginBottom: '20px',
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <p style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: `${i + 1}. ${mcq.question}` }} />
                <div>
                  {mcq.options.map((opt, j) => (
                    <label key={j} style={{ display: 'block', margin: '6px 0' }}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={userAnswers[i] || ''}
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
          )}
        </div>

        {!submitted && isFullScreen && (
          <button
            onClick={() => setShowNavigationPane(!showNavigationPane)}
            title={showNavigationPane ? 'Collapse Navigation' : 'Expand Navigation'}
            style={{
              position: 'absolute',
              right: showNavigationPane ? '210px' : '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              zIndex: 999,
              transition: 'right 0.3s ease-in-out',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {showNavigationPane ? '»' : '«'}
          </button>
        )}

        {isFullScreen && !submitted && (
          <div
            style={{
              width: showNavigationPane ? '200px' : '0',
              background: '#fff',
              padding: showNavigationPane ? '10px' : '0',
              borderRadius: '8px',
              boxShadow: showNavigationPane ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              overflow: 'hidden',
              transition: 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
              position: 'fixed',
              right: '20px',
              top: '100px',
              maxHeight: 'calc(100vh - 120px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0,
              zIndex: 900,
            }}
          >
            {showNavigationPane && (
              <>
                <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '14px', marginBottom: '5px' }}>
                    🚫 Prohibited Actions:
                  </p>
                  <ul style={{ listStyleType: 'disc', marginLeft: '15px', fontSize: '12px', color: '#555' }}>
                    <li>Pressing Ctrl, Alt, Meta (Windows key), PrintScreen.</li>
                    <li>Attempting to copy text.</li>
                    <li>Exiting Full-Screen mode (e.g., via Esc key).</li>
                    <li>Switching browser tabs.</li>
                  </ul>
                  <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>
                    After 3 warnings (⚡⚡⚡), the quiz will auto-submit silently.
                  </p>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                  gap: '10px',
                  overflowY: 'auto',
                  paddingRight: '5px',
                  flexGrow: 1,
                }}>
                  {mcqs.map((mcq, index) => (
                    <button
                      key={mcq.id}
                      onClick={() => handleGoToQuestion(index)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: userAnswers[index] ? '#10b981' : (index === currentQuestionIndex ? '#6366f1' : '#ef4444'),
                        color: 'white',
                        border: index === currentQuestionIndex ? '2px solid #000' : 'none',
                        borderRadius: '50%',
                        cursor: submitted || !isFullScreen ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        opacity: submitted || !isFullScreen ? 0.5 : 1,
                        pointerEvents: submitted || !isFullScreen ? 'none' : 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      disabled={submitted || !isFullScreen}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!submitted && isFullScreen && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
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
                cursor: currentQuestionIndex === 0 || submitted || !isFullScreen ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === mcqs.length - 1 || submitted || !isFullScreen}
              style={{
                padding: '12px 20px',
                backgroundColor: currentQuestionIndex === mcqs.length - 1 || submitted || !isFullScreen ? '#d1d5db' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentQuestionIndex === mcqs.length - 1 || submitted || !isFullScreen ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center' }}>
          🏁 Your Score: {getScore()} / {mcqs.length} ({getScorePercentage().toFixed(2)}%)
          {warningsLeft <= 0 && (
            <p style={{ color: '#ef4444', marginTop: '10px' }}>
              ⚠️ Quiz auto-submitted due to exhausting all warnings (exiting full-screen, switching tabs, pressing Ctrl, Alt, Start (Windows key), PrintScreen, or attempting to copy).
            </p>
          )}

          {quizPassed ? (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #34d399',
              color: '#065f46',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              <p>🎉 Congratulations! You passed the quiz and can proceed with the specified learning path.</p>
              <p style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'normal' }}>
                No further attempts are allowed since you passed.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              color: '#991b1b',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>
              <p>😞 You need some learning on these prerequisites. After learning these, come and retake the test.</p>
              {canAttempt && (
                <button
                  onClick={handleRetakeQuiz}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '15px',
                    fontSize: '16px',
                  }}
                >
                  Restart Quiz ({3 - attemptsToday} attempt{3 - attemptsToday === 1 ? '' : 's'} left today for {topic})
                </button>
              )}
              {!canAttempt && (
                <p style={{ color: '#ef4444', marginTop: '10px', fontWeight: 'bold' }}>
                  ⚠️ Maximum attempts reached for {topic} today. Please try again tomorrow.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
