import React, { useState, useEffect, useRef } from 'react';
//import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons for arrows

// Define the MCQ type matching your backend
type MCQ = {
  id: string; // Crucial: Each MCQ must have a unique ID
  topic: string;
  question: string;
  options: string[];
  answer: string;
};

// Define the props for the Quiz component
type Props = {
  mcqs: MCQ[]; // The array of MCQs to display
  quizId: string; // A unique identifier for the current quiz attempt (from parent)
  onRestartQuiz?: () => void; // Callback function to request a quiz restart from parent
};

const Quiz: React.FC<Props> = ({ mcqs, quizId, onRestartQuiz }) => {
  // --- State Variables ---
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(mcqs.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // For full-screen exit/tab switch warnings
  const [showEnterFullScreenModal, setShowEnterFullScreenModal] = useState(true); // Initial modal for full screen
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [overallTimeLeft, setOverallTimeLeft] = useState(mcqs.length * 60); // 1 minute per question
  const [warningsLeft, setWarningsLeft] = useState(3); // Start with 3 warnings
  const [keyPressWarningShown, setKeyPressWarningShown] = useState(false); // Tracks if the first key press alert has been shown
  const [showKeyPressAlert, setShowKeyPressAlert] = useState(false); // To show/hide the key press notification
  const [showNavigationPane, setShowNavigationPane] = useState(false); // State for navigation pane visibility

  // --- Refs ---
  const quizRef = useRef<HTMLDivElement>(null); // Ref for the main quiz container to request full screen
  const timerRef = useRef<number | null>(null); // Ref for the quiz timer interval

  // --- Effects ---

  // Effect to reset quiz state when a new quiz (identified by quizId) is loaded
  useEffect(() => {
    console.log("Quiz component: quizId changed or mcqs length changed. Resetting state.");
    setUserAnswers(Array(mcqs.length).fill('')); // Reset user answers
    setSubmitted(false); // Reset submission status
    setShowWarning(false); // Hide any warnings
    setShowEnterFullScreenModal(true); // Show the initial full-screen modal again
    setCurrentQuestionIndex(0); // Go back to the first question
    setOverallTimeLeft(mcqs.length * 60); // Reset timer based on new number of questions
    setWarningsLeft(3); // **CRITICAL FIX**: GUARANTEED RESET of warnings
    setKeyPressWarningShown(false); // Reset key press warning state
    setShowKeyPressAlert(false); // Hide key press alert
    setShowNavigationPane(false); // Hide navigation pane

    // Clear any existing timer to prevent multiple timers running
    // This is crucial to prevent multiple timers if the quizId changes rapidly
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Ensure full screen is exited if a new quiz loads while still in full screen
    // This is a safety measure to prevent state inconsistencies
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

  }, [quizId, mcqs.length]); // Dependencies: quizId for full quiz restart, mcqs.length for question count changes


  // Effect for the overall quiz timer
  useEffect(() => {
    if (isFullScreen && !submitted) {
      timerRef.current = window.setInterval(() => {
        setOverallTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true); // Auto-submit when time runs out
            console.log("Quiz auto-submitted: Time ran out.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      // Cleanup: clear interval when component unmounts or dependencies change
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isFullScreen, submitted]); // Timer runs only when in full screen and not submitted

  // Effect to handle full-screen changes and tab visibility
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen && !submitted) {
        // User exited full screen
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true); // Auto-submit if last warning exhausted
            if (timerRef.current) clearInterval(timerRef.current);
            console.log(`Auto-submit: Full-screen exit at ${new Date().toISOString()}. Last warning exhausted.`);
            return 0;
          }
          const newWarnings = prev - 1;
          setShowWarning(true); // Show warning modal
          console.log(`Warning: User exited full-screen mode at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
          return newWarnings;
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isFullScreen && !submitted) {
        // User switched tabs/minimized browser
        setWarningsLeft((prev) => {
          if (prev <= 1) {
            setSubmitted(true); // Auto-submit if last warning exhausted
            if (timerRef.current) clearInterval(timerRef.current);
            console.log(`Auto-submit: Tab switch at ${new Date().toISOString()}. Last warning exhausted.`);
            return 0;
          }
          const newWarnings = prev - 1;
          setShowWarning(true); // Show warning modal
          console.log(`Warning: Tab switch detected at ${new Date().toISOString()}. Warnings left: ${newWarnings}`);
          return newWarnings;
        });
      }
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: remove event listeners
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFullScreen, submitted]); // Dependencies: only re-run if these states change

  // Effect to handle prohibited key presses (Ctrl, Alt, Meta, PrintScreen)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isProhibitedKey = ['Control', 'Alt', 'Meta', 'PrintScreen'].includes(event.key) ||
                               event.ctrlKey || event.altKey || event.metaKey;

      if (isFullScreen && !submitted && isProhibitedKey) {
        // event.preventDefault(); // Uncomment if you want to completely block the key action

        if (!keyPressWarningShown) {
          setShowKeyPressAlert(true); // Show initial alert
          setKeyPressWarningShown(true); // Mark that first alert has been shown
          console.log(`Alert: Key "${event.key}" pressed at ${new Date().toISOString()}. First warning issued.`);
        } else {
          setWarningsLeft((prev) => {
            if (prev <= 1) {
              setSubmitted(true); // Auto-submit if last warning exhausted
              if (timerRef.current) clearInterval(timerRef.current);
              console.log(`Auto-submit: Key "${event.key}" pressed at ${new Date().toISOString()}. Last warning exhausted.`);
              return 0;
            }
            const newWarnings = prev - 1;
            setShowWarning(true); // Show general warning modal
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
  }, [isFullScreen, submitted, keyPressWarningShown]); // Dependencies for this effect

  // Prevent copying of question and options
  const handleCopy = (event: React.ClipboardEvent) => {
    event.preventDefault(); // Prevent default copy behavior
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

  // --- Event Handlers ---

  const handleOptionChange = (index: number, value: string) => {
    if (!submitted && isFullScreen) { // Only allow changes if not submitted and in full screen
      const newAnswers = [...userAnswers];
      newAnswers[index] = value;
      setUserAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (isFullScreen) { // Only allow submission if in full screen
      setSubmitted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current); // Stop timer on submission
      }
      console.log("Quiz submitted manually.");
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
    if (!submitted && isFullScreen) { // Allow navigation only if not submitted and in full screen
      setCurrentQuestionIndex(index);
      setShowNavigationPane(false); // Close navigation pane after clicking a question
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
        setShowWarning(false); // Hide warning if it was shown
        setShowEnterFullScreenModal(false); // Hide initial modal
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

  // Handler for "Restart Quiz" button. This calls the prop from the parent.
  const handleRetakeQuiz = () => {
    console.log("Quiz component: Retake Quiz clicked, calling onRestartQuiz prop.");
    if (onRestartQuiz) {
      onRestartQuiz(); // Delegate to parent to fetch new MCQs and trigger reset
    } else {
      console.warn("onRestartQuiz prop not provided to Quiz component. Cannot restart quiz effectively (will use same questions).");
      // Fallback: local reset if no onRestartQuiz is provided (less ideal as it won't get new questions)
      setUserAnswers(Array(mcqs.length).fill(''));
      setSubmitted(false);
      setIsFullScreen(false);
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
    }
  };

  // --- Helper Functions for UI ---

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

  // Calculate navigation stats
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
      onCopy={handleCopy} // Attach copy prevention handler
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
              Please enter full-screen mode to start the quiz. You have {mcqs.length} minute(s) for {mcqs.length} question(s). Pressing Ctrl, Alt, Start (Windows key), PrintScreen, or attempting to copy for the first time will show a warning alert. Exiting full-screen, switching tabs, or repeating these actions will count as a warning. You have 3 warnings (⚡⚡⚡); the quiz will auto-submit silently if the last warning is exhausted.
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

      {/* Main Quiz Content Header (Time, Exit Full Screen) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>
          MCQ Test {submitted ? '(Results)' : `(Question ${currentQuestionIndex + 1} of ${mcqs.length})`}
        </h2>
        {isFullScreen && !submitted && (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Time Left remains here */}
            <div style={{ fontWeight: 'bold', color: overallTimeLeft <= 30 ? 'red' : '#374151' }}>
              Time Left: {formatTime(overallTimeLeft)}
            </div>
            {/* Warnings Left moved below */}
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

      {/* Quiz Progress Stats (Total, Answered, Unattempted, and NOW Warnings Left) */}
      {!submitted && isFullScreen && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ fontWeight: 'bold', color: '#374151' }}>Total Questions: {totalQuestions}</span>
            <span style={{ fontWeight: 'bold', color: 'green' }}>Answered: {answeredQuestions}</span>
            <span style={{ fontWeight: 'bold', color: 'red' }}>Unattempted: {unattemptedQuestions}</span>
            {/* Warnings Left is now here */}
            <span style={{ fontWeight: 'bold', color: warningsLeft <= 1 ? 'red' : '#374151' }}>
              Warnings Left: {renderWarningsLeft()}
            </span>
          </div>
        </div>
      )}

      {/* Flex container for main content and navigation pane */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        gap: '20px',
        position: 'relative', // IMPORTANT: for positioning the toggle button relative to this container
      }}>
        {/* Main Question Content */}
        <div style={{ flex: 1 }}>
          {mcqs.length > 0 && !submitted && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                userSelect: 'none', // Prevent selection/copying
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
                key={mcq.id} // Use unique MCQ ID for key
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
                        value={userAnswers[i] || ''} // Ensure this matches selected value
                        checked={userAnswers[i] === opt}
                        disabled={true} // Options are disabled after submission
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

        {/* Navigation Pane Toggle Button */}
        {!submitted && isFullScreen && (
          <button
            onClick={() => setShowNavigationPane(!showNavigationPane)}
            title={showNavigationPane ? 'Collapse Navigation' : 'Expand Navigation'}
            style={{
              // Position it relative to its parent flex container, then adjust with top/bottom/right
              position: 'absolute', // Changed from fixed to absolute to be relative to parent div.
                                     // This ensures it moves with the scroll of the main content if that happens.
                                     // If you want it truly fixed on the screen, use 'fixed' and adjust top/right.
              right: showNavigationPane ? '210px' : '0px', // Adjusted to avoid overlap and sit next to the pane.
                                                           // 200px (pane width) + 10px (gap)
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
              zIndex: 999, // Ensure it's above the pane if they overlap
              transition: 'right 0.3s ease-in-out', // Smooth transition for movement
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {/* Conditional arrow rendering */}
            {showNavigationPane ? '»' : '«'}
            {/*{showNavigationPane ? <FaChevronRight /> : <FaChevronLeft />} {/* Corrected arrow direction */}
          </button>
        )}

        {/* Navigation Pane */}
        {isFullScreen && !submitted && (
          <div
            style={{
              width: showNavigationPane ? '200px' : '0', // Control width based on state
              background: '#fff',
              padding: showNavigationPane ? '10px' : '0',
              borderRadius: '8px',
              boxShadow: showNavigationPane ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
              overflow: 'hidden', // Hide content when collapsed
              transition: 'width 0.3s ease-in-out, padding 0.3s ease-in-out',
              position: 'fixed', // Keep fixed to the viewport if it's meant to be a persistent sidebar
              right: '20px',      // Stays on the right side of the screen
              top: '100px',        // Adjust top to clear header and be below fixed elements
              maxHeight: 'calc(100vh - 120px)', // Max height to fit viewport
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0,
              zIndex: 900, // Make sure it's below the toggle button (999) but above main content
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
                    overflowY: 'auto', // Scroll if many questions
                    paddingRight: '5px',
                    flexGrow: 1,
                  }}>
                  {mcqs.map((mcq, index) => ( // Use mcq.id for key
                    <button
                      key={mcq.id}
                      onClick={() => handleGoToQuestion(index)}
                      style={{
                        width: '40px',
                        height: '40px',
                        // Conditional background color based on answer status and current question
                        backgroundColor: userAnswers[index] ? '#10b981' : (index === currentQuestionIndex ? '#6366f1' : '#ef4444'),
                        color: 'white',
                        border: index === currentQuestionIndex ? '2px solid #000' : 'none',
                        borderRadius: '50%',
                        cursor: submitted || !isFullScreen ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        opacity: submitted || !isFullScreen ? 0.5 : 1,
                        pointerEvents: submitted || !isFullScreen ? 'none' : 'auto',
                        // --- Centering the number inside the circle ---
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // --- End Centering ---
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

      {/* Navigation Buttons (Previous, Next) and Submit Quiz Button */}
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
          {/* Submit Quiz button remains here */}
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

          {/* Score-based messages */}
          {getScorePercentage() >= 75 ? (
            <div style={{
              backgroundColor: '#d1fae5',
              border: '1px solid #34d399',
              color: '#065f46',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}>    <p>🎉 Congratulations! You can proceed with the specified learning path.</p>
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
              <button
                onClick={handleRetakeQuiz} // Call the delegated restart handler
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
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
