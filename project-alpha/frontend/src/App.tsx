import { useState } from 'react';
import axios from 'axios';
import Graph from './components/Graph'; // Assuming this path is correct
import Quiz from './components/Quiz';     // Assuming this path is correct
import { v4 as uuidv4 } from 'uuid';      // Import uuid for generating unique quiz IDs

// Type definitions (ensure they match your backend's types)
type PrereqData = {
  topic: string;
  prerequisites: string[];
};

type MCQ = {
  id: string; // Crucial: Each MCQ must have a unique ID, matching Quiz.tsx and mcqGenerator.ts
  topic: string;
  question: string;
  options: string[];
  answer: string;
};

function App() {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState<PrereqData | null>(null); // Stores prerequisites data
  const [mcqs, setMcqs] = useState<MCQ[] | null>(null); // Stores fetched MCQs
  const [loading, setLoading] = useState(false); // For initial prerequisite generation
  const [isAcknowledged, setIsAcknowledged] = useState(false); // Checkbox state
  const [quizLoading, setQuizLoading] = useState(false); // For MCQ fetching
  // This unique ID is crucial. When it changes, Quiz.tsx knows it's a new quiz instance.
  const [selectedConcept, setSelectedConcept] = useState('');
  const [conceptSummary, setConceptSummary] = useState('');
  const [showGraph, setShowGraph] = useState(true);

  const [currentQuizSessionId, setCurrentQuizSessionId] = useState<string>(uuidv4());

  // Function to fetch prerequisites from the backend
  const handleSubmit = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic.');
      return;
    }
    setLoading(true);
    setMcqs(null); // Clear any existing MCQs
    setData(null); 
    setSelectedConcept('');
    setConceptSummary('');
    setShowGraph(true);// Clear previous prerequisite data
    setIsAcknowledged(false); // Reset acknowledgment for a new topic search
    setCurrentQuizSessionId(uuidv4()); // Generate a brand new session ID for a fresh start with a new topic
    try {
      const res = await axios.post('http://localhost:5000/api/prerequisites', { topic });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching prerequisites:', err);
      alert('Failed to fetch prerequisites. Please check server and topic.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch MCQs from the backend
  // 'resetCache' flag tells the backend to clear its in-memory question cache for this set of topics
  const fetchMCQs = async (resetCache: boolean = false) => {
    // Only proceed if prerequisites data is available and acknowledged (unless it's a reset)
    if (!data || (!isAcknowledged && !resetCache)) {
      if (!data) console.warn("No prerequisite data to fetch MCQs for.");
      if (!isAcknowledged && !resetCache) console.warn("Prerequisites not acknowledged yet.");
      return;
    }

    setQuizLoading(true);
    setMcqs(null); // Clear current MCQs while loading new ones
    // Generate a new quiz ID for the Quiz component.
    // This is the signal that forces Quiz.tsx to fully reset its state.
    setCurrentQuizSessionId(uuidv4());

    try {
      const res = await axios.post('http://localhost:5000/api/prerequisites/mcq', {
        prerequisites: data.prerequisites,
        restart: resetCache, // Pass the restart flag to your backend
      });
      setMcqs(res.data); // Update MCQs with the new set from backend
      console.log("MCQs fetched successfully. Current quiz ID:", currentQuizSessionId);
    } catch (err) {
      console.error('Error fetching MCQs:', err);
      alert('Failed to fetch quiz questions. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

   const handleConceptClick = async (concept: string) => {
    setSelectedConcept(concept);
    setConceptSummary('⏳ Loading...');
    setShowGraph(false);
    try {
      const res = await axios.post('http://localhost:5000/api/topic-summary', {
        topic: concept,
        mainTopic: data?.topic || '',
      });
      setConceptSummary(res.data.summary);
    } catch (err) {
      console.error('Error fetching summary', err);
      setConceptSummary('⚠️ Failed to load summary.');
    }
  };
  // This function is passed to the Quiz component and called when the user clicks "Restart Quiz"
  const handleQuizRestart = async () => {
    console.log("App.tsx: Quiz restart requested by Quiz component.");
    // Reset acknowledgment so user must acknowledge again if they navigate back to prerequisites
    setIsAcknowledged(false);
    // Call fetchMCQs with 'true' to signal backend to get fresh questions
    await fetchMCQs(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f3f4f6, #e0e7ff)',
      padding: '20px',
    }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: '#4f46e5',
        color: '#fff',
        padding: '24px 32px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>📘 Smart Learning Path Recommender</h1>
        <p style={{ marginTop: '8px', fontSize: '16px', opacity: 0.9 }}>
          Get the best prerequisites before diving into any topic.
        </p>
      </header>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '30px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}>
        {/* LEFT SIDE: Topic Input & Prerequisites */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            Enter a Topic
          </h2>

          {/* SUGGESTIONS */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px', fontWeight: 600 }}>Try one of these:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Machine Learning', 'Data Structures', 'Cloud Computing', 'Blockchain', 'AI Ethics'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e0e7ff',
                    border: '1px solid #6366f1',
                    color: '#3730a3',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: '0.2s ease-in-out'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FIELD & GENERATE BUTTON */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Deep Learning"
              style={{
                flexGrow: 1,
                padding: '14px',
                fontSize: '16px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                outlineColor: '#6366f1'
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: '14px 22px',
                fontSize: '16px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Generate'}
            </button>
          </div>

          {/* LOADER FOR PREREQUISITES */}
          {loading && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className="loader"></div>
              <p>Generating personalized recommendations...</p>
            </div>
          )}

          {/* PREREQUISITES LIST */}
          {data && (
            <>
              <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '20px', fontWeight: 600 }}>
                Prerequisites for <span style={{ color: '#6366f1' }}>{data.topic}</span>
              </h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
  {data.prerequisites.map((item, i) => (
    <li
      key={i}
      onClick={() => handleConceptClick(item)}
      title="Click to explore this topic"
      style={{
        color: '#1f2937',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '6px',
        textDecoration: selectedConcept === item ? 'underline' : 'none',
        fontWeight: selectedConcept === item ? 'bold' : 'normal',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
        e.currentTarget.style.color = '#4f46e5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration =
          selectedConcept === item ? 'underline' : 'none';
        e.currentTarget.style.color = '#1f2937';
      }}
    >
      {item}
    </li>
  ))}
</ul>

              {/* CHECKBOX AND START QUIZ BUTTON (only visible if MCQs haven't been loaded yet for current data) */}
              {!mcqs && (
                <>
                  <label style={{ display: 'flex', alignItems: 'center', marginTop: '20px', color: '#374151' }}>
                    <input
                      type="checkbox"
                      checked={isAcknowledged}
                      onChange={(e) => setIsAcknowledged(e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    I have thoroughly reviewed all prerequisites and am ready for the test
                  </label>
                  <button
                    onClick={() => fetchMCQs(false)} // Initial fetch: no cache reset needed
                    style={{
                      marginTop: '10px',
                      padding: '12px 20px',
                      backgroundColor: '#10b981',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isAcknowledged && !quizLoading ? 'pointer' : 'not-allowed',
                      opacity: isAcknowledged && !quizLoading ? 1 : 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    disabled={!isAcknowledged || quizLoading}
                  >
                    {quizLoading ? (
                      <>
                        <span className="loader" style={{ border: '3px solid #fff', borderTop: '3px solid transparent', width: '16px', height: '16px' }}></span>
                        Starting...
                      </>
                    ) : (
                      'Start Quiz on Prerequisites'
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>

         {/* RIGHT SIDE – Graph or Concept Summary */}
        <div style={{ flex: 1.5, minWidth: '400px', minHeight: '500px' }}>
          {showGraph && data?.topic && data?.prerequisites && (
            <div style={{
              backgroundColor: '#eef2ff',
              border: '2px dashed #6366f1',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#4f46e5', marginBottom: '12px' }}>
                📈 Prerequisite Graph for {data.topic}
              </h2>
              <Graph topic={data.topic} prerequisites={data.prerequisites} />
            </div>
          )}

          {!showGraph && selectedConcept && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '20px', color: '#92400e', marginBottom: '12px' }}>
                📘 Main Concepts of {selectedConcept}
              </h2>
              <p style={{ color: '#374151', whiteSpace: 'pre-wrap' }}>
                {conceptSummary}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MCQ QUIZ SECTION */}
      <div style={{ marginTop: '40px' }}>
        {mcqs && (
          <Quiz
            mcqs={mcqs}
            quizId={currentQuizSessionId} // Pass the unique session ID to Quiz
            onRestartQuiz={handleQuizRestart} // Pass the restart handler to Quiz
          />
        )}
      </div>

      {/* GLOBAL CSS FOR SPINNER */}
      <style>{`
        .loader {
          border: 5px solid #e0e7ff;
          border-top: 5px solid #6366f1;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
