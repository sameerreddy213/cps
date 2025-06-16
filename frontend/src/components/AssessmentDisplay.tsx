/* AUTHOR - SHREYAS MENE (CREATED ON 13/06/2025) */
/*UPDATED BY NIKITA S RAJ KAPINI ON 16/06/2025*/

import React, { useState, useEffect } from 'react';
import './AssessmentDisplay.css';

interface Topic {
  id: number;
  name: string;
  category: string;
}

interface Question {
  id: number;
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer?: string[];
}

interface AssessmentDisplayProps {
  selectedTopics: Topic[];
  shouldGenerateAssessment: boolean;
  onAssessmentGenerated: () => void;
}

const AssessmentDisplay: React.FC<AssessmentDisplayProps> = ({
  selectedTopics,
  shouldGenerateAssessment,
  onAssessmentGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [targetTopic, setTargetTopic] = useState<string>('');

  useEffect(() => {
    const fetchAssessment = async () => {
      const topic = selectedTopics[0]?.name;
      if (!topic) return;

      setTargetTopic(topic);
      setLoading(true);
      setShowResults(false);
      setUserAnswers({});
      setAssessmentStarted(true);

      try {
        const response = await fetch('http://localhost:5000/api/assessment/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: topic }), // ✅ match backend format
        });

        const data = await response.json();

        const parsedQuestions: Question[] = data.questions.map((q: any, index: number) => {
          let frontendType: Question['type'];
          switch (q.type) {
            case 'single-correct-mcq':
              frontendType = 'single-choice';
              break;
            case 'multiple-correct-mcq':
              frontendType = 'multiple-choice';
              break;
            case 'true-false':
              frontendType = 'true-false';
              break;
            default:
              frontendType = 'short-answer';
          }

          return {
            id: index + 1,
            type: frontendType,
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
          };
        });

        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error generating assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shouldGenerateAssessment && selectedTopics.length > 0) {
      fetchAssessment();
    } else if (!shouldGenerateAssessment && !assessmentStarted) {
      setQuestions([]);
      setUserAnswers({});
      setShowResults(false);
    }
  }, [shouldGenerateAssessment, selectedTopics]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: [answer],
    }));
  };

  const handleMultipleChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      return {
        ...prev,
        [questionId]: currentAnswers.includes(answer)
          ? currentAnswers.filter((a) => a !== answer)
          : [...currentAnswers, answer],
      };
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
    setAssessmentStarted(false);
    onAssessmentGenerated();
  };

  const handleRetry = () => {
    setShowResults(false);
    setUserAnswers({});
    setAssessmentStarted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    questions.forEach((q) => {
      if (q.correctAnswer && userAnswers[q.id]) {
        total++;
        const correctSet = new Set(q.correctAnswer);
        const answerSet = new Set(userAnswers[q.id]);
        const isCorrect =
          correctSet.size === answerSet.size &&
          [...correctSet].every((ans) => answerSet.has(ans));
        if (isCorrect) correct++;
      }
    });

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  return (
    <div className="assessment-display">
      <div className="assessment-header">
        <h2>Assessment</h2>
        <p className="selected-topic">
          {targetTopic ? `Target Topic: ${targetTopic}` : 'No topic selected'}
        </p>
      </div>

      {!shouldGenerateAssessment && !assessmentStarted ? (
        <div className="placeholder-content">
          <div className="placeholder-icon">📝</div>
          <h3>Assessment will appear here</h3>
          <p>Select your topics and click "Generate Assessment" to begin.</p>
        </div>
      ) : loading ? (
        <div className="assessment-content">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Generating your assessment...</p>
          </div>
        </div>
      ) : (
        <div className="assessment-content">
          <div className="questions-container">
            {questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <h3>Question {index + 1}</h3>
                <p>{q.question}</p>

                {(q.type === 'single-choice' || q.type === 'true-false') && (
                  <div className="options-grid">
                    {(q.options || ['True', 'False']).map((option, i) => (
                      <label key={i} className="option-label">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={userAnswers[q.id]?.includes(option) || false}
                          onChange={() => handleAnswerChange(q.id, option)}
                          disabled={showResults}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'multiple-choice' && (
                  <div className="options-grid">
                    {(q.options || []).map((option, i) => (
                      <label key={i} className="option-label">
                        <input
                          type="checkbox"
                          name={`question-${q.id}-${i}`}
                          value={option}
                          checked={userAnswers[q.id]?.includes(option) || false}
                          onChange={() => handleMultipleChange(q.id, option)}
                          disabled={showResults}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'short-answer' && (
                  <textarea
                    className="short-answer-input"
                    placeholder="Type your answer here..."
                    value={userAnswers[q.id]?.[0] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    disabled={showResults}
                  />
                )}
              </div>
            ))}
          </div>

          {questions.length > 0 && !showResults && (
            <button className="submit-button" onClick={handleSubmit}>
              Submit Assessment
            </button>
          )}

          {showResults && (
            <div className="results-container">
              <h3>Assessment Results</h3>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{calculateScore()}%</span>
                </div>
                <p>Score</p>
              </div>
              <button className="retry-button" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentDisplay;

